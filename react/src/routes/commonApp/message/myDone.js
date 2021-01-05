/**
 * 作者：贾茹
 * 日期：2019-6-24
 * 邮箱：m18311475903@163.com
 * 功能：办结议题详情
 */
import React from 'react';
import {connect } from 'dva'
import { Tabs, Button, Table, Modal } from 'antd';
import styles from '../../meetingManagement/meetingTable.less';
import { routerRedux } from 'dva/router';


const { TabPane } = Tabs;


class MyDone extends React.Component{
  constructor(props){
    super(props);

  };

  //点击审批环节触发
  callback=(key)=> {
    /* console.log(key);*/
    /* console.log('审批环节');
     this.props.dispatch({
       type:'topicApply/judgeMoment',
     })*/
  };

  //点击下载附件
  downloadUpload = (e,record) =>{
    let url =record.upload_url;
    window.open(url);
  };

  //鼠标的生活
  columns = [
    {
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
  judgecolumns=[
    {
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
    },
  ];

  //点击返回返回待办页面
  return = ()=>{
    this.props. dispatch(routerRedux.push({
      pathname:'/taskList'
    }));
  };

  render() {
    /*   console.log(this.props.tableLineDetail);*/
    /* console.log(this.props.judgeTableSource);*/
    /* console.log(this.props.myComplete);
      console.log(this.props.myComplete.topic_name);*/
    /*console.log(this.props.myComplete.topic_last_check_state_desc) ;*/
    return (
      <div style={{background: '#fff',padding:'10px',borderRadius: '6px', boxShadow: '0 1px 6px rgba(0, 0, 0, .2)'}}>
        <div style={{margin:'0 auto',width:'800px',textAlign:'center',fontSize:'22px',color:'#999',}}>
          {this.props.myComplete.topic_name}
        </div>
        <div style={{margin:'15px auto',width:'800px',textAlign:'center',fontSize:'14px'}}>
          <span style={{marginRight:'20px'}}>
            上一环节：
            {
              this.props.myComplete.topic_last_state==='0'?
                <span>申请人提交</span>
                :
                this.props.myComplete.topic_last_state==='-1'?
                  <span>申请人提交</span>
                  :
                  this.props.myComplete.topic_last_state!=='0'&& this.props.myComplete.topic_last_state!== '-1'?
                    <span>{this.props.myComplete.topic_last_state_desc}</span>
                    :
                    null
            }
          </span>
          <span>
            当前环节：
            {this.props.myComplete.topic_check_link}
          </span>
        </div>
        <div>
          <Button type="primary" style={{float:'right',marginRight:'50px'}} onClick={this.return}>返回</Button>
          <div style={{clear:'both'}}></div>
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
                  <span>{this.props.myComplete.topic_user_name}</span>
                </div>
                <div style={{marginTop:'15px'}}>
                  <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                    <b style={{color:"red",marginRight:'5px'}}>*</b>
                    申请单位
                  </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <span >{this.props.myComplete.topic_dept_name}</span>

                </div>
                <div style={{marginTop:'15px'}}>
                  <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                    <b style={{color:"red",marginRight:'5px'}}>*</b>
                    会议类型
                  </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <span >{this.props.myComplete.note_type_name}</span>
                </div>
                <div style={{marginTop:'15px'}}>
                   <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                      <b style={{color:"red",marginRight:'5px'}}>*</b>
                      预计汇报时间
                   </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <span>{this.props.myComplete.topic_reporting_time}分钟</span>
                </div>
                <div style={{marginTop:'15px'}}>
                 <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                    <b style={{color:"red",marginRight:'5px'}}>*</b>
                    是否属于三重一大
                 </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <span>
                  {
                    this.props.myComplete.topic_if_important==='1'?
                      <span>是</span>
                      :
                      this.props.myComplete.topic_if_important==='0'?
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
                  <span>{this.props.myComplete.topic_important_reason}</span>
                </div>
                <div style={{marginTop:'15px'}}>
                 <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                    <b style={{color:"red",marginRight:'5px'}}>*</b>
                    是否属前置讨论事项
                </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <span>
                  {
                    this.props.myComplete.topic_if_study==='1'?
                      <span>是</span>
                      :
                      this.props.myComplete.topic_if_study==='0'?
                        <span>否</span>
                        :
                        null
                  }
                </span>
                </div>
                <div style={{marginTop:'15px',display: this.props.discussDisplay }} >
                   <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                      <b style={{color:"red",marginRight:'5px'}}>*</b>
                      前置讨论原因
                  </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <span>{this.props.myComplete.topic_study_id}</span>
                </div>
                <div style={{marginTop:'15px'}}>
                <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                    <b style={{color:"red",marginRight:'5px'}}>*</b>
                    列席部门
                </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <span>{this.props.myComplete.topic_other_dept_name}</span>
                </div>
                <div style={{marginTop:'15px',display: this.props.waitDecide, }}>
                  <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>

                      待决议事项
                  </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <span>{this.props.myComplete.topic_content}</span>

                </div>
                <div style={{marginTop:'15px'}}>
                   <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                      <b style={{color:"red",marginRight:'5px'}}>*</b>
                      是否已征求各部门意见
                  </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <span>
                   {
                     this.props.myComplete.topic_if_opinions==='1'?
                       <span>是</span>
                       :
                       this.props.myComplete.topic_if_opinions==='0'?
                         <span>否</span>
                         :
                         null
                   }
                </span>
                </div>
                <div style={{marginTop:'15px'}}>
                     <span style={{display:'inline-block', width:'160px',textAlign: 'right'}}>
                        <b style={{color:"red",marginRight:'5px'}}>*</b>
                        上会材料是否涉密
                    </span>
                  <span style={{display:'inline-block', width:'10px',textAlign: 'left'}}>:</span>
                  <span>
                    {
                      this.props.myComplete.topic_if_secret==='1'?
                        <span>是</span>
                        :
                        this.props.myComplete.topic_if_secret==='0'?
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
                  <span>{this.props.myComplete.topic_secret_reason}</span>
                </div>
                <div style={{marginTop:'15px',display: this.props.tableMaterialDetailDisplay }}>
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

function mapStateToProps (state) {

  return {
    loading: state.loading.models.myDone,
    ...state.myDone
  };
}
export default connect(mapStateToProps)(MyDone);
