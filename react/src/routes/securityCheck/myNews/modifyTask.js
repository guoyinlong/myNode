/**
 * 作者：郭银龙 
 * 日期：2020-4-21
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：派发检查任务
 */
import React  from 'react';
import {connect } from 'dva';
import Cookie from 'js-cookie';
import { Table, Button,DatePicker,Tabs,TreeSelect,Upload, Icon, Radio,Popconfirm, message, Modal, Input, Select, Pagination, Spin, Row, Col } from 'antd'
import styles from '../../securityCheck/securityCheck.less'
import { routerRedux } from 'dva/router';
import moment from 'moment';
import FileUpload from './setFileUoload.js';        //上传功能组件
const dateFormat = 'YYYY-MM-DD';
// const TabPane = Tabs.TabPane;
const {RangePicker} = DatePicker;
const TreeNode = TreeSelect.TreeNode;
const Search = Input.Search; 
const {Option} = Select;    
const RadioGroup = Radio.Group; 
let data = {	RowCount: 10 }                                                                                                                                         
class setNewTask2 extends React.PureComponent {
	constructor(props) {super(props);
//   console.log(this.props.location.query, 'this.props.location.query',1);
	}
	state = {
		beginTime: this.props.startTime, 
		endTime: this.props.endTime,
		value: this.props.checkValue,
		inforid:""
	}
	//得到时间保存时间
	changeDate = (date,dateString) => {
		const startTime = dateString[0];
		const endTime = dateString[1];
		// console.log(startTime,endTime)
			this.props.dispatch({
				type: 'setNewTask2/changeDate',
				startTime: startTime, 
				endTime: endTime
			})
	}; 
	// range = (start, end) => {
	// 	const result = [];
	// 	for (let i = start; i <= end; i++) {
	// 	  result.push(i);
	// 	}
	// 	console.log(result);
	// 	return result;
	//   };
	  disabledDate = (current) => {
		// 不能选今天和今天之前的日期
		return  current <= moment().subtract(1, 'days');
	  };
	//   disabledDateTime = () => {
	// 	let hours = moment().hours();//0~23
	// 	let minutes = moment().minutes();//0~59
	// 	//当日只能选择当前时间之后的时间点
	// 	if (this.state.upgradeTime.date() === moment().date()) {
	// 	  return {
	// 		disabledHours: () => this.range(0, hours),
	// 		disabledMinutes: () => this.range(0, minutes),
	// 	  };
	// 	}
	//   };
returnModel =(value,value2)=>{
	// const{argInfoId}=this.props.location.query
	
	let argInfoId=this.props.location.query.arg_state
	let taskparentId=this.props.taskparentId
	let saveData = {
		startTime: this.props.startTime,
		endTime: this.props.endTime,
		otherOu: this.props.value
	}
	// console.log(value,value2,"qeqe",saveData)
	saveData['otherOu'] = (this.props.roleType == '1' || this.props.roleType == '2' ) ? 0 : 1 //除安委办之外涉及分院字段都为0
	if(value2!==undefined){
		this.props.dispatch({
			type:'setNewTask2/'+value,
			record : value2,
			saveData,
			argInfoId,
			taskparentId
		})
		
	}else{
		this.props.dispatch({
			type:'setNewTask2/'+value,
			argInfoId,
			taskparentId
		})
		
	}
};
// onChange = (e) => {
// 	this.setState({
// 		value: e.target.value,
// 	});
// }
onChange = (e) => {
	const checkValue = e.target.value; 
	// console.log(checkValue)
		this.props.dispatch({
			type: 'setNewTask2/changecheckValue',
			checkValue: checkValue,
			
		})
};
  //上传需要
  saveData = (values) => {
    this.setState({
      showData:values,
      importDataLength:values.length,
	})
  };
  componentDidMount() {
	const{arg_state}=this.props.location.query
	this.setState({
		inforid:arg_state
	})
//    console.log(this.state.inforid)

  }
  goBackPage = () => {
	this.props.dispatch( routerRedux.push({
	  pathname:'/adminApp/securityCheck/myNews',
	  query: {
		ontabs:JSON.parse(JSON.stringify(this.props.infoState))
	  }
	}));
	 
  }
	//----------------------页面渲染----------------------//
	render() {
		const {taskType, checkObjectAndContentList, checkContentList, roleType, roleList, flag, examineImgId} = this.props;
		const typeListOption = taskType.length === 0 ? '' //检查方式
    : taskType.map((item) => (
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
		// roleList.length && console.log(roleListData, 'roleListroleList',2)
		return(
			// <Spin tip="加载中..." spinning={this.props.loading}>
					<div className={styles.pageContainer}>
						<h2 style = {{textAlign:'center',marginBottom:30}}>派发检查任务</h2>
						<Button style = {{float: 'right',marginRight:"15%"}} size="default" type="primary"  onClick={this.goBackPage}>
									<a >返回</a>
							</Button>
            <div className={styles.lineOut}>
                  <span className={styles.lineKey}>
                     <b className={styles.lineStar}>*</b>发布人
                  </span>
            <span className={styles.lineColon}>：</span>
						<span>
							{this.props.createUserName }
							
							</span>
          	</div>
			  <div className={styles.lineOut}>
                  <span className={styles.lineKey}>
                     <b className={styles.lineStar}>*</b>创建时间
                  </span>
            <span className={styles.lineColon}>：</span>
						<span>
							{this.props.createTime }
							
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
									value={   
									this.props.startTime=== ''
									|| this.props.endTime===''
									?"": [moment(this.props.startTime, dateFormat), moment(this.props.endTime, dateFormat)]}
									format={dateFormat}
									disabledDate={this.disabledDate}
            						// disabledTime={this.disabledDateTime}
									/>
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
						<Select 
							defaultValue=""
							placeholder="请重新选择检查方式"
							value={this.props.typeChoose} 
							style={{ width: "200px" }} 
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
								<FileUpload dispatch={this.props.dispatch}  fileList ={examineImgId} loading = {this.props.loading} pageName='setNewTask2'
								len = {this.props.examineImgId && this.props.examineImgId.length} />
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
				{this.props.infoState==0?   
				<div>

					
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
						:""}
          </div>
			// </Spin>
		)
					
	}
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.setNewTask2, 
    ...state.setNewTask2
  };
}

export default connect(mapStateToProps)(setNewTask2);
