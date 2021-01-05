/**
 * 作者：窦阳春
 * 日期：2020-9-28
 * 邮箱：douyc@itnova.com.cn
 * 文件说明：新闻共享平台-宣传渠道备案模块首页列表
 */
import { message } from "antd";
import * as Services from '../../services/newsOne/newsOneServers';
export default {
	namespace: 'newsConfigurationIndex',
	state: {
		channelName: '', //新增渠道类型
		chanelList: [], //宣传渠道一级
		channelTwoName: '', //二级新增名称
    	visible: false,
		channelTwoVisible: false,
		expandedRowKeys: [],
		pageCurrent1: 1,
		pageCurrent2: 1,
		pageCurrent3: 1,
		pageCurrent4: 1,
		pageCurrent7: 1,
		allCount: 1,
		allCount2: 1,
		allCount3: 1,
		allCount4: 1,
		allCount7: 1,
		publicNotice: '',//宣传公告
		promotionTypeList: [], //宣传类型
		planList: [],
		xuanNum: 1, //宣传次数
		planDept: '',
		planDeptDataList: [], //部门列表数据
		flatDataList: [], //宣传平台
		flatData: '',
		rewardList: [], //奖项数据
		fileList: [], //保密文件列表
		fileTypeValue: '保密文件', //文件类型
		fileData: [], //上传的文件数据
		newsConfigList: [], //新闻宣传配置列表
		newsPersonDept: [],
		newsPerson: [],
		planNewsManDept: '',
		expandedRowKeysMan: [],
	},

	reducers: {
		save(state, action) {
			return { ...state,
				...action.payload
			};
		},
	},

	effects: {
		*pubChannelQueryOne({pageNumber, pageFlag}, {call, put, select}) {
			const {pageCurrent1, chanelList} = yield select(v => v.newsConfigurationIndex) 
			let postData = {
				pageCurrent: pageNumber || pageCurrent1,
				RowCount: '10'
			}
			let data = yield  call(Services.pubChannelQueryOne, postData);
			if(data.retCode == '1') {
				let	obj = pageFlag == 1 ? [...chanelList, ...data.dataRows.splice(-1)] : JSON.parse(JSON.stringify(data.dataRows));
				obj.map((v, i)=> {v.key = i+1});
				yield put({
					type: 'save',
					payload: {
						chanelList: obj,
						allCount: data.allCount,
						pageCurrent1: data.pageCurrent,
						expandedRowKeysMan: [],
						expandedRowKeys: []
					}
				})
			}else{
				message.error('查询失败'+data.retVal)
			}
		},
		*changePage({page, pageFlag}, {put}){
			let param = {}
			param[`pageCurrent${pageFlag}`] = page
			yield put({type: 'save',payload: param})
			pageFlag == 1 ?
			yield put({type: 'pubChannelQueryOne', pageNumber: page})
			: pageFlag == 2 ?
			yield put({type: 'queryPromotionType', pageNumber: page})
			: pageFlag == 3 ?
			yield put({type: 'queryPubPlan', pageNumber: page})
			: pageFlag == 4 ?
			yield put({type: 'queryPubReward', pageNumber: page})
			: pageFlag == 7 ?
			yield put({type: 'querySecretFile', pageNumber: page})
			: null
		},
		*expandedRowKeysMan({record}, {put, select}) {
			const {expandedRowKeysMan} = yield select(v => v.newsConfigurationIndex);
			expandedRowKeysMan.includes(record.key) ? expandedRowKeysMan.splice(expandedRowKeysMan.indexOf(record.key), 1) : expandedRowKeysMan.push(record.key)
			yield put({
				type: 'save',
				payload: {
					expandedRowKeysMan
				}
			})
		},
		*pubChannelQueryTwo({record}, {call, put, select}) {
			const {chanelList, expandedRowKeys} = yield select(v => v.newsConfigurationIndex) 
			let data = yield  call(Services.pubChannelQueryTwo, {parentId: record.id})
			if(data.retCode == '1') {
        chanelList.length && chanelList.map(( item, index )=>{
          if( item.id == record.id){
						item["chanelListTwo"] = JSON.parse(JSON.stringify(data.dataRows));
						item["chanelListTwo"].map((v, i) => {
							v.key = index + 1 + '.' + Number(i+1)
						})
          }
				})
				let expandKeys = [];
				if(expandedRowKeys.includes(record.key)) {
					expandKeys = expandedRowKeys.filter((v) => {
						return v != record.key
					})
				}else{
					expandKeys = [...expandedRowKeys, record.key]
				}
				yield put({
					type: 'save',
					payload: {
						chanelList: JSON.parse(JSON.stringify(chanelList)),
						expandedRowKeys: expandKeys
					}
				})
			}else{
				message.error(data.retVal)
			}
		},
		*queryPubPlan({pageNumber}, {call, put}) { //key=3 宣传计划列表查询
			// const {pageCurrent3} = yield select(v => v.newsConfigurationIndex) 
			let postData = {
				pageCurrent: pageNumber || 1,
				pageSize: '10'
			}
			let data = yield  call(Services.queryPubPlan, postData)
			let deptData = yield  call(Services.queryPlanDept, {})
			let flatData = yield  call(Services.queryTwoChannel, {})
			deptData.retCode == '1'
			? yield put({type: 'save', payload: {planDeptDataList: JSON.parse(JSON.stringify(deptData.dataRows))}})
			: message.error("部门查询失败" + deptData.retVal)
			flatData.retCode == '1'
			? yield put({type: 'save', payload: {flatDataList: JSON.parse(JSON.stringify(flatData.dataRows))}})
			: message.error("宣传平台查询失败" + deptData.retVal)
			if(data.retCode == '1') {
				data.dataRows.map((v, i)=> {
					v.key = i+1;
					v.publicityNumber = isNaN(Number(v.publicityNumber)) == true ? 1 : v.publicityNumber;
				}) 
				yield put({
					type: 'save',
					payload: {
						planList: JSON.parse(JSON.stringify(data.dataRows)),
						allCount3: data.allCount,
						pageCurrent3: data.pageCurrent
					}
				})
			}else{
				message.error('查询失败'+data.retVal)
			}
		},
		*queryDeptByOuId({record}, {call, put}) { //宣传员配置部门查询
			let data = yield call(Services.queryDeptByOuId, {ouId: record.ouId});
			data.dataRows.map((v, i) => {v.key = i+1});
			if(data.retCode == '1') {
				yield put({
					type: 'save',
					payload: {
						newsPersonDept: JSON.parse(JSON.stringify(data.dataRows))
					}
				})
			}else{message.error(data.retVal)}
		},
		*queryUserListByDeptId({deptId}, {call, put}) { //宣传员配置部门查询
			let data = yield call(Services.queryUserListByDeptId, {deptId});
			if(data.retCode == '1') {
				yield put({
					type: 'save',
					payload: {
						newsPerson: JSON.parse(JSON.stringify(data.dataRows))
					}
				})
			}else{message.error(data.retVal)}
		},
		*channel({pageFlag, modiPageRecord, modifyPage}, {call, put, select}){
			const {channelName, flatData, planDept, xuanNum} = yield select(v=>v.newsConfigurationIndex)
			if(channelName.trim() == '') {
				message.destroy();
				message.info('不能为空！')
				return
			}else {
				let resData = [], postData={channelName: channelName.trim()}, action = '';
				if(pageFlag == 1) {
					resData = yield call(Services.pubChannelAdd, postData);
					action = 'pubChannelQueryOne'
				}else if(pageFlag == 2) {
					resData = yield call(Services.addPromotionType, {typeName: channelName.trim()})
					action = 'queryPromotionType'
				}else if(pageFlag == 4) {
					resData = yield call(Services.addPubReward, {typeName: channelName.trim()})
					action = 'queryPubReward'
				}else if(pageFlag == 6 && modifyPage == 'addPage6') {
					resData = yield call(Services.addPublicist, {publicistId: channelName})
					action = 'queryNewsPub'
				}
				if(modifyPage == 'addPage3') { //新增年度宣传计划
					postData = {
						deptOrOu: planDept,//部门id
						publicityPlatform : flatData,//宣传平台
						publicityMatters: channelName.trim(),
						publicityNumber: xuanNum + ''
					}
					resData = yield call(Services.addPubPlan, postData)
					action = 'queryPubPlan'
				}else if(modifyPage == 'modiPage3') { //修改年度计划
					postData = {
						id: modiPageRecord.id,
						deptOrOu: planDept,//部门id
						publicityPlatform : flatData,//宣传平台
						publicityMatters: channelName.trim(),
						publicityNumber: xuanNum + ''
					}
					resData = yield call(Services.updatePubPlan, postData)
					action = 'queryPubPlan'
				}else if(modifyPage == 'modiPage6') { //修改新闻宣传员
					resData = yield call(Services.updatePublicist, {id: modiPageRecord.id, publicistId: channelName})
					action = 'queryNewsPub'
				}
				if(resData.retCode == '1') {
					let str = (pageFlag != '3' && modifyPage != 'modiPage6') || (pageFlag && pageFlag == '3' &&  modifyPage == 'addPage3') ? "新增成功" : '修改成功';
					message.destroy()
					message.success(str);
					yield put({
						type: 'save',
						payload: {
							visible: false,
							channelName: '',
							planDept: '',
							flatData: '',
							planNewsManDept: '',
							newsPerson: [],
							xuanNum: 1,
							// expandedRowKeys: []
						}
					})
					yield put({type: action, pageFlag})
				}else{
					message.destroy()
					message.error('新增失败！' + resData.retVal)
					yield put({
						type: 'save',
						payload: {
							visible: true,
						}
					})
				}
			}
		},
		*savePageRecord({record, page}, {put, call}) {  
			if(page == 'modiPage3') {//宣传计划配置修改显示默认
				yield put({
					type: 'save',
					payload: {
						channelName: record.publicityMatters,
						planDept: record.deptOrOuName,
						flatData: record.publicityPlatform,
						xuanNum: Number(record.publicityNumber),
					}
				})
			}else if(page == 'modiPage6') {
				let data = yield call(Services.queryUserListByDeptId, {deptId: record.deptId});
				if(data.retCode == '1') {//新闻宣传员配置修改显示默认
					yield put({
						type: 'save',
						payload: {
							channelName: record.publicistName,
							planNewsManDept: record.deptName.substring(record.deptName.indexOf('-')+1),
							newsPerson: JSON.parse(JSON.stringify(data.dataRows))
						}
					}) 
				}else{message.error(data.retVal)}
			}
		},
		*delChannel({id, level, parentId, servicesName, putAction, record}, {call, put, select}){
			let resData = {};
			resData = yield call(Services[servicesName], {id});
			if(resData.retCode == '1') {
				message.destroy()
				message.success("删除成功")
				if(level == 'one') {
					let {chanelList, expandedRowKeys} = yield select(v=>v.newsConfigurationIndex);
					let list = chanelList.filter( v => { return v.id != id });
					list.map((v, i) => {
						v.key = i+1;
						v.chanelListTwo && v.chanelListTwo.map((item, index) => {
							item.key = i + 1 + '.' + Number(index + 1);
						})
					});
					expandedRowKeys = expandedRowKeys.sort(function(a, b){return a - b});
					var copy = expandedRowKeys;
					let beforeData = expandedRowKeys.splice(0, expandedRowKeys.indexOf(record.key));
					let behideData = expandedRowKeys.splice(1, expandedRowKeys.length-1);
					var newData = behideData.map(function (index) {return index - 1});
					yield put({
						type: 'save',
						payload: {
							chanelList: list,
							expandedRowKeys: copy.includes(record.key-1) ? [...beforeData, ...newData, record.key-1] : [...beforeData, ...newData]
						}
					})
				}else if(level == 'two'){
					yield put({type: putAction, record: {id: parentId}})
				}else{
					yield put({type: putAction});
				}
			}else{
				message.destroy()
				message.error('删除失败！' + resData.retVal)
			}
		},
		*channelTwoName({value, actionFlag, parentId}, {call, put, select}){ //添加 修改
			let {channelTwoName, chanelList, promotionTypeList, rewardList} = yield select(v=>v.newsConfigurationIndex)
			let resData = {}, successText = ''
			let  typeName= channelTwoName.trim();
			if(typeName == '') {
				message.destroy();
				message.info('不能为空！')
				return
			}else{
				if(actionFlag == 'add') {
					resData = yield call(Services.pubChannelAdd, {channelName: typeName, parentId: value})
					successText = '添加'
				}else if(actionFlag.indexOf('modify') > -1) {
					resData = yield call(Services.pubChannelEdit, {channelName: typeName, id: value})
					successText = '修改'
				}else if(actionFlag == 'modiPage2') {
					resData = yield call(Services.updatePromotionType, {typeName, id: value})
					successText = '修改'
				}else if(actionFlag == 'modiPage4') {
					resData = yield call(Services.updatePubReward, {typeName, id: value})
					successText = '修改'
				}
				if(resData.retCode == '1') {
					let idValue = actionFlag == 'modify2' ? parentId : value
					yield put({type: 'pubChannelQueryTwo', record: {id: idValue}})
					actionFlag == 'modify1' ?
					chanelList.length && chanelList.map((v) => {
						if(v.id == value) {
							v.channelName = channelTwoName.trim()
						}
					})
					: actionFlag == 'modiPage2' ?
					promotionTypeList.length && promotionTypeList.map((v) => {
						if(v.id == value) {
							v.typeName = channelTwoName.trim()
						}
					})
					: actionFlag == 'modiPage4' ?
					rewardList.length && rewardList.map((v) => {
						if(v.id == value) {
							v.typeName = channelTwoName.trim()
						}
					})
					: null
					message.success( successText + "成功")
					yield put({
						type: 'save',
						payload: {
							channelTwoVisible: false,
							channelTwoName: '',
							channelName: '',
						}
					})
				}else{
					message.destroy()
					message.error(successText + '失败！' + resData.retVal)
					yield put({
						type: 'save',
						payload: {
							channelTwoVisible: true,
						}
					})
				}
			}
		},
		*publicNoticeSet({flag}, {call, put, select}){
			const {publicNotice} = yield select(v=>v.newsConfigurationIndex)
			let postData = {
				flag: flag == 'confirm' ? '1' : '0',
				typeName: flag == 'confirm' ? publicNotice : '',
			}
			let data = yield call(Services.pubAnnouncement, postData)
			if(data.retCode == '1') {
				if(flag != 'confirm') {
					yield put({
						type: 'save',
						payload: {
							publicNotice:data.dataRows[0] ==null?'':data.dataRows[0].typeName
						}
					})
				}else{	
					message.destroy()
					message.success('更新成功！') 
				}
			}
		},
		*queryPromotionType({pageNumber}, {call, put, select}){ //查询宣传类型配置
			const {pageCurrent2} = yield select(v=>v.newsConfigurationIndex)
			let postData = {
				pageCurrent: pageNumber || pageCurrent2+'',
				pageSize: '10'
			}
			let data = yield call(Services.queryPromotionType, postData)
			if(data.retCode == '1') {
				data.dataRows.map((v, i)=> {v.key = i+1})
				yield put({
					type: 'save',
					payload: {
						promotionTypeList: JSON.parse(JSON.stringify(data.dataRows)),
						allCount2: data.allCount,
						pageCurrent2: data.pageCurrent
					}
				})
			}else{
				message.error('查询失败'+data.retVal)
			}
		},
		*queryPubReward({}, {call, put, select}){ //查询宣传奖项
			const {pageCurrent4} = yield select(v=>v.newsConfigurationIndex)
			let postData = {
				pageCurrent: pageCurrent4+'',
				pageSize: '10'
			}
			let data = yield call(Services.queryPubReward, postData)
			if(data.retCode == '1') {
				data.dataRows.map((v, i)=> {v.key = i+1})
				yield put({
					type: 'save',
					payload: {
						rewardList: JSON.parse(JSON.stringify(data.dataRows)),
						allCount4: data.allCount,
						pageCurrent4: data.pageCurrent
					}
				})
			}else{
				message.error('查询失败'+data.retVal)
			}
		},
		*queryNewsPub({}, {call, put}){ //查询新闻配置列表 key = 6
			let postData = {
				pageSize: '10'
			}
			let data = yield call(Services.queryNewsPub, postData);
			if(data.retCode == '1') {
				data.dataRows.map((v, i) => {
					v.key = i+1;
					v.publicists.map((item, index) => { item.key = i + 1 + '.' + Number(index + 1)});
				})
				yield put({
					type: 'save',
					payload: {
						newsConfigList: JSON.parse(JSON.stringify(data.dataRows)),
					}
				})
			}else{
				message.error('查询失败'+data.retVal)
			}
		},
		*querySecretFile({}, {call, put, select}){ //查询保密文件
			const {pageCurrent7} = yield select(v=>v.newsConfigurationIndex)
			let postData = {
				pageCurrent: pageCurrent7+'',
				pageSize: '10'
			}
			let data = yield call(Services.querySecretFile, postData)
			if(data.retCode == '1') {
				data.dataRows.map((v, i)=> {v.key = i+1})
				yield put({
					type: 'save',
					payload: {
						fileList: JSON.parse(JSON.stringify(data.dataRows)),
						allCount7: data.allCount,
						pageCurrent7: data.pageCurrent
					}
				})
			}else{
				message.error('查询失败'+data.retVal)
			}
		},
		*saveChange({flag, value}, {put}){
			let params = {};
			if(flag == 'planNewsManDept') {
				yield put({type: 'queryUserListByDeptId', deptId: value});
				yield put({
					type: 'save',
					payload: {channelName: ''} //新闻宣传员清空
				})
			}
			params[flag] = value;
			yield put({
				type: 'save',
				payload: params
			})
		},
		*saveUploadFile({file}, {put}) {
			yield put({type: 'save', payload: {fileData: file} })
		},
		*addFile({}, {call, put, select}) { //新增保密文件
			let {fileData, fileTypeValue} = yield select(v=>v.newsConfigurationIndex)
			let visible = true;
			if(fileData.length == 0) {
				message.destroy();
				message.info("请上传文件")
				return
			}else{
				let postData = {
					file: JSON.stringify(fileData[0].response.filename),
					fileType: fileTypeValue,
				}
				let data = yield call(Services.addSecretFile, postData)
				if(data.retCode === '1') {
					message.destroy();
					message.success("新增成功")
					visible = false
					yield put({type: 'querySecretFile'});
					yield put({type: 'save', payload: {fileData: []}})
				}else{
					message.error("新增失败"+ data.retVal)
					visible = true
				}
				yield put({
					type: 'save',
					payload: {visible}
				})
			}
		},
		*setVisible({value, flag}, {put}) {
			let params = {}
			params[flag] = value;
			if(value==false) { //模态框不显示清空字段
				yield put({
					type: 'save', 
					payload: {
						channelName: '', 
						channelTwoName: '',
						planDept: '',
						flatData: '',
						planNewsManDept: '',
						newsPerson: [],
						xuanNum: 1,
					}
				})
			}
			yield put({
				type: 'save',
				payload: params,
			})
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
				if (pathname === '/adminApp/newsOne/newsConfigurationIndex') { //此处监听的是连接的地址
					dispatch({
						type: 'pubChannelQueryOne',
						query
					});
				}
			});
		},
	},
};