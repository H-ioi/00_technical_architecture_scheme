# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview
```


## 部署

```bash
# 安装PM2： 首先，确保您已经在服务器上安装了Node.js和npm。然后，使用npm全局安装PM2：
npm install pm2 -g

# 构建Nuxt.js应用程序： 在部署之前，确保您已经在本地构建了Nuxt.js应用程序。在项目根目录下执行以下命令：
npm run build

# 启动应用程序： 使用PM2启动Nuxt.js应用程序。在项目根目录下执行以下命令：
# pm2 start npm --name "liby" -- start  
pm2 start ecosystem.config.js  # 当前环境使用


# 配置PM2启动脚本： 为了使PM2能够在服务器重启时自动启动应用程序，您需要生成一个PM2启动脚本。在项目根目录下执行以下命令：
pm2 startup

# 保存PM2进程列表： 使用以下命令将当前的PM2进程列表保存，以便它们在服务器重启后能够自动启动：
pm2 save

# 查看应用程序状态： 您可以使用以下命令查看应用程序的状态：
pm2 status

# 重启和停止应用程序： 如果需要重启或停止应用程序，可以使用以下命令：
# 重启应用程序
pm2 restart liby

# 停止应用程序
pm2 stop liby


```