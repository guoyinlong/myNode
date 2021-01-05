/**
 * 作者：陈莲
 * 日期：2017-11-07
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：个人考核考核结果逻辑
 */
import * as service from '../../../services/leader/leaderservices'
import message from '../../../components/commonApp/message'
export default {
  namespace: 'statistic',
  state: {
    list: [],
  },
  /**
   * 作者：张楠华
   * 创建日期：2017-09-18
   * 功能：保存多项数据
   */
  reducers: {
    save(state, { list}) {
      return {
        ...state,
        list
      };
    },

  },

  effects: {
    /**
     * 作者：张楠华
     * 创建日期：2017-09-18
     * 功能：初始查询，查询部门和默认的checkList
     */
    *initListSearch({}, { call, put }) {
      const data = yield call(service.empSupportProgressSearch, {
        arg_year:new Date().getFullYear().toString(),
      });

      if(data==null||data.RetCode!=1){
        message.info("查询支撑评价进度失败！")
      }else{
        yield put({
          type: 'save',
          list: data.DataRows,
        });
      }
    },

  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/employer/progress') {
          dispatch({ type: 'initListSearch',query });
        }
      });
    },
  },
};
