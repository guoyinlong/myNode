/**
 * 作者：窦阳春
 * 日期：2020-09-21
 * 邮箱：douyc@itnova.com.cn
 * 功能：审批页面
 */
import { message } from "antd";
import * as Services from '../../../services/carsManage/carsManageServices';
import { routerRedux } from "dva/router";
export default {
	namespace: 'judgePage',
	loading: true, 
	state: {
		detailsData: {},
		radioValue: 0,
		pickTime: '',
		type: '',
		demandId: '',
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
			const {flag, demandId} = query;
			let response = yield call(Services.judgeData, {demandId});
			if(response.retCode == '1') {
				response.dataRows.carDemand = {...response.dataRows.carDemand, ...response.dataRows.carApprovalLink}
				yield put({
					type: 'save',
					payload: {
						pickTime: '',
						radioValue: 0,
						flag,
						detailsData: response.dataRows.carDemand,
						type: response.dataRows.carDemand.type,
						demandId
					}
				})
			}else{
				message.error(response.retVal)
			}
		},
		*saveValue({value, flag, time}, {put}) { // 保存填选字段
			let params = {}
			time == 'time' ? params['pickTime'] = value : params[flag] = value
			yield put({
				type: 'save',
				payload: params
			})
		},
		*reply({}, {put, call, select}) { //通过/退回
			let {pickTime, radioValue, demandId} = yield select(v=>v.judgePage);
			pickTime = (radioValue == 1 || radioValue == 2) ? pickTime : '';
			let postData = {
				demandId,
				approvalIdeaType: radioValue,
				updateUseTime : pickTime,
			}
			let response = yield call(Services.reply, postData)
			if(response.retCode == '1')  {
				message.destroy();
				message.success("回复成功")
				yield put(routerRedux.push('/adminApp/carsManage/myJudge'))
			}else {
				message.error(response.retVal)
			}
		}
	},
	subscriptions: {
		setup({dispatch, history}) {
			return history.listen(({pathname, query}) => {
				if (pathname === '/adminApp/carsManage/myJudge/judgePage') { //此处监听的是连接的地址
					dispatch({type: 'init', query}); 
			  }   
			}); 
		},
	},
}
