/**
 * 作者：窦阳春
 * 日期：2020-10-13 
 * 邮箱：douyc@itnova.com.cn
 * 功能：争优创先首页
 */
import React, { Component } from 'react'
import Cookie from 'js-cookie';
import {connect } from 'dva';
import { Tabs, Table, Row, Col, Spin, Modal, Button,Input } from 'antd';
const { TabPane } = Tabs;
const { TextArea } = Input;
const confirm = Modal.confirm;
import styles from '../../newsOne/style.less'
import { routerRedux } from 'dva/router';

class NewsReportDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      visible: false,//modole显示
    }
  }
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
        type: "newsReportDetail/handle", 
    })
  };
//取消
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };
  //回退原因填写
  returnModel =(value,value2)=>{
    if(value2!==undefined){
        this.props.dispatch({
            type:'newsReportDetail/'+value,
            record : value2,
        })
    }else{
        this.props.dispatch({
            type:'newsReportDetail/'+value,
        })
    }
};
  callback =(key) => {
    key == 2 ?
    this.props.dispatch({
      type: 'newsReportDetail/queryReportExamineItem'
    })
    : null
  }
  saveChange = (flag, value, time) => {
    this.props.dispatch({
      type: 'newsReportDetail/saveValue',
      flag,
      value,
      time
    })
  }
  serch = () => {
    this.props.dispatch({
      type: 'newsReportDetail/serch',
      yearCheck: this.props.yearCheck
    })
  }
  showConfirm = () => {
    let that = this
    confirm({
      title: '确定生成统计报告?',
      content: '',
      onOk() {
        that.props.dispatch({
          type: 'newsReportDetail/tonewsReportDetail'
        })
      }
    });
  }
  toShowReport = () => {
    this.props.dispatch({
      type: 'newsReportDetail/toShowReport'
    })
  }
  columns = [
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
  ];
  goBack = () => {
    this.props.dispatch(routerRedux.push({
      pathname: '/adminApp/newsOne/creatExcellence',
      query: {key: '2'}
    }))
  }
  render() {
    const {detailData, examineItemData} = this.props;
    let isDatahas = JSON.stringify(detailData) == '{}' ? 0 : 1;
    return (
      <Spin tip="加载中..." spinning={this.props.loading}>
        <div className={styles.pageContainer}>
         <h2 style={{textAlign: 'center'}}>工作报告详情</h2>
         {this.props.difference=="审核"?
          <Button style = {{float: 'right',marginLeft:10}} size="default" type="primary" >
							<a href="javascript:history.back(-1)">返回</a>
            </Button> 
            :
          <Button type='primary' style={{float: "right"}} onClick={this.goBack}>返回</Button>
            }
            {this.props.pass=="1"?"":
            <span>
              {this.props.difference=="审核"?
            <Button style = {{float: 'right', marginLeft:10}} onClick={(e)=>this.returnModel('onAgree',)}size="default" type="primary" >
            同意
            </Button>
            :""}
            {this.props.taskName=="审核发布"?"":(this.props.difference=="审核"? 
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
         <div>
         <Tabs defaultActiveKey="1" onChange={this.callback} style={{clear:"both"}}>
          <TabPane tab="报告详情" key="1">
            {isDatahas == 1 ?
            <span>
            <Row style={{marginBottom: 5}}>
              <Col span={6} className={styles.colLeft}>提交人：</Col>
              <Col span={18} className={styles.colRight}>{detailData.createUserName}</Col>
            </Row>
            <Row  style={{marginBottom: 5}}>
              <Col span={6} className={styles.colLeft}>提交时间：</Col>
              <Col span={18}  className={styles.colRight}>{detailData.createTime}</Col>
            </Row>
            <Row  style={{marginBottom: 5}}>
              <Col span={6} className={styles.colLeft}>单位名称：</Col>
              <Col span={18}  className={styles.colRight}>{detailData.createUserDeptName}</Col>
            </Row>
            <Row  style={{marginBottom: 5}}>
              <Col span={6} className={styles.colLeft}>报告名称：</Col>
              <Col span={18}  className={styles.colRight}>{detailData.reportName}</Col>
            </Row>
            <Row  style={{marginBottom: 5}}>
              <Col span={6} className={styles.colLeft}>年度工作总结：</Col>
              <Col span={18}  className={styles.colRight}>{detailData.workSummary}</Col>
            </Row>
            <Row  style={{marginBottom: 5}}>
              <Col span={6} className={styles.colLeft}>目前存在的问题及整改的措施：</Col>
              <Col span={18}  className={styles.colRight}>{detailData.questions}</Col>
            </Row>
            <Row  style={{marginBottom: 5}}>
              <Col span={6} className={styles.colLeft}>下一步工作计划：</Col>
              <Col span={18} className={styles.colRight}>{detailData.workPlan}</Col>
            </Row>
            </span> : ''
            }
          </TabPane>
          <TabPane tab="审批环节" key="2">
            <Table className={styles.orderTable}
             columns = {this.columns}
             dataSource = {examineItemData}
             pagination = {false}
             />
          </TabPane>
        </Tabs>
         </div>
        </div>
     </Spin>
    )
  }
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.newsReportDetail, 
    ...state.newsReportDetail
  };
}

export default connect(mapStateToProps)(NewsReportDetail);
