/**
 *  作者: 仝飞
 *  创建日期: 2017-9-10
 *  邮箱：tongf5@chinaunicom.cn
 *  文件说明：实现添加问题的功能
 */
import React from 'react';
import {Row, Col, Form, Icon, Input, Button, DatePicker, message, Select, Tooltip} from 'antd';
import styles from './projIssueTrack.less'
import {routerRedux} from 'dva/router';
import {connect} from 'dva';
import Cookie from 'js-cookie';
import {propsText, rangeText} from './issueTrackConst.js';

const dateFormat = 'YYYY-MM-DD';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
const FormItem = Form.Item;

/**
 *  作者: 仝飞
 *  创建日期: 2017-9-10
 *  功能：实现添加添加问题的功能
 */
class addIssueTrackDetial extends React.Component {
    constructor(props) {
        super(props)
    }

    //转化uuid
    uuid = (len, radix) => {
        let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        let uuid = [], i;
        radix = radix || chars.length;
        if (len) {
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            let r;
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    };
//开始时间将锁定
    disabledStartDate = (value) => {
        const form = this.props.form;
        const endValue = form.getFieldValue('recog_date');
        if (!value || !endValue) {
            return false;
        }
        return value.valueOf() > endValue.valueOf();
    };

//结束时间将锁定
    disabledEndDate = (value) => {
        const form = this.props.form;
        const startValue = form.getFieldValue('plan_time');
        if (!value || !startValue) {
            return false;
        }
        return value.valueOf() <= startValue.valueOf();
    };

    //增加问题，调用addIssueTrack，然后跳转到问题列表页面
    addIssueTrackRes = () => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            } else {
                const plan_time = moment(values.plan_time._d).format(dateFormat);
                const recog_date = moment(values.recog_date._d).format(dateFormat);
                const create_id = Cookie.get('userid');
                const create_name = Cookie.get('username');
                const create_time = moment().format('YYYY-MM-DD HH:mm:ss');
                const issueTrack_uid = this.uuid(32, 62);
                const staff_id = "0000000";

                //旧系统服务留下的bug，如果为空，则置为默认时间为1999-01-01
                //根据新要求，新增时，没有实际解决日期
                /*let resolve_time = "1999-01-01";
                if(values.resolve_time === undefined || values.resolve_time === ''){
                }else {
                  resolve_time = moment(values.resolve_time._d).format(dateFormat);
                }*/

                let issueTrackParams = [];
                issueTrackParams.push({
                    "issue": values.issueTrack,
                    "risk_uid": values.risk_uid,
                    "staff_name": values.staff_name,
                    "category": values.category,
                    "state": values.state,
                    "recog_date": recog_date,
                    "plan_time": plan_time,
                    /*"resolve_time": resolve_time,*/
                    "range_desc": values.range_desc,
                    "measure": values.measure,
                    "staff_id": staff_id,
                    // "props": values.props,
                    // "range": values.range,
                    "update_id": create_id,
                    "update_name": create_name,
                    "update_time": create_time,
                    "proj_id": this.props.proj_id,
                    "issue_uid": issueTrack_uid,
                    "create_id": create_id,
                    "create_name": create_name,
                    "create_time": create_time
                });
                const {dispatch} = this.props;
                dispatch({
                    type: 'projIssueTrackList/addIssueTrack',
                    issueTrackParams,
                });
            }
        })

    };
    //返回项目问题列表
    goBack = () => {
        history.go(-1);
        /*const {dispatch} = this.props;
        dispatch(routerRedux.push({
          pathname: '/projectApp/projMonitor/projIssueTrackList',
          query:{
            proj_id:this.props.proj_id
          }
        }));*/

    };

    render() {
        const { proj_name, mgr_name, dept_name, relatedRiskList } = this.props;
        const { TextArea } = Input;
        //判断是否必填项
        const { getFieldDecorator } = this.props.form;
        const FormItemCol = {
            preCol: {span: 18},
            midCol: {span: 12},
            latCol: {span: 6},
            latCol8: {span: 8}
        };
        const formItemLayoutOne = {
            labelCol: {span: 6},
            wrapperCol: {span: 18},
        };
        const formItemLayoutTwo = {
            labelCol: {span: 3},
            wrapperCol: {span: 21},
        };
        const formItemLayoutThree = {
            labelCol: {span: 9},
            wrapperCol: {span: 15},
        };

        let relatedRiskOptionList = [];
        if (relatedRiskList.length) {
            relatedRiskOptionList.push(
                <Select.Option value="" key="">{'(无)'}</Select.Option>
            );
            for (let i = 0; i < relatedRiskList.length; i++) {
                relatedRiskOptionList.push(
                    <Select.Option
                        value={relatedRiskList[i].risk_uid}
                        key={relatedRiskList[i].risk_uid}
                    >{relatedRiskList[i].risk}
                    </Select.Option>
                );
            }
        }

        return (
            <div className={styles.whiteBack}>
                <div><p className={styles.title}>{proj_name}</p></div>
                <div style={{textAlign: 'center'}}>
                    <Icon style={{marginTop: '10px', marginBottom: '5px'}} type="user"/>项目经理：{mgr_name}
                    <Icon style={{marginLeft: '50px', marginBottom: '10px'}} type="home"/>主责部门：{dept_name}</div>
                <div className={styles.bookTitle}>问题跟踪新增</div>
                <div style={{marginRight: '50px'}}>
                    <Form>
                        <Row>
                            <Col  {...FormItemCol.midCol} >
                                <FormItem label="问题描述" {...formItemLayoutOne}>
                                    {getFieldDecorator('issueTrack', {
                                        rules: [{
                                            required: true,
                                            message: '问题描述是必填项',
                                            whitespace: true,
                                        }],
                                    })
                                    (<Input/>)}
                                </FormItem>
                            </Col>
                            <Col  {...FormItemCol.midCol} >
                                <FormItem label="关联风险" {...formItemLayoutOne}>
                                    {getFieldDecorator('risk_uid', {})
                                    (<Select>
                                        {relatedRiskOptionList}
                                    </Select>)}
                                </FormItem>
                            </Col>
                        </Row>

                        <Row>
                            <Col  {...FormItemCol.latCol8} >
                                <FormItem label="责任人" {...formItemLayoutThree}>
                                    {getFieldDecorator('staff_name', {
                                        rules: [{
                                            required: true,
                                            message: '责任人是必填项',
                                            whitespace: true,
                                        }],
                                    })
                                    (<Input/>)}
                                </FormItem>
                            </Col>
                            <Col  {...FormItemCol.latCol8}>
                                <FormItem label="问题类别" {...formItemLayoutThree}>
                                    {getFieldDecorator('category', {
                                        rules: [{
                                            required: true,
                                            message: '问题类别是必选项'
                                        }],
                                    })
                                    (<Select>
                                        <Select.Option value="1">需求</Select.Option>
                                        <Select.Option value="2">设计</Select.Option>
                                        <Select.Option value="3">编码</Select.Option>
                                        <Select.Option value="4">测试</Select.Option>
                                        <Select.Option value="5">开发环境</Select.Option>
                                        <Select.Option value="6">人员</Select.Option>
                                        <Select.Option value="7">客户</Select.Option>
                                        <Select.Option value="8">管理</Select.Option>
                                        <Select.Option value="9">质量</Select.Option>
                                        <Select.Option value="10">其他</Select.Option>
                                    </Select>)}
                                </FormItem>
                            </Col>
                            <Col  {...FormItemCol.latCol8}>
                                <FormItem label="问题状态" {...formItemLayoutThree}>
                                    {getFieldDecorator('state', {
                                        rules: [{
                                            required: true,
                                            message: '问题状态是必选项'
                                        }],
                                    })
                                    (<Select>
                                        <Select.Option value="1">跟踪</Select.Option>
                                        <Select.Option value="2">关闭</Select.Option>
                                    </Select>)}
                                </FormItem>
                            </Col>
                        </Row>

                        <Row>
                            <Col  {...FormItemCol.latCol8}>
                                <FormItem label="识别日期" {...formItemLayoutThree}>
                                    {getFieldDecorator('recog_date', {
                                        rules: [{
                                            required: true,
                                            message: '识别日期是必填项'
                                        }],
                                    })
                                    (<DatePicker style={{width: '100%'}}/>)}
                                </FormItem>
                            </Col>
                            <Col  {...FormItemCol.latCol8}>
                                <FormItem label="计划解决日期" {...formItemLayoutThree}>
                                    {getFieldDecorator('plan_time', {
                                        rules: [{
                                            required: true,
                                            message: '计划解决日期是必填项'
                                        }],
                                    })
                                    (<DatePicker style={{width: '100%'}}/>)}
                                </FormItem>
                            </Col>
                            {/*根据新要求，新增时，没有实际解决日期*/}
                            {/*<Col  {...FormItemCol.latCol8}>
                                <FormItem label="实际解决日期" {...formItemLayoutThree}>
                                    {getFieldDecorator('resolve_time', {}
                                    )
                                    (<DatePicker style={{ width: '100%'}}/>)}
                                </FormItem>
                            </Col>*/}
                        </Row>

                        <Row>
                            <Col>
                                <FormItem label="影响范围描述" {...formItemLayoutTwo}  >
                                    {getFieldDecorator('range_desc', {})
                                    (<TextArea rows={2}/>)}
                                </FormItem>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <FormItem label="应对措施" {...formItemLayoutTwo}>
                                    {getFieldDecorator('measure', {
                                        rules: [{
                                            required: true,
                                            message: '应对措施是必填项',
                                            whitespace: true,
                                        }],
                                    })
                                    (<TextArea
                                        rows={2}
                                        placeholder='最多可输入1000字'
                                        maxLength={'1000'}
                                    />)}
                                </FormItem>
                            </Col>
                        </Row>
                        <FormItem style={{textAlign: 'right'}}>
                            <Button type="primary" onClick={this.addIssueTrackRes}>确定</Button>
                            <Button style={{marginLeft: 8}} onClick={this.goBack}>返回</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        loading: state.loading.models.projIssueTrackList,
        ...state.projIssueTrackList
    };
}

export default connect(mapStateToProps)(Form.create()(addIssueTrackDetial));

