/**
 * 作者：郭银龙
 * 创建日期： 2020-10-20
 * 邮箱: guoyl@itnova.com.cn
 * 功能： 宣传组织新增
 */
import Cookie from 'js-cookie'; 
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as myServices from '../../../services/newsOne/newsOneServers';
export default {
	namespace: 'newPublicity', 
	loading: true, 
	state: {
        duizhangList:[],//队长
        duiyuanList:[],//队长
        channelDuiZhangValue:[],//队长选中
        channelDuiYuanValue:[],//队员选中
        titleName:""
	},
    reducers: { // 刷新数据
			save(state, action) {
				return { ...state,
					...action.payload
				};
			},
    },




    
  	effects: {
       
           	 //队长查询
        *queryUserInfo({}, {call, put, select}){
            let duizhangData = yield call(myServices.queryDeptThought, {});
            if(duizhangData.retCode == '1') { 
                if(duizhangData.dataRows){
                yield put({
                        type: 'save',
                        payload: {
                            duizhangList:duizhangData.dataRows, 
                            channelDuiZhangValue:[],//队长选中
                            channelDuiYuanValue:[],//队员选中
                            titleName:""
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
                const {titleName,channelDuiZhangValue,channelDuiYuanValue} = yield select(v =>v.newPublicity)
                let postData = {
                    thoughtName: titleName,//思想文化宣传队名称
                    thoughtCaptain:channelDuiZhangValue,//思想文化宣传队队长/新闻宣传员
                    thoughtTeam:channelDuiYuanValue.toString(),//思想文化宣传队队员
                }
                let postDatas = { ...postData}
                if(record == '保存') { //点击保存
                    postDatas['flag'] = 0
                    let response = yield call(myServices.addProOrganization, postDatas)
                    if(response.retCode === '1'){
                        message.success('保存成功');
                        yield put(routerRedux.push({
                              pathname:'/adminApp/newsOne/statisticalReport',
                              query: {
                                callbackId:"xuanchaunzuzhi"
                            }
                            }));
                    }else if(response.retCode == '0'){
                        message.error('保存失败')
                    }
                }else if(record == '提交') {
                    postDatas['flag'] = 1
                    if(postDatas['titleName'] == '' ||postDatas['channelDuiZhangValue'] == []||postDatas['channelDuiYuanValue'] == [] ) { 
                        message.info('有必填项没填')
                    }else{
                        let response = yield call(myServices.addProOrganization, postDatas)
                        if(response.retCode == '1') {
                            message.info('提交成功');
                            yield put(routerRedux.push({
                                pathname:'/adminApp/newsOne/statisticalReport',
                                query: {
                                    callbackId:"xuanchaunzuzhi"
                                }
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
				if(pathname === '/adminApp/newsOne/statisticalReport/newPublicity'){
					dispatch({
						type: 'queryUserInfo',
								query
                        });
                        dispatch({
                            type: 'queryUserInfo2',
                                    query
                            });
				}
			});
		},
	},
}
