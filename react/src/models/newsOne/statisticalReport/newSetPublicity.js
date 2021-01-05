/**
 * 作者：郭银龙
 * 创建日期： 2020-10-21
 * 邮箱: guoyl@itnova.com.cn
 * 功能： 宣传组织修改
 */
import Cookie from 'js-cookie'; 
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as myServices from '../../../services/newsOne/newsOneServers';
export default {
	namespace: 'newSetPublicity', 
	loading: true, 
	state: {
        dataList:[],//数据列表
        duizhangList:[],//队长
        duiyuanList:[],//队长
        channelDuiZhangValue:[],//队长选中
        channelDuiYuanValue:[],//队员选中
        titleName:"",//请输入思想文化宣传队名称
        taskid:"",
        tableId:""
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
            yield put({
                type:'queryUserInfo2',
            })
            yield put({
                type:'dataInfo',
			})
			
        },
        //详情数据查询
        *dataInfo({}, {call, put, select}){
            yield put({
				type: 'save',
				payload: {
					dataList:[],//数据列表
                    duizhangList:[],//队长
                    duiyuanList:[],//队长
                    channelDuiZhangValue:[],//队长选中
                    channelDuiYuanValue:[],//队员选中
                    titleName:"",//请输入思想文化宣传队名称
                    taskid:"",
                    tableId:""
				}
			  })
            const {approval_id,difference} = yield select(v =>v.newSetPublicity)
            if(difference=="审核"){
                let recData = {
                    approval_id:approval_id
                  };
            const response = yield call(myServices.showTodoApprovalDetail, recData);
            if (response.retCode === '1') {
              if (response.dataRows) {
                const res = response.dataRows.projApply.businessObj.dataRows;
                const res2 = res.thoughtTeamId;
                yield put({
                  type: 'save',
                  payload: {
                    dataList:res, 
                    titleName:res.thoughtName,//请输入思想文化宣传队名称
                    channelDuiZhangValue:res.thoughtCaptainId,//队长选中
                    channelDuiYuanValue:res2.split(","),//队员选中
                    taskid:response.dataRows.taskId,
                    tableId:response.dataRows.projApply.tableId
                  }
                })
              }
            }else{
              message.error(response.retVal);
            }
          }else{
              let recData = {
				id: approval_id
			  };
            let reqData = yield call(myServices.queryDeptDetail, recData);
            if(reqData.retCode == '1') { 
                if(reqData.dataRows.thoughtTeamId!=""){
                    const res = reqData.dataRows.thoughtTeamId;
                yield put({
                        type: 'save',
                        payload: {
                            dataList:reqData.dataRows, 
                            titleName:reqData.dataRows.thoughtName,//请输入思想文化宣传队名称
                            channelDuiZhangValue:reqData.dataRows.thoughtCaptainId,//队长选中
                            channelDuiYuanValue:res.split(","),//队员选中
                            tableId:reqData.dataRows.id,
                        }
                    })
                }
               
            } 
          }
           
        },
           	 //队长查询
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
           	 //队员查询
                *queryUserInfo2({}, {call, put, select}){
                    let duiyuanData = yield call(myServices.queryDeptThought, {});
                    if(duiyuanData.retCode == '1') { 
                        if(duiyuanData.dataRows){
                        yield put({
                            type: 'save',
                            payload: {
                                duiyuanList:duiyuanData.dataRows, 
                            }
                        })
                        }
                       
                    }
                },
            //思想文化宣传队名称
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
            //思想文化宣传队队长/新闻宣传员
            *onChannelDuiZhang({record}, {put}) {
                    yield put({
                        type:'save',
                        payload:{
                            channelDuiZhangValue: record,
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
            *saveSubmit({record}, {put, call, select}) { 
                const {titleName,channelDuiZhangValue,channelDuiYuanValue,tableId,taskid,difference} = yield select(v =>v.newSetPublicity)
                let postData = {
                    id:tableId,
                    taskId:taskid,
                    thoughtName: titleName,//思想文化宣传队名称
                    thoughtCaptainId:channelDuiZhangValue,//思想文化宣传队队长/新闻宣传员
                    thoughtTeamId:channelDuiYuanValue.toString(),//思想文化宣传队队员
                }
                let postDatas = { ...postData}
                if(record == '保存') { //点击保存
                    postDatas['flag'] = 0
                    let response = yield call(myServices.xczzUpdate, postDatas)
                    if(response.retCode === '1'){
                        message.success('保存成功');
                        if(difference=="审核"){
                            yield put(routerRedux.push({
                                pathname:'/adminApp/newsOne/myReview',
                              }));
                        }else{
                              yield put(routerRedux.push({
                              pathname:'/adminApp/newsOne/statisticalReport',
                              query: {
                                callbackId:"xuanchaunzuzhi"
                            }
                            }));
                        }
                      
                    }else if(response.retCode == '0'){
                        message.error('保存失败')
                    }
                }else if(record == '提交') {
                    postDatas['flag'] = 1
                    if(postDatas['titleName'] == '' ||postDatas['channelDuiZhangValue'] == []||postDatas['channelDuiYuanValue'] == [] ) { 
                        message.info('有必填项没填')
                    }else{
                        let response = yield call(myServices.xczzUpdate, postDatas)
                        if(response.retCode == '1') {
                            message.info('提交成功');
                            if(difference=="审核"){
                                yield put(routerRedux.push({
                                    pathname:'/adminApp/newsOne/myReview',
                                  }));
                            }else{
                                  yield put(routerRedux.push({
                                  pathname:'/adminApp/newsOne/statisticalReport',
                                  query: {
                                    callbackId:"xuanchaunzuzhi"
                                }
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
				if(pathname === '/adminApp/newsOne/statisticalReport/newSetPublicity'){
                    dispatch({
                    type: 'init',
                    query
                    });
                    
				}
			});
		},
	},
}
