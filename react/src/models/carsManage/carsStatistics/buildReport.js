/**
 * 作者：窦阳春
 * 日期：2020-09-17 
 * 邮箱：douyc@itnova.com.cn
 * 功能：生成统计报告
 */
import { message } from "antd";
import * as Services from '../../../services/carsManage/carsManageServices';
import { routerRedux } from "dva/router";
let month = new Date().getMonth()+1;
export default {
	namespace: 'buildReport',
	loading: true, 
	month: new Date().getMonth()+1,
	state: {
		radioValue: 1,
		yearCheck: new Date().getFullYear() + '',
		quarterCheck: month > 0 && month <= 3 ? '第一季度' : month > 3 && month <=6 ? '第二季度' : month > 6 && month <=9 ? '第三季度' : '第四季度',
		monthCheck: '',
		statistics: [],
		statisticsTable: [],
		remarks: '',
		pageFlag: '',
		title: ''
	},
	reducers: { // 刷新数据
		save(state, action) {
			return { ...state,
				...action.payload
			};
		},
	},
	effects: {
		*init({query}, {put}) {
			if(JSON.stringify(query) != '{}') {
				const {name, pageFlag, year, month, type, quarter, formId} = JSON.parse(query.record);
				yield put({
					type: 'save',
					payload: {
						statistics: [],
						statisticsTable: [],
						remarks: '',
						title: name,
						pageFlag,
						yearCheck: year,
						quarterCheck: quarter,
						monthCheck: month,
						radioValue: type
					}
				})
				yield put({type: 'toShowReport', formId: formId}) 
			}else {
				yield put({
					type: 'save',
					payload: {
						radioValue: 1,
						yearCheck: new Date().getFullYear() + '',
						quarterCheck: month > 0 && month <= 3 ? '第一季度' : month > 3 && month <=6 ? '第二季度' : month > 6 && month <=9 ? '第三季度' : '第四季度',
						monthCheck: '',
						statistics: [],
						statisticsTable: [],
						remarks: '',
						pageFlag: '',
						title: ''
					}
				})
			}
		},
		*saveValue({value, flag}, {put, select}) { // 保存填选字段
			let {radioValue} = yield select(v=>v.buildReport);
			let params = {};
			params[flag] = value;
			if(radioValue == 0 || value == 0) {
				params['monthCheck'] = '';
				params['quarterCheck'] = '';
			}else if(radioValue == 1) {
				params['monthCheck'] = '';
			}
			yield put({
				type: 'save',
				payload: params
			})
		},
		*toShowReport({formId}, {put, call, select}) {
			let {radioValue, yearCheck, quarterCheck, monthCheck} = yield select(v=>v.buildReport);
			let season = quarterCheck == '第一季度' ? 1 :quarterCheck == '第二季度' ? 2 :quarterCheck == '第三季度' ? 3 :quarterCheck == '第四季度' ? 4 : 0;
			if(radioValue == 1 && quarterCheck == '') {
				message.destroy()
				message.info("请选择季度")
				return
			}else if(radioValue == 2 && monthCheck == '') {
				message.destroy()
				message.info("请选择月份")
				return
			}else if(radioValue == 2 && Math.ceil(Number(monthCheck)/3) != season) {
				message.destroy();
				message.info("月份和季度不符！")
				return
			}else{
				let postData = {
					quarter: quarterCheck,
					month: monthCheck + '',
					year: yearCheck + '',
					type: radioValue, 
					buttonType: formId != undefined ? '1' : '0',
					formId: formId != undefined ? formId : '',
				}
				let response = yield call(Services.getReportNews, postData);
				if(response.retCode == '1') {
					response.dataRows.deptStatistics.map((v, i) => {
						v.key = i + 1
						v.carForUsers.map((item, index) => {
							item.key = index + 1;
						}) 
					});
					response.dataRows.histogram.series = JSON.parse(JSON.stringify(response.dataRows.histogram.series))
					yield put({
						type: 'save',
						payload: {
							statistics: JSON.parse(JSON.stringify(response.dataRows.histogram)),
							statisticsTable: response.dataRows.deptStatistics,
							remarks: response.dataRows.remark 
						}
					})
				}else{
					message.error(response.retVal)
				}
			}
		},
		*toBuildReport({}, {call, put, select}) {
			const {radioValue, yearCheck, remarks, quarterCheck, monthCheck} = yield select(v=>v.buildReport);
			let season = quarterCheck == '第一季度' ? 1 :quarterCheck == '第二季度' ? 2 :quarterCheck == '第三季度' ? 3 :quarterCheck == '第四季度' ? 4 : 0;
			if(radioValue == 1 && quarterCheck == '') {
				message.destroy()
				message.info("请选择季度")
				return
			}else if(radioValue == 2 && monthCheck == '') {
				message.destroy()
				message.info("请选择月份")
				return
			}else if(radioValue == 2 && Math.ceil(Number(monthCheck)/3) != season) {
				message.destroy();
				message.info("月份和季度不符！")
				return
			}else{
				let postData = {
					quarter: quarterCheck,
					month: monthCheck + '',
					remark: remarks,
					year: yearCheck + '',
					type: radioValue,
				}
				let response = yield call(Services.buildReport, postData)
				if(response.retCode == '1') {
					message.destroy();
					message.success("成功生成统计报告！")
					yield put(routerRedux.push('/adminApp/carsManage/carsStatistics'))
					yield put({type: 'save', pageFlag: '', title: '', statisticsTable: [], statistics: [], remarks: ''})
				}else{
					message.error(response.retVal)
				}
			}
		},
	},
	subscriptions: {
		setup({dispatch, history}) {
			return history.listen(({pathname, query}) => {
				if (pathname === '/adminApp/carsManage/carsStatistics/buildReport'
				 || pathname === '/adminApp/carsManage/carsStatistics/showReport') { //此处监听的是连接的地址
					dispatch({type: 'init', query}); 
			  }   
			}); 
		},
	},
}
