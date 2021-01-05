/**
 * 作者：窦阳春
 * 日期：2019-9-9
 * 邮箱：douyc@itnova.com.cn
 * 功能：用印类型配置
 */
import Cookie from 'js-cookie';
import { message } from "antd";
import * as Services from '../../../services/sealManage/sealApply';
import * as ServicesQuery from '../../../services/sealManage/sealQuery';
// 为表格添加key值
function addTabKey(tabData){
	tabData.map((v, i) => {
		v.key = i + 1
	})
}
// 删除过滤功能
function del(list, value) {
	return list.filter(v => {
		return v.key != value.key
	})
}

export default {
	namespace: 'sealTypeConfig',
	loading: false, 
	state: {
		sealTypeList: [], // 用印类型配置列表
		managerList: [], // 办公室管理员配置列表
		sealType: '', // 新增用印类型配置数据 （一级）
		sealTypeDetails: '', // 新增用印类型 (二级)
		sealTypeParam: '', // 用印类型配置record保存
		sealTypeDetailsParam: '', //用印详情record保存
		specialSwitchRecord: '',
		prevSealName: '', // 点击新增（二级）时， 该行的用章名称
		prevSealUuid: '', // 点击新增（二级）时， 
		departList : [], //部门列表
		deptName: '', // 默认部门名称
		staffName: '',
		staffID: '',
		detailState: '1', // 详情开关状态: '1
		spcecialState: '1',
		tabkey: '1', // 默认显示tabkey为1的用印配置页
		prevSealKey: '',
		staffList: [], // 人员列表
		expandedRowKeys: [], // Table展开控制属性所对应的record.key值
		switchClick: "0",
		specialSwitchClick: '2', //开关 修改 按钮标志位
		deptID: '',
		userID: '', // 选择的人员
		managerParam : { // 办公室管理员请求参数保存
			user_id: '',
			page_current: '1',
			page_size: '10', 
			manager_id: '',
			manager_name: '',
			dept_name: '',
			seal_category: '',
			seal_name: '',
			manager_state: '1',
			seal_details_name: '', 
			seal_details_uuid: '',
			manTotalData: 0,
			pageCurrent: 1,
			pageSize: 10,
		}, 
		specialListData: [],
		detailsParam: [], // 根据一级用印查找到的对应二级用印类型名称
		typeFlag: '1', // 标记位 1 为用印类型配置新增 2 为用印配置修改
		specialFlag: '1',
		managerFlag: '1', // 1 为办公室管理员配置新增 2 为办公室管理员配置修改
		typeState: '1', // 用印类型管理 初始化开关 默认选中
		managerState: '1', // 办公室管理员开关初始化 0关闭 1打开
		page: '1', // 页码数据
		rowCount: '', // 页码中总共行数
		pageSize: 10,
		tempKey: '1',
		jump: "0",
		modifySpecialRecord: '',
		specialAddParam: {
			arg_seal_special_ouid: Cookie.get('OUID'),//| VARCHAR(32) | 是 | 特殊事项ouid|
			arg_seal_special_matters: '',// |VARCHAR(32) | 是 |特殊事项名称|
			arg_seal_auditor_id: '',// | CHAR(7) |是 | 特殊事项审批人id|
			arg_seal_auditor_name: '',// | VARCHAR(10) |是|特殊事项审批人名称
			arg_seal_auditor_deptid: '',// | VARCHAR(32) | 是 |特殊事项部门id
			arg_seal_auditor_deptname: '',// | VARCHAR(45) | 是 |特殊事项部门名称
			arg_create_user_id: Cookie.get("userid"),// | VARCHAR(10) | 是 | 创建人id  |
			arg_create_user_name: Cookie.get("username"),// | VARCHAR(10) | 是 | 创建人姓名 |
		},
		specialModifyParam: {
			arg_seal_special_uuid: '', //特殊事项uuid
			arg_special_state: '', // 特殊事项部门状态
		},
		manSwitch: '0',
		manSwitcParam: {},
		sealFirstList: [], // 一级用印数据
		sealSecondList: [], // 二级用印数据
		typeSwitch1: '2',
		typeSwitch2: '2',
		isSealTypeVisible: false, // 用印类型配置新增
		isSealDetailsVisible: false, // 详情类型配置新增
		isManagerVisible: false, // 办公司管理员配置新增
		isSpecialVisible: false, // 特殊事项
		firstSate: '1',
	},

	reducers: { // 刷新数据
		initData(state) {
			return {
				...state,
				sealTypeList: [], // 用印类型配置列表
				managerList: [], // 办公室管理员配置列表
				sealType: '', // 新增用印类型配置数据
				sealTypeDetails: '', // 新增用印类型 (二级)
				prevSealName: '公章', // 点击新增（二级）时， 该行的用章名称
				prevSealUuid: '', // 点击新增（二级）时， 该行的用章uuid
				prevSealKey: '',
				detailState: '1',
				spcecialState: '1',
				departList : [], //部门列表
				deptName: '', // 默认部门名称
				staffList: [], // 人员列表
				deptID: '', 
				staffName: '',
				staffID: '',
				sealTypeParam: '', // 用印类型配置record保存
				sealTypeDetailsParam: '', //
				specialSwitchRecord: '',
				tabkey: '1', // 默认显示tabkey为1的用印配置页
				expandedRowKeys: [], // Table展开控制属性所对应的record.key值
				switchClick: "0",
				specialSwitchClick: '2', //开关 修改 按钮标志位
				specialListData: [],
				managerParam : { // 办公室管理员请求参数保存
					user_id: '',
					page_current: '1',
					page_size: '10', 
					manager_id: '',
					manager_name: '',
					dept_name: '',
					seal_category: '',
					seal_name: '',
					manager_state: '1',
					seal_details_name: '', 
					seal_details_uuid: '',
					manTotalData: 0,
					pageCurrent: 1,
					pageSize: 10,
				}, 
				detailsParam: [], // 根据一级用印查找到的对应二级用印类型名称
				typeFlag: '1', // 标记位 1 为用印类型配置新增 2 为用印配置修改
				managerFlag: '1', // 1 为办公室管理员配置新增 2 为办公室管理员配置修改
				specialFlag: '1',
				typeState: '1', // 用印类型管理 初始化开关
				managerState: '1', // 办公室管理员开关初始化 0关闭 1打开
				page: '1', // 页码数据
				rowCount: '', // 页码中总共行数
				pageSize: 10,
				jump: "0",
				modifySpecialRecord: '',
				specialAddParam: {
					arg_seal_special_ouid: Cookie.get('OUID'),//| VARCHAR(32) | 是 | 特殊事项ouid|
					arg_seal_special_matters: '',// |VARCHAR(32) | 是 |特殊事项名称|
					arg_seal_auditor_id: '',// | CHAR(7) |是 | 特殊事项审批人id|
					arg_seal_auditor_name: '',// | VARCHAR(10) |是|特殊事项审批人名称
					arg_seal_auditor_deptid: '',// | VARCHAR(32) | 是 |特殊事项部门id
					arg_seal_auditor_deptname: '',// | VARCHAR(45) | 是 |特殊事项部门名称
					arg_create_user_id: Cookie.get("userid"),// | VARCHAR(10) | 是 | 创建人id  |
					arg_create_user_name: Cookie.get("username"),// | VARCHAR(10) | 是 | 创建人姓名 |
				},
				specialModifyParam: {
					arg_seal_special_uuid: '', //特殊事项uuid
					arg_special_state: '0', // 特殊事项部门状态
				},
				manSwitch: '0',
				manSwitcParam: {},
				sealFirstList: [], // 一级用印数据
				sealSecondList: [], // 二级用印数据
				typeSwitch1: '2',
				typeSwitch2: '2',
				isSealTypeVisible: false, // 用印类型配置新增
				isSealDetailsVisible: false, // 详情类型配置新增
				isManagerVisible: false, // 办公司管理员配置新增
				isSpecialVisible: false, // 特殊事项
				firstSate: '1',
			}
		},
		save(state, action) { 
			return { ...state,
				...action.payload 
			};
		}
	},

  	effects: {
		// 切换用印类型配置中开关状态 1开启 0关闭，
		*changeTypeState({record, checked},{put}) {
			yield put({
				type: 'save',
				payload: { //点击开关 获取点击状态，false，typeState保存为0，选中保存为1
					typeState: checked == false? '0': '1',
					typeFlag: '2', //修改标志数
					sealTypeParam: record,
					typeSwitch1: '1'
				}
			})
			yield put({type: 'confirmAddModifySeal'}) // 配置类型修改
		},
		// 切换用印详情配置中开关状态 1开启 0关闭
		*changeDetailsState({record, checked},{put}) {
			yield put({
				type: 'save',
				payload: { 
					detailState: checked === false ? '0' : '1',
					typeFlag: '2',
					sealTypeDetailsParam: record,
					typeSwitch2: "1"
				}
			})
			yield put({type: 'confirmAddModifySealDetails'}) // 配置详情修改
		},
		// 特殊事项配置 点击开关按钮
		*changeSpecialState({record, checked},{ select,put}) {
			yield put({
				type: 'save',
				payload: { 
					spcecialState: checked === false ? '0' : '1',
					specialFlag: '2', 
					specialSwitchRecord: record,
					specialSwitchClick: '1' //点击开关按钮标志位
				}
			})
			yield put({type: 'confirmModifySpecial'}) // 配置详情修改
		},
	*savePage({page}, {put, select}) { 
		const {tabKey, managerParam} = yield select(state => state.sealTypeConfig)
		if(tabKey == '2') {
			managerParam.pageCurrent = page
			yield put({type: 'save', payload: {managerParam: JSON.parse(JSON.stringify(managerParam))}})
			yield put({type: "queryManagerList"})
		}
	},
	//切换管理员配置中开关状态 开状态1 属于启用状态，删除按钮不可使用 关状态删除按钮启用
	*changeManagerState({record, checked},{ select,put}) {
		const { managerParam } = yield select(state => state.sealTypeConfig);
		managerParam.manager_state = record.manager_state;
		yield put({
			type : 'save',
			payload : {
				managerState : checked === false ? '0' : '1', // 当前是否选中 改变开关状态 
				managerParam: JSON.parse(JSON.stringify(managerParam)),
				managerFlag: "2",
				manSwitch: '1',
				manSwitcParam: record
			}
		})
		yield put ({type: 'confirmAddModifyManager'})
	}, 
	// 查询管理员页面表格数据
	*queryManagerList({}, {call, put, select}) { 
		const {managerParam} = yield select(state => state.sealTypeConfig)
		const postDatas = {
			arg_ouid: Cookie.get('OUID'),
			arg_page_current: managerParam.pageCurrent + '', // 当前页码
			arg_page_size: managerParam.pageSize + '' // 每页记录条数
		}
		let data = yield call(Services.sealTypeManagerListSearch, postDatas)
		managerParam.manTotalData = parseInt(data.RowCount)
		if (data.RetCode === '1') { 
			data.DataRows.map((item,index) => {
				item.key = index + 1;
			})
			yield put ({
				type : 'save',
				payload : {
					managerList : JSON.parse(JSON.stringify(data.DataRows)), 
					managerParam: JSON.parse(JSON.stringify(managerParam)),
					tabKey: '2'
				}
			})
		}
	},
	// 查询特殊事项审核人员配置类表
	*specialListSearch({}, {select, put, call}) {
		let postData = {
			arg_user_ouid: Cookie.get("OUID"),
			arg_state: '2'
		}
		let data = yield call(ServicesQuery.specialListSearch, postData)
		addTabKey(data.DataRows)
		if(data.RetCode === '1') {
			yield put({
				type: 'save',
				payload: {
					specialListData: JSON.parse(JSON.stringify(data.DataRows)),
					tabkey: '3'
				}
			})
		}
	},
	// 查询部门列表
	*queryDeptList({}, {put, call}) {
		let postData = {
			ouid: Cookie.get("OUID")
		}
		const data = yield call(Services.searchDeptList,postData);
		if(data.RetCode === '1') {
			yield put({
				type: 'save',
				payload: {
					departList: JSON.parse(JSON.stringify(data.DataRows)),
				}
			})
		}
	},
	// 部门员工查询 
	*queryStaffList({}, {call, put, select}) { 
		const {deptID, tabkey, specialAddParam} = yield select(state => state.sealTypeConfig)
		let deptIDparam;
		tabkey == '2' ? deptIDparam = deptID : deptIDparam = specialAddParam.arg_seal_auditor_deptid
		let postData = {
			ouid: Cookie.get("OUID"),
			deptid: deptIDparam
		}
		const data = yield call(Services.deptUserListQuery, postData);
		if(data.RetCode === "1") {
			yield put({
				type: 'save',
				payload: {
					staffList: JSON.parse(JSON.stringify(data.DataRows))
				}
			})
		}
	},
	// 修改用印类型配置 （一级）
	*modifyType({record},{select,put}) {
		yield put ({
		  type : 'save',
		  payload : {
			sealType : record.seal_name,
			sealTypeParam :record ,
			typeFlag : '2', // titie改为修改
			typeState :"",
			typeSwitch1: '2', // 点击修改
			isSealTypeVisible : true,
		  }
		});
	  },
	  // 点击修改管理员按钮 弹出模态框
	*modifyManager({record}, {select, call ,put}) {
		let {managerParam} = yield select(state => state.sealTypeConfig)
		// deptID = record.deptId
		managerParam.seal_name = record.seal_category  // 一级
		managerParam.seal_details_name = record.seal_name // 二级
		managerParam.manager_name = record.manager_name
		managerParam.id = record.id
		managerParam.manager_id = record.manager_id
		managerParam.manager_state = record.manager_state
		managerParam.dept_name = record.dept_name;
		managerParam.seal_category = record.seal_name
		managerParam.manager_state = record.manager_state
		// yield put({type: 'queryStaffList'}) // 查询员工数据
		let postData = {
			ouid: Cookie.get("OUID"),
			deptid: record.deptId
		}
		const data = yield call(Services.deptUserListQuery, postData);
		if(data.RetCode === "1") {
			yield put({
				type: 'save',
				payload: {
					staffList: JSON.parse(JSON.stringify(data.DataRows))
				}
			})
		}
		yield put({
			type: 'save',
			payload: {
				managerFlag: '2', // title改为修改
				manSwitch: '0', // 未经开关走的修改服务
				isManagerVisible: true,
				managerParam: JSON.parse(JSON.stringify(managerParam)),
				deptName: record.dept_name,
				staffName: record.manager_name,
				deptID: record.deptId
			}
		})
	},
	//  修改用印类型详情配置 （二级）
		*modifyDetails({record},{select,put}){ 
			const { sealTypeList } = yield select (state => state.sealTypeConfig)
			const sealNameMap =  sealTypeList.map((v) => { // uuid和seal_name即prevSealName的映射表
				return (
					{
						[v.seal_uuid]: v.seal_name
					}
				)
			})
			const queryprevSealName = sealNameMap.filter((v,i) => {
				return v[record.seal_uuid] // 把映射表对象里的uuid相等的过滤出来，所对应的名字就是上一级的名字
			})
			yield put ({
				type : 'save',
				payload : {
					sealTypeDetails : record.seal_name, // 把点击行的修改名称显示在Input框里
					sealTypeDetailsParam :record ,
					typeFlag : '2', // titie改为修改
					prevSealName: queryprevSealName[0][record.seal_uuid], // 拿到上一级的名字
					typeSwitch2: '2',
					isSealDetailsVisible: true
				}
			});
		},
	  // 改变typeFlag的值
	  *saveFlag({value},{select,put,call}){
		if (value == "addType"){ // 点击印章配置界面的一级新增
		  yield put ({
			type : 'save',
			payload : {
			  typeFlag : '1', // title改为显示'新增印章证照类型'
			  isSealTypeVisible: true,
			}
		  });
		}
		else if(value == "addManager"){ // 点击管理员新增按钮 请求一级用印数据
			let postData = {
				ouid: Cookie.get("OUID")
			}
			let data = yield call(ServicesQuery.sealFirstCategoryQuery, postData)
			yield put({
				type: 'save',
				payload: {
					managerFlag: '1',// title显示为新增管理员
					sealFirstList: JSON.parse(JSON.stringify(data.DataRows)),
					isManagerVisible: true
				}
			})
		}
	  },
	// 新增 或 修改 用印配置
	*confirmAddModifySeal({}, {select, put, call}) {
		const { typeState, typeFlag, sealTypeParam, sealType, typeSwitch1} =  yield select ( state => state.sealTypeConfig);
		if (typeFlag === '1') { // typeFlag显示新增页面（一级） 请求新增服务
			if(sealType === '') { // 新增用印类型（1级）的用印类型名称为空时提示
				message.error('用印类型名称为不能为空！')
				yield put({type: 'save', payload: {isSealTypeVisible: true}})
				return
			}else if(sealType != '') {
				let postData = {
					arg_seal_ouid : Cookie.get('OUID'),
					arg_seal_name : sealType ,
					arg_create_user_id	: Cookie.get('userid'),
					arg_create_user_name : Cookie.get('username'),
					arg_seal_state: '1'
				};
				let data = yield call(Services.sealTypeName, postData) // 新增
				if (data.RetCode === '1'){
					message.success("新增成功");
					yield put ({
					type : 'save',
					payload : {
						sealType : "",
						page : 1,
						isSealTypeVisible: false
					}
				})
				yield put ({type:"initTypeList"}) // 新增之后重新查询 并且一级按钮置灰
				}else {
					message.error("新增失败");
				}
			}
		} else if (typeFlag === '2') {  // 配置类型修改
			if(sealType === '' && typeSwitch1 === '2') { // 修改用印类型（1级）的用印类型名称为空时提示
				message.error('用印类型名称为不能为空！')
				yield put({type: 'save', payload: {isSealTypeVisible: true}})
				return
			}else{
				let typeStateData = 'w'
				if(typeSwitch1 === "2") { // 点击修改或初始状态
					typeStateData = ''
				} else if(typeSwitch1 === "1") { // 点击开关时
					typeStateData = typeState
				}
				let postData = {
					arg_seal_ouid : Cookie.get('OUID'),
					arg_seal_uuid : sealTypeParam.seal_uuid,
					arg_seal_name: sealType,
					arg_seal_state: typeStateData,
					arg_create_user_id	: Cookie.get('userid'),
					arg_create_user_name : Cookie.get('username'),
				};
				let data = yield call(Services.sealTypeConfigUpdate, postData)
				if (data.RetCode === '1') {
					message.success("修改成功")
					yield put ({type: "initTypeList"}) //修改完走查询服务
					yield put ({
						type: 'save',
						payload: {
							sealType: '', // 清空输入框的内容
							isSealTypeVisible: false
						}
					})
				}else {
					message.error("修改失败")
				}
			}
		}
	},
	
	// 点击新增特殊事项管理员
	*addSpecialItem({}, {select, put }) {
		yield put({
			type: 'save',
			payload: {
				specialFlag: '1',
				isSpecialVisible: true
			}
		})
	},
	// 点击修改特殊事项管理员
	*modifySpecialItem({record}, {put, select}) {
		const {specialAddParam, specialModifyParam, spcecialState} = yield select(state => state.sealTypeConfig)
		specialAddParam.arg_seal_special_matters = record.seal_special_matters;
		specialModifyParam.arg_seal_special_uuid = record.seal_special_uuid;
		specialModifyParam.arg_special_state = spcecialState;
		specialAddParam.arg_seal_auditor_deptname = record.seal_auditor_deptname;
		specialAddParam.arg_seal_auditor_name = record.seal_auditor_name;
		specialAddParam.arg_seal_auditor_id = record.seal_auditor_id;
		specialAddParam.arg_seal_auditor_deptid = record.seal_auditor_deptid;
		if(record.seal_auditor_deptid != '') {
			yield put({type: 'queryStaffList'}) // 查询员工数据
		}
		yield put({
			type: 'save',
			payload: {
				specialFlag: '2',
				modifySpecialRecord: record,
				specialAddParam: JSON.parse(JSON.stringify(specialAddParam)),
				specialModifyParam: JSON.parse(JSON.stringify(specialModifyParam)),
				spcecialState: '',
				specialSwitchClick: '2',
				isSpecialVisible: true
			}
		})
	},
	// 确认新增或修改特殊事项审核管理人员
	*confirmModifySpecial({}, {call, put, select}) {
		const { specialFlag, specialAddParam, specialModifyParam, spcecialState, 
			specialSwitchRecord, specialSwitchClick } =  yield select ( state => state.sealTypeConfig);
			let matter = specialAddParam.arg_seal_special_matters
		if(specialFlag === '1') { // 显示新增
			if((specialSwitchRecord.seal_special_matters == '' || specialAddParam.arg_seal_auditor_name == '') && matter != '其他') {
				message.error("数据不能为空")
				yield put({type: 'save', payload: {isSpecialVisible: true}})
				return
			}else {
				let data = yield call(ServicesQuery.specialListAdd, specialAddParam)
				if(data.RetCode === '1'){
					message.success("新增成功")
					yield put({type: 'save', payload: {isSpecialVisible: false}})
					yield put({type: 'specialListSearch'})
				}else{
					message.error("新增失败")
				}
			}
		}else if(specialFlag === '2') { //显示修改
			if(specialSwitchClick == '1') { // 开关
				let postData = {
					...specialAddParam,
					arg_seal_special_uuid: specialSwitchRecord.seal_special_uuid,
					arg_special_state: spcecialState,
					arg_seal_special_ouid: specialSwitchRecord.seal_special_ouid,
					arg_seal_special_matters: specialSwitchRecord.seal_special_matters,
					arg_seal_auditor_id: specialSwitchRecord.seal_auditor_id,
					arg_seal_auditor_name: specialSwitchRecord.seal_auditor_name,
					arg_seal_auditor_deptid: specialSwitchRecord.seal_auditor_deptid,
					arg_seal_auditor_deptname: specialSwitchRecord.seal_auditor_deptname,
				}
				let data = yield call(ServicesQuery.specialListUpdate, postData);
				if(data.RetCode === '1'){
					yield put({type: 'specialListSearch'})
				}
			}else if(specialSwitchClick == '2') { //修改
				if(specialAddParam.arg_seal_auditor_name == '' && matter != '其他') {
					message.error("管理员选项不能为空")
					return
				}
				specialAddParam.arg_special_state = ''
				let postData = {...specialModifyParam, ...specialAddParam}
				let data = yield call(ServicesQuery.specialListUpdate, postData)
				if(data.RetCode === '1'){
					message.success("修改成功")
					yield put({type: 'specialListSearch'})
				}else {
					message.error("修改失败")
				}
			}
		}
		yield put({type: 'cancelModifySpecialItem'})
	},
	*setJump({}, {put}) {
		yield put({
			type: 'save',
			payload: {
				jump: "1"
			}
		})
	},
	// 用印类型类型配置查询
	*initTypeList({}, {select,call,put}) {
		yield put({
			type: 'save',
			payload: {
				jump: "0"
			}
		})
		let postData = {
			arg_seal_ouid: Cookie.get("OUID") // 传入参数
		}
		let queryDataList = yield call(Services.sealTypeConfigSearch1, postData);// 请求回来的数据
		if (queryDataList.RetCode === '1') {
			queryDataList.DataRows.map((item,index) => {
				item.key = index + 1;
				item.children = []   // 添加children显示+号
			})
			yield put ({
				type : 'save',
				payload : {
					sealTypeList : JSON.parse(JSON.stringify(queryDataList.DataRows)), 
					tabkey: '1',
					expandedRowKeys: [] // 非展开状态
				}
			})
		} 
	},
	// 展开table查询详情操作
	*queryDetailList({record}, {call, put, select}) {
		const {sealTypeList} = yield select(state => state.sealTypeConfig);
		let postData = {
			arg_seal_uuid: record.seal_uuid // 印章唯一id
		}
		// 根据印章id查询出详情列表
		let data = yield call(Services.sealTypeConfigDetailSearch, postData); // 通过印章id拿到点击行的对应返回数据 
		if(data.RetCode === '1') {
			const id = record.seal_uuid // 当前点击加号的印章id
			const {DataRows} = data;
			let index = 0; 
			sealTypeList.find((item, i) => {
				if (item.seal_uuid === id) {
					index = i
				}
			})
			const childrenData = DataRows.map((v, i) => ({
				...v,
				key: index + 1 + '.' + (i + 1),
				seal_name: v.seal_details_name
			}))
			sealTypeList[index].children = childrenData;
			yield put({
				type: 'save',
				payload: {
					sealTypeList:sealTypeList,
				}
			})
		}
	},
	// 确认新增印章证照类型（二级）
	*confirmAddModifySealDetails ({}, {call, put, select}) {
		const {typeSwitch2, typeFlag,detailState , sealTypeDetailsParam, sealTypeDetails, 
			prevSealUuid, sealTypeList, expandedRowKeys, prevSealKey} = yield select (state => state.sealTypeConfig);
		if (typeFlag === '1'){
			if(sealTypeDetails === '') {
				message.error('用印类型名称为不能为空！')
				yield put({type: 'save', payload: {isSealDetailsVisible: true}})
				return
			}else if(sealTypeDetails != ''){
				let postDatas = {
					arg_seal_uuid : prevSealUuid,
					arg_seal_details_name : sealTypeDetails, // Input内输入的章照名称
					arg_create_user_id	: Cookie.get('userid'),
					arg_create_user_name : Cookie.get('username')
				};
				let data = yield call(Services.sealTypeConfigAddDetail, postDatas)
				if (data.RetCode === '1')
					{
						message.success("新增成功");
						let postData = {
							arg_seal_uuid: prevSealUuid // 印章唯一id
						}
						let dataDetail = yield call(Services.sealTypeConfigDetailSearch, postData) // 新增后重新查找详情数据并展示
						const id = prevSealUuid // 当前点击加号的印章id
						const {DataRows} = dataDetail;
						let index = 0; 
						sealTypeList.find((item, i) => {
							if (item.seal_uuid === id) {
								index = i
							}
						})
						const childrenData = DataRows.map((v, i) => ({
							...v,
							key: index + 1 + '.' + (i + 1),
							seal_name: v.seal_details_name
						}))
						sealTypeList[index].children = childrenData;
						sealTypeList[index].sate = 0;
						yield put({
							type: 'save',
							payload: {
								sealTypeDetails : "",
								sealTypeList,
								expandedRowKeys: [...expandedRowKeys, prevSealKey],
								isSealDetailsVisible: false
							}
						})
					}else {
						message.error("新增失败");
					}
			}
				// yield put ({type:"initTypeList"})
		} else if (typeFlag === '2') {  // 详情修改 （二级）
			if(sealTypeDetails === '' && typeSwitch2 == '2') {
				message.error('用印类型名称为不能为空！')
				yield put({type: 'save', payload: {isSealDetailsVisible: true}})
				return
			}else{
				let detailStateData = 'w'
			if(typeSwitch2 === "2") { // 点击修改或初始状态
				detailStateData = ''
			} else if(typeSwitch2 === "1") { // 点击开关时
				detailStateData = detailState
			}
			let postDatas = {
				arg_seal_uuid : sealTypeDetailsParam.seal_uuid,
				arg_seal_details_id: sealTypeDetailsParam.seal_details_id,
				arg_seal_details_name : sealTypeDetails, // Input内输入的章照名称
				arg_create_user_id	: Cookie.get('userid'),
				arg_create_user_name : Cookie.get('username'),
				arg_seal_details_state: detailStateData,   // 修改后的开关状态，点击修改传空
			};
			let data = yield call(Services.sealTypeConfigDetailUpdate, postDatas)
			if (data.RetCode === '1') {
				message.success("修改成功");
				let postData = {
					arg_seal_uuid: sealTypeDetailsParam.seal_uuid // 印章唯一id
				}
				let dataDetail = yield call(Services.sealTypeConfigDetailSearch, postData) // 修改后重新查找详情数据并展示
				const {sealTypeList} = yield select(state => state.sealTypeConfig);
				const id = sealTypeDetailsParam.seal_uuid // 当前点击加号的印章id
				const {DataRows} = dataDetail;
				let index = 0; 
				sealTypeList.find((item, i) => {
					if (item.seal_uuid === id) {
						index = i
					}
				})
				const childrenData = DataRows.map((v, i) => ({
					...v,
					key: index + 1 + '.' + (i + 1),
					seal_name: v.seal_details_name
				}))
				sealTypeList[index].children = childrenData;
				yield put ({
					type: 'save',
					payload: {
						sealTypeList:JSON.parse(JSON.stringify(sealTypeList)),
						switchClick: "0",
						sealTypeDetails: '', // 清空输入框的内容
						isSealDetailsVisible: false
					}
				})
			} else {
				message.error('修改失败')
			}
			}
			
		}
	},
	*setParam({}, {put}) { // 取消一级模态框 清空Input框里的文字
		yield put({
			type: 'save',
			payload: {
				sealType: '', // 清空一级Input框里的文字
				isSealTypeVisible: false
			}
		})
	},
	*saveData ({value},{ select,put }){ // 保存Input里的内容(一级)
		yield put ({
			type : 'save',
			payload : {
			  sealType : value,
			}
		})
	  },
	*detailsEmpty ({}, {put}) { // 取消二级模态框 清空二级Input框里的文字
		yield put ({
			type: 'save',
			payload: {
				sealTypeDetails: '',
				isSealDetailsVisible: false
			}
		})
	},
	*cancelModifySpecialItem ({}, {put}) { // 取消模态框
		yield put ({
			type: 'save',
			payload: {
				specialAddParam: {
					arg_seal_special_ouid: Cookie.get('OUID'),
					arg_seal_special_matters: '',
					arg_seal_auditor_id: '',
					arg_seal_auditor_name: '',
					arg_seal_auditor_deptid: '',
					arg_seal_auditor_deptname: '',
					arg_create_user_id: Cookie.get("userid"),
					arg_create_user_name: Cookie.get("username")
				},
				staffList: [],
				isSpecialVisible: false
			}
		})
	},
	*saveDetail ({value}, {put}) { // 保存Input里的内容(二级)
		yield put ({
			type : 'save',
			payload : {
				sealTypeDetails : value,
			}
		})
	},
	*saveSpecialIpt({value},{put, select}) {
		const {specialAddParam} = yield select(state => state.sealTypeConfig);
		specialAddParam.arg_seal_special_matters = value
		yield put ({
			type: 'save',
			payload: {
				specialAddParam: JSON.parse(JSON.stringify(specialAddParam))
			}
		})
	},
	// 保存管理员选择
	*selectManager({value}, {put}) {
		let data = value.split("#");
		yield put({
			type: 'save',
			payload: {
				staffName: data[0],
				staffID: data[1]
			}
		})
	},
	// 保存特殊事项管理员
	*selectSpecialManager({value}, {put, select}) {
		const {specialAddParam} = yield select(state => state.sealTypeConfig);
		let data = value.split("#");
		specialAddParam.arg_seal_auditor_name = data[0];
		specialAddParam.arg_seal_auditor_id = data[1];
		yield put({
			type: 'save',
			payload: {
				specialAddParam: JSON.parse(JSON.stringify(specialAddParam))
			}
		})
	},
	// 确认删除用印配置操作 (一级)
	*delSealConfig({value},{call, put, select}) {
		const {sealTypeList} = yield select(state => state.sealTypeConfig)
		let postData = {
			arg_seal_uuid: value.seal_uuid
		}
		const {RetCode} = yield call(Services.sealTypeDelete, postData);
		if (RetCode === '1') {
			message.success("删除成功！")
			let sealTypeListFilter = del(sealTypeList, value) // 删除此行
			yield put({
				type: 'save',
				payload: {
					sealTypeList: JSON.parse(JSON.stringify(sealTypeListFilter))
				}
			})
			yield put ({type: 'initTypeList'})
		} else {
			message.error("删除失败！")
		}
	},

	//  确认删除用印配置操作 (二级)
	*delSealDetailsConfig ({record}, {call, put, select}) {
		let postDatas = { arg_seal_details_id: record.seal_details_id}
		let data = yield call (Services.sealTypeConfigDelDetail, postDatas)
		if (data.RetCode === '1') {
			message.success("删除成功！")
			// arg_seal_details_id: record.seal_details_id,
			let postData = {
				arg_seal_uuid: record.seal_uuid // 印章唯一id
			}
			let dataDetail = yield call(Services.sealTypeConfigDetailSearch, postData) // 删除后重新查找详情数据并展示
			const {sealTypeList, prevSealKey, expandedRowKeys} = yield select(state => state.sealTypeConfig);
			const id = record.seal_uuid // 当前点击加号的印章id
			if(dataDetail.RetCode === '1') {
				const {DataRows} = dataDetail;
				let index = 0; 
				sealTypeList.find((item, i) => {
					if (item.seal_uuid === id) {
						index = i
					}
				})
				const childrenData = DataRows.map((v, i) => ({
					...v,
					key: index + 1 + '.' + (i + 1),
					seal_name: v.seal_details_name
				}))
				sealTypeList[index].children = childrenData;
				let newExpandedRowKeys = expandedRowKeys;
				if (DataRows.length === 0) {
					sealTypeList[index].sate = 1;
					newExpandedRowKeys = expandedRowKeys.map(v => {
						if (v !== prevSealKey) return v;
					})
					yield put({type: 'save', payload: {firstSate: '0'}})
				}
				yield put({
					type: 'save',
					payload: {
						sealTypeList,
						expandedRowKeys: newExpandedRowKeys
					}
				})
			}
		}else {
			message.error("删除失败")
		}
	},
	// 保存一级用印选中值
	*sealTypeChange({value}, {call, put, select}) {
		const { managerParam } = yield select(state => state.sealTypeConfig)
		let sealData = value.split('#')
		managerParam.seal_name = sealData[0]; // 选择的值保存在select框上
		managerParam.seal_uuid = sealData[1];
		// 保存一级用印类型之以后 把下面二级的名清空
		managerParam.seal_details_name= ''
		let postData = {
			seal_uuid: sealData[1],
			ouid: Cookie.get('OUID')
		}
		let data = yield call(ServicesQuery.sealSecondCategoryQuery, postData) // 请求一级用印类型对应的二级用印类型名称
		if(data.RetCode === '1') {
			yield put({
				type: 'save',
				payload: {
					managerParam: JSON.parse(JSON.stringify(managerParam)),
					sealSecondList: JSON.parse(JSON.stringify(data.DataRows)), // 根据一级查询出来的二级类型名刷新
				}
			})
		}
	},
	// 保存二级用印类型的值
	*detailsTypeChange({value} ,{select, put}) {
		const { managerParam } = yield select(state => state.sealTypeConfig)
		managerParam.seal_details_name = value.split('#')[0];
		managerParam.seal_details_uuid = value.split("#")[1];
		yield put({
			type: 'save',
			payload: {
				managerParam: JSON.parse(JSON.stringify(managerParam))
			}
		})
	},
	// 保存选中的部门名称
	*deptChange({value}, {put}) {
		let data = value.split('#');
		yield put({
			type: 'save',
			payload: {
				deptName: data[0], 
				deptID: data[1],
				tabkey: '2',
				staffName: ''
			}
		})
		yield put({type: 'queryStaffList'}) // 查询员工数据
	},
	*cancelModifyManager({}, {put, select}) { // 模态框消失 清空部门和管理员框数据
		const {managerParam} = yield select(state => state.sealTypeConfig)
		managerParam.seal_name = ''
		managerParam.seal_details_name = ''
		managerParam.seal_details_uuid = ''
		yield put({
			type: 'save',
			payload: {
				staffName: '',
				deptName: '',
				managerParam: JSON.parse(JSON.stringify(managerParam)),
				staffList: [],
				sealSecondList: [],
				isManagerVisible: false 
			}
		})
	},
	// 保存特殊事项中选中的部门名称
	*deptSpecialChange({value}, {put, select}) {
		let data = value.split('#');
		const {specialAddParam} = yield select(state => state.sealTypeConfig);
		specialAddParam.arg_seal_auditor_deptname = data[0];
		specialAddParam.arg_seal_auditor_deptid = data[1];
		specialAddParam.arg_seal_auditor_name = ''
		yield put({
			type: 'save',
			payload: {
				specialAddParam: JSON.parse(JSON.stringify(specialAddParam)),
				tabkey: '3'
			}
		})
		yield put({type: 'queryStaffList'}) // 查询员工数据
	},
	// 新增或修改办公室管理人员
	*confirmAddModifyManager({}, {call, put, select}) {
		const {managerFlag, managerState, staffID, staffName, manSwitch, managerParam, manSwitcParam} 
		= yield select(state => state.sealTypeConfig)
		let postData = {
			id: '',
			manager_id: staffID,
			username: staffName,
			manager_ou_id: Cookie.get("OUID"),
			seal_details_id: managerParam.seal_details_uuid,
			state: managerState,
			create_user_id: Cookie.get("userid"),
			create_user_name: Cookie.get("username")
		}
		if(managerFlag === '1') { // 管理员新增 id为空
			postData['id'] = ''
		} else if(managerFlag === '2') { // 管理员修改
			postData['id'] = (manSwitch == '1') ? manSwitcParam.id : managerParam.id
		}
		if(((managerParam.seal_details_uuid == '' || staffID == ''|| staffName == '') && managerFlag === '1') 
		|| ((staffID == '' || staffName == '') && manSwitch === '0')){
			message.error("数据不能为空")
			yield put({type: 'save', payload: {isManagerVisible: true}})
			return
		}else { 
			let data = yield call(Services.sealManagerSaveOrUpdate, postData)
			if(data.RetCode === '1') {
				if(managerFlag === '1') {
					message.success("新增成功")
				}else if(manSwitch == '1' || manSwitch == '0') {
					message.success("修改成功")
				}
				managerParam.seal_details_uuid = ''
				managerParam.seal_details_name = ''
				managerParam.seal_name = ''
				yield put({type: 'save', payload: {
					isManagerVisible: false,
					staffID: '',
					staffName: '',
					deptName: '',
					deptID: '',
					staffList: [],
					sealSecondList: [],
					managerParam: JSON.parse(JSON.stringify(managerParam))
				}})
				yield put({type: 'queryManagerList'})
			}
			// if(data.RetCode === '1' && managerFlag === '1') {
			// 	message.success("新增成功")
			// 	yield put({type: 'queryManagerList'})
			// }else if(data.RetCode === '1' && manSwitch == '1') { // 开关修改
			// 	message.success("修改成功")
			// 	yield put({type: 'queryManagerList'})
			// } else if(data.RetCode === '1' && manSwitch == '0') { // 修改
			// 	message.success("修改成功")
			// 	yield put({type: 'save', payload: {isManagerVisible: false}})
			// 	yield put({type: 'queryManagerList'})
			// }
		}
	},
	// 确认删除管理员
	*delManagerConfig({record}, {call, put, select}) {
		const {managerList} = yield select(state => state.sealTypeConfig)
		const postDatas = {
			id: record.id,
			create_user_id: Cookie.get("userid"),
			create_user_name: Cookie.get("username"),
			state: record.manager_state, 
		}
		let data = yield call(Services.sealTypeConfigManagerDel, postDatas)
		if(data.RetCode === '1') { 
			message.success('删除成功')
			yield put({
				type: 'save',
				payload: {
					managerList: JSON.parse(JSON.stringify(del(managerList, record)))
				}
			})
			// yield put({type: 'queryManagerList'})
		}else {
			message.error('删除失败')
		}
	},
	// 确认删除特殊事项
	*delSpecialConfig({record}, {call, put}) {
		const postData = {
			arg_seal_special_uuid: record.seal_special_uuid
		}
		let data = yield call(ServicesQuery.specialListDelete, postData)
		if(data.RetCode === '1') {
			message.success("删除成功")
			yield put({type: 'specialListSearch'})
		}
	},
	*addDetailsList({record}, {put}) { // 弹出（二级）模态框 取出点击行的seal_uuid 显示上级类型名称
		yield put ({
			type: 'save',
			payload: {
				prevSealName: record.seal_name,
				prevSealUuid: record.seal_uuid,
				prevSealKey :record.key,
				typeFlag: "1",
				isSealDetailsVisible: true
			}
		})
	}
},
	  

subscriptions: {
      	setup({dispatch, history}) {
        	return history.listen(({pathname, query}) => {
			  if (pathname === '/adminApp/sealManage/sealTypeConfig') { //此处监听的是连接的地址
				dispatch({type: 'initData'});
            	dispatch({
				type: 'initTypeList', // 匹配到路由，初始化页面
				query // 如果有跳转，从跳转那个页面带过来的数据
            	});
			  }
			});
		},
	},
}
