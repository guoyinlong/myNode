/**
 * 作者：王超
 * 创建日期：2017-11-20
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：项目考核-PM
 */
import * as service from '../../services/projectKpi/projectKpiServices';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import * as projAssessmentStandardServices from "../../services/project/projAssessmentStandard";

export default {
  namespace : 'taskDeatilTMO',
  state : {
    managerTitleObj:[],
    managerDetailObj:[],
    historys:[],
    loading:false,
    modalVisible:false,
    taskObj:{},
    totalScore: 0,
    tyScore: 0,
    djScore: 0,
    jlScore: 0,
    comScoreObj:{},
    showSubimt:true,
    isDM :true,
    showBack: true,
    puDept:""
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
    setISDMScore(state,{isDM,showBack}){
      return {
        ...state,
        isDM:isDM,
        showBack : showBack
      };
    },
    setTotalScore(state,{score}){
      return {
        ...state,
        totalScore:score
      };
    },
    setPuDept(state,{puDept}){
      return {
        ...state,
        puDept:puDept
      };
    },
    setsubmit(state,{showSubimt}){
      return {
        ...state,
        showSubimt:showSubimt
      };
    },
    settyScore(state,{score}){
      return {
        ...state,
        tyScore:score
      };
    },
    setjlScore(state,{score}){
      return {
        ...state,
        jlScore:score
      };
    },
    setdjScore(state,{score}){
      return {
        ...state,
        djScore:score
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
      let ownComScorePara = {}

      ownComScorePara.arg_proj_id = comScorePara.arg_proj_id
      const [comScore,historyDate,taskData,detailDate,ownComScore]= yield [call(service.getComScore,comScorePara),
        call(service.checkHisquery,{transjsonarray:'{"sequence":[{"check_auto_id":0}],"condition":{"check_batchid":'+check_batchid.check_batchid+'}}'}),
        call(service.getTaskParam,{transjsonarray:'{"property ":{"task_param":task_param},"condition":{"task_id":'+task_id.task_id+'}}'}),
        call(service.getManagerDetail,params),
        call(service.getOwnComScore,ownComScorePara)];
      let score = 0;
      if(comScore.RetCode === '1') {
        yield put({
          type: 'r_getComScore',
          comScoreObj:comScore
        });
      }

      if(detailDate.RetCode === '1') {
        const detailRes = yield call(projAssessmentStandardServices.projectDetailQuery,{'arg_flag':1,'arg_proj_id':detailDate.data.proj_id})
        if (detailRes.RetCode === '1'){
          const detail = detailRes.DataRows[0];
          yield put({
            type: 'setPuDept',
            puDept:detail.pu_dept_name
          });

        }
        for(let i in detailDate.data.kpi_detail) {
          if(detailDate.data.kpi_detail[i].length>0) {
            for(let j=0; j<detailDate.data.kpi_detail[i].length; j++){
              if(detailDate.data.kpi_detail[i][j].kpi_name == "差旅预算完成率") {
                if(comScore.travelBudgetCompleRateScore != '') {
                  detailDate.data.kpi_detail[i][j].kpi_score = (parseFloat(comScore.travelBudgetCompleRateScore)*parseFloat(detailDate.data.kpi_detail[i][j].kpi_ratio)/100).toFixed(2);
                } else {
                  detailDate.data.kpi_detail[i][j].kpi_score = "--";
                }
              }
              if(detailDate.data.kpi_detail[i][j].kpi_name == "人均产能") {
                if(comScore.capacityOfPeopleScore != '') {
                  detailDate.data.kpi_detail[i][j].kpi_score = (parseFloat(comScore.capacityOfPeopleScore)*parseFloat(detailDate.data.kpi_detail[i][j].kpi_ratio)/100).toFixed(2);
                } else {
                  detailDate.data.kpi_detail[i][j].kpi_score = "--";
                }
              }
              if(detailDate.data.kpi_detail[i][j].kpi_name == "投资产出收益比") {
                if(comScore.investmentOutputRatioScore != '') {
                  detailDate.data.kpi_detail[i][j].kpi_score = (parseFloat(comScore.investmentOutputRatioScore)*parseFloat(detailDate.data.kpi_detail[i][j].kpi_ratio)/100).toFixed(2);
                } else {
                  detailDate.data.kpi_detail[i][j].kpi_score = "--";
                }
              }
              if(detailDate.data.kpi_detail[i][j].kpi_name == "自主研发（运维）占比" && detailDate.data.kpi_detail[i][j].kpi_state != '5' ) {
                //原自主运维指标
                // if(comScore.ownResearchRateScore != '') {
                //   detailDate.data.kpi_detail[i][j].kpi_score = (parseFloat(comScore.ownResearchRateScore)*parseFloat(detailDate.data.kpi_detail[i][j].kpi_ratio)/100).toFixed(2);
                //   detailDate.data.kpi_detail[i][j].percentile_score = comScore.ownResearchRateScore;
                // } else {
                //   detailDate.data.kpi_detail[i][j].kpi_score = "--";
                // }

                if(ownComScore.RetCode==1&&ownComScore.ownResearchRateScore != '') {
                  if(ownComScore.ownResearchRateScore !==undefined){
                    comScore.ownResearchRateScore = ownComScore.ownResearchRateScore
                    comScore.ownResearchRate = ownComScore.ownResearchRate
                  }
                  //判断自主运维考核指标是否选择豁免是则初始化得分为100,归属部门经理打分;否,则正常计算
                  if(historyDate.DataRows[historyDate.DataRows.length-1].current_link_roleid==="归口部门经理"&&detailDate.data.kpi_detail[i][j].kpi_assessment === '0'){
                    detailDate.data.kpi_detail[i][j].kpi_score = detailDate.data.kpi_detail[i][j].kpi_ratio;
                    detailDate.data.kpi_detail[i][j].percentile_score = '100';
                    // comScore.ownResearchRate = "50.1%"
                  }else if(historyDate.DataRows[historyDate.DataRows.length-1].current_link_roleid==="TMO"&&detailDate.data.kpi_detail[i][j].kpi_assessment === '0'){
                  }else{
                    //新自主运维指标
                    detailDate.data.kpi_detail[i][j].kpi_score = (parseFloat(ownComScore.ownResearchRateScore)*parseFloat(detailDate.data.kpi_detail[i][j].kpi_ratio)/100).toFixed(2);
                    detailDate.data.kpi_detail[i][j].percentile_score = ownComScore.ownResearchRateScore;
                  }
                } else {
                  detailDate.data.kpi_detail[i][j].kpi_score = "--";
                }
              }
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

        Object.keys(detailDate.data.kpi_detail).forEach(function(key){

          if(detailDate.data.kpi_detail[key][0].kpi_flag != 0){
           delete detailDate.data.kpi_detail[key]
          }

     });


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


    *getDMManagerDetail({comScorePara,params,check_batchid,task_id},{select, call, put}) {
      let ownComScorePara = {}
      let djScore= 0
      let tyScore = 0
      let jlScore = 0
      ownComScorePara.arg_proj_id = comScorePara.arg_proj_id
      const [comScore,historyDate,taskData,detailDate,ownComScore]= yield [call(service.getComScore,comScorePara),
        call(service.checkHisquery,{transjsonarray:'{"sequence":[{"check_auto_id":0}],"condition":{"check_batchid":'+check_batchid.check_batchid+'}}'}),
        call(service.getTaskParam,{transjsonarray:'{"property ":{"task_param":task_param},"condition":{"task_id":'+task_id.task_id+'}}'}),
        call(service.getManagerDetail,params),
        call(service.getOwnComScore,ownComScorePara)];
      let score = 0;
      if(comScore.RetCode === '1') {
        yield put({
          type: 'r_getComScore',
          comScoreObj:comScore
        });
      }
      if(detailDate.RetCode === '1') {
        const detailRes = yield call(projAssessmentStandardServices.projectDetailQuery,{'arg_flag':1,'arg_proj_id':detailDate.data.proj_id})
        if (detailRes.RetCode === '1'){
          const detail = detailRes.DataRows[0];
          yield put({
            type: 'setPuDept',
            puDept:detail.pu_dept_name
          });

        }
        for(let i in detailDate.data.kpi_detail) {
          if(detailDate.data.kpi_detail[i].length>0) {
            for(let j=0; j<detailDate.data.kpi_detail[i].length; j++){
              if(detailDate.data.kpi_detail[i][j].kpi_name == "差旅预算完成率") {
                if(comScore.travelBudgetCompleRateScore != '') {
                  detailDate.data.kpi_detail[i][j].kpi_score = (parseFloat(comScore.travelBudgetCompleRateScore)*parseFloat(detailDate.data.kpi_detail[i][j].kpi_ratio)/100).toFixed(2);
                } else {
                  detailDate.data.kpi_detail[i][j].kpi_score = "--";
                }
              }
              if(detailDate.data.kpi_detail[i][j].kpi_name == "人均产能") {
                if(comScore.capacityOfPeopleScore != '') {
                  detailDate.data.kpi_detail[i][j].kpi_score = (parseFloat(comScore.capacityOfPeopleScore)*parseFloat(detailDate.data.kpi_detail[i][j].kpi_ratio)/100).toFixed(2);
                } else {
                  detailDate.data.kpi_detail[i][j].kpi_score = "--";
                }
              }
              if(detailDate.data.kpi_detail[i][j].kpi_name == "投资产出收益比") {
                if(comScore.investmentOutputRatioScore != '') {
                  detailDate.data.kpi_detail[i][j].kpi_score = (parseFloat(comScore.investmentOutputRatioScore)*parseFloat(detailDate.data.kpi_detail[i][j].kpi_ratio)/100).toFixed(2);
                } else {
                  detailDate.data.kpi_detail[i][j].kpi_score = "--";
                }
              }
              if(detailDate.data.kpi_detail[i][j].kpi_name == "自主研发（运维）占比" && detailDate.data.kpi_detail[i][j].kpi_state != '5' ) {
                //原自主运维指标
                // if(comScore.ownResearchRateScore != '') {
                //   detailDate.data.kpi_detail[i][j].kpi_score = (parseFloat(comScore.ownResearchRateScore)*parseFloat(detailDate.data.kpi_detail[i][j].kpi_ratio)/100).toFixed(2);
                //   detailDate.data.kpi_detail[i][j].percentile_score = comScore.ownResearchRateScore;
                // } else {
                //   detailDate.data.kpi_detail[i][j].kpi_score = "--";
                // }
                if(ownComScore.ownResearchRateScore != '') {
                  if(ownComScore.ownResearchRateScore !==undefined){
                    comScore.ownResearchRateScore = ownComScore.ownResearchRateScore
                    comScore.ownResearchRate = ownComScore.ownResearchRate
                  }
                  //判断自主运维考核指标是否选择豁免是则初始化得分为100,归属部门经理打分;否,则正常计算
                  if(historyDate.DataRows[historyDate.DataRows.length-1].current_link_roleid==="归口部门经理"&&detailDate.data.kpi_detail[i][j].kpi_assessment === '0'){
                    detailDate.data.kpi_detail[i][j].kpi_score = detailDate.data.kpi_detail[i][j].kpi_ratio;
                    detailDate.data.kpi_detail[i][j].percentile_score = '100';
                    // comScore.ownResearchRate = "50.1%"
                  }else if(historyDate.DataRows[historyDate.DataRows.length-1].current_link_roleid==="TMO"&&detailDate.data.kpi_detail[i][j].kpi_assessment === '0'){
                  }else{
                    //新自主运维指标
                    detailDate.data.kpi_detail[i][j].kpi_score = (parseFloat(ownComScore.ownResearchRateScore)*parseFloat(detailDate.data.kpi_detail[i][j].kpi_ratio)/100).toFixed(2);
                    detailDate.data.kpi_detail[i][j].percentile_score = ownComScore.ownResearchRateScore;
                  }
                } else {
                  detailDate.data.kpi_detail[i][j].kpi_score = "--";
                }
              }
              if(detailDate.data.kpi_detail[i][j].kpi_score == "") {
                detailDate.data.kpi_detail[i][j].kpi_score = "--";
                continue;
              }
              if(detailDate.data.kpi_detail[i][j].kpi_score != "--"&&detailDate.data.kpi_detail[i][j].kpi_flag == 1) {
                score+=parseFloat(detailDate.data.kpi_detail[i][j].kpi_score);
              }
              if(detailDate.data.kpi_detail[i][j].kpi_score != "--"&&detailDate.data.kpi_detail[i][j].kpi_flag == 3){
                djScore+=parseFloat(detailDate.data.kpi_detail[i][j].kpi_score);
              }
              if(detailDate.data.kpi_detail[i][j].kpi_score != "--"&&detailDate.data.kpi_detail[i][j].kpi_flag == 0){
                tyScore+=parseFloat(detailDate.data.kpi_detail[i][j].kpi_score);
              }
              if(detailDate.data.kpi_detail[i][j].kpi_score != "--"&&detailDate.data.kpi_detail[i][j].kpi_flag == 2){
                jlScore+=parseFloat(detailDate.data.kpi_detail[i][j].kpi_score);
              }
            }
          }
        }

    //     Object.keys(detailDate.data.kpi_detail).forEach(function(key){
    //       if(detailDate.data.kpi_detail[key][0].kpi_flag == 0){
    //        delete detailDate.data.kpi_detail[key]
    //       }

    //  });
        let isDM = true
        let showBack = true
        if (historyDate.RetCode === '1') {
          if (historyDate.DataRows[historyDate.DataRows.length - 1].current_link_roleid === '归口部门接口人') {
               isDM = false
          } else {
             isDM = true
          }
          if (historyDate.DataRows[historyDate.DataRows.length - 2].current_link_roleid === '归口部门接口人') {
            showBack = true
          } else {
            showBack = false
          }
        }
     yield put({
      type: 'setjlScore',
      score:jlScore.toFixed(2)
    });
        yield put({
          type: 'setISDMScore',
          isDM:  isDM,
          showBack: showBack,
        });

        yield put({
          type: 'setdjScore',
          score:djScore.toFixed(2)
        });
        yield put({
          type: 'r_managerDetail',
          managerDetailObj:detailDate.data
        });
        yield put({
          type: 'setTotalScore',
          score:score.toFixed(2)
        });
        yield put({
        type: 'settyScore',
        score:tyScore.toFixed(2)
      });
      }

      let showSubimt = true
      if(tyScore == 0){
        showSubimt = false
      }
      yield put({
        type: 'setsubmit',
        showSubimt:showSubimt
      });
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
        totalScore:'',
        productionScore :'',
      });
    },
    *dmUpdateKpi({updatePara,params,check_batchid,task_id,comScorePara,messageType},{select,call, put}) {
      const { isDM } = yield select(state => state.taskDeatilTMO)
      let rsp
      if (isDM){
        rsp = yield call(service.dmUpdateKpi,updatePara);
      }else{
        rsp = yield call(service.ContactpdateKpi,updatePara);
      }


      if(rsp.RetCode === '1') {
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
    *TMOUpdateKpi({updatePara,params,check_batchid,task_id,comScorePara,messageType},{select,call, put}) {

      let rsp = yield call(service.TMOUpdateKpi,updatePara);

      if(rsp.RetCode === '1') {
        message.success(messageType+'成功');
        if(messageType == '提交') {
          // 保存页面数据
          yield put({
            type: 'saveResult'
          });
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
      const {RetCode}=yield call(service.saveByTmo,updatePara);
      if(RetCode === "1") {
        message.success(messageType+'成功!');
        yield put({
          type: 'getDMManagerDetail',
          params:params,
          check_batchid:check_batchid,
          task_id:task_id,
          comScorePara:comScorePara
        });
      } else {
        message.error(messageType+'失败!');
      }
    },
    // 保存页面数据
    *saveResult( _ , { call, select }) {
      const { managerDetailObj } = yield select(state => state.taskDeatilTMO);
      const params = {
        arg_year: managerDetailObj.year,
        arg_season: managerDetailObj.season,
        arg_proj_id: managerDetailObj.proj_id,
        arg_total_cost: managerDetailObj.totalCost,
        arg_travel_budget_cost: managerDetailObj.travelBudgetCost,
        arg_travel_actual_cost: managerDetailObj.actualTravelCost,
        arg_annual_people: managerDetailObj.annualPeople,
        arg_out_person_workload: managerDetailObj.outPersonWorkload,
        arg_own_workload: managerDetailObj.ownWorkload
      }
      yield call(service.saveComScore, params);
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
