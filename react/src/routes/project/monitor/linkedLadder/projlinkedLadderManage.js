/**
 * 作者：邓广晖
 * 创建日期：2017-10-11
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：实现项目启动的项目列表展示
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
  Spin,
  Tooltip,
} from "antd";
import styles from "./projStartUp.less";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import DeptRadioGroup from "../../../../components/common/deptRadio.js";
import { ouOptionList } from "../../projConst";
import config from "../../../../utils/config";

const Option = Select.Option;
const { TextArea } = Input;

/**
 * 作者：邓广晖
 * 创建日期：2017-10-11
 * 功能：主子项目不同序号的展示方式
 * @param record 表格的一条记录
 * @param index 表格数据索引
 */
function projIndex(record, index) {
  //  "is_primary": "0",是否主项目0是 1否,level是处于哪一级
  if (record.level == 0) {
    return <span>{index + 1}</span>;
  } else {
    return (
      <span>
        {(record.parentIndex + 1).toString() + "-" + (index + 1).toString()}
      </span>
    );
  }
}

/**
 * 作者：邓广晖
 * 创建日期：2017-10-11
 * 功能：项目列表页面组件
 */
class linkedLadder extends React.Component {
  constructor(props) {
    super(props);
    this.state = { mainDeptVisible: false };
  }

  /**
   * 作者：邓广晖
   * 创建日期：2017-10-11
   * 功能：动态页码查询功能
   * @param page 页码
   */
  handlePageChange = (page) => {
    const { dispatch } = this.props;
    dispatch({
      type: "linkedLadder/handlePageChange",
      page: page,
    });
    //this.setState({page: page}, ()=> {this.total()})
  };

  /**
   * 作者：邓广晖
   * 创建日期：2017-10-11
   * 功能：设置下拉选择型条件参数
   * @param value 参数值
   * @param condType 条件类型，具体的参数对应值
   */
  setSelectCondParam = (value, condType) => {
    const { dispatch } = this.props;
    dispatch({
      type: "linkedLadder/setCondParam",
      value: value,
      condType: condType,
    });
    //this.setState({ [condType]: value,page:1}, ()=> {this.total()});
  };

  /**
   * 作者：邓广晖
   * 创建日期：2017-10-11
   * 功能：设置输入型条件参数
   * @param e 输入事件
   * @param condType 条件类型，具体的参数对应值
   */
  setInputCondParam = (e, condType) => {
    //输入型参数需要去掉首尾空格，通过trim
    const { dispatch } = this.props;
    dispatch({
      type: "linkedLadder/setCondParam",
      value: e.target.value.trim(),
      condType: condType,
    });
    //this.setState({ [condType]: e.target.value.trim(),page:1}, ()=> {this.total()});
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

  /**
   * 作者：邓广晖
   * 创建日期：2017-10-11
   * 功能：设置输入型框的显示
   * @param e 输入事件
   * @param condType 条件类型，具体的参数对应值
   */
  setInputShow = (e, condType) => {
    const { dispatch } = this.props;
    dispatch({
      type: "linkedLadder/setInputShow",
      value: e.target.value.trim(),
      condType: condType,
    });
    //this.setState({[type]: e.target.value});
  };

  /**
   * 作者：邓广晖
   * 创建日期：2017-10-11
   * 功能：点击新增按钮，跳到添加主页面
   */
  // addProjClick = () => {
  //   const { dispatch } = this.props;
  //   dispatch(
  //     routerRedux.push({
  //       pathname: "projectApp/projStartUp/projList/projMainPage",
  //     })
  //   );
  // };

  /**
   * 作者：邓广晖
   * 创建日期：2017-10-11
   * 功能：跳转到已立项项目详细信息
   * @param record 表格的一条记录
   */
  goProjDetail = (record, e) => {
    const { dispatch } = this.props;
    // console.log(this.props, 12315461651561561);
    dispatch(
      routerRedux.push({
        pathname: "projectApp/projMonitor/linkedLadder/linkedStartEdit",
        query: {
          marName: record.marName,
          proj_id: record.projId,
          proj_name: record.projName,
          begin_time: record.begin_time,
          end_time: record.end_time,
          pu_deptid: this.props.pu_deptid,
          dept_name: this.props.dept_name,
          key: e,
          payload: JSON.stringify({
            draftButton: this.props.draftButton,
            ou_name: this.props.ou_name,
            pu_deptid: this.props.pu_deptid,
            proj_label: this.props.proj_label,
            proj_code: this.props.proj_code,
            proj_name: this.props.proj_name,
            dept_name: this.props.dept_name,
            mgr_name: this.props.mgr_name,
            proj_type: this.props.proj_type,
            staff_id: this.props.staff_id,
            page: this.props.page,
            condCollapse: this.props.condCollapse,
          }),
        },
      })
    );
  };

  /**
   * 作者：邓广晖
   * 创建日期：2017-10-11
   * 功能：选择主责部门模态框显示
   */
  showMainDeptModel = () => {
    this.setState({ mainDeptVisible: true });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2017-10-11
   * 功能：隐藏主责部门模态框显示
   */
  hideMainDept = () => {
    this.setState({ mainDeptVisible: false });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2017-10-11
   * 功能：选择主责部门模态框关闭
   */
  hideMainDeptModel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "linkedLadder/hideMainDeptModel",
      dept_name: this.refs.mainDeptRadioGroup.getData().dept_name,
      dept_id: this.refs.mainDeptRadioGroup.getData().dept_id,
    });
    this.setState({ mainDeptVisible: false });
    /*this.setState({
          mainDeptVisible:false,
          dept_name:this.refs.mainDeptRadioGroup.getData().dept_name
        },()=> {this.total()});*/
  };

  /**
   * 作者：邓广晖
   * 创建日期：2017-10-11
   * 功能：设置条件是否展开
   */
  setCondCollapse = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "linkedLadder/setCondCollapse",
      condCollapse: !this.props.condCollapse,
    });
    //this.setState({condCollapse:!this.state.condCollapse});
  };

  /**
   * 作者：邓广晖
   * 创建日期：2017-10-11
   * 功能：重置筛选条件
   */
  resetCond = () => {
    const { dispatch } = this.props;
    dispatch({ type: "linkedLadder/resetCond" });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2017-10-26
   * 功能：改变草稿按钮
   * @param btnType 按钮类型
   */
  changeDraftButton = (btnType) => {
    const { dispatch } = this.props;
    dispatch({
      type: "linkedLadder/changeDraftButton",
      btnType: btnType,
    });
  };

  /**
   * 作者：王均超
   * 创建日期：2019-12-26
   * 功能：添加项目类(纯第三方)选项
   */

  columns = [
    {
      title: "序号",
      dataIndex: "i",
      width: "9%",
      align: "center",
      render: (text, record, index) => projIndex(record, index),
    },
    {
      title: "团队名称",
      dataIndex: "projName",
      width: "18%",
      align: "center",
      render: (text, record, index) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      },
    },
    {
      title: "生产编码",
      dataIndex: "projCode",
      width: "12%",
      align: "center",
      render: (text, record, index) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      },
    },
    {
      title: "归属部门",
      dataIndex: "projBelongDepName",
      width: "10%",
      align: "center",
      render: (text) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      },
    },
    {
      title: "主建单位",
      dataIndex: "ouName",
      width: "9%",
      align: "center",
      render: (text, record, index) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      },
    },
    {
      title: "主建部门",
      dataIndex: "projMainDepName",
      width: "12%",
      align: "center",
      render: (text, record, index) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      },
    },
    {
      title: "项目经理",
      dataIndex: "marName",
      width: "6%",
      align: "center",
      render: (text, record, index) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      },
    },
    {
      title: "项目类型",
      dataIndex: "projKind",
      width: "5%",
      align: "center",
      render: (text, record, index) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      },
    },
    {
      title: "主/子项目",
      dataIndex: "isPrimary",
      width: "6%",
      align: "center",
      render: (text, record, index) => {
        return (
          <div style={{ textAlign: "left" }}>
            {text === "0" ? "主项目" : "子项目"}
          </div>
        );
      },
    },
    {
      title: "项目分类",
      dataIndex: "projType",
      width: "6%",
      align: "center",
      render: (text) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      },
    },
    {
      title: "状态",
      dataIndex: "projState",
      width: "6%",
      align: "center",
      render: (text, record, index) => {
        switch (text) {
          case 0:
            text = "删除/禁用";
            break;
          case 1:
            text = "草稿";
            break;
          case 2:
            text = "已创建";
            break;
          case 3:
            text = "已创建";
            break;
          case 4:
            text = "建设中";
            break;
          case 5:
            text = "结项";
            break;
        }
        return <div style={{ textAlign: "left" }}>{text}</div>;
      },
    },
  ];

  render() {
    const { loading, list, leix, fenl, puDeptNameList } = this.props;
    //处理项目类型
      let leixlist = [];
      if (leix.length) {
        leixlist.push(
          <Option value="9999" key="9999">
            {"全部"}
          </Option>
        );
        for (let i = 0; i < leix.length; i++) {
          leixlist.push(
            <Option
              value={leix[i].uuid}
              key={leix[i].uuid}
            >
              {leix[i].typeNameShow}
            </Option>
          );
        }
      }


    //处理项目分类
      let fenllist = [];
      if (fenl.length) {
        fenllist.push(
          <Option value="9999" key="9999">
            {"全部"}
          </Option>
        );
        for (let i = 0; i < fenl.length; i++) {
          fenllist.push(
            <Option
              value={fenl[i].id}
              key={fenl[i].id}
            >
              {fenl[i].typeName}
            </Option>
          );
        }
      }

    //归属部门
    let puDeptNameListTemp = [];
    if (puDeptNameList.length) {
      puDeptNameListTemp.push(
        <Option value="" key="">
          {"全部"}
        </Option>
      );
      for (let i = 0; i < puDeptNameList.length; i++) {
        puDeptNameListTemp.push(
          <Option
            value={puDeptNameList[i].pu_dept_id}
            key={puDeptNameList[i].pu_dept_id}
          >
            {puDeptNameList[i].pu_dept_name.split("-")[1]}
          </Option>
        );
      }
    }

    return (
      <Spin tip={config.IS_LOADING} spinning={this.props.loading}>
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
                项目信息管理
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              {/*第一行*/}
              <Row gutter={16}>
                <Col className="gutter-box" span={7}>
                  <span style={{ width: 200 }}>团队名称：</span>
                  <Input
                    rows={3}
                    style={{ width: 200 }}
                    value={this.props.proj_name}
                    onChange={(e) => this.setInputShow(e, "proj_name")}
                    onBlur={(e) => this.setInputCondParam(e, "proj_name")}
                    onKeyPress={this.handleEnterKey}
                  ></Input>
                </Col>
                <Col className="gutter-box" span={7}>
                  项目经理：
                  <Input
                    style={{ width: 200 }}
                    value={this.props.mgr_name}
                    onChange={(e) => this.setInputShow(e, "mgr_name")}
                    onBlur={(e) => this.setInputCondParam(e, "mgr_name")}
                    onKeyPress={this.handleEnterKey}
                  ></Input>
                </Col>
                <Col className="gutter-box" span={8}>
                  生产编码：
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
                      marginLeft: 20,
                      cursor: "pointer",
                      color: "#f04134",
                    }}
                  >
                    {this.props.condCollapse ? (
                      <span>
                        展开
                        <Icon type="down-circle-o" />
                      </span>
                    ) : (
                      <span>
                        收起
                        <Icon type="up-circle-o" />
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
                        value={this.props.projType}
                        onChange={(value) =>
                          this.setSelectCondParam(value, "proj_type")
                        }
                      >
                        {leixlist}
                      </Select>
                    </Col>
                    <Col className="gutter-box" span={7}>
                      项目分类：
                      <Select
                        showSearch
                        style={{ width: 200 }}
                        value={this.props.proj_label}
                        onChange={(value) =>
                          this.setSelectCondParam(value, "proj_label")
                        }
                      >
                        {fenllist}
                      </Select>
                    </Col>
                    <Col className="gutter-box" span={7}>
                      主建单位：
                      <Select
                        style={{ width: 200 }}
                        value={this.props.ou_name}
                        onChange={(value) =>
                          this.setSelectCondParam(value, "ou_name")
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
                      归属部门：
                      <Select
                        dropdownMatchSelectWidth={false}
                        style={{ width: 200 }}
                        value={this.props.pu_deptid}
                        onChange={(value) =>
                          this.setSelectCondParam(value, "pu_deptid")
                        }
                      >
                        {puDeptNameListTemp}
                      </Select>
                    </Col>
                    <Col className="gutter-box" span={7}>
                      <span style={{ verticalAlign: "top" }}> 主建部门：</span>
                      <TextArea
                        rows={3}
                        style={{ width: 200 }}
                        onClick={this.showMainDeptModel}
                        value={this.props.dept_name}
                      ></TextArea>
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
                  </Row>
                </div>
              )}
            </div>
            <div style={{ marginTop: "10px" }}>
              {/* <div style={{ float: "left" }}>
                {this.props.displayData.RetNum === "1" ? (
                  <Button type="primary" onClick={this.addProjClick}>
                    新增
                  </Button>
                ) : this.props.displayData.RetNum === "2" ? (
                  <Tooltip title={this.props.displayData.RetVal}>
                    <Button type="primary" disabled={true}>
                      新增
                    </Button>
                  </Tooltip>
                ) : null}
              </div> */}

              {/* {this.props.draftList.length ? (
                <div style={{ float: "left" }}>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  {this.props.draftButton === "show" ? (
                    <Button
                      type="primary"
                      onClick={() => this.changeDraftButton("hide")}
                    >
                      隐藏草稿
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      onClick={() => this.changeDraftButton("show")}
                    >
                      显示草稿
                    </Button>
                  )}
                </div>
              ) : null} */}

              <div style={{ textAlign: "right" }}>
                <Button type="primary" onClick={this.resetCond}>
                  重置条件
                </Button>
              </div>
            </div>

            <div>
              {/* {this.props.draftButton === "show" ? (
                <Table
                  columns={this.columns}
                  bordered={true}
                  dataSource={this.props.draftList}
                  pagination={false} //分页器，配置项参考 pagination，设为 false 时不展示和进行分页
                  loading={loading}
                  className={styles.orderTable}
                  onRowClick={this.addProjClick}
                  style={{ marginTop: "10px" }}
                />
              ) : null} */}

              <Table
                columns={this.columns}
                bordered={true}
                dataSource={list}
                pagination={false} //分页器，配置项参考 pagination，设为 false 时不展示和进行分页
                defaultExpandAllRows={true}
                rowClassName={(record, index) =>
                  record.is_primary == "0" ? "primary" : "child"
                }
                className={styles.orderTable}
                onRowClick={this.goProjDetail}
                style={{ marginTop: "10px" }}
              />

              {/*加载完才显示页码*/}
                            {this.props.loading !== true ? (
                <div className={styles.page}>
                  <Pagination
                    current={this.props.page}
                    total={Number(this.props.rowCount)}
                    pageSize={10}
                    onChange={this.handlePageChange}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Spin>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.linkedLadder,
    ...state.linkedLadder,
  };
}

export default connect(mapStateToProps)(linkedLadder);
