/**
 * 作者：李杰双
 * 日期：2017/9/1
 * 邮件：282810545@qq.com
 * 文件说明：指标审核UI组件
 */

import {Table} from 'antd'
import { routerRedux } from 'dva/router';
import Cookies from 'js-cookie'
import style from './employer.less'
import tableStyle from '../common/table.less'
import {EVAL_COMP_PERF,EVAL_PROJ_PERF} from '../../utils/config'

export default class CheckUI extends React.Component{
  // flags={
  //   needPro_id:true
  // }
  stateMap={
    1:'待审核',
    2:'审核未通过',
    3:'审核通过' ,
    6:'已评价',
    A:'完成情况未填报'
  };
  stateColor={
    1:'#FF7F24',
    2:'red',
    3:'green',
    6:'green',
    A:'red'
  }
  thead=[
    {
      title:'年度',
      dataIndex:'year'
    },
    {
      title:'季度',
      dataIndex:'season',
      render:(text)=>`第${text}季度`
    },
    {
      title:'部门名称',
      dataIndex:'dept_name',
      render:(text)=><div style={{textAlign:'left'}}>{text}</div>
    },
    {
      title:'姓名',
      dataIndex:'staff_name'
    },
    {
      title:'指标类型',
      dataIndex:'score_type',
      render:(text)=>text==='1'?EVAL_PROJ_PERF:EVAL_COMP_PERF
    },
    {
      title:'项目名称',
      dataIndex:'proj_name',
      // render:(text)=>{
      //   if(text){
      //     let nameArr=text.split(',');
      //     return nameArr.map((i)=><div>{i}</div>)
      //   }
      //   return text
      // },
      render:(text)=><div style={{textAlign:'left'}}>{text}</div>
    },
    {
      title:'状态',
      dataIndex:'state',
      render:(text)=>{
        return <div style={{color:this.stateColor[text]}}>{this.stateMap[text]}</div>
      }
    },
  ];
  /**
   * 作者：李杰双
   * 功能：行点击进入详细页面
   */
  rowClickHandle=(record, index, event)=>{
    const{staff_id,year,season,proj_id,state}=record;
    const {dispatch,route}=this.props;
    let query = {
      staff_id,
        year,
        season,
        proj_id,
        checker_id:Cookies.get('userid'),
        state:state == 'A' ? '3' : state,
        stateTemp:state
    };
    if(route.name == 'value'){
      query['isValue'] = true;
    }
    dispatch(routerRedux.push({
      pathname:`/humanApp/employer/${route.name}/${route.name}Detail`,
      query
    }));
  };
  render(){
    const {list,loading,thead,route,rowClickHandle}=this.props;
    if(route.name === 'value'){
      this.stateMap[3] = '待评价';
      this.stateColor[3] = '#FF7F24'
    }else{
      this.stateMap[3] = '审核通过';
      this.stateColor[3] = 'green'
    }
    return(
      <div className={style.wrap+' '+tableStyle.orderTable}>
        <Table rowClassName={()=>style.rowClass} columns={thead?thead:this.thead} dataSource={list} loading={loading} onRowClick={rowClickHandle?rowClickHandle:this.rowClickHandle}/>

      </div>
    )
  }
}
