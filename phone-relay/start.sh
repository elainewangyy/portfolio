#!/usr/bin/env bash
# Starts the 💌 relay on the phone: the server, plus a Cloudflare Tunnel
# that gives it a public https address. If either one stops, both are
# restarted after a few seconds. Run with:  bash start.sh
cd "$(dirname "$0")" || exit 1

[ -f config.env ] || { echo "No config.env yet: cp config.example.env config.env, then fill it in"; exit 1; }
set -a; . ./config.env; set +a

# Keep Android from putting Termux to sleep.
command -v termux-wake-lock >/dev/null && termux-wake-lock

# The AI helper needs its library once.
if [ -n "$ANTHROPIC_API_KEY" ] && [ ! -d node_modules/@anthropic-ai/sdk ]; then
  npm install --omit=dev --no-audit --no-fund
fi

PORT="${PORT:-8787}"

while true; do
  rm -f tunnel.log
  if [ -n "$TUNNEL_TOKEN" ]; then
    # Named tunnel: fixed address, set PUBLIC_URL in config.env to match.
    cloudflared tunnel --no-autoupdate run --token "$TUNNEL_TOKEN" >tunnel.log 2>&1 &
  else
    # Quick tunnel: free, but a new random address each time.
    cloudflared tunnel --no-autoupdate --url "http://127.0.0.1:$PORT" >tunnel.log 2>&1 &
    PUBLIC_URL=""
    for _ in $(seq 1 60); do
      PUBLIC_URL=$(grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' tunnel.log 2>/dev/null | head -n 1)
      [ -n "$PUBLIC_URL" ] && break
      sleep 1
    done
    [ -z "$PUBLIC_URL" ] && echo "Tunnel didn't give an address — see tunnel.log"
  fi
  export PUBLIC_URL
  echo "$(date '+%F %T') starting — public address: ${PUBLIC_URL:-none}"

  node server.mjs &

  wait -n                      # whichever stops first…
  echo "$(date '+%F %T') something stopped — restarting in 5s"
  kill $(jobs -p) 2>/dev/null  # …stop the other one too
  wait
  sleep 5
done
