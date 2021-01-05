/**
 * 作者：金冠超
 * 创建日期：2019-07-18
 * 邮件：jingc@itnova.com.cn
 * 文件说明：项目配置-审核设置 审核环节组件
 */
import React from 'react';
import {Row , Col , Form , Input } from 'antd';


const FormItem = Form.Item;
const { TextArea } = Input;

class ProjInfoTache extends React.Component {
    state={}
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
                        <FormItem label="环节编号" {...formItemTop} >
                            {getFieldDecorator('tache_id', {
                                            rules: [{
                                                required: true,
                                                message: '环节编号为必填项',
                                                whitespace: true
                                            }],
                                            initialValue: oldMsg? oldMsg.tache_id:"",
                                            getValueFromEvent:this.inputSearch
                                        })
                                        (
                                            <TextArea
                                                rows={2}
                                                maxLength={'45'}
                                                placeholder={'最多为45位'}
                                            />
                                        )}
                            </FormItem>
                        </Col>
                    </Row>
                <Row>
                    <Col className="gutter-row" span={24}>
                        <FormItem label="环节名称" {...formItemTop} >
                            {getFieldDecorator('tache_name', {
                                            rules: [{
                                                required: true,
                                                message: '环节名称为必填项',
                                                whitespace: true
                                            }],
                                            initialValue: oldMsg? oldMsg.tache_name:""
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
                </Form>
        );
    }
}
export default Form.create()(ProjInfoTache);