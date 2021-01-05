/**
 * 作者：任金龙
 * 创建日期：2017-1-09
 * 邮件：renjl33@chinaunicom.cn
 * 文件说明：
 */

import React from "react";
import {
  Row,
  Col,
  Input,
  Modal,
  Select,
  Table,
  Pagination,
  Button,
  Icon,
} from "antd";
import styles from "./planInfo.less";
import { connect } from "dva";
import Cookie from "js-cookie";
import { routerRedux } from "dva/router";
import DeptRadioGroup from "../../../components/common/deptRadio.js";
import config from "../../../utils/config";

const Option = Select.Option;
const { TextArea } = Input;

function projIndex(record, index) {
  //  level是处于哪一级
  if (record.level == 0) {
    return index + 1;
  } else {
    return (index + 1).toString();
  }
}

class ProjPlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ou: "" /*OU默认为当前OU*/,
      total: "",
      staff_id: Cookie.get("staff_id"),
      page: 1,
      mainDeptVisible: false,
      condCollapse: true /* 搜索条件是否展开*/,
      proj_code: "" /*项目编码默认为‘’*/,
      proj_name: "" /*项目名称默认为‘’*/,
      dept_name: "" /*主责部门默认为‘’*/,
      mgr_name: "" /*项目经理默认为‘’*/,
    };
  }
  //设置输入型条件参数
  setInputCondParam = (e, type) => {
    //输入型参数需要去掉首尾空格，通过trim
    this.setState({ [type]: e.target.value.trim(), page: 1 }, () => {
      this.total();
    });
  };
  //设置输入型框的显示
  setInputShow = (e, condType) => {
    const { dispatch } = this.props;
    dispatch({
      type: "projPlan/setInputShow",
      value: e.target.value.trim(),
      condType: condType,
    });
  };

  hideMainDept = () => {
    this.setState({ mainDeptVisible: false });
  };
  //选择主责部门模态框显示
  showMainDeptModel = () => {
    this.setState({ mainDeptVisible: true });
  };

  /**
   * 作者：张建鹏
   * 创建日期：2020-05-29
   * 功能：回车查询数据
   * @param e 输入事件
   * @param condType 条件类型，具体的参数对应值
   */
  handleEnterKey = (e, condType) => {
    this.setInputCondParam(e, condType);
  };

  //选择主责部门模态框关闭
  hideMainDeptModel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "projPlan/setInputShow",
      value: this.refs.mainDeptRadioGroup.getData().dept_name,
      condType: "dept_name",
    });

    this.setState(
      {
        mainDeptVisible: false,
        dept_name: this.refs.mainDeptRadioGroup.getData().dept_name,
      },
      () => {
        this.total();
      }
    );
  };
  /**
   * 重置条件
   */
  resetCond = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "projPlan/resetCond",
    });
    this.setState(
      {
        ou: "",
        proj_code: "",
        proj_name: "",
        dept_name: "",
        mgr_name: "",
        page: 1,
      },
      () => {
        this.total();
      }
    );
  };
  //总方法
  total = () => {
    const { dispatch } = this.props;
    let postData = {};
    if (this.props.ou !== "") {
      postData.arg_ou_name = this.props.ou;
    } else {
      postData.arg_ou_name = "";
    }
    if (this.props.proj_code !== "") {
      postData.arg_proj_code = this.props.proj_code;
    }
    if (this.props.proj_name !== "") {
      postData.arg_proj_name = this.props.proj_name;
    }
    if (this.props.dept_name !== "") {
      postData.arg_dept_name = this.props.dept_name;
    }
    if (this.props.mgr_name !== "") {
      postData.arg_mgr_name = this.props.mgr_name;
    }

    postData.arg_staff_id = this.state.staff_id;
    postData.arg_pagecurrent = this.state.page;
    postData.arg_pagesize = 10;
    postData.arg_queryflag = 3;
    postData.arg_version = "3.0";

    dispatch({
      type: "projPlan/projPlanConditionSearch",
      arg_param: postData,
    });
  };
  setCondCollapse = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "projPlan/setInputShow",
      value: !this.props.condCollapse,
      condType: "condCollapse",
    });
    this.setState({ condCollapse: !this.state.condCollapse });
  };
  /**
   * 单位发生改变
   */
  handleOUChange = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: "projPlan/setInputShow",
      value: value.trim(),
      condType: "ou",
    });

    this.setState(
      {
        ou: value.trim(),
      },
      () => {
        this.total();
      }
    );
  };

  /**
   * 跳转到文档下载页
   */
  goProjEdit = (record, index, event) => {
    Cookie.set("projId", record.proj_id);
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: "projectApp/projPrepare/projPlan/projPlanDocDownload",
        query: {
          projId: record.proj_id,
          projOu: record.ou,
          projName: record.proj_name,
          projPlanType: "项目计划",
          postData: JSON.stringify(this.props.postData),
          condCollapse: this.props.condCollapse,
        },
      })
    );
  };
  /**
   * 点击页码
   */
  handlePageChange = (page) => {
    let queryParams = this.props.postData;
    queryParams.arg_pagecurrent = page; //将请求参数设置为当前页

    const { dispatch } = this.props;
    dispatch({
      type: "projPlan/projPlanConditionSearch",
      arg_param: queryParams,
    });
  };
  columns = [
    {
      title: "序号",
      dataIndex: "i",
      key: "i",
      render: (text, record, index) => projIndex(record, index),
    },
    {
      title: "团队名称",
      dataIndex: "proj_name",
      key: "proj_name",
    },
    {
      title: "生产编码",
      dataIndex: "proj_code",
      key: "proj_code",
    },
    {
      title: "OU",
      dataIndex: "ou",
      key: "ou",
    },
    {
      title: "主建部门",
      dataIndex: "dept_name",
      key: "dept_name",
      render: (text) => {
        return text.includes("-") ? text.split("-")[1] : text;
      },
    },
    {
      title: "项目经理",
      dataIndex: "mgr_name",
      key: "mgr_name",
    },
    {
      title: "项目计划文档数",
      dataIndex: "ppd_type",
      key: "ppd_type",
    },
    {
      title: "评审记录文档数",
      dataIndex: "ppd_type_num",
      key: "ppd_type_num",
    },
  ];

  render() {
    const { loading, planProjList, ouList, postData } = this.props;

    const ouOptionList = ouList.map((item, index) => {
      return <Option key={item.OU}>{item.OU}</Option>;
    });
    planProjList.map((item, index) => {
      item.key = index;
    });

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
              项目计划
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <Row gutter={16}>
              <Col className="gutter-box" span={7}>
                <span>团队名称：</span>
                <Input
                  style={{ width: 200 }}
                  value={this.props.proj_name}
                  onChange={(e) => this.setInputShow(e, "proj_name")}
                  onBlur={(e) => this.setInputCondParam(e, "proj_name")}
                  onKeyPress={this.handleEnterKey}
                ></Input>
              </Col>
              <Col className="gutter-box" span={7}>
                <span>项目经理：</span>
                <Input
                  style={{ width: 200 }}
                  value={this.props.mgr_name}
                  onChange={(e) => this.setInputShow(e, "mgr_name")}
                  onBlur={(e) => this.setInputCondParam(e, "mgr_name")}
                  onKeyPress={this.handleEnterKey}
                ></Input>
              </Col>
              <Col className="gutter-box" span={7}>
                <span>生产编码：</span>
                <Input
                  style={{ width: 200 }}
                  value={this.props.proj_code}
                  onChange={(e) => this.setInputShow(e, "proj_code")}
                  onBlur={(e) => this.setInputCondParam(e, "proj_code")}
                  onKeyPress={this.handleEnterKey}
                ></Input>
                <span
                  onClick={this.setCondCollapse}
                  style={{
                    cursor: "pointer",
                    color: "#f04134",
                    marginLeft: "5px",
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
            {this.props.condCollapse ? null : (
              <div>
                <Row gutter={16}>
                  <Col className="gutter-box" span={7}>
                    <span> 主建部门：</span>
                    <Input
                      style={{ width: 200 }}
                      value={this.props.dept_name}
                      onClick={this.showMainDeptModel}
                    ></Input>
                    <Modal
                      key="dept_name"
                      visible={this.state.mainDeptVisible}
                      width={config.DEPT_MODAL_WIDTH}
                      title="选择部门"
                      onCancel={this.hideMainDept}
                      footer={[
                        <Button
                          key="mainDeptNameClose"
                          size="large"
                          onClick={this.hideMainDept}
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
                    <span>主建单位：</span>
                    <Select
                      style={{ width: 190 }}
                      value={this.props.ou}
                      onSelect={this.handleOUChange}
                    >
                      <Option value="">全部</Option>
                      {ouOptionList}
                    </Select>
                  </Col>
                </Row>
              </div>
            )}
          </div>
          <div style={{ float: "right" }}>
            <Button type="primary" onClick={this.resetCond}>
              重置条件
            </Button>
          </div>
          <br />
          {/*数据加载完后再渲染，否则defaultExpandAllRows默认为false*/}
          <Table
            columns={this.columns}
            bordered={true}
            dataSource={planProjList}
            pagination={false} //分页器，配置项参考 pagination，设为 false 时不展示和进行分页
            loading={loading}
            defaultExpandAllRows={true}
            className={styles.orderTable}
            onRowClick={this.goProjEdit}
          />

          {/*加载完才显示页码*/}
          {loading !== true ? (
            <div className={styles.page}>
              <Pagination
                current={Number(this.props.currentPage)}
                total={Number(this.props.total)}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} / ${total}`
                }
                pageSize={10}
                onChange={this.handlePageChange}
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {
    display,
    rowCount,
    ouList,
    planProjList,
    total,
    postData,
    currentPage,
    ou,
    proj_code,
    proj_name,
    dept_name,
    mgr_name,
    condCollapse,
  } = state.projPlan;

  return {
    loading: state.loading.models.projPlan,
    display,
    rowCount,
    ouList,
    planProjList,
    total,
    postData,
    currentPage,
    ou,
    proj_code,
    proj_name,
    dept_name,
    mgr_name,
    condCollapse,
  };
}

export default connect(mapStateToProps)(ProjPlan);
