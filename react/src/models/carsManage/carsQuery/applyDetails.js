/**
 * 作者：窦阳春
 * 日期：2020-09-17 
 * 邮箱：douyc@itnova.com.cn
 * 功能：用车申请详情页
 */
import * as Services from '../../../services/carsManage/carsManageServices';
export default {
	namespace: 'applyDetails',
	loading: true, 
	state: {
		tableData: [],
		startTime: '',
		endTimeL: '',
		carsApplyType: '0', //用车申请类型
    state: '0',
		applyDetail: {},
		type: '', //0 正常业务 1 因公出差 2 个人特殊事宜
	},
	reducers: { // 刷新数据
		save(state, action) {
			return { ...state,
				...action.payload
			};
		},
	},
	effects: {
		*init({query}, {put, call}) {
			let response = yield call(Services.applyDetail, {demandId: query.demandId});
			if(response.retCode == '1') { //carApprovalLink
				response.dataRows.carDemand = {...response.dataRows.carDemand, ...response.dataRows.carApprovalLink};
				yield put({
					type: 'save',
					payload: {
						applyDetail: response.dataRows.carDemand, 
						type: query.type,
					},
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
	},
	subscriptions: {
		setup({dispatch, history}) {
			return history.listen(({pathname, query}) => {
				if (pathname === '/adminApp/carsManage/carsQuery/applyDetails') { //此处监听的是连接的地址
					dispatch({type: 'init', query}); 
			  }   
			}); 
		},
	},
}
