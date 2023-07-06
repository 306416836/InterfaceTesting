const config = require('./config.json');
var mysql = require('mysql');
var connection = mysql.createConnection(config.mysqlConfig);
connection.connect();
let addSql=`
	CREATE TABLE IF NOT EXISTS interfaceTest(
	   id INT UNSIGNED AUTO_INCREMENT,
	   path VARCHAR(255) NOT NULL COMMENT '接口地址',
	   posID VARCHAR(255) NOT NULL COMMENT '进程id',
	   time VARCHAR(255) NOT NULL COMMENT '请求毫秒数',
	   state VARCHAR(255) NOT NULL COMMENT '请求成功失败',
	   remark LONGTEXT NOT NULL COMMENT '返回信息',
	   uuuid VARCHAR(255) NOT NULL COMMENT '压测主键',
	   startTime VARCHAR(255) NOT NULL COMMENT '请求开始时间',
	   endTime VARCHAR(255) NOT NULL COMMENT '请求结束时间',
	   processes VARCHAR(255) NOT NULL COMMENT '本次压测 线总程数',
	   awaitTime VARCHAR(255) NOT NULL COMMENT '本次压测 循环 间隔时间',
	   loopNum VARCHAR(255) NOT NULL COMMENT '本次压测 单线程 循环次数',
	   PRIMARY KEY ( id )
	)ENGINE=InnoDB DEFAULT CHARSET=utf8;
`
connection.query(addSql,function (err, result) {
	        if(err){
	         console.log('[CREAT ERROR] - ',err.message);
	         return;
	        }        
	        console.log('--------------------------创建成功----------------------------');
		   	connection.end();
	});