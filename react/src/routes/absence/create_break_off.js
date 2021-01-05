/**
 * 作者：郭西杰
 * 创建日期：2020-04-20 
 * 邮箱：guoxj116@chinaunicom.cn
 * 功能：实现创建调休申请界面 
 */
import React, { Component } from "react";
import { Button, Col, Row, Form, Input, Card, Table, DatePicker, Select, Icon, message, Modal } from "antd";

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;
import styles from './style.less';
import { connect } from "dva";
import { routerRedux } from "dva/router";
import Cookie from "js-cookie";
import moment from 'moment';

class create_break_off extends Component {
  constructor(props) {
    super(props);
    let user_name = Cookie.get('username');
    let user_id = Cookie.get('userid');
    let ou_id = Cookie.get('OUID');
    let dept_id = Cookie.get('dept_id');
    let dept_name = Cookie.get('dept_name');
    // let saveAddDataSource = this.props.addDataSource && this.props.addDataSource[0]?this.props.addDataSource:[];
    this.state = {
      post_name: "",
      dateFlag: false,
      displayFlag: "none",
      visible: false,
      visible2: false,
      addDataSource: [],
      indexValue: 0,
      start_date: '',
      end_date: '',
      reason: '',
      absence_days: '',
      submitFlag: true,
      absence_apply_id_save: '',
      absence_role_info: '',
      absence_role_info_temp: '',
      user_name: user_name,
      dept_name: dept_name,
      user_id: user_id,
      dept_id: dept_id,
      ou_id: ou_id,
      team_stats_id_save: '',
      isSaveClickable: true,
      isSubmitClickable: true,
      isStatsSaveClickable: true,
      isStatsSubmitClickable: true,
      personAddvisible: false
    };
    this.handleAdd = this.handleAdd.bind(this);//绑定this，这个是下面声明onClick的方法，需绑定this，在onClick事件中直接用this.handleAdd即可
    this.handleDel = this.handleDel.bind(this);
  }
  // 获取当前日期
  getCurrentDate() {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    return `${year}年${month < 10 ? `0${month}` : `${month}`}月${date < 10 ? `0${date}` : `${date}`}日`
  }

  getCurrentDate1() {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    return `${year}-${month < 10 ? `0${month}` : `${month}`}-${date < 10 ? `0${date}` : `${date}`}`
  }
  // 选择日期
  selectDate1 = (date, dateString) => {
    this.setState({
      start_date: dateString[0],
      end_date: dateString[1],
    });
  };

  choiseDate(record, start_date) {
    start_date = start_date.format("YYYY-MM-DD");
    let changePerson = this.state.addDataSource;
    changePerson[record.indexID]['start_date'] = start_date;
    this.setState({
      addDataSource: changePerson
    })
  }

  choiseDate1(record, end_date) {
    end_date = end_date.format("YYYY-MM-DD");
    let changePerson = this.state.addDataSource;
    changePerson[record.indexID]['end_date'] = end_date;
    this.setState({
      addDataSource: changePerson
    })
  }

  handleAdd() {
    const newDataSource = this.state.addDataSource;//将this.state.dateSource赋给newDataSource
    let l = this.state.indexValue;
    newDataSource.push({//newDataSource.push一个新的数组，这个数组直接将初始化中的数组copy过来即可
      indexID: l,
      //姓名
      absence_user_name: '',
      //起始时间
      absence_user_id: '',
      start_date: '',
      end_date: '',
      absence_days: '',
      // end_date: this.props.end_date,
      //申请理由
      reason: '',
    });
    this.setState({
      indexValue: l + 1
    });
    this.setState({
      addDataSource: newDataSource,//将newDataSource新添加的数组给dataSource
      submitFlag: false,//提交按钮控制
    });
  }
  handleDel(e) {
    const DelDataSource = this.state.addDataSource;
    let deleteIndex = e.target.getAttribute('data-index');
    if (deleteIndex != (DelDataSource.length - 1)) {
      message.error('必须自底向上逐一删除，不支持从中间删除');
      return;
    }
    DelDataSource.splice(deleteIndex, 1);
    this.setState({
      addDataSource: DelDataSource,
    });
    if (DelDataSource.length == 0) {
      this.setState({
        submitFlag: true,//提交按钮控制
      });
    }
  }
  idFormatcheck(idStr) {
    let idCheck = idStr;
    let result = idCheck.match(/^\d{7}$/);

    if (result == null) {
      return false;
    }
  }
  dateFormatcheck(dataStr) {
    let date = dataStr;
    let result = date.match(/^(\d{4})(-|\/)(\d{2})\2(\d{2})$/);

    if (result == null) {
      return false;
    }
    let d = new Date(result[1], result[3] - 1, result[4]);
    return (d.getFullYear() == result[1] && (d.getMonth() + 1) == result[3] && d.getDate() == result[4]);
  }

  dateValuecheck1(dataStr1, dataStr2) {
    let absence_date1 = dataStr1.replace(/\-/g, "");
    let absence_date2 = dataStr2.replace(/\-/g, "");
    return (absence_date2 >= absence_date1);
  }

  dateValuecheck(dataStr) {
    let overtime = dataStr.replace(/\-/g, "");
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let currentTime = `${year}${month < 10 ? `0${month}` : `${month}`}${date < 10 ? `0${date}` : `${date}`}`;
    return (overtime > currentTime);
  }

  onChange(e) {
    let changePlan = this.state.addDataSource;
    changePlan[e.target.id][e.target.name] = e.target.value;
    this.setState({
      addDataSource: changePlan,
    })
  }
  submitAction = () => {
    this.setState({
      visible: true,
    });
  }

  getNextStepPerson = (value) => {
    const { dispatch } = this.props;
    /* TODO proj_id为空   */
    let query = {
      proj_id: value
    };
    dispatch({
      type: 'create_approval_model/nextStepPersonQuery',
      query
    });
  }

  updateParent = (value) => {
    this.setState({
      personAddVisible: value,
    });
  }

  //结束关闭
  gotoHome = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/absence/absenceIndex'
    }));
  }

  //保存调休申请信息
  saveInfo = () => {
    let proj_id_tept = this.props.form.getFieldValue("proj_id");
    let proj_id_temp = proj_id_tept;

    this.setState({ isSaveClickable: false });
    const { dispatch } = this.props;
    let addDataList = this.state.addDataSource;

    /*非空校验*/
    let absencetype = this.props.form.getFieldValue("absencetype");
    let proj_id_value = this.props.form.getFieldValue("proj_id");
    if (proj_id_value === null || proj_id_value === '' || proj_id_value === undefined) {
      message.error('项目组不能为空');
      this.setState({ isSaveClickable: true });
      return;
    }
    if (absencetype === null || absencetype === '' || absencetype === undefined) {
      message.error('请假类型不能为空');
      this.setState({ isSaveClickable: true });
      return;
    }

    /*封装基本信息，即overtime_team_apply表数据*/
    let basicInfoData = {};

    let absence_apply_id = '';

    let absence_apply_id_temp = this.props.absence_apply_id;

    if (absence_apply_id_temp == '' || absence_apply_id_temp == null || absence_apply_id_temp == undefined) {
      absence_apply_id_temp = this.state.user_id + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32);
    }

    if (this.state.absence_apply_id_save !== '') {
      absence_apply_id = this.state.absence_apply_id_save;
    }
    else {
      absence_apply_id = absence_apply_id_temp;
    }

    basicInfoData["arg_absence_apply_id"] = absence_apply_id;
    basicInfoData["arg_create_person_id"] = this.state.user_id;
    basicInfoData["arg_create_person_name"] = this.state.user_name;
    basicInfoData["arg_create_time"] = this.getCurrentDate1();
    basicInfoData["arg_dept_id"] = this.state.dept_id;
    basicInfoData["arg_ou_id"] = this.state.ou_id;
    basicInfoData["arg_proj_name"] = proj_id_temp;
    basicInfoData["arg_status"] = '0';
    basicInfoData["arg_absence_type"] = '0';

    /* TODO 公共接口暂时无法使用，因此自己实现存储过程实现  let basicInfoParam = JSON.stringify(basicInfoArray);*/
    /* let basicInfoArray = {};
    basicInfoArray["opt"] =  "insert";
    basicInfoArray["data"] =  basicInfoData;*/
    /* TODO 公共接口暂时无法使用，因此自己实现存储过程实现  let basicInfoParam = JSON.stringify(basicInfoArray);*/
    /*封装人员信息，即overtime_team_person表数据*/
    /*let personListString = personList.map((item) => {
      return (
        "{team_apply_id:'" + team_apply_id + "',user_id:'" + item.hrID + "',user_name:'" + item.staffName +
        "',overtime_time:'" + item.workTime + "',overtime_reason:'" + item.workReason + "'overtime_place:'" + item.workPlace + "',remark:'" + item.remark + "'}"
      )
    });*/

    let transferPersonList = [];
    let idCheckR = true;
    let dateCheckR = true;
    let dateValueCheck = true;
    let dateValueCheck1 = true;
    let absenceDataList = [];

    addDataList.map((item) => {

      let r_id = this.idFormatcheck(item.absence_user_id);
      if (r_id === false) {
        idCheckR = false;
      }
      /*加班日期不能小于等于当前时间*/
      let rt = this.dateValuecheck(item.start_date);
      if (rt === false) {
        dateValueCheck = false;
      }
      /*加班日期不能小于等于初始时间*/
      let rt1 = this.dateValuecheck1(item.start_date, item.end_date);
      if (rt1 === false) {
        dateValueCheck1 = false;
      }
      let personData = {
        arg_absence_apply_id: absence_apply_id_temp,
        arg_absence_type: '0',
        arg_user_id: item.absence_user_id,
        arg_user_name: item.absence_user_name,
        arg_absenct_st: item.start_date,
        arg_absenct_et: item.end_date,
        arg_absenct_days: item.absence_days,
        arg_absenct_reason: item.reason,
      };
      absenceDataList.push(personData);
    })
    if (absenceDataList == null || absenceDataList == '' || absenceDataList == undefined) {
      message.error('申请信息不能为空');
      this.setState({ isSaveClickable: true });
      return;
    }
    if (idCheckR === false) {
      message.error('存在员工编号不是7位的非法员工编号，请修改后再保存提交');
      this.setState({ isSaveClickable: true });
      return;
    }
    if (dateValueCheck === false) {
      message.error('请假日期必须大于申请当天，请修改后再保存提交');
      this.setState({ isSaveClickable: true });
      return;
    }
    if (dateValueCheck1 === false) {
      message.error('结束日期必须大于或等于起始日期，请修改后再保存提交');
      this.setState({ isSaveClickable: true });
      return;
    }
    /*
    let personInfoParam = JSON.stringify(transferPersonList);
     */
    /* TODO 公共接口暂时无法使用，因此自己实现存储过程实现  let personInfoParam = JSON.stringify(transferPersonList);*/
    return new Promise((resolve) => {
      dispatch({
        type: 'create_break_off_model/absenceApprovalSave',
        basicInfoData,
        absenceDataList,
        absence_apply_id,
        resolve
      });
    }).then((resolve) => {
      if (resolve === 'success') {
        this.setState({ absence_apply_id_save: absence_apply_id });
        this.setState({ isSaveClickable: true });
        setTimeout(() => {
          dispatch(routerRedux.push({
            pathname: '/humanApp/absence/absenceIndex'
          }));
        }, 500);
      }
      if (resolve === 'false') {
        this.setState({ absence_apply_id_save: absence_apply_id });
        this.setState({ isSaveClickable: true });
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname: '/humanApp/absence/absence_index'
      }));
    });
  };

  //提交调休申请信息
  handleOk = () => {
    let proj_id_tept = this.props.form.getFieldValue("proj_id");

    let proj_id_temp = proj_id_tept;
    let formData = this.props.form.getFieldsValue();
    let addDataList = this.state.addDataSource;
    let nextStepPersonId = formData.nextStepPerson;

    this.setState({ isSubmitClickable: false });
    this.setState({
      visible: false,
    });
    const { dispatch } = this.props;
    /*非空校验*/
    let absencetype = this.props.form.getFieldValue("absencetype");
    let proj_id_value = this.props.form.getFieldValue("proj_id");

    if (proj_id_value === null || proj_id_value === '' || proj_id_value === undefined) {
      message.error('项目组不能为空');
      this.setState({ isSubmitClickable: true });
      return;
    }
    if (absencetype === null || absencetype === '' || absencetype === undefined) {
      message.error('请假类型不能为空');
      this.setState({ isSubmitClickable: true });
      return;
    }

    /*封装基本信息，即overtime_team_apply表数据 begin */
    let basicInfoData = {};
    let absence_apply_id = '';

    let absence_apply_id_temp = this.props.absence_apply_id;

    if (absence_apply_id_temp == '' || absence_apply_id_temp == null || absence_apply_id_temp == undefined) {
      absence_apply_id_temp = this.state.user_id + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32);
    }

    if (this.state.absence_apply_id_save !== '') {
      absence_apply_id = this.state.absence_apply_id_save;
    }
    else {
      absence_apply_id = absence_apply_id_temp;
    }


    basicInfoData["arg_absence_apply_id"] = absence_apply_id;
    basicInfoData["arg_create_person_id"] = this.state.user_id;
    basicInfoData["arg_create_person_name"] = this.state.user_name;
    basicInfoData["arg_create_time"] = this.getCurrentDate1();
    basicInfoData["arg_dept_id"] = this.state.dept_id;
    basicInfoData["arg_ou_id"] = this.state.ou_id;
    basicInfoData["arg_proj_name"] = proj_id_temp;
    basicInfoData["arg_status"] = '1';
    basicInfoData["arg_absence_type"] = '0';

    /*封装基本信息，即overtime_team_apply表数据 end */

    /*封装人员信息，即overtime_team_person表数据 begin */
    let transferPersonList = [];
    let idCheckR = true;
    let dateCheckR = true;
    let dateValueCheck = true;
    let dateValueCheck1 = true;
    let absenceDataList = [];

    addDataList.map((item) => {
      let r_id = this.idFormatcheck(item.absence_user_id);
      if (r_id === false) {
        idCheckR = false;
      }
      /*加班日期不能小于等于当前时间*/
      let rt = this.dateValuecheck(item.start_date);
      if (rt === false) {
        dateValueCheck = false;
      }
      /*加班日期不能小于等于初始时间*/
      let rt1 = this.dateValuecheck1(item.start_date, item.end_date);
      if (rt1 === false) {
        dateValueCheck1 = false;
      }
      let personData = {
        arg_absence_apply_id: absence_apply_id_temp,
        arg_absence_type: '0',
        arg_user_id: item.absence_user_id,
        arg_user_name: item.absence_user_name,
        arg_absenct_st: item.start_date,
        arg_absenct_et: item.end_date,
        arg_absenct_days: item.absence_days,
        arg_absenct_reason: item.reason,
      };
      absenceDataList.push(personData);
    })
    if (absenceDataList == null || absenceDataList == '' || absenceDataList == undefined) {
      message.error('申请信息不能为空');
      this.setState({ isSubmitClickable: true });
      return;
    }
    if (idCheckR === false) {
      message.error('存在员工编号不是7位的非法员工编号，请修改后再保存提交');
      this.setState({ isSubmitClickable: true });
      return;
    }
    if (dateValueCheck === false) {
      message.error('请假日期必须大于申请当天，请修改后再保存提交');
      this.setState({ isSubmitClickable: true });
      return;
    }
    if (dateValueCheck1 === false) {
      message.error('结束日期必须大于或等于起始日期，请修改后再保存提交');
      this.setState({ isSubmitClickable: true });
      return;
    }
    /*封装人员信息，即overtime_team_person表数据 end */


    /*封装审批信息，即overtime_team_approval表数据,接口人申请环节自动完成 begin */
    let approvalData = {};
    approvalData["arg_absence_apply_id"] = absence_apply_id_temp;
    /*下一环节处理人为项目接口人，直接填写申请人*/
    approvalData["arg_user_id"] = this.state.user_id;
    approvalData["arg_user_name"] = this.state.user_name;
    approvalData["arg_post_id"] = '9ca4d30fb3b311e6b01d02429ca3c6ff';
    approvalData["arg_comment_detail"] = '';
    approvalData["arg_comment_time"] = this.getCurrentDate1();
    approvalData["arg_state"] = '1';
    /*封装审批信息，即overtime_team_approval表数据 end */


    /*封装审批信息，即overtime_team_approval表数据,下一环节 begin */

    let approvalDataNext = {};
    approvalDataNext["arg_absence_apply_id"] = absence_apply_id_temp;
    /*下一环节处理人为项目经理、或者部门经理，直接在存储过程中写死*/
    approvalDataNext["arg_user_id"] = formData.nextstepPerson;
    approvalDataNext["arg_user_name"] = formData.nextstepPerson;
    approvalDataNext["arg_post_id"] = '9cc97a9cb3b311e6a01d02429ca3c6ff';
    approvalDataNext["arg_comment_detail"] = '';
    approvalDataNext["arg_comment_time"] = '';
    approvalDataNext["arg_state"] = '2';
    /*封装审批信息，即overtime_team_approval表数据 end */
    const absence_role_info = this.props.userRoleData
    return new Promise((resolve) => {

      dispatch({
        type: 'create_break_off_model/absenceApprovalSubmit',
        basicInfoData,
        absenceDataList,
        approvalData,
        approvalDataNext,
        absence_role_info,
        absence_apply_id,
        resolve
      });
    }).then((resolve) => {
      if (resolve === 'success') {
        this.setState({ absence_apply_id_save: absence_apply_id });
        this.setState({ isSubmitClickable: true });
        setTimeout(() => {
          dispatch(routerRedux.push({
            pathname: '/humanApp/absence/absenceIndex'
          }));
        }, 500);
      }
      if (resolve === 'false') {
        this.setState({ absence_apply_id_save: absence_apply_id });
        this.setState({ isSubmitClickable: true });
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname: '/humanApp/absence/absenceIndex'
      }));
    });
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  render() {

    const inputstyle = { color: '#000' };
    const { getFieldDecorator } = this.props.form;
    const userProjectDataList = this.props.userProjectDataList;
    //const absence_role_info =  this.props.userRoleData

    //let initProject = this.props.proj_id;
    const projectList1 = userProjectDataList.map(item => item.proj_name);
    const projectList = (projectList1 == null || projectList1 == '' || projectList1 == undefined) ? this.state.dept_name : projectList1[0];

    //选择一下处理人信息
    let nextDataList = this.props.nextDataList;
    let nextpostname = '';
    let initperson = '';
    let nextdataList = null;
    if (nextDataList !== undefined) {
      if (nextDataList.length > 0) {
        initperson = nextDataList[0].submit_user_id;
        nextpostname = nextDataList[0].submit_post_name;
        this.state.next_post_id = '1000000000001';
      }
      nextdataList = nextDataList.map(item =>
        <Option value={item.submit_user_id}>{item.submit_user_name}</Option>
      );
    }
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 9
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 8
        }
      },
      style: { marginBottom: 10 }
    };
    const create_time = this.getCurrentDate();
    let saveInfo = this.props.addDataSource;
    this.state.addDataSource = saveInfo;
    const breakOffInfo = [
      {
        title: '序号',
        dataIndex: 'indexID',
        key: 'indexID',
        width: 20,
        align: 'center',
        render: (text, record, index) => {
          return <span>{index + 1}</span>
        },
      }, {
        title: '姓名',
        dataIndex: 'absence_user_name',
        key: 'absence_user_name',
        width: 60,
        align: 'center',
        render: (text, record, index) => {
          return <Input placeholder="姓名" name="absence_user_name" defaultValue={record.absence_user_name} id={index} onChange={this.onChange.bind(this)} />
        },
      }, {
        title: '员工编号',
        dataIndex: 'absence_user_id',
        key: 'absence_user_id',
        align: 'center',
        width: 60,
        render: (text, record, index) => {
          return <Input placeholder="员工编号" name="absence_user_id" defaultValue={record.absence_user_id} id={index} onChange={this.onChange.bind(this)} />
        },
      }, {
        title: '起始日期',
        dataIndex: 'start_date',
        key: 'start_date',
        width: 80,
        align: 'center',
        render: (text, record, index) => {

          if (record.start_date) {
            return <DatePicker
              defaultValue={moment(record.start_date, 'YYYY-MM-DD')}
              placeholder="起始日期"
              getPopupContainer={trigger => trigger.parentNode} name="start_date"
              id={index} onChange={this.choiseDate.bind(this, record)} />
          } else {
            return <DatePicker
              placeholder="起始日期"
              getPopupContainer={trigger => trigger.parentNode} name="start_date"
              id={index} onChange={this.choiseDate.bind(this, record)} />
          }
        }
        /* render: (text, record, index) => { 
           return <span><RangePicker
           style={{ width: '100%' }}
           disabled={false}
           id={index}
          // onChange={this.selectDate1}
          onChange={this.selectDate1}
         /></span>          
       },  */
      }, {
        title: '结束日期',
        dataIndex: 'end_date',
        key: 'end_date',
        width: 80,
        align: 'center',
        render: (text, record, index) => {
          if (record.end_date) {
            return <DatePicker
              defaultValue={moment(record.end_date, 'YYYY-MM-DD')}
              placeholder="结束日期"
              getPopupContainer={trigger => trigger.parentNode} name="end_date"
              id={index} onChange={this.choiseDate1.bind(this, record)} />
          } else {
            return <DatePicker
              placeholder="结束日期"
              getPopupContainer={trigger => trigger.parentNode} name="end_date"
              id={index} onChange={this.choiseDate1.bind(this, record)} />
          }
        }
      }, {
        title: '调休天数',
        dataIndex: 'absence_days',
        key: 'absence_days',
        width: 60,
        align: 'center',
        render: (text, record, index) => {
          return <Input placeholder="调休天数" name="absence_days" defaultValue={record.absence_days} id={index} onChange={this.onChange.bind(this)} />
        },
      }, {
        title: '申请理由',
        dataIndex: 'reason',
        key: 'reason',
        width: 130,
        align: 'center',
        render: (text, record, index) => {
          return <Input placeholder="请写兑换加班日期" name="reason" defaultValue={record.reason} id={index} onChange={this.onChange.bind(this)} />
        },
      }, {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 50,
        align: 'center',
        render: (text, record, index) => {
          return <Icon type="delete" data-index={index} onClick={this.handleDel.bind(this)} />//data-index现在为获得index的下标，上面的删除data-index即是获取index的下标
        },
      }
    ];

    return (
      <div>
        <br />
        <Row span={1} style={{ textAlign: 'center' }}>
          <h2><font size="6" face="arial">中国联通济南软件研究院员工调休申请表</font></h2></Row>
        <p style={{ textAlign: 'right' }}>申请日期：<span><u>{this.getCurrentDate()}</u></span></p>
        <br></br>
        <Card title="基本信息" className={styles.r}>
          <Form style={{ marginTop: 10 }}>
            <Row>
              <Col span="24">
                <FormItem label="员工编号" {...formItemLayout}>
                  {getFieldDecorator('userid', {
                    initialValue: this.state.user_id
                  })
                    (<Input style={inputstyle} value='' disabled={true} />)
                  }
                </FormItem>
              </Col>
              <Col span="24">
                <FormItem label="姓名" {...formItemLayout}>
                  {getFieldDecorator('username', {
                    initialValue: this.state.user_name
                  })
                    (<Input style={inputstyle} value='' disabled={true} />)
                  }
                </FormItem>
              </Col>
            </Row>
            <FormItem label="所在部门" {...formItemLayout}>
              {getFieldDecorator('deptname', {
                initialValue: this.state.dept_name
              })
                (<Input style={inputstyle} value='' disabled={true} />)
              }
            </FormItem>
            <FormItem label="所在项目" {...formItemLayout}>
              {getFieldDecorator('proj_id', {
                initialValue: projectList
              })(<Input style={inputstyle} value='' disabled={true} />)}
            </FormItem>
            <FormItem label="请假类型" {...formItemLayout}>
              {getFieldDecorator('absencetype', {
                initialValue: '调休申请'
              })
                (<Input style={inputstyle} value='' disabled={true} />)
              }
            </FormItem>
          </Form>
        </Card>

        <Card title="申请信息" className={styles.r} width={'100%'}>
          <div style={{ textAlign: "right" }}>
            <Button type="primary" onClick={this.handleAdd}>{'添 加'}</Button>
          </div>
          <br></br>
          <Table
            columns={breakOffInfo}
            dataSource={this.state.addDataSource}
            pagination={false}
            scroll={{ x: '100%', y: 450 }}
            width={'100%'}
            bordered={true}
          />
        </Card>
        <div style={{ textAlign: 'center' }}>
          <br></br>
          <Button type="primary" onClick={this.saveInfo} disabled={!this.state.isSaveClickable}>{this.state.isSaveClickable ? '保存' : '正在处理中...'}</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button onClick={this.gotoHome}>关闭</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" htmlType="submit" onClick={this.submitAction} disabled={!this.state.isSubmitClickable}>{this.state.isSubmitClickable ? '提交' : '正在处理中...'}</Button>
        </div>
        <Modal
          title="流程处理"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div>
            <Form>
              <FormItem label={'下一步环节'} {...formItemLayout}>
                <Input style={{ color: '#000' }} value={nextpostname} disabled={true} />
              </FormItem>
              <FormItem label={'下一处理人'} {...formItemLayout}>
                {getFieldDecorator('nextstepPerson', {
                  initialValue: initperson
                })(
                  <Select size="large" style={{ width: '%100' }} initialValue={initperson} placeholder="请选择团队负责人">
                    {nextdataList}
                  </Select>)}
              </FormItem>
            </Form>
          </div>
        </Modal>
        <br /><br />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.create_break_off_model,
    ...state.create_break_off_model
  };
}
create_break_off = Form.create()(create_break_off);
export default connect(mapStateToProps)(create_break_off);
