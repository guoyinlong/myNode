/**
 * 作者：韩爱爱
 * 日期：2020-11-18
 * 邮箱：hanai#jrtechsoft.com.cn
 * 功能：培训申请-培训申请详情
 */
import { message } from "antd";
import Cookie from 'js-cookie';
import {routerRedux} from "dva/router";
import * as Services from '../../../../services/newsOne/newsOneServers'
export default {
  namespace: 'trainAppDetail',
  loading: true,
  state:{
    judgeTableSource:[],//审批环节
    tuTableSource:[],//图片数据存储
    tuTableSource2:[],
    tuTableSource3:[],
    previewVisible: false,
    previewImage:'',
    query:'',
    trainDetalils:'',
    trainTime:'',
    personName:'',
    deptName:'',
    trainType:'',
    loading: true,
  },
  reducers:{
    save(state, action) {
      return { ...state,
        ...action.payload
      };
    },
  },
  effects: {
    * init({query}, {put, call}) {
      yield put({
        type: 'save',
        payload: {
          query: query,
          approvalId:query.approvalId,
          difference:query.difference
        }
      });
      yield put({
        type: 'queryTrainDetail'
      });
    },
    //详情
    *queryTrainDetail({},{put,call,select}){
      const {query,approvalId,difference,tuTableSource,tuTableSource2,tuTableSource3} = yield select(v => v.trainAppDetail);
      if(difference){
        let recData = {
          approval_id:approvalId
        };
        const response = yield call(Services.showTodoApprovalDetail, recData);
        if (response.retCode === '1') {
          if (response.dataRows.projApply.businessObj!=null) {
            const res = response.dataRows.projApply.businessObj.dataRows;
            let arrPian1=tuTableSource;
            let arrPian2 =tuTableSource2;
            let arrPian3 = s;
            if(data.dataRows.trainType == '线上'){
              arrPian1 = JSON.parse( data.dataRows.trainingMaterial);
              arrPian1.map((item,index)=>{item.key=index});
            }else if(data.dataRows.trainType == '线下'){
              arrPian2 = JSON.parse( data.dataRows.questionnaire);
              arrPian3 = JSON.parse( data.dataRows.signIn);
              arrPian3.map((item,index)=>{item.key=index});
              arrPian2.map((item,index)=>{item.key=index});
            }
            arrPian.map((item,index)=>{item.key=index});
            yield put({
              type: 'save',
              payload: {
                trainDetalils: JSON.parse(JSON.stringify(res.trainName)),
                trainTime:res.createTime.substring(0,10),
                personName:response.dataRows.userName,
                deptName:res.deptName,
                trainType:res.trainType,
                tuTableSource:arrPian1,
                tuTableSource2:arrPian2,
                tuTableSource3:arrPian3,
                loading:false,
                taskid:response.dataRows.taskId,
                taskName:response.dataRows.taskName,
                bableid:response.dataRows.projApply.tableId
              }
            })
          }
        }

      }else{
        let str =query.name==undefined ?false:true
        if(str != false){
          //批量
          let dataStr = {
            id:query.record,
          };
          let data = yield call(Services.queryTrainResultDetail, dataStr);
          if(data.retCode == '1'){
            let arrPian1=tuTableSource;
            let arrPian3 = tuTableSource3;
            if(data.dataRows.trainType == '线上'){
              if(data.dataRows.material.length !='0'){
                arrPian1.push(JSON.parse(data.dataRows.material));
              }
            }else if(data.dataRows.trainType == '线下'){
              if(data.dataRows.material.length !='0'){
                arrPian3.push(JSON.parse(data.dataRows.material));
              };
            }
            yield put({
              type: 'save',
              payload: {
                trainDetalils: JSON.parse(JSON.stringify(data.dataRows.trainName)),
                trainTime:data.dataRows.trainTime.substring(0,10),
                personName:data.dataRows.personName,
                deptName:data.dataRows.deptName,
                trainType:data.dataRows.trainType,
                tuTableSource:arrPian1,
                tuTableSource3:arrPian3,
                loading:false
              }
            })
          }else {
            message.error(data.retVal)
          }
        }else {
          let dataStr = {
            id:query.record,
          };
          let data = yield call(Services.queryTrainDetail, dataStr);
          if(data.retCode == '1'){
            let arrPian1=tuTableSource;
            let arrPian2 =tuTableSource2;
            let arrPian3 = tuTableSource3;
            if(data.dataRows.trainType == '线上'){
              arrPian1 = JSON.parse( data.dataRows.trainingMaterial);
              arrPian1.map((item,index)=>{item.key=index});
            }else if(data.dataRows.trainType == '线下'){
              arrPian2 = JSON.parse( data.dataRows.questionnaire);
              arrPian3 = JSON.parse( data.dataRows.signIn);
              arrPian3.map((item,index)=>{item.key=index});
              arrPian2.map((item,index)=>{item.key=index});
            }
            yield put({
              type: 'save',
              payload: {
                trainDetalils: JSON.parse(JSON.stringify(data.dataRows.trainName)),
                trainTime:data.dataRows.createTime.substring(0,10),
                personName:data.dataRows.personName,
                deptName:data.dataRows.deptName,
                trainType:data.dataRows.trainType,
                tuTableSource:arrPian1,
                tuTableSource2:arrPian2,
                tuTableSource3:arrPian3,
                loading:false
              }
            })
          }else {
            message.error(data.retVal)
          }
        }
      }
    }, 
    //审批环节
    *queryTrainExamineItem({},{put,call,select}){
      const {bableid,query} = yield select(v => v.trainAppDetail);
      let dataStr = {
        id:bableid?bableid:query.record,
      };
      let data = yield call(Services.queryTrainExamineItem, dataStr);
      if(data.retCode == '1'){
        data.dataRows.map((item,index)=>{
          item.key =index;
          if(item.state == '0'){
            item.state = '办理中';
          }else if(item.state == '1'){
            item.state = '办必';
          }
          if(item.commentDetail){
            if(JSON.parse(item.commentDetail).endApply==false){
              item.commentDetail="不同意："+JSON.parse(item.commentDetail).opinion

            }else if(JSON.parse(item.commentDetail).endApply==true){
              item.commentDetail="同意"
            } else{
              item.commentDetail="重新提交"
            }

          }
        });
        yield put({
          type:'save',
          payload:{
            judgeTableSource:JSON.parse(JSON.stringify(data.dataRows))
          }
        })
      }else {
        message.error(data.retVal)
      }
    },
    //返回
    *return({},{put}){
      yield put(routerRedux.push({
        pathname:'/adminApp/newsOne/contributionList/trainingRecordIndex',
      }));
    },
    //下载
    *downloadUpload({reacd},{}){
      let url = reacd.RelativePath;
      window.open(url);
    },
    //图片放大
    *handlePreview({text,name},{put}){
      if(name == '打开'){
        yield put({
          type:'save',
          payload:{
            previewVisible:true,
            previewImage:text.RelativePath
          }
        })
      }else if(name == '关闭'){
        yield put({
          type:'save',
          payload:{
            previewVisible:false
          }
        })
      }
    },
    //同意审核
    * onAgree({},{call, put,select}){
      const {taskid,auditProcess,isYearNews}= yield select (state =>state.trainAppDetail);

      let recData={
        user_id:Cookie.get('userid'),
        user_name:Cookie.get('username'),
        form:JSON.stringify({endApply:true,isYearOrOutNews:auditProcess,isYearNews:isYearNews}),
        task_id:taskid,
      };
      const response = yield call(Services.completeTask, recData);
      if(response.retCode === '1'){
        if(response.dataRows){
          message.info('审核成功');
          yield put(routerRedux.push({
            pathname:'/adminApp/newsOne/myReview'
          }))
        }
      }else{
        message.error(response.retVal);
      }

    },
    //回退原因
    * tuihui({record},{call, put,select}){
      if(record.length<200){
        yield put({
          type:'save',
          payload: {
            tuihuiValue: record,
          }
        })
      }else{
        message.info("不能超过200个字符")
      }


    },
    // 确定回退
    * handle({},{call, put,select}){
      const {taskid,tuihuiValue}= yield select (v =>v.trainAppDetail);
      if(tuihuiValue==""){
        message.info("请填写退回原因")
      }else{
        let recData={
          user_id:Cookie.get('userid'),
          user_name:Cookie.get('username'),
          form:JSON.stringify({endApply:false,opinion:tuihuiValue}),
          task_id:taskid,
        };
        const response = yield call(Services.completeTask, recData);
        if(response.retCode === '1'){
          if(response.dataRows){
            message.info('退回成功');
            yield put(routerRedux.push({
              pathname:'/adminApp/newsOne/myReview'
            }))
            yield put({
              type:'save',
              payload: {
                tuihuiValue: "",
              }
            })

          }
        }else{
          message.error(response.retVal);
        }
      }

    }
  },
  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/newsOne/contributionList/trainAppIndex/trainAppDetail') { //此处监听的是连接的地址
          dispatch({type: 'init', query});
        }
      });
    },
  },
}

