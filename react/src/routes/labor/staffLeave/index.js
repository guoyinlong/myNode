/**
 * 文件说明：离职首页
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-04-25
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Form, message, Modal, Select } from "antd";
import { routerRedux } from "dva/router";
import Cookie from "js-cookie";
import Style from "./index.less";
import Background from '../../../assets/Images/leave_and_train_background.png';

const Option = Select.Option;


class IndexInfo extends Component {
  constructor(props) {
    super(props);
    let user_name = Cookie.get('username');
    let dept_name = Cookie.get('dept_name');
    this.state = {
      visible: false,
      staff_name: user_name,
      dept_name: dept_name,
      applyFlag: true,
      handFlag: true,
      settleFlag: true,
      confirmVisible: false,
    }
  }

  //查询当前离职进度
  componentDidMount() {
    const { dispatch } = this.props;
    return new Promise((resolve) => {
      dispatch({
        type: 'index/queryLeaveStep',
        resolve
      });
    }).then((resolve) => {
      if (resolve === 'success') {
        const leaveStepRecord = this.props.leaveStepRecord;
        //离职申请可以放开的条件是，该人位进行离职申请或者离职申请已经发起但被驳回
        if (leaveStepRecord.apply_status === '-1' || leaveStepRecord.apply_status === '3') {
          this.setState({
            applyFlag: false,
            handFlag: true,
            settleFlag: true,
          });
        } else if (leaveStepRecord.apply_status === '2' || leaveStepRecord.apply_status === '1') {
          this.setState({
            applyFlag: true,
          });
        }
        //离职交接必须在离职申请流程结束后，apply_status状态必须为2；其余情况，离职交接不可放开权限。离职交接完成之前，离职清算权限不可放开，且离职交接进行中，离职申请不可进行
        if (leaveStepRecord.apply_status === '2' && (leaveStepRecord.hand_status === '-1' || leaveStepRecord.hand_status === '3')) {
          this.setState({
            applyFlag: true,
            handFlag: false,
            settleFlag: true,
          });
        } else if (leaveStepRecord.hand_status === '1' || leaveStepRecord.hand_status === '2') {
          this.setState({
            handFlag: true,
          });
        }
        //离职清算，必须要求离职申请和离职交接完成，apply_status、hand_status状态均为2，其余情况，离职清算不可以开始
        if (leaveStepRecord.apply_status === '2' && leaveStepRecord.hand_status === '2' && (leaveStepRecord.settle_status === '-1' || leaveStepRecord.settle_status === '3')) {
          this.setState({
            applyFlag: true,
            handFlag: true,
            settleFlag: false,
          });
        } else if (leaveStepRecord.settle_status === '1' || leaveStepRecord.settle_status === '2') {
          this.setState({
            settleFlag: true,
          });
        }
      }
      //未查到该人的离职申请，即放开离职申请权限
      else {
        this.setState({
          applyFlag: false,
          settleFlag: true,
          handFlag: true,
        });
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname: '/humanApp/labor/index'
      }));
    });
  }

  //离职申请界面
  gotoCreateLeave = () => {
    this.setState({
      confirmVisible: true
    });
  };

  //工作交接界面
  gotoCreateLeave1 = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/labor/index/workHandover'
    }));
  };

  //离职清算界面
  gotoCreateLeaveSettle = () => {
    const { dispatch } = this.props;
    let query = this.props.leaveHandleRecord;
    console.log("query : " + query);
    if (query != null && query != '' && query != undefined) {
      if (query.isSubmit === '0') {
        dispatch(routerRedux.push({
          pathname: '/humanApp/labor/index/createLeaveSettle',
          query
        }));
      }
      else {
        message.error("离职结算已经提交过，无法重复提交离职结算！");
        return;
      }
    }
    else {
      message.error("离职交接未完成，无法提交离职结算！");
      return;
    }
  };

  //确认离职申请
  handleConfirmOk = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/labor/index/createLeave'
    }));
  };

  handleConfirmCancel = () => {
    this.setState({
      confirmVisible: false
    });
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
    const buttonSize = {
      padding: '1.5%',
      fontSize: '25px',
      borderRadius: '10%',
      height: '0.5%',
      width: '30%',
    };
    return (
      <div style={sectionStyle}>
        {/*        <div className={Style.content}>
          <p>尊敬的<span className={Style.line}>{this.state.staff_name}</span>:</p>
          <p className={Style.row}>自您加入中国联通软件研究院以来，我们一起经历了许多风雨。</p>
          <p className={Style.row}>对您在
            <span className={Style.line}>{this.state.dept_name}</span>
            所作出的贡献及以往的辛劳付出，我们衷心表示认可。</p>
          <p className={Style.row}>对于您选择离开，我们深表遗憾！</p>
          <p className={Style.row}>对于您的前程，我们表示深切祝福！</p>
          <p className={Style.row}>请您站好最后一班岗，顺利完成交接工作。</p>
        </div>
        <div style={{textAlign:"left"}}>
          <Button type="primary" onClick={this.gotoCreateLeave.bind(this)} disabled={this.state.applyFlag}>办理离职</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={this.gotoCreateLeave1.bind(this)} disabled={this.state.handFlag}>工作交接</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={this.gotoCreateLeaveSettle.bind(this)} disabled={this.state.settleFlag}>离职结算</Button>
          <br/><br/>
        </div>*/}
        <div style={{ textAlign: "center" }}>
          <br /><br />
          <br /><br />
          <br /><br />
          <Button style={buttonSize} size="large" type="primary" onClick={this.gotoCreateLeave.bind(this)} disabled={this.state.applyFlag}>办 理 离 职</Button>
        </div>
        <br /><br />
        <br /><br />
        <br /><br />
        <div style={{ textAlign: "center" }}>
          <Button style={buttonSize} size="large" type="primary" onClick={this.gotoCreateLeave1.bind(this)} disabled={this.state.handFlag}>工 作 交 接</Button>
        </div>
        <br /><br />
        <br /><br />
        <br /><br />
        <div style={{ textAlign: "center" }}>
          <Button style={buttonSize} size="large" type="primary" onClick={this.gotoCreateLeaveSettle.bind(this)} disabled={this.state.settleFlag}>离 职 结 算</Button>
        </div>
        <br /><br />
        <br /><br />
        <br /><br />

        <Modal
          title="确认离职"
          visible={this.state.confirmVisible}
          onOk={this.handleConfirmOk}
          onCancel={this.handleConfirmCancel}
        >
          <p className={Style.row}> <h3>对您加入中国联通软件研究院以来所作出的贡献及辛劳付出，我们表示衷心感谢。</h3></p>
          <p className={Style.row}><h3>您真的确定离职吗？</h3></p>
        </Modal>
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    loading: state.loading.models.index,
    ...state.index
  };
}
IndexInfo = Form.create()(IndexInfo);
export default connect(mapStateToProps)(IndexInfo);

