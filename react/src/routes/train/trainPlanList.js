/**
 * 文件说明: 培训查询的界面
 * 作者：shiqingpei
 * 邮箱：shiqp3@chinaunicom.cn
 * 创建日期：2019-07-08
 **/
import React, { Component } from 'react';
import { Button, Form, Input, Modal, Select, Table, Tabs, message, FormItem, Pagination, Card } from "antd";
import * as trainService from "../../services/train/trainService";
import { connect } from "dva";
import Cookie from "js-cookie";
import { routerRedux } from "dva/router";
import styles from '../train/train.less';
import exportExcel from "./ExcelExport";
import DynAddClass from "../train/DynAddClass";

const { Option } = Select;
const TabPane = Tabs.TabPane;

class trainPlanList extends Component {
  constructor(props) {
    super(props);

    let dept_name = Cookie.get('dept_name');

    const yearNow = new Date().getFullYear();
    const ou_search = Cookie.get('OU');
    this.state = {
      ou: ou_search,
      dept: dept_name,
      type: '1',
      year: yearNow,
      /*新增 begin*/

      newPlanAddVisible: false,
      //用户角色
      GeneralVisible: false,
      BranchAndDepartmentVisible: false,
      //创建类型标志
      trainPlanType: '',
      newTrainPlanType: '',
      /*新增 end*/
      /**新增时间,完成情况 */
      time: '',
      trainApplyName: "",
      status: ''
    };
  }


  //改变OU，触发查询部门服务，重新获取该OU下的部门和职务列表。
  handleOuChange = (value) => {
    this.setState({
      ou: value,
      dept: '',
    });
    const { dispatch } = this.props;
    /**查询该机构下的部门的服务 */
    dispatch({
      type: 'train_do_model/getDept',
      arg_param: value
    });

  };

  //选择部门
  handleDeptChange = (value) => {
    this.setState({
      dept: value
    })
  };

  //选择计划类型
  handleTypeChange = (value) => {
    this.setState({
      type: value
    });
  }

  //选择培训年份
  handleYearChange = (value) => {
    this.setState({
      year: value
    });
  }

  //选择培训时间
  handleTimeChange = (value) => {
    this.setState({
      time: value
    });
  }

  //选择课程请框
  handleStatusChange = (value) => {
    this.setState({
      status: value
    });
  }

  //清空查询条件，只保留OU
  clear = () => {
    this.setState({
      dept: '',
    });
  };

  //查询
  search = () => {
    let ou_search = this.state.ou;
    if (ou_search === null) {
      //防止没有值，默认为登录员工所在院
      ou_search = Cookie.get('OU');
    }

    let arg_params = {};

    arg_params["arg_page_size"] = 10;
    arg_params["arg_page_current"] = 1;
    arg_params["arg_ou_name"] = ou_search;
    arg_params["arg_train_time"] = this.state.time;
    arg_params["arg_status"] = this.state.status;
    if (this.state.dept !== '') {
      arg_params["arg_dept_name"] = this.state.dept; //部门传参加上前缀
    }
    if (this.state.type !== '') {
      arg_params["arg_type"] = this.state.type;
    }
    if (this.state.year !== '') {
      arg_params["arg_year"] = this.state.year;
    }
    const { dispatch } = this.props;
    //TODO 根据条件进行查询
    dispatch({
      type: 'train_do_model/trainPlanListQuery',
      query: arg_params
    });
  };

  /**必修两个字段都有 */
  comColumns = [
    { title: '培训计划类型', dataIndex: 'class_type' },
    { title: '培训班名称/课程方向', dataIndex: 'class_name', },
    { title: '培训年份', dataIndex: 'train_year', },
    { title: '培训时间', dataIndex: 'train_time', },
    { title: '赋分规则', dataIndex: 'assign_score', },
    { title: '培训时长', dataIndex: 'train_hour' },
    { title: '培训预算费用', dataIndex: 'train_fee' },
    { title: '学分', dataIndex: 'class_grade' },
    { title: '部门', dataIndex: 'dept_name' },
    { title: '完成情况', dataIndex: 'status', },
    {
      title: '操作', dataIndex: '', key: 'x', render: (text, record) => (
        //状态分为（1、保存  2、提交审批中  3、审批完成   4、培训完成  5、课程结束）
        <span>

          {
            record.state === '3' ?   //调整
              <span>
                <a onClick={() => this.gotoEdit(record)}>调整</a>
              </span>
              :
              <span>
                <span className={styles.noJump}>调整</span>
              </span>
          }
        </span>
      )
    },
  ];

  /**选修课程 */
  eleColumns = [
    { title: '培训计划类型', dataIndex: 'class_type' },
    { title: '培训班名称/课程方向', dataIndex: 'class_name', },
    { title: '培训年份', dataIndex: 'train_year', },
    { title: '培训时长', dataIndex: 'train_hour' },
    { title: '赋分规则', dataIndex: 'assign_score', },
    { title: '培训预算费用', dataIndex: 'train_fee' },
    { title: '学分', dataIndex: 'class_grade' },
    { title: '部门', dataIndex: 'dept_name' },
    { title: '完成情况', dataIndex: 'status', },
    {
      title: '操作', dataIndex: '', key: 'x', render: (text, record) => (
        //状态分为（1、保存  2、提交审批中  3、审批完成   4、培训完成  5、课程结束）
        <span>

          {
            record.state === '3' ?   //调整
              <span>
                <a onClick={() => this.gotoEdit(record)}>调整</a>
              </span>
              :
              <span>
                <span className={styles.noJump}>调整</span>
              </span>
          }
        </span>
      )
    },
  ];

  /**通用培训课程字段 */
  deptColumns1 = [
    { title: '培训计划类型', dataIndex: 'class_type' },
    { title: '培训班名称/课程方向', dataIndex: 'class_name', },
    { title: '培训年份', dataIndex: 'train_year', },
    { title: '培训时间', dataIndex: 'train_time', },
    { title: '赋分规则', dataIndex: 'assign_score', },
    { title: '培训时长', dataIndex: 'train_hour' },
    { title: '培训预算费用', dataIndex: 'train_fee' },
    { title: '学分', dataIndex: 'class_grade' },
    { title: '部门', dataIndex: 'dept_name' },
    { title: '完成情况', dataIndex: 'status', },
    {
      title: '操作', dataIndex: '', key: 'x', render: (text, record) => (
        //状态分为（1、保存  2、提交审批中  3、审批完成   4、培训完成  5、课程结束）
        <span>

          {
            record.state === '3' ?   //调整
              <span>
                <a onClick={() => this.gotoEdit(record)}>调整</a>
              </span>
              :
              <span>
                <span className={styles.noJump}>调整</span>
              </span>
          }
        </span>
      )
    },
  ];
  deptColumns2 = [
    { title: '培训计划类型', dataIndex: 'class_type' },
    { title: '培训班名称/课程方向', dataIndex: 'class_name', },
    { title: '培训年份', dataIndex: 'train_year', },
    { title: '培训时间', dataIndex: 'train_time', },
    { title: '赋分规则', dataIndex: 'assign_score', },
    { title: '培训时长', dataIndex: 'train_hour' },
    { title: '培训预算费用', dataIndex: 'train_fee' },
    { title: '学分', dataIndex: 'class_grade' },
    { title: '部门', dataIndex: 'dept_name' },
    { title: '完成情况', dataIndex: 'status', },
    {
      title: '操作', dataIndex: '', key: 'x', render: (text, record) => (
        //状态分为（1、保存  2、提交审批中  3、审批完成   4、培训完成  5、课程结束）
        <span>

          {
            record.state === '3' ?   //调整
              <span>
                <a onClick={() => this.gotoEdit(record)}>调整</a>
              </span>
              :
              <span>
                <span className={styles.noJump}>调整</span>
              </span>
          }
        </span>
      )
    },
  ];

  deptColumns3 = [
    { title: '培训计划类型', dataIndex: 'class_type' },
    { title: '培训班名称/课程方向', dataIndex: 'class_name', },
    { title: '培训年份', dataIndex: 'train_year', },
    { title: '培训时间', dataIndex: 'train_time', },
    { title: '赋分规则', dataIndex: 'assign_score', },
    { title: '培训时长', dataIndex: 'train_hour' },
    { title: '培训预算费用', dataIndex: 'train_fee' },
    { title: '学分', dataIndex: 'class_grade' },
    { title: '部门', dataIndex: 'dept_name' },
    { title: '完成情况', dataIndex: 'status', },
    {
      title: '操作', dataIndex: '', key: 'x', render: (text, record) => (
        //状态分为（1、保存  2、提交审批中  3、审批完成   4、培训完成  5、课程结束）
        <span>

          {
            record.state === '3' ?   //调整
              <span>
                <a onClick={() => this.gotoEdit(record)}>调整</a>
              </span>
              :
              <span>
                <span className={styles.noJump}>调整</span>
              </span>
          }
        </span>
      )
    },
  ];
  deptColumns4 = [
    { title: '培训计划类型', dataIndex: 'class_type' },
    { title: '培训班名称/课程方向', dataIndex: 'class_name', },
    { title: '培训年份', dataIndex: 'train_year', },
    { title: '培训时间', dataIndex: 'train_time', },
    { title: '赋分规则', dataIndex: 'assign_score', },
    { title: '培训时长', dataIndex: 'train_hour' },
    { title: '培训预算费用', dataIndex: 'train_fee' },
    { title: '学分', dataIndex: 'class_grade' },
    { title: '部门', dataIndex: 'dept_name' },
    { title: '完成情况', dataIndex: 'status', },
    {
      title: '操作', dataIndex: '', key: 'x', render: (text, record) => (
        //状态分为（1、保存  2、提交审批中  3、审批完成   4、培训完成  5、课程结束）
        <span>

          {
            record.state === '3' ?   //调整
              <span>
                <a onClick={() => this.gotoEdit(record)}>调整</a>
              </span>
              :
              <span>
                <span className={styles.noJump}>调整</span>
              </span>
          }
        </span>
      )
    },
  ];
  /**考试的字段 */
  examColumns = [
    { title: '培训计划类型', dataIndex: 'class_type' },
    { title: '考试名称', dataIndex: 'class_name', },
    { title: '考试年份', dataIndex: 'train_year', },
    { title: '考试时间', dataIndex: 'train_time', },
    { title: '人员姓名', dataIndex: 'exam_person_name', },
    { title: '考试预算费用', dataIndex: 'train_fee' },
    { title: '学分', dataIndex: 'class_grade' },
    { title: '部门', dataIndex: 'dept_name' },
    { title: '完成情况', dataIndex: 'status', },
    {
      title: '操作', dataIndex: '', key: 'x', render: (text, record) => (
        //状态分为（1、保存  2、提交审批中  3、审批完成   4、培训完成  5、课程结束）
        <span>

          {
            record.state === '3' ?   //调整
              <span>
                <a onClick={() => this.gotoEdit(record)}>调整</a>
              </span>
              :
              <span>
                <span className={styles.noJump}>调整</span>
              </span>
          }
        </span>
      )
    },
  ];


  /*新增单条或多条 begin*/
  //根据登陆用户身份确定可以创建的培训类型：判断身份进入不同的modal。
  //用户身份：总院人力接口人（新增全院计划和总院人力部门计划）、分院人力接口人（新增分院计划和分院人力部门计划）、部门接口人（提交部门计划）
  addNewPlan = () => {
    const userRoleData = this.props.permission;

    //总院人力接口人
    if (userRoleData === '2' && Cookie.get("OUID") === 'e65c02c2179e11e6880d008cfa0427c4') {
      this.setState({
        GeneralVisible: true,
      });
    } else
    //分院、部门一级儿级接口人
    {
      this.setState({
        BranchAndDepartmentVisible: true,
      });
    }
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
    //跳转到新增单条或者多条界面
    let query = {
      trainPlanType: this.state.trainPlanType,
    };

    if (!query.trainPlanType) {
      message.error('请选择新增培训计划类型！');
    } else {
      //总院全院级必修课培训计划\总院全院级选修课培训计划\分院-部门通用\认证考试计划
      dispatch(routerRedux.push({
        pathname: '/humanApp/train/trainPlanList/DynAddClass',
        query
      }));
    }
  };
  //分院、部门接口人提交
  handleBranchAndDepartmentOk = () => {
    const { dispatch } = this.props;
    this.setState({
      BranchAndDepartmentVisible: false,
    });
    //跳转到新增单条或者多条界面
    let query = {
      trainPlanType: this.state.trainPlanType,
    };
    if (!query.trainPlanType) {
      message.error('请选择新增培训计划类型！');
    } else {
      //总院全院级必修课培训计划\总院全院级选修课培训计划\分院-部门通用\认证考试计划
      dispatch(routerRedux.push({
        pathname: '/humanApp/train/trainPlanList/DynAddClass',
        query
      }));
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


  /*新增单条或多条 end*/




  //处理分页
  handlePageChange = (page) => {
    //TODO获取参数
    let queryParams = {};

    queryParams["arg_ou_name"] = this.state.ou;
    queryParams["arg_dept_name"] = this.state.dept;
    queryParams["arg_type"] = this.state.type;
    queryParams["arg_year"] = this.state.year;
    queryParams["arg_page_current"] = page;   //初始化当前页码为1
    queryParams["arg_page_size"] = 10;  //初始化页面显示条数为10

    queryParams["arg_train_time"] = this.state.time;
    queryParams["arg_status"] = this.state.status;

    const { dispatch } = this.props;
    //TODO
    dispatch({
      type: 'train_do_model/trainPlanListQuery',
      query: queryParams
    });
  };

  //对培训计划进行调整
  gotoEdit = (record) => {
    const { dispatch } = this.props;
    console.log("跳转到列表页面");
    console.log(record);

    if (record.type === '1') {
      //总院级必修
      dispatch(routerRedux.push({
        pathname: '/humanApp/train/train_do/centerComEdit',
        query: record
      }));
    } else if (record.type === '2') {
      //总院选修
      dispatch(routerRedux.push({
        pathname: '/humanApp/train/train_do/centerEleEdit',
        query: record
      }));
    } else if (record.type === '3' || record.type === '4' || record.type === '5' || record.type === '7') {
      //培训1
      dispatch(routerRedux.push({
        pathname: '/humanApp/train/train_do/deptPlanEdit',
        query: record
      }));

    } else if (record.type === '6') {
      //认证计划
      dispatch(routerRedux.push({
        pathname: '/humanApp/train/train_do/examEdit',
        query: record
      }));
    }
  };


  //导出应该是根据当前搜索的条件，查询完后再导出
  exportExcel = () => {

    const { tableDataListTotal } = this.props;

    const exportType = this.state.type;
    let condition = {};
    if (exportType === '1') {
      condition = {
        '培训计划类型': 'class_type',
        '课程名称': 'class_name',
        '培训年份': 'train_year',
        '培训时间': 'train_time',
        '赋分规则': 'assign_score',
        '培训时长': 'train_hour',
        '培训预算费用': 'train_fee',
        '学分': 'class_grade',
        '部门': 'dept_name',
        '完成情况': 'status',
      };
    } else if (exportType === '2') {
      condition = {
        '培训计划类型': 'class_type',
        '课程名称': 'class_name',
        '培训年份': 'train_year',
        '培训时长': 'train_hour',
        '培训预算费用': 'train_fee',
        '学分': 'class_grade',
        '部门': 'dept_name',
        '完成情况': 'status'
      };
    } else if (exportType === '3' || exportType === '4' || exportType === '5' || exportType === '7') {
      condition = {
        '培训计划类型': 'class_type',
        '课程名称': 'class_name',
        '培训年份': 'train_year',
        '培训时间': 'train_time',
        '赋分规则': 'assign_score',
        '培训时长': 'train_hour',
        '培训预算费用': 'train_fee',
        '学分': 'class_grade',
        '部门': 'dept_name',
        '完成情况': 'status'
      };
    }
    else if (exportType === '6') {
      condition = {
        '培训计划类型': 'class_type',
        '考试名称': 'class_name',
        '考试年份': 'train_year',
        '考试时间': 'train_time',
        '考试预算费用': 'train_fee',
        '学分': 'class_grade',
        '部门': 'dept_name',
        '完成情况': 'status'
      };
    }
    console.log(tableDataListTotal.length + "dasdasdasdasdasda");

    if (tableDataListTotal.length > 0) {
      exportExcel(tableDataListTotal, '课程数据', condition);
    } else {
      message.info("无课程数据");
    }



  }

  render() {

    const { loading, tableDataList, ouList, deptList, permission, typeFlag } = this.props;

    let columns = [];
    /**根据查询条件来确定列名 */
    if (typeFlag === '1') {
      columns = this.comColumns;
    } else if (typeFlag === '2') {
      columns = this.eleColumns;
    } else if (typeFlag === '3') {
      columns = this.deptColumns1;
    } else if (typeFlag === '4') {
      columns = this.deptColumns2;
    } else if (typeFlag === '5') {
      columns = this.deptColumns3;
    } else if (typeFlag === '6') {
      columns = this.examColumns;
    } else if (typeFlag === '7') {
      columns = this.deptColumns4;
    }

    // if(permission==='1'){
    //   this.setState({
    //     dept: Cookie.get("dept_name")
    //   });
    // }


    const children = [];
    for (let i = 10; i < 36; i++) {
      children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    }

    const ouOptionList = ouList.map((item) => {
      return (
        <Option key={item.OU}>
          {item.OU}
        </Option>
      )
    });
    let deptOptionList = deptList.map((item) => {
      return (
        <Option key={item}>
          {item}
        </Option>
      )
    });

    deptOptionList.push(<Option key='' value=''>全部</Option>);

    //获取前三年的年份
    let date = new Date;
    console.log(date.getFullYear());
    let yearArray = [];
    for (let i = 0; i < 3; i++) {
      yearArray.push(date.getFullYear() - i);
    }
    const currentDate = date.getFullYear();
    console.log(yearArray);

    const yearList = yearArray.map((item) => {
      return (
        <Option key={item} value={item.toString()}>
          {item}
        </Option>
      )
    });

    // 这里为每一条记录添加一个key，从0开始
    if (tableDataList.length) {
      tableDataList.map((i, index) => {
        i.key = index;
      })
    }

    const auth_ou = Cookie.get('OU');

    const defaultType = '1';
    return (
      <div>
        <Card>
          <div style={{ marginBottom: '15px' }}>

            <span>组织机构：</span>
            <Select style={{ width: 160 }} onSelect={this.handleOuChange} defaultValue={auth_ou} disabled={true}>
              {ouOptionList}
            </Select>

            &nbsp;&nbsp;&nbsp;&nbsp;部门：
                <Select style={{ width: 200 }} onSelect={this.handleDeptChange} value={this.state.dept} disabled={permission === '2' ? false : true}>
              {deptOptionList}
            </Select>
            &nbsp;&nbsp;&nbsp;&nbsp;计划类型：
                <Select style={{ width: 200 }} onSelect={this.handleTypeChange} defaultValue={defaultType}>

              <Option value='1'>全院级必修课</Option>
              <Option value='2'>全院级选修课</Option>
              <Option value='3'>全院级-其他培训计划</Option>
              <Option value='4'>分院级培训计划</Option>
              <Option value='5'>部门级培训计划</Option>
              <Option value='6'>认证考试</Option>
              <Option value='7'>内训-培训班</Option>
            </Select>
            &nbsp;&nbsp;&nbsp;&nbsp;培训年份：
                <Select style={{ width: 120 }} onSelect={this.handleYearChange} defaultValue={currentDate}>
              {yearList}
            </Select>
            <br></br>
            <br></br>
            培训时间：
                <Select style={{ width: 200 }} onSelect={this.handleTimeChange} defaultValue='全部'>
              <Option value=''>全部</Option>
              <Option value='第一季度'>第一季度</Option>
              <Option value='第二季度'>第二季度</Option>
              <Option value='第三季度'>第三季度</Option>
              <Option value='第四季度'>第四季度</Option>
              <Option value='全年执行'>全年执行</Option>
            </Select>
            &nbsp;&nbsp;&nbsp;&nbsp;完成情况：
                <Select style={{ width: 200 }} onSelect={this.handleStatusChange} defaultValue='全部'>
              <Option value=''>全部</Option>
              <Option value='3'>审批完成</Option>
              <Option value='4'>培训完成</Option>
              <Option value='5'>课程结束</Option>
              <Option value='6'>调整中</Option>
            </Select>

            <div className={styles.btnLayOut}>
              <Button type="primary" onClick={() => this.search()}>{'查询'}</Button>

              &nbsp;&nbsp;&nbsp;
                  <Button type="primary" onClick={() => this.addNewPlan()}>{'新增'}</Button>
              &nbsp;&nbsp;&nbsp;
                  <Button type="primary" onClick={() => this.exportExcel()}>{'导出'}</Button>
            </div>
          </div>
          {/*总院人力资源部*/}
          <Modal
            title="选择新增培训计划模板类型"
            visible={this.state.GeneralVisible}
            onOk={this.handleGeneralOk}
            onCancel={this.handleGeneralCancel}
          >
            <div>
              <Select size="large" style={{ width: 200 }} defaultValue="选择新增培训计划模板类型" onSelect={this.createGeneral.bind(this)}>
                <Option value="general_compulsory_train_plan">全院级（必修课）培训计划</Option>
                <Option value="general_elective_train_plan">全院级（选修课）培训计划</Option>
                <Option value="branch_department_train">通用培训计划</Option>
                <Option value="train_certification">认证考试计划</Option>
              </Select>
              <div><center> {this.state.trainApplyName}</center></div>
            </div>
          </Modal>
          {/*分院、部门培训*/}
          <Modal
            title="选择新增培训计划模板类型"
            visible={this.state.BranchAndDepartmentVisible}
            onOk={this.handleBranchAndDepartmentOk}
            onCancel={this.handleBranchAndDepartmentCancel}
          >
            <div>
              <Select size="large" style={{ width: 200 }} defaultValue="请选择新增培训计划" onSelect={this.createBranchAndDepartment}>
                <Option value="branch_department_train">通用培训计划</Option>
                <Option value="train_certification">认证考试计划</Option>
              </Select>
              <div><center> {this.state.trainApplyName}</center></div>
            </div>
          </Modal>




          <Table
            columns={columns}
            dataSource={tableDataList}
            pagination={false}
            loading={loading}
            bordered={true}
          />
          <br></br>
          <div style={{ textAlign: 'center' }}>
            {/*加载完才显示页码*/}
            {loading !== true ?
              <Pagination current={this.props.currentPage}
                total={Number(this.props.total)}
                pageSize={10}
                onChange={this.handlePageChange}
              />
              :
              null
            }
          </div>
        </Card>


      </div>);

  }

}

function mapStateToProps(state) {
  const {
    tableDataList,
    ouList,
    deptList,
    total,
    currentPage
  } = state.train_do_model;
  return {
    loading: state.loading.models.train_do_model,
    ...state.train_do_model,
    tableDataList,
    ouList,
    deptList,
    total,
    currentPage
  };
}
export default connect(mapStateToProps)(trainPlanList);

