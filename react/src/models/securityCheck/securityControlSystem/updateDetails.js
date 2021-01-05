/**
 * 作者：窦阳春
 * 日期：2019-5-15
 * 邮箱：douyc@itnova.com.cn
 * 功能：安控体系首页
 */
import Cookie from 'js-cookie';
import * as Services from '../../../services/securityCheck/securityCheckServices';
export default {
	namespace: 'updateDetails',
	loading: true, 
	state: {
		roleType: '',
		allCount: 0, // 数据总数
		pageCurrent: 1, //当前页数
		dataList: [], //总院或分院数据
	},
    reducers: { // 刷新数据
			save(state, action) {
				return { ...state,
					...action.payload
				};
			},
    },
  	effects: {
		// 角色查询	
			*queryUserInfo({}, {call, put, select}){
				let OUID = "e65c02c2179e11e6880d008cfa0427c4", roleTypeData = ''
				let roleData = yield call(Services.queryUserInfo, {});
				if(roleData.retCode == '1') {
					if(roleData.dataRows[0].roleName.indexOf("安委办主办")>-1){
						roleTypeData = '1'
					}else if(roleData.dataRows[0].roleName.indexOf("办公室安全接口人")>-1){
						roleTypeData = '2'
						alert('办公室安全接口人')
					}else if(roleData.dataRows[0].roleName.indexOf("安全员")>-1 && Cookie.get("OUID")==OUID) {
						roleTypeData = '3';
					}else if(roleData.dataRows[0].roleName.indexOf("安全员")>-1 && Cookie.get("OUID")!=OUID){
						roleTypeData = '4';
					}
				}
				yield put({
					type: 'save',
					payload: {
						roleType: roleTypeData
					}
				})
			},
			*changePage({page, key}, {put}) { //分页
				yield put({type: 'save', payload: {pageCurrent: page, arg_state: key}})
				yield put({type: "queryUpdateState", data: {arg_page_current: page, arg_state: key}}) 
			},
			*queryUpdateState({key, data}, {call, put, select}) { 
				let {pageCurrent} = yield select(v=>v.updateDetails)
				if(key == undefined) { key = '0' }
				else if(key == '0' || key == '1') {
					pageCurrent = '1'
					yield put({
						type: 'save',
						payload: {
							pageCurrent: 1
						}
					})
				}
				let postData = {}
				if(data) {
					postData = data
				}else {
					postData = {arg_state: key, arg_page_current: pageCurrent}
				}
				let response = yield call(Services.queryUpdateState, postData)
				if(response.retCode == '1') {
					response.dataRows.map((v, i) => v.key = i+1)
					yield put({
						type: 'save',
						payload: {
							dataList: JSON.parse(JSON.stringify(response.dataRows)),
							allCount: parseInt(response.allCount)
						}
					})
				}
			},
		},
		
	subscriptions: {
		setup({dispatch, history}) {
		return history.listen(({pathname, query}) => {
		if (pathname === '/adminApp/securityCheck/SecurityControlSystem/updateDetails') { //此处监听的是连接的地址
			dispatch({type: 'queryUserInfo'}); //角色判断	
			dispatch({type: 'queryUpdateState'})
		}   
		});
		},
	},
}
