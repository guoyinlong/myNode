/**
 * 作者：薛刚
 * 创建日期：2018-03-06
 * 邮件：xueg@chinaunicom.cn
 * 文件说明：合作伙伴信息查询
 */
import React from "react";
import { connect } from "dva";
import {
  Button,
  Select,
  Table,
  Pagination,
  Popconfirm,
  Tooltip,
  message,
} from "antd";
import PreviewTable from "./previewTable.js";
import styles from "./partner.less";
import  exportExcelPartner  from "./exportExlSearch.js";
// import  exportExl  from "../../../components/commonApp/exportExl";

const Option = Select.Option;

class query2 extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  columns = [
    {
      title: "年月",
      dataIndex: "total",
      width: "6%",
      align: "center",
      render: (text, record, index) => {
        return <p>{text}</p>;
      },
    },
    {
      title: "项目名称",
      dataIndex: "proj_name",
      width: "15%",
      align: "center",
      render: (text, record, index) => {
        return <p>{text}</p>;
      },
    },
    {
      title: "项目编号",
      dataIndex: "proj_code",
      width: "8%",
      align: "center",
      render: (text, record, index) => {
        return <p>{text}</p>;
      },
    },
    {
      title: "项目经理",
      dataIndex: "mgr_name",
      width: "8%",
      align: "center",
      render: (text, record, index) => {
        return <p>{text}</p>;
      },
    },
    {
      title: "合作伙伴",
      dataIndex: "partner_name",
      width: "8%",
      align: "center",
      render: (text, record, index) => {
        return <p>{text}</p>;
      },
    },
    {
      title: "主键部门",
      dataIndex: "dept_name",
      width: "8%",
      align: "center",
      render: (text, record, index) => {
        return <p>{text}</p>;
      },
    },
    {
      title: "归属部门",
      dataIndex: "pu_dept_name",
      width: "8%",
      align: "center",
      render: (text, record, index) => {
        return <p>{text}</p>;
      },
    },
    {
      title: "填报状态",
      dataIndex: "arg_state",
      width: "8%",
      align: "center",
      render: (text, record, index) => {
        return <p>{text}</p>;
      },
    },
  ];

  /**
   * 作者：薛刚
   * 日期：2019-03-07
   * 邮箱：xueg@chinaunicom.cn
   * 说明：保存查询数据
   **/
  saveSelectInfo = (value, typeItem) => {
    const { dispatch } = this.props;
    const status = value[0];
    dispatch({
      type: "partnerInfoQuery2/saveSelectInfo",
      value: value,
      typeItem: typeItem,
      status,
    });
  };

  /**
   * 作者：薛刚
   * 日期：2019-03-18
   * 邮箱：xueg@chinaunicom.cn
   * 说明：保存项目列表数据
   **/
  getProjectList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "partnerInfoQuery2/queryProjectList",
    });
  };

  /**
   * 作者：薛刚
   * 创建日期：2019-3-10
   * 功能：动态页码查询功能
   * @param page 页码
   */
  handlePageChange = (page) => {
    const { dispatch } = this.props;
    dispatch({
      type: "partnerInfoQuery2/handlePageChange",
      page: page,
    });
  };

  /**
   * 作者：薛刚
   * 创建日期：2013-3-10
   * 功能：导出查询外包工作量
   */
  // exportExcel = () => {
  //   const list = this.props.workloadList;
  //   const user = this.props.user.key;
  //   const year = this.props.user.year;
  //   let header_level1 = [
  //   "年月",
  //   "项目名称",
  //   "项目编号",
  //   "项目经理",
  //   "主责部门",
  //   "归属部门",
  //   "填报状态",
  //   "合作方负责人签字",
  //   "团队负责人签字",
  //   ];

  //   //1~6  年月、项目名称、项目编号、项目经理、主责部门、归属部门、填报状态
  //   let headerKey1 = [
  //     "total",
  //     "proj_name",
  //     "proj_code",
  //     "mgr_name",
  //     "partner_name",
  //     "dept_name",
  //     "arg_state"
  //   ];
  //   if (list !== null && list.length !== 0 && user == "" ) {
  //     message.info("导出前请先选择日期，1~6与7~12月份的不能同时导出！");
  //     return ''
  //   }else if(list !== null && list.length !== 0 && year == '2019'){
  //       exportExcelPartner(
  //       list,
  //       "合作伙伴服务确认单",
  //       header_level1,
  //       headerKey1,
  //     );
  //   }
  //   if (list !== null && list.length !== 0) {
  //     if (user == "y" && year !== '2019') {
  //       exportExcelPartner(
  //         list,
  //         "合作伙伴服务确认单",
  //         header_level1,
  //         headerKey1,
  //       );
  //     }
  //   } else {
  //     message.info("查询结果为空");
  //   }
  // };
  exportTable = () => {
    const user = this.props.user
    // if (user.key == '') {
    //   message.info("导出前请先选择日期，1~6与7~12月份的不能同时导出！");
    //   return ''
    // }
    let table = document.querySelector("#gradeTableWrap table");
    exportExcelPartner()(table, '导出数据');
}

  render() {
    const {
      yearList,
      monthList,
      deptList,
      projList,
      partnerList,
      workloadList,
      workloadListAll,
      statusList,
    } = this.props;
    const year_list = yearList.map((item) => {
      return (
        <Option value={item} key={item}>
          {item}
        </Option>
      );
    });
    const month_list = monthList.map((item) => {
      return (
        <Option value={item.key} key={item.key}>
          {item.name}
        </Option>
      );
    });
    // 部门添加全部
    const dept_list = deptList.map((item) => {
      return (
        <Option value={item.pu_dept_id} key={item.pu_dept_id}>
          {item.pu_dept_name.split("-")[1]}
        </Option>
      );
    });

    // 项目添加全部
    const project_list = projList.map((item) => {
      return (
        <Option value={item.proj_code} key={item.proj_id}>
          {item.proj_name}
        </Option>
      );
    });

    // 合作伙伴添加全部
    const partner_list = partnerList.map((item) => {
      return (
        <Option value={item.partner_id} key={item.partner_id}>
          {item.partner_name}
        </Option>
      );
    });

    // 填报状态添加全部
    const report_status = statusList.map((item, index) => {
      return (
        <Option value={item.key} key={item.key}>
          {item.name}
        </Option>
      );
    });

    return (
      <div className={styles.container}>
        <section>
          <span className={styles.label}>年度：</span>
          <Select
            ref={"year"}
            value={this.props.params.arg_total_year}
            className={styles.selectWidth4Year}
            onChange={(value) => this.saveSelectInfo(value, "year")}
          >
            {year_list}
          </Select>
          <span className={styles.label}>月份：</span>
          <Select
            ref={"month"}
            className={styles.selectWidth4Month}
            placeholder="全部"
            mode="multiple"
            onChange={(value) => this.saveSelectInfo(value, "month")}
          >
            {month_list}
          </Select>
          <span className={styles.label}>部门名称：</span>
          <Select
            style={{ width: "150px" }}
            className={styles.selectWidth4Dept}
            placeholder="全部"
            mode="multiple"
            onChange={(value) => this.saveSelectInfo(value, "dept")}
          >
            {dept_list}
          </Select>
          <span className={styles.label}>项目名称：</span>
          <Select
            style={{ width: "150px" }}
            className={styles.selectWidth4ProjSearch}
            placeholder="全部"
            mode="multiple"
            onChange={(value) => this.saveSelectInfo(value, "project")}
            onFocus={(value) => this.getProjectList(value)}
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            dropdownMatchSelectWidth={false}
          >
            {project_list}
          </Select>
          <span className={styles.label}>合作伙伴：</span>
          <Select
            className={styles.selectWidth4Partner}
            placeholder="全部"
            mode="multiple"
            onChange={(value) => this.saveSelectInfo(value, "partner")}
          >
            {partner_list}
          </Select>

          <span className={styles.label}>填报状态：</span>
          <Select
            className={styles.selectWidth4Partner}
            mode="multiple"
            placeholder="全部"
            onChange={(value) => this.saveSelectInfo(value, "arg_state")}
          >
            {report_status}
          </Select>
        </section>
        <Table
          columns={this.columns}
          dataSource={workloadList}
          pagination={true}
          className={styles.table}
          bordered={true}
          pageSize={10}
        ></Table>
        
        <div style={{display:"none"}} id = "gradeTableWrap">
          <Table 
            columns={this.columns}
            dataSource={workloadListAll}
            bordered={true}
            pagination={false}
          ></Table>
        </div>
        {/* {this.props.loading !== true ? (
          <div className={styles.page}>
            <Pagination
              current={this.props.page}
              total={Number(this.props.rowCount)}
              pageSize={10}
              onChange={this.handlePageChange}
            />
          </div>
        ) : null} */}
        {workloadList.length != 0 ? (
          <div className={styles.btn}>
            <Button type="primary" onClick={this.exportTable}>
              导出
            </Button>
          </div>
        ) : null}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    loading: state.loading.models.partnerInfoQuery2,
    ...state.partnerInfoQuery2,
  };
}
export default connect(mapStateToProps)(query2);
