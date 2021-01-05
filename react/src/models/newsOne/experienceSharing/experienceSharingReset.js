/**
 * 作者：贾茹
 * 日期：2020-9-30
 * 邮箱：18311475903@163.com
 * 文件说明：新闻共享平台-案例与经验分享修改页面
 */
import Cookie from 'js-cookie';
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as newsOneService from '../../../services/newsOne/newsOneServers.js';

export default {
	namespace: 'experienceSharingReset',
	state: {
		dataInfo:{},//初始化详情数据
		caseTitle:'',  //案例分享标题名称
		shareResult:[], //上传文件的数据
		taskid:"",//环节id
		tableId:""//id
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
		* init({query}, {call,put,select}) {
			//保存传入的数据
			yield put({
				type:'save',
				payload:{
					dataInfoId:query.record,
					difference:query.difference,//审核参数
					approvalId:query.approvalId,//审核参数
				}
			  })
			  //初始化详情数据
			  yield put({
				type:'taskInfoSearch'
			  })

		},

		//点击保存
		* saveShare({},{put,select,call}){
			const {caseTitle,shareResult,dataInfo,tableId,taskid,difference} = yield select (state =>state.experienceSharingReset);
			const recData = {
				id:tableId?tableId:dataInfo.id,
				titleName:caseTitle,
				shareGain: JSON.stringify(shareResult),
				flag:'0', 
				taskId:taskid,

			}
			const response = yield call(newsOneService.updateCaseCaseExSharing, recData);
			if(response.retCode === '1'){
				message.info('保存成功')
				if(difference=="审核"){
					yield put(routerRedux.push({
						pathname:'/adminApp/newsOne/myReview'
					}))
				}else{
					yield put(routerRedux.push({
						pathname:'/adminApp/newsOne/experienceSharingIndex'
					}))
				}

			}

		},
	//点击提交
	* submission ({},{put,select,call}){
    const {caseTitle,shareResult,dataInfo,tableId,taskid,difference} = yield select (state =>state.experienceSharingReset);
    if(caseTitle === ""||shareResult.length === 0){
      message.info('有必填项没填')
    }else{
      const recData = {
        id:tableId?tableId:dataInfo.id,
        titleName:caseTitle,
        shareGain: JSON.stringify(shareResult),
        flag:'1',
        taskId:taskid,
      }
      const response = yield call(newsOneService.updateCaseCaseExSharing, recData);
      if(response.retCode === '1'){
        message.info('提交成功')
        if(difference=="审核"){
          yield put(routerRedux.push({
            pathname:'/adminApp/newsOne/myReview'
          }))
        }else{
          yield put(routerRedux.push({
            pathname:'/adminApp/newsOne/experienceSharingIndex'
          }))
        }
      }
    }


	},

		//保存案例标题名称
		* handleCaseTitleChange({record}, {put}) {
			yield put({
				type:'save',
				payload:{
					caseTitle:record.target.value
				}
			})
        },
        //点击上传保存文件相关信息
		* saveUploadFile({value}, {put,select}) {
            const { shareResult } = yield select (state => state.experienceSharingReset)
             shareResult.push({
                upload_name: value.filename.RealFileName,
                AbsolutePath: value.filename.AbsolutePath,
                RelativePath: value.filename.RelativePath,
                key: value.filename.AbsolutePath,
              });
			yield put({
				type:'save',
				payload:{
					shareResult:JSON.parse(JSON.stringify(shareResult))
				}
            })
        },
	  //点击删除文件n
	  * deleteUpload({record }, {call,select,put}) {
			const {shareResult} = yield select(state => state.experienceSharingReset);
			for (let i = 0; i < shareResult.length; i++) {
			const a = shareResult.filter(v => v.AbsolutePath !== record.AbsolutePath);
			yield put({
				type: 'save',
				payload: {
					shareResult: JSON.parse(JSON.stringify(a)),
				}
			})
			}
	  },

	// 	//点击取消返回渠道备案首页
	//    * canCel({},{put}){
	// 		yield put(routerRedux.push({
	// 			pathname: '/adminApp/newsOne/experienceSharingIndex'
	// 		}));

	// 	},
		  //详情数据查询
		  * taskInfoSearch({}, {select,call, put}){
          yield put({
            type: 'save',
            payload: {
              dataInfo:"",
              caseTitle:"",
              shareResult:[],
              taskid:"",
              tableId:"",
            }
            })
			//郭银龙审核接口
			const {difference,dataInfoId,approvalId} = yield select(state => state.experienceSharingReset);
			if(difference=="审核"){
				let recData = {
					approval_id: approvalId,
				};
				const response = yield call(newsOneService.showTodoApprovalDetail, recData);
				if (response.retCode === '1') {
				  if (response.dataRows) {
					const res = response.dataRows.projApply.businessObj.dataRows;
					yield put({
					  type: 'save',
					  payload: {
						dataInfo:res,
						caseTitle:res.titleName,
						shareResult:res.shareGain !==""?JSON.parse(res.shareGain):[],
						taskid:response.dataRows.taskId,
						tableId:response.dataRows.projApply.tableId
					  }
					})
				  }
				}else{
				  message.error(response.retVal);
				}
			}else{
			let recData={
			  id:dataInfoId
			};
			const response = yield call(newsOneService.queryCaseCaseExSharingDetail, recData);
			if(response.retCode === '1'){
			  if(response.dataRows){
				const res = response.dataRows;
				yield put({
				  type:'save',
				  payload:{
				   dataInfo:res,
				   caseTitle:res.titleName,
				   shareResult:res.shareGain !==""?JSON.parse(res.shareGain):[]
				  }
				})
			  }
			}
		}
		  },
	},
	subscriptions: {
		setup({dispatch, history}) {
		  return history.listen(({pathname, query}) => {
			if (pathname === '/adminApp/newsOne/experienceSharingIndex/experienceSharingReset') { //此处监听的是连接的地址
			  dispatch({
				type: 'init',
				query
			  });
			}
		  });
		},
	  },

};
