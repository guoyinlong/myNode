/**
 * 作者：郭银龙
 * 创建日期： 2020-10-21
 * 邮箱: guoyl@itnova.com.cn
 * 功能： 稿件复核新增 
 */
import Cookie from 'js-cookie'; 
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as myServices from '../../../services/newsOne/newsOneServers';
export default {
	namespace: 'newManuscriptReview', 
	loading: true, 
	state: {
        fabuqudaoList:[],//发布渠道
        changeQuDaoValue:[],//选中渠道列表
        titleName:"",
        startTime:"",
        checkObjectAndContentList:[],//单位
        checkContentList:[],//提交人
        author:[1],
        selectauth:[],
        selectdept:[],
        selectname:[],
        instructionsValue:"",
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
                type:'save',
                payload:{
                    fabuqudaoList:[],//发布渠道
                    changeQuDaoValue:[],//选中渠道列表
                    titleName:"",
                    startTime:"",
                    checkObjectAndContentList:[],//单位
                    checkContentList:[],//提交人
                    author:[1],
                    selectauth:[],
                    selectdept:[],
                    selectname:[],
                    instructionsValue:"",
                }
              })
                yield put({
                    type:'queryUserInfo1'
                })
                yield put({
                    type:'tijiaoren'
                })
                yield put({
                    type:'queryUserInfo'
                })
                yield put({
                    type:'queryUserInfo2'
                })
                
            },
       
           	 	// 单位
		*queryUserInfo1({}, {call, put, select}){
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
        // //提交人
        // *tijiaoren({}, {call, put, select}){
        //     let tijiaorenData = yield call(myServices.tijiaoren, {});
        //     if(tijiaorenData.retCode == '1') { 
        //         if(tijiaorenData.dataRows){
        //             const res = tijiaorenData.dataRows;
        //             res.map((item, index) => {
        //               item.key=index;
        //               item.type = '1';
        //             });
        //             yield put({
        //               type:'save',
        //               payload:{
        //                 checkContentList:res,
        //               }
        //             })
        //           }
        //     }
        // },
        *queryUserInfo({}, {call, put, select}){
            let duizhangData = yield call(myServices.queryDeptThought, {});
            if(duizhangData.retCode == '1') { 
                if(duizhangData.dataRows){
                yield put({
                        type: 'save',
                        payload: {
                            duizhangList:duizhangData.dataRows, 
                        }
                    })
                }
               
            }
        },
        //发布渠道
        *queryUserInfo2({}, {call, put, select}){
            let qudaoData = yield call(myServices.queryTwoChannel, {});
            if(qudaoData.retCode == '1') { 
                if(qudaoData.dataRows){
                    const res=qudaoData.dataRows
                yield put({
                    type: 'save',
                    payload: {
                        fabuqudaoList:res, 
                    }
                })
                }
            }
        },
        //稿件名称
        *name({record}, {put}) {
            if(record.target.value.length>50){
                message.info('超过字数限制')
            }else {
                yield put({
                    type:'save',
                    payload:{
                        titleName: record.target.value,
                }
            })
        }
        },
        //稿件发布时间
        *changeDate({dateString }, {put}) {
            yield put({
                type: 'save',
                payload: {
                    startTime: dateString,
                }
            })
        },
           
        // 作者 
        *add({record},{put, call, select}){
            const {author,selectauth,selectdept,selectname} = yield select(v =>v.newManuscriptReview)
            // author.length++
            author.push({selectauth:"",selectdept:"",selectname:""})
			selectauth.push([])
			selectdept.push([])
			selectname.push([])
            yield put({
                type:'save',
                payload: {
                    author:JSON.parse(JSON.stringify(author)),
                }
            })
		},
		*remove({record,name},{put, call, select}){
            const {author,selectauth,selectdept,selectname} = yield select(v =>v.newManuscriptReview)
            author.splice(record,1)
            selectauth.splice(record,1)
            selectdept.splice(record,1)
            selectname.splice(record,1)
				yield put({
					type:'save',
					payload: {
						author:JSON.parse(JSON.stringify(author)),
					}
				})

		},
       
        *onAuthorCheck({record,name}, {put, call, select}) { 
            const {selectauth} = yield select(v =>v.newManuscriptReview)
            selectauth.splice(name,1,record);
			yield put({
				type:'save',
				payload: {
                    selectauth:JSON.parse(JSON.stringify(selectauth)),
                }
			})
		},

        *onDanWeiAuthorList({record,name}, {put, call, select}) { 
            const {selectdept} = yield select(v =>v.newManuscriptReview)
            selectdept.splice(name,1,record);
			yield put({
				type:'save',
				payload:{
                    selectdept:JSON.parse(JSON.stringify(selectdept)),

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
            const {selectname} = yield select(v =>v.newManuscriptReview)
			selectname.splice(name,1,record);
			yield put({
				type:'save',
				payload:{
                    selectname:JSON.parse(JSON.stringify(selectname)),

				}
			})
		},
        //思想文化宣传队队员
        *onChannelDuiYuan({record}, {put}) { 
            let newCheckObject = [...record]
            yield put({
                type:'save',
                payload:{
                    channelDuiYuanValue: newCheckObject,
                }
            })
        },
            
        //发布渠道
        *qudao({record}, {put}) {
            yield put({
                type:'save',
                payload:{
                    changeQuDaoValue: record,
            }
        })
        },
        //复核说明
        *instructions({record}, {put}) {
            yield put({
                type:'save',
                payload:{
                    instructionsValue: record.target.value,
            }
        })
        },
        *saveSubmit({record}, {put, call, select}) { 
            const {titleName,startTime,changeQuDaoValue,instructionsValue,selectauth,selectdept,selectname} = yield select(v =>v.newManuscriptReview)
            var arr = selectauth
            var arr1=selectdept
            var arr2=selectname
            var auth =""
            var auth1 =  []
            var auth2 =  [],
            auth1 =arr1.map((item, index) => {
                return {
                    selectdept:item,
                }
            })
            auth2 =arr2.map((item, index) => {
                return {
                    selectname:item,
                }
            })
            auth =arr.map((item, index) => {
                return {
                    authorTypeName: item,
                    authorDept:(auth1[index].selectdept).toString(),
                    authorBy:(auth2[index].selectname).toString(),
                }
            })
            let postData = {
                userId:Cookie.get('userid'),
                userName:Cookie.get('username'),
                newsName: titleName,//稿件名称
                releaseTime:startTime,//发布时间
                releaseChannels:changeQuDaoValue.toString(),//发布渠道
                checkExplain:instructionsValue,//复核说明
                author:JSON.stringify(auth),//作者
            }
            let postDatas = { ...postData}
            if(record == '保存') { //点击保存
                postDatas['flag'] = 0
                let response = yield call(myServices.addNewsCheck, postDatas)
                if(response.retCode === '1'){
                    message.success('保存成功');
                    yield put(routerRedux.push({
                            pathname:'/adminApp/newsOne/statisticalReport',
                            query: {
                            callbackId:"gaojianfuhe"
                        }
                            
                        }));
                }else if(response.retCode == '0'){
                    message.error('保存失败')
                }
            }else if(record == '提交') {
                postDatas['flag'] = 1
                if(postDatas['newsName'] == '' ||postDatas['releaseTime'] == '' ||postDatas['checkExplain'] == undefined
                ||postDatas['releaseChannels'] == '' ) { 
                    message.info('有必填项没填')
                }else{
                    let response = yield call(myServices.addNewsCheck, postDatas)
                    if(response.retCode == '1') {
                        message.info('提交成功');
                        yield put(routerRedux.push({
                            pathname:'/adminApp/newsOne/statisticalReport',
                            query: {
                                callbackId:"gaojianfuhe"
                            }
                            }));
                    }else if(response.retCode == '0'){
                        message.error(response.retVal)
                    }
                }
            }
            },    
	},
	subscriptions: {
		setup({dispatch, history}) {
			return history.listen(({pathname, query}) => {
				if(pathname === '/adminApp/newsOne/statisticalReport/newManuscriptReview'){
					dispatch({
						type: 'init',
								query
                        });
                        
				}
			});
		},
	},
}
