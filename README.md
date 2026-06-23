# RS Live Technologies 落地页

这是 `RS Live Technologies` 的单页落地页项目，已经迁移为零依赖的 Node 静态站点。

当前实现保持克制：一个以摄影为主的 Hero 区、一段节奏感过渡图、一个三图 Moments 网格，以及极简页脚。页面语言以英文为主，品牌表达优先于服务介绍，不走常规营销站路线。

## 视觉方向
- 单色系 editorial 气质：charcoal、smoke、ash、ivory
- 大尺寸衬线标题，搭配克制的无衬线界面文字
- 以摄影和氛围为主，文案尽量少
- 动效只做轻量处理：渐入、缓慢漂移、轻微悬浮
- 已兼顾桌面端和移动端响应式表现

## 技术栈

- Node.js 内置模块
- 纯手写 CSS
- 静态 HTML

没有 React、Vite、TypeScript 或第三方运行时依赖。

## 目录结构

```text
.
├─ index.html            # 页面结构
├─ scripts/
│  ├─ build.mjs          # 复制静态资源到 dist/
│  ├─ dev.mjs            # 开发模式构建 + 预览服务
│  └─ serve.mjs          # 纯 Node 静态文件服务
├─ src/
│  ├─ assets/            # 摄影素材
│  └─ styles.css         # 全局样式
└─ dist/                 # 构建输出
```

## 本地启动

无需安装任何依赖。

构建生产版本：

```bash
npm run build
```

启动开发模式：

```bash
npm run dev
```

本地预览构建产物：

```bash
npm run preview
```

默认端口是 `4173`，可通过环境变量覆盖：

```bash
PORT=3000 npm run preview
```

## 页面组成

页面结构直接写在 [index.html](/Users/imrsp/Documents/Codex/RSlivetech-landingpage/index.html) 中：

- `Header`：固定在顶部的品牌字标与极简导航
- `Hero`：主标语与主视觉图片
- `Trio band`：三张节奏图
- `Moments`：三张图片组成的视觉网格
- `Footer`：品牌名与联系方式

样式集中在 [src/styles.css](/Users/imrsp/Documents/Codex/RSlivetech-landingpage/src/styles.css)，通过 CSS 自定义属性统一管理颜色、宽度、间距和动效节奏。

## 构建规则

`npm run build` 会把以下内容复制到 `dist/`：

- `index.html`
- `src/styles.css`
- `src/assets/`

所以部署时只需要发布 `dist/`。

## 修改约束

- 页面可见文案应保持克制。除非需求变更，不要主动加入服务列表、数据指标、徽章、口号堆砌或常规营销文案。
- 保持当前的 editorial 结构，这个页面应该始终是“图片先行，解释靠后”。
- 对于这么小的站点，优先延续现有的轻量结构，不要为了“规范”引入沉重的区块系统或 UI 框架。
- 交互动效应保持轻量，同时必须继续兼容 `prefers-reduced-motion`。

## 验证方式

建议至少执行：

```bash
npm run build
npm run preview
```

然后在浏览器检查桌面和移动视口，确认：

- 站点显示正常
- 没有水平滚动条
- 图片裁切和排版没有断裂
