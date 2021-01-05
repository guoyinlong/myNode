/**
 * 作者：仝飞
 * 创建日期：2017-10-11
 * 邮件：tongf5@chinaunicom.cn
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
} from "antd";
import styles from "./projHistory.less";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import DeptRadioGroup from "../../../components/common/deptRadio.js";
import { ouOptionList } from "../projConst";
import config from "../../../utils/config";
const Option = Select.Option;
const { TextArea } = Input;

/**
 * 作者：仝飞
 * 创建日期：2017-10-11
 * 功能：主子项目不同序号的展示方式
 * @param record 表格的一条记录
 * @param index 表格数据索引
 */
function projIndex(record, index) {
  //  "is_primary": "0",是否主项目0是 1否,level是处于哪一级
  if (record.level == 0) {
    return index + 1;
  } else {
    return (record.parentIndex + 1).toString() + "-" + (index + 1).toString();
  }
}

/**
 * 作者：仝飞
 * 创建日期：2017-10-11
 * 功能：项目列表页面组件
 */
class projHistoryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { mainDeptVisible: false };
  }

  /**
   * 作者：仝飞
   * 创建日期：2017-10-11
   * 功能：动态页码查询功能
   * @param page 页码
   */
  handlePageChange = (page) => {
    const { dispatch } = this.props;
    dispatch({
      type: "projHistoryList/handlePageChange",
      page: page,
    });
    //this.setState({page: page}, ()=> {this.total()})
  };

  /**
   * 作者：仝飞
   * 创建日期：2017-10-11
   * 功能：设置下拉选择型条件参数
   * @param value 参数值
   * @param condType 条件类型，具体的参数对应值
   */
  setSelectCondParam = (value, condType) => {
    const { dispatch } = this.props;
    dispatch({
      type: "projHistoryList/setCondParam",
      value: value,
      condType: condType,
    });
    //this.setState({ [condType]: value,page:1}, ()=> {this.total()});
  };

  /**
   * 作者：仝飞
   * 创建日期：2017-10-11
   * 功能：设置输入型条件参数
   * @param e 输入事件
   * @param condType 条件类型，具体的参数对应值
   */
  setInputCondParam = (e, condType) => {
    //输入型参数需要去掉首尾空格，通过trim
    const { dispatch } = this.props;
    dispatch({
      type: "projHistoryList/setCondParam",
      value: e.target.value.trim(),
      condType: condType,
    });
    //this.setState({ [condType]: e.target.value.trim(),page:1}, ()=> {this.total()});
  };

  /**
   * 作者：仝飞
   * 创建日期：2017-10-11
   * 功能：设置输入型框的显示
   * @param e 输入事件
   * @param condType 条件类型，具体的参数对应值
   */
  setInputShow = (e, condType) => {
    const { dispatch } = this.props;
    dispatch({
      type: "projHistoryList/setInputShow",
      value: e.target.value.trim(),
      condType: condType,
    });
    //this.setState({[type]: e.target.value});
  };

  /**
   * 作者：仝飞
   * 创建日期：2017-10-11
   * 功能：点击新增按钮，跳到添加主页面
   */
  addProjClick = () => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: "projectApp/projClosure/projMainPage",
      })
    );
  };

  /**
   * 作者：仝飞
   * 创建日期：2017-10-11
   * 功能：跳转到已立项项目详细信息
   * @param record 表格的一条记录
   */
  goProjDetail = (record) => {
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: "projectApp/projClosure/historyProject/projHistoryEdit",
        query: {
          proj_id: record.proj_id,
          begin_time: record.begin_time,
          end_time: record.end_time,
          payload: JSON.stringify({
            draftButton: this.props.draftButton,
            ou_name: this.props.ou_name,
            arg_start_year: this.props.arg_start_year,
            arg_end_year: this.props.arg_end_year,
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
   * 作者：仝飞
   * 创建日期：2017-10-11
   * 功能：选择主责部门模态框显示
   */
  showMainDeptModel = () => {
    this.setState({ mainDeptVisible: true });
  };

  /**
   * 作者：仝飞
   * 创建日期：2017-10-11
   * 功能：隐藏主责部门模态框显示
   */
  hideMainDept = () => {
    this.setState({ mainDeptVisible: false });
  };

  /**
   * 作者：仝飞
   * 创建日期：2017-10-11
   * 功能：选择主责部门模态框关闭
   */
  hideMainDeptModel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "projHistoryList/hideMainDeptModel",
      dept_name: this.refs.mainDeptRadioGroup.getData().dept_name,
    });
    this.setState({ mainDeptVisible: false });
    /*this.setState({
     mainDeptVisible:false,
     dept_name:this.refs.mainDeptRadioGroup.getData().dept_name
     },()=> {this.total()});*/
  };

  /**
   * 作者：仝飞
   * 创建日期：2017-10-11
   * 功能：设置条件是否展开
   */
  setCondCollapse = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "projHistoryList/setCondCollapse",
      condCollapse: !this.props.condCollapse,
    });
    //this.setState({condCollapse:!this.state.condCollapse});
  };

  /**
   * 作者：仝飞
   * 创建日期：2017-10-11
   * 功能：重置筛选条件
   */
  resetCond = () => {
    const { dispatch } = this.props;
    dispatch({ type: "projHistoryList/resetCond" });
  };

  /**
   * 作者：仝飞
   * 创建日期：2017-10-26
   * 功能：改变草稿按钮
   * @param btnType 按钮类型
   */
  changeDraftButton = (btnType) => {
    const { dispatch } = this.props;
    dispatch({
      type: "projHistoryList/changeDraftButton",
      btnType: btnType,
    });
  };

  columns = [
    {
      title: "序号",
      dataIndex: "i",
      render: (text, record, index) => projIndex(record, index),
    },
    {
      title: "团队名称",
      dataIndex: "proj_name",
    },
    {
      title: "生产编码",
      dataIndex: "proj_code",
    },
    {
      title: "主建单位",
      dataIndex: "ou",
    },
    {
      title: "主建部门",
      dataIndex: "dept_name",
      render: (text) => {
        return text.includes("-") ? text.split("-")[1] : text;
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
      dataIndex: "tag_show",
    },
  ];

  render() {
    const { loading, list, projTypeDataList } = this.props;
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
              历史项目信息
            </p>
          </div>
          {/*第一行*/}
          <div style={{ textAlign: "center" }}>
            <Row gutter={16}>
              <Col className="gutter-box" span={4} style={{ paddingLeft: 9 }}>
                启动年份：
                <Select
                  style={{ width: 80 }}
                  value={this.props.arg_start_year}
                  onChange={(value) =>
                    this.setSelectCondParam(value, "arg_start_year")
                  }
                >
                  <Option value="">不限</Option>
                  <Option value="2016">2016</Option>
                  <Option value="2017">2017</Option>
                  <Option value="2018">2018</Option>
                  <Option value="2019">2019</Option>
                  <Option value="2020">2020</Option>
                  <Option value="2021">2021</Option>
                  <Option value="2022">2022</Option>
                  <Option value="2023">2023</Option>
                </Select>
              </Col>
              <Col className="gutter-box" span={4} style={{ paddingLeft: 14 }}>
                结项年份：
                <Select
                  style={{ width: 80 }}
                  value={this.props.arg_end_year}
                  onChange={(value) =>
                    this.setSelectCondParam(value, "arg_end_year")
                  }
                >
                  <Option value="">不限</Option>
                  <Option value="2016">2016</Option>
                  <Option value="2017">2017</Option>
                  <Option value="2018">2018</Option>
                  <Option value="2019">2019</Option>
                  <Option value="2020">2020</Option>
                  <Option value="2021">2021</Option>
                  <Option value="2022">2022</Option>
                  <Option value="2023">2023</Option>
                </Select>
              </Col>
              <Col className="gutter-box" span={7} style={{ paddingLeft: 17 }}>
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
              <Col className="gutter-box" span={7}>
                项目分类：
                <Select
                  showSearch
                  style={{ width: 155 }}
                  value={this.props.proj_label}
                  onChange={(value) =>
                    this.setSelectCondParam(value, "proj_label")
                  }
                >
                  <Option value="">全部</Option>
                  <Option value="0">项目类</Option>
                  <Option value="3">项目类(纯第三方)</Option>
                  <Option value="1">小组类</Option>
                  <Option value="2">支撑类</Option>
                </Select>
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
                <Row gutter={14}>
                  <Col className="gutter-box" span={8}>
                    项目类型：
                    <Select
                      showSearch
                      style={{ width: 260 }}
                      value={this.props.proj_type}
                      onChange={(value) =>
                        this.setSelectCondParam(value, "proj_type")
                      }
                    >
                      {projTypeOptionList}
                    </Select>
                  </Col>
                  <Col
                    className="gutter-box"
                    span={7}
                    style={{ paddingLeft: 16 }}
                  >
                    项目经理：
                    <Input
                      style={{ width: 200 }}
                      value={this.props.mgr_name}
                      onChange={(e) => this.setInputShow(e, "mgr_name")}
                      onBlur={(e) => this.setInputCondParam(e, "mgr_name")}
                    ></Input>
                  </Col>
                  <Col className="gutter-box" span={8}>
                    生产编码：
                    <Input
                      style={{ width: 157 }}
                      value={this.props.proj_code}
                      onChange={(e) => this.setInputShow(e, "proj_code")}
                      onBlur={(e) => this.setInputCondParam(e, "proj_code")}
                    ></Input>
                  </Col>
                </Row>
                {/*第三行*/}
                <Row gutter={16}>
                  <Col className="gutter-box" span={8}>
                    <span style={{ verticalAlign: "top" }}>团队名称：</span>
                    <TextArea
                      rows={3}
                      style={{ width: 260 }}
                      value={this.props.proj_name}
                      onChange={(e) => this.setInputShow(e, "proj_name")}
                      onBlur={(e) => this.setInputCondParam(e, "proj_name")}
                    ></TextArea>
                  </Col>
                  <Col
                    className="gutter-box"
                    span={7}
                    style={{ paddingLeft: 16 }}
                  >
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
          <div style={{ float: "right" }}>
            {/*{this.props.draftList.length?*/}
            {/*<span>*/}
            {/*{this.props.draftButton === 'show' ?*/}
            {/*<Button type="primary" onClick={()=>this.changeDraftButton('hide')}>隐藏草稿</Button>*/}
            {/*:*/}
            {/*<Button type="primary" onClick={()=>this.changeDraftButton('show')}>显示草稿</Button>*/}
            {/*}*/}
            {/*</span>*/}
            {/*:*/}
            {/*<Button type="primary" disabled={true}>显示草稿</Button>*/}
            {/*}*/}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={this.resetCond}>
              重置条件
            </Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            {/*<Button type="primary" disabled={this.props.display}  onClick={this.addProjClick}>新增</Button>*/}
          </div>
          <br />

          <Table
            columns={this.columns}
            bordered={true}
            dataSource={list}
            pagination={false} //分页器，配置项参考 pagination，设为 false 时不展示和进行分页
            loading={loading}
            defaultExpandAllRows={true}
            rowClassName={(record, index) =>
              record.is_primary == "0" ? "primary" : "child"
            }
            className={styles.orderTable}
            onRowClick={this.goProjDetail}
          />

          {/*加载完才显示页码*/}
          {this.props.loading !== true ? (
            <div className={styles.page}>
              <Pagination
                current={this.props.page}
                total={Number(this.props.rowCount)}
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
  return {
    loading: state.loading.models.projHistoryList,
    ...state.projHistoryList,
  };
}

export default connect(mapStateToProps)(projHistoryList);
