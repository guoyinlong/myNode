/**
 * 作者：靳沛鑫
 * 日期：2019-06-19
 * 邮箱：1677401802@qq.com
 * 文件说明：责任承诺书
 */
import React from "react";
import { connect } from "dva/index";
import { Link, routerRedux } from "dva/router";
import {
  Table,
  Tabs,
  Select,
  Icon,
  Upload,
  Button,
  Pagination,
  Row,
  Col,
  DatePicker,
  message,
  Input,
  Modal,
  Popconfirm,
} from "antd";
import styles from "../corePosts.less";
import Cookie from "js-cookie";
//import moment from 'moment';

//const Search = Input.Search;
const { TabPane } = Tabs;
const Option = Select.Option;

class Query extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: false,
      corepositionId: "",
    };
  }
  /**
   * 作者：靳沛鑫
   * 日期：2019-06-9
   * 邮箱：1677401802@qq.com
   * 文件说明：上传
   */
  uploads = {
    name: "file",
    showUploadList: false,
    action: "/filemanage/fileupload",
    data: {
      argappname: "responsFileUpdate",
      argtenantid: "10010",
      arguserid: Cookie.get("userid"),
      argyear: new Date().getFullYear(),
      argmonth: new Date().getMonth() + 1,
      argday: new Date().getDate(),
    },
  };
  /**
   * 作者：靳沛鑫
   * 日期：2019-06-19
   * 邮箱：1677401802@qq.com
   * 文件说明：竞聘信息
   */
  columns = [
    {
      title: "序号",
      width: 50,
      dataIndex: "num",
      fixed: document.body.clientWidth > 1566 ? "null" : "left",
    },
    {
      title: "生产业务部门",
      dataIndex: "departmentName",
      width: 150,
      fixed: document.body.clientWidth > 1566 ? "null" : "left",
    },
    {
      title: "项目/小组名称",
      dataIndex: "projectName",
      width: 150,
      fixed: document.body.clientWidth > 1566 ? "null" : "left",
    },
    {
      title: "团队系数",
      dataIndex: "teamCoefficient",
      width: 75,
    },
    {
      title: "核心岗位",
      dataIndex: "name",
      width: 80,
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
      title: "目标绩效职级",
      dataIndex: "targetPerformanceRank",
      width: 120,
    },
    {
      title: "聘任方式",
      dataIndex: "appointWay",
      width: 75,
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
      title: "申请状态",
      dataIndex: "status",
      width: 100,
      fixed: document.body.clientWidth > 1566 ? "null" : "right",
      render: (text) => {
        return (
          <p>{text == "0" ? "未提交" : text > 1 ? "审核通过" : "审核中"}</p>
        );
      },
    },
    {
      title: "文件",
      dataIndex: "fileName",
      fixed: document.body.clientWidth > 1566 ? "null" : "right",
      width: 100,
    },
    {
      title: "操作",
      //dataIndex:'fileUrl',
      width: 200,
      fixed: document.body.clientWidth > 1566 ? "null" : "right",
      render: (record) => {
        return (
          <div style={{ textAlign: "center" }}>
            <Upload
              {...this.uploads}
              onChange={(info) => this.upDataResUrl(info, record)}
            >
              <Button
                type="primary"
                disabled={record.status != "0"}
                style={{ marginLeft: 0 }}
              >
                {"上传"}
              </Button>
            </Upload>
            <Popconfirm
              title={"请问您确认提交么？"}
              okText="是"
              cancelText="否"
              onConfirm={() => this.upDataResInfo(record)}
            >
              <Button
                type="primary"
                disabled={
                  !(record.status == "0" && typeof record.fileId == "string")
                }
                style={{ marginLeft: 20 }}
              >
                {"提交"}
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  /**
   * 作者：靳沛鑫
   * 日期：2019-06-20
   * 邮箱：1677401802@qq.com
   * 文件说明：清空
   */
  resetCond = () => {
    const { dispatch } = this.props;
    dispatch({ type: "resPostsQuery/resetCond" });
  };
  /**
   * 作者：靳沛鑫
   * 日期：2019-06-20
   * 邮箱：1677401802@qq.com
   * 文件说明：提交
   */
  upDataResInfo = (record) => {
    const { dispatch } = this.props;
    dispatch({ type: "resPostsQuery/upDataResInfo", record });
  };
  /**
   * 作者：靳沛鑫
   * 日期：2019-06-19
   * 邮箱：1677401802@qq.com
   * 文件说明：提交上传信息
   */
  upDataResUrl = (info, record) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} 上传成功`);
      const { dispatch } = this.props;
      dispatch({
        type: "resPostsQuery/upDataResUrl",
        id: record.id,
        name: info.file.name,
        url: info.file.response.file.RelativePath,
      });
    } else if (info.fileList[info.fileList.length - 1].status === "error") {
      message.error(`${info.file.name} 上传失败！.`);
    }
  };
  /**
   * 作者：靳沛鑫
   * 日期：2019-06-12
   * 邮箱：1677401802@qq.com
   * 文件说明：保存搜索内容
   */
  saveSelectInfo = (value, typeItem) => {
    const { dispatch } = this.props;
    dispatch({
      type: "resPostsQuery/saveSelectInfo",
      value: value,
      typeItem: typeItem,
    });
  };

  render() {
    const {
      params,
      yearList,
      resPostsList,
      departmentList,
      nameList,
    } = this.props;
    //年份默认当前年
    if (resPostsList.length) {
      resPostsList.map((i, index) => {
        i.num = index + 1;
      });
    }
    const year_list = yearList.map((item, index) => {
      let items = item.year.toString();
      return (
        <Option value={items} key={index} title={items}>
          {items}
        </Option>
      );
    });
    //生产业务部门
    const department_list = departmentList.map((item, index) => {
      return (
        <Option value={item.value} key={item.key} title={item.value}>
          {item.value}
        </Option>
      );
    });
    //核心岗位
    const name_list = nameList.map((item, index) => {
      return (
        <Option value={item.value} key={index + 1} title={item.value}>
          {item.value}
        </Option>
      );
    });

    return (
      <div className={styles.container}>
        <h2 style={{ textAlign: "center", fontWeight: "bolder" }}>
          责任承诺书
        </h2>
        <div style={{ textAlign: "center" }}>
          <Row gutter={10} style={{ margin: "25px 0 25px 10px" }}>
            <Col span={4}>
              <label>年份：</label>
              <Select
                showSearch={true}
                placeholder="2019"
                value={params.year}
                className={styles.selectWidth4Year}
                onChange={(value) => this.saveSelectInfo(value, "year")}
              >
                {year_list}
              </Select>
            </Col>
            <Col span={8}>
              <label>生产业务部门：</label>
              <Select
                showSearch={true}
                placeholder="全部"
                value={params.departmentName}
                className={styles.selectWidth4ProjSearch}
                onChange={(value) =>
                  this.saveSelectInfo(value, "departmentName")
                }
              >
                <Option value="" key="0" title="全部">
                  全部
                </Option>
                {department_list}
              </Select>
            </Col>
            <Col span={9}>
              <label>核心岗位：</label>
              <Select
                showSearch={true}
                dropdownMatchSelectWidth={false}
                placeholder="全部"
                value={params.positionName}
                className={styles.selectWidth4Year}
                onChange={(value) => this.saveSelectInfo(value, "positionName")}
              >
                <Option value="" key="0" title="全部">
                  全部
                </Option>
                {name_list}
              </Select>
            </Col>
            <Col span={1} style={{ textAlign: "right" }}>
              <Button
                type="primary"
                style={{ marginLeft: 45 }}
                onClick={this.resetCond}
              >
                清空
              </Button>
            </Col>
          </Row>
        </div>
        <Table
          columns={this.columns}
          dataSource={resPostsList}
          scroll={{ x: 1250 }}
          pagination={false}
          className={styles.table}
          rowKey={(record) => record.id}
          bordered={true}
        ></Table>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.resPostsQuery,
    ...state.resPostsQuery,
  };
}

export default connect(mapStateToProps)(Query);
