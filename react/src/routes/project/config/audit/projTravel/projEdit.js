/**
 * 作者：金冠超
 * 创建日期：2019-09-03
 * 邮件：jingc@itnova.com.cn
 * 文件说明：部门差旅费-新增
 */
import React from 'react';
import { Row , Col , Form , Input, InputNumber } from 'antd';


const FormItem = Form.Item;
const { TextArea } = Input;

class ProjEdit extends React.Component {
    state={}

    render(){

        const {getFieldDecorator} = this.props.form;
        const formItemTop = {
            labelCol: {span: 8},
            wrapperCol: {span: 12},
        };
        return (
            <Form>
                <Row>
                    <Col className="gutter-row" span={24}>
                        <FormItem label="年份" {...formItemTop} >
                                <p>{this.props.editOne.year}</p>
                            </FormItem>
                        </Col>
                    </Row>
                <Row>
                        <Col className="gutter-row" span={24} >
                            <FormItem label="部门" {...formItemTop}>
                                    <p>{this.props.editOne.deptname}</p>
                                </FormItem>
                            </Col>
                    </Row>
                <Row>
                        <Col className="gutter-row" span={24} >
                            <FormItem label="原金额（元）" {...formItemTop}>
                                    <p>{this.props.editOne.budgetfee}</p>
                                </FormItem>
                            </Col>
                    </Row>

                 <Row>
                    <Col className="gutter-row" span={24}>
                            <FormItem label='新金额（元）' {...formItemTop}>
                                {getFieldDecorator('arg_budget_fee',{
                                    rules:[{
                                        required: true,
                                        message: '必须输入且仅能输入正浮点数，且最大值为10亿',
                                    }],
                                })
                                (
                                    <InputNumber
                                        min={0}
                                        max={999999999}
                                        parser={value=>value>999999999 ? "" :value}
                                        // formatter={value => ` ${value}`.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')}
                                        precision={2}
                                        style={{width:'100%'}}
                                    />
                                )
                                }
                                </FormItem>
                            </Col>
                    </Row> 
                <Row>
                    <Col className="gutter-row" span={24}>
                            <FormItem label='修改' {...formItemTop}>
                                {getFieldDecorator('arg_remark',{
                                    rules:[{
                                        required: true,
                                        message: '修改原因为必填项',
                                    }],
                                })
                                (
                                    <TextArea
                                    rows={2}
                                    maxLength={'200'}
                                    placeholder={'最大输入200字'}
                                />
                                )
                                }
                                </FormItem>
                            </Col>
                    </Row> 
            </Form>
        );
    }
}
export default Form.create()(ProjEdit);