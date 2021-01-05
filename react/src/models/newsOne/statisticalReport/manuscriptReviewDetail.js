/**
 * 作者：郭银龙
 * 创建日期： 2020-10-21
 * 邮箱: guoyl@itnova.com.cn
 * 功能： 稿件复核详情
 */ 
import Cookie from 'js-cookie'; 
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as myServices from '../../../services/newsOne/newsOneServers';
export default {
	namespace: 'manuscriptReviewDetail', 
	loading: true, 
	state: {
		detailList:'',//详情数据
		reportList:[],
		tuihuiValue:"",
        
	},
    reducers: { // 刷新数据
			save(state, action) {
				return { ...state,
					...action.payload
				};
			},
    },




    
  	effects: {
		* init({query}, {put}) {
			yield put({
				type:'save',
				payload:{
					approval_id: query.newsId,
					difference:query.difference
				}
			})
            yield put({
                type:'queryUserInfo',
			})
			
        },
       
           	 //详情查询
        *queryUserInfo({}, {call, put, select}){
			yield put({
				type: 'save',
				payload: {
					detailList:'',//详情数据
					reportList:[],
					tuihuiValue:""
				}
			  })
			const {approval_id,difference} = yield select(v =>v.manuscriptReviewDetail)
			if(difference=="审核"){
					let recData = {
						approval_id:approval_id
					  };
				const response = yield call(myServices.showTodoApprovalDetail, recData);
				if (response.retCode === '1') {
				  if (response.dataRows.projApply.businessObj!=null) {
					const res = response.dataRows.projApply.businessObj.dataRows;
					yield put({
					  type: 'save',
					  payload: {
						detailList:res, 
						taskid:response.dataRows.taskId,
						taskName:response.dataRows.taskName,
						bableid:response.dataRows.projApply.tableId,
						pass:response.dataRows.pass,
					  }
					})
				  }
				}else{
				  message.error(response.retVal);
				}
			  }else{
				let recData = {
					id:approval_id
				  };
				let detailData = yield call(myServices.queryMyCheckItem, recData);
				if(detailData.retCode == '1') { 
					if(detailData.dataRows){
						const res=detailData.dataRows
					yield put({
							type: 'save',
							payload: {
								detailList:res, 
							}
						})
					}
				   
				}
			  }
		},
		 //获取审批环节数据
		 * gaojianhuanjie({}, { call, put ,select}) {
			const {bableid,approval_id} = yield select(v =>v.manuscriptReviewDetail)
			let recData = {
				id:bableid?bableid:approval_id
			  };
			const response = yield call(myServices.queryMyCheckExamineItem, recData);
			if (response.retCode === '1') {
			  if (response.dataRows) {
				const res = response.dataRows;
				res.map((item, index) => {
					if (item.state == "0") {
						item.failUnm = "办理中"
					  } else if (item.state == "1") {
						item.failUnm = "办毕"
					  }
					  if(item.commentDetail){
						if(JSON.parse(item.commentDetail).endApply==false){
						item.commentDetail="不同意："+JSON.parse(item.commentDetail).opinion

						}else if(JSON.parse(item.commentDetail).endApply==true){
							item.commentDetail="同意"
						} else{
							item.commentDetail="重新提交"
						}  

					}
					
				  item.key = index;
				  item.type = '1';
				});
				yield put({
				  type: 'save',
				  payload: {
					reportList: res
				  }
				})
			  }
			}else{
			  message.error(response.retVal);
			}
		  },
		    //同意审核
			* onAgree({},{call, put,select}){
				const {taskid,auditProcess,isYearNews}= yield select (state =>state.manuscriptReviewDetail);
		  
				let recData={
				  user_id:Cookie.get('userid'),
				  user_name:Cookie.get('username'),
				  form:JSON.stringify({endApply:true,isYearOrOutNews:auditProcess,isYearNews:isYearNews}),
				  task_id:taskid,
				};
				const response = yield call(myServices.completeTask, recData); 
				if(response.retCode === '1'){
				  if(response.dataRows){
					  message.info('审核成功');
						  yield put(routerRedux.push({
							  pathname:'/adminApp/newsOne/myReview'
						  }))
				  }
				}else{
				  message.error(response.retVal);
				}
			  
			  },
			  //回退原因
			  * tuihui({record},{call, put,select}){
				if(record.length<200){
				  yield put({
						  type:'save',
						  payload: {
						  tuihuiValue: record,
						  }
					  })
				}else{
				  message.info("不能超过200个字符")
				}
					  
		  
			  },
			  // 确定回退
			  * handle({},{call, put,select}){
				const {taskid,tuihuiValue}= yield select (v =>v.manuscriptReviewDetail);
				if(tuihuiValue==""){
					message.info("请填写退回原因")
				}else{
					let recData={
				  user_id:Cookie.get('userid'),
				  user_name:Cookie.get('username'),
				  form:JSON.stringify({endApply:false,opinion:tuihuiValue}),
				  task_id:taskid,
				};
				const response = yield call(myServices.completeTask, recData); 
				if(response.retCode === '1'){
				  if(response.dataRows){
					message.info('退回成功');
						  yield put(routerRedux.push({
							  pathname:'/adminApp/newsOne/myReview'
						  }))
				  }
				}else{
				  message.error(response.retVal);
				}
				}
				
			  }

	},
	subscriptions: {
		setup({dispatch, history}) {
			return history.listen(({pathname, query}) => {
				if(pathname === '/adminApp/newsOne/statisticalReport/manuscriptReviewDetail'){
					dispatch({
						type: 'init',
								query
                        });
                       
				}
			});
		},
	},
}
