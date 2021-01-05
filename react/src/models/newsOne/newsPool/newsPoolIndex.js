/**
 * 作者：贾茹
 * 日期：2020-9-28
 * 邮箱：18311475903@163.com
 * 文件说明：新闻共享平台-新闻宣传资源池模块首页列表
 */

import Cookie from 'js-cookie';
import { message } from "antd";
import { routerRedux } from 'dva/router'; 
import * as newsOneService from '../../../services/newsOne/newsOneServers.js';

export default {
	namespace: 'newsPoolIndex',
	state: {
		channelTypes:[], //搜索框宣传类型数据
		channelsChecked:'全部',//选中的发布渠道类型
		manuscriptTitle:'',      //选中的人名字
		author:'', //查询条件-作者
		stateSelected:'全部', //状态
		checkContentList:[],
		checkObjectAndContentList:[],
		checkObject:[],//选中的申请单位
		states:[{stateID:'0',stateName:'全部',key:'000'},{stateID:'1',stateName:'未处理',key:'111'},{stateID:'2',stateName:'处理',key:'222'}],
		channelsDataSource:[],//表格数据
		pageCurrent: 1,//当前页面
		allCount:'',//总数据条数
		pageSize: 10,
		author_type_name:"文稿作者"
		},

	reducers: {
		save(state, action) {
			return { ...state,
				...action.payload
			};
		},
	},

	effects: {
        //初始化数据
		* init({}, {call,put}) {
			//初始化单位查询数据
			yield put({
				type:'queryUserInfo'
			})
			//初始化拟宣传渠道下拉框数据
			yield put({
				type:'queryPoolPub'
			})
			//初始化列表数据查询
			yield put({
				type:'handleSearch'
			})
		},
		//选中的状态保存
		*handleStateChange({record}, {put}) { 
			yield put({
				type:'save',
				payload:{
					stateSelected:record,
				}
			})
		},
		//作者选中的状态保存
		*authorTypeName({record}, {put}) { 
			yield put({
				type:'save',
				payload:{
					author_type_name:record,
				}
			})
        },
		
		//保存稿件名称
		*handleManuscriptTitleChange({record}, {put}) { 
			yield put({
				type:'save',
				payload:{
					manuscriptTitle: record.target.value,
				}
			})
		},	
		  //保存查询条件 单位相关信息
		*onObjectChange({record}, {put}) { 
			yield put({
				type:'save',
				payload:{
					checkObject: record,
				}
			})
        },

		//查询条件  拟宣传渠道保存
		* handleChannelChange({record}, {put}) {
			yield put({
				type:'save',
				payload:{
					channelsChecked:record
				}
			})
		},
		//作者保存
		* handleAuthorChange({record}, {put}) {
			let a = record.target.value;
			
				yield put({
					type:'save',
					payload:{
						author:a
					}
				})
			
			
		},
		//点击查询 走服务
		* handleSearch({page}, {put,select,call}) {
			const {channelsChecked,checkObject,author,manuscriptTitle,stateSelected,author_type_name,pageSize  } = yield select (state =>state.newsPoolIndex);
			let state = "";
			let channels = "";
			if(channelsChecked === "全部"){
				channels = "";
			}else{
				channels = channelsChecked
			}
			if(stateSelected == "未处理"){
				state = "未处理"
			}else if(stateSelected == "处理"){
				state = "已处理"
			}
			const recData = {
				pubChannel:channels,
				authorBy:author,
				author_type_name:author_type_name,
				newsName:manuscriptTitle,
				deptId:checkObject.toString(),
				state:state,
				pageCurrent:page==undefined?"1":page,//表示请求第几页, 从1开始, 必须是正整数，默认为第1页
				RowCount:10
			};
			const response = yield call(newsOneService.queryNewsPool,recData);
			if(response.retCode==='1'){
				if(response.dataRows){
					const res = response.dataRows;
					for(let i=0;i<res.length;i++){
						res[i].key = res[i].id
					}
					yield put({
						type:'save',
						payload:{
							channelsDataSource:res,
							allCount:response.allCount,
							pageCurrent:res.pageCurrent,
							
						}
					})
				}
			  
			}
		},
		//表格操作点击处理
		* newsHandle({record},{ put,call }){
			// if(JSON.parse(record).state === '已处理'){
			// 	message.info('您已接受处理此稿件，请线下发布完成后及时反馈')
			// }else{
				const recData = {
					newsId:JSON.parse(record).newsId,
				};
				const response = yield call(newsOneService.queryPoolProcess,recData);
				if(response.retCode ==='1'){
					message.info('您已接受处理此稿件，请线下发布完成后及时反馈')
					yield put({
						type:'handleSearch'
					})
				}
			// }
		},
		//表格点击下载
		* queryNewsPoolDown({record},{ call }){
			/* console.log(record,JSON.parse(record).newsId)
			return */
			const a = JSON.parse(record).newsId
			console.log(a);
			const recData = {
				newsId:a,
			};
			//const response = yield call(newsOneService.queryNewsPoolDown,recData);
			let temp = "/microservice/newsmanager/queryNewsPoolDown?"+"newsId="+JSON.parse(record).newsId
			window.open(temp);
			/* if(response.retCode ==='1'){
			//const response = yield call(newsOneService.queryNewsPoolDown,recData);
				//console.log(response)
				message.success('下载中')
			}else{
				message.fail('下载失败')
			} */

		},
		//点击清空按钮
		* handleClear({},{put}){
			yield put({
				type:'save',
				payload:{
					channelsChecked:'全部',//选中的宣传渠道类型
					checkObject:[],    //单位
					manuscriptTitle:'',//稿件名称
					author:'', //查询条件-作者
					stateSelected:'全部',//状态选择框
				}
			})
			yield put({
				type:'handleSearch'
			})
		},
		//查找分院部门服务
		*queryUserInfo({}, {call, put, select}){
			let contentData = yield call(newsOneService.checkObjectAndContent, {});
			if(contentData.retCode == '1') { 
				if(contentData.dataRows){
					const res = contentData.dataRows;
					res.map((item, index) => {
					  item.key=index;
					  item.type = '1';
					});
					yield put({
					  type:'save',
					  payload:{
						checkObjectAndContentList:res,
					  }
					})
				  }
				
				
			}
		},
		//查询拟宣传渠道下拉数据
		*queryPoolPub({}, {call, put, select}){
			const recData = {
				userId:Cookie.get('userid')
			}
			let response = yield call(newsOneService.queryPoolPub,recData);
			if(response.retCode == '1') { 
				if(response.dataRows){
					const res = response.dataRows;
					res.unshift({channelName:'全部',id:'全部',children:[{channelName:'全部',id:'全部'}]})
					res.map((item, index) => {
					  item.key=item.id;
					  item.title=item.channelName;
					  item.value=item.id;
					  item.disabled=true;
					  item.children.map((i)=>{
						i.title=i.channelName;
						i.value=i.channelName;
					  })
					});
					yield put({
					  type:'save',
					  payload:{
						channelTypes:res,
					  }
					})
				  }
				
				
			}
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
				if (pathname === '/adminApp/newsOne/newsPoolIndex') { //此处监听的是连接的地址
					dispatch({
						type: 'init',
						query
					});
				}
			});
		},
	},
};