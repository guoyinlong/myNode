/**
 * 作者：张楠华
 * 日期：2017-10-16
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：实现财务全成本部门分摊逻辑以及与后台交互
 */
import * as costService from '../../../../services/finance/costService';
import config  from '../../../../utils/config';
import { rightControl } from '../../../../components/finance/rightControl'
import { message } from 'antd';
const dateFormat = 'YYYY-MM-DD';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
export default {
  namespace: 'deptApportionManage',
  state: {
    list:[],
    moduleId:{},
    ouList:[],
    stateParamList:[],
    headerName:[],
    stateFlag:[],
    rightData:[],
    recentMonth:[]
  },

  reducers: {
    /**
     * 作者：张楠华
     * 创建日期：2017-10-16
     * 功能：保存list数据
     */
    save(state,action) {
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
    /**
     * 作者：张楠华
     * 创建日期：2017-10-16
     * 功能：保存ou数据
     */
    saveOu(state,{ ouList }) {
      return { ...state, ouList};
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-10-16
     * 功能：保存统计类型数据
     */
    saveStateParam(state,action) {
      return { ...state, ...action.payload};
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-10-16
     * 功能：保存状态数据
     */
    saveState(state,action) {
      return { ...state, ...action.payload};
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-10-26
     * 功能：保存状态数据
     */
    saveRightData(state,action) {
      return { ...state, ...action.payload};
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-10-16
     * 功能：保存最后一个月有记录数据
     */
    recentData(state,action) {
      return { ...state, ...action.payload};
    },
  },

  effects: {
    /**
     * 作者：张楠华
     * 创建日期：2017-10-16
     * 功能：部门分摊管理初始化
     */
    *initDeptApportionManage({}, { select,call, put }) {
      //需要获取权限，如果是统计的是COST_DEPT_PC_S，如果是查询的是COST_DEPT_PC_Q
      let routerUrl = config.COST_DEPT_DEPT_Q;
      let postData={};
      postData["argtenantid"] = config.COST_TENANT_ID;
      postData["arguserid"] = localStorage.userid;
      postData["argrouterurl"] = routerUrl;
      const moduleIdData= yield call(costService.costUserHasModule, postData);
      if(moduleIdData === null || moduleIdData === ''){
        message.info("权限请求data返回值为空或者{}");
      }else{
        if(moduleIdData.RetCode === "1") {
          yield put({
            type: 'saveModuleId',
            payload:{
              moduleId:moduleIdData.moduleid,
              ouList:[],
              list:[],
              headerName:[],
              stateFlag:[],
            }
          });
          let moduleId = yield select(state=>state.deptApportionManage.moduleId);
          //获取用户在一个应用，一个模块下能看到的ou
          let postData1 = {};
          postData1["argtenantid"] = config.COST_TENANT_ID;
          postData1["arguserid"] = localStorage.userid;
          postData1['argmoduleid'] = moduleId;
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
          let postData2={};
          postData2["argstatetype"] = 2;
          postData2["argstatemode"] = 0;
          const stateParamData= yield call(costService.stateParamQuery, postData2);
          if(stateParamData === null || stateParamData === '{}'){
            message.info('返回值为空或者{}');
          }else{
            if(stateParamData.RetCode === '1'){
              if(stateParamData.DataRows.length === 0){
                message.info('获取统计类型为空,请联系管理员配权');
              }else{
                yield put({
                  type: 'saveStateParam',
                  payload:{
                    stateParamList:stateParamData.DataRows,
                  }
                });
              }
            }
          }
          let postData4 = {};
          postData4['arguserid'] = localStorage.userid;
          postData4['argmoduleid'] =moduleId;
          postData4['argtenantid'] = config.COST_TENANT_ID;
          const rightData1 = yield call(costService.userGetModule,postData4);
          //模拟的假数据
          yield put({
            type: 'saveRightData',
            payload:{
              rightData:rightData1.DataRows
            }
          });
          let postData3 = {};
          postData3['argou'] = localStorage.ou;
          {
            !rightControl(config.generateDeptData,rightData1.DataRows)
            && !rightControl(config.publicDeptData,rightData1.DataRows)
            && !rightControl(config.cancelPublicDeptData,rightData1.DataRows) ?
              postData3['argstatecode'] = '0': null
          }
          const recentData1= yield call(costService.SearchLastDateForDeptCost,postData3);
          yield put({
            type: 'recentData',
            payload:{
              recentMonth:moment(recentData1.max_year+'-'+recentData1.max_month,'YYYY-MM')
            }
          });
          let recentMonth1 = yield select(state=>state.deptApportionManage.recentMonth);
          yield put({
            type: 'deptApportionQueryManage',
            ou:localStorage.ou,
            deptShareMonth:recentMonth1,
            statisticType:'1'
          });
        }
      }
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-10-16
     * 功能：统计部门分摊情况
     * @param ou 组织单元
     * @param deptShareMonth 月份
     * @param statisticType 统计类型
     * @param select
     * @param call
     * @param put
     */
      *deptApportionQueryManage({ou,deptShareMonth,statisticType},{select,call,put}){
      let moduleId = yield select(state=>state.deptApportionManage.moduleId);
      let deptShareYearArray = deptShareMonth.format(dateFormat).split('-')[0];
      let deptShareMonthArray = deptShareMonth.format(dateFormat).split('-')[1];
      let tenantId = config.COST_TENANT_ID;
      let userId = localStorage.userid;
      let postData = {};
      postData["argyear"] = deptShareYearArray;
      postData["argmonth"] = deptShareMonthArray;
      postData["argou"] = ou;
      postData["argtenantid"] = tenantId;
      postData["arguserid"] = userId;
      postData["argmoduleid"] = moduleId;
      let deptCostState;
      if(statisticType === "1"){
        deptCostState= yield call(costService.deptCostMonthStaticNewPublish, postData);
      }else{
        deptCostState= yield call(costService.deptCostStaticNewPublish, postData);
      }
      if(deptCostState.RetCode === '1'){
        yield put({
          type: 'save',
          payload:{
            list: deptCostState.DataRows,
            tempData:deptCostState,
            headerName:deptCostState.headername.split('-'),
            stateFlag:deptCostState.state_code,
          }
        })
      }else{
        message.info(deptCostState.RetVal);
        if(deptCostState.state_code === '3'){
          yield put({
            type: 'save',
            payload:{
              list: [],
              headerName:[],
              stateFlag:deptCostState.state_code
            }
          })
        }else{
          yield put({
            type: 'save',
            payload:{
              list: [],
              headerName:[],
              stateFlag:[]
            }
          })
        }
      }

    },
    /**
     * 作者：张楠华
     * 创建日期：2017-10-16
     * 功能：生成部门分摊数据
     * @param ou 组织单元
     * @param deptShareMonth 月份
     * @param statisticType 统计类型
     * @param select
     * @param call
     * @param put
     */
    *generateData({ou,deptShareMonth,statisticType},{select,call,put}){
      let moduleId = yield select(state=>state.deptApportionManage.moduleId);
      let deptShareYearArray = deptShareMonth.format(dateFormat).split('-')[0];
      let deptShareMonthArray = deptShareMonth.format(dateFormat).split('-')[1];
      let tenantId = config.COST_TENANT_ID;
      let userId = localStorage.userid;
      let postData = {};
      postData["argyear"] = deptShareYearArray;
      postData["argmonth"] = deptShareMonthArray;
      postData["argou"] = ou;
      postData["argtenantid"] = tenantId;
      postData["arguserid"] = userId;
      postData["argmoduleid"] = moduleId;
      const deptApportionData= yield call(costService.generateDeptData, postData);
      if(deptApportionData === null || deptApportionData === '{}'){
        message.info('data没有数据');
      }else{
        if(deptApportionData.RetCode === '1'){
          message.success('生成成功！');
          yield put({
            type: 'deptApportionQueryManage',
            ou,
            deptShareMonth,
            statisticType
          })
        }
      }
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-10-16
     * 功能：发布部门分摊数据
     * @param ou 组织单元
     * @param deptShareMonth 月份
     * @param statisticType 统计类型
     * @param select
     * @param call
     * @param put
     */
    *publicData({ou,deptShareMonth,statisticType},{select,call,put}){
      let allList = yield select(state=>state.deptApportionManage.tempData);
      if(allList === null || allList === '' || allList.length === 0){
        message.info('请先查询');
        return null;
      }
      if(allList.c_dep_tableid === 'undefined' || allList.c_dep_tableid === null || allList.c_dep_tableid === ''){
        message.info('tableid不存在');
        return null;
      }
      let tenantId = allList.c_dep_tableid;
      let userId = localStorage.userid;
      let postData = {};
      postData["arguserid"] = userId;
      postData["argtableid"] = tenantId;
      const publicDeptData= yield call(costService.publicDeptData, postData);
      if(publicDeptData === null || publicDeptData === '{}'){
        message.info('data没有数据');
      }else{
        if(publicDeptData.RetCode === '1'){
          message.success('发布成功！');
          yield put({
            type: 'deptApportionQueryManage',
            ou,
            deptShareMonth,
            statisticType
          })
        }
      }
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-10-16
     * 功能：撤销发布部门分摊数据
     */
    *cancelPublicData({},{select,call,put}){
      let allList = yield select(state=>state.deptApportionManage.tempData);
      if(allList === null || allList === '' || allList.length === 0){
        message.info('请先查询');
        return null;
      }
      if(allList.c_dep_tableid === 'undefined' || allList.c_dep_tableid === null || allList.c_dep_tableid === ''){
        message.info('tableid不存在');
        return null;
      }
      let tableId = allList.c_dep_tableid;
      let userId = localStorage.userid;
      let postData = {};
      postData["arguserid"] = userId;
      postData["argtableid"] = tableId;
      const cancelPublicDeptData= yield call(costService.cancelPublicDeptData, postData);
      if(cancelPublicDeptData === null || cancelPublicDeptData === '{}'){
        message.info('data没有数据');
      }else{
        if(cancelPublicDeptData.RetCode === '1'){
          message.success('撤销发布成功！');
          yield put({
            type: 'saveState',
            payload:{
              list: [],
              headerName:[],
              stateFlag:"3"
            }
          })
        }
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/financeApp/cost_dept_apportion/dept_apportion_mgt') {
          dispatch({ type: 'initDeptApportionManage',query });
        }if (pathname === '/financeApp/financeCost/deptApportion/deptApportionQuery') {
          dispatch({ type: 'initDeptApportionManage',query });
        }
      });
    },
  },
};
