/**
* 作者：郭西杰
* 邮箱：guoxj116@chinaunicom.cn
* 创建日期：2020-06-28
* 文件说明：业务部门考勤统计创建
* */

import React, { Component } from 'react';
import { Button, Form, Row, Input, Card, Select, Table, DatePicker, Icon, message, Modal, Col } from 'antd';
import Excel from "../attend/Excel";

import styles from './style.less';
import { connect } from "dva";
import { routerRedux } from "dva/router";
import Cookie from "js-cookie";
import moment from 'moment';
const { MonthPicker, RangePicker } = DatePicker
const FormItem = Form.Item;
const { Option } = Select;

class attend_func_apply extends Component {
  constructor(props) {
    let dept_name = Cookie.get('dept_name');

    super(props);
    this.state = {
      visible: false,
      submitFlag: true,
      attend_apply_id_save: '',
      attend_apply_id: '',
      isSaveClickable: true,
      isSubmitClickable: true,
      isSaveClickable1: true,
      isSaveClickable2: true,
      isSaveClickable3: true,
      dept_name: dept_name,
      absenceDataSource: [],
      absenceDataSourceTemp: [],
      create_person_id: '',
      create_person_name: '',
      absence_type: '',
      absence_days: '',
      absence_detail1: '',
      worktime_team_apply_id: Cookie.get("userid") + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32),
      saveControl1: false,
      saveControl2: false,
      saveControl3: false,
      saveControl4: false,
      checkDate: false,
      modelVisible: false,
    };
    this.handleAdd = this.handleAdd.bind(this);//绑定this，这个是下面声明onClick的方法，需绑定this，在onClick事件中直接用this.handleAdd即可
    this.handleDel = this.handleDel.bind(this);
    this.goBack = this.goBack.bind(this);
  }
  //获取当前日期，（左上角显示：YYYY年MM月DD日）
  getCurrentDate() {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    return `${year}年${month < 10 ? `0${month}` : `${month}`}月${date < 10 ? `0${date}` : `${date}`}日`
  };
  // 获取当前日期，（插入数据表专用：YYYY-MM-DD）
  getCurrentDate1() {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    return `${year}-${month < 10 ? `0${month}` : `${month}`}-${date < 10 ? `0${date}` : `${date}`}`
  };
  selectDate = (date, dateString) => {
    this.setState({
      attend_month: dateString,
    });
    this.setState({ checkDate: true });
    const userProjectDataList = this.props.userProjectDataList;
    const projectId1 = userProjectDataList.map(item => item.proj_name);
    const projectId = (projectId1 == null || projectId1 == '' || projectId1 == undefined) ? Cookie.get('dept_id') : projectId1[0];
    let cycle_code = dateString;
    let proj_name = this.state.dept_name;
    const { dispatch } = this.props;
    //TODO 根据条件进行查询
    dispatch({
      type: 'attend_apply_model/queryProjAbsenceInfo',
      cycle_code,
      proj_name
    });
  };
  // 关闭按钮
  goBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/attend/index'
    }))
  };
  absenceTypeSelect(record, absence_type) {
    let changePlan = this.state.absenceDataSourceTemp;
    changePlan[record.indexID]["absence_type"] = absence_type;
    this.setState({
      absenceDataSourceTemp: changePlan
    })
  };
  //删除
  handleDel(e) {
    const DelDataSource = this.state.absenceDataSourceTemp;
    let deleteIndex = e.target.getAttribute('data-index');
    if (deleteIndex != (DelDataSource.length - 1)) {
      message.error('必须自底向上逐一删除，不支持从中间删除');
      return;
    }
    DelDataSource.splice(deleteIndex, 1);
    this.setState({
      absenceDataSourceTemp: DelDataSource,
    });
    if (DelDataSource.length == 0) {
      this.setState({
        submitFlag: true,//提交按钮控制
      });
    }
  }
  onChange(e) {
    let changePlan = this.state.absenceDataSource;
    changePlan[e.target.id][e.target.name] = e.target.value;
    this.setState({
      absenceDataSource: changePlan,
    })
  }
  onChange1(e) {
    let changePlan = this.state.absenceDataSourceTemp;
    changePlan[e.target.id][e.target.name] = e.target.value;
    this.setState({
      absenceDataSourceTemp: changePlan
    })
  }
  //添加
  handleAdd() {
    const newDataSource = this.state.absenceDataSourceTemp;//将this.state.dateSource赋给newDataSource
    let l = this.state.indexValue;
    newDataSource.push({//newDataSource.push一个新的数组，这个数组直接将初始化中的数组copy过来即可
      indexID: l,
      create_person_id: this.props.create_person_id,
      create_person_name: this.props.create_person_name,
      absence_type: this.props.absence_type,
      absence_days: this.props.absence_days,
      absence_detail1: this.props.absence_detail1,
    });
    this.setState({
      indexValue: l + 1
    });
    this.setState({
      absenceDataSourceTemp: newDataSource,//将newDataSource新添加的数组给dataSource
      submitFlag: false,//提交按钮控制
    });
  }
  // 保存全勤信息
  saveInfoFullAttend = () => {
    this.setState({ isSaveClickable: false });
    this.setState({ saveControl1: true });

    const { dispatch } = this.props;
    let formData = this.props.form.getFieldsValue();
    let worktime_team_apply_id = this.state.worktime_team_apply_id;

    if (formData.attend_month) {
      formData.attend_month = formData.attend_month.format("YYYY-MM");
    }
    let cycle_code = formData.attend_month;
    let planList = this.props.fullAttendImportDataList;
    /*封装全勤，即worktime_full_person_info表数据 begin */
    let transferAttendList = [];
    planList.map((item) => {
      let planData = {
        //计划ID
        arg_worktime_team_apply_id: worktime_team_apply_id,
        //培训级别
        arg_user_id: item.user_id,
        //课程名称/方向
        arg_user_name: item.user_name,
        //受训部门-岗位
        arg_cycle_code: cycle_code,
      };
      transferAttendList.push(planData);
    });
    /*封装全勤信息 end */
    return new Promise((resolve) => {
      dispatch({
        type: 'attend_apply_model/fullAttendSave',
        transferAttendList,
        worktime_team_apply_id,
        resolve
      });
    }).then((resolve) => {
      if (resolve === 'success') {
        this.setState({ isSaveClickable: true });
      }
      if (resolve === 'false') {
        this.setState({ isSaveClickable: true });
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname: '/humanApp/attend/index',
      }));
    });
  };
  // 保存请假信息
  saveInfoabsence = () => {
    this.setState({ isSaveClickable1: false });
    this.setState({ saveControl2: true });
    const { dispatch } = this.props;
    let formData = this.props.form.getFieldsValue();
    let worktime_team_apply_id = this.state.worktime_team_apply_id;

    if (formData.attend_month) {
      formData.attend_month = formData.attend_month.format("YYYY-MM");
    }
    let cycle_code = formData.attend_month;
    let planList = this.state.absenceDataSource;
    /*封装全勤，即worktime_full_person_info表数据 begin */
    let transferAttendList = [];
    planList.map((item) => {
      let planData = {
        arg_worktime_team_apply_id: worktime_team_apply_id,
        arg_cycle_code: cycle_code,
        arg_user_id: item.create_person_id,
        arg_user_name: item.create_person_name,
        arg_absence_type: item.absence_type,
        arg_absence_days: item.absence_days,
        arg_absence_details: item.absence_detail1,
      };
      transferAttendList.push(planData);
    });
    /*封装全勤信息 end */
    return new Promise((resolve) => {
      dispatch({
        type: 'attend_apply_model/absenceSave',
        transferAttendList,
        worktime_team_apply_id,
        resolve
      });
    }).then((resolve) => {
      if (resolve === 'success') {
        this.setState({ isSaveClickable1: true });
      }
      if (resolve === 'false') {
        this.setState({ isSaveClickable1: true });
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname: '/humanApp/attend/index',
      }));
    });
  };
  // 保存出差信息
  saveInfoBusinessAttend = () => {
    this.setState({ isSaveClickable2: false });
    this.setState({ saveControl3: true });

    const { dispatch } = this.props;
    let formData = this.props.form.getFieldsValue();
    let worktime_team_apply_id = this.state.worktime_team_apply_id;

    if (formData.attend_month) {
      formData.attend_month = formData.attend_month.format("YYYY-MM");
    }
    let cycle_code = formData.attend_month;
    let planList = this.props.businessTripImportDataList;
    /*封装全勤，即worktime_full_person_info表数据 begin */
    let transferAttendList = [];
    planList.map((item) => {
      let planData = {
        arg_worktime_team_apply_id: worktime_team_apply_id,
        arg_user_id: item.user_id,
        arg_user_name: item.user_name,
        arg_cycle_code: cycle_code,
        arg_travel_days: item.travel_days,
        arg_travel_details: item.travel_details
      };
      transferAttendList.push(planData);
    });
    /*封装全勤信息 end */
    return new Promise((resolve) => {
      dispatch({
        type: 'attend_apply_model/travelAttendSave',
        transferAttendList,
        worktime_team_apply_id,
        resolve
      });
    }).then((resolve) => {
      if (resolve === 'success') {
        this.setState({ isSaveClickable2: true });
      }
      if (resolve === 'false') {
        this.setState({ isSaveClickable2: true });
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname: '/humanApp/attend/index',
      }));
    });
  };
  //保存因公出差信息
  saveInfoOutAttend = () => {
    this.setState({ isSaveClickable3: false });
    this.setState({ saveControl4: true });
    const { dispatch } = this.props;
    let formData = this.props.form.getFieldsValue();
    let worktime_team_apply_id = this.state.worktime_team_apply_id;

    if (formData.attend_month) {
      formData.attend_month = formData.attend_month.format("YYYY-MM");
    }
    let cycle_code = formData.attend_month;
    let planList = this.props.outTripImportDataList;
    /*封装全勤，即worktime_full_person_info表数据 begin */
    let transferAttendList = [];
    planList.map((item) => {
      let planData = {
        arg_worktime_team_apply_id: worktime_team_apply_id,
        arg_user_id: item.user_id,
        arg_user_name: item.user_name,
        arg_cycle_code: cycle_code,
        arg_away_days: item.away_days,
        arg_away_details: item.away_details
      };
      transferAttendList.push(planData);
    });
    /*封装全勤信息 end */
    return new Promise((resolve) => {
      dispatch({
        type: 'attend_apply_model/awayAttendSave',
        transferAttendList,
        worktime_team_apply_id,
        resolve
      });
    }).then((resolve) => {
      if (resolve === 'success') {
        this.setState({ isSaveClickable3: true });
      }
      if (resolve === 'false') {
        this.setState({ isSaveClickable3: true });
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname: '/humanApp/attend/index',
      }));
    });
  };

  // 提交信息
  handleOk = () => {
    const { nextDataList } = this.props;
    let nextpostname = '';
    if (nextDataList && nextDataList[0]) {
      if (nextDataList.length > 0) {
        nextpostname = nextDataList[0].submit_user_name;
      }
    }
    let committee_type = 'func'
    let formData = this.props.form.getFieldsValue();
    const userProjectDataList = this.props.userProjectDataList;
    const projectId1 = userProjectDataList.map(item => item.proj_id);
    const projectId = (projectId1 == null || projectId1 == '' || projectId1 == undefined) ? Cookie.get('dept_id') : projectId1[0];

    this.setState({ isSubmitClickable: false });
    this.setState({
      visible: false,
    });
    const { dispatch } = this.props;

    //月份
    if (formData.attend_month) {
      formData.attend_month = formData.attend_month.format("YYYY-MM");
    }

    /*封装基本信息，即apply表数据*/
    let basicInfoData = {};
    let worktime_team_apply_id = this.state.worktime_team_apply_id;

    basicInfoData["arg_worktime_department_apply_id"] = worktime_team_apply_id;
    basicInfoData["arg_create_person_id"] = Cookie.get("userid");
    basicInfoData["arg_create_person_name"] = Cookie.get('username');
    basicInfoData["arg_create_time"] = this.getCurrentDate1();
    basicInfoData["arg_cycle_code"] = formData.attend_month;
    basicInfoData["arg_ou_id"] = Cookie.get("OUID");
    basicInfoData["arg_dept_id"] = Cookie.get('dept_id');
    basicInfoData["arg_status"] = '1';
    basicInfoData["arg_apply_type"] = '5';

    // basicInfoData["arg_proc_inst_id"] = ''; --model补充
    /*封装基本信息，即apply表数据 end */
    /*封装审批信息，即approval表数据,经办人申请环节自动完成 begin */
    let approvalData = {};
    approvalData["arg_worktime_department_apply_id"] = worktime_team_apply_id;
    /*下一环节处理人为经办人，直接填写经办人*/
    approvalData["arg_user_id"] = Cookie.get("userid");;
    approvalData["arg_user_name"] = Cookie.get("username");;
    approvalData["arg_post_id"] = ''; //===========
    approvalData["arg_comment_detail"] = '';
    approvalData["arg_comment_time"] = this.getCurrentDate1();
    approvalData["arg_state"] = '1';
    /*封装审批信息，即approval表数据 end */

    /*封装审批信息，即approval表数据,下一环节 begin */
    let approvalDataNext = {};
    approvalDataNext["arg_worktime_department_apply_id"] = worktime_team_apply_id;
    /*下一环节处理人为部门经理，直接在存储过程中写死*/
    approvalDataNext["arg_user_id"] = formData.nextstepPerson1;
    approvalDataNext["arg_user_name"] = nextpostname;
    approvalDataNext["arg_post_id"] = '';//===========
    approvalDataNext["arg_comment_detail"] = '';
    approvalDataNext["arg_comment_time"] = '';
    approvalDataNext["arg_state"] = '2';
    /*封装审批信息，即approval表数据 end */
    return new Promise((resolve) => {
      dispatch({
        type: 'attend_apply_model/attendDeptApplySubmit',
        basicInfoData,
        approvalData,
        approvalDataNext,
        worktime_team_apply_id,
        committee_type,
        resolve
      });
    }).then((resolve) => {
      if (resolve === 'success') {
        this.setState({ worktime_team_apply_id_save: worktime_team_apply_id });
        this.setState({ isSubmitClickable: true });
        setTimeout(() => {
          dispatch(routerRedux.push({
            pathname: '/humanApp/attend/index',
          }));
        }, 500);
      }
      if (resolve === 'false') {
        this.setState({ worktime_team_apply_id_save: worktime_team_apply_id });
        this.setState({ isSubmitClickable: true });
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname: '/humanApp/attend/index',
      }));
    });
  }
  //空值校验
  checkNull(value) {
    if (value === '' || value === null || value === undefined) {
      return true;
    }
    return false;
  }
  addNewAbsenceApplyOK = () => {
    const dataSourceList = this.state.absenceDataSourceTemp;
    let nullCheck = true;
    dataSourceList.map((item) => {
      /*空值校验*/
      if (this.checkNull(item.create_person_id)) {
        message.error('请填写员工编号');
        nullCheck = false;
        return;
      }
      if (this.checkNull(item.create_person_name)) {
        message.error('请填写员工编号');
        nullCheck = false;
        return;
      }
      if (this.checkNull(item.absence_type)) {
        message.error('请选择请假类型');
        nullCheck = false;
        return;
      }

      if (this.checkNull(item.absence_days)) {
        message.error('请填写请假天数');
        nullCheck = false;
        return;
      }
      if (this.checkNull(item.absence_detail1)) {
        message.error('请填写请假详情');
        nullCheck = false;
        return;
      }
    });

    let transferPersonList = this.props.projectAbsenceQueryDataList;
    dataSourceList.map((item) => {
      let planData = {
        create_person_id: item.create_person_id,
        create_person_name: item.create_person_name,
        absence_type: item.absence_type,
        absence_days: item.absence_days,
        absence_detail1: item.absence_detail1,
      };
      transferPersonList.push(planData);
    })
    this.setState({
      absenceDataSource: transferPersonList,
    })
    this.setState({
      modelVisible: false,
    });
  };
  selectNext = () => {
    let formData = this.props.form.getFieldsValue();
    let attend_month = formData.attend_month;
    if (attend_month === null || attend_month === '' || attend_month === undefined) {
      message.error('考勤月份不能为空');
      this.setState({ isSaveClickable: true });
      return;
    };
    if (this.state.saveControl1 === false && (this.props.fullAttendImportDataList.length !== 0)) {
      message.error('部门全勤信息未保存，请保存后再保存提交');
      this.setState({ isSaveClickable: true });
      return;
    }
    if (this.state.saveControl2 === false && (this.state.absenceDataSource.length !== 0)) {

      message.error('部门请假信息未保存，请保存后再保存提交');
      this.setState({ isSaveClickable: true });
      return;
    }
    if (this.state.saveControl3 === false && (this.props.businessTripImportDataList.length !== 0)) {

      message.error('部门出差信息未保存，请保存后再保存提交');
      this.setState({ isSaveClickable: true });
      return;
    }
    if (this.state.saveControl4 === false && (this.props.outTripImportDataList.length !== 0)) {

      message.error('部门外出公务信息未保存，请保存后再保存提交');
      this.setState({ isSaveClickable: true });
      return;
    }
    this.setState({
      visible: true,
    });
  }
  addNewAbsenceApplyCancel = () => {
    this.setState({
      modelVisible: false,
    });
  };
  // 提交信息取消
  handleCancel = (e) => {
    this.setState({
      visible: false
    });
  };
  addNewAttendApply = () => {
    this.setState({
      modelVisible: true,
      indexValue: 0,
    });
  };
  full_attend_columns = [
    { title: '序号', dataIndex: 'indexID' },
    { title: '员工编号', dataIndex: 'user_id' },
    { title: '员工姓名', dataIndex: 'user_name' },
  ];
  business_trip_columns = [
    { title: '序号', dataIndex: 'indexID' },
    { title: '员工编号', dataIndex: 'user_id' },
    { title: '员工姓名', dataIndex: 'user_name' },
    { title: '出差天数', dataIndex: 'travel_days' },
    { title: '出差详情', dataIndex: 'travel_details' },
  ];
  out_trip_columns = [
    { title: '序号', dataIndex: 'indexID' },
    { title: '员工编号', dataIndex: 'user_id' },
    { title: '员工姓名', dataIndex: 'user_name' },
    { title: '因公外出天数', dataIndex: 'away_days' },
    { title: '因公外出详情', dataIndex: 'away_details' },
  ];
  absence_columns = [
    {
      title: '序号',
      dataIndex: 'indexID',
      key: 'indexID',
      width: 50,
      render: (text, record, index) => {
        return <span>{index + 1}</span>
      },
    }, {
      title: '员工编号',
      dataIndex: 'create_person_id',
      key: 'create_person_id',
      width: 60,
      align: 'center',
      render: (text, record, index) => {
        return <Input style={{ color: '#000000' }} placeholder="员工编号" name="create_person_id" disabled={true} defaultValue={record.create_person_id} id={index} onChange={this.onChange.bind(this)} />
      },
    }, {
      title: '员工姓名',
      dataIndex: 'create_person_name',
      key: 'create_person_name',
      align: 'center',
      width: 60,
      render: (text, record, index) => {
        return <Input style={{ color: '#000000' }} placeholder="员工姓名" name="create_person_name" disabled={true} defaultValue={record.create_person_name} id={index} onChange={this.onChange.bind(this)} />
      },
    }, {
      title: '请假类型',
      dataIndex: 'absence_type',
      key: 'absence_type',
      width: 60,
      align: 'center',
      render: (text, record, index) => {
        return <Input placeholder="请假类型" name="absence_type" defaultValue={record.absence_type} id={index} onChange={this.onChange.bind(this)} />
      },
    }, {
      title: '请假天数',
      dataIndex: 'absence_days',
      key: 'absence_days',
      width: 60,
      align: 'center',
      render: (text, record, index) => {
        return <Input type="number" placeholder="请假天数" name="absence_days" defaultValue={parseInt(record.absence_days)} id={index} onChange={this.onChange.bind(this)} />
      },
    }, {
      title: '请假详情',
      dataIndex: 'absence_detail1',
      key: 'absence_detail1',
      width: 130,
      align: 'center',
      render: (text, record, index) => {
        return <Input placeholder="请假详情" name="absence_detail1" defaultValue={record.absence_detail1} id={index} onChange={this.onChange.bind(this)} />
      },
    }
  ];

  render() {
    let fullAttendDataList = [];
    let businessTripDataList = [];
    let outTripDataList = [];
    const { nextDataList } = this.props;
    const absence_columns1 = [
      {
        title: '序号',
        dataIndex: 'indexID',
        key: 'indexID',
        width: '10%',
        textAlign: 'center',
        align: 'center',
        render: (text, record, index) => {
          return <span>{index + 1}</span>
        },
      }, {
        title: '员工编号',
        dataIndex: 'create_person_id',
        key: 'create_person_id',
        width: '15%',
        textAlign: 'center',
        align: 'center',
        render: (text, record, index) => { return <Input placeholder="员工编号" name="create_person_id" id={index} onChange={this.onChange1.bind(this)} /> },
      }, {
        title: '员工姓名',
        dataIndex: 'create_person_name',
        key: 'create_person_name',
        textAlign: 'center',
        align: 'center',
        width: '15%',
        render: (text, record, index) => { return <Input placeholder="员工姓名" name="create_person_name" id={index} onChange={this.onChange1.bind(this)} /> },
      }, {
        title: '请假类型',
        dataIndex: 'absence_type',
        key: 'absence_type',
        width: '15%',
        textAlign: 'center',
        align: 'center',
        render: (text, record, index) => {
          return <Select placeholder="请假类型" style={{ width: '100%' }} onSelect={this.absenceTypeSelect.bind(this, record)}>
            <Select.Option value={"调休"}>调休</Select.Option>
            <Select.Option value={"年假"}>年假</Select.Option>
            <Select.Option value={"事假"}>事假</Select.Option>
            <Select.Option value={"病假"}>病假</Select.Option>
            <Select.Option value={"婚假"}>婚假</Select.Option>
            <Select.Option value={"丧假"}>丧假</Select.Option>
            <Select.Option value={"产假"}>产假</Select.Option>
            <Select.Option value={"护理假"}>护理假</Select.Option>
            <Select.Option value={"探亲假"}>探亲假</Select.Option>
            <Select.Option value={"陪考假"}>陪考假</Select.Option>
            <Select.Option value={"计划生育假"}>计划生育假</Select.Option>
          </Select>
        },
      }, {
        title: '请假天数',
        dataIndex: 'absence_days',
        key: 'absence_days',
        width: '15%',
        textAlign: 'center',
        align: 'center',
        render: (text, record, index) => { return <Input type="number" placeholder="请假天数" name="absence_days" id={index} onChange={this.onChange1.bind(this)} /> },
      }, {
        title: '请假详情',
        dataIndex: 'absence_detail1',
        key: 'absence_detail1',
        width: '20%',
        textAlign: 'center',
        align: 'center',
        render: (text, record, index) => { return <Input placeholder="请假详情" name="absence_detail1" id={index} onChange={this.onChange1.bind(this)} /> },
      }, {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: '10%',
        textAlign: 'center',
        align: 'center',
        render: (text, record, index) => {
          return <Icon type="delete" data-index={index} onClick={this.handleDel.bind(this)} />//data-index现在为获得index的下标，上面的删除data-index即是获取index的下标
        },
      }
    ];
    //选择一下处理人信息
    let nextpostname = '';
    let initperson = '';
    let nextdataList = null;
    if (nextDataList && nextDataList[0]) {
      if (nextDataList.length > 0) {
        initperson = nextDataList[0].submit_user_id;
        nextpostname = nextDataList[0].submit_post_name;
      }

      nextdataList = nextDataList.map(item =>
        <Option value={item.submit_user_id}>{item.submit_user_name}</Option>
      );
    }

    let saveInfo = this.props.projectAbsenceQueryDataList;
    this.state.absenceDataSource = saveInfo;

    fullAttendDataList = this.props.fullAttendImportDataList;
    businessTripDataList = this.props.businessTripImportDataList;
    outTripDataList = this.props.outTripImportDataList;


    const userProjectDataList = this.props.userProjectDataList;
    //const absence_role_info =  this.props.userRoleData
    //let initProject = this.props.proj_id;

    const { getFieldDecorator } = this.props.form;
    const inputstyle = { color: '#000' };

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
    return (
      <div>
        <Row span={1} style={{ textAlign: 'center' }}>
          <h2><font size="6" face="arial">中国联通济南软件研究院</font></h2>
          <h2><font size="6" face="arial">职能考勤统计单</font></h2></Row>
        <p style={{ textAlign: 'right' }}>申请日期：<span><u>{this.getCurrentDate()}</u></span></p>
        <br></br>
        <Card title="基本信息：" className={styles.r}>
          <Form style={{ marginTop: 10 }}>
            <Row style={{ textAlign: 'center' }}>
              <FormItem label="部门名称" {...formItemLayout}>
                {getFieldDecorator('deptname', {
                  initialValue: this.state.dept_name
                })
                  (<Input style={inputstyle} value='' disabled={true} />)
                }
              </FormItem>
            </Row>
            <Row>
              <FormItem label="考勤月份" {...formItemLayout}>
                {getFieldDecorator('attend_month', {
                  initialValue: this.props.saveViewControl == "none" ? moment(attend_month, 'YYYY-MM') : ''
                })(<MonthPicker
                  placeholder="选择考勤月份"
                  style={{ textAlign: 'left' }}
                  disabled={false}
                  onChange={this.selectDate}
                />)}
              </FormItem>
            </Row>
            <br />
          </Form>
        </Card>
        <Card title="*全勤类（请导入所有全勤类员工信息，导入完成后点击【保存】）">
          <br />
          <div style={{ float: 'left' }}>
            <a href="/filemanage/download/needlogin/hr/full_attend_person.xlsx" ><Button >{'全勤类导入模板下载'}</Button></a>
            &nbsp;&nbsp;&nbsp;&nbsp;
                 <Excel dispatch={this.props.dispatch} importType={'full_attend'} checkDate={this.state.checkDate} />
            &nbsp;&nbsp;&nbsp;&nbsp;
               </div>
          <br />
          <br />
          <br />
          <Table
            columns={this.full_attend_columns}
            dataSource={fullAttendDataList}
            pagination={true}
            scroll={{ x: '100%', y: 450 }}
            width={'100%'}
            bordered={true}
          />
          <br />
          <div style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={this.saveInfoFullAttend} disabled={!this.state.isSaveClickable}>{this.state.isSaveClickable ? '保存' : '正在处理中...'}</Button>
          </div>
          <br />
        </Card>
        <Card title="*请假类（请假类信息已获取，如需修改请直接修改，然后点击【保存】）">
          <br />
          <div style={{ textAlign: "right" }}>
            <Button type="primary" disabled={!this.state.checkDate} onClick={this.addNewAttendApply}>{'新 增'}</Button>
          </div>
          <br />
          <Table
            columns={this.absence_columns}
            dataSource={this.state.absenceDataSource}
            pagination={false}
            scroll={{ x: '100%', y: 450 }}
            width={'100%'}
            bordered={true}
          />
          <br />
          <div style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={this.saveInfoabsence} disabled={!this.state.isSaveClickable1}>{this.state.isSaveClickable1 ? '保存' : '正在处理中...'}</Button>
          </div>
          <br />
        </Card>
        <Card title="*出差类（详情里必须体现：出差开始、结束时间，出差事由；导入完成后点击【保存】）">
          <br />
          <div style={{ float: 'left' }}>
            <a href="/filemanage/download/needlogin/hr/travel_person.xlsx" ><Button >{'出差类导入模板下载'}</Button></a>
            &nbsp;&nbsp;&nbsp;&nbsp;
                 <Excel dispatch={this.props.dispatch} importType={'business_trip'} checkDate={this.state.checkDate} />
            &nbsp;&nbsp;&nbsp;&nbsp;
               </div>
          <br />
          <br />
          <br />
          <Table
            columns={this.business_trip_columns}
            dataSource={businessTripDataList}
            pagination={true}
            scroll={{ x: '100%', y: 450 }}
            width={'100%'}
            bordered={true}
          />
          <br />
          <div style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={this.saveInfoBusinessAttend} disabled={!this.state.isSaveClickable2}>{this.state.isSaveClickable2 ? '保存' : '正在处理中...'}</Button>
          </div>
          <br />
        </Card>
        <Card title="*因公外出类（详情里必须体现：离开、回到公司时间，外出地点，外出事由；导入完成后点击【保存】）">
          <br />
          <div style={{ float: 'left' }}>
            <a href="/filemanage/download/needlogin/hr/away_person.xlsx" ><Button >{'因公外出类导入模板下载'}</Button></a>
            &nbsp;&nbsp;&nbsp;&nbsp;
                 <Excel dispatch={this.props.dispatch} importType={'out_trip'} checkDate={this.state.checkDate} />
            &nbsp;&nbsp;&nbsp;&nbsp;
               </div>
          <br />
          <br />
          <br />
          <Table
            columns={this.out_trip_columns}
            dataSource={outTripDataList}
            pagination={true}
            scroll={{ x: '100%', y: 450 }}
            width={'100%'}
            bordered={true}
          />
          <br />
          <div style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={this.saveInfoOutAttend} disabled={!this.state.isSaveClickable3}>{this.state.isSaveClickable3 ? '保存' : '正在处理中...'}</Button>
          </div>
          <br />
        </Card>
        <br />
        <br />
        <div span={24} style={{ textAlign: 'center' }}>
          <Button onClick={this.goBack}>{'关闭'}</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
                <Button type="primary" htmlType="submit" onClick={this.selectNext} disabled={!this.state.isSubmitClickable}>{this.state.isSubmitClickable ? '提交' : '正在处理中...'}</Button>
        </div>
        <Modal
          title="新增请假人员信息"
          visible={this.state.modelVisible}
          onOk={this.addNewAbsenceApplyOK}
          onCancel={this.addNewAbsenceApplyCancel}
          width="1000px"
        >
          <div>
            <Button type="primary" onClick={this.handleAdd}>{'添 加'}</Button>
            <Card title="请假人员信息" width={'100%'}>
              <Table
                columns={absence_columns1}
                dataSource={this.state.absenceDataSourceTemp}
                pagination={false}
                scroll={{ x: '100%', y: 450 }}
                bordered={true}
              />
              <br />
              <br />
            </Card>
          </div>
        </Modal>
        <Modal
          title="流程处理"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div>
            <Form>
              <FormItem label={'下一步环节'} {...formItemLayout}>
                {getFieldDecorator('nextstepPerson', {
                  initialValue: nextpostname
                })(
                  <Input style={{ color: '#000' }} disabled={true} />
                )}
              </FormItem>
              <FormItem label={'下一处理人'} {...formItemLayout}>
                {getFieldDecorator('nextstepPerson1', {
                  initialValue: initperson
                })(
                  <Select size="large" style={{ width: '%100' }} placeholder="请选择">
                    {nextdataList}
                  </Select>)}
              </FormItem>
            </Form>
          </div>
        </Modal>
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    loading: state.loading.models.attend_apply_model,
    ...state.attend_apply_model
  };
}

attend_func_apply = Form.create()(attend_func_apply);
export default connect(mapStateToProps)(attend_func_apply);
