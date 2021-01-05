/**
 *  作者: 毕禹盟
 *  创建日期: 2020-11-23
 *  邮箱：biyumeng@jrtechsoft.com.cn
 *  文件说明：关联天梯工程
 */
import React from "react";
import {
  Tabs,
  Button,
  Row,
  Col,
  Table,
  Icon,
  Modal,
  Input,
  Select,
  Form,
  pagination,
} from "antd";
import styles from "./projStartUp.less";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import Cookie from "js-cookie";
import ProjMilestone from "../../../../components/Ladder/ProjMilestone";
import Teaminformation from "../../../../components/Ladder/Teaminformation";

const { Option } = Select;
const TabPane = Tabs.TabPane;
const { TextArea } = Input;
const FormItem = Form.Item;

function handleChange(value) {
  // console.log(`selected ${value}`);
}

class assessmentMail extends React.Component {
  componentWillMount() {}

  componentDidMount() {
    this.getLinkedList();
    // this.projectInfoQuery()
    // this.tiantiQuery()
  }

  state = {
    names: Cookie.get("username"),
    selectedRowKeys: []
  }

  constructor(props) {
    super(props);
    this.state = { mainDeptVisible: false };
  }


  //关联按钮 查询未关联天梯信息
  showModal = () => {
    this.setState({
      visible: true,
      // deptId: '',
      // tianTiName: '',
      // email: '',
    });
    let data = {
      deptId: this.state.deptId,
      tianTiName: this.state.tianTiName,
      email: this.state.email,
    };
    const { dispatch } = this.props;
    dispatch({
      type: "linkedStartEdit/getNoLinked",
      condition: data,
    });
  };

  setInputShow = (e, which) => {
    const input = e.target.value;

    this.setState({ [which]: input }, () => {
      const { tianTiName, email } = this.state;
      let data = {
        deptId: this.state.deptId,
        tianTiName: tianTiName,
        email: email,
      };

      // console.log(data);
      this.props.dispatch({
        type: "linkedStartEdit/getNoLinked",
        condition: data,
      });
    });
  };

  setDeptShow = (e, which) => {
    this.setState({ [which]: e }, () => {
      const { deptId } = this.state;
      let data = {
        deptId: deptId,
        tianTiName: this.state.tianTiName,
        email: this.state.email,
      };
      const { dispatch } = this.props;
      dispatch({
        type: "linkedStartEdit/getNoLinked",
        condition: data,
      });
    });
  };

  // 选择已有的天梯工程关联
  handleOk = (e) => {
    this.setState({
      visible: false,
    });
    // console.log(this.state.selectedRows);

    // 多选天梯并把他们合并为一个数组
    const newsTianti = this.state.selectedRows.map(function (item, index) {
      return {
        deptId: item.deptId,
        deptName: item.deptName,
        email: item.email,
        // pmId: item.pmId,
        pmName: item.pmName,
        ladderProjectId: item.ladderProjectId,
        ladderProjectName: item.ladderProjectName,
      };
    });
    const { dispatch } = this.props;
    dispatch({
      type: "linkedStartEdit/relationExistTianti",
      // projId: this.props.location.query.proj_id,
      tiantiLinkDTO: {
        createId: Cookie.get("userid"),
        pmEmail: Cookie.get("email"),
        createName: Cookie.get("username"),
        deptId: Cookie.get("dept_id"),
        deptName: Cookie.get("dept_name"),
        projId: this.props.location.query.proj_id,
        tiantis: newsTianti,
      },
    });
    this.setState({
      selectedRowKeys: [],
    })
  };
  handleCancel = (e) => {
    // console.log(e);
    this.setState({
      visible: false,
      selectedRowKeys: [],
    });
  };

  //新增按钮
  newShowModal = () => {
    this.setState({
      visible2: true,
    });
  };

  //取消关联按钮
  cancelTianti = (record) => {
    // console.log(record)
    const { dispatch } = this.props;
    const { proj_id } = this.props.location.query;
    // console.log(e);
    // console.log(this.state.newsInput);
    // console.log(Cookie.get('email'))
    Modal.confirm({
      title: "确实要取消关联此天梯工程?",
      // content: '规划库中的规划也将删除',
      okText: "确定",
      cancelText: "取消",
      onOk() {
        dispatch({
          type: "linkedStartEdit/cancelTianti",
          // projId: this.props.location.query.proj_id,
          tiantiLinkDTO: {
            createId: Cookie.get("userid"),
            pmEmail: Cookie.get("email"),
            createName: Cookie.get("username"),
            deptId: Cookie.get("dept_id"),
            deptName: Cookie.get("dept_name"),
            projId: proj_id,
            tiantis: [
              {
                ladderProjectId: record.ladderProjectId,
                ladderProjectName: record.ladderProjectName,
                deptId: record.deptId,
                deptName: record.deptName,
                email: record.email,
                pmId: record.pmId,
                pmName: record.pmName,
              },
            ],
          },
        });
      },
      onCancel() {},
    });
  };

  //tab回调
  callback = (e) =>{
    const { proj_id, key } = this.props.location.query;
    if (e == 1) {
      this.props.dispatch({
        type: "linkedStartEdit/querydata",
        proj_id,
        key
      })
    }
  }

  // 新增天梯工程
  newHandleOk = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: "linkedStartEdit/setNewTianti",
      tiantiLinkDTO: {
        createId: Cookie.get("userid"),
        pmEmail: Cookie.get("email"),
        createName: Cookie.get("username"),
        deptId: Cookie.get("dept_id"),
        deptName: Cookie.get("dept_name"),
        projId: this.props.location.query.proj_id,
        tiantis: [
          {
            ladderProjectName: this.state.newsInput,
          },
        ],
      },
    });
    e.target.value = null;
    this.setState({
      visible2: false,
      newsInput: "",
    });
  };
  newHandleCancel = (e) => {
    // console.log(e);
    this.setState({
      visible2: false,
    });
  };

  //获得新建天梯工程输入框信息
  inputChange(e) {
    // alert(e.target.value)
    this.setState({
      newsInput: e.target.value,
    });
  }

  //已关联天梯查询
  getLinkedList = (e) => {
    const { dispatch } = this.props;
    // console.log(this.props.location.query.proj_id)
    // console.log(this.props.location.query.proj_name)
    dispatch({
      type: "linkedStartEdit/getLinkedRelation",
      // projId: this.props.location.query.proj_id,
      projId: this.props.location.query.proj_id,
      e
    });
  };

  // 项目详细信息
  // projectInfoQuery = (e) => {
  //   const { dispatch } = this.props;
  //   console.log(this.props.location.query.proj_id)
  //   dispatch({
  //     type: "linkedStartEdit/projectInfoQuery",
  //     projId: this.props.location.query.proj_id,

  //   });

  //   console.log(this.props)
  // }

  // 生产单元列表信息查询
  // tiantiQuery = (e) => {
  //   const { dispatch } = this.props;
  //   // console.log(this.props)
  //   dispatch({
  //     type: "linkedStartEdit/tiantiQuery",

  //   });

  // }

  render() {
    const { dataFirst, data2Rows, tianti } = this.props;
    const columns = [
      {
        title: "序号",
        dataIndex: "i",
        width: "9%",
        align: "center",
        render: (text, record, index) => <span>{index + 1}</span>,
      },
      {
        title: "天梯工程名称",
        dataIndex: "ladderProjectName",
        key: "ladderProjectName",
        width: "40%",
        align: "center",
      },
      {
        title: "归属部门",
        dataIndex: "deptName",
        key: "deptName",
        width: "20%",
        align: "center",
      },
      {
        title: "项目经理",
        dataIndex: "pmName",
        key: "pmName",
        width: "15%",
        align: "center",
      },
      {
        title: "操作",
        dataIndex: "tags",
        key: "tags",
        width: "15%",
        align: "center",
        render: (text, record) => (
          <Button
            disabled={Cookie.get("username") == this.props.location.query.marName ? false : true}
            style={{ width: "120px", textAlign: "center" }}
            size="small"
            type="primary"
            onClick={(e) => this.cancelTianti(record, e)}
          >
            取消关联
          </Button>
        ),
      },
    ];
    // const data = this.props.dataRows;
    // const data = [
    //   {
    //     key: 1,
    //     serialNumber: '1',
    //     productionName: '2020年中国联通总部无锡数据中心XX项目',
    //     attrDepartment: '公众研发事业部',
    //     proManager: '薛刚',
    //   },
    //   {
    //     key: 2,
    //     serialNumber: '2',
    //     productionName: '2020年中国联通总部项目制管理平台研发项目',
    //     attrDepartment: '公众研发事业部',
    //     proManager: '薛刚',
    //   },
    //   {
    //     key: 3,
    //     serialNumber: '3',
    //     productionName: '2020年中国联通总部集客订单中心',
    //     attrDepartment: '公众研发事业部',
    //     proManager: '薛刚',
    //   },
    //   {
    //     key: 4,
    //     serialNumber: '4',
    //     productionName: '5G智能xxx',
    //     attrDepartment: '公众研发事业部',
    //     proManager: '薛刚',
    //   },
    // ];

    const columns2 = [
      {
        title: "序号",
        dataIndex: "i",
        width: "9%",
        align: "center",
        render: (text, record, index) => <span>{index + 1}</span>,
      },
      {
        title: "天梯工程名称",
        dataIndex: "ladderProjectName",
        key: "ladderProjectName",
        width: "30%",
        align: "center",
      },
      {
        title: "归属部门",
        dataIndex: "deptName",
        key: "deptName",
        width: "20%",
        align: "center",
      },
      {
        title: "项目经理",
        dataIndex: "pmName",
        key: "pmName",
        width: "15%",
        align: "center",
      },
      {
        title: "邮箱",
        dataIndex: "email",
        key: "email",
        width: "25%",
        align: "center",
      },
    ];

    //关联中选择框
    const { selectedRowKeys }= this.state    //天梯工程选项按钮
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.setState({
          selectedRows,
          selectedRowKeys,
        });
      },
      getCheckboxProps: (record) => ({
        disabled: record.name === "Disabled User", // Column configuration not to be checked
      }),
    };

    const { proj_name } = this.props.location.query;

    // console.log(this.props, 2222222222222222222222222);

    return (
      <div style={{ background: "white", padding: "10px 10px 10px 10px" }}>
        <div style={{ paddingLeft: 15, paddingRight: 15 }}>
          <p
            style={{
              textAlign: "center",
              fontSize: "20px",
              marginBottom: "10px",
            }}
          >
            {proj_name}
          </p>
        </div>

        <Tabs onChange={this.callback}>
          <TabPane tab="关联天梯管理 " key="0">
            <div
              style={{ paddingTop: 13, paddingBottom: 16, background: "white" }}
            >
              <div style={{ paddingLeft: 15, paddingRight: 15 }}>
                <div style={{ height: "40px", lineHeight: "40px" }}>
                  <Button
                    type="primary"
                    disabled={Cookie.get("username") == this.props.location.query.marName ? false : true}
                    style={{
                      marginBottom: "10px",
                      float: "right",
                      marginLeft: "10px",
                    }}
                    onClick={this.newShowModal}
                  >
                    新增
                  </Button>
                  <Button
                    type="primary"
                    disabled={Cookie.get("username") == this.props.location.query.marName ? false : true}
                    style={{
                      marginBottom: "10px",
                      float: "right",
                      marginLeft: "10px",
                    }}
                    onClick={this.showModal}
                  >
                    关联
                  </Button>
                </div>

                <Modal
                  width="70%"
                  title="关联天梯工程"
                  visible={this.state.visible}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                >
                  <Row gutter={24} style={{ marginBottom: "25px" }}>
                    <Col
                      className="gutter-box"
                      span={8}
                      style={{ textAlign: "left" }}
                    >
                      天梯工程名称：
                      <Input
                        style={{ width: "70%", marginTop: "10px" }}
                        onChange={(e) => this.setInputShow(e, "tianTiName")}
                      ></Input>
                    </Col>
                    <Col
                      className="gutter-box"
                      span={7}
                      style={{ textAlign: "left" }}
                    >
                      归属部门：
                      <Select
                        dropdownMatchSelectWidth={false}
                        defaultValue=""
                        style={{ width: "70%", marginTop: "10px" }}
                        onChange={(e) => this.setDeptShow(e, "deptId")}
                      >
                        <Option key={0} value="">
                          全部
                        </Option>
                        {this.props.puDeptNameList.map((item) => (
                          <Option
                            key={item.pu_dept_name}
                            value={item.pu_dept_id}
                          >
                            {item.pu_dept_name}
                          </Option>
                        ))}
                      </Select>
                    </Col>
                    <Col
                      className="gutter-box"
                      span={9}
                      style={{ textAlign: "left" }}
                    >
                      项目经理邮箱：
                      <Input
                        placeholder="必须是完整邮箱！"
                        style={{ width: "70%", marginTop: "10px" }}
                        onChange={(e) => this.setInputShow(e, "email")}
                      ></Input>
                    </Col>
                  </Row>

                  <Table
                    columns={columns2}
                    rowKey={record =>record.ladderProjectId}
                    className={styles.orderTable}
                    // expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>}
                    dataSource={this.props.tiantiQuery}
                    // style={{ textAlign:'center' }}
                    indentSize={0}
                    // pagination={false}
                    rowSelection={rowSelection}
                  />
                </Modal>

                <Modal
                  width="40%"
                  title="新增天梯工程"
                  visible={this.state.visible2}
                  onOk={this.newHandleOk}
                  onCancel={this.newHandleCancel}
                >
                  <Row gutter={24} style={{ marginBottom: "25px" }}>
                    <Col
                      className="gutter-box"
                      span={22}
                      style={{ textAlign: "center" }}
                    >
                      天梯工程名称：
                      <Input
                        onChange={(e) => this.inputChange(e)}
                        value={this.state.newsInput}
                        style={{ width: "70%", marginTop: "10px" }}
                      ></Input>
                    </Col>
                  </Row>
                </Modal>

                <Table
                  columns={columns}
                  className={styles.orderTable}
                  // expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>}
                  dataSource={this.props.dataRows}
                  // style={{ textAlign:'center' }}
                  indentSize={0}
                  pagination={true}
                />
              </div>
            </div>
          </TabPane>

          <TabPane tab="里程碑管理 " key="1">
            <ProjMilestone
              dataFirst={dataFirst} //一级里程碑
              data2Rows={data2Rows} //二级里程碑
              tianti={tianti}
              dispatch={this.props.dispatch} //天梯工程
              query={this.props.location.query}
              datawe = { this.props.datawe}
            />
          </TabPane>

          {/* <TabPane tab="天梯团队信息 " key="2">
            <Teaminformation />
          </TabPane> */}
        </Tabs>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    loading: state.loading.models.linkedStartEdit,
    ...state.linkedStartEdit,
  };
}

export default connect(mapStateToProps)(assessmentMail);
