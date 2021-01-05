/**
 * 作者：窦阳春
 * 日期：2019-4-27
 * 邮箱：douyc@itnova.com.cn
 * 功能：安委办--检查中
 */
import Cookie from 'js-cookie';
import { message } from "antd";
import * as Services from '../../../services/securityCheck/securityCheckServices';
function timeSub(tim) {
	 return tim.substr(0, 10)
}
export default {
	namespace: 'checkFinish',
	loading: true, 
	state: {
		createUserName: '', //发布人
		startTime: '',
		endTime: '',
		theme: '',
		typeChoose: '', //检查方式
		checkObject: '', // 检查对象
		checkValue: '', // 是否涉及分院
		checkContent: '', //检查内容
		checkRequire: '', // 检查要求
		examineImgId: [], // 上传图片参数
		roleObject: '', //通知对象
		checkPerson: '1', //检查人 1安委办 2分院办公室安全接口人 3部门安全员
		query: [], //表格行数据
		oneMenuL: [],
		detailsList: {}, //详情列表
		disabledflag: '0', //初始通知整改按钮不置灰
		noticeObject: [], //通报对象
		noticeObjectChoose: [], //通报对象选中数组
		statisticsData: [], //统计结果
    previewImage: '',
		previewVisible: false,
		examineImgIdArr: [], // 检查报送上传的图片
		allCount: 0, // 数据总数
		pageCurrent: 1, //当前页数
		deptTableData: [],
		resDataTable: [],
		examContent: '', // 检查内容
		nextRequest: '', //下一步要求
		result2: '',
		imgs: "", // 检查报送图片
		queryCheckSub: [], //检查结果请求数据
		createTime: '',
		query: {},
		isNoticeFlag: '0',//是否通报
		isNoticeLeadFlag: '0', //是否报送安委办
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
			*queryUserInfo({pathname}, {call, put}){
				yield put({type: 'save', payload: {examineImgIdArr: [], statisticsData: []}})
				let OUID = 'e65c02c2179e11e6880d008cfa0427c4'
				let roleData = yield call(Services.queryUserInfo, {});// 登录人角色查询
				let roleAllData = yield call(Services.queryRole, {}); // 全部角色
				let roleRequst = [], roleList = [];
				if(roleAllData.retCode && roleAllData.retCode == '1') {
					roleRequst = roleAllData.dataRows
				}
				if(roleData.retCode == '1') {
					// if(roleData.dataRows[0].roleName.indexOf("安委办主办")>-1){
						if(pathname.indexOf('/adminApp/securityCheck/safeCheck/checkFinish') > -1){
						if (roleRequst.length > 0) {
							let roleRequstData = roleRequst.filter((v) => {
								let item = v.roleName
									return item.indexOf('院领导') >-1 || item.indexOf('院分管领导') >-1 || 
													item.indexOf('各部门/中心负责人') >-1 || item.indexOf('各部门/中心安全员') >-1 ||
													item.indexOf('分院院领导') >-1 || item.indexOf('分院办公室负责人') >-1 || item.indexOf('分院办公室安全接口人')>-1
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
					}
					// else if(roleData.dataRows[0].roleName.indexOf("办公室安全接口人")>-1){
						else	if(pathname.indexOf('/adminApp/securityCheck/branchCheck/checkFinish') > -1){
						if (roleRequst.length > 0) {
							let roleRequstData = roleRequst.filter((v) => {
								let item = v.roleName
									return item.indexOf('分院领导') >-1 || item.indexOf('部门/中心负责人') >-1 || 
													item.indexOf('各部门/中心安全员') >-1 || item.indexOf('分院办公室安全负责人') >-1 
							})
							roleRequstData.map((v) => { 
								let num = v.roleName.lastIndexOf('-');
								v.roleName = v.roleName.substring(num+1, v.roleName.length)
							})
							roleList = [{"roleId": '2',"roleName": "分院全员"}, ...roleRequstData];
							}
						}
						// else if(roleData.dataRows[0].roleName.indexOf("安全员")>-1 && Cookie.get("OUID")==OUID) {
							else	if(pathname.indexOf('/adminApp/securityCheck/deptCheck/checkFinish') > -1 && Cookie.get("OUID")==OUID){
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
						else	if(pathname.indexOf('/adminApp/securityCheck/deptCheck/checkFinish') > -1 && Cookie.get("OUID")!=OUID){
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
					}
					yield put({
						type: 'save',
						payload: {
							noticeObject: JSON.parse(JSON.stringify(roleList)), //通知对象列表
						}
					})
				}
			},
			//查询任务详情
			*queryTaskInform({query},{put, call}){
				let dataList = JSON.parse((query.record))
				let response = yield call(Services.queryTaskInform, {taskId: dataList.taskId})
				const {createUserName, startTime, endTime, taskTitle, taskTypeDesc, examineObj, 
					belongUserName, otherOu, demand,examineContent, examineImg, createTime} = response.dataRows[0];
				let roleAllData = yield call(Services.queryRole, {}); // 返回全部角色
				if(roleAllData.retCode == '1' && response.retCode == '1') {
						yield put({
							type: 'save',
							payload: {
								createUserName: createUserName,
								startTime: timeSub(startTime),
								endTime: timeSub(endTime),
								theme: taskTitle,
								typeChoose: taskTypeDesc, //检查方式
								checkObject: examineObj, //检查对象
								// roleObject: roleNameList, //通知对象
								roleObject: belongUserName, //通知对象
								checkValue: parseInt(otherOu), //涉及分院  1 0
								checkContent: examineContent,  //检查内容
								checkRequire: demand, //检查要求
								createTime: createTime,
								examineImgId: (examineImg!=""&&examineImg!=null)?JSON.parse(examineImg) : [], //图片
								query: dataList
							}
						})
				}
			},
			*queryCourtyardAndDeptAndStaff({},{put, call, select}){
				const {query} = yield select(v =>v.checkFinish);
				let response = yield call(Services.queryCourtyardAndDeptAndStaff, {taskId: query.taskId});
				if(response.retCode && response.retCode == '1'){
					yield put({
						type: 'save',
						payload: {
							oneMenu: JSON.parse(JSON.stringify(response.dataRows)), //一级菜单数据
						}
					})
				}
			},
			*queryStaffByDept({},{put, call, select}) {//查询部门表格
				const {query, pageCurrent} = yield select(v =>v.checkFinish);
				let postData = {
					taskId: query.taskId,
					deptId: Cookie.get('dept_id'),
					RowCount:10,
					pageCurrent: pageCurrent
				}
				const response = yield call(Services.queryStaffByDept, postData)
				if(response.retCode == '1') {
					let res = response.dataRows
					let resData = res.splice(1, res.length)
					resData.map((v, i) => v.key = i+1)
					yield put({
						type: 'save',
						payload: {
							allCount: parseInt(response.allCount),
							deptTableData: JSON.parse(JSON.stringify(response.dataRows)), //统计
							resDataTable: resData, //部门自查表格数据
						}
					})
				}
			},
			*changePage({page}, {put}) { //分页
				yield put({type: 'save', payload: {pageCurrent: page}})
				yield put({type: "queryStaffByDept"}) 
			},
			*queryItem({record},{put, call, select}){
				const {query} = yield select(v =>v.checkFinish);
				let response = yield call(Services.queryItem, {arg_task_id: query.taskId, arg_user_id: record.staffId,arg_assets_id: record.assetsId});
				if(response.retCode && response.retCode == '1'){
				let listData = response.dataRows[0];
				let problemLevelDesc = ''
				listData.problemLevel == 'severe' ? problemLevelDesc = '严重' : null
				listData.problemLevel == 'poor' ? problemLevelDesc = '差' : null
				listData.problemLevel == 'average' ? problemLevelDesc = '一般' : null
				listData.problemLevel == 'mild' ? problemLevelDesc = '轻微' : null
				listData.problemLevel == 'good' ? problemLevelDesc = '好' : null
				listData.problemLevel == 'well' ? problemLevelDesc = '很好' : null
				listData.problemLevel == 'perfect' ? problemLevelDesc = '非常好' : null	
				response.dataRows[0]['problemLevelDesc'] = problemLevelDesc
				yield put({	
					type: 'save',
					payload: {
						detailsList: JSON.parse(JSON.stringify(response.dataRows[0])), //一级菜单数据
					}
				})
				}
			},
			*queryChecksub({query}, {put,call}){
				let dataList = JSON.parse((query.record)) || query.record
				let response = yield call(Services.queryCheckSub, {arg_task_id: dataList.taskId})
				if(response.retCode == '1') {
					let imgData = response.dataRows[0].imgs != "" ? JSON.parse(response.dataRows[0].imgs) : [];
					yield put({
						type: 'save',
						payload: {
							queryCheckSub: response.dataRows[0],
							examContent: JSON.parse(JSON.stringify(response.dataRows[0].examContent)),
							result2: JSON.parse(JSON.stringify(response.dataRows[0].result2)),
							nextRequest: JSON.parse(JSON.stringify(response.dataRows[0].nextRequest)),
							imgs: imgData,
							examineImgIdArr: imgData,
							noticeObjectChoose: [], //进入时通报对象清空
							query: dataList
						}
					})
				}
			}, 
		*checkResultModify({value1, valueContent}, {put}) {
			if(valueContent == 'examContent') {
				yield put({type: 'save', payload: {examContent: value1}})
			}else if(valueContent == 'result2') {
				yield put({type: 'save', payload: {result2: value1}})
			}else if(valueContent == 'nextRequest') {
				yield put({type: 'save', payload: {nextRequest: value1}})
			}
		},
		*noticeObjectChoose({value}, {put}) { //通报对象保存
			yield put({
				type: 'save',
				payload: {
					noticeObjectChoose: value
				}
			})
		},
		*queryInspectDetail({}, {put, call, select}) {
			const {query} = yield select(v =>v.checkFinish);
			let response = yield call(Services.queryInspectDetail, {taskId: query.taskId});
			if(response.retCode == '1') {
				yield put({
					type: 'save',
					payload: {statisticsData:JSON.parse(JSON.stringify(response.dataRows[0]))}
				}) 
			}
		},
		*saveModify({}, {put, call, select}) { //点击保存按钮
			const {query, examineImgIdArr, examContent, result2, nextRequest} = yield select(v =>v.checkFinish);
			let postData = {
				arg_task_id: query.taskId,
				arg_exam_content: examContent,
				arg_result_content: result2,
				arg_next_request: nextRequest,
				arg_result_img: JSON.stringify(examineImgIdArr)
			}
			let response = yield call(Services.updateResult, postData);
			if(response.retCode == '1') {
				message.destroy()
				message.success("保存成功")
			}else{
				message.destroy()
				message.error("保存失败" + response.retVal)
			}
		},
		*submitted({value}, {put, call, select}) { //点击报送安委办/安委办领导按钮
			const {query, examContent, result2, nextRequest} = yield select(v =>v.checkFinish);
			let postData = {
				arg_task_id: query.taskId,
				arg_role_num: value,
				arg_exam_content: examContent,
				arg_result_content: result2,
				arg_next_request: nextRequest,
			}
			let response = yield call(Services.notiLead, postData);
			if(response.retCode == '1') {
				message.destroy()
				message.success("已报送")
				// const {query} = yield select(v=>v.checkFinish)
				// yield put({type: 'queryChecksub', query})
				yield put({type: 'save', payload: {isNoticeLeadFlag: '1'}})
			}else{
				message.destroy()
				message.error("报送失败！" + response.retVal)
			}
		},
		*notification({path}, {put, call, select}) { //通报
			const {query, noticeObjectChoose, result2, examContent, nextRequest} = yield select(v =>v.checkFinish);
			if(noticeObjectChoose.length > 0) {
				let postData = {
					arg_task_id: query.taskId,
					arg_visible: noticeObjectChoose.join(),
					arg_exam_content: examContent,
					arg_result_content: result2,
					arg_next_request: nextRequest,
					arg_current_role: path.indexOf('/safeCheck') > -1 ? '0' : path.indexOf('/branchCheck') > -1 ? '1' : path.indexOf('/deptCheck') > -1 ? '2' : '99'
				}
				let response = yield call(Services.notification, postData);
				if(response.retCode == '1') { 
					message.destroy()
					message.success("已通报")
					yield put({type: 'save', payload: {isNoticeFlag: '1'}})
				}else{
					message.error(response.retVal)
				}
			}else {
				message.destroy()
				message.info("请选择通报对象")
				return
			}
		},
		*saveUploadFile({value,previewImage,previewVisible}, {put,call, select}) { //上传图片
			const {examineImgIdArr} = yield select(s => s.checkFinish)
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
					examineImgIdArr.push(value.filename)
				}
				yield put({
					type: 'save',
					payload: {
						examineImgIdArr: examineImgIdArr
					}
				})
			}
		},
		*onRemove({file}, {put,call, select}) { //删除图片
			const {examineImgIdArr} = yield select(s => s.checkFinish)
			let newList = examineImgIdArr.filter((v) => {
				return v.FileId != file.uid
			})
			yield put({
				type: 'save',
				payload: {
					examineImgIdArr: newList
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
	},
		
subscriptions: {
      	setup({dispatch, history}) {
        	return history.listen(({pathname, query}) => {
				if (pathname === '/adminApp/securityCheck/safeCheck/checkFinish'
				||pathname === '/adminApp/securityCheck/deptCheck/checkFinish'
				||pathname === '/adminApp/securityCheck/branchCheck/checkFinish') { //此处监听的是连接的地址
					dispatch({type: 'queryUserInfo', pathname});
					dispatch({
						type: 'queryTaskInform', //任务详情
						query,
					});
					dispatch({ //检查结果
						type: 'queryChecksub',
						query,
					})
			  }
			});
		},
	},
}