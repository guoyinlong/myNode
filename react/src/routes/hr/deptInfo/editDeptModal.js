/**
 *  作者: 耿倩倩
 *  创建日期: 2017-08-19
 *  邮箱：gengqq3@chinaunicom.cn
 *  文件说明：实现部门负责人修改功能
 */
import React from 'react';
import Cookie from 'js-cookie';
import {Modal,Input, Form, Select} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
/**
 * 作者：耿倩倩
 * 创建日期：2017-08-19
 * 功能：实现部门负责人修改功能
 */
class EditDeptModal extends React.Component{
  state = {
    visible: false,
    masterOptionList:this.props.masterOptionList
  };

  /**
   * 作者：耿倩倩
   * 创建日期：2017-09-11
   * 功能：显示修改部门负责人对话框
   * @param record 表格一条记录
   * @param dispatch 请求方法
   */
  showModal = (record,dispatch) => {
    //debugger
    this.setState({
      visible: true,
      deptid: record.deptid,
      deptname: record.deptname,
      username: record.username,
      userid:record.userid,
    });
    let auth_tenantid = Cookie.get('tenantid');
    let arg_params = {
      "argtenantid": auth_tenantid,
      "argflag":6,
      "argpostid": `("${record.deptid}")`
    };
    dispatch({
      type:'hrDeptInfo/getAllUsers',
      arg_param:arg_params
    });
  };

  /**
   * 作者：耿倩倩
   * 创建日期：2017-09-11
   * 功能：选择部门负责人
   * @param value 选中的负责人名称
   */
  handleChange = (value) => { //选择负责人
   // debugger
    this.setState({
      username: value.split("-")[0],
      userid:value.split("-")[1],
    });
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
    let auth_tenantid = Cookie.get('tenantid');
    let auth_userid = Cookie.get('userid');
    let arg_params = {
      "arg_tenantid": auth_tenantid,
      "arg_dept_name":this.state.deptname,
      "arg_staff_id": this.state.userid,
      "arg_op_by": auth_userid
    };
    const {ou} = this.props;
    let arg_params_search = { //给查询传参
      "arg_tenantid": auth_tenantid,
      "arg_ou_name":ou,
      "arg_page_size": 10,
      "arg_page_current": 1
    };
    const {dispatch} = this.props;
    dispatch({
      type:'hrDeptInfo/saveDeptMaster',
      arg_param:arg_params,
      arg_param2:arg_params_search
    });
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

    const {masterOptionList}=this.props;
    return (
      <div>
        <Modal
          title="修改部门负责人"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <FormItem label="部门名称：" {...formItemLayout}>
              <Input value={this.state.deptname} disabled/>
            </FormItem>
            <FormItem label="部门负责人：" {...formItemLayout}>
              {masterOptionList.length>=0?
                <Select  value={this.state.username}  onSelect={this.handleChange}>
                  {masterOptionList.map((i,index)=><Option key={i.user_name+"-"+i.user_id}>{i.user_name}</Option>)}
                </Select>: null}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default EditDeptModal;
