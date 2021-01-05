/**
 * 作者：贾茹
 * 日期：2020-3-5
 * 邮箱：m18311475903@163.com
 * 功能：办公室管理员审核页面
 */
import React from 'react';
import {
  connect
} from 'dva'
import {
  Tabs,
  Button,
  Table,
  Modal,
  Radio,
  Input,
} from 'antd';
import styles from '../../meetingManagement/meetingTable.less';
import {
  routerRedux
} from 'dva/router';
import DeptRadioGroup from './otherDept.js';



const {
  TabPane
} = Tabs;
const RadioGroup = Radio.Group;
const {
  TextArea
} = Input;

class OfficeJudge extends React.Component {
  constructor(props) {
    super(props);

  };

  //点击审批环节触发
  callback = (key) => {
    /* console.log(key);*/
    /* console.log('审批环节');
     this.props.dispatch({
       type:'topicApply/judgeMoment',
     })*/
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
    width: '40%',
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

  //点击下载附件
  downloadUpload = (e, record) => {
    let url = record.upload_url;
    window.open(url);
  };

  //点击同意
  handleAgreen = () => {
    this.props.dispatch(routerRedux.push({
      pathname: '/taskList',
    }));
    this.props.dispatch({
      type: 'officeJudge/handleAgreen'
    })

  };

  //点击退回跳出填写退回原因对话框
  handleReturn = () => {
    this.props.dispatch({
      type: 'officeJudge/handleReturn'
    })
  };

  //文本域内容改变时同步显示
  returnReason = (e) => {
    /*   console.log(e.target.value);*/
    this.props.dispatch({
      type: 'officeJudge/returnReason',
      value: e.target.value
    })
  };

  //modal点击取消时
  handleModalCancel = () => {
    this.props.dispatch({
      type: 'officeJudge/handleModalCancel'
    })
  };

  //modal点击确定时
  handleModalOk = () => {
    this.props.dispatch(routerRedux.push({
      pathname: '/taskList',
    }));
    this.props.dispatch({
      type: 'officeJudge/handleModalOk'
    })
  };

  //跳转到modal层对应的方法
  returnModel = (value, value2) => {
    console.log(value, value2);
    if (value2 !== undefined) {
      this.props.dispatch({
        type: 'officeJudge/' + value,
        record: value2,
      })
    } else {
      console.log('aaa');
      this.props.dispatch({
        type: 'officeJudge/' + value,
      })
    }

  };

  render() {
    /*   console.log(this.props.tableLineDetail);*/
    /* console.log(this.props.judgeTableSource);*/
    /* console.log(this.props.officeJudge)*/
    return (
      <div style={{background: '#fff',padding:'10px',borderRadius: '6px', height:'100%',boxShadow: '0 1px 6px rgba(0, 0, 0, .2)'}}>
        <div style={{margin:'0 auto',width:'800px',textAlign:'center',fontSize:'22px',color:'#999',}}>
          {this.props.waitMeetingDetails.topic_name}
        </div>
        <div style={{margin:'0 auto',width:'800px',textAlign:'center',fontSize:'14px',marginTop:'10px'}}>
          <span style={{marginRight:'20px'}}>
            上一环节：
            {
              this.props.waitMeetingDetails.topic_last_state==='0'?
                <span>申请人提交</span>
                :
                this.props.waitMeetingDetails.topic_last_state==='-1'?
                  <span>申请人提交</span>
                  :
                  this.props.waitMeetingDetails.topic_last_state!=='0'&& this.props.waitMeetingDetails.topic_last_state!== '-1'?
                    <span>{this.props.waitMeetingDetails.topic_last_state_desc}</span>
                    :
                    null
            }
          </span>
          <span>当前环节：{this.props.waitMeetingDetails.topic_check_link}</span>
        </div>
        <div className="clearfix" style={{height:'30px'}}>
          <Button type="primary" style={{float:'right',marginLeft:'15px',marginRight:'50px'}} onClick={this.handleReturn}>退回</Button>
          <Modal
            title="* 请填写退回原因"
            visible={this.props.visible}
            onOk={this.handleModalOk}
            onCancel={this.handleModalCancel}
          >
            <textarea placeholder="请输入退回原因" style={{width:'490px',height:'130px'}} value={this.props.retuenReason} onChange={this.returnReason}></textarea>
          </Modal>
          <Button type="primary" style={{float:'right'}} onClick={this.handleAgreen}>同意</Button>
        </div>
        <div style={{marginTop:'40px',margin:'0 auto'}}>
          <Tabs defaultActiveKey="1" onChange={this.callback}>
            <TabPane tab="议题详情" key="1">
              <div style={{margin:'0 auto',width:'750px'}}>
                <div>
                  <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                    <b style={{color:"red",marginRight:'5px'}}>*</b>
                    汇报人
                  </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <span>{this.props.waitMeetingDetails.topic_user_name}</span>
                </div>
                <div style={{marginTop:'15px'}}>
                  <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                    <b style={{color:"red",marginRight:'5px'}}>*</b>
                    申请单位
                  </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  {
                    this.props.waitMeetingDetails.topic_level==="1"?
                      <span >分院级</span>
                      :
                      this.props.waitMeetingDetails.topic_level==="0"?
                        <span >院级</span>
                        :
                        null

                  }


                </div>
                <div style={{marginTop:'15px'}}>
                  <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                    <b style={{color:"red",marginRight:'5px'}}>*</b>
                    汇报单位
                  </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <span >{this.props.waitMeetingDetails.topic_dept_name}</span>
                </div>
                <div style={{marginTop:'15px'}}>
                  <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                    <b style={{color:"red",marginRight:'5px'}}>*</b>
                    会议类型
                  </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <span >{this.props.waitMeetingDetails.note_type_name}</span>
                </div>
                <div style={{marginTop:'15px'}}>
                   <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                      <b style={{color:"red",marginRight:'5px'}}>*</b>
                      预计汇报时间
                   </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <span>{this.props.waitMeetingDetails.topic_reporting_time}分钟</span>
                </div>
                <div style={{marginTop:'15px'}}>
                 <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                    <b style={{color:"red",marginRight:'5px'}}>*</b>
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
                <div style={{marginTop:'15px',display: this.props.resonDisplay }} >
                 <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                    <b style={{color:"red",marginRight:'5px'}}>*</b>
                    三重一大的原因
                 </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <span>{this.props.waitMeetingDetails.topic_important_reason}</span>
                </div>
                {
                  this.props.waitMeetingDetails.type_name ==='总经理办公会'?
                    <div style={{marginTop:'15px'}}>
                  <span style={{width:'160px',textAlign: 'right'}}>
                    <b style={{color:"red",marginRight:'5px'}}>*</b>
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

                <div style={{marginTop:'15px',display:this.props.study}} >
                  <span style={{width:'160px',textAlign: 'right',display: this.props.reletiveDiscussDisplay}}>
                    <b style={{color:"red",marginRight:'5px'}}>*</b>
                    前置讨论相关议题
                </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <span>{this.props.waitMeetingDetails.topic_study_id}</span>
                </div>
                <div style={{marginTop:'15px'}}>
                <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                    <b style={{color:"red",marginRight:'5px'}}>*</b>
                    列席部门
                </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <span>{this.props.waitMeetingDetails.topic_other_dept_name}</span>
                </div>
                <div style={{marginTop:'15px',display:this.props.topicContent}}>
                <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                    <b style={{color:"red",marginRight:'5px'}}>*</b>
                    待决议事项
                </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <span>{this.props.waitMeetingDetails.topic_content}</span>
                </div>
                <div style={{marginTop:'15px'}}>
                     <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                        <b style={{color:"red",marginRight:'5px'}}>*</b>
                        紧急程度
                    </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <span>
                    {
                      this.props.waitMeetingDetails.topic_urgent==='1'?
                        <span>紧急</span>
                        :
                        this.props.waitMeetingDetails.topic_urgent==='0'?
                          <span>一般</span>
                          :
                          null
                    }
                   </span>
                </div>
                {
                  this.props.waitMeetingDetails.topic_urgent==='1'?
                    <div style={{marginTop:'15px'}}>
                       <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                          <b style={{color:"red",marginRight:'5px'}}>*</b>
                          紧急原因及拟上会时间
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
                        上会材料是否涉密
                    </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <span>
                    {
                      this.props.waitMeetingDetails.topic_if_secret==='1'?
                        <span>是</span>
                        :
                        this.props.waitMeetingDetails.topic_if_secret==='0'?
                          <span>否</span>
                          :
                          null
                    }
                   </span>
                </div>
                <div style={{marginTop:'15px',display: this.props.materialDetailDisplay }} >
                 <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                    <b style={{color:"red",marginRight:'5px'}}>*</b>
                    上会材料泄密说明
                </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <span>{this.props.waitMeetingDetails.topic_secret_reason}</span>
                </div>
                {
                  this.props.tableUploadFile.length !== 0?
                   <div style={{marginTop:'15px' }}>
                 <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                      <b style={{color:"red",marginRight:'5px'}}>*</b>
                      上会材料
                 </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
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
                :
                null
                }
               
                <div style={{marginTop:'15px'}}>
             <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                <b style={{color:"red",marginRight:'5px'}}>*</b>
                是否需要相关部门会签
             </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'20px'}}>:</span>
                  <RadioGroup onChange={(e)=>this.returnModel('isDept',e)} value={this.props.isDept}>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </RadioGroup>
                </div>
                {
                  Number(this.props.isDept) === 1 ?
                    <div style={{marginTop:'10px'}}>
              <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                <b style={{color:"red",marginRight:'5px'}}>*</b>
                会签部门
              </span>
                      <span style={{display:'inline-block', width:'10px',textAlign: 'left',marginRight:'10px'}}>:</span>
                      <TextArea style={{width:'500px',marginLeft:'10px'}} value={this.props.Dept.join('    ')} autosize onClick={()=>this.returnModel('handleDeptModal')}/>
                      {/*<Icon type="close-circle" style={{marginLeft:'10px',color:'#ccc'}} onClick={this.iconClear}/>*/}
                      <Modal
                        title="选择部门"
                        visible={ this.props.deptVisible }
                        onCancel = { this.handleDeptCancel}
                        width={'1000px'}
                        onOk={()=>this.returnModel('handleDeptOk')}
                      >
                        <div>
                          <DeptRadioGroup/>
                        </div>
                      </Modal>

                    </div>
                    :
                    null
                }

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
    loading: state.loading.models.officeJudge,
    ...state.officeJudge
  };
}
export default connect(mapStateToProps)(OfficeJudge);