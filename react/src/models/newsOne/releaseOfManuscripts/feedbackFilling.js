/**
 * 作者：郭银龙
 * 创建日期： 2020-10-08
 * 邮箱: guoyl@itnova.com.cn
 * 功能： 稿件发布情况填报
 */ 

import Cookie from 'js-cookie'; 
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as myServices from '../../../services/newsOne/newsOneServers';
export default {
	namespace: 'feedbackFilling', 
	loading: true, 
	state: {
        theme:"",//选中愿稿件名称
        title:"",//发布稿件标题
        startTime:"",//发布时间
        channelValue:[],//渠道
        tableUploadFile: [], //发布稿件信息文件上传显示在table里面的数据
        tableUploadFile2:[],//稿件影响力统计文件上传显示在table里面的数据
        qudaoDataList:[],//返回的渠道
        manuscriptNameList:[],//原稿件名称列表
	},
    reducers: { // 刷新数据
			save(state, action) {
				return { ...state,
					...action.payload
				};
			},
    },
  	effects: {
    // 发布渠道列表获取
    *queryUserInfo({}, {call, put, select}){
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
                    theme:"",//愿稿件名称
                    title:"",//发布稿件标题
                    startTime:"",//发布时间
                    channelValue:[],//渠道
                    tableUploadFile: [], //发布稿件信息文件上传显示在table里面的数据
                    tableUploadFile2:[],//稿件影响力统计文件上传显示在table里面的数据
                    }
                })
                }
        }
    },
    //获取原稿件名称列表
    *queryManuscriptName({}, {call, put, select}){
        let manuscriptData = yield call(myServices.querySourceNews, {});
        if(manuscriptData.retCode == '1') { 
            if(manuscriptData.dataRows){
                const res = manuscriptData.dataRows;
                res.map((item, index) => {
                    item.key=index;
                    item.type = '1';
                });
                yield put({
                    type:'save',
                    payload:{
                        manuscriptNameList:res,
                        }
                    })
                }
        }
    },
    //原稿件名称
    *theme({record}, {put}) {
            yield put({
                type:'save',
                payload:{
                theme: record,
            }
        })
    },
    //发布稿件标题
    *title({record}, {put}) {
        if(record.target.value.length>50){
            message.info('超过字数限制')
        }else {
            yield put({
                type:'save',
                payload:{
                title: record.target.value,
            }
        })
    }
    },
    //发布时间
    *changeDate({dateString }, {put}) {
        yield put({
            type: 'save',
            payload: {
                startTime: dateString,
            }
        })
    },
    //渠道
    *onChannel({record}, {put}) { 
        let newCheckObject = [...record]
        yield put({
            type:'save',
            payload:{
                channelValue: newCheckObject,
            }
        })
    },
    //保存附件名称地址
    *saveUploadFile({ value }, { call, select, put }) {
        const { tableUploadFile } = yield select(state => state.feedbackFilling);
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
    *deleteEvidenceFile({ record }, { call,  select, put  }) {
        const { tableUploadFile  } = yield select(state => state.feedbackFilling);
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
    *saveUploadFile2({ value }, { call, select, put }) {
    const { tableUploadFile2 } = yield select(state => state.feedbackFilling);
    tableUploadFile2.push({
        upload_name: value.filename.RealFileName,
        AbsolutePath: value.filename.AbsolutePath,
        RelativePath: value.filename.RelativePath,
        key: value.filename.AbsolutePath,
    });
    
    yield put({
        type: 'save',
        payload: {
        //FileInfo:FileInfo,
        tableUploadFile2: JSON.parse(JSON.stringify(tableUploadFile2))
        }
    })
    },
         //删除上传材料
    *deleteEvidenceFile2({ record }, { call,  select, put  }) {
        const { tableUploadFile2  } = yield select(state => state.feedbackFilling);
        for (let i = 0; i < tableUploadFile2.length; i++) {
          const a = tableUploadFile2.filter(v => v.AbsolutePath !== record.AbsolutePath);
          yield put({
            type: 'save',
            payload: {
              tableUploadFile2: JSON.parse(JSON.stringify(a)),
            }
          })
        }
      },
    *saveSubmit({record, saveData,argInfoId,taskparentId,files}, {put, call, select}) { 
        let saveDatas={...saveData}
        const {theme,title,startTime,channelValue,tongji,tableUploadFile,tableUploadFile2} = yield select(v =>v.feedbackFilling)

        let postData = {
            newsId: theme,//原稿件名称\原稿件名称,传稿件的id
            releaseNewsName:title,//发布稿件标题
            startTime:startTime,//时间
            releaseChannel:channelValue!=undefined? channelValue.join():[],//渠道  
            releaseNewsMsg:JSON.stringify(tableUploadFile),//发布稿件信息上传的文件
            newsInfluence:JSON.stringify(tableUploadFile2),//发布稿件影响力统计
            userid:Cookie.get('userid'),
        }
        let postDatas = {...saveDatas, ...postData}
        if(record == '保存') { //点击保存
            let response = yield call(myServices.addPub, postDatas)
            if(response.retCode === '1'){
                message.success('保存成功');
                yield put(routerRedux.push({
                        pathname:'/adminApp/newsOne/releaseOfManuscripts',
                    }));
            }else if(response.retCode == '0'){
                message.error('保存失败')
            }
        }else if(record == '提交') {
            postDatas['buttonType'] = 1
            if(postDatas['taskTitle'] == '' ||postDatas['taskTitle'] == '' ) { 
                message.info('有必填项没填')
            }else{
                let response = yield call(myServices.addPub, postDatas)
                if(response.retCode == '1') {
                    message.info('提交成功');
                    
                    yield put(routerRedux.push({
                        pathname:'/adminApp/newsOne/releaseOfManuscripts',
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
				if(pathname === '/adminApp/newsOne/releaseOfManuscripts/feedbackFilling'){
					dispatch({
						type: 'queryUserInfo',
								query
                        });
                    dispatch({
                        type: 'queryManuscriptName',
                                query
                        });
				}
			});
		},
	},
}
