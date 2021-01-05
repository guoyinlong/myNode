/**
 * 作者：张楠华
 * 日期：2017-12-5
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：活动类型维护逻辑层
 */
import * as timeManageService from '../../../services/project/timeManagement';
import { message } from 'antd';
import config from '../../../utils/config'
export default {
  namespace: 'activityTypeMaintenance',
  state: {
    list:[],
    spList:[],
    projList:[],
    ouList:[],
    projectList:[]
  },

  reducers: {
    /**
     * 作者：张楠华
     * 创建日期：2017-11-21
     * 功能：保存数据
     */
    save(state,action) {
      return { ...state, ...action.payload};
    },
  },

  effects: {
    *init({}, { put }) {
      yield put({
        type:'queryComActivity'
      });
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-11-13
     * 功能：查ou
     */
    *queryOu({},{call,put}){
      let postData = {};
      postData['arg_tenantid'] = config.COST_TENANT_ID;
      const OuData = yield call(timeManageService.queryOU,postData);
      if(OuData.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            ouList:OuData.DataRows
          }
        })
      }
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-11-13
     * 功能：根据OU和年份获取项目名称列表
     */
      *getProjList({ou},{call,put}){
      let postData = {};
      postData['arg_ou'] = ou;
      const projData = yield call(timeManageService.queryProj,postData);
      if(projData.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            projList:projData.DataRows,
            spList:[]
          }
        })
      }
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-11-13
     * 功能：根据OU和年份获取项目名称列表
     */
      *getProjListSp({ou},{call,put}){
      let postData = {};
      postData['arg_ou'] = ou;
      const projData = yield call(timeManageService.queryProj,postData);
      if(projData.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            projList:projData.DataRows,
          }
        })
      }
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-11-13
     * 功能：根据OU和年份获取项目名称列表
     */
      *getProjListAdd({ouSp},{call,put}){
      let postData = {};
      postData['arg_ou'] = ouSp;
      const projData = yield call(timeManageService.queryProj,postData);
      if(projData.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            projectList:projData.DataRows,
          }
        })
      }
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-11-13
     * 功能：查询通用活动类型
     */
    *queryComActivity({},{call,put}){
      let postData = {};
      postData['arg_activity_type'] = 2;
      const data = yield call(timeManageService.searchActivity,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            list:data.DataRows,
          }
        })
      }
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-11-13
     * 功能：查询特定活动类型
     */
    *querySpActivity({ou,projCode},{call,put}){
      let postData = {};
      postData['arg_activity_type'] = 1;
      postData['arg_ou'] = ou;
      postData['arg_proj_code'] = projCode;
      if(projCode !== '请选择项目名称'){
        const data = yield call(timeManageService.searchActivity,postData);
        if(data.RetCode === '1'){
          if(data.DataRows.length !== 0){
            yield put({
              type:'save',
              payload:{
                spList:data.DataRows,
              }
            })
          }
          else{
            message.info('没有查到数据');
            yield put({
              type:'save',
              payload:{
                spList:[],
              }
            })
          }
        }
      }
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-11-13
     * 功能：添加通用活动类型
     */
    *addComActivity({typeValue,describeValue},{call,put}){
      let postData = {};
      postData['arg_activity_name'] = typeValue;
      postData['arg_activity_type'] = 2;
      postData['arg_create_staff_id'] = localStorage.userid;
      postData['arg_remarks'] = describeValue;
      const data = yield call(timeManageService.addActivity,postData);
      if(data.RetCode === '1'){
        message.info('添加通用活动类型成功');
        yield put({
          type:'queryComActivity',
        })
      }
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-11-13
     * 功能：添加特定活动类型
     */
    *addSpActivity({ouSp,describeValueSp,projCodeSp,typeValueSp},{call,put}){
      let postData = {};
      postData['arg_activity_name'] = typeValueSp;
      postData['arg_activity_type'] = 1;
      postData['arg_create_staff_id'] = localStorage.userid;
      postData['arg_proj_code'] = projCodeSp;
      postData['arg_remarks'] = describeValueSp;
      if(projCodeSp !=='请选择项目名称'){
        const data = yield call(timeManageService.addActivity,postData);
        if(data.RetCode === '1'){
          message.info('添加特定活动类型成功');
          yield put({
            type:'querySpActivity',
            ou:ouSp,
            projCode:projCodeSp,
          });
        }
      }
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-11-13
     * 功能：删除通用活动类型
     */
    *delComActivity({recordCom},{call,put}){
      let postData = {};
      postData['arg_id'] = recordCom.id;
      const data = yield call(timeManageService.delActivity,postData);
      if(data.RetCode === '1'){
        if(data.hasOwnProperty('news')){
          message.info(data.news);
          return;
        }
        message.info('删除通用类型成功');
        yield put({
          type:'queryComActivity',
        })
      }
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-11-13
     * 功能：删除特定活动类型
     */
    *delSpActivity({ou,projCode,recordSp},{call,put}){
      let postData = {};
      postData['arg_id'] = recordSp.id;
      const data = yield call(timeManageService.delActivity,postData);
      if(data.RetCode === '1'){
        message.info('删除特定类型成功');
        yield put({
          type:'querySpActivity',
          ou,
          projCode,
        })
      }
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-11-13
     * 功能：修改普通活动类型
     */
    *modifyComActivity({recordComActivity,recordComDes,recordCom},{call,put}){
      let postData = {};
      postData['arg_id'] = recordCom.id;
      postData['arg_activity_name'] = recordComActivity;
      postData['arg_remarks'] = recordComDes;
      const data = yield call(timeManageService.modifyActivity,postData);
      if(data.RetCode === '1'){
        message.info('修改通用活动类型成功');
        yield put({
          type:'queryComActivity',
        })
      }
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-11-13
     * 功能：修改特定活动类型
     */
    *modifySpActivity({recordSpActivity,recordSpDes,recordSp},{call,put}){
      let postData = {};
      postData['arg_id'] = recordSp.id;
      postData['arg_activity_name'] = recordSpActivity;
      postData['arg_remarks'] = recordSpDes;
      const data = yield call(timeManageService.modifyActivity,postData);
      if(data.RetCode === '1'){
        message.info('修改特定活动类型成功');
        yield put({
          type:'querySpActivity',
          ou:recordSp.ou,
          projCode:recordSp.proj_code,
        })
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/projectApp/timesheetManage/activityTypeMaintenance') {
          dispatch({ type: 'init',query });
        }
      });
    },
  },
};
