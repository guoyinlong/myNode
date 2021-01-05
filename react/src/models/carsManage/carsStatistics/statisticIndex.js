/**
 * 作者：窦阳春
 * 日期：2020-09-07 
 * 邮箱：douyc@itnova.com.cn
 * 功能：用车申请填报页面
 */
import { message } from "antd";
import * as Services from '../../../services/carsManage/carsManageServices';
export default {
	namespace: 'statisticIndex',
	loading: true, 
	state: {
		pageCurrent: 1, //当前页
		allCount: 1, //总页数
		tableData: [],
		reportValue: '',
	},
	reducers: { // 刷新数据
		save(state, action) {
			return { ...state,
				...action.payload
			};
		},
	},
	effects: {
		*init({query, page}, {put, call, select}) {
			let { pageCurrent, reportValue} = yield select(v=> v.statisticIndex);
			let postData = {
				reportFormName: reportValue,
				pageCurrent: page || pageCurrent
			}
			let response = yield call(Services.reportTable, postData)
			if(response.retCode == '1') {
				response.dataRows.map((v, i)=>{
					v.key = i+1;
					v.typeTxt = v.type == '0' ? '正常业务支撑用车' 
					: v.type == '1' ? '因公出差接送站用车' 
					: v.type == '2' ? '个人特殊事宜临时用车' : '' 
				})
				yield put({
					type: 'save',
					payload: {
						tableData: JSON.parse(JSON.stringify(response.dataRows)),
						allCount: response.allCount,
					}
				})
			}else{
				message.destroy();
				message.error(response.retVal)
			}
		},
		*saveValue({value, flag}, {put}){ // 保存路线
			let params = {};
			params[flag] = value;
			yield put({
				type: 'save',
				payload: params
			})
		},
	},
	subscriptions: {
		setup({dispatch, history}) {
			return history.listen(({pathname, query}) => {
				if (pathname === '/adminApp/carsManage/carsStatistics') { //此处监听的是连接的地址
					dispatch({type: 'init', query}); 
			  }   
			}); 
		},
	},
}
