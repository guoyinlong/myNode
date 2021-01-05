/**
 * 作者：窦阳春
 * 日期：2020-10-23
 * 邮箱：douyc@itnova.com.cn
 * 文件说明：新闻共享平台-舆情管理模块首页列表
 */
import { message } from "antd";
import * as Services from '../../../services/newsOne/newsOneServers';
export default {
	namespace: 'opinionManagementIndex',
	state: {
		oneList: [],
	},
	reducers: {
		save(state, action) {
			return { ...state,
				...action.payload
			};
		},
	},

	effects: {
		*queryPubSentimentList({}, {call,put}) { //查询一级
			let data = yield call(Services.queryPubSentimentList)
			if(data.retCode == '1') {
				data.dataRows.map((v, i) => {
					v.children = [],
					v.key = i
				})
				yield put({
					type: 'save',
					payload: {
						oneList: data.dataRows,
					}
				})
			}else{
				message.error( '查询失败' + data.retVal)
			}
		},
		*deletePubSentiment({newsId}, {put, call, select}) { //删除舆情
			let recData={
				id:newsId
			  };
			let data = yield call(Services.deletePubSentiment, recData);
			if(data.retCode == '1') {
				message.destroy();
				message.success("删除成功")
				yield put({type: 'queryPubSentimentList'})
			}else {
				message.error("删除失败！" + data.retVal)
			}
		},
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
				if (pathname === '/adminApp/newsOne/opinionManagementIndex') { //此处监听的是连接的地址  //
					dispatch({
						type: 'queryPubSentimentList',
						query
					});
				}
			});
		},
	},
};