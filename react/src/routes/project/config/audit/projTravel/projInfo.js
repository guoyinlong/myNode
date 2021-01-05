/**
 * 作者：金冠超
 * 创建日期：2019-09-03
 * 邮件：jingc@itnova.com.cn
 * 文件说明：部门差旅费-新增
 */
import React from 'react';
import { Select , Row , Col , Form , Input , InputNumber } from 'antd';


const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

class ProjInfo extends React.Component {
    state={}

    render(){
        const {getFieldDecorator} = this.props.form;
        const {deptList}=this.props
        const oldMsg=this.props.query
        const formItemTop = {
            labelCol: {span: 8},
            wrapperCol: {span: 12},
        };
        const deptSelect = deptList.map((item)=>{return <Option key={item.pu_dept_id}>{item.pu_dept_name}</Option>})
        return (
            <Form>
                <Row>
                    <Col className="gutter-row" span={24}>
                        <FormItem label="年份" {...formItemTop} >
                            {getFieldDecorator('year', {
                                            rules: [{
                                                required: true,
                                                message: '请输入四位数年份',
                                                whitespace: true,
                                                pattern:new RegExp(/^[1-9][0-9][0-9][0-9]$/, "g")
                                            }],
                                            initialValue: oldMsg? oldMsg.year:""
                                        })
                                        (
                                            <TextArea
                                                rows={2}
                                                maxLength={'4'}
                                                placeholder={'请输入四位数年份'}
                                            />
                                        )}
                            </FormItem>
                        </Col>
                    </Row>
                <Row>
                        <Col className="gutter-row" span={24} >
                            <FormItem label="部门名称" {...formItemTop} >
                                {getFieldDecorator('dept_id',{
                                    rules:[{
                                        required: true,
                                        message: '部门名称为必填项',
                                        whitespace: true
                                    }],
                                    initialValue: oldMsg ? oldMsg.dept_id :""
                                })
                                (
                                    <Select>
                                        {deptSelect}
                                        </Select>
                                )
                                }
                                </FormItem>
                            </Col>
                    </Row>
                <Row>
                <Col className="gutter-row" span={24}>
                            <FormItem label='差旅预算总额（元）' {...formItemTop}>
                                {getFieldDecorator('arg_budget_fee',{
                                    rules:[{
                                        required: true,
                                        message: '必须输入且仅能输入正浮点数且最大值为10亿',
                                    }],
                                })
                                (
                                    <InputNumber
                                        min={0}
                                        max={1000000000}
                                        parser={value=>value>999999999 ? "" :value}
                                        // formatter={value => ` ${value}`.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')}
                                        precision={2}
                                        style={{width:'100%'}}
                                    />
                                )
                                }
                                {/* <span style= {{color:"red"}}>最大值为10亿</span> */}
                                </FormItem>
                            </Col>
                    </Row>
            </Form>
        );
    }
}
export default Form.create()(ProjInfo);


