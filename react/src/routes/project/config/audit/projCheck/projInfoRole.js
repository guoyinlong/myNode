/**
 * 作者：金冠超
 * 创建日期：2019-07-18
 * 邮件：jingc@itnova.com.cn
 * 文件说明：项目配置-审核设置 审核角色组件
 */
import React from 'react';
import { Select , Row , Col , Form , Input } from 'antd';


const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

class ProjInfoRole extends React.Component {
    state={}

    render(){
        const {getFieldDecorator} = this.props.form;
        const oldMsg=this.props.oldMsg
        const formItemTop = {
            labelCol: {span: 4},
            wrapperCol: {span: 16},
        };
        const testmsglist = [{name:"",key:"4"},{name:"财务",key:"1"},{name:"中心经理",key:"2"},{name:"归属部门经理",key:"3"}]
        const roleTypeList = testmsglist.map((item)=>{return <Option key={item.key}>{item.name}</Option>})
        return (
            <Form>
                <Row>
                    <Col className="gutter-row" span={24}>
                        <FormItem label="角色姓名" {...formItemTop} >
                            {getFieldDecorator('role_name', {
                                            rules: [{
                                                required: true,
                                                message: '角色姓名为必填项',
                                                whitespace: true
                                            }],
                                            initialValue: oldMsg? oldMsg.role_name:""
                                        })
                                        (
                                            <TextArea
                                                rows={2}
                                                maxLength={'20'}
                                                placeholder={'最多可输入20字'}
                                            />
                                        )}
                            </FormItem>
                        </Col>
                    </Row>
                <Row>
                        <Col className="gutter-row" span={24} >
                            <FormItem label="角色简称" {...formItemTop} >
                                {getFieldDecorator('role_abbreviation',{
                                    rules:[{
                                        required: true,
                                        message: '角色简称为必填项',
                                        whitespace: true
                                    }],
                                    initialValue: oldMsg ? oldMsg.role_abbreviation :""
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
                            <FormItem label='角色类型' {...formItemTop}>
                                {getFieldDecorator('role_type',{
                                    rules:[{
                                        required: false,
                                    }],
                                    initialValue:oldMsg ? oldMsg.role_type:""
                                })
                                (
                                    <Select>
                                        {roleTypeList}
                                        </Select>
                                )
                                }
                                </FormItem>
                            </Col>
                    </Row>
            </Form>
        );
    }
}
export default Form.create()(ProjInfoRole);




