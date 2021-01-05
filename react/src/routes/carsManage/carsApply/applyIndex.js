import React, { Component } from 'react'
import {connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button } from 'antd';
import styles from '../../carsManage/carsManage.less';
import Background from '../../../assets/Images/carsManage/cars.png';

class applyIndex extends Component {
  constructor (props) {
    super(props);
    this.state = {
      visible:false,
    }
  }
  gotoApply = (str) => { //跳转申请填报页面
    this.props.dispatch(routerRedux.push({
      pathname: `/adminApp/carsManage/carsApply/carsApplyInput`,
      query: {
        pageKey: str
      }
    }))
  }
  render() {
    const sectionStyle = {
      width: '100%',
      height: '60%',
      backgroundImage: `url(${Background})`,
      backgroundPosition : 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    };
    const buttonSize = {
      padding: '1.5%',
      fontSize: '25px',
      borderRadius: '10%',
      height: '0.5%',
      width: '37%',
    };
    return (
      <div className={styles.pageContainer} style={sectionStyle}>
        <div style={{textAlign:"center"}}>
          <div className = {styles.light}><div style = {{marginTop:15}} className = {styles.lightInfo}>请提前至少半天约车！</div></div>
          <br/><br/>
          <br/><br/>
          <Button style={buttonSize} size = "large" type="primary" onClick={()=>this.gotoApply('normalBusiness')}>正 常 业 务 支 撑 用 车</Button>
        </div>
        <br/><br/>
        <br/><br/>
        <br/><br/>
        <div style={{textAlign:"center"}}>
          <Button style={buttonSize} size = "large" type="primary" onClick={()=>this.gotoApply('workOnBusiness')}>因 公 出 差 接 送 站 用 车</Button>
        </div>
        <br/><br/>
        <br/><br/>
        <br/><br/>
        <div style={{textAlign:"center"}}>
          <Button style={buttonSize} size = "large" type="primary" onClick={()=>this.gotoApply('specialMatters')}>个 人 特 殊 事 宜 临 时 用 车</Button>
        </div>
        <br/><br/>
        <br/><br/>
        <br/><br/>
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.applyIndex, 
    ...state.applyIndex
  };
}

export default connect(mapStateToProps)(applyIndex);
