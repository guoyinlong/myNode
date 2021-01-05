/**
 * 作者：贾茹
 * 日期：2020-9-28
 * 邮箱：18311475903@163.com
 * 文件说明：新闻共享平台-宣传渠道备案模块首页列表
 */
import Cookie from 'js-cookie';
import { message } from "antd";
import { routerRedux } from 'dva/router'; 
import * as newsOneService from '../../../services/newsOne/newsOneServers.js';
import {getRequest}from '../../../utils/request';

export default {
	namespace: 'publicityChannelsIndex',
	state: {
		channelName: "",//搜索框宣传渠道名称
		channelTypes:[], //搜索框宣传类型数据
		channelTypeName:'全部',  //选中的搜索框中宣传渠道类型的名称
		channelsDataSource:[],//表格数据\
		pageCurrent: 1,//当前页面
		pageDataCount:'',//总数据条数
		pageSize: 10,
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
			yield put({
				type:'channelRequest'
			})
			yield put({
				type:'handleSearch'
			})
		},

		//选中的宣传渠道类型保存
		* saveData({record},{put}){
			yield put({
				type:'save',
				payload:{
					channelTypeName:record
				}
			})
		},

		//保存搜索框渠道名称
		* handleChannelTypeChange({record},{put}){
			yield put({
				type:'save',
				payload:{
					channelName:record.target.value
				}
			})
		},
		// 修改页面
		* changePage({page},{ put,call }){
			yield put({
			  type : "save",
			  payload : {
				  pageCurrent : page,
				}
			})
			yield put ({type:"handleSearch"})
		  },

		//点击搜索框查询,走查询表格数据服务
		* handleSearch({record},{put,call,select}){
			let { channelTypeName,channelName,pageCurrent,pageSize} = yield select(state=>state.publicityChannelsIndex);
			let type = "";
			let pageCurrent1;
			if(channelTypeName === "全部"){
				type = ""
			}else{
				type = channelTypeName
			}
			if(record === '点击查询'){
				pageCurrent1 = '1'
			}else{
				pageCurrent1=pageCurrent
			}
			let recData={
				pubChannelType:type,
				pubChannelName:channelName,
				pageCurrent:pageCurrent1,
				pageSize :pageSize,
			  };
			const response = yield call(newsOneService.queryPublicityChannel,recData);
			if(response.retCode==='1'){
				const res = response.dataRows;
				for(let i = 0 ;i < res.length; i ++){
					res[i].key = res[i].id;
				}
				yield put({
					type:'save',
					payload:{
						channelsDataSource:res,
						pageDataCount:response.allCount,
						pageCurrent:pageCurrent1
					}
				})
			}
		},

		//点击清空按钮
		* handleClear({},{put,call,select}){
			let { channelTypeName,channelName} = yield select(state=>state.publicityChannelsIndex);
			yield put({
				type:'save',
				payload:{
					channelTypeName:'全部',
					channelName:''
				}
			})
		},
		//宣传渠道类型查询服务调取
		* channelRequest({},{call,put}){
			const response = yield call(newsOneService.channelRequest);
			if(response.retCode==='1'){
				const res = response.dataRows;
				res.unshift({id:'23',channelName:'全部'})
				for(let i = 0 ;i < res.length; i ++){
					res[i].key = i.id;
				}
			  yield put({
				  type:'save',
				  payload:{
					channelTypes:res,
					  
				  }
			  })
			  
			}
		},
		//点击导出按钮
		* exportChannels({},{call,put}){
			// let temp = "/microservice/allmanagementofmeetings/newmeetings/ExportImportantMeeting?"+"arg_ouid="+Cookie.get('OUID');
			//window.open(temp);
			let temp = "/microservice/newsmanager/exportPublicityChannel?"
			window.open(temp);
		},
		//删除该条记录服务调取
		* deletePublicityChannel({record},{call,put}){
			let recData={
				id:record.id
			  };
			const response = yield call(newsOneService.deletePublicityChannel,recData);
			if(response.retCode==='1'){
				message.info('删除成功')
				yield put({
					type:'handleSearch'
				})
				
			}
		},
	},
	subscriptions: {
		setup({dispatch, history}) {
		  return history.listen(({pathname, query}) => {
			if (pathname === '/adminApp/newsOne/publicityChannelsIndex') { //此处监听的是连接的地址
			  dispatch({
				type: 'init',
				query
			  });
			}
		  });
		},
	  },

};