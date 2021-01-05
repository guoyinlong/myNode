/**
 * 作者：窦阳春
 * 日期：2019-4-13
 * 邮箱：douyc@itnova.com.cn
 * 功能：安委办/分院检查首页
 */
import Cookie from 'js-cookie';
import { message } from "antd";
import * as Services from '../../../services/securityCheck/securityCheckServices';
function timeSub(tim) {
	//  var num = tim.indexOf('00:');
	//  return tim.substring(0,num);
	 return tim.substr(0, 10)
}
export default {
	namespace: 'securityOfficeIndex',
	loading: true, 
	state: {
		stateList: '',  //状态
		tableData: [], //表格数据
		allCount: 0, // 数据总数
		pageCurrent: 1, //当前页数
		roleType: '', //当前角色类型 1 安委办 2 分院办公室接口人 3 总院部门安全员 4 分院部门安全员
		temp: '',
		pathname: ''
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
				let OUID = 'e65c02c2179e11e6880d008cfa0427c4';
				let roleData = yield call(Services.queryUserInfo, {});
				let roleTypeData = ''
				let stateList = [
					{
						"id": "0",
						"stateName": "全部"
					},
					{
						"id": "draft",
						"stateName": "草稿"
					},
					{
						"id": "check",
						"stateName": "检查中"
					},
					{
						"id": "endCheck",
						"stateName": "检查完成"
					}
				]
				if(roleData.retCode == '1') {
					if(roleData.dataRows[0].roleName.indexOf("安委办主办") > -1){
						roleTypeData = '1';
						if(pathname.indexOf('/securityCheck/safeCheck') > 1) {
							stateList = [...stateList, {"id": "informed","stateName": "已通知"}]
						}
					}else if(roleData.dataRows[0].roleName.indexOf("办公室安全接口人") > -1){ 
						roleTypeData = '2';
					}else if(roleData.dataRows[0].roleName.indexOf("安全员")>-1 && Cookie.get("OUID")==OUID) {//本院安全员
						roleTypeData = '3';
					}else if(roleData.dataRows[0].roleName.indexOf("分院部门安全员")>-1 && Cookie.get("OUID")!=OUID){//分院安全员
						roleTypeData = '4';
					}
					yield put({
						type: 'save',
						payload: {
							stateList: JSON.parse(JSON.stringify(stateList)),
							roleType: roleTypeData,
							pathname,
							pageCurrent: 1
						}
					})
					yield put({type: 'queryTaskList', pathnameModal: pathname})
				}
			},
			*queryTaskList({data, pathnameModal}, {call, put, select}){
				const { pageCurrent, pathname} = yield select(v => v.securityOfficeIndex)
				var path = pathnameModal || pathname
				var temp = ''
				if(path.indexOf('deptCheck')>-1) {
					temp = '1'
				}else if(path.indexOf('/securityCheck/safeCheck')>-1) {
					temp = '0'
				}else if(path.indexOf('branchCheck')>-1) {
					temp = '2'
				}
				if(data == undefined) {//刚进入页面
					data = {	
						RowCount: 10,
						temp,
					 }
				}
				data.temp = temp
				data.pageCurrent = pageCurrent
				let listData = yield call(Services.queryTaskList, data);
				if(listData.retCode && listData.retCode === '1'){ 
					listData.dataRows.map((item, index) => {
						item.key = index + 1
						item.startTime = timeSub(item.startTime)
						item.endTime = timeSub(item.endTime)
						item.taskTime = item.startTime + '~' + item.endTime
					})
					yield put({
						type: 'save',
						payload:{
							tableData: JSON.parse(JSON.stringify(listData.dataRows)),
							allCount: parseInt(listData.allCount), // 数据总数
							pageCurrent:parseInt(listData.pageCurrent), //当前页数
							temp //列表查询参数 安委办0 分院2 部门1
						}
					})
				}
			},
			*delTask({record}, {call, put, select}){ //删除
				const {tableData} = yield select(state => state.securityOfficeIndex)
				let newTableData = tableData.filter((item) => {
					return item.taskId !== record.taskId
				})
				newTableData.map((item, index) => { //重新给序号赋值
					item.key = index + 1
				})
				yield put({
					type: 'save',
					payload: {
						tableData: JSON.parse(JSON.stringify(newTableData))
					}
				})
				let data = yield call(Services.delTask, {taskId: record.taskId})
				if(data.retCode === '1') {
					message.destroy()
					message.success("删除成功")
				}
			},
			//分页
			*changePage({page}, {put}) { 
				yield put({type: 'save', payload: {pageCurrent: page}})
				yield put({type: "queryTaskList"}) 
			},
		},
		
	subscriptions: {
		setup({dispatch, history}) {
			return history.listen(({pathname, query}) => {
				if (pathname === '/adminApp/securityCheck/safeCheck' 
				|| pathname === '/adminApp/securityCheck/deptCheck'
				||pathname === '/adminApp/securityCheck/branchCheck') { //此处监听的是连接的地址 
					dispatch({type: 'queryUserInfo', pathname}); //角色判断
					// dispatch({type: 'queryTaskList'}); //任务列表查询
				}   
		});
	},
	},
}
