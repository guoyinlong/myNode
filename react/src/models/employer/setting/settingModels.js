/**
 * 文件说明：后台管理操作
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-12-6
 */
import * as service from '../../../services/employer/empservices';
import message from '../../../components/commonApp/message'
export default {
  namespace : 'setting',
  state : {
    annualList:[],
    mutualEvalList:[],
    leaderEvalList:[],
    //分布群体 1：综合绩效员工  2：项目经理  3：项目绩效员工  4：全部员工
    season:"",
    year:""
  },

  reducers : {
    /**
     * 功能：更新状态树
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-12-06
     * @param state 初始状态
     * @param distList 正态分布数据
     */
    saveRes(state, {annualList}){
      return {
        ...state,
        annualList:[...annualList]
      };
    },
    /**
     * 功能：更新状态树
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-12-06
     * @param state 初始状态
     * @param distList 正态分布数据
     */
    saveMutualEvalRes(state, {mutualEvalList}){
      return {
        ...state,
        mutualEvalList:[...mutualEvalList]
      };
    },
    /**
     * 功能：更新状态树
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-12-06
     * @param state 初始状态
     * @param distList 正态分布数据
     */
    saveLeaderEvalRes(state, {leaderEvalList}){
      return {
        ...state,
        leaderEvalList:[...leaderEvalList]
      };
    },

    saveinfo(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
  },

  effects : {

    *backTime({},{call, put}){
      const timeList = yield call(service.seasonTime); // 查询季度时间
      if(timeList.RetCode=="1"){
        yield put({
          type: 'saveinfo',
          payload:{
            season:timeList.DataRows[0].examine_season,
            year:timeList.DataRows[0].examine_year,
          }
        })

        yield put({type:"initSetting"})
      }
     },

    /**
     * 功能：初始化
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-12-06
     * 正态分布动态配置
     */
      *initSetting({}, {call, put}) {
      yield put({type: 'annualStateSearch'});
      yield put({type: 'mutualEvalStateSearch'});
      yield put({type: 'leaderEvalStateSearch'});

    },
    /**
     * 功能：查询年度考核状态
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-12-06
     * 正态分布动态配置
     */
      *annualStateSearch({}, {call, put}) {
      const annualRes = yield call(service.annualStateSearch,
        {});
      if(annualRes.RetCode==='1' && annualRes.DataRows && annualRes.DataRows.length){
        yield put({
          type: 'saveRes',
          annualList:annualRes.DataRows
        });
      }else{
        message.error("未查询到待分布群体信息！",2," ")
      }
    },
    /**
     * 功能：开启年度考核
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-12-06
     */
      *annualStart({year}, {call, put}) {
      const annualRes = yield call(service.annualStart,
        {
          arg_year:year
        });
      if(annualRes.RetCode==='1'){
        yield put({type: 'annualStateSearch'});
        message.success("开启成功！",2," ")
      }else{
        message.error(`${annualRes.RetVal}`,2," ")
      }
    },
    /**
     * 功能：查询员工互评状态
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-12-06
     * 正态分布动态配置
     */
      *mutualEvalStateSearch({}, {call, put}) {
      const evalRes = yield call(service.mutualEvalStateSearch,
        {
          "arg_evalsys_type":"0"
        });
      if(evalRes.RetCode==='1' && evalRes.DataRows && evalRes.DataRows.length){
        yield put({
          type: 'saveMutualEvalRes',
          mutualEvalList:evalRes.DataRows
        });

      }else{
        message.error("未查询到员工互评状态信息！",2," ")
      }
    },
    /**
     * 功能：查询中层互评状态
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-12-06
     * 正态分布动态配置
     */
      *leaderEvalStateSearch({}, {call, put}) {
      const leaderRes = yield call(service.mutualEvalStateSearch,
        {
          "arg_evalsys_type":"1"
        });
      if(leaderRes.RetCode==='1' && leaderRes.DataRows && leaderRes.DataRows.length){
        yield put({
          type: 'saveLeaderEvalRes',
          leaderEvalList:leaderRes.DataRows
        });

      }else{
        message.error("未查询到中层互评状态信息！",2," ")
      }
    },
    /**
     * 功能：生成匿名账号
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-12-06
     */
      *mutualEvalStart({year,evalsys_type}, {call, put}) {
      const evalRes = yield call(service.mutualEvalStart,
        {
          "arg_year":year,
          "arg_evalsys_type":evalsys_type
        });
      if(evalRes.RetCode==='1'){
        if(evalsys_type == '0'){
          yield put({type: 'mutualEvalStateSearch'});
        }else{
          yield put({type: 'leaderEvalStateSearch'});
        }
        message.success("开启成功！",2," ")
      }else{
        message.error(`${evalRes.RetVal}`,2," ")
      }
    },
    /**
     * 功能：计算员工互评成绩
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-12-21
     */
      *empResultCompute({year,result_type}, {call, put}) {
      const evalRes = yield call(service.mutualEvalResultCompute,
        {
          "arg_year":year,
          "arg_type":result_type
        });
      if(evalRes.RetCode==='1'){
        yield put({type: 'mutualEvalStateSearch'});
        message.success("计算成功！",2," ")
      }else{
        message.error("计算失败！",2," ")
      }
    },
    /**
     * 功能：计算中层三度评价成绩
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-12-21
     */
      *leaderResultCompute({year}, {call, put}) {
      const evalRes = yield call(service.leaderMutualEvalResultCompute,
        {
          "arg_year":year
        });
      if(evalRes.RetCode==='1'){
        yield put({type: 'leaderEvalStateSearch'});
        message.success("关闭成功！",2," ")
      }else{
        message.error("关闭失败！",2," ")
      }
    },
  },
  subscriptions : {
    setup({dispatch, history}) {
      return history.listen(({pathname,query}) => {
        if (pathname === '/humanApp/employer/employerAdmin') {
          dispatch({type: 'initSetting'});
          dispatch({type: 'backTime'});
        }
      });
    }
  }
};
