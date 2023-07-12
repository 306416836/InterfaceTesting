const axios = require('axios');
const config = require('./config.json');
const axiosInstance = axios.create(config.axiosConfig);
const mysql = require('mysql');
const connection = mysql.createConnection(config.mysqlConfig);
let eventLoopNum = 0
let endshow=false;

async function loopEvent(){
	await wait(awaitTime)
	for(let i=0;i<config.loopInterface.length;i++){
		loopItem(config.loopInterface[i])
	}
	counter++
	console.log(` 进程 ${processesId} 已执行 ${counter} 次数 `)
}

connection.connect();
let processesId = process.argv[2]
let loopAll = process.argv[4]==='true'? true : Number(process.argv[4])
let awaitTime = Number(process.argv[3])
let uuuid = process.argv[5]
let processesNum = process.argv[6]
console.log("进程 " + processesId + " 执行。" );

let counter = 0
let loop = false
if(loopAll===true) loop=true
init()
async function init(){
	if(loop){
		while(loop){
			await loopEvent()
		}
	}else{
		for(let i=0;i<loopAll;i++){
			await loopEvent()
		}
	}
	console.log('脚本执行完毕,等待异步存储中...')
	endshow=true
}

async function loopItem(list){
	eventLoopNum++
	let starTime = new Date()
	axiosInstance({
	  method: list.type,
	  url: list.path,
	  data: list.param
	}).then((res)=>{
		let endTime = new Date()
		insql(list.path,
			processesId,
			endTime.getTime()-starTime.getTime(),
			'成功',
			JSON.stringify(res.data),
			starTime.toLocaleString(),
			endTime.toLocaleString(),
		)
	}).catch((res)=>{
		let endTime = new Date()
		insql(list.path,
			processesId,
			endTime.getTime()-starTime.getTime(),
			'失败',
			JSON.stringify(res),
			starTime.toLocaleString(),
			endTime.toLocaleString(),
		)
	})
}

function insql(path,posID,time,state,remark,startTime,endTime){
	
	let  addSql = `INSERT INTO interfaceTest(path,posID,time,state,remark,uuuid,processes,awaitTime,startTime,endTime,loopNum)
	 VALUES('${path}','${posID}','${time}','${state}','${remark}','${uuuid}','${processesNum}','${awaitTime}','${startTime}',
	 '${endTime}','${loopAll}')`;
	connection.query(addSql,function (err, result) {
			eventLoopNum--
			if(eventLoopNum===0&&endshow){
				connection.end()
				console.log('存储执行完毕')
			}
	        if(err){
	         console.log('[INSERT ERROR] - ',err.message);
	         return;
	        }
	       //console.log('--------------------------INSERT----------------------------');
	});

}

function wait(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
};
