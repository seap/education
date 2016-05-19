##目录结构：
  -- /
    -- bin
    -- public
      -- dist   // webpack 构建目录
      -- src    // 前端开发目录（后端直接使用该目录中代码）
        -- actions
        -- common
        -- components   // 纯 react 组件
        -- constants
        -- containers   // redux 与 react 组件结合
        -- middleware
        -- reducers
        -- store
        -- index.js   // 前端入口
        -- routes.js  // 路由
    -- routes   // 后端路由，直接匹配 public/src/routes
    -- webpack    // webpack 配置、hot server 文件

##命令：
  启动：
    dev环境：
      npm run start       // 同时启动 start:dev start:hot 服务器
      npm run start:dev   // 仅启动 start:dev 服务器
      npm run start:dev:pm2   // 以pm2启动 start:dev 服务器
    idc环境(先构建)：
      npm run start:prod        // 用 node 启动应用
      npm run start:prod:pm2   // 用 pm2 启动应用
  构建：
    dev环境：
      npm run build
    idc环境：
      npm run build:prod
  lint： npm run lint
