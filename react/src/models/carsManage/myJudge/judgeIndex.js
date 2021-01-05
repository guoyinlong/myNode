/**
 * 作者：窦阳春
 * 日期：2020-09-21
 * 邮箱：douyc@itnova.com.cn
 * 功能：我的审核首页
 */
import { message } from "antd";
import { data } from "jquery";
import * as Services from '../../../services/carsManage/carsManageServices';
export default {
	namespace: 'judgeIndex',
	loading: true, 
	state: {
		pageCurrent: 1, //当前页
		rowCount: 0, //总页数
		allCount: 0,
		pageCurrent2: 1, //当前页
		rowCount2: 0, //总页数
		allCount2: 0,
		doList: [], // 已办列表
		todoList: [], // 待办列表
		flag: ''
	},
	reducers: { // 刷新数据
		save(state, action) {
			return { ...state,
				...action.payload
			};
		},
	},
	effects: {
		*init({page}, {put, call, select}) { 
			const {pageCurrent} = yield select(v=>v.judgeIndex)
			let postData = {
				pageCurrent: page || pageCurrent
			}
			let response = yield call(Services.todoList, postData);
			if(response.retCode == '1') {
				response.dataRows.map((v, i) => {v.key = i; v.updateTime = v.updateTime.slice(0, -2)})
				yield put({
					type: 'save',
					payload: {
						todoList: response.dataRows,
						pageCurrent: response.pageCurrent,
						rowCount: response.rowCount,
						allCount: response.allCount,
					}
				})
			}else{
				message.error(response.retVal)
			}
		},
		*deleteTodo({idArr}, {call, put}) {
			console.log(idArr, 'idArr')
			let data = yield call(Services.delBathCarDemand, {demandIds: idArr.join()})
			if(data.retCode == '1') {
				message.success("删除成功")
				yield put({type: 'init'})
			}else{
				message.error("删除失败！ " + data.retVal)
			}
		},
		*doList({page}, {put, call, select}) { 
			const {pageCurrent2} = yield select(v=>v.judgeIndex)
			let postData = {
				pageCurrent: page || pageCurrent2
			}
			let response = yield call(Services.doList, postData)
			if(response.retCode == '1') {
				response.dataRows.map((v, i) => {v.key = i; v.approvalLinkTime = v.approvalLinkTime.slice(0, -2)})
				yield put({
					type: 'save',
					payload: {
						doList: response.dataRows,
						pageCurrent2: response.pageCurrent,
						rowCount2: response.rowCount,
						allCount2: response.allCount
					}
				})
			}else{
				message.error(response.retVal)
			}
		},
	},
	subscriptions: {
		setup({dispatch, history}) {
			return history.listen(({pathname, query}) => {
				if (pathname === '/adminApp/carsManage/myJudge') { //此处监听的是连接的地址
					dispatch({type: 'init', query}); 
				}   
			}); 
		},
	},
}
