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
	namespace: 'checkDetailing',
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
		createTime: '',
		examineImgId: [], // 上传图片参数
		roleObject: '', //通知对象
		roleType: '', // 1 安委办  2 分院办公室安全接口人 
		checkPerson: '1', //检查人 1安委办 2分院办公室安全接口人 3部门安全员
		query: [], //表格行数据
		oneMenuL: [],
		detailsList: {}, //详情列表
		allCount: 0, // 数据总数
		pageCurrent: 1, //当前页数
		deptTableData: [],
		pathname: '',
		notifyFlag: '0'
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
			*queryUserInfo({pathname}, {call, put, select}){
				let OUID = "e65c02c2179e11e6880d008cfa0427c4"
				let roleData = yield call(Services.queryUserInfo, {});
				let roleTypeData = '0'
				if(roleData.retCode == '1') {
					if(roleData.dataRows[0].roleName.indexOf("安委办主办")>-1){
						roleTypeData = '1'
					}else if(roleData.dataRows[0].roleName.indexOf("办公室安全接口人")>-1){
						roleTypeData = '2'
					}else if(roleData.dataRows[0].roleName.indexOf("安全员")>-1 && Cookie.get("OUID")==OUID) {//部门安全员
						roleTypeData = '3'
					}else if(roleData.dataRows[0].roleName.indexOf("安全员")>-1 && Cookie.get("OUID")!=OUID) {//分院部门安全员
						roleTypeData = '4'
					}
					yield put({
						type: 'save',
						payload: {
							roleType: roleTypeData,
							pathname
						}
					})
				}
			},
			//查询任务详情
			*queryTaskInform({query},{put, call}){
				let dataList = JSON.parse((query.record))
				let response = yield call(Services.queryTaskInform, {taskId: dataList.taskId})
				if(response.retCode == '1') {
					const {createUserName, startTime, endTime, taskTitle, taskTypeDesc, examineObj, 
						belongUserName, otherOu, demand,examineContent, examineImg, createTime} = response.dataRows[0];
					yield put({
						type: 'save',
						payload: {
							createUserName: createUserName,
							startTime: timeSub(startTime),
							endTime: timeSub(endTime),
							theme: taskTitle,
							typeChoose: taskTypeDesc, //检查方式
							checkObject: examineObj, //检查对象
							checkValue: parseInt(otherOu), //涉及分院  1 0
							checkContent: examineContent,  //检查内容
							checkRequire: demand, //检查要求
							createTime: createTime,
							examineImgId: (examineImg!=""&&examineImg!=null)?JSON.parse(examineImg) : [], //图片
							roleObject: belongUserName,
							query: dataList
						}
					})
				}
			},
			*queryCourtyardAndDeptAndStaff({},{put, call, select}){
				const {query} = yield select(v =>v.checkDetailing);
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
				const {query, pageCurrent} = yield select(v =>v.checkDetailing);
				let postData = {
					taskId: query.taskId,
					deptId: Cookie.get('dept_id'),
					RowCount:10,
					pageCurrent: pageCurrent
				}
				const response = yield call(Services.queryStaffByDept, postData)
				if(response.retCode == '1') {
					response.dataRows.map((v, i) => v.key = i+1)
					yield put({
						type: 'save',
						payload: {
							allCount: parseInt(response.allCount),
							deptTableData: JSON.parse(JSON.stringify(response.dataRows)),
						}
					})
				}
			},
			*changePage({page}, {put}) { //分页
				yield put({type: 'save', payload: {pageCurrent: page}})
				yield put({type: "queryStaffByDept"}) 
			},
			*queryItem({record},{put, call, select}){
				const {query} = yield select(v =>v.checkDetailing);
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
			*notify({data}, {put, call, select}) { //通知整改
				let response = yield call(Services.addNoticeRectification, data)
				const {pathname} = yield select(v => v.checkDetailing)
				if(response.retCode == '1'){
					message.destroy()
					message.success('已通知整改');
					if(pathname.indexOf('/securityCheck/safeCheck') > -1 || pathname.indexOf('/securityCheck/branchCheck') > -1) {
						yield put({type: 'queryCourtyardAndDeptAndStaff'})
					}else if(pathname.indexOf('/securityCheck/deptCheck') > -1) {
						yield put({type: 'queryStaffByDept'})
					}
				}else {
					message.destroy()
					message.error(response.retVal + '通知失败！');
				}
				yield put({
					type: 'save',
					payload: {
						notifyFlag: '1'
					}
				})
			},
	},
		
subscriptions: {
      	setup({dispatch, history}) {
        	return history.listen(({pathname, query}) => {
				if (pathname === '/adminApp/securityCheck/safeCheck/checkDetailing'
				||pathname === '/adminApp/securityCheck/deptCheck/checkDetailing'
				||pathname === '/adminApp/securityCheck/branchCheck/checkDetailing') { //此处监听的是连接的地址
				dispatch({type: 'queryUserInfo', pathname});
					dispatch({
						type: 'queryTaskInform', //任务详情
						query
					});
			  }
			});
		},
	},
}
