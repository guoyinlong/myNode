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
  namespace: 'manHourQuery',
  state: {
    manHourPorjList:[],
    weekList : [],
    monthList:[],
    seasonList:[],
    selfDefinedList:[],
    detailList:[],
    activeSKey:'1',
    tabIsDisable:false
  },

  reducers: {
    initData(state){
      return {
        ...state,
        manHourPorjList:[],
        weekList : [],
        monthList:[],
        seasonList:[],
        selfDefinedList:[],
        detailList:[],
        activeSKey:'1',
        tabIsDisable:false
      }
    },
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
    //清理数据
    *clearData({}, { put }) {
      yield put({
        type:'save',
        payload:{
          detailList:[]
        }
      });
    },
    //清理数据
    *changeActiveSKey({activeSKey}, { put }) {
      yield put({
        type:'save',
        payload:{
          activeSKey:activeSKey,
        }
      });
    },
    /**
     *  作者: 张楠华
     *  创建日期: 2017-11-28
     *  邮箱：zhangnh6@chinaunicom.cn
     *  功能：普通角色初始化,查询本周的工时。
     */
    *init({}, { put }) {
      yield put({
        type:'save',
        payload:{
          manTag:1,
        }
      });
        yield put({
          type:'weekQuery',
        })
    },
    /**
     *  作者: 张楠华
     *  创建日期: 2017-11-28
     *  邮箱：zhangnh6@chinaunicom.cn
     *  功能：普通角色查询。
     */
    *weekQuery({}, { call,put }){
          let postData = {};
         postData['arg_staff_id'] = localStorage.staffid;
         postData['arg_staff_name'] = Cookies.get('username');
          const data = yield call(timeManageService.weekQuery,postData);
          if(data.RetCode === '1'){
            yield put({
              type:'save',
              payload:{
                weekList:data.DataRows,
              }
            })
          }
    },
    *monthQuery({}, { call,put }){
      let postData = {};
      postData['arg_staff_id'] = localStorage.staffid;
      postData['arg_staff_name'] = Cookies.get('username');
      const data = yield call(timeManageService.monthQuery,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            monthList:data.DataRows,
          }
        })
      }
    },
    *seasonQuery({}, { call,put }){
      let postData = {};
      postData['arg_staff_id'] = localStorage.staffid;
      postData['arg_staff_name'] = Cookies.get('username');
      const data = yield call(timeManageService.seasonQuery,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            seasonList:data.DataRows,
          }
        })
      }
    },
    *selfDefinedQuery({ date }, { call,put }){
      let postData = {};
      postData['arg_staff_id'] = localStorage.staffid;
      postData['arg_staff_name'] = Cookies.get('username');
      if(date){
        postData['arg_begin_time'] = date[0].format(dateFormat);
        postData['arg_end_time'] = date[1].format(dateFormat);
        const data = yield call(timeManageService.selfDefinedQuery,postData);
        if(data.RetCode === '1'){
          yield put({
            type:'save',
            payload:{
              selfDefinedList:data.DataRows,
            }
          })
        }
      }else{
        yield put({
          type:'save',
          payload:{
            selfDefinedList:[],
          }
        })
      }
    },

    /**
     * 作者：张楠华
     * 创建日期：2017-11-13
     * 功能：查询明细
     */
    *timeSheetDetail({staffid,flag,date},{call,put}){
      let postData = {};
      postData['arg_staff_id'] = staffid;
      let timeSheetDetailData={};
      if( flag === '1'){
        timeSheetDetailData = yield call(timeManageService.queryTimeSheetDetailWeek,postData);
      }else if( flag === '2'){
        timeSheetDetailData = yield call(timeManageService.queryTimeSheetDetailMonth,postData);
      }else if( flag === '3'){
        timeSheetDetailData = yield call(timeManageService.queryTimeSheetDetailSeason,postData);
      }else if( flag === '4'){
        if(date){
          postData['arg_begin_time'] = date[0].format(dateFormat);
          postData['arg_end_time'] = date[1].format(dateFormat);
          timeSheetDetailData = yield call(timeManageService.queryTimeSheetDetailSelfDefined,postData);
        }else{
          timeSheetDetailData.push({
            RetCode : '1',
            DataRows:[]
          })
        }
      }
      if(timeSheetDetailData.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            detailList:timeSheetDetailData.DataRows,
          }
        })
      }
    },

    /**
     *  作者: 张楠华
     *  创建日期: 2017-11-28
     *  邮箱：zhangnh6@chinaunicom.cn
     *  功能：项目经理人员查询，先查项目。
     */
    *initPM({}, { call, put }) {
      yield put({
        type:'save',
        payload:{
          manTag:2,
        }
      });
      let postData = {};
      postData['arg_staff_id'] = localStorage.staffid;
      const data = yield call(timeManageService.queryManHourPorj,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            manHourPorjList:data.DataRows,
          }
        });
        if(data.DataRows.length!==0 && data.DataRows[0].proj_id){
          yield put({
            type:'weekQueryPM',
            projInfo:data.DataRows[0].proj_id,
          })
        }else{
          message.info('没有团队，请联系管理员！');
          yield put({
            type:'save',
            payload:{
              tabIsDisable:true,
            }
          })
        }
      }
    },
    /**
     *  作者: 张楠华
     *  创建日期: 2017-11-28
     *  邮箱：zhangnh6@chinaunicom.cn
     *  功能：普通角色查询。
     */
    *weekQueryPM({ projInfo }, { call,put }){
      let postData = {};
      postData['arg_proj_id'] = projInfo;
      const data = yield call(timeManageService.weekQueryPM,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            weekList:data.DataRows,
          }
        })
      }
    },
    *monthQueryPM({ projInfo }, { call,put }){
      let postData = {};
      postData['arg_proj_id'] = projInfo;
      const data = yield call(timeManageService.monthQueryPM,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            monthList:data.DataRows,
          }
        })
      }
    },
    *seasonQueryPM({ projInfo }, { call,put }){
      let postData = {};
      postData['arg_proj_id'] = projInfo;
      const data = yield call(timeManageService.seasonQueryPM,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            seasonList:data.DataRows,
          }
        })
      }
    },
    *selfDefinedQueryPM({ date,projInfo }, { call,put }){
      let postData = {};
      postData['arg_proj_id'] = projInfo;
      if(date){
        postData['arg_begin_time'] = date[0].format(dateFormat);
        postData['arg_end_time'] = date[1].format(dateFormat);
        const data = yield call(timeManageService.selfDefinedQueryPM,postData);
        if(data.RetCode === '1'){
          yield put({
            type:'save',
            payload:{
              selfDefinedList:data.DataRows,
            }
          })
        }
      }else{
        yield put({
          type:'save',
          payload:{
            selfDefinedList:[],
          }
        })
      }
    },

    /**
     *  作者: 张楠华
     *  创建日期: 2017-11-28
     *  邮箱：zhangnh6@chinaunicom.cn
     *  功能：项目/部门经理人员查询，先查项目
     */
      *initDM({}, { call, put }) {
      yield put({
        type:'save',
        payload:{
          manTag:3,
        }
      });
      let postData = {};
      postData['arg_staff_id'] = localStorage.staffid;
      const data = yield call(timeManageService.queryManHourPorjDM,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            manHourPorjList:data.DataRows,
          }
        });
        if(data.DataRows.length!==0 && data.DataRows[0].proj_id){
          yield put({
            type:'weekQueryDM',
            projInfo:data.DataRows[0].proj_id,
          })
        }else{
          message.info('没有团队，请联系管理员！');
          yield put({
            type:'save',
            payload:{
              tabIsDisable:true,
            }
          })
        }
      }
    },
    /**
     *  作者: 张楠华
     *  创建日期: 2017-11-28
     *  邮箱：zhangnh6@chinaunicom.cn
     *  功能：普通角色查询。
     */
   *weekQueryDM({projInfo}, { call,put }){
      let postData = {};
      postData['arg_staff_id'] = localStorage.staffid;
      postData['arg_proj_id'] = projInfo;
      const data = yield call(timeManageService.weekQueryDM,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            weekList:data.DataRows,
          }
        })
      }
    },
    *monthQueryDM({projInfo}, { call,put }){
      let postData = {};
      postData['arg_staff_id'] = localStorage.staffid;
      postData['arg_proj_id'] = projInfo;
      const data = yield call(timeManageService.monthQueryDM,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            monthList:data.DataRows,
          }
        })
      }
    },
    *seasonQueryDM({projInfo}, { call,put }){
      let postData = {};
      postData['arg_staff_id'] = localStorage.staffid;
      postData['arg_proj_id'] = projInfo;
      const data = yield call(timeManageService.seasonQueryDM,postData);
      if(data.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            seasonList:data.DataRows,
          }
        })
      }
    },
    *selfDefinedQueryDM({date,projInfo}, { call,put }){
      let postData = {};
      postData['arg_staff_id'] = localStorage.staffid;
      postData['arg_proj_id'] = projInfo;
      if(date){
        postData['arg_begin_time'] = date[0].format(dateFormat);
        postData['arg_end_time'] = date[1].format(dateFormat);
        const data = yield call(timeManageService.selfDefinedQueryDM,postData);
        if(data.RetCode === '1'){
          yield put({
            type:'save',
            payload:{
              selfDefinedList:data.DataRows,
            }
          })
        }
      }else{
        yield put({
          type:'save',
          payload:{
            selfDefinedList:[],
          }
        })
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/projectApp/timesheetManage/staffTimesheetSearchCommon') {
          dispatch({ type: 'init',query });
          dispatch({ type: 'initData',query });
        }
        if (pathname === '/projectApp/timesheetManage/staffTimesheetSearchPm') {
          dispatch({ type: 'initPM',query });
          dispatch({ type: 'initData',query });
        }
        if(pathname === '/projectApp/timesheetManage/staffTimesheetSearchDm'){
          dispatch({ type: 'initDM',query });
          dispatch({ type: 'initData',query });
        }
      });
    },
  },
};
