/**
 * 文件说明：中层指标详情页面
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-09-15
 */
import React from 'react';
import { connect } from 'dva';
import Style from '../../../components/employer/searchDetail.less'
import Project_kpiBox from '../../../components/employer/kpiItem'
import Report from '../../../components/employer/Report'
import {EVAL_PLUS_MINUS_SCORE} from '../../../utils/config'

/**
 * 功能：特殊字符处理
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-09-15
 * @param text 待处理字符串
 */
function splitEnter(text){
  if(text)
    return <p style={{textAlign:'left'}} dangerouslySetInnerHTML={{__html:text.replace(/\n/g,'<br/>')}}></p>
};

/**
 * 功能：指标目标分值求和
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-09-15
 * @param data 待求和指标集
 * @returns {number} 指标目标分值总和
 */
function weightSum(data) {
  let sum = 0;
  if(data && data.length){
    data.map((i) =>{
      let kpi_score = 0;
      if(i.target_score && i.kpi_type != EVAL_PLUS_MINUS_SCORE){
        kpi_score = parseFloat(i.target_score);
      }
      sum+=kpi_score;
    })
  }
  return sum;
}

/**
 * 功能：中层指标详情
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-09-15
 */
class LeaderKpi extends React.Component {

  state={
    title:'绩效考核指标',
    dataSource:[],
    totalScore:'',
    kpiTypes:[],
    query:this.props.location.query
  }

  /**
   * 功能：页面渲染完成后操作
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-09-15
   */
  componentDidMount(){
    this.init()
  }

  /**
   * 功能：父组件变化后操作
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-09-15
   * @param nextProps 父组件参数
   */
  componentWillReceiveProps(){
    this.init()
  }

  /**
   * 功能：初始化页面数据
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-09-15
   */
  init =() =>{
    const {list,leaderKpiList} = this.props;
    if(list && list.length){
      list.map((i,index)=>i.key=index)
    }

    //获取kpi_type
    let kpi_types=new Set();
    if(leaderKpiList && leaderKpiList.length){
      leaderKpiList.forEach(i=>{
        kpi_types.add(i.kpi_type)
      })
    }

    this.setState({
      dataSource:leaderKpiList,
      kpiTypes:Array.from(kpi_types),
      totalScore:weightSum(leaderKpiList),
      loading:false
    })
  }
  render(){
    const{list}=this.props;
    const { kpiTypes, dataSource,totalScore,query} = this.state;
    return(
      <div>
      <div className={Style.wrap}>
        {dataSource && dataSource.length?
          <Project_kpiBox project={list} kpiTpyes={kpiTypes} list={dataSource} noScore totalScore={totalScore}/>
          :null}
      </div>
      <div className={Style.wrap} style={{marginTop:'10px'}}>
        <Report staff_id = {query.staff_id} year={query.year} ></Report>
      </div>
      </div>
    )
  }
}

/**
 * 功能：state数据注入组件
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-09-15
 * @param state 状态树
 */
function mapStateToProps(state) {
  const { year,list,leaderKpiList} = state.leaderSearch;
  if(leaderKpiList && leaderKpiList.length){
    leaderKpiList.map((i,index)=>i.key=index)
  }

  return {
    year,
    list,
    leaderKpiList,
    loading: state.loading.models.leaderSearch,
  };
}
export default connect(mapStateToProps)(LeaderKpi)
