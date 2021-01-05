/**
 * 作者：窦阳春
 * 日期：2020-09-21
 * 邮箱：douyc@itnova.com.cn
 * 功能：审批页面
 */
import React, { Component } from 'react'
import {connect } from 'dva';
import { Row, Col, DatePicker, Input, Select, Radio, Spin, Button } from 'antd';
const RadioGroup = Radio.Group;    
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD HH:mm';  
import styles from '../../carsManage/carsManage.less'
import { routerRedux } from 'dva/router';

class judgePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }  
  saveChange = (flag, value, time) => {
    this.props.dispatch({
      type: 'judgePage/saveValue',
      value: (typeof(value) == 'string' && value.length>50) ? value.substring(0,50) : value,
      flag,
      time
    })
  } 
  timePiker = () => {
    const {pickTime} = this.props
    return (
      <span>&nbsp;
        <DatePicker 
          showTime = {{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          placeholder = '选择时间'
          value={pickTime == '' ? null : moment(pickTime, dateFormat)}
          onChange={(value, dataString)=>this.saveChange(value, dataString, 'time')}
        />&nbsp;
      </span>
    )
  }
  reply = () => {
    this.props.dispatch({
      type: 'judgePage/reply'
    })
  }
  goBack = (flag) => {
    this.props.dispatch(routerRedux.push({
      pathname: '/adminApp/carsManage/myJudge',
      query: {flag}
    }))
  }
  render() {
    const {detailsData, radioValue, flag, type} = this.props;
    let isDataUpdate = JSON.stringify(detailsData) !== '{}' ? 1 : 0;
    return (
      <Spin tip="加载中..." spinning={this.props.loading}>
        <div className={styles.pageContainer}>
          <h2 style = {{textAlign:'center',marginBottom:20}}>
            {type=='0' ? '正常生产经营业务支撑用车申请' : type=='1' ? '因公出差接送站用车申请' 
            : type=='2' ? '个人特殊事宜临时用车申请' : ''}审批{flag=='doList' ? '详情' : ''}
          </h2>
          { flag=='doList' ? 
          <Button size="default" type="primary" style={{marginTop: '-20px', float: 'right'}} onClick={()=>this.goBack('doList')}>返回</Button> 
          : ''
          }
          {
            isDataUpdate == 1 ?
          <div style={{width: '80%', margin: '0 auto', border: '0px solid #000'}}>
            {flag=='todoList' ? 
            <span>
            <Row>
              <Col span={8} className={styles.colLeft}><span style={{color: '#f00'}}>* </span>审批意见：</Col>
              <Col span={16} className={styles.colRight}>
                <RadioGroup onChange={(e)=>this.saveChange('radioValue', e.target.value)} value={radioValue}>
                  <Radio value={0} style={{padding: '5px 0'}}><span style={{color: '#FA7252'}}> [通过] </span>请准时乘车</Radio><br/>
                  {type == '0' ?
                  <span>
                    <Radio value={2} style={{padding: '5px 0'}}><span style={{color: '#FA7252'}}> [通过] </span>因合用车，请改为{this.timePiker()}乘车</Radio><br/>
                    <Radio value={3} style={{padding: '5px 0'}}><span style={{color: '#0fe221'}}> [退回] </span>因车辆紧张请自行安排</Radio><br/>
                  </span>
                  : <span>
                    <Radio value={1} style={{padding: '5px 0'}}><span style={{color: '#FA7252'}}> [通过] </span>请改为{this.timePiker()}乘车</Radio><br/>
                    <Radio value={3} style={{padding: '5px 0'}}><span style={{color: '#0fe221'}}> [退回] </span>因车辆紧张请自行安排</Radio><br/>
                    </span>
                  }
                </RadioGroup>
              </Col>
            </Row>
            <Row>
              <Col span={8}></Col>
              <Col span={16}>
                <Button style = {{margin: '10px 30px 5px 0'}} size="default" type="primary" onClick = {this.reply}>{radioValue=='3'? '退回': '通过'}</Button>
                <Button size="default" type="primary"  onClick={()=>this.goBack('todoList')}>返回</Button>
              </Col>
            </Row>
            </span> : 
            <span>
              <Row>
                <Col span={8} className={styles.colLeft}>状态：</Col>
                <Col span={16} className={styles.colRight}>
                  {detailsData.state == '3' ? <span style={{color:'#0FE221'}}>退回</span> 
                  : detailsData.state == '2' ? <span style={{color:'#FA7252'}}>通过</span> : ''}
                </Col>
              </Row>
              <Row>
                <Col span={8} className={styles.colLeft}>约车回复：</Col>
                <Col span={16} className={styles.colRight}><span style={{color:'#FA7252'}}>{detailsData.approvalIdea}</span></Col>
              </Row>
              <Row>
                <Col span={8} className={styles.colLeft}>审定时间：</Col>
                <Col span={16} className={styles.colRight}><span style={{color: '#FA7252'}}>{detailsData.approvalTime.slice(0, -2)}</span></Col>
              </Row>
            </span>}
            <hr/>
            <Row>
              <Col span={8} className={styles.colLeft}>用车申请部门：</Col>
              <Col span={16} className={styles.colRight}>{detailsData.deptName}</Col>
            </Row>
            <Row>
              <Col span={8} className={styles.colLeft}>用车需求人：</Col>
              <Col span={16} className={styles.colRight}>{detailsData.userName}</Col>
            </Row>
            {
              detailsData.userCount ?
              <Row>
                <Col span={8} className={styles.colLeft}>乘车人数：</Col>
                <Col span={16} className={styles.colRight}>{detailsData.userCount}</Col>
              </Row> : ''
            }
            <Row>
              <Col span={8} className={styles.colLeft}>用车时间：</Col>
              <Col span={16} className={styles.colRight}>{detailsData.useTime.slice(0, -5)}</Col>
            </Row>
            <Row>
              <Col span={8} className={styles.colLeft}>行车路线1：</Col>
              <Col span={16} className={styles.colRight}>{detailsData.startFirst}{' ——> '}{detailsData.endFirst}</Col>
            </Row>
            {
              detailsData.startSecond !== '' ?
              <Row>
                <Col span={8} className={styles.colLeft}>行车路线2：</Col>
                <Col span={16} className={styles.colRight}>
                  {detailsData.startSecond}  {detailsData.endSecond!=null ?  ' ——> ' + detailsData.endSecond : ''}
                </Col>
              </Row>
              : '' }
            {
              type == 0 ?
              <Row>
                <Col span={8} className={styles.colLeft}>是否返程：</Col>
                <Col span={16} className={styles.colRight}>{detailsData.ifBacktrack=='1' ? '是' : '否'}</Col>
              </Row> : ''
            }
            <Row>
              <Col span={8} className={styles.colLeft}>用车事由：</Col>
              <Col span={16} className={styles.colRight}>{detailsData.reason}</Col>
            </Row>
            {
              detailsData.reasonDetail != null && type == 0?
              <Row>
                <Col span={8} className={styles.colLeft}>用车说明事项：</Col>
                <Col span={16} className={styles.colRight}>{detailsData.reasonDetail}</Col>
              </Row> : ''
            }
            <Row>
              <Col span={8} className={styles.colLeft}>约车回复人：</Col>
              <Col span={16} className={styles.colRight}>{detailsData.verifierName}</Col>
            </Row>
            <Row>
              <Col span={8} className={styles.colLeft}>申请时间：</Col>
              <Col span={16} className={styles.colRight}>{detailsData.createTime.slice(0, -2)}</Col>
            </Row>
            <Row>
              <Col span={8} className={styles.colLeft}>提交人：</Col>
              <Col span={16} className={styles.colRight}>{detailsData.createName}</Col>
            </Row>
            {
              detailsData.phone ?
              <Row >
                <Col span={8} className={styles.colLeft}>手机号码：</Col>
                <Col span={16} className={styles.colRight}><div>{detailsData.phone}</div></Col>
              </Row> : ''
            }
          </div>
          : ''}
        </div>
     </Spin>
    )
  }
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.judgePage, 
    ...state.judgePage
  };
}

export default connect(mapStateToProps)(judgePage);
