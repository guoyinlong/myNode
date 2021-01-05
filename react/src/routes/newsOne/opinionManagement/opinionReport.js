/**
 * 作者：窦阳春
 * 日期：2020-10-26
 * 邮箱：douyc@itnova.com.cn
 * 文件说明：新闻共享平台-舆情管理详情
 */
import React from 'react';
import {connect } from 'dva';
import { Table, Button, Row, Col, Tabs,Modal,Input } from 'antd';
const TabPane = Tabs.TabPane;
const { TextArea } = Input;
import styles from '../../newsOne/style.less'

class OpinionReport extends React.Component{
  state = {
    previewVisible: false,
    previewImage: '',
    visible: false,//modole显示 
    };
    changeTab = (key) => {
    key == '2' ? 
    this.props.dispatch({
      type: 'opinionReport/queryPubSentimentExamineItem'
    })
    : null
  }
  columns = [
    {
      key: 'key',
      dataIndex: 'key',
      title: '序号'
    },
    {
      key: 'state',
      dataIndex: 'state',
      title: '状态'
    },
    {
      key: 'taskName',
      dataIndex: 'taskName',
      title: '环节名称'
    },
    {
      key: 'userName',
      dataIndex: 'userName',
      title: '审批人'
    },
    // {
    //   key: 'taskName',
    //   dataIndex: 'taskName',
    //   title: '审批类型'
    // },
    {
      key: 'commentDetail',
      dataIndex: 'commentDetail',
      title: '审批意见'
    },
    {
      key: 'commentTime',
      dataIndex: 'commentTime',
      title: '审批时间'
    },
  ]

    //退回
    showModal = () => {
      // this.props.dispatch({
      //     type: "opinionReport/setPoints", 
      //     score:e.score,
      // })
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
          type: "opinionReport/handle", 
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
              type:'opinionReport/'+value,
              record : value2,
          })
      }else{
          this.props.dispatch({
              type:'opinionReport/'+value,
          })
      }
  };

  render() {
    const {detailData, processList} = this.props;
    let flag = JSON.stringify(detailData) == '{}' ? false : true;
    let pubType = flag == true && detailData.pubType!=undefined ?  //宣传类型拼接
    detailData.pubType.map((v, i)=> {
      return (
        <span key={i}>
          <b>{v.typeName}</b>共 <span style={{color: '#FA7252'}}>{v.typeNum}</span> 篇； &nbsp;
        </span>
      )
    }) :''
    let pubChannel = flag == true && detailData.pubChannel!=undefined ?  //宣传类型拼接
    detailData.pubChannel.map((v, i)=> {
      return (
        <span key={i}>
          <b>{v.channelName}</b>共 <span style={{color: '#FA7252'}}>{v.channelNum}</span> 篇；&nbsp; 
          {
            v.second.length > 0 ? <span> <b style={{color: '#FA7252'}}> | </b>其中： </span> : ''
          }
          {
            v.second.map((item, index) => {
              return (
                <span key={index + '' + i}>
                  <i>{item.channelName}</i> 共 {item.channelNum} 篇； &nbsp;
                </span>
              )
            })
          }
          <p></p>
        </span> 
      )
    }) :''
    let tab1 = (
      <div className={styles.opinionAddRoeDiv}>
        <Row>
            <Col span={4} className={styles.colLeft}>标题时间：</Col>
            <Col span={20} className={styles.colRight}>{flag == true ? detailData.titleTime : ''}</Col>
          </Row>
          <Row>
            <Col span={4} className={styles.colLeft}>反馈单位：</Col>
            <Col span={20} className={styles.colRight}>{flag == true ? detailData.feedbackUnitName : ''}</Col>
          </Row>
          <Row>
            <Col span={4} className={styles.colLeft}>发布时间：</Col>
            <Col span={20} className={styles.colRight}>{flag == true ? detailData.releaseTime : ''}</Col>
          </Row>
          <Row>
            <Col span={4} className={styles.colLeft}>宣传类型：</Col>
            <Col span={20} className={styles.colRight}>{pubType}</Col>
          </Row>
          <Row>
            <Col span={4} className={styles.colLeft}>宣传渠道：</Col>
            <Col span={20} className={styles.colRight}>{pubChannel}</Col>
          </Row>
          <Row>
            <Col span={4} className={styles.colLeft}>舆情监督情况时间：</Col>
            <Col span={20} className={styles.colRight}>{flag == true ? detailData.startTIme + '-' + detailData.startTIme : ''}</Col>
          </Row>
          <Row>
            <Col span={4} className={styles.colLeft}>舆情监督情况次数：</Col>
            <Col span={20} className={styles.colRight}>{flag == true ? detailData.num : ''}</Col>
          </Row>
          <Row>
            <Col span={4} className={styles.colLeft}>对内了解舆情：</Col>
            <Col span={20} className={styles.colRight}>
              正面舆情：{flag == true ? detailData.internalUp : ''}
            </Col>
          </Row>
          <Row>
            <Col span={4} className={styles.colLeft}></Col>
            <Col span={20} className={styles.colRight}>
              负面舆情：{flag == true ? detailData.internalDown : ''}
            </Col>
          </Row>
          <Row>
            <Col span={4} className={styles.colLeft}>对外了解舆情：</Col>
            <Col span={20} className={styles.colRight}>
              正面舆情：{flag == true ? detailData.foreignUp : ''}
            </Col>
          </Row>
          <Row>
            <Col span={4} className={styles.colLeft}></Col>
            <Col span={20} className={styles.colRight}>
              负面舆情：{flag == true ? detailData.foreignDown : ''}
            </Col>
          </Row>
          <Row>
            <Col span={4} className={styles.colLeft}>网络监督采取措施：</Col>
            <Col span={20} className={styles.colRight}>
              针对正面舆情：{flag == true ? detailData.measuresUp : ''}
            </Col>
          </Row>
          <Row>
            <Col span={4} className={styles.colLeft}></Col>
            <Col span={20} className={styles.colRight}>
              针对负面舆情：{flag == true ? detailData.measuresDown : ''}
            </Col>
          </Row>
      </div>
    )
    let tab2 = (
      <div>
        <Table 
          className={styles.orderTable}
          dataSource = {processList}
          columns = {this.columns}
          pagination = {false} />
      </div>
    )
    return (
      // <Spin tip="加载中..." spinning={this.props.loading}>
      <div className={styles.pageContainer}>
        <h2 style = {{textAlign:'center',marginBottom:30}}>{flag == true ? detailData.titleName : ''}</h2>
        <Button type='primary' style={{float: 'right', zIndex: 10000, marginLeft:10}}><a href="javascript:history.back(-1);">返回</a></Button>
        {this.props.pass=="1"?"":
        <span>
          {this.props.difference=="审核"?
            <Button style = {{float: 'right', marginLeft:10}} onClick={(e)=>this.returnModel('onAgree',)}size="default" type="primary" >
          同意
        </Button>
        :""}
        {this.props.taskName=="归档"?"":(this.props.difference=="审核"? 
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
        <Tabs defaultActiveKey="1" onChange={this.changeTab} style={{clear:"both"}}>
          <TabPane tab="报告详情" key="1">
            {tab1}
          </TabPane>
          <TabPane tab="审批环节" key="2">
            {tab2}
          </TabPane>
          </Tabs>
      </div>
      // </Spin>
    );
  }
}

function mapStateToProps (state) {
   
  return {
    loading: state.loading.models.opinionReport,
    ...state.opinionReport
  };
}
export default connect(mapStateToProps)(OpinionReport);
