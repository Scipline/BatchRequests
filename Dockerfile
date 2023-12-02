# 使用官方 Node.js 18.alpine 作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /usr/src/app

# 将 package.json 和 package-lock.json 文件复制到工作目录
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 将当前目录下所有文件复制到工作目录（除了 .dockerignore 中指定的路径）
COPY . .

# 暴露 3300 和 3004 端口，这两个端口分别对应我们启动的两个服务所监听的端口。
EXPOSE 3300 
EXPOSE 3004 

CMD [ "node", "main.js" ]
