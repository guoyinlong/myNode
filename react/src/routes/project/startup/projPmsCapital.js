/**
 * 作者：张枫
 * 日期：2018-09-11
 * 邮箱：zhangf142@chinaunicom.cn
 * 说明：项目启动-资本化项目
 **/
import React from "react";
import { connect } from "dva";
import {
  Button,
  Table,
  Input,
  Modal,
  Form,
  Switch,
  Pagination,
  Select,
  Row,
  Col
} from "antd";
import styles from "./projPmsCapital.less";
import moment from "moment";
const Option = Select.Option;

class ProjPmsCapital extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  state = {
    next_date: "",
  };
  /**
   * 作者：张枫
   * 日期：2018-09-18
   * 邮箱：zhangf142@chinaunicom.cn
   * 说明：项目（PMS）开启或结束
   **/
  startOrEndProjectCapital = (record, arg_flag) => {
    this.setState({
      next_date: record.next_date,
    });
    this.props.dispatch({
      type: "projPmsCaptial/startOrEndProjectCapital",
      pms_uuid: record.pms_uuid,
      proj_id: record.proj_id,
      proj_uid: record.proj_uid,
      arg_flag: arg_flag,
    });
  };
  /**
   * 作者：张枫
   * 日期：2018-09-25
   * 邮箱：zhangf142@chinaunicom.cn
   * 说明：项目资本化查询页
   **/
  queryProjCapitalDetail = (record, e) => {
    e.stopPropagation();
    this.props.dispatch({
      type: "projPmsCaptial/queryProjCaptialDetail",
      proj_id: record.proj_id,
      record: record,
    });
  };
  /**
   * 作者：张枫
   * 日期：2018-09-25
   * 邮箱：zhangf142@chinaunicom.cn
   * 说明：返回资本化页面
   **/
  goBack = (content) => {
    this.props.dispatch({
      type: "projPmsCaptial/goBack",
      content: content,
    });
  };
  /**
   * 作者：张枫
   * 日期：2018-09-25
   * 邮箱：zhangf142@chinaunicom.cn
   * 说明：返回资本化页面
   **/
  queryProject = (typeItem) => {
    this.props.dispatch({
      type: "projPmsCaptial/queryProject",
      typeItem: typeItem,
    });
  };
  /**
   * 作者：张枫
   * 日期：2018-09-26
   * 邮箱：zhangf142@chinaunicom.cn
   * 说明：查询
   * @param e 输入时间
   * @param objParam 输入的对象参数
   **/
  searchProject = (e, objParam) => {
    this.props.dispatch({
      type: "projPmsCaptial/searchProject",
      value: e.target.value,
      objParam: objParam,
    });
  };
  saveSelect = (e, objParam) => {
    this.props.dispatch({
      type: "projPmsCaptial/searchProject",
      value: e,
      objParam: objParam,
    });
  };
  cancelSendDingDing = (arg_flag) => {
    this.props.dispatch({
      type: "projPmsCaptial/cancelSendDingDing",
      arg_flag: arg_flag,
    });
  };
  //页码处理
  handlePageChange = (page) => {
    this.props.dispatch({
      type: "projPmsCaptial/handlePage",
      page: page,
    });
  };
  //pms查看页码处理
  handlePmsPageChange = (page) => {
    this.props.dispatch({
      type: "projPmsCaptial/handlePmsPage",
      page: page,
    });
  };
  confirmSendDingDing = (arg_flag) => {
    if (arg_flag === "0") {
      this.refs.SendDingDing.validateFields((err, values) => {
        if (!err) {
          this.props.dispatch({
            type: "projPmsCaptial/confirmSendDingDing",
            values: values,
            arg_flag: arg_flag,
          });
        } else {
          message.error("请完善信息！");
        }
      });
    } else if (arg_flag === "1") {
      this.refs.EndDingDing.validateFields((err, values) => {
        if (!err) {
          this.props.dispatch({
            type: "projPmsCaptial/confirmSendDingDing",
            values: values,
            arg_flag: arg_flag,
          });
        } else {
          message.error("请完善信息！");
        }
      });
    } else if (arg_flag === "2") {
      this.refs.AllEnd.validateFields((err, values) => {
        if (!err) {
          this.props.dispatch({
            type: "projPmsCaptial/confirmSendDingDing",
            values: values,
            arg_flag: arg_flag,
          });
        } else {
          message.error("请完善信息！");
        }
      });
    }
  };
  //外层列表表头
  columns = [
    {
      title: "序号",
      dataIndex: "key",
      key: "",
      render: (index) => {
        return <div>{index + 1}</div>;
      },
    },
    {
      title: "生产编码",
      dataIndex: "proj_code",
      key: "",
      render: (text) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      },
    },
    {
      title: "团队名称",
      dataIndex: "proj_name",
      key: "",
      render: (text) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      },
    },
    {
      title: "项目经理",
      dataIndex: "mgr_name",
      key: "",
      render: (text) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      },
    },
    {
      title: "操作",
      dataIndex: "",
      key: "",
      render: (record) => {
        return (
          <div style={{ textAlign: "left" }}>
            {record.notice_show === "1" ? (
              record.all_end_state === "1" ? (
                <Button
                  type="primary"
                  onClick={() => {
                    this.startOrEndProjectCapital(record, "2");
                  }}
                >
                  {"全部结束"}
                </Button>
              ) : (
                <Button type="primary" disabled="false">
                  {"全部结束"}
                </Button>
              )
            ) : (
              ""
            )}
            &nbsp;&nbsp;
            <Button
              type="primary"
              onClick={(e) => this.queryProjCapitalDetail(record, e)}
            >
              {"查看"}
            </Button>
          </div>
        );
      },
    },
  ];
  //内层列表表头
  pmsColumns = [
    {
      title: "序号",
      dataIndex: "",
      key: "",
      width: "9%",
      render: (text, record, index) => {
        return <div>{index + 1}</div>;
      },
    },
    {
      title: "PMS项目编码",
      dataIndex: "pms_code",
      key: "",
      render: (text) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      },
    },
    {
      title: "PMS项目名称",
      dataIndex: "pms_name",
      key: "",
      render: (text) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      },
    },
    {
      title: "状态",
      dataIndex: "tag_show",
      key: "",
      render: (text) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      },
    },
    {
      title: "操作",
      dataIndex: "",
      key: "",
      render: (record) => {
        return (
          <div>
            {record.notice_show === "1" ? (
              record.state === "0" || record.state === "2" ? (
                <Button
                  type="primary"
                  onClick={() => {
                    this.startOrEndProjectCapital(record, "0");
                  }}
                >
                  {"开始"}
                </Button>
              ) : (
                <Button
                  type="primary"
                  disabled="false"
                  onClick={() => {
                    this.startOrEndProjectCapital(record, "0");
                  }}
                >
                  {"开始"}
                </Button>
              )
            ) : (
              ""
            )}
            &nbsp;&nbsp;
            {record.notice_show === "1" ? (
              record.state === "0" || record.state === "1" ? (
                <Button
                  type="primary"
                  onClick={() => {
                    this.startOrEndProjectCapital(record, "1");
                  }}
                >
                  {"结束"}
                </Button>
              ) : (
                <Button
                  type="primary"
                  disabled="false"
                  onClick={() => {
                    this.startOrEndProjectCapital(record, "1");
                  }}
                >
                  {"结束"}
                </Button>
              )
            ) : (
              ""
            )}
          </div>
        );
      },
    },
  ];
  //详细页列表
  detailsColumns = [
    {
      title: "序号",
      dataIndex: "key",
      key: "",
      render: (index) => {
        return <div>{index + 1}</div>;
      },
    },
    {
      title: "PMS项目编码",
      dataIndex: "pms_code",
      key: "",
      render: (text) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      },
    },
    {
      title: "PMS项目名称",
      dataIndex: "pms_name",
      key: "",
      render: (text) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      },
    },
    {
      title: "项目类型",
      dataIndex: "proj_type",
      key: "",
      render: (text) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      },
    },
    {
      title: "生效时间",
      dataIndex: "effective_date",
      key: "",
      render: (text) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      },
    },
    {
      title: "停止时间",
      dataIndex: "invalid_date",
      key: "",
      render: (text) => {
        return <div style={{ textAlign: "left" }}>{text}</div>;
      },
    },
  ];

  render() {
    const { projList, tagList } = this.props;
    const tagList1 = tagList.map((item) => {
      return <Option key={item.tag_key}>{item.tag_value}</Option>;
    });
    const expandedRowRender = (record) => {
      let pmsList = [];
      if (record.pms_list !== "NaN") {
        pmsList = record.pms_list;
      }
      return (
        <Table
          columns={this.pmsColumns}
          pagination={false}
          dataSource={pmsList}
        />
      );
    };
    return (
      <span>
        {this.props.contentIndex === "mainPage" ? (
          <div style={{ padding: "13px 15px 16px 15px", background: "white" }}>
            <div>
              <p
                style={{
                  textAlign: "center",
                  fontSize: "20px",
                  marginBottom: "10px",
                }}
              >
                资本化项目
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              {/* <span>团队名称:</span>&nbsp;&nbsp;
                            <Input
                                style={{width:190}}
                                maxLength={'20'}
                                placeholder={'最多可输入20字'}
                                onChange={(e)=>this.searchProject(e,'arg_proj_name')}
                                value={this.props.projParam.arg_proj_name}
                            />&nbsp;&nbsp;
                            <span>项目经理:</span>&nbsp;&nbsp;
                            <Input
                                style={{width:190}}
                                maxLength={'20'}
                                placeholder={'最多可输入20字'}
                                onChange={(e)=>this.searchProject(e,'arg_mgr_name')}
                                value={this.props.projParam.arg_mgr_name}
                            />&nbsp;&nbsp;
                            <span>状态:</span>&nbsp;&nbsp;
                            <Select
                              style={{width:150}}
                              onChange ={(e)=>this.saveSelect(e,'tag_key')}
                              value={this.props.projParam.tag_key}
                            >
                              {tagList1}
                            </Select> */}
              <Row gutter={16}>
                <Col className="gutter-box" span={7}>
                  <span>团队名称：</span>
                  <Input
                    style={{ width: 190 }}
                    maxLength={"20"}
                    placeholder={"最多可输入20字"}
                    onChange={(e) => this.searchProject(e, "arg_proj_name")}
                    value={this.props.projParam.arg_proj_name}
                  ></Input>
                </Col>
                <Col className="gutter-box" span={7}>
                  <span>项目经理：</span>
                  <Input
                    style={{ width: 190 }}
                    maxLength={"20"}
                    placeholder={"最多可输入20字"}
                    onChange={(e) => this.searchProject(e, "arg_mgr_name")}
                    value={this.props.projParam.arg_mgr_name}
                  ></Input>
                </Col>
                <Col className="gutter-box" span={7}>
                  <span>状态:</span>&nbsp;&nbsp;
                  <Select
                    style={{ width: 150 }}
                    onChange={(e) => this.saveSelect(e, "tag_key")}
                    value={this.props.projParam.tag_key}
                  >
                    {tagList1}
                  </Select>
                </Col>
              </Row>
            </div>
            <div style={{ textAlign: "right" }}>
              <Button type="primary" onClick={() => this.queryProject("query")}>
                查询
              </Button>
              &nbsp;&nbsp;
              <Button type="primary" onClick={() => this.queryProject("clear")}>
                清空
              </Button>
            </div>
            <div style={{ marginTop: 4 }}>
              <Table
                columns={this.columns}
                dataSource={projList}
                pagination={false}
                bordered={true}
                defaultExpandAllRows={false}
                expandedRowRender={expandedRowRender}
                className={styles.tableStyle}
              ></Table>
              <Modal
                visible={this.props.startDingDingModal}
                onCancel={() => this.cancelSendDingDing("0")}
                onOk={() => this.confirmSendDingDing("0")}
              >
                <SendDingDingComp
                  ref={"SendDingDing"}
                  key={moment()}
                  next_date={this.state.next_date}
                />
              </Modal>
              <Modal
                visible={this.props.endDingDingModal}
                onCancel={() => this.cancelSendDingDing("1")}
                onOk={() => this.confirmSendDingDing("1")}
              >
                <EndDingDingComp
                  ref={"EndDingDing"}
                  key={moment()}
                  next_date={this.state.next_date}
                />
              </Modal>
              <Modal
                visible={this.props.allEndModal}
                onCancel={() => this.cancelSendDingDing("2")}
                onOk={() => this.confirmSendDingDing("2")}
              >
                <AllEndComp
                  ref={"AllEnd"}
                  key={moment()}
                  next_date={this.state.next_date}
                />
              </Modal>
            </div>
            <div className={styles.page}>
              <Pagination
                current={this.props.projParam.arg_page_current}
                pageSize={10}
                total={Number(this.props.projParam.rowCount)}
                onChange={this.handlePageChange}
              />
            </div>
          </div>
        ) : (
          ""
        )}
        {this.props.contentIndex === "details" ? (
          <div style={{ padding: "13px 15px 16px 15px", background: "white" }}>
            <p
              style={{
                textAlign: "center",
                fontSize: "20px",
                marginBottom: "10px",
              }}
            >
              {this.props.detailRecord.proj_name +
                "(" +
                this.props.detailRecord.proj_code +
                ")"}
            </p>
            <div style={{ textAlign: "right", marginBottom: "10px" }}>
              <Button
                type="primary"
                onClick={() => {
                  this.goBack("mainPage");
                }}
              >
                {"返回"}
              </Button>
            </div>
            <Table
              columns={this.detailsColumns}
              dataSource={this.props.detailsList}
              className={styles.tableStyle}
              bordered={true}
              pagination={false}
            ></Table>
            <div className={styles.page}>
              <Pagination
                current={this.props.pmsParam.arg_page_current}
                pageSize={10}
                total={Number(this.props.pmsParam.rowCount)}
                onChange={this.handlePmsPageChange}
              />
            </div>
          </div>
        ) : (
          ""
        )}
      </span>
    );
  }
}
function mapStateToProps(state) {
  return {
    loading: state.loading.models.projPmsCapital,
    ...state.projPmsCaptial,
  };
}
export default connect(mapStateToProps)(ProjPmsCapital);
//是否发送钉钉消息弹框
class SendDingDing extends React.PureComponent {
  render() {
    const { getFieldDecorator } = this.props.form;
    const FormItem = Form.Item;
    return (
      <div>
        <Form>
          <div style={{ marginLeft: "15px", frontSize: "25px" }}>
            {"资本化开始生效日期:" + this.props.next_date}
          </div>
          <FormItem
            label="是否发送钉钉通知"
            style={{ marginLeft: "15px", frontSize: "25px" }}
          >
            {getFieldDecorator("arg_is_send_dingding", {
              initialValue: "",
            })(
              <Switch
                checkedChildren="是"
                unCheckedChildren="否"
                defaultChecked={false}
              />
            )}
          </FormItem>
        </Form>
      </div>
    );
  }
}
const SendDingDingComp = Form.create()(SendDingDing);
//结束发送钉钉消息
class EndDingDing extends React.PureComponent {
  render() {
    const { getFieldDecorator } = this.props.form;
    const FormItem = Form.Item;
    return (
      <div>
        <Form>
          <div style={{ marginLeft: "15px", frontSize: "25px" }}>
            {"资本化结束生效日期:" + this.props.next_date}
          </div>
          <FormItem
            label="是否发送钉钉通知"
            style={{ marginLeft: "15px", frontSize: "25px" }}
          >
            {getFieldDecorator("arg_is_send_dingding")(
              <Switch
                checkedChildren="是"
                unCheckedChildren="否"
                defaultChecked={false}
              ></Switch>
            )}
          </FormItem>
        </Form>
      </div>
    );
  }
}
const EndDingDingComp = Form.create()(EndDingDing);
//结束发送钉钉消息
class AllEnd extends React.PureComponent {
  render() {
    const { getFieldDecorator } = this.props.form;
    const FormItem = Form.Item;
    return (
      <div>
        <Form>
          <div style={{ marginLeft: "15px", frontSize: "25px" }}>
            {"资本化结束生效日期:" + this.props.next_date}
          </div>
          <FormItem
            label="是否发送钉钉通知"
            style={{ marginLeft: "15px", frontSize: "25px" }}
          >
            {getFieldDecorator("arg_is_send_dingding", {
              initialValue: "",
            })(
              <Switch
                checkedChildren="是"
                unCheckedChildren="否"
                defaultChecked={false}
              />
            )}
          </FormItem>
        </Form>
      </div>
    );
  }
}
const AllEndComp = Form.create()(AllEnd);
