/**
 * 作者：金冠超
 * 创建日期：2019-07-18
 * 邮件：jingc@itnova.com.cn
 * 文件说明：项目配置-审核设置 业务标识组件
 */
import React from 'react';
import { Select , Row , Col , Form , Input ,} from 'antd';


const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
class ProjInfoLdentity extends React.Component {
    inputSearch = (e) => {
        let value = e.target.value
        return value.replace(/[^\d]/g,'')
    }
    render(){
        const {getFieldDecorator} = this.props.form;
        const oldMsg=this.props.oldMsg
        const formItemTop = {
            labelCol: {span: 4},
            wrapperCol: {span: 16},
        };
        return (
            <Form>
                <Row>
                    <Col className="gutter-row" span={24}>
                        <FormItem label="业务标识编号" {...formItemTop} >

                            {getFieldDecorator('ldentity_id', {
                                            rules: [{
                                                required: true,
                                                message: '业务标识编号为必填项',
                                                whitespace: true,
                                            }],
                                            initialValue: oldMsg ? oldMsg.ldentity_id:"",
                                            getValueFromEvent:this.inputSearch
                                        })
                                        (
                                            <TextArea
                                                rows={2}
                                                maxLength={'32'}
                                                placeholder={'最多为32位数字'}
                                            />
                                        )}
                            </FormItem>
                        </Col>
                    </Row>
                <Row>
                        <Col className="gutter-row" span={24} >
                            <FormItem label="业务标识名称" {...formItemTop} >
                                {getFieldDecorator('ldentity_name',{
                                    rules:[{
                                        required: true,
                                        message: '业务标识名称为必填项',
                                        whitespace: true,
                                    }],
                                    initialValue: oldMsg ? oldMsg.ldentity_name :""
                                })
                                (
                                    <TextArea
                                        rows={2}
                                        maxLength={'80'}
                                        placeholder={'最多可输入80字'}
                                    />
                                    
                                )
                                }
                                </FormItem>
                            </Col>
                        
                    </Row>
                    <Row>
                    <Col className="gutter-row" span={24}>
                            <FormItem label = "状态" {...formItemTop}>
                                {getFieldDecorator('ldentity_state',{
                                    rules:[{
                                        required: true,
                                        message: '状态必填项',
                                    }],
                                    initialValue:oldMsg ? oldMsg.ldentity_state:"1"
                                })
                                (
                                    <Select>
                                        <Option key="1">开</Option>
                                        <Option key="0">关</Option>
                                        </Select>
                                )
                                }
                                </FormItem>
                            </Col>
                    </Row>
                <Row>
                    <Col className="gutter-row" span={24}>
                        <FormItem label="备注" {...formItemTop}>
                            {getFieldDecorator('ldentity_note',{
                                rules:[{
                                    required: false,
                                }],
                                initialValue:oldMsg ? oldMsg.ldentity_note:""
                            })
                            (
                                <Input
                                rows={2}
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
export default Form.create()(ProjInfoLdentity);