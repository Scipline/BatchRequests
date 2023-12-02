/**
 * @Author        Scipline
 * @Since         2023-11-17 04:19:47
 * @LastEditor    Scipline
 * @LastEditTime  2023-12-03 03:23:09
 * @FileName      main.js
 * @Description   Proxy forward the Request to the Faucet
 */
const http = require('http');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const path = require('path');

// 创建两个 Express 应用
const app1 = express();
const app2 = express();

app1.use(cors());

// 在 3300 端口上运行代理服务
app1.use('/', createProxyMiddleware({ target: 'https://faucet.openkey.cloud', changeOrigin: true }));
// 在 3004 端口上运行静态文件服务，假设 index.html 在 'public' 目录下
app2.use('/', express.static(path.join(__dirname, 'public')));

// 创建两个服务器，分别监听不同端口
http.createServer(app1).listen(3300, () => {
  console.log('Node.js server is listening on port 3300!');
});

http.createServer(app2).listen(3004, () => {
    console.log("Static server is listening on port 3004!");
});
