/**
 * 作者：窦阳春
 * 日期：2019-5-15
 * 邮箱：douyc@itnova.com.cn
 * 功能：安控体系首页
 */
import Cookie from 'js-cookie';
import { message } from "antd";
import * as Services from '../../../services/securityCheck/securityCheckServices';
export default {
	namespace: 'securityControl',
	loading: true, 
	state: {
		roleType: '',
		contentList: [],
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
			*queryRule({}, {put, call}){
				let response = yield call(Services.queryRule);
				let dataList = []
				if(response.retCode == '1') { 
					response.dataRows.map((v, i) => {
						dataList = [...dataList, v.content]
					})
					yield put({
						type: 'save',
						payload: {
							contentList: JSON.parse(JSON.stringify(dataList))
						}
					})
				}
			},
			*updateRule({data}, {put, call}){
				let response = yield call(Services.updateRule, data);
				if(response.retCode == '1') {
					message.destroy();
					message.success("修改成功")
					yield put({type: 'queryRule'})
				}else{
					message.error("修改失败")
				}
			},
		},
		
	subscriptions: {
		setup({dispatch, history}) {
		return history.listen(({pathname, query}) => {
		if (pathname === '/adminApp/securityCheck/SecurityControlSystem') { //此处监听的是连接的地址
			dispatch({type: 'queryUserInfo'}); //角色判断	
			dispatch({type: 'queryRule'}); //查询表格内容	
		}   
		});
		},
	},
}
