/**
 * 作者：窦阳春
 * 日期：2020-09-16
 * 邮箱：douyc@itnova.com.cn
 * 功能：用车记录
 */
import { message } from "antd";
import * as Services from '../../../services/carsManage/carsManageServices';
export default {
	namespace: 'queryIndex',
	loading: true, 
	state: {
		tableData: [],
		startTime: '',
		endTime: '',
		carsApplyType: '', //用车申请类型
		state: '',
		pageCurrent: 1,
		allCount: 1
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
			let {startTime, endTime, pageCurrent, state, carsApplyType} = yield select(v=> v.queryIndex)
			let postData = {
				pageCurrent: page || pageCurrent,
				RowCount: 10,
				startTime,
				endTime,
				state: Number(state),
				type: Number(carsApplyType)
			}
			carsApplyType == '' ? delete postData.type : postData.type = carsApplyType;
			state == '' ? delete postData.state : postData.state = state;
			startTime == '' ? delete postData.startTime : postData.startTime = startTime;
			endTime == '' ? delete postData.endTime : postData.endTime = endTime;
			let response = yield call(Services.carsHistory, postData)
			if(response.retCode == '1') {
				response.dataRows.map((v, i)=> {
					v.key = i+1;
					v.stateTxt =  v.state == '0' ? '草稿' : v.state == '1' ? '待审批' : v.state == '2' ? '审批通过' 
					: v.state == '3' ? '审批退回' : v.state == '4' ? '申请单作废' : ''})
				yield put({
					type: 'save',
					payload: {
						tableData: JSON.parse(JSON.stringify(response.dataRows)),
						allCount: response.allCount,
						pageCurrent: page || pageCurrent
					}
				})
			}
		},
		*saveValue({value, flag, time}, {put}) { // 保存填选字段
			let params = {}
			if(time == 'time') {
				params['startTime'] = value[0];
				params['endTime'] = value[1]
			}else {
				params[flag] = value
			}
			yield put({
				type: 'save',
				payload: params
			})
		},
		*delApply({record}, {put, call}) { //删除申请单
			let response = yield call(Services.delApply, {demandId: record.demandId})
			if(response.retCode == '1') {
				message.destroy();
				yield put({type: 'init'})
				message.success("删除成功")
			}else{
				message.error(response.retVal)
			}
		},
		*abolishApply({record}, {put, call}) { //申请单作废
			let response = yield call(Services.invalidCarDemand, {demandId: record.demandId})
			if(response.retCode == '1') {
				message.destroy();
				yield put({type: 'init'})
				message.success("申请单作废")
			}else{
				message.error(response.retVal)
			}
		},
		*empty({}, {put}) { //清空
			yield put({
				type: 'save',
				payload: {
					startTime: '',
					endTime: '',
					carsApplyType: '', 
					state: '',
					pageCurrent: 1,
				}
			})
			yield put({type: 'init'})
		},
	},
	subscriptions: {
		setup({dispatch, history}) {
			return history.listen(({pathname, query}) => {
				if (pathname === '/adminApp/carsManage/carsQuery') { //此处监听的是连接的地址
					dispatch({type: 'init', query}); 
			  }   
			}); 
		},
	},
}
