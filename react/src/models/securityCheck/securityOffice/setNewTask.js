/**
 * 作者：窦阳春
 * 日期：2019-4-23
 * 邮箱：douyc@itnova.com.cn
 * 功能：新建任务页面
 */
import Cookie from 'js-cookie';
import { message } from "antd"; 
import { routerRedux } from 'dva/router';
import * as Services from '../../../services/securityCheck/securityCheckServices';
export default {
	namespace: 'setNewTask',
	loading: true, 
	state: {
		theme: '', //检查主题
		checkRequire: '', //检查要求
		taskTypes: [], //检查方式
		roleType: '0', // 角色类型 0 安委办， 1 分院办公室安全接口人 ，2 部门安全员
		// typeChoose: 'safeCheck', //根据角色定的默认检查方式
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
		checkValue: 0,
		flag: 'newtask',
		createUserName: '',
		taskId: ''
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
		*queryUserInfo({pathname}, {call, put}){
			let OUID = 'e65c02c2179e11e6880d008cfa0427c4'
			yield put({
				type: 'save',
				payload: {
					theme: '', //检查主题
					checkRequire: '', //检查要求
					taskTypes: [], //检查方式
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
					checkValue: 0,
					flag: 'newtask',
					createUserName: '',
				}
			})
			let roleData = yield call(Services.queryUserInfo, {});// 登录人角色查询
			let roleAllData = yield call(Services.queryRole, {}); // 全部角色
			let contentData = yield call(Services.checkObjectAndContent, {});
			let taskType = [], roleRequst = [], roleList = [];
			if(roleAllData.retCode && roleAllData.retCode == '1') {
				roleRequst = roleAllData.dataRows
			}
			let roleType = '0';
			// let typeChoose = 'safeCheck'
			if(roleData.retCode == '1') { 
				if(pathname.indexOf("/adminApp/securityCheck/safeCheck/setNewTask")> -1
				|| pathname.indexOf("/adminApp/securityCheck/safeCheck/modifyTask")> -1) {
					taskType = [ //检查方式
						{
							"id": "safeCheck",
							"stateName": "安委办统查"
						},
						{
							"id": "safeSpotCheck",
							"stateName": "安委办抽查"
						},
						{
							"id": "specialCheck",
							"stateName": "专项检查"
						},
						{
							"id": "deptSelfCheck",
							"stateName": "部门自查"
						},
						{
							"id": "deptEoCheck",
							"stateName": "部门互查"
						},
						{
							"id": "workNotified",
							"stateName": "工作通知"
						}
					]
					if (roleRequst.length > 0) {
					let roleRequstData = roleRequst.filter((v) => {
						let item = v.roleName
							return (v.roleSort==0) || item.indexOf('院主管领导') >-1 || item.indexOf('分院院领导') >-1 || item.indexOf('分管副院长') >-1 ||
							item.indexOf('各部门/中心负责人') >-1 || item.indexOf('分院办公室负责人') >-1 || item.indexOf('各部门/中心安全员') >-1 ||
							item.indexOf('分院办公室安全接口人')>-1 
					})
					roleRequstData.map((v) => { 
						let num = v.roleName.lastIndexOf('-');
						v.roleName = v.roleName.substring(num+1, v.roleName.length)
					})
					let roleDefault = [
						{
							"roleId": '1',
							"roleName": "本部全员"
						},
						{
							"roleId": '0',
							"roleName": "本部/分院全员"
						},
					]
					roleList = [ ...roleRequstData, ...roleDefault];
					}
				}else if(pathname.indexOf("/adminApp/securityCheck/branchCheck/setNewTask")> -1
				|| pathname.indexOf("/adminApp/securityCheck/branchCheck/modifyTask")> -1){
					roleType = '1';
					// typeChoose = 'branchSafeCheck'
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
							return item.indexOf('分院院领导') >-1 || item.indexOf('各部门/中心负责人') >-1 || 
											item.indexOf('各部门/中心安全员') >-1 || item.indexOf('分院办公室负责人') >-1 
					})
					roleRequstData.map((v) => { 
						let num = v.roleName.lastIndexOf('-');
						v.roleName = v.roleName.substring(num+1, v.roleName.length)
					})
					roleList = [...roleRequstData, {"roleId": '2',"roleName": "分院全员"}];
					}
				}else if(pathname.indexOf("/adminApp/securityCheck/deptCheck/setNewTask")> -1
				|| pathname.indexOf("/adminApp/securityCheck/deptCheck/modifyTask")> -1){
					roleType = '2';
					// typeChoose = 'deptSafeCheck'
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
						taskTypes: JSON.parse(JSON.stringify(taskType)),
						roleType: roleType,
						checkObjectAndContentList: JSON.parse(JSON.stringify(contentData.dataRows[0].examineObj)),  //检查对象列表
						checkContentList: JSON.parse(JSON.stringify(contentData.dataRows[0].content)), //检查内容列表
						roleList: JSON.parse(JSON.stringify(roleList)), //通知对象列表
						pathname
					}
				})
			}
		},
		*checkValueChange({value}, {put}) {
			yield put({
				type: 'save',
				payload: {
					checkValue: value
				}
			})
		},
		*changeDate({startTime, endTime}, {put}) {
			yield put({
				type: 'save', 
				payload: {
					startTime: startTime,
					endTime: endTime
				}
			})
		},
		*saveUploadFile({value,previewImage,previewVisible}, {put,call, select}) { //上传图片
			const {examineImgId} = yield select(s => s.setNewTask)
			if(value == undefined) { //value为未定义时,其他两个有值 预览
				yield put({
					type: 'save',
					payload: {
						previewImage: JSON.parse(JSON.stringify(previewImage)),
						previewVisible: JSON.parse(JSON.stringify(previewVisible)),
					}
				})
			}else {
				if(value.RetCode == '1') {
					examineImgId.push(value.filename)
				}
				yield put({
					type: 'save',
					payload: {
						examineImgId: examineImgId
					}
				})
			}
		},
		*onRemove({file}, {put,call, select}) { //删除图片
			const {examineImgId} = yield select(s => s.setNewTask)
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
				message.destroy()
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
		},
		*onObjectChange({record}, {put}) { //保存检查对象
			let newCheckObject = [...record]
			yield put({
				type:'save',
				payload:{
					checkObject: newCheckObject,
				}
			})
		},
		*roleListData({record}, {put}) { //保存通知 对象
			let newroleObject = [...record]
			yield put({
				type:'save',
				payload:{
					roleObject: newroleObject,
				}
			})
		},
		*checkContent({record}, {put}){ //保存检查内容
			yield put({
				type:'save',
				payload:{
					checkContent: record,
				}
			})
		},
		*checkRequire({record}, {put}) {
		if(record.target.value.length>500){
			message.destroy()
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
		*saveSubmit({record, saveData, flagTap}, {put, call, select}) { 
		const {theme, taskId, pathname, checkValue, checkRequire, typeChoose, checkObject, checkContent, examineImgId, roleObject, flag} = yield select(v =>v.setNewTask)
		let postData = {
			taskType: typeChoose,
			examineObj: checkObject.join(),
			examineContent: checkContent.join(),
			demand: checkRequire,
			examineImg: JSON.stringify(examineImgId),
			belongUserId: roleObject.join(),
			buttonType: 0,
			taskTitle: theme,
			otherOu: checkValue,
			arg_current_role: pathname.indexOf('/safeCheck') > -1 ? '0' : pathname.indexOf('/branchCheck') > -1 ? '1' : pathname.indexOf('/deptCheck') > -1 ? '2' : '99'
		}
		let postDatas = {...saveData, ...postData}
		if(record == '保存') { //点击保存
			if(flag == 'modify') {
				postDatas['taskId'] = taskId
			}else if(flag == 'newtask') {
				postDatas['taskId'] && delete postDatas['taskId']
			}
			if(postDatas['startTime'] == '' || postDatas['endtime'] == '' || postDatas['taskTitle'] ==''
			|| postDatas['examineImg'] == '' || postDatas['belongUserId'] == '' || postData['examineObj'] == ''){
				message.destroy()
				message.info('有必填项没填');
				return
			}else {
				let response = []
				if(flagTap == '新建'){ //新建页面的保存
					response = yield call(Services.addTask, postDatas)
				}else{ //修改页面保存
					response = yield call(Services.editTask, postDatas)
				}
				if(response.retCode === '1'){
					message.destroy()
					message.success('保存成功');
					yield put(routerRedux.push({
						pathname: pathname.substr(0, pathname.lastIndexOf('/'))
					}));
				}else{
					message.destroy()
					message.error('保存失败');
				}
			}
		}else if(record == '提交') {
			postDatas['buttonType'] = 1
			if(postDatas['startTime'] == '' || postDatas['endtime'] == '' || postDatas['taskTitle'] ==''
			|| postDatas['examineImg'] == '' || postDatas['belongUserId'] == '' || postData['examineObj'] == '') { 
				message.destroy()
				message.info('有必填项没填')
			}else{
				let response = [];
				if(flagTap == '新建'){ //新建页面的提交
					response = yield call(Services.addTask, postDatas)
				}else{ //修改页面提交
					postDatas['taskId'] = taskId
					response = yield call(Services.editTask, postDatas)
				}
				if(response.retCode && response.retCode == '1') {
					message.destroy()
					message.success('提交成功');
					yield put(routerRedux.push({
					  pathname: pathname.substr(0, pathname.lastIndexOf('/'))
					}));
					yield put({
						type: 'save',
						payload: {
							startTime: '',
							endTime: '',
							theme: '',
							typeChoose: [],
							checkObject: [],
							roleObject: [],
							checkValue: '',
							checkContent: [],
							checkRequire: '',
							examineImgId: [],
						}
					})
				}else {
					message.destroy()
					message.error('提交失败');
				}
			}
		}
		},    
		//修改页面-查询任务详情
		*queryTaskInform({query, pathname},{put, call}){
			let dataList = JSON.parse((query.record))
			let response = yield call(Services.queryTaskInform, {taskId: dataList.taskId, taskTitle: dataList.taskTitle})
			const {createUserName, startTime, belongroleid, endTime, taskTitle, taskType, examineObj, belongUserName, otherOu, demand,examineContent, examineImg} = response.dataRows[0];
			if(response.retCode == '1') {
				yield put({
					type: 'save',
					payload: {
						flag: 'modify',
						createUserName: createUserName,
						startTime: startTime,
						endTime: endTime,
						theme: taskTitle,
						checkObject: examineObj != "" ? examineObj.split(',') : [],
						roleObject: belongroleid != "" ? belongroleid.split(',') : [], 
						checkValue: parseInt(otherOu),
						checkContent: examineContent != "" ? examineContent.split(',') : [], 
						checkRequire: JSON.parse(JSON.stringify(demand)),
						examineImgId: examineImg!="" ? JSON.parse(examineImg) : [],
						taskId: dataList.taskId,
						typeChoose: taskType,
						pathname
					}
				})
			}

		},
	},
		
	subscriptions: {
		setup({dispatch, history}) {
			return history.listen(({pathname, query}) => {
				if (pathname === '/adminApp/securityCheck/safeCheck/setNewTask'
				||pathname === '/adminApp/securityCheck/deptCheck/setNewTask'
				||pathname === '/adminApp/securityCheck/branchCheck/setNewTask') { //此处监听的是连接的地址
					dispatch({
						type: 'queryUserInfo',
						pathname
					}); //角色判断  
				}else if(pathname === '/adminApp/securityCheck/safeCheck/modifyTask'
				|| pathname === '/adminApp/securityCheck/deptCheck/modifyTask'
				|| pathname === '/adminApp/securityCheck/branchCheck/modifyTask'){
					dispatch({type: 'queryUserInfo', pathname});
					dispatch({
						type: 'queryTaskInform', //任务详情
						query,
						pathname
					});
				}
			});
		},
	},
}
