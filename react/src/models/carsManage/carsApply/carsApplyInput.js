/**
 * 作者：窦阳春
 * 日期：2020-09-07 
 * 邮箱：douyc@itnova.com.cn
 * 功能：用车申请填报页面
 */
import { routerRedux } from "dva/router";
import { message } from "antd";
import Cookie from 'js-cookie';
import * as Services from '../../../services/carsManage/carsManageServices';
function isNumber(nubmer) {
	var re = /^\d+$/;
	if (re.test(nubmer)) {
		 return true;
	}else{
			return false;
	}
}
export default {
	namespace: 'carsApplyInput',
	loading: true, 
	state: {
		pageKey: '',
		peopleNum: '',
		pickTime: '',
		lineStart1: '',
		lineEnd1: '',
		lineStart2: '',
		lineEnd2: '',
		radioValue: 1,
		resaonChoose: '', //用车事由选择
		carsExplainNotes: '', //用车说明事项
		carsDemander: [], //用车需求人
		carsDemanderPick: [],
		carsTogetherPick: [], //选中的同车同乘人
		carsManager: [],
		carsManagerPick: '',
		pageFlag: '',
		demandId: '',
	},
	reducers: { // 刷新数据
		save(state, action) {
			return { ...state,
				...action.payload
			};
		},
	},
	effects: {
		*init({query}, {put, call}) {
			const {pageKey} = query;
			let requestData = yield call(Services.carsDemander, {})
			let managerData = yield call(Services.carsManager, {}) //车管员列表
			let params = {pageKey}
			if(requestData.retCode == '1' && managerData.retCode == '1') {
				params = {pageKey, carsDemander: requestData.dataRows, carsManager: managerData.dataRows}
			}else{
				params = {pageKey}
				message.error(requestData.retVal)
			}
			let valuePick = Cookie.get("userid") + '-' + Cookie.get("username");
			params = {
				peopleNum: '',
				pickTime: '',
				lineStart1: '',
				lineEnd1: '',
				lineStart2: '',
				lineEnd2: '',
				radioValue: 1,
				resaonChoose: '',
				carsExplainNotes: '',
				carsDemanderPick: [valuePick],
				carsTogetherPick: [],
				carsManagerPick: '',
				pageFlag: '',
				...params, 
			}
			yield put({
				type: 'save',
				payload: params
			})
			if(query.flag == 'modify') {
				yield put({
					type: 'modify', query
				})
			}
		},
		*modify({query}, {put, call}) {
			const {flag, demandId, type} = query;
			let response = yield call(Services.applyDetail, {demandId})
			if(response.retCode == '1') {
				let {endFirst, endSecond, ifBacktrack, reason, reasonDetail, startFirst, startSecond, useTime, userCount, 
					userId, userName, verifierId, verifierName, withId, withName} = response.dataRows.carDemand;
				yield put({
					type: 'save',
					payload: {
						pageFlag: flag,
						pageKey: type == '0' ? 'normalBusiness' : type == '1' ? 'workOnBusiness' : type =='2' ? 'specialMatters' : '',
						carsDemanderPick: userId!='' ? userId.split(',').map((v,i)=>{return v+'-'+(userName.split(','))[i]}) : [],
						peopleNum: Number(userCount),
						radioValue: Number(ifBacktrack),
						resaonChoose: reason,
						carsTogetherPick: withId!='' ? withId.split(',').map((v,i)=>{return v+'-'+(withName.split(','))[i]}) : [],
						pickTime: useTime.slice(0, -5),
						carsExplainNotes: reasonDetail,
						lineStart1: startFirst,
						lineEnd1: endFirst,
						lineStart2: startSecond,
						lineEnd2: endSecond,
						carsManagerPick: verifierId!='' ? verifierId + '-' + verifierName : '',
						demandId
					}
				})
			}
		},
		*saveValue({value, flag, time}, {put}) { // 保存填选字段
			let params = {}
			if(flag == 'peopleNum' && ( value!=='' && isNumber(value) == false)) {
				message.destroy();
				message.info("请输入数字！")
				return
			}else {
				time == "time" == true ? params['pickTime'] = value : params[flag] = value;
				yield put({
					type: 'save',
					payload: params
				})
			}
		},
		*submit({flag}, {put, select, call}) { // 保存|提交
			let {peopleNum, pickTime, lineStart1, lineStart2, lineEnd1, lineEnd2, radioValue, resaonChoose, demandId,
				 carsExplainNotes, carsDemanderPick, carsTogetherPick, carsManagerPick, pageKey, pageFlag} = yield select(v=>v.carsApplyInput);
			if(flag == '提交' && ((carsDemanderPick.length==0 || pickTime=='' || lineStart1.trim()=='' || lineEnd1.trim()=='' || carsManagerPick.length==0)
			|| (pageKey=='normalBusiness' && (resaonChoose.trim() == '' || peopleNum =='')) )) {
				message.destroy()
				message.info("请输入必填字段！")
				return
			}else if(flag == '保存' && carsDemanderPick.length == 0) {
				message.destroy();
				message.info("请选择用车需求人")
				return
			}else if(flag == '提交' && (lineStart2.trim() != '' || lineEnd2.trim() != '') && (lineStart2.trim() =='' || lineEnd2.trim() == '')) {
				message.destroy(); 
				message.info("请完整输入起点和终点!")
				return
			}else{
				let postData = {
					type: pageKey == 'normalBusiness' ? '0' : pageKey == 'workOnBusiness' ? '1' : pageKey == 'specialMatters' ? '2' : '', //申请单类型
					userId: carsDemanderPick.map((v)=>{return v.substring(0, v.indexOf('-'))}).join(),
					userName: carsDemanderPick.map((v)=>{return v.substring(v.indexOf('-')+1, v.length)}).join(),
					userCount: pageKey=='normalBusiness' ? peopleNum + '' : carsDemanderPick.length+carsTogetherPick.length, //乘车人数
					useTime: pickTime,
					startFirst: lineStart1,
					endFirst: lineEnd1,
					startSecond: lineStart2,
					endSecond: lineEnd2,
					ifBacktrack: pageKey=='normalBusiness' ? radioValue : '',
					reason: resaonChoose,
					reasonDetail: carsExplainNotes,
					verifierId: carsManagerPick.substring(0, carsManagerPick.indexOf('-')), 
					verifierName: carsManagerPick.substring(carsManagerPick.indexOf('-') + 1),
					title: pageKey == 'normalBusiness' ? '正常业务支撑用车' : pageKey == 'workOnBusiness' ? '因公出差接送站用车' : pageKey == 'specialMatters' ? '个人特殊事宜临时用车' : '',
					withId: carsTogetherPick.map((v)=>{return v.substring(0, v.indexOf('-'))}).join(),
					withName: carsTogetherPick.map((v)=>{return v.substring(v.indexOf('-')+1, v.length)}).join(),
				};
				let response = {}, post = {...postData, buttonType: flag == '保存' ? 0 : 1};
				response = pageFlag == 'modify' ? yield call(Services.editCarDemand, {...post, demandId}) : yield call(Services.submit, post)
				if(response.retCode == '1') {
					message.destroy()
					message.success(flag + "成功");
					let path = pageFlag == 'modify' ? 'carsQuery' : 'carsApply'
					yield put(routerRedux.push('/adminApp/carsManage/' + path));
				}else {
					message.error(response.retVal)
				}
			}
		},
	},
	subscriptions: {
		setup({dispatch, history}) {
			return history.listen(({pathname, query}) => {
				if (pathname === '/adminApp/carsManage/carsApply/carsApplyInput') { //此处监听的是连接的地址
					dispatch({type: 'init', query}); 
			  }else if(pathname === '/adminApp/carsManage/carsApply/carsApplyModify') {
					dispatch({type: 'init', query});
				}   
			}); 
		},
	},
}
