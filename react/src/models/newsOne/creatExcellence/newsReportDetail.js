/**
 * 作者：窦阳春
 * 日期：2020-10-13 
 * 邮箱：douyc@itnova.com.cn
 * 功能：争优创先首页
 */
import { message } from "antd";
import Cookie from 'js-cookie';
import * as Services from '../../../services/newsOne/newsOneServers';
import { param } from "jquery";
import { months } from "moment";
import { routerRedux } from "dva/router";
let month = new Date().getMonth()+1;
export default {
	namespace: 'newsReportDetail',
	loading: false, 
	month: new Date().getMonth()+1,
	state: {
		detailData: {},
		id: '',
		examineItemData: []
	},
	reducers: { // 刷新数据
		save(state, action) {
			return { ...state,
				...action.payload
			};
		},
	},
	effects: {
    *saveValue({flag, value, time}, {put}) { // 保存
			let param = {}
			time=='time' ? param['pickTime'] = value : param[flag] = value
			yield put({
				type: 'save',
				payload: param
			})
		},
		*action({flag}, {call, select, put}) {
			yield put({
				type: 'save',
				payload: {
					pageCurrent: 1,
					reportName: '',
					pickTime: ''
				}
			})
			yield put({
				type: 'queryNewsReportLike', 
				emptyPostData: {
					pageCurrent: 1,
					reportName: '',
					pickTime: ''
				}
			})
		},
		*selectOneDetail({query}, {call, put, select}) {
			yield put({
				type: 'save',
				payload: {
					detailData: "",
					taskid:"",
					difference:""
				}
				})
		  const {id} = JSON.parse(query.record)
			  //审核
			  if(query.difference){
				let recData = {
					approval_id:query.record
				  };
				const response = yield call(Services.showTodoApprovalDetail, recData);
				if (response.retCode === '1') {
				if (response.dataRows.projApply.businessObj!=null) {
					const res = response.dataRows.projApply.businessObj.dataRows;
					yield put({
					type: 'save',
					payload: {
						detailData: res,
						taskid:response.dataRows.taskId,
						difference:query.difference,
						taskName:response.dataRows.taskName,
						tableId:response.dataRows.projApply.tableId,
						pass:response.dataRows.pass,
					}
					})
				}
				}else{
				message.error(response.retVal);
				}

				 }else{
				yield put({
					type: 'save', 
					payload: {
						detailData: JSON.parse(query.record),
						id:id?id:approvalId,
						// difference:query.difference
					}})
			  }
		},
		*queryReportExamineItem({}, {call, put, select}) {
	  const {id,tableId} = yield select(v=>v.newsReportDetail)
	  let recData = {
		id:tableId?tableId:id
	  };
			let data = yield call(Services.queryReportExamineItem, recData);
			if(data.retCode == '1') { 
				data.dataRows.map((v, i) => {
					if(v.commentDetail){
						if(JSON.parse(v.commentDetail).endApply==false){
						v.commentDetail="不同意："+JSON.parse(v.commentDetail).opinion
						}else if(JSON.parse(v.commentDetail).endApply==true){
						  v.commentDetail="同意"
						} else{
						  v.commentDetail="重新提交"
						}  
					  }
					  if (v.state == "0") {
						v.failUnm = "办理中"
					} else if (v.state == "1") {
						v.failUnm = "办毕"
					}
					v.key = i+1;
					v.state = v.state == '0' ? '办理中' : '办毕'

				});
			yield put({
				type: 'save', 
				payload: {
					examineItemData: data.dataRows
				}})
			}else {
				message.info(data.retVal)
      		}
		},
		//同意审核
		* onAgree({},{call, put,select}){
			const {taskid}= yield select (state =>state.newsReportDetail);
	  
			let recData={
			  user_id:Cookie.get('userid'),
			  user_name:Cookie.get('username'),
			  form:JSON.stringify({endApply:true}),
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
			const {taskid,tuihuiValue}= yield select (v =>v.newsReportDetail);
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
			  }
			}else{
			  message.error(response.retVal);
			}
		  }
	},
	subscriptions: {
		setup({dispatch, history}) {
			return history.listen(({pathname, query}) => {
				if (pathname === '/adminApp/newsOne/creatExcellence/newsReportDetail') { //此处监听的是连接的地址
					dispatch({type: 'selectOneDetail', query}); 
			  }   
			}); 
		},
	},
}
