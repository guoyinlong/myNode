/**
 * 文件说明：培训管理首页
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-07-08
 **/
import React, { Component } from 'react';
import { Button } from "antd";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import Background from '../../assets/Images/leave_and_train_background.png';

class train_statistic_index extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  };
  //培训计划执行情况查询
  gotoPlanExecStatic = () => {
    const { dispatch } = this.props;

    dispatch(routerRedux.push({
      pathname: '/humanApp/train/trainStatistic/statistic_search',
    }));
  };

  //培训积分查询
  gotoQueryCredit = () => {
    const { dispatch } = this.props;

    dispatch(routerRedux.push({
      pathname: '/humanApp/train/trainStatistic/train_class_info',
    }));
  };

  //自定义统计查询
  gotoCustomStatic = () => {
    const { dispatch } = this.props;

    dispatch(routerRedux.push({
      pathname: '/humanApp/train/trainStatistic/train_config_query',
    }));
  };

  render() {

    const sectionStyle = {
      width: '100%',
      height: '100%',
      backgroundImage: `url(${Background})`,
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    };

    return (
      <div style={sectionStyle}>
        <br /><br />
        <br /><br />
        <div style={{ textAlign: 'center' }}>
          <Button size="large" type="primary" height={'100px'} onClick={this.gotoQueryCredit} >培训积分查询</Button>
        </div>
        <br /><br />
        <br /><br />

        <div style={{ textAlign: 'center' }}>
          <Button size="large" type="primary" height={'100px'} onClick={this.gotoCustomStatic} >自定义统计查询</Button>
        </div>
        <br /><br />
        <br /><br />

        <div style={{ textAlign: 'center' }}>
          <Button size="large" type="primary" height={'100px'} onClick={this.gotoPlanExecStatic} >培训计划执行情况查询</Button>
        </div>
        <br /><br />
        <br /><br />

      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.train_index_model,
    ...state.train_index_model
  };
}
export default connect(mapStateToProps)(train_statistic_index);


