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
let season = '0';
if(new Date().getMonth() < 12){
  year = (new Date().getFullYear() - 1).toString()
}
export default {
  namespace : 'annual',
  state : {
    distList:[],
    year:year,
    season:season,
    //分布群体 1：综合绩效员工  2：项目经理  3：项目绩效员工  4：全部员工
  },

  reducers : {
    /**
     * 功能：更新状态树
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-08-20
     * @param state 初始状态
     * @param distList 正态分布数据
     */
    saveRes(state, {distList,keyTips}){
      return {
        ...state,
        distList:[...distList],
        keyTips:keyTips
      };
    },

    save(state, {payload}){
      return {
        ...state,
        ...payload,
      };
    },


  },

  effects : {
    /**
     * 功能：查询该部门经理分布tab项
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-11-22
     * 正态分布动态配置
     */
      *deptTabSearch({}, {call, put}) {
      const deptRes = yield call(service.deptTabSearch,
        {
          'arg_year':year,
          "arg_season":season,
          "arg_managerId":Cookie.get("userid")
        });
      if(deptRes.RetCode==='1' && deptRes.DataRows && deptRes.DataRows.length){
        let distList = [];
        for(let i = 0; i < deptRes.DataRows.length;i++){
          distList.push(deptRes.DataRows[i]);
          distList[i]["name"] = (distList[i].dept_name.split('-')[1] ? distList[i].dept_name.split('-')[1] : '')  +distList[i].tab_name;
        }
        yield put({
          type: 'saveRes',
          distList
        });
        yield put({
          type: 'tabEmpScoreSearch',
          distList,
          index:0
        });
      }else{
        message.error("未查询到待分布群体信息！")
      }
    },
    /**
     * 功能：查询tab项待分布员工考核结果
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-11-22
     */
      *tabEmpScoreSearch({distList,index}, {call, put}) {
      const scoreRes = yield call(service.tabEmpScoreSearch,
        {
          "arg_tabId":distList[index].tabid,
          "arg_flag":"2",
          "arg_param":JSON.stringify({
            "arg_year":year,
            "arg_season":season,
            "arg_ou":Cookie.get("OU"),
            //"arg_dept_name":Cookie.get("deptname")
            "arg_dept_name":distList[index].dept_name
          })
        });

      if(scoreRes.RetCode==='1'){

        let empFlag = false;
        let rankFlag = false;
        let score_has_null = false;
        let keyTips = null;
        let isDeptAllEmp = false;

        if (scoreRes.rank && scoreRes.rank.length){
          distList[index].rank = scoreRes.rank;
          rankFlag = true;
          if(scoreRes.rank[0].tag === '0' && scoreRes.rank[0].type === '3'){
            isDeptAllEmp = true;
          }
        }

        if(scoreRes.score && scoreRes.score.length){
          distList[index].scores = scoreRes.score;
          for(let i = 0;i < scoreRes.score.length;i++) {
            if (scoreRes.score[i].score == undefined || scoreRes.score[i].score == '') {
              score_has_null = true;
              distList[index]["score_has_null"] = true;
              break
            }

              if(scoreRes.score[i].emp_type == 1 || scoreRes.score[i].emp_type == 3 || scoreRes.score[i].emp_type == 4){
                if(isDeptAllEmp){
                  if(keyTips == null){
                    keyTips = {"name":"关键岗位评级数量","A":0,"B":0,"C":0,"D":0,"AB":0,'COUNT':0,'hasFinish':0};
                  }
                keyTips['COUNT']++;
                if(scoreRes.score[i].state === '10'){
                  keyTips.hasFinish  = 1;
                  keyTips[scoreRes.score[i].rank]++;
                  if(scoreRes.score[i].rank === 'A' || scoreRes.score[i].rank === 'B'){
                    keyTips['AB']++;
                  }
                }
              }
             }
          }
          empFlag = true;
        }
        // 存在一个人在多个部门
        let inMultipleDept = false;
        let warnMsg = '';
        if (distList[index].tabid === '11') {
          for(let i = 0;i < scoreRes.score.length;i++) {
            if(parseInt(scoreRes.score[i].pu_count)>1){
              inMultipleDept = true;
              warnMsg = `无法进行年度正态分布！ ${scoreRes.score[i].staff_name} 同时归属于 ${scoreRes.score[i].pu_dept_name}， 请联系人力资源部协调处理！`
              break;
            }
          }
        }

        if(inMultipleDept){
        if(scoreRes.score[i].state!=10){
          message.warning(warnMsg, 12)
        } 
        }else if (empFlag && score_has_null && !rankFlag){
          message.warning(splitEnter("未查询到该部门项目绩效员工正态分布比例及余数信息，请联系相关人员进行配置！<br/>尚有员工没有考核成绩，暂不能做正态分布！"),8);
        } else if(empFlag && score_has_null && rankFlag){
          message.warning(splitEnter("尚有员工没有考核成绩，暂不能做正态分布！"),8);
        } else if(keyTips && keyTips.hasFinish == 0){
          message.warning(splitEnter("核心岗位人员尚未正态分布！"),8)
        } else if(empFlag && !score_has_null && !rankFlag){
          message.warning(splitEnter("未查询到该部门项目绩效员工正态分布比例及余数信息，请联系相关人员进行配置！"),8);
        } else if(!empFlag && rankFlag){
          message.warning("该部门无待正态分布项目绩效员工！",8);
        } else if(!empFlag && !rankFlag){
          message.warning(splitEnter("该部门无待正态分布项目绩效员工！<br/>未查询到该部门项目绩效员工正态分布比例及余数信息，请联系相关人员进行配置！"),8);
        }

        yield put({
          type: 'saveRes',
          distList,
          keyTips
        });

        yield put({
          type: 'save',
          payload: {
            inMultipleDept,  // 存在一个人多个部门
          }
        })
      } else if(scoreRes.RetCode==='2') {
        message.error("未配置该群体考核规则，请联系后台人员进行处理！")
      } else {
        message.error("未查询到待分布员工考核信息！")
      }
    },

  },
  subscriptions : {
    setup({dispatch, history}) {
      return history.listen(({pathname,query}) => {
        if (pathname === '/humanApp/employer/annual') {
          dispatch({type: 'deptTabSearch',query});
        }
      });
    }
  }
};
