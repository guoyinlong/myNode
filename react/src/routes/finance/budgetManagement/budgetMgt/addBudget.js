/**
 * 作者：张楠华
 * 日期：2018-10-8
 * 邮箱：zhangnh6@chinaunicom.cn
 * 功能：添加费用项
 */
import React from 'react';
import {Modal,Form,Input,Switch,Select,InputNumber } from 'antd';
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
    let concentrationFee = concentrationFeeList.map((i)=>{
      return(<Option value={i.concentration_fee_id} key={i.concentration_fee_id}>{i.concentration_fee_name}</Option>)
    });
    let deFeeList = dwFee.map((i)=>{
      return(<Option value={i.fee_use_id} key={i.fee_use_id}>{i.fee_use_name}</Option>)
    });
    return (
      <Form>
        {
          data.fee_level!=='0'?
            <FormItem
              {...formItemLayout}
              label="上级费用项：">
              {getFieldDecorator('fee_name')(<span>{data.fee_name}</span>)}
            </FormItem>:null
        }
        <FormItem
          {...formItemLayout}
          label="费用项名称" >
          {getFieldDecorator('arg_fee_name',{rules: [{required: true, message: '请输入费用项名称!'}]})(<Input/>)}
        </FormItem>
        {
          data.fee_level!=='0'?
            <FormItem
              {...formItemLayout}
              label="费用用途" >
              {getFieldDecorator('arg_fee_use_id',{rules: [{required: true, message: '请输入费用用途!'}]})(<Select>{deFeeList}</Select>)}
            </FormItem>
            :
            null
        }
        {
          data.fee_level!=='0'?
            <FormItem
              {...formItemLayout}
              label="归口费用" >
              {getFieldDecorator('arg_concentration_fee_id',{rules: [{required: true, message: '请输入归口费用!'}]})(<Select>{concentrationFee}</Select>)}
            </FormItem>
            :
            null
        }
        {
          data.fee_level!=='0'?
            <FormItem
              {...formItemLayout}
              label="费用类型" >
              {getFieldDecorator('arg_fee_type',{rules: [{required: true, message: '请输入费用类别!'}]})(
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
        <FormItem
          {...formItemLayout}
          label="费用顺序" >
          {getFieldDecorator('arg_fee_index',{rules: [{required: true, message: '请输入费用顺序!'}],initialValue:1})(<InputNumber min={1}/>)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="是否默认显示" >
          {getFieldDecorator('arg_is_default', { valuePropName: 'checked', initialValue:true})(<Switch checkedChildren="开" unCheckedChildren="关"/>)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="状态" >
          {getFieldDecorator('arg_state_code', { valuePropName: 'checked', initialValue:true})(<Switch checkedChildren="开" unCheckedChildren="关"/>)}
        </FormItem>
      </Form>
    );
  }
}

export  default class AddBudget extends React.Component{
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
    this.refs.costFeeMgtModalAdd.validateFields((err, values) => {
      if (err) {
        return null;
      }else{
        this.setState({visible:false});
        let addData = {
          arg_fee_name:values.arg_fee_name,
          arg_fee_index:values.arg_fee_index,
          arg_fee_use_id:values.arg_fee_use_id?values.arg_fee_use_id:'',
          arg_fee_level:parseInt(this.state.data.fee_level)+1,
          arg_parent_fee_id:this.state.data.fee_id?this.state.data.fee_id:'1cabb0ccd2a811e8b72c008cfa0519e0',
          arg_parent_fee_name:this.state.data.fee_name?this.state.data.fee_name:'费用项-不显示',
          arg_fee_type:values.arg_fee_type,
          arg_is_default:values.arg_is_default?'1':'0',
          arg_concentration_fee_id:values.arg_concentration_fee_id?values.arg_concentration_fee_id:'',
          arg_state_code:values.arg_state_code?'1':'0',
          arg_user_id:Cookies.get('userid'),
        };
        this.props.dispatch({
          type:'costMgt/addExpenseAccount',
          addData,
        });
      }
    })
  };
  render() {
    const CostFeeMgtModalAdd = Form.create()(CostFeeMgtModalForm);
    let title = '添加费用项('+(parseInt(this.state.data.fee_level)+1)+'级)';
    const { concentrationFeeList,dwFee }= this.props.data;
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
          <CostFeeMgtModalAdd
            ref="costFeeMgtModalAdd"
            data={this.state.data}
            concentrationFeeList={concentrationFeeList}
            dwFee={dwFee}
          />
        </Modal>
      </div>
    );
  }
}
