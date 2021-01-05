/**
 * 作者：张楠华
 * 日期：2017-11-3
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：实现财务全成本项目分摊人均标准执行情况逻辑以及与后台交互
 */
import * as costService from '../../../../services/finance/costService';
import config  from '../../../../utils/config';
import { rightControl } from '../../../../components/finance/rightControl';
import { message } from 'antd';
export default {
  namespace: 'projCostShareStatePub',
  state: {
    list:[],
    ouList:[],
  },

  reducers: {
    /**
     * 作者：张楠华
     * 创建日期：2017-10-16
     * 功能：保存list数据
     */
    saveOu(state,action) {
      return { ...state, ...action.payload};
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-10-16
     * 功能：保存ModuleId数据
     */
    saveModuleId(state,action) {
      return { ...state, ...action.payload};
    },
    save(state,action) {
      return { ...state, ...action.payload};
    },
  },

  effects: {
    *init({}, { call, put }) {
      let userId = localStorage.userid;
      let tenantId = config.COST_TENANT_ID;
      let routerUrl = config.COST_PROJ_SHARING_S_Q;
      let postData = {};
      postData["argtenantid"] = tenantId;
      postData["arguserid"] = userId;
      postData["argrouterurl"] = routerUrl;
      const moduleIdData = yield call(costService.costUserHasModule,postData);
      if(moduleIdData.RetCode === '1'){
        yield put({
          type: 'saveModuleId',
          payload:{
            moduleId:moduleIdData.moduleid,
            ouList:[],
            list:[],
          }
        });
        let postData1 = {};
        postData1["argtenantid"] = config.COST_TENANT_ID;
        postData1["arguserid"] = localStorage.userid;
        postData1["argmoduleid"] = moduleIdData.moduleid;
        postData1["argvgtype"] = config.COST_OU_VGTYPE;
        const data = yield call(costService.costUserGetOU, postData1);
        if(data.RetCode === '1'){
          if( data.DataRows.length === 0){
            message.info('用户不能看到ou部门，联系管理员配权');
          }else{
            yield put({
              type: 'saveOu',
              payload:{
                ouList:data.DataRows
              }
            });
          }
        }
      }
    },
    *queryProjectCostShareStatePub({shareStateYear,ou}, { call, put }) {
      let postData = {};
      postData["argyear"] = shareStateYear;
      postData["argou"] = ou;
      postData["argstate_code"] = '0';
      const projectCostShareStatePubData= yield call(costService.projCostShareStatePubQuery, postData);
      if(projectCostShareStatePubData.RetCode === '1'){
        if(projectCostShareStatePubData.DataRows.length === 0){
          message.info('没有查询到数据');
          yield put({
            type: 'save',
            payload:{
              list: [],
            }
          })
        }else{
          yield put({
            type: 'save',
            payload:{
              list: projectCostShareStatePubData.DataRows,
            }
          })
        }
      }else{
        message.info(projectCostShareStatePubData.RetVal);
        yield put({
          type: 'save',
          payload:{
            list: [],
          }
        })
      }
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/financeApp/financeCost/projCostManage/projCostShareStatePub') {
          dispatch({ type: 'init',query });
        }
      });
    },
  },
};
