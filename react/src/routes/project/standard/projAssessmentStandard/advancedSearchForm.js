/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：查询表单
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Icon, Select} from 'antd';
import AdvancedSearchFormButton from './advancedSearchFormButton';
const FormItem = Form.Item;
const Option = Select.Option;
class AdvancedSearchForm extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            expand: false,
            condition : {}
        };
    }

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
        });
    }
    change = (key,value) => {
        const { condition } = this.state;
        condition[key] = value;
        this.setState({condition:condition});
        this.props.ouChange(this.state.condition);
    }
    reset = () => {
        this.props.form.resetFields();
        this.setState({condition:{}});
        this.props.reset();
    }

    toggle = () => {
        const { expand } = this.state;
        this.setState({ expand: !expand });
    }
    getFields() {
        const { getFieldDecorator } = this.props.form;
        const { projectType,department} = this.props;
        const { expand } = this.state;
        const typeOptions = projectType.map((d,index)=> <Option key={index} value={d.type_name}>{d.type_name_show}</Option>);
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const departmentOpt = department.map((item, index) => {
            return (
                <Option key={index} value={item.pu_dept_name}>{item.pu_dept_name.split('-')[1]}</Option>
            )
        })
        return (
            <div>
                <Row gutter={20}>
                    <Col span={7} style={{ display: 'block' }}>
                        <FormItem {...formItemLayout} label='归属部门'>
                            {getFieldDecorator('dept', {
                                rules: [],
                            })(
                                <Select labelInValue onChange={(value)=>this.change('arg_dept_name',value.key)} >
                                    {departmentOpt}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={7} style={{ display: 'block' }}>
                        <FormItem {...formItemLayout} label='项目类型'>
                            {getFieldDecorator('type', {
                                rules: [],
                            })(
                                <Select labelInValue  onChange={(value)=>this.change('arg_proj_type',value.key)} >
                                    {typeOptions}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={7} style={{ display: 'block' }}>
                        <FormItem {...formItemLayout} label='生产编码'>
                            {getFieldDecorator('bianhao')(
                                <Input placeholder="" onPressEnter={(e)=>this.change('arg_proj_code',e.target.value)} onBlur={(e)=>this.change('arg_proj_code',e.target.value)}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={3} style={{ display: 'block' }}>
                        <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>{this.state.expand ? '收起' : '展开'} <Icon type={this.state.expand ? 'up' : 'down'} /></a>
                    </Col>
                </Row>
                <Row gutter={20}>
                    <Col span={7} style={{ display: expand ? 'block' : 'none' }}>
                        <FormItem {...formItemLayout} label='团队名称'>
                            {getFieldDecorator('mingcheng')(
                                <Input type="textarea" autosize={{ minRows: 3, maxRows: 3 }} onPressEnter={(e)=>this.change('arg_proj_name',e.target.value)} onBlur={(e)=>this.change('arg_proj_name',e.target.value)}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </div>
        );
    }

    render() {
        return (
            <Form style={{'padding':'20px 0'}} onSubmit={this.handleSearch}>
                {this.getFields()}
                <AdvancedSearchFormButton handleReset={this.reset}></AdvancedSearchFormButton>
            </Form>
        );
    }
}

export default Form.create()(AdvancedSearchForm);
