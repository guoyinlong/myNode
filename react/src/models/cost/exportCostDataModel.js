/**
 *  作者: 翟金亭
 *  创建日期: 2019-11-05
 *  邮箱：zhaijt3@chinaunicom.cn
 *  文件说明：实现人工成本-研发项目人工成本明细表导出功能
 */
import Cookie from 'js-cookie';
import {message} from "antd";
import * as costService from "../../services/cost/costService";
import * as trainService from "../../services/train/trainService";
const auth_tenantid = Cookie.get('tenantid');

export default {
  namespace:'exportCostModel',
  state:{
    //ou信息
    OUDataList:[],
    //project信息
    projectTeamList:[],
    //项目组人数
    projInfoPersonNum:'',
    //查询出项目组的实际每个人信息
    costDteailData:[],
    //全部项目组信息
    costDteailAllData:[],

    //全成本信息
    costFullData:[],
    //财务报表信息
    costFinanceData:[],
    costFinanceData2:[],

    //项目转资本化数据
    costCapitalizationData:[],
    costCapitalizationDataTemp:[],
    //项目转资本化数据-项目组列表
    costToCapitalizationTeamList:[],

  },

  reducers:{
    save(state, action) {
      return { ...state, ...action.payload};
    },
  },

  effects: {
    //初始化
    *initQuery({ query },{call, put}) {
      console.log('OOOOOOOOTTT')
      console.log(query)
      console.log('OOOOOOOOTTT')
      yield put({
        type: 'save',
        payload: {
            OUDataList: [],
            codeVerify: query.verifyControl,
            rand_code: query.verifyControl
        }
      });
      //从服务获取OU列表
      let postData_getOU = {};
      postData_getOU["arg_tenantid"] = auth_tenantid;
      const getOuData = yield call(trainService.getOuList, postData_getOU);
      if(getOuData.RetCode === '1'){
        yield put({
          type: 'save',
          payload: {
            OUDataList: getOuData.DataRows
          }
        });
      }else{
        message.error('没有查询内容');
      }
    },

    //生成一个院的全部详细数据、可按照项目组查询
    *generateCostQuery({ formData },{call, put}) {
        yield put({
            type: 'save',
            payload: {
                projInfoOne: [],
                costDteailData:[]
            }
        });
        let queryParam = {
            arg_ou_id : formData.arg_ou_id,
            arg_cycle_code : formData.arg_year_month,
        };
        const detailsData = yield call(costService.generateCostQuery,queryParam);
        if(detailsData.RetCode === '1'){
            //查询已经生成的数据的项目组code、name
            yield put({
                type: 'save',
                payload: {
                    projectTeamList: [],
                    costDteailAllData:[],
                }
            });
            let queryTeamListParam = {
                arg_ou_id : Cookie.get('OUID'),
                arg_year_month : formData.arg_year_month,
            };
            const courtProjData = yield call(costService.costProjTeamListQuery,queryTeamListParam);
            if(courtProjData.RetCode === '1'){
                if(courtProjData.DataRows[0]){
                    yield put({
                        type: 'save',
                        payload: {
                            projectTeamList: courtProjData.DataRows,
                        }
                    });
                    
                    //保存该账期全部项目组数据
                    let queryAllParam = {
                        arg_ou_id : formData.arg_ou_id,
                        arg_proj_code : '',
                        arg_year_month : formData.arg_year_month,
                    };
                    const detailsAllData = yield call(costService.costAllDetaiQuery,queryAllParam);
                    if(detailsAllData.RetCode === '1'){
                        if(detailsAllData.DataRows && detailsAllData.DataRows[0]){
                            yield put({
                                type: 'save',
                                payload: {
                                    costDteailAllData: detailsAllData.DataRows,
                                }
                            });
                        }
                        message.info("生成全院"+formData.arg_year_month+"账期数据成功！");
                    }
                }else{
                    message.info("生成全院"+formData.arg_year_month+"账期数据尚未准备好！");
                }
            }else{
                message.error('查询部门项目组失败！');
            }
        }else{
            message.error('生成数据失败！');
        }
    },

    //查询，带条件
    *costProjDetailQuery({ formData },{call, put}) {
      yield put({
        type: 'save',
        payload: {
            projInfoPersonNum: '',
            costDteailData:[]
        }
      });
      let queryParam = {
        arg_ou_id : formData.arg_ou_id,
        arg_proj_code : formData.arg_proj_code,
        arg_year_month : formData.arg_year_month,
      };
      const detailsData = yield call(costService.costProjDetaiQuery,queryParam);
      if(detailsData.RetCode === '1'){
        yield put({
          type: 'save',
          payload: {
            costDteailData: detailsData.DataRows,
            projInfoPersonNum:detailsData.DataRows1,
          }
        });
      }else{
        message.error('查询出错！');
      }
    },

    //生成全成本信息、查询显示
    *generateCostFullQuery({ formData },{call,put}) {
        yield put({
            type: 'save',
            payload: {
                costFullData:[]
            }
          });

        let queryParam = {
          arg_ou_id : formData.arg_ou_id,
          arg_cycle_code : formData.arg_year_month,
        };
        const fullData = yield call(costService.generateCostFullQuery,queryParam);
        if(fullData.RetCode === '1'){
            const fullData2 = yield call(costService.costFullDataQuery,queryParam);
            if(fullData2.RetCode === '1'){
                if(fullData2.DataRows[0]){
                    message.info("生成全院"+formData.arg_year_month+"账期全成本数据成功！");
                    yield put({
                        type: 'save',
                        payload: {
                            costFullData: fullData2.DataRows,  
                        }
                    });
                }else{
                    message.info("全院"+formData.arg_year_month+"账期全成本数据暂未同步，请确认查询！");
                }


            }else{
                message.error('查询出错！');
            }              
        }else{
          message.error('生成出错！');
        } 
      },

    //生成财务报表、查询显示
    *costFinanceQuery({ formData },{call,put}) {
        yield put({
            type: 'save',
            payload: {
                costFinanceData:[],
                costFinanceData2:[]
            }
          });

        let queryParam = {
          arg_ou_id : formData.arg_ou_id,
          arg_cycle_code : formData.arg_year_month,
          arg_cost_type_flag : formData.arg_query_type,
        };
        const fullData = yield call(costService.generateCostFinanceQuery,queryParam);
        if(fullData.RetCode === '1'){
            const fullData2 = yield call(costService.costFinanceDataQuery,queryParam);
            if(fullData2.RetCode === '1'){
                if(fullData2.DataRows[0]){
                    message.info("生成全院"+formData.arg_year_month+"账期财务数据成功！");
                    if(formData.arg_query_type === '0'){
                      yield put({
                        type: 'save',
                        payload: {
                            costFinanceData: fullData2.DataRows,  
                            costFinanceData2: [],  
                        }
                      });
                    }else if(formData.arg_query_type === '1'){
                      yield put({
                        type: 'save',
                        payload: {
                            costFinanceData: [],  
                            costFinanceData2: fullData2.DataRows,  
                        }
                    });
                    }

                }else{
                    message.info("全院"+formData.arg_year_month+"账期财务数据暂未同步，请确认查询！");
                }


            }else{
                message.error('查询出错！');
            }              
        }else{
          message.error('生成出错！');
        } 
      },
    

    //项目转资，各项目组查询初始化
    *capitalizationProjTeamQuery({ formData },{call, put}){
      yield put({
        type: 'save',
        payload: {
            costToCapitalizationTeamList:[]
        }
      });
      let queryParam = {
        arg_ou_id : formData.arg_ou_id,
        arg_start_cycle_code : formData.arg_start_cycle_code,
        arg_end_cycle_code : formData.arg_end_cycle_code,
      };
      const detailsData = yield call(costService.costToCapitalizationTeamListQuery,queryParam);
      if(detailsData.RetCode === '1'){
        if(!detailsData.DataRows[0]){
          message.info("您选择的账期区间，没有项目组有转资数据，请知悉！");
        }else{
          yield put({
            type: 'save',
            payload: {
              costToCapitalizationTeamList: detailsData.DataRows,
            }
          });
        }
      }else{
        message.error('生成出错！');
      }
    },

    //查询项目转资本化
    *costToCapitalizationQuery({ formData },{call, put}) {
      yield put({
        type: 'save',
        payload: {
            costCapitalizationData:[],
            costCapitalizationDataTemp:[],
        }
      });
      let queryParam = {
        arg_ou_id : formData.arg_ou_id,
        arg_proj_code : formData.arg_proj_code,
        arg_start_cycle_code : formData.arg_start_cycle_code,
        arg_end_cycle_code : formData.arg_end_cycle_code,
      };
      const detailsData = yield call(costService.costToCapitalizationQuery,queryParam);
      if(detailsData.RetCode === '1'){
        if(detailsData.DataRows[0]){
          yield put({
            type: 'save',
            payload: {
              costCapitalizationData: detailsData.DataRows,
            }
          });
        }else{
          message.info("该项目组，在您选择的账期区间没有转资数据，请知悉！");
        }
      }else{
        message.error('查询出错！');
      }
      
      const detailsDataTemp = yield call(costService.costToCapitalizationQuery,queryParam);
      if(detailsDataTemp.RetCode === '1'){
        if(detailsDataTemp.DataRows[0]){
          yield put({
            type: 'save',
            payload: {
              costCapitalizationDataTemp: detailsDataTemp.DataRows,
            }
          });
        }else{
          return;
        }
      }else{
        return;
      }
    },
    *queryVerifyCodeIndex({}, {call, put}) {

      let paramCode = {}
      
      paramCode["arg_user_id"] = Cookie.get("userid");
      paramCode["arg_module_type"] = 0;
      const sentVerifyCodeResult = yield call(costService.sentVerifyCodeQery, paramCode);
      let sentVerifyCodeResultList = [];
      sentVerifyCodeResultList = sentVerifyCodeResult.DataRows;
      if (sentVerifyCodeResult.RetVal !== '1') {
        message.error(sentVerifyCodeResult.RetVal);
        return;
      }
      yield put({
        type: 'save',
        payload: {
          rand_code: sentVerifyCodeResultList[0].rand_code,
        }
      });
    },
  
  }, 

  subscriptions:{
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/costlabor/costVerify/costVerifyIndex/exportCostForHrDetail') {
          dispatch({ type: 'initQuery',query });
        }
        if (pathname === '/humanApp/costlabor/costVerify/costVerifyIndex/exportCostForHrFull') {
          dispatch({ type: 'initQuery',query });
        }
        if (pathname === '/humanApp/costlabor/costVerify/costVerifyIndex/exportCostForHrDetail') {
          dispatch({ type: 'queryVerifyCodeIndex',query });
        }
        if (pathname === '/humanApp/costlabor/costVerify/costVerifyIndex/exportCostForHrFull') {
          dispatch({ type: 'queryVerifyCodeIndex',query });
        }
      });
    }
  }
};
