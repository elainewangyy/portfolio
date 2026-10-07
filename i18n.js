/* =============================================================
   I18N.JS  —  the whole site in English, 简体中文 or 繁體中文
   =============================================================
   The language picker in the menu bar (🌐 EN / 简体 / 繁體) runs
   this. The pages are written in English; when Chinese is chosen,
   every bit of English on the page that's listed in WORDS below is
   swapped for its Chinese version — text, photo descriptions (alt),
   button labels for screen readers, and the mouse labels. The page's
   lang changes too, so Narration and screen readers switch voice.
   The choice is remembered on every page.

   To fix a translation: find the English sentence below and change
   the Chinese next to it — [Simplified, Traditional]. If you change
   the English on a page, change it here too (it has to match
   exactly), or that sentence stays in English.

   The Simplified Chinese was written for me by Claude, from my own
   English; the Traditional was converted from it with OpenCC
   (Taiwan wording). Text that still says REPLACE isn't translated
   yet — it will be once I've written it.
   ============================================================= */

(function () {
  const WORDS = {
    "Elaine — Portfolio": ["Elaine — 作品集", "Elaine — 作品集"],
    "Desk Pet — Elaine": ["桌宠 — Elaine", "桌寵 — Elaine"],
    "Generating Warm-up Games — Elaine": ["热身游戏生成器 — Elaine", "熱身遊戲生成器 — Elaine"],
    "Skip to content": ["跳到正文", "跳到正文"],
    "Work": ["作品", "作品"],
    "About": ["关于", "關於"],
    "Open menu": ["打开菜单", "開啟選單"],
    "Close menu": ["关闭菜单", "關閉選單"],
    "Language": ["语言", "語言"],
    "<span aria-hidden=\"true\">🔊</span> Narration": ["<span aria-hidden=\"true\">🔊</span> 旁白", "<span aria-hidden=\"true\">🔊</span> 旁白"],
    "Speed": ["语速", "語速"],
    "<span aria-hidden=\"true\">♿</span><span class=\"access-btn__more\"> Accessibility</span>": ["<span aria-hidden=\"true\">♿</span><span class=\"access-btn__more\"> 无障碍</span>", "<span aria-hidden=\"true\">♿</span><span class=\"access-btn__more\"> 無障礙</span>"],
    "<span aria-hidden=\"true\">🌽</span> Feed<span class=\"feed-btn__more\"> Da Niu</span>": ["<span aria-hidden=\"true\">🌽</span> 喂<span class=\"feed-btn__more\">大牛</span>", "<span aria-hidden=\"true\">🌽</span> 餵<span class=\"feed-btn__more\">大牛</span>"],
    "Hide the hamster": ["藏起仓鼠", "藏起倉鼠"],
    "Bring the hamster back": ["把仓鼠叫回来", "把倉鼠叫回來"],
    "Pause animations": ["暂停动画", "暫停動畫"],
    "Play animations": ["播放动画", "播放動畫"],
    "Da Niu the hamster, from my Desk Pet project. Press to say hello.": ["仓鼠大牛，来自我的桌宠项目。按一下和它打招呼。", "倉鼠大牛，來自我的桌寵專案。按一下和它打招呼。"],
    "← Back to my work": ["← 返回我的作品", "← 返回我的作品"],
    "Open full screen ↗": ["全屏打开 ↗", "全螢幕開啟 ↗"],
    "🔊 Read aloud": ["🔊 朗读", "🔊 朗讀"],
    "📂 Open": ["📂 打开", "📂 開啟"],
    "♿ Turn on": ["♿ 开启", "♿ 開啟"],
    "✋ Drag": ["✋ 拖动", "✋ 拖動"],
    "✋ Drag me": ["✋ 拖我", "✋ 拖我"],
    "🔍 Zoom": ["🔍 放大", "🔍 放大"],
    "✋ Pick me up": ["✋ 抱我起来", "✋ 抱我起來"],
    "Welcome": ["欢迎", "歡迎"],
    "My work": ["我的作品", "我的作品"],
    "About me": ["关于我", "關於我"],
    "Accessibility": ["无障碍", "無障礙"],
    "Hi, I'm Elaine.": ["你好，我是 Elaine。", "你好，我是 Elaine。"],
    "that's me!": ["这就是我！", "這就是我！"],
    "Close — go to My work": ["关闭——去看我的作品", "關閉——去看我的作品"],
    "Minimise": ["最小化", "最小化"],
    "Maximise — go to About me": ["最大化——去看关于我", "最大化——去看關於我"],
    "Open hello.txt again": ["重新打开 hello.txt", "重新開啟 hello.txt"],
    "✕ My work": ["✕ 我的作品", "✕ 我的作品"],
    "− Minimise": ["− 最小化", "− 最小化"],
    "⤢ About me": ["⤢ 关于我", "⤢ 關於我"],
    "Da Niu says: <span lang=\"zh-Hans\">今天也要加油哦！</span> You've got this today!": ["大牛说：今天也要加油哦！<span lang=\"en\">You've got this today!</span>", "大牛說：今天也要加油哦！<span lang=\"en\">You've got this today!</span>"],
    "— Da Niu": ["— 大牛", "— 大牛"],
    "今天也要加油哦！": ["今天也要加油哦！", "今天也要加油哦！"],
    "记得喝口水哦": ["记得喝口水哦", "記得喝口水哦"],
    "让眼睛休息一下吧": ["让眼睛休息一下吧", "讓眼睛休息一下吧"],
    "我一直在这儿陪着你": ["我一直在这儿陪着你", "我一直在這兒陪著你"],
    "嘿嘿，最喜欢你了": ["嘿嘿，最喜欢你了", "嘿嘿，最喜歡你了"],
    "psst… the hamster down there is real — try dragging it!": ["嘘……下面那只仓鼠是真的——试试拖动它！", "噓……下面那隻倉鼠是真的——試試拖動它！"],
    "Desk Pet <span lang=\"zh-Hans\">桌宠</span>": ["桌宠 <span lang=\"en\">Desk Pet</span>", "桌寵 <span lang=\"en\">Desk Pet</span>"],
    "Personal project": ["个人项目", "個人專案"],
    "Desktop app": ["桌面应用", "桌面應用"],
    "a gift for a friend ♥": ["送给朋友的礼物 ♥", "送給朋友的禮物 ♥"],
    "Generating Warm‑up Games": ["热身游戏生成器", "熱身遊戲生成器"],
    "DSDN142 Project 2": ["DSDN142 项目二", "DSDN142 專案二"],
    "Interactive web": ["互动网页", "互動網頁"],
    "Da Niu, a cut-out golden hamster, sitting up and looking left and right": ["大牛，一只抠图的金色仓鼠，坐起来左右张望", "大牛，一隻摳圖的金色倉鼠，坐起來左右張望"],
    "Start screen reading “LET'S GAME” in rainbow letters on a pastel gradient": ["开始画面：粉彩渐变背景上写着彩虹色的“LET'S GAME”", "開始畫面：粉彩漸變背景上寫著彩虹色的“LET'S GAME”"],
    "I'm interested in how people interact with digital products and how design can make information easier to understand and access. I enjoy exploring ideas, solving problems, and creating thoughtful user experiences that are both functional and engaging.": ["我感兴趣的是人们如何与数字产品互动，以及设计如何让信息更容易理解和获取。我喜欢探索想法、解决问题，创造既实用又有吸引力、用心设计的用户体验。", "我感興趣的是人們如何與數位產品互動，以及設計如何讓資訊更容易理解和獲取。我喜歡探索想法、解決問題，創造既實用又有吸引力、用心設計的使用者體驗。"],
    "Through my projects, I aim to combine creativity with user-centred thinking, exploring how technology and design can make everyday experiences better.": ["在我的项目中，我希望把创意和以用户为中心的思考结合起来，探索科技和设计如何让日常体验变得更好。", "在我的專案中，我希望把創意和以使用者為中心的思考結合起來，探索科技和設計如何讓日常體驗變得更好。"],
    "Me under a willow tree in a park, in a bandana and black pinafore, pulling a surprised face with one hand raised": ["我在公园的柳树下，戴着头巾、穿黑色背带裙，举起一只手做出惊讶的表情", "我在公園的柳樹下，戴著頭巾、穿黑色揹帶裙，舉起一隻手做出驚訝的表情"],
    "Me in a pink bucket hat and navy dress, posing beside LinaBell, a pink fox character with a big bow": ["我戴着粉色渔夫帽、穿藏青色连衣裙，和玲娜贝儿合影，她是一只戴着大蝴蝶结的粉色狐狸", "我戴著粉色漁夫帽、穿藏青色連衣裙，和玲娜貝兒合影，她是一隻戴著大蝴蝶結的粉色狐狸"],
    "Me, in motion: photos and short videos of me among some of my photos": ["动起来的我：我的照片和小视频，夹在我拍的其他照片中间", "動起來的我：我的照片和小影片，夾在我拍的其他照片中間"],
    "Video, no sound: me laughing cheek to cheek with LinaBell": ["视频，无声音：我和玲娜贝儿脸贴脸地笑", "影片，無聲音：我和玲娜貝兒臉貼臉地笑"],
    "Video, no sound: a selfie of me with a sparkly face filter": ["视频，无声音：我用闪闪亮亮的脸部滤镜自拍", "影片，無聲音：我用閃閃亮亮的臉部濾鏡自拍"],
    "Parallax style based on <a href=\"https://skiper-ui.com\" target=\"_blank\" rel=\"noopener\">Skiper UI</a> (skiper30)": ["视差样式参考 <a href=\"https://skiper-ui.com\" target=\"_blank\" rel=\"noopener\">Skiper UI</a>（skiper30）", "視差樣式參考 <a href=\"https://skiper-ui.com\" target=\"_blank\" rel=\"noopener\">Skiper UI</a>（skiper30）"],
    "What I work with": ["我的技能", "我的技能"],
    "play around!": ["玩一玩！", "玩一玩！"],
    "🧭 User flows": ["🧭 用户流程", "🧭 使用者流程"],
    "👆 Interaction design": ["👆 交互设计", "👆 互動設計"],
    "🖥️ Electron apps": ["🖥️ Electron 应用", "🖥️ Electron 應用"],
    "🤖 AI prompting": ["🤖 AI 提示词", "🤖 AI 提示詞"],
    "🐹 Desktop pets": ["🐹 桌面宠物", "🐹 桌面寵物"],
    "📷 Photography": ["📷 摄影", "📷 攝影"],
    "🧸 Doll photography": ["🧸 娃娃摄影", "🧸 娃娃攝影"],
    "♿ Accessibility": ["♿ 无障碍设计", "♿ 無障礙設計"],
    "🎬 Video editing": ["🎬 视频剪辑", "🎬 影片剪輯"],
    "💅 Nail art": ["💅 美甲", "💅 美甲"],
    "💖 Oshikatsu <span lang=\"ja\">推し活</span>": ["💖 追星 <span lang=\"ja\">推し活</span>", "💖 追星 <span lang=\"ja\">推し活</span>"],
    "Camera roll": ["相册", "相簿"],
    "My photos, sorted into four folders — open one up.": ["我的照片分成了四个文件夹——打开一个看看吧。", "我的照片分成了四個資料夾——打開一個看看吧。"],
    "ball-jointed dolls · 10 photos": ["球关节人偶 · 10 张照片", "球關節人偶 · 10 張照片"],
    "Photography": ["摄影", "攝影"],
    "portraits · 5 photos": ["人像 · 5 张照片", "人像 · 5 張照片"],
    "推し活": ["推し活", "推し活"],
    "oshikatsu · 9 photos": ["追星 · 9 张照片", "追星 · 9 張照片"],
    "美甲": ["美甲", "美甲"],
    "nail art · 12 photos": ["美甲 · 12 张照片", "美甲 · 12 張照片"],
    "Close folder ✕": ["关闭文件夹 ✕", "關閉資料夾 ✕"],
    "<span lang=\"ja\">推し活</span> <small>oshikatsu</small>": ["<span lang=\"ja\">推し活</span> <small>追星</small>", "<span lang=\"ja\">推し活</span> <small>追星</small>"],
    "<span lang=\"zh-Hans\">美甲</span> <small>nail art</small>": ["美甲", "美甲"],
    "BJD photos": ["BJD 照片", "BJD 照片"],
    "Photography: portraits": ["摄影：人像", "攝影：人像"],
    "Oshikatsu photos": ["追星照片", "追星照片"],
    "Nail art photos": ["美甲照片", "美甲照片"],
    "Photo viewer": ["照片查看器", "照片檢視器"],
    "Previous photo": ["上一张", "上一張"],
    "Next photo": ["下一张", "下一張"],
    "Close photo viewer": ["关闭照片查看器", "關閉照片檢視器"],
    "Close-up of a doll with orange hair and blue eyes in a blue knitted hoodie, among frosted white branches": ["娃娃的特写：橙色头发、蓝眼睛，穿着蓝色针织连帽衫，身边是结霜的白色树枝", "娃娃的特寫：橙色頭髮、藍眼睛，穿著藍色針織連帽衫，身邊是結霜的白色樹枝"],
    "The orange-haired doll's face inside a blue hood, frosted white branches behind": ["橙发娃娃的脸藏在蓝色兜帽里，背后是结霜的白色树枝", "橙髮娃娃的臉藏在藍色兜帽裡，背後是結霜的白色樹枝"],
    "The orange-haired doll in a blue hood, framed by blue roses and green leaves": ["戴蓝色兜帽的橙发娃娃，被蓝玫瑰和绿叶围绕", "戴藍色兜帽的橙髮娃娃，被藍玫瑰和綠葉圍繞"],
    "The orange-haired doll in a blue hoodie with an embroidered Christmas tree, among blue roses": ["橙发娃娃穿着绣有圣诞树的蓝色连帽衫，置身蓝玫瑰之间", "橙髮娃娃穿著繡有聖誕樹的藍色連帽衫，置身藍玫瑰之間"],
    "The orange-haired doll in the Christmas-tree hoodie, sitting beside a white tree": ["穿着圣诞树连帽衫的橙发娃娃，坐在一棵白色的树旁", "穿著聖誕樹連帽衫的橙髮娃娃，坐在一棵白色的樹旁"],
    "Doll with pale blond hair in a white jumper and black-and-white checked scarf, beside a winter wreath": ["浅金色头发的娃娃，穿白色毛衣、围黑白格子围巾，旁边是冬季花环", "淺金色頭髮的娃娃，穿白色毛衣、圍黑白格子圍巾，旁邊是冬季花環"],
    "Doll with silver-blue hair in a pale blue jacket, standing in a wintry blue-and-white set": ["银蓝色头发的娃娃，穿浅蓝色外套，站在蓝白色的冬日布景里", "銀藍色頭髮的娃娃，穿淺藍色外套，站在藍白色的冬日佈景裡"],
    "Doll with orange hair in a black outfit and boots, standing in a pale room scattered with rainbow light": ["橙色头发的娃娃，穿黑色衣服和靴子，站在洒满彩虹光的浅色房间里", "橙色頭髮的娃娃，穿黑色衣服和靴子，站在灑滿彩虹光的淺色房間裡"],
    "Doll with black and green hair and cat ears in a white jumper, in the same rainbow-lit room": ["黑绿色头发、有猫耳的娃娃，穿白色毛衣，在同一个彩虹光房间里", "黑綠色頭髮、有貓耳的娃娃，穿白色毛衣，在同一個彩虹光房間裡"],
    "The cat-eared doll outdoors in a white top, with sunlit green trees behind": ["猫耳娃娃在户外，穿白色上衣，背后是阳光下的绿树", "貓耳娃娃在戶外，穿白色上衣，背後是陽光下的綠樹"],
    "A person with short blond hair and glasses climbing a pale stairway, looking up at the camera, small below a large warm-lit wall": ["一个金色短发、戴眼镜的人走上浅色楼梯，抬头看向镜头，在一大面暖光墙下显得很小", "一個金色短髮、戴眼鏡的人走上淺色樓梯，抬頭看向鏡頭，在一大面暖光牆下顯得很小"],
    "The same person walking down the stairway in sunglasses, glancing towards the camera": ["同一个人戴着墨镜走下楼梯，瞥向镜头", "同一個人戴著墨鏡走下樓梯，瞥向鏡頭"],
    "The same person in profile, walking down the stairs below a wide empty warm-toned wall": ["同一个人的侧影，走下楼梯，上方是一大片空旷的暖色墙面", "同一個人的側影，走下樓梯，上方是一大片空曠的暖色牆面"],
    "Wide view of the stairway, with the blond-haired person small in the middle of the frame": ["楼梯的远景，金发的人小小地站在画面中间", "樓梯的遠景，金髮的人小小地站在畫面中間"],
    "Two stacked frames of the same person in a grand hall under a gold mosaic ceiling and stained-glass window": ["上下两格画面：同一个人在宏伟的大厅里，头顶是金色马赛克天花板和彩色玻璃窗", "上下兩格畫面：同一個人在宏偉的大廳裡，頭頂是金色馬賽克天花板和彩色玻璃窗"],
    "Pale blue tray with a jelly dessert and a frosted cake, in front of a white Christmas tree and plush toys": ["浅蓝色托盘上放着果冻甜点和糖霜蛋糕，后面是白色圣诞树和毛绒玩具", "淺藍色托盤上放著果凍甜點和糖霜蛋糕，後面是白色聖誕樹和毛絨玩具"],
    "The same blue tray of desserts, with a hand holding a star wand and character badges": ["同一盘蓝色托盘的甜点，一只手拿着星星魔法棒和角色徽章", "同一盤藍色托盤的甜點，一隻手拿著星星魔法棒和角色徽章"],
    "Pancakes with caramel and an iced coffee, with a hand holding a Kero-chan card in front": ["淋焦糖的松饼和一杯冰咖啡，一只手在前面拿着小可（Kero-chan）卡片", "淋焦糖的鬆餅和一杯冰咖啡，一隻手在前面拿著小可（Kero-chan）卡片"],
    "The pancakes and iced coffee with a cat-eared character badge tied with a ribbon": ["松饼和冰咖啡，旁边是系着丝带的猫耳角色徽章", "鬆餅和冰咖啡，旁邊是繫著絲帶的貓耳角色徽章"],
    "Illustrated character cards laid out on a red tartan tablecloth": ["角色插画卡片摆在红色格纹桌布上", "角色插畫卡片擺在紅色格紋桌布上"],
    "A café table by the window with character cards, a pink drink, a pink bag and small plush bears": ["窗边的咖啡馆桌子上有角色卡片、一杯粉色饮料、一个粉色包和小熊玩偶", "窗邊的咖啡館桌子上有角色卡片、一杯粉色飲料、一個粉色包和小熊玩偶"],
    "Round character badges laid out on a table next to a pink drink and a basket of pine cones": ["圆形角色徽章摆在桌上，旁边是一杯粉色饮料和一篮松果", "圓形角色徽章擺在桌上，旁邊是一杯粉色飲料和一籃松果"],
    "A hand holding two dark illustrated cards in front of a wall of white and pink flowers": ["一只手在白色和粉色的花墙前拿着两张深色插画卡片", "一隻手在白色和粉色的花牆前拿著兩張深色插畫卡片"],
    "A hand holding the two dark illustrated cards against white and pink orchids": ["一只手拿着那两张深色插画卡片，背景是白色和粉色的兰花", "一隻手拿著那兩張深色插畫卡片，背景是白色和粉色的蘭花"],
    "Long almond nails, clear with red-and-gold painted fish, a gold firework and a red knot charm": ["长杏仁形透明指甲，画着红金色的鱼、金色烟花，还有一个红色中国结饰品", "長杏仁形透明指甲，畫著紅金色的魚、金色煙花，還有一個紅色中國結飾品"],
    "Nude nails with 3D charms — a Kuromi, a pink round character and a lilac one — over a black-and-white tiled floor": ["裸色指甲上有立体饰品——库洛米、一个粉色圆角色和一个淡紫色角色——下面是黑白格地砖", "裸色指甲上有立體飾品——庫洛米、一個粉色圓角色和一個淡紫色角色——下面是黑白格地磚"],
    "Short round cat-eye nails, each a different shimmer: pink, blue, copper, green-gold and amber": ["短圆形猫眼指甲，每个光泽都不同：粉、蓝、铜、绿金和琥珀色", "短圓形貓眼指甲，每個光澤都不同：粉、藍、銅、綠金和琥珀色"],
    "Sheer pink almond nails with hand-painted pink flowers and a small silver charm": ["透粉色杏仁形指甲，手绘粉色花朵和一个小银饰", "透粉色杏仁形指甲，手繪粉色花朵和一個小銀飾"],
    "Two hands together showing pink and lilac nails with silver flower charms and dangling silver chains": ["两只手放在一起，粉色和淡紫色指甲上有银色花朵饰品和垂下的银链", "兩隻手放在一起，粉色和淡紫色指甲上有銀色花朵飾品和垂下的銀鏈"],
    "Two hands with short pale pink nails, painted with pastel stripes, small hearts and a red heart": ["两只手的短浅粉色指甲，画着粉彩条纹、小爱心和一颗红心", "兩隻手的短淺粉色指甲，畫著粉彩條紋、小愛心和一顆紅心"],
    "Short milky nails with little yellow hearts, a yellow cartoon face and a striped accent nail": ["短奶白色指甲，有黄色小爱心、一个黄色卡通脸和一个条纹点缀指甲", "短奶白色指甲，有黃色小愛心、一個黃色卡通臉和一個條紋點綴指甲"],
    "Long pink nails with 3D cartoon charms: a pink face, a blue character and a doughnut": ["长粉色指甲上有立体卡通饰品：一张粉色脸、一个蓝色角色和一个甜甜圈", "長粉色指甲上有立體卡通飾品：一張粉色臉、一個藍色角色和一個甜甜圈"],
    "Short nails, each different: a blue cartoon character, gold glitter, a gold shell shape and a pink-to-white fade": ["短指甲，每个都不一样：蓝色卡通角色、金色亮片、金色贝壳造型和粉白渐变", "短指甲，每個都不一樣：藍色卡通角色、金色亮片、金色貝殼造型和粉白漸變"],
    "Long square nails in silver glitter with big pink stars": ["长方形银色亮片指甲，带大大的粉色星星", "長方形銀色亮片指甲，帶大大的粉色星星"],
    "Short round nails in smoky grey, brown and purple cat-eye shades, with a pearly silver thumb": ["短圆形指甲，烟灰、棕色和紫色的猫眼色调，拇指是珍珠银色", "短圓形指甲，煙灰、棕色和紫色的貓眼色調，拇指是珍珠銀色"],
    "A curled hand showing short lilac nails, some with silver chrome stripes": ["弯起的手展示短淡紫色指甲，有些带银色镜面条纹", "彎起的手展示短淡紫色指甲，有些帶銀色鏡面條紋"],
    "Personal project · 2026": ["个人项目 · 2026", "個人專案 · 2026"],
    "Home of <span lang=\"zh-Hans\">大牛</span> (Da Niu) — a desktop pet, made as a gift for a friend. Play with him right here: click the running wheel, open the cage, poke him, drag him around and feed him corn. Every 5 cobs he runs 2 off on the wheel, and he can only fit 20. (It starts in English; the <span lang=\"zh-Hans\">中文</span> button switches it to Chinese, like the app.)": ["这里是大牛的家——一只桌面宠物，是我送给朋友的礼物。就在这里和它玩吧：点跑轮、打开笼子、戳戳它、拖着它走，再喂它玉米。每吃 5 根玉米，它就会在跑轮上消耗掉 2 根，最多只能装下 20 根。（游戏会跟着网站切换成中文，和桌宠应用一样。）", "這裡是大牛的家——一隻桌面寵物，是我送給朋友的禮物。就在這裡和它玩吧：點跑輪、打開籠子、戳戳它、拖著它走，再餵它玉米。每吃 5 根玉米，它就會在跑輪上消耗掉 2 根，最多只能裝下 20 根。（遊戲會跟著網站切換成中文，和桌寵應用一樣。）"],
    "Daniu the Hamster — a playable web version of Desk Pet: the running wheel, the cage, poking, dragging and feeding Da Niu corn": ["小鼠大牛——可以玩的网页版桌宠：跑轮、笼子、戳它、拖它、喂大牛吃玉米", "小鼠大牛——可以玩的網頁版桌寵：跑輪、籠子、戳它、拖它、餵大牛吃玉米"],
    "scroll to burrow ↓": ["往下挖 ↓", "往下挖 ↓"],
    "Layer 1 · paper bedding": ["第 1 层 · 纸棉垫料", "第 1 層 · 紙棉墊料"],
    "What it is": ["这是什么", "這是什麼"],
    "Desktop app for Windows &amp; macOS · Electron, HTML, CSS, JavaScript · 2026 · Personal project": ["适用于 Windows 和 macOS 的桌面应用 · Electron、HTML、CSS、JavaScript · 2026 · 个人项目", "適用於 Windows 和 macOS 的桌面應用 · Electron、HTML、CSS、JavaScript · 2026 · 個人專案"],
    "Desk Pet turns any photo or video into a little pet that lives on your desktop. You can drag it around, click it to hear it talk, and leave it to wander along the edge of your screen while you work. You can keep lots of pets, put several on the desktop at once, and pack one into a single <code>.deskpet</code> file to share with a friend.": ["桌宠能把任何照片或视频变成住在你桌面上的小宠物。你可以拖着它走，点它听它说话，也可以在工作时让它沿着屏幕边缘自己溜达。你可以养很多只宠物，同时放几只在桌面上，还能把一只打包成一个 <code>.deskpet</code> 文件分享给朋友。", "桌寵能把任何照片或影片變成住在你桌面上的小寵物。你可以拖著它走，點它聽它說話，也可以在工作時讓它沿著螢幕邊緣自己溜達。你可以養很多隻寵物，同時放幾隻在桌面上，還能把一隻打包成一個 <code>.deskpet</code> 檔案分享給朋友。"],
    "I made Desk Pet as a gift for a friend. The hamster you see here — in the game at the top of this page — is her hamster, <span lang=\"zh-Hans\">大牛</span> (Da Niu), turned into a little digital version that lives on her desktop.": ["桌宠是我送给一位朋友的礼物。你在这里看到的仓鼠——就是页面最上面游戏里的那只——是她的仓鼠大牛，被做成了一个住在她电脑桌面上的小小数字版。", "桌寵是我送給一位朋友的禮物。你在這裡看到的倉鼠——就是頁面最上面遊戲裡的那隻——是她的倉鼠大牛，被做成了一個住在她電腦桌面上的小小數位版。"],
    "My best friend spends most of her day in the lab, far from Da Niu, so I wanted to give her a little stand-in she could keep close while she works. Hamsters don't live very long, either, and I wanted to capture as much of Da Niu as I could, so a small version of him gets to stay around for much longer. We both have ADHD, and we're both prone to wandering away from the computer and missing important emails and notifications. A pet sitting on the desktop is a gentle reason to keep glancing back at the screen. Hamsters are also nocturnal, so during the day the real Da Niu is usually asleep in a ball of bedding. This one is awake and moving around exactly when his owner is. And every time Da Niu wanders across her screen, I hope it reminds her that someone was thinking of her too.": ["我最好的朋友一天大部分时间都待在实验室里，离大牛很远，所以我想送她一个小小的替身，让她工作的时候也能把它留在身边。仓鼠的寿命也不长，我想尽可能多地留住大牛，这样一个小小的它就能陪伴得更久。我们俩都有 ADHD，都很容易从电脑前走开，错过重要的邮件和通知。桌面上有一只小宠物，就是一个温柔的理由，让人时不时看回屏幕。仓鼠还是夜行动物，所以白天真正的大牛通常缩在一团垫料里睡觉；而这一只，正好在它的主人醒着的时候醒着、到处走动。每次大牛从她的屏幕上溜过，我都希望它能提醒她：也有人在想着她。", "我最好的朋友一天大部分時間都待在實驗室裡，離大牛很遠，所以我想送她一個小小的替身，讓她工作的時候也能把它留在身邊。倉鼠的壽命也不長，我想儘可能多地留住大牛，這樣一個小小的它就能陪伴得更久。我們倆都有 ADHD，都很容易從電腦前走開，錯過重要的郵件和通知。桌面上有一隻小寵物，就是一個溫柔的理由，讓人時不時看回螢幕。倉鼠還是夜行動物，所以白天真正的大牛通常縮在一團墊料裡睡覺；而這一隻，正好在它的主人醒著的時候醒著、到處走動。每次大牛從她的螢幕上溜過，我都希望它能提醒她：也有人在想著她。"],
    "It's built with Electron and plain HTML, CSS and JavaScript, with no front-end framework. I didn't write the code by hand: Claude Code wrote all of it, including the desktop app, the corn-cursor feeding and the browser version my friends can open from a link. My part was the idea, the hamster clips and GIFs, the reference photos, the rules for how Da Niu should behave, and testing it on my own desktop until it felt right.": ["它用 Electron 和纯 HTML、CSS、JavaScript 搭建，没有使用前端框架。代码不是我手写的：全部由 Claude Code 编写，包括桌面应用、玉米光标喂食功能，以及朋友们点一个链接就能打开的网页版。我负责的是创意、仓鼠视频片段和 GIF、参考照片、大牛应该怎么行动的规则，以及在自己的桌面上反复测试，直到感觉对了为止。", "它用 Electron 和純 HTML、CSS、JavaScript 搭建，沒有使用前端框架。程式碼不是我手寫的：全部由 Claude Code 編寫，包括桌面應用、玉米游標餵食功能，以及朋友們點一個連結就能開啟的網頁版。我負責的是創意、倉鼠影片片段和 GIF、參考照片、大牛應該怎麼行動的規則，以及在自己的桌面上反覆測試，直到感覺對了為止。"],
    "My prompts changed a lot along the way. I started with one long written brief that set out everything up front: the files, the settings each pet has, how the windows should behave on Mac and Windows, and a checklist to test against. Once the pet was running, I switched to short requests in Chinese, one feature at a time, like “add a look for when it's being dragged” or “let it crawl around the screen by itself”. I also learned to describe the result exactly. When I asked for crawling that “always stops at the screen edge”, it first crawled along the edges, so I had to explain that it should roam anywhere and only stop at an edge. Later I showed instead of told, and sent photos of a real cage and a clear running wheel. By the end my prompts read like game rules: every five corns Da Niu runs on the wheel and burns off two, he can hold twenty at most, and below twenty, corn beats the wheel.": ["我的提示词一路上变化很大。一开始我写了一份很长的说明，把所有东西都提前讲清楚：文件、每只宠物的设置、窗口在 Mac 和 Windows 上该怎么表现，还有一份用来测试的清单。宠物跑起来之后，我改成用中文发简短的请求，一次一个功能，比如“加一个被拖动时的样子”或者“让它自己在屏幕上爬来爬去”。我也学会了把想要的结果描述准确。我要求爬行“总是停在屏幕边缘”，它一开始却沿着边缘爬，所以我得解释清楚：它应该到处走，只是碰到边缘时停下。后来我改成展示而不是描述，发了真实笼子和透明跑轮的照片。到最后，我的提示词读起来就像游戏规则：大牛每吃五根玉米就去跑轮上消耗掉两根，最多只能装二十根；不到二十根时，玉米比跑轮优先。", "我的提示詞一路上變化很大。一開始我寫了一份很長的說明，把所有東西都提前講清楚：檔案、每隻寵物的設定、視窗在 Mac 和 Windows 上該怎麼表現，還有一份用來測試的清單。寵物跑起來之後，我改成用中文發簡短的請求，一次一個功能，比如“加一個被拖動時的樣子”或者“讓它自己在螢幕上爬來爬去”。我也學會了把想要的結果描述準確。我要求爬行“總是停在螢幕邊緣”，它一開始卻沿著邊緣爬，所以我得解釋清楚：它應該到處走，只是碰到邊緣時停下。後來我改成展示而不是描述，發了真實籠子和透明跑輪的照片。到最後，我的提示詞讀起來就像遊戲規則：大牛每吃五根玉米就去跑輪上消耗掉兩根，最多只能裝二十根；不到二十根時，玉米比跑輪優先。"],
    "Layer 2 · wood shavings": ["第 2 层 · 木屑", "第 2 層 · 木屑"],
    "Four moods": ["四种状态", "四種狀態"],
    "Each pet can have a different look for resting, being clicked, being dragged, crawling and sleeping. These are Da Niu's.": ["每只宠物在休息、被点击、被拖动、爬行和睡觉时都可以有不同的样子。这些是大牛的。", "每隻寵物在休息、被點選、被拖動、爬行和睡覺時都可以有不同的樣子。這些是大牛的。"],
    "Resting": ["休息", "休息"],
    "Picked up": ["被抱起来", "被抱起來"],
    "Crawling": ["爬行", "爬行"],
    "Sleepy": ["犯困", "犯困"],
    "Cut-out hamster sitting up, glancing left and right": ["抠图的仓鼠坐起来，左右张望", "摳圖的倉鼠坐起來，左右張望"],
    "Hamster with full cheeks being held in a hand": ["腮帮子塞得鼓鼓的仓鼠被握在手里", "腮幫子塞得鼓鼓的倉鼠被握在手裡"],
    "Hamster seen from behind, crawling away": ["仓鼠的背影，正在爬走", "倉鼠的背影，正在爬走"],
    "Hamster sitting still and getting sleepy": ["仓鼠坐着不动，慢慢犯困", "倉鼠坐著不動，慢慢犯困"],
    "Layer 3 · the tunnels": ["第 3 层 · 地道", "第 3 層 · 地道"],
    "How it works": ["它是怎么运作的", "它是怎麼運作的"],
    "Open the control panel from the tray icon, then press “＋ New” or drop images and videos onto the window — each file becomes a new pet that appears in the corner of the screen straight away. On the right you can change its name, looks, size and the things it says, and every change saves itself and shows up on the desktop within a second.": ["从托盘图标打开控制面板，然后点“＋ 新建”，或者把图片和视频拖进窗口——每个文件都会变成一只新宠物，马上出现在屏幕角落。在右边可以修改它的名字、样子、大小和它说的话，每个改动都会自动保存，并在一秒内出现在桌面上。", "從托盤圖示開啟控制面板，然後點“＋ 新建”，或者把圖片和影片拖進視窗——每個檔案都會變成一隻新寵物，馬上出現在螢幕角落。在右邊可以修改它的名字、樣子、大小和它說的話，每個改動都會自動儲存，並在一秒內出現在桌面上。"],
    "If nobody touches a pet for a while it switches to its sleeping look and stops chatting; one click or drag wakes it up. With wandering turned on, it crawls to a random spot nearby — or always along the screen edges — and turns to face the way it's going.": ["如果一段时间没人碰它，宠物就会换成睡觉的样子，也不再说话；点一下或拖一下就能把它叫醒。打开“闲逛”后，它会爬到附近随机的地方——或者一直沿着屏幕边缘爬——并且转身面朝前进的方向。", "如果一段時間沒人碰它，寵物就會換成睡覺的樣子，也不再說話；點一下或拖一下就能把它叫醒。開啟“閒逛”後，它會爬到附近隨機的地方——或者一直沿著螢幕邊緣爬——並且轉身面朝前進的方向。"],
    "You can also feed it: right-click a pet and choose “🌽 Feed it corn” (or feed every pet at once from the tray menu). The mouse pointer turns into a corn cob and the pet chases it at four times its crawling speed. When it catches the corn it eats it, plays its own “eating” look and says one of its “ate the corn” lines. Press Esc or right-click to put the corn down. (Try it on this site too — the 🌽 Feed button in the menu bar.)": ["你还可以喂它：右键点宠物，选“🌽 喂它玉米”（或者从托盘菜单一次喂所有宠物）。鼠标指针会变成一根玉米，宠物会用四倍于爬行的速度追过来。追到玉米后它会吃掉，播放自己“吃东西”的样子，并说一句“吃到玉米”的台词。按 Esc 或右键就能放下玉米。（在这个网站上也能试试——点菜单栏里的 🌽 喂 按钮。）", "你還可以餵它：右鍵點寵物，選“🌽 餵它玉米”（或者從托盤選單一次餵所有寵物）。滑鼠指標會變成一根玉米，寵物會用四倍於爬行的速度追過來。追到玉米後它會吃掉，播放自己“吃東西”的樣子，並說一句“吃到玉米”的臺詞。按 Esc 或右鍵就能放下玉米。（在這個網站上也能試試——按一下選單欄裡的 🌽 餵 按鈕。）"],
    "Layer 4 · the nest": ["第 4 层 · 窝", "第 4 層 · 窩"],
    "The real one": ["真正的它", "真正的它"],
    "At the very bottom of the burrow: <span lang=\"zh-Hans\">大牛</span> (Da Niu), my friend's hamster — who the whole gift is for.": ["洞穴的最底层：大牛，我朋友的仓鼠——这份礼物就是为它做的。", "洞穴的最底層：大牛，我朋友的倉鼠——這份禮物就是為它做的。"],
    "Photos of Da Niu": ["大牛的照片", "大牛的照片"],
    "Photos of Da Niu — scroll sideways": ["大牛的照片——左右滑动", "大牛的照片——左右滑動"],
    "Hello up there": ["上面的你好呀", "上面的你好呀"],
    "In his wooden hideout": ["在它的小木屋里", "在它的小木屋裡"],
    "Dozing in the hideout": ["在小木屋里打盹", "在小木屋裡打盹"],
    "Treat time (video)": ["零食时间（视频）", "零食時間（影片）"],
    "Asleep in the food bowl": ["在饭碗里睡着了", "在飯碗裡睡著了"],
    "Nap by the box": ["在木屋边午睡", "在木屋邊午睡"],
    "Peekaboo": ["躲猫猫", "躲貓貓"],
    "Still peeking": ["还在偷看", "還在偷看"],
    "Hiding at the back": ["躲在最里面", "躲在最裡面"],
    "Big yawn": ["大大的哈欠", "大大的哈欠"],
    "Curled up": ["缩成一团", "縮成一團"],
    "In a hand": ["在手心里", "在手心裡"],
    "On top of the cage": ["在笼子顶上", "在籠子頂上"],
    "Carousel style based on <a href=\"https://skiper-ui.com\" target=\"_blank\" rel=\"noopener\">Skiper UI</a> (skiper54)": ["轮播样式参考 <a href=\"https://skiper-ui.com\" target=\"_blank\" rel=\"noopener\">Skiper UI</a>（skiper54）", "輪播樣式參考 <a href=\"https://skiper-ui.com\" target=\"_blank\" rel=\"noopener\">Skiper UI</a>（skiper54）"],
    "Da Niu, a golden-and-white hamster, looking up at the camera from his white bedding": ["大牛，一只金白相间的仓鼠，从白色垫料里抬头看着镜头", "大牛，一隻金白相間的倉鼠，從白色墊料裡抬頭看著鏡頭"],
    "Da Niu sitting in a wooden box full of bedding, looking up": ["大牛坐在铺满垫料的木盒里，抬头看", "大牛坐在鋪滿墊料的木盒裡，抬頭看"],
    "Da Niu curled up in the corner of the wooden box, eyes half shut": ["大牛蜷在木盒的角落，眼睛半闭", "大牛蜷在木盒的角落，眼睛半閉"],
    "Video, 26 seconds, no sound: a hand passes Da Niu a treat through the cage; he takes it, then eats from his fish-shaped bowl": ["视频，26 秒，无声音：一只手隔着笼子递给大牛一个零食，它接过去，然后在鱼形碗里吃东西", "影片，26 秒，無聲音：一隻手隔著籠子遞給大牛一個零食，它接過去，然後在魚形碗裡吃東西"],
    "Da Niu curled up asleep inside his dark blue fish-shaped food bowl": ["大牛蜷在深蓝色鱼形饭碗里睡着了", "大牛蜷在深藍色魚形飯碗裡睡著了"],
    "Da Niu asleep in the bedding beside the wooden box": ["大牛在木盒旁边的垫料里睡着了", "大牛在木盒旁邊的墊料裡睡著了"],
    "Da Niu peeking out over the bedding inside a yellow plastic house": ["大牛在黄色塑料小屋里，从垫料上方探出头", "大牛在黃色塑膠小屋裡，從墊料上方探出頭"],
    "Da Niu's face peeking out of the yellow house, bedding piled in front": ["大牛的脸从黄色小屋里探出来，前面堆着垫料", "大牛的臉從黃色小屋裡探出來，前面堆著墊料"],
    "Da Niu far back in the yellow house, half hidden behind bedding": ["大牛躲在黄色小屋的最里面，一半藏在垫料后面", "大牛躲在黃色小屋的最裡面，一半藏在墊料後面"],
    "Close-up of Da Niu with his mouth wide open behind a wooden ramp": ["大牛在木制斜坡后面张大嘴巴的特写", "大牛在木製斜坡後面張大嘴巴的特寫"],
    "The hamster curled up asleep in white bedding": ["仓鼠在白色垫料里蜷成一团睡着了", "倉鼠在白色墊料裡蜷成一團睡著了"],
    "The golden hamster held up in one hand, looking at the camera": ["金色仓鼠被一只手托起来，看着镜头", "金色倉鼠被一隻手托起來，看著鏡頭"],
    "The hamster seen from above, standing on top of its cage": ["从上往下看，仓鼠站在笼子顶上", "從上往下看，倉鼠站在籠子頂上"],
    "Shh… Da Niu is asleep under the cover.": ["嘘……大牛正在盖布下面睡觉。", "噓……大牛正在蓋布下面睡覺。"],
    "WAKING UP": ["正在醒来", "正在醒來"],
    "Lift the cover": ["掀开盖布", "掀開蓋布"],
    "DSDN142 Project 2 · Figma Make · 2026": ["DSDN142 项目二 · Figma Make · 2026", "DSDN142 專案二 · Figma Make · 2026"],
    "Generating Warm-up Games": ["热身游戏生成器", "熱身遊戲生成器"],
    "This interactive website helps teachers quickly choose a warm-up activity — saving preparation time and helping students get engaged and ready to learn. Try it right here.": ["这个互动网站帮老师快速选择课堂热身活动——节省备课时间，也让学生更投入、准备好开始学习。就在这里试试吧。（游戏本身是英文的。）", "這個互動網站幫老師快速選擇課堂熱身活動——節省備課時間，也讓學生更投入、準備好開始學習。就在這裡試試吧。（遊戲本身是英文的。）"],
    "Generating Warm-up Games — the playable website: answer a few questions and get a warm-up game that fits your class": ["热身游戏生成器——可以直接玩的网站：回答几个问题，得到适合你班级的热身游戏", "熱身遊戲生成器——可以直接玩的網站：回答幾個問題，得到適合你班級的熱身遊戲"],
    "how I made it ↓": ["我是怎么做的 ↓", "我是怎麼做的 ↓"],
    "The idea": ["想法", "想法"],
    "A warm-up is a small but important part of a class. Teachers may want one, but don't always have time to prepare something suitable.": ["热身是课堂里一个小但重要的环节。老师可能想要一个热身活动，但不一定有时间准备合适的内容。", "熱身是課堂裡一個小但重要的環節。老師可能想要一個熱身活動，但不一定有時間準備合適的內容。"],
    "My first idea was simple: the teacher gives their lesson content and the AI makes a warm-up game. While developing it, I realised lesson content isn't the only thing that decides whether a warm-up works — time, internet access, solo or group work, and whether there's any lesson material all matter. So the concept changed from “generate a game” to “help the teacher decide which game fits their situation”.": ["我最初的想法很简单：老师提供课程内容，AI 生成一个热身游戏。在开发过程中，我意识到课程内容并不是决定热身是否有效的唯一因素——时间、有没有网络、个人还是小组、有没有课程材料，都很重要。所以概念从“生成一个游戏”变成了“帮老师判断哪个游戏适合他们的情况”。", "我最初的想法很簡單：老師提供課程內容，AI 生成一個熱身遊戲。在開發過程中，我意識到課程內容並不是決定熱身是否有效的唯一因素——時間、有沒有網路、個人還是小組、有沒有課程材料，都很重要。所以概念從“生成一個遊戲”變成了“幫老師判斷哪個遊戲適合他們的情況”。"],
    "Every choice changes something": ["每个选择都会改变结果", "每個選擇都會改變結果"],
    "The final branching structure narrows the options with each decision, instead of showing every possible game at once. The final activity isn't random — it reflects every decision the teacher made. I learned that you don't need many options, but each one needs a consequence: if two choices lead to the same result, the choice stops meaning anything.": ["最终的分支结构会随着每个决定缩小选项，而不是一次把所有可能的游戏都摆出来。最后得到的活动不是随机的——它反映了老师做的每一个决定。我学到：选项不需要很多，但每个选项都要有结果；如果两个选择通向同一个结果，这个选择就失去了意义。", "最終的分支結構會隨著每個決定縮小選項，而不是一次把所有可能的遊戲都擺出來。最後得到的活動不是隨機的——它反映了老師做的每一個決定。我學到：選項不需要很多，但每個選項都要有結果；如果兩個選擇通向同一個結果，這個選擇就失去了意義。"],
    "The final branching structure": ["最终的分支结构", "最終的分支結構"],
    "Branching flow diagram in Figma, with many paths splitting from the first question to different final games": ["Figma 里的分支流程图，从第一个问题分出很多条路径，通向不同的最终游戏", "Figma 裡的分支流程圖，從第一個問題分出很多條路徑，通向不同的最終遊戲"],
    "Building it with AI": ["用 AI 来搭建", "用 AI 來搭建"],
    "I built the working website in Figma Make. I used AI to prototype the structure and interactions, then tested, found problems and refined my prompts — the first generated version was never the final design. I made or modified all the media myself — no stock images or icons.": ["我用 Figma Make 搭建了这个可用的网站。我先用 AI 做出结构和交互的原型，然后测试、发现问题、改进提示词——第一次生成的版本从来都不是最终设计。所有的图片和素材都是我自己制作或修改的——没有用图库图片或图标。", "我用 Figma Make 搭建了這個可用的網站。我先用 AI 做出結構和互動的原型，然後測試、發現問題、改進提示詞——第一次生成的版本從來都不是最終設計。所有的圖片和素材都是我自己製作或修改的——沒有用圖庫圖片或圖示。"],
    "Link. ": ["链接。", "連結。"],
    "Button. ": ["按钮。", "按鈕。"],
    "Image. ": ["图片。", "圖片。"],
    "Narration on. Point at anything, or press Tab, to hear it read aloud. Press Escape to stop.": ["旁白已开启。把鼠标指向任何内容，或者按 Tab 键，就会朗读出来。按 Esc 停止。", "旁白已開啟。把滑鼠指向任何內容，或者按 Tab 鍵，就會朗讀出來。按 Esc 停止。"],
    "Narration off.": ["旁白已关闭。", "旁白已關閉。"],
    "End of page.": ["页面结束。", "頁面結束。"],
    "Accessibility on. All animations are stopped, and I'll read this page aloud from the top. Press Escape to stop reading, or point at anything, or press Tab, to hear just that.": ["无障碍模式已开启。所有动画都已停止，我会从头开始朗读这个页面。按 Esc 停止朗读；或者指向任何内容、按 Tab 键，只听那一项。", "無障礙模式已開啟。所有動畫都已停止，我會從頭開始朗讀這個頁面。按 Esc 停止朗讀；或者指向任何內容、按 Tab 鍵，只聽那一項。"],
    "Accessibility off. Animations are back on.": ["无障碍模式已关闭，动画已恢复。", "無障礙模式已關閉，動畫已恢復。"],
  };

  // Sentences with a number or a photo description in the middle.
  const PATTERNS = [
    [/^Open photo: (.+)$/, "打开照片：$1", "開啟照片：$1"],
    [/^Photo (\d+) of (\d+)$/, "第 $1 张，共 $2 张", "第 $1 張，共 $2 張"],
    [/^Speed (.+) times\.$/, "语速 $1 倍。", "語速 $1 倍。"],
    [/^Narration speed, (.+) times\.$/, "旁白语速，$1 倍。", "旁白語速，$1 倍。"],
  ];

  const TAGS = { en: "en-NZ", hans: "zh-Hans", hant: "zh-Hant" };
  const SKIP = "script, style, .quote__typed, .lang-pick__select, [data-no-i18n]";
  const ATTRS = ["alt", "aria-label", "title", "placeholder", "data-cursor"];

  let lang = "en";
  try {
    const saved = localStorage.getItem("site-lang");
    if (saved in TAGS) lang = saved;
  } catch (err) { /* not allowed — English */ }

  const norm = (s) => String(s).replace(/\s+/g, " ").trim();
  const known = (s) => s in WORDS || PATTERNS.some(([re]) => re.test(s));

  // One piece of English → the chosen language.
  function t(en) {
    if (lang === "en" || en == null) return en;
    const key = norm(en);
    const which = lang === "hans" ? 0 : 1;
    if (key in WORDS) return WORDS[key][which];
    for (const [re, hans, hant] of PATTERNS) {
      const m = key.match(re);
      if (m) return (which ? hant : hans).replace(/\$(\d)/g, (_, n) => t(m[n]));
    }
    return en;
  }

  /* ---- Swapping the page's text ----
     For each element we remember its English, and what we last put
     there — so if one of the other scripts changes the words later
     (e.g. "Pause animations" → "Play animations"), we notice and
     translate the new words. */
  const english = new WeakMap();
  const ours = new WeakMap();
  const englishAttrs = new WeakMap();
  const firstLang = new WeakMap();

  function swapText(el) {
    if (el.textContent.length > 2000) return false; // big sections: look inside instead
    const now = norm(el.innerHTML);
    let en = english.get(el);
    if (en !== undefined && now !== ours.get(el)) en = undefined; // changed since
    if (en === undefined) {
      if (!known(now)) return false;
      en = now;
      english.set(el, en);
    }
    const want = lang === "en" ? en : t(en);
    if (now !== norm(want)) el.innerHTML = want;
    ours.set(el, norm(el.innerHTML));
    return true;
  }

  function swapAttrs(el) {
    for (const a of ATTRS) {
      if (!el.hasAttribute(a)) continue;
      const now = el.getAttribute(a);
      let saved = englishAttrs.get(el);
      if (!saved) englishAttrs.set(el, (saved = {}));
      let en = saved[a];
      if (en !== undefined && now !== saved["~" + a]) en = undefined;
      if (en === undefined) {
        if (!known(norm(now))) continue;
        en = now;
        saved[a] = en;
      }
      const want = lang === "en" ? en : t(en);
      if (now !== want) el.setAttribute(a, want);
      saved["~" + a] = want;
    }
    // Chinese words already in the page follow the chosen script too
    const l = el.getAttribute("lang");
    if (l && /^zh/i.test(l)) {
      if (!firstLang.has(el)) firstLang.set(el, l);
      const wantLang = lang === "hant" ? "zh-Hant" : lang === "hans" ? "zh-Hans" : firstLang.get(el);
      if (l !== wantLang) el.setAttribute("lang", wantLang);
    }
  }

  function swapTree(root) {
    if (!root || root.nodeType !== 1 || root.closest(SKIP)) return;
    let done = null; // the last element swapped as a whole — skip what's inside it
    for (const el of [root, ...root.querySelectorAll("*")]) {
      if (!el.isConnected || el.closest(SKIP)) continue;
      swapAttrs(el);
      if (done && done.contains(el)) continue;
      if (swapText(el)) done = el;
    }
  }

  let englishTitle = document.title;
  function swapAll() {
    document.documentElement.lang = TAGS[lang];
    document.title = lang === "en" ? englishTitle : t(englishTitle);
    swapTree(document.body);
  }

  // Text that other scripts add or change later (the hamster's speech
  // bubble, the cloth cover, button labels…) gets swapped as it appears.
  new MutationObserver((changes) => {
    for (const c of changes) {
      if (c.type === "attributes") { if (c.target.isConnected && !c.target.closest(SKIP)) swapAttrs(c.target); continue; }
      const el = c.target;
      if (el.nodeType === 1 && el.isConnected && !el.closest(SKIP)) swapText(el);
      c.addedNodes.forEach((n) => { if (n.nodeType === 1 && n.isConnected) swapTree(n); });
    }
  }).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ATTRS });

  /* ---- The Da Niu game (its own page, in a frame) ----
     It has its own EN / 中文 button; press it to match the site. */
  function syncGame() {
    const want = lang === "en" ? "en" : "zh";
    try { localStorage.setItem("daniu-lang", want); } catch (err) { /* fine */ }
    document.querySelectorAll('iframe[src*="play/"]').forEach((frame) => {
      const match = () => {
        try {
          const doc = frame.contentDocument;
          const btn = doc && doc.getElementById("langBtn");
          const has = /^zh/i.test(doc.documentElement.lang) ? "zh" : "en";
          if (btn && has !== want) btn.click();
        } catch (err) { /* not ready yet */ }
      };
      match();
      frame.addEventListener("load", match, { once: true });
    });
  }

  function setLang(next) {
    if (!(next in TAGS)) return;
    lang = next;
    try { localStorage.setItem("site-lang", lang); } catch (err) { /* fine */ }
    swapAll();
    syncGame();
    document.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
  }

  // For the other scripts: words they speak or show, and which voice.
  window.i18n = {
    t,
    lang: () => lang,
    voice: () => TAGS[lang],
    set: setLang,
    // The English an attribute had before it was translated (e.g. a photo's alt)
    english: (el, attr) => {
      const saved = englishAttrs.get(el);
      const now = el.getAttribute(attr);
      return saved && saved[attr] !== undefined && now === saved["~" + attr] ? saved[attr] : now;
    },
  };

  /* ---- The picker in the menu bar ---- */
  document.querySelectorAll(".lang-pick__select").forEach((select) => {
    select.value = lang;
    select.addEventListener("change", () => {
      setLang(select.value);
      document.querySelectorAll(".lang-pick__select").forEach((s) => { s.value = lang; });
    });
  });

  swapAll();
  if (lang !== "en") syncGame();
})();
