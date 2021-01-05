/**
 * 作者：贾茹
 * 日期：2020-3-28
 * 邮箱：m18311475903@163.com
 * 功能：申请人补充材料
 */
import React from 'react';
import {connect} from 'dva'
import {
  Tabs,
  Button,
  Table,
  Radio,
  Popconfirm,
  Input
} from 'antd';
import styles from '../../meetingManagement/meetingTable.less';
import FileUpload from './addFileUpload.js';
import {
  routerRedux
} from "dva/router"; //上传功能组件

const {
  TabPane
} = Tabs;
const RadioGroup = Radio.Group;

class AddFile extends React.Component {
  state = {
    isUploadingFile: false, // 是否正在上传文件
  };

  //点击审批环节触发
  callback = (key) => {
    /* console.log(key);*/
    /* console.log('审批环节');
     this.props.dispatch({
       type:'topicApply/judgeMoment',
     })*/
  };

  //点击删除附件
  deleteUpload = (e, record) => {
    /*console.log(record);*/
    this.props.dispatch({
      type: 'addFile/deleteUpload',
      record: record
    })
  };

  //详情页面附件的table
  columns = [{
    title: '序号',
    dataIndex: '',
    width: '8%',
    render: (text, record, index) => {
      return (<span>{index+1}</span>);
    },
  }, {
    title: '文件名称',
    dataIndex: 'upload_name',
    width: '40%',
    render: (text) => {
      return <div style={{ textAlign: 'left' }}>{text}</div>;
    },
  }, {
    title: '文件类型',
    dataIndex: 'upload_desc',
    width: '30%',
    render: (text) => {
      return <div style={{ textAlign: 'left' }}>{text}</div>;
    },
  }, {
    title: '操作',
    dataIndex: '',
    width: '22%',
    render: (text, record) => {
      return (
        <div style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              size="small"
              onClick={(e) => this.downloadUpload(e,record)}
            >下载
            </Button>
            &nbsp;&nbsp;
            <Popconfirm
              title="确定删除该文件吗?"
              onConfirm={(e) => this.deleteUpload(e,record)}
            >
              <Button
                type="primary"
                size="small"
              >
                删除
              </Button>
            </Popconfirm>
          </div>
      );
    },
  }, ];

  //审批的table   columns
  judgecolumns = [{
    title: '序号',
    dataIndex: '',
    width: '8%',
    render: (text, record, index) => {
      return (<span>{index+1}</span>);
    },
  }, {
    title: '状态',
    dataIndex: 'state_desc',
    width: '8%',
    render: (text) => {
      return <div style={{ textAlign: 'left' }}>{text}</div>;
    },
  }, {
    title: '环节名称',
    dataIndex: 'Approval_link',
    width: '18%',
    render: (text, record, index) => {
      return <div style={{ textAlign: 'left' }}>{text}</div>;
    },
  }, {
    title: '审批人',
    dataIndex: 'list_receive_name',
    width: '10%',
    render: (text) => {
      return <div style={{ textAlign: 'left' }}>{text}</div>;
    },
  }, {
    title: '审批类型',
    dataIndex: 'topic_check_state_desc',
    width: '10%',
    render: (text) => {
      return <div style={{ textAlign: 'left' }}>{text}</div>;
    },
  }, {
    title: '审批意见',
    dataIndex: 'approval_opinions',
    width: '10%',
    render: (text) => {
      return <div style={{ textAlign: 'left' }}>{text}</div>;
    },
  }, {
    title: '审批时间',
    dataIndex: 'update_date',
    width: '12%',
    render: (text) => {
      return <div style={{ textAlign: 'left' }}>{text}</div>;
    },
  }, ];

  //上传需要
  saveData = (values) => {
    this.setState({
      showData: values,
      importDataLength: values.length,
    })

  };

  //点击下载附件
  downloadUpload = (e, record) => {
    let url = record.upload_url;
    window.open(url);
  };

  //点击无更改服务
  noReset = () => {
    this.props.dispatch({
      type: 'addFile/noReset',
    })
  };

  //是否涉密
  isSecret = (e) => {
    /*  console.log(e.target.value)*/
    this.props.dispatch({
      type: 'addFile/isSecret',
      value: e.target.value
    })
  }

  //点击提交
  submissionTopic = () => {
    this.props.dispatch({
      type: 'addFile/submissionTopic'
    })
  };

  //点击取消
  cancelTopic = () => {
    this.props.dispatch(routerRedux.push({
      pathname: 'taskList',

    }));
  };

  //上会材料泄密原因说明
  handleMeetingChange = (e) => {

    this.props.dispatch({
      type: "addFile/handleMeetingChange",
      value: e.target.value
    })
  };

  //点击返回返回待办页面
  return = () => {
    this.props.dispatch(routerRedux.push({
      pathname: '/taskList'
    }));
  };

  render() {
    /*   console.log(this.props.tableLineDetail);*/
    /* console.log(this.props.judgeTableSource);*/
    /* console.log(this.props.waitMeetingDetails)*/
    return (
      <div style={{background: '#fff',padding:'10px',borderRadius: '6px', boxShadow: '0 1px 6px rgba(0, 0, 0, .2)'}}>
        <div style={{margin:'20px auto',width:'800px',textAlign:'center',fontSize:'20px',color:'#777'}}>
          {this.props.waitMeetingDetails.topic_name}
        </div>
        <div style={{margin:'10px auto',width:'800px',textAlign:'center',fontSize:'16px',color:'#777'}}>
          <span style={{marginRight:'20px'}}>上一环节：{this.props.waitMeetingDetails.topic_last_state_desc}</span>
          <span>当前环节：{this.props.waitMeetingDetails.topic_check_link}</span>
        </div>
        <div>
          <Button type="primary" style={{float:'right',marginRight:'50px'}} onClick={this.return}>返回</Button>
          <div style={{clear:'both'}}></div>
        </div>
        <div style={{marginTop:'40px',margin:'0 auto'}}>
          <Tabs defaultActiveKey="1" onChange={this.callback}>
            <TabPane tab="议题详情" key="1">
              <div style={{margin:'0 auto',width:'800px'}}>
                <div style={{marginTop:'15px'}}>
                 <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                    申请单位
                 </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <span>
                    {
                      this.props.waitMeetingDetails.topic_level==='1'?
                        <span>分院级</span>
                        :
                        this.props.waitMeetingDetails.topic_level==='0'?
                        <span>院级</span>
                      :
                      null
                    }

                </span>
                </div>
                <div style={{marginTop:'15px'}}>
                  <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                    汇报人
                  </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <span>{this.props.waitMeetingDetails.topic_user_name}</span>
                </div>
                <div style={{marginTop:'15px'}}>
                  <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                    汇报单位
                  </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <span >{this.props.waitMeetingDetails.topic_dept_name}</span>

                </div>
                <div style={{marginTop:'15px'}}>
                  <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                    会议类型
                  </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <span >{this.props.waitMeetingDetails.note_type_name}</span>
                </div>
                <div style={{marginTop:'15px'}}>
                   <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                      预计汇报时间
                   </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <span>{this.props.waitMeetingDetails.topic_reporting_time}分钟</span>
                </div>
                <div style={{marginTop:'15px'}}>
                 <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                    是否属于三重一大
                 </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <span>
                    {
                      this.props.waitMeetingDetails.topic_if_important==='1'?
                        <span>是</span>
                        :
                        this.props.waitMeetingDetails.topic_if_important==='0'?
                          <span>否</span>
                          :
                          null
                    }
                </span>
                </div>
                {
                  this.props.waitMeetingDetails.topic_if_important==='1'?
                    <div style={{marginTop:'15px'}} >
                     <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                        三重一大的原因
                     </span>
                      <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                      <span>{this.props.waitMeetingDetails.topic_important_reason}</span>
                    </div>

                    :
                    null
                }

                {
                  this.props.waitMeetingDetails.topic_type === '总经理办公会'?
                    <div style={{marginTop:'15px'}}>
                       <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                          是否需党委会前置讨论
                      </span>
                      <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                      <span>
                        {
                          this.props.waitMeetingDetails.topic_if_study==='1'?
                            <span>是</span>
                            :
                            this.props.waitMeetingDetails.topic_if_study==='0'?
                              <span>否</span>
                              :
                              null
                        }
                </span>
                    </div>
                    :
                    null
                }
                {
                  this.props.waitMeetingDetails.topic_if_study === '1'?
                    <div style={{marginTop:'15px',display: this.props.discussDisplay }} >
                      <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                        前置讨论议题
                      </span>
                      <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                      <span>{this.props.waitMeetingDetails.topic_study_id}</span>
                    </div>
                    :
                    null
                }
                <div style={{marginTop:'15px'}}>
                <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                    列席部门
                </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <span>{this.props.waitMeetingDetails.topic_other_dept_name}</span>
                </div>
                {
                  this.props.waitMeetingDetails.topic_content !==""?
                    <div style={{marginTop:'15px'}}>
                   <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                      待决议事项
                  </span>
                      <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                      <span>{this.props.waitMeetingDetails.topic_content}</span>
                    </div>
                    :
                    null
                }

                <div style={{marginTop:'15px'}}>
                 <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                    紧急程度
                 </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <span>
                    {
                      this.props.waitMeetingDetails.topic_urgent==='1'?
                        <span>是</span>
                        :
                        this.props.waitMeetingDetails.topic_urgent==='0'?
                          <span>否</span>
                          :
                          null
                    }
                  </span>
                </div>
                {
                  this.props.waitMeetingDetails.topic_urgent === '1'?
                    <div style={{marginTop:'15px'}}>
                       <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                           紧急原因和上会时间
                       </span>
                      <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                      <span>{this.props.waitMeetingDetails.urgent_reason}</span>
                    </div>
                    :
                    null
                }
               
                  <div style={{marginTop:'15px'}}>
                 <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                      <b style={{color:"red",marginRight:'5px'}}>*</b>
                      归档材料
                 </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <FileUpload dispatch={this.props.dispatch} passFuc = {this.saveData}/>
                  <Table
                    columns={ this.columns }
                    loading={ this.props.loading }
                    dataSource={ this.props.tableUploadFile }
                    className={ styles.tableStyle }
                    pagination = { false }
                    style={{marginTop:'10px'}}
                    bordered={ true }
                  />
                </div>
                
              </div>
              <div style={{width:'250px',margin:'20px auto'}}>
                <div style={{margin:'0 auto'}}>
                  <Button type="primary" style={{float:'left'}} onClick={this.noReset} disabled={this.props.noUpdate}>无更改</Button>
                  <Button type="primary" style={{marginLeft:'30px'}} onClick={this.submissionTopic}>提交</Button>
                  <Button type="primary" style={{float:'right'}} onClick={this.cancelTopic}>取消</Button>
                </div>
              </div>
            </TabPane>
            <TabPane tab="审批环节" key="2">
              <Table
                className = { styles.tableStyle }
                dataSource = { this.props.judgeTableSource }
                columns = { this.judgecolumns }
                style = {{ marginTop: "20px" }}
                bordered={true}
                /*pagination={ false }*/
              />
            </TabPane>
          </Tabs>
        </div>

      </div>


    );
  }
}

function mapStateToProps(state) {

  return {
    loading: state.loading.models.addFile,
    ...state.addFile
  };
}
export default connect(mapStateToProps)(AddFile);