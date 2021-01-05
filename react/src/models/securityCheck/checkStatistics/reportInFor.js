/**
 * 作者：郭银龙
 * 日期：2019-5-24 
 * 邮箱：guoyl@itnova.com.cn
 * 功能：报告详情
 */
import Cookie from 'js-cookie';
import { message } from "antd";
import * as myServices from '../../../services/securityCheck/securityChechServices2';
export default {
	namespace: 'xqReport',
	loading: true, 
	state: {
		
		roleType: '', // 1 安委办  2 分院办公室安全接口人 
		checkPerson: '1', //检查人 1安委办 2分院办公室安全接口人 3部门安全员
		query: [], //表格行数据
		oneMenu: [],
		detailsList: {}, //详情列表
		
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
			*queryUserInfo({query}, {call, put, select}){
				// let OUID = "e65c02c2179e11e6880d008cfa0427c4"
				// let roleData = yield call(myServices.queryUserInfo, {});
				// let roleTypeData = '0'
				// console.log(roleData.dataRows[0].roleName ,'roleData.dataRows[0].roleName')
				// if(roleData.retCode == '1') {
					// if(roleData.dataRows[0].roleName.indexOf("安委办主办")>-1){
					// 	roleTypeData = '1'
					// }else if(roleData.dataRows[0].roleName.indexOf("办公室安全接口人")>-1){
					// 	roleTypeData = '2'
					// }else if(roleData.dataRows[0].roleName.indexOf("安全员")>-1 && Cookie.get("OUID")==OUID) {//部门安全员
					// 	roleTypeData = '3'
					// }else if(roleData.dataRows[0].roleName.indexOf("安全员")>-1 && Cookie.get("OUID")!=OUID) {//分院部门安全员
					// 	roleTypeData = '4'
					// }
					// yield put({
					// 	type: 'save',
					// 	payload: { 
					// 		roleType: roleTypeData
					// 	}
					// })
				if(query){
						
						// if(roleTypeData == '1' || roleTypeData == '2') {
						//查询本院
					//    console.log("www")
					
					   let data ={
						arg_statistics_id:JSON.parse(JSON.stringify(query.arg_statistics_id)),  // 是        统计任务的id                                       
						arg_yard_state :  query.arg_yard_state,    //是        0、查询本部\本院多级表格     1、查询各分院多级表格 
						arg_item_state : 0    // 是        0、表扬     1、不合格 
				
					   }
					//    console.log(data,"lalallalallalall")
					   let response = yield call(myServices.queryCourtyardAndDeptAndStaff,{ ...data});
					   if(response.retCode == '1'){
						yield put({
							type: 'save',
							payload: { 
								oneMenu: JSON.parse(JSON.stringify(response.dataRows)), //一级菜单数据
							}
						})
					}else{
						message.error(response.retVal);
						
					}
							
					// 	  }else if(roleType == '3' || roleType == '4') {
					// 		// 查询多院
					// 		console.log(query.arg_yard_state,"query.arg_yard_state")
					// 		let data ={
					// 		  arg_statistics_id:JSON.parse(JSON.stringify(query.arg_statistics_id)),  // 是        统计任务的id                                       
					// 		  arg_yard_state :  query.arg_yard_state,    //是        0、查询本部\本院多级表格     1、查询各分院多级表格 
					// 		  arg_item_state : 0    // 是        0、表扬     1、不合格 
					  
					// 		 }
					// 		 let response = yield call(myServices.queryCourtyardAndDeptAndStaff,{ ...data});
					//    if(response.retCode == '1'){
					// 	yield put({
					// 		type: 'save',
					// 		payload: { 
					// 			oneMenu: JSON.parse(JSON.stringify(response.dataRows)), //一级菜单数据
					// 		}
					// 	})
					// }else{
					// 	message.error(response.retVal);
						
					// }
							
					// 	}


					}

					
				// }
			},
			
			*queryCourtyardAndDeptAndStaff({ data},{put, call, select}){
				
				
				let response = yield call(myServices.queryCourtyardAndDeptAndStaff,{ ...data});
				if(response.retCode == '1'){
					yield put({
						type: 'save',
						payload: { 
							oneMenu: JSON.parse(JSON.stringify(response.dataRows)), //一级菜单数据
						}
					})
				}else{
					message.error(response.retVal);
					
				}
			},
			// *queryCourtyardAndDeptAndStaff({},{put, call, select}) {//查询部门表格
			// 	const {query, pageCurrent} = yield select(v =>v.xqReport);
			// 	let postData = {
			// 		taskId: query.taskId,
			// 		deptId: Cookie.get('dept_id'),
			// 		RowCount:10,
			// 		pageCurrent: pageCurrent
			// 	}
			// 	const response = yield call(myServices.queryCourtyardAndDeptAndStaff, postData)
			// 	if(response.retCode == '1') {
			// 		response.dataRows.map((v, i) => v.key = i+1)
			// 		yield put({
			// 			type: 'save',
			// 			payload: {
			// 				// allCount: parseInt(response.allCount),
			// 				deptTableData: JSON.parse(JSON.stringify(response.dataRows)),
			// 			}
			// 		})
			// 	}
			// },
	},
		
subscriptions: {
      	setup({dispatch, history}) {
        	return history.listen(({pathname, query}) => {
				if (pathname === '/adminApp/securityCheck/checkStatistics/reportInFor') { //此处监听的是连接的地址
				dispatch({type: 'queryUserInfo'});
					dispatch({
						type: 'queryUserInfo', //任务详情
						query
					});
				
					
			  }
			});
		},
	},
}
