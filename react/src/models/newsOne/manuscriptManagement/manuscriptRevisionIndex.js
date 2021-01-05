/**
 * 作者：郭银龙
 * 日期：2020-9-28
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：稿件修改
 */ 
import Cookie from 'js-cookie';
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as myServices from '../../../services/newsOne/newsOneServers';
export default {
	namespace: 'manuscriptRevision', 
	loading: true, 
	state: {
		checkObjectAndContentList:[],
		qudaoDataList:[],//渠道列表
		checkContentList:[],//提交人列表
		taskTitle:"",//稿件名称
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
		startTime:"",//新闻事实发生时间
		urgentText:"",//紧急程度
		urgentText:"",//紧急文本
		checkPlanValue:"",//紧是否符合年度宣传计划
		checkObject:[],//选中的申请单位
		author:[1],
        authorTypeName:[],
        authorDept:[],
		authorBy:[],
		tableUploadFile: [], // 附件上传
		// examineImgId: [], // 上传的图片
		// outputHTML:"",//富文本编辑器的value

		
	},
    reducers: { // 刷新数据
			save(state, action) {
				return { ...state,
					...action.payload
				};
			},
    },
  	effects: {
		* init({query}, {call, put}) {
			yield put({
				type:'save',
				payload:{
					approval_id: query.newsId,
				  	difference:query.difference
				}
			  })
			  yield put({
				type:'queryUserInfo'//查询单位
			  })
			  yield put({
			    type:'qudao'//查询渠道
			  })
			  yield put({
			    type:'author'//查询作者
			  })
			  yield put({
			    type:'querySecretFile'//保密文件
			  })
			  yield put({
			    type:'setInFor'//保密文件
			  })

		  },
		// 详情value
		*setInFor({}, {call, put, select}){
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
					author: [],
					authorTypeName:[],
					authorDept:[],
					authorBy:[],
					// examineImgId: [], // 上传的图片
					tableUploadFile:[],//附件上传
					// outputHTML:"",//富文本编辑器的value
					taskid:"",
				}
			})
			const {approval_id,difference} = yield select(v =>v.manuscriptRevision)
			if(difference=="审核"){
					let recData = {
						approval_id:approval_id
					  };
				const response = yield call(myServices.showTodoApprovalDetail, recData);
				if (response.retCode === '1') {
				  if (response.dataRows.projApply.businessObj!=null) {
					const arr=response.dataRows.projApply.businessObj.news
					const arrres=response.dataRows.projApply.businessObj.author
						var newAuthArr = arrres.map((item)=>{
						  return  item.authorTypeName;
						})
						var newDeptArr = arrres.map((item)=>{
							return  item.authorDept;
						  })
						var newNameArr = arrres.map((item)=>{
						return  item.authorBy;
						})
					yield put({
					  type: 'save',
					  payload: {
						taskid:response.dataRows.taskId,
						theme:arr.newsName,//稿件名称
						startTime:arr.startTime,//新闻事实发生时间
						checkObject:arr.deptId!=""?(arr.deptId).split(","):[],//选中的申请单位
						contentList:arr.createById!=""?(arr.createById).split(","):[],//提交人
						checkValue:arr.auditProcess=="院级"?"院级":(arr.auditProcess=="分院级"?"分院级":(arr.auditProcess=="外部媒体"?"外部媒体":"")),//审核流程
						changecheckGaoJianValue:arr.manuscriptType=="党建稿件"?"p":(arr.manuscriptType=="其他稿件"?"b":(arr.manuscriptType=="项目稿件"?"i":"")),//稿件类型
						checkJiangLiValue:arr.isReceive==true?"1":(arr.isReceive==false?"0":""),//是否已领取其他专项奖励
						checkOriginalValue:arr.isOriginal==true?"1":(arr.isOriginal==false?"0":""),//是否原创
						checkSecretValue:arr.isSecret==true?"1":(arr.isSecret==false?"0":""),//素材是否涉密
						channelValue:arr.pubChannels!=""?(arr.pubChannels).split(","):[],//拟宣传渠道s
						checkTypeValue:arr.pubType=="中心工作"?"中心工作":(arr.pubType=="企业文化"?"企业文化":(arr.pubType=="思想作风"?"思想作风":"")),//宣传类型
						checkonFormValue:arr.pubForm=="图文"?"图文":(arr.pubForm=="图片"?"图片":(arr.pubForm=="视频"?"视频":(arr.pubForm=="H5"?"H5":"其他"))),//宣传形式
						checkUrgencyValue:arr.isUrgent==true?"1":(arr.isUrgent==false?"0":""),//紧急程度
						urgentText:arr.urgentText,//紧急原因
						checkPlanValue:arr.isYearPlan==true?"1":(arr.isYearPlan==false?"0":""),//紧是否符合年度宣传计划
						author: arrres,
						authorTypeName:newAuthArr,
						authorDept:newDeptArr,
						authorBy:newNameArr,
						tableUploadFile: JSON.parse(arr.materialUpload), // 上传的附件
						tableId:response.dataRows.projApply.tableId
						// examineImgId:JSON.parse(imglist).examineImgId? JSON.parse(imglist).examineImgId:[], // 上传的图片
						// outputHTML:JSON.parse(imglist).outputHTML,//富文本编辑器的value
						// newsId:arr.newsId
		
					  }
					})
				  }
				}else{
				  message.error(response.retVal);
				}
			  }else{
				let recData = {
					newsId: approval_id
				  };
					let contentData = yield call(myServices.gaojianxiangqing, recData);
					if(contentData.retCode == '1') { 
						if(contentData.dataRows){
							const arr=contentData.dataRows[0].news
							const arrres=contentData.dataRows[0].author
								var newAuthArr = arrres.map((item)=>{
								  return  item.authorTypeName;
								})
								var newDeptArr = arrres.map((item)=>{
									return  item.authorDept;
								  })
								var newNameArr = arrres.map((item)=>{
								return  item.authorBy;
								})
								const imglist=(contentData.dataRows[0].news.materialUpload).replace(/^\"|\"$/g,'')
							yield put({
							type: 'save',
							payload: {
								theme:arr.newsName,//稿件名称
								startTime:arr.startTime,//新闻事实发生时间
								checkObject:arr.deptId!=""?(arr.deptId).split(","):[],//选中的申请单位
								contentList:arr.createById!=""?(arr.createById).split(","):[],//提交人
								checkValue:arr.auditProcess=="院级"?"院级":(arr.auditProcess=="分院级"?"分院级":(arr.auditProcess=="外部媒体"?"外部媒体":"")),//审核流程
								changecheckGaoJianValue:arr.manuscriptType=="党建稿件"?"p":(arr.manuscriptType=="其他稿件"?"b":(arr.manuscriptType=="项目稿件"?"i":"")),//稿件类型
								checkJiangLiValue:arr.isReceive==true?"1":(arr.isReceive==false?"0":""),//是否已领取其他专项奖励
								checkOriginalValue:arr.isOriginal==true?"1":(arr.isOriginal==false?"0":""),//是否原创
								checkSecretValue:arr.isSecret==true?"1":(arr.isSecret==false?"0":""),//素材是否涉密
								channelValue:arr.pubChannels!=""?(arr.pubChannels).split(","):[],//拟宣传渠道s
								checkTypeValue:arr.pubType=="中心工作"?"中心工作":(arr.pubType=="企业文化"?"企业文化":(arr.pubType=="思想作风"?"思想作风":"")),//宣传类型
								checkonFormValue:arr.pubForm=="图文"?"图文":(arr.pubForm=="图片"?"图片":(arr.pubForm=="视频"?"视频":(arr.pubForm=="H5"?"H5":"其他"))),//宣传形式
								checkUrgencyValue:arr.isUrgent==false?"0":(arr.isUrgent==true?"1":""),//紧急程度
								urgentText:arr.urgentText,//紧急原因
								checkPlanValue:arr.isYearPlan==true?"1":(arr.isYearPlan==false?"0":""),//紧是否符合年度宣传计划
								author: arrres,
								authorTypeName:newAuthArr,
								authorDept:newDeptArr,
								authorBy:newNameArr,
								tableUploadFile: JSON.parse(arr.materialUpload), // 上传的附件
								// examineImgId:JSON.parse(imglist).examineImgId? JSON.parse(imglist).examineImgId:[], // 上传的图片
								// outputHTML:JSON.parse(imglist).outputHTML,//富文本编辑器的value
								tableId:arr.newsId
							}
	
						})
						const {checkonFormValue} = yield select(v =>v.manuscriptRevision)
						yield put({
							type: 'save',
							payload: {
								checkonFormValue2:checkonFormValue=="其他"?arr.pubForm:""
							}
						})
					  }
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
		// 提交人
		*tijiaoren({}, {call, put, select}){
			let tijiaorenData = yield call(myServices.tijiaoren, {});
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
		//渠道
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
		//保密文件
		*querySecretFile({}, {call, put, select}){
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
		*changeDate({startTime}, {put}) {
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
					contentList: newContentList,
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
			const {author,authorTypeName,authorDept,authorBy} = yield select(v =>v.manuscriptRevision)
			// author.length++
			// author.push({selectauth:"",selectdept:"",selectname:""})
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
			const {author,authorTypeName,authorDept,authorBy} = yield select(v =>v.manuscriptRevision)
			// author.length--
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
			const {authorTypeName} = yield select(v =>v.manuscriptRevision)
			authorTypeName.splice(name,1,record);
			yield put({
				type:'save',
				payload: {
					authorTypeName:JSON.parse(JSON.stringify(authorTypeName)),
				}
			})
		},

		*onDanWeiAuthorList({record,name}, {put, call, select}) { 
			const {authorDept} = yield select(v =>v.manuscriptRevision)
			
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
			const {authorBy} = yield select(v =>v.manuscriptRevision)
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
				// 	const {examineImgId} = yield select(s => s.manuscriptRevision)
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
				// 	const {examineImgId} = yield select(s => s.manuscriptRevision)
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
			const { tableUploadFile } = yield select(state => state.manuscriptRevision);
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
			const { tableUploadFile  } = yield select(state => state.manuscriptRevision);
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
			let newContentList = record
			yield put({
				type:'save',
				payload: {
                    checkonFormValue: newContentList.target.value,
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
		*saveSubmit({record,outputHTML}, {put, call, select}) { 
		const {theme,checkObject,contentList, checkValue,  changecheckGaoJianValue, checkJiangLiValue, checkOriginalValue, checkSecretValue, channelValue,
			checkTypeValue,checkonFormValue,checkonFormValue2,checkUrgencyValue,urgentText,checkPlanValue,
			authorTypeName, authorDept, authorBy,examineImgId,startTime,dateString,newsId,tableUploadFile,
			taskid,difference,tableId} = yield select(v =>v.manuscriptRevision)
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
			newsId:tableId,
			task_id:taskid,
			userid:Cookie.get('userid'),
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
			materialUpload:JSON.stringify(tableUploadFile),
			// materialUpload:JSON.stringify({outputHTML,examineImgId}),
			startTime:dateString!=undefined?dateString:startTime,
			// form:JSON.stringify({type:type}),
		}
		let postDatas = {...postData}
		if(record == '保存') { //点击保存
			postDatas['flag'] = 0
				let response = yield call(myServices.editNews, postDatas)
				if(response.retCode === '1'){
					message.success('保存成功');
					if(difference=="审核"){
						yield put(routerRedux.push({
							pathname:'/adminApp/newsOne/myReview',
						  }));
					}else{
						yield put(routerRedux.push({
						  pathname:'/adminApp/newsOne/manuscriptManagement',
						}));
					}
					
				}else if(response.retCode == '0'){
					message.error('保存失败')
				}
			
			
		}else if(record == '提交') {
					postDatas['flag'] = 1
					if(
					 postDatas['newsName'] == ''  || postDatas['deptId'] == [] ||
					 postDatas['auditProcess'] == '' || postDatas['manuscript'] == ''|| postDatas['isReceive'] == ''||
					 postDatas['isOriginal'] == ''|| postDatas['isSecret'] == ''|| postDatas['pubChannels'] == []||
					 postDatas['pubType'] == ''|| postDatas['pubForm'] == ''|| postDatas['isUrgent'] == ""
					|| postDatas['materialUpload'] == ''|| postDatas['isYearPlan'] == ''|| postDatas['auth'] == ""
					) { 
						message.info('有必填项没填')
					}else{
							let response = yield call(myServices.editNews, postDatas)
							if(response.retCode === '1'){
								message.success('保存成功');
								if(difference=="审核"){
									yield put(routerRedux.push({
										pathname:'/adminApp/newsOne/myReview',
									  }));
								}else{
									yield put(routerRedux.push({
									  pathname:'/adminApp/newsOne/manuscriptManagement',
									}));
								}
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
				if(pathname === '/adminApp/newsOne/manuscriptManagement/manuscriptRevision'){
					dispatch({
						type: 'init',
								query
						});
				}
			});
		},
	},
}
