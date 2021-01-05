/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：查询表单
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker } from 'antd';
import styles from './advancedSearchForm.less';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker } = DatePicker;

class AdvancedSearchForm extends React.Component {
    constructor (props) {
        super(props);
    }
    // reset = () => {
    //     this.props.form.resetFields();
    //     const fieldsValue = this.props.form.getFieldsValue();
    //     fieldsValue.arg_year_month = fieldsValue.arg_year_month.format("YYYY-MM");
    //     this.props.search(fieldsValue);
    // }
    getFields = () => {
        const { getFieldDecorator } = this.props.form;
        const { search, form_data } = this.props;
        const form_state = form_data.form_state.map((item, index) => {
            return <Option key={index} value={item.key}>{item.value}</Option>
        });
        const form_partner =  form_data.form_partner.map((item, index) => {
            return <Option key={index} value={item.partner_id}>{item.name}</Option>
        });
        const form_proj = form_data.form_proj.map((item, index) => {
            return <Option key={index} value={item.proj_id}>{item.proj_name}</Option>
        });
        const form_dept = form_data.form_dept.map((item, index) => {
            return <Option key={index} value={item.pu_dept_id}>{item.pu_dept_name.includes('-') ? item.pu_dept_name.split('-')[1] : item.pu_dept_name}</Option>
        });
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const monthFormat = 'YYYY-MM';
        const disabledMonth = (current) =>{
            return current && current > moment().subtract(1, "months")
        }

        return (
            <fieldset style={{'border':'none'}}>
                <Row gutter={20}>
                    <Col span={7}>
                        <FormItem {...formItemLayout} label='年月'>
                            {getFieldDecorator('arg_year_month', {
                                initialValue:moment().subtract(1, "months")
                            })(
                                <MonthPicker style={{ width: '100%' }} disabledDate={disabledMonth} format={monthFormat} onChange={(value)=>search({'arg_year_month':value.format(monthFormat)})}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={7}>
                        <FormItem {...formItemLayout} label='合作方'>
                            {getFieldDecorator('arg_partner_id', {
                                initialValue:''
                            })(
                                <Select onChange={(value)=>search({'arg_partner_id':value})} >{form_partner}</Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={7}>
                        <FormItem {...formItemLayout} label='状态'>
                            {getFieldDecorator('arg_state_desc', {
                                initialValue:''
                            })(
                                <Select onChange={(value)=>search({'arg_state_desc':value})} >{form_state}</Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={20}>
                    <Col span={14}>
                        <FormItem labelCol={{ span: 4 }} wrapperCol= {{ span: 20 }} label='团队名称'>
                            {getFieldDecorator('arg_proj_id', {
                                initialValue: ''
                            })(
                                <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    optionFilterProp="children"
                                    onChange={(value)=>search({'arg_proj_id':value})}
                                    filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                                    >
                                    {form_proj}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={7}>
                        <FormItem {...formItemLayout} label='归属部门'>
                            {getFieldDecorator('arg_pu_dept_id', {
                                initialValue:''
                            })(
                                <Select onChange={(value)=>search({'arg_pu_dept_id':value})} >{form_dept}</Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </fieldset>
        );
    }

    render() {
        return (
            <Form className={styles['ant-advanced-search-form']}>
                {this.getFields()}
            </Form>
        );
    }
}

export default Form.create({
    mapPropsToFields(props) {
        return {
            arg_proj_id: {value:props.form_data.search_condition.arg_proj_id},
            arg_partner_id: {value:props.form_data.search_condition.arg_partner_id},
            arg_state_desc: {value:props.form_data.search_condition.arg_state_desc},
            arg_pu_dept_id: {value:props.form_data.search_condition.arg_pu_dept_id},
            arg_year_month:{value:moment(props.form_data.search_condition.arg_year_month)}
        };
    }
})(AdvancedSearchForm);
