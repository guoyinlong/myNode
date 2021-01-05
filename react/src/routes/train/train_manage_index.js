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

class train_manage_index extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  };
  //培训任务设定
  gotoSpecialTask = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/train/trainManage/trainManagementSettings',
    }));
  };

  //特定人群维护
  gotoSpecialPerson = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/train/trainManage/trainSpecialPersonInfo',
    }));
  };

  //人员岗位匹配信息录入
  gotoPersonPost = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/train/trainManage/importPersonPost',
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
          <Button size="large" type="primary" height={'100px'} onClick={this.gotoSpecialTask} >培训任务设定</Button>
        </div>
        <br /><br />
        <br /><br />

         <div style={{ textAlign: 'center' }}>
          <Button size="large" type="primary" height={'100px'} onClick={this.gotoSpecialPerson} >特定人群维护</Button>
        </div>
        <br /><br />
        <br /><br />

        <div style={{ textAlign: 'center' }}>
          <Button size="large" type="primary" height={'100px'} onClick={this.gotoPersonPost} >人员岗位匹配信息录入</Button>
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
export default connect(mapStateToProps)(train_manage_index);


