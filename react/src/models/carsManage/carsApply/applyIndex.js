/**
 * 作者：窦阳春
 * 日期：2020-09-07 
 * 邮箱：douyc@itnova.com.cn
 * 功能：用车申请首页
 */
import { message } from "antd";
import * as Services from '../../../services/carsManage/carsManageServices';
export default {
	namespace: 'applyIndex',
	loading: true, 
	state: {
	},
	reducers: { // 刷新数据
		save(state, action) {
			return { ...state,
				...action.payload
			};
		},
	},
	effects: {
	},
	subscriptions: {
		setup({dispatch, history}) {
			return history.listen(({pathname, query}) => {
				if (pathname === '/adminApp/carsManage/carsApply') { //此处监听的是连接的地址
				}   
			}); 
		},
	},
}
