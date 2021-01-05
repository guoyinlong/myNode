/**
 * 作者：王超
 * 创建日期：2017-11-20
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：项目考核-PM
 */
import * as service from '../../services/projectKpi/projectKpiServices';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
    namespace : 'taskDeatilTMO',
    state : {
        managerTitleObj:[],
        managerDetailObj:[],
        historys:[],
        loading:true,
        modalVisible:false,
        taskObj:{},
        totalScore:'',
        comScoreObj:{},
        showSubimt:true
    },
  
    reducers : {
        r_getManagerTitle(state,{managerTitleObj}){
            managerTitleObj.map((item,index)=>{
                switch(managerTitleObj[index].season) {
                    case '0':
                        managerTitleObj[index].season = '年度';
                        break;
                    case '1':
                        managerTitleObj[index].season = '第1季度';
                        break;
                    case '2':
                        managerTitleObj[index].season = '第2季度';
                        break;
                    case '3':
                        managerTitleObj[index].season = '第3季度';
                        break;
                    case '4':
                        managerTitleObj[index].season = '第4季度';
                        break;
                    default:
                        managerTitleObj[index].season;
                }
            })
            
            return{
                ...state,
                managerTitleObj
            };
        },
        
        r_managerDetail(state,{managerDetailObj}){
            
            return{
                ...state,
                managerDetailObj
            };
        },
        
        taskShowModal(state) {
            return {
                ...state,
                modalVisible : true
            };
        },
        taskHideModal(state) {
            return {
                ...state,
                modalVisible : false
            };
        },
        setTotalScore(state,{score}){
            return {
                ...state,
                totalScore:score
            };
        },
        
        r_cmanagerDetail(state,{managerDetailObj,managerTitleObj,totalScore}){
            return{
                ...state,
                managerDetailObj,
                managerTitleObj,
                totalScore
            };
        },
        r_checkHisquery(state,{historys}){
            return{
                ...state,
                historys
            };
        },
        r_getTaskParam(state,{taskObj}){
            return{
                ...state,
                taskObj,
            };
        },
        r_getComScore(state,{comScoreObj}){
            if(comScoreObj.actualTravelCost == '' 
               ||comScoreObj.annualPeople == ''
               ||comScoreObj.ownWorkload == ''
               ||comScoreObj.totalCost == ''
               ||comScoreObj.travelBudgetCost == '') {
                return{
                    ...state,
                    comScoreObj,
                    loading:false
                };
            } else {
                return{
                    ...state,
                    comScoreObj,
                    loading:false,
                    showSubimt:false
                };
            }
            
        }
    },

    effects : {
        *getManagerTitle({params},{call, put}) {
           
            const {RetCode,DataRows}=yield call(service.getManagerTitle,params);
            if(RetCode === '1') {
                yield put({
                    type: 'r_getManagerTitle',
                    managerTitleObj:DataRows
                });
            }
        },
        *getManagerDetail({comScorePara,params,check_batchid,task_id},{call, put}) {
            const [comScore,historyDate,taskData,detailDate]= yield [call(service.getComScore,comScorePara),
                                        call(service.checkHisquery,{transjsonarray:'{"sequence":[{"check_auto_id":0}],"condition":{"check_batchid":'+check_batchid.check_batchid+'}}'}),
                                        call(service.getTaskParam,{transjsonarray:'{"property ":{"task_param":task_param},"condition":{"task_id":'+task_id.task_id+'}}'}),
                                        call(service.getManagerDetail,params),];
            let score = 0;
            
            if(comScore.RetCode === '1') {
                yield put({
                    type: 'r_getComScore',
                    comScoreObj:comScore
                });
            }
            
            if(detailDate.RetCode === '1') {
                for(let i in detailDate.data.kpi_detail) {
                    if(detailDate.data.kpi_detail[i].length>0) {
                        for(let j=0; j<detailDate.data.kpi_detail[i].length; j++){
                            
                            if(detailDate.data.kpi_detail[i][j].kpi_score == "") {
                                detailDate.data.kpi_detail[i][j].kpi_score = "--";
                                continue;
                            }
                            if(detailDate.data.kpi_detail[i][j].kpi_score != "--") {
                                score+=parseFloat(detailDate.data.kpi_detail[i][j].kpi_score);
                            }
                        }
                    }
                }
               
                yield put({
                    type: 'r_managerDetail',
                    managerDetailObj:detailDate.data
                });
                
                
                yield put({
                    type: 'setTotalScore',
                    score:score.toFixed(2)
                });
            }
            
            if(historyDate.RetCode === '1') {
                yield put({
                    type: 'r_checkHisquery',
                    historys:historyDate.DataRows
                });
                
            }
           
            if(taskData.RetCode === '1') {
                yield put({
                    type: 'r_getTaskParam',
                    taskObj:taskData.DataRows[0]
                });
            }
        },
        *updateKpiNewFile({params,nexObj},{call, put}) {
            const {RetCode}=yield call(service.updateKpiFile,params);
            if(RetCode === '1') {
                message.success('上传成功');
                /*yield put({
                    type: 'r_file',
                    isFile:true
                });*/
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
            }
        },
        *taskReturnDM({params},{call, put}) {
            const {RetCode,RetVal}=yield call(service.taskReturnDM,params);
            console.log(RetVal);
            if(RetCode === '1') {
                message.success('退回成功');
                yield put(routerRedux.push({pathname:'/commonApp'}));
            } else {
                message.error('退回失败');
            }
        },
        
        /*checkHisquery({params},{call, put}) {
            const {RetCode,DataRows}=yield call(service.checkHisquery,{transjsonarray:'{"sequence":[{"check_auto_id":0}],"condition":{"check_batchid":'+params.check_batchid+'}}'});
            if(RetCode === '1') {
                yield put({
                    type: 'r_checkHisquery',
                    params:DataRows
                });
            }
        },*/
        *cleanManagerDetail({params},{call, put}) {
            yield put({
                type: 'r_cmanagerDetail',
                managerDetailObj:[],
                managerTitleObj:[],
                totalScore:''
            });
        },
        
        
        *dmUpdateKpi({updatePara,params,check_batchid,task_id,comScorePara,messageType},{call, put}) {
            
            const {RetCode,RetVal}=yield call(service.dmUpdateKpi,updatePara);
            
            console.log(RetVal);
            if(RetCode === '1') {
                message.success(messageType+'成功');
                if(messageType == '提交') {
                    yield put(routerRedux.push({pathname:'/commonApp'}));
                }
                
                /*yield put({
                    type: 'getManagerDetail',
                    params:params,
                    check_batchid:check_batchid,
                    task_id:task_id,
                    comScorePara:comScorePara
                });*/
            } else {
                message.error(messageType+'失败');
            }
        },
        
        *TMOUpdateKpi({updatePara,params,check_batchid,task_id,comScorePara,messageType},{call, put}) {
            const {RetCode,RetVal}=yield call(service.TMOUpdateKpi,updatePara);
            
            console.log(RetVal);
            if(RetCode === '1') {
                message.success(messageType+'成功');
                if(messageType == '提交') {
                    yield put(routerRedux.push({pathname:'/commonApp'}));
                }
                
            } else {
                message.error(messageType+'失败');
            }
        },
        
        *pmUpdateKpi({updatePara,params,check_batchid,task_id,comScorePara,messageType},{call, put}) {
            const {RetCode,RetVal}=yield call(service.pmUpdateKpi,updatePara);
            console.log(RetVal);
            if(RetCode === "1") {
                message.success(messageType+'成功!');
                yield put({
                    type: 'getManagerDetail',
                    params:params,
                    check_batchid:check_batchid,
                    task_id:task_id,
                    comScorePara:comScorePara
                });
            } else {
                message.error(messageType+'失败!');
            }
        },
        *saveKpi({updatePara,params,check_batchid,task_id,comScorePara,messageType},{call, put}) {
            const {RetCode,RetVal}=yield call(service.saveByTmo,updatePara);
            console.log(RetVal);
            if(RetCode === "1") {
                message.success(messageType+'成功!');
                yield put({
                    type: 'getManagerDetail',
                    params:params,
                    check_batchid:check_batchid,
                    task_id:task_id,
                    comScorePara:comScorePara
                });
            } else {
                message.error(messageType+'失败!');
            }
        }
    },
    subscriptions : {
        /*setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
            if (pathname === '/projectApp/projexam/kpifeedback') {
                dispatch({type: 'isStart'});
            } 
          });
        }*/
    }
}
