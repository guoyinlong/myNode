/**
 *  作者: 仝飞
 *  创建日期: 2017-9-25
 *  邮箱：tongf5@chinaunicom.cn
 *  文件说明：实现编辑风险的功能
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
const Option = Select.Option;
const {TextArea} = Input;
const FormItem = Form.Item;

function isInArray(arr, value) {
    for (let i = 0; i < arr.length; i++) {
        if (value === arr[i]) {
            return true;
        }
    }
    return false;
}

/**
 *  作者: 仝飞
 *  创建日期: 2017-9-10
 *  功能：实现展示风险详情的功能
 */
class editIssueTrackDetial extends React.Component {
    constructor(props) {
        super(props)
    }

     /*state = {
         issueState: '',     //问题状态，用于控制“实际解决日期”，状态为关闭时才是必填
     };

     componentDidMount(){
         this.setState({
             issueState:this.props.list.state,     //风险状态，用于控制“实际解决日期”，状态为关闭时才是必填
         });
     }*/
    //编辑风险，调用editIssueTrack方法，跳转到风险列表页面
    editIssueTrackRes = () => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            } else {
                const plan_time = values.plan_time.format(dateFormat);
                const recog_date = values.recog_date.format(dateFormat);
                const update_id = Cookie.get('userid');
                const update_name = Cookie.get('username');
                //const update_time = moment().format('YYYY-MM-DD HH:mm:ss');
                //const staff_id = "0000000";
                const resolve_time = values.resolve_time !== undefined && values.resolve_time !== null
                    ? values.resolve_time.format(dateFormat) : '';

                let issueTrackParams = {
                    arg_id: this.props.id,
                    arg_issue: values.issueTrack,
                    arg_staff_id: "0000000",
                    arg_staff_name: values.staff_name,
                    arg_category: values.category,
                    arg_state: values.state,
                    arg_recog_date: recog_date,
                    arg_plan_time: plan_time,
                    arg_resolve_time: resolve_time,
                    arg_range_desc: values.range_desc,
                    arg_measure: values.measure,
                    arg_update_id: update_id,
                    arg_update_name: update_name,
                    arg_risk_uid:values.risk_uid
                };
                const {dispatch} = this.props;
                dispatch({
                    type: 'projIssueTrackList/editIssueTrack',
                    issueTrackParams,
                });
            }
        })
    };

    //返回项目风险列表
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

    setSelectValue = (key, obj) => {
        this.props.dispatch({
            type: 'projIssueTrackList/setSelectValue',
            obj,
            key,
        });
    };

    render() {

        const {list, proj_name, mgr_name, dept_name, relatedRiskList,} = this.props;
        //关联风险
        //处理项目类型
        let relatedRiskOptionList = [];
        if (relatedRiskList.length) {
            relatedRiskOptionList.push(<Select.Option value="" key="">{'(无)'}</Select.Option>);
            for (let i = 0; i < relatedRiskList.length; i++) {
                relatedRiskOptionList.push(
                    <Select.Option
                        value={relatedRiskList[i].risk_uid}
                        key={relatedRiskList[i].risk_uid}>
                        {relatedRiskList[i].risk}
                    </Select.Option>
                );
            }
        }

        //将关联风险存成个数组
        let relatedRiskListArray = [];
        for (let i = 0; i < relatedRiskList.length; i++) {
            relatedRiskListArray.push(relatedRiskList[i].risk_uid);
        }


        const {TextArea} = Input;
        //判断是否必填项
        const {getFieldDecorator} = this.props.form;
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

        return (
            <div className={styles.whiteBack}>
                <div><p className={styles.title}>{proj_name}</p></div>
                <div style={{textAlign: 'center'}}>
                    <Icon
                        style={{marginTop: '10px', marginBottom: '5px'}}
                        type="user"
                    />项目经理：{mgr_name}
                    <Icon
                        style={{marginLeft: '50px', marginBottom: '10px'}}
                        type="home"
                    />主责部门：{dept_name}
                </div>
                <div className={styles.bookTitle}>问题跟踪编辑</div>
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
                                        initialValue: list.issue
                                    })
                                    (<Input placeholder='最多可输入255字' maxLength={'255'}/>)}
                                </FormItem>
                            </Col>
                            <Col  {...FormItemCol.midCol} >
                                <FormItem label="关联风险" {...formItemLayoutOne}>
                                    {getFieldDecorator('risk_uid', {
                                        initialValue: isInArray(relatedRiskListArray, list.risk_uid) ? list.risk_uid : ""
                                    })
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
                                        initialValue: list.staff_name
                                    })
                                    (<Input placeholder='最多可输入20字' maxLength={'20'}/>)}
                                </FormItem>
                            </Col>
                            <Col  {...FormItemCol.latCol8}>
                                <FormItem label="问题类别" {...formItemLayoutThree}>
                                    {getFieldDecorator('category', {
                                        rules: [{
                                            required: true,
                                            message: '问题类别是必选项'
                                        }],
                                        initialValue: list.category
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
                                        initialValue: list.state
                                    })
                                    (<Select onSelect={(key) => this.setSelectValue(key, 'issueState')}>
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
                                        initialValue: list.recog_date ? moment(list.recog_date) : null
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
                                        initialValue: list.plan_time ? moment(list.plan_time) : null
                                    })
                                    (<DatePicker style={{width: '100%'}}/>)}
                                </FormItem>
                            </Col>
                            <Col  {...FormItemCol.latCol8}>
                                <FormItem label="实际解决日期" {...formItemLayoutThree}>
                                    {getFieldDecorator('resolve_time',
                                        //resolveTimeValue
                                        {
                                            rules: [{
                                                required: this.props.issueState === '2',   //状态关闭才是必填
                                                message: '状态关闭时，实际解决日期是必填项'
                                            }],
                                            initialValue: list.resolve_time ? moment(list.resolve_time) : null
                                        }
                                    )
                                    (<DatePicker style={{width: '100%'}}/>)}
                                </FormItem>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <FormItem label="影响范围描述" {...formItemLayoutTwo}  >
                                    {getFieldDecorator('range_desc', {
                                        initialValue: list.range_desc
                                    })
                                    (<TextArea rows={2} placeholder='最多可输入255字' maxLength={'255'}/>)}
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
                                        initialValue: list.measure
                                    })
                                    (
                                        <TextArea
                                            rows={2}
                                            placeholder='最多可输入1000字'
                                            maxLength={'1000'}
                                        />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <FormItem style={{textAlign: 'right'}}>
                            <Button
                                type="primary"
                                onClick={this.editIssueTrackRes}
                            >确定
                            </Button>
                            <Button
                                style={{marginLeft: 8}}
                                onClick={this.goBack}
                            >返回
                            </Button>
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

export default connect(mapStateToProps)(Form.create()(editIssueTrackDetial));

