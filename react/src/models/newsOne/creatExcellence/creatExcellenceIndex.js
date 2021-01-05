/**
 * 作者：窦阳春
 * 日期：2020-10-13 
 * 邮箱：douyc@itnova.com.cn
 * 功能：争优创先首页
 */
import { message } from "antd";
import { data } from "jquery";
import * as Services from '../../../services/newsOne/newsOneServers';
export default {
	namespace: 'creatExcellence',
	month: new Date().getMonth()+1,
	state: {
    defaultYear: new Date().getFullYear(),
		radioValue: 3,
		yearCheck: new Date().getFullYear() + '',
		deptData: [],
		goodNewsAdvancedPersonalList: [], //先进个人
		goodNewsPublicityOrganizerList: [], //优秀新闻宣传组织者
		newsPublicityAdvancedCollectivityList: [],//新闻宣传先进集体
		newsPublicityAdvancedUnitsList: [],//先进单位
		loadMoreFlag: '', //加载更多
		unitCount: '',
		collectCount: '',
		personCount: '',
		organizerCount: '',
		newsReportData: [], //新闻工作报告数据
		newsReportCount: 1,
		pageCurrent: 1,
		reportName: '',
		pickTime: '',
		imageId: '',
		uploadImage: [],
	},
	reducers: { // 刷新数据
		save(state, action) {
			return { ...state,
				...action.payload
			};
		},
	},
	effects: {
    *saveValue({flag, value, time}, {put}) { // 保存
			let param = {}
			time=='time' ? param['pickTime'] = value : param[flag] = value
			yield put({
				type: 'save',
				payload: param
			})
		},
		*saveUploadFile({file, id, advancedUnitType}, {put, select, call}) {
			let {goodNewsAdvancedPersonalList, goodNewsPublicityOrganizerList, newsPublicityAdvancedCollectivityList, newsPublicityAdvancedUnitsList} = yield select(v=>v.creatExcellence);
				let listData = [], param = '';
				if(advancedUnitType.indexOf('先进单位') > -1) {
					listData = newsPublicityAdvancedUnitsList;
					param = 'newsPublicityAdvancedUnitsList'
				}else if(advancedUnitType.indexOf('先进集体') > -1) {
					listData = newsPublicityAdvancedCollectivityList;
					param = 'newsPublicityAdvancedCollectivityList'
				}else if(advancedUnitType.indexOf('组织者') > -1) {
					listData = goodNewsPublicityOrganizerList;
					param = 'goodNewsPublicityOrganizerList'
				}else if(advancedUnitType.indexOf('先进个人') > -1) {
					listData = goodNewsAdvancedPersonalList;
					param = 'goodNewsAdvancedPersonalList'
				}
				listData.map((v) => {
					v.id == id ? v.uploadImage = file : null
				})
				if(file.length == 0) {//删除接口出来走删除服务
					let data = yield call(Services.deleteImage, {id})
					if(data.retCode == '1') {
						message.destroy()
						message.success("删除成功");
					listData.map((v) => {
						v.id == id ? v.image = '' : null
					})
					yield put({type: 'save'});
					}else{
						message.destroy()
						message.error("删除失败！ " + data.retVal)
					}
					return
				}else{
					let payloadData = {uploadImage: file, imageId: id};
					payloadData[param] = param
					yield put({type: 'save', payload: {uploadImage: file, imageId: id} });
					return new Promise((resolve) => {
						setTimeout(() => {
							let url = '/microservice/newsmanager/uploadImag';
							let formData = new FormData();
							formData.append("image", JSON.stringify(file[0].response.filename));
							formData.append("id", id);
							let opts = {
								method:"Post",
								body:formData,
								credentials: 'include',
						};
						fetch(url, opts)
						.then((response) => {
								return response.text();
						})
						.then((responseText) => {
							if (JSON.parse(responseText).retCode === '1') {
								message.destroy()
								message.success("上传成功！")
							} else {
								message.error(JSON.parse(responseText).retVal);
							}
						})
						.catch((error) => {
							message.error(error)
						})
					}, 1000);
				}).then((resolve) => {
				}).catch(() => {
				});
			}
		},
		*action({}, {put}) {
			yield put({
				type: 'save',
				payload: {
					pageCurrent: 1,
					reportName: '',
					pickTime: ''
				}
			})
			yield put({
				type: 'queryNewsReportLike', 
				emptyPostData: {
					pageCurrent: 1,
					reportName: '',
					pickTime: ''
				}
			})
		},
		*serch({yearCheck, loadMoreFlag}, {call, put}) {
			let postData = {
				pageCurrent : '1',
				pageSize : '10',
				uploadTime: yearCheck || new Date().getFullYear() + '',
				nowsTime: yearCheck || new Date().getFullYear() + ''
			}
			let data = yield call(Services.queryByTimeUploadEvaluation, postData)
			if(data.retCode == '1') { 
				for(var key in data.dataRows) { //循环对象加key值
					data.dataRows[key].map((v, i) => {v.key = i+1; v.uploadImage = []})
			}
			let unit = data.dataRows.newsPublicityAdvancedUnitsList;
			let collect = data.dataRows.newsPublicityAdvancedCollectivityList;
			let person = data.dataRows.goodNewsAdvancedPersonalList;
			let organizer = data.dataRows.goodNewsPublicityOrganizerList;
			function filters(arr, flag, num) {
				return loadMoreFlag == flag ? arr : ((arr.length>=num || loadMoreFlag==undefined) ? arr.splice(0, num) : arr.length<num ? arr : arr);
			}
			yield put({
				type: 'save', 
				payload: {
					defaultYear: yearCheck || new Date().getFullYear(),
					unitCount: unit.length,
					collectCount: collect.length,
					personCount: person.length,
					organizerCount: organizer.length,
					goodNewsAdvancedPersonalList: filters(person, 'person', 5),
					goodNewsPublicityOrganizerList: filters(organizer, 'organizer', 3),
					newsPublicityAdvancedCollectivityList: filters(collect, 'collect', 3),
					newsPublicityAdvancedUnitsList: filters(unit, 'unit', 3),
				}})
			}else {
				message.info(data.retVal)
			}
		},
		*queryNewsReportLike({pageNumber, emptyPostData}, {call, put, select}) { //新闻工作报告根据时间名称查询分页
			const {reportName, pickTime} = yield select(v=>v.creatExcellence)
			let postData = emptyPostData || {
				pageCurrent: pageNumber || 1,
				pageSize: '10',
				reportName,
				createTime: pickTime
			}
			let data = yield call(Services.queryNewsReportLike, postData)
			if(data.retCode == '1') {
				data.dataRows.map((v, i) => v.key = i+1)
				yield put({
					type: 'save',
					payload: {
						newsReportData: JSON.parse(JSON.stringify(data.dataRows)),
						newsReportCount: data.allCount,
					}
				})
			}else{
				message.error("查询失败" + data.retVal)
			}
		},
		*changePage({page}, {put}) {
			yield put({type: 'queryNewsReportLike', pageNumber: page})
		},
		*loadMore({flag}, {put}) {//加载更多
			yield put({type: 'serch', loadMoreFlag: flag})
		},
		*deleteNewsReport({id}, {call, put}) {
			let data = yield call(Services.deleteNewsReport, {id})
			if(data.retCode == '1') {
				message.success("删除成功");
				yield put({type: 'queryNewsReportLike'})
			}else{
				message.error(data.retVal)
			}
		},
	},
	subscriptions: {
		setup({dispatch, history}) {
			return history.listen(({pathname, query}) => {
				if (pathname === '/adminApp/newsOne/creatExcellence') { //此处监听的是连接的地址
					dispatch({type: 'serch', query}); 
			  }   
			}); 
		},
	},
}
