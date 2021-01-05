/**
 * 作者：郭银龙
 * 日期：2019-4-27
 * 邮箱：guoyl@itnova.com.cn
 * 功能：派发安全检查任务页面
 */  
import Cookie from 'js-cookie';
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as myServices from '../../../services/securityCheck/securityChechServices2';
export default {
	namespace: 'setNewTask2', 
	loading: true, 
	state: {
		theme: '', //检查主题
		checkRequire: '', //检查要求
		taskType: [], //检查方式
		roleType: "0", // 角色类型 0 安委办， 1 分院办公室安全接口人 ，2 部门安全员
		typeChoose: '', //根据角色定的默认检查方式
		checkObjectAndContentList: [], //检查对象
		checkObject: [], //检查对象选中数组
		checkContentList: [], //检查内容
		checkContent: [], //检查内容选中数组
    	previewImage: '',
		previewVisible: false,
		examineImgId: [], // 上传的图片
		roleList: [], // 通知对象
		roleObject: [], // 通知对象选中数组
		startTime: '',
		endTime: '',
		checkValue: "",
		flag: 'newtask',
		createUserName: '',

		taskList:"",
		infoState:"",
		asdfa:"1231"
	},
    reducers: { // 刷新数据
			save(state, action) {
				return { ...state,
					...action.payload
				};
			},
    },
  	effects: {
		// 角色查询	检查内容 检查对象
		*queryUserInfo({query}, {call, put, select}){
			let OUID = 'e65c02c2179e11e6880d008cfa0427c4'
			let taskid = query.arg_state
			let recData={
				arg_user_id:Cookie.get('userid'),
				argInfoId:taskid
			  };
			yield put({
				type: 'save',
				payload: {
					theme: '', //检查主题
					checkRequire: '', //检查要求
					taskType: [], //检查方式
					roleType: '0', // 角色类型 0 安委办， 1 分院办公室安全接口人 ，2 部门安全员
					// typeChoose: 'safeCheck', //根据角色定的默认检查方式
					typeChoose: '', //根据角色定的默认检查方式
					checkObjectAndContentList: [], //检查对象
					checkObject: [], //检查对象选中数组
					checkContentList: [], //检查内容
					checkContent: [], //检查内容选中数组
					previewImage: '',
					previewVisible: false,
					examineImgId: [], // 上传的图片id
					roleList: [], // 通知对象
					roleObject: [], // 通知对象选中数组
					startTime: '',
					endTime: '',
					checkValue: "",
					flag: 'newtask',
					createUserName: '',
					createUserRoleName:'',
				} 
			})
				let roleData = yield call(myServices.queryUserInfo, {});// 登录人角色查询
				let roleAllData = yield call(myServices.queryRole, {}); // 全部角色
				let contentData = yield call(myServices.checkObjectAndContent, {});
				let response = yield call(myServices.EmployeeSelfexamination2, {...recData})//页面数据
				let taskType = [], roleRequst = [], roleList = [];
				if(roleAllData.retCode && roleAllData.retCode == '1') {
					roleRequst = roleAllData.dataRows
				}
				let roleType = '0';
				let typeChoose = "safeCheck"
				// console.log(roleData.dataRows[0].roleName,response.dataRows[0].createUserRoleName)
				if(roleData.retCode == '1') { 
					// if(roleData.dataRows[0].roleName.indexOf("安委办主办")> -1 && response.dataRows[0].createUserRoleName.indexOf("安委办主办")> -1){
						
					// 	if (roleRequst.length > 0) {
					// 	let roleRequstData = roleRequst.filter((v) => {
					// 		let item = v.roleName
					// 			return item.indexOf('院领导') >-1 || item.indexOf('院主管领导') >-1 || item.indexOf('分院院领导') >-1 ||
					// 			item.indexOf('各部门/中心负责人') >-1 || item.indexOf('分院办公室负责人') >-1 || item.indexOf('各部门/中心安全员') >-1 ||
					// 			item.indexOf('分院办公室安全接口人')>-1 || item.indexOf('分院院领导') >-1 
					// 	})
					// 	roleRequstData.map((v) => { 
					// 		let num = v.roleName.lastIndexOf('-');
					// 		v.roleName = v.roleName.substring(num+1, v.roleName.length)
					// 	})
					// 	let roleDefault = [
					// 	 {
					// 		 "roleId": '0',
					// 		 "roleName": "本部全员"
					// 	 },
					// 	 {
					// 		 "roleId": '1',
					// 		 "roleName": "本部/分院全员"
					// 	 },
					// 	]
					//   roleList = [...roleDefault, ...roleRequstData];
					//  }
					// }
					// 添加一个判断
					 if(roleData.dataRows[0].roleName.indexOf("办公室安全接口人")> -1 && response.dataRows[0].createUserRoleName.indexOf("安委办主办")> -1){
						roleType = '1';
						typeChoose = 'branchSafeCheck'
						taskType = [ //检查方式
							{
								"id": "branchSafeCheck",
								"stateName": "分院统查"
							},
							{
								"id": "branchSportCheck",
								"stateName": "分院抽查"
							},
							{
								"id": "branchSpecialCheck",
								"stateName": "专项检查"
							},
							{
								"id": "deptSelfCheck",
								"stateName": "部门自查"
							},
							{
								"id": "deptEoCheck",
								"stateName": "部门互查"
							}
						]
						if (roleRequst.length > 0) {
						let roleRequstData = roleRequst.filter((v) => {
							let item = v.roleName
								return item.indexOf('分院院领导') >-1 || item.indexOf('部门/中心负责人') >-1 || 
								item.indexOf('分院办公室负责人') >-1 || item.indexOf('部门/中心安全员') >-1 
						})
						roleRequstData.map((v) => { 
							let num = v.roleName.lastIndexOf('-');
							v.roleName = v.roleName.substring(num+1, v.roleName.length)
						})
					  roleList = [ ...roleRequstData,{"roleId": '2',"roleName": "分院全员"}];
					 }
					}else{
						roleType = '2';
						typeChoose = 'deptSafeCheck'
						taskType = [ //检查方式
							{
								"id": "deptSafeCheck",
								"stateName": "部门统查"
							},
							{
								"id": "deptSportCheck",
								"stateName": "部门抽查"
							},
							{
								"id": "staffSelfCheck",
								"stateName": "员工自查"
							}
						]
						if(Cookie.get("OUID") != OUID){ //分部安全员
							if (roleRequst.length > 0) {
							let roleRequstData = roleRequst.filter((v) => {
								let item = v.roleName
								return (item.indexOf('分院院领导') >-1) || (item.indexOf('部门/中心负责人') >-1) 
							})
							roleRequstData.map((v) => { 
								let num = v.roleName.lastIndexOf('-');
								if(v.roleName.indexOf('部门/中心负责人') > -1) {
									v.roleName = v.roleName.substring(num+2, v.roleName.length)
								}else{
									v.roleName = v.roleName.substring(num+1, v.roleName.length)
								}
							})
							roleList = [...roleRequstData, {"roleId": '3',"roleName": "部门全员"}];
							}
						}else if(Cookie.get("OUID") == OUID) { //本部安全员
							if (roleRequst.length > 0) {
								let roleRequstData = roleRequst.filter((v) => {
									let item = v.roleName
									return (v.roleSort==0) || (item.indexOf('部门/中心负责人') >-1) 
								})
								roleRequstData.map((v) => { 
									let num = v.roleName.lastIndexOf('-');
									if(v.roleName.indexOf('部门/中心负责人') > -1) {
										v.roleName = v.roleName.substring(num+2, v.roleName.length)
									}else{
										v.roleName = v.roleName.substring(num+1, v.roleName.length)
									}
								})
								roleList = [...roleRequstData, {"roleId": '3',"roleName": "部门全员"}];
								}
						}
					}
					yield put({
						type: 'save',
						payload: {
							taskType: JSON.parse(JSON.stringify(taskType)),
							roleType: roleType,
							typeChoose: typeChoose, //根据角色显示默认
							checkObjectAndContentList: JSON.parse(JSON.stringify(contentData.dataRows[0].examineObj)),  //检查对象列表
							checkContentList: JSON.parse(JSON.stringify(contentData.dataRows[0].content)), //检查内容列表
							roleList: JSON.parse(JSON.stringify(roleList)), //通知对象列表
						}
					})
				}
			},
			
			*changeDate({startTime, endTime}, {put}) {
				// console.log(startTime, endTime)
				yield put({
					type: 'save',
					payload: {
						startTime: startTime,
						endTime: endTime
					}
				})
			},
			*changecheckValue({checkValue}, {put}) {
				yield put({
					type: 'save',
					payload: {
						checkValue: checkValue,
						
					}
				})
			},
		*saveUploadFile({value,previewImage,previewVisible}, {put,call, select}) { //上传图片
			const {examineImgId} = yield select(s => s.setNewTask2)
			// console.log(examineImgId)
			if(value == undefined) { //value为未定义时,其他两个有值
				yield put({
					type: 'save',
					payload: {
						previewImage: JSON.parse(JSON.stringify(previewImage)),
						previewVisible: JSON.parse(JSON.stringify(previewVisible)),
					}
				})
			}else {
				if(value.RetCode == '1') {
					// console.log(value.filename, 'value.filename')  //有value的值时,其他参数为未定义
					examineImgId.push(value.filename)
				}
				// console.log(examineImgId, 'examineImgId图片上传数组')
				yield put({
					type: 'save',
					payload: {
						examineImgId: examineImgId
					}
				})
			}
		},
		*onRemove({file}, {put,call, select}) { //删除图片
			const {examineImgId} = yield select(s => s.setNewTask2)
			let newList = examineImgId.filter((v) => {
				return v.FileId != file.uid
			})
			yield put({
				type: 'save',
				payload: {
					examineImgId: newList
				}
			})
		},
		*handleCancel({}, {put}) { //取消预览
			yield put({
				type: 'save',
				payload: {
					previewVisible: false
				}
			})
		},
		*theme({record}, {put}) {
			if(record.target.value.length>50){
				message.info('超过字数限制')
			}else {
				yield put({
					type:'save',
					payload:{
					theme: record.target.value,
				}
			})
		}
		},
		*typeChoose({record}, {put}) {
			yield put({
				type:'save',
				payload:{
					typeChoose: record,
			}
		})
			// if(record == 'safeCheck') { //安委办统查
				
			// }
		},
		*onObjectChange({record}, {put}) { //保存检查对象
			// console.log(record, 'record')
			let newCheckObject = [...record]
			yield put({
				type:'save',
				payload:{
					checkObject: newCheckObject,
				}
			})
		},
		*roleListData({record}, {put}) { //保存通知 对象
			// console.log(record, 'record')
			let newroleObject = [...record]
			yield put({
				type:'save',
				payload:{
					roleObject: newroleObject,
				}
			})
		},
		*checkContent({record}, {put}){ //保存检查内容
			// console.log(record, 'value')
			yield put({
				type:'save',
				payload:{
					checkContent: record,
				}
			})
		},
		*checkRequire({record}, {put}) {
		if(record.target.value.length>500){
			message.info('超过字数限制')
		}else {
			yield put({
				type:'save',
				payload:{
					checkRequire: record.target.value,
			}
		})
	}
		},
		*saveSubmit({record, saveData,argInfoId,taskparentId}, {put, call, select}) { 
			let recData={
				arg_user_id:Cookie.get('userid'),
				argInfoId:argInfoId
			  };
			let roleData = yield call(myServices.queryUserInfo, {});// 登录人角色查询
			let response = yield call(myServices.EmployeeSelfexamination2, {...recData})//页面数据
			let arg_current_role=""
			if(roleData.dataRows[0].roleName.indexOf("办公室安全接口人")> -1 && response.dataRows[0].createUserRoleName.indexOf("安委办主办")> -1){
			  arg_current_role=1
			}else {
			  arg_current_role=2
			}
		// console.log(record, saveData, 'saveData',argInfoId,taskparentId)
		const {theme, checkValue, checkRequire, typeChoose, checkObject, checkContent, examineImgId, roleObject, flag} = yield select(v =>v.setNewTask2)
		
		let postData = {
			taskType: typeChoose,
			examineObj: checkObject.join(),
			examineContent: checkContent.join(),
			demand: checkRequire,
			examineImg: JSON.stringify(examineImgId),
			belongUserId: roleObject.join(),
			buttonType: 0,
			taskTitle: theme,
		}
		
		let postDatas = {...saveData, ...postData,argInfoId,taskparentId,arg_current_role}
		if(record == '保存') { //点击保存
			if(flag == 'modify') {
				postDatas['taskId'] = checkValue
			}else if(flag == 'newtask') {
				postDatas['taskId'] && delete postDatas['taskId']
			}
			// console.log(postDatas, 'postDatas')
			let response = yield call(myServices.addTask, postDatas)
			if(response.retCode === '1'){
				message.success('保存成功');
				yield put(routerRedux.push({
					  pathname:'/adminApp/securityCheck/myNews',
					}));
					
				  
			}else if(response.retCode == '0'){
				// console.error('保存失败');
				message.error('保存失败')
				
			}
			
		}else if(record == '提交') {
			postDatas['buttonType'] = 1
			// console.log(postDatas, 'postDatas')
			if(postDatas['startTime'] == '' || postDatas['endtime'] == '' || postDatas['taskTitle'] ==''
			|| postDatas['examineImg'] == '' || postDatas['belongUserId'] == '') { 
				message.info('有必填项没填')
			}else{
				console.log(postDatas,"tijiao")
				let response = yield call(myServices.addTask, postDatas)
				if(response.retCode == '1') {
					message.info('提交成功');
					
					yield put(routerRedux.push({
						pathname:'/adminApp/securityCheck/myNews',
					  }));
					  
				}else if(response.retCode == '0'){
					message.error('提交失败')
					
				}
			}
		}
		},    
	
		// 派发安全检查任务
		*queryTaskInform({query},{put, call, select}){
			
			let taskid = query.arg_state
			let recData={
				arg_user_id:Cookie.get('userid'),
				argInfoId:taskid
			  };
			let response = yield call(myServices.EmployeeSelfexamination2, {...recData})
			if(response.retCode == '1'){
				  const {createUserName, startTime, endTime,taskTitle,taskType,examineObj,examineContent,demand,otherOu,examineImg,infoState,taskparentId,createTime} = response.dataRows[0];
				  yield put({
					type:'save',
					payload:{
						flag: 'modify',
						createUserName: createUserName,
						startTime: startTime,
						endTime: endTime,
						theme: taskTitle,//检查主题
						typeChoose: JSON.parse(JSON.stringify(taskType)),//检查方式
						// checkObject: JSON.parse(JSON.stringify(examineObj)),//检查对象
						checkObject: examineObj != "" ? examineObj.split(',') : [],
						createTime: createTime.substring(0,10),
						checkValue: parseInt(otherOu),
						checkContent: examineContent != "" ? examineContent.split(',') : [], //检查内容
						checkRequire: JSON.parse(JSON.stringify(demand)),//检查要求
						examineImgId: examineImg!="" ? JSON.parse(examineImg) : [],
						infoState:JSON.parse(JSON.stringify(infoState)),
						taskparentId:JSON.parse(JSON.stringify(taskparentId)),
					}
				  })
		
		
			  }else {
				message.error(response.retVal);
			}
			
		},
	},
		
	subscriptions: {
		setup({dispatch, history}) {
			return history.listen(({pathname, query}) => {
				if(pathname === '/adminApp/securityCheck/myNews/modifyTask'){
					// console.log(query, 'query')
					dispatch({
						type: 'queryUserInfo',
								query
								});
					dispatch({
						type: 'queryTaskInform', //任务详情
						query
					});
				}
			});
		},
	},
}
