/**
 * 作者：贾茹
 * 日期：2020-10-20
 * 邮箱：18311475903@163.com
 * 文件说明：新闻共享平台-宣传渠道备案模块详情页面
 */
import React from 'react';
import {connect } from 'dva';
import { Input, Modal, Button,Tabs, Table } from "antd";
import styles from '../index.less';
import DeptRadioGroup from './deptModal.js';
const { TabPane } = Tabs;
const { TextArea } = Input;
const myDate = new Date();
const date = myDate.toLocaleString( ).substr(0,10);

class PublicityChannelsDetails extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    visible: false,//modole显示
  };
  callback=(e)=> {
    if(e==1){
      this.props. dispatch({
        type:"publicityChannelsDetails/taskInfoSearch",
      })
    }else if(e==2){
      this.props. dispatch({
        type:"publicityChannelsDetails/judgeHistory",
      })
    }
  };
   //退回
   showModal = () => {
    this.setState({
      visible: true,
    });
  };
  //确定
  handleOk = () => {
    this.setState({
      visible: false,
    });
    this.props.dispatch({
        type: "publicityChannelsDetails/handle",
    })
  };
//取消
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };
  //回退原因填写
  //跳转到modal层对应的方法
  returnModel =(value,value2)=>{
    if(value2!==undefined){
      this.props.dispatch({
        type:'publicityChannelsDetails/'+value,
        record : value2,
      })
    }else{
      this.props.dispatch({
        type:'publicityChannelsDetails/'+value,
      })
    }

  };
  //审批的table   columns
  judgecolumns=[
    {
      title: "序号",
      key:(text,record,index)=>`${index+1}`,
      render:(text,record,index)=>`${index+1}`,
  },
  {
      title: "状态",
      dataIndex: "failUnm",
      key: "failUnm",

  },
  {
      title: "环节名称",
      dataIndex: "taskName",
      key: "taskName",

  },
  {
      title: "审批人",
      dataIndex: "userName",
      key: "userName",

  },
  {
      title: "审批意见",
      dataIndex: "commentDetail",
      key: "commentDetail",

  },
  {
      title: "审批时间",
      dataIndex: "commentTime",
      key: "commentTime",

  },
  {
      title: "审批时长",
      dataIndex: "reqTimes",
      key: "reqTimes",

  },
  ];

/*  return=()=>{

    window.history.go(-1);
  }*/
  //附件表格数据
  columns = [
    {
      title: '序号',
      dataIndex: '',
      width: '8%',
      key:'index',
      render: (text, record, index) => {
        return (<span>{index+1}</span>);
      },
    }, {
      title: '文件名称',
      dataIndex: 'upload_name',
      key:'key',
      width: '60%',
      render: (text) => {
        return <div style={{ textAlign: 'left' }}>{text}</div>;
      },
    },{
      title: '操作',
      dataIndex: '',
      key:'opration',
      width: '24%',
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


  render(){
    return (
      <div style={{background: '#fff',padding:'10px',borderRadius: '6px',paddingBottom:'30px'}}>
        <div className={styles.title}>
          宣传渠道备案详情页面
        </div>
        <div>
        {this.props.type=="审核"?
        	<Button style = {{float: 'right', marginLeft:10}} size="default" type="primary" >
          <a href="javascript:history.back(-1)">返回</a>
        </Button>
        :
        <Button type="primary" style={{float:'right',marginRight:'50px'}} onClick={()=>this.returnModel('return')}>返回</Button>
        }
        {this.props.pass=="1"?"":
        <span>
           {this.props.type=="审核"?
              <Button style = {{float: 'right', marginLeft:10}} onClick={(e)=>this.returnModel('onAgree',)}size="default" type="primary" >
              同意
            </Button>
            :""}
            {this.props.taskName=="院级新闻宣传管理员备案"||this.props.taskName=="院级新闻宣传审核管理员备案"?"":(this.props.type=="审核"?
              <Button style = {{float: 'right'}} onClick={()=>this.showModal()}  size="default" type="primary" >
              退回
            </Button>
            :"")}
        </span>}
            <Modal
                title="退回原因"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                >
                  <TextArea value={this.props.tuihuiValue} rows={4}
                  onChange={(e)=>this.returnModel('tuihui',e.target.value)}/>
            </Modal>
          <div style={{clear:'both'}}></div>
        </div>
        <div style={{marginTop:'40px',margin:'0 auto'}}>
          <Tabs defaultActiveKey="1" onChange={(e)=>this.callback(e)} style={{clear:"both"}}>
            <TabPane tab="申请详情" key="1">
                <div className={styles.out}>
                  <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                      备案时间
                    </span>
                    <span className={styles.lineColon}>:</span>
                    <span>{this.props.dataInfo.channelTime}</span>
                  </div>
                  <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                      宣传渠道类型
                    </span>
                    <span className={styles.lineColon}>:</span>
                    <span>{this.props.dataInfo.pubChannelType}</span>
                  </div>
                  <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                    宣传渠道名称
                    </span>
                    <span className={styles.lineColon}>:</span>
                    <span>{this.props.dataInfo.pubChannelName}</span>
                  </div>
                  <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                    主办部门
                    </span>
                    <span className={styles.lineColon}>:</span>
                    <span>{this.props.dataInfo.hostDept}</span>
                  </div>
                  <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                    申请名义
                    </span>
                    <span className={styles.lineColon}>:</span>
                    <span>{this.props.dataInfo.applyReason}</span>
                  </div>
                  <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                    功能定位
                    </span>
                    <span className={styles.lineColon}>:</span>
                    <span>{this.props.dataInfo.functionDefinition}</span>
                  </div>
                  <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                    日常运营人信息
                    </span>
                    <span className={styles.lineColon}>:</span>
                    <span style = {{ marginRight: "20px" }}>{this.props.dataInfo.dailyOperatorName}</span>
                    <span style = {{ marginRight: "20px" }}>{this.props.dataInfo.dailyOperatorDept}</span>
                    <span style = {{ marginRight: "20px" }}>电话：{this.props.dataInfo.dailyOperatorTel}</span>
                    <span>邮箱：{this.props.dataInfo.dailyOperatorEmail}</span>
                  </div>
                  <div className={styles.lineOut}>
                    <span className={styles.lineKey}>
                    单位负责人信息
                    </span>
                    <span className={styles.lineColon}>:</span>
                    <span style = {{ marginRight: "20px" }}>{this.props.dataInfo.companyName}</span>
                    <span style = {{ marginRight: "20px" }}>{this.props.dataInfo.companyDept}</span>
                    <span style = {{ marginRight: "20px" }}>电话：{this.props.dataInfo.companyTel}</span>
                    <span>邮箱：{this.props.dataInfo.companyEmail}</span>
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
    )
  }
}
function mapStateToProps (state) {

  return {
    loading: state.loading.models.publicityChannelsDetails,
    ...state.publicityChannelsDetails
  };
}
export default connect(mapStateToProps)(PublicityChannelsDetails);
