/**
 * 作者：张楠华
 * 日期：2018-10-8
 * 邮箱：zhangnh6@chinaunicom.cn
 * 功能：编辑费用项
 */
import React from 'react';
import {Modal,Form,Input,Switch,Select,InputNumber} from 'antd';
import Cookies from 'js-cookie';
const FormItem = Form.Item;
const Option = Select.Option;

class CostFeeMgtModalForm extends React.Component {

  render() {
    const {data, form,concentrationFeeList,dwFee } = this.props;
    const formItemLayout = {
      labelCol: {
        sm: { span: 6 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };
    const { getFieldDecorator } = form;
    let concentrationFee = concentrationFeeList.map((i,index)=>{
      return(<Option value={i.concentration_fee_id} key={index}>{i.concentration_fee_name}</Option>)
    });
    let deFeeList = dwFee.map((i)=>{
      return(<Option value={i.fee_use_id} key={i.fee_use_id}>{i.fee_use_name}</Option>)
    });
    return (
      <Form>
        {
          data.fee_level!=='1'?
            <FormItem
              {...formItemLayout}
              label="上级费用项：">
              {getFieldDecorator('pFeeName')(<span>{data.parent_fee_name}</span>)}
            </FormItem>:null
        }
        <FormItem
          {...formItemLayout}
          label="费用项名称" >
          {getFieldDecorator('arg_fee_name',{rules: [{required: true, message: '请输入费用名称!'}],initialValue:data.fee_name})(<Input />)}
        </FormItem>
        {
          data.fee_level!=='1'?
            <FormItem
              {...formItemLayout}
              label="费用用途" >
              {getFieldDecorator('arg_fee_use_id',{rules: [{required: true, message: '请输入费用用途!'}],initialValue:data.fee_use_id})(<Select>{deFeeList}</Select>)}
            </FormItem>
            :
            null
        }
        {
          data.fee_level!=='1'?
            <FormItem
              {...formItemLayout}
              label="归口费用" >
              {getFieldDecorator('arg_concentration_fee_id',{ rules: [{required: true, message: '请输入归口费用!'}],initialValue:data.concentration_fee_id})(
                <Select>
                  {concentrationFee}
                </Select>
              )}
            </FormItem>
            :
            null
        }
        {
          data.fee_level!=='1'?
            <FormItem
              {...formItemLayout}
              label="费用类型" >
              {getFieldDecorator('arg_fee_type',{rules: [{required: true, message: '请输入费用类别!'}],initialValue:data.fee_type})(
                <Select>
                  <Option key="1">资本化前费用</Option>
                  <Option key="2">资本化后费用</Option>
                  <Option key="3">归口费用</Option>
                </Select>
              )}
            </FormItem>
            :
            null
        }
        {
          data.fee_index ?
            <FormItem
              {...formItemLayout}
              label="费用顺序" >
              {getFieldDecorator('arg_fee_index',{rules: [{required: true, message: '请输入费用顺序!'}],initialValue:parseInt(data.fee_index)})(<InputNumber min={1}/>)}
            </FormItem>
            :
            ''
        }
        <FormItem
          {...formItemLayout}
          label="是否默认显示" >
          {getFieldDecorator('arg_is_default', { valuePropName: 'checked', initialValue:data.is_default==='true'})(<Switch checkedChildren="开" unCheckedChildren="关"/>)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="状态" >
          {getFieldDecorator('arg_state_code', { valuePropName: 'checked', initialValue:data.state_code==='1'})(<Switch checkedChildren="开" unCheckedChildren="关"/>)}
        </FormItem>
      </Form>
    );
  }
}

export  default class EditBudget extends React.Component{
  constructor(props){
    super(props)
  }
  state = {
    visible:false,
    data:'',
  };

  showModal = (record) =>{
    this.setState({
      visible:true,
      data:record,
    });
  };
  handleCancel = () => {
    this.setState({
      visible:false,
    });
  };
  handleOk = () => {
    this.refs.CostFeeMgtModalEdit.validateFields((err, values) => {
      if (err) {
        return null;
      }else{
        this.setState({visible:false});
        let editData = {
          arg_fee_id:this.state.data.fee_id,
          arg_fee_name:values.arg_fee_name,
          arg_fee_index:values.arg_fee_index,
          arg_fee_use_id:values.arg_fee_use_id?values.arg_fee_use_id:'',
          arg_fee_type:values.arg_fee_type,
          arg_is_default:values.arg_is_default?'1':'0',
          arg_concentration_fee_id:values.arg_concentration_fee_id?values.arg_concentration_fee_id:'',
          arg_state_code:values.arg_state_code?'1':'0',
          arg_user_id:Cookies.get('userid'),
        };
        this.props.dispatch({
          type:'costMgt/editExpenseAccount',
          editData,
        });
      }
    })
  };
  render() {
    const CostFeeMgtModalEdit = Form.create()(CostFeeMgtModalForm);
    let title = '编辑费用项('+this.state.data.fee_level+'级)';
    return (
        <div>
          <Modal
            title={title}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={640}
            maskClosable={false}
          >
            <CostFeeMgtModalEdit
              ref="CostFeeMgtModalEdit"
              data={this.state.data}
              concentrationFeeList={this.props.data.concentrationFeeList}
              dwFee={this.props.data.dwFee}
            />
          </Modal>
        </div>
    );
  }
}
