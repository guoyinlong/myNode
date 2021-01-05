/**
 * 作者：贾茹
 * 日期：2020-10-20
 * 邮箱：18311475903@163.com
 * 文件说明：新闻共享平台-宣传渠道备案模块修改页面
 */
import Cookie from 'js-cookie';
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as newsOneService from '../../../services/newsOne/newsOneServers.js';

export default {
	namespace: 'publicityChannelsReset',
	state: {
		channelName:'旧名称',  //宣传渠道名称
		channelTypes:[{seal_details_name:'名字一',seal_details_id:'1'},{seal_details_name:'名字二',seal_details_id:'2'},{seal_details_name:'名字三',seal_details_id:'3'}],
		channelTypeSeleted:'',//选中的宣传渠道类型
		functionOrientation:'',//功能定位
		checkObjectAndContentList:[],
		checkObject:[],//选中的申请单位
		applyReason:'',//申请名义
		dateName:'',//日常运营人姓名
		dateTel:'',//日常运营人电话
		dateDept:'',//日常运营人部门
		dateMail:'',//日常运营人邮箱
		deptPersonName:'',//单位负责人姓名
		datePersonTel:'',//单位负责人电话
		datePersonDept:'',//单位负责人部门
		datePersonMail:'',//单位负责人邮箱
		dataInfo:[], //详情数据
		taskid:"",//环节id
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
			yield put({
				type:'save',
				payload:{
				  passData:query.approvalId?query.approvalId:JSON.parse(query.record),
				  approvalId:query.approvalId,
            	  difference:query.difference
				}
			  })
			  yield put({
				type:'taskInfoSearch'
			  })
			  yield put({
				type:'queryUserInfo',
			})
			  yield put({
				type:'channelRequest',
			})



		},

		///点击保存
		* saveChannel({},{put,select,call}){
			const {
				channelTypeSeleted,channelName,checkObject,applyReason,functionOrientation,
				dateName,dateTel,dateDept,dateMail,deptPersonName,datePersonTel,
				datePersonDept,datePersonMail,dataInfo,taskid,tableid
			}= yield select (state =>state.publicityChannelsReset);
				const recData = {
					PubChannelType: channelTypeSeleted,
					PubChannelName: channelName,
					id:tableid?tableid:dataInfo.id,
					time: dataInfo.channelTime,
					hostDept: checkObject.toString(),
					applyReason: applyReason,
					functionDefinition:functionOrientation,
					dailyOperatorName: dateName,
					dailyOperatorTel: dateTel,
					dailyOperatorDept: dateDept,
					dailyOperatorEmail: dateMail,
					companyName: deptPersonName,
					companyDept: datePersonDept,
					companyEmail: datePersonMail,
					companyTel: datePersonTel,
					executiveImage:dataInfo.state,
					flag: '0',
					taskId:taskid
				}
				const response = yield call(newsOneService.updatePublicityChannel,recData);
				if(response.retCode == '1') {
					message.info('保存成功');
					yield put(routerRedux.push({
						pathname:'/adminApp/newsOne/publicityChannelsIndex'
					}))

				 }

		},
		//点击提交
		* submission({},{put,select,call}){
			const testtel = /^[1]([3-9])[0-9]{9}$/; //正则匹配手机号
			const testmail = /^.+@.+\..{2,4}$/;
			const {
				channelTypeSeleted,channelName,checkObject,applyReason,functionOrientation,
				dateName,dateTel,dateDept,dateMail,deptPersonName,datePersonTel,
				  datePersonDept,datePersonMail, dataInfo,taskid,tableid
			}= yield select (state =>state.publicityChannelsReset);
			if(channelTypeSeleted === ''||channelName === ''||checkObject.length === 0||
			applyReason === ''||functionOrientation === ''||dateName ===''||dateTel === ''||
			dateDept === ''||dateMail === ''||deptPersonName === ''||datePersonTel ===''||
			datePersonDept === ''||datePersonMail === ''){
				message.info('有必填项未填写')
			}else if(testtel.test(dateTel) === false||testtel.test(datePersonTel) === false){
				message.warning('请填写正确的电话号码')
			}else if(testmail.test(dateMail) === false||testmail.test(datePersonMail) === false){
				message.warning('请填写正确的邮箱号')
			}else{
				const recData = {
					PubChannelType: channelTypeSeleted,
					PubChannelName: channelName,
					id:tableid?tableid:dataInfo.id,
					time: dataInfo.createTime,
					hostDept: checkObject.toString(),
					applyReason: applyReason,
					functionDefinition:functionOrientation,
					dailyOperatorName: dateName,
					dailyOperatorTel: dateTel,
					dailyOperatorDept: dateDept,
					dailyOperatorEmail: dateMail,
					companyName: deptPersonName,
					companyDept: datePersonDept,
					companyEmail: datePersonMail,
					companyTel: datePersonTel,
					executiveImage:dataInfo.state,
					flag: '1',
					taskId:taskid,
					
				}
				const response = yield call(newsOneService.updatePublicityChannel,recData);
				if(response.retCode == '1') {
					message.info('提交成功');
					yield put(routerRedux.push({
						pathname:'/adminApp/newsOne/publicityChannelsIndex'
					}))

				 }
			}
		},
		 //详情数据查询
		 * taskInfoSearch({}, {select,call, put}){
			const {passData,approvalId,difference} = yield select(state=>state.publicityChannelsReset);

			if(difference){
				let recData = {
				  approval_id:approvalId
				  };
				const response = yield call(newsOneService.showTodoApprovalDetail, recData);
				if (response.retCode === '1') {
				if (response.dataRows.projApply.businessObj!=null) {
				  const res = response.dataRows.projApply.businessObj.dataRows;
				  yield put({
				  type: 'save',
				  payload: { 
					taskid:response.dataRows.taskId,
					tableid:response.dataRows.projApply.tableId,
					type:difference,
					dataInfo:res,
					channelTypeSeleted:res.pubChannelType,//选中的宣传渠道类型
					channelName:res.pubChannelName,  //宣传渠道名称
					functionOrientation:res.functionDefinition,//功能定位
					checkObject:res.hostDeptId,//res.hostDept.substring(number+1),//选中的分院的部门
					applyReason:res.applyReason,//申请名义
					dateName:res.dailyOperatorName,//日常运营人姓名
					dateTel:res.dailyOperatorTel,//日常运营人电话
					dateDept:res.dailyOperatorDept,//日常运营人部门
					dateMail:res.dailyOperatorEmail,//日常运营人邮箱
					deptPersonName:res.companyName,//单位负责人姓名
					datePersonTel:res.companyTel,//单位负责人电话
					datePersonDept:res.companyDept,//单位负责人部门
					datePersonMail:res.companyEmail,//单位负责人邮箱
				  }
				  })
				}
				}else{
				message.error(response.retVal);
				}
		
				 }else{
							let recData={
							id :passData.id,//| VARCHAR(32) | 是 | 环节id
							};
							const response = yield call(newsOneService.queryPublicityChannelDetail,recData);
							if(response.retCode === '1'){
							if(response.dataRows){
								const res = response.dataRows;
								const number = res.hostDept.indexOf('-');

							yield put({
								type:'save',
								payload:{
								dataInfo:res,
								channelTypeSeleted:res.pubChannelType,//选中的宣传渠道类型
								channelName:res.pubChannelName,  //宣传渠道名称
								functionOrientation:res.functionDefinition,//功能定位
								checkObject:res.hostDeptId,//res.hostDept.substring(number+1),//选中的分院的部门
								applyReason:res.applyReason,//申请名义
								dateName:res.dailyOperatorName,//日常运营人姓名
								dateTel:res.dailyOperatorTel,//日常运营人电话
								dateDept:res.dailyOperatorDept,//日常运营人部门
								dateMail:res.dailyOperatorEmail,//日常运营人邮箱
								deptPersonName:res.companyName,//单位负责人姓名
								datePersonTel:res.companyTel,//单位负责人电话
								datePersonDept:res.companyDept,//单位负责人部门
								datePersonMail:res.companyEmail,//单位负责人邮箱
								}
							})
							}
							}
				 }
			

		  },
		//查找分院部门服务
		*queryUserInfo({}, {call, put, select}){
			let contentData = yield call(newsOneService.checkObjectAndContent, {});
			if(contentData.retCode == '1') {
				if(contentData.dataRows){
					const res = contentData.dataRows;
					res.map((item, index) => {
					  item.key=item.id;
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
		//宣传渠道类型查询服务调取
		* channelRequest({},{call,put}){
			const response = yield call(newsOneService.channelRequest);
			if(response.retCode==='1'){
				const res = response.dataRows;
				//res.unshift({id:'23',channelName:'全部'})
				for(let i = 0 ;i < res.length; i ++){
					res[i].key = res[i].id;
				}
			  yield put({
				  type:'save',
				  payload:{
					channelTypes:res,

				  }
			  })

			}
		},

		//保存宣传渠道类型相关信息
		* saveType({record}, {put}){
			yield put({
				type:'save',
				payload:{
					channelTypeSeleted:record
				}
			})
		},
		//保存宣传渠道名称
		* handleChannelNameChange({record}, {put}) {
			yield put({
				type:'save',
				payload:{
					channelName:record.target.value
				}
			})
		},
		//保存选中单位
		*onObjectChange({record}, {put}) {
			yield put({
				type:'save',
				payload:{
					checkObject: record,
				}
			})
        },
		//保存申请名义
		* handleApplyReasonChange({record}, {put}) {
			yield put({
				type:'save',
				payload:{
					applyReason:record.target.value
				}
			})
		},
		//保存功能定位
		* handleFunctionChange({record}, {put}) {
			yield put({
				type:'save',
				payload:{
					functionOrientation:record.target.value
				}
			})
		},
		//保存日常运营人姓名
		* handleDateNameChange({record}, {put}) {
			yield put({
				type:'save',
				payload:{
					dateName:record.target.value
				}
			})
		},
		//保存日常运营人电话
		* handleDateTelChange({record}, {put}) {
      if(!isNaN(record.target.value)){
        yield put({
          type:'save',
          payload:{
            dateTel:record.target.value
          }
        })
      }else{
        message.warning('请输入正确的电话号码')
      }
		},
		//保存日常运营人部门
		* handleDateDeptChange({record}, {put}) {
			yield put({
				type:'save',
				payload:{
					dateDept:record.target.value
				}
			})
		},
		//保存日常运营人邮箱
		* handleDateMailChange({record}, {put}) {
			yield put({
				type:'save',
				payload:{
					dateMail:record.target.value
				}
			})
		},
		//保存单位负责人姓名
		* handleDeptPersonNameChange({record}, {put}) {
			yield put({
				type:'save',
				payload:{
					deptPersonName:record.target.value
				}
			})
		},
		//保存单位负责人电话
		* handleDatePersonTelChange({record}, {put}) {

      if(!isNaN(record.target.value)){
        yield put({
          type:'save',
          payload:{
            datePersonTel:record.target.value
          }
        })
      }else{
        message.warning('请输入正确的电话号码')
      }

		},
		//保存单位负责人部门
		* handleDatePersonDeptChange({record}, {put}) {
			yield put({
				type:'save',
				payload:{
					datePersonDept:record.target.value
				}
			})
		},
		//保存单位负责人邮箱
		* handleDatePersonMailChange({record}, {put}) {
			yield put({
				type:'save',
				payload:{
					datePersonMail:record.target.value
				}
			})
		},

		//点击取消返回渠道备案首页
	   * canCel({},{put}){
			yield put(routerRedux.push({
				pathname: '/adminApp/newsOne/publicityChannelsIndex'
			}));
		},
	},
	subscriptions: {
		setup({dispatch, history}) {
		  return history.listen(({pathname, query}) => {
			if (pathname === '/adminApp/newsOne/publicityChannelsIndex/publicityChannelsReset') { //此处监听的是连接的地址
			  dispatch({
				type: 'init',
				query
			  });
			}
		  });
		},
	  },

};
