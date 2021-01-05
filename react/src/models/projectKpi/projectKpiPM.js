/**
 * 作者：王超
 * 创建日期：2017-11-20
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：项目考核-PM
 */
import * as service from '../../services/projectKpi/projectKpiServices';
import { message } from 'antd';
export default {
    namespace : 'deatilPM',
    state : {
        isStartObj: null,
        managerTitleObj:[],
        managerDetailObj:[],
        isFile:false,
        comScoreObj:{},
        isDis:false,
        retreatMessage:''
    },
  
    reducers : {
		r_isStart(state,{isStartObj}){
        	return{
            	...state,
            	isStartObj
            };
        },
        r_getManagerTitle(state,{managerTitleObj}){
        	if (!managerTitleObj[0]){
                return {
                    ...state,
                    managerTitleObj
                }
            }
        	switch(managerTitleObj[0].season) {
				case '0':
				    managerTitleObj[0].season = '年度';
				    break;
				case '1':
				    managerTitleObj[0].season = '第1季度';
				    break;
				case '2':
				    managerTitleObj[0].season = '第2季度';
				    break;
				case '3':
				    managerTitleObj[0].season = '第3季度';
				    break;
				case '4':
				    managerTitleObj[0].season = '第4季度';
				    break;
				default:
				    managerTitleObj[0].season;
		    }
            return{
        		...state,
        		managerTitleObj
      		};
    	},
    	
    	r_managerDetail(state,{managerDetailObj}){
    		let isFile = false;
    	    //console.log(managerDetailObj.kpi_detail);
    		if(managerDetailObj.kpi_detail.KPI&&managerDetailObj.kpi_detail.KPI[0].file_name != "" && managerDetailObj.kpi_detail.KPI[0].file_name != undefined) {
    			isFile = true;
    		}
        	return{
            	...state,
            	managerDetailObj,
            	isFile:isFile,
            };
        },
        
        r_cmanagerDetail(state,{managerDetailObj,isFile,isDis}){
        	return{
            	...state,
            	managerDetailObj,
            	isFile,
        		isDis
            };
        },
        
        r_file(state,{isFile}){
        	return{
            	...state,
            	isFile
            };
        },
        
        r_getRetreatMessage(state,{retreatMessage}){
            return{
                ...state,
                retreatMessage
            };
        },
        
        r_getComScore(state,{comScoreObj}){
            return{
                ...state,
                comScoreObj,
            };
        },
       
        r_pmUpdateScore(state,{isDis}){
        	return{
            	...state,
            	isDis
            };
       }
	},

    effects : {
      *isStart({params},{call, put}) {
          const {DataRows}=yield call(service.isStart);
          yield put({
              type: 'r_isStart',
              isStartObj:DataRows
          });
        },
        *getManagerTitle({params},{call, put}) {
            const {RetCode,DataRows}=yield call(service.getManagerTitle,params);
            if(RetCode === '1') {
                yield put({
                    type: 'r_getManagerTitle',
                    managerTitleObj:DataRows
                });
            }
        },
        /**getRetreatMessage({params},{call, put}) {
            const {RetCode,DataRows}=yield call(service.checkHisquery,{transjsonarray:'{"property":{"current_opt_comment":"current_opt_comment"},"condition":{"check_id":'+params.check_id+'}}'});
            if(RetCode === '1' && DataRows.length>0) {
                yield put({
                    type: 'r_getRetreatMessage',
                    retreatMessage:DataRows[0].current_opt_comment
                });
            }
        },*/
        *getManagerDetail({comScorePara,params},{call, put}) {
            
            const [comScore,DetailObj,messageObj]= yield [call(service.getComScore,comScorePara),
                                            call(service.getManagerDetail,params),
                                            call(service.checkHisquery,{transjsonarray:'{"property":{"current_opt_comment":"current_opt_comment"},"condition":{"check_id":'+params.check_id+'}}'})];
            
          console.log(DetailObj)
            if(comScore.RetCode === '1') {
                yield put({
                    type: 'r_getComScore',
                    comScoreObj:comScore
                });
            }
            if(DetailObj.RetCode === '1') {
            	yield put({
	                type: 'r_managerDetail',
	                managerDetailObj:DetailObj.data
	            });
            }
            if(messageObj.RetCode === '1' && messageObj.DataRows.length>0) {
                yield put({
                    type: 'r_getRetreatMessage',
                    retreatMessage:messageObj.DataRows[0].current_opt_comment
                });
            }
        },
        *cleanManagerDetail({params},{call, put}) {
            yield put({
                type: 'r_cmanagerDetail',
                managerDetailObj:[],
                isFile:false,
        		isDis:false
            });
        },
        *updateKpiNewFile({params,nexObj},{call, put}) {
            const {RetCode}=yield call(service.updateKpiFile,params);
            if(RetCode === '1') {
            	message.success('上传文件成功');
            	yield put({
	                type: 'r_file',
	                isFile:true
	            });
            } else {
            	message.error('上传文件失败');
            }
        },
        *updateKpiFile({params,nexObj},{call, put}) {
            const {RetCode}=yield call(service.updateKpiFile,params);
            if(RetCode === '1') {
            	yield put({
	                type: 'deleteKpiFile',
	                params:nexObj
	            });
            } else {
            	message.error('删除文件失败');
            	/*yield put({
	                type: 'r_file',
	                isFile:false
	            });*/
            }
        },
        
        *deleteKpiFile({params},{call, put}) {
            const {RetCode}=yield call(service.deleteKpiFile,params);
            if(RetCode === '1') {
            	yield put({
	                type: 'r_file',
	                isFile:false
	            });
            	message.success('删除文件成功');
            } else {
            	message.error('删除文件失败');
            }
        },
        /**pmUpdateScore({params,messageType},{call, put}) {
            const {RetCode}=yield call(service.pmUpdateScore,params.nextObj);
            if(RetCode === '1') {
            	message.success(params.messageType+'成功');
            	if(params.messageType === '提交') {
            		yield put({
		                type: 'r_pmUpdateScore',
		                isDis:true
		            });
            	} else {
            		yield put({
		                type: 'r_pmUpdateScore',
		                isDis:false
		            });
            	}
            	
            } else {
            	message.error(params.messageType+'失败');
            }
            
        },*/
       *pmRetract({params,detailPara},{call, put}) {
           console.log(params)
            const {RetCode,RetVal}=yield call(service.pmRetract,params);
            if(RetCode === '1') {
                message.success('撤回成功！');
                yield put({
                    type: 'r_pmUpdateScore',
                    isDis:false
                });
                yield put({
                    type: 'getManagerDetail',
                    params:detailPara
                });
                
            } else {
                console.log(RetVal);
                message.error('撤回失败！');
            }
            
        },
        *pmUpdateKpi({updatePara,detailPara,messageType},{call, put}) {
            console.log(updatePara)
            const {RetCode}=yield call(service.pmUpdateKpi,updatePara);
            if(RetCode === "1") {
            	message.success(messageType+'成功!');
            	if(messageType === '提交') {
                    yield put({
                        type: 'r_pmUpdateScore',
                        isDis:true
                    });
                } else {
                    yield put({
                        type: 'r_pmUpdateScore',
                        isDis:false
                    });
                }
            	yield put({
                	type: 'getManagerDetail',
                	params:detailPara
            	});
            } else {
                message.error(messageType+'失败!');
            }
        }
    },
    subscriptions : {
		setup({ dispatch, history }) {
      		return history.listen(({ pathname, query }) => {
	        if (pathname === '/projectApp/projexam/kpifeedback') {
	            dispatch({type: 'isStart'});
	        } 
	      });
	    }
    }
}
