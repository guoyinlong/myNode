/**
 * 作者：陈莲
 * 日期：2018-12-26
 * 邮箱：chenl192@chinaunicom.cn
 * 文件说明：个人考核部门项目余数信息展示
 */
import React from 'react';
import {connect } from 'dva';
import { Table ,Button} from 'antd';
import message from '../../../components/commonApp/message';
import styles from '../../../components/common/table.less';
import Style from '../../../components/employer/employer.less';
import DistInfo from '../../../components/employer/ProjDistInfo';
import RemainderInfo from '../../../components/employer/RemainderInfo';

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
  tips.push({"name":"上期余数","A":parseFloat(rankRatio.a_remainder).toFixed(2),"B":parseFloat(rankRatio.b_remainder).toFixed(2),"C":parseFloat(rankRatio.c_remainder).toFixed(2),"D":parseFloat(rankRatio.d_remainder).toFixed(2),"AB":(parseFloat(rankRatio.a_remainder) + parseFloat(rankRatio.b_remainder)).toFixed(2)});
  var t_AB = Math.floor(team_count *  parseFloat(rankRatio.a_ratio) + parseFloat(rankRatio.a_remainder))+Math.floor(team_count *  parseFloat(rankRatio.b_ratio) + parseFloat(rankRatio.b_remainder));
  var tip = {A:team_count *  parseFloat(rankRatio.a_ratio) + parseFloat(rankRatio.a_remainder)>0 ? Math.floor(team_count *  parseFloat(rankRatio.a_ratio) + parseFloat(rankRatio.a_remainder)):0,
    B:team_count *  parseFloat(rankRatio.b_ratio) + parseFloat(rankRatio.b_remainder) > 0 ? Math.floor(team_count *  parseFloat(rankRatio.b_ratio) + parseFloat(rankRatio.b_remainder)):0,
    C:team_count *  parseFloat(rankRatio.c_ratio) + parseFloat(rankRatio.c_remainder) > 0 ? Math.floor(team_count *  parseFloat(rankRatio.c_ratio) + parseFloat(rankRatio.c_remainder)):0,
    D:team_count *  parseFloat(rankRatio.d_ratio) + parseFloat(rankRatio.d_remainder) > 0 ? Math.floor(team_count *  parseFloat(rankRatio.d_ratio) + parseFloat(rankRatio.d_remainder)):0};
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
    //"AB":Math.floor(team_count *  parseFloat(rankRatio.a_ratio) + parseFloat(rankRatio.a_remainder))+Math.floor(team_count *  parseFloat(rankRatio.b_ratio) + parseFloat(rankRatio.b_remainder))});
    "AB":tip.A + tip.B});
  tips.push({"name":"本期余数",
    "A":((team_count *  parseFloat(rankRatio.a_ratio) + parseFloat(rankRatio.a_remainder)).toFixed(2) - tips[2].A).toFixed(2),
    "B":((team_count *  parseFloat(rankRatio.b_ratio) + parseFloat(rankRatio.b_remainder)).toFixed(2) - tips[2].B).toFixed(2),
    "C":((team_count *  parseFloat(rankRatio.c_ratio) + parseFloat(rankRatio.c_remainder)).toFixed(2) - tips[2].C).toFixed(2),
    "D":((team_count *  parseFloat(rankRatio.d_ratio) + parseFloat(rankRatio.d_remainder)).toFixed(2) - tips[2].D).toFixed(2),
    "AB":((team_count *  parseFloat(rankRatio.a_ratio) + parseFloat(rankRatio.a_remainder) + team_count *  parseFloat(rankRatio.b_ratio) + parseFloat(rankRatio.b_remainder)).toFixed(2)- tips[2].A  - tips[2].B).toFixed(2)});
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

  // tips.splice(3,0,{"name":"实际数量",
  //   "A":t.A,
  //   "B":t.B,
  //   "C":t.C,
  //   "D":t.D,
  //   "AB":t.A+t.B});
  //console.log("222tips:"+JSON.stringify(tips))
  return tips;
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
function tipsTransInit2 (rankRatio,team_count) {
  let tips =[];

  tips.push({"name":"评级比例","A":parseFloat(rankRatio.a_ratio),"B":parseFloat(rankRatio.b_ratio),"C":rankRatio.c_ratio,"D":rankRatio.d_ratio,"AB":parseFloat(rankRatio.a_ratio)+parseFloat(rankRatio.b_ratio)});
  tips.push({"name":"本期余数","A":parseFloat(rankRatio.a_remainder).toFixed(2),"B":parseFloat(rankRatio.b_remainder).toFixed(2),"C":parseFloat(rankRatio.c_remainder).toFixed(2),"D":parseFloat(rankRatio.d_remainder).toFixed(2),"AB":(parseFloat(rankRatio.a_remainder) + parseFloat(rankRatio.b_remainder)).toFixed(2)});

  return tips;
}
/**
 * 作者：张楠华
 * 创建日期：2017-08-21
 * 功能：部门余数信息展示
 */
class ProjRemain extends React.Component{
  /**
   * 作者：张楠华
   * 创建日期：2017-08-21
   * 功能：初始化函数
   */
  constructor(props){
    super(props)
  }

  /**
   * 作者：张楠华
   * 创建日期：2017-08-21
   * 功能：render函数：展示界面
   */
  render() {
    const {list,year,season,loading} = this.props;
    return (
        <div className={Style.wrap}>
        <h4 style={{ textAlign:"left", fontSize: "29px", fontFamily:"宋体", fontWeight:"bold",marginBottom:'30px'}}>{year}年{season}季度部门内员工参与项目余数信息</h4>
      {list&&list.length ?
        list.map((item,index)=>
        <div style={{marginBottom:'40px'}}>
          <div style={{float: 'left',width: '660px'}} >
              <DistInfo proj_name={item.proj_name} checker_info={'项目经理'}
                checker_name={item.mgr_name} team_count={item.kpiFillCounts}/>
          </div>
          {item.tag == '0' ?
          <RemainderInfo tips={tipsTransInit(item,item.kpiFillCounts)} loading = {loading}/> :
          <div>
          <RemainderInfo tips={tipsTransInit2(item,item.kpiFillCounts)} loading = {loading}/>
          </div>
        }


        </div>
      )
      :<h3>该部门本季度无参与项目员工</h3>
      }


        </div>
    );
  }
}
/**
 * 作者：张楠华
 * 创建日期：2017-08-21
 * 功能：mapStateToProps函数：链接models层和routes层
 */
function mapStateToProps (state) {
  const {list,year,season} = state.projremain;
  return {
    loading: state.loading.models.projremain,
    list,
    year,
    season
  };
}

export default connect(mapStateToProps)(ProjRemain);
