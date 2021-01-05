/**
 * 文件说明：查看未提交的工作交接
 * 作者：师庆培
 * 邮箱：shiqp3@chinaunicom.cn
 * 创建日期：2019-06-27
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, DatePicker, Select, Modal, Checkbox,message,Table} from 'antd';
import { connect } from 'dva';
import Cookie from "js-cookie";
import styles from './index.less';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
import {routerRedux} from "dva/router";


class HandOverPrint extends Component {
  constructor (props) {
    super(props);
    let dept_name = Cookie.get('dept_name');
    this.state = {
      visible:false,
      send_Flag:false,
      recv_Flag:true,
      send_teamleader_Flag:true,
      send_leader_Flag:true,
      recv_leader_Flag:true,
      staffname: "",
      staffdept:"",
      position:"",
      recv_staffname: "",
      recv_staffdept:"",
      recv_position:"",
      work_Content:"",
      handList:"",
      otherQuestion:"",
      isClickable:true,
      isSubmitClickable:true,
      isSaveClickable:true,
      dept_name:dept_name
    }
  }




   //返回按钮
  goBack = () =>{
    history.back();
  }


  //打印
  print = () => {
    window.document.body.innerHTML = window.document.getElementById('handworkPrint').innerHTML;
    window.print();
    window.location.reload();
  }


  render() {

    const {leaveHandInfo} = this.props;

    const {approvalInfoDone} = this.props;


    /**已办的查看页面，只需要显示已经审批的意见，没有的不用显示*/
    /**提交功能的（页面） TODO 直接用金亭那边的*/




    if(Cookie.get('userid')===leaveHandInfo.create_person){
      //如果是本人
      this.state.send_Flag = false;
      console.log("本人");
    }else{
      //如果是审核人
      this.state.send_Flag = true;
      console.log("审核人");
    }

    console.log("leaveHandInfo"+leaveHandInfo);
    

    

      

    let leaveHandCol = [
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


    let leaveHandDS=[
      {
        "name1":"姓名",
        "info1": leaveHandInfo.create_name,
        "name2":"部门",
        "info2": leaveHandInfo.create_dept
      }
    ];

    if(leaveHandInfo.create_proj){
      leaveHandDS.push(
        {
          "name1":"项目组",
          "info1": leaveHandInfo.create_proj
        }
      );
    }
    

    leaveHandDS.push(
      {
        "name1":"工作内容描述",
        "info1": leaveHandInfo.work_detail
      }
    );


    leaveHandDS.push(
      {
        "name1":"交接清单",
        "info1": leaveHandInfo.hand_detail
      }
    );


    leaveHandDS.push(
      {
        "name1":"其他问题",
        "info1": leaveHandInfo.other_question
      }
    );


    for(let i=0;i<approvalInfoDone.length;i++){
      let temp={
        "name1":approvalInfoDone[i].task_name,
        "info1":approvalInfoDone[i].task_detail
      };
      leaveHandDS.push(temp);
    }

   
    
      return (
        <Form>
        <div id="handworkPrint" className={styles.tableClass}>
          <Row span={2} style={{ textAlign: 'center' }}><h1>工作交接清单</h1></Row>
              <br/><br/>
          <div className={styles.boxW}>
            <Table dataSource={leaveHandDS} columns={leaveHandCol} pagination={false} bordered size="default" showHeader={false}>
            </Table>
          </div>
        </div>
        <br></br>
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
      );
   





    
  }
}


function mapStateToProps(state) {

  return {
    loading: state.loading.models.staff_leave_index_model,
    ...state.staff_leave_index_model
  };
}
HandOverPrint = Form.create()(HandOverPrint);
export default connect(mapStateToProps)(HandOverPrint)
