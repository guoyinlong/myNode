/**
 *  作者: 陈红华
 *  创建日期: 2017-11-28
 *  邮箱：1045825949@qq.com
 *  文件说明：项目结项：项目列表
 */

import React from "react";
import {
  Row,
  Col,
  Icon,
  Input,
  Button,
  Modal,
  Select,
  Table,
  Pagination,
  message,
  Tooltip,
} from "antd";
import styles from "./projTable.less";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import DeptRadioGroup from "../../../components/common/deptRadio.js";
import { ouOptionList } from "../projConst";
import config from "../../../utils/config";
const Option = Select.Option;
const { TextArea } = Input;
import Cookie from "js-cookie";

// 主子项目不同序号的展示方式
function projIndex(record, index) {
  //  "is_primary": "0",是否主项目0是 1否,level是处于哪一级
  if (record.level == 0) {
    return index + 1;
  } else {
    return (record.parentIndex + 1).toString() + "-" + (index + 1).toString();
  }
}
class ProjDeliveryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { mainDeptVisible: false };
  }

  // 设置下拉选择型条件参数以及输入型参数失去焦点 同时进行查询操作
  setSelectCondParam = (value, condType) => {
    const { dispatch } = this.props;
    dispatch({
      type: "projDeliveryList/changeConditionQuery",
      payload: { [condType]: value },
    });
  };
  // 设置输入型框的显示
  setInputShow = (e, condType) => {
    const { dispatch } = this.props;
    dispatch({
      type: "projDeliveryList/saveConditionData",
      payload: { [condType]: e.target.value.trim() },
    });
  };

  // 选择主责部门模态框显示与隐藏
  showMainDeptModel = () => {
    this.setState({ mainDeptVisible: !this.state.mainDeptVisible });
  };
  // 选择主责部门模态框关闭
  hideMainDeptModel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "projDeliveryList/changeConditionQuery",
      payload: {
        arg_dept_name: this.refs.mainDeptRadioGroup.getData().dept_name,
      },
    });
    this.setState({ mainDeptVisible: false });
  };
  // 设置条件是否展开
  setCondCollapse = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "projDeliveryList/saveData",
      payload: {
        condCollapse: !this.props.condCollapse,
      },
    });
  };
  // 重置筛选条件
  resetCond = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "projDeliveryList/changeConditionQuery",
      payload: {
        arg_ou_name: "",
        arg_proj_label: "0",
        arg_proj_code: "",
        arg_proj_name: "",
        arg_dept_name: "",
        arg_pu_dept_name: "",
        arg_mgr_name: "",
        arg_proj_type: "",
      },
    });
  };
  // 点击项目当前行进行页面跳转
  goProjDetail = (record) => {
    const { dispatch, conditionData } = this.props;
    record.roleId = conditionData.arg_roleId;
    if (
      record.mgr_id == Cookie.get("userid") ||
      record.fileState == "2" ||
      record.flowState === 2
    ) {
      if (record.newProject) {
        dispatch(
          routerRedux.push({
            pathname:
              "projectApp/projClosure/projDeliveryList/projDeliveryFileNew",
            query: record,
          })
        );
      } else {
        dispatch(
          routerRedux.push({
            pathname:
              "projectApp/projClosure/projDeliveryList/projDeliveryFile",
            query: record,
          })
        );
      }
    } else if (
      conditionData.arg_roleId == "0" &&
      record.newProject &&
      (record.flowState == 1 || record.flowState == 2 || record.flowState == 3)
    ) {
      dispatch(
        routerRedux.push({
          pathname:
            "projectApp/projClosure/projDeliveryList/projDeliveryFileNew",
          query: record,
        })
      );
    } else if (
      conditionData.arg_roleId == "0" &&
      !record.newProject &&
      (record.fileState == "1" ||
        record.fileState == "2" ||
        record.fileState == "3")
    ) {
      dispatch(
        routerRedux.push({
          pathname: "projectApp/projClosure/projDeliveryList/projDeliveryFile",
          query: record,
        })
      );
    } else {
      message.info("该项目当前状态无文件可查看！");
    }
  };
  // 页面初始化查询
  componentDidMount() {
    const { dispatch, conditionData } = this.props;
    dispatch({
      type: "projDeliveryList/projTypeSearch",
    });
    // dispatch({
    //   type:'projDeliveryList/projDeliveryListQuery'
    // });
    dispatch({
      type: "projDeliveryList/projPermissionsQuery",
    });
  }

  columns = [
    {
      title: "序号",
      dataIndex: "i",
      render: (text, record, index) => projIndex(record, index),
      width: "10px",
    },
    {
      title: "团队名称",
      dataIndex: "proj_name",
      width: "10px",
    },
    {
      title: "生产编码",
      dataIndex: "proj_code",
    },
    {
      title: "归属部门",
      dataIndex: "pu_dept_name",
      render: (text) => {
        // return text.includes('-') ?text.split('-')[1]:text;
        if (text) {
          return text.includes("-") ? text.split("-")[1] : text;
        } else {
          return "";
        }
      },
    },
    {
      title: "主建单位",
      dataIndex: "ou",
    },
    {
      title: "主建部门",
      dataIndex: "dept_name",
      render: (text) => {
        if (text) {
          return text.includes("-") ? text.split("-")[1] : text;
        } else {
          return "";
        }
      },
    },
    {
      title: "项目经理",
      dataIndex: "mgr_name",
    },
    {
      title: "项目类型",
      dataIndex: "proj_type",
    },
    {
      title: "主/子项目",
      dataIndex: "is_primary",
      render: (text) => {
        return text === "0" ? "主项目" : "子项目";
      },
    },
    {
      title: "项目分类",
      dataIndex: "proj_label",
      render: (text) => {
        switch (text) {
          case "0":
            return "项目类";
            break;
          case "1":
            return "小组类";
            break;
          case "2":
            return "支撑类";
            break;
          case "3":
            return "项目类(纯第三方)";
            break;
        }
      },
    },
    {
      title: "状态",
      dataIndex: "fileStateName",
      render: (text, record) => {
        return record.newProject ? (
          <span>
            {record.flowState === 1
              ? "待审核"
              : record.flowState === 2
              ? "审核通过"
              : record.flowState === 3
              ? "退回"
              : "未提交"}
          </span>
        ) : (
          <span>{record.fileStateName}</span>
        );
      },
    },
  ];

  render() {
    const { loading, list, projTypeDataList, puDeptName } = this.props;
    // let puDeptNameList;
    // if(puDeptName !== undefined){
    //   //部门列表，同时去前缀
    //   puDeptNameList = puDeptName.map((item) => {
    //     return (
    //       <Option key={item.pu_dept_name}>
    //         {item.pu_dept_name}
    //       </Option>
    //     )
    //   });
    // }
    //处理项目类型
    let puDeptNameList = [];
    if (puDeptName.length !== 0) {
      puDeptNameList.push(
        <Option value="" key="">
          {"全部"}
        </Option>
      );
      for (let i = 0; i < puDeptName.length; i++) {
        puDeptNameList.push(
          <Option
            value={puDeptName[i].pu_dept_name}
            key={puDeptName[i].pu_dept_name}
          >
            {puDeptName[i].pu_dept_name.split("-")[1]}
          </Option>
        );
      }
    }
    //处理项目类型
    let projTypeOptionList = [];
    if (projTypeDataList.length) {
      projTypeOptionList.push(
        <Option value="" key="">
          {"全部"}
        </Option>
      );
      for (let i = 0; i < projTypeDataList.length; i++) {
        projTypeOptionList.push(
          <Option
            value={projTypeDataList[i].type_name}
            key={projTypeDataList[i].type_name}
          >
            {projTypeDataList[i].type_name_show}
          </Option>
        );
      }
    }
    return (
      <div style={{ paddingTop: 13, paddingBottom: 16, background: "white" }}>
        <div style={{ paddingLeft: 15, paddingRight: 15 }}>
          <div>
            <p
              style={{
                textAlign: "center",
                fontSize: "20px",
                marginBottom: "10px",
              }}
            >
              项目信息管理-交付结项
            </p>
          </div>
          {/*第一行*/}
          <div style={{ textAlign: "center" }}>
            <Row gutter={16}>
              <Col className="gutter-box" span={7}>
                归属部门：
                <Select
                  showSearch
                  style={{ width: 200 }}
                  value={this.props.conditionData.arg_pu_dept_name}
                  onChange={(value) =>
                    this.setSelectCondParam(value, "arg_pu_dept_name")
                  }
                >
                  {/*<Option value="">全部</Option>*/}
                  {/*<Option value="联通软件研究院-公众研发事业部">公众研发事业部</Option>*/}
                  {/*<Option value="联通软件研究院-集客与行业研发事业部">集客与行业研发事业部</Option>*/}
                  {/*<Option value="联通软件研究院-创新与合作研发事业部">创新与合作研发事业部</Option>*/}
                  {/*<Option value="联通软件研究院-公共平台与架构研发事业部">公共平台与架构研发事业部</Option>*/}
                  {/*<Option value="联通软件研究院-计费结算中心">计费结算中心</Option>*/}
                  {/*<Option value="联通软件研究院-运营保障与调度中心">运营保障与调度中心</Option>*/}
                  {/*<Option value="联通软件研究院-共享资源中心">共享资源中心</Option>*/}
                  {puDeptNameList}
                </Select>
              </Col>
              <Col className="gutter-box" span={7}>
                项目分类：
                <Select
                  showSearch
                  style={{ width: 200 }}
                  value={this.props.conditionData.arg_proj_label}
                  onChange={(value) =>
                    this.setSelectCondParam(value, "arg_proj_label")
                  }
                >
                  <Option value="">全部</Option>
                  <Option value="0">项目类</Option>
                  <Option value="3">项目类(纯第三方)</Option>
                  <Option value="1">小组类</Option>
                  <Option value="2">支撑类</Option>
                </Select>
              </Col>
              <Col className="gutter-box" span={8}>
                生产编码：
                <Input
                  style={{ width: 200 }}
                  value={this.props.conditionData.arg_proj_code}
                  onChange={(e) => this.setInputShow(e, "arg_proj_code")}
                  onBlur={(e) =>
                    this.setSelectCondParam(
                      e.target.value.trim(),
                      "arg_proj_code"
                    )
                  }
                ></Input>
                <span
                  onClick={this.setCondCollapse}
                  style={{
                    marginLeft: 20,
                    cursor: "pointer",
                    color: "#f04134",
                  }}
                >
                  {this.props.condCollapse ? (
                    <span>
                      展开<Icon type="down-circle-o"></Icon>
                    </span>
                  ) : (
                    <span>
                      收起<Icon type="up-circle-o"></Icon>
                    </span>
                  )}
                </span>
              </Col>
            </Row>
            {/*第二行和第三行是否折叠*/}
            {this.props.condCollapse === true ? null : (
              <div>
                {/*第二行*/}
                <Row gutter={16}>
                  <Col className="gutter-box" span={7}>
                    项目类型：
                    <Select
                      showSearch
                      style={{ width: 200 }}
                      value={this.props.conditionData.arg_proj_type}
                      onChange={(value) =>
                        this.setSelectCondParam(value, "arg_proj_type")
                      }
                    >
                      {projTypeOptionList}
                    </Select>
                  </Col>
                  <Col className="gutter-box" span={7}>
                    项目经理：
                    <Input
                      style={{ width: 200 }}
                      value={this.props.conditionData.arg_mgr_name}
                      onChange={(e) => this.setInputShow(e, "arg_mgr_name")}
                      onBlur={(e) =>
                        this.setSelectCondParam(
                          e.target.value.trim(),
                          "arg_mgr_name"
                        )
                      }
                    ></Input>
                  </Col>
                  <Col className="gutter-box" span={7}>
                    主建单位：
                    <Select
                      style={{ width: 200 }}
                      value={this.props.conditionData.arg_ou_name}
                      onChange={(value) =>
                        this.setSelectCondParam(value, "arg_ou_name")
                      }
                    >
                      <Option value="">全部</Option>
                      {ouOptionList}
                    </Select>
                  </Col>
                </Row>
                {/*第三行*/}
                <Row gutter={16}>
                  <Col className="gutter-box" span={7}>
                    <span style={{ verticalAlign: "top" }}>团队名称：</span>
                    <TextArea
                      rows={3}
                      style={{ width: 200 }}
                      value={this.props.conditionData.arg_proj_name}
                      onChange={(e) => this.setInputShow(e, "arg_proj_name")}
                      onBlur={(e) =>
                        this.setSelectCondParam(
                          e.target.value.trim(),
                          "arg_proj_name"
                        )
                      }
                    ></TextArea>
                  </Col>
                  <Col className="gutter-box" span={7}>
                    <span style={{ verticalAlign: "top" }}> 主建部门：</span>
                    <TextArea
                      rows={3}
                      style={{ width: 200 }}
                      onClick={this.showMainDeptModel}
                      value={this.props.conditionData.arg_dept_name}
                    ></TextArea>
                    <Modal
                      key="dept_name"
                      visible={this.state.mainDeptVisible}
                      width={config.DEPT_MODAL_WIDTH}
                      title="选择部门"
                      onCancel={this.showMainDeptModel}
                      footer={[
                        <Button
                          key="mainDeptNameClose"
                          size="large"
                          onClick={this.showMainDeptModel}
                        >
                          关闭
                        </Button>,
                        <Button
                          key="mainDeptNameConfirm"
                          type="primary"
                          size="large"
                          onClick={this.hideMainDeptModel}
                        >
                          确定
                        </Button>,
                      ]}
                    >
                      <div>
                        <DeptRadioGroup ref="mainDeptRadioGroup" />
                      </div>
                    </Modal>
                  </Col>
                  <Col className="gutter-box" span={7}>
                    <span style={{ marginRight: "28px" }}>状态：</span>
                    <Select
                      style={{ width: 200 }}
                      value={this.props.conditionData.arg_file_state}
                      onChange={(value) =>
                        this.setSelectCondParam(value, "arg_file_state")
                      }
                    >
                      <Option value="">全部</Option>
                      <Option value="已保存">已保存</Option>
                      <Option value="待审核">待审核</Option>
                      <Option value="审核通过">审核通过</Option>
                      <Option value="审核退回">审核退回</Option>
                      <Option value="未上传">未提交</Option>
                    </Select>
                  </Col>
                </Row>
              </div>
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            <Button type="primary" onClick={this.resetCond}>
              重置条件
            </Button>
          </div>
          <Table
            columns={this.columns}
            bordered={true}
            dataSource={list}
            loading={loading}
            defaultExpandAllRows={true}
            rowClassName={(record, index) =>
              record.is_primary == "0" ? "primary" : "child"
            }
            className={styles.orderTable}
            onRowClick={(record) => this.goProjDetail(record)}
          />
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    loading: state.loading.models.projDeliveryList,
    ...state.projDeliveryList,
  };
}

export default connect(mapStateToProps)(ProjDeliveryList);
