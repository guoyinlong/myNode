/**
 * 作者：李杰双
 * 日期：2017/9/1
 * 邮件：282810545@qq.com
 * 文件说明：dm指标查询页面
 */

import Search from './searchUI'

import { connect } from 'dva';



class DmSearch extends Search{
  // state={
  //   lyq:this.flags
  //  }

  getHeader=()=>{
    return [
      {
        title:'年度',
        dataIndex:'year',
      },
      {
        title:'季度',
        dataIndex:'season',
        render: (text) => text !='0' ? `第${text}季度` :'年度考核'

      },
      {
        title:'部门',
        dataIndex:'dept_name',
        width:'40%',
        render:(text)=><div style={{textAlign:'left'}}>{text}</div>
      },
      {
        title:'绩效类型',
        dataIndex:"score_type",
        render:(text)=>text==='1'?'项目绩效':'综合绩效'
      },
      {
        title:'姓名',
        dataIndex:'staff_name',
      },
      {
        title: '员工编号',
        dataIndex: 'staff_id',
        render: (text) => <div>'{text}'</div>
      },
      {
        title:'状态',
        dataIndex:'state',
        render:(text)=>{
          return <div style={{color:this.colorMap[text]}}>{this.stateMap[text]}</div>
        }
      },

      {
        title:'考核得分',
        dataIndex:'score',
        render:(text)=><div style={{textAlign:'right'}}>{text}</div>
      },
      {
        title:'考核评级',
        dataIndex:'rank'
      },

    ]
  }
  needSearch=['staff_id', 'staff_name']
  // thead=[
  //   {
  //     title:'年度',
  //     dataIndex:'year'
  //   },
  //   {
  //     title:'季度',
  //     dataIndex:'season',
  //     render:(text)=>`第${text}季度`
  //   },
  //   {
  //     title:'部门',
  //     dataIndex:'dept_name',
  //     width:'40%'
  //   },
  //   {
  //     title:'绩效类型',
  //     dataIndex:"score_type",
  //     render:(text)=>text==='1'?'项目绩效':'综合绩效'
  //   },
  //   {
  //     title:'姓名',
  //     dataIndex:'staff_name',
  //   },
  //   {
  //     title:'状态',
  //     dataIndex:'state',
  //     render:(text)=>{
  //       return <div style={{color:text==='0'?"#FF7F24":''}}>{this.stateMap[text]}</div>
  //     }
  //   },
  //
  //   {
  //     title:'考核得分',
  //     dataIndex:'score'
  //   },
  //   {
  //     title:'考核评级',
  //     dataIndex:'rank'
  //   },
  //
  // ];
}


function mapStateToProps(state) {
  const { list,condition,staff_id,staff_name,season,year,dept_param} = state.search;

  return {
    list,
    loading: state.loading.models.search,
    condition,
    staff_id,
    staff_name,
    season,
    year,
    dept_param
  };
}
export default connect(mapStateToProps)(DmSearch)
