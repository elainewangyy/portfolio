# 💌 网站留言 → 我的 Telegram（跑在旧一加 9RT 上）

网站右下角的 💌 小窗里有人留言 → 这台旧手机收到 → 转给我的 Telegram 机器人 `@elaineyyw_bot`。
我在 Telegram 里**回复**那条消息 → 回复出现在对方的网页小窗里。

```
访客网页 💌 ──https──▶ Cloudflare 隧道 ──▶ 一加 9RT · Termux · server.mjs ──▶ Telegram（我）
          ◀────────── 我在 Telegram「回复」，网页每几秒取一次 ◀──────────────┘
```

- **token 只放在手机上的 `config.env` 里**，这个文件不会上传到 GitHub。
- 网站从根目录的 `chat-endpoint.json` 读手机的地址；里面是空的时候，网页上不显示 💌。

---

## 一、手机上装好（只做一次）

1. 装 **F-Droid**（f-droid.org），再从 F-Droid 里装 **Termux** 和 **Termux:Boot**。
   （不要用 Play 商店的 Termux，那个太旧了。）
2. 打开 Termux，一行一行输入：

   ```sh
   pkg update && pkg upgrade -y
   pkg install -y nodejs git cloudflared
   git clone --depth 1 https://github.com/elainewangyy/portfolio.git
   cd portfolio/phone-relay
   cp config.example.env config.env
   nano config.env
   ```

   > 如果这些改动还没合并进 main，clone 那行换成：
   > `git clone --depth 1 -b claude/blissful-cori-56oxcp https://github.com/elainewangyy/portfolio.git`

3. 在 nano 里把 BotFather 给的 token 填在 `BOT_TOKEN=` 后面（`CHAT_ID` 已经填好了）。
   按 `Ctrl+O` 回车保存，`Ctrl+X` 退出。（Termux 键盘上方那排键里有 CTRL。）
4. 启动：

   ```sh
   bash start.sh
   ```

   几秒后 Telegram 会收到：**🐹 网站小窗上线了，地址：https://xxxx.trycloudflare.com**

## 二、告诉网站这个地址

1. 在 GitHub 打开仓库里的 `chat-endpoint.json`，点 ✏️ 编辑。
2. 改成（换成你收到的地址）：

   ```json
   { "url": "https://xxxx.trycloudflare.com" }
   ```

3. Commit。等 1～5 分钟网站更新，右下角就会出现 💌。

> 免费隧道的地址**每次重启都会变**。手机每次上线都会在 Telegram 告诉你新地址，再改一次这个文件就行。
> 不想每次改：见下面「固定地址」。

## 三、让它一直开着

一加的系统很爱杀后台，这几步都要做：

- **设置 → 电池 → 更多 → 应用耗电管理 → Termux**：允许后台运行、允许自启动，关掉「智能限制」。Termux:Boot 也一样设置。
- 在多任务界面把 Termux **下拉锁住**。
- `start.sh` 会自动执行 `termux-wake-lock`，通知栏会出现 Termux 常驻通知，**别划掉**。
- **开机自动启动**：先打开一次 Termux:Boot 应用，然后在 Termux 里输入：

  ```sh
  mkdir -p ~/.termux/boot
  cat > ~/.termux/boot/start-relay <<'EOF'
  #!/data/data/com.termux/files/usr/bin/sh
  termux-wake-lock
  cd ~/portfolio/phone-relay && bash start.sh >> relay.log 2>&1
  EOF
  chmod +x ~/.termux/boot/start-relay
  ```

- 一直插着充电，放在通风的地方，别闷在被子里。电池鼓起来就别再用了。

## 四、平时怎么用

在 Telegram 里：

| 做什么 | 怎么做 |
|---|---|
| 回复访客 | 长按那条「💌 网站来信」→ **回复** → 打字发送。发出去会出现 👍 |
| 看状态 | 发 `/status` |
| 看当前地址 | 发 `/link` |
| 开 / 关大牛自动回复 | 发 `/ai on` 或 `/ai off` |
| 把某段对话交还给大牛 | 回复那位访客的消息，内容发 `/ai` |

每位访客有个 4 位编号（比如 `#a1b2`），方便分清谁是谁。
访客关掉网页也没关系，之后再打开就能看到你的回复（存在 TA 自己的浏览器里）。

**更新代码：**`cd ~/portfolio && git pull`，然后在 Termux 里 `Ctrl+C` 停掉，再 `bash phone-relay/start.sh`。

## 五、可选：让「大牛」AI 先替你回

1. 去 console.anthropic.com 注册，充一点钱，创建一个 API key。
2. 填进 `config.env` 的 `ANTHROPIC_API_KEY=`。
3. 重新 `bash start.sh`（第一次会自动 `npm install`，要一两分钟）。

之后访客一留言，大牛会用 TA 的语言简短回一两句（只说网站上有的信息，不替你答应任何事），并把回复也发给你看。
**你一回复某位访客，大牛就不再回那个人**。每天最多回 `AI_DAILY_LIMIT` 次（默认 200），防止账单变大。

## 六、可选：固定地址（不用每次改 chat-endpoint.json）

需要一个自己的域名（大约 10 美元/年），托管在 Cloudflare：

1. Cloudflare 后台 → **Zero Trust → Networks → Tunnels → Create a tunnel** → 选 Cloudflared。
2. 复制它给的 token（`eyJ...` 很长一串）填到 `config.env` 的 `TUNNEL_TOKEN=`。
3. 在 Public Hostname 里加一条：`chat.你的域名.com` → `HTTP` → `localhost:8787`。
4. `config.env` 里填 `PUBLIC_URL=https://chat.你的域名.com`。
5. `chat-endpoint.json` 改成这个地址，以后就再也不用改了。

## 出问题了？

- **网页显示「Elaine 的手机睡着了」**：手机上的 Termux 是不是被杀了？打开 Termux 看看，或者重新 `bash start.sh`。
- **Telegram 收不到**：看 Termux 里有没有 `Telegram: can't connect`。手机要能连上 Telegram。
  如果需要代理，在 `config.env` 里加两行（端口换成你代理的）：
  `HTTPS_PROXY=http://127.0.0.1:7890` 和 `NODE_USE_ENV_PROXY=1`（需要 Node 24 以上，`node -v` 查看）。
- **隧道没给地址**：看 `phone-relay/tunnel.log`。
- **token 泄露了**：@BotFather → `/mybots` → 选机器人 → API Token → Revoke，再把新 token 填进 `config.env`。

## 文件说明

| 文件 | 作用 |
|---|---|
| `server.mjs` | 主程序：接网页留言、转 Telegram、收你的回复、（可选）AI 回复 |
| `start.sh` | 启动隧道和主程序，挂了自动重启 |
| `config.example.env` | 配置模板；复制成 `config.env` 再填 |
| `config.env` | 你的 token 等配置（只在手机上，不上传） |
| `data.json` | 对话记录（只在手机上，30 天没动静的自动删掉） |
| `../chat.js`、`../chat-endpoint.json` | 网站那一侧的 💌 小窗 |
