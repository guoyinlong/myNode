/**
 * 文件说明：中层指标查询
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-09-15
 */
import Cookie from 'js-cookie';
import * as service from '../../../services/leader/leaderservices';
import message from '../../../components/commonApp/message'
export default {
  namespace:'leaderSearch',
  state : {
    list: [],
    leaderKpiList:[]
  },

  reducers : {
    /**
     * 功能：更新状态树-中层领导历次考核结果
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-09-15
     * @param state 初始状态
     * @param list 中层领导历次考核结果
     */
    saveRes(state, {list}) {
      return {
        ...state,
        list
      };
    },

    /**
     * 功能：更新状态树-中层领导考核指标详情
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-09-15
     * @param state 初始状态
     * @param list 中层领导考核记录
     * @param leaderKpiList 中层领导考核指标详情
     */
    saveKpiRes(state, {list,leaderKpiList}) {
      return {
        ...state,
        list,
        leaderKpiList
      };
    },
    /**
     * 功能：更新状态树-中层领导考核指标完成情况详情
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2018-01-01
     * @param state 初始状态
     * @param list 中层领导考核记录
     * @param leaderKpiList 中层领导考核指标详情
     * @param leaderSonKpiList 中层领导分指标详情
     */
    saveKpiFinishRes(state, {list,leaderKpiList,leaderSonKpiList}) {
      return {
        ...state,
        list,
        leaderKpiList,
        leaderSonKpiList
      };
    },
  },
  effects:{
    /**
     * 功能：查询所有考核记录
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-09-15
     * @param pageCondition 分页数据
     */
    *fetch({pageCondition}, {call, put}) {
      const {DataRows} = yield call(service.leaderScoreSearch,
        {
          transjsonarray:JSON.stringify({"sequence":[{"year":'1'}]}),
        });
      if(DataRows.length){
        yield put({
          type: 'saveRes',
          list: DataRows,
          pageCondition
        });
      }
    },

    /**
     * 功能：查询指定领导考核记录
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-09-15
     * @param pageCondition 分页数据
     */
    *manage({pageCondition}, {call, put}) {
      const {DataRows} = yield call(service.leaderScoreSearch,
        {
          transjsonarray:JSON.stringify({"condition":{"staff_id":Cookie.get('userid')},"sequence":[{"year":'1'}]}),
        });
      if(DataRows.length){
        yield put({
          type: 'saveRes',
          list: DataRows,
          pageCondition
        });
      }
    },

    /**
     * 功能：查询指定领导考核指标详情
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-09-15
     * @param query 查询条件
     */
    *leaderKpiDetailSearch({query}, {call, put}) {
      const {DataRows} = yield call(service.leaderKpiSearch,
        {
          transjsonarray:JSON.stringify({"condition":{...query},sequence:[{"sort_num":"0"},{"kpi_content":"0"},{"kpi_target":"0"}]}),
        });
      if(DataRows.length){
        yield put({
          type: 'saveKpiRes',
          list:{'year':query.year,"staff_id":query.staff_id,"staff_name":query.staff_name},
          leaderKpiList: DataRows.filter(k=>(!k.last_id))
        });
      }
    },
    /**
     * 功能：查询领导指标完成情况详情
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2018-01-01
     * @param query 查询条件
     */
    *leaderKpiFinishSearch({query}, {call, put}) {
      const {DataRows} = yield call(service.leaderKpiSearch,
        {
          transjsonarray:JSON.stringify({"condition":{...query},sequence:[{"sort_num":"0"},{"kpi_content":"0"},{"kpi_target":"0"}]}),
        });
      if(DataRows.length){
        yield put({
          type: 'saveKpiFinishRes',
          list:{'year':query.year,"staff_id":query.staff_id,"staff_name":query.staff_name},
          leaderKpiList: DataRows.filter(k=>(!k.last_id)),
          leaderSonKpiList: DataRows.filter(k=>(k.last_id))
        });
      }
    },
    /**
     * 功能：保存领导指标完成情况详情
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2018-01-02
     * @param finish 完成情况
     */
    *saveKpiFinish({finish}, {call, put}) {
      const {RetCode} = yield call(service.leaderKpiUpdate,
        {
          transjsonarray:JSON.stringify(finish)
        });
        if(RetCode==='1'){
          message.success('保存成功！')
        }else{
          message.error('保存失败')
        }
    },
  },
  subscriptions : {
    setup({dispatch, history}) {
      return history.listen(({pathname,query}) => {
        if (pathname ==='/humanApp/leader/search') {
          dispatch({
            type:'fetch',
            // pageCondition:{arg_page_num:400, arg_start:0},
          });
        }else if (pathname ==='/humanApp/leader/manage') {
          dispatch({
            type:'manage',
            // pageCondition:{arg_page_num:400, arg_start:0},
          });
        }else if (pathname ==='/humanApp/leader/manage/detail' || pathname ==='/humanApp/leader/search/detail') {
          dispatch({
            type:'leaderKpiDetailSearch',
            query
          });
        }else if (pathname ==='/humanApp/leader/manage/kpiFinish') {
          dispatch({
            type:'leaderKpiFinishSearch',
            query
          });
        }
      });

    },
  },
}
