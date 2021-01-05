/**
 * 作者：张枫
 * 创建日期：2019-09-02
 * 邮件：zhangf142@chinaunicom.cn
 * 文件说明：工位申请-申请记录查询
 */
import React from 'react';
import { connect } from 'dva';
import { Button ,DatePicker,Table,Pagination,Select} from "antd";
import Cookie from 'js-cookie';
import { routerRedux } from "dva/router";
import styles from "./apply.less"
const { RangePicker } = DatePicker;
const { Option } =  Select

/**
 * 作者：张枫
 * 创建日期：2019-09-02
 * 邮件：zhangf142@chinaunicom.cn
 * 文件说明：工位申请-申请记录查询
 */
class ApplyRecord extends React.PureComponent {
  constructor(props) {super(props);}
  state = {
  };
  //更改页码
  changePage =(page)=>{
    this.props.dispatch({
      type:"applyRecord/changePage",
      page:page,
    })
  }
  //申請開始時間
  beginTime = (date,dateString)=>{
    console.log("date");
    console.log(dateString);
    this.props.dispatch({
      type:"applyRecord/beginTime",
      data:dateString,
    })
  }
  //申請結束時間
  endTime = (date,dateString)=>{
    this.props.dispatch({
      type:"applyRecord/endTime",
      data:dateString,
    })
  }
  //清空查询时间
  clearDate = ()=>{
    this.props.dispatch({
      type:"applyRecord/clearDate",
    })
  }
  // 返回至申请页面goBack
  goBack =()=>{
    this.props.dispatch(
      routerRedux.push({
        pathname:"/adminApp/compRes/officeResMain/apply"
      })
    )
  }

  // 点击审批记录行  跳转至审批记录页面   待补充
  changeRow =(record,page)=>{
    this.props.dispatch(
      routerRedux.push({
        pathname:"/adminApp/compRes/officeResMain/apply/applyRecord/Details",
        query:record,
      })
    )
  }

  //根据条件生成filter选项
  getRealRecord = (record,key) =>{
    const midRecord = JSON.parse(JSON.stringify(record));
    let realList = [];
    let realRecord = [];
    let realRecordList = [];
    midRecord.map((v) => {
      realList.push(v[key]);
    });
    realRecord = Array.from(new Set(realList));
    realRecord.map((v) => {
      realRecordList.push({text:v,value:v})
    })
    return realRecordList;
  };
  // 选择申请类型
  selectApply = (key)=>{
    this.props.dispatch({
      type:"applyRecord/saveSelectValue",
      data:key,
    })
  }
  // 选择审批状态
  selectState = (key)=>{
    this.props.dispatch({
      type:"applyRecord/saveStateValue",
      data:key,
    })
  }
  render(){
   const applyList = this.props.applyList.map((item,index)=>{
     return(
       <Option key = {item.stateType}>{item.name}</Option>
     )
   })

    const stateList = this.props.stateList.map((item,index)=>{
      return(
        <Option key = {item.stateType}>{item.name}</Option>
      )
    })
   const columns = [
      {
        dataIndex:"apply_time",
        title:"申请时间",
        render  :(text)=>{
          return(<div>{text}</div>)
        }
      },{
        dataIndex:"num",
        title:"申请数量（个）",
        render  :(text)=>{
          return(<div>{text}</div>)
        }
      },
      {
        dataIndex:"days",
        title:"申请时长（天）",
        render  :(text)=>{
          return(<div>{text}</div>)
        }
      },{
        dataIndex:"begin_time",
        title:"开始时间",
        render  :(text)=>{
          return(<div>{text}</div>)
        }
      },{
        dataIndex:"end_time",
        title:"到期时间",
        render  :(text)=>{
          return(<div>{text}</div>)
        }
      },{
        dataIndex:"type_desc",
        title:"申请类型",
      // filters: this.getRealRecord(this.props.recordList,"type_desc"),
       //filterMultiple: false,
      // onFilter: (value, record) => record.type_desc.indexOf(value) === 0,
        render  :(text)=>{
          return(<div>{text}</div>)
        }
      },{
        dataIndex:"state_desc",
        title:"审批状态",
      //  filters: this.getRealRecord(this.props.recordList,"state_desc"),
         //filterMultiple: false,
       // onFilter: (value, record) => record.state_desc.indexOf(value) === 0,
        render  :(text)=>{return(<div>{text}</div>)}
      }
    ]
    return (
      <div className = {styles.page}>
        <div className = {styles.title}>申请记录查询</div>
        <div>
          部门：{Cookie.get("deptname")}
        </div>
        <div style = {{textAlign:"right"}}><Button type="primary" onClick = {this.goBack}>{"返回"}</Button></div>
        <div className = {styles.dateSearch}>
          <div>
            <span>申请时间：</span>
            <RangePicker style = {{width:"200px"}}onChange = {this.beginTime}></RangePicker>
          </div>
          <div>
            <span style={{paddingLeft:"10px"}}>到期时间：</span>
            <RangePicker style = {{width:"200px"}} onChange = {this.endTime}></RangePicker>
          </div>
        </div>
        <div style={{marginBottom:"5px"}} className = {styles.dateSearch}>
          <div>
            <span>申请类型：</span>
              <Select style = {{width:"200px"}} onSelect = {(key)=>this.selectApply(key)}>
                {applyList}
            </Select>
          </div>
          <div>
          <span>审批状态：</span>
            <Select style = {{width:"200px"}} onSelect = {(key)=>this.selectState(key)}>
              {stateList}
            </Select>
          </div>
        </div>
        <Table
          columns = {columns}
          dataSource = {this.props.recordList}
          className = { styles.table }
          onRowClick = {this.changeRow}
          pagination = {false}
        >
        </Table>
        <Pagination
          current = { this.props.page }
          total = {this.props.total}
          pageSize = {this.props.pageSize}
          onChange = {this.changePage }
          className = { styles.pagination }
        />

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading:state.loading.models.applyRecord,
    ...state.applyRecord
  }
}

export default connect(mapStateToProps)(ApplyRecord);

/**


////////////////////////////////////////////////////////



import React from 'react';
import { connect } from 'dva';
import { Button ,DatePicker,Table,Pagination} from "antd";
import Cookie from 'js-cookie';
import { routerRedux } from "dva/router";
import styles from "./apply.less"
const { RangePicker } = DatePicker;


class ApplyRecord extends React.PureComponent {
  constructor(props) {super(props);}
  state = {
  };
  //更改页码
  changePage =(page)=>{
    this.props.dispatch({
      type:"applyRecord/changePage",
      page:page,
    })
  }
  //申請開始時間
  beginTime = (date,dateString)=>{
    console.log("date");
    console.log(dateString);
    this.props.dispatch({
      type:"applyRecord/beginTime",
      data:dateString,
    })
  }
  //申請結束時間
  endTime = (date,dateString)=>{
    this.props.dispatch({
      type:"applyRecord/endTime",
      data:dateString,
    })
  }
  //清空查询时间
  clearDate = ()=>{
    this.props.dispatch({
      type:"applyRecord/clearDate",
    })
  }
  // 返回至申请页面goBack
  goBack =()=>{
    this.props.dispatch(
      routerRedux.push({
        pathname:"/adminApp/compRes/officeResMain/apply"
      })
    )
  }

  // 点击审批记录行  跳转至审批记录页面   待补充
  changeRow =(record,page)=>{
    this.props.dispatch(
      routerRedux.push({
        pathname:"/adminApp/compRes/officeResMain/apply/applyRecord/Details",
        query:record,
      })
    )
  }
  //根据条件生成filter选项
  getRealRecord = (record,key) =>{
    const midRecord = JSON.parse(JSON.stringify(record));
    let realList = [];
    let realRecord = [];
    let realRecordList = [];
    midRecord.map((v) => {
      realList.push(v[key]);
    });
    realRecord = Array.from(new Set(realList));
    realRecord.map((v) => {
      realRecordList.push({text:v,value:v})
    })
    return realRecordList;
  };

  render(){
    let { recordList } = this.props;
    let filterData = [];
    let stateDescData = [];
    recordList.length!=0 && recordList.map((item,index)=>{
      filterData.push({
        text:item.type_desc,
        value:item.type_desc
      })
      stateDescData.push({
        text:item.state_desc,
        value:item.state_desc
      })
    });
    const columns = [

      {
        dataIndex:"apply_time",
        title:"申请时间",
        render  :(text)=>{
          return(<div>{text}</div>)
        }
      },{
        dataIndex:"num",
        title:"申请数量（个）",
        render  :(text)=>{
          return(<div>{text}</div>)
        }
      },
      {
        dataIndex:"days",
        title:"申请时长（天）",
        render  :(text)=>{
          return(<div>{text}</div>)
        }
      },{
        dataIndex:"begin_time",
        title:"开始时间",
        render  :(text)=>{
          return(<div>{text}</div>)
        }
      },{
        dataIndex:"end_time",
        title:"到期时间",
        render  :(text)=>{
          return(<div>{text}</div>)
        }
      },{
        dataIndex:"type_desc",
        title:"申请类型",
        filters: this.getRealRecord(this.props.recordList,"type_desc"),
        //filterMultiple: false,
        onFilter: (value, record) => record.type_desc.indexOf(value) === 0,
        // filters:filterData,
        //  onFilter: (value, record) => record.type_desc.includes(value),
        render  :(text)=>{
          return(<div>{text}</div>)
        }
      },{
        dataIndex:"state_desc",
        title:"审批状态",
        filters: this.getRealRecord(this.props.recordList,"state_desc"),
        filterMultiple: false,
        onFilter: (value, record) =>record.state_desc.indexOf(value) === 0,
        key: "state_desc",
        render: (text,record) => {
          return (<a href="javascript:;" onClick={() => this.changeRow(record,"applyPage")}>{text}</a> )
        }
      }
    ]
    return (
      <div className = {styles.page}>
        <div className = {styles.title}>申请记录查询</div>
        <div>
          部门：{Cookie.get("deptname")}
        </div>
        <div style = {{textAlign:"right"}}><Button type="primary" onClick = {this.goBack}>{"返回"}</Button></div>
        <div className = {styles.dateSearch}>
          <div>
            <span>申请时间查询：</span>
            <RangePicker onChange = {this.beginTime}></RangePicker>
          </div>
          <div>
            <span style={{paddingLeft:"10px"}}>到期时间查询：</span>
            <RangePicker onChange = {this.endTime}></RangePicker>
          </div>
        </div>
        <Table
          columns = {columns}
          dataSource = {this.props.recordList}
          pagination = {false}
          className = { styles.table }
          onRowClick = {this.changeRow}
        >
        </Table>
        <Pagination
          current = { this.props.page }
          total = {this.props.total}
          pageSize = {this.props.pageSize}
          onChange = {this.changePage }
          className = { styles.pagination }
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading:state.loading.models.applyRecord,
    ...state.applyRecord
  }
}

export default connect(mapStateToProps)(ApplyRecord);

**/
