FROM ubuntu:18.04

USER root
ENV DEBIAN_FRONTEND noninteractive
#COPY ./sources.list /etc/apt/sources.list
RUN sed -i 's/http:\/\/archive\.ubuntu\.com\/ubuntu\//http:\/\/mirrors\.163\.com\/ubuntu\//g' /etc/apt/sources.list

RUN apt-get update && apt-get install -yqq nginx && apt-get install -y curl wget

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get update && apt-get install -y nodejs
RUN npm config set registry https://registry.npm.taobao.org/
#RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
# 复制项目代码
COPY . /src
WORKDIR /src

COPY nginx.conf /etc/nginx/nginx.conf

RUN npm i
RUN npm run build:test

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

