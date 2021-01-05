/**
 *  作者: 邓广晖
 *  创建日期: 2019-06-19
 *  邮箱：denggh6@chinaunicom.cn
 *  文件说明：实现部门分管领导修改功能
 */
import React from 'react';
import Cookie from 'js-cookie';
import {Modal,Input, Form, Select} from 'antd';

import request from '../../../utils/request';
const FormItem = Form.Item;
const Option = Select.Option;

class EditManagerModal extends React.Component{
  state = {
    visible: false,
    managerList: [],
    managername: '',
    managerid: '',
    deptid: '',
    deptname: '',
  };

  /**
   * 作者：耿倩倩
   * 创建日期：2017-09-11
   * 功能：显示模态框
   * @param record 表格一条记录
   */
  showModal = (record,ou) => {
    if (ou == '联通软件研究院本部') {
      ou = '联通软件研究院'
    }
    let resData = request('/microservice/hr/infoquery',{
      arg_tenantid: '10010',
      arg_allnum: 0,
      arg_page_size: 9,
      arg_page_current: 1,
      arg_ou_name: ou,
      arg_dept_name: ou + '-管理层',
    });
    resData.then((data)=>{
      if (data.RetCode === '1') {
        this.setState({
          managerList: data.DataRows,
          visible: true,
          managername: record.managername,
          managerid: record.managerid,
          deptid: record.deptid,
          deptname: record.deptname,
        });
      }
    });
  };

  /**
   * 作者：耿倩倩
   * 创建日期：2017-09-11
   * 功能：选择部门分管领导
   * @param value 选中的分管领导名称
   */
  handleChange = (value) => { //选择负责人
    this.setState({managerid: value});
  };

  /**
   * 作者：耿倩倩
   * 创建日期：2017-09-11
   * 功能：确认按钮
   */
  handleOk = () => {
    this.setState({
      visible: false,
    });
    let arg_params = {
      arg_dept_id: this.state.deptid,
      arg_dm_manager_id: this.state.managerid,
      arg_update_by_id: Cookie.get('userid'),
    };
    const {dispatch} = this.props;
    dispatch({
      type:'hrDeptInfo/saveDeptManager',
      arg_param:arg_params,
      arg_param2: {
        "arg_tenantid": Cookie.get('tenantid'),
        "arg_ou_name":this.props.ou,
        "arg_page_size": 10,
        "arg_page_current": 1
      }
    })
  };

  /**
   * 作者：耿倩倩
   * 创建日期：2017-09-11
   * 功能：取消按钮
   */
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };
  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    return (
      <div>
        <Modal
          title="修改分管领导人"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <FormItem label="部门名称：" {...formItemLayout}>
              <Input value={this.state.deptname} disabled/>
            </FormItem>
            <FormItem label="分管领导人：" {...formItemLayout}>
              <Select  value={this.state.managerid} onSelect={this.handleChange}>
                {this.state.managerList.map((item,index)=>
                  <Option key={item.staff_id}>{item.username}</Option>
                )}
              </Select>
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default EditManagerModal;
