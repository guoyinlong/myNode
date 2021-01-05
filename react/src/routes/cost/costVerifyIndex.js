/**
 * 作者：郭西杰
 * 创建日期：2020-08-31
 * 邮箱：guoxj116@chinaunicom.cn
 * 文件说明：人工成本管理验证首页
 */
import React, { Component } from 'react';
import { connect } from "dva";
import Cookie from 'js-cookie';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { routerRedux } from "dva/router";
moment.locale('zh-cn');
import { Form, Button } from 'antd';
import styles from './verify.less';

class costVerifyIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      OUDataList: [],
      OU: Cookie.get("OU"),
      user_id: Cookie.get("staff_id"),
      email: Cookie.get("email"),
      user_name: Cookie.get("username"),
    };
  };
  componentDidMount() 
  { 
    const {rand_code, codeVerify} = this.props;
    console.log('costVerifyRouter',codeVerify)
    console.log('rand_code',rand_code)
    if( codeVerify != rand_code || codeVerify == undefined || codeVerify == null || codeVerify == '')
    {
        const { dispatch } = this.props;
        message.success('请重新输入验证码')
        dispatch(routerRedux.push({
            pathname: '/humanApp/costlabor/costVerify',
        }));
    }
  } 

  importLaborInfo = () => {
    const { dispatch } = this.props;
    let query = {
        verifyControl: this.props.codeVerify,
      }
    dispatch(routerRedux.push({
        pathname: '/humanApp/costlabor/costVerify/costVerifyIndex/importLaborInfo',
        query
    }));
  };
  exportCostForHrDetail = () => {
    const { dispatch } = this.props;
    let query = {
        verifyControl: this.props.codeVerify,
      }
    dispatch(routerRedux.push({
        pathname: '/humanApp/costlabor/costVerify/costVerifyIndex/exportCostForHrDetail',
        query
    }));
  };
  exportCostForHrFull = () => {
    const { dispatch } = this.props;
    let query = {
        verifyControl: this.props.codeVerify,
      }
    dispatch(routerRedux.push({
        pathname: '/humanApp/costlabor/costVerify/costVerifyIndex/exportCostForHrFull',
        query
    }));
  };

  exportCostToCapitalization = () => {
    const { dispatch } = this.props;
    let query = {
        verifyControl: this.props.codeVerify,
      }
    dispatch(routerRedux.push({
        pathname: '/humanApp/costlabor/costVerify/costVerifyIndex/exportCostToCapitalization',
        query
    }));
  };
 
  render() {
    return (
      <div className={styles.meetWrap}>
      <div className={styles.headerName}>{'人工成本登录首页'}</div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <div  style={{width:600,margin:'0 auto',border:'2px solid',borderRadius:8,position:'relative'}}>
      <tr>
            <td style={{width:'300'}}>
         <br /><br /> 
        <div style={{ textAlign: 'center' }}>
          <Button size="large" type="primary" height={'100px'} onClick={this.importLaborInfo} >工资单导入</Button>
        </div>
         <br /><br />
        </td>
        <td style={{width:'300'}}>
        <br /><br /> 
         <div style={{ textAlign: 'center' }}>
          <Button size="large" type="primary" height={'100px'} onClick={this.exportCostForHrDetail} >研发人工成本报表</Button>
        </div>
         <br /><br /> 
        </td>
        </tr>
        <tr>
          <td style={{width:'300'}}>
         <br /><br /> 
        <div style={{ textAlign: 'center' }}>
          <Button size="large" type="primary" height={'100px'} onClick={this.exportCostForHrFull} >全口径人工成本报表</Button>
        </div>
        <br /><br /> 
        </td>
        <td style={{width:'300'}}> 
        <br /><br />
        <div style={{ textAlign: 'center' }}>
          <Button size="large" type="primary" height={'100px'} onClick={this.exportCostToCapitalization} >项目转资报表导出</Button>
        </div>
        <br /><br /> 
        </td>
        </tr>
      </div>
    </div>
     
    )
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.costVerifyModel,
    ...state.costVerifyModel
  };
}
costVerifyIndex = Form.create()(costVerifyIndex);
export default connect(mapStateToProps)(costVerifyIndex);

