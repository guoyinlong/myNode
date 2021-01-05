/**
 * 文件说明：中层考核-支撑满意度评价数据处理层
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-10-25
 */
import * as service from '../../../services/leader/leaderservices';
const year = new Date().getFullYear().toString();
import Cookie from 'js-cookie';
import moment from 'moment'
import message from '../../../components/commonApp/message'

export default {
  namespace : 'support',
  state : {
    list: [],
    detailList: [],
    query: {},
    tag:''
  },
  reducers : {
    save(state, {list}){
      return {
        ...state,
        list
      };
    },
    saveDetail(state, {detailList,tag}){
      return {
        ...state,
        detailList,
        tag
      };
    },
  },

  effects : {
    /**
     * 功能：查询支撑满意度评价历史记录
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-10-30
     */
    *supportResSearch({}, {call, put}) {
      yield put({
        type: 'save',
        list: [],
      });

      const resList=yield call(service.empSupportStateSearch,
        {
          'arg_staff_id':Cookie.get('userid')
        })
      if(resList.DataRows.length){
        resList.DataRows.map((i,index)=>{
          i.key=index;
        })
      }
      yield put({
        type: 'save',
        list: resList.DataRows,
      });
    },
    /**
     * 功能：查询支撑满意度待评价中层领导
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-10-30
     */
    *toSupportLeaderSearch({query}, {call, put}) {
      yield put({
        type: 'saveDetail',
        detailList: [],
        tag:'0'
      });

      const resList=yield call(service.empSupportDetailsSearch,
        {
          arg_staff_id:query.staff_id,
          arg_year:query.year,
        })
      if(resList.DataRows.length){
        resList.DataRows.map((i,index)=>{
          i.key=index;
        })
      }
      yield put({
        type: 'saveDetail',
        detailList: resList.DataRows,
        tag:query.state
      });
    },
  },
  subscriptions : {
    setup({dispatch, history}) {

      return history.listen(({pathname,query}) => {
        if (pathname === '/humanApp/employer/support') {
          dispatch({
            type:'supportResSearch'
          });
        }else if (pathname === '/humanApp/employer/support/supportDetail') {
          dispatch({
            type:'toSupportLeaderSearch',
            query
          });
        }
      });

    },
  },
};
