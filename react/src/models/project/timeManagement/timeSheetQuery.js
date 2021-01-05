/**
 * 作者：张楠华
 * 日期：2017-11-20
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：工时查询
 */
import * as timeManageService from '../../../services/project/timeManagement';
import config from '../../../utils/config'
const dateFormat='YYYY-MM-DD';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
export default {
  namespace: 'timeQuery',
  state: {
    list:[],
    ouList:[],
    projectList:[],
    DetailList:[],
    rowCount:0,
    pmsDetailList:[],
    resetState:false,
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
    //清理数据
    *clearData({}, { put }) {
      yield put({
        type:'save',
        payload:{
          pmsDetailList:[]
        }
      });
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-08-21
     * 功能：初始化
     */
    *init({}, { call, put }) {
      yield put({
        type:'save',
        payload:{
          projCode:'全部',
          ou:localStorage.ou,
          date:[moment( new Date().getFullYear().toString()+'-01-01'),moment()],
          page:1,
        }
      });
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
      yield put({
        type:'getProjList',
        ou:localStorage.ou
      });
      yield put({
        type:'queryTimeSheet',
        projCode:'全部',
        ou:localStorage.ou,
        date:[moment( new Date().getFullYear().toString()+'-01-01'),moment()],
        page:1,
      })
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-11-13
     * 功能：根据OU获取项目名称列表
     */
      *getProjList({ou},{call,put}){
      let postData = {};
      postData['arg_ou'] = ou;
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
     * 功能：查询工时
     */
      *queryTimeSheet({projCode,ou,date,page},{call,put}){
      let beginTime = date[0].format(dateFormat);
      let endTime = date[1].format(dateFormat);
      let postData = {};
      postData['arg_ouname'] = ou;
      postData['arg_begin_time'] = beginTime;
      postData['arg_end_time'] = endTime;
      postData['argpagesize'] = 5;
      postData['argpagecurrent'] = page;
      if(projCode !== '全部'){
        postData['arg_proj_code'] = projCode;
      }
      const timeSheetData = yield call(timeManageService.queryProjTimeSheet,postData);
      if(timeSheetData.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            list:timeSheetData.DataRows,
            rowCount:timeSheetData.RowCount,
            projCode,ou,date,page
          }
        })
      }
    },
    /**
     * 作者：张楠华
     * 创建日期：2017-11-13
     * 功能：查询明细
     */
      *timeSheetDetail({projCode,date},{call,put}){
      let postData = {};
      let beginTime = date[0].format(dateFormat);
      let endTime = date[1].format(dateFormat);
      postData['arg_begin_time'] = beginTime;
      postData['arg_end_time'] = endTime;
      postData['arg_proj_code'] = projCode;
      const timeSheetDetailData = yield call(timeManageService.queryProjTimeSheetDetail,postData);
      if(timeSheetDetailData.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            DetailList:timeSheetDetailData.DataRows
          }
        })
      }
    },
    /**
     * 作者：张楠华
     * 创建日期：2018-8-15
     * 功能：查询PMS明细
     */
      *queryPMSDetail({projCode,date},{call,put}){
      let postData = {};
      let beginTime = date[0].format(dateFormat);
      let endTime = date[1].format(dateFormat);
      postData['arg_begin_time'] = beginTime;
      postData['arg_end_time'] = endTime;
      postData['arg_proj_code'] = projCode;
      const pmsDetailData = yield call(timeManageService.queryPMSDetail,postData);
      if(pmsDetailData.RetCode === '1'){
        yield put({
          type:'save',
          payload:{
            pmsDetailList:pmsDetailData.DataRows
          }
        })
      }
    },
  },
  /**
   * 作者：张楠华
   * 创建日期：2017-08-21
   * 功能：监听路径
   */
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/projectApp/timesheetManage/projectTimesheetSearch') {
          dispatch({ type: 'init',query });
        }
      });
    },
  },
};
