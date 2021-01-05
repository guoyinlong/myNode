/**
 * 作者：李杰双
 * 日期：2017/9/1
 * 邮件：282810545@qq.com
 * 文件说明：指标详情页
 */

import React from 'react'
import {Popconfirm,Button} from 'antd'
import message from '../../../components/commonApp/message'
import Project_kpiBox from '../../../components/employer/kpiItem'
//import { connect } from 'dva';
import Style from '../../../components/employer/searchDetail.less'
import * as service from '../../../services/employer/search';
import * as reService from '../../../services/employer/empservices';
import {EVAL_EMP_FIXED_KPI_TYPE,EVAL_MGR_FIXED_KPI_TYPE,EVAL_CORE_BP_KPI} from '../../../utils/config'

/**
 * 作者：李杰双
 * 功能：计算单个项目总得分
 */
function weightSum(data,proj) {
  let sum = 0;
  if(data && data.length){
    data.map((i,index) =>{
      i.key = index;
      let kpi_score = 0;
      if(i.target_score && i.proj_id == proj.proj_id){
        kpi_score = parseFloat(i.target_score);
      }
      sum+=kpi_score;
    })
  }
  return sum.toFixed(2);
}
export default class SearchDetail extends React.Component{

  state={
    list:[],
    projects:[],
    loading:true,
    kpi_types:[],
    noScore:false,
    scoreDetails:false,
    toCheck:false,
    needRevocation:false,
    isValue:false
  };

  /**
   * 作者：李杰双
   * 功能：更加url参数查询kpi详细信息
   */
  async componentDidMount(){
    try{
      let query=this.props.location.query;
      let isValue = false;
      let needRevocation = false;
      let stateTemp = '';
      if(query.needRevocation){
        needRevocation = query.needRevocation;
        delete query.needRevocation;
      }
      if(query.isValue){
        isValue = query.isValue;
        delete query.isValue;
      }
      if( query.stateTemp){
        stateTemp = query.stateTemp;
        delete query.stateTemp;
      }
      let projects=(await service.empscorequery({
        transjsonarray:JSON.stringify(
          {"condition":
            {"proj_id":query.proj_id,"staff_id":query.staff_id,"year":query.year,"season":query.season,"tag":'0'},
            "sequence":
              [{"create_time":"0"}]
          }
        )
      })).DataRows;
      let list=(await service.empkpiquery({
        transjsonarray:JSON.stringify({condition:{...query}})
      })).DataRows
      if(!list.length){
        throw new Error('查询结果为空！请返回')
      }
      //获取kpi_type
      let kpi_types=new Set();
      let toCheck = true;
      list.forEach(i=>{
        kpi_types.add(i.kpi_type)
        if(i.kpi_type != EVAL_EMP_FIXED_KPI_TYPE && i.kpi_type != EVAL_MGR_FIXED_KPI_TYPE && i.state != 1&&i.kpi_type != EVAL_CORE_BP_KPI){
          toCheck = false;
        }
      })


      this.setState({
        kpi_types:Array.from(kpi_types),
        projects,
        list,
        loading:false,
        toCheck,
        needRevocation,
        isValue,
        stateTemp,
      })
    }catch (e){
      message.error(e.message)
      this.setState({
        loading:false
      })
    }
  }

  revocation=()=>{
    //revocationKpi
    let query=this.props.location.query;
    reService.empKpiRevocation({
      arg_year:query.year,
      arg_season:query.season,
      arg_staff_id:query.staff_id
    }).then(res=>{
      if(res.RetCode === '1'){
        message.success("指标撤回成功！")
        this.props.history.goBack()
      }else if(res.RetCode === '2'){
        message.error("指标已被部分审核，不可撤销！")
      }else{
        message.error("指标撤销失败！")
      }

    }).catch((err)=>{
      message.error(err.message)
    })

  }
  render(){

    const {list,projects,kpi_types,noScore,scoreDetails,toCheck,needRevocation,isValue}=this.state;
   // debugger
    return(
      <div className={Style.wrap} >
        {
          projects.map((i,index)=>{
            return <Project_kpiBox
              key={index}
              project={i}
              kpiTpyes={kpi_types}
              list={list}
              noScore={noScore}
              totalScore={weightSum(list,i)}
              scoreDetails={scoreDetails}
              isValue = {isValue}
              stateTemp = {this.state.stateTemp}
            />
          })
        }
        {needRevocation == 'true' ?
          <div style={{textAlign:'right'}}>
            <Popconfirm title={"确定撤销指标吗？"} onConfirm={this.revocation} onCancel={this.cancel} okText="确定" cancelText="取消">
              <Button  type="primary" title={toCheck?'可撤销':'已有指标被审核，不可撤销！'} disabled={toCheck != undefined && !toCheck}>指标撤销</Button>
            </Popconfirm>
          </div>
          :null}

      </div>

    )
  }
}
