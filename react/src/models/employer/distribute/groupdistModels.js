/**
 * 文件说明：小组长正态分布操作
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
export default {
  namespace : 'groupdist',
  state : {
    display:false,
    projList:[],
    year:year,
    season:season,
    group_id:'',
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
     * @param rank 评价比例及余数信息
     * @param projList 员工考核数据
     * @param group_id 小组id
     * @param score_has_null 是否有得分为空
     */
    saveRes(state, {rank,projList,group_id,score_has_null}){
      return {
        ...state,
        rank,
        projList,
        group_id,
        score_has_null
      };
    },
  },

  effects : {
    /**
     * 功能：初始化 小组成员 考核结果及余数信息
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-08-20
     */
    *groupEmpScoreSearch({}, {call, put}) {
      const scoreRes =  yield call(service.groupEmpScoreSearch,
        {
          'arg_year':year,
          'arg_season':season,
          'arg_checker_id':Cookie.get('userid')
        });
      if(scoreRes.RetCode==='1' && scoreRes.DataRows && scoreRes.DataRows.length){
        const groupRes = yield call(service.groupInfoSearch,
          {
            transjsonarray:JSON.stringify({"condition":{"tag":'0',
              "mgr_id":Cookie.get('userid')}})
          });
        if(groupRes.RetCode==='1' && groupRes.DataRows && groupRes.DataRows.length){
          const rankRes = yield call(service.groupRankRatioSearch,
            {
              transjsonarray:JSON.stringify({"condition":{"year":year,
                "season":season,"type":'0',
                'group_id':groupRes.DataRows[0].group_id}})
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
              group_id:groupRes.DataRows[0].group_id,
              score_has_null
            });
          }else{
            message.error('未配置评价比例信息！')
          }
        }else{
          message.error("未查询到小组相关信息！")
        }
      }else{
        message.error('无待分布人员信息！')
      }
    },
  },
  subscriptions : {
    setup({dispatch, history}) {

      return history.listen(({pathname,query}) => {

        if (pathname === '/humanApp/employer/groupdistribute') {
          dispatch({type: 'groupEmpScoreSearch',query});
        }
      });

    },
  },
};
