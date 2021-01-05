/**
 * 作者：张楠华
 * 日期：2017-10-19
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
  namespace: 'projectApportionManage',
  state: {
    ouList:[],
    list:[],
    moduleId:{},
    stateParamList:[],
    headerName:[],
    tableId:[],
    stateFlag:[],
    rightData:[],
    recentMonth:[]
  },
  /**
   * 作者：张楠华
   * 创建日期：2017-10-19
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
    saveState(state,action) {
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
     * 创建日期：2017-10-19
     * 功能：项目分摊初始化
     */
    *initProjectApportionManage({},{select,call,put}){
      let tenantId = config.COST_TENANT_ID;
      let userId = localStorage.userid;
      let routerUrl = config.COST_PROJ_PJSHARING_M;
      let postData = {};
      postData['argtenantid'] = tenantId;
      postData['arguserid'] = userId;
      postData['argrouterurl'] = routerUrl;
      const moduleIdData = yield call(costService.costUserHasModule,postData);
      if(moduleIdData === null || moduleIdData === '{}'){
        message.info('返回值为空');
      }else{
        if(moduleIdData.RetCode === '1'){
          yield put({
            type:'saveModuleId',
            payload:{
              moduleId : moduleIdData.moduleid,
              ouList:[],
              list:[],
              headerName:[],
              stateFlag:[],
            }
          });
          let moduleId = yield select(state=>state.projectApportionManage.moduleId);
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
              if(data.DataRows.length === 0){
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
          postData2["argstatemode"] = 0;
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
          // rightData1 = [{serviceName:'cos/projcostnewquery'},{serviceName:'cos/projcostsync'}
          //   ,{serviceName:'cos/projcostpublish'},{serviceName:'cos/projcostunpublish'}];
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
            !rightControl(config.generateProjectData,rightData1.DataRows)
            && !rightControl(config.publicProjectData,rightData1.DataRows)
            && !rightControl(config.cancelPublicProjectData,rightData1.DataRows) ?
              postData3['argstatecode'] = '0': null
          }
          const recentData1= yield call(costService.SearchLastDateForProjectCost,postData3);
          yield put({
            type: 'recentData',
            payload:{
              recentMonth:moment(recentData1.max_year+'-'+recentData1.max_month,'YYYY-MM')
            }
          });
          let recentMonth1 = yield select(state=>state.projectApportionManage.recentMonth);
          yield put({
            type: 'queryProjectApportionManage',
            ou:localStorage.ou,
            projectApportionMonth:recentMonth1,
            statisticType:'1'
          });
        }
      }
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-10-19
     * 功能：项目分摊管理@param
     * @param ou 组织单元
     * @param projectApportionMonth 月份
     * @param statisticType 统计类型
     * @param call
     * @param put
     */
    *queryProjectApportionManage({ou,projectApportionMonth,statisticType},{call,put}){
      let projectApportionYear1 = projectApportionMonth.format(dateFormat).split('-')[0];
      let projectApportionMonth1 = projectApportionMonth.format(dateFormat).split('-')[1];
      let userId = localStorage.userid;
      let postData = {};
      postData["argyear"] = projectApportionYear1;
      postData["argmonth"] = projectApportionMonth1;
      postData["argou"] = ou;
      postData["arguserid"] = userId;
      postData["argtotaltype"] = statisticType;
      const projectCostData = yield call(costService.projectCostQuery,postData);
        if(projectCostData.RetCode === '1'){
          yield put({
            type:'save',
            payload:{
              list:projectCostData.DataRows,
              headerName:projectCostData.columnList.split(','),
              tableId:projectCostData.DataRows[0].table_id,
              stateFlag:projectCostData.DataRows[0].state_code,
            }
          })
        }else{
          message.info(projectCostData.RetVal);
          if(projectCostData.state_code === '3'){
            yield put({
              type:'save',
              payload:{
                list:[],
                headerName:[],
                stateFlag:projectCostData.state_code,
              }
            })
          }else{
            yield put({
              type:'save',
              payload:{
                list:[],
                headerName:[],
                stateFlag:[]
              }
            })
          }
        }

    },
    /**
     * 作者：张楠华
     * 创建日期：2017-10-19
     * 功能：生成项目分摊数据
     * @param ou 组织单元
     * @param projectApportionMonth 月份
     * @param statisticType 统计类型
     * @param call
     * @param put
     */
    *generateData({ou,projectApportionMonth,statisticType},{call,put}){
      let projectApportionYearArray = projectApportionMonth.format(dateFormat).split('-')[0];
      let projectApportionMonthArray = projectApportionMonth.format(dateFormat).split('-')[1];
      let userId = localStorage.userid;
      let postData = {};
      postData["argyear"] = projectApportionYearArray;
      postData["argmonth"] = projectApportionMonthArray;
      postData["argou"] = ou;
      postData["arguserid"] = userId;
      const projectApportionData= yield call(costService.generateProjectData, postData);
      if(projectApportionData === null || projectApportionData === '{}'){
        message.info('data没有数据');
      }else{
        if(projectApportionData.RetCode === '1'){
          message.success('生成成功！');
          yield put({
            type: 'queryProjectApportionManage',
            ou,
            projectApportionMonth,
            statisticType
          })
        }
      }
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-10-19
     * 功能：发布项目分摊数据
     * @param ou 组织单元
     * @param projectApportionMonth 月份
     * @param statisticType 统计类型
     * @param call
     * @param put
     * @param select
     */
    *publicData({ou,projectApportionMonth,statisticType},{select,call,put}){
      let tableId = yield select(state=>state.projectApportionManage.tableId);
      if(tableId.length === 0){
        message.info('tableId不存在');
        return null;
      }
      let userId = localStorage.userid;
      let postData = {};
      postData["arguserid"] = userId;
      postData["argbatchid"] = tableId;
      postData['argou'] = ou;
      const publicDeptData= yield call(costService.publicProjectData, postData);
      if(publicDeptData === null || publicDeptData === '{}'){
        message.info('data没有数据');
      }else{
        if(publicDeptData.RetCode === '1'){
          message.success('发布成功！');
          yield put({
            type: 'queryProjectApportionManage',
            ou,
            projectApportionMonth,
            statisticType
          })
        }
      }
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-10-19
     * 功能：撤销发布项目分摊数据
     * @param ou 组织单元
     * @param call
     * @param put
     * @param select
     */
    *cancelPublicData({ou},{select,call,put}){
      let tableId = yield select(state=>state.projectApportionManage.tableId);
      if(tableId.length === 0){
        message.info('tableId不存在');
        return null;
      }
      let userId = localStorage.userid;
      let postData = {};
      postData["arguserid"] = userId;
      postData["argbatchid"] = tableId;
      postData["argou"] = ou;
      const cancelPublicProjectData= yield call(costService.cancelPublicProjectData, postData);
      if(cancelPublicProjectData === null || cancelPublicProjectData === '{}'){
        message.info('data没有数据');
      }else{
        if(cancelPublicProjectData.RetCode === '1'){
          message.success('撤销发布成功！');
          yield put({
            type: 'saveState',
            payload:{
              list: [],
              headerName:[],
              stateFlag:"3",
            }
          });
        }
      }
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-10-16
     * 功能：编辑部门分摊数据
     */
      *editProjectApportion({value,record,ou,projectApportionMonth,statisticType},{select,call,put}){
      let tableId = yield select(state=>state.projectApportionManage.tableId);
      if(tableId.length === 0){
        message.info('tableId不存在');
        return null;
      }
      let transData = [];
      for(let key in value){
        transData.push({"update": {"fee": value[key]},
          "condition":{"ou":ou,"dept_name":record.dept_name,"proj_name":record.proj_name,
            "proj_code":record.proj_code,"fee_name":key,"table_id":tableId}});
      }
      let postData={};
      postData['transjsonarray'] =JSON.stringify(transData);
      const editData= yield call(costService.editProjectCost, postData);
      if(editData.RetCode === '1'){
        message.success('编辑成功！');
        yield put({
          type: 'queryProjectApportionManage',
          ou,
          projectApportionMonth,
          statisticType
        })
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/financeApp/cost_proj_apportion/proj_apportion_mgt') {
          dispatch({ type: 'initProjectApportionManage',query });
        }
        if (pathname === '/financeApp/financeCost/projectApportion/projectApportionQuery') {
          dispatch({ type: 'initProjectApportionManage',query });
        }
      });
    },
  },
};
