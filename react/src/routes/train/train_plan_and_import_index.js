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
import Style from "../labor/staffLeave/index.less";

const Option = Select.Option;

class train_plan_and_import_index extends Component {
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
      BranchAndDepartmentVisible: false,
      //创建类型标志
      trainPlanType: false,
      trainApplyName: "",
      //删除标志
      deleteFlag: '',
      //创建标志
      createVisible: false,
    }
  }

  gotoClaim = () => {
    const { dispatch } = this.props;

    dispatch(routerRedux.push({
      pathname: '/humanApp/train/trainPlanAndImport/claim_class',
    }));
  };

  gotoExamChecklist = () => {
    const { dispatch } = this.props;

    dispatch(routerRedux.push({
      pathname: '/humanApp/train/trainPlanAndImport/exam_checklist',
    }));
  };

  //根据登陆用户身份确定可以创建的培训类型：判断身份进入不同的modal。
  //用户身份：总院人力接口人（提交全院计划和总院人力部门计划）、分院人力接口人（提交分院计划和分院人力部门计划）、部门接口人（提交部门计划）
  createNewTrainPlanApplyType = () => {
    const userRoleData = this.props.userRoleData;
    let roleFlag = '';
    let centerFlag = '';

    //人力接口人：返回的dept_id有2条，有可能是总院人力接口人，也可能是分院人力接口人，依据dept_id判断
    if (userRoleData.length > 0) {
      //总院人力接口人：总院ouid写死为总院ouid，判断是否是总院人力部门、其余分院及部门公用一个
      for (let i = 0; i < userRoleData.length; i++) {
        if (userRoleData[i].dept_id === 'e65c02c2179e11e6880d008cfa0427c4') {
          centerFlag = '1';
          break;
        }
      }
      if (centerFlag === '1') {
        roleFlag = '1';
      }
      else {
        roleFlag = '2';
      }
    }

    //总院人力接口人
    if (roleFlag === '1') {
      this.setState({
        GeneralVisible: true,
      });
    } else
      //分院、部门人力接口人
      if (roleFlag === '2') {
        this.setState({
          BranchAndDepartmentVisible: true,
        });
      }
      else {
        this.setState({
          createVisible: true,
        })
      }
  };

  handleCreateOk = () => {
    this.setState({
      createVisible: false,
    })
  };

  handleCreateCancel = () => {
    this.setState({
      createVisible: false,
    })
  };

  createGeneral = (value) => {
    this.setState({
      trainPlanType: value,
    });
    if (value === 'general_compulsory_train_plan') {
      this.setState({
        trainApplyName: '',
      });
    }
    if (value === 'general_elective_train_plan') {
      this.setState({
        trainApplyName: '',
      });
    }
    if (value === 'branch_department_train') {
      this.setState({
        trainApplyName: '适用于核心培训班、分院及部门级培训计划',
      });
    }
    if (value === 'train_certification') {
      this.setState({
        trainApplyName: '',
      });
    }
  };

  createBranchAndDepartment = (value) => {
    this.setState({
      trainPlanType: value,
    });
    if (value === 'general_compulsory_train_plan') {
      this.setState({
        trainApplyName: '',
      });
    }
    if (value === 'general_elective_train_plan') {
      this.setState({
        trainApplyName: '',
      });
    }
    if (value === 'branch_department_train') {
      this.setState({
        trainApplyName: '适用于核心培训班、分院及部门级培训计划',
      });
    }
    if (value === 'train_certification') {
      this.setState({
        trainApplyName: '',
      });
    }
  };

  //总院人力接口人提交
  handleGeneralOk = () => {
    const { dispatch } = this.props;
    this.setState({
      GeneralVisible: false,
    });
    let param = {
      trainPlanType: this.state.trainPlanType,
    };
    if (!param.trainPlanType) {
      message.error('请选择导入培训计划类型！');
    }
    else {
      //总院全院级必修课培训计划
      if (this.state.trainPlanType === 'general_compulsory_train_plan') {
        dispatch(routerRedux.push({
          pathname: '/humanApp/train/trainPlanAndImport/create_general_compulsory',
          param
        }));
      }
      //总院全院级选修课培训计划
      if (this.state.trainPlanType === 'general_elective_train_plan') {
        dispatch(routerRedux.push({
          pathname: '/humanApp/train/trainPlanAndImport/create_general_elective',
          param
        }));
      }
      //分院-部门通用
      if (this.state.trainPlanType === 'branch_department_train') {
        dispatch(routerRedux.push({
          pathname: '/humanApp/train/trainPlanAndImport/create_branch_department',
          param
        }));
      }
      //认证考试计划
      if (this.state.trainPlanType === 'train_certification') {
        dispatch(routerRedux.push({
          pathname: '/humanApp/train/trainPlanAndImport/create_certification',
          param
        }));
      }
    }

  };
  //分院、部门接口人提交
  handleBranchAndDepartmentOk = () => {
    const { dispatch } = this.props;
    this.setState({
      BranchAndDepartmentVisible: false,
    });
    let param = {
      trainPlanType: this.state.trainPlanType,
    };
    if (!param.trainPlanType) {
      message.error('请选择导入培训计划类型！');
    }
    else {
      //分院-部门通用
      if (this.state.trainPlanType === 'branch_department_train') {
        dispatch(routerRedux.push({
          pathname: '/humanApp/train/trainPlanAndImport/create_branch_department',
          param
        }));
      }
      //认证考试计划
      if (this.state.trainPlanType === 'train_certification') {
        dispatch(routerRedux.push({
          pathname: '/humanApp/train/trainPlanAndImport/create_certification',
          param
        }));
      }
    }
  };

  //总院人力接口人取消
  handleGeneralCancel = () => {
    this.setState({
      GeneralVisible: false,
    });
  };
  //分院人力接口人取消
  handleBranchAndDepartmentCancel = () => {
    this.setState({
      BranchAndDepartmentVisible: false,
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

    return (
      <div style={sectionStyle}>
        <br /><br />
        <br /><br />
        <div style={{ textAlign: 'center' }}>
          <Button size="large" type="primary" onClick={this.createNewTrainPlanApplyType}  >导入培训计划</Button>
        </div>
        <br /><br />
        <br /><br />
        <div style={{ textAlign: 'center' }}>
          <Button size="large" type="primary" height={'100px'} onClick={this.gotoExamChecklist} >导入认证考试清单</Button>
        </div>
        <br /><br />
        <br /><br />
        <div style={{ textAlign: 'center' }}>
          <Button size="large" type="primary" height={'100px'} onClick={this.gotoClaim} >全院级培训计划落地</Button>
        </div>
        <br /><br />
        <br /><br />

        <Modal
          title="请注意！"
          visible={this.state.createVisible}
          onOk={this.handleCreateOk}
          onCancel={this.handleCreateCancel}
        >
          <p className={Style.row}> <h3>非培训接口人不可创建培训审批计划，请知晓。</h3></p>
        </Modal>

        {/*总院人力资源部*/}
        <Modal
          title="培训计划模板类型"
          visible={this.state.GeneralVisible}
          onOk={this.handleGeneralOk}
          onCancel={this.handleGeneralCancel}
        >
          <div>
            <Select size="large" style={{ width: 200 }} defaultValue="请选择培训计划类型" onChange={this.createGeneral}>
              <Option value="general_compulsory_train_plan">全院级（必修课）培训计划</Option>
              <Option value="general_elective_train_plan">全院级（选修课）培训计划</Option>
              <Option value="branch_department_train">通用课程培训计划</Option>
              <Option value="train_certification">认证考试计划</Option>
            </Select>
            <div><center> {this.state.trainApplyName}</center></div>
          </div>
        </Modal>
        {/*分院、部门培训*/}
        <Modal
          title="培训计划模板类型"
          visible={this.state.BranchAndDepartmentVisible}
          onOk={this.handleBranchAndDepartmentOk}
          onCancel={this.handleBranchAndDepartmentCancel}
        >
          <div>
            <Select size="large" style={{ width: 200 }} defaultValue="请选择培训计划类型" onChange={this.createBranchAndDepartment}>
              <Option value="branch_department_train">通用培训计划</Option>
              <Option value="train_certification">认证考试计划</Option>
            </Select>
            <div><center> {this.state.trainApplyName}</center></div>
          </div>
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
export default connect(mapStateToProps)(train_plan_and_import_index);


