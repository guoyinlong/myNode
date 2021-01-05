/**
 * 作者：张楠华
 * 日期：2017-10-20
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：实现财务全成本项目分摊逻辑以及与后台交互
 */
import * as costService from '../../../../services/finance/costService';
import config  from '../../../../utils/config';
import { rightControl } from '../../../../components/finance/rightControl'
import { message } from 'antd';
const dateFormat='YYYY-MM-DD';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
export default {
  namespace: 'timeSheetManage',
  state: {
    ouList:[],
    list:[],
    moduleId:{},
    stateParamList:[],
    deptList:[],
    rightData:[],
    recentMonth:[]
  },
  /**
   * 作者：张楠华
   * 创建日期：2017-10-20
   * 功能：保存数据
   */
  reducers: {
    saveOu(state,{ ouList }) {
      return { ...state, ouList};
    },
    save(state,action) {
      return { ...state, ...action.payload};
    },
    saveModuleId(state,action) {
      return { ...state, ...action.payload};
    },
    saveStateParam(state,action) {
      return { ...state, ...action.payload};
    },
    saveRightData(state,action) {
      return { ...state, ...action.payload};
    },
    recentData(state,action) {
      return { ...state, ...action.payload};
    },
  },

  effects: {
    /**
     * 作者：张楠华
     * 创建日期：2017-10-20
     * 功能：工时管理初始化
     */
    *initTimeSheetManage({},{select,call,put}){
      let tenantId = config.COST_TENANT_ID;
      let userId = localStorage.userid;
      let routerUrl = config.COST_PROJ_TIMESHEET_M;
      let postData = {};
      postData['argtenantid'] = tenantId;
      postData['arguserid'] = userId;
      postData['argrouterurl'] = routerUrl;
      const moduleIdData = yield call(costService.costUserHasModule,postData);
      if(moduleIdData === null || moduleIdData === '{}'){
        message.info('返回值为空,请联系管理员');
      }else{
        if(moduleIdData.RetCode === '1'){
          yield put({
            type:'saveModuleId',
            payload:{
              moduleId : moduleIdData.moduleid,
              ouList:[],
              list:[],
              deptList:[]
            }
          });
          let moduleId = yield select(state=>state.timeSheetManage.moduleId);
          //获取用户在一个应用，一个模块下能看到的ou
          let postData1 = {};
          postData1["argtenantid"] = config.COST_TENANT_ID;
          postData1["arguserid"] = localStorage.userid;
          postData1["argmoduleid"] = moduleId;
          postData1["argvgtype"] = config.COST_OU_VGTYPE;
          const data= yield call(costService.costUserGetOU, postData1);
          if(data === null || data === '{}'){
            message.info('返回值为空或者{}');
          }else{
            if(data.RetCode === '1'){
              if( data.DataRows.length === 0){
                message.info('用户不能看到ou部门，联系管理员配权');
              }else{
                yield put({
                  type: 'saveOu',
                  ouList:data.DataRows
                });
              }
            }
          }
          //获取统计类型：月统计，年统计，至今
          let postData2={};
          postData2["argstatetype"] = 2;
          postData2["argstatemode"] = 5;
          const stateParamData= yield call(costService.stateParamQuery, postData2);
          if(stateParamData === null || stateParamData === '{}'){
            message.info('返回值为空或者{}');
          }else{
            if(stateParamData.RetCode === '1'){
              if(stateParamData.DataRows.length === 0){
                message.info('用户不能看到统计类型，联系管理员配权！');
              }else{
                yield put({
                  type: 'saveStateParam',
                  payload:{
                    stateParamList:stateParamData.DataRows
                  }
                });
              }
            }
          }
          // let rightData1 =[];
          // //模拟的假数据
          // rightData1 = [{serviceName:'cos/deptwtquery'},{serviceName:'cosservice/cosdeptworktime/sync'}];
          let postData4 = {};
          postData4['arguserid'] = localStorage.userid;
          postData4['argmoduleid'] =moduleId;
          postData4['argtenantid'] = config.COST_TENANT_ID;
          const rightData1 = yield call(costService.userGetModule,postData4);
          yield put({
            type: 'saveRightData',
            payload:{
              rightData:rightData1.DataRows,
            }
          });
          let postData3 = {};
          postData3['argou'] = localStorage.ou;
          {
            !rightControl(config.sync,rightData1.DataRows) ? postData2['argstatecode'] = '0': null
          }
          const recentData1= yield call(costService.SearchLastDateForWorkTime,postData3);
          yield put({
            type: 'recentData',
            payload:{
              recentMonth:moment(recentData1.max_year+'-'+recentData1.max_month,'YYYY-MM')
            }
          });
          let recentMonth1 = yield select(state=>state.timeSheetManage.recentMonth);
          yield put({
            type: 'timeSheetDataQuery',
            ou:localStorage.ou,
            timeSheetMonth:recentMonth1,
            statisticType:'1'
          });
        }
      }
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-10-20
     * 功能：查询工时数据
     * @param ou 组织单元
     * @param timeSheetMonth 月份
     * @param statisticType 统计类型
     * @param call
     * @param put
     */
    *timeSheetDataQuery({ou,timeSheetMonth,statisticType},{call,put}){
      let timeSheetYear1 = timeSheetMonth.format(dateFormat).split('-')[0];
      let timeSheetMonth1 = timeSheetMonth.format(dateFormat).split('-')[1];
      let userId = localStorage.userid;
      let ouId = 1;
      if (ou === config.OU_NAME_CN) {
        ouId = 1;
      } else if (ou === config.OU_HQ_NAME_CN) {
        ouId = 2;
      } else if (ou === config.OU_JINAN_NAME_CN) {
        ouId = 3;
      } else if (ou === config.OU_HAERBIN_NAME_CN) {
        ouId = 4;
      }else if (ou === '西安软件研究院') {
        ouId = 6;
      }else if (ou === '广州软件研究院') {
        ouId = 5;
      }
      let postData = {};
      postData["argyear"] = timeSheetYear1;
      postData["argmonth"] = timeSheetMonth1;
      postData["argouid"] = ouId;
      postData["arguserid"] = userId;
      postData["argtotaltype"] = statisticType;
      const timeSheetData = yield call(costService.deptWtQuery,postData);
      if(timeSheetData.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            list:timeSheetData.DataRows,
            deptList:timeSheetData.columnList.split(','),
          }
        })
      }else{
        message.info(timeSheetData.RetVal);
        yield put({
          type:'save',
          payload:{
            list:[],
            deptList:[],
          }
        })
      }

    },
    /**
     * 作者：张楠华
     * 创建日期：2017-10-20
     * 功能：同步工时数据
     * @param ou 组织单元
     * @param timeSheetMonth 月份
     * @param statisticType 统计类型
     * @param call
     * @param put
     */
    *synTimeSheet({ou,timeSheetMonth,statisticType},{call,put}){
      let timeSheetYear1 = timeSheetMonth.format(dateFormat).split('-')[0];
      let timeSheetMonth1 = timeSheetMonth.format(dateFormat).split('-')[1];
      let userId = localStorage.userid;
      let ouId = 1;
      if (ou === config.OU_NAME_CN) {
        ouId = 1;
      } else if (ou === config.OU_HQ_NAME_CN) {
        ouId = 2;
      } else if (ou === config.OU_JINAN_NAME_CN) {
        ouId = 3;
      } else if (ou === config.OU_HAERBIN_NAME_CN) {
        ouId = 4;
      }else if (ou === '西安软件研究院') {
        ouId = 6;
      }else if (ou === '广州软件研究院') {
        ouId = 5;
      }
      let postData = {};
      postData["year"] = timeSheetYear1;
      postData["month"] = timeSheetMonth1;
      postData["ouid"] = ouId;
      postData["userid"] = userId;
      const synTimeSheetData = yield call(costService.sync,postData);
      if(synTimeSheetData === null){
        message.info('没有查到数据')
      }else{
        if(synTimeSheetData.RetCode === '1'){
          message.info(synTimeSheetData.RetVal);
          yield put({
            type:'timeSheetDataQuery',
            ou,
            timeSheetMonth,
            statisticType
          })
        }else{
          message.error(synTimeSheetData.RetVal);
        }
      }
    }
  },

subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/financeApp/cost_proj_apportion/timesheet_mgt') {
          dispatch({ type: 'initTimeSheetManage',query });
        }
        if (pathname === '/financeApp/financeCost/projectApportion/timeSheetQuery') {
          dispatch({ type: 'initTimeSheetManage',query });
        }
      });
    },
  },
};
