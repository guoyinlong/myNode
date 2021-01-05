/**
 * 作者：翟金亭
 * 创建日期：2019-05-23
 * 邮箱：zhaijt3@chinaunicom.cn
 * 功能：实现创建部门加班审批流程功能
 * 入参：加班申请类型：部门加班申请
 */
import React, { Component } from "react";
import { Button, Row, Form, Input, Card, Table, Select, message, Modal } from "antd";

const FormItem = Form.Item;
const { Option } = Select;
import styles from './style.less';
import { connect } from "dva";
import { routerRedux } from "dva/router";
import Cookie from "js-cookie";

class DeptCirculationApproval extends Component {
  constructor(props) {
    super(props);
    let user_name = Cookie.get('username');
    let user_id = Cookie.get('userid');
    let dept_id = Cookie.get('dept_id');
    let dept_name = Cookie.get('dept_name');
    this.state = {
      dateFlag: false,
      displayFlag: "none",
      visible: false,
      visible2: false,
      user_name: user_name,
      dept_name: dept_name,
      user_id: user_id,
      dept_id: dept_id,
      saveViewFlag: '',
      choiseHolydays: "none",
      personvisible: false,
      selectedRowKeys: [],
      isSubmitClickable: true,
      isStatsSubmitClickable: true,
    };
  }

  getCurrentDate() {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    return `${year}年${month < 10 ? `0${month}` : `${month}`}月${date < 10 ? `0${date}` : `${date}`}日`
  }

  dept_columns = [
    { title: '编号', dataIndex: 'key' },
    { title: '项目组', dataIndex: 'proj_name' },
    {
      title: '操作', dataIndex: '', key: 'x', render: (text, record, index) => (
        <span>
          {
            record.file_relativepath
              ?
              <span>
                <a onClick={() => this.gotoTeamDetails(record)}>查看</a> &nbsp;&nbsp;
              <a href={record.file_relativepath}>附件</a>
              </span>
              :
              <a onClick={() => this.gotoTeamDetails(record)}>查看</a>
          }
        </span>
      )
    },
  ];
  /*加班人员详情*/
  team_details_columns = [
    { title: '序号', dataIndex: 'indexID' },
    { title: '员工编号', dataIndex: 'user_id' },
    { title: '姓名', dataIndex: 'user_name' },
    { title: '加班日期', dataIndex: 'overtime_time' },
    { title: '加班原因', dataIndex: 'overtime_reson' },
    { title: '加班地点', dataIndex: 'overtime_place' },
    { title: '天数', dataIndex: 'remark' },
  ];

  approval_columns = [
    { title: '编号', dataIndex: 'key' },
    { title: '项目', dataIndex: 'proj_name' },
    { title: '项目负责人', dataIndex: 'user_name' },
    { title: '审核意见', dataIndex: 'comment_detail' },
    { title: '审核时间', dataIndex: 'comment_time' },
  ];
  //初始信息查询，默认查询流转中
  componentDidMount() {
    this.props.dispatch({
      type: 'create_approval_model/staffInfoSearch',
    })
  }
  //结束关闭
  gotoHome = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/overtime/overtime_index'
    }));
  }

  /*********start*********/
  handleOk = (e) => {
    const { dispatch } = this.props;
    this.setState({ isSubmitClickable: false });
    this.setState({
      visible: false,
    });
    /*非空校验*/
    let holiday = this.props.form.getFieldValue("holidays");
    let teamDataList = this.props.teamDataList;
    if (holiday === null || holiday === '' || holiday === undefined) {
      message.error('节假日不能为空');
      return;
    }

    //多选项目组加班进行提交
    const selectedRowKeys = this.state.selectedRowKeys;
    let selectedItem = [];
    if (selectedRowKeys.length < 1) {
      message.error('请勾选需要汇总的项目组');
      this.setState({
        isSubmitClickable: true
      })
      return;
    } else {
      for (let j = 0; j < teamDataList.length; j++) {
        for (let i = 0; i < selectedRowKeys.length; i++) {
          let m = this.state.selectedRowKeys[i];
          if (m === teamDataList[j].key) {
            selectedItem.push(teamDataList[j]);
          }
        }
      }
    }
    /*
     首先封装overtime_department_apply表信息 ,封装已有的参数，工作流的proc_inst_id要在model层中进行填写
     */
    let basicInfoData = {};
    let department_apply_id = this.state.user_id + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32);
    basicInfoData["arg_department_apply_id"] = department_apply_id;
    basicInfoData["arg_deptid"] = this.state.dept_id;
    basicInfoData["arg_holiday_name"] = holiday;
    basicInfoData["arg_create_person"] = this.state.user_id;
    basicInfoData["arg_create_time"] = this.props.form.getFieldValue("timeApply");
    basicInfoData["arg_post_id"] = '9ca4d30fb3b311e6a01d02428ca3c6ff';  //部门接口人的id
    basicInfoData["arg_status"] = '1';

    /*
    然后封装overtime_department_team表信息，有多少个项目加班就有多少条信息，
    */
    let transforTeamDataList = [];
    selectedItem.map((item) => {
      let temp = {
        arg_department_team_id: item.proj_id,  //项目id
        arg_department_apply_id: department_apply_id,  //申请id
        arg_team_apply_id: item.team_apply_id  //项目申请id
      };
      transforTeamDataList.push(temp);
    });

    /*
    封装overtime_department_approval表信息，封装两条信息
    */
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
    // approvalData["arg_task_name"] ='';

    //下一环节
    let approvalData1 = {};
    // approvalData1["arg_department_comment_id"]= '';
    approvalData1["arg_department_apply_id"] = department_apply_id;
    // approvalData1["arg_task_id"] = '';
    approvalData1["arg_deptid"] = this.state.dept_id;
    //下一环节处理人
    approvalData1["arg_user_id"] = this.props.form.getFieldValue("nextstepPerson");
    approvalData1["arg_user_name"] = '';
    approvalData1["arg_post_id"] = '9cc1079db3b311e6a01d02429ca3c6ff';  //有问题
    approvalData1["arg_comment_detail"] = '';
    approvalData1["arg_comment_time"] = '';
    approvalData1["arg_state"] = '2';
    // approvalData1["arg_task_name"]= '';

    return new Promise((resolve) => {
      dispatch({
        type: 'create_approval_model/departmentApprovalSubmit',
        basicInfoData,
        transforTeamDataList,
        approvalData,
        approvalData1,
        department_apply_id,
        resolve
      });
    }).then((resolve) => {
      if (resolve === 'success') {
        this.setState({ isSubmitClickable: true });
        setTimeout(() => {
          dispatch(routerRedux.push({
            pathname: '/humanApp/overtime/overtime_index'
          }));
        }, 500);
      }
      if (resolve === 'false') {
        this.setState({ isSubmitClickable: true });
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname: '/humanApp/overtime/overtime_index'
      }));
    });
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  handleSubmit = (e) => {
    this.setState({
      visible: true,
    });
  }

  //查看按钮跳转到加班管理界面
  gotoTeamDetails = (record) => {
    if ((record.team_apply_id !== null) && (record.team_apply_id !== " ") && (record.team_apply_id !== undefined)) {
      const { dispatch } = this.props;
      let orig_proc_task_id = record.team_apply_id;
      dispatch({
        type: 'create_approval_model/queryTeamList',
        orig_proc_task_id,
      });
    } else if ((record.team_stats_id !== null) && (record.team_stats_id !== " ") && (record.team_stats_id !== undefined)) {
      const { dispatch } = this.props;
      let orig_proc_task_id = record.team_stats_id;
      dispatch({
        type: 'create_approval_model/queryTeamListSta',
        orig_proc_task_id,
      });
    }
    this.setState({
      personvisible: true,
    });
  }

  handleOk3 = () => {
    this.setState({
      personvisible: false,
    });
  }
  handleCancel3 = () => {
    this.setState({
      personvisible: false,
    });
  }

  //加班统计申请创建
  handleOk2 = (e) => {
    const { dispatch } = this.props;
    this.setState({ isStatsSubmitClickable: false });
    this.setState({
      visible2: false,
    });
    /*非空校验*/
    let holiday = this.props.form.getFieldValue("holidays");
    let teamDataList = this.props.teamDataList;
    if (holiday === null || holiday === '' || holiday === undefined) {
      message.error('节假日不能为空');
      return;
    }

    //多选项目组加班进行提交
    const selectedRowKeys = this.state.selectedRowKeys;
    let selectedItem = [];
    if (selectedRowKeys.length < 1) {
      message.error('请勾选需要汇总的项目组');
      this.setState({
        isStatsSubmitClickable: true
      })
      return;
    } else {
      for (let j = 0; j < teamDataList.length; j++) {
        for (let i = 0; i < selectedRowKeys.length; i++) {
          let m = this.state.selectedRowKeys[i];
          if (m === teamDataList[j].key) {
            selectedItem.push(teamDataList[j]);
          }
        }
      }
    }
    /*
     首先封装overtime_department_stats表信息 ,封装已有的参数，工作流的proc_inst_id要在model层中进行填写
     */
    let basicInfoData = {};
    let department_stats_id = this.state.user_id + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32);
    basicInfoData["arg_department_stats_id"] = department_stats_id;
    basicInfoData["arg_deptid"] = this.state.dept_id;
    basicInfoData["arg_holiday_name"] = holiday;
    basicInfoData["arg_create_person"] = this.state.user_id;
    basicInfoData["arg_create_time"] = this.props.form.getFieldValue("timeApply");
    basicInfoData["arg_post_id"] = '9ca4d30fb3b311e6a01d02428ca3c6ff';  //部门接口人的id
    basicInfoData["arg_status"] = '1';

    /*
    然后封装overtime_stats_department_team表信息，有多少个项目加班就有多少条信息，
    */
    let transforTeamDataList = [];
    selectedItem.map((item) => {
      let temp = {
        arg_department_stats_team_id: item.proj_id,  //项目id
        arg_department_stats_id: department_stats_id,  //申请id
        arg_team_stats_id: item.team_stats_id  //项目申请id
      };
      transforTeamDataList.push(temp);
    });

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

    return new Promise((resolve) => {
      dispatch({
        type: 'create_approval_model/departmentStatsApprovalSubmit',
        basicInfoData,
        transforTeamDataList,
        approvalData,
        approvalData1,
        department_stats_id,
        resolve
      });
    }).then((resolve) => {
      if (resolve === 'success') {
        this.setState({ isStatsSubmitClickable: true });
        setTimeout(() => {
          dispatch(routerRedux.push({
            pathname: '/humanApp/overtime/overtime_index'
          }));
        }, 500);
      }
      if (resolve === 'false') {
        this.setState({ isStatsSubmitClickable: true });
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname: '/humanApp/overtime/overtime_index'
      }));
    });
  }
  handleCancel2 = (e) => {
    this.setState({
      visible2: false,
    });
  }
  handleSubmit2 = (e) => {
    this.setState({
      visible2: true,
    });
  }
  /*********end***********/

  //选择节假日之后显示信息--部门加班申请
  choiseHolydaysonClick = (value) => {
    this.setState({
      choiseHolydays: "",
    })
    //获取部门id
    let dept_id = Cookie.get('dept_id');

    const { dispatch } = this.props;
    let param = {
      dept_id: dept_id,
      holiday: value,
      if_submit: '0'
    };
    dispatch({
      type: 'create_approval_model/deptQuery',
      param
    });
    dispatch({
      type: 'create_approval_model/approvalQuery',
      param
    });
  }

  //选择节假日之后显示信息--部门加班统计
  choiseHolydaysonClickStats = (value) => {
    this.setState({
      choiseHolydays: "",
    })
    //获取部门id
    let dept_id = Cookie.get('dept_id');

    const { dispatch } = this.props;
    let param = {
      dept_id: dept_id,
      holiday: value
    };
    dispatch({
      type: 'create_approval_model/deptStatsQuery',
      param
    });
    dispatch({
      type: 'create_approval_model/deptStatsApprovalQuery',
      param
    });
  }

  //选择多个项目组进行提交
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }


  render() {
    const inputstyle = { color: '#000' };
    //附件信息
    //获取下载文件列表
    let filelist = this.props.fileDataList;
    for (let i = 0; i < filelist.length; i++) {
      filelist[i].uid = i + 1;
      filelist[i].status = "done";
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
    const { teamDataList } = this.props;
    const { approvalDataList } = this.props;

    let personData = this.props.personDataList;
    for (let i = 0; i < personData.length; i++) {
      personData[i].indexID = i + 1;
    }

    if (teamDataList && teamDataList.length) {
      teamDataList.map((i, index) => {
        i.key = index + 1;
      })
    }

    if (approvalDataList && approvalDataList.length) {
      approvalDataList.map((i, index) => {
        i.key = index + 1;
      })
    }

    if (circulationType) {
      this.state.saveViewFlag = '';
    } else {
      this.state.saveViewFlag = 'none';
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

    //多选项目组进行提交
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      //禁用框
      /*      getCheckboxProps: record => ({
              disabled: !record,    // Column configuration not to be checked
            }),*/
    };
    var hasSelected = 0;
    if (selectedRowKeys) {
      hasSelected = selectedRowKeys.length > 0;
    }

    //创建时传入circulationType创建类型，查看时传入该条记录的审批流程名称
    if (circulationType === "部门加班申请") {
      return (
        <div>
          <br />
          <Button onClick={this.gotoHome}>关闭</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" htmlType="submit" onClick={this.handleSubmit} disabled={!this.state.isSubmitClickable}>{this.state.isSubmitClickable ? '提交' : '正在处理中...'}</Button>
          <Modal
            title="流程处理"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
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
                    <Select size="large" style={{ width: '100%' }} initialValue={initperson} placeholder="请选择团队负责人">
                      {nextdataList}
                    </Select>)}
                </FormItem>
              </Form>
            </div>
          </Modal>

          <br /><br />
          <p>当前申请环节：<span>部门接口人申请</span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            当前处理人：<span>{this.state.user_name}</span></p>
          <Row span={2} style={{ textAlign: 'center' }}><h2>{circulationType}审批表</h2></Row>
          <Card title="基本信息" className={styles.card}>
            <Form style={{ marginTop: 10 }}>
              <FormItem label="部门" {...formItemLayout}>
                {getFieldDecorator('deptname', {
                  initialValue: this.state.dept_name
                })
                  (<Input style={inputstyle} placeholder='' disabled={true} />)
                }
              </FormItem>
              {/*点击节假日触发加班申请汇总表数据展示*/}
              <FormItem label="节假日" {...formItemLayout}>
                {getFieldDecorator('holidays', {
                  initialValue: ''
                })(
                  <Select size="large" style={{ width: '100%' }} placeholder="请选择加班的节假日" disabled={false} onChange={this.choiseHolydaysonClick}>
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
              {/*加班管理创建首页传过来*/}
              <FormItem label="申请日期" {...formItemLayout}>
                {getFieldDecorator('timeApply', {
                  initialValue: create_time
                })(<span> {this.getCurrentDate()} </span>)}
              </FormItem>
            </Form>
          </Card>
          <Card title="加班申请汇总" className={styles.card} style={{ display: this.state.choiseHolydays }}>
            <span style={{ marginLeft: 8 }}>{hasSelected ? `已选中 ${selectedRowKeys.length}个项目组` : ''}</span>
            <Table
              //选择指定的项目组进行提交
              rowSelection={rowSelection}
              columns={this.dept_columns}
              //这里的信息是点击节假日查询出来的列表信息
              dataSource={teamDataList}
              pagination={false}
            />
          </Card>
          <Modal
            title="加班人员列表"
            visible={this.state.personvisible}
            onOk={this.handleOk3}
            onCancel={this.handleCancel3}
            width={"75%"}
          >
            <div>
              <Card title="加班申请汇总">
                <Table
                  columns={this.team_details_columns}
                  dataSource={personData}
                  pagination={false}
                />
              </Card>
            </div>
          </Modal>
          {/*添加审批意见，点击节假日后显示*/}
          {/* <Card title={<div style={{textAlign: "left"}} >审批意见</div>} style={{display: this.state.choiseHolydays}} className={styles.card} bordered={true} >
            <Table
              columns = {this.approval_columns}
              dataSource={approvalDataList}
              pagination={false}
            />
          </Card> */}
        </div>
      )
    }
    if (circulationType === "部门加班统计") {
      return (
        <div>
          <br />
          <Button onClick={this.gotoHome}>关闭</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" htmlType="submit" onClick={this.handleSubmit2} disabled={!this.state.isStatsSubmitClickable}>{this.state.isStatsSubmitClickable ? '提交' : '正在处理中...'}</Button>
          <Modal
            title="流程处理"
            visible={this.state.visible2}
            onOk={this.handleOk2}
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
                    <Select size="large" style={{ width: '100%' }} initialValue={initperson} placeholder="请选择团队负责人">
                      {nextdataList}
                    </Select>)}
                </FormItem>
              </Form>
            </div>
          </Modal>
          <br /><br />
          <p>当前申请环节：<span>部门接口人申请</span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            当前处理人：<span>{this.state.user_name}</span></p>
          <Row span={2} style={{ textAlign: 'center' }}><h2>{circulationType}审批表</h2></Row>
          <Card title="基本信息" className={styles.card}>
            <Form style={{ marginTop: 10 }}>
              <FormItem label="部门" {...formItemLayout}>
                {getFieldDecorator('deptname', {
                  initialValue: this.state.dept_name
                })
                  (<Input style={inputstyle} placeholder='' disabled={true} />)
                }
              </FormItem>
              {/*点击节假日触发加班申请汇总表数据展示*/}
              <FormItem label="节假日" {...formItemLayout}>
                {getFieldDecorator('holidays', {
                  initialValue: ''
                })(
                  <Select size="large" style={{ width: '100%' }} placeholder="请选择加班的节假日" disabled={false} onChange={this.choiseHolydaysonClickStats}>
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
              {/*加班管理创建首页传过来*/}
              <FormItem label="申请日期" {...formItemLayout}>
                {getFieldDecorator('timeApply', {
                  initialValue: create_time
                })(<span> {this.getCurrentDate()} </span>)}
              </FormItem>
            </Form>
          </Card>
          <Card title="加班统计汇总" className={styles.card} style={{ display: this.state.choiseHolydays }}>
            <span style={{ marginLeft: 8 }}>{hasSelected ? `已选中 ${selectedRowKeys.length}个项目组` : ''}</span>
            <Table
              //选择指定的项目组进行提交
              rowSelection={rowSelection}
              columns={this.dept_columns}
              //这里的信息是点击节假日查询出来的列表信息
              dataSource={teamDataList}
              pagination={true}
              scroll={{ x: '100%', y: 450 }}
              width={'100%'}
              bordered={true}
            />
          </Card>
          <Modal
            title="加班人员列表"
            visible={this.state.personvisible}
            onOk={this.handleOk3}
            onCancel={this.handleCancel3}
            width={"75%"}
          >
            <div>
              <Card title="加班申请汇总">
                <Table
                  columns={this.team_details_columns}
                  dataSource={personData}
                  pagination={true}
                  scroll={{ x: '100%', y: 450 }}
                  width={'100%'}
                  bordered={true}
                />
              </Card>
            </div>
          </Modal>
          {/*添加审批意见，点击节假日后显示*/}
          {/* <Card title={<div style={{textAlign: "left"}} >审批意见</div>} style={{display: this.state.choiseHolydays}} className={styles.card} bordered={true} >
            <Table
              columns = {this.approval_columns}
              dataSource={approvalDataList}
              pagination={false}
            />
          </Card> */}


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

DeptCirculationApproval = Form.create()(DeptCirculationApproval);
export default connect(mapStateToProps)(DeptCirculationApproval);
