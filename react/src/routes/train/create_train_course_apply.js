/**
 * 文件说明：创建培训班培训申请
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-06-14
 */
import React from 'react';
import { Form, Row, Col, Input, Button, DatePicker, Select, Modal, Icon, message, Card, Radio } from 'antd';
import Cookie from "js-cookie";
import { routerRedux } from "dva/router";
import { connect } from "dva";
import styles from "../overtime/style.less";
import UpFileApply from "./upFileApply";

import { Tree } from 'antd';
const { TreeNode } = Tree;

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

class CreateTrainCourseApply extends React.Component {
  constructor(props) {
    super(props);
    let user_name = Cookie.get('username');
    let user_id = Cookie.get('userid');
    let dept_id = Cookie.get('dept_id');
    let dept_name = Cookie.get('dept_name');
    this.state = {
      visible: false,
      staff_name: user_name,
      dept_name: dept_name,
      user_id: user_id,
      dept_id: dept_id,
      isSubmitClickable: true,
      isSaveClickable: true,
      leave_apply_id_save: '',
      planValue: 0,
      personFlag: false,
      trainStartTime: '',
      trainEndTime: '',
      //培训课程类型
      trainClassApplyType: '',
      personVisible: false,
      personList: [],
      personString: '',
      selectPersonString: '',
      //选择的培训类型：总院选修、总院必修、通用、认证考试
      train_class_apply_type: 'compulsory',
      //选择的培训课程级别：全院级、分院级、部门级
      train_class_apply_level: '分院级',
      classInfoVisible: false,

      //选择的内训师人员
      selectTeacherString: '',
      //内训师选择模块控制
      teacherVisible: false,
      teacherString: '',
      teacherList: [],

      //新增培训班信息弹窗控制
      courseClassVisible: false,
      //哪种类型的课程，内训-参加集团或者分子公司、内训-自有内训师、内训-外请讲师
      courseClassTypeVisible: false,
      courseClassType: '',
      courseClassNum: 0,
      //预算情况
      budgetValue: '',
      //培训班信息
      courseClassDataList: [],
      //选择计划内课程，联动显示课程对应的费用预算
      train_class_id_for_fee: ''
    }
  }

  //比较日期
  diffDate(date1, date2) {
    let oDate1 = new Date(date1);
    let oDate2 = new Date(date2);
    if (oDate1.getTime() > oDate2.getTime()) {
      return true;
    } else {
      return false;
    }
  };

  //比较子课程日期
  diffDateClass(date) {
    let oDate = new Date(date);
    let oDate1 = new Date(this.state.trainStartTime);
    let oDate2 = new Date(this.state.trainEndTime);
    if (!this.state.trainStartTime || !this.state.trainEndTime) {
      return true;
    } else if ((oDate.getTime() > oDate2.getTime()) || (oDate.getTime() < oDate1.getTime())) {
      return true;
    } else {
      return false;
    }
  };


  //当前时间
  getCurrentDate() {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    return `${year}-${month < 10 ? `0${month}` : `${month}`}-${date < 10 ? `0${date}` : `${date}`}`
  };

  //点击提交按钮弹框显示选择下一处理人
  selectNext = () => {
    let trainClassData = this.state.trainClassData;
    this.setState({
      isSubmitClickable: false
    });
    let formData = this.props.form.getFieldsValue();
    if (formData.mobilePhone === '' || formData.mobilePhone === null || formData.mobilePhone === undefined) {
      message.error("请输入创建人联系方式！");
      this.setState({
        isSubmitClickable: true
      });
      return;
    }
    if (formData.trainPlace === '' || formData.trainPlace === null || formData.trainPlace === undefined) {
      message.error("请填写培训地点！");
      this.setState({
        isSubmitClickable: true
      });
      return;
    }
    if (formData.trainTarget === '' || formData.trainTarget === null || formData.trainTarget === undefined) {
      message.error("请填写培训目标！");
      this.setState({
        isSubmitClickable: true
      });
      return;
    }
    if (formData.trainClassTypeIn === '' || formData.trainClassTypeIn === null || formData.trainClassTypeIn === undefined) {
      message.error("请选择培训班类型！");
      this.setState({
        isSubmitClickable: true
      });
      return;
    }
    if (formData.trainClassSelect === '' || formData.trainClassSelect === null || formData.trainClassSelect === undefined) {
      message.error("请选择培训班！");
      this.setState({
        isSubmitClickable: true
      });
      return;
    }
    if (formData.reasonAndRequire === '' || formData.reasonAndRequire === null || formData.reasonAndRequire === undefined) {
      message.error("申请原因及培训需求！");
      this.setState({
        isSubmitClickable: true
      });
      return;
    }
    if (formData.trainFee === '' || formData.trainFee === null || formData.trainFee === undefined) {
      message.error("培训费用预算！");
      this.setState({
        isSubmitClickable: true
      });
      return;
    }
    if (formData.trainClassPersonNumOut === '' || formData.trainClassPersonNumOut === null || formData.trainClassPersonNumOut === undefined) {
      message.error("计划培训人数：！");
      this.setState({
        isSubmitClickable: true
      });
      return;
    }
    if (formData.trainPersonInput === '' || formData.trainPersonInput === null || formData.trainPersonInput === undefined) {
      message.error("拟参加人员");
      this.setState({
        isSubmitClickable: true
      });
      return;
    }
    if (!this.state.courseClassDataList || this.state.courseClassDataList.length === 0) {
      message.error("请添加培训班子课程！");
      this.setState({
        isSubmitClickable: true
      });
      return;
    }
    const trainStartTime = this.state.trainStartTime;
    const trainEndTime = this.state.trainEndTime;
    let currentDate = this.getCurrentDate();

    if (trainStartTime && trainEndTime) {
      //培训开始日期不能小于结束日期
      if (this.diffDate(currentDate, trainStartTime)) {
        message.error('培训开始日期不能小于当前日期');
        this.setState({ isSubmitClickable: true });
        return;
      }
      if (this.state.planValue === 0) {
        let planFee = '';
        if (trainClassData && trainClassData[0]) {
          for (let i = 0; i < trainClassData.length; i++) {
            if (trainClassData[i].train_class_id === this.state.train_class_id_for_fee) {
              planFee = trainClassData[i].train_fee;
              break;
            }
          }
        }

        if (planFee < formData.trainFee) {
          message.error('培训申请的培训班费用预算不得大于计划内该培训班的预计费用！');
          this.setState({ isSubmitClickable: true });
          return;
        }

        let planCourseFee = 0;
        let courseData = this.state.courseClassDataList;
        if (courseData && courseData.length > 0) {
          for (let i = 0; i < courseData.length; i++) {
            planCourseFee = parseInt(planCourseFee, 10) + parseInt(courseData[i].arg_course_fee, 10);
          }
        }

        if (planFee < planCourseFee || formData.trainFee < planCourseFee) {
          message.error('培训班子课程所有费用之和不得大于计划内该培训班的预计费用，且不得大于申请的预计费用！');
          this.setState({ isSubmitClickable: true });
          return;
        }
      }
      this.setState({
        visible: true,
      });
    }
  };

  //结束关闭
  goBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/train/train_indiex'
    }));
  };

  //提交培训申请申请信息
  handleOk = () => {
    this.setState({
      visible: false,
    });
    const { dispatch } = this.props;
    let formData = this.props.form.getFieldsValue();

    const trainStartTime = this.state.trainStartTime;
    const trainEndTime = this.state.trainEndTime;
    let currentDate = this.getCurrentDate();

    if (trainStartTime && trainEndTime) {
      //培训开始日期不能小于结束日期
      if (this.diffDate(currentDate, trainStartTime)) {
        message.error('培训开始日期不能小于当前日期');
        this.setState({ isSubmitClickable: true });
        return;
      } else {
        //执行保存
        /*封装基本信息，即train_class_apply表数据 begin */
        let basicApplyData = {};
        //封装培训课程信息传给后台
        basicApplyData["arg_create_person_id"] = this.state.user_id;
        basicApplyData["arg_create_person_name"] = formData.staff_name;
        basicApplyData["arg_create_person_dept_id"] = this.state.dept_id;
        basicApplyData["arg_create_person_dept_name"] = formData.dept_name;
        basicApplyData["arg_is_out_of_plan"] = '0';
        basicApplyData["arg_mobile_phone"] = formData.mobilePhone;
        basicApplyData["arg_train_start_time"] = trainStartTime;
        basicApplyData["arg_train_end_time"] = trainEndTime;
        basicApplyData["arg_train_place"] = formData.trainPlace;
        basicApplyData["arg_train_target"] = formData.trainTarget;
        basicApplyData["arg_train_remark"] = formData.trainRemark;

        basicApplyData["arg_train_class_type"] = formData.trainClassTypeIn;
        basicApplyData["arg_train_class_name"] = formData.trainClassSelect;
        basicApplyData["arg_train_reason_and_require"] = formData.reasonAndRequire;
        basicApplyData["arg_train_fee"] = formData.trainFee;
        basicApplyData["arg_train_class_person_num"] = formData.trainClassPersonNumOut;
        basicApplyData["arg_train_person_name"] = formData.trainPersonInput;

        //添加附件文件信息
        basicApplyData["arg_pf_url"] = this.props.pf_url;
        basicApplyData["arg_file_relative_path"] = this.props.file_relative_path;
        basicApplyData["arg_file_name"] = this.props.file_name;

        basicApplyData["arg_state"] = '1';
        basicApplyData["arg_create_time"] = this.getCurrentDate();
        basicApplyData["arg_next_step_person"] = formData.nextStepPerson;
        //培训申请类型
        basicApplyData["arg_train_apply_type"] = '5';

        /*封装基本信息，即train_class_apply表数据 end */
        let courseClassDataList = this.state.courseClassDataList;
        return new Promise((resolve) => {
          dispatch({
            type: 'createApplyModel/trainCourseClassSubmit',
            basicApplyData,
            courseClassDataList,
            resolve
          });
        }).then((resolve) => {
          if (resolve === 'success') {
            message.info("提交成功！");
            this.setState({ isSubmitClickable: true });
            setTimeout(() => {
              dispatch(routerRedux.push({
                pathname: '/humanApp/train/train_do'
              }));
            }, 500);
          }
          if (resolve === 'false') {
            this.setState({ isSubmitClickable: true });
            setTimeout(() => {
              dispatch(routerRedux.push({
                pathname: '/humanApp/train/train_do'
              }));
            }, 500);
          }
        }).catch(() => {
          dispatch(routerRedux.push({
            pathname: '/humanApp/train/train_do'
          }));
        });
      }
    } else {
      message.error('请选择培训日期');
      return;
    }
  };
  //选择下一环节处理人，取消
  handleCancel = (e) => {
    this.setState({
      visible: false,
      isSubmitClickable: true
    });
  };

  //选择参与人员确定
  handlePersonOk = () => {
    this.setState({
      selectPersonString: this.state.personString,
      personVisible: false,
    });
  };

  //选择参与人员结束
  handlePersonCancel = () => {
    this.setState({
      personVisible: false,
    });
  };

  //选择内训师人员确定
  handleTeacherOk = () => {
    this.setState({
      selectTeacherString: this.state.teacherString,
      teacherVisible: false,
    });
  };

  //选择内训师人员结束
  handleTeacherCancel = () => {
    this.setState({
      teacherVisible: false,
    });
  };

  //添加选择内训师
  onTeacherCheck = (checkedKeys, info) => {
    this.setState({
      teacherList: [],
    });
    let selperson = '';
    let personListTemp = [];
    for (let i = 0; i < info.checkedNodes.length; i++) {
      if (info.checkedNodes[i].props.children === null || info.checkedNodes[i].props.children === '' || info.checkedNodes[i].props.children === undefined) {
        let person = { personname: info.checkedNodes[i].props.title.split('-')[1] };
        personListTemp.push(person);
        selperson = selperson + '  (' + (i + 1) + ')' + info.checkedNodes[i].props.title;
      }
    }
    this.setState({
      teacherList: personListTemp,
    })
    this.state.teacherString = selperson;
  };


  //选择内训师，多选，人员数据为全院
  teacherSelect = () => {
    this.setState({
      teacherVisible: true,
    });
  };

  //添加选择人员
  onCheck = (checkedKeys, info) => {
    this.setState({
      personList: [],
    });
    let selperson = '';
    let personListTemp = [];
    for (let i = 0; i < info.checkedNodes.length; i++) {
      if (info.checkedNodes[i].props.children === null || info.checkedNodes[i].props.children === '' || info.checkedNodes[i].props.children === undefined) {
        let person = { personname: info.checkedNodes[i].props.title.split('-')[1] };
        personListTemp.push(person);
        selperson = selperson + '  (' + (i + 1) + ')' + info.checkedNodes[i].props.title;
      }
    }
    this.setState({
      personList: personListTemp,
    })
    this.state.personString = selperson;

  };

  //是否是计划内培训，单选，默认计划内
  planChange = e => {
    this.setState({
      planValue: e.target.value,
    });
  };

  //选择参加人员，多选，人员数据为本院，按照部门展示
  personChange = () => {
    this.setState({
      personVisible: true,
    });
  };

  //选择日期
  selectDate = (date, dateString) => {
    this.setState({
      trainStartTime: dateString[0],
      trainEndTime: dateString[1],
    })
  };

  //选择创建课程的级别
  applyClassLevel = (value) => {
    this.setState({
      train_class_apply_level: value,
    })
  };

  //选择创建的类型
  applyClassType = (value) => {
    const { dispatch } = this.props;

    this.setState({
      train_class_apply_type: value,
    })

    let queryParam = {
      arg_user_id: Cookie.get('userid'),
      arg_train_type: value,
      arg_train_class_type: "培训班",
    };
    return new Promise((resolve) => {
      dispatch({
        //全院级必修课保存
        type: 'createApplyModel/queryTrainClassForApply',
        queryParam,
        resolve
      });
    }).then((resolve) => {
      if (resolve === 'success') {
        this.setState({
          trainClassData: this.props.trainClassData ? this.props.trainClassData : [],
          train_class_id_for_fee: this.props.trainClassData && this.props.trainClassData[0] ? this.props.trainClassData[0].train_class_id : '',
        })
      }
      if (resolve === 'false') {
        this.setState({
          trainClassData: [],
          train_class_id_for_fee: '',
        })
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname: '/humanApp/train/train_do/create_train_apply'
      }));
    });
  };

  //选择课程联动课程费用
  choiseClass = (value) => {
    this.setState({
      train_class_id_for_fee: value,
    })
  };

  /* 计划外培训班，新增所使用的函数  begin*/
  //选择创建的类型
  choiseCourseType = (value) => {
    this.setState({
      train_class_apply_type: value,
    })
  };

  //弹窗确定
  courseClassOk = () => {
    this.setState({
      courseClassVisible: false,
    });
    let formData = this.props.form.getFieldsValue();

    //判断填写内容
    // trainTeacherInput
    // 培训课程名称：trainClassInput
    if (this.state.courseClassType !== '2') {
      if (formData.trainTeacherInput === '' || formData.trainTeacherInput === null || formData.trainTeacherInput === undefined) {
        message.error("请填写培训师！");
      }
    } else {
      if (!this.state.selectTeacherString) {
        message.error("请选择培训师！");
      }
    }

    if (formData.trainClassInput === '' || formData.trainClassInput === null || formData.trainClassInput === undefined) {
      message.error("请填写培训课程名称");
    }
    if (formData.teacherTrainTime === '' || formData.teacherTrainTime === null || formData.teacherTrainTime === undefined) {
      message.error("请填写培训时间");
    }
    if (formData.teacherTrainHour === '' || formData.teacherTrainHour === null || formData.teacherTrainHour === undefined) {
      message.error("请填写培训时长(小时)");
    }
    if (formData.trainCourseFee === '' || formData.trainCourseFee === null || formData.trainCourseFee === undefined) {
      message.error("请填写子课程培训预计费用(元)");
    }

    // 判断是否在培训班培训时间区间范围内
    if (this.diffDateClass(formData.teacherTrainTime.format("YYYY-MM-DD"))) {
      message.error('子课程的培训日期要在培训班培训日期范围内,您选择的日期不在培训时间范围内');
      this.props.form.resetFields(['trainTeacherInput', 'trainClassInput', 'teacherTrainTime', 'teacherTrainHour'], []);
    } else {
      let train_teacher = '';
      if (this.state.courseClassType === '2') {
        if (this.state.teacherList.length > 1) {
          message.info("请对每门课程选择一位培训师！");
          return;
        } else {
          train_teacher = this.state.teacherList[0].personname;
        }
      } else {
        train_teacher = formData.trainTeacherInput;
      }

      let classData = {
        arg_train_teacher_input: train_teacher,
        arg_train_class_input: formData.trainClassInput,
        arg_train_class_apply_type: this.state.courseClassType,
        arg_train_time: formData.teacherTrainTime.format("YYYY-MM-DD"),
        arg_train_hour: formData.teacherTrainHour,
        arg_course_fee: formData.trainCourseFee,
        arg_class_id: this.state.user_id + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32),
      };

      this.state.courseClassDataList.push(classData);
      this.props.form.resetFields(['trainTeacherInput', 'trainClassInput', 'teacherTrainTime', 'teacherTrainHour', 'trainCourseFee'], []);
    }
  };

  //弹窗取消
  courseClassCancel = () => {
    this.setState({
      courseClassVisible: false,
    });
  };

  //新增课程
  addClass = () => {
    //哪种类型的课程，内训-参加集团或者分子公司、内训-自有内训师、内训-外请讲师
    this.setState({
      courseClassTypeVisible: true,
    });
  };

  //新增课程类型选择-OK
  handleCourseClassTypeOk = () => {
    let formData = this.props.form.getFieldsValue();
    if (formData.courseClassType === '' || formData.courseClassType === null || formData.courseClassType === undefined) {
      message.error("请选择培训班子课程的培训课程类型！");
      return;
    } else {
      //哪种类型的课程，1:内训-参加集团或者分子公司、2:内训-自有内训师、3:内训-外请讲师
      this.setState({
        courseClassType: formData.courseClassType,
        courseClassTypeVisible: false,
        courseClassVisible: true,
      });
    }
  };

  //新增课程类型选择-取消
  handleCourseClassTypeCancel = () => {
    this.setState({
      courseClassTypeVisible: false,
    });
  };

  //跳转到培训申请界面
  goToApplyPlan = () => {
    const { dispatch } = this.props;
    const userRoleData = this.props.permission;

    //总院人力接口人
    if (userRoleData === '2') {
      dispatch(routerRedux.push({
        pathname: '/humanApp/train/trainPlanList',
      }));
    }
    else {
      message.info("您不具备申请新的培训计划的权限，请咨询本院培训人力接口人！");
      return;
    }
  };

  //预算情况单选
  budgetChange = e => {
    this.setState({
      budgetValue: e.target.value,
    });
  };

  //删除子课程
  deleteClass = (class_id) => {
    let courseClassDataListTemp = this.state.courseClassDataList;
    //哪种类型的课程，内训-参加集团或者分子公司、内训-自有内训师、内训-外请讲师
    confirm({
      title: '确定要删除此子课程吗?',
      content: '培训课程子课程',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        //删除操作
        for (let i = 0; i < courseClassDataListTemp.length; i++) {
          if (courseClassDataListTemp[i].arg_class_id === class_id) {
            courseClassDataListTemp.splice(i, 1);
            break;
          }
        }
        this.setState({
          courseClassDataList: courseClassDataListTemp
        });
      },
      onCancel() { },
    });
  };

  /* 计划外培训班，新增所使用的函数  end*/

  render() {
    const inputstyle = { color: '#000' };
    const { person_list } = this.props;
    let personListDate = person_list.map(item => {
      let deptdate;
      if (item.tree_num === '0' || item.tree_num === 0) {
        deptdate = item.list.map(item2 => {
          let personlistdate;
          if (item2.tree_num === '1' || item2.tree_num === 1) {
            personlistdate = item2.list.map(item3 => {
              return (<TreeNode title={item3.key_name} key={item3.key_num} />)
            })
          }
          return (
            <TreeNode title={item2.key_name} key={item2.key_num}>
              {personlistdate}
            </TreeNode>
          )
        })
      }
      return (
        <TreeNode title={item.key_name} key={item.key_num}>
          {deptdate}
        </TreeNode>
      )
    }
    );

    //附件信息
    let fileList = [];
    let name = '';
    let url = '';

    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    const formItemLayout2 = {
      labelCol: {
        sm: { span: 14 },
      },
      wrapperCol: {
        md: { span: 7 },//input框长度
      },
    };
    const formItemLayout3 = {
      labelCol: {
        sm: { span: 3 },
      },
      wrapperCol: {
        md: { span: 7 },//input框长度
      },
    };

    //选择一下处理人信息
    let nextDataList = this.props.nextDataList;
    //下一环节名称
    let nextPostName = '';
    //下一环节处理人
    let initPerson = '';
    let nextPersonList = null;
    if (nextDataList !== undefined) {
      if (nextDataList.length > 0) {
        initPerson = nextDataList[0].submit_user_id;
        nextPostName = nextDataList[0].submit_post_name;
      }
      nextPersonList = nextDataList.map(item =>
        <Option value={item.submit_user_id} >{item.submit_user_name}</Option>
      );
    }

    //培训课程
    let trainClassData = this.state.trainClassData;
    let inPlanClassList = null;
    let inPlanClassFeeList = null;
    let initClassID = '';
    if (trainClassData !== undefined) {
      if (trainClassData.length > 0) {
        initClassID = trainClassData[0].train_class_id;
      }
      inPlanClassList = trainClassData.map(item =>
        <Option value={item.train_class_id}>{item.class_name}</Option>
      );
      inPlanClassFeeList = trainClassData.map(item =>
        <Option value={item.train_class_id}>{item.train_fee}</Option>
      );
    }

    //添加的子课程信息
    let CourseClassInfo = '';
    const courseClassDataList = this.state.courseClassDataList;
    if (courseClassDataList.length > 0) {
      CourseClassInfo = courseClassDataList.map(item =>
        <Col span={8}>
          <Card style={{ textAlign: 'left', width: '100%' }} type="inner" extra={<Icon type="close-square" onClick={this.deleteClass.bind(this, item.arg_class_id)} />} >
            <p>子课程号：{item.arg_class_id}</p>
            <p>课程类型：{item.arg_train_class_apply_type === '1' ? '内训-参加集团及系统内培训' : (item.arg_train_class_apply_type === '2' ? '内训-自有内训师' : '内训-外请讲师')}</p>
            <p>课程名：{item.arg_train_class_input}</p>
            <p>培训师：{item.arg_train_teacher_input}</p>
            <p>培训时间：{item.arg_train_time}</p>
            <p>培训时长(小时)：{item.arg_train_hour}</p>
            <p>子课程培训费用：{item.arg_course_fee}</p>
          </Card>
        </Col>
      );
    } else {
      CourseClassInfo = '';
    }

    return (
      <div>
        <Row span={2} style={{ textAlign: 'center' }}><h1>培训班申请表</h1></Row>
        <br /><br />
        <Form>
          <Card title="培训班申请信息" className={styles.r}>
            {/* 申请人信息 */}
            <Row gutter={12} >
              {/*姓名*/}
              <Col span={12} style={{ display: 'block' }}>
                <FormItem label={'申请人'} {...formItemLayout2}>
                  {getFieldDecorator('staff_name', {
                    initialValue: this.state.staff_name
                  })(<Input style={inputstyle} placeholder='' disabled={true} />)}
                </FormItem>
              </Col>
              {/*部门*/}
              <Col span={12} style={{ display: 'block' }}>
                <FormItem label={'部门'} {...formItemLayout3}>
                  {getFieldDecorator('dept_name', {
                    initialValue: this.state.dept_name
                  })(<Input style={inputstyle} placeholder='' disabled={true} />)}
                </FormItem>
              </Col>
            </Row>

            {/*创建人联系方式*/}
            <Row style={{ textAlign: 'center' }}>
              {/*联系方式*/}
              <FormItem label="联系方式" hasFeedback {...formItemLayout}>
                {getFieldDecorator('mobilePhone', {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                      pattern: /^1[3456789]\d{9}$/,
                      message: "输入手机号不合法！",
                    },
                  ],
                })(<Input placeholder="您的常用手机号（11位）" />)}
              </FormItem>
            </Row>

            {/*是否是计划内培训班*/}
            <Row style={{ textAlign: 'left' }}>
              <FormItem label="是否是计划内培训班：" hasFeedback {...formItemLayout}>
                <Radio.Group onChange={this.planChange} value={this.state.planValue}>
                  <Radio.Button value={0}>是</Radio.Button>
                  <Radio.Button value={1}>否</Radio.Button>
                </Radio.Group>
              </FormItem>
            </Row>

                  {
              this.state.planValue === 0 ?
                <div>
                  {/* 培训课程 */}
                  <Row style={{ textAlign: 'center' }}>
                    <FormItem label="请选择培训班类型" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('trainClassTypeIn', {
                        initialValue: '',
                        rules: [
                          {
                            required: true,
                            message: '请选择培训班类型'
                          },
                        ],
                      })(
                        <Select placeholder="请选择培训班类型" initialValue={'compulsory'} disabled={false} onChange={this.applyClassType.bind(this)}>
                          <Option value="compulsory">全院级必修课程培训班</Option>
                          <Option value="elective">全院级选修课程培训班</Option>
                          <Option value="common1">全院级-其他培训计划</Option>
                          <Option value="common2">分院级培训计划</Option>
                          <Option value="common3">部门级培训计划</Option>
                        </Select>
                      )}
                    </FormItem>
                    <Col >
                      <FormItem label="培训班" {...formItemLayout} >
                        {getFieldDecorator('trainClassSelect', {
                          initialValue: initClassID,
                          rules: [
                            {
                              required: true,
                              message: '请选择培训班'
                            },
                          ],
                        })(
                          // 如果是计划内查询出能申请的培训班，如果是计划外，则手动添加多个课程
                          <Select placeholder="请选择培训课程" disabled={false} onChange={this.choiseClass.bind(this)}>
                            {inPlanClassList}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col >
                      <FormItem label="培训班费用" {...formItemLayout} >
                        {getFieldDecorator('trainClassSelectFee', {
                          initialValue: this.state.train_class_id_for_fee,
                          rules: [
                            {
                              required: true,
                              message: '培训班费用(元)'
                            },
                          ],
                        })(
                          <Select placeholder="培训班费用" disabled={true} >
                            {inPlanClassFeeList}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>

                  {/*申请原因及培训需求*/}
                  <Row style={{ textAlign: 'center' }}>
                    <FormItem label="申请原因及培训需求" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('reasonAndRequire', {
                        initialValue: '',
                        rules: [
                          {
                            required: true,
                            message: '请填写申请原因及培训需求'
                          },
                        ],
                      })(
                        <TextArea
                          style={{ minHeight: 32 }}
                          placeholder="申请原因及培训需求"
                          rows={4}
                          disabled={false}
                        />
                      )}
                    </FormItem>
                  </Row>

                  {/*培训费用预算*/}
                  <Row style={{ textAlign: 'center' }}>
                    <FormItem label="培训费用预算" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('trainFee', {
                        initialValue: '',
                        rules: [
                          {
                            required: true,
                            pattern: /^([0-9][0-9]*)+(.[0-9]{1,2})?$/,
                            message: '请填写正确格式（整数或者最多2位小数）的培训费用预算（元）'
                          },
                        ],
                      })(
                        <Input placeholder="培训费用预算(元)" />
                      )}
                    </FormItem>
                  </Row>
                  
                  {/*培训时间*/}
              <Row style={{ textAlign: 'center' }}>
              <FormItem label={'培训时间'} {...formItemLayout}>
              {getFieldDecorator('train_time', {
              rules: [
                {
                  required: true,
                  message: '请选择起止日期',
                },
              ],
            })(  <RangePicker
              style={{ width: '100%' }}
              disabled={false}
              onChange={this.selectDate}
            />)
          }
          </FormItem>
          </Row>

                  {/*培训地点*/}
                  <Row style={{ textAlign: 'center' }}>
                    <FormItem label="培训地点" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('trainPlace', {
                        initialValue: '',
                        rules: [
                          {
                            required: true,
                            message: '请填写培训地点'
                          },
                        ],
                      })(
                        <Input placeholder="培训地点" />
                      )}
                    </FormItem>
                  </Row>

                  {/*培训目标（如有证书请注明）*/}
                  <Row style={{ textAlign: 'center' }}>
                    <FormItem label="培训目标" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('trainTarget', {
                        initialValue: '',
                        rules: [
                          {
                            required: true,
                            message: '请填写培训目标'
                          },
                        ],
                      })(
                        <TextArea
                          style={{ minHeight: 32 }}
                          placeholder="培训目标（如有证书请注明）"
                          rows={4}
                          disabled={false}
                        />
                      )}
                    </FormItem>
                  </Row>

                  {/* 计划培训人数 */}
                  <Row style={{ textAlign: 'center' }}>
                    <FormItem label="计划培训人数：" {...formItemLayout} >
                      {getFieldDecorator('trainClassPersonNumOut', {
                        initialValue: '',
                        rules: [
                          {
                            required: true,
                            pattern: /^([1-9][0-9]*)?$/,
                            message: '请填写正确格式（整数）的参训人数'
                          },
                        ],
                      })(
                        <Input placeholder="请输入计划外培训课程的计划培训人数" />
                      )}
                    </FormItem>
                  </Row>

                  {/*描述参加人员*/}
                  <Row style={{ textAlign: 'center' }}>
                    <FormItem label="拟参加人员" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('trainPersonInput', {
                        initialValue: '',
                        rules: [
                          {
                            required: true,
                            message: '拟参加人员'
                          },
                        ],
                      })(
                        // 如果是计划内查询出能申请的课程，如果是计划外，则手动输入
                        <TextArea
                          placeholder="拟参加人员"
                          style={{ minHeight: 32 }}
                          autosize={{ maxRows: 10 }}
                        />
                      )}
                    </FormItem>
                  </Row>
                  {/*培训备注*/}
                  <Row style={{ textAlign: 'center' }}>
                    <FormItem label="备注" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('trainRemark', {
                        initialValue: '',
                        rules: [
                          {
                            required: false,
                            message: '请填写培训备注（可不填，如有培训场地预算，请备注说明）'
                          },
                        ],
                      })(
                        <TextArea
                          style={{ minHeight: 32 }}
                          placeholder="如有培训场地预算，请备注说明"
                          rows={4}
                          disabled={false}
                        />
                      )}
                    </FormItem>
                  </Row>
                  {/* 预算情况 */}
                  {/* <Row style={{ textAlign: 'center' }}>
                  <FormItem label="预算情况：" hasFeedback {...formItemLayout}>
                    <Radio.Group onChange={this.budgetChange} value={this.state.budgetValue}>
                      <Radio value={0}>未超预算</Radio>
                      <Radio value={1}>超过预算</Radio>
                    </Radio.Group>
                  </FormItem>
                </Row> */}

                  {/*附件*/}
                  <Row style={{ textAlign: 'center' }}>
                    <FormItem label="上传附件：" hasFeedback {...formItemLayout}>
                      <UpFileApply
                        filelist={fileList}
                        name={name}
                        url={url}
                      />
                    </FormItem>
                  </Row>
                  <br />
                  <Card title="培训班子课程信息">
                    {
                      this.state.planValue === 0 ?
                        // 计划外新增选项，展示急＋新增图标
                        this.state.courseClassDataList.length > 0 ?
                          <div style={{ background: '#ECECEC', padding: '30px' }}>
                            <Row gutter={16}>
                              {CourseClassInfo}
                              <Col span={8} >
                                <Icon type="plus-square" onClick={this.addClass} style={{ fontSize: '50px', color: '#08c', verticalAlign: 'middle' }} />
                              </Col>
                            </Row>
                          </div>
                          :
                          <Row style={{ textAlign: 'center' }} gutter={16}>
                            <Col span={8} style={{ verticalAlign: 'middle' }}>
                              <Icon type="plus-square" onClick={this.addClass} style={{ fontSize: '50px', color: '#08c', verticalAlign: 'middle' }} />
                            </Col>
                          </Row>
                        :
                        null
                    }
                  </Card>
                  <br />

                  {/* 提交、返回 */}
                  <Col span={24} style={{ textAlign: 'center' }}>
                    <Button onClick={this.goBack}>{'取消'}</Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type="primary" htmlType="submit" onClick={this.selectNext} disabled={!this.state.isSubmitClickable}>{this.state.isSubmitClickable ? '提交' : '正在处理中...'}</Button>
                  </Col>
                </div>
                :
                <div>
                  <Row style={{ textAlign: 'center' }}>
                    <Button onClick={this.goToApplyPlan}>{'请先进行培训班计划申请'}</Button>
                  </Row>
                  <br />
                </div>
            }

            {/* 提交模块 */}
          </Card>
          {/* 处理流程、下一步 */}
          <Modal
            title="流程处理"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={'40%'}
          >
            <div>
              <FormItem label={'下一步环节'} {...formItemLayout}>
                <Input style={inputstyle} value={nextPostName} disabled={true} />
              </FormItem>

              <FormItem label={'下一处理人'} {...formItemLayout}>
                {getFieldDecorator('nextStepPerson', {
                  initialValue: initPerson
                })(
                  <Select size="large" style={{ width: '100%' }} initialValue={initPerson} placeholder="请选择负责人">
                    {nextPersonList}
                  </Select>
                )}
              </FormItem>
            </div>
          </Modal>

          {/* 选择参与人员 */}
          <Modal
            title="选择参与人员"
            visible={this.state.personVisible}
            onOk={this.handlePersonOk}
            onCancel={this.handlePersonCancel}
          >
            <Tree
              checkable
              onCheck={this.onCheck}
            >
              {personListDate}
            </Tree>
          </Modal>

          {/* 选择内训师 */}
          <Modal
            title="选择培训师"
            visible={this.state.teacherVisible}
            onOk={this.handleTeacherOk}
            onCancel={this.handleTeacherCancel}
          >
            <Tree
              checkable
              onCheck={this.onTeacherCheck}
            >
              {personListDate}
            </Tree>
          </Modal>

          {/* 选择培训课程类型 */}
          <Modal
            title="选择培训课程类型"
            visible={this.state.courseClassTypeVisible}
            onOk={this.handleCourseClassTypeOk}
            onCancel={this.handleCourseClassTypeCancel}
            width={'50%'}
          >
            <FormItem label="请选择培训班培训类型" hasFeedback {...formItemLayout}>
              {getFieldDecorator('courseClassType', {
                initialValue: '1',
                rules: [
                  {
                    required: true,
                    message: '请选择培训班培训类型'
                  },
                ],
              })(
                <Select placeholder="请选择培训班培训类型" initialValue={'1'} disabled={false} onChange={this.choiseCourseType.bind(this)} style={{ width: '100%' }}>
                  <Option value="1">内训-参加集团及系统内培训</Option>
                  <Option value="2">内训-自有内训师</Option>
                  <Option value="3">内训-外请讲师</Option>
                </Select>
              )}
            </FormItem>
          </Modal>

          {/* 新增计划外培训课程信息 */}
          <Modal
            title={this.state.courseClassType === '1' ? '新增培训班内部课程——内训-参加集团及系统内培训' : (this.state.courseClassType === '2' ? '新增培训班内部课程——内训-自有内训师' : '新增培训班内部课程——内训-外请讲师')}
            visible={this.state.courseClassVisible}
            onOk={this.courseClassOk}
            onCancel={this.courseClassCancel}
            width={'60%'}
            length={'80%'}
          >
            <Card title={"课程信息"}>
              {/* 计划外课程信息 */}
              <Row style={{ textAlign: 'center' }}>
                <Col >
                  <FormItem label="培训课程名称：" {...formItemLayout} >
                    {getFieldDecorator('trainClassInput', {
                      initialValue: '',
                      rules: [
                        {
                          required: true,
                          message: '请输入培训课程名称'
                        },
                      ],
                    })(
                      <Input placeholder="请输入培训课程名称" />
                    )}
                  </FormItem>

                  {
                    this.state.courseClassType === '2' ?
                      <FormItem label="选择自有内训师：" hasFeedback {...formItemLayout}>
                        <TextArea
                          placeholder={"选择1个自有培训师"}
                          style={{ minHeight: 32 }}
                          value={this.state.selectTeacherString}
                          autosize={{ maxRows: 10 }}
                          onClick={this.teacherSelect}
                        />
                      </FormItem>
                      :
                      <FormItem label="培训师：" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('trainTeacherInput', {
                          initialValue: '',
                          rules: [
                            {
                              required: true,
                              message: '请填写培训师姓名，以空格分隔！'
                            },
                          ],
                        })(
                          <TextArea
                            placeholder="请填写培训师姓名，以空格分隔！"
                            style={{ minHeight: 32 }}
                            autosize={{ maxRows: 10 }}
                          />
                        )}
                      </FormItem>
                  }
                  <FormItem label={'培训时间：'} {...formItemLayout}>
                    {getFieldDecorator('teacherTrainTime', {
                      initialValue: '',
                      rules: [
                        {
                          required: true,
                          message: '请输入培训时间'
                        },
                      ],
                    })(
                      <DatePicker
                        placeholder="培训时间"
                        style={{ width: '100%' }}
                        disabled={false}
                        format="YYYY-MM-DD"
                      />
                    )}
                  </FormItem>

                  <FormItem label="培训时长(小时)：" {...formItemLayout} >
                    {getFieldDecorator('teacherTrainHour', {
                      initialValue: '',
                      rules: [
                        {
                          required: true,
                          pattern: /^([1-9][0-9]*)+(.[0-9]{1})?$/,
                          message: '请输入培训时长((小时，6小时为1天，最多1位小数))'
                        },
                      ],
                    })(
                      <Input placeholder="请输入培训时长((小时，6小时为1天，最多1位小数))" />
                    )}
                  </FormItem>
                  <FormItem label="子课程培训预计费用：" {...formItemLayout} >
                    {getFieldDecorator('trainCourseFee', {
                      initialValue: '',
                      rules: [
                        {
                          required: true,
                          pattern: /^([1-9][0-9]*)+(.[0-9]{1,2})?$/,
                          message: '请填写正确格式（整数或者最多2位小数）的培训费用预算（元）'
                        },
                      ],
                    })(
                      <Input placeholder="子课程培训费用预算(元)" />
                    )}
                  </FormItem>
                </Col>
              </Row>

            </Card>
          </Modal>
        </Form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.createApplyModel,
    ...state.createApplyModel,
  };
}

CreateTrainCourseApply = Form.create()(CreateTrainCourseApply);
export default connect(mapStateToProps)(CreateTrainCourseApply)
