/**
 * 作者：王超
 * 创建日期：2017-10-19
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：请假单页面生成
 */
import { connect } from 'dva';
import { Form, Input, Button, Radio, DatePicker,Row,Col} from 'antd';
import Cookie from 'js-cookie';
import moment from 'moment';
import styles from '../pageContainer.css';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { TextArea } = Input;

const formItemLayoutD = {
    labelCol: { span: 6 },
    wrapperCol: { span: 10 },
    colon: false
};
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 15 },
    colon: false
};
const formItemLayoutN = {
    labelCol: { span: 8,offset: 10 },
    wrapperCol: { span: 6},
    colon: false
};

const formItemLayoutT = {
    labelCol: { span: 10,offset: 2},
    wrapperCol: { span: 12},
    colon: false
};
const formTailLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12, offset: 6 }
};
const dateFormat = 'YYYY-MM-DD';
class DynamicRule extends React.Component {
	
	// 设置开始时间的不可选日期
	disabledStartDate = (startValue) => {
	    if (!startValue || !this.props.endValue) {
	      return false;
	    }
	    return startValue.valueOf() >= this.props.endValue.valueOf();
    }
	
	// 设置结束时间的不可选日期
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
	        type:'leave/selectedTpye',
	        startValue:value,
	        endValue:this.props.endValue
	   })
  	}
    
    // 更新结束时间
  	onEndChange = (value) => {
    	const {dispatch} =this.props;
	    dispatch({
	        type:'leave/selectedTpye',
	        startValue:this.props.startValue,
	        endValue:value
	   })
  	}
	
	// 更新员工类型
    onChangeLabel = (e) => {
	    const {dispatch}=this.props;
	    dispatch({
	        type:'leave/selectedTpye',
	        value:e.target.value,
	        startValue:this.props.startValue,
	        endValue:this.props.endValue
	   })
    }
    
    // 重置
    handleReset = (e)=> {
        this.props.form.resetFields();
        this.props.form.setFieldsValue({'changeContent':''});
    }
    
    // 提交
    handleSubmit = (e)=> {
        e.preventDefault();
        this.props.form.validateFields(
            (err) => {
                if (!err) {
                	var formData = this.props.form.getFieldsValue();
                    var para = "?type="+formData.type+"&department="+formData.department+"&name="+formData.name+"&holiday="+formData.holiday+"&startdate="+formData.startdate.format("YYYY-MM-DD")+"&enddate="+formData.enddate.format("YYYY-MM-DD")+"&reason="+formData.reason;
        			window.location.href = '/microservice/allportal/ExportLeaveForVacationWord/ExportLeaveForVacationWord'+para;
                }
            }
        );
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const config = {
            rules: [{ type: 'object', required: true, message: '请选择时间!' }],
            initialValue: moment(new Date(), dateFormat)
        };

        return (
        	<div className={styles['pageContainer']}>    
	            <Form onSubmit={this.handleSubmit} className="login-form">
	            	<FormItem {...formItemLayout} label="职务:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;">
	                    {getFieldDecorator('type', {
	                    	rules: [{
	                            required: true,
	                            message: '请选择职务',
	                        }],
	                    	initialValue: 2
	                    })(
	                        <RadioGroup onChange={this.onChangeLabel}>
						        <Radio value={2}>员工</Radio>
						        <Radio value={0}>中层正</Radio>
						        <Radio value={1}>中层副</Radio>
						    </RadioGroup>
	                    )}
	                </FormItem>
	                
	                <FormItem {...formItemLayoutD} label="部门:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;">
	                    {getFieldDecorator('department', {
	                        rules: [{
	                            required: true,
	                            message: '请输入部门',
	                            whitespace: true
	                        }],
	                        initialValue: decodeURI(Cookie('deptname')) || ''
	                    })(
	                        <Input placeholder="请输入部门" />
	                    )}
	                </FormItem>
	                
	                <FormItem {...formItemLayout} label="假别:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;">
	                    {getFieldDecorator('holiday', {
	                    	rules: [{
	                            required: true,
	                            message: '请选择假别',
	                        }],
	                    	initialValue: 1
	                    })(
	                        <RadioGroup>
						        <Radio value={1}>事假</Radio>
						        <Radio value={2}>病假</Radio>
						        <Radio value={3}>产假</Radio>
						        <Radio value={4}>探亲假</Radio>
						        <Radio value={5}>婚假</Radio>
						        <Radio value={6}>丧假</Radio>
						        <Radio value={7}>年休假</Radio>
						        <Radio value={8}>其他</Radio>
						    </RadioGroup>
	                    )}
	                </FormItem>
	                
	                <Row>
	                	<Col span={8}>
			                <FormItem {...formItemLayoutN} label="申请人:&nbsp;&nbsp;&nbsp;&nbsp;">
			                    {getFieldDecorator('name', {
			                        rules: [{
			                            required: true,
			                            message: '请输入申请人姓名',
			                            whitespace: true
			                        }],
			                        initialValue: decodeURI(Cookie('username')) || ''
			                    })(
			                        <Input placeholder="请输入申请人姓名" />
			                    )}
			                </FormItem>
			            </Col>
			            <Col span={6}>
				            <FormItem {...formItemLayoutT} label="开始日期">
			                	{getFieldDecorator('startdate', {
			                    	rules: config.rules
			                    })(
			                        <DatePicker
			                            disabledDate={this.disabledStartDate}
			                            onChange={this.onStartChange}
			                        />
			                    )}
			                </FormItem>
			            </Col>
						<Col span={6}>
			                <FormItem {...formItemLayoutT} label="结束日期">
			                    {getFieldDecorator('enddate', {
			                    	rules: config.rules
			                    })(
			                        <DatePicker
			                            disabledDate={this.disabledEndDate}
			                            onChange={this.onEndChange}
			                        />
			                    )}
			                </FormItem>
			            </Col>
			        </Row>    
	                
	                {/*<FormItem {...formItemLayout} label="销假日期">
	                    {getFieldDecorator('canceldate', {
	                    	rules: config.rules
	                    })(
	                        <DatePicker/>
	                    )}
	                </FormItem>*/}
	
	                <FormItem {...formItemLayout} label="请假事由:">
	                    {getFieldDecorator('reason', {
	                        rules: [{
	                            required: true,
	                            message: '请填写请假事由',
	                            whitespace: true
	                        }],
	                    })(
	                        <TextArea rows={4} placeholder="请填写请假事由" />
	                    )}
	                </FormItem>
	
	                <FormItem {...formTailLayout}>
	                    
	                    <Button type="primary" htmlType="submit">
	                        下载
	                    </Button>
	                    &nbsp;&nbsp;&nbsp;
	                    <Button type="ghost" onClick={this.handleReset}>重置</Button>
	                </FormItem>
	            </Form>
            </div>
        );
    }
}

function mapStateToProps (state) {
	const {employeeType,startValue,endValue} = state.leave;
	return {
	    employeeType,
	    startValue,
	    endValue
	};
}

const Leave = Form.create()(DynamicRule);
export default connect(mapStateToProps)(Leave);