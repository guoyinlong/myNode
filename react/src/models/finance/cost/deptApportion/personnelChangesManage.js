/**
 * 作者：张楠华
 * 日期：2017-10-16
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：实现财务全成本部门分摊逻辑以及与后台交互
 */
import * as costService from '../../../../services/finance/costService';
import config  from '../../../../utils/config';
import { rightControl } from '../../../../components/finance/rightControl';
import { message } from 'antd';
const dateFormat = 'YYYY-MM-DD';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
export default {
  namespace: 'personnelChangesManage',
  state: {
    list:[],
    moduleId:{},
    ouList:'',
    headerName:'',
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
     * 功能：保存同步数据
     */
    saveSynState(state,action) {
      return { ...state, ...action.payload};
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-10-16
     * 功能：保存权限数据
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
     * 功能：人员信息变动初始化
     */
    *initPersonChangeManage({}, { select,call, put }) {
      //需要获取权限，如果是统计的是COST_DEPT_PC_S，如果是查询的是COST_DEPT_PC_Q
      let routerUrl = config.COST_DEPT_PC_Q;
      let postData={};
      postData["argtenantid"] = config.COST_TENANT_ID;
      postData["arguserid"] = localStorage.userid;
      postData["argrouterurl"] = routerUrl;
      const moduleIdData= yield call(costService.costUserHasModule, postData);
      if(moduleIdData === null || moduleIdData.length === 0){
        message.info("权限请求data返回值为空或者{}");
      }else{
        if(moduleIdData.RetCode === "1") {
          yield put({
            type: 'saveModuleId',
            payload:{
              moduleId:moduleIdData.moduleid,
              ouList:'',
              list:[],
              headerName:''
            }
          });
          let moduleId = yield select(state=>state.personnelChangesManage.moduleId);
          //获取用户在一个应用，一个模块下能看到的ou
          let postData1 = {};
          postData1["argtenantid"] = config.COST_TENANT_ID;
          postData1["arguserid"] = localStorage.userid;
          postData1["argmoduleid"] = moduleId;
          postData1["argvgtype"] = config.COST_OU_VGTYPE;

          const data= yield call(costService.costUserGetOU, postData1);
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
          // let rightData1 =[];
          // //模拟的假数据
          // rightData1 = [{serviceName:'cos/persionalstatic'},{serviceName:'cosservice/personalsyn/personalsyn'}];
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
          let postData2 = {};
          postData2['argou'] = localStorage.ou;
          {
              !rightControl(config.personalSyn,rightData1.DataRows) ? postData2['argstatecode'] = '0': null
          }
          const recentData1= yield call(costService.SearchLastDateForPersonalStatic,postData2);
          yield put({
            type: 'recentData',
            payload:{
              recentMonth:moment(recentData1.max_year+'-'+recentData1.max_month,'YYYY-MM')
            }
          });
          let recentMonth1 = yield select(state=>state.personnelChangesManage.recentMonth);
          yield put({
            type: 'queryPersonChange',
            ou:localStorage.ou,
            personChangeDate:recentMonth1,
          });
        }
      }
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-10-16
     * 功能：统计/查询人员变动情况
     * @param ou 组织单元
     * @param personChangeDate 时间
     * @param select
     * @param call
     * @param put
     */
    *queryPersonChange({ou,personChangeDate},{select,call,put}){
      let moduleId = yield select(state=>state.personnelChangesManage.moduleId);
      let dateArray = personChangeDate.format(dateFormat).split("-");
      let year = dateArray[0];
      let month = dateArray[1];
      let tenantId = config.COST_TENANT_ID;
      let userId = localStorage.userid;
      let postData = {};
      postData["argyear"] = year;
      postData["argmonth"] = month;
      postData["argou"] = ou;
      postData["argtenantid"] = tenantId;
      postData["arguserid"] = userId;
      postData["argmoduleid"] = moduleId;
      const personChangeData= yield call(costService.persionalStatic, postData);
      if(personChangeData.RetCode === '1'){
        if(personChangeData.RetRowsCount === '1'){
          message.info('没有查到数据');
          yield put({
            type: 'save',
            payload:{
              list: [],
              headerName:''
            }
          })
        }else{
          if(personChangeData.DataRows.length === 0){
            message.info('没有查询到数据');
            yield put({
              type: 'save',
              payload:{
                list: [],
                headerName:''
              }
            })
          }else{
            yield put({
              type: 'save',
              payload:{
                list: personChangeData.DataRows,
                headerName:personChangeData.tableheader.split(','),
              }
            })
          }
        }
      }else{
        message.info(personChangeData.RetVal);
        yield put({
          type: 'save',
          payload:{
            list: [],
            headerName:''
          }
        })
      }

    },
    /**
     * 作者：张楠华
     * 创建日期：2017-10-16
     * 功能：同步人员变动数据
     * @param ou 组织单元
     * @param personChangeDate 时间
     * @param select
     * @param call
     * @param put
     */
    *synChange({ou,personChangeDate},{select,call,put}){
      let moduleId = yield select(state=>state.personnelChangesManage.moduleId);
      let dateArray = personChangeDate.format(dateFormat).split("-");
      let year = dateArray[0];
      let month = dateArray[1];
      let tenantId = config.COST_TENANT_ID;
      let userId = localStorage.userid;
      let postData = {};
      postData["argyear"] = year;
      postData["argmonth"] = month;
      postData["argou"] = ou;
      postData["argtenantid"] = tenantId;
      postData["arguserid"] = userId;
      postData["argmoduleid"] = moduleId;
      const personSynData= yield call(costService.personalSyn, postData);
      if(personSynData.length){
        message.info('data没有数据');
      }else{
        if(personSynData.RetCode === '1'){
          message.success('同步成功！');
          yield put({
            type: 'queryPersonChange',
            ou,
            personChangeDate
          });
        }
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/financeApp/cost_dept_apportion/personnel_changes_mgt') {
          dispatch({ type: 'initPersonChangeManage',query });
        }if (pathname === '/financeApp/financeCost/deptApportion/personnelChangesQuery') {
          dispatch({ type: 'initPersonChangeManage',query });
        }
      });
    },
  },
};
