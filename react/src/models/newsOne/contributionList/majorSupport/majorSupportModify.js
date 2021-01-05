/**
 * 作者：韩爱爱
 * 日期：2020-11-25
 * 邮箱：hanai#jrtechsoft.com.cn
 * 功能：全院新闻工作贡献清单-重大活动支撑首页-修改
 */
import { message } from "antd";
import * as Services from '../../../../services/newsOne/newsOneServers'
import {routerRedux} from "dva/router";
export default {
  namespace: 'majorSupportModify',
  loading: true,
  state:{
    mobileName:'',//活动名称
    cobileTime:'',//活动时间
    eventWork:['摄影','摄像','H5制作','视频剪辑','新闻稿','微博稿','其他'],// 活动中担任工作
    eventWorkArr:[],
    previewVisible: false,
    evenArr:[],
    evenArrQue:[],
    wenInput:'', //其他
    eventNum:false,//其他是否显示
    pictureList:'',//图片存放
    shareResult:[],//表格数据
    loading:false,
    query:'',
    queryId:''
  },
  reducers:{
    save(state, action) {
      return { ...state,
        ...action.payload
      };
    },
  },
  effects: {
    * init({query}, {put}) {
      yield put({
        type:'save',
        payload:{
          id:query,
          approvalId:query.approvalId,
          difference:query.difference
        }
      });
      yield put({
        type: 'queryActivityItem'
      })
    },
    //详情
   * queryActivityItem({record},{put, select,call}){
     const  {id,eventWork,evenArrQue,eventNum,wenInput,eventWorkArr,approvalId,difference} = yield select(v => v.majorSupportModify);
    if(difference){
      let recData = {
        approval_id:approvalId
      };
      const response = yield call(Services.showTodoApprovalDetail, recData);
      var data=response.dataRows.projApply.businessObj
      var task=response.dataRows.taskId
      var table=response.dataRows.projApply.tableId
    }else{
       const dataStr={id:id.approvalId};
       var data=yield call (Services.queryActivityItem,dataStr);
    }
    
     if(data.retCode =='1'){
        let arrPian = JSON.parse('['+ data.dataRows.proveImage+']');
        let daraJob=data.dataRows.job;
        let eventNums =eventNum;
        let wenInputs =wenInput;
        let arrJob1  =[];let arrJob2 =[];let totalJob =[];let arrJob =[];let arrJob3  =[];
        //分割符号
        if(daraJob.indexOf(",") == -1){
          if(daraJob.indexOf('"') == -1){
            arrJob3.push(daraJob);
            arrJob3.map(item=>{
              if(eventWork.indexOf(item)  >  -1){
                evenArrQue.push(item);
                eventNums =false;
              }else {
                eventNums =true;
                wenInputs =item;
                evenArrQue.push('其他');
              }
            })
          }else {
            arrJob3.push(daraJob.replace(/\"/g, ""));
            arrJob3.map(item=>{
              if(eventWork.indexOf(item)  > -1){
                arrJob2.push(item);
                eventNums =false;
              }else {
                eventNums =true;
                wenInputs =item;
                arrJob1.push('其他');
              }
            });
            totalJob = arrJob1.concat(arrJob2);
            totalJob.map(item=>{
              evenArrQue.push(item)
            })
          }
        }else {//符合
          arrJob= JSON.parse('['+ daraJob+']');
          arrJob.map(item=>{
            if(eventWork.indexOf(item) > -1){
              arrJob2.push(item);
              eventNums =false;
            }else{
              arrJob1.push('其他');
              eventNums =true;
              wenInputs =item;
            }
          });
          totalJob = arrJob1.concat(arrJob2);
          totalJob.map(item=>{
            evenArrQue.push(item)
          })
        }
       yield put({
         type:'save',
         payload:{
           mobileName:data.dataRows.activityName,
           cobileTime:data.dataRows.activityTime +' 00:00:00',
           shareResult:arrPian,
           queryId:data.dataRows.id,
           loading:false,
           eventNum:eventNums,
           wenInput:wenInputs,
           evenArrQue:evenArrQue,
           eventWork:eventWork,
           eventWorkArr:evenArrQue,
           taskid:task?task:"",
					 tableid:table,
         }
       });
     }else {
       message.error(data.retVal)
     }
   },
    //活动名称
    *mobileVlaue({record}, {put}){
      yield put({
        type:'save',
        payload:{
          mobileName:record.target.value
        }
      })
    },
    //活动时间
    *changeDate({startTime}, {put}){
      yield put({
        type:'save',
        payload:{
          cobileTime:startTime
        }
      })
    },
    //活动证明材料上传
    *pictureChange({record},{put, select}){
      const  {shareResult} = yield select(v => v.majorSupportModify);
      if (record.file.status === 'done') {
        if (record.file.response.RetCode === '1') {
          shareResult.push(record.file.response.filename);
          yield put({
            type: 'save',
            payload: {
              shareResult:JSON.parse(JSON.stringify(shareResult)),
              loading: false,
            }
          });
        }
      }else if (record.file.status === 'error') {
        message.error(`${record.file.name} 上传失败！.`);
      } else  if(record.file.status === 'uploading'){
        yield put({
          type: 'save',
          payload: {
            loading: true,
          }
        })
      }
    },
    // 活动中担任工作
    *eventVlaue({record}, {put,select}){
      if(record.indexOf("其他") > -1){
         yield put({
           type: 'save',
           payload: {
             eventNum: true,
             eventWorkArr:record
           }
         })
       } else {
         yield put({
           type: 'save',
           payload: {
             eventNum: false,
             eventWorkArr:record
           }
         })
       }
    },
    // 活动中担任工作 -其他
    *otherVlaue({record}, {put,select}){
      let recordInput= record.target.value;
      yield put({
        type:'save',
        payload:{
          wenInput:recordInput,
        }
      })
    },
    //图片放大
    *handlePreview({record,text},{put}){
      if(record == '打开'){
        yield put({
          type:'save',
          payload:{
            previewVisible:true,
            previewImage:text.RelativePath
          }
        })
      }else if(record == '关闭'){
        yield put({
          type:'save',
          payload:{
            previewVisible:false
          }
        })
      }
    },
    //删除
    *trainingDelete({record},{select, put}){
      const  {shareResult} = yield select(v => v.majorSupportModify);
      for (let i = 0; i < shareResult.length; i++) {
        const a = shareResult.filter(v => v.RelativePath !== record.RelativePath);
        yield put({
          type: 'save',
          payload: {
            shareResult: JSON.parse(JSON.stringify(a)),
          }
        })
      }
    },
    *submission({record},{select, put,call}){
      const  {mobileName,cobileTime,eventWork,shareResult,queryId,eventWorkArr,wenInput,taskid,tableid} = yield select(v => v.majorSupportModify);
      if(record == '保存'){
        eventWorkArr.map((item,index)=>{
          if(item == '其他'){
            if(wenInput == ''){
              message.info('必填项不能为空')
            }else {
              eventWorkArr.splice(index,1,wenInput)
            }
          }
        });
          const dataStr={
            activityName:mobileName.toString(),
            activityTime :cobileTime.toString(),
            job:JSON.stringify(eventWorkArr).replace(/\[|]/g,''),
            proveImage:JSON.stringify(shareResult).replace(/\[|]/g,''),
            id:tableid?tableid:queryId,
            taskId:taskid,
            flag:"0",
            
          };
          let data = yield call(Services.updateActivity, dataStr);
          if(data.retCode =='1'){
            message.info('保存成功');
            yield put(routerRedux.push({
              pathname:'/adminApp/newsOne/contributionList/majorSupportIndex',
            }));
          }else {
            message.error(data.retVal)
          }
        
      }else if(record == '提交'){
        eventWorkArr.map((item,index)=>{
          if(item == '其他'){
            if(wenInput == ''){
              message.info('必填项不能为空')
            }else {
              eventWorkArr.splice(index,1,wenInput)
            }
          }
        });
        if(mobileName == ''||cobileTime == ''||eventWork==''||shareResult.length==0 ){
          message.info('必填项不能为空')
        }else {
          const dataStr={
            activityName:mobileName.toString(),
            activityTime :cobileTime.toString(),
            job:JSON.stringify(eventWorkArr).replace(/\[|]/g,''),
            proveImage:JSON.stringify(shareResult).replace(/\[|]/g,''),
            id:tableid?tableid:queryId,
            taskId:taskid,
            flag:"1",
          };
          let data = yield call(Services.updateActivity, dataStr);
          if(data.retCode =='1'){
            message.info('提交成功');
            yield put(routerRedux.push({
              pathname:'/adminApp/newsOne/contributionList/majorSupportIndex',
            }));
          }else {
            message.error(data.retVal)
          }
        }
      }else if(record == '取消'){
        yield put(routerRedux.push({
          pathname:'/adminApp/newsOne/contributionList/majorSupportIndex',
        }));
      }
    }
  },
  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/newsOne/contributionList/majorSupportIndex/majorSupportModify') { //此处监听的是连接的地址
          dispatch({type: 'init', query});
        }else {
          window.location.reload();
        }
      });
    },
  },
}