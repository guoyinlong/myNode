/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：待办模态框
 */
import React, { Component } from 'react';
import {Modal, Form, Icon, Input, Button } from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input;
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
        const { validateFieldsAndScroll } = this.props.form;
        validateFieldsAndScroll((errors, values) => {
          if (errors) return;
          //this.props.form.resetFields();
          this.props.form.validateFields();
          okClick(values);
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
        const { getFieldDecorator } = this.props.form;
        const { isShow} = this.props;
        return (
            <Modal
                title="退回原因"
                visible={isShow}
                onOk={this.handleSubmit}
                onCancel={this.handleCancel}
                >
                <Form className="">
                    <FormItem>
                    {getFieldDecorator('reson', {
                    rules: [{
                        required: true, message: '请输入退回原因!',
                    }],
                    })(
                        <TextArea placeholder="" autosize={{ minRows: 3, maxRows: 6 }} />
                    )}
                    </FormItem>

                </Form>
            </Modal>
        )
    }
};

export default Form.create()(ResonModal);
