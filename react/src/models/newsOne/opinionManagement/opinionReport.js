/**
 * 作者：窦阳春
 * 日期：2020-10-26
 * 邮箱：douyc@itnova.com.cn
 * 文件说明：新闻共享平台-舆情管理详情
 */
import Cookie from 'js-cookie'; 
import { routerRedux } from 'dva/router';
import { message } from "antd";
import * as Services from '../../../services/newsOne/newsOneServers';

export default {
	namespace: 'opinionReport',
	state: {
		id: '', //二级舆情id
		flagPage: '', //修改 详情flag
		detailData: [],
		processList: [], //审批环节数据
	},
	reducers: {
		save(state, action) {
			return { ...state,
				...action.payload
			};
		},
	},

	effects: {
		*init({query}, {put}) {
			yield put({
				type:'save',
				payload:{
					approval_id: query.newsId,
					difference:query.difference
				}
			})
			yield put({
				type:'queryPubSentimentItem',
			})
		},
		*queryPubSentimentItem({}, {call,put,select}) { //详情查询
			
			const {approval_id,difference} = yield select(v =>v.opinionReport)
			if(difference=="审核"){
				let recData = {
					approval_id
				};
				const response = yield call(Services.showTodoApprovalDetail, recData);
				if (response.retCode === '1') {
					if (response.dataRows.projApply.businessObj!=null) {
						const res = response.dataRows.projApply.businessObj.dataRows;
						yield put({
							type: 'save',
							payload: {
								detailData: res,
								// id: query.id,
								taskid:response.dataRows.taskId,
								taskName:response.dataRows.taskName,
								tableId:response.dataRows.projApply.tableId,
								tuihuiValue:"",
								pass:response.dataRows.pass,
							}
						})
					}
				}else{
					message.error(response.retVal);
				}
			}else{
				let recData = {
					id:approval_id
				};
				let data = yield call(Services.queryPubSentimentItem, recData)
				if(data.retCode == '1') {
					yield put({
						type: 'save',
						payload: {
							detailData: data.dataRows,
							// id: query.id
						}
					})
				}else{
					message.error( '查询失败' + data.retVal)
				}
		  }
		},
		*queryPubSentimentExamineItem({}, {call, put, select}) { //舆情审批环节查询
			const {approval_id,tableId} = yield select(v => v.opinionReport)
			let recData = {
				id:tableId?tableId:approval_id
			};
			let data = yield call(Services.queryPubSentimentExamineItem,recData)
			if(data.retCode == '1') {
				data.dataRows.map((v, i) => {
					v.key = i+1;
					v.state = v.state == '0' ? '办理中' : '办毕';
					v.commentDetail = v.commentDetail == '' ? '' 
					: v.commentDetail == '{}' ? '提交'
					: JSON.parse(v.commentDetail).endApply == true ? '同意' 
					: JSON.parse(v.commentDetail).endApply == false ? JSON.parse(v.commentDetail).opinion : '';
				})
				yield put({
					type: 'save',
					payload: {
						processList: data.dataRows,
					}
				})
			}else{
				message.error( '查询失败' + data.retVal)
			}
		},
		//同意审核
		*onAgree({},{call, put,select}){
			const {taskid,auditProcess,isYearNews}= yield select (state =>state.opinionReport);
			let recData={
				user_id:Cookie.get('userid'),
				user_name:Cookie.get('username'),
				form:JSON.stringify({endApply:true,isYearOrOutNews:auditProcess,isYearNews:isYearNews}),
				task_id:taskid,
			};
			const response = yield call(Services.completeTask, recData); 
			if(response.dataRows.RetCode === '1'){
				if(response.dataRows.DataRows){
					message.info('审核成功');
					yield put(routerRedux.push({
						pathname:'/adminApp/newsOne/myReview'
					}))
				}
			}else{
				message.error(response.dataRows.RetVal);
			}
		},
	  //回退原因
		*tuihui({record},{call, put,select}){
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
		*handle({},{call, put,select}){
			const {taskid,tuihuiValue}= yield select (v =>v.opinionReport);
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
				if(response.dataRows.RetCode === '1'){
					if(response.dataRows.DataRows){
					message.info('退回成功');
						yield put(routerRedux.push({
							pathname:'/adminApp/newsOne/myReview'
						}))
					}
				}else{
					message.error(response.dataRows.RetVal);
				}
			}
		}
	},

	subscriptions: {
		setup({
			dispatch,
			history
		}) {
			return history.listen(({
				pathname,
				query
			}) => {
				if (pathname === '/adminApp/newsOne/opinionManagementIndex/opinionReport') { //此处监听的是连接的地址  //
					dispatch({
						type: 'init',
						query
					});
				}
			});
		},
	},
};