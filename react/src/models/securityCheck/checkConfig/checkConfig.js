/**
 * 作者：窦阳春
 * 日期：2020-5-9
 * 邮箱：douyc@itnova.com.cn
 * 功能：检查配置
 */
import { message } from "antd";
import * as Services from '../../../services/securityCheck/securityCheckServices';
export default {
	namespace: 'checkConfig',
	loading: true, 
	state: {
		pageCurrent: 1, //当前页
		rowCount: 0, //总页数
		oneList: [], //一级表格数据
		expandedRowKeys: [], //展开行的key值
	},
    reducers: { // 刷新数据
			save(state, action) {
				return { ...state,
					...action.payload
				};
			},
    },
  	effects: {
			*oneconfiglistquery({}, {put, call, select}) { //一级内容
				const {pageCurrent} = yield select(v=>v.checkConfig)
				let postData = {
					argPageSize: 100,
					argPageCurrent: pageCurrent
				}
				let response = yield call(Services.oneconfiglistquery, postData)
				if(response.retCode == '1') {
					response.dataRows.map((v, i) => {
						v.key = i+1;
						v.children = []
					});
					yield put({
						type: 'save',
						payload: {
							rowCount: parseInt(response.allCount), //总条数
							oneList: JSON.parse(JSON.stringify(response.dataRows)),
							expandedRowKeys: []
						}
					})
				}
			},
			*twoconfiglistquery({record}, {put, call, select}) {
				let {oneList, expandedRowKeys} = yield select(v=>v.checkConfig)
				if(record.children.length == 1 && record.deleteGo == '1') {
					oneList[record.key-1].hasTwo = '0' //二级数据为空
				}
				let response = yield call(Services.twoconfiglistquery, {id: record.id})
				if(response.retCode == '1') {
					oneList.map((v, i) => {
						if(v.id == record.id) {
							response.dataRows.map((item, index) => item.key = v.key + '.'+ (index+1))
							v.children = [...response.dataRows]
						}
					})
					record['deleteGo'] && delete record['deleteGo']
					yield put({
						type: 'save',
						payload: {
							oneList,
							expandedRowKeys: [...expandedRowKeys,record.key]
						}
					})
				}
			},
			*cancelExpand({record}, {put, select}) {
				const {expandedRowKeys} = yield select(v=>v.checkConfig)
				let newData = expandedRowKeys.filter(v=> {
					return v!= record.key
				})
					yield put({
						type: 'save',
						payload: {
							expandedRowKeys: newData
						}
					})
			},
			*changePage({page}, {put}) { //分页
				yield put({type: 'save', payload: {pageCurrent: page}})
				yield put({type: "oneconfiglistquery"}) 
			},
			*checkConfigAddUpdate({data, flag,recordSave}, {put,call, select}) {//新增 修改
				let {oneList} = yield select(v=>v.checkConfig);
				let response = [],tips = '';
				if(flag == '新增') {
					response = yield call(Services.checkconfigadd, data);
					tips = '新增'
				}else {
					response = yield call(Services.checkconfigupdate, data);
					tips = '修改'
				}
				if(response.retCode == '1') {
					message.destroy()
					message.success(tips+'成功')
					if(flag == '修改') {
						oneList.map((v) => {
							if(v.id == data.id) {
								v.content = data.content; //一级修改
							}
							v.children.map(item => {
								if(item.id == data.id) {
									item.content = data.content //二级修改
								}
							})
						})
					}else if(flag == '新增'){
						let key = 0;
						if(recordSave.key == undefined) { //一级新增
							oneList.map((v, i) => {
								key = i+1;
							})
							oneList = [...oneList, {id: response.dataRows[0].id, content: data.content, key: key+1, children: []}]
						}else{ //二级新增
							if(recordSave.children.length != 0) {//二级数据展开时
								recordSave.children.map(v => key = parseFloat(v.key))
								recordSave.children = [...recordSave.children, {id: response.dataRows[0].id, content: data.content, key: (key+0.1).toFixed(1)}]
							}
							oneList[recordSave.key-1].hasTwo = '1'
							yield put({type: 'save',payload: {oneList}})
						}
						yield put({ 
							type: 'save', 
							payload: {
								oneList: JSON.parse(JSON.stringify(oneList)),
							}
						})
					}
				}else{
					message.error(tips+"失败 " + response.retVal)
				}
			},
			*deleteContent({data, value, record}, {put, call, select}) {
				let {oneList} = yield select(v=>v.checkConfig);
				let response = yield call(Services.checkconfigdelete, data);
				if(response.retCode == '1') {
					let dataList = [], recordValue = [];
					message.destroy()
					message.success('删除成功')
					if(value == 'deleteOne') { //一级删除
						dataList = oneList.filter((v) =>{
							return v.id != data.id 
						})
						dataList.map((v, i) => v.key = i+1);
					}else{ //二级删除
						dataList = oneList
						let key = parseInt(record.key)
						recordValue = oneList.filter((v) =>{
							return v.key == key
						})
						recordValue[0].deleteGo = '1'
						yield put({type: 'twoconfiglistquery', record: recordValue[0]})
					}
					yield put({
						type: 'save', 
						payload: {
							oneList: dataList,
						}
					})
				}else{
					message.error('删除失败 ' + response.retVal)
				}
			},
		},
		
subscriptions: {
      	setup({dispatch, history}) {
        	return history.listen(({pathname, query}) => {
				if (pathname === '/adminApp/securityCheck/checkConfig') { //此处监听的是连接的地址
				dispatch({type: 'oneconfiglistquery'}); 
			  }   
			}); 
		},
	},
}
