/**
 * 作者：李杰双
 * 日期：2017/10/15
 * 邮件：282810545@qq.com
 * 文件说明：会议室的定量
 */
import moment from 'moment'
import Cookie from 'js-cookie';

const deptname ='综合部';
const adminstuffid = '0864957';
const otherstuffid = 'G0000001'; //李文静
// const timeMap={
//   't1':'09:00-10:00',
//   't2':'10:00-11:30',
//   't3':'13:30-14:30',
//   't4':'14:30-15:30',
//   't5':'15:30-16:30',
//   't6':'16:30-17:30',
//   't7':'17:30-18:30',
// }
const timeMap={
  't1':'09:00-09:30',
  't2':'09:30-10:00',
  't3':'10:00-10:30',
  't4':'10:30-11:00',
  't5':'11:00-11:30',
  't6':'11:30-12:00',
}
const timePointMap={
  0:'09:00',
  1:'10:00',
  2:'11:30/13:30',
  3:'14:30',
  4:'15:30',
  5:'16:30',
  6:'17:30',
  7:'18:30',
}
const meetTpye=[
  {
    type:'一类会议',
    comment:<div><b>第一类会议包括：</b> 集团公司视频会议（要求公司领导班子参会）；综合性工作会议（公司党员大会、纪检会议、公司年度工作会议、年中工作会议、总经理座谈会议、总经理务虚会议、职代会等）；决策会（党委会议、总经理办公会议等）。第一类会议一般由综合部负责会议室预定。</div>
  },
  {
    type:'二类会议',
    comment:<div><b>第二类会议包括：</b>年度述职会、公司面试会议；生产经营分析会、专题会议（含调度会、座谈会、评审会等）、部门协调会等。</div>
  },
  {
    type:'三类会议',
    comment:<div><b>第三类会议包括：</b>项目讨论会，部门月、周、天例会等</div>
  }
]
//获取时间点 输入09:00-10:00 返回[0,1]

function seeorderSerach(){
  //debugger
  // if(window.sessionStorage.getItem('roleid') =='"3422c67130aa11e78db602429ca3c6ff"' ){
  if(Cookie.get('userid') =='0814782' ){
    console.log(Cookie.get('userid'));
    return {
      // key:"bookSearch",
      key: "orderSearch",
      name: '预定查询'
    }
  }
else{
  return '';
}
}
function getTimePonit(time){
  var t=time.split('-')
  var res=[]
  for(let i =0;i<t.length;i++){

    for(var k in timePointMap){
      if(timePointMap[k].indexOf(t[i])!=-1){
        res.push( parseInt(k))
        continue
      }
    }
  }
  return res
}
//获取t  输入[0,2] 返回[t1,t2]
function timeCalc(times){

  var res=[],s=times[0],e=times[1];

  for(var i=s;i<e;i++){
    res.push('t'+(i+1))
  }
  return res
}
//输入日期 和事件起止数组[0,1] 返回[日期 时间,日期 时间]
function s_e_time(day,timeArr){
  var res=[];
  var stime=timePointMap[timeArr[0]];
  var etime=timePointMap[timeArr[1]];
  if(timeArr[0]==2){
    stime=timePointMap[timeArr[0]].split('/')[1]
  }
  if(timeArr[1]==2){
    etime=timePointMap[timeArr[1]].split('/')[0]
  }
  res.push(day+' '+stime)
  res.push(day+' '+etime)
  return res
}
//输入 日期 时间数组 返回时间段数组[0,1]
function getSliderData(dateTimsArr){

  return getTimePonit(dateTimsArr[0].split(' ')[1]+'-'+dateTimsArr[1].split(' ')[1])

}
//对比新旧时间 返回对象{t1:0,t2:1....}
function tDiff(nArr){

  var res={};//s=timeCalc(getSliderData(oArr)),e=timeCalc(getSliderData(nArr))
  // oArr.map((i)=>{
  //   res[i]='0'
  // })

  for(let k in nArr){
    res[k]=nArr[k]

  }
  // nArr.map((i)=>{
  //   res[i]='1'
  // })
   return res
}
function mtDiff(nArr,id,name) {
  var res={};

  for(let k in nArr){

    //res['m'+k]=nArr[k]==='0'?'':id+'/'+name
    res['m'+k]=nArr[k]==='0'?'':'/'+name
  }
  return res
}
function tignore(userTs,ignore,ts){
  //debugger
  function difIgnore(t,ignore){
    for(var i=0;i<ignore.length;i++){
      if(t==ignore[i]){
        return true
      }
    }
  }
  for(var i=0;i<userTs.length;i++){
    if(difIgnore(userTs[i],ignore)){
      continue
    }
    if('1'==ts[userTs[i]] ) {
      return false
    }
  }
  return true
}

function getToday(){

  return moment().format('YYYY-MM-DD')
}
//计算Time_quantum字段用输入ts返回tx等于0的数组
function calcTime_quantum(ts) {
  let res=[];
  for(let k in ts){
    if(ts[k]!=='0'){
      res.push(k)
    }
  }
  console.log(res);
  return res
}
//用于计算新字段的参数
function calcMts(tArr,id,name) {
  let res={};
  //debugger
  console.log(tArr);
  tArr.map((i)=>{
    console.log(i);
    res['m'+i]=id+'/'+name;
  });
  return res
}
//返回flag标记order表执行insert还是update
function orderFlag(item) {

  for(let k in timeMap){
    if(item[k]==='0'&&item[k]){
      return false
    }
  }
  return true
}


//判断tags的值是否为空

function  checkTags(ts) {
  var count=0,err=0
  for(let k in ts){
    if(ts[k]==='0'){
      err++
    }
    count++
  }
  return count===err
}
export default {deptname,adminstuffid,otherstuffid,checkTags,mtDiff,orderFlag,calcMts,calcTime_quantum,getToday,tignore,tDiff,getSliderData,s_e_time,timeCalc,timeMap,timePointMap,getTimePonit,meetTpye,seeorderSerach}
