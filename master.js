let argv = require('minimist')(process.argv.slice(2));
const child_process = require('child_process');
let processes = argv.processes ? argv.processes:2
let sleepTime = argv.sleepTime ? argv.sleepTime:1000
let loopNum = argv.loopNum ? argv.loopNum:5
let uuuids=UUID()
console.log("间隔时间 " + sleepTime + " ms" );
console.log("循环次数 " +  loopNum + "  " );
console.log("总进程 " +  processes + "  " );
for(let i=0; i < processes; i++) {
    let worker_process = child_process.fork("support.js", [i,sleepTime,loopNum,uuuids,processes]);    
    worker_process.on('close', function (code) {
        console.log('子进程已退出，退出码 ' + code);
    });
}

function UUID(){
  let str = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
  return str.replace(/[xy]/g, item => {
    const r =Math.random() * 0x10 | 0
    const v = item === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(0x10)
  })
}


//  使用说明 : node master.js  --processes 5 --sleepTime 2000  --loopNum 10