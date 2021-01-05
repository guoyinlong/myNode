/**
 * 作者：邓广晖
 * 创建日期：2017-10-11
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：实现项目启动的里程碑添加功能
 */
import React from 'react';
import {Row, Col, Modal, Form, Input, DatePicker} from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';

/**
 * 作者：邓广晖
 * 创建日期：2017-10-11
 * 功能：添加里程碑时的模态框
 */
class MileAddModal extends React.Component {

    state = {planWorkload: 0};

    /**
     * 作者：邓广晖
     * 创建日期：2017-10-11
     * 功能：处理输入框的值
     * @param e 输入框变化事件
     */
    handleNumChange = (e) => {
        //先将非数去掉
        let value = e.target.value.replace(/[^\d.]/g, '');
        //如果以小数点开头，去掉
        if (value === '.') {
            value = ''
        }
        //如果连续输入两个小数，去掉一个
        if (value.includes('..')) {
            value = value.replace('..', '.');
        }
        //如果有小数点
        if (value.indexOf('.') >= 1 && value.indexOf('.') !== value.length - 1) {
            //截取小数点后一位
            let cutNumber = Number(value.substring(0, value.indexOf('.') + 2));
            //设置工作量的state,方便计算剩余工作量
            this.setState({planWorkload: cutNumber});
            e.target.value = cutNumber;
        } else {
            this.setState({planWorkload: Number(value)});
            e.target.value = value;
        }
    };

    /**
     * 作者：邓广晖
     * 创建日期：2017-10-11
     * 功能：限制输入时间的值
     * @param beginValue 开始时间
     */
    disabledBeginDate = (beginValue) => {
        const form = this.props.form;
        const endValue = form.getFieldValue('plan_end_time');
        if (!beginValue || !endValue) {
            return false;
        }
        return beginValue.valueOf() > endValue.valueOf();
    };

    /**
     * 作者：邓广晖
     * 创建日期：2017-10-11
     * 功能：限制输入时间的值
     * @param endValue 结束时间
     */
    disabledEndDate = (endValue) => {
        const form = this.props.form;
        const beginValue = form.getFieldValue('plan_begin_time');
        if (!endValue || !beginValue) {
            return false;
        }
        return endValue.valueOf() <= beginValue.valueOf();
    }

    /**
     * 作者：邓广晖
     * 创建日期：2017-10-11
     * 功能：验证开始时间
     * @param rule 验证规则
     * @param value 时间值
     * @param callback 回调函数
     */
    beginTimeCheck = (rule, value, callback) => {
        if (value && value.format('YYYY-MM-DD') < this.props.begin_time) {
            callback('开始时间必须大于等于基本信息里的开始时间（' + this.props.begin_time + ')');
        }
        if (value && value.format('YYYY-MM-DD') > this.props.end_time) {
            callback('开始时间必须小于等于基本信息里的结束时间（' + this.props.end_time + ')');
        }
        callback();
    };

    /**
     * 作者：邓广晖
     * 创建日期：2017-10-11
     * 功能：验证结束时间
     * @param rule 验证规则
     * @param value 时间值
     * @param callback 回调函数
     */
    endTimeCheck = (rule, value, callback) => {
        //const form = this.props.form;
        if (value && value.format('YYYY-MM-DD') < this.props.begin_time) {
            callback('结束时间必须大于等于基本信息里的开始时间（' + this.props.begin_time + ')');
        }
        if (value && value.format('YYYY-MM-DD') > this.props.end_time) {
            callback('结束时间必须小于等于基本信息里的结束时间（' + this.props.end_time + ')');
        }
        callback();
    };

    /**
     * 作者：邓广晖
     * 创建日期：2017-10-11
     * 功能：验证计划工作量
     * @param rule 验证规则
     * @param value 计划工作量的值
     * @param callback 回调函数
     */
    planWorkloadCheck = (rule, value, callback) => {
        let {remainWorkLoad} = this.props;
        if (value && Number((Number(Number(remainWorkLoad).toFixed(2)) - Number(value)).toFixed(2)) < 0) {
            callback('计划工作量之和不能大于预计工作量');
        }
        if (value && Number(value) < 0 || Number(value) === 0) {
            callback('计划工作量需要大于0');
        }
        callback();
    };

    /**
     * 作者：邓广晖
     * 创建日期：2017-10-11
     * 功能：验证里程碑名称
     * @param rule 验证规则
     * @param value 里程碑名称
     * @param callback 回调函数
     */
    mileNameCheck = (rule, value, callback) => {
        if (value && this.props.mileStoneList.length) {
            for (let i = 0; i < this.props.mileStoneList.length; i++) {
                //新增里程碑时，里程碑名字不能与在列表里的里程碑名字一样，列表里程碑需要过滤 opt_type为delete的
                if (this.props.mileStoneList[i].opt_type !== 'delete') {
                    if (this.props.mileStoneList[i].mile_name === value) {
                        callback('新添加的里程碑名称不能与已经存在的里程碑名称相同');
                    }
                }
            }
        }
        if (value && value.trim() === '') {
            callback('里程碑名称不能为空');
        }
        callback();
    };

    render() {
        const FormItemCol = {
            preCol: {span: 12},
            latCol: {span: 20}
        };
        const formItemLayout1 = {
            labelCol: {
                sm: {span: 4}
            },
            wrapperCol: {
                sm: {span: 20}
            }
        };
        const formItemLayout2 = {
            labelCol: {
                sm: {span: 8}
            },
            wrapperCol: {
                sm: {span: 16}
            }
        };
        const {getFieldDecorator} = this.props.form;
        return (
            <Form>
                <Row gutter={16}>
                    <Col className="gutter-row">
                        <FormItem label="里程碑名称" {...formItemLayout1} >
                            {getFieldDecorator('mile_name', {
                                rules: [{
                                    required: true,
                                    message: '里程碑名称是必填项'
                                }, {
                                    validator: this.mileNameCheck
                                }]
                            })
                            (<Input style={{width: '100%'}}/>)}
                        </FormItem>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col className="gutter-row" {...FormItemCol.preCol}>
                        <FormItem label="开始时间" {...formItemLayout2}>
                            {getFieldDecorator('plan_begin_time', {
                                rules: [{
                                    required: true,
                                    message: '开始时间是必填项'
                                }, {
                                    validator: this.beginTimeCheck
                                }]
                            })
                            (<DatePicker disabledDate={this.disabledBeginDate} style={{width: '100%'}}
                            />)}
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" {...FormItemCol.preCol}>
                        <FormItem label="结束时间" {...formItemLayout2} >
                            {getFieldDecorator('plan_end_time', {
                                rules: [{
                                    required: true,
                                    message: '结束时间是必填项'
                                }, {
                                    validator: this.endTimeCheck
                                }]
                            })
                            (<DatePicker disabledDate={this.disabledEndDate} style={{width: '100%'}}
                            />)}
                        </FormItem>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col className="gutter-row" {...FormItemCol.preCol}>
                        <FormItem label="计划工作量"{...formItemLayout2} >
                            {getFieldDecorator('plan_workload', {
                                initialValue: this.state.planWorkload,
                                rules: [{
                                    required: true,
                                    message: '计划工作量是必填项，最多一位小数'
                                }, {
                                    validator: this.planWorkloadCheck
                                }]
                            })
                            (<Input onChange={this.handleNumChange}
                                    style={{width: '100%'}}/>)}
                        </FormItem>
                    </Col>
                    <Col style={{marginTop: '5px'}}><span>人月</span></Col>
                </Row>
                <Row gutter={16}>
                    <Col className="gutter-row" {...FormItemCol.preCol}>
                        <FormItem label="总共工作量" {...formItemLayout2} >
                            <span>{this.props.fore_workload}</span>
                        </FormItem>
                    </Col>
                    <Col className="gutter-row" {...FormItemCol.preCol}>
                        <FormItem label="待分配工作量" {...formItemLayout2} >
                            <span>{(this.props.remainWorkLoad - this.state.planWorkload).toFixed(1)}</span>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}

/**
 * 作者：邓广晖
 * 创建日期：2017-10-11
 * 功能：里程碑添加的页面
 */
class MileAdd extends React.Component {

    state = {visible: false};

    /**
     * 作者：邓广晖
     * 创建日期：2017-10-11
     * 功能：里程碑添加时，处理模态框是否显示
     */
    showModal = () => {
        this.setState({visible: true});
    };

    /**
     * 作者：邓广晖
     * 创建日期：2017-10-11
     * 功能：添加里程碑时的模态框点击确定功能
     */
    handleOk = () => {
        this.refs.mileAddModalNew.validateFields((err, values) => {
            if (err) {
                return;
            } else {
                const plan_begin_time = values.plan_begin_time.format(dateFormat);
                const plan_end_time = values.plan_end_time.format(dateFormat);
                let mileParams = {
                    mile_name: values.mile_name,
                    plan_begin_time: plan_begin_time,
                    plan_end_time: plan_end_time,
                    plan_workload: Number(values.plan_workload)
                };
                const {dispatch} = this.props;
                dispatch({
                    type: 'projectInfo/mileAddModal',
                    data: mileParams,
                });
                this.setState({visible: false});
            }
        })
    };

    /**
     * 作者：邓广晖
     * 创建日期：2017-10-11
     * 功能：添加里程碑时的模态框点击取消功能
     */
    handleCancel = () => {
        this.setState({visible: false});
    };

    render() {
        const {begin_time, end_time} = this.props;
        const MileAddModalNew = Form.create()(MileAddModal);
        return (
            <div>
                <Modal
                    title='里程碑添加'
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    width={640}
                >
                    <MileAddModalNew
                        ref="mileAddModalNew"
                        fore_workload={this.props.fore_workload}
                        remainWorkLoad={this.props.remainWorkLoad}
                        begin_time={begin_time}
                        end_time={end_time}
                        mileStoneList={this.props.mileStoneList}
                    />
                </Modal>
            </div>
        );
    }
}

export default MileAdd;
