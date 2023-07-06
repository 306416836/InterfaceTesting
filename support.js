
const axios = require('axios');
const config = require('./config.json');
const axiosInstance = axios.create(config.axiosConfig);
var mysql = require('mysql');
var connection = mysql.createConnection(config.mysqlConfig);

async function loopEvent(){
	for(let i=0;i<config.loopInterface.length;i++){
		loopItem(config.loopInterface[i])
	}
	counter++
	console.log(` 进程 ${processesId} 已执行 ${counter} 次数 `)
	await wait(awaitTime)
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
	console.log('脚本执行完毕')
	// await wait(10000) 开放注释可以自动关闭脚本，但可能无法得到正确的反应时间
	// connection.end();  //当sql 量等于 进程数*循环数量*单次接口数量  的时候，可以停止脚本
}

async function loopItem(list){
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