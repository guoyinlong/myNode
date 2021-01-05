/**
 * 作者：王超
 * 创建日期：2017-11-20
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：项目考核-PM
 */
import * as service from '../../services/projectKpi/projectKpiServices';
import { message } from 'antd';
export default {
    namespace : 'deatilKpiM',
    state : {
        isStartObj: null,
        managerTitleObj:[],
        managerDetailObj:[],
        isFile:false,
        isDis:false
    },
  
    reducers : {
		r_isStart(state,{isStartObj}){
        	return{
            	...state,
            	isStartObj
            };
        },
        r_getManagerTitle(state,{managerTitleObj}){
        	
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
    	
    		if(managerDetailObj[0].file_name != "" && managerDetailObj[0].file_name != undefined) {
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
       
        r_pmUpdateScore(state,{isDis}){
        	return{
            	...state,
            	isDis
            };
       }
	},

    effects : {
      *isStart({params},{call, put}) {
          const {DataRows}=yield call(service.isStart,params);
          yield put({
              type: 'r_isStart',
              isStartObj:DataRows
          });
        },
        *getManagerTitle({params},{call, put}) {
            const {DataRows}=yield call(service.getManagerTitle,params);
            yield put({
                type: 'r_getManagerTitle',
                managerTitleObj:DataRows
            });
        },
        *getManagerDetail({params},{call, put}) {
            const {DataRows,RetCode,RowCount}=yield call(service.getManagerDetail,params);
            if(RetCode === '1' && RowCount>0) {
            	yield put({
	                type: 'r_managerDetail',
	                managerDetailObj:DataRows
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
            	message.success('上传成功');
            	yield put({
	                type: 'r_file',
	                isFile:true
	            });
            } else {
            	message.error('上传失败');
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
            	message.error('删除失败');
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
            	message.success('删除成功');
            } else {
            	message.error('删除失败');
            }
        },
        *pmUpdateScore({params,messageType},{call, put}) {
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
            
        },
        *pmUpdateKpi({params,nextObj,messageType,detailPara},{call, put}) {

            const {RetCode}=yield call(service.pmUpdateKpi,params);
            if(RetCode === "1") {
            	yield put({
                	type: 'pmUpdateScore',
                	params:{nextObj,messageType}
            	});
            	yield put({
                	type: 'getManagerDetail',
                	params:detailPara
            	});
            }
        }
    },
    subscriptions : {
		setup({ dispatch, history }) {
      		return history.listen(({ pathname, query }) => {
	        if (pathname === '/projectApp/projexam/kpifeedback') {
	            dispatch({type: 'isStart', query});
	        } 
	      });
	    }
    }
}
