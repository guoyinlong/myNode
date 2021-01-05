/**
 * 作者：靳沛鑫
 * 日期：2019-05-28
 * 邮箱：1677401802@qq.com
 * 文件说明：岗位信息
 */
// eslint-disable-next-line react/jsx-filename-extension
import React, { PureComponent } from "react";
import { connect } from "dva";
import {
  Upload,
  message,
  Table,
  Modal,
  Icon,
  Select,
  DatePicker,
  Input,
  Checkbox,
  InputNumber,
  Button,
  Spin,
  Row,
  Col,
  Form,
  Popconfirm,
} from "antd";
import exportExl from "../../../components/commonApp/exportExl";
import styles from "./corePosts.less";
const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

class PostInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      //expand: false,
      visible1: false,
      //autoCompleteResult: [],
    };
  }

  /**
   * 作者：靳沛鑫
   * 日期：2019-05-28
   * 邮箱：1677401802@qq.com
   * 文件说明：保存搜索内容
   */
  saveSelectInfo = (value, typeItem) => {
    const { dispatch } = this.props;
    dispatch({
      type: "postInfo/saveSelectInfo",
      value: value,
      typeItem: typeItem,
    });
  };
  /**
   * 作者：靳沛鑫
   * 日期：2020-06-03
   * 邮箱：1677401802@qq.com
   * 文件说明：搜索状态
   */
  saveSelectStatus = (value) => {
    const {dispatch} = this.props
    dispatch({
      type: 'postInfo/saveSelectStatus',
      value: value
    });


  }

  /**
   * 作者：靳沛鑫
   * 日期：2019-05-28
   * 邮箱：1677401802@qq.com
   * 文件说明：清空筛选条件
   */
  resetCond = () => {
    const { dispatch } = this.props;
    dispatch({ type: "postInfo/resetCond" });
  };

  /**
   * 作者：靳沛鑫
   * 日期：2019-05-27
   * 邮箱：1677401802@qq.com
   * 文件说明：表头
   */
  columns = [
    {
      title: "序号",
      dataIndex: "num",
      width: 50,
      fixed: document.body.clientWidth > 1756 ? "null" : "left",
    },
    {
      title: "生产业务部门",
      dataIndex: "departmentName",
      className: styles.columnLeft,
      width: 110,
      fixed: document.body.clientWidth > 1756 ? "null" : "left",
    },
    {
      title: "项目/小组名称",
      dataIndex: "projectName",
      className: styles.columnLeft,
      width: 210,
      fixed: document.body.clientWidth > 1756 ? "null" : "left",
    },
    {
      title: "生产编码",
      dataIndex: "projectCode",
      width: 80,
      fixed: document.body.clientWidth > 1756 ? "null" : "left",
    },
    {
      title: "团队系数",
      dataIndex: "teamCoefficient",
      width: 80,
      fixed: document.body.clientWidth > 1756 ? "null" : "left",
    },
    {
      title: "核心岗位",
      dataIndex: "name",
      width: 80,
      fixed: document.body.clientWidth > 1756 ? "null" : "left",
    },
    {
      title: "人员所属院",
      dataIndex: "affiliatedAcademy",
      className: styles.columnLeft,
      width: 90,
    },
    {
      title: "姓名",
      dataIndex: "corepositionUsername",
      width: 60,
    },
    {
      title: "员工编号",
      dataIndex: "corepositionUserId",
      width: 80,
    },
    {
      title: "岗位状态",
      dataIndex: "status",
      width: 80,
      render: (text) => {
        return (
          <p>
            {text == "0"
              ? "空缺"
              : text == "2"
              ? "已聘任"
              : text == "1"
              ? "拟聘任"
              : "失效"}
          </p>
        );
      },
    },
    {
      title: "等级",
      dataIndex: "rank",
      width: 50,
      render: (text) => {
        return <p>{text == "0" ? "普通" : text > 1 ? "总监" : "高级"}</p>;
      },
    },
    {
      title: "绩效职级",
      dataIndex: "targetPerformanceRank",
      className: styles.columnCenter,
      width: 90,
    },
    {
      title: "聘任方式",
      dataIndex: "appointWay",
      className: styles.columnCenter,
      width: 80,
      render: (text) => {
        return <p>{text == "0" ? "续聘" : text == "1" ? "竞聘" : ""}</p>;
      },
    },
    {
      title: "备注",
      dataIndex: "note",
      width: 100,
    },
    {
      title: "操作",
      //dataIndex:'do',
      width: 200,
      fixed: document.body.clientWidth > 1756 ? "null" : "right",
      render: (text, record, index) => {
        return (
          <span style={{ textAlign: "left" }}>
            <span>
              {this.props.params.isEdit != false ? (
                <Button
                  type="primary"
                  disabled={record.enableEdit === false}
                  onClick={() => this.showModal1("edit", index, record)}
                >
                  {"编辑"}
                </Button>
              ) : null}
              {this.props.params.isConfirmEmploy != false ? (
                <Popconfirm
                  title={"是否确认聘任？"}
                  okText="是"
                  cancelText="否"
                  onConfirm={() => this.confirmemploy(index)}
                >
                  <Button
                    type="primary"
                    disabled={record.enableConfirmEmploy === false}
                  >
                    {"聘任"}
                  </Button>
                </Popconfirm>
              ) : null}
            </span>
            <span>
              {this.props.params.isSetExpired != false ? (
                <Popconfirm
                  title={"确定置为失效状态？"}
                  okText="是"
                  cancelText="否"
                  onConfirm={() => this.setExpired(index)}
                >
                  <Button
                    type="primary"
                    style={{ textAlign: "left", marginTop: 5 }}
                    disabled={record.enableSetExpired === false}
                  >
                    {"失效"}
                  </Button>
                </Popconfirm>
              ) : null}
            </span>
          </span>
        );
      },
    },
  ];
  column = [
    {
      title: "序号",
      dataIndex: "num",
      width: 50,
    },
    {
      title: "生产业务部门",
      dataIndex: "departmentName",
      className: styles.columnLeft,
      width: 110,
    },
    {
      title: "项目/小组名称",
      dataIndex: "projectName",
      className: styles.columnLeft,
      width: 210,
    },
    {
      title: "生产编码",
      dataIndex: "projectCode",
      width: 80,
    },
    {
      title: "团队系数",
      dataIndex: "teamCoefficient",
      width: 80,
    },
    {
      title: "核心岗位",
      dataIndex: "name",
      width: 80,
    },
    {
      title: "人员所属院",
      dataIndex: "affiliatedAcademy",
      width: 90,
    },
    {
      title: "姓名",
      dataIndex: "corepositionUsername",
      width: 60,
    },
    {
      title: "员工编号",
      dataIndex: "corepositionUserId",
      width: 80,
      render: (text) => {
        return <p>{text ? "'" + text : ""}</p>;
      },
    },
    {
      title: "岗位状态",
      dataIndex: "status",
      width: 80,
      render: (text) => {
        return (
          <p>
            {text == "0"
              ? "空缺"
              : text == "2"
              ? "已聘任"
              : text == "1"
              ? "拟聘任"
              : "失效"}
          </p>
        );
      },
    },
    {
      title: "等级",
      dataIndex: "rank",
      width: 50,
      render: (text) => {
        return <p>{text == "0" ? "普通" : text > 1 ? "总监" : "高级"}</p>;
      },
    },
    {
      title: "绩效职级",
      dataIndex: "targetPerformanceRank",
      className: styles.columnCenter,
      width: 90,
    },
    {
      title: "聘任方式",
      dataIndex: "appointWay",
      className: styles.columnCenter,
      width: 80,
      render: (text) => {
        return <p>{text == "0" ? "续聘" : text == "1" ? "竞聘" : ""}</p>;
      },
    },
    {
      title: "备注",
      dataIndex: "note",
      width: 100,
    },
  ];
  /**
   * 作者：靳沛鑫
   * 日期：2019-06-11
   * 邮箱：1677401802@qq.com
   * 文件说明：模态窗信息保存
   */
  changedMake = (value, typeItem) => {
    const { dispatch } = this.props;
    dispatch({
      type: "postInfo/changedMake",
      value:
        typeItem == "projectCode" || typeItem == "note"
          ? value.target.value
          : value,
      typeItem: typeItem,
    });
    this.props.form.resetFields();
  };

  /**
   * 作者：靳沛鑫
   * 日期：2019-05-27
   * 邮箱：1677401802@qq.com
   * 文件说明：模态窗
   */
  showModal1 = (elem, index, record) => {
    this.props.form.resetFields();
    if (elem == "add") {
      this.setState({
        visible1: true,
        aditperson: "block",
        aditIsImport: "none",
        delperson: "block",
        title: "新增核心岗位",
      });
    } else if (elem == "edit") {
      this.setState({
        visible1: true,
      });
      if (record.status == "0") {
        this.setState({
          title: "编辑核心岗位",
          aditperson: "block",
          aditIsImport: "none",
          delperson: "none",
        });
      } else {
        this.setState({
          title: "编辑核心岗位选定人信息",
          aditIsImport: "inline-block",
          aditperson: "none",
          delperson: "block",
        });
      }
    }
    const { dispatch } = this.props;
    dispatch({ type: "postInfo/temporarycache", elem: elem, index: index });
  };
  /**
   * 作者：靳沛鑫
   * 日期：2019-05-29
   * 邮箱：1677401802@qq.com
   * 文件说明：模态窗确定
   */
  addCorePosts = () => {
    this.props.form.validateFields((errors) => {
      if (!errors) {
        const { dispatch } = this.props;
        dispatch({ type: "postInfo/addCorePosts", title: this.state.title });
        this.setState({
          visible1: false,
        });
      }
    });
  };
  /**
   * 作者：靳沛鑫
   * 日期：2019-05-28
   * 邮箱：1677401802@qq.com
   * 文件说明：模态窗取消
   */
  handleCancel1 = () => {
    this.setState({
      visible1: false,
    });
  };
  /**
   * 作者：靳沛鑫
   * 日期：2020-04-13
   * 邮箱：1677401802@qq.com
   * 文件说明：失效
   */
  setExpired = (index) => {
    const { dispatch } = this.props;
    dispatch({
      type: "postInfo/setExpired",
      index: index,
    });
  };
  /**
   * 作者：靳沛鑫
   * 日期：2019-06-5
   * 邮箱：1677401802@qq.com
   * 文件说明：确认聘任
   */
  confirmemploy = (index) => {
    const { dispatch } = this.props;
    dispatch({
      type: "postInfo/confirmemploy",
      index: index,
    });
  };
  /**
   * 作者：靳沛鑫
   * 日期：2019-06-6
   * 邮箱：1677401802@qq.com
   * 文件说明：查询人员及其所属院
   */
  userAndAcademyNames = (name) => {
    const { dispatch } = this.props;
    dispatch({
      type: "postInfo/userAndAcademyNames",
      name,
    });
    this.props.form.resetFields();
  };
  /**
   * 作者：靳沛鑫
   * 日期：2019-06-5
   * 邮箱：1677401802@qq.com
   * 文件说明：模板下载
   */
  downloadMode = () => {
    window.location.href =
      "/microservice/coreposition/business/downloadTemplate";
  };
  /**
   * 作者：靳沛鑫
   * 日期：2019-06-06
   * 邮箱：1677401802@qq.com
   * 文件说明：导出岗位信息
   */
  expExl = () => {
    let tab = document.querySelector(`#keyCode table`);
    exportExl()(tab, "核心岗位信息");
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayoutProjName = {
      labelCol: { span: 9 },
      wrapperCol: { span: 12 },
    };
    const formItemLayoutNote = {
      labelCol: { span: 4 },
      wrapperCol: { span: 19 },
    };
    const {params, projectCodeList, yearList, postsState, deptList, projUnitList, teamCoefficient, OUList, postsInfoList, targetPfRankList, chgMake, userNameList, dispatch, saveStatus} = this.props;

    if (params.isEdit == false && params.isConfirmEmploy == false) {
      this.columns.splice(14, 1);
    }
    //年份
    const year_list = yearList.map((item) => {
      let items = item.year.toString();
      return (
        <Option value={items} key={items} title={items}>
          {items}
        </Option>
      );
    });

    //状态
    const posts_state = postsState.map((item, index) => {
      return (
        <Option value={item.key} key={index+3} title={item.value}>{item.value}</Option>
      )
    });
    //生产业务部门名称
    const dept_list = deptList.map((item) => {
      return (
        <Option value={item.value} key={item.key} title={item.value}>
          {item.value}
        </Option>
      );
    });
    //项目/小组名称

    const projUnit_list = projUnitList.map((item, index) => {
      return item.value ? (
        <Option value={item.value} key={index + 1} title={item.value}>
          {item.value}
        </Option>
      ) : null;
    });
    //人员所属院
    const ou_list = OUList.map((item) => {
      return (
        <Option value={item.value} key={item.key} title={item.value}>
          {item.value}
        </Option>
      );
    });
    //团队系数
    const team_coefficient = teamCoefficient.map((item, index) => {
      return (
        <Option value={item} key={index + 1} title={item}>
          {item}
        </Option>
      );
    });
    //目标绩效职级

    const target_Rank =
      chgMake.rank === "普通" || chgMake.rank
        ? targetPfRankList.map((item, index) => {
            return (
              <Option value={item} key={index} title={item}>
                {item}
              </Option>
            );
          })
        : null;
    //添加序号和id
    if (postsInfoList.length) {
      postsInfoList.map((i, index) => {
        i.key = index;
        i.num = index + 1;
        /*if(i.corepositionUserId){
          i.corepositionUserId="'"+i.corepositionUserId
          console.log(i.corepositionUserId)
        }*/
      });
    }
    //部门id 名称 生产编号
    const projectCode_List = projectCodeList.map((item, index) => {
      return (
        <Option value={item.name} key={item.id} title={item.name}>
          {item.name}
        </Option>
      );
    });

    //员工名单
    const userName_List = userNameList.map((item, index) => {
      return (
        <Option
          key={item.userId}
          value={item.username + item.userId}
          title={item.username}
        >
          {item.username}
        </Option>
      );
    });

    /**
     * 作者：靳沛鑫
     * 日期：2019-06-4
     * 邮箱：1677401802@qq.com
     * 文件说明：批量导入
     */
    const uploads = {
      name: "file",
      showUploadList: false,
      multiple: true,
      action: "/microservice/coreposition/business/import",
      onChange(info) {
        if (info.file.response) {
          if (info.file.response.RetCode == "1") {
            message.success("导入成功");
            dispatch({
              type: "postInfo/postInfoList",
            });
          } else {
            message.error(info.file.response.RetVal);
          }
        }
      },
    };
    return (
      <div style={{ fontSize: 13 }}>
        <Spin tip="加载中" spinning={this.props.loading}>
          <div
            style={{ paddingTop: 13, paddingBottom: 16, background: "white" }}
          >
            <h2 style={{ textAlign: "center", fontWeight: "bolder" }}>
              岗位信息
            </h2>
            <div style={{ textAlign: "center" }}>
              <Row gutter={6} style={{ marginTop: 12, marginLeft: 10 }}>
                <Col span={5}>
                  <label>年&emsp;&emsp;份：</label>
                  <Select
                    style={{ width: 100 }}
                    showSearch
                    placeholder="2019"
                    value={params.year}
                    onChange={(value) => this.saveSelectInfo(value, "year")}
                  >
                    {year_list}
                  </Select>
                </Col>
                <Col span={7}>
                  <label>生产业务部门：</label>
                  <Select
                    style={{ width: 150 }}
                    showSearch
                    dropdownMatchSelectWidth={false}
                    placeholder="全部"
                    value={params.departmentName}
                    onChange={(value) =>
                      this.saveSelectInfo(value, "departmentName")
                    }
                  >
                    <Option value="" key="0" title="全部">
                      全部
                    </Option>
                    {dept_list}
                  </Select>
                </Col>
                <Col span={5}>
                  <label>团队系数：</label>
                  <Select
                    style={{ width: 100 }}
                    showSearch
                    placeholder="全部"
                    value={params.teamCoefficient}
                    onChange={(value) =>
                      this.saveSelectInfo(value, "teamCoefficient")
                    }
                  >
                    <Option value="" key="0" title="全部">
                      全部
                    </Option>
                    {team_coefficient}
                  </Select>
                </Col>
                <Col span={5}>
                  <label>人员所属院：</label>
                  <Select
                    style={{ width: 100 }}
                    showSearch
                    dropdownMatchSelectWidth={false}
                    placeholder="全部"
                    value={params.affiliatedAcademy}
                    onChange={(value) =>
                      this.saveSelectInfo(value, "affiliatedAcademy")
                    }
                  >
                    <Option value="" key="0" title="全部">
                      全部
                    </Option>
                    {ou_list}
                  </Select>
                </Col>
                <Col span={1}>
                  <Button
                    type="primary"
                    style={{ marginLeft: 7 }}
                    onClick={this.resetCond}
                  >
                    {"清空"}
                  </Button>
                </Col>
              </Row>
              <Row gutter={6} style={{ marginTop: 12, marginLeft: 10 }}>
                <Col span={5}>
                  <label>岗位状态：</label>
                  <Select style={{width: 100}} showSearch placeholder='全部' value={saveStatus} onChange={(value) => this.saveSelectStatus(value)}><Option value='' key='0' title='全部'>全部</Option>{posts_state}</Select>
                </Col>
                <Col span={7}>
                  <label>项目/小组名称：</label>
                  <Select
                    style={{ width: 150 }}
                    showSearch
                    dropdownMatchSelectWidth={false}
                    placeholder="全部"
                    value={params.projectName}
                    onChange={(value) =>
                      this.saveSelectInfo(value, "projectName")
                    }
                  >
                    <Option value="" key="0" title="全部">
                      全部
                    </Option>
                    {projUnit_list}
                  </Select>
                </Col>
              </Row>
            </div>
            <div style={{ marginTop: 30 }}>
              {params.isAdd != false ? (
                <Button
                  type="primary"
                  style={{ marginRight: 40 }}
                  onClick={() => this.showModal1("add")}
                >
                  {"新增"}
                </Button>
              ) : null}
              {params.isDownload != false ? (
                <Button
                  type="primary"
                  style={{ marginRight: 40 }}
                  onClick={this.downloadMode}
                >
                  {"模板下载"}
                </Button>
              ) : null}
              <Upload {...uploads} style={{ marginRight: 40 }}>
                {params.isImport != false ? (
                  <Button type="primary" style={{ marginLeft: 0 }}>
                    {"导入"}
                  </Button>
                ) : null}
              </Upload>
              {true ? (
                <Button type="primary" onClick={this.expExl}>
                  {"导出"}
                </Button>
              ) : null}
            </div>
            <Table
              columns={this.columns} /*列表数据*/
              dataSource={postsInfoList} /*数据*/
              pagination={false}
              scroll={
                params.isEdit != false && params.isConfirmEmploy != false
                  ? { x: 1440 }
                  : { x: 1240 }
              } /*滑动窗口的宽度*/
              rowKey={(record) => record.id}
              className={styles.table}
              bordered={true}
            ></Table>
            <span id={"keyCode"} style={{ display: "none" }}>
              <Table
                columns={this.column}
                KeyCode={666}
                dataSource={postsInfoList}
                pagination={false}
                rowKey={(record) => record.id}
                className={styles.table}
                bordered={true}
              ></Table>
            </span>
          </div>
        </Spin>
        <Modal
          title={this.state.title}
          visible={this.state.visible1}
          onCancel={this.handleCancel1}
          onOk={this.addCorePosts}
          width="700px"
        >
          <Row
            style={{
              marginTop: "10px",
              lineHeight: "30px",
              display: this.state.aditperson,
            }}
          >
            <Col className="gutter-row" span={12}>
              <FormItem label={`生产业务部门：`} {...formItemLayoutProjName}>
                {getFieldDecorator("departmentName", {
                  rules: [
                    {
                      required: true,
                      message: "生产业务部门是必填项",
                      whitespace: true,
                    },
                  ],
                  initialValue: chgMake.departmentName,
                })(
                  <Select
                    style={{ width: 195 }}
                    showSearch
                    placeholder={"必选"}
                    onChange={(value) =>
                      this.changedMake(value, "departmentName")
                    }
                  >
                    {dept_list}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col className="gutter-row" span={12}>
              <FormItem label={`项目/小组名称：`} {...formItemLayoutProjName}>
                {getFieldDecorator("projectName", {
                  rules: [
                    {
                      required: true,
                      message: "项目/小组名称是必填项",
                      whitespace: true,
                    },
                  ],
                  initialValue: chgMake.projectName,
                })(
                  <Select
                    style={{ width: 195 }}
                    showSearch
                    dropdownMatchSelectWidth={false}
                    placeholder={"选择部门后可选"}
                    onChange={(value) => this.changedMake(value, "projectName")}
                  >
                    {projectCode_List}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ lineHeight: "30px", display: this.state.aditperson }}>
            <Col className="gutter-row" span={12}>
              <FormItem label={`生产编码：`} {...formItemLayoutProjName}>
                {getFieldDecorator("projectCode", {
                  rules: [
                    {
                      required: true,
                      message: "生产编码是必填项",
                      whitespace: true,
                    },
                  ],
                  initialValue: chgMake.projectCode,
                })(
                  <Input
                    placeholder={"选择生产单位之后生成"}
                    style={{ width: 195 }}
                    onChange={(value) => this.changedMake(value, "projectCode")}
                  />
                )}
              </FormItem>
            </Col>
            <Col className="gutter-row" span={12}>
              <FormItem label={`团队系数：`} {...formItemLayoutProjName}>
                {getFieldDecorator("teamCoefficient", {
                  rules: [
                    {
                      required: true,
                      message: "团队系数是必填项",
                      whitespace: true,
                    },
                  ],
                  initialValue: chgMake.teamCoefficient,
                })(
                  <Select
                    style={{ width: 195 }}
                    showSearch
                    placeholder={"必选"}
                    onChange={(value) =>
                      this.changedMake(value, "teamCoefficient")
                    }
                  >
                    {team_coefficient}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ lineHeight: "30px", display: this.state.aditperson }}>
            <Col className="gutter-row" span={12}>
              <FormItem label={`核心岗位：`} {...formItemLayoutProjName}>
                {getFieldDecorator("name", {
                  rules: [
                    {
                      required: true,
                      message: "核心岗位是必填项",
                      whitespace: true,
                    },
                  ],
                  initialValue: chgMake.name,
                })(
                  <Select
                    style={{ width: 195 }}
                    showSearch
                    placeholder={"必选"}
                    onChange={(value) => this.changedMake(value, "name")}
                  >
                    <Option key={"0"} value={"项目经理"}>
                      项目经理
                    </Option>
                    <Option key={"1"} value={"小组长"}>
                      小组长
                    </Option>
                    <Option key={"2"} value={"业务架构师"}>
                      业务架构师
                    </Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col className="gutter-row" span={12}>
              <FormItem label={`等级：`} {...formItemLayoutProjName}>
                {getFieldDecorator("rank", {
                  rules: [
                    {
                      required: true,
                      message: "等级是必填",
                      whitespace: true,
                    },
                  ],
                  initialValue: chgMake.rank,
                })(
                  <Select
                    style={{ width: 195 }}
                    placeholder={"必选"}
                    onChange={(value) => this.changedMake(value, "rank")}
                  >
                    <Option value={"0"} title={"普通"}>
                      普通
                    </Option>
                    <Option value={"1"} title={"高级"}>
                      高级
                    </Option>
                    <Option value={"2"} title={"总监"}>
                      总监
                    </Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ lineHeight: "30px", display: this.state.delperson }}>
            <Col className="gutter-row" span={12}>
              <FormItem label={`姓名：`} {...formItemLayoutProjName}>
                {getFieldDecorator("corepositionUsername", {
                  rules: [
                    {
                      required: this.state.aditIsImport == "inline-block",
                      message: "姓名是必填项",
                      whitespace: true,
                    },
                  ],
                  initialValue: chgMake.corepositionUsername,
                })(
                  <Select
                    style={{ width: 195 }}
                    showSearch
                    placeholder={
                      this.state.aditIsImport == "none" ? "可选" : "必选"
                    }
                    onChange={(value) => this.userAndAcademyNames(value)}
                  >
                    {userName_List}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col className="gutter-row" span={12}>
              <FormItem label={`员工编号：`} {...formItemLayoutProjName}>
                {getFieldDecorator("corepositionUserId", {
                  rules: [
                    {
                      required: false,
                      message: "员工编号是必填项",
                      whitespace: true,
                    },
                  ],
                  initialValue: chgMake.corepositionUserId,
                })(
                  <Input
                    style={{ textAlign: "left", width: 195 }}
                    disabled={true}
                    placeholder={"选择人员后生成"}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ lineHeight: "30px", display: this.state.delperson }}>
            <Col className="gutter-row" span={12}>
              <FormItem label={`人员所属院：`} {...formItemLayoutProjName}>
                {getFieldDecorator("affiliatedAcademy", {
                  rules: [
                    {
                      required: false,
                      message: "人员所属院是必填项",
                      whitespace: true,
                    },
                  ],
                  initialValue: chgMake.affiliatedAcademy,
                })(
                  <Input
                    style={{ textAlign: "left", width: 195 }}
                    disabled={true}
                    placeholder={"选择人员后生成"}
                  />
                )}
              </FormItem>
            </Col>
            <Col className="gutter-row" span={12}>
              <FormItem label={`聘任方式：`} {...formItemLayoutProjName}>
                {getFieldDecorator("appointWay", {
                  rules: [
                    {
                      required: chgMake.corepositionUsername ? true : false,
                      message: "聘任方式是必填项",
                      whitespace: true,
                    },
                  ],
                  initialValue: chgMake.appointWay,
                })(
                  <Select
                    style={{ width: 195 }}
                    placeholder={"选择人员后必选"}
                    disabled={!chgMake.corepositionUsername}
                    onChange={(value) => this.changedMake(value, "appointWay")}
                  >
                    <Option key="0" title="续聘" value="0">
                      续聘
                    </Option>
                    <Option key="1" title="竞聘" value="1">
                      竞聘
                    </Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ lineHeight: "30px", display: this.state.aditperson }}>
            <Col className="gutter-row" span={12}>
              <FormItem label={`目标绩效等级：`} {...formItemLayoutProjName}>
                {getFieldDecorator("targetPerformanceRank", {
                  rules: [
                    {
                      required: true,
                      message: "目标绩效等级是必填项",
                      whitespace: true,
                    },
                  ],
                  initialValue: chgMake.targetPerformanceRank,
                })(
                  <Select
                    style={{ width: 195 }}
                    placeholder={"选择等级后可选"}
                    onChange={(value) =>
                      this.changedMake(value, "targetPerformanceRank")
                    }
                  >
                    {target_Rank}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row style={{ marginTop: "40px", lineHeight: "30px" }}>
            <Col className="gutter-row" span={24}>
              <FormItem label={`备注：`} {...formItemLayoutNote}>
                {getFieldDecorator("note", {
                  rules: [
                    {
                      required: false,
                      message: "无",
                      whitespace: true,
                    },
                  ],
                  initialValue: chgMake.note,
                })(
                  <Input
                    placeholder={"可选"}
                    onChange={(value) => this.changedMake(value, "note")}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    loading: state.loading.models.postInfo,
    ...state.postInfo,
  };
}

export default connect(mapStateToProps)(Form.create()(PostInfo));
