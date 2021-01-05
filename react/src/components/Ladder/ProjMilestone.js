/**
 * 作者：张建鹏
 * 日期：2020-11-27
 * 邮箱：zhangjp@itnova.com.cn
 * 文件说明：里程碑管理
 */
import React from "react";
import { connect } from "dva";
import Cookies from "js-cookie";
import {
  Table,
  Button,
  Modal,
  Input,
  DatePicker,
  Select,
  message,
  Form,
  Row,
  Col,
  Popconfirm,
} from "antd";
import styles from "./projStartUp.less";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");

const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;

//编辑按钮所在表格的行数
var tableRow = "";
//二级添加按钮所在行
var zhuKey = null;
var zhuKey1 = null;
//日期选择传递参数
var transferStart = "";
var transferEnd = "";

let editdata = {}
let zhudata = {}

//二级里程碑编辑日期选择
function onChangeStart2(date, dateString) {
  transferStart = dateString;
}
function onChangeEnd2(date, dateString) {
  transferEnd = dateString;
}

class ProMilestone extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    visible: false,
    status: "",
    fileStatus: "",
    value: "",
    startValue: null,
    endValue: null,
    endOpen: false,
    names:'',
    modalkey:0
  };
  //二级里程碑添加日期选择
  onChangeStart1 = (date, dateString) => {
    transferStart = dateString;
  };
  onChangeEnd1 = (date, dateString) => {
    transferEnd = dateString;
  };
  //日期范围设置
  disabledStartDate = (current, value) => {
    if (value === "first") {
      let Startingtime = this.props.dataFirst[zhuKey].planBeginTime;
      let start = Date.parse(Startingtime.replace(/-/g, " "));
      return current && current.valueOf() < start;
    } else {
      let Startingtime = this.props.data2Rows[tableRow].expectStartTime;
      let start = Date.parse(Startingtime.replace(/-/g, " "));
      // console.log(start);
      return current && current.valueOf() < start;
    }
  };

  disabledEndDate = (current, value) => {
    if (value == "first") {
      let Startingtime = this.props.dataFirst[zhuKey].planEndTime;
      let start = Date.parse(Startingtime.replace(/-/g, " "));
      return current && current.valueOf() > start;
    } else {
      let Startingtime = this.props.data2Rows[tableRow].expectEndTime;
      let start = Date.parse(Startingtime.replace(/-/g, " "));
      // console.log(start);
      return current && current.valueOf() > start;
    }
  };

  // 二级里程碑添加
  showModal = (text, record) => {
    zhudata = record
    // console.log(record,"******************************");
    this.setState({
      modalkey: this.state.modalkey + 1
    })
    // console.log("二级程碑");
    zhuKey = record.key;
    this.setState({
      visible: true,
      status: "showModal",
      startValue: null,
      endValue: null,
      endOpen: false,
    });
  };

  //编辑
  edit = (text, record) => {
    editdata = record
    console.log(record,"999999999999999999999999999999999999999")
    tableRow = record.key;
    this.setState({
      visible: true,
      status: "edit",
    });
  };

  //天梯工程select
  setSelect = (e) => {
    this.setState({
      name: this.props.tianti[e].pmName,
    });
    this.props.dispatch({
      type: "linkedStartEdit/setSelect",
      e,
      name,
    });
  };

  //二级里程碑添加 保存
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      transferStart == ""
        ? (moment(values.planBeginTime))
        : transferStart;
      transferEnd == "" ? (moment(values.planEndTime)) : transferEnd;
      if (
        transferStart == moment(values.planBeginTime) ||
        transferEnd == moment(values.planEndTime)
      ) {
        message.error("预计开始、结束时间均不能与一级里程碑相同");
        return "";
      }
      const { proj_id, key } = this.props.query;
      this.props.dispatch({
        type: "linkedStartEdit/savedataFirst",
        e: e.target.value,
        values: values,
        transferStart,
        transferEnd,
        zhuKey,
        proj_id,
        key,
      });
      if (!err) {
        // console.log("成功！", values);
        this.setState({
          visible: false,
          status: "showModal",
        });
      }
    });
  };

  //二级里程碑 编辑 取消按钮
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  // 编辑保存
  handleModifySubmit = (e) => {
    console.log("编辑保存");
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      // transferStart == ""
      //   ? (transferStart = moment(values.expectStartTime))
      //   : transferStart;
      // transferEnd == "" ? (transferEnd = moment(values.expectEndTime)) : transferEnd;
      const { proj_id, key } = this.props.query;
      this.props.dispatch({
        type: "linkedStartEdit/editSave",
        values: values,
        transferStart,
        transferEnd,
        tableRow,
        proj_id,
        key,
        milestoneId:editdata.milestoneId
      });
      // if (!err) {
      //   // console.log(values);
      //   this.setState({
      //     visible: false,
      //     status: "showModal",
      //   });
      // }
      this.setState({
        visible: false,
        status: "showModal",
      });
    });
  };

  //二级里程碑删除功能;
  confirm = (text, record) => {
    // event.currentTarget.getAttribute
    const { proj_id, key } = this.props.query;
    // console.log(text,record,"11111111111")
    this.props.dispatch({
      type: "linkedStartEdit/proMilestoneDelete",
      record,
      proj_id,
      key,
      zhuKey1
    });
   };

  cancel = (e) => {
    // // console.log(e);
    // message.error("删除失败！");
  };

  //权重之和验证
  weightsCheck = (rule, value, callback) => {
    const { data2Rows } = this.props;
    let weights = 0;
    data2Rows.map((item, index) => {
      weights += item.weightAllocation;
    });
    // console.log(Number(weights + value));
    if (weights + Number(value) > 100) {
      callback("二级里程碑之和不能超过100");
    }
    callback();
  };

  onExpand = (expanded, record) => {
    const { dispatch } = this.props;
    if (expanded) {
      zhuKey1 = record.key
    }
    dispatch({
      type: "linkedStartEdit/data2list",
      tableRow: record.key
    });
    this.expandedRowRender(record)
  };

  //工作量input限制
  handleNumChange = (e) => {
    //先将非数去掉
    let value = e.target.value.replace(/[^\d.]/g, '');
    //如果以小数点开头，去掉
    if (value === '.') {
        value = '';
    }
    //如果连续输入两个小数，去掉一个
    if (value.includes('..')) {
        value = value.replace('..', '.');
    }
    //如果有小数点
    if (value.indexOf('.') >= 1 && value.indexOf('.') !== value.length - 1) {
        //截取小数点后一位
        let cutNumber = Number(value.substring(0, value.indexOf('.') + 2));
        //设置工作量的state,方便计算剩余工作量
        // this.setState({planWorkload: cutNumber});
        e.target.value = cutNumber;
    } else {
        // this.setState({planWorkload: Number(value)});
        e.target.value = value;
    }
};

  expandedRowRender = (i) => {
    const columns = [
      {
        title: "序号",
        dataIndex: "i",
        align: "center",
      },
      {
        title: "里程碑名称",
        dataIndex: "milestoneName",
        align: "center",
      },
      {
        title: "天梯工程",
        dataIndex: "ladderName",
        align: "center",
      },
      {
        title: "预计开始时间",
        dataIndex: "expectStartTime",
        align: "center",
      },
      {
        title: "预计结束时间",
        dataIndex: "expectEndTime",
        align: "center",
      },
      {
        title: "权重分配",
        dataIndex: "weightAllocation",
        align: "center",
      },
      {
        title: "计划工作量",
        dataIndex: "planWorkload",
        align: "center",
      },
      {
        title: "负责人",
        dataIndex: "responsibleName",
        align: "center",
      },
      {
        title: "操作",
        dataIndex: "cluster_port7",
        align: "center",
        render: (text, record) => (
          <div style={{ textAlign: "center" }}>
            <Button type="primary" onClick={() => this.edit(text, record)}>
              编辑
            </Button>
            {/* 实际工时与内容则删除功能置灰 */}
            <Popconfirm
              title="确认删除此二级里程碑吗?"
              onConfirm={() => this.confirm(text, record)}
              onCancel={this.cancel}
              okText="是"
              cancelText="否"
            >
              <Button style={{ marginLeft: "5px" }} type="primary">
                删除
              </Button>
            </Popconfirm>
          </div>
        ),
      },
    ];
    // console.log(i.key)
    let we = this.props.dataFirst
    // console.log(we,"+++++++++++")
    const data = we[i.key].children1;
    // console.log(data,"二级的数据源")
    return <Table columns={columns} dataSource={data} pagination={false} ref="mintable" />;
  };
  render() {
    // console.log(this.props.dataFirst,"data++++++++++++++++++++")
    const { getFieldDecorator } = this.props.form;
    const { dataFirst, data2Rows, tianti, dataAll } = this.props;
    var workload = 0;
    dataFirst &&
      dataFirst.map((item, index) => {
        workload += item.planWorkload;
      });
    let list =
      tianti &&
      tianti.map((item, index) => {
        return <Option key={index}>{item.ladderProjectName}</Option>;
      });

    const columns = [
      {
        key: 'id',
        title: "序号",
        dataIndex: "i",
        align: "center",
      },
      {
        title: "里程碑名称",
        dataIndex: "milestName",
        width: "40%",
        // align: "center",
      },
      {
        title: "预计开始时间",
        dataIndex: "planBeginTime",
        align: "center",
      },
      {
        title: "预计结束时间",
        dataIndex: "planEndTime",
        align: "center",
      },
      {
        title: "权重分配",
        dataIndex: "weightAllocation",
        align: "center",
      },
      {
        title: "计划工作量",
        dataIndex: "planWorkload",
        align: "center",
      },
      {
        title: "操作",
        align: "center",
        render: (text, record) => (
          <div style={{ textAlign: "center" }}>
            <Button
              style={{ width: "130px" }}
              type="primary"
              onClick={() => this.showModal(text, record)}
            >
              二级里程碑添加
            </Button>
          </div>
        ),
      },
    ];

    const data = dataFirst;

    return (
      <div>
        {/* 二级里程碑添加 */}
        {this.state.status == "showModal" ? (
          <Modal
            title="二级里程碑添加"
            visible={this.state.visible}
            onOk={this.handleSubmit}
            onCancel={this.handleCancel}
            width="660px"
            key= "modalkey"
          >
            <Form layout="inline" className="login-form">
              <Row>
                <Col>
                  <FormItem label="名称">
                    {getFieldDecorator("milestName", {
                      initialValue:"",
                      rules: [
                        {
                          required: true,
                          message: "名称是必填项",
                        },
                      ],
                    })(<TextArea rows={1} style={{ width: "530px" }} />)}
                  </FormItem>
                </Col>
              </Row>
              <br />
              <Row>
                <Col span={12}>
                  <FormItem label="预计开始时间">
                    {getFieldDecorator("planBeginTime", {
                      initialValue: moment(
                        zhudata.planBeginTime,
                        "YYYY-MM-DD"
                      ),
                      rules: [
                        {
                          required: true,
                          message: "预计开始时间是必选项",
                        },
                      ],
                    })(
                      <DatePicker
                        // placeholder={
                        //   zhudata.planBeginTime
                        // }
                        // placeholder="请选择日期"
                        disabledDate={(current, value) =>
                          this.disabledStartDate(current, "first")
                        }
                        format="YYYY-MM-DD"
                        onChange={this.onChangeStart1}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="预计结束时间">
                    {getFieldDecorator("planEndTime", {
                      initialValue: moment(
                        zhudata.planEndTime,
                        "YYYY-MM-DD"
                      ),
                      rules: [
                        {
                          required: true,
                          message: "预计结束时间是必选项",
                        },
                      ],
                    })(
                      <DatePicker
                        // placeholder={
                        //  zhudata.planEndTime
                        // }
                        // placeholder="请选择日期"
                        disabledDate={(current, value) =>
                          this.disabledEndDate(current, "first")
                        }
                        format="YYYY-MM-DD"
                        onChange={this.onChangeEnd1}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <br />
              <Row>
                <Col span={12}>
                  <FormItem label="计划工作量">
                    {getFieldDecorator("planWorkload", {
                      initialValue:"",
                      rules: [
                        {
                          required: true,
                          message: "计划工作量必填项",
                        },
                      ],
                    })(<Input onChange={this.handleNumChange} type="number" style={{ width: "190px" }} />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="权重分配">
                    {getFieldDecorator("weightAllocation", {
                      rules: [
                        {
                          required: true,
                          message: "权重分配必填项",
                        },
                        {
                          validator: this.weightsCheck,
                        },
                      ],
                    })(<Input onChange={this.handleNumChange} type="number" style={{ width: "190px" }} />)}
                  </FormItem>
                </Col>
              </Row>
              <br />
              <Row>
                <Col span={12}>
                  <FormItem label="天梯工程">
                    {getFieldDecorator("ladderName", {
                      initialValue: "",
                      rules: [
                        {
                          required: true,
                          message: "天梯工程必选项",
                        },
                      ],
                    })(
                      <Select
                        key={list.index}
                        placeholder="请选择天梯工程"
                        style={{ width: "160px" }}
                        onChange={(e) => {
                          this.setSelect(e);
                        }}
                      >
                        {list}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="负责人">
                    <span>{this.state.name}</span>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Modal>
        ) : (
          ""
        )}
        {/* 编辑 */}
        {this.state.status == "edit" ? (
          <Modal
            title="编辑"
            visible={this.state.visible}
            onOk={this.handleModifySubmit}
            onCancel={this.handleCancel}
            width="660px"
            key="huhansan1"
          >
            <Form layout="inline" className="login-form">
              <Row>
                <Col>
                  <FormItem label="名称">
                    {getFieldDecorator("milestoneName", {
                      // initialValue: tableRow === "" ? "":data2Rows[tableRow].milestoneName,
                      initialValue: editdata.milestoneName,
                      rules: [
                        {
                          required: true,
                          message: "名称是必填项",
                        },
                      ],
                    })(<TextArea rows={1} style={{ width: "530px" }} />)}
                  </FormItem>
                </Col>
              </Row>
              <br />
              <Row>
                <Col span={12}>
                  <FormItem label="预计开始时间">
                    {getFieldDecorator("expectStartTime", {
                      // initialValue: moment(
                      //   data2Rows[tableRow].expectStartTime,
                      //   "YYYY-MM-DD"
                      // ),
                      initialValue: moment(
                        editdata.expectStartTime,
                        "YYYY-MM-DD"
                      ),
                      rules: [
                        {
                          required: true,
                          message: "预计开始时间是必选项",
                        },
                      ],
                    })(
                      <DatePicker
                        // placeholder={data2Rows[tableRow].expectStartTime}
                        onChange={onChangeStart2}
                        // disabledDate={(current, value) =>
                        //   this.disabledStartDate(current, "level2")
                        // }
                        format="YYYY-MM-DD"
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="预计结束时间">
                    {getFieldDecorator("expectEndTime", {
                      // initialValue: moment(
                      //   data2Rows[tableRow].expectEndTime,
                      //   "YYYY-MM-DD"
                      // ),
                      initialValue: moment(
                        editdata.expectEndTime,
                        "YYYY-MM-DD"
                      ),
                      rules: [
                        {
                          required: true,
                          message: "预计结束时间是必选项",
                        },
                      ],
                    })(
                      <DatePicker
                        // placeholder={data2Rows[tableRow].expectEndTime}
                        onChange={onChangeEnd2}
                        // disabledDate={(current, value) =>
                        //   this.disabledEndDate(current, "level2")
                        // }
                        format="YYYY-MM-DD"
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <br />
              <Row>
                <Col span={12}>
                  <FormItem label="计划工作量">
                    {getFieldDecorator("planWorkload", {
                      // initialValue: data2Rows[tableRow].planWorkload,
                      initialValue: editdata.planWorkload,
                      rules: [
                        {
                          required: true,
                          message: "计划工作量必填项",
                        },
                      ],
                    })(<Input onChange={this.handleNumChange} type="number" style={{ width: "190px" }} />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="权重分配">
                    {getFieldDecorator("weightAllocation", {
                      // initialValue: data2Rows[tableRow].weightAllocation,
                      initialValue: editdata.weightAllocation,
                      rules: [
                        {
                          required: true,
                          message: "权重分配必填项",
                        },
                      ],
                    })(<Input onChange={this.handleNumChange} type="number" style={{ width: "190px" }} />)}
                  </FormItem>
                </Col>
              </Row>
              <br />
              <Row>
                <Col span={12}>
                  <FormItem label="天梯工程">
                    {getFieldDecorator("ladderName1", {
                      // initialValue: data2Rows[tableRow].ladderName,
                      // initialValue: editdata.ladderName,
                      rules: [
                        {
                          required: true,
                          message: "天梯工程必选项",
                        },
                      ],
                    })(
                      <Select
                        key={list.index + 1}
                        placeholder="请选择天梯工程"
                        style={{ width: "160px" }}
                        onChange={(e) => {
                          this.setSelect(e);
                        }}
                      >
                        {list}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="负责人">
                    <span>
                      {this.state.name == ""
                        ? data2Rows[tableRow].responsibleName
                        : this.state.name}
                    </span>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Modal>
        ) : (
          ""
        )}
        <div>
          <div
            style={{
              fontSize: "18px",
              height: "30px",
              lineHeight: "30px",
            }}
          >
            <p style={{ float: "left" }}>项目预计工作量：{workload}人月</p>
          </div>
          <Table
            className={styles.orderTable}
            // defaultCurrent={2}    //当前页码
            // total={this.props.dataFirst}           //页条数
            tableLayout="fixed"
            bordered
            columns={columns}
            expandedRowRender={this.expandedRowRender}
            dataSource={data}
            onExpand={this.onExpand}
            onRowMouseEnter = {this.onRowMouseEnter}
          />
        </div>
      </div>
    );
  }
}
// function mapStateToProps(state) {
//   return {
//     ...state.ProMilestone,
//     loading: state.loading.models.ProMilestone,
//   };
// }

ProMilestone = Form.create()(ProMilestone);
// export default connect(mapStateToProps)(ProMilestone);
export default ProMilestone;
