/**
 * 文件说明：培训管理首页
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-07-08
 **/
import React, { Component } from 'react';
import { Button, Modal, Select, message } from "antd";
import { connect } from "dva";
import Cookie from "js-cookie";
import { routerRedux } from "dva/router";
import Background from '../../assets/Images/leave_and_train_background.png';

const Option = Select.Option;

class train_index extends Component {
  constructor(props) {
    super(props);
    let user_name = Cookie.get('username');
    let user_id = Cookie.get('userid');
    let dept_id = Cookie.get('dept_id');
    let dept_name = Cookie.get('dept_name');
    let ou_name = Cookie.get('OU');
    this.state = {
      ou_name: ou_name,
      staff_name: user_name,
      dept_name: dept_name,
      user_id: user_id,
      dept_id: dept_id,
      //用户角色
      GeneralVisible: false,
      //创建类型标志
      trainPlanType: false,
      //创建培训申请类型标志
      createClassApplyVisible: false,
      //创建培训申请类型
      trainApplyType: "",
      trainApplyName: "",
      //删除标志
      deleteFlag: '',
    }
  }

  /**培训申请  开始*/
  //根据登陆用户身份确定可以创建的培训类型：判断身份进入不同的modal。
  //用户身份：总院人力接口人（提交全院计划和总院人力部门计划）、分院人力接口人（提交分院计划和分院人力部门计划）、部门接口人（提交部门计划）
  //其他全体员工，只可提交 外训、内训-集团
  createNewTrainClassApplyType = () => {
    this.setState({
      createClassApplyVisible: true,
    })
  };

  handleClassApplyOk = () => {
    this.setState({
      createClassApplyVisible: false,
    })

    const { dispatch } = this.props;
    this.setState({
      GeneralVisible: false,
    });
    let param = {
      trainApplyType: this.state.trainApplyType,
    };

    if (!param.trainApplyType) {
      message.error('请选择培训申请类型！');
    }
    else {
      //外训-外派培训
      if (this.state.trainApplyType === 'external_and_certification') {
        dispatch(routerRedux.push({
          pathname: '/humanApp/train/train_index/create_train_apply',
          param
        }));
      }
      //内训-参加集团及系统内培训
      if (this.state.trainApplyType === 'internal_ingroup_insystem') {
        dispatch(routerRedux.push({
          pathname: '/humanApp/train/train_index/create_internal_ingroup_insystem_apply',
          param
        }));
      }
      //内训-自有内训师培训
      if (this.state.trainApplyType === 'internal_own_teacher') {
        dispatch(routerRedux.push({
          pathname: '/humanApp/train/train_index/create_internal_own_teacher',
          param
        }));
      }
      //内训-外请讲师培训
      if (this.state.trainApplyType === 'internal_external_teacher') {
        dispatch(routerRedux.push({
          pathname: '/humanApp/train/train_index/create_internal_external_teacher',
          param
        }));
      }
      //培训班
      if (this.state.trainApplyType === 'train_class_course_apply') {
        dispatch(routerRedux.push({
          pathname: '/humanApp/train/train_index/create_train_course_apply',
          param
        }));
      }
    }
  };

  handleClassApplyCancel = () => {
    this.setState({
      createClassApplyVisible: false,
    })
  };

  createTrainApply = (value) => {
    this.setState({
      trainApplyType: value,
    });
  };

  /**培训申请  结束*/

  gotoImport = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/train/train_index/train_online_exam_import',
    }));
  };
  gotoImportOnline = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/train/train_index/train_online_exam_import/train_online_import',
    }));
  };
  gotoImportExam = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/train/train_index/train_online_exam_import/train_exam_import',
    }));
  };

  render() {
    const userRole = this.props.userRole;
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
          <Button size="large" type="primary" height={'100px'} onClick={this.createNewTrainClassApplyType} >培训申请审批</Button>
        </div>

        <br /><br />
        <br /><br />
        {
          userRole === '1' || userRole === '2'
            ?
            <div style={{ textAlign: 'center' }}>
              <Button size="large" type="primary" onClick={this.gotoImportOnline}  >线上培训情况录入</Button>
            </div>
            :
            null
        }
        <br /><br />
        <br /><br />
        {
          userRole === '1' || userRole === '2'
            ?
            <div style={{ textAlign: 'center' }}>
              <Button size="large" type="primary" onClick={this.gotoImportExam}  >认证考试情况录入</Button>
            </div>
            :
            null
        }
        <br /><br />
        <br /><br />

        {/**/}
        <Modal
          title="培训申请类型"
          visible={this.state.createClassApplyVisible}
          onOk={this.handleClassApplyOk}
          onCancel={this.handleClassApplyCancel}
          width={'30%'}
        >
          {
            userRole === '3'
              ?
              <div>
                <Select size="large" style={{ width: '80%' }} defaultValue="请选择培训申请类型" onChange={this.createTrainApply}>
                  <Option value="external_and_certification">外训-外派培训</Option>
                  <Option value="internal_ingroup_insystem">内训-参加集团或分子公司培训</Option>

                  <Option value="internal_own_teacher">内训-自有内训师培训</Option>
                  <Option value="internal_external_teacher">内训-外聘讲师培训</Option>
                  <Option value="train_class_course_apply">培训班申请</Option>
                </Select>
              </div>
              :
              <div>
                <Select size="large" style={{ width: '80%' }} defaultValue="请选择培训申请类型" onChange={this.createTrainApply}>
                  <Option value="external_and_certification">外训-外派培训</Option>
                  <Option value="internal_ingroup_insystem">内训-参加集团或分子公司培训</Option>
                  <Option value="internal_own_teacher">内训-自有内训师培训</Option>
                  <Option value="internal_external_teacher">内训-外聘讲师培训</Option>
                  <Option value="train_class_course_apply">培训班申请</Option>
                </Select>
              </div>
          }
        </Modal>

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
export default connect(mapStateToProps)(train_index);


