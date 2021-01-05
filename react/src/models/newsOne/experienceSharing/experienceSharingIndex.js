/**
 * 作者：贾茹
 * 日期：2020-9-28
 * 邮箱：18311475903@163.com
 * 文件说明：新闻共享平台-案例与经验分享首页列表
 */
import Cookie from 'js-cookie';
import { message } from "antd";
import * as newsOneService from '../../../services/newsOne/newsOneServers.js';

export default {
	namespace: 'experienceSharingIndex',
	state: {
		handleName:[], //搜索框宣传类型数据
		nameSelected:'全部',  //选中的案例名称
		channelsDataSource:[],//表格数据
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
			//初始化案例标题下拉框数据
			yield put({
				type:'queryTitleName'
			})
			//初始化列表数据
			yield put({
				type:'handleSearch'
			})
		},
		//案例标题查询
		* queryTitleName({}, {put,call}) {
			  const response = yield call(newsOneService.queryTitleName);
			  if(response.retCode === '1'){
				if(response.dataRows){
				  const res = response.dataRows;
				  res.unshift({
					titleName:'全部',
				  })
				for(let i = 0;i<res.length;i++){
					res[i].key = i
				}
				 yield put({
				   type:'save',
				   payload:{
					handleName:res
				   }
				 })
				}
			  }
		},
		//查询条件  选中案例标题信息保存
		* handleNameChange({record}, {put}) {
			yield put({
				type:'save',
				payload:{
					nameSelected:record
				}
			})
		},
		//点击查询 走服务
		* handleSearch({record}, {call,put,select}) {
			const { nameSelected, pageCurrent,pageSize } = yield select (state =>state.experienceSharingIndex);
			var pageCurrent1
			if(record === '点击查询'){
				pageCurrent1 = '1'
			}else{
				pageCurrent1=pageCurrent
			}
			let recData = {};
			if( nameSelected !== "全部"){
				recData = {
					titleName:nameSelected,
					pageCurrent:pageCurrent1,
					pageSize:pageSize
				}
			}else{
				recData = {
					pageCurrent:pageCurrent1,
					pageSize:pageSize
				}
			};
			  const response = yield call(newsOneService.queryCaseExSharing,recData);
			  if(response.retCode === '1'){
				if(response.dataRows){
				  const res = response.dataRows;
				  for(var i = 0;i<res.length;i++){
					  res[i].key = i;
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
			  }
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

		  //点击成果展示
		* handleButton({record},{ put,call }){
		},
		//删除
		* delete({record},{ put,call }){
			let recData = {
				id:record
			};
			// return
			const response = yield call(newsOneService.deleteCaseCaseExSharing,recData);
			if(response.retCode === '1'){
				message.success("删除成功");
				yield put({
				  type: 'handleSearch',
				});
			}else {
			  message.error(response.retVal);
			}
		  },
	},

	subscriptions: {
		setup({dispatch,history}) {
			return history.listen(({pathname,query}) => {
				if (pathname === '/adminApp/newsOne/experienceSharingIndex') { //此处监听的是连接的地址
					dispatch({
						type: 'init',
						query
					});
				}
			});
		},
	},
};
