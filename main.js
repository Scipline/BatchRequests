/**
 * @Author        Scipline
 * @Since         2023-11-17 04:19:47
 * @LastEditor    Scipline
 * @LastEditTime  2023-11-19 20:02:17
 * @FileName      main.js
 * @Description   Proxy forward the Request to the Faucet
 */
const http = require('http');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

app.use(cors());

app.use('/', createProxyMiddleware({ target: 'https://faucet.openkey.cloud', changeOrigin: true }));

const server = http.createServer(app);

server.listen(3300, () => {
  console.log('Node.js server is listening on port 3300!');
});
