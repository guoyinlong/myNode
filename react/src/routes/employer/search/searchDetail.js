/**
 * 作者：李杰双
 * 日期：2017/9/1
 * 邮件：282810545@qq.com
 * 文件说明：指标详情页
 */

import React from 'react'
import {Table,Spin} from 'antd'
import message from '../../../components/commonApp/message'
//import { connect } from 'dva';
import Style from '../../../components/employer/employer.less'
import * as service from '../../../services/employer/search';

// function splitEnter(text){
//   return <p style={{textAlign:'left'}} dangerouslySetInnerHTML={{__html:text.replace(/\n/g,'<br/>')}}></p>
//
// }

const TableWithHeader=({disabled,thead,loading,list,proList})=>{

  let title=list.proj_name?'项目绩效考核指标':'综合绩效考核指标'

  return(
    <div >
      <div className={Style.projectTitle}>
        {list.proj_name?<h2>{list.proj_name}</h2>:null}
        <h3><div>{title}</div></h3>
        {disabled.totalScore?null:<h4>
          <span>总分：{proList.score}</span>
          <span>贡献度：{proList.cont_degree}</span>
          <span>评级：{proList.rank}</span>
        </h4>}
      </div>


      <Table rowKey='id'  bordered={true} columns={thead} dataSource={list.data}  pagination={false}/>
    </div>
  )
}
//把数据按照一个key排序
function arrGroup(arr,key) {
  if(!arr.length){
    return arr
  }
  let ob={};
  let res=[]
  arr.map((i)=>{
    //debugger
    ob[i[key]]?ob[i[key]].push(i):ob[i[key]]=[i]
  })
  for(let k in ob){
    res=res.concat(ob[k])
  }
  return res
}
function getKpiList(kpis,projects) {
  let res=[];
  if(!projects.length&&kpis.length){
    projects=[{proj_name:kpis[0].proj_name}]
  }
  projects.forEach((i)=>{
    if(i.proj_name){
      let data=kpis.filter((j)=>j.proj_name===i.proj_name)
      data=arrGroup(data,'kpi_type')
      res.push({proj_name:i.proj_name,type:0,data})
    }

  })
  let nor=kpis.filter((i)=>!i.proj_name)
  if(nor.length){
    res.push({proj_name:null,type:1,data:nor})
  }
  return res
}

export default class SearchDetail extends React.Component{

  state={
    list:[],
    projects:[],
    loading:true
  };
  disabled={
    totalScore:false
  }
  splitEnter(text=''){
    return <p style={{textAlign:'left'}} dangerouslySetInnerHTML={{__html:text.replace(/\n/g,'<br/>')}}></p>

  }
  getTHead=(rowArr)=>{

    return [
      {
        title:'',
        dataIndex:'kpi_type',
        width:'2%',
        render:(text,row,index)=>{

          return {
            children:text,
            props:{
              rowSpan:rowArr[index]
            }
          }
        }
      },
      {
        title:'分项名称',
        dataIndex:'kpi_name',
        width:'10%',
      },
      {
        title:'计算定义/完成目标',
        dataIndex:'kpi_content',
        width:'33%',
        render:(text)=>this.splitEnter(text)
      },
      {
        title:'评价标准/计分办法',
        dataIndex:'formula',
        width:'33%',
        render:(text)=>this.splitEnter(text)
      },
      {
        title:'考核人',
        dataIndex:'checker_name',

      },
      {
        title:'得分',
        dataIndex:'score',
      },
    ];
  }
  async componentDidMount(){
    try{
      let query=this.props.location.query
      let projects=(await service.empscorequery({
        transjsonarray:JSON.stringify(
          {"condition":{...query,"tag":'0'},"sequence":[{"create_time":"0"}]}
        )
      })).DataRows;
      let list=(await service.empkpiquery({
        transjsonarray:JSON.stringify({condition:{...query}})
      })).DataRows
      if(!list.length){
        throw new Error('查询结果为空！请返回')
      }
      this.setState({
        projects,
        list,
        loading:false
      })
    }catch (e){
      message.error(e.message)
      this.setState({
        loading:false
      })
    }

    // service.empscorequery({
    //   transjsonarray:JSON.stringify(
    //     {"condition":{...query,"tag":'0'},"sequence":[{"create_time":"0"}]}
    //   )
    // }).then(res=>{
    //   this.setState({projects:res.DataRows})
    //   return service.empkpiquery({
    //     transjsonarray:JSON.stringify({condition:{...query}})
    //   })
    // }).then(res=>{
    //   this.setState({list:res.DataRows,})
    //   this.setState({loading:false})
    // })
  }
  render(){
    //const {list,loading,projects}=this.props;

    const {list,projects,loading}=this.state;

    const dataList=getKpiList(list,projects)
    return(
      <div className={Style.wrap}>
        <Spin spinning={loading} delay={500}>
          {list.length?<div className={Style.nameInfo}>
            <div>
              <p>
                考核周期<br/>
                {projects.length?projects[0].year:list[0].year}年<br />
                第{projects.length?projects[0].season:list[0].season}季度
              </p>
            </div>

            <div>
              {list[0].staff_name}<br/>
              NO.{list[0].staff_id}
            </div>
          </div>:null}

          {dataList.length?
            dataList.map((i,index)=>{
              let type={}
              i.data.forEach((i,index)=>{
                if(!type[i.kpi_type]){
                  type[i.kpi_type]=[index]
                }else{
                  type[i.kpi_type].push(index)
                }
              })
              let head=[];
              for(let k in type){
                if(type[k]&&type[k].length){
                  type[k].forEach((i,index)=>{
                    head.push(index===0?type[k].length:0)
                  })
                }
              }

              return <TableWithHeader loading={loading} disabled={this.disabled} thead={this.getTHead(head)}  list={i} key={index} proList={projects[index]}/>
            })
            :null
          }
        </Spin>

      </div>

    )
  }
}


// function mapStateToProps(state) {
//   let { list,projects} = state.searchDetail;
//   if(list.length){
//     list.map((i,index)=>i.key=index)
//   }
//   return {
//     list,
//     loading: state.loading.models.searchDetail,
//     projects
//   };
// }
// export default connect(mapStateToProps)(SearchDetail)
