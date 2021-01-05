/**
 * 作者：张枫
 * 创建日期：2019-07-09
 * 邮件：zhangf142@chinaunicom.cn
 * 文件说明：会议确认
 */
import React from 'react';
import { connect }  from 'dva';
import styles from './meetingStyle.less';
import { Table,Select,Button,Tabs,Modal,Popconfirm,Input,Collapse,Pagination} from 'antd';
import {routerRedux} from 'dva/router';
const { Option } = Select;
const TabPane = Tabs.TabPane;
const { Panel } = Collapse;
class MeetingQuery extends React.PureComponent{
  constructor(props) { super(props);}
  state  = {
    collapseKey : "",
  };
  columns = [
    {
      title : "序号",
      dataIndex : "key",
      key : "",
      render : ( index )=>{
        return (
          <div> { index+1 }</div>
        )
      }
    },
    {
      title : "会议名称",
      dataIndex : "note_name",
      key : "",
      render : ( text )=>{
        return (
          <div>{ text }</div>
        )
      }
    },{
      title : "会议时间",
      dataIndex : "time",
      key : "",
      render : ( text )=>{
        return (
          <div>{ text }</div>
        )
      }
    },{
      title : "会议室",
      dataIndex : "note_room_name",
      key : "",
      render : ( text )=>{
        return (
          <div>{ text }</div>
        )
      }
    }
  ]
  //跳入议题详情页面
  goToDetail = (record)=>{
    /**
     this.props.dispatch({
       type:"topicApply/getTopicDetails",  //走详情的服务
       recordValue:record ,
       flag:'query',
     })
     **/
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname : "/adminApp/meetManage/topicApply/topicDetails",
      query:{
        recordValue:JSON.stringify(record) ,
        flag:'query',
      }
    }))
  }
  //切换tab
  changeTabs =(key)=>{
    const { dispatch } = this.props;
    //  dispatch({type : "meetingQuery/clearQueryMeetings"})
    if( key === "1"){
      dispatch({type : "meetingQuery/changeTabOne",key:key})
      //  dispatch({type : "meetingQuery/queryMeetings"})
    }else if(key === "2")
    {
      dispatch({type : "meetingQuery/changeTabTwo",key:key})
      // dispatch({type:"meetingQuery/queryDoneMeetings"})
      //dispatch({type:"meetingQuery/queryMeetingTypeList"})
    }
  }
  // 展开table
  changeExpandedRows =( expanded,record)=>{
    this.props.dispatch({
      type : 'meetingQuery/queryTopicList',
      record : record ,
    })
  }
  // 切换 折叠面板
  changeCollapse =( key )=>{
    if( key!= undefined){
      this.setState({
        collapseKey : key,
      })
      this.props.dispatch({
        type : "meetingQuery/changeCollapse",
        key : key ,
      })
    }
  }

  // 已上会会议 tab 切换会议类型
  changeDoneMeetingType =( key )=>{
    this.props.dispatch ({
      type : "meetingQuery/changeDoneMeetingType",
      key : key ,
    })
  }
  //已上会会议切换会议状态查询
  changeMeetingState =( key )=>{
    this.props.dispatch ({
      type : "meetingQuery/changeMeetingState",
      key : key ,
    })
  }
  //已上会会议Input框输入
  doneInput = (e)=>{
    this.props.dispatch ({
      type : "meetingQuery/doneInput",
      value : e.target.value,
    })
  }
  // 点击查询  根据填写条件查询已上会会议列表
  queryDoneMeetings =()=>{
    this.props.dispatch ({
      type : "meetingQuery/queryDoneMeetings",
    })
  }
  //清空已上会会议查询条件
  clearQueryMeetings =()=>{
    this.props.dispatch ({
      type : "meetingQuery/clearQueryMeetings",
    })
  }
  changePage =(page)=>{
    this.props.dispatch ({
      type : "meetingQuery/changePage",
      page : page,
    })
  }


  render(){
    const { willMeetingList,doneMeetingList ,meetingList,meetingStateList,doneParam,userType} = this.props;
    const innerColumns = [
      {
        title : "序号",
        dataIndex : "key",
        key : "",
        render : ( index )=>{
          return (
            <div> { index+1 }</div>
          )
        }
      },
      {
        title : "议题名称",
        dataIndex : "topic_name",
        key : "",
        render : ( text )=>{
          return (
            <div>{ text }</div>
          )
        }
      },
      {
        title : "议题状态",
        dataIndex : "topic_check_state_desc",
        key : "",
        render : ( text )=>{
          return (
            <div>{ text }</div>
          )
        }
      },{
        title : "操作",
        dataIndex : "",
        key : "",
        render : ( record )=>{
          return (
            userType ==="0"?
              ""
              :
              <Button type= "primary" onClick = {()=>this.goToDetail(record)}>详情</Button>
          )
        }
      }
    ]
    //已上会会议议题列表
    const doneTopicColumns = [
      {
        title :"序号",
        dataIndex : "key",
        key : "",
        render : ( index )=>{
          return (<div>{index+1}</div>)
        }
      },{
        title :"议题名称",
        dataIndex : "topic_name",
        key : "",
        render : ( text )=>{
          return (<div>{ text }</div>)
        }
      },{
        title :"操作",
        dataIndex : "",
        key : "",
        render : ( record )=>{
          return (
            userType ==="0"?
              ""
              :
              <Button type = "primary" onClick = {()=>this.goToDetail(record)}>详情</Button>
          )
        }
      }
    ]
    const expandedRowRender = ( record )=>{
      return(
        <Table
          pagination={false}
          columns = {innerColumns }
          dataSource = { record.topticlist }
          className = { styles.tableStyle}
        >
        </Table>
      )
    }
    let meetingListOption = meetingList.map((item,index)=>{
      return (
        <Option key = {item.type_id} value = {item.type_id}>{ item.type_name}</Option>
      )
    });
    return(
      <div style={{padding:'13px 15px 16px 15px',background:'white'}}>
        <div style={{textAlign:'center',fontSize:'20px',marginBottom:'10px'}}>会议查询</div>
        <div>
          <Tabs onChange = { this.changeTabs } activeKey = {this.props.currentKey}>
            <TabPane tab = "未上会会议" key = "1">
              <Table
                columns = { this.columns }
                dataSource = { willMeetingList }
                className = { styles.tableStyle }
                bordered = { true }
                key={this.props.tempKey}
                defaultExpandAllRows={false}
                expandedRowRender = { expandedRowRender }
                onExpand = { this.changeExpandedRows }
              >
              </Table>
            </TabPane>
            <TabPane tab = "已上会会议" key = "2">
              <div style = {{ marginBottom:"10px"}}>
                <span>会议类型：</span>
                <Select
                  defaultValue = "全部"
                  value = {doneParam.type_id}
                  onChange = { this.changeDoneMeetingType }
                  style = {{width : "150px"}}
                >
                  { meetingListOption }
                </Select>
                <span style={{marginLeft:"5px"}}>会议状态：</span>
                <Select
                  //  defaultValue = "全部"
                  value = { doneParam.note_state}
                  onChange = { this.changeMeetingState }
                  style = {{width : "100px"}}
                >
                  {
                    meetingStateList.length && meetingStateList.map((item,index)=>{
                      //  item.key = index;
                      return(
                        <Option key = {item.key} value= {item.key}>
                          {item.name}
                        </Option>
                      )
                    })
                  }
                </Select>
                <span style={{marginLeft:"5px"}}>会议名称：</span>
                <Input
                  value = {doneParam.note_name}
                  onChange = { (e)=>this.doneInput(e) }
                  style = {{width : "200px"}}
                  maxLength={"50"}
                >
                </Input>
                <div style = {{textAlign:"right"}}>
                  <Button type = "primary" onClick = { this.queryDoneMeetings} style={{marginRight:"5px"}}> 查询</Button>
                  <Button  type = "primary" onClick = { this.clearQueryMeetings}> 清空</Button>
                </div>
              </div>
              <Collapse
                onChange = { this.changeCollapse }
                key={this.props.tempKey}
                accordion
              >
                {
                  doneMeetingList.length && doneMeetingList.map((item,index)=>{
                    return(
                      <Panel
                        header = {(
                          <div>
                            <span>{ item.note_name }</span>
                            <span style = {{marginLeft:"25px"}}>{ item.note_time.slice(0,10) }</span>
                            <span style = {{marginLeft:"25px"}}>{ item.note_room_name }</span>
                            <span style = {{marginLeft:"25px"}}>{ item.state }</span>
                          </div>
                        )}
                        key = { item.note_id }
                        //key = { item.note_id+item.note_name+ item.note_name}
                      >
                        <Table
                          columns = {doneTopicColumns}
                          dataSource = { item.topicList }
                          className = { styles.tableStyle }
                          //expandedRowRender = { doneExpendRowRender }
                          //onExpand = { this.expandDoneTopicList }
                          pagination = { false }
                        >
                        </Table>
                      </Panel>
                    )
                  })
                }
              </Collapse>
              <Pagination
                current = { this.props.page }
                total = {Number(this.props.RowCounts)}
                onChange = {(page)=>this.changePage(page)}
                pageSize = { this.props.pageSize}
                style = {{textAlign:"center",marginTop:"10px"}}
              >
              </Pagination>
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state){
  return{
    loading : state.loading.models.meetingQuery,
    ...state.meetingQuery
  }
}
export default connect(mapStateToProps)(MeetingQuery);
