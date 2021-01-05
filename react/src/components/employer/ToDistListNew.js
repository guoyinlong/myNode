/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 * 文件说明：部门-正态分布组件
 */
import Cookie from 'js-cookie';
import * as service from '../../services/employer/empservices';

import RemainderInfo from './RemainderInfo'
import DistInfo from './DistInfo'
import PageSubmit from './PageSubmit'
import {Table, Input, Select, Button, Tooltip, InputNumber,Upload } from 'antd'
import Style from './employer.less'
import tableStyle from '../common/table.less'
import exportExl from '../commonApp/exportExl'
import {postExcelFile} from "../../utils/func.js"

const Option = Select.Option;
const staffId = Cookie.get('userid');
const importYear = new Date().getFullYear().toString();
const importSeason = (new Date().getMonth() + 1).toString();
const importDay = new Date().getDate().toString();
import message from '../../components/commonApp/message'

/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 * 功能：考核评级初始化
 * @returns {Array} list 标签select绑定的数据源
 */
function geneRank() {
  let list = [];
  list.push({"rank": "A"});
  list.push({"rank": "B"});//第一季度字显示AC，暂时注了-现在恢复
  list.push({"rank": "C"});
  list.push({"rank": "D"});//第一季度字显示AC，暂时注了-现在恢复
  list.push({"rank": "E"});//第一季度字显示AC，暂时注了-现在恢复
  return list;
}

/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 * 功能：获取本期考核等级比例及上期各级余数
 * @param rank 上季度余数信息
 * @returns {*} list 提取所需余数信息后组成的json串
 */
function geneRatio(rank) {
  if (!rank) {
    return null;
  }
  let list = {
    "a_ratio": rank.a_ratio,
    "a_remain": rank.a_remainder,
    "b_ratio": rank.b_ratio,
    "b_remain": rank.b_remainder,
    "c_ratio": rank.c_ratio,
    "c_remain": rank.c_remainder,
    "d_ratio": rank.d_ratio,
    "d_remain": rank.d_remainder
  };
  return list;
}

/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 * 功能：初始化评级建议数量
 * @param rankRatio 评级比例及余数信息
 * @param team_count 团队成员数量
 * @returns {Array} tips 评级比例、上期余数、建议数量、实际数量、本期余数等信息
 */
function tipsTransInit(rankRatio, team_count, keyTips) {
  let tips = [];
  /*if(!team_count){
    return tips;
  }*/
  tips.push({
    "name": "评级比例",
    "A": parseFloat(rankRatio.a_ratio),
    "B": parseFloat(rankRatio.b_ratio),
    "C": rankRatio.c_ratio,
    "D": rankRatio.d_ratio,
    "AB": parseFloat(rankRatio.a_ratio) + parseFloat(rankRatio.b_ratio)
  });
  tips.push({
    "name": "上期余数",
    "A": parseFloat(rankRatio.a_remain).toFixed(2),
    "B": parseFloat(rankRatio.b_remain).toFixed(2),
    "C": parseFloat(rankRatio.c_remain).toFixed(2),
    "D": parseFloat(rankRatio.d_remain).toFixed(2),
    "AB": (parseFloat(rankRatio.a_remain) + parseFloat(rankRatio.b_remain)).toFixed(2)
  });
  let t_AB = Math.floor(team_count * parseFloat(rankRatio.a_ratio) + parseFloat(rankRatio.a_remain)) + Math.floor(team_count * parseFloat(rankRatio.b_ratio) + parseFloat(rankRatio.b_remain));
  let tip = {
    A: team_count * parseFloat(rankRatio.a_ratio) + parseFloat(rankRatio.a_remain) > 0 ? Math.floor(team_count * parseFloat(rankRatio.a_ratio) + parseFloat(rankRatio.a_remain)) : 0,
    B: team_count * parseFloat(rankRatio.b_ratio) + parseFloat(rankRatio.b_remain) > 0 ? Math.floor(team_count * parseFloat(rankRatio.b_ratio) + parseFloat(rankRatio.b_remain)) : 0,
    C: team_count * parseFloat(rankRatio.c_ratio) + parseFloat(rankRatio.c_remain) > 0 ? Math.floor(team_count * parseFloat(rankRatio.c_ratio) + parseFloat(rankRatio.c_remain)) : 0,
    D: team_count * parseFloat(rankRatio.d_ratio) + parseFloat(rankRatio.d_remain) > 0 ? Math.floor(team_count * parseFloat(rankRatio.d_ratio) + parseFloat(rankRatio.d_remain)) : 0
  };
  //console.log("000tip:"+JSON.stringify(tip))

  if (tip.A > t_AB) {
    tip.A = t_AB;
  }
  if (tip.B > t_AB) {
    tip.B = t_AB;
  }
  tips.push({
    "name": "建议数量",
    "A": tip.A,
    "B": tip.B,
    "C": tip.C,
    "D": tip.D,
    //"AB":Math.floor(team_count *  parseFloat(rankRatio.a_ratio) + parseFloat(rankRatio.a_remain))+Math.floor(team_count *  parseFloat(rankRatio.b_ratio) + parseFloat(rankRatio.b_remain))});
    "AB": tip.A + tip.B
  });
 // debugger
  tips.push({
    "name": "本期余数",
    "A": ((team_count * parseFloat(rankRatio.a_ratio) + parseFloat(rankRatio.a_remain)).toFixed(2) - tips[2].A).toFixed(2),
    "B": ((team_count * parseFloat(rankRatio.b_ratio) + parseFloat(rankRatio.b_remain)).toFixed(2) - tips[2].B).toFixed(2),
    "C": ((team_count * parseFloat(rankRatio.c_ratio) + parseFloat(rankRatio.c_remain)).toFixed(2) - tips[2].C).toFixed(2),
    "D": ((team_count * parseFloat(rankRatio.d_ratio) + parseFloat(rankRatio.d_remain)).toFixed(2) - tips[2].D).toFixed(2),
    "AB": ((team_count * parseFloat(rankRatio.a_ratio) + parseFloat(rankRatio.a_remain) + team_count * parseFloat(rankRatio.b_ratio) + parseFloat(rankRatio.b_remain)).toFixed(2) - tips[2].A - tips[2].B).toFixed(2)
  });
  //console.log("111tips:"+JSON.stringify(tips))
  let sum = tips[2].A + tips[2].B + tips[2].C + tips[2].D;
  // while(sum != team_count){
  //   if(tips[3].A > 0 && tips[3].AB > 0){
  //     sum++;
  //     tips[2].A++;
  //     tips[3].A = parseFloat(tips[3].A -1).toFixed(2);
  //     tips[2].AB++;
  //     tips[3].AB = parseFloat(tips[3].AB -1).toFixed(2);
  //   }else if(tips[3].B > 0 && tips[3].AB > 0){
  //     sum++;
  //     tips[2].B++;
  //     tips[3].B = parseFloat(tips[3].B -1).toFixed(2);
  //     tips[2].AB++;
  //     tips[3].AB = parseFloat(tips[3].AB -1).toFixed(2);
  //   }else if(tips[3].C > 0){
  //     sum++;
  //     tips[2].C++;
  //     tips[3].C = parseFloat(tips[3].C -1).toFixed(2);
  //   }else if(tips[3].D > 0){
  //     sum++;
  //     tips[2].D++;
  //     tips[3].D = parseFloat(tips[3].D -1).toFixed(2);
  //   }
  // }
  if (sum < team_count) {
    while (sum != team_count) {
      if (tips[3].A > 0 && tips[3].AB > 0) {
        sum++;
        tips[2].A++;
        tips[3].A = parseFloat(tips[3].A - 1).toFixed(2);
        tips[2].AB++;
        tips[3].AB = parseFloat(tips[3].AB - 1).toFixed(2);
      } else if (tips[3].B > 0 && tips[3].AB > 0) {
        sum++;
        tips[2].B++;
        tips[3].B = parseFloat(tips[3].B - 1).toFixed(2);
        tips[2].AB++;
        tips[3].AB = parseFloat(tips[3].AB - 1).toFixed(2);
      } else if (tips[3].C > 0) {
        sum++;
        tips[2].C++;
        tips[3].C = parseFloat(tips[3].C - 1).toFixed(2);
      } else if (tips[3].D > 0) {
        sum++;
        tips[2].D++;
        tips[3].D = parseFloat(tips[3].D - 1).toFixed(2);
      } else {
        message.info('余数信息配置错误，请联系人力管理员！')
        break;
      }
    }
  } else if (sum > team_count) {
    while (sum != team_count) {
      if (tips[2].D > 0 && tips[3].D < 0) {
        sum--;
        tips[2].D--;
        tips[3].D = (parseFloat(tips[3].D) + 1).toFixed(2);
      } else if (tips[2].C > 0) {
        sum--;
        tips[2].C--;
        tips[3].C = (parseFloat(tips[3].C) + 1).toFixed(2);
      } else if (tips[3].B > 0) {
        sum--;
        tips[2].B--;
        tips[3].B = (parseFloat(tips[3].B) + 1).toFixed(2);
        tips[2].AB--;
        tips[3].AB = (parseFloat(tips[3].AB) + 1).toFixed(2);
      } else if (tips[3].A > 0) {
        sum--;
        tips[2].A--;
        tips[3].A = (parseFloat(tips[3].A) + 1).toFixed(2);
        tips[2].AB--;
        tips[3].AB = (parseFloat(tips[3].AB) + 1).toFixed(2);
      } else {
        message.info('余数信息配置错误，请联系人力管理员！')
        break;
      }
    }
  }
  let t = {A: 0, B: 0, C: 0, D: 0};
  for (let i = 0; i < team_count; i++) {
    if (i + 1 <= tips[2].A)
      t.A++;
    else if (i + 1 <= tips[2].AB)
      t.B++;
    else if (i + 1 <= tips[2].AB + tips[2].C)
      t.C++;
    else
      t.D++;
  }
  /*tips.splice(3,0,{"name":"实际数量",
    "A":tips[2].A>0?tips[2].A:0,
    "B":tips[2].B>0?tips[2].B:0,
    "C":tips[2].C>0?tips[2].C:0,
    "D":tips[2].D>0?tips[2].D:0,
    "AB":tips[2].A+tips[2].B});*/
  tips.splice(3, 0, {
    "name": "实际数量",
    "A": t.A,
    "B": t.B,
    "C": t.C,
    "D": t.D,
    "AB": t.A + t.B
  });
  //console.log("222tips:"+JSON.stringify(tips))
  if (keyTips) { //有核心岗位员工
    tips[3]['A'] = tips[3]['A'] - keyTips.A;
    tips[3]['A+'] = keyTips.A;
    tips[3]['B'] = tips[3]['B'] - keyTips.B;
    tips[3]['B+'] = keyTips.B;
    tips[3]['AB'] = tips[3]['AB'] - keyTips.AB;
    tips[3]['AB+'] = keyTips.AB;
    tips[3]['C'] = tips[3]['C'] - keyTips.C;
    tips[3]['C+'] = keyTips.C;
    tips[3]['D'] = tips[3]['D'] - keyTips.D;
    tips[3]['D+'] = keyTips.D;
  }
  return tips;
}

/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 * 功能：系统默认项目成员考核等级
 * @param index 员工在列表中索引
 * @param tips 评级信息数组
 * @returns {*} 该员工默认评级
 */
function initRank(index, tips) {
  if (index + 1 <= tips[2].A - (tips[3]['A+'] ? tips[3]['A+'] : 0))
    return 'A';
  if (index + 1 <= tips[2].AB - (tips[3]['AB+'] ? tips[3]['AB+'] : 0)) // 第一季度需求，暂时注了-现在恢复
   return 'B';
  if (index + 1 <= tips[2].AB - (tips[3]['AB+'] ? tips[3]['AB+'] : 0) + tips[2].C - (tips[3]['C+'] ? tips[3]['C+'] : 0))
    return 'C';
  else  //第一季度需求，暂时注了-现在恢复
   return 'D';
}
/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 * 功能：排序
 * @param submitTips 提示信息
 * @param changedRank 评级变更记录数组
 * @param empList 员工考核结果列表
 * @param team_count 团队成员数量
 * @returns {boolean} flag 是否成功排序
 */
function empScoreSort(submitTips, changedRank, empList, team_count) {
  let flag = false;
  if (submitTips.degree_sum != 100) {
    message.warning('贡献度权重和不为100，请调整后再排序！');
  } else if (submitTips.degree_has_null == true) {
    message.warning('有员工的贡献度权重为空，请调整后再排序！');
  } else if (submitTips.score_has_null == true) {
    message.warning('有员工的考核结果为空，尚不能排序！');
  } else {
    empList.sort(function (n1, n2) {
      //return (parseFloat(n2.last_score) - parseFloat(n1.last_score)) || (parseInt(n1.staff_id) - parseInt(n2.staff_id))
      return (parseFloat(n1.order) - parseFloat(n2.order)) || (parseInt(n2.score) - parseInt(n1.score))
    });//排序
    for (let i = 0; i < team_count; i++) {
      changedRank[i].rank = empList[i].rank;
    }
    flag = true;
  }
  return flag;
}

/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 * 功能：判断贡献度调整说明是否填写
 * @param empList 员工考核结果列表
 * @returns {boolean} 调整过贡献度的是否全部书写调整说明
 */
function judgeDegree(empList) {
  for (let i = 0; i < empList.length; i++) {
    if (parseFloat(empList[i].cont_degree).toFixed(3) != parseFloat(empList[i].ori_degree).toFixed(3) && !empList[i].adjust_reason) {
      return true;
    }
  }
  return false;
}

/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 * 功能：判断当前评级是否符合规则
 * @param empList 员工考核结果列表
 * @returns {{A: *, B: *, C: *, D: *, E: *} sort 是否满足得分高的评级在前规则
 */
function judgeLastScore(empList) {
  //console.log("empList",empList)
  let sort = {
    "A": {"max": -1, "min": 10001, "rank": 'A'},
    "B": {"max": -1, "min": 10001, "rank": 'B'},
    "C": {"max": -1, "min": 10001, "rank": 'C'},
    "D": {"max": -1, "min": 10001, "rank": 'D'},
    "E": {"max": -1, "min": 10001, "rank": 'E'},
    "com_rule": 0
  };
  for (let i = 0; i < empList.length; i++) {
    if (empList[i].rank == 'A') {
      if (empList[i].score * empList[i].cont_degree > sort.A.max) {
        sort.A.max = empList[i].score * empList[i].cont_degree;
      }
      if (empList[i].score * empList[i].cont_degree < sort.A.min) {
        sort.A.min = empList[i].score * empList[i].cont_degree;
      }
    } else if (empList[i].rank == 'B') {
      if (empList[i].score * empList[i].cont_degree > sort.B.max) {
        sort.B.max = empList[i].score * empList[i].cont_degree;
      }
      if (empList[i].score * empList[i].cont_degree < sort.B.min) {
        sort.B.min = empList[i].score * empList[i].cont_degree;
      }
    } else if (empList[i].rank == 'C') {
      if (empList[i].score * empList[i].cont_degree > sort.C.max) {
        sort.C.max = empList[i].score * empList[i].cont_degree;
      }
      if (empList[i].score * empList[i].cont_degree < sort.C.min) {
        sort.C.min = empList[i].score * empList[i].cont_degree;
      }
    } else if (empList[i].rank == 'D') {
      if (empList[i].score * empList[i].cont_degree > sort.D.max) {
        sort.D.max = empList[i].score * empList[i].cont_degree;
      }
      if (empList[i].score * empList[i].cont_degree < sort.D.min) {
        sort.D.min = empList[i].score * empList[i].cont_degree;
      }
    } else if (empList[i].rank == 'E') {
      if (empList[i].score * empList[i].cont_degree > sort.E.max) {
        sort.E.max = empList[i].score * empList[i].cont_degree;
      }
      if (empList[i].score * empList[i].cont_degree < sort.E.min) {
        sort.E.min = empList[i].score * empList[i].cont_degree;
      }
    }
  }
  if (sort.B.min == 10001) {
    sort.B.min = sort.A.min;
    sort.B.rank = sort.A.rank;
  }
  if (sort.C.min == 10001) {
    sort.C.min = sort.B.min;
    sort.C.rank = sort.B.rank;
  }
  if (sort.D.min == 10001) {
    sort.D.min = sort.C.min;
    sort.D.rank = sort.C.rank;
  }
  if (parseFloat(sort.A.min) < parseFloat(sort.B.max)) {
    sort.com_rule = 1;
  } else if (parseFloat(sort.B.min) < parseFloat(sort.C.max)) {
    sort.com_rule = 2;
  } else if (parseFloat(sort.C.min) < parseFloat(sort.D.max)) {
    sort.com_rule = 3;
  } else if (parseFloat(sort.D.min) < parseFloat(sort.E.max)) {
    sort.com_rule = 4;
  }
  return sort;
}

/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 * 功能：根据提交状态初始化页面
 * @param tag 结果提交状态，0：未提交   1：已提交
 * @param rankRatio 评级比例及余数信息
 * @param team_count 团队成员数量
 * @param empList 员工考核结果列表
 * @param tips 评级比例、上期余数、建议数量、实际数量、本期余数等信息
 * @param changedRank 评级变更记录数组
 * @param submitTips 提示信息
 */
function initPageByTag(tag, rankRatio, team_count, empList, tips, changedRank, submitTips, initTips) {
  submitTips.degree_sum = 100;
  submitTips.degree_has_null = false;
  submitTips.score_has_null = false;
  if (tag === '0') {
    // empList.sort(function(n1,n2){
    //   return (parseFloat(n2.score) - parseFloat( n1.score))||(parseInt(n1.staff_id) - parseInt( n2.staff_id))
    // });//排序

    tips.splice(0, tips.length);
    changedRank.splice(0, changedRank.length);
    /*for(let i = 0;i < initTips.length;i++){
      tips.push(initTips[i]);
    }*/
    deepCopyTips(tips, initTips);
    let every = 0;
    if (100 % team_count == 0) {
      every = (parseFloat(100) / team_count).toFixed(3);
    } else {
      every = (parseFloat(100) / team_count - 0.0005).toFixed(3);
    }
    for (let i = 0; i < team_count; i++) {
      if (i != team_count - 1) {
        empList[i]["ori_degree"] = every;
      } else {
        empList[i]["ori_degree"] = (parseFloat(100) - (team_count - 1) * every).toFixed(3);
        if (empList[i].ori_degree > every) {
          empList[0].ori_degree = empList[i].ori_degree;
          empList[i].ori_degree = every;
        }
      }
    }
    for (let i = 0; i < team_count; i++) {
      if (!empList[i].cont_degree) {
        empList[i].cont_degree = empList[i].ori_degree;
      }
      if (empList[i].score == undefined || empList[i].score == '') {
        submitTips.score_has_null = true;
        changedRank.push({"rank": ''});
        empList[i].last_score = 0;
        // console.log(i+":"+empList[i].staff_name+":"+empList[i].last_score);
      } else {
        empList[i].last_score = (empList[i].score * empList[i].cont_degree).toFixed(3);
        empList[i].rankList = geneRank();
        let r = initRank(i, tips);
        // console.log(i+":"+empList[i].staff_name+":"+empList[i].last_score+r);
        changedRank.push({"rank": r});
        if (empList[i].rank) {
          reComRemainder(i, changedRank, empList, tips);
        } else {
          empList[i].rank = r;
        }
      }

      empList[i]["order"] = i + 1;
    }
    empList.sort(function (n1, n2) {
      return (parseFloat(n2.last_score) - parseFloat(n1.last_score)) || (parseFloat(n2.score) - parseFloat(n1.score)) || (parseInt(n1.staff_id) - parseInt(n2.staff_id))
    });//排序

    //排序时需将原changedRank数组相应转换
    for (let i = 0; i < team_count; i++) {
      empList[i]["order"] = i + 1;
      changedRank[i].rank = empList[i].rank;
    }

    weightSum(team_count, empList, submitTips);
  } else {
    if (empList != undefined) {
      for (let i = 0; i < empList.length; i++) {
        empList[i].cont_degree = (empList[i].cont_degree * 1).toFixed(3);
        empList[i].last_score = (empList[i].score * empList[i].cont_degree).toFixed(3);
      }
      empList.sort(function (n1, n2) {
        //return (n1.rank > n2.rank) || (parseFloat(n2.score * n2.cont_degree) - parseFloat( n1.score * n1.cont_degree)) || (parseInt(n1.staff_id) - parseInt( n2.staff_id))
        if (n1.rank < n2.rank) {
          return -1;
        } else if (n1.rank > n2.rank) {
          return 1;
        } else {
          if (parseFloat(n1.score * n1.cont_degree) < parseFloat(n2.score * n2.cont_degree)) {
            return 1;
          } else if (parseFloat(n1.score * n1.cont_degree) > parseFloat(n2.score * n2.cont_degree)) {
            return -1;
          } else {
            if (parseInt(n1.staff_id) < parseInt(n2.staff_id)) {
              return -1;
            } else if (parseInt(n1.staff_id) > parseInt(n2.staff_id)) {
              return 1;
            } else {
              return 0;
            }
          }
        }
      });//排序

      for (let i = 0; i < empList.length; i++) {
        empList[i]["order"] = i + 1;
      }
    }
  }
}

/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-12-23
 * 功能：深复制tips
 * @param initTips 初始化tips
 */
function deepCopyTips(tips, initTips) {
  for (let i = 0; i < initTips.length; i++) {
    //tips.push(initTips[i]);
    tips.push({
      "name": initTips[i].name,
      "A": initTips[i].A,
      "B": initTips[i].B,
      "C": initTips[i].C,
      "D": initTips[i].D,
      "AB": initTips[i].AB
    });
    if (i == 3) {
      tips[i]["A+"] = initTips[i]['A+'];
      tips[i]["B+"] = initTips[i]['B+'];
      tips[i]["C+"] = initTips[i]['C+'];
      tips[i]["D+"] = initTips[i]['D+'];
      tips[i]["AB+"] = initTips[i]['AB+'];
    }
  }
}

/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 * 功能：重新计算考核评级数量及余数信息
 * @param index 员工在列表中索引
 * @param changedRank 评级变更记录数组
 * @param empList 员工考核结果列表
 * @param tips 评级比例、上期余数、建议数量、实际数量、本期余数等信息
 */
function reComRemainder(index, changedRank, empList, tips) {
  //debugger
  //console.log(changedRank[index].rank  + "-------" +  empList[index].rank);
  let before = changedRank[index].rank == 'E' ? 'D' : changedRank[index].rank;
  let now = empList[index].rank == 'E' ? 'D' : empList[index].rank;
  tips[3][before]--;
  tips[3][now]++;
  tips[4][before] = (parseFloat(tips[4][before]) + 1).toFixed(2);
  tips[4][now] = (parseFloat(tips[4][now]) - 1).toFixed(2);
  tips[3]['AB'] = tips[3]['A'] + tips[3]['B'];
  tips[4]['AB'] = (parseFloat(tips[4]['A']) + parseFloat(tips[4]['B'])).toFixed(2);
  changedRank[index].rank = empList[index].rank;
}

/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 * 功能：贡献度权重求和，并判断是否有空值
 * @param team_count 团队成员数量
 * @param empList 员工考核结果列表
 * @param submitTips 提示信息
 */
function weightSum(team_count, empList, submitTips) {
  submitTips.degree_sum = 0;
  submitTips.degree_has_null = false;
  for (let i = 0; i < team_count; i++) {
    if (empList[i].cont_degree != undefined && empList[i].cont_degree != '') {
      submitTips.degree_sum += parseFloat(empList[i].cont_degree);
      if (empList[i].score != undefined && empList[i].score != '') {
        empList[i].last_score = (empList[i].score * empList[i].cont_degree).toFixed(3);
      }
    } else {
      submitTips.degree_has_null = true;
    }
    if (parseFloat(empList[i].cont_degree).toFixed(3) != parseFloat(empList[i].ori_degree).toFixed(3)) {
      empList[i].placeholder = "请输入贡献度调整说明...";
    } else {
      empList[i].placeholder = "字数100字以内...";
    }
  }
  submitTips.degree_sum = (submitTips.degree_sum).toFixed(3);
}

/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 * 功能：重新计算考核等级各级余数
 * @param index 员工在列表中索引
 * @param changedRank 评级变更记录数组
 * @param empList 员工考核结果列表
 * @param tips 评级比例、上期余数、建议数量、实际数量、本期余数等信息
 */
function recount(index, changedRank, empList, tips) {
  let sort = judgeLastScore(empList);
  if (sort.com_rule == 1) {  //一季度人力需求 2020-3-4 暂注
    message.error("调整后，存在评级为B的员工总分大于评级为A的分数，请调整贡献度后再调整评级！", "6");
    empList[index].rank = changedRank[index].rank;
    return;
  } else if (sort.com_rule == 2) {
    message.error("调整后，存在评级为C的员工总分大于评级为" + sort.B.rank + "的分数，请调整贡献度后再调整评级！", "6");
    empList[index].rank = changedRank[index].rank;
    return;
  } else if (sort.com_rule == 3) {//一季度人力需求 2020-3-4 暂注
    message.error("调整后，存在评级为D的员工总分大于评级为" + sort.C.rank + "的分数，请调整贡献度后再调整评级！", "6");
    empList[index].rank = changedRank[index].rank;
    return;
  } else if (sort.com_rule == 4) {//一季度人力需求 2020-3-4 暂注
    message.error("调整后，存在评级为E的员工总分大于评级为" + sort.D.rank + "的分数，请调整贡献度后再调整评级！", "6");
    empList[index].rank = changedRank[index].rank;
    return;
  } else {
    reComRemainder(index, changedRank, empList, tips);
  }
}

/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 * 功能：根据贡献度自动调整考核评级
 * @param team_count 团队成员数量
 * @param empList 员工考核结果列表
 * @param changedRank 评级变更记录数组
 * @param tips 评级比例、上期余数、建议数量、实际数量、本期余数等信息
 * @param rankRatio 评级比例及余数信息
 */
function autoRankByDegree(team_count, empList, changedRank, tips, rankRatio, initTips) {
  let newList = [];
  for (let i = 0; i < team_count; i++) {
    newList.push({
      "id": empList[i].id,
      "staff_id": empList[i].staff_id,
      "last_score": empList[i].last_score,
      "rank": '',
      "sort": i
    });
  }
  newList.sort(function (n1, n2) {
    return (parseFloat(n2.last_score) - parseFloat(n1.last_score)) || (parseInt(n1.staff_id) - parseInt(n2.staff_id))
  });//排序

  tips.splice(0, tips.length); //防止本期余数改变 2020-3-24 已还原代码
  changedRank.splice(0, changedRank.length);
  /*for(let i = 0;i < initTips.length;i++){
    tips.push(initTips[i]);
  }*/
  deepCopyTips(tips, initTips);//防止本期余数改变 2020-3-24 

  for (let i = 0; i < team_count; i++) {
     let r = initRank(i, tips); //增加导入后，改贡献度时，根据建议数量评级功能关闭 2020-3-24 已还原代码
      newList[i].rank = r; //增加导入后，改贡献度时，根据建议数量评级功能关闭 2020-3-24 已还原代码
    newList[i].order = i + 1;
  }

  newList.sort(function (n1, n2) {
    return parseInt(n1.sort) - parseInt(n2.sort)
  });//排序

  for (let i = 0; i < team_count; i++) {
    empList[i].rank = newList[i].rank;//增加导入后，改贡献度时，根据建议数量评级功能关闭 2020-3-24 已还原代码
    empList[i].order = newList[i].order;
    changedRank.push({"rank": newList[i].rank});
  }
  //console.log("调整贡献度:"+empList[0].rank)
  //console.log("newList:"+JSON.stringify(newList))
  //console.log("empList:"+JSON.stringify(empList))
}

/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 * 功能：判断余数是否合规
 * @param tips 评级比例、上期余数、建议数量、实际数量、本期余数等信息
 * @returns {boolean} 余数是否满足规则，A和AB大于-1，D小于1
 */
function judgeRemian(tips) {
  if (tips[4].A <= -1) {
    return false;
  }
  if (tips[4].AB <= -1) {
    return false;
  }
  if (tips[4].D >= 1) {
    return false;
  }
  return true;
}

/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 * 功能：提交前判断，生成提示信息
 * @param submitTips 提示信息
 * @param tips 评级比例、上期余数、建议数量、实际数量、本期余数等信息
 * @param empList 员工考核结果列表
 * @returns {boolean} 是否满足提交条件
 */
function submitTip(submitTips, tips, empList) {
  let flag = false;
  if (!tips || tips.length == 0) {
    message.error('评级比例、余数信息为空！');
  } else if (submitTips.score_has_null == true) {
    message.warning("尚有员工没有考核成绩，当前正态分布结果无效，不能提交！");
  } else if (submitTips.degree_has_null == true) {
    message.warning('有员工的贡献度权重为空，请调整后再提交！');
  } else if (submitTips.degree_sum != 100) {
    message.warning("贡献度权重和不为100，请调整后再提交！");
  } else if (judgeDegree(empList) == true == true) {
    message.warning("尚有贡献度调整说明未填写，请填写后再提交！");
  } else if (judgeRemian(tips) == false) {
    message.warning("考核评级余数超出规定范围，请检查后再提交！");
  } else {
    let sort = judgeLastScore(empList);
    if (sort.com_rule == 1) {
      message.error("存在评级为B的员工总分大于评级为A的分数，请调整评级后再提交结果！", "6");
    } else if (sort.com_rule == 2) {
      message.error("存在评级为C的员工总分大于评级为" + sort.B.rank + "的分数，请调整评级后再提交结果！", "6");
    } else if (sort.com_rule == 3) {
      message.error("存在评级为D的员工总分大于评级为" + sort.C.rank + "的分数，请调整评级后再提交结果！", "6");
    } else if (sort.com_rule == 4) {
      message.error("存在评级为E的员工总分大于评级为" + sort.D.rank + "的分数，请调整评级后再提交结果！", "6");
    } else {
      flag = true;
    }
  }
  return flag;
}

/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 * 功能：转换项目成员本期正态分布结果
 * @param team_count 团队成员数量
 * @param empList 员工考核结果列表
 * @returns {Array} 正态分布结果提交数据
 */
function geneRankList(team_count, empList) {
  //debugger
  let rankList = [];
  for (let i = 0; i < team_count; i++) {
    let idArray = empList[i].id.split(',');
    for (let j = 0; j < idArray.length; j++) {
      //rankList.push({"id":empList[i].id,"staff_id":empList[i].staff_id,"staff_name":empList[i].staff_name,"rank":empList[i].rank,"cont_degree":empList[i].cont_degree.toString(),"adjust_reason":empList[i].adjust_reason == undefined ?'无调整':empList[i].adjust_reason,"proj_id":empList[i].proj_id});
      rankList.push({
        "id": idArray[j],
        "staff_id": empList[i].staff_id,
        "staff_name": empList[i].staff_name,
        "rank": empList[i].rank,
        "cont_degree": empList[i].cont_degree.toString(),
        "adjust_reason": empList[i].adjust_reason == undefined ? '无调整' : empList[i].adjust_reason,
        "proj_id": empList[i].proj_id_0 ? empList[i].proj_id_0.split(',')[j] : null,
         "OU":empList[i].ou,
         "score":empList[i].score||""
      });
    }
  }
  return rankList;
}

/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 * 功能：生成下期余数
 * @param rankRatio 评级比例及余数信息
 * @param tips 评级比例、上期余数、建议数量、实际数量、本期余数等信息
 * @param year 考核年度
 * @param season 考核季度
 * @returns {*} 下季度考核余数信息
 */
function geneProjRemain(rankRatio, tips, year, season) {
  delete rankRatio.id;
  rankRatio.a_remainder = tips[4].A.toString();
  rankRatio.b_remainder = tips[4].B.toString();
  rankRatio.c_remainder = tips[4].C.toString();
  rankRatio.d_remainder = tips[4].D.toString();
  rankRatio.e_ratio = '0';
  rankRatio.e_remainder = '0';

  if (season == '0') {
    rankRatio.year = (parseInt(year) + 1).toString();
  } else if (season == '4') {
    rankRatio.year = (parseInt(year) + 1).toString();
    rankRatio.season = '1';
  } else {
    rankRatio.season = (parseInt(season) + 1).toString();
  }
  return rankRatio;
}

/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 * 功能：根据排名生成贡献度，自动调整评级
 * @param team_count 团队成员数量
 * @param empList 员工考核结果列表
 * @param changedRank 评级变更记录数组
 * @param tips 评级比例、上期余数、建议数量、实际数量、本期余数等信息
 * @param rankRatio 评级比例及余数信息
 */
function autoRankByOrder(team_count, empList, changedRank, tips, rankRatio, initTips) {
  let newList = [];
  for (let i = 0; i < team_count; i++) {
    newList.push({
      "id": empList[i].id,
      "staff_id": empList[i].staff_id,
      "staff_name": empList[i].staff_name,
      "score": empList[i].score,
      "last_score": empList[i].last_score,
      "rank": '',
      "order": empList[i].order,
      "sort": i
    });
  }
  newList.sort(function (n1, n2) {
    return (parseFloat(n1.order) - parseFloat(n2.order)) || (parseInt(n2.score) - parseInt(n1.score))
  });//排序
  let initDegreeSum = 0;
  for (let i = team_count - 1; i >= 0; i--) {
    if (i == team_count - 1) {
      newList[i]["init_degree"] = 1;
    } else {
      //console.log(newList[i]["staff_name"]+"截取前:"+newList[i+1]["init_degree"] * newList[i+1]["score"] / newList[i]["score"])
      newList[i]["init_degree"] = (newList[i + 1]["init_degree"] * newList[i + 1]["score"] / newList[i]["score"]).toFixed(6);
      if (newList[i]["init_degree"] * newList[i]["score"] < newList[i + 1]["init_degree"] * newList[i + 1]["score"]) {
        newList[i]["init_degree"] = parseFloat(newList[i]["init_degree"]) + 0.000001;
      }
      //newList[i]["init_degree"] = newList[i+1]["init_degree"] * newList[i+1]["score"] / newList[i]["score"] ;
    }
    //console.log(newList[i]["staff_name"]+":"+newList[i]["init_degree"])
    //initDegreeSum = (parseFloat(initDegreeSum) +  parseFloat(newList[i]["init_degree"])).toFixed(6);
    initDegreeSum = parseFloat(initDegreeSum) + parseFloat(newList[i]["init_degree"]);
  }
  //console.log("initDegreeSum:"+initDegreeSum)
  let degreeSum = 0;
  for (let i = 0; i < team_count; i++) {
    if (i == 0) {
      newList[i]["degree"] = (newList[i]["init_degree"] * 100 / initDegreeSum).toFixed(3);
    } else {
      //console.log(newList[i]["staff_name"]+":"+newList[i-1]["degree"] * newList[i-1]["score"] / newList[i]["score"])
      //console.log(newList[i]["staff_name"]+":"+(newList[i-1]["degree"] * newList[i-1]["score"] / newList[i]["score"]).toFixed(3))
      newList[i]["degree"] = (newList[i - 1]["degree"] * newList[i - 1]["score"] / newList[i]["score"]).toFixed(3);
      if (newList[i]["degree"] * newList[i]["score"] > newList[i - 1]["degree"] * newList[i - 1]["score"]) {
        newList[i]["degree"] = (newList[i]["degree"] - 0.001).toFixed(3);
      }
    }
    //console.log(newList[i]["staff_name"]+":"+newList[i]["degree"])
    degreeSum = (parseFloat(degreeSum) + parseFloat(newList[i]["degree"])).toFixed(3);
  }
  //console.log("degreeSum:"+degreeSum)
  newList[0]["degree"] = (parseFloat(newList[0]["degree"]) + parseFloat(100) - degreeSum).toFixed(3);
  //console.log(newList[0]["staff_name"]+":"+newList[0]["degree"])

  tips.splice(0, tips.length);
  changedRank.splice(0, changedRank.length);
  /*for(let i = 0;i < initTips.length;i++){
    tips.push(initTips[i]);
  }*/
  deepCopyTips(tips, initTips);
  for (let i = 0; i < team_count; i++) {
    let r = initRank(i, tips);
    newList[i].rank = r;

  }
  newList.sort(function (n1, n2) {
    return parseInt(n1.sort) - parseInt(n2.sort)
  });//排序

  for (let i = 0; i < team_count; i++) {
    empList[i].rank = newList[i].rank;
    empList[i].cont_degree = newList[i].degree;
    changedRank.push({"rank": newList[i].rank});
  }
  //console.log("调整排名:"+empList[0].rank)
  //console.log("newList:"+JSON.stringify(newList))
  //console.log("empList:"+JSON.stringify(empList))
}

/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-11-28
 * 功能：计算关键岗位员工数量
 * @param empList 待分布员工
 */
function keyEmpCount(empList) {
  //let hasFinish = false;
  let keyTips = {"name": "关键岗位评级数量", "A": 0, "B": 0, "C": 0, "D": 0, "AB": 0, 'COUNT': 0, 'hasFinish': 0};
  for (let i = 0; empList && i < empList.length; i++) {
    if (empList[i].emp_type == 1 || empList[i].emp_type == 3 || empList[i].emp_type == 4) {
      keyTips['COUNT']++;
      if (empList[i].state === '10') {
        //hasFinish = true;
        keyTips.hasFinish = 1;
        keyTips[empList[i].rank]++;
        if (empList[i].rank === 'A' || empList[i].rank === 'B') {
          keyTips['AB']++;
        }
      }
    }
  }
  //return hasFinish ? keyTips : null;

  return keyTips;
}

/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 * 功能：正态分布组件
 */
class ToDistList extends React.Component {
  state = ({
    initTips: [],
    tips: [],
    keyTips: {},
    submitTips: {"degree_sum": 100, "degree_has_null": false, "score_has_null": false},
    score_flage:false,
    rankRatio: {},
    changedRank: [],
    team_count: 0,
    empList: [],
    columns: [],
    keyList: [],
    disableFlag: false,
    rankNullFlag: false,
    import: {
      action: "/filemanage/fileupload?argappname=dmdistribute&argtenantid=10010&arguserid=" + staffId + "&argyear=" + importYear +
      "&argmonth=" + importSeason + "&argday=" + importDay,
      method: "POST",
      name: "outsourcer",
      multiple: false,
      showUploadList: false,
      listType: 'text',
      accept: '.xlsx,.xls',
      onChange: (info) => {
        if (info.file.status === 'done') {
          if (info.file.response.RetCode == '1') {
            const {dispatch} = this.props;
            let postData = {};
            postData["arg_mdzz"] = "1";
            postData["arg_tabId"] =this.props.tabid+"";
            postData["arg_flag"] ="0";
            postData["arg_param"] ={};
            postData["arg_param"]["arg_year"]=this.props.year;
            postData["arg_param"]["arg_season"]=this.props.season;
            postData["arg_param"]["arg_ou"]=localStorage.getItem("ou");
            postData["arg_param"]["arg_dept_name"]=this.props.dept_name
            postData["arg_param"]=JSON.stringify(postData["arg_param"])
            postData["arg_tenantid"] = Cookie.get('tenantid')+"";
            postData["xlsfilepath"] = info.file.response.outsourcer.RelativePath;
            dispatch({
              type:'dmdist/fileImport',
              param:postData,
              number:this.props.tableID
            });
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 导入失败！.`);
          }
        }
      }
    }
  })


 // disabled={this.state.disableFlag ||this.state.rankNullFlag ||score_flage}
  /**
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-08-20
   * 功能：生成正态分布表格数据源
   * @param props 父组件参数
   * @param team_count 团队成员数量
   * @param isAll 是否显示一次分布结果
   * @returns {*}
   */
  getColumns = (props, team_count, keyTips, season) => {
    let disableFlag = props.disableFlag;
    let rankNullFlag = props.rankNullFlag;
    let inMultipleDept = props.inMultipleDept;

    const {tag, type} = props.rankRatio;
    let {score_has_null} = props;

    if (keyTips) {
      score_has_null = keyTips.hasFinish == 1 ? score_has_null : true;
      this.setState({
        score_flage:score_has_null
      })

    }else{
      this.setState({
        score_flage:score_has_null
      })
    }
   
    let columns;
    let keyCount = keyTips ? keyTips.COUNT : 0;
    if (season === '0') {
      //年度考核
      columns = [
        {
          title: '排名',
          dataIndex: 'order',
          width: '30px',
          render: (text, row, index) => {
            if (inMultipleDept) { // 存在一个人在多个部门 不能编辑
              return <p style={{textAlign: 'right'}}>{text || ''}</p>
            }
            // tag rank[0].tag
            return <div>
              {
                tag == '0' && index >= keyCount || (keyTips && keyTips.hasFinish == 0) ?
                  <Tooltip placement="topLeft" arrowPointAtCenter
                           title={score_has_null ? '尚有员工无考核成绩，不能调整排名' : (row.score ? `排名范围1~` + team_count : '未评分,不能调整排名')}>
                    <InputNumber
                      disabled={!row.score || score_has_null}
                      id={'index' + index}
                      min={1}
                      max={team_count}
                      step={1} precision={0} defaultValue={text || 0} value={text || 0}
                      onChange={(e) => this.handleChange(e, "order", index - keyCount)}
                      style={{margin: '0'}}
                    />
                  </Tooltip>
                  :
                  ((tag == '0' && index < keyCount && (keyTips && keyTips.hasFinish == 1))
                    ?
                    <p style={{textAlign: 'right'}}>{index + 1}</p>
                    :
                    <p style={{textAlign: 'right'}}>{text || ''}</p>)
              }
            </div>
          }
        },
        {
          title: '姓名',
          dataIndex: 'staff_name',
          width: '80px',
          render: (text, row, index) => {
            return <p>{text}</p>
          }
        },
        {
          title: '第一季度',
          dataIndex: 'rank_1',
          width: '35px',
          render: (text, row, index) => {
            return <div>
              {row.state_1 ? row.state_1 === '10' ?
                <p style={{textAlign: 'center'}}>{text}</p> : '?' : '-'}
            </div>
          }
        },
        {
          title: '第二季度',
          dataIndex: 'rank_2',
          width: '35px',
          render: (text, row, index) => {
            return <div>
              {row.state_2 ? row.state_2 === '10' ?
                <p style={{textAlign: 'center'}}>{text}</p> : '?' : '-'}
            </div>
          }
        },
        {
          title: '第三季度',
          dataIndex: 'rank_3',
          width: '35px',
          render: (text, row, index) => {
            return <div>
              {row.state_3 ? row.state_3 === '10' ?
                <p style={{textAlign: 'center'}}>{text}</p> : '?' : '-'}
            </div>
          }
        },
        {
          title: '第四季度',
          dataIndex: 'rank_4',
          width: '35px',
          render: (text, row, index) => {
            return <div>
              {row.state_4 ? row.state_4 === '10' ?
                <p style={{textAlign: 'center'}}>{text}</p> : '?' : '-'}
            </div>
          }
        },
        {
          title: '员工互评',
          dataIndex: 'mutualScore',
          width: '35px',
          render: (text, row, index) => {
            return <div>
              <p style={{textAlign: 'right'}}>{text}</p>
            </div>
          }
        },
        {
          title: '得分',
          dataIndex: 'score',
          width: '35px',
          render: (text, row, index) => {
            return <div>
              <p style={{textAlign: 'right'}}>{text}</p>
            </div>
          }
        },
        {
          title: '贡献度',
          dataIndex: 'cont_degree',
          width: '65px',
          render: (text, row, index) => {
            if (inMultipleDept) { // 存在一个人在多个部门 不能编辑
              return <p style={{textAlign: 'right'}}>{text || ''}</p>
            }

            return <div>{tag == '0' && index >= keyCount || (keyTips && keyTips.hasFinish == 0) ?
              <Tooltip placement="topLeft" arrowPointAtCenter
                       title={score_has_null ? '尚有员工无考核成绩，不能调整贡献度' : (row.score ? `贡献度范围0-100,精确到3位小数` : '未评分,不能调整贡献度')}>
                <InputNumber
                  disabled={!row.score || score_has_null}
                  id={'cont_degree' + index}
                  min={0}
                  max={100}
                  step={0.1} precision={3} defaultValue={text || 0} value={text || 0}
                  onChange={(e) => this.handleChange(e, "cont_degree", index - keyCount)}
                />
              </Tooltip> :
              <p style={{textAlign: 'right'}}>{text || ''}</p>}
            </div>
          }
        },
        {
          title: '贡献度调整说明',
          dataIndex: 'adjust_reason',
          width: '20%',
          render: (text, row, index) => {
            if (inMultipleDept) { // 存在一个人在多个部门 不能编辑
              return <p style={{textAlign: 'right'}}>{text || ''}</p>
            }

            return <div>{tag == '0' && index >= keyCount || (keyTips && keyTips.hasFinish == 0) ?
              <Tooltip style={{textAlign: 'left'}} placement="topLeft" arrowPointAtCenter
                       title={score_has_null ? '尚有员工无考核成绩，不能填写贡献度调整说明' : (
                         row.score ? row.adjust_reason && row.adjust_reason.length > 90 ? `字数100字以内...` : '' : '未评分,不能填写贡献度调整说明')
                       }
              >
                <Input defaultValue={text} value={text} id={'adjust_reason' + index}
                       placeholder={parseFloat(row.cont_degree).toFixed(3) != parseFloat(row.ori_degree).toFixed(3) ? "请输入调整说明..." : "字数100字以内..."}
                       disabled={!row.score || score_has_null}
                       onChange={(e) => this.handleChange(e, "adjust_reason", index - keyCount)}
                       style={{borderColor: parseFloat(row.cont_degree).toFixed(3) != parseFloat(row.ori_degree).toFixed(3) ? '#FA7252' : '#e5e5e5'}}
                />
              </Tooltip> :
              <p style={{textAlign: 'left'}}>{text}</p>}
            </div>
          }
        },
        {
          title: '得分*贡献度',
          dataIndex: 'last_score',
          width: '80px',
          render: (text, row, index) => {
            return <p style={{textAlign: 'right'}}>{text}</p>
          }
        },
        {
          title: '考核评级',
          dataIndex: 'rank',
          width: '65px',
          render: (text, row, index) => {
            if (inMultipleDept) { // 存在一个人在多个部门 不能编辑
              return <p style={{textAlign: 'right'}}>{text || ''}</p>
            }
            return <div>{tag == '0' && index >= keyCount || (keyTips && keyTips.hasFinish == 0) ?
              <Select style={{'width': '60px'}} id={'rank' + index}
                      onSelect={(e) => this.handleChange(e, 'rank', index - keyCount)}
                      value={row.rank} disabled={!row.score || score_has_null}>
                {row.rankList && row.rankList.length ?
                  row.rankList.map(function (t, index) {
                    return (<Option key={t.rank} value={t.rank}>{t.rank}</Option>)
                  })
                  : null}
              </Select> : <p style={{'width': '60px', textAlign: 'center'}}>{text}</p>}
            </div>
          }
        }
      ];
    } else {
      //季度考核

      // console.log('type',type)
      columns = [
        {
          title: '排名',
          dataIndex: 'order',
          width: '30px',
          render: (text, row, index) => {
            return <div>{
              tag == '0' && index >= keyCount || (keyTips && keyTips.hasFinish == 0)
                ?
                <Tooltip placement="topLeft" arrowPointAtCenter
                         title={score_has_null ? '尚有员工无考核成绩，不能调整排名' : (row.score ? `排名范围1~` + team_count : '未评分,不能调整排名')}>
                  <InputNumber
                    disabled={disableFlag || rankNullFlag || !row.score || score_has_null}
                    id={'index' + index}
                    min={1}
                    max={team_count}
                    step={1} precision={0} defaultValue={text || 0} value={text || 0}
                    onChange={(e) => this.handleChange(e, "order", index - keyCount)}
                    style={{margin: '0'}}
                  />
                </Tooltip>
                :
                <p style={{textAlign: 'right'}}>{text || ''}</p>}
            </div>
          }
        },
        {
          title: '员工编号',
          dataIndex: 'staff_id',
          width: '80px',
          render: (text, row, index) => {
            return <p>{text}</p>
          }
        },
        {
          title: '姓名',
          dataIndex: 'staff_name',
          width: '80px',
          render: (text, row, index) => {
            return <p>{text}</p>
          }
        },
        {
          title: '得分',
          dataIndex: 'score',
          width: '35px',
          render: (text, row, index) => {
            return <div>{text ?
              <p style={{textAlign: 'right'}}>{text}</p> :
              <Tooltip placement="topLeft" arrowPointAtCenter
                       title={row.score_0.indexOf('空') != -1 ? '尚有团队无考核成绩' : '尚有团队无确认工时'}>
                <p style={{textAlign: 'right'}}>{'无'}</p>
              </Tooltip>
            }
            </div>
          }
        },
        {
          title: '贡献度',
          dataIndex: 'cont_degree',
          width: '65px',
          render: (text, row, index) => {
            return <div>{tag == '0' && index >= keyCount || (keyTips && keyTips.hasFinish == 0) ?
              <Tooltip placement="topLeft" arrowPointAtCenter
                       title={score_has_null ? '尚有员工无考核成绩，不能调整贡献度' : (row.score ? `贡献度范围0-100,精确到3位小数` : '未评分,不能调整贡献度')}>
                <InputNumber
                  disabled={disableFlag || rankNullFlag || !row.score || score_has_null}
                  id={'cont_degree' + index}
                  min={0}
                  max={100}
                  step={0.1} precision={3} defaultValue={text || 0} value={text || 0}
                  onChange={(e) => this.handleChange(e, "cont_degree", index - keyCount)}
                />
              </Tooltip> :
              <p style={{textAlign: 'right'}}>{text || ''}</p>}
            </div>
          }
        },
        {
          title: '贡献度调整说明',
          dataIndex: 'adjust_reason',
          width: '20%',
          render: (text, row, index) => {
            return <div>{tag == '0' && index >= keyCount || (keyTips && keyTips.hasFinish == 0) ?
              <Tooltip style={{textAlign: 'left'}} placement="topLeft" arrowPointAtCenter
                       title={score_has_null ? '尚有员工无考核成绩，不能填写贡献度调整说明' : (
                         row.score ? row.adjust_reason && row.adjust_reason.length > 90 ? `字数100字以内...` : '' : '未评分,不能填写贡献度调整说明')
                       }
              >
                <Input defaultValue={text} value={text} id={'adjust_reason' + index}
                       placeholder={parseFloat(row.cont_degree).toFixed(3) != parseFloat(row.ori_degree).toFixed(3) ? "请输入调整说明..." : "字数100字以内..."}
                       disabled={disableFlag || rankNullFlag || !row.score || score_has_null}
                       onChange={(e) => this.handleChange(e, "adjust_reason", index - keyCount)}
                       style={{borderColor: parseFloat(row.cont_degree).toFixed(3) != parseFloat(row.ori_degree).toFixed(3) ? '#FA7252' : '#e5e5e5'}}
                />
              </Tooltip> :
              <p style={{textAlign: 'left'}}>{text}</p>}
            </div>
          }
        },
        {
          title: '得分*贡献度',
          dataIndex: 'last_score',
          width: '80px',
          render: (text, row, index) => {
            return <p style={{textAlign: 'right'}}>{text}</p>
          }
        },
        {
          title: '考核评级',
          dataIndex: 'rank',
          width: '65px',
          render: (text, row, index) => {
            return <div>{tag == '0' && index >= keyCount || (keyTips && keyTips.hasFinish == 0) ?
              <Select style={{'width': '60px'}} id={'rank' + index}
                      onSelect={(e) => this.handleChange(e, 'rank', index - keyCount)}
                      value={row.rank} disabled={disableFlag || rankNullFlag || !row.score || score_has_null}>
                {row.rankList && row.rankList.length ?
                  row.rankList.map(function (t, index) {
                    return (<Option key={t.rank} value={t.rank}>{t.rank}</Option>)
                  })
                  : null}
              </Select> : <p style={{'width': '60px', textAlign: 'center'}}>{text}</p>}
            </div>
          }
        }
      ];
      //if(isAll == 'true'){
      if (type === '2' || type === '6') {
        columns.splice(2, 0,
          {
            title: '团队名称',
            dataIndex: 'proj_name_0',
            className: tableStyle.breakcontent,
            render: (text) => {

              if (text) {
                let nameArr = text.split(',');
                return nameArr.map((i, index) => <div key={index} style={{textAlign: 'left'}}>{i}</div>)
              }
              return text
            },
          },
          {
            title: '团队内得分',
            dataIndex: 'score_0',
            width: '60px',
            render: (text) => {
              if (text) {
                let nameArr = text.split(',');
                return nameArr.map((i, index) => <div key={index}>{i}</div>)
              }
              return text
            },
          }
        );
      } else if (type === '3' || type === '4') {
        columns.splice(2, 0,
          {
            title: '团队名称',
            dataIndex: 'proj_name_0',
            className: tableStyle.breakcontent,
            render: (text) => {

              if (text) {
                let nameArr = text.split(',');
                return nameArr.map((i, index) => <div key={index} style={{textAlign: 'left'}}>{i}</div>)
              }
              return text
            },
          },
          {
            title: '评级',
            dataIndex: 'rank_0',
            width: '60px',
            render: (text) => {
              if (text) {
                let nameArr = text.split(',');
                return nameArr.map((i, index) => <div key={index}>{i}</div>)
              }
              return text
            },
          }
        );
      } else if (type === '7' || type === '8'||type === '12'||type === '13') {
        columns.splice(2, 0,
          {
            title: '团队名称',
            dataIndex: 'proj_name_0',
            className: tableStyle.breakcontent,
            render: (text) => {

              if (text) {
                let nameArr = text.split(',');
                return nameArr.map((i, index) => <div key={index} style={{textAlign: 'left'}}>{i}</div>)
              }
              return text
            },
          },
        );

      } else if (type === '9') {
        columns.splice(2, 0,
          {
            title: '团队名称',
            dataIndex: 'proj_name_0',
            className: tableStyle.breakcontent,
            render: (text) => {

              if (text) {
                let nameArr = text.split(',');
                return nameArr.map((i, index) => <div key={index} style={{textAlign: 'left'}}>{i}</div>)
              }
              return text
            },
          },
          {
            title: '预评级',
            dataIndex: 'rank_0',
            width: '60px',
            render: (text) => {
              if (text) {
                let nameArr = text.split(',');
                return nameArr.map((i, index) => <div key={index}>{i}</div>)
              }
              return text
            },
          }
        );
      } else if (type === '1'&&this.props.tabid=="16") {
        columns.splice(2, 0,
          {
            title: '评级',
            dataIndex: 'rank_0',
            width: '60px',
            render: (text) => {
              if (text) {
                let nameArr = text.split(',');
                return nameArr.map((i, index) => <div key={index}>{i}</div>)
              }
              return text
            },
          }
        );
      } else {
        columns.splice(1, 0,
          {
            title: '部门名称',
            dataIndex: 'dept_name',
            width: '160px',
            render: (text, row, index) => {
              return <p style={{textAlign: 'left'}}>{text.split('-')[1]}</p>
            }
          }
        );
      }
    }
    return columns;

  }
  /**
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-08-20
   * 功能：分布结果调整触发事件
   * @param e 标签
   * @param name 修改标签名称标识
   * @param index 修改记录索引
   */
  handleChange = function (e, name, index) {
    const {changedRank, empList, tips, team_count, submitTips, rankRatio, initTips} = this.state;
    if (name == 'rank') {
      //console.log("e",e)
      empList[index].rank = e;
      recount(index, changedRank, empList, tips);
      this.setState({
        changedRank,
        empList,
        tips
      })
    } else if (name == 'adjust_reason') {
      if (e.target.value.length > 100) {
        message.warning("字数100字以内")
        e.target.value = e.target.value.substr(0, 100);
      }
      empList[index][name] = e.target.value;
      this.setState({
        empList
      })
    } else if (name == 'cont_degree') {
      empList[index][name] = e;
      weightSum(team_count, empList, submitTips);
      //导入后防止被更改，这里关闭根据建议数量自动评级的功能 已还原代码
     autoRankByDegree(team_count, empList, changedRank, tips, rankRatio, initTips); 
      this.setState({
        empList,
        submitTips,
        changedRank,
        tips
      })
    } else if (name == 'order') {
      empList[index][name] = e;
      autoRankByOrder(team_count, empList, changedRank, tips, rankRatio, initTips);
      weightSum(team_count, empList, submitTips);
      this.setState({
        empList,
        submitTips,
        changedRank,
        tips
      })
    }

  }
  /**
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-08-20
   * 功能：排序
   */
  sort = () => {
    const {submitTips, changedRank, empList, team_count} = this.state;
    if (empScoreSort(submitTips, changedRank, empList, team_count)) {
      this.setState({
        empList,
        changedRank
      })
    }
  }
  /**
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-08-20
   * 功能：页面数据初始化
   * @param props 父组件参数
   */
  init = (props) => {
    const {changedRank, submitTips} = this.state;
    let {empList, season, keyTips} = props;
    let rankRatio = geneRatio(props.rankRatio);
    if (!rankRatio) return;
    let team_count = props.empList.length;

    //let keyTips = null;
    let tips = [];
    let initTips = null;
    let columns = null;
    let keyList = [];
    /*if(props.rankRatio.tag === '0' && props.rankRatio.type === '3'){
      //所有员工群体，计算关键岗位员工数量
      keyTips = keyEmpCount(empList);
    }*/

    if (keyTips) {
      //有核心岗位员工
      if (keyTips.hasFinish == 1) {
        //核心岗位员工已完成正态分布
        keyList = empList.filter(item => (item.emp_type == 1 || item.emp_type == 3 || item.emp_type == 4))

        keyList.sort(function (n1, n2) {
          //return (n1.rank > n2.rank) || (parseInt(n1.staff_id) - parseInt( n2.staff_id))
          if (n1.rank < n2.rank) {
            return -1;
          } else if (n1.rank > n2.rank) {
            return 1;
          } else {
            return 0;
          }
        });
        if (keyList.length) {
          keyList.map((i, index) => i.order = index + 1)
        }

        empList = empList.filter(item => item.emp_type == 0)
        initTips = tipsTransInit(rankRatio, team_count, keyTips);
        /*for(let i = 0;i < initTips.length;i++){
          tips.push(initTips[i]);
        }*/
        deepCopyTips(tips, initTips);
        team_count -= keyTips.COUNT;
      } else {
        //keyTips = null;
        //核心岗位员工尚未完成正态分布
        initTips = tipsTransInit(rankRatio, team_count, null);
        /*for(let i = 0;i < initTips.length;i++){
          tips.push(initTips[i]);
        }*/
        deepCopyTips(tips, initTips);
        //message.warning("核心岗位人员尚未正态分布！",6)
      }

    } else {
      initTips = tipsTransInit(rankRatio, team_count, keyTips);
      /*for(let i = 0;i < initTips.length;i++){
        tips.push(initTips[i]);
      }*/
      deepCopyTips(tips, initTips);
    }
    initPageByTag(props.rankRatio.tag, rankRatio, team_count, empList, tips, changedRank, submitTips, initTips);
    columns = this.getColumns(props, team_count, keyTips, season);
    this.setState({
      keyTips,
      initTips,
      tips,
      team_count,
      empList,
      columns,
      rankRatio,
      keyList,
    })
  }
  /**
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-08-20
   * 功能：分布结果导出
   */
  expExl = () => {
    let tab = document.querySelector(`#table${this.props.tableID} table`)
    exportExl()(tab, '正态分布')
  }

   // 导出表格
   outPut = (str) => {
    //const {dispatch} = this.props;
     let postData = {};
                postData["arg_mdzz"] = "1";
                postData["arg_tabId"] =this.props.tabid+"";
                postData["arg_flag"] ="0";
                postData["arg_year"]=this.props.year;
                postData["arg_season"]=this.props.season;
                postData["arg_ou"]=localStorage.getItem("ou");
                postData["arg_dept_name"]=this.props.dept_name
                postData["arg_tenantid"] = Cookie.get('tenantid')+"";
                postData["arg_ranks"]=str

      let url="/microservice/allexamine/examine/informationExport"
     // debugger
      postExcelFile(postData,url)

    // dispatch({
    //   type: 'dmdist/outPut',
    //   postData,
    // });
  };
  /**
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-08-20
   * 功能：保存调整结果
   */
  async save() {
    const {submitTips, team_count, empList} = this.state;
    const {keyTips} = this.props;
    if (keyTips && keyTips.hasFinish == 0) {
      message.warning("核心岗位人员尚未正态分布，不能保存！");
      return;
    }
    if (submitTips.score_has_null == true) {
      message.warning("尚有员工没有考核成绩，当前正态分布结果无效，不能保存！");
    } else if (!team_count || !empList || empList.length == 0) {
      message.warning("没有员工需进行正态分布，不能保存！");
    } else if (judgeDegree(empList) == true) {
      message.warning("尚有贡献度调整说明未填写，不能保存！");
    } else {
      let sort = judgeLastScore(empList);
      if (sort.com_rule == 1) {
        message.error("调整后，存在评级为B的员工总分大于评级为A的分数，请调整评级后再保存结果！", "6");
        return;
      } else if (sort.com_rule == 2) {
        message.error("调整后，存在评级为C的员工总分大于评级为" + sort.B.rank + "的分数，请调整评级后再保存结果！", "6");
        return;
      } else if (sort.com_rule == 3) {
        message.error("调整后，存在评级为D的员工总分大于评级为" + sort.C.rank + "的分数，请调整评级后再保存结果！", "6");
        return;
      } else if (sort.com_rule == 4) {
        message.error("调整后，存在评级为E的员工总分大于评级为" + sort.D.rank + "的分数，请调整评级后再保存结果！", "6");
        return;
      } else {
        //loadflag=true;
        let rankResult = [];
        for (let i = 0; i < team_count; i++) {
          let idArray = empList[i].id.split(',');
          for (let j = 0; j < idArray.length; j++) {
            //alert("idArray[j]:"+idArray[j])
            //rankResult.push({"update":{"rank":empList[i].rank,"cont_degree":empList[i].cont_degree,"adjust_reason":empList[i].adjust_reason},"condition":{"id":empList[i].id}});
            rankResult.push({
              "update": {
                "rank": empList[i].rank,
                "cont_degree": empList[i].cont_degree,
                "adjust_reason": empList[i].adjust_reason
              },
              "condition": {"id": idArray[j]}
            });
          }
        }
        let saveRes = await service.empScoresUpdate({
          transjsonarray: JSON.stringify(rankResult)
        });
        if (saveRes && saveRes.RetCode == '1') {
          message.success("正态分布结果保存成功！")
        } else {
          message.error("正态分布结果保存失败！")
        }
      }
    }
  }

  /**
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-08-20
   * 功能：提交正态分布结果
   */
  submit() {
    const {submitTips, team_count, empList, tips} = this.state;
    const {rankRatio, year, season, submit, keyTips} = this.props;
   // console.log("list:"+JSON.stringify(empList))
    if (keyTips && keyTips.hasFinish == 0) {
      message.warning("核心岗位人员尚未正态分布，不能提交！");
      return;
    }
  //  empList.forEach(item=>{//一季度新加需求
  //     if(item.rank=='A'?false:(item.rank=='C')?false:true)
  //     {
  //       message.warning("第一季度考核存在不为A或C的评级，请重新评级！");
  //       return;
  //     }
  //     })
    let flag = submitTip(submitTips, tips, empList);
    if (flag) {
      let ratio = geneProjRemain(rankRatio, tips, year, season);  // 生成下期余数
      let rankList = geneRankList(team_count, empList);  // 转换项目成员本期正态分布结果
      submit(rankList, ratio);
      //alert("满足条件，可以提交！")
    }
  }

  /**
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-08-20
   * 功能：组件渲染完成后，初始化数据
   */
  componentDidMount() {
    this.init(this.props);
  }

  /**
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-08-20
   * 功能：父组件参数变更后，初始化数据
   * @param nextprops 父组件变更后参数
   */
  componentWillReceiveProps(nextprops) {
    this.init(nextprops);
  }

  render() {
    const {rankRatio, loading, reset, year, season, checker_info, tableID, disableFlag, rankNullFlag, score_has_null, inMultipleDept} = this.props;
    const {submitTips, team_count, tips, empList, columns, keyTips, keyList} = this.state;
    let str=""
    empList.forEach(item=>{str+=item.staff_id+item.rank+"y"})
    let list=JSON.parse(JSON.stringify(tips))
    if((tips instanceof Array)&&tips.length>0){
      if(rankRatio && rankRatio.tag == '1'){
        list.forEach((item,index)=>{
          // if(item.name=="评级比例"){
          //   item.AB="-"
          //   item.B="-"
          //   item.D="-"
          // }
          if(item.name=="建议数量"){
            item.AB="-"
            item.B="-"
            item.D="-"
            item.A="-"
            item.C="-"
          }
          if(item.name=="实际数量"){
            item.AB="-"
            item.B="-"
            item.D="-"
            item.A="-"
            item.C="-"
          }
          if(item.name=="上期余数"){
            item.AB="-"
            item.B="-"
            item.D="-"
            item.A="-"
            item.C="-"
          }

          if(item.name=="本期余数"){
            item.A=(Number(rankRatio.a_remainder)).toFixed(2)
            item.AB=(Number(rankRatio.a_remainder)+Number(rankRatio.b_remainder)).toFixed(2)
            item.C=(Number(rankRatio.c_remainder)).toFixed(2)
            item.D=(Number(rankRatio.d_remainder)).toFixed(2)
           }
           
          //return item
          })
      }

      //if(rankRatio && rankRatio.tag == '0'){
        // list.forEach((item,index)=>{
        //   if(item.name!="上期余数"){
        //   item.AB="-"
        //   item.B="-"
        //   item.D="-"
        //   }
        //   return item
        //   })
       // return list
     //}
    }
   
    let key_count = 0;
    if (keyTips) {
      key_count = keyTips.COUNT;
    }

    let tableData = keyList.concat(empList);
    tableData.forEach((item,index)=>item.key = index.toString())
    return (
      <div>
        <div style={{float: 'left', marginTop: '-215px'}}>
          <DistInfo year={year} season={season} checker_info={checker_info}
                    checker_name={Cookie.get('username')} team_count={team_count}
                    key_count={keyTips && keyTips.hasFinish == 1 ? key_count : 0}/>
        </div>
        <div style={{
          float: 'right',
          marginTop: '-205px',
          marginRight: '10px',
          display: ((rankRatio && rankRatio.tag == '0') || (rankRatio && rankRatio.tag == '1') )? 'block' : 'none'
        }}>
          {/* <RemainderInfo tips={tips} loading={loading}/> */}
          {/* 提交过后，本期余数之前的显示不对，这里给它给过来 */}
          <RemainderInfo tips={list} loading={loading}/>
        </div>
        {rankRatio && rankRatio.tag == '0' ?
          <div className={Style.div_dist} style={{ marginTop: "-63px"}}>
            <Button onClick={()=>this.outPut(str)}>导出</Button>
            {/* {window.location.hash=="#/humanApp/employer/dmdistribute"&&
            <Button disabled={disableFlag ||rankNullFlag ||this.state.score_flage}><Upload {...this.state.import} className={Style.upload}>
              导入</Upload></Button>} */}
              {window.location.hash=="#/humanApp/employer/dmdistribute"&&
            <Upload {...this.state.import} className={Style.upload}><Button disabled={disableFlag ||rankNullFlag ||this.state.score_flage}>
              导入</Button></Upload>}
            <Button onClick={reset}>重置</Button>
            <Button onClick={() => this.sort()}>排序</Button>
            <span className={Style.total_degree}>{'贡献度总权重：' + submitTips.degree_sum}</span>
          </div> : null
        }

        {rankRatio && rankRatio.tag == '1' ?
          <div className={Style.div_dist_show} style={{marginTop:-63}}>
            <Button onClick={()=>this.outPut(str)}>导出</Button>
          </div> : null
        }

        <div className={tableStyle.orderTable} id={'table' + tableID}>
          <Table id='table1' style={{width: '100%', marginTop: '-18px'}} size='small' bordered={true}
                 columns={columns} dataSource={tableData} loading={loading} pagination={false}/>
          {
            inMultipleDept ?
              ''
              :
              rankRatio && rankRatio.tag == '0'
                ?
                <PageSubmit title="确定提交正态分布结果吗？" subState={!(disableFlag || rankNullFlag || score_has_null)}
                            saveState={!(disableFlag || rankNullFlag || score_has_null)} save={() => this.save()}
                            submit={() => this.submit()}/>
                :
                null
          }
        </div>
      </div>
    )
  }
}

export default ToDistList;
