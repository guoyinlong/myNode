/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 * 文件说明：项目-正态分布组件
 */
import Cookie from 'js-cookie';
import * as service from '../../services/employer/empservices';

import RemainderInfo from './RemainderInfo'
import DistInfo from './DistInfo'
import PageSubmit from './PageSubmit'
import {Table,Input,Select,Button,Tooltip,InputNumber,Upload} from 'antd'
import Style from './employer.less'
import tableStyle from '../common/table.less'
import exportExl from '../commonApp/exportExl'
//import exportExcel from '../commonApp/exportExcel'
import message from '../../components/commonApp/message'
import {postExcelFile} from "../../utils/func.js"

const Option = Select.Option;
const staffId = Cookie.get('userid');
const importYear = new Date().getFullYear().toString();
const importSeason = (new Date().getMonth() + 1).toString();
const importDay = new Date().getDate().toString();
/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 * 功能：考核评级初始化
 * @returns {Array} list 标签select绑定的数据源
 */
function geneRank (){
  var list = [];
  list.push({"rank":"A"});
  list.push({"rank":"B"});//第一季度字显示AC，暂时注了-现在恢复
  list.push({"rank":"C"});
  list.push({"rank":"D"});//第一季度字显示AC，暂时注了-现在恢复
  list.push({"rank":"E"});//第一季度字显示AC，暂时注了-现在恢复
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
function geneRatio (rank) {
  if(!rank){
    return null;
  }
  let list = {"a_ratio":rank.a_ratio,"a_remain":rank.a_remainder,"b_ratio":rank.b_ratio,"b_remain":rank.b_remainder,"c_ratio":rank.c_ratio,"c_remain":rank.c_remainder,"d_ratio":rank.d_ratio,"d_remain":rank.d_remainder};
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
function tipsTransInit (rankRatio,team_count) {
  let tips = [];
  /*if(!team_count){
    return tips;
  }*/
  tips.push({"name":"评级比例","A":parseFloat(rankRatio.a_ratio),"B":parseFloat(rankRatio.b_ratio),"C":rankRatio.c_ratio,"D":rankRatio.d_ratio,"AB":parseFloat(rankRatio.a_ratio)+parseFloat(rankRatio.b_ratio)});
  tips.push({"name":"上期余数","A":parseFloat(rankRatio.a_remain).toFixed(2),"B":parseFloat(rankRatio.b_remain).toFixed(2),"C":parseFloat(rankRatio.c_remain).toFixed(2),"D":parseFloat(rankRatio.d_remain).toFixed(2),"AB":(parseFloat(rankRatio.a_remain) + parseFloat(rankRatio.b_remain)).toFixed(2)});
  var t_AB = Math.floor(team_count *  parseFloat(rankRatio.a_ratio) + parseFloat(rankRatio.a_remain))+Math.floor(team_count *  parseFloat(rankRatio.b_ratio) + parseFloat(rankRatio.b_remain));
  var tip = {A:team_count *  parseFloat(rankRatio.a_ratio) + parseFloat(rankRatio.a_remain)>0 ? Math.floor(team_count *  parseFloat(rankRatio.a_ratio) + parseFloat(rankRatio.a_remain)):0,
    B:team_count *  parseFloat(rankRatio.b_ratio) + parseFloat(rankRatio.b_remain) > 0 ? Math.floor(team_count *  parseFloat(rankRatio.b_ratio) + parseFloat(rankRatio.b_remain)):0,
    C:team_count *  parseFloat(rankRatio.c_ratio) + parseFloat(rankRatio.c_remain) > 0 ? Math.floor(team_count *  parseFloat(rankRatio.c_ratio) + parseFloat(rankRatio.c_remain)):0,
    D:team_count *  parseFloat(rankRatio.d_ratio) + parseFloat(rankRatio.d_remain) > 0 ? Math.floor(team_count *  parseFloat(rankRatio.d_ratio) + parseFloat(rankRatio.d_remain)):0};
  //console.log("000tip:"+JSON.stringify(tip))
  if(tip.A > t_AB){
    tip.A = t_AB;
  }
  if(tip.B > t_AB){
    tip.B = t_AB;
  }
  tips.push({"name":"建议数量",
    "A": tip.A,
    "B": tip.B,
    "C": tip.C,
    "D":tip.D,
    //"AB":Math.floor(team_count *  parseFloat(rankRatio.a_ratio) + parseFloat(rankRatio.a_remain))+Math.floor(team_count *  parseFloat(rankRatio.b_ratio) + parseFloat(rankRatio.b_remain))});
    "AB":tip.A + tip.B});
  tips.push({"name":"本期余数",
    "A":((team_count *  parseFloat(rankRatio.a_ratio) + parseFloat(rankRatio.a_remain)).toFixed(2) - tips[2].A).toFixed(2),
    "B":((team_count *  parseFloat(rankRatio.b_ratio) + parseFloat(rankRatio.b_remain)).toFixed(2) - tips[2].B).toFixed(2),
    "C":((team_count *  parseFloat(rankRatio.c_ratio) + parseFloat(rankRatio.c_remain)).toFixed(2) - tips[2].C).toFixed(2),
    "D":((team_count *  parseFloat(rankRatio.d_ratio) + parseFloat(rankRatio.d_remain)).toFixed(2) - tips[2].D).toFixed(2),
    "AB":((team_count *  parseFloat(rankRatio.a_ratio) + parseFloat(rankRatio.a_remain) + team_count *  parseFloat(rankRatio.b_ratio) + parseFloat(rankRatio.b_remain)).toFixed(2)- tips[2].A  - tips[2].B).toFixed(2)});
  //console.log("111tips:"+JSON.stringify(tips))
  var sum = tips[2].A + tips[2].B +tips[2].C +tips[2].D;

  if(sum < team_count){
    while(sum != team_count){
      if(tips[3].A > 0 && tips[3].AB > 0){
        sum++;
        tips[2].A++;
        tips[3].A = parseFloat(tips[3].A -1).toFixed(2);
        tips[2].AB++;
        tips[3].AB = parseFloat(tips[3].AB -1).toFixed(2);
      }else if(tips[3].B > 0 && tips[3].AB > 0){
        sum++;
        tips[2].B++;
        tips[3].B = parseFloat(tips[3].B -1).toFixed(2);
        tips[2].AB++;
        tips[3].AB = parseFloat(tips[3].AB -1).toFixed(2);
      }else if(tips[3].C > 0){
        sum++;
        tips[2].C++;
        tips[3].C = parseFloat(tips[3].C -1).toFixed(2);
      }else if(tips[3].D > 0){
        sum++;
        tips[2].D++;
        tips[3].D = parseFloat(tips[3].D -1).toFixed(2);
      }
    }
  }else if(sum > team_count){
    while(sum != team_count){
      if(tips[2].D > 0 && tips[3].D < 0){
        sum--;
        tips[2].D--;
        tips[3].D = (parseFloat(tips[3].D) +1).toFixed(2);
      }else if(tips[2].C > 0){
        sum--;
        tips[2].C--;
        tips[3].C = (parseFloat(tips[3].C) +1).toFixed(2);
      }else if(tips[3].B > 0){
        sum--;
        tips[2].B--;
        tips[3].B = (parseFloat(tips[3].B) +1).toFixed(2);
        tips[2].AB--;
        tips[3].AB = (parseFloat(tips[3].AB) +1).toFixed(2);
      }else if(tips[3].A > 0){
        sum--;
        tips[2].A--;
        tips[3].A = (parseFloat(tips[3].A) +1).toFixed(2);
        tips[2].AB--;
        tips[3].AB = (parseFloat(tips[3].AB) +1).toFixed(2);
      }
    }
  }

  var t = {A:0,B:0,C:0,D:0};
  for(var i = 0;i < team_count;i++){
    if(i + 1 <= tips[2].A)
      t.A++;
    else if(i + 1 <= tips[2].AB)
      t.B++;
    else if(i + 1 <= tips[2].AB + tips[2].C)
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
  tips.splice(3,0,{"name":"实际数量",
    "A":t.A,
    "B":t.B,
    "C":t.C,
    "D":t.D,
    "AB":t.A+t.B});
  //console.log("222tips:"+JSON.stringify(tips))
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
function initRank(index,tips){
  if(index + 1 <= tips[2].A)
    return 'A';
  if(index + 1 <= tips[2].AB) // 第一季度需求，暂时注了-现在恢复
    return 'B';
  if(index + 1 <= tips[2].AB + tips[2].C)
    return 'C';
  else // 第一季度需求，暂时注了-现在恢复
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
function empScoreSort (submitTips,changedRank,empList,team_count) {
  var flag = false;
  if(submitTips.degree_sum != 100){
    message.warning('贡献度权重和不为100，请调整后再排序！');
  }else if(submitTips.degree_has_null == true){
    message.warning('有员工的贡献度权重为空，请调整后再排序！');
  }else if(submitTips.score_has_null == true){
    message.warning('有员工的考核结果为空，尚不能排序！');
  }else{
    empList.sort(function(n1,n2){
      //return (parseFloat(n2.last_score) - parseFloat(n1.last_score)) || (parseInt(n1.staff_id) - parseInt(n2.staff_id))
      return (parseFloat(n1.order) - parseFloat(n2.order)) || (parseInt(n2.score) - parseInt(n1.score))
    });//排序
    for(var i = 0;i < team_count;i++){
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
function judgeDegree (empList){
  for(var i = 0;i < empList.length;i++){
    if(parseFloat(empList[i].cont_degree).toFixed(3) != parseFloat(empList[i].ori_degree).toFixed(3) && !empList[i].adjust_reason){
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
function judgeLastScore (empList){
  var sort = {"A":{"max":-1,"min":10001,"rank":'A'},
    "B":{"max":-1,"min":10001,"rank":'B'},
    "C":{"max":-1,"min":10001,"rank":'C'},
    "D":{"max":-1,"min":10001,"rank":'D'},
    "E":{"max":-1,"min":10001,"rank":'E'},
    "com_rule":0};
  for(var i = 0;i < empList.length;i++){
    if(empList[i].rank == 'A'){
      if(empList[i].score * empList[i].cont_degree > sort.A.max){
        sort.A.max = empList[i].score * empList[i].cont_degree;
      }
      if(empList[i].score * empList[i].cont_degree < sort.A.min){
        sort.A.min = empList[i].score * empList[i].cont_degree;
      }
    }else if(empList[i].rank == 'B'){
      if(empList[i].score * empList[i].cont_degree > sort.B.max){
        sort.B.max = empList[i].score * empList[i].cont_degree;
      }
      if(empList[i].score * empList[i].cont_degree < sort.B.min){
        sort.B.min = empList[i].score * empList[i].cont_degree;
      }
    }else if(empList[i].rank == 'C'){
      if(empList[i].score * empList[i].cont_degree > sort.C.max){
        sort.C.max = empList[i].score * empList[i].cont_degree;
      }
      if(empList[i].score * empList[i].cont_degree < sort.C.min){
        sort.C.min = empList[i].score * empList[i].cont_degree;
      }
    }else if(empList[i].rank == 'D'){
      if(empList[i].score * empList[i].cont_degree > sort.D.max){
        sort.D.max = empList[i].score * empList[i].cont_degree;
      }
      if(empList[i].score * empList[i].cont_degree < sort.D.min){
        sort.D.min = empList[i].score * empList[i].cont_degree;
      }
    }else if(empList[i].rank == 'E'){
      if(empList[i].score * empList[i].cont_degree > sort.E.max){
        sort.E.max = empList[i].score * empList[i].cont_degree;
      }
      if(empList[i].score * empList[i].cont_degree < sort.E.min){
        sort.E.min = empList[i].score * empList[i].cont_degree;
      }
    }
  }
  if(sort.B.min == 10001){
    sort.B.min = sort.A.min;
    sort.B.rank = sort.A.rank;
  }
  if(sort.C.min == 10001){
    sort.C.min = sort.B.min;
    sort.C.rank = sort.B.rank;
  }
  if(sort.D.min == 10001){
    sort.D.min = sort.C.min;
    sort.D.rank = sort.C.rank;
  }
  if(parseFloat(sort.A.min) < parseFloat(sort.B.max)){
    sort.com_rule = 1;
  }else if(parseFloat(sort.B.min) < parseFloat(sort.C.max)){
    sort.com_rule = 2;
  }else if(parseFloat(sort.C.min) < parseFloat(sort.D.max)){
    sort.com_rule = 3;
  }else if(parseFloat(sort.D.min) < parseFloat(sort.E.max)){
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
function initPageByTag (tag,rankRatio,team_count,empList,tips,changedRank,submitTips){
  submitTips.degree_sum = 100;
  submitTips.degree_has_null = false;
  submitTips.score_has_null = false;
  if(tag == '0'){
    var tips1 = tipsTransInit(rankRatio,team_count);
    tips.splice(0,tips.length);
    changedRank.splice(0,changedRank.length);
    for(var i = 0;i < tips1.length;i++){
      tips.push(tips1[i]);
    }
    var every = 0;
    if(100%team_count == 0){
      every = (parseFloat(100)/team_count).toFixed(3);
    }else{
      every = (parseFloat(100)/team_count-0.0005).toFixed(3);
    }
    for(let i = 0;i < team_count;i++){
      if(i != team_count - 1){
        empList[i]["ori_degree"] = every;
      }else{
        empList[i]["ori_degree"] = (parseFloat(100) - (team_count - 1)*every).toFixed(3);
        if(empList[i].ori_degree > every){
          empList[0].ori_degree = empList[i].ori_degree;
          empList[i].ori_degree = every;
        }
      }
    }
    for(let i = 0;i < team_count;i++){
      if(!empList[i].cont_degree){
        empList[i].cont_degree = empList[i].ori_degree;
      }
      if(empList[i].score == undefined || empList[i].score ==''){
        submitTips.score_has_null = true;
        changedRank.push({"rank":''});
        empList[i].last_score = 0;
      }else{
        empList[i].last_score = (empList[i].score * empList[i].cont_degree).toFixed(3);
        empList[i].rankList = geneRank();
        var r = initRank(i,tips);
        changedRank.push({"rank":r});
        if(empList[i].rank){
          reComRemainder(i,changedRank,empList,tips);
        }else{
          empList[i].rank = r;
        }
      }
      /*if(empList[i].proj_name_0){
        empList[i].proj_name_0 = empList[i].proj_name_0.split(',');
      }
      if(empList[i].rank_0){
        empList[i].rank_0 = empList[i].rank_0.split(',');
      }*/

      empList[i]["order"] = i+1;
    }
    empList.sort(function(n1,n2){
      return (parseFloat(n2.last_score) - parseFloat( n1.last_score)) || (parseFloat(n2.score) - parseFloat( n1.score)) ||(parseInt(n1.staff_id) - parseInt( n2.staff_id))
    });//排序

    //排序时需将原changedRank数组相应转换
    for(let i = 0;i < team_count;i++){
      empList[i]["order"] = i+1;
      changedRank[i].rank = empList[i].rank;
    }

    weightSum(team_count,empList,submitTips);
  }else{
    if(empList != undefined){
      for(let i = 0;i < empList.length;i++){
        empList[i].cont_degree = (empList[i].cont_degree * 1).toFixed(3);
        empList[i].last_score = (empList[i].score * empList[i].cont_degree).toFixed(3);
        /*if(empList[i].proj_name_0){
          empList[i].proj_name_0 = empList[i].proj_name_0.split(',');
        }
        if(empList[i].rank_0){
          empList[i].rank_0 = empList[i].rank_0.split(',');
        }*/
      }
      empList.sort(function(n1,n2){
        //return (parseFloat(n2.score * n2.cont_degree) - parseFloat( n1.score * n1.cont_degree))||(parseInt(n1.staff_id) - parseInt( n2.staff_id))
        if(n1.rank < n2.rank){
          return -1;
        }else if(n1.rank > n2.rank){
          return 1;
        }else{
          if(parseFloat(n1.score * n1.cont_degree) < parseFloat( n2.score * n2.cont_degree)){
            return 1;
          }else if(parseFloat(n1.score * n1.cont_degree) > parseFloat( n2.score * n2.cont_degree)){
            return -1;
          }else{
            if(parseInt(n1.staff_id) < parseInt( n2.staff_id)){
              return -1;
            }else if(parseInt(n1.staff_id) > parseInt( n2.staff_id)){
              return 1;
            }else{
              return 0;
            }
          }
        }



      });//排序
      for(let i = 0;i < empList.length;i++){
        empList[i]["order"] = i+1;
      }
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
function reComRemainder (index,changedRank,empList,tips){
  //console.log(changedRank[index].rank  + "-------" +  empList[index].rank);
  var before = changedRank[index].rank == 'E' ? 'D' : changedRank[index].rank;
  var now = empList[index].rank == 'E' ? 'D' : empList[index].rank;
  tips[3][before]--;
  tips[3][now]++;
  tips[4][before]= (parseFloat(tips[4][before]) +1).toFixed(2);
  tips[4][now]= (parseFloat(tips[4][now]) -1).toFixed(2);
  tips[3]['AB'] = tips[3]['A'] +tips[3]['B'];
  tips[4]['AB'] = (parseFloat(tips[4]['A']) +parseFloat(tips[4]['B'])).toFixed(2);
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
function weightSum (team_count,empList,submitTips){
  submitTips.degree_sum = 0;
  submitTips.degree_has_null = false;
  for(var i = 0;i < team_count;i++){
    if(empList[i].cont_degree != undefined && empList[i].cont_degree != ''){
      submitTips.degree_sum += parseFloat(empList[i].cont_degree);
      if(empList[i].score != undefined && empList[i].score != ''){
        empList[i].last_score = (empList[i].score * empList[i].cont_degree).toFixed(3);
      }
    }else{
      submitTips.degree_has_null = true;
    }
    if(parseFloat(empList[i].cont_degree).toFixed(3) != parseFloat(empList[i].ori_degree).toFixed(3)){
      empList[i].placeholder = "请输入贡献度调整说明...";
    }else{
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
function recount (index,changedRank,empList,tips){
  var sort = judgeLastScore(empList);
  if(sort.com_rule == 1){
    message.error("调整后，存在评级为B的员工总分大于评级为A的分数，请调整贡献度后再调整评级！","6"); //一季度人力需求 2020-3-4 暂注-现在恢复
    empList[index].rank = changedRank[index].rank;
    return;
  }else if(sort.com_rule == 2){
    message.error("调整后，存在评级为C的员工总分大于评级为"+sort.B.rank +"的分数，请调整贡献度后再调整评级！","6");
    empList[index].rank = changedRank[index].rank;
    return;
  }else if(sort.com_rule == 3){
    message.error("调整后，存在评级为D的员工总分大于评级为"+sort.C.rank +"的分数，请调整贡献度后再调整评级！","6"); //一季度人力需求 2020-3-4 暂注-现在恢复
    empList[index].rank = changedRank[index].rank;
    return;
  }else if(sort.com_rule == 4){
    message.error("调整后，存在评级为E的员工总分大于评级为"+sort.D.rank +"的分数，请调整贡献度后再调整评级！", "6"); //一季度人力需求 2020-3-4 暂注-现在恢复
    empList[index].rank = changedRank[index].rank;
    return;
  }else {
    reComRemainder(index,changedRank,empList,tips);
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
function autoRankByDegree (team_count,empList,changedRank,tips,rankRatio){
  var newList = [];
  for(let i = 0; i <　team_count; i++){
    newList.push({"id":empList[i].id,"staff_id":empList[i].staff_id,"last_score":empList[i].last_score,"rank":'',"sort":i});
  }
  newList.sort(function(n1,n2){
    return (parseFloat(n2.last_score) - parseFloat( n1.last_score))||(parseInt(n1.staff_id) - parseInt( n2.staff_id))
  });//排序
  tips.splice(0,tips.length);
  changedRank.splice(0,changedRank.length);
  var tips1 = tipsTransInit(rankRatio,team_count);
  for(let i = 0;i < tips1.length;i++){
    tips.push(tips1[i]);
  }
  for(let i = 0; i < team_count; i++){
    var r = initRank(i,tips);
    newList[i].rank = r;
    newList[i].order = i+1;
  }
  newList.sort(function(n1,n2){return parseInt(n1.sort) - parseInt( n2.sort)});//排序

  for(let i = 0; i < team_count; i++){
    empList[i].rank = newList[i].rank;
    empList[i].order = newList[i].order;
    changedRank.push({"rank":newList[i].rank});
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
function judgeRemian (tips){
  if(tips[4].A <= -1){
    return false;
  }
  if(tips[4].AB <= -1){
    return false;
  }
  if(tips[4].D >= 1 ){
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
function submitTip (submitTips,tips,empList){
  var flag = false;
  if(!tips || tips.length == 0){
    message.error('评级比例、余数信息为空！');
  }else if(submitTips.score_has_null == true){
    message.warning("尚有员工没有考核成绩，当前正态分布结果无效，不能提交！");
  }else if(submitTips.degree_has_null == true){
    message.warning('有员工的贡献度权重为空，请调整后再提交！');
  }else if(submitTips.degree_sum != 100){
    message.warning("贡献度权重和不为100，请调整后再提交！");
  }else if(judgeDegree(empList) == true == true){
    message.warning("尚有贡献度调整说明未填写，请填写后再提交！");
  }else if(judgeRemian(tips) == false){
    message.warning("考核评级余数超出规定范围，请检查后再提交！");
  }else{
    var sort = judgeLastScore(empList);
    if(sort.com_rule == 1){
      message.error("存在评级为B的员工总分大于评级为A的分数，请调整评级后再提交结果！","6");
    }else if(sort.com_rule == 2){
      message.error("存在评级为C的员工总分大于评级为"+sort.B.rank +"的分数，请调整评级后再提交结果！","6");
    }else if(sort.com_rule == 3){
      message.error("存在评级为D的员工总分大于评级为"+sort.C.rank +"的分数，请调整评级后再提交结果！","6");
    }else if(sort.com_rule == 4){
      message.error("存在评级为E的员工总分大于评级为"+sort.D.rank +"的分数，请调整评级后再提交结果！","6");
    }else {
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
function geneRankList (team_count,empList){
  var rankList = [];
  for(var i = 0;i < team_count;i++){
    rankList.push({"id":empList[i].id,"staff_id":empList[i].staff_id,"staff_name":empList[i].staff_name,"rank":empList[i].rank,"cont_degree":empList[i].cont_degree.toString(),"adjust_reason":empList[i].adjust_reason == undefined ?'无调整':empList[i].adjust_reason,"proj_id":empList[i].proj_id});
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
function geneProjRemain(rankRatio,tips,year,season){
  delete rankRatio.id;
  rankRatio.a_remainder = tips[4].A.toString();
  rankRatio.b_remainder = tips[4].B.toString();
  rankRatio.c_remainder = tips[4].C.toString();
  rankRatio.d_remainder = tips[4].D.toString();
  rankRatio.e_ratio = '0';
  rankRatio.e_remainder = '0';

  if(season == '0'){
    rankRatio.year = (parseInt(year) + 1).toString();
  }else if(season == '4'){
    rankRatio.year = (parseInt(year) + 1).toString();
    rankRatio.season = '1';
  }else{
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
function autoRankByOrder(team_count,empList,changedRank,tips,rankRatio) {
  var newList = [];
  for(var i = 0; i <　team_count; i++){
    newList.push({"id":empList[i].id,"staff_id":empList[i].staff_id,"staff_name":empList[i].staff_name,"score":empList[i].score,"last_score":empList[i].last_score,"rank":'',"order":empList[i].order,"sort":i});
  }
  newList.sort(function(n1,n2){
    return (parseFloat(n1.order) - parseFloat( n2.order))||(parseInt(n2.score) - parseInt( n1.score))
  });//排序
  let initDegreeSum = 0;
  for(let i = team_count - 1;i >= 0;i--){
    if(i == team_count - 1){
      newList[i]["init_degree"] = 1;
    }else{
      //console.log(newList[i]["staff_name"]+"截取前:"+newList[i+1]["init_degree"] * newList[i+1]["score"] / newList[i]["score"])
      newList[i]["init_degree"] = (newList[i+1]["init_degree"] * newList[i+1]["score"] / newList[i]["score"]).toFixed(6) ;
      if(newList[i]["init_degree"]*newList[i]["score"] < newList[i+1]["init_degree"]*newList[i+1]["score"]){
        newList[i]["init_degree"] = parseFloat(newList[i]["init_degree"])+0.000001;
      }
      //newList[i]["init_degree"] = newList[i+1]["init_degree"] * newList[i+1]["score"] / newList[i]["score"] ;
    }
    //console.log(newList[i]["staff_name"]+":"+newList[i]["init_degree"])
    //initDegreeSum = (parseFloat(initDegreeSum) +  parseFloat(newList[i]["init_degree"])).toFixed(6);
    initDegreeSum = parseFloat(initDegreeSum) +  parseFloat(newList[i]["init_degree"]);
  }
  //console.log("initDegreeSum:"+initDegreeSum)
  let degreeSum = 0;
  for(let i = 0;i < team_count;i++){
    if(i == 0){
      newList[i]["degree"] = (newList[i]["init_degree"] * 100 / initDegreeSum).toFixed(3) ;
    }else{
      //console.log(newList[i]["staff_name"]+":"+newList[i-1]["degree"] * newList[i-1]["score"] / newList[i]["score"])
      //console.log(newList[i]["staff_name"]+":"+(newList[i-1]["degree"] * newList[i-1]["score"] / newList[i]["score"]).toFixed(3))
      newList[i]["degree"] = (newList[i-1]["degree"] * newList[i-1]["score"] / newList[i]["score"]).toFixed(3);
      if(newList[i]["degree"]*newList[i]["score"] > newList[i-1]["degree"]*newList[i-1]["score"]){
        newList[i]["degree"] = (newList[i]["degree"]-0.001).toFixed(3);
      }
    }
    //console.log(newList[i]["staff_name"]+":"+newList[i]["degree"])
    degreeSum = (parseFloat(degreeSum) + parseFloat(newList[i]["degree"])).toFixed(3);
  }
  //console.log("degreeSum:"+degreeSum)
  newList[0]["degree"] = (parseFloat(newList[0]["degree"]) + parseFloat(100)- degreeSum).toFixed(3);
  //console.log(newList[0]["staff_name"]+":"+newList[0]["degree"])

  tips.splice(0,tips.length);
  changedRank.splice(0,changedRank.length);
  var tips1 = tipsTransInit(rankRatio,team_count);
  for(let i = 0;i < tips1.length;i++){
    tips.push(tips1[i]);
  }
  for(let i = 0; i < team_count; i++){
    var r = initRank(i,tips);
    newList[i].rank = r;
  }
  newList.sort(function(n1,n2){return parseInt(n1.sort) - parseInt( n2.sort)});//排序

  for(let i = 0; i < team_count; i++){
    empList[i].rank = newList[i].rank;
    empList[i].cont_degree = newList[i].degree;
    changedRank.push({"rank":newList[i].rank});
  }
  //console.log("调整排名:"+empList[0].rank)
  //console.log("newList:"+JSON.stringify(newList))
  //console.log("empList:"+JSON.stringify(empList))
}

/**
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 * 功能：正态分布组件
 */
class ToDistList extends React.Component {
  state = ({
    tips:[],
    submitTips:{"degree_sum":100,"degree_has_null":false,"score_has_null":false},
    rankRatio:{},
    changedRank:[],
    team_count:0,
    empList:[],
    columns:[],
    score_flage:false,
    import: {
      action: "/filemanage/fileupload?argappname=pmdistribute&argtenantid=10010&arguserid=" + staffId + "&argyear=" + importYear +
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
            let postData = {};
            postData["arg_mdzz"] = "2";
            postData["arg_mgr_id"] =staffId;
            postData["arg_year"]=this.props.year;
            postData["arg_season"]=this.props.season;
            postData["arg_tenantid"] = Cookie.get('tenantid')+"";
            postData["xlsfilepath"] = info.file.response.outsourcer.RelativePath;
            this.props.dispatch({
              type:'pmdist/fileImport',
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
  getColumns = (props,team_count,isAll)=> {
    const {tag} = props.rankRatio;
    const {score_has_null} = props;

     this.setState({
      score_flage:score_has_null
    })
    let columns = [
    {
      title: '排名',
      dataIndex: 'order',
      width:'30px',
      render: (text, row, index) => {
        return  <div>{tag =='0'?
          <Tooltip placement="topLeft" arrowPointAtCenter title={score_has_null?'尚有员工无考核成绩，不能调整排名':(row.score?`排名范围1~`+team_count:'未评分,不能调整排名')}>
            <InputNumber
              disabled={!row.score || score_has_null}
              id={'index'+index}
              min={1}
              max={team_count}
              step={1} precision={0} defaultValue={text||0} value={text||0}
              onChange={(e)=>this.handleChange(e,"order",index)}
              style={{margin:'0'}}
            />
          </Tooltip>:
          <p style={{textAlign:'right'}}>{text || ''}</p>}
        </div>
      }
    },
    {
      title: '员工编号',
      dataIndex: 'staff_id',
      width:'80px',
      render: (text, row, index) => {
        return <p>{text}</p>
      }
    },
    {
      title: '姓名',
      dataIndex: 'staff_name',
      width:'80px',
      render: (text, row, index) => {
        return <p>{text}</p>
      }
    },
    {
      title: '得分',
      dataIndex: 'score',
      width:'35px',
      render: (text, row, index) => {
        return <p style={{textAlign:'right'}}>{text}</p>
      }
    },
    {
      title: '贡献度',
      dataIndex: 'cont_degree',
      width:'65px',
      render: (text, row, index) => {
        return  <div>{tag =='0' ?
                  <Tooltip placement="topLeft" arrowPointAtCenter title={score_has_null?'尚有员工无考核成绩，不能调整贡献度':(row.score?`贡献度范围0-100,精确到3位小数`:'未评分,不能调整贡献度')}>
                    <InputNumber
                      disabled={!row.score || score_has_null}
                      id={'cont_degree'+index}
                      min={0}
                      max={100}
                      step={0.1} precision={3} defaultValue={text||0} value={text||0}
                      onChange={(e)=>this.handleChange(e,"cont_degree",index)}
                    />
                  </Tooltip>:
                  <p style={{textAlign:'right'}}>{text || ''}</p>}
                  </div>
      }
    },
    {
      title: '贡献度调整说明',
      dataIndex: 'adjust_reason',
      width: '20%',
      render: (text, row, index) => {
        return  <div>{tag =='0' ?
                <Tooltip style={{textAlign:'left'}} placement="topLeft" arrowPointAtCenter
                         title={score_has_null?'尚有员工无考核成绩，不能填写贡献度调整说明':(
                           row.score?row.adjust_reason&&row.adjust_reason.length>90?`字数100字以内...`:'':'未评分,不能填写贡献度调整说明')
                         }
                >
                  <Input defaultValue={text} value={text} id={'adjust_reason' + index}
                         placeholder={parseFloat(row.cont_degree).toFixed(3) != parseFloat(row.ori_degree).toFixed(3) ? "请输入调整说明...": "字数100字以内..."}
                         disabled={!row.score || score_has_null} onChange={(e)=>this.handleChange(e,"adjust_reason",index)}
                         style={{borderColor: parseFloat(row.cont_degree).toFixed(3) != parseFloat(row.ori_degree).toFixed(3) ? '#FA7252' : '#e5e5e5'}}
                  />
                </Tooltip>:
                <p style={{textAlign:'left'}}>{text}</p>}
              </div>
      }
    },
    {
      title: '得分*贡献度',
      dataIndex: 'last_score',
      width:'80px',
      render: (text, row, index) => {
        return <p style={{textAlign:'right'}}>{text}</p>
      }
    },
    {
      title: '考核评级',
      dataIndex: 'rank',
      width: '65px',
      render: (text, row, index) => {
        return <div>{tag =='0' ? <Select style={{'width': '60px'}} id={'rank' + index}
                                    onSelect={(e) => this.handleChange(e, 'rank', index)}
                                    value={row.rank} disabled={!row.score || score_has_null}>
          {row.rankList && row.rankList.length ?
            row.rankList.map(function (t, index) {
              return (<Option key={t.rank} value={t.rank}>{t.rank}</Option>)
            })
            : null}
        </Select>:<p style={{'width': '60px',textAlign:'center'}}>{text}</p>}
        </div>
      }
    }
  ];
    if(isAll == 'true'){
      columns.splice(2,0,
        {
          title:'项目名称',
          dataIndex:'proj_name_0',
          className:tableStyle.breakcontent,
          render:(text)=>{

            if(text){
              let nameArr=text.split(',');
              return nameArr.map((i,index)=><div key={index} style={{textAlign:'left'}}>{i}</div>)
            }
            return text
          },
        },
        {
          title:'评级',
          dataIndex:'rank_0',
          width: '60px',
          render:(text)=>{
            if(text){
              let nameArr=text.split(',');
              return nameArr.map((i,index)=><div key={index}>{i}</div>)
            }
            return text
          },
        }
      );
    }else{
      columns.splice(1,0,
        {
          title: '部门名称',
          dataIndex: 'dept_name',
          width: '160px',
          render: (text, row, index) => {
            return <p style={{textAlign:'left'}}>{text.split('-')[1]}</p>
          }
        }
      );
    }

    return columns;
  }


     // 导出表格
     outPut = (str) => {
      //const {dispatch} = this.props;
       let postData = {};
                  postData["arg_mdzz"] = "2";
                  postData["arg_mgr_id"] =staffId;
                  postData["arg_year"]=this.props.year;
                  postData["arg_season"]=this.props.season;
                  postData["arg_tenantid"] = Cookie.get('tenantid')+"";
                  postData["proj_id"]=this.props.proid;
                  postData["arg_ranks"]=str
       let url="/microservice/allexamine/examine/informationExport"
      // dispatch({
      //   type: 'pmdist/outPut',
      //   postData,
      // });
      postExcelFile(postData,url)
    };
  /**
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-08-20
   * 功能：分布结果调整触发事件
   * @param e 标签
   * @param name 修改标签名称标识
   * @param index 修改记录索引
   */
  handleChange = function (e,name,index) {
    const {changedRank, empList,tips,team_count,submitTips,rankRatio} = this.state;
    if(name == 'rank'){
      empList[index].rank = e;
      recount(index, changedRank, empList,tips);
      this.setState({
        changedRank,
        empList,
        tips
      })
    }else if(name == 'adjust_reason'){
      if(e.target.value.length > 100){
        message.warning("字数100字以内")
        e.target.value = e.target.value.substr(0,100);
      }
      empList[index][name] = e.target.value;
      this.setState({
        empList
      })
    }else if(name == 'cont_degree'){
      empList[index][name] = e;
      weightSum(team_count,empList,submitTips);
      autoRankByDegree(team_count,empList,changedRank,tips,rankRatio);
      this.setState({
        empList,
        submitTips,
        changedRank,
        tips
      })
    }else if(name == 'order'){
      empList[index][name] = e;
      autoRankByOrder(team_count,empList,changedRank,tips,rankRatio);
      weightSum(team_count,empList,submitTips);
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
    const {submitTips,changedRank,empList,team_count} = this.state;
    if(empScoreSort(submitTips,changedRank,empList,team_count)){
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
   * 功能：保存调整结果
   */
  async save (){
    const {submitTips,team_count} = this.state;
    const {empList} = this.props;
    if(submitTips.score_has_null == true){
      message.warning("尚有员工没有考核成绩，当前正态分布结果无效，不能保存！");
    }else if(!team_count|| !empList || empList.length == 0){
      message.warning("没有员工需进行正态分布，不能保存！");
    }else if(judgeDegree(empList) == true){
      message.warning("尚有贡献度调整说明未填写，不能保存！");
    }else{
      var sort = judgeLastScore(empList);
      if(sort.com_rule == 1){
        message.error("调整后，存在评级为B的员工总分大于评级为A的分数，请调整评级后再保存结果！", "6");
        return;
      }else if(sort.com_rule == 2){
        message.error("调整后，存在评级为C的员工总分大于评级为"+sort.B.rank +"的分数，请调整评级后再保存结果！","6");
        return;
      }else if(sort.com_rule == 3){
        message.error("调整后，存在评级为D的员工总分大于评级为"+sort.C.rank +"的分数，请调整评级后再保存结果！","6");
        return;
      }else if(sort.com_rule == 4){
        message.error("调整后，存在评级为E的员工总分大于评级为"+sort.D.rank +"的分数，请调整评级后再保存结果！", "6");
        return;
      }else {
        //loadflag=true;
        var rankResult = [];
        for(var i=0; i < team_count;i++){
          rankResult.push({"update":{"rank":empList[i].rank,"cont_degree":empList[i].cont_degree,"adjust_reason":empList[i].adjust_reason},"condition":{"id":empList[i].id}});
        }
        let saveRes=await service.empScoresUpdate({
          transjsonarray:JSON.stringify(rankResult)
        });
        if(saveRes && saveRes.RetCode =='1'){
          message.success("正态分布结果保存成功！")
        }else{
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
  submit (){
    const {submitTips,team_count,empList,tips} = this.state;
    const {rankRatio,year,season,submit} = this.props;
    // empList.forEach(item=>{//一季度新加需求-现在恢复暂注
    //   if(item.rank=='A'?false:(item.rank=='C')?false:true)
    //   {
    //     message.warning("第一季度考核存在不为A或C的评级，请重新评级！");
    //     return;
    //   }
    //   })
    let flag = submitTip(submitTips,tips,empList);
    if(flag){
      let ratio = geneProjRemain(rankRatio,tips,year,season);
      let rankList = geneRankList(team_count,empList);
      submit(rankList,ratio);
      //alert("满足条件，可以提交！")
    }
  }

  /**
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-08-20
   * 功能：组件渲染完成后，初始化数据
   */
  componentDidMount(){
    this.init(this.props);
  }

  /**
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-08-20
   * 功能：父组件参数变更后，初始化数据
   * @param nextprops 父组件变更后参数
   */
  componentWillReceiveProps(nextprops){
    this.init(nextprops);
  }

  /**
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-08-20
   * 功能：页面数据初始化
   * @param props 父组件参数
   */
  init = (props) =>{
    const {changedRank,submitTips} = this.state;
    const {empList,isAll} = props;
    let rankRatio = geneRatio(props.rankRatio);
    if(!rankRatio) return ;
    let team_count = props.empList.length;

    let tips = tipsTransInit(rankRatio,team_count);
    initPageByTag(props.rankRatio.tag,rankRatio,team_count,empList,tips,changedRank,submitTips);
    let columns = this.getColumns(props,team_count,isAll);
    this.setState({
      tips,
      team_count,
      empList,
      columns,
      rankRatio
    })
  }
  /**
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-08-20
   * 功能：分布结果导出
   */
  expExl=()=>{
    // const {empList=[],columns=[]}=this.state;
    // exportExcel([{headers:columns,data:empList,sheetName:"正态分布"}],"正态分布")
    let tab=document.querySelector(`#table${this.props.tableID} table`)
    exportExl()(tab,'正态分布')

  }
  render(){
    const{rankRatio,loading,reset,year,season,checker_info,tableID}=this.props;
    const {submitTips,team_count,tips,empList,columns} = this.state;
    let str=""
    empList.forEach(item=>{str+=item.staff_id+item.rank+"y"})
    // let str=JSON.stringify(
    //   empList.map(item=>{
    //   let obj={
    //     "staff_id":item.staff_id,
    //     "arg_rank":item.rank
    //   }
    // return obj
    // }))
    // --------------------------------------------------------------------
    // 2020一季度需求页面显示问题
    let list=JSON.parse(JSON.stringify(tips))
    if((tips instanceof Array)&&tips.length>0){
      if(rankRatio && rankRatio.tag == '1'){
        list.forEach((item,index)=>{
          // if(item.name=="评级比例"){
          //   item.AB="-"
          //   item.B="-"
          //   item.D="-"
          // }
          if(item.name=="上期余数"){
            item.AB="-"
            item.B="-"
            item.D="-"
            item.A="-"
            item.C="-"
          }
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

          if(item.name=="本期余数"){
           item.A=(Number(rankRatio.a_remainder)).toFixed(2)
           item.AB=(Number(rankRatio.a_remainder)+Number(rankRatio.b_remainder)).toFixed(2)
           item.C=(Number(rankRatio.c_remainder)).toFixed(2)
           item.D=(Number(rankRatio.d_remainder)).toFixed(2)
          }
         // return item
          })
      }
      // if(rankRatio && rankRatio.tag == '0'){
      // list.forEach((item,index)=>{
      //   if(item.name!="上期余数"){
      //   item.AB="-"
      //   item.B="-"
      //   item.D="-"
      //   }
      //   return item
      //   })
      // }
    }
    return(
      <div>
        <div style={{float: 'left',marginTop: '-215px'}}>
          <DistInfo year={year} season={season} checker_info={checker_info} checker_name={Cookie.get('username')} team_count={team_count}/>
        </div>
        <div style={{float: 'right',marginTop: '-205px',marginRight:'10px',display:((rankRatio && rankRatio.tag == '0') || (rankRatio && rankRatio.tag == '1') )? 'block' : 'none'}}>
          <RemainderInfo tips={list} loading = {loading}/>
          {/* <RemainderInfo tips={tips} loading = {loading}/> */}
        </div>
        {rankRatio && rankRatio.tag =='0'?
          <div className={Style.div_dist} style={{ marginTop: "-63px"}}>
            <Button onClick={()=>this.outPut(str)}>导出</Button>
            <Upload {...this.state.import} className={Style.upload}><Button disabled={this.state.score_flage}>
              导入</Button></Upload>
            <Button onClick={reset}>重置</Button>
            <Button onClick={() =>this.sort()}>排序</Button>
            <span className={Style.total_degree}>{'贡献度总权重：'+submitTips.degree_sum}</span>
          </div>:null}
        {rankRatio && rankRatio.tag =='1'?
          <div className={Style.div_dist_show}>
            <Button onClick={()=>this.outPut(str)} style={{marginTop:5}}>导出</Button>
          </div>:null}
        <div className={tableStyle.orderTable} id={'table'+tableID}>
        <Table id='table1' style={{width:'100%',marginTop: '-18px'}} size='small' bordered={true} columns={columns} dataSource={empList} loading={loading} pagination={false}/>
        {rankRatio && rankRatio.tag =='0'?
          <PageSubmit title="确定提交正态分布结果吗？" save={()=>this.save()} submit={()=>this.submit()}/>
          :
          null
        }
        </div>
      </div>
    )
  }
}
export default ToDistList;
