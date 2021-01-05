/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：查询表单
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker } from 'antd';
import AdvancedSearchFormButton from './advancedSearchFormButton';
import styles from './advancedSearchForm.less';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker } = DatePicker;

class AdvancedSearchForm extends React.Component {
    constructor (props) {
        super(props);
    }
    getFlag = () => {
        const { result } = this.props;
        let flag = true;
        if (result[0] && result[0].state_desc === '1') {
            flag = false;
        }
        return flag
    }
    getFields = () => {
        const { getFieldDecorator } = this.props.form;
        const { search, proj, result } = this.props;

        const form_proj = proj.map((item, index) => {
            return <Option key={index} value={item.proj_id}>{item.proj_name}</Option>
        });
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const monthFormat = 'YYYY-MM';
        const disabledMonth = (current) =>{
            return current && current > moment().subtract(1, "months")
        }
        let state = '未填报';
        if (result[0]) {
            switch (result[0].state_desc) {
                case '2':
                    state = '审核中'
                    break;
                case '3':
                    state = '已完成'
                    break;
            }
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
                        <FormItem {...formItemLayout}  label='团队名称'>
                            {getFieldDecorator('arg_proj_id', {
                                initialValue:''
                            })(
                                <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    optionFilterProp="children"
                                    dropdownMatchSelectWidth={false}
                                    onChange={(value)=>search({'arg_proj_id':value})}
                                    filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                                    >
                                    {form_proj}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={7}>
                        <FormItem {...formItemLayout} label='状态'>
                            {getFieldDecorator('arg_state_desc', {
                                initialValue:''
                            })(
                                <span>{state}</span>
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
                <AdvancedSearchFormButton handleSubmit={this.props.ok} flag={this.getFlag()}></AdvancedSearchFormButton>
            </Form>
        );
    }
}

export default Form.create({
    mapPropsToFields(props) {
        return {
            arg_proj_id: {value:props.condition.arg_proj_id},
            arg_year_month:{value:moment(props.condition.arg_year_month)}
        };
    }
})(AdvancedSearchForm);
