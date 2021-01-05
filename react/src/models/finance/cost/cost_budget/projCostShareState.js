/**
 * 作者：张楠华
 * 日期：2017-11-3
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：实现财务全成本项目分摊人均标准维护逻辑以及与后台交互
 */
import * as costService from '../../../../services/finance/costService';
import config  from '../../../../utils/config';
import { rightControl } from '../../../../components/finance/rightControl';
import { message } from 'antd';
export default {
  namespace: 'projCostShareState',
  state: {
    list:[],
    ouList:[],
    stateName:[],
    rightData:[]
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
    saveRight(state,action) {
      return { ...state, ...action.payload};
    },
  },

  effects: {
    *init({}, { call, put }) {
      let userId = localStorage.userid;
      let tenantId = config.COST_TENANT_ID;
      let routerUrl = config.COST_PROJ_SHARING_S_S;
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
          //模拟的假数据
          // let rightData1 = [{serviceName:'/microservice/transupdate/cos/indbudgetparaupdate'},
          //   {serviceName:'/microservice/transinsert/cos/indbudgetparainsert'}];
          let postData4 = {};
          postData4['arguserid'] = localStorage.userid;
          postData4['argmoduleid'] =moduleIdData.moduleid;
          postData4['argtenantid'] = config.COST_TENANT_ID;
          const rightData1 = yield call(costService.userGetModule,postData4);
          yield put({
            type: 'saveRight',
            payload:{
              rightData:rightData1.DataRows,
            }
          });
          yield put({
            type: 'queryProjectCostShareState',
            ou:localStorage.ou,
            shareStateYear:new Date().getFullYear().toString()
          });
        }
      }
    },
    *queryProjectCostShareState({shareStateYear,ou}, { select,call, put }) {
      let postData = {};
      postData["argyear"] = shareStateYear;
      postData["argou"] = ou;
      //判断权限，如果只有查询：postData["argstate_code"] = '0';如果有其他权限：postData["argstate_code"] = '2';postData["argstate_code_two"] ='0' ;
      let rightData1 = yield select(state=>state.projCostShareState.rightData);
      if(!rightControl(config.publicShareState,rightData1) && !rightControl(config.editShareState,rightData1)){
        postData['argstate_code'] = '0';
      }
      const projectCostShareStatePubData= yield call(costService.projCostShareStatePubQuery, postData);
      if(projectCostShareStatePubData.RetCode === '1'){
        if(projectCostShareStatePubData.DataRows.length === 0){
          yield put({
            type: 'save',
            payload:{
              list: [],
              stateName:"待生成",
            }
          })
        }else{
          let stateName1;
          for(let i=0;i<projectCostShareStatePubData.DataRows.length;i++){
            if(projectCostShareStatePubData.DataRows[i].state_name === '待审核'){
              stateName1 = '待审核';
              break;
            }else{
              stateName1 = '已发布';
            }
          }
          yield put({
            type: 'save',
            payload:{
              list: projectCostShareStatePubData.DataRows,
              stateName:stateName1,
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
    },
    *publicProjectCostShareState({shareStateYear,ou}, { call, put }){
      let postData={};
      let staffId = localStorage.staffid;
      postData["transjsonarray"] = '[{\"update\": {\"state_code\":\"0\",\"staff_id\":\"'+staffId+'\"},' +
        '\"condition\":{\"state_code\":\"2\",\"total_year\":\"'+shareStateYear+'\",\"ou\":\"'+ou+'\"}}]';
      const data = yield call(costService.projCostShareStatePubPublic, postData);
      if(data.RetCode === '1'){
        message.success('发布成功');
        yield put({
          type: 'queryProjectCostShareState',
          ou:ou,
          shareStateYear:shareStateYear
        });
      }
    },
    *generateProjectCostShareState({shareStateYear,ou},{call,put}){
      let postData={};
      postData['arg_ou'] = ou;
      postData['arg_userid'] = localStorage.userid;
      postData['arg_year'] = shareStateYear;
      const data = yield call(costService.projCostShareStatePubGenerate, postData);
      if(data.RetCode === '1'){
        message.success('生成成功');
        yield put({
          type: 'queryProjectCostShareState',
          ou:ou,
          shareStateYear:shareStateYear
        });
      }
    },
    *UnPublicProjectCostShareState({shareStateYear,ou}, { call, put }){
      let postData={};
      postData["transjsonarray"] = '[{\"update\": {\"state_code\":\"1\"},' +
        '\"condition\":{\"state_code\":\"0\",\"total_year\":\"'+shareStateYear+'\",\"ou\":\"'+ou+'\"}}]';
      const data = yield call(costService.projCostShareStatePubPublic, postData);
      if(data.RetCode === '1'){
        message.success('撤销发布成功');
        yield put({
          type: 'queryProjectCostShareState',
          ou:ou,
          shareStateYear:shareStateYear
        });
      }
    },
    *yearPsModify({ value,record,ou,shareStateYear }, { call, put }){
      let postData={};
      let staffId = localStorage.staffid;
      postData["transjsonarray"] = '[{\"update\": {\"budget_person_spec\":\"'+value.yearPs+'\",\"staff_id\":\"'+ staffId +'\"},' +
        '\"condition\":{\"id\":\"' + record.id + '\"}}]';
      const data = yield call(costService.projCostShareStatePubPublic, postData);
      if(data.RetCode === '1'){
        if( data.RetCode === '1'){
          message.success('修改成功');
          yield put({
            type: 'queryProjectCostShareState',
            ou:ou,
            shareStateYear:shareStateYear
          });
        }
      }
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/financeApp/cost_proj_fullcost_mgt/proj_apportion_state_mgt') {
          dispatch({ type: 'init',query });
        }
      });
    },
  },
};
