# InterfaceTesting
 
 NODE多进程脚本案例，可用于压测，ddos，爬虫等。
 
 
## Build Setup

```bash
# install dependency
npm install
# config
loopInterface 压测 接口
mysqlConfig   数据库配置
axiosConfig   axios配置
 
# first 
node installDB.js

# develop
node master.js  --processes 5 --sleepTime 2000  --loopNum 10

--processes 子进程数量
--sleepTime 子进程 循环间隔时间
--loopNum   子进程 循环次数  当值为true时，无限循环

# config
loopInterface 压测 接口
mysqlConfig   数据库配置
axiosConfig   axios配置

# first 

```

