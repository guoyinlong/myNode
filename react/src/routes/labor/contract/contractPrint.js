/**
 * 作者：王福江
 * 创建日期：2019-09-12
 * 邮箱：wangfj80@chinaunicom.cn
 * 功能：合同续签审批
 */
import React, {Component} from "react";
import {Button, Row, Form, Input, Card, Table, Select, message, Col, Checkbox, Modal} from "antd";
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

import {connect} from "dva";
import {routerRedux} from "dva/router";
import Cookie from "js-cookie";
import styles from "../../overtime/style.less";

class contractPrint extends Component{
  constructor (props) {
    super(props);
    //let user_name = Cookie.get('username');
    //let user_id = Cookie.get('userid');
    //let dept_id = Cookie.get('dept_id');
    //let dept_name = Cookie.get('dept_name');
    //let auth_ouname = Cookie.get('OU');
    this.state = {
      choiseOpinionFlag:"none",
      isClickable: true,
      visible:false,
      nextstep:'',
      endstepflag:false,
    };
  }
  columns = [
    { title: '序号', dataIndex: 'key'},
    { title:'员工编号', dataIndex:'user_id'},
    { title:'员工姓名', dataIndex:'user_name'},
    { title:'部门名称', dataIndex:'dept_name',
      render:(text, record, index)=>{
        return (record.dept_name.split('-')[1]);
      }},
    { title:'项目组名称', dataIndex:'team_name'},
    { title:'合同类型', dataIndex:'contract_type'},
    { title:'合同期限（月）', dataIndex:'contract_time'},
    { title:'起始日期', dataIndex:'start_time'},
    { title:'截止日期', dataIndex:'end_time'},
    { title:'已签合同数', dataIndex:'sign_number'},
    { title:'距离合同续签天数', dataIndex:'end_day'},
    { title:'是否通过', dataIndex:'if_pass'}
  ];


  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    //信息
    const {dataInfoList} = this.props;
    const {approvalHiList} = this.props;

    console.log("ppppppppppppppppppppppppppp");
    console.log("approvalHiList=");
    console.log(approvalHiList);


      const hidataList = approvalHiList.map(item =>
        <FormItem label={item.task_name} hasFeedback {...formItemLayout}>
          <Input style={{color: '#000'}} value={item.task_detail} disabled={true}></Input>
        </FormItem>
      );

    return (
      <div>
        <Row span={2} style={{textAlign: 'center'}}><h2>合同已办查询</h2></Row>
        <Card title="合同信息列表" className={styles.r}>
          <br/>
          <Table
            columns={this.columns}
            dataSource={dataInfoList}
            pagination={false}
          />
          <br/>
        </Card>
        <br/><br/>
        <Card title="审批信息">
          <span style={{ textAlign: 'center' }}>
              {hidataList}
          </span>
        </Card>
      </div>


    );
  }
}
function mapStateToProps(state) {
  return {
    loading: state.loading.models.contractApproveInfo,
    ...state.contractApproveInfo
  };
}
contractPrint = Form.create()(contractPrint);
export default connect(mapStateToProps)(contractPrint);
