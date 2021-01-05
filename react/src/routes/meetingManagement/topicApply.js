/**
 * 作者：贾茹
 * 日期：2019-5-24
 * 邮箱：m18311475903@163.com
 * 功能：议题申请
 */
import React from 'react';
import {connect } from 'dva'
import { Table, Spin, Button, Select,Input,Pagination,Popconfirm } from "antd";
import styles from './meetingTable.less';
import { routerRedux } from 'dva/router';
const { Option } = Select;

class TopicApply extends React.Component{
  constructor(props){
    super(props)
  };

  //会议类型下拉框服务
  handleMeetingTypeChange = (value)=>{
   /* console.log(value);*/
    this.props.dispatch({
      type:"topicApply/handleMeetingTypeChange",
      value:value,
    })
  };

  //走会议状态改变
  handleMeetingStateChange =(value) =>{
    /*console.log(value);*/
    this.props.dispatch({
      type:"topicApply/handleMeetingStateChange",
      value:value,
    })
  }

  //获取议题名称
  handleTopicNameChange=(e)=>{
    /*console.log(e.target.value);*/
    this.props.dispatch({
      type:"topicApply/handleTopicNameChange",
      value:e.target.value,
    })
  };

  //处理button按钮情况
  handleButton=(e,i,record)=>{
   /* console.log(i,record);*/
    if(i==='详情'){
      this.props.dispatch(routerRedux.push({
        pathname:'adminApp/meetManage/topicApply/topicDetails',
      }));
      this.props.dispatch({
        type:"topicApply/getTopicDetails",  //走详情的服务
        recordValue:record
      })
    }else if (i==='撤回'){
      this.props.dispatch({
        type:"topicApply/regretTopic",         //走删除议题的服务
        value:record
      })
    }else if(i==='修改'){

      this.props.dispatch(routerRedux.push({
        pathname:'adminApp/meetManage/topicApply/topicReset',
        query: {
          recordValue:JSON.stringify(record)
        }
      }));

    }else if(i==='删除'){
      this.props.dispatch({
        type:"topicApply/deleteTopic",         //走删除议题的服务
        value:record
      })
    }else if(i==='提交'){
      this.props.dispatch({
        type:'topicApply/listSubmit',          //列表处提交
        value:record
      })
    }else if(i==='终止'){
      this.props.dispatch({
        type:'topicApply/stopTopic',          //走终止议题的服务
        value:record
      })
    }else if(i==='下载申请单'){
      this.props.dispatch({
        type:'topicApply/downPage',          //走终止议题的服务
        value:record
      })
    }else if(i==='归档'){
      this.props.dispatch(routerRedux.push({
        pathname:'adminApp/meetManage/myJudge/addFile',
        query: {
          value:JSON.stringify(record)
        }
      }));
    }
    else{
      this.props.dispatch({
        type:'topicApply/downTopicPage',          //走下载申请单的服务
        value:record
      })
    }
  };

  // 点击页面跳转
  handlePageChange = (pageNumber) => {
   /* console.log(pageNumber)*/
    this.props.dispatch({
      type:"topicApply/handlePageChange",
      page: pageNumber
    })
  };

  //点击查询
  searchTopics = ()=>{
    this.props.dispatch({
      type:"topicApply/pretopicListSearch",
    })
  };

  //点击清空查询条件
  deleteClear = ()=>{
    this.props.dispatch({
      type:"topicApply/deleteClear",
    })
  };

  //点击新增跳转write页面
  goTopicWrite = ()=>{
    this.props.dispatch(routerRedux.push({
      pathname: 'adminApp/meetManage/topicApply/topicWrite',
    }))
  };

  columns = [
    {
      title: "序号",
      dataIndex: "",
      width: "50px",
      fixed: "left",
      render: (text, record, index) => {
        return index + 1;
      }
    }, {
      title: "议题名称",
      dataIndex: "topic_name",
      width: "250px",
      fixed: "left",
      render: (text, record, index) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      }
    }, {
      title: "会议类型",
      dataIndex: "type_name",
      width: "100px",
      render: (text, record, index) => {
        return <div style={{ textAlign: "center" }}>{text}</div>;
      }
    }, {
      title: "申请单位",
      dataIndex: "topic_dept_name",
      width: "450px",
      render: (text, record, index) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      }
    }, {
      title: "汇报人",
      dataIndex: "topic_user_name",
      width: "150px",
      render: (text, record, index) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      }
    }, {
      title: "申请时间",
      dataIndex: "create_date",
      width: "200px",
      render: (text, record, index) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      }
    },{
      title: "状态",
      dataIndex: "state_desc",
      width: "150px",
      render: (text, record, index) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      }
    },{
      title: "操作",
      dataIndex: "button",
      key:"button",
      width: "280px",
      fixed:'right',
      render: (text, record, index) => {
        return <div style={{ textAlign: "left" }}>{text.split(',').map((i)=>
                  i ==='删除'?
                  <Popconfirm
                    title="确定要删除该议题吗?"
                    onConfirm={(e) => this.handleButton(e,i,record)}
                  >
                    <Button
                      type='primary'
                      style={{marginLeft:'10px',marginRight:'10px'}}
                      key={i}
                     /* onClick={()=>this.handleButton(i,record)}*/
                    >
                      {i}
                    </Button>
                  </Popconfirm>
                    :
                    i ==='提交'?
                      <Popconfirm
                        title="确定要提交该议题吗?"
                        onConfirm={(e) => this.handleButton(e,i,record)}
                      >
                        <Button
                          type='primary'
                          style={{marginLeft:'10px',marginRight:'10px'}}
                          key={i}
                          /* onClick={()=>this.handleButton(i,record)}*/
                        >
                          {i}
                        </Button>
                      </Popconfirm>
                      :
                    i!=='删除' && i!=='提交'?
                    <Button
                      type='primary'
                      style={{marginLeft:'10px',marginRight:'10px'}}
                      key={i}
                       onClick={(e)=>this.handleButton(e,i,record)}
                    >
                      {i}
                    </Button>
                      :
                      null

              )}
                </div>;
      }
    },
  ];
  render() {
    return (
      <Spin tip='加载中' spinning={this.props.loading}>
        <div style={{ padding: '8px',background: '#fff'}}>
          <span style={{display:'inline-flex',height: "20px"}}>
            <span className={styles.bgAnnouncement}></span>
            <span  style={{display:'inline-flex',height: "20px",marginLeft:"10px",color:"#ff0000"}}>
              {this.props.proclamationDesc}
            </span>
          </span>
          <div style={{margin:'0 auto',width:'800px',textAlign:'center',fontSize:'20px'}}>
            议题申请
          </div>
          <div style={{marginTop:'10px'}}>
            <span style={{marginLeft:'10px'}}>会议类型：
              <Select style={{minWidth:'165px'}} value={ this.props.meetingTypeId } onChange={this.handleMeetingTypeChange} allowClear={ true }>
                {this.props.meetingTypes.map((i)=><Option key={i.key} value={i.type_id}>{i.type_name}</Option>)}
              </Select>
            </span>
            <span style={{marginLeft:'10px'}}>状态：
              <Select style={{minWidth:'165px'}} value={this.props.meetingStateId} onChange={this.handleMeetingStateChange} allowClear={ true }>
                {this.props.meetingStates.map((i)=><Option key={i.key} value={i.topic_type_id}>{i.topic_type_name}</Option>)}
              </Select>
            </span>
            <span style={{marginLeft:'10px'}}>议题名称：
               <Input value={ this.props.topicName } style={{width:'170px'}} onChange={this.handleTopicNameChange}/>
            </span>
            <Button
              type="primary"
              style={{float:'right',fontSize:'18px'}}
              onClick={this.goTopicWrite}
            >
              新增
            </Button>
            <Button
              type="primary"
              style={{float:'right',marginRight:'10px'}}
              onClick={this.deleteClear}
            >
              清空
            </Button>
            <Button
              type="primary"
              style={{float:'right',marginRight:'10px'}}
              onClick={this.searchTopics}
            >
              查询
            </Button>
          </div>
          <div style = {{ margin: "10px auto" }}>
            <Table
              className = { styles.tableStyle }
              dataSource = { this.props.tableDataSource }
              columns = { this.columns }
              style = {{ marginTop: "20px" }}
              bordered={true}
              scroll={{ x: 1630 }}
              pagination={ false }
            />
            {this.props.loading !== true?
              <div style={{textAlign:'center',marginTop:'20px'}}>
                <Pagination
                  current={Number(this.props.pageCurrent)}
                  total={Number(this.props.pageDataCount)}
                  pageSize={this.props.pageSize}
                  onChange={(page) => this.handlePageChange(page)}
                />
              </div>
              :
              null
            }
          </div>
        </div>
      </Spin>

    );
  }
}

function mapStateToProps (state) {

  return {
    loading: state.loading.models.topicApply,
    ...state.topicApply
  };
}
export default connect(mapStateToProps)(TopicApply);
