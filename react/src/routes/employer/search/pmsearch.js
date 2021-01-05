/**
 * 作者：李杰双
 * 日期：2017/9/1
 * 邮件：282810545@qq.com
 * 文件说明：pm指标查询页面
 */

import Search from './searchUI'
import tableStyle from '../../../components/common/table.less'
import { connect } from 'dva';

class PmSearch extends Search{

  // state={
  //   filterInfo:{}
  //  }

  flags={
    needPro_id:true
  }
  stateMap={
    0:'待提交',
    1:'待审核',
    2:'审核未通过',
    3:'待评价',
    4:'待确认',
    5:'复议',
    6:'待评级',
    7: '待评级',
    10:'考核完成',
    A:'完成情况未填报'
  };
  colorMap={
    0: '#FF7F24',
    1: '#FA7252',
    2: 'red',
    3: '#FA7252',
    4: '#FA7252',
    5: '#FA7252',
    6: '#FA7252',
    7: '#FA7252',
    10: '#green',
    A:'red'
  };


  needSearch=['staff_id', 'staff_name', 'dept_name','proj_name']
  getHeader=()=>{
    return [
      {
        title:'年度',
        dataIndex:'year'
      },
      {
        title:'季度',
        dataIndex:'season',
        render: (text) => text !='0' ? `第${text}季度` :'年度考核'
      },
      {
        title:'部门',
        dataIndex:'dept_name',
        //width:'30%',
        render:(text)=><div style={{textAlign:'left'}}>{text.split('-')[1]}</div>
      },
      {
        title:'项目名称',
        dataIndex:"proj_name",
        className:tableStyle.breakcontent,
        render:(text)=><div style={{textAlign:'left'}}>{text}</div>
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
        title:'得分',
        dataIndex:'score',
        width:'50px',
        render:(text)=><div style={{textAlign:'right'}}>{text}</div>
      },
      {
        title:'项目评级',
        dataIndex:'rank'
      },
      {
        title:'部门评级',
        dataIndex:'dept_rank'
      }
    ];
  }
}


function mapStateToProps(state) {
  const {list,condition,staff_id,staff_name,dept_name,proj_name,season,year} = state.pmsearch;
  return {
    list,
    loading: state.loading.models.pmsearch,
    condition,
    staff_id,
    staff_name,
    dept_name,
    proj_name,
    season,
    year
  };
}
export default connect(mapStateToProps)(PmSearch)
