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
import { connect } from 'dva';
import Style from '../../../components/employer/searchDetail.less'
import * as service from '../../../services/employer/search';
import * as reService from '../../../services/employer/empservices';
import {EVAL_EMP_FIXED_KPI_TYPE,EVAL_MGR_FIXED_KPI_TYPE,EVAL_CORE_BP_KPI} from '../../../utils/config'
import { routerRedux } from 'dva/router';
import {postExcelFile} from "../../../utils/func.js"

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
 class SearchDetail extends React.Component{

  state={
    list:[],
    projects:[],
    loading:true,
    kpi_types:[],
    noScore:false,
    scoreDetails:false,
    toCheck:false,
    needRevocation:false,
    isValue:false,
    filterInfo:"",
    dept_name:"",
    staff_id:"",
    staff_name:"",
    proj_name:"",
    proj_name_0:"",
    selectOuid:"",
    search_year:"",
    search_season:"",
    focusName:"",
    role:"",
    bp_backPage:0
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
      if( query.filterInfo){
        this.setState({
          filterInfo:query.filterInfo
        })
        delete query.filterInfo;
      }
      if( query.dept_name){
        this.setState({
          dept_name:query.dept_name
        })
        delete query.dept_name;
      }
      if( query.search_staff_id){
        this.setState({
          staff_id:query.search_staff_id
        })
        delete query.search_staff_id;
      }
      if( query.search_staff_name){
        this.setState({
          staff_name:query.search_staff_name
        })
        delete query.search_staff_name;
      }
      if( query.proj_name){
        this.setState({
          proj_name:query.proj_name
        })
        delete query.proj_name;
      }
      if( query.proj_name_0){
        this.setState({
          proj_name_0:query.proj_name_0
        })
        delete query.proj_name_0;
      }
      if( query.selectOuid){
        this.setState({
          selectOuid:query.selectOuid
        })
        delete query.selectOuid;
      }
      if( query.focusName){
        this.setState({
          focusName:query.focusName
        })
        delete query.focusName;
      }
      if( query.role){
        this.setState({
          role:query.role
        })
        delete query.role;
      }
      if( query.search_year){
        this.setState({
          search_year:query.search_year
        })
        delete query.search_year;
      }
      if( query.search_season){
        this.setState({
          search_season:query.search_season
        })
        delete query.search_season;
      }
      if( query.bp_backPage){ //返回页面
        this.setState({
          bp_backPage:query.bp_backPage
        })
        delete query.bp_backPage;
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
       // debugger
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


  //带筛选状态返回页面
  backPage=()=>{
  const {dispatch}=this.props;
    let query={
      param:this.state.filterInfo,
      dept_name:this.state.dept_name,
      staff_id:this.state.staff_id,
      staff_name:this.state.staff_name,
      proj_name:this.state.proj_name,
      proj_name_0:this.state.proj_name_0,
    }
     let path = location.hash.split('/')[location.hash.split('/').length-2]
      if(path=="bpsearch"){
        query['search_season']=this.state.search_season,
        query['search_year']=this.state.search_year,
        query ['selectOuid']=this.state.selectOuid,
        query['focusName']=this.state.focusName,
        query['role']=this.state.role,
        query['bp_backPage']=this.state.bp_backPage
      }

      dispatch(routerRedux.push({
        pathname:`/humanApp/employer/${path}`,
        //pathname:`/humanApp/employer/hrsearch`,
        query
      }))
  }

   expot_kpi=()=>{
   let params={}
   let arr=window.location.hash.split('?')[1].split('&')
    arr.forEach(item=>{
    if(item.indexOf('season')>-1){
      params['arg_season']=item.split("=")[1]
    }
    if(item.indexOf('staff_id')>-1){
    params['arg_staffid']=item.split("=")[1]
    }
    if(item.indexOf('year')>-1){
    params['arg_year']=item.split("=")[1]
    }
    })
   postExcelFile(params,"/microservice/allexamine/examine/empkpiexport")
  } 

  render(){

    const {list,projects,kpi_types,noScore,scoreDetails,toCheck,needRevocation,isValue}=this.state;
    let path = location.hash.split('/')[location.hash.split('/').length-2]
    return(
      <div>
        {
         path=="manage"&&<Button style={{float:"right",marginRight:25,marginTop:10}} onClick={this.expot_kpi}>导出</Button>  
        }
        {
         path!="manage" &&<Button style={{float:"right",margin:10,color: "#fff",backgroundColor: "#FA7252"}} onClick={this.backPage}>返回</Button>
        }
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
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
  ...state.searchDetail//这里因为需要dispatch所以开了model
  };
}

export default connect(mapStateToProps)(SearchDetail)