/**
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-04-15
 * 功能：实现创建项目组加班审批流程功能
 */
import React, { Component } from "react";
import { Button, Row, Form, Input, Card, Table, Select, Upload, Icon, message, Modal } from "antd";

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
import styles from './style.less';
import { connect } from "dva";
import { routerRedux } from "dva/router";
import Excel from "./Excel";
import Cookie from "js-cookie";
import UpFile from "./upFile";
import UpFile2 from "./upFile2";
import DynAddPerson from "../../components/overtime/DynAddPerson";

class FunctionalCirculationApproval extends Component {
  constructor(props) {
    super(props);
    let user_name = Cookie.get('username');
    let user_id = Cookie.get('userid');
    let dept_id = Cookie.get('dept_id');
    let dept_name = Cookie.get('dept_name');
    this.state = {
      post_name: "",
      dateFlag: false,
      displayFlag: "none",
      visible: false,
      visible2: false,
      user_name: user_name,
      dept_name: dept_name,
      user_id: user_id,
      dept_id: dept_id,
      department_apply_id_save: '',
      department_stats_id_save: '',
      isSaveClickable: true,
      isSubmitClickable: true,
      isStatsSaveClickable: true,
      isStatsSubmitClickable: true,
      personAddvisible: false
    };
  }

  getCurrentDate() {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    return `${year}年${month < 10 ? `0${month}` : `${month}`}月${date < 10 ? `0${date}` : `${date}`}日`
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

  dateValuecheck(dataStr) {
    let overtime = dataStr.replace(/\-/g, "");
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let currentTime = `${year}${month < 10 ? `0${month}` : `${month}`}${date < 10 ? `0${date}` : `${date}`}`;
    return (overtime > currentTime);
  }

  idFormatcheck(idStr) {
    let result = '';
    if (idStr) {
      result = idStr.match(/^0\d{6}$/);
    } else {
      message.error("您加班人员的工号有误，请查验！");
    }
    if (!result) {
      return false;
    }
  };

  updateParent = (value) => {
    this.setState({
      personAddVisible: value,
    });
  }

  addPerson = () => {
    this.updateParent(true);
  }

  deletePersonInfo = (record) => {
    // 请求model，做删除操作
    let importPersonDataList = this.props.personDataList;
    const { dispatch } = this.props;
    dispatch({
      type: 'create_approval_model/deletePerson',
      importPersonDataList,
      record
    });
  }
  team_columns = [
    { title: '序号', dataIndex: 'indexID' },
    { title: '员工编号', dataIndex: 'hrID' },
    { title: '姓名', dataIndex: 'staffName' },
    { title: '加班日期', dataIndex: 'workTime' },
    { title: '加班原因', dataIndex: 'workReason' },
    { title: '加班地点', dataIndex: 'workPlace' },
    { title: '天数', dataIndex: 'remark' },
    {
      title: '操作', dataIndex: '', key: 'x', render: (text, record) => (
        <span>
          <a onClick={() => this.deletePersonInfo(record)} >删除</a>
          <span className="ant-divider" />
        </span>
      )
    },
  ];

  //结束关闭
  gotoHome = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/overtime/overtime_index'
    }));
  }
  //保存信息
  saveInfo = () => {
    this.setState({ isSaveClickable: false });
    const { dispatch } = this.props;
    let personList = this.props.personDataList;
    /*非空校验*/
    let holidays = this.props.form.getFieldValue("holidays");
    if (holidays === null || holidays === '' || holidays === undefined) {
      message.error('节假日不能为空');
      this.setState({ isSaveClickable: true });
      return;
    }
    if (personList.length < 1) {
      message.error('加班人员信息不能为空');
      this.setState({ isSaveClickable: true });
      return;
    }

    /* TODO 封装基本信息，即overtime_department_apply表数据*/
    let basicInfoData = {};
    let department_apply_id = '';
    if (this.state.department_apply_id_save !== '') {
      department_apply_id = this.state.department_apply_id_save;
    }
    else {
      department_apply_id = this.state.user_id + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32);
    }
    basicInfoData["arg_department_apply_id"] = department_apply_id;
    basicInfoData["arg_deptid"] = this.state.dept_id;
    basicInfoData["arg_holiday_name"] = holidays;
    basicInfoData["arg_create_person"] = this.state.user_id;
    basicInfoData["arg_create_time"] = this.props.form.getFieldValue("timeApply");
    basicInfoData["arg_post_id"] = '9ca4d30fb3b311e6a01d02428ca3c6ff';  //部门接口人的id
    basicInfoData["arg_status"] = '0';
    basicInfoData["arg_apply_type"] = '5';

    let transferPersonList = [];
    let dateCheckR = true;
    let dateValueCheck = true;
    let idCheckR = true;
    personList.map((item) => {
      /*员工id必须为7位*/
      let r_id = this.idFormatcheck(item.hrID);
      if (r_id === false) {
        idCheckR = false;
      }
      /*加班日期格式必须是YYYY-MM-DD*/
      let r = this.dateFormatcheck(item.workTime);
      if (r === false) {
        dateCheckR = false;
      }
      /*加班日期不能小于等于当前时间*/
      let rt = this.dateValuecheck(item.workTime);
      if (rt === false) {
        dateValueCheck = false;
      }
      let personData = {
        arg_team_apply_id: department_apply_id,
        arg_user_id: item.hrID,
        arg_user_name: item.staffName,
        arg_overtime_time: item.workTime,
        arg_overtime_reason: item.workReason,
        arg_overtime_place: item.workPlace,
        arg_remark: item.remark,
        arg_func: '1',
        arg_apply_type: '5',
        arg_holiday: holidays
      };
      transferPersonList.push(personData);
    })
    if (idCheckR === false) {
      message.error('存在员工编号不是7位的非法员工编号，请修改后再保存提交');
      this.setState({ isSaveClickable: true });
      return;
    }
    if (dateCheckR === false) {
      message.error('加班日期格式不是YYYY-MM-DD，请修改后再保存提交');
      this.setState({ isSaveClickable: true });
      return;
    }
    if (dateValueCheck === false) {
      message.error('加班日期必须大于申请当天，请修改后再保存提交');
      this.setState({ isSaveClickable: true });
      return;
    }
    return new Promise((resolve) => {
      dispatch({
        type: 'create_approval_model/functionalDeptApprovalSave',
        basicInfoData,
        transferPersonList,
        department_apply_id,
        resolve
      });
    }).then((resolve) => {
      if (resolve === 'success') {
        this.setState({ department_apply_id_save: department_apply_id });
        this.setState({ isSaveClickable: true });
      }
      if (resolve === 'false') {
        this.setState({ department_apply_id_save: department_apply_id });
        this.setState({ isSaveClickable: true });
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname: '/humanApp/overtime/overtime_index'
      }));
    });
  };
  //项目组提交加班申请信息
  handleOk = (e) => {
    this.setState({ isSubmitClickable: false });
    this.setState({
      visible: false,
    });
    const { dispatch } = this.props;
    let personList = this.props.personDataList;
    /*非空校验*/
    let holidays = this.props.form.getFieldValue("holidays");
    if (holidays === null || holidays === '' || holidays === undefined) {
      message.error('节假日不能为空');
      this.setState({ isSubmitClickable: true });
      return;
    }
    if (personList.length < 1) {
      message.error('加班人员信息不能为空');
      this.setState({ isSubmitClickable: true });
      return;
    }

    /*封装基本信息，即overtime_department_apply表数据 begin */
    let basicInfoData = {};
    let department_apply_id = '';
    let saveTaskId = this.props.saveTaskId;
    if (saveTaskId !== null && saveTaskId !== '' && saveTaskId !== undefined) {
      department_apply_id = saveTaskId;
    } else if (this.state.department_apply_id_save !== '') {
      department_apply_id = this.state.department_apply_id_save;
    }
    else {
      department_apply_id = this.state.user_id + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32);
    }
    basicInfoData["arg_department_apply_id"] = department_apply_id;
    basicInfoData["arg_deptid"] = this.state.dept_id;
    basicInfoData["arg_holiday_name"] = holidays;
    basicInfoData["arg_create_person"] = this.state.user_id;
    basicInfoData["arg_create_time"] = this.props.form.getFieldValue("timeApply");
    basicInfoData["arg_post_id"] = '9ca4d30fb3b311e6a01d02428ca3c6ff';  //部门接口人的id
    basicInfoData["arg_status"] = '1';
    basicInfoData["arg_apply_type"] = '5';
    /*封装基本信息，即overtime_department_apply表数据 end */

    /*封装人员信息，即overtime_team_person表数据 begin */
    let transferPersonList = [];
    let idCheckR = true;
    let dateCheckR = true;
    let dateValueCheck = true;
    personList.map((item) => {
      /*员工id必须为7位*/
      let r_id = this.idFormatcheck(item.hrID);
      if (r_id === false) {
        idCheckR = false;
      }
      /*加班日期格式必须是YYYY-MM-DD*/
      let r = this.dateFormatcheck(item.workTime);
      if (r === false) {
        dateCheckR = false;
      }
      /*加班日期不能小于等于当前时间*/
      let rt = this.dateValuecheck(item.workTime);
      if (rt === false) {
        dateValueCheck = false;
      }
      let personData = {
        arg_team_apply_id: department_apply_id,
        arg_user_id: item.hrID,
        arg_user_name: item.staffName,
        arg_overtime_time: item.workTime,
        arg_overtime_reason: item.workReason,
        arg_overtime_place: item.workPlace,
        arg_remark: item.remark,
        arg_func: '1',
        arg_apply_type: '5',
        arg_holiday: holidays
      };
      transferPersonList.push(personData);
    })
    /*封装人员信息，即overtime_team_person表数据 end */

    /*封装审批信息，即overtime_department_approval表数据,接口人申请环节自动完成 begin */
    let approvalData = {};
    // approvalData["arg_department_comment_id"] = '';
    approvalData["arg_department_apply_id"] = department_apply_id;
    // approvalData["arg_task_id"] = '';
    approvalData["arg_user_id"] = this.state.user_id;
    approvalData["arg_user_name"] = this.state.user_name;
    approvalData["arg_post_id"] = '9ca4d30fb3b311e6a01d02428ca3c6ff';
    approvalData["arg_comment_detail"] = '';
    approvalData["arg_comment_time"] = this.props.form.getFieldValue("timeApply");
    approvalData["arg_state"] = '1';
    /*封装审批信息，即overtime_department_approval表数据 end */

    /*封装审批信息，即overtime_department_approval表数据,下一环节 begin */
    let approvalData1 = {};
    // approvalData1["arg_department_comment_id"]= '';
    approvalData1["arg_department_apply_id"] = department_apply_id;
    // approvalData1["arg_task_id"] = '';
    approvalData1["arg_deptid"] = this.state.dept_id;
    approvalData1["arg_user_id"] = this.props.form.getFieldValue("nextstepPerson");
    approvalData1["arg_user_name"] = '';
    approvalData1["arg_post_id"] = '9cc1079db3b311e6a01d02429ca3c6ff';  //有问题
    approvalData1["arg_comment_detail"] = '';
    approvalData1["arg_comment_time"] = '';
    approvalData1["arg_state"] = '2';
    /*封装审批信息，即overtime_department_approval表数据 end */
    if (idCheckR === false) {
      message.error('存在员工编号不是7位的非法员工编号，请修改后再保存提交');
      this.setState({ isSubmitClickable: true });
      return;
    }
    if (dateCheckR === false) {
      message.error('加班日期格式不是YYYY-MM-DD，请修改后再保存提交');
      this.setState({ isSubmitClickable: true });
      return;
    }
    if (dateValueCheck === false) {
      message.error('加班日期必须大于申请当天，请修改后再保存提交');
      this.setState({ isSubmitClickable: true });
      return;
    }

    return new Promise((resolve) => {
      dispatch({
        type: 'create_approval_model/functionalDeptApprovalSubmit',
        basicInfoData,
        transferPersonList,
        approvalData,
        approvalData1,
        department_apply_id,
        resolve
      });
    }).then((resolve) => {
      if (resolve === 'success') {
        this.setState({ department_apply_id_save: department_apply_id });
        this.setState({ isSubmitClickable: true });
        setTimeout(() => {
          dispatch(routerRedux.push({
            pathname: '/humanApp/overtime/overtime_index'
          }));
        }, 500);
      }
      if (resolve === 'false') {
        this.setState({ department_apply_id_save: department_apply_id });
        this.setState({ isSubmitClickable: true });
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname: '/humanApp/overtime/overtime_index'
      }));
    });
  }

  //保存加班统计信息
  saveStatsInfo = () => {
    this.setState({ isStatsSaveClickable: false });
    const { dispatch } = this.props;
    let personList = this.props.personDataList;
    /*非空校验*/
    let holidays = this.props.form.getFieldValue("holidays");
    if (holidays === null || holidays === '' || holidays === undefined) {
      message.error('节假日不能为空');
      this.setState({ isStatsSaveClickable: true });
      return;
    }
    if (personList.length < 1) {
      message.error('加班人员信息不能为空');
      this.setState({ isStatsSaveClickable: true });
      return;
    }
    /*TODO 封装基本信息，即overtime_stats_department_team表数据*/
    let basicInfoData = {};
    let department_stats_id = '';
    if (this.state.department_stats_id_save !== '') {
      department_stats_id = this.state.department_stats_id_save;
    }
    else {
      department_stats_id = this.state.user_id + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32);
    }
    basicInfoData["arg_department_stats_id"] = department_stats_id;
    basicInfoData["arg_deptid"] = this.state.dept_id;
    basicInfoData["arg_holiday_name"] = holidays;
    basicInfoData["arg_create_person"] = this.state.user_id;
    basicInfoData["arg_create_time"] = this.props.form.getFieldValue("timeApply");
    basicInfoData["arg_post_id"] = '9ca4d30fb3b311e6a01d02428ca3c6ff';  //部门接口人的id
    basicInfoData["arg_status"] = '0';
    basicInfoData["arg_apply_type"] = '6';

    //添加文件信息
    basicInfoData["arg_pf_url"] = this.props.pf_url;
    basicInfoData["arg_file_relativepath"] = this.props.file_relativepath;
    basicInfoData["arg_file_name"] = this.props.file_name;
    /*TODO 封装人员信息，即overtime_stats_department_team表数据*/
    let transferPersonList = [];
    let idCheckR = true;
    let dateCheckR = true;
    personList.map((item) => {
      /*员工id必须为7位*/
      let r_id = this.idFormatcheck(item.hrID);
      if (r_id === false) {
        idCheckR = false;
      }
      /*加班日期格式必须是YYYY-MM-DD*/
      let r = this.dateFormatcheck(item.workTime);
      if (r === false) {
        dateCheckR = false;
      }
      let personData = {
        arg_team_stats_id: department_stats_id,
        arg_user_id: item.hrID,
        arg_user_name: item.staffName,
        arg_overtime_time: item.workTime,
        arg_overtime_reason: item.workReason,
        arg_overtime_place: item.workPlace,
        arg_remark: item.remark,
        arg_func: '2',
        arg_apply_type: '6',
        arg_holiday: holidays
      };
      transferPersonList.push(personData);
    })
    if (idCheckR === false) {
      message.error('存在员工编号不是7位的非法员工编号，请修改后再保存提交');
      this.setState({ isStatsSaveClickable: true });
      return;
    }
    if (dateCheckR === false) {
      message.error('加班日期格式不是YYYY-MM-DD，请修改后再保存提交');
      this.setState({ isStatsSaveClickable: true });
      return;
    }
    /* TODO 公共接口暂时无法使用，因此自己实现存储过程实现  let personInfoParam = JSON.stringify(transferPersonList);*/
    return new Promise((resolve) => {
      dispatch({
        type: 'create_approval_model/functionalDeptStatsApprovalSave',
        basicInfoData,
        transferPersonList,
        department_stats_id,
        resolve
      });
    }).then((resolve) => {
      if (resolve === 'success') {
        this.setState({ department_stats_id_save: department_stats_id });
        this.setState({ isStatsSaveClickable: true });
      }
      if (resolve === 'false') {
        this.setState({ department_stats_id_save: department_stats_id });
        this.setState({ isStatsSaveClickable: true });
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname: '/humanApp/overtime/overtime_index'
      }));
    });
  };

  handleStatsOk = (e) => {
    this.setState({ isStatsSubmitClickable: false });
    this.setState({
      visible2: false,
    });
    const { dispatch } = this.props;
    let personList = this.props.personDataList;
    /*非空校验*/
    let holidays = this.props.form.getFieldValue("holidays");
    if (holidays === null || holidays === '' || holidays === undefined) {
      message.error('节假日不能为空');
      this.setState({ isStatsSubmitClickable: true });
      return;
    }
    if (personList.length < 1) {
      message.error('加班人员信息不能为空');
      this.setState({ isStatsSubmitClickable: true });
      return;
    }

    /* 封装基本信息，即overtime_department_stats表数据 begin */
    let department_stats_id = '';
    let saveTaskId = this.props.saveTaskId;
    if (saveTaskId !== null && saveTaskId !== '' && saveTaskId !== undefined) {
      department_stats_id = saveTaskId;
    } else if (this.state.department_stats_id_save !== '') {
      department_stats_id = this.state.department_stats_id_save;
    }
    else {
      department_stats_id = this.state.user_id + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32);
    }
    /*
     首先封装overtime_department_stats表信息 ,封装已有的参数，工作流的proc_inst_id要在model层中进行填写
     */
    let basicInfoData = {};
    basicInfoData["arg_department_stats_id"] = department_stats_id;
    basicInfoData["arg_deptid"] = this.state.dept_id;
    basicInfoData["arg_holiday_name"] = holidays;
    basicInfoData["arg_create_person"] = this.state.user_id;
    basicInfoData["arg_create_time"] = this.props.form.getFieldValue("timeApply");
    basicInfoData["arg_post_id"] = '9ca4d30fb3b311e6a01d02428ca3c6ff';  //部门接口人的id
    basicInfoData["arg_status"] = '1';
    basicInfoData["arg_apply_type"] = '6';
    /*封装基本信息，即overtime_department_stats表数据 end */
    //添加文件信息
    basicInfoData["arg_pf_url"] = this.props.pf_url;
    basicInfoData["arg_file_relativepath"] = this.props.file_relativepath;
    basicInfoData["arg_file_name"] = this.props.file_name;

    /* TODO 封装人员信息，即overtime_team_stats_person表数据 begin */
    let transferPersonList = [];
    let idCheckR = true;
    let dateCheckR = true;
    personList.map((item) => {
      /*员工id必须为7位*/
      let r_id = this.idFormatcheck(item.hrID);
      if (r_id === false) {
        idCheckR = false;
      }
      /*加班日期格式必须是YYYY-MM-DD*/
      let r = this.dateFormatcheck(item.workTime);
      if (r === false) {
        dateCheckR = false;
      }
      let personData = {
        arg_team_stats_id: department_stats_id,
        arg_user_id: item.hrID,
        arg_user_name: item.staffName,
        arg_overtime_time: item.workTime,
        arg_overtime_reason: item.workReason,
        arg_overtime_place: item.workPlace,
        arg_remark: item.remark,
        arg_func: '2',
        arg_apply_type: '6',
        arg_holiday: holidays
      };
      transferPersonList.push(personData);
    })
    /*封装人员信息，即overtime_team_person表数据 end */

    /*
    封装overtime_department_stats_approval表信息，封装两条信息
    */
    let approvalData = {};
    // approvalData["arg_department_comment_id"] = '';
    approvalData["arg_department_stats_id"] = department_stats_id;
    // approvalData["arg_task_id"] = '';
    approvalData["arg_user_id"] = this.state.user_id;
    approvalData["arg_user_name"] = this.state.user_name;
    approvalData["arg_post_id"] = '9ca4d30fb3b311e6a01d02428ca3c6ff';
    approvalData["arg_comment_detail"] = '';
    approvalData["arg_comment_time"] = this.props.form.getFieldValue("timeApply");
    approvalData["arg_state"] = '1';
    // approvalData["arg_task_name"] ='';

    //下一环节
    let approvalData1 = {};
    // approvalData1["arg_department_comment_id"]= '';
    approvalData1["arg_department_stats_id"] = department_stats_id;
    // approvalData1["arg_task_id"] = '';
    approvalData1["arg_deptid"] = this.state.dept_id;
    approvalData1["arg_user_id"] = this.props.form.getFieldValue("nextstepPerson");
    approvalData1["arg_user_name"] = '';
    approvalData1["arg_post_id"] = '9cc1079db3b311e6a01d02429ca3c6ff';  //有问题
    approvalData1["arg_comment_detail"] = '';
    approvalData1["arg_comment_time"] = '';
    approvalData1["arg_state"] = '2';
    // approvalData1["arg_task_name"]= '';
    if (idCheckR === false) {
      message.error('存在员工编号不是7位的非法员工编号，请修改后再保存提交');
      this.setState({ isStatsSubmitClickable: true });
      return;
    }
    if (dateCheckR === false) {
      message.error('加班日期格式不是YYYY-MM-DD，请修改后再保存提交');
      this.setState({ isStatsSubmitClickable: true });
      return;
    }
    return new Promise((resolve) => {
      dispatch({
        type: 'create_approval_model/functionalDeptStatsApprovalSubmit',
        basicInfoData,
        transferPersonList,
        approvalData,
        approvalData1,
        department_stats_id,
        resolve
      });
    }).then((resolve) => {
      if (resolve === 'success') {
        this.setState({ department_stats_id_save: department_stats_id });
        this.setState({ isStatsSubmitClickable: true });
        setTimeout(() => {
          dispatch(routerRedux.push({
            pathname: '/humanApp/overtime/overtime_index'
          }));
        }, 500);
      }
      if (resolve === 'false') {
        this.setState({ department_stats_id_save: department_stats_id });
        this.setState({ isStatsSubmitClickable: true });
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname: '/humanApp/overtime/overtime_index'
      }));
    });
  }

  handleCancel1 = (e) => {
    this.setState({
      visible: false,
    });
  }
  handleCancel2 = (e) => {
    this.setState({
      visible2: false,
    });
  }
  handleSubmitl = (e) => {
    this.setState({
      visible: true,
    });
  }
  handleSubmit2 = (e) => {
    this.setState({
      visible2: true,
    });
  }

  render() {
    const inputstyle = { color: '#000' };
    //附件信息
    let filelist = this.props.fileDataList;
    let department_stats_id = '';
    let name = '';
    let url = '';
    if (filelist.length > 0) {
      department_stats_id = filelist[0].department_stats_id;
      name = filelist[0].name;
      url = filelist[0].url;
    }
    //选择一下处理人信息
    let nextDataList = this.props.nextDataList;
    let nextpostname = '';
    let initperson = '';
    if (nextDataList.length > 0) {
      initperson = nextDataList[0].submit_user_id;
      nextpostname = nextDataList[0].submit_post_name;
    }
    const nextdataList = nextDataList.map(item =>
      <Option value={item.submit_user_id}>{item.submit_user_name}</Option>
    );

    const { getFieldDecorator } = this.props.form;
    const circulationType = this.props.circulationType;
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
    let saveViewControl = 'block';
    if (this.props.location.query.saveViewControl !== null && this.props.location.query.saveViewControl !== '' && this.props.location.query.saveViewControl !== undefined) {
      saveViewControl = this.props.location.query.saveViewControl;
    }
    if ((circulationType === "职能线加班申请")) {
      return (
        <div>
          <br />
          <div style={{ float: 'left', display: saveViewControl }}>
            <a href="/filemanage/download/needlogin/hr/overtime.xls" ><Button >{'模板下载'}</Button></a>
            &nbsp;&nbsp;&nbsp;&nbsp;
          <Excel dispatch={this.props.dispatch} />
            &nbsp;&nbsp;&nbsp;&nbsp;
          <Button onClick={this.saveInfo} disabled={!this.state.isSaveClickable}>{this.state.isSaveClickable ? '保存' : '正在处理中...'}</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
          </div>
          <div style={{ float: 'center' }}>
            <Button onClick={this.gotoHome}>关闭</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button htmlType="submit" onClick={this.handleSubmitl} disabled={!this.state.isSubmitClickable}>{this.state.isSubmitClickable ? '提交' : '正在处理中...'}</Button>
            <Modal
              title="流程处理"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel1}
            >
              <div>
                <Form>
                  <FormItem label={'下一步环节'} {...formItemLayout}>
                    <Input style={inputstyle} value={nextpostname} disabled={true} />
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
          </div>
          <br /><br />
          <p>当前申请环节：<span>接口人申请</span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            当前处理人：<span>{this.state.user_name}</span></p>
          <Row span={2} style={{ textAlign: 'center' }}><h2>{circulationType}审批表</h2></Row>
          <Card title="基本信息" className={styles.r}>
            <Form style={{ marginTop: 10 }}>
              <FormItem label="部门" {...formItemLayout}>
                {getFieldDecorator('deptname', {
                  initialValue: this.state.dept_name
                })
                  (<Input style={inputstyle} placeholder='' disabled={true} />)
                }
              </FormItem>
              <FormItem label="节假日" {...formItemLayout}>
                {getFieldDecorator('holidays', {
                  initialValue: this.props.holiday_name
                })(
                  <Select size="large" style={{ width: '100%' }} placeholder="请选择加班的节假日" disabled={false}>
                    <Option value="元旦">元旦</Option>
                    <Option value="春节">春节</Option>
                    <Option value="清明节">清明节</Option>
                    <Option value="劳动节">劳动节</Option>
                    <Option value="端午节">端午节</Option>
                    <Option value="中秋节">中秋节</Option>
                    <Option value="国庆节">国庆节</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="申请日期" {...formItemLayout}>
                {getFieldDecorator('timeApply', {
                  initialValue: this.props.create_time
                })(<span> {this.getCurrentDate()} </span>)}
              </FormItem>
            </Form>
          </Card>
          <Card title="加班申请信息" className={styles.r}>
            <br />
            <div style={{ textAlign: "right" }}>
              <Button htmlType="submit" onClick={this.addPerson} >新增</Button>
            </div>
            <br />
            <Table
              columns={this.team_columns}
              dataSource={this.props.personDataList}
              pagination={true}
              scroll={{ x: '100%', y: 450 }}
              width={'100%'}
              bordered={true}
            />
          </Card>
          <DynAddPerson visible={this.state.personAddVisible} circulationType='申请' updateParent={this.updateParent} personLength={this.props.personDataList.length} dispatch={this.props.dispatch} personDataList={this.props.personDataList}></DynAddPerson>
        </div>
      )
    }
    if (circulationType === "职能线加班统计") {
      return (
        <div>
          <br />
          <div style={{ float: 'left', display: saveViewControl }}>
            <a href="/filemanage/download/needlogin/hr/overtime.xls" ><Button >{'模板下载'}</Button></a>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Excel dispatch={this.props.dispatch} />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button onClick={this.saveStatsInfo} disabled={!this.state.isStatsSaveClickable}>{this.state.isStatsSaveClickable ? '保存' : '正在处理中...'}</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
          </div>
          <div style={{ float: 'center' }}>
            <Button onClick={this.gotoHome}>关闭</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button htmlType="submit" onClick={this.handleSubmit2} disabled={!this.state.isStatsSubmitClickable}>{this.state.isStatsSubmitClickable ? '提交' : '正在处理中...'}</Button>
            <Modal
              title="流程处理"
              visible={this.state.visible2}
              onOk={this.handleStatsOk}
              onCancel={this.handleCancel2}
            >
              <div>
                <Form>
                  <FormItem label={'下一步环节'} {...formItemLayout}>
                    <Input style={inputstyle} value={nextpostname} disabled={true} />
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
          </div>
          <br /><br />
          <p>当前申请环节：<span>接口人申请</span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            当前处理人：<span>{this.state.user_name}</span></p>
          <Row span={2} style={{ textAlign: 'center' }}><h2>{circulationType}审批表</h2></Row>
          <Card title="基本信息" className={styles.r}>
            <Form style={{ marginTop: 10 }}>
              <FormItem label="部门" {...formItemLayout}>
                {getFieldDecorator('deptname', {
                  initialValue: this.state.dept_name
                })
                  (<Input style={inputstyle} placeholder='' disabled={true} />)
                }
              </FormItem>
              <FormItem label="节假日" {...formItemLayout}>
                {getFieldDecorator('holidays', {
                  initialValue: this.props.holiday_name
                })(
                  <Select size="large" style={{ width: '100%' }} placeholder="请选择加班的节假日" disabled={false}>
                    <Option value="元旦">元旦</Option>
                    <Option value="春节">春节</Option>
                    <Option value="清明节">清明节</Option>
                    <Option value="劳动节">劳动节</Option>
                    <Option value="端午节">端午节</Option>
                    <Option value="中秋节">中秋节</Option>
                    <Option value="国庆节">国庆节</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="申请日期" {...formItemLayout}>
                {getFieldDecorator('timeApply', {
                  initialValue: create_time
                })(<span> {this.getCurrentDate()} </span>)}
              </FormItem>
            </Form>
          </Card>
          <Card title="加班统计信息" className={styles.r}>
            <br />
            <div style={{ textAlign: "right" }}>
              <Button htmlType="submit" onClick={this.addPerson} >新增</Button>
            </div>
            <br />
            <Table
              columns={this.team_columns}
              dataSource={this.props.personDataList}
              pagination={false}
            />
          </Card>
          <Card title="附件信息" className={styles.r}>
            <UpFile2 filelist={filelist}
              department_stats_id={department_stats_id}
              name={name}
              url={url} />
          </Card>
          <DynAddPerson visible={this.state.personAddVisible} circulationType='统计' updateParent={this.updateParent} personLength={this.props.personDataList.length} dispatch={this.props.dispatch} personDataList={this.props.personDataList}></DynAddPerson>
        </div>
      )
    }
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.create_approval_model,
    ...state.create_approval_model
  };
}

FunctionalCirculationApproval = Form.create()(FunctionalCirculationApproval);
export default connect(mapStateToProps)(FunctionalCirculationApproval);
