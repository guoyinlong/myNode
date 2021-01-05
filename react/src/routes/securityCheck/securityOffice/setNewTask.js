/**
 * 作者：窦阳春
 * 日期：2019-4-23
 * 邮箱：douyc@itnova.com.cn
 * 功能：新建任务页面
 */ 
import React  from 'react';
import {connect } from 'dva';
import Cookie from 'js-cookie';
import {Button,DatePicker,TreeSelect, Radio, Modal, Input, Select, Spin } from 'antd'
import styles from '../../securityCheck/securityCheck.less'
import moment from 'moment';
import FileUpload from './fileUpload.js';        //上传功能组件
const dateFormat = 'YYYY-MM-DD';
const {RangePicker} = DatePicker;
const {Option} = Select;    
const RadioGroup = Radio.Group;                                                                                                                     
class setNewTask extends React.PureComponent {
	constructor(props) {super(props);
	}
	state = {
	}
	//得到时间保存时间
  changeDate = (date,dateString) => {
    const startTime = dateString[0];
		const endTime = dateString[1];
		this.props.dispatch({
			type: 'setNewTask/changeDate',
			startTime: startTime,
			endTime: endTime
		})
	};
	disabledEndDate = (current) => { 
		var dateTime=new Date();
		dateTime=dateTime.setDate(dateTime.getDate()-1);
		dateTime=new Date(dateTime);
		return current.valueOf() < dateTime;
	}
	returnModel =(value,value2)=>{
		let saveData = {
			startTime: this.props.startTime,
			endTime: this.props.endTime,
		}
		if(value2!==undefined){
			this.props.dispatch({
				type:'setNewTask/'+value,
				record : value2,
				saveData,
				flagTap: '新建'
			})
		}else{
			this.props.dispatch({
				type:'setNewTask/'+value,
			})
		}
	};
	onChange = (e) => {
		this.props.dispatch({
			type: 'setNewTask/checkValueChange',
			value: e.target.value
		})
	}
  //上传需要
  saveData = (values) => {
    this.setState({
      showData:values,
      importDataLength:values.length,
    })
  };
	//----------------------页面渲染----------------------//
	render() {
		const {taskTypes, checkObjectAndContentList, checkContentList, roleType, roleList, flag} = this.props;
		const typeListOption = taskTypes.length === 0 ? '' //检查方式
    : taskTypes.map((item) => (
        <Option key={item.id} value={item.id}>{item.stateName}</Option>
		))
		let objectAndContentList = checkObjectAndContentList.length === 0 ? [] : checkObjectAndContentList.map((item) => { //检查对象
			return <Option key={item.content} value={item.content}>{item.content}</Option>
		})
		checkContentList.length == 0 ? [] : checkContentList.map((item, index) => { //检查内容
			item.key = index + '';
			item.value = item.label
			item.children.map((v, i) => {
				v.key = index + '-' + i;
				v.value = v.label
			})
		});
		let roleListData = roleList.length == 0 ? [] : roleList.map((item) => { // 通知对象
			return <Option key={item.roleId} value={item.roleId}>{item.roleName}</Option>
		})
		return(
			<Spin tip="加载中..." spinning={this.props.loading}>
					<div className={styles.pageContainer}>
						<h2 style = {{textAlign:'center',marginBottom:30}}>{flag == 'newtask' ? '新建任务' : '修改任务'}</h2>
            <Button style = {{float: 'right'}} size="default" type="primary" >
							<a href="javascript:history.back(-1)">返回</a>
						</Button>
            <div className={styles.lineOut}>
                  <span className={styles.lineKey}>
                     <b className={styles.lineStar}>*</b>发布人
                  </span>
            <span className={styles.lineColon}>：</span>
						<span>
							{flag == 'modify' ? this.props.createUserName : Cookie.get("username")}
							</span>
          	</div>
						<div className={styles.lineOut}>
                  <span className={styles.lineKey}>
                     <b className={styles.lineStar}>*</b>
                     检查时间
                  </span>
            <span className={styles.lineColon}>：</span>
						<span>
							<RangePicker  onChange = {this.changeDate}  style = {{width:200, marginRight:10}}
								disabledDate={this.disabledEndDate}
								value={   
								this.props.startTime=== ''
								|| this.props.endTime===''
								? null : [moment(this.props.startTime, dateFormat), moment(this.props.endTime, dateFormat)]}
								format={dateFormat}/>
						</span>
          	</div>
						<div className={styles.lineOut}>
                  <span className={styles.lineKey}>
                     <b className={styles.lineStar}>*</b>
                     检查主题
                  </span>
            <span className={styles.lineColon}>：</span>
						<Input style={{width:'570px'}} value={this.props.theme} onChange={(e)=>this.returnModel('theme',e)}/>
          	</div>
						<div className={styles.lineOut}>
                  <span className={styles.lineKey}>
                     <b className={styles.lineStar}>*</b>
                     检查方式
                  </span>
            <span className={styles.lineColon}>：</span>
						<Select value={this.props.typeChoose} style={{ width: "200px" }} 
						onChange={(value)=>this.returnModel('typeChoose',value)}>
            {typeListOption}
						</Select>
          	</div>
						<div className={styles.lineOut}>
							<span className={styles.lineKey}>
									<b className={styles.lineStar}>*</b>
									检查对象
							</span>
							<span className={styles.lineColon}>：</span>
							<Select mode="multiple"
								value={this.props.checkObject}
								onChange={(e)=>this.returnModel('onObjectChange',e)}
								style={{ minWidth: "200px", maxWidth: 940 }}
								// onFocus={this.selectType}
								placeholder = "请选择"
								>
								{objectAndContentList}
							</Select>
          	</div>
						<div className={styles.lineOut}>
                  <span className={styles.lineKey}>
                     检查内容
                  </span>
            <span className={styles.lineColon}>：</span>  
						<TreeSelect
							showSearch
							style={{ width: 570 }}
							value={this.props.checkContent}
							dropdownStyle={{ maxHeight: 500, minHeight: 200, overflow: 'auto' }}
							placeholder="请选择"
							treeData={checkContentList}
							allowClear
							multiple
							treeDefaultExpandAll
							onChange={(value) => this.returnModel("checkContent", value)}
						>
						</TreeSelect>
          	</div>
						<div className={styles.lineOut}>
                  <span className={styles.lineKey}>
                     检查要求
                  </span>
            <span className={styles.lineColon}>：</span>
						<Input style={{width:'570px'}} value={this.props.checkRequire} onChange={(e)=>this.returnModel('checkRequire',e)}/>
          	</div>
						<div className={styles.lineOut}>
							<span className={styles.lineKey}>
									检查规范
							</span>
							<span className={styles.lineColon}>：</span>
							<div style = {{width: 570,marginLeft: 190, marginTop: -18}}>
								<FileUpload dispatch={this.props.dispatch} pageName = 'setNewTask' fileList = {[]} len = {this.props.examineImgId && this.props.examineImgId.length}/>
							</div>
							<Modal visible={this.props.previewVisible} footer={null} onCancel={()=>this.returnModel('handleCancel')}>
                  <img alt="example" style={{ width: '100%' }} src={this.props.previewImage} />
              </Modal>
          	</div>
						{
							roleType == '0' ?  
							<div className={styles.lineOut}>
								<span className={styles.lineKey}>
									<b className={styles.lineStar}>*</b>
									是否涉及分院
								</span>
								<span className={styles.lineColon}>：</span>
								<RadioGroup onChange={this.onChange} value={this.props.checkValue}>
									<Radio value={1}>是</Radio>
									<Radio value={0}>否</Radio>
								</RadioGroup>
						</div> : ''
						}
						
						<div className={styles.lineOut}>
                  <span className={styles.lineKey}>
                     <b className={styles.lineStar}>*</b>
                     通知对象
                  </span>
            <span className={styles.lineColon}>：</span>
							<Select mode="multiple"
								value={this.props.roleObject}
								onChange={(e)=>this.returnModel('roleListData',e)}
								style={{ minWidth: "200px", maxWidth: 570 }}
								placeholder = "请选择"
								>
								{roleListData}
							</Select>
          	</div>
						<div className = {styles.buttonOut}>
							<Button type="primary"  
								onClick={()=>this.returnModel('saveSubmit','保存')}>保存</Button>
							<Button type="primary" style = {{marginLeft: 5}}
								onClick={()=>this.returnModel('saveSubmit','提交')}>提交</Button>
						</div>
          </div>
			</Spin>
		)
					
	}
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.setNewTask, 
    ...state.setNewTask
  };
}

export default connect(mapStateToProps)(setNewTask);