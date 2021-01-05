/**
 * 作者：窦阳春
 * 日期：2020-10-28
 * 邮箱：douyc@itnova.com.cn
 * 功能：争优创先-新闻工作报告新增页，修改页
 */
import { message } from "antd";
import * as Services from '../../../services/newsOne/newsOneServers';
import { routerRedux } from "dva/router";
export default {
	namespace: 'newsReportAdd',
	loading: false, 
	state: {
		reportName: '', //报告名称
		workSummary: '',
		questionAndMethod: '',
		nextWorkPlan: '',
		page: '',
		id: '',
		taskId:""
	},
	reducers: { // 刷新数据
		save(state, action) {
			return { ...state,
				...action.payload
			};
		},
	},
	effects: {
    *saveValue({flag, value}, {put}) { // 保存
			let param = {};
			param[flag] = value
			yield put({
				type: 'save',
				payload: param
			})
		},
		*action({}, {put}) {
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
		*init({}, {put}) {//新增页面
			yield put({
				type: 'save',
				payload: {
					reportName: '', 
					workSummary: '',
					questionAndMethod: '',
					nextWorkPlan: '',
					page: '填报'
				}
			})
		},
		*modifyInit({query}, {put, call}) { //修改页面
			const {id} = JSON.parse(query.record)
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
						// detailData: res,
						reportName: res.reportName, 
						workSummary: res.questions,
						questionAndMethod: res.workSummary,
						nextWorkPlan: res.workPlan,
						page: '修改',
						id,
						taskId:response.dataRows.taskId,//环节id
						tableId:response.dataRows.projApply.tableId,
						difference:query.difference
					}
					})
				}
				}else{
				message.error(response.retVal);
				}

			}else{
			let data = yield call(Services.selectOneDetail, {id});
			if(data.retCode == '1') {
				const {workPlan, reportName, workSummary, questions} = data.dataRows
				yield put({
					type: 'save',
					payload: {
						reportName: reportName, 
						workSummary: questions,
						questionAndMethod: workSummary,
						nextWorkPlan: workPlan,
						page: '修改',
						id
					}
				})
			}else{
				message.error(data.retVal)
			}
			}
			
		},
		*submit({flag}, {call, put, select}){ //提交
			const {reportName, workSummary, questionAndMethod, nextWorkPlan, page, id,taskId,tableId,difference} = yield select(v=>v.newsReportAdd);
			if( flag == '1' && (reportName == '' || workSummary == '' || questionAndMethod == '' || nextWorkPlan == '')) {
				message.destroy();
				message.info('请填写所有字段');
				return
			}else if(flag == '0' && (reportName == '')) {
				message.destroy();
				message.info('请填写报告名称');
				return
			}
			let postData = {
				reportName,
				workSummary,
				questions: questionAndMethod,
				workPlan: nextWorkPlan,
				flag	,
				taskId	:taskId	,
				id:tableId?tableId:id
			}
			let action = page == '修改' ? 'updateNewsReport' : 'addNewsReport';
			postData = page == '修改' ? {...postData, } : postData;
			let data = yield call(Services[action], postData)
			if(data.retCode == '1') {
				message.destroy();
				message.success((flag=='0' ? '保存' : '填报') + '成功！');
				if(difference){
					yield put(routerRedux.push({
						pathname: '/adminApp/newsOne/myReview',
						query:  { key: '2' }
					}));
				}else{
					yield put(routerRedux.push({
						pathname: '/adminApp/newsOne/creatExcellence',
						query:  { key: '2' }
					}));
				}
				
				yield put({
					type: 'save',
					payload: {
						reportName: '', 
						workSummary: '',
						questionAndMethod: '',
						nextWorkPlan: '',
					}
				})
			}else {
				message.destroy();
				message.error(data.retVal)
			}
		},
	},
	subscriptions: {
		setup({dispatch, history}) {
			return history.listen(({pathname, query}) => {
				if (pathname === '/adminApp/newsOne/creatExcellence/newsReportAdd') {
					dispatch({type: 'init', query}); 
			  }else if(pathname === '/adminApp/newsOne/creatExcellence/newsReportModify') {
					dispatch({type: 'modifyInit', query}); 
				}   
			}); 
		},
	},
}
