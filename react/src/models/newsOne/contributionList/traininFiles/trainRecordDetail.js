/**
 * 作者：韩爱爱
 * 日期：2020-11-09
 * 邮箱：hanai#jrtechsoft.com.cn
 * 功能：培训详情
 */
import { message } from "antd";
import Cookie from 'js-cookie';
import {routerRedux} from "dva/router";
import * as Services from '../../../../services/newsOne/newsOneServers'
export default {
  namespace: 'trainRecordDetail',
  loading: true,
  state:{
    judgeTableSource:[],//审批环节
    tuTableSource:[],//图片数据存储
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
          query: query.record,
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
      const {query,approvalId,difference} = yield select(v => v.trainRecordDetail);
      if(difference){
      let recData = {
        approval_id:approvalId
        };
      const response = yield call(Services.showTodoApprovalDetail, recData);
      if (response.retCode === '1') {
        if (response.dataRows.projApply.businessObj!=null) {
        const res = response.dataRows.projApply.businessObj.dataRows;
        let arrPian = [];
        if(res.trainingMaterial != '[]'){
          arrPian = JSON.parse( res.trainingMaterial);
        }else if(res.questionnaire != '[]' ){
        arrPian = JSON.parse( res.questionnaire);
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
          tuTableSource:arrPian,
          loading:false,
          taskid:response.dataRows.taskId,
          taskName:response.dataRows.taskName,
          bableid:response.dataRows.projApply.tableId,
          pass:response.dataRows.pass,
          }
        })
        }
      }else{
        message.error(response.retVal);
      }

      }else{
        let dataStr = {
        id:JSON.parse(query),
      };
      let data = yield call(Services.queryTrainDetail, dataStr);
      if(data.retCode == '1'){
        let arrPian = [];
        if(data.dataRows.trainingMaterial != '[]'){
          arrPian = JSON.parse( data.dataRows.trainingMaterial);
        }else if(data.dataRows.questionnaire != '[]' ){
         arrPian = JSON.parse( data.dataRows.questionnaire);
        }
        arrPian.map((item,index)=>{item.key=index});
        yield put({
          type: 'save',
          payload: {
            trainDetalils: JSON.parse(JSON.stringify(data.dataRows.trainName)),
            trainTime:data.dataRows.createTime.substring(0,10),
            personName:data.dataRows.personName,
            deptName:data.dataRows.deptName,
            trainType:data.dataRows.trainType,
            tuTableSource:arrPian,
            loading:false,
          }
        })
      }else{
        message.error(data.retVal)
      }
      }
      
    },
    //审批环节
    *queryTrainExamineItem({},{put,call,select}){
      const {bableid,query} = yield select(v => v.trainRecordDetail);
      let dataStr = {
        id:bableid?bableid:JSON.parse(query),
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
			const {taskid,auditProcess,isYearNews}= yield select (state =>state.trainRecordDetail);
	  
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
			const {taskid,tuihuiValue}= yield select (v =>v.trainRecordDetail);
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
        if (pathname === '/adminApp/newsOne/contributionList/trainingRecordIndex/trainRecordDetail') { //此处监听的是连接的地址
          dispatch({type: 'init', query});
        }
      });
    },
  },
}

