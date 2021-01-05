/**
 * 作者：贾茹
 * 日期：2020-10-20
 * 邮箱：18311475903@163.com
 * 文件说明：新闻共享平台-宣传渠道备案模块详情页面
 */

import Cookie from 'js-cookie';
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as newsOneService from '../../../services/newsOne/newsOneServers.js';
import { HardwareDesktopWindows } from 'material-ui/svg-icons';

export default {
  namespace: 'publicityChannelsDetails',
  state: {
    dataInfo:[], //详情数据
    passData:{},  //待办列表页面跳转传递的数据
    judgeTableSource:[],      //审批环节table数据
    tableUploadFile:[],       //上传文件查询
    type:"",
    tuihuiValue:"",//退回原因
    approvalid:"",//审核id
    difference:"",//审核
    tuihuiValue:"",//退回原因
    taskName:"",//环节名字
    taskid:"",//环节点id
    tableid:"null",//稿件id
  },

  reducers: {
    save(state, action) {
      return { ...state,
        ...action.payload
      };
    },
    //审批时长计算
    calculation(time1,time2){
        let a = time1.getTime()   //创建时间
        let b = time2.getTime()   //审批完成时间
        let req = b-a
        let hours = parseInt((data % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = parseInt((data % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = (data % (1000 * 60)) / 1000;
        let s = (hours < 10 ? ('0' + hours) : hours) + ':' + (minutes < 10 ? ('0' + minutes) : minutes) + ':' + (seconds < 10 ? ('0' + seconds) : seconds);
        return s;
    }
  },

  effects: {
    * init({query}, {call, put}) {
        yield put({
          type:'save',
          payload:{
            passData:query.approvalId?query.approvalId:JSON.parse(query.record),
            approvalid:query.approvalId,
            difference:query.difference,
            tuihuiValue:"",
          }
        })
        yield put({
          type:'taskInfoSearch'
        })
        // yield put({
        //   type:'judgeHistory'
        // })
    },

    //详情数据查询
    * taskInfoSearch({}, {select,call, put}){
      const {passData,difference,approvalid} = yield select(state=>state.publicityChannelsDetails);
      //审核
			  if(difference){
          let recData = {
            approval_id:approvalid
            };
          const response = yield call(newsOneService.showTodoApprovalDetail, recData);
          if (response.retCode === '1') {
          if (response.dataRows.projApply.businessObj!=null) {
            const res = response.dataRows.projApply.businessObj.dataRows;
            yield put({
            type: 'save',
            payload: {
              dataInfo: res,
              taskid:response.dataRows.taskId,
              taskName:response.dataRows.taskName,
              type:difference,
              tableid:response.dataRows.projApply.tableId,
              pass:response.dataRows.pass,
            }
            })
          }
          }else{
          message.error(response.retVal);
          }

           }else{
              let recData={
                id :passData.id,//| VARCHAR(32) | 是 | 环节id
              };
              const response = yield call(newsOneService.queryPublicityChannelDetail,recData);
              if(response.retCode === '1'){
                if(response.dataRows){
                  const res = response.dataRows;
                yield put({
                  type:'save',
                  payload:{
                    dataInfo:res
                  }
                })
                }
              }
           }
    },
    //审批环节调取服务/queryRecordExamineItem
    * judgeHistory({}, { call, put, select }){

      const { passData,tableid } = yield select(state=>state.publicityChannelsDetails);
      const recData={
        id:tableid!="null"?tableid:passData.id,// | VARCHAR(32)| 是 |申请单id
      };
      const response = yield call(newsOneService.queryRecordExamineItem,recData);
      if(response.retCode=== '1' ){
        if(response.dataRows){
          const res = response.dataRows;
          res.map((item, index) => {
            if (item.state == "0") {
              item.failUnm = "办理中"
              } else if (item.state == "1") {
              item.failUnm = "办毕"
              }
              if(item.commentDetail){
                if(JSON.parse(item.commentDetail).endApply==false){
                item.commentDetail="不同意："+JSON.parse(item.commentDetail).opinion
    
                }else if(JSON.parse(item.commentDetail).endApply==true){
                  item.commentDetail="同意"
                } else{
                  item.commentDetail="重新提交"
                }  
                let a = new Date(Date.parse(item.commentTime.replace(/-/g,"/"))).getTime()
                let b = new Date(Date.parse(item.createTime.replace(/-/g,"/"))).getTime()
                item.dataTimes = a-b
    
              }else{
                item.dataTimes=""
              }
            
            item.key = index;
            item.type = '1';

           
          });
          yield put({
            type:'save',
            payload:{
              judgeTableSource:res
            },
          });
          yield put({
            type:'reqTimes',
          });
        }
      };

    },
    *reqTimes({}, {select,put }){
      const { judgeTableSource } = yield select(state=>state.publicityChannelsDetails);
      var hours
      judgeTableSource.map((item, index) => {
        hours = (item.dataTimes % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)).toFixed(2);
        let a = hours.substring(0,4)
        if(a=="0.00"){
          item.reqTimes=item.state == "0"?"":'几分钟内就完成了'
        }else{
         item.reqTimes = a + '小时' 
        }
      });
      yield put({
        type:'save',
        payload:{
          judgeTableSource:judgeTableSource
        }
      })

    },

    //返回上一级
    * return ({}, {select,put}){
        history.back(-1);
    },

    //同意审核
		* onAgree({},{call, put,select}){
			const {taskid}= yield select (state =>state.publicityChannelsDetails);

			let recData={
			  user_id:Cookie.get('userid'),
			  user_name:Cookie.get('username'),
			  form:JSON.stringify({endApply:true}),
			  task_id:taskid,
			};
			const response = yield call(newsOneService.completeTask, recData);
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
			const {taskid,tuihuiValue}= yield select (v =>v.publicityChannelsDetails);
			let recData={
			  user_id:Cookie.get('userid'),
			  user_name:Cookie.get('username'),
			  form:JSON.stringify({endApply:false,opinion:tuihuiValue}),
			  task_id:taskid,
			};
			const response = yield call(newsOneService.completeTask, recData);
			if(response.retCode === '1'){
			  if(response.dataRows){
				message.info('退回成功');
					  yield put(routerRedux.push({
						  pathname:'/adminApp/newsOne/myReview'
					  }))
			  }
			}else{
			  message.error(response.retVal);
			}
		  }


  },

  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/newsOne/publicityChannelsIndex/publicityChannelsDetails') { //此处监听的是连接的地址
          dispatch({
            type: 'init',
            query
          });
        }
      });
    },
  },
};
