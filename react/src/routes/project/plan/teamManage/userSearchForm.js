/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：查询
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Icon} from 'antd';
const FormItem = Form.Item;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class UserSearchForm extends React.Component {
    constructor (props) {
        super(props);
    }
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.handleSearch(values);
            }
        });
    }
    componentDidMount() {
        this.props.form.validateFields();
    }
    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const { condition } = this.props;
        const infoError = isFieldTouched('inputStr') && getFieldError('inputStr');
        return (
            <Form layout="inline" onSubmit={this.handleSearch} hideRequiredMark={true}>
                <FormItem validateStatus={infoError ? 'warning' : ''} help=''>
                    {getFieldDecorator('inputStr', {
                        initialValue: condition,
                        rules: [{ required: true}],
                    })(
                        <Input style={{ width: '200px' }} placeholder="姓名  员工编号  邮箱  手机号" />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" size="default" disabled={hasErrors(getFieldsError())}>搜索</Button>
                </FormItem>
            </Form>
        );
    }
}

export default Form.create()(UserSearchForm);
