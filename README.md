### 项目介绍
##### 运维告警系统，项目是基于ELK系统（ElasticSearch、Logstash、Kibana)，该套系统就相当于是一个轻量的日志采集器，针对愈来愈多的服务器，各种各样的访问日志，错误日志，应用日志。在公司配置好日志分析系统之后，很明显的一个问题就是，在项目出现bug的时候，能够即使的获取到错误的输入，及时的定位，查找，分析，解决，关闭。这个后台界面也就应运而生了。

### 基于iview-admin@2.0.0
### 项目结构简介
##### 1.首页： /src/view/home/home.vue   主要是针对已配置项目的月度统计的展示
##### 2.项目相关页面： /src/view/porject/* 有和项目相关页面，包括项目的新建和管理等
##### 3.告警相关页面： /src/view/notification/* 告警相关的页面，包括告警详情的展示和具体的处理等
##### 4.成员管理页面： /src/view/account/  主要是控制管理人员的一些操作等

### [api地址！走你！](https://github.com/tangzhifeng999/logAlert-api.git)