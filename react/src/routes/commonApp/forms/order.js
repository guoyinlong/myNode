/**
 * 作者：王超
 * 创建日期：2017-10-19
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：工单页面生成
 */
import { connect } from 'dva';
import { Form, Input, Button, Checkbox, DatePicker, Row,Col} from 'antd';
import Cookie from 'js-cookie';
import moment from 'moment';
import styles from '../pageContainer.css';

const FormItem = Form.Item;
const { TextArea } = Input;

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
    colon: false
};

const formItemLayoutN = {
    labelCol: { span: 6,offset: 6 },
    wrapperCol: { span: 6},
    colon: false
};

const formItemLayoutP = {
    labelCol: { span: 6},
    wrapperCol: { span: 6},
    colon: false
};

const formTailLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12, offset: 6 },
    colon: false
};
const dateFormat = 'YYYY-MM-DD';
class DynamicRule extends React.Component {

	// 设置不可选开始时间
	disabledStartDate = (startValue) => {
	    if (!startValue || !this.props.endValue) {
	      return false;
	    }
	    return startValue.valueOf() >= this.props.endValue.valueOf();
    }

	// 设置不可选结束时间
	disabledEndDate = (endValue) => {
	    if (!endValue || !this.props.startValue) {
	      return false;
	    }
	    return endValue.valueOf() <= this.props.startValue.valueOf();
    }

    // 更新开始时间
  	onStartChange = (value) => {
  		const {dispatch} =this.props;
	    dispatch({
	        type:'order/changeDateVal',
	        startValue:value,
	        endValue:this.props.endValue
	   })
  	}

    // 更新结束时间
  	onEndChange = (value) => {
    	const {dispatch} =this.props;
	    dispatch({
	        type:'order/changeDateVal',
	        startValue:this.props.startValue,
	        endValue:value
	   })
  	}

	// 重置
    handleReset = (e)=> {
        this.props.form.resetFields();
        this.props.form.setFieldsValue({'changeContent':''});
        this.props.form.setFieldsValue({'changeInfluence':''});
    }

    // 提交
    handleSubmit = (e)=> {
        e.preventDefault();
        this.props.form.validateFields(
            (err) => {
                if (!err) {
                    var formData = this.props.form.getFieldsValue();
                    var para = "?projectName="+formData.projectName+"&userName="+formData.userName+"&userPhone="+formData.userPhone+"&date="+formData.date.format("YYYY-MM-DD")+"&systemName="+formData.systemName+"&planDate="+formData.planDate.format("YYYY-MM-DD")+"&changeContent="+formData.changeContent+"&changeInfluence="+formData.changeInfluence
        			window.location.href = '/microservice/allportal/ExportVPNWord/ExportWord'+para;
                }
            }
        );
    }

    render() {

        const { getFieldDecorator } = this.props.form;
        const config = {
            rules: [{ type: 'object', required: true, message: '请选择时间!'}],
            initialValue: moment(new Date(), dateFormat)
        };

        return (
        	<div id="vpnForm" className={styles['pageContainer']}>
	        	{/*<Breadcrumb separator=">">
		          <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
		          <Breadcrumb.Item>VPN申请单</Breadcrumb.Item>
		       </Breadcrumb>
		        <div style={{ marginBottom: 16 }}></div>*/}

	            <Form onSubmit={this.handleSubmit} className="login-form">
	                <FormItem {...formItemLayout} label="团队名称:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;">
	                    {getFieldDecorator('projectName', {
	                        rules: [{
	                            required: true,
	                            message: '请输入团队名称',
	                            whitespace: true
	                        }],
	                    })(
	                        <Input placeholder="请输入团队名称" />
	                    )}
	                </FormItem>
	                <Row>
	                	<Col span={12}>
			                <FormItem {...formItemLayoutN} label="申请人:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;">
			                    {getFieldDecorator('userName', {
			                        rules: [{
			                            required: true,
			                            message: '请输入申请人姓名',
			                            whitespace: true
			                        }],
			                        initialValue: Cookie('username') || ''

			                    })(
			                        <Input placeholder="请输入申请人姓名" />
			                    )}
			                </FormItem>
			            </Col>
			            <Col span={12}>
			                <FormItem {...formItemLayoutP} label="联系人电话:&nbsp;&nbsp;&nbsp;&nbsp;">
			                    {getFieldDecorator('userPhone', {
			                        rules: [{
			                            pattern:/^1[34578]\d{9}$/,
			                            required: true,
			                            message: '请输入正确的手机号码',
			                        }],
			                        initialValue: Cookie('tel') || ''

			                    })(
			                        <Input placeholder="请输入手机号码" />
			                    )}
			                </FormItem>
		                </Col>
	                </Row>


					<Row>
						<Col span={12}>
			                <FormItem {...formItemLayoutN} label="申请日期&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;">
			                	{getFieldDecorator('date', config)(
			                        <DatePicker
			                            disabledDate={this.disabledStartDate}
				                        onChange={this.onStartChange}
	          							onOpenChange={this.handleStartOpenChange}
			                        />
			                    )}
			                </FormItem>
		                </Col>
						<Col span={12}>
			                <FormItem {...formItemLayoutP} label="计划完成日期:">
			                    {getFieldDecorator('planDate', {
			                    	rules: config.rules
			                    })(
			                        <DatePicker
			                            disabledDate={this.disabledEndDate}
			                            onChange={this.onEndChange}
			                            onOpenChange={this.handleEndOpenChange}
			                        />
			                    )}
			                </FormItem>
		                </Col>
	                </Row>

	                <FormItem {...formItemLayout} label="变更系统名称:">
	                    {getFieldDecorator('systemName', {
	                        rules: [{
	                            required: true,
	                            message: '请输入变更系统名称',
	                            whitespace: true
	                        }],
	                    })(
	                        <Input placeholder="请输入变更系统名称" />
	                    )}
	                </FormItem>

	                <FormItem {...formItemLayout} label="变更内容:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;">
	                    {getFieldDecorator('changeContent', {
	                        rules: [{
	                            required: true,
	                            message: '请填写变更内容',
	                            whitespace: true
	                        }],
	                    })(
	                        <TextArea rows={4} placeholder="请输入变更内容" />
	                    )}
	                </FormItem>

	                <FormItem {...formItemLayout} label="变更影响:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;">
	                    {getFieldDecorator('changeInfluence', {
	                        rules: [{
	                            required: true,
	                            message: '请填写变更影响',
	                            whitespace: true
	                        }],
	                    })(
	                        <TextArea rows={4} placeholder="请输入变更影响" />
	                    )}
	                </FormItem>

	                <FormItem {...formTailLayout}>
	                    <Button type="primary" htmlType="submit">下载</Button>
	                    &nbsp;&nbsp;&nbsp;
	                    <Button type="ghost" onClick={this.handleReset}>重置</Button>
	                </FormItem>
	            </Form>
            </div>
        );
    }
}

function mapStateToProps (state) {
	const {startValue,endValue} = state.order;
	return {
	    startValue,
	    endValue
	};
}

const WrappedDynamicRule = Form.create()(DynamicRule);
export default connect(mapStateToProps)(WrappedDynamicRule);
