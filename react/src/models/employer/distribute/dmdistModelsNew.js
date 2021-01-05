/**
 * 文件说明：部门负责人正态分布操作
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 */
import * as service from '../../../services/employer/empservices';
import config from '../../../utils/config';
import message from '../../../components/commonApp/message'
import Cookie from 'js-cookie';
import {splitEnter} from '../../../utils/func'
import {Modal} from 'antd'
import Style from '../../../components/employer/employer.less'
// let year = new Date().getFullYear().toString();
// let season = Math.floor((new Date().getMonth() + 2) / 3).toString();
// if (season === '0') {
//   season = '4';
//   year = (new Date().getFullYear() - 1).toString()
// }

    //通知提醒
const  openNotification = (type) => {
  Modal.info({
    title: '温馨提示',
    content: (
    "正态分布结果新增导入功能，可导入excel并提交考核结果"
    ),
    okType:"link",
    className:Style.black
  });
  };

export default {
  namespace: 'dmdist',
  state: {
    distList: [],
    year: "",
    season: "",
    disableFlag: false,
    rankNullFlag: false,
    //分布群体 1：综合绩效员工  2：项目经理  3：项目绩效员工  4：全部员工
  },

  reducers: {
    /**
     * 功能：更新状态树
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-08-20
     * @param state 初始状态
     * @param distList 正态分布数据
     */
    saveRes(state, {distList, keyTips, disableFlag, rankNullFlag}) {
      return {
        ...state,
        distList: [...distList],
        keyTips: keyTips,
        disableFlag,
        rankNullFlag,
      };
    },

    saveinfo(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },

  },


  effects: {

    *backTime({query},{call, put}){
      const timeList = yield call(service.seasonTime); // 查询季度时间
      if(timeList.RetCode=="1"){
        yield put({
          type: 'saveinfo',
          payload:{
            season:timeList.DataRows[0].examine_season,
            year:timeList.DataRows[0].examine_year,
          }
        })
        yield put({type: 'deptTabSearch', query});
      }
     },

  
    /**
     * 功能：查询该部门经理分布tab项
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-11-22
     * 正态分布动态配置
     */* deptTabSearch({}, {call, put,select}) {
       let{season,year}=yield select(state=>state.dmdist)
      const deptRes = yield call(service.deptTabSearch,
        {
          'arg_year': year,
          "arg_season": season,
          "arg_managerId": Cookie.get("userid")
        });
      if (deptRes.RetCode === '1' && deptRes.DataRows && deptRes.DataRows.length) {
        let distList = [];
        for (let i = 0; i < deptRes.DataRows.length; i++) {
          distList.push(deptRes.DataRows[i]);
          // distList[i]["name"] = (distList[i].dept_name.split('-')[1] ? distList[i].dept_name.split('-')[1] : '')+distList[i].tab_name;
          distList[i]["name"] = distList[i].tab_name;
          if (deptRes.DataRows[i].tabid == '10') {
            distList[i]["name"] = distList[i].dept_name.split('-')[1];
          }
        }
        yield put({   // 存储tab的列表，每一个item内有一个分数
          type: 'saveRes',
          distList
        });
        yield put({
          type: 'tabEmpScoreSearch',  // 查询第一个tab的分数
          distList,
          index: 0
        });
      } else {
        message.error("未查询到待分布群体信息！")
      }
    },
    /**
     * 功能：查询tab项待分布员工考核结果
     * 作者：陈莲
     * 邮箱：chenl192@chinaunicom.cn
     * 创建日期：2017-11-22
     */* tabEmpScoreSearch({distList, index}, {call, put,select}) {
      let{season,year}=yield select(state=>state.dmdist)
      const scoreRes = yield call(service.tabEmpScoreSearch,
        {
          "arg_tabId": distList[index].tabid,
          "arg_flag": "0",
          "arg_param": JSON.stringify({
            "arg_year": year,
            "arg_season": season,
            "arg_ou": Cookie.get("OU"),
            //"arg_dept_name":Cookie.get("deptname")
            "arg_dept_name": distList[index].dept_name
          })
        });
      // 核心岗位
      if (scoreRes.RetCode === '1' || scoreRes.RetCode === '2') {

        // rankNullFlag ----start
        // 在tabid=11 的条件下，如果存在评级 分院rank_0包含 空，rankNullFlag=true，不能提交
        //  tabid   10 ： 分院按部门考核的核心岗位员工    8：分院按院考核的核心岗位员工
        let rankNullFlag = false;
        if (scoreRes.score && scoreRes.score.length !== 0) {
          for (let i = 0, j = scoreRes.score.length; i < j; i++) {
            if (distList[index].tabid === '10' || distList[index].tabid === '8' ) {
              if(scoreRes.score[i].rank_0.indexOf('空') !== -1){
                rankNullFlag = true;
                message.info('存在项目评级为空！')
                break;
              }
            }else if(distList[index].tabid === '11'){  // 归口部门核心岗 部门经理提交正态分布时不能有项目评级为空
              if( scoreRes.score[i].rank_0.indexOf('空') !== -1 && scoreRes.score[i].ou !== '联通软件研究院本部'){
                rankNullFlag = true;
                message.info('存在分院项目评级为空！')
                break;
              }
            }else if (distList[index].tabid === '16' ) {
              if(scoreRes.score[i].rank_0.indexOf('空') !== -1){
                rankNullFlag = true;
                message.info('存在评级为空！')
                break;
              }
            }
          

          }
        }
        // rankNullFlag ----end


        let empFlag = false;         // 返回数据有 score 数组
        let rankFlag = false;        // distributetransfer接口数据中时都有 rank项
        let score_has_null = false;  // score 数组内的元素的 score
        let keyTips = null;          // 用来计ABCDE计数
        let isDeptAllEmp = false;
        if (scoreRes.rank && scoreRes.rank.length) {
          distList[index].rank = scoreRes.rank;  // rank 是一个数组
          rankFlag = true;
          // type 分布群体类型：8个
          // tag 0 未考核 1 已考核 2 历史 3 退回
          if (scoreRes.rank[0].tag === '0' && scoreRes.rank[0].type === '3') {
            isDeptAllEmp = true;
          }
        }
        if (scoreRes.score && scoreRes.score.length) {
          distList[index].scores = scoreRes.score;
          distList[index]["score_has_null"] = false; // score数组内某个元素的score没有值，就在外层加一个属性
          for (let i = 0; i < scoreRes.score.length; i++) {
            if (scoreRes.score[i].score == undefined || scoreRes.score[i].score == '') {
              score_has_null = true;
              distList[index]["score_has_null"] = true;
              break
            }

            // 计算emp_type1 3 4  并且 rank[0] tag 0  type 3的 ABCD的数量,
            // emp_type  1 3 4核心岗：项目经理 业务架构师 小组长， 0 员工，
            // "score_type": "1" 项目绩效 0 综合绩效
            // "state": "7" 考核状态
            if (scoreRes.score[i].emp_type == '1' || scoreRes.score[i].emp_type == '3' || scoreRes.score[i].emp_type == '4') {
              if (isDeptAllEmp) {  // rank[0] tag 0  type 3
                if (keyTips == null) {
                  keyTips = {
                    "name": "关键岗位评级数量",
                    "A": 0,
                    "B": 0,
                    "C": 0,
                    "D": 0,
                    "AB": 0,
                    'COUNT': 0,   // 1 3 4 的
                    'hasFinish': 0
                  };
                }
                keyTips['COUNT']++;
                if (scoreRes.score[i].state === '10') {  // 考核完成
                  keyTips.hasFinish = 1;
                  keyTips[scoreRes.score[i].rank]++;
                  if (scoreRes.score[i].rank === 'A' || scoreRes.score[i].rank === 'B') {
                    keyTips['AB']++;
                  }
                }
              }
            }
          }
          empFlag = true;
        }
        if (empFlag && score_has_null && !rankFlag) {
          message.warning(splitEnter("未查询到该部门项目绩效员工正态分布比例及余数信息，请联系相关人员进行配置！<br/>尚有员工没有考核成绩，暂不能做正态分布！"), 8);
        }else if(scoreRes.RetCode === '2'){
          message.warning(scoreRes.RetVal, 3)
        } else if (keyTips && keyTips.hasFinish == 0) {
          message.warning(splitEnter("核心岗位人员尚未正态分布！"), 8)
        } else if (empFlag && score_has_null && rankFlag) {
          message.warning(splitEnter("尚有员工没有考核成绩，暂不能做正态分布！"), 8);
        } else if (empFlag && !score_has_null && !rankFlag) {
          message.warning(splitEnter("未查询到该部门项目绩效员工正态分布比例及余数信息，请联系相关人员进行配置！"), 8);
        } else if (!empFlag && rankFlag) {
          message.warning("该部门无待正态分布项目绩效员工！", 8);
        } else if (!empFlag && !rankFlag) {
          message.warning(splitEnter("该部门无待正态分布项目绩效员工！<br/>未查询到该部门项目绩效员工正态分布比例及余数信息，请联系相关人员进行配置！"), 8);
        }
        yield put({
          type: 'saveRes',
          distList,
          keyTips,
        });

        // scoreRes.RetCode === '2'的特殊处理
        if (scoreRes.RetCode === '2') {
          yield put({
            type: 'saveRes',
            distList,
            keyTips,
            disableFlag: true
          });
        } else {
          yield put({
            type: 'saveRes',
            distList,
            keyTips,
            rankNullFlag: rankNullFlag, // 存在考核结果为空的团队
          });
        }
      } else if (scoreRes.RetCode === '2') {
        // message.warning("未配置该群体考核规则，请联系后台人员进行处理！")
        message.warning(scoreRes.RetVal, 3)
      } else {
        message.error("未查询到待分布员工考核信息！")
      }
    },

        //文件导入
       *fileImport({param,number},{call,put,select}){
        let {distList}=yield select((state)=>state.dmdist)
        let data = yield call(service.deptImport,param);
        if(data.RetCode === '1'){
          distList[number].scores= data.score
          yield put({
            type: 'save',
            payload:{
              distList: [...distList],
            }
          });
        }
       },

      //原—get方式文件导出 
    // * outPut({postData}) {
    //   let{arg_mdzz,arg_tabId,arg_flag,arg_tenantid,arg_year,arg_season,arg_ou,arg_dept_name,arg_ranks}=postData
    //    let downloadURL = `/microservice/allexamine/examine/informationExport?arg_mdzz=${arg_mdzz}&arg_tabId=${arg_tabId}&arg_flag=${arg_flag}&arg_tenantid=${arg_tenantid}&arg_year=${arg_year}
    //     &arg_season=${arg_season}&arg_ou=${arg_ou}&arg_dept_name=${arg_dept_name}&arg_ranks=${arg_ranks}`
    //   window.open(downloadURL)
    // },

  },
  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/humanApp/employer/dmdistribute') {
          dispatch({type: 'backTime', query});
          openNotification('info')
         // dispatch({type: 'deptTabSearch', query});
        }
      });
    }
  }
};
