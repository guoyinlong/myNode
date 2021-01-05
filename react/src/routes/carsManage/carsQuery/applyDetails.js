/**
 * 作者：窦阳春
 * 日期：2020-09-17 
 * 邮箱：douyc@itnova.com.cn
 * 功能：用车申请详情页
 */
import React, { Component } from 'react'
import {connect } from 'dva';
import { Row, Col , Spin, Button } from 'antd';
import styles from '../../carsManage/carsManage.less';

class applyDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  render() {
    const {applyDetail, type} = this.props
    let flag = applyDetail.state != undefined ? 1 : 0; 
    let state = applyDetail.state == '0' ? '草稿' : applyDetail.state == '1' ? '待审批' :
    applyDetail.state == '2' ? '审批通过' : applyDetail.state == '3' ? '审批退回' : applyDetail.state == '4' ? '申请单作废' : ''
    return (
      <Spin tip="加载中..." spinning={this.props.loading}>
        <div className={styles.pageContainer}>
         <h2 style = {{textAlign:'center',marginBottom:30}}>审批详情</h2>
        <Button style = {{float: 'right', marginTop: -30}} size="default" type="primary" >
          <a href="javascript:history.back(-1)">返回</a>
        </Button>
        {flag == 1 ?
        <div style={{width: '80%', margin: '0 auto', border: '0px solid #000',}}>
          <Row >
            <Col span={8} className={styles.colLeft}>状态：</Col>
            <Col span={16} className={styles.colRight}><div style={{color: '#f00'}}>{state}</div></Col>
          </Row>
          {
            applyDetail.state != 1 && applyDetail.state != 4 ?
            <span>
              <Row >
                <Col span={8} className={styles.colLeft}>约车回复：</Col>
                <Col span={16} className={styles.colRight}><div style={{color: '#f00'}}>{applyDetail.approvalIdea}</div></Col>
              </Row>
              <Row >
                <Col span={8} className={styles.colLeft}>审定时间：</Col>
                <Col span={16} className={styles.colRight}><div style={{color: '#f00'}}>{applyDetail.approvalTime.slice(0, -2)}</div></Col>
              </Row>
            </span> : ''
          }
          <hr/>
          <Row >
            <Col span={8} className={styles.colLeft}>用车申请部门：</Col>
            <Col span={16} className={styles.colRight}><div>{applyDetail.deptName}</div></Col>
          </Row>
          <Row >
            <Col span={8} className={styles.colLeft}>用车需求人：</Col>
            <Col span={16} className={styles.colRight}><div>{applyDetail.userName}</div></Col>
          </Row>
          {
            type != 0 && applyDetail.withName != ''?
            <Row >
              <Col span={8} className={styles.colLeft}>同车同乘人：</Col>
              <Col span={16} className={styles.colRight}><div>{applyDetail.withName}</div></Col>
            </Row> : ''
          }
          {applyDetail.userCount?
            <Row >
              <Col span={8} className={styles.colLeft}>乘车人数：</Col>
              <Col span={16} className={styles.colRight}><div>{applyDetail.userCount}</div></Col>
            </Row> : ''
          }
          <Row >
            <Col span={8} className={styles.colLeft}>用车时间：</Col>
            <Col span={16} className={styles.colRight}><div>{applyDetail.useTime.slice(0, -5)}</div></Col>
          </Row>
          <Row >
            <Col span={8} className={styles.colLeft}>行车路线1：</Col>
            <Col span={16} className={styles.colRight}>
              <div>{applyDetail.startFirst + ' ——> ' + applyDetail.endFirst}</div>
            </Col>
          </Row>
          {
          applyDetail.endSecond != '' || applyDetail.startSecond!= '' ?
          <Row >
            <Col span={8} className={styles.colLeft}>行车路线2：</Col>
            <Col span={16} className={styles.colRight}>
              <div>
              {applyDetail.startSecond}  {applyDetail.endSecond!=null ?  ' ——> ' + applyDetail.endSecond : ''}
              </div>
            </Col>
          </Row> : ''
          }
          {
            applyDetail.ifBacktrack != null && type == 0 ? 
            <Row>
              <Col span={8} className={styles.colLeft}>是否返程：</Col>
              <Col span={16} className={styles.colRight}><div>{applyDetail.ifBacktrack == '1' ? '是' : '否'}</div></Col>
            </Row> : ''
          }
          <Row >
            <Col span={8} className={styles.colLeft}>{type == 0 ? '用车事由（支撑事项）：' : '用车事由：'}</Col>
            <Col span={16} className={styles.colRight}><div>{applyDetail.reason}</div></Col>
          </Row>
          {type == 0 && applyDetail.reasonDetail !='' ? 
          <Row >
            <Col span={8} className={styles.colLeft}>用车说明事项：</Col>
            <Col span={16} className={styles.colRight}><div>{applyDetail.reasonDetail}</div></Col>
          </Row> : ''
          }
          <Row >
            <Col span={8} className={styles.colLeft}>约车回复人：</Col>
            <Col span={16} className={styles.colRight}><div>{applyDetail.verifierName}</div></Col>
          </Row>
          <Row >
            <Col span={8} className={styles.colLeft}>申请时间：</Col>
            <Col span={16} className={styles.colRight}><div>{applyDetail.createTime.slice(0, -2)}</div></Col>
          </Row>
          <Row >
            <Col span={8} className={styles.colLeft}>提交人：</Col>
            <Col span={16} className={styles.colRight}><div>{applyDetail.createName}</div></Col>
          </Row>
        </div> : null }
        </div>
      </Spin>
    )
  }
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.applyDetails, 
    ...state.applyDetails
  };
}

export default connect(mapStateToProps)(applyDetails);
