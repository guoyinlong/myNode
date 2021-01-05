/**
 *  作者: 张楠华
 *  创建日期: 2017-11-28
 *  邮箱：zhangnh6@chinaunicom.cn
 *  文件说明：人员查询。
 */
import * as timeManageService from '../../../services/project/timeManagement';
import Cookies from 'js-cookie'
const dateFormat='YYYY-MM-DD';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import { message } from 'antd';
export default {
  namespace: 'humanQuery',
  state: {
    list:[],
    projList:[],
    DetailList:[],
    OuList:[],
    rowCount:0,
    isMgr:0,
    DetailList1:[]
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
    /**
     *  作者: 张楠华
     *  创建日期: 2017-11-28
     *  邮箱：zhangnh6@chinaunicom.cn
     *  功能：普通角色初始化。
     */
    *init({}, { call,put }) {
      yield put({
        type:'save',
        payload:{
          tag:0,//tag为0时普通员工查询
          list:[],
          projList:[],
          DetailList:[],
          DetailList1:[],
          OuList:[],
          isMgr:0
        }
      });
      let postData = {};
      postData['arg_userid'] = localStorage.userid;
      const data = yield call(timeManageService.queryParticipatedProj,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            projList:data.DataRows,
          }
        });
        if(data.DataRows.length !== 0){
          yield put({
            type:'humanQuery',
            projCode:data.DataRows[0].proj_code,
            date:[moment('2016-01-01'),moment()],
            timeSheetState:'',
            page:1
          })
        }else{
          message.info('您没有参加项目');
        }
      }
    },
    /**
     *  作者: 张楠华
     *  创建日期: 2017-11-28
     *  邮箱：zhangnh6@chinaunicom.cn
     *  功能：普通角色查询。
     */
    *humanQuery({projCode,date,timeSheetState,page}, { select,call,put }){
      let projList1 = yield select(state=>state.humanQuery.projList);
      let beginTime = date[0].format(dateFormat);
      let endTime = date[1].format(dateFormat);
      let postData = {};
      postData['arg_staff_id'] = localStorage.staffid;
      if(projCode !==''){
        postData['arg_proj_code'] = projCode;
      }else{
        postData['arg_proj_code'] = projList1[0].proj_code;
      }
      postData['arg_start_time'] = beginTime;
      postData['arg_end_time'] = endTime;
      postData['arg_approved_status'] = timeSheetState;
      postData['arg_pagesize'] = 5;
      postData['arg_pagecurrent'] =page;
      const data = yield call(timeManageService.queryStaffProjHours,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            list:data.DataRows,
            rowCount:data.RowCount,
          }
        })
      }
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-11-13
     * 功能：查询明细
     */
      *timeSheetDetail({projCode,staffId},{call,put}){
      let postData = {};
      postData['arg_staff_id'] = staffId;
      postData['arg_user_id'] = localStorage.userid;
      postData['arg_proj_code'] = projCode;
      const timeSheetDetailData = yield call(timeManageService.queryStaffProjHoursDetial,postData);
      if(timeSheetDetailData.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            DetailList:JSON.parse(timeSheetDetailData.oneMonthAll),
            isMgr:timeSheetDetailData.is_mgr,
          }
        })
      }
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-11-13
     * 功能：查询明细
     */
      *timeSheetDetail1({projCode,date,staffId},{call,put}){
      let postData = {};
      postData['arg_user_id'] = staffId;
      postData['arg_start_time'] = date[0].format(dateFormat);
      postData['arg_end_time'] = date[1].format(dateFormat);
      postData['arg_proj_code'] = projCode;
      const timeSheetDetailData = yield call(timeManageService.queryStaffProjHoursDetial1,postData);
      if(timeSheetDetailData.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            DetailList1:timeSheetDetailData.DataRows,
          }
        })
      }
    },
    /**
     *  作者: 张楠华
     *  创建日期: 2017-11-28
     *  邮箱：zhangnh6@chinaunicom.cn
     *  功能：部门经理人员查询。
     */
    *DMInit({}, { call, put }) {
      yield put({
        type:'save',
        payload:{
          tag:2,//tag2 部门经理查询
          list:[],
          projList:[],
          DetailList:[],
          OuList:[],
          isMgr:0
        }
      });
      let postData = {};
      postData['arg_dm_id'] = localStorage.userid;
      postData['arg_dept_id'] = Cookies.get('dept_id');
      const data = yield call(timeManageService.queryDMOUProj,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            OuList:data.DataRows,
          }
        });
        yield put({
          type:'DMProjQuery',
          ou:localStorage.ou
        });
      }
    },
    /**
     *  作者: 张楠华
     *  创建日期: 2017-11-28
     *  邮箱：zhangnh6@chinaunicom.cn
     *  功能：部门经理查询项目列表。
     */
    *DMProjQuery({ou}, { call,put }){
      let postData = {};
      postData['arg_mgr_id'] = localStorage.staffid;
      postData['arg_ou'] = ou;
      const data = yield call(timeManageService.queryDMProj,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            projList:data.DataRows,
            list:[],
            date:[moment('2016-01-01'),moment()]
          }
        })
      }
    },
    /**
     *  作者: 张楠华
     *  创建日期: 2017-11-28
     *  邮箱：zhangnh6@chinaunicom.cn
     *  功能：部门经理人员查询。
     */
    *DMHumanQuery({projCode,date,timeSheetState,page}, { call,put }){
      let beginTime = date[0].format(dateFormat);
      let endTime = date[1].format(dateFormat);
      let postData = {};
      postData['arg_staff_id'] = localStorage.staffid;
      postData['arg_proj_code'] = projCode;
      postData['arg_start_time'] = beginTime;
      postData['arg_end_time'] = endTime;
      postData['arg_approved_status'] = timeSheetState;
      postData['arg_pagesize'] = 5;
      postData['arg_pagecurrent'] =page;
      if(projCode !=='请选项目名称'){
        const data = yield call(timeManageService.queryDMProjHours,postData);
        if(data.RetCode === '1'){
         if(data.DataRows.length !== 0){
           yield put({
             type:'save',
             payload:{
               list:data.DataRows,
               rowCount:data.RowCount,
             }
           })
         }else{
           message.info('没有查到数据');
           yield put({
             type:'save',
             payload:{
               list:data.DataRows,
             }
           })
         }
        }
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/projectApp/timesheetManage/staffTimesheetSearchCommon') {
          dispatch({ type: 'init',query });
        }
        if (pathname === '/projectApp/timesheetManage/staffTimesheetSearchPm') {
          dispatch({ type: 'init',query });
        }
        if (pathname === '/projectApp/timesheetManage/staffTimesheetSearchDm') {
          dispatch({ type: 'DMInit',query });
        }
      });
    },
  },
};

