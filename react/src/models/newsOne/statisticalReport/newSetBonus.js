/**
 * 作者：郭银龙
 * 创建日期： 2020-10-23
 * 邮箱: guoyl@itnova.com.cn
 * 功能： 加分项修改
 */
 

import Cookie from 'js-cookie'; 
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as myServices from '../../../services/newsOne/newsOneServers';
export default {
	namespace: 'newSetBonus', 
	loading: true, 
	state: { 
        deptList:"",//单位
        titleName:"",//加分事项
        rewardValue:"",//奖励
        jobNumberValue:"",//工号
        selectDeptValue:"",//单位
        tableUploadFile: [], //文件上传显示在table里面的数据
        reward2Value:'',
        dataList:"",
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
        //详情数据查询
            *dataInfo({}, {call, put, select}){ 
                yield put({
                    type: 'save',
                    payload: {
                      dataList:"",
                      titleName:"",//加分事项
                      rewardValue:"",//获得的奖励
                      jobNumberValue:"",//工号
                      selectDeptValue:"",//单位
                      tableUploadFile:"",//文件
                      reward2Value:"",//选中工号还是单位
                      taskid:"",
                      tableId:""
                    }
                  })
                
                const {approval_id,difference} = yield select(v =>v.newSetBonus)
                if(difference=="审核"){
                    let recData = {
                        approval_id: approval_id,
                    };
                    const response = yield call(myServices.showTodoApprovalDetail, recData);
                    if (response.retCode === '1') {
                      if (response.dataRows) {
                        const res = response.dataRows.projApply.businessObj.dataRows;
                        yield put({
                          type: 'save',
                          payload: {
                            dataList:res,
                            titleName:res.newsName,//加分事项
                            rewardValue:res.isRewarded,//获得的奖励
                            jobNumberValue:res.personalId,//工号
                            selectDeptValue:res.deptId,//单位
                            tableUploadFile:JSON.parse(res.evidence),//文件
                            reward2Value:res.personalId==""?(res.deptId==""?"":2):1,//选中工号还是单位
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
                let reqData = yield call(myServices.queryBonusItem, recData);
                if(reqData.retCode == '1') { 
                    if(reqData.dataRows){
                    const res = reqData.dataRows;
                    yield put({
                            type: 'save',
                            payload: {
                                dataList:res,
                                titleName:res.newsName,//加分事项
                                rewardValue:res.isRewarded,//获得的奖励
                                jobNumberValue:res.personalId,//工号
                                selectDeptValue:res.deptId,//单位
                                tableUploadFile:JSON.parse(res.evidence),//文件
                                reward2Value:res.personalId==""?(res.deptId==""?"":2):1,//选中工号还是单位
                                tableId:res.id
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
                        deptList:res,
                      }
                    })
                  }
                
                
            }
        },

            //加分事项
            *jiafenxiang({record}, {put}) {
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
            //获得奖励
            *reward({record}, {put}) {
                    yield put({
                        type:'save',
                        payload:{
                            rewardValue: record.target.value,
                    }
                })
            },
            *reward2({record}, {put}) {
                let select =record.target.value
                if(select==1){
                    yield put({
                        type:'save',
                        payload:{
                            selectDeptValue: '',
                        }
                    })
                }else if(select==2){
                    yield put({
                        type:'save',
                        payload:{
                            jobNumberValue:'',
                        }
                    })
                  
                }
                    yield put({
                        type:'save',
                        payload:{
                            reward2Value: select,
                    }
                })
            },
            //请输入工号
            *jobNumber({record}, {put}) { 
                yield put({
                    type:'save',
                    payload:{
                        jobNumberValue: record.target.value,
                    }
                })
            },
             //请选择单位
             *selectDept({record}, {put}) { 
                yield put({
                    type:'save',
                    payload:{
                        selectDeptValue: record,
                    }
                })
            },
    //文件上传
    * saveUploadFile({ value }, { call, select, put }) {
       const { tableUploadFile } = yield select(state => state.newSetBonus);
       tableUploadFile.push({
         upload_name: value.filename.RealFileName,
         AbsolutePath: value.filename.AbsolutePath,
         RelativePath: value.filename.RelativePath,
         key: value.filename.AbsolutePath,
        
       });
       yield put({
         type: 'save',
         payload: {
           tableUploadFile: JSON.parse(JSON.stringify(tableUploadFile))
         }
       })
     },
    //删除文件
    * deleteEvidenceFile({ record }, { call,  select, put  }) {
        const { tableUploadFile  } = yield select(state => state.newSetBonus);
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
            *saveSubmit({record}, {put, call, select}) { 
                const {titleName,rewardValue,jobNumberValue,selectDeptValue,tableUploadFile,tableId,taskid,difference} = yield select(v =>v.newSetBonus)
                let postData = {
                    id:tableId,//稿件id
                    taskId:taskid,//环节id
                    name: titleName,//加分事项
                    isRewarded:rewardValue,//获得的奖励
                    personalId:jobNumberValue,//工号
                    deptId:selectDeptValue,//单位
                    evidence:JSON.stringify(tableUploadFile),//文件
                }
                let postDatas = { ...postData}
                if(record == '保存') { //点击保存
                    postDatas['flag'] =0
                    let response = yield call(myServices.updateBonusItem, postDatas)
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
                                callbackId:"jiafenxiang"
                            }
                            }));
                        }
                      
                    }else if(response.retCode == '0'){
                        message.error('保存失败')
                    }
                }else if(record == '提交') {
                    postDatas['flag'] = 1
                    if(postDatas['name'] == '' ||postDatas['evidence'] == '[]') { 
                        message.info('有必填项没填')
                    }else{
                        let response = yield call(myServices.updateBonusItem, postDatas)
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
                                    callbackId:"jiafenxiang"
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
				if(pathname === '/adminApp/newsOne/statisticalReport/newSetBonus'){
					dispatch({
						type: 'init',
						query
                        });
                    dispatch({
                        type: 'dataInfo',
                        query
                        });
                        
            
				}
			});
		},
	},
}
