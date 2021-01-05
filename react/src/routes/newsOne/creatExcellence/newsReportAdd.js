/**
 * 作者：窦阳春
 * 日期：2020-10-28
 * 邮箱：douyc@itnova.com.cn
 * 功能：争优创先-新闻工作报告新增页， 修改页
 */
import React, { Component } from 'react'
import {connect } from 'dva';
import { Row, Col, Input, Button, message, Spin } from 'antd';
import Cookie from 'js-cookie';
const { TextArea } = Input;
import {routerRedux} from 'dva/router'
import styles from '../../newsOne/style.less'

class NewsReportAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  saveChange = (flag, value) => {
    value.length>1000 ? message.info("不能超过1000字") : null;
    this.props.dispatch({
      type: 'newsReportAdd/saveValue',
      flag,
      value: value.length>200 ? value.substring(0, 1000) : value,
    })
  }
  submit =(flag) => {
    this.props.dispatch({
      type: 'newsReportAdd/submit', flag
    })
  }
  goBack = () => {
    this.props.dispatch(routerRedux.push({
      pathname: '/adminApp/newsOne/creatExcellence',
      query: { key: '2'}
    }))
  }
  render() {
    const {reportName, workSummary, questionAndMethod, nextWorkPlan, page} = this.props;
    var date = new Date()
    let submitTime = date.getFullYear() + '-' + (date.getMonth()+1) + '-' +date.getDate()
    return (
      <Spin tip="加载中..." spinning={this.props.loading}>
        <div className={styles.pageContainer}>
          <h2 style = {{textAlign:'center',marginBottom:30}}>软件研究院新闻工作报告{page}</h2>
          <div className={styles.opinionAddRoeDiv}>
          <Row>
            <Col span={8} className={styles.colLeft}><span style={{color: '#f00'}}>* </span>提交人：</Col>
            <Col span={16} className={styles.colRight}>{Cookie.get('username')}</Col>
          </Row>
          <Row>
            <Col span={8} className={styles.colLeft}><span style={{color: '#f00'}}>* </span>提交时间：</Col>
            <Col span={16} className={styles.colRight}>{submitTime}</Col>
          </Row>
          <Row>
            <Col span={8} className={styles.colLeft}><span style={{color: '#f00'}}>* </span>单位名称：</Col>
            <Col span={16} className={styles.colRight}>{Cookie.get('deptname')}</Col>
          </Row>
          <Row>
            <Col span={8} className={styles.colLeft}><span style={{color: '#f00'}}>* </span>报告名称：</Col>
            <Col span={16} className={styles.colRight}>
              <Input value={reportName} style={{width: '60%'}} onChange={(e)=>this.saveChange('reportName', e.target.value)}/>
            </Col>
          </Row>
          <Row>
            <Col span={8} className={styles.colLeft}><span style={{color: '#f00'}}>* </span>年度工作总结 ：</Col>
            <Col span={16} className={styles.colRight}>
              <TextArea value={workSummary} style={{width: '60%'}} onChange={(e)=>this.saveChange('workSummary', e.target.value)}/>
            </Col>
          </Row>
          <Row>
            <Col span={8} className={styles.colLeft}><span style={{color: '#f00'}}>* </span>目前存在的问题及整改的措施：</Col>
            <Col span={16} className={styles.colRight}>
              <TextArea value={questionAndMethod} style={{width: '60%'}} onChange={(e)=>this.saveChange('questionAndMethod', e.target.value)}/>
            </Col>
          </Row>
          <Row>
            <Col span={8} className={styles.colLeft}><span style={{color: '#f00'}}>* </span>下一步工作计划：</Col>
            <Col span={16} className={styles.colRight}>
              <TextArea value={nextWorkPlan} style={{width: '60%'}} onChange={(e)=>this.saveChange('nextWorkPlan', e.target.value)}/>
            </Col>
          </Row>
          </div>
          <div style={{textAlign: 'center'}}>
            <Button onClick={()=>this.submit('0')} type='primary' size='default' style={{marginRight: 5}}>保存</Button>
            <Button onClick={()=>this.submit('1')} type='primary' size='default' style={{marginRight: 5}}>提交</Button>
            <Button type='primary' onClick={this.goBack}>取消</Button>
          </div>
        </div>
      </Spin>
    )
  }
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.newsReportAdd, 
    ...state.newsReportAdd
  };
}

export default connect(mapStateToProps)(NewsReportAdd);
