/**
 * 文件说明：打印
 * 作者：师庆培
 * 邮箱：shiqp3@chinaunicom.cn
 * 创建日期：2019-06-27
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, DatePicker, Select, Modal, Checkbox,Table} from 'antd';
import Cookie from "js-cookie";
import { connect } from 'dva';
import {OU_XIAN_NAME_CN,OU_HQ_NAME_CN} from "../../../utils/config";
import styles from './index.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {routerRedux} from "dva/router";
moment.locale('zh-cn');

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;


class LeavePrint extends Component {
  constructor (props) {
    super(props);
    let user_name = Cookie.get('username');
    let user_id = Cookie.get('userid');
    let dept_id = Cookie.get('dept_id');
    let dept_name = Cookie.get('dept_name');
    let auth_ouname = Cookie.get('OU');
    this.state = {
      visible:false,
      ouflag:auth_ouname,
      staff_name:user_name,
      dept_name:dept_name,
      user_id:user_id,
      dept_id:dept_id,
      isSubmitClickable:true,
      isSaveClickable:true,
      leave_apply_id_save:'',
      itemInfoFlag:false
    }
  }

  


  //返回按钮
  goBack = () =>{
    history.back();
  }




  //打印
  print = () => {
    window.document.body.innerHTML = window.document.getElementById('leavePrint').innerHTML;
    window.print();
    window.location.reload();
  }

  render() {

    const {leaveApplyInfo} = this.props;

   
    

    const {approvalInfoDone} = this.props;
    
    
    const {} = this.props;
    /**approvalInfo是这条申请单的所有审批记录 */
    
    /**对approvalInfo进行循环遍历 */
    
    

        
  
    

    
    
    

    let leaveApplyCol=[
      {
        title:'列1',
        dataIndex:'name1',
        width:'10%',
      },{
        title:'列2',
        dataIndex:'info1',
        width:'10%',
        render:(value, row, index)=>{
          const obj = {
            children: value,
            props: {},
          };
          if(!row.name2){
            obj.props.colSpan = 3;
          }else{
            obj.props.colSpan = 1;
          }
          return obj;
        }
      },{
        title:'列3',
        dataIndex:'name2',
        width:'10%',
        render:(value, row, index)=>{
          const obj = {
            children: value,
            props: {},
          };
          if(row.name2){
            obj.props.colSpan = 1;
          }else{
            obj.props.colSpan = 0;
          }
          return obj;
        }
      },{
        title:'列4',
        dataIndex:'info2',
        width:'10%',
        render:(value, row, index)=>{
          const obj = {
            children: value,
            props: {},
          };
          if(row.name2){
            obj.props.colSpan = 1;
          }else{
            obj.props.colSpan = 0;
          }
          return obj;
        }
      }
    ];

    

    


    let leaveApplyDS=[{
        "name1":"姓名",
        "info1": leaveApplyInfo.create_person_name,
        "name2":"部门",
        "info2": leaveApplyInfo.dept_name
      },{
        "name1":"岗位名称",
        "info1": leaveApplyInfo.position_title,
        "name2":"岗位级别",
        "info2": leaveApplyInfo.position_level
      },{
        "name1":"入职时间",
        "info1": moment(leaveApplyInfo.start_time,'YYYY-MM-DD').format('YYYY-MM-DD'),
        "name2":"离职时间",
        "info2": moment(leaveApplyInfo.leave_time,'YYYY-MM-DD').format('YYYY-MM-DD')
      },{
        "name1":"联系方式",
        "info1": leaveApplyInfo.contact,
        "name2":"离职种类",
        "info2": leaveApplyInfo.leave_type
      },{
        "name1":"离职-公司原因",
        "info1": leaveApplyInfo.company_reason,
      },
      {
        "name1":"离职-个人原因",
        "info1": leaveApplyInfo.self_reason
      },{
        "name1":"其他离职原因",
        "info1": leaveApplyInfo.other_reason
      },{
        "name1":"离职去向",
        "info1": leaveApplyInfo.leave_gone
      },{
        "name1":"您对部门的建议",
        "info1": leaveApplyInfo.dept_advice
      },{
        "name1":"您对公司的建议",
        "info1": leaveApplyInfo.company_advice 
      },{
        "name1":"申请人意见",
        "info1":leaveApplyInfo.self_advice
      }
    ];
    
    
    for(let i=0;i<approvalInfoDone.length;i++)
    {
      let temp={
        "name1": approvalInfoDone[i].task_name,
        "info1": approvalInfoDone[i].task_detail
      };
      leaveApplyDS.push(temp);
    }




    for (let i=0;i<leaveApplyDS.length;i++) {
      leaveApplyDS[i].key = i+1;
    }

    

   



    
      //流转中的申请
      return(
        <div>
          <Form>
            <div id="leavePrint" className={styles.tableClass}>
              <Row span={2} style={{ textAlign: 'center' }}><h1>员工离职申请表</h1></Row>
                <br/><br/>
                <div className={styles.boxW}>
                <Table dataSource={leaveApplyDS} columns={leaveApplyCol} pagination={false} bordered size="default" showHeader={false}>
                </Table>
              </div>
            </div>

            <br>
            </br>
            <br></br>
            <Row>
              <Col span={24} style={{ textAlign: 'center' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button type="primary" onClick={this.goBack}>返回</Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button type="primary" onClick={this.print.bind(this)}>打印</Button>
              </Col>
            </Row>
          </Form>
        </div>
      );


  }
}



function mapStateToProps(state) {

  return {
    loading: 
    state.loading.models.staff_leave_index_model,
    ...state.staff_leave_index_model,

  };
}
LeavePrint = Form.create()(LeavePrint);
export default connect(mapStateToProps)(LeavePrint)