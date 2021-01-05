/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：待办模态框
 */
import React, { Component } from 'react';
import {Modal, Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;
/**
 * 作者：任华维
 * 创建日期：2017-10-21
 * 功能：退回原因模态框
 */
class ResonModal extends Component {
    constructor (props) {
        super(props);
    }
    /**
     * 作者：任华维
     * 创建日期：2017-10-21
     * 功能：提交Click事件
     * @param e 点击事件默认参数
     */
    handleSubmit = (e) => {
        e.preventDefault();
        const { okClick,cancelClick } = this.props;
        const { validateFieldsAndScroll, resetFields } = this.props.form;
        validateFieldsAndScroll((errors, values) => {
          if (errors) return;
          //this.props.form.resetFields();
          this.props.form.validateFields();
          const partners = values.arg_partner_id.map((item, index) => {
              return {
                  id:item,
                  value:values[item]
              }
          });
          okClick(partners);
          resetFields();
          cancelClick();
        });

    }
    /**
     * 作者：任华维
     * 创建日期：2017-10-21
     * 功能：取消Click事件
     * @param e 点击事件默认参数
     */
    handleCancel = (e) => {
        e.preventDefault();
        const { cancelClick } = this.props;
        this.props.form.resetFields();
        cancelClick();
    }
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { isShow, data} = this.props;
        const options = data.map(function(item, index){
            return {
                 label: item.name,
                 value: item.partner_id
            };
        });
        getFieldDecorator('arg_partner_id', { initialValue: [] });
        const checked = getFieldValue('arg_partner_id');
        const formItems = checked.map((item, index) => {
            const partner = data.find(i=>i.partner_id === item);
            return (
                <FormItem label={partner.name} key={item}>
                    {getFieldDecorator(`${item}`, {
                        rules: [{ required: true, message: '请输入退回原因!',whitespace:true}]
                    })(
                        <Input placeholder="" />
                    )}
                </FormItem>
            );
        });

        return (
            <Modal
                title="退回原因"
                visible={isShow}
                onOk={this.handleSubmit}
                onCancel={this.handleCancel}
                >
                <Form layout="vertical">
                    <FormItem>
                        {getFieldDecorator('arg_partner_id', {
                            rules: [{
                                required: true, message: '请至少选择一个合作伙伴!',
                            }],
                        })(
                            <CheckboxGroup options={options}/>
                        )}
                    </FormItem>
                    {formItems}

                </Form>
            </Modal>
        )
    }
};

export default Form.create()(ResonModal);
