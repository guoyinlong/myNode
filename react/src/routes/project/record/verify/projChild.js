import React from "react";
import {
  Button,
  Row,
  Col,
  Input,
  Table,
  Pagination,
  Spin,
  Select,
  Form,
} from "antd";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import styles from "./projStartUp.less";

const FormItem = Form.Item;

const formItem = {
  labelCol: { span: 9 },
  wrapperCol: { span: 15 },
  style: { marginBottom: 5 },
};

const Option = Select.Option;
class projChild extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.details = this.details.bind(this);
    this.setSelect = this.setSelect.bind(this);
  }

  /**
   * 作者：张建鹏
   * 日期：2020-4-17
   * 说明：输入框
   **/
  setInputShow(e, objParam) {
    this.props.dispatch({
      type: "projChild/setInputShow",
      value: e.target.value,
      objParam: objParam,
    });
  }

  /**
   * 作者：张建鹏
   * 日期：2020-4-17
   * 说明：下拉列表状态
   **/
  setSelect(e, objParam) {
    this.props.dispatch({
      type: "projChild/setSelect",
      value: e,
      objParam: objParam,
    });
  }

  details(query) {
    this.props.dispatch(
      routerRedux.push({
        pathname: "/projectApp/projRecord/projChild/projDetail",
        query,
      })
    );
  }

  // onChange = (page) => {
  //   // this.props.dispatch({

  //   // })
  // }

  /**
   * 作者：张建鹏
   * 日期：2020-4-17
   * 查询
   **/
  inquire(typeItem) {
    this.props.dispatch({
      type: "projChild/inquire",
      typeItem: typeItem,
    });
  }

  columns = [
    {
      title: "序号",
      dataIndex: "i",
    },
    {
      title: "项目名称",
      dataIndex: "proj_name",
    },
    {
      title: "项目编号",
      dataIndex: "proj_code",
    },
    {
      title: "主建单位",
      dataIndex: "ou",
    },
    {
      title: "主建部门",
      dataIndex: "dept_name",
    },
    {
      title: "项目经理",
      dataIndex: "mgr_name",
    },
    {
      title: "推送状态",
      dataIndex: "tag_show",
    },
    {
      title: "操作",
      dataIndex: "vivew",
      render: (text, record) => {
        return (
          <div style={{ textAlign: "center" }}>
            <Button type="primary" onClick={() => this.details(record)}>
              {"查看"}
            </Button>
          </div>
        );
      },
    },
  ];



  render() {
    const { loading, projParam, dataSource } = this.props;
    const list = projParam.record_state;
    let arr = list.map((item, index) => {
      return <Option key={index}>{item}</Option>;
    });
    return (
      // <Spin tip={config.IS_LOADING} spinning={this.props.loading}>
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
              RD推送
            </p>
          </div>
          {/*第一行*/}
          <div style={{ textAlign: "right" ,marginBottom:'10'}}>
            <Button onClick={() => this.inquire("query")} type="primary">
              查询
            </Button>
            <Button
              style={{ marginLeft: 10 }}
              onClick={() => this.inquire("clear")}
              type="primary"
            >
              重置
            </Button>
          </div>
          <Row gutter={16}>
            {/* <Col className="gutter-box" span={6}>
              <Col span={8}>推送状态：</Col>
              <Col span={12}>
                <Select
                  value={projParam.tag_key}
                  key={this.state.key10}
                  style={{ width: 100 }}
                  onChange={(e) => this.setSelect(e, "tag_key")}
                >
                  {arr}
                </Select>
              </Col>
            </Col> */}
            <Form>
              <Row gutter={16}>
                <Col span={6}>
                  <FormItem label="项目名称：" {...formItem}>
                    <Input
                      value={projParam.proj_name}
                      onChange={(e) => this.setInputShow(e, "proj_name")}
                    ></Input>
                  </FormItem>
                </Col>

                <Col span={6}>
                  <FormItem label="项目编号：" {...formItem}>
                    <Input
                      value={projParam.proj_code}
                      onChange={(e) => this.setInputShow(e, "proj_code")}
                    ></Input>
                  </FormItem>
                </Col>

                <Col span={6}>
                  <FormItem label="项目经理：" {...formItem}>
                    <Input
                      value={projParam.mgr_name}
                      onChange={(e) => this.setInputShow(e, "mgr_name")}
                    ></Input>
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem label="推送状态：" {...formItem}>
                    <Select dropdownMatchSelectWidth={false} style={{width:'60%'}}
                      value={projParam.tag_key}
                      key={this.state.key}
                      onChange={(e) => this.setSelect(e, "tag_key")}
                    >
                      {arr}
                    </Select>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Row>
          <div>
            <Table
              columns={this.columns}
              bordered={true}
              dataSource={dataSource}
              pagination={true} //分页器，配置项参考 pagination，设为 false 时不展示和进行分页
              defaultExpandAllRows={true}
              rowClassName={(record, index) =>
                record.is_primary == "0" ? "primary" : "child"
              }
              className={styles.orderTable}
              // onRowClick={this.details}
              style={{ marginTop: "10px" }}
            />
            {/* 
            {this.props.loading !== true ? (
              <div className={styles.page}>
                <Pagination
                  current={this.props.page}
                  total={Number(this.props.rowCount)}
                  pageSize={10}
                />
              </div>
            ) : null} */}
          </div>
        </div>
      </div>
    );
  }
}

//数据映射
const mapStateToProps = (state) => {
  return {
    loading: state.projChild.dataSource,
    ...state.projChild,
  };
};

export default connect(mapStateToProps)(projChild);
