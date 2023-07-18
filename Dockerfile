# 防止版本号导致缓存失效
FROM node:14-alpine as package
COPY package.json ./
RUN node -e "['./package.json'].forEach(n => {let p = require(n);p.version = '0.0.0';fs.writeFileSync(n,JSON.stringify(p));});"

# 编译阶段
FROM node:14-alpine as builder
WORKDIR /app
COPY --from=package package.json ./
COPY yarn.lock ./
RUN yarn config set registry https://registry.npm.taobao.org/ && yarn config set nodejieba_binary_host_mirror https://npm.taobao.org/mirrors/nodejieba && yarn --production=false
COPY . .
RUN yarn build && yarn --production

# 生产阶段
FROM node:14-alpine as prod

# oracle配置
ENV ORACLE_BASE /usr/lib/instantclient
ENV LD_LIBRARY_PATH /usr/lib/instantclient
ENV TNS_ADMIN /usr/lib/instantclient
ENV ORACLE_HOME /usr/lib/instantclient
# 安装oracle客户端
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories && apk --no-cache add libaio libnsl libc6-compat curl && \
  cd /tmp && \
  curl -o instantclient-basiclite.zip https://download.oracle.com/otn_software/linux/instantclient/211000/instantclient-basiclite-linux.x64-21.1.0.0.0.zip -SL && \
  unzip instantclient-basiclite.zip && \
  mv instantclient*/ /usr/lib/instantclient && \
  rm instantclient-basiclite.zip && \
  ln -s /usr/lib/instantclient/libclntsh.so.19.1 /usr/lib/libclntsh.so && \
  ln -s /usr/lib/instantclient/libocci.so.19.1 /usr/lib/libocci.so && \
  ln -s /usr/lib/instantclient/libociicus.so /usr/lib/libociicus.so && \
  ln -s /usr/lib/instantclient/libnnz19.so /usr/lib/libnnz19.so && \
  ln -s /usr/lib/libnsl.so.2 /usr/lib/libnsl.so.1 && \
  ln -s /lib/libc.so.6 /usr/lib/libresolv.so.2 && \
  ln -s /lib64/ld-linux-x86-64.so.2 /usr/lib/ld-linux-x86-64.so.2

#环境
ENV NODE_ENV production
#数据库host
ENV DATABASE_HOST 127.0.0.1
#数据库端口
ENV DATABASE_PORT 3306
#数据库账号
ENV DATABASE_USERNAME root
#数据库密码
ENV DATABASE_PASSWORD root
# redis地址
ENV REDIS_HOST 127.0.0.1
# redis端口
ENV REDIS_PORT 6379
# redis密码
ENV REDIS_PASSWORD 0YcbQwYzhMA3c38r
WORKDIR /app
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules/ ./node_modules/
COPY --from=builder /app/dist/ ./dist/
CMD npx typeorm migration:run -d ./dist/data-source.js && node dist/src/main.js
