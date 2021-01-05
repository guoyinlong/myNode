/**
 * 作者：张建鹏
 * 日期：2020-11-27
 * 邮箱：zhangjp@itnova.com.cn
 * 文件说明：天梯团队信息
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

class Teaminformation extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    
  };

  render() {
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
      },
    ];


    const data = this.props.dataFirst;

    return (
      <div>
          <div
            style={{
              fontSize: "18px",
              height: "30px",
              lineHeight: "30px",
            }}
          >
          </div>
          <Table
            className={styles.orderTable}
            tableLayout="fixed"
            bordered
            columns={columns}
            dataSource={data}
          />
      </div>
    );
  }
}

Teaminformation = Form.create()(Teaminformation);
export default Teaminformation;
