/**
 * 作者：贾茹
 * 日期：2020-9-30
 * 邮箱：18311475903@163.com
 * 文件说明：新闻共享平台-宣传渠道备案模块填报页面
 */
import Cookie from 'js-cookie';
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as newsOneService from '../../../services/newsOne/newsOneServers.js';

export default {
	namespace: 'publicityChannelsWrite',
	state: {
		channelName:'',  //宣传渠道名称
		channelTypes:[],
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
		* init({}, {call,put,select}) {

			yield put({
				type:'save',
				payload:{
					channelName:'',  //宣传渠道名称
					channelTypes:[],
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
				}
			})
			//初始化部门的下拉框数据
			yield put({
				type:'queryUserInfo'
			})
			//初始化查询宣传渠道类型
			yield put({
				type:'channelRequest'
			})

		},

		//点击保存
		* saveChannel({},{put,select,call}){
			const {
				channelTypeSeleted,channelName,checkObject,applyReason,functionOrientation,
				dateName,dateTel,dateDept,dateMail,deptPersonName,datePersonTel,
				datePersonDept,datePersonMail
			}= yield select (state =>state.publicityChannelsWrite);
				const recData = {
					PubChannelType: channelTypeSeleted,
					PubChannelName: channelName,
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
					flag: '0'
				}
				const response = yield call(newsOneService.addPublicityChannel,recData);
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
				datePersonDept,datePersonMail
			}= yield select (state =>state.publicityChannelsWrite);
			if(channelTypeSeleted === ''||channelName === ''||checkObject.length === 0||
			applyReason === ''||functionOrientation === ''||dateName ===''||dateTel === ''||
			dateDept === ''||dateMail === ''||deptPersonName === ''||datePersonTel ===''||
			datePersonDept === ''||datePersonMail === ''){
				message.info('有必填项未填写')
			}else if(testtel.test(dateTel) === false||testtel.test(datePersonTel) === false){
				console.log(dateTel,datePersonTel,testtel.test(dateTel),testtel.test(datePersonTel) )
				message.warning('请填写正确的电话号码')
			}else if(testmail.test(dateMail) === false||testmail.test(datePersonMail) === false){
				console.log(dateMail,datePersonMail,testmail.test(dateMail),testmail.test(datePersonMail) )
				message.warning('请填写正确的邮箱号')
			}else{
				const recData = {
					PubChannelType: channelTypeSeleted,
					PubChannelName: channelName,
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
					flag: '1'
				}
				const response = yield call(newsOneService.addPublicityChannel,recData);
				if(response.retCode == '1') {
					message.info('提交成功');
					yield put(routerRedux.push({
						pathname:'/adminApp/newsOne/publicityChannelsIndex'
					}))
				 }
			}
		},
		//点击取消返回首页
		* canCel({}, {put}){
			yield put(routerRedux.push({
				pathname:'/adminApp/newsOne/publicityChannelsIndex'
			}))
		},
		//查找分院部门服务
		*queryUserInfo({}, {call, put}){
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
		//查询宣传渠道下拉框数据
		*channelRequest({}, {call, put, select}){
			let contentData = yield call(newsOneService.channelRequest);
			if(contentData.retCode == '1') {
				if(contentData.dataRows){
					const res = contentData.dataRows;
					res.map((item, index) => {
					  item.key=item.id;
					});
					//console.log(res);
					yield put({
					  type:'save',
					  payload:{
						channelTypes:res,
					  }
					})
				  }


			}
		},

		//保存宣传渠道类型id
		* saveType({record}, {put}){
			console.log(record)
			yield put({
				type:'save',
				payload:{
					channelTypeSeleted:record
				}
			})
		},
		//保存宣传渠道名称
		* handleChannelTypeChange({record}, {put}) {
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
			if (pathname === '/adminApp/newsOne/publicityChannelsIndex/publicityChannelsWrite') { //此处监听的是连接的地址
			  dispatch({
				type: 'init',
				query
			  });
			}
		  });
		},
	  },

};
