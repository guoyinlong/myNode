/**
 * 作者：郭银龙
 * 日期：2020-9-28
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：稿件填报
 */  
import Cookie from 'js-cookie';
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as myServices from '../../../services/newsOne/newsOneServers';
export default {
	namespace: 'setNewManuscript', 
	loading: true, 
	state: {
		checkObjectAndContentList:[],
		checkContentList:[],
		qudaoDataList:[],//渠道列表
		authorList:[],//作者列表
		taskTitle:"",//稿件名称
		startTime:"",//新闻事实发生时间
		examineObj:"",//申请单位
		examineContent:"",//提交人
		checkValue:"",//审核流程
		changecheckGaoJianValue:"",//稿件类型
		checkJiangLiValue:"",//是否已领取其他专项奖励
		checkOriginalValue:"",//是否原创
		checkSecretValue:"",//是否泄密
		channelValue:[],//宣传渠道
		checkTypeValue:"",//宣传类型
		checkonFormValue:"",//宣传形式
		checkUrgencyValue:"",//是否紧急
		urgentText:"",//紧急程度
		checkPlanValue:"",//紧是否符合年度宣传计划
		checkObject:[],//选中的申请单位
		author:[1],
        authorTypeName:[],
        authorDept:[],
		authorBy:[],
		tableUploadFile:[],//附件上传
		deptId:'',//选中的部门id
		examineImgId: [], // 上传的图片
		outputHTML:"",//富文本编辑器的value

	},
    reducers: { // 刷新数据
			save(state, action) {
				return { ...state,
					...action.payload
				};
			},
    },
  	effects: {
		* init({}, {put}) {
			yield put({
				type:'queryUserInfo'
			})
			yield put({
				type:'qudao'
			})
			yield put({
				type:'author'
			})
			yield put({
				type:'querySecretFile'
			})
		},
			//保密文件
		*querySecretFile({}, {call, put, select}){
			yield put({
				type: 'save',
				payload: {
					theme:"",//稿件名称
					startTime:"",//新闻事实发生时间
					checkObject:[],//选中的申请单位
					contentList:[],//提交人
					checkValue:"",//审核流程
					changecheckGaoJianValue:"",//稿件类型
					checkJiangLiValue:"",//是否已领取其他专项奖励
					checkOriginalValue:"",//是否原创
					checkSecretValue:"",//素材是否涉密
					channelValue:[],//拟宣传渠道s
					checkTypeValue:"",//宣传类型
					checkonFormValue:"",//宣传形式
					checkUrgencyValue:"",//紧急程度
					urgentText:"",//紧急原因
					checkPlanValue:"",//紧是否符合年度宣传计划
					author: [1],
					authorTypeName:[],
					authorDept:[],
					authorBy:[],
					examineImgId: [], // 上传的图片
					tableUploadFile:[],//附件上传
					outputHTML:"",//富文本编辑器的value

				}
			})
			let contentData = yield call(myServices.onlySecret, {});
			if(contentData.retCode == '1') { 
				if(contentData.dataRows){
					const res = contentData.dataRows;
					yield put({
					  type:'save',
					  payload:{
						querySecretFileList:res,
					  }
					})
				  }
			}
		},
		// 单位
		*queryUserInfo({}, {call, put, select}){
                let contentData = yield call(myServices.checkObjectAndContent, {});
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
		*qudao({}, {call, put, select}){
			let qudaoData = yield call(myServices.queryTwoChannel, {});
			if(qudaoData.retCode == '1') { 
				if(qudaoData.dataRows){
					const res = qudaoData.dataRows;
					res.map((item, index) => {
						item.key=index;
						item.type = '1';
					});
					yield put({
						type:'save',
						payload:{
						qudaoDataList:res,
						}
					})
					}
			}
		},
		*author({}, {call, put, select}){
			let qudaoData = yield call(myServices.author, {});
			if(qudaoData.retCode == '1') { 
				if(qudaoData.dataRows){
					const res = qudaoData.dataRows;
					res.map((item, index) => {
						item.key=index;
						item.type = '1';
					});
					yield put({
						type:'save',
						payload:{
						authorList:res,
						}
					})
					}
			}
		},
		//稿件名称
		*theme({record}, {put}) {
			if(record.target.value.length>50){
				message.info('超过字数限制')
			}else {
				yield put({
					type:'save',
					payload:{
					theme: record.target.value,
				}
			})
		}
        },
        //新闻事实发生时间
		*changeDate({startTime, }, {put}) {
			yield put({
				type: 'save',
				payload: {
					startTime: startTime,
				}
			})
		},
		//申请单位
		*onObjectChange({record}, {put}) { 
			yield put({
				type:'save',
				payload:{
					checkObject: record,
				}
			})
        },
        //提交人
        *onContentList({record}, {put}) { 
			let newContentList = [...record]
			yield put({
				type:'save',
				payload:{
					contentList: record,
				}
			})
        },
        // 审核流程
        *changecheckValue({record}, {put}) { 
			let newContentList = record
			yield put({
				type:'save',
				payload: {
                    checkValue: newContentList.target.value,
                }
			})
        },
		 // 作者 
		 *add({record},{put, call, select}){
            const {author,authorTypeName,authorDept,authorBy} = yield select(v =>v.setNewManuscript)
			// author.length++
			author.push({authorTypeName:"",authorDept:"",authorBy:""})
			authorTypeName.push([])
			authorDept.push([])
			authorBy.push([])
            yield put({
                type:'save',
                payload: {
                    author:JSON.parse(JSON.stringify(author)),
                }
            })
		},
		*remove({record,name},{put, call, select}){
			const {author,authorTypeName,authorDept,authorBy} = yield select(v =>v.setNewManuscript)
            author.splice(record,1)
            authorTypeName.splice(record,1)
            authorDept.splice(record,1)
            authorBy.splice(record,1)
				yield put({
					type:'save',
					payload: {
						author:JSON.parse(JSON.stringify(author)),
					}
				})
		},
        *onAuthorCheck({record,name}, {put, call, select}) { 
            const {authorTypeName} = yield select(v =>v.setNewManuscript)
            authorTypeName.splice(name,1,record);
			yield put({
				type:'save',
				payload: {
                    authorTypeName:JSON.parse(JSON.stringify(authorTypeName)),
                }
			})
		},

        *onDanWeiAuthorList({record,name}, {put, call, select}) { 
			const {authorDept} = yield select(v =>v.setNewManuscript)
            authorDept.splice(name,1,record);
			yield put({
				type:'save',
				payload:{
                    authorDept:JSON.parse(JSON.stringify(authorDept)),
				}
			})
			let checkdeptid = record.toString()
			let postData = {
				deptId: checkdeptid,//申请单位 id
			}
			let tijiaorenData = yield call(myServices.tijiaoren, postData);
			if(tijiaorenData.retCode == '1') { 
				if(tijiaorenData.dataRows){
					const res = tijiaorenData.dataRows;
					res.map((item, index) => {
						item.key=index;
						item.type = '1';
					});
					yield put({
						type:'save',
						payload:{
						checkContentList:res,
						}
					})
					}
			}
           
			
		},

        *onAuthorList({record,name}, {put, call, select}) { 
			
            const {authorBy} = yield select(v =>v.setNewManuscript)
			authorBy.splice(name,1,record);
			yield put({
				type:'save',
				payload:{
                    authorBy:JSON.parse(JSON.stringify(authorBy)),
				}
			})

			
		},
        // 稿件类型
        *onChangeGaoJian({record}, {put}) { 
			let newContentList = record
			yield put({
				type:'save',
				payload: {
                    changecheckGaoJianValue: newContentList.target.value,
                }
			})
        },
        // 是否已领取其他专项奖励
        *onJiangLi({record}, {put}) { 
			let newContentList = record
			yield put({
				type:'save',
				payload: {
                    checkJiangLiValue: newContentList.target.value,
                }
			})
        },
        // 是否原创
        *onOriginal({record}, {put}) { 
			let newContentList = record
			yield put({
				type:'save',
				payload: {
                    checkOriginalValue: newContentList.target.value,
                }
			})
        },
        // 素材是否涉密
        *onSecret({record}, {put}) { 
			let newContentList = record
			yield put({
				type:'save',
				payload: {
                    checkSecretValue: newContentList.target.value,
                }
			})
        },
		// 宣传素材上传
		// *saveUploadFile({value,previewImage,previewVisible}, {put,call, select}) { //上传图片
		// 	const {examineImgId} = yield select(s => s.setNewManuscript)
		// 	if(value == undefined) { //value为未定义时,其他两个有值
		// 		yield put({
		// 			type: 'save',
		// 			payload: {
		// 				previewImage: JSON.parse(JSON.stringify(previewImage)),
		// 				previewVisible: JSON.parse(JSON.stringify(previewVisible)),
		// 			}
		// 		})
		// 	}else {
		// 		if(value.RetCode == '1') {
		// 			examineImgId.push(value.filename)
		// 		}
		// 		yield put({
		// 			type: 'save',
		// 			payload: {
		// 				examineImgId: examineImgId
		// 			}
		// 		})
		// 	}
		// },

		// *onRemove({file}, {put,call, select}) { //删除图片
		// 	const {examineImgId} = yield select(s => s.setNewManuscript)
		// 	let newList = examineImgId.filter((v) => {
		// 		return v.FileId != file.uid
		// 	})
		// 	yield put({
		// 		type: 'save',
		// 		payload: {
		// 			examineImgId: newList
		// 		}
		// 	})
		// },
		// *handleCancel({}, {put}) { //取消预览
		// 	yield put({
		// 		type: 'save',
		// 		payload: {
		// 			previewVisible: false
		// 		}
		// 	})
		// },



		//保存附件名称地址
		* saveUploadFile({ value }, { call, select, put }) {
		const { tableUploadFile } = yield select(state => state.setNewManuscript);
		tableUploadFile.push({
			upload_name: value.filename.RealFileName,
			AbsolutePath: value.filename.AbsolutePath,
			RelativePath: value.filename.RelativePath,
			key: value.filename.AbsolutePath,
		});
		
		yield put({
			type: 'save',
			payload: {
			//FileInfo:FileInfo,
			tableUploadFile: JSON.parse(JSON.stringify(tableUploadFile))
			}
		})
		},


		//删除上传材料
	* deleteEvidenceFile({ record }, { call,  select, put  }) {
		const { tableUploadFile  } = yield select(state => state.setNewManuscript);
		for (let i = 0; i < tableUploadFile.length; i++) {
			const a = tableUploadFile.filter(v => v.AbsolutePath !== record.AbsolutePath);
			yield put({
			type: 'save',
			payload: {
				tableUploadFile: JSON.parse(JSON.stringify(a)),
			}
			})
		}
		},
        // 拟宣传渠道
        *onChannel({record}, {put}) { 
			let newCheckObject = [...record]
			yield put({
				type:'save',
				payload:{
					channelValue: newCheckObject,
				}
			})
        },
        // 宣传类型
        *onType({record}, {put}) { 
			let newContentList = record
			yield put({
				type:'save',
				payload: {
                    checkTypeValue: newContentList.target.value,
                }
			})
        },
        // 宣传形式
        *onForm({record}, {put}) { 
			yield put({
				type:'save',
				payload: {
                    checkonFormValue: record.target.value,
                }
			})
		},
		*onForm2({record}, {put}) { 
			let newContentList = record
			yield put({
				type:'save',
				payload: {
                    checkonFormValue2: newContentList.target.value,
                }
			})
        },
        // 紧急程度
        *onUrgency({record}, {put}) { 
			let newContentList = record
			yield put({
				type:'save',
				payload: {
                    checkUrgencyValue: newContentList.target.value,
                }
			})
		},
		 // 紧急原因
		 *urgentText({record}, {put}) { 
			let newContentList = record
			yield put({
				type:'save',
				payload: {
                    urgentText: newContentList.target.value,
                }
			})
		},
        // 紧是否符合年度宣传计划
        *onPlan({record}, {put}) { 
			let newContentList = record
			yield put({
				type:'save',
				payload: {
                    checkPlanValue: newContentList.target.value,
                }
			})
        },
		*saveSubmit({record, saveData,outputHTML}, {put, call, select}) { 
		let saveDatas={...saveData}
		const {theme,checkObject,contentList, checkValue,  changecheckGaoJianValue, checkJiangLiValue, checkOriginalValue, checkSecretValue, channelValue,
			checkTypeValue,checkonFormValue,checkonFormValue2,checkUrgencyValue,urgentText,checkPlanValue,
			authorTypeName, authorDept, authorBy ,examineImgId,tableUploadFile} = yield select(v =>v.setNewManuscript)
			var arr = authorTypeName
			var arr1=authorDept
			var arr2=authorBy
			var auth =""
			var auth1 =  []
			var auth2 =  [],
			auth1 =arr1.map((item, index) => {
				return {
					authorDept:item,
				}
			})
			auth2 =arr2.map((item, index) => {
				return {
					authorBy:item,
				}
			})
			auth =arr.map((item, index) => {
				return {
					authorTypeName: item,
					authorDept:(auth1[index].authorDept).toString(),
					authorBy:(auth2[index].authorBy).toString(),
				}
			})
			
			// const type=changecheckGaoJianValue=="p"?"secretary":(changecheckGaoJianValue=="b"?"project":(changecheckGaoJianValue=="i"?"dept":""))
		let postData = {
            newsName: theme,//稿件名称
            deptId: checkObject!=undefined? checkObject.join():[],//申请单位 
            createById:Cookie.get('userid'),//提交人
            auditProcess:checkValue,//审核流程
            manuscript:changecheckGaoJianValue,//稿件类型
            isReceive:checkJiangLiValue,//是否已领取其他专项奖励
            isOriginal:checkOriginalValue,//是否原创
            isSecret:checkSecretValue,//是否涉密
			pubChannels:channelValue!=undefined? channelValue.join():[],//拟宣传渠道  
			pubType:checkTypeValue,//宣传类型
			pubForm:checkonFormValue=="其他"?checkonFormValue2:checkonFormValue,//宣传形式
			isUrgent:checkUrgencyValue,//紧急程度
			isEmergency:checkUrgencyValue==1?true:false,
			urgentText:urgentText,//紧急原因
			isYearPlan:checkPlanValue,//紧是否符合年度宣传计划
			auth:JSON.stringify(auth),//作者
			// materialUpload:JSON.stringify(examineImgId),//富文本图片上传
			// examineImgId:imglist,//富文本内容上传
			// materialUpload:JSON.stringify({outputHTML,examineImgId})
			materialUpload:JSON.stringify(tableUploadFile),
			// form:JSON.stringify({type:type}),
		}
		let postDatas = {...saveDatas, ...postData}
		// return
		if(record == '保存') { //点击保存
			postDatas['flag'] = 0
			let response = yield call(myServices.addNews, postDatas)
			if(response.retCode === '1'){
				message.success('保存成功');
				yield put(routerRedux.push({
					  pathname:'/adminApp/newsOne/manuscriptManagement',
					}));
			}else if(response.retCode == '0'){
				message.error('保存失败')
			}
		}else if(record == '提交') {
			postDatas['flag'] = 1
			if(
			 postDatas['newsName'] == '' || postDatas['deptId'] == ''  ||
			 postDatas['auditProcess'] == '' || postDatas['manuscript'] == ''|| postDatas['isReceive'] == ''||
			 postDatas['isOriginal'] == ''|| postDatas['isSecret'] == ''|| postDatas['pubChannels'] == ''||
			 postDatas['pubType'] == ''|| postDatas['pubForm'] == ''|| postDatas['isUrgent'] == ''||
			 postDatas['isYearPlan'] == ''|| postDatas['auth'] == [] || postDatas['materialUpload'] == []
			) { 
				message.info('有必填项没填')
			}else{
				let response = yield call(myServices.addNews, postDatas)
				if(response.retCode == '1') {
					message.info('提交成功');
					yield put(routerRedux.push({
						pathname:'/adminApp/newsOne/manuscriptManagement',
					  }));
				}else if(response.retCode == '0'){
					message.error('提交失败')
					
				}
			}
		}
		},    
	},
	subscriptions: {
		setup({dispatch, history}) {
			return history.listen(({pathname, query}) => {
				if(pathname === '/adminApp/newsOne/manuscriptManagement/setNewManuscript'){
					
					dispatch({
						type: 'init',
								query
						});
				}
			});
		},
	},
}

