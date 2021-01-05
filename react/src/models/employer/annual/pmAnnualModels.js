/**
 * 文件说明：部门负责人正态分布操作
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 */
import * as service from '../../../services/employer/empservices';
import config  from '../../../utils/config';
import message from '../../../components/commonApp/message'
import Cookie from 'js-cookie';
import {splitEnter} from '../../../utils/func'
let year = new Date().getFullYear().toString();
let season = new Date().getMonth().toString();
if(season < '3'){
  year = (new Date().getFullYear() - 1).toString()
}
export default {
  namespace : 'pmannual',
  state : {
    projList:[],
    year:year,
  },

  reducers : {
    /**
     * 功能：更新状态树
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2018-01-15
     * @param state 初始状态
     * @param distList 正态分布数据
     */
    saveRes(state, {projList}){
      return {
        ...state,
        projList:[...projList]
      };
    },
  },

  effects : {
    /**
     * 功能：查询该项目经理负责项目tab项
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2018-01-15
     */
    *teamTabSearch({}, {call, put}) {

      const pmProjRes = yield call(service.pmAllProjSearch, {arg_userid: Cookie.get('userid')});
      if (pmProjRes.RetCode === '1') {
        if(pmProjRes.DataRows && pmProjRes.DataRows.length){
          let projList = [];
          for(let i = 0; i < pmProjRes.DataRows.length;i++){
            projList.push(pmProjRes.DataRows[i]);
          }
          yield put({
            type: 'saveRes',
            projList
          });
          yield put({
            type: 'tabEmpScoreSearch',
            projList,
            index:0
          });
        }else{
          message.warning("当前系统没有您所负责的主责项目，请联系项目部为您添加项目信息！",8);
        }
      }
    },
    /**
     * 功能：查询tab项待分布员工考核结果
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2018-01-15
     */
      *tabEmpScoreSearch({projList,index}, {call, put}) {
      const scoreRes = yield call(service.teamAnnualResultSearch,
        {
            "arg_year":year,
            "arg_proj_id":projList[index].proj_id,
        });
      if(scoreRes.RetCode==='1') {
        if (scoreRes.DataRows && scoreRes.DataRows.length) {
          projList[index].scores = scoreRes.DataRows;
          yield put({
            type: 'saveRes',
            projList
          });
        } else {
          message.error("未查询到项目成员考核信息！")
        }
      }
    },

  },
  subscriptions : {
    setup({dispatch, history}) {
      return history.listen(({pathname,query}) => {
        if (pathname === '/humanApp/employer/pmannual') {
          dispatch({type: 'teamTabSearch',query});
        }
      });
    }
  }
};
