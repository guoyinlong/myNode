/**
 * 文件说明：分院院长/副院长正态分布操作
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 */
import * as service from '../../../services/employer/empservices';
import message from '../../../components/commonApp/message'
import Cookie from 'js-cookie';
let year = new Date().getFullYear().toString();
let season = Math.floor((new Date().getMonth() + 2) / 3).toString();
if(season === '0'){
  season = '4';
  year = (new Date().getFullYear() - 1).toString()
}
const ou = Cookie.get('deptname_p').split('-')[1];
export default {
  namespace : 'psdist',
  state : {
    display:false,
    projList:[],
    year:year,
    season:season,
    ou,
    rank:{},
    score_has_null:false
  },

  reducers : {
    /**
     * 功能：更新状态树
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-08-20
     * @param state 初始状态
     * @param projList 正态分布数据
     * @param score_has_null 是否有得分为空
     */
    saveRes(state, {rank,projList,score_has_null}){
      return {
        ...state,
        rank,
        projList,
        score_has_null
      };
    },
  },

  effects : {
    /**
     * 功能：初始化 分院项目经理 + 运营部小组长 考核结果及余数信息
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-08-20
     */
    *psPMScoreSearch({}, {call, put}) {
      const scoreRes =  yield call(service.psPMScoreSearch,
        {
          'arg_year':year,
          'arg_season':season,
          'arg_ou':ou
        });
      if(scoreRes.RetCode==='1'){
        const rankRes = yield call(service.deptRankRatioSearch,
          {
            transjsonarray:JSON.stringify({"condition":{"year":year,
              "season":season,"type":'2',
              'dept_name':ou}})
          });
        if(rankRes.RetCode==='1' && rankRes.DataRows && rankRes.DataRows.length){
          let score_has_null = false;
          for(var j = 0;j < scoreRes.DataRows.length;j++) {
            if (scoreRes.DataRows[j].score == undefined || scoreRes.DataRows[j].score == '') {
              score_has_null = true;
              break
            }
          }
          yield put({
            type: 'saveRes',
            rank: rankRes.DataRows,
            projList: scoreRes.DataRows,
            score_has_null
          });
        }else{
          message.error('未配置评价比例信息！')
        }
      }else{
        message.error('无待评价人员信息！')
      }
    },

    /**
     * 功能：初始化 分院部门经理 考核结果及余数信息
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-08-20
     */
    *psMasterScoreSearch({}, {call, put}) {
      const scoreRes =  yield call(service.empScoreSearch,
        {transjsonarray :JSON.stringify({"condition":{"ou":ou,
          "year":year,"season":season,"tag":'0','emp_type':'2','score_type':'0'},"sequence":[{"score":'1',"staff_id":'0'}]})});
      if(scoreRes.RetCode==='1'){
        const rankRes = yield call(service.deptRankRatioSearch,
          {
            transjsonarray:JSON.stringify({"condition":{"year":year,
              "season":season,"type":'5',
              'dept_name':ou}})
          });
        if(rankRes.RetCode==='1' && rankRes.DataRows && rankRes.DataRows.length){
          let score_has_null = false;
          for(var j = 0;j < scoreRes.DataRows.length;j++) {
            if (scoreRes.DataRows[j].score == undefined || scoreRes.DataRows[j].score == '') {
              score_has_null = true;
              break
            }
          }
          yield put({
            type: 'saveRes',
            rank: rankRes.DataRows,
            projList: scoreRes.DataRows,
            score_has_null
          });
        }else{
          message.error('未配置评价比例信息！')
        }

      }else{
        message.error('无待评价人员信息！')
      }
    },

  },
  subscriptions : {
    setup({dispatch, history}) {

      return history.listen(({pathname,query}) => {

        if (pathname === '/humanApp/employer/psdistribute') {
          dispatch({type: 'psPMScoreSearch',query});
        }else if (pathname === '/humanApp/employer/masterdistribute') {
          dispatch({type: 'psMasterScoreSearch',query});
        }
      });

    },
  },
};
