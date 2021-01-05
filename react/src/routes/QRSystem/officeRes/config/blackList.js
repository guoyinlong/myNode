/**
 * 作者： 彭东洋
 * 创建日期： 2019-09-06
 * 邮箱: pengdy@itnova.com.cn
 * 功能： 黑名单
 */

import React from 'react';
import styles from './black.less';
import { Button, Modal, Select, Input, Table, message, Icon, Form, pagination, Row, Col} from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { getUuid } from './../../../../components/commonApp/commonAppConst.js'
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;
class Blacklist extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			uuid:"",
			visible: false,
			selectDepartment: [],
			administrators: [],
			searchText: '',
			filtered: false,
			dataIndex: '',
			searchValue: '',
			selectedRows: [],
			regulation: [],
			deptVisible: false,
			nameVisble: false,
			natureVisble: false,
			idVisible: false,
			dangerColor: "",
			deptDangerColor: "transparent",
			adminDangerColor: "transparent",
			deptName: "",
			userName: "",
			userType: "",
			userId: "",
			optionValue:"" ,//属地管理员值
			user_id:"",//用户id
			user_name:"",//用户姓名
			dept_id:"",//部门id
			dept_name:"",//部门名称
			reason:""//加入黑名单原因
		};
  	};
  	//批量删除
  	showConfirm = (record) => {
		const { dispatch } = this.props;
		confirm({
			title: '是否移出黑名单？',
			okText: '移除',
			cancelText: '取消',
			onOk: () => {
			const arg_ids = record.id;
				dispatch({
					type: 'officeConfig/modifyBlacklist',
					data: {
						arg_ids
					}
				});
			},
			onCancel() {return null;},
		});
  	};
  	//更改页码
  	changePage = (page) => {
		const {  deptName, userName, userType, userId} = this.state;
			const data = {
			arg_dept_name: deptName,
			arg_user_name: userName,
			arg_user_type: userType,
			arg_user_id: userId,
			page:page
		};
		this.props.dispatch({
			type:"officeConfig/changePage",
			data
		});
  	};
  	//批量移除
  	deleteAll = () => {
		const {dispatch} = this.props;
		const {selectedRows} =this.state;
		const deletId = [];
		confirm({
		title: '是否确定移除选中的内容',
		okText: '确认',
		cancelText: '取消',
		onOk: () => {
			for(let i = 0; i < selectedRows.length; i++){
				deletId.push(selectedRows[i].id)
			};
			const arg_ids = deletId.join(",");
			dispatch({
				type: 'officeConfig/modifyBlacklist',
				data: {
					arg_ids
				}
			});
		},
		onCancel() {return null; },
		});
  	};
  	//当输入内容改变时获取输入的内容
  	onInputChange = (e,index) => {
		if(index == "dept_name") {
			this.setState({deptName: e.target.value})
		} else if (index == "user_name") {
			this.setState({userName: e.target.value})
		} else if (index == "user_type") {
			this.setState({ userType: e.target.value});
		} else if (index == "user_id") {
			this.setState({userId: e.target.value})
		}
		this.setState({searchText: e.target.value})
  	};
  	//当点击搜索时修改显隐状态
  	onSearch = (dataIndex) => { 
		const { searchText, deptName, userName, userType, userId} = this.state;
		const { dispatch } = this.props;
		this.setState({
			deptVisible: false,
			nameVisble: false,
			natureVisble: false,
			idVisible: false,
			dataIndex,
			searchValue: searchText,
		});
		const data = {
			arg_dept_name: deptName,
			arg_user_name: userName,
			arg_user_type: userType,
			arg_user_id: userId,
		};
		dispatch({
			type: "officeConfig/queryBlackList",
			data,
		});
  	};
	//新增按钮调用服务查询部门列表
	showModal = () => {
		const {dispatch} = this.props;
		dispatch({
			type: 'officeConfig/departmentlistquery'
		});
		this.setState({
			visible: true,
			uuid: getUuid(20,60),
			optionValue:"",
			dept_name:""
		});
	};
	//当选择部门时触发服务
	optionSelected = (value) => {
		this.setState({
			deptDangerColor: "transparent",
			optionValue:"",
			dept_id:value.split("#")[0],
			dept_name:value.split("#")[1]
		});
		const {dispatch} = this.props;
		const arg_dept_id = value.split("#")[0];
		dispatch({
			type: 'officeConfig/queryadminformation',
			data: {
				arg_dept_id
			}
		});
	};
	//选择属地管理员
	adminOption = (value) => {
		this.setState({
			adminDangerColor: "transparent",
			optionValue:value.split("#")[1],
			user_id:value.split("#")[0],
			user_name:value.split("#")[1]
		});
	};
	//加入黑名单原因
	valueChange = (e) => {
		this.setState({
			reason:e.target.value
		});
		if(e.target.value) {
			this.setState ({
				dangerColor:""
			})
		};
	}; 
	//当显隐状态改变时 
	explicitimplicitchange = (name,visible) => {
		const {deptName, userName, userType, userId} = this.state;
		if(name == "dept_name") {
		this.setState({
			deptVisible: visible,
			searchText: deptName
		},() => this.searchInput.focus())
		} else if(name == "user_name") {
		this.setState({
			nameVisble: visible,
			searchText: userName
		}, () => this.searchInput.focus())
		} else if(name == "user_type") {
		this.setState({
			natureVisble: visible,
			searchText: userType
		}, () => this.searchInput.focus())
		} else if(name == "user_id") {
		this.setState({
			idVisible: visible,
			searchText: userId
		}, () => this.searchInput.focus())
		};
	};
  
	filterDropdown = (dataIndex,title) =>{
		return (
		<div className="custom-filter-dropdown">
			<div className={styles.search}>
			<Input
				className={styles.searchInput}
				ref={ele => this.searchInput = ele}
				placeholder={title}
				value={this.state.searchText}
				onChange={(e) => this.onInputChange(e,dataIndex)}
				onPressEnter={() => this.onSearch(dataIndex)}
			/>
			<Button type="primary" onClick={() => this.onSearch(dataIndex)}>搜索</Button>
			</div>
		</div>
		) 
	};

	//调用移除黑名单的服务
	// showConfirm = (record) => {
	// 	const { dispatch } = this.props;
	// 	confirm({
	// 		title: '是否移出黑名单？',
	// 		okText: '移除',
	// 		cancelText: '取消',
	// 		onOk: () => {
	// 			const arg_ids = record.id;
	// 			dispatch({
	// 				type: 'officeConfig/modifyBlacklist',
	// 				data: {
	// 					arg_ids
	// 				}
	// 			});
	// 			return new Promise((resolve, reject) => {
	// 				setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
	// 			}).catch(() => console.log('Oops errors!'));
	// 		},
	// 		onCancel() { return null;},
	// 	});
	// };

	//清空筛选条件
	empty = () => {
		const { dispatch } = this.props;
		this.setState({
			deptName: '',
			userName: '',
			userType: '',
			userId: '',
			searchText:''
		});
		const data = {
			arg_dept_name: '',
			arg_user_name: '',
			arg_user_type: '',
			arg_user_id: '',
		};
		dispatch({
			type: "officeConfig/queryBlackList",
			data,
		});
	};
	//调用新增黑名单的服务
	handleOk = e => {
		const {dispatch} = this.props;
		const { user_id,dept_name,dept_id,reason,optionValue} = this.state;
		// 已经选择过部门和管理员
		if(optionValue != "" && dept_name != "") {
			const regblank = new RegExp(/^\s+$/);
		if(reason == undefined || regblank.test(reason) || reason == "") {
			message.error("请输入加入黑名单原因");
			this.setState({
			dangerColor: "red"
			});
			return;
		} else {
			this.setState({
			dangerColor: "",
			deptDangerColor: "transparent",
			adminDangerColor: "transparent",
			})
		};
		const data = {
			arg_user_id: user_id,
			arg_user_name: optionValue,
			arg_dept_name: dept_name,
			arg_user_type: "部门管理员",
			arg_dept_id: dept_id,
			arg_reason: reason
		};
		dispatch({
			type: 'officeConfig/addBlackList',
			data
		});
		} else if(dept_name == "") {
			this.setState({
				deptDangerColor: "red"
			})
			message.error("请选择部门");
			return;
		} else if (optionValue == "") {
			this.setState({
				adminDangerColor: "red"
			});
			message.error("请选择管理员");
			return;
		};
		this.setState({
			visible: false,
		});
	};
	//取消
	handleCancel = e => { 
		this.setState({
		visible: false,
		});
	};
	//返回的跳转
	goBack = () =>{
		const {dispatch} = this.props;
		dispatch(routerRedux.push({
		pathname:'/adminApp/compRes/officeResMain/officeConfig',
		}));

	};
	render() {
		const {blackList, deptList, adminName} = this.props;
		const {deptVisible, nameVisble, natureVisble, idVisible, dangerColor} = this .state;
		let selectDepartmentDemo = deptList.map((item) => {
			return (
				<Option 
					key = {item.deptid}
					value = {item.deptid + '#' + item.deptname.split("-")[1]}
				>
					{item.deptname.split("-")[1]}
				</Option>
			);
		});
		let administratorsDemo = adminName.map((item) => {
			return (
				<Option 
				key = {item.username}
				value = {item.userid + '#' + item.username}
				>
					{item.username}
				</Option>
			);
		});
		const rowSelection = {
			onChange: (selectedRowKeys, selectedRows) => {
				this.setState({
				selectedRows:selectedRows
				});
			},
			//选择框的默认属性值
			// getCheckboxProps: record => ({
			// 	disabled: record.name === 'Disabled User', // Column configuration not to be checked
			// 	name: record.name,
			// }),
		};
		//生成表头
		const columns = [
			{
				title: '部门',
				dataIndex: 'dept_name',
				key: 'dept_name',
				filterDropdownVisible: deptVisible,
				onFilterDropdownVisibleChange:(visible) => this.explicitimplicitchange("dept_name",visible),
				filterDropdown: this.filterDropdown('dept_name',"部门"),
				// filterIcon: <Icon type="search" style={{ color: this.state['dept_name'].filtered ? '#FA7252' : '#aaa' }} />,
				filterIcon: <Icon type="search" />,
				render:(text)=>{
					return(
						<div>{text}</div>
					);
					},
			},
			{
				title: '名字',
				dataIndex: 'user_name',
				key: 'user_name',
				filterDropdownVisible: nameVisble,
				onFilterDropdownVisibleChange:(visible) => this.explicitimplicitchange("user_name",visible),
				filterDropdown: this.filterDropdown('user_name',"名字"),
				// filterIcon: <Icon type="search" style={{ color: this.state['user_name'].filtered ? '#FA7252' : '#aaa' }} />,
				filterIcon: <Icon type="search" />,
				render:(text)=>{
					return(
						<div>{text}</div>
					);
				},
			},
			{
				title: '性质',
				dataIndex: 'user_type',
				filterDropdownVisible: natureVisble,
				key: 'user_type',
				onFilterDropdownVisibleChange:(visible) => this.explicitimplicitchange("user_type",visible),
				filterDropdown: this.filterDropdown('user_type',"性质"),
				// filterIcon: <Icon type="search" style={{ color: this.state['user_type'] ? '#FA7252' : '#aaa' }} />,
				filterIcon: <Icon type="search" />,
				render:(text)=>{
					return(
						<div>{text}</div>
					);
				},
			},
			{
				title: ' 员工编号/身份证',
				dataIndex: 'user_id',
				key: 'user_id',
				filterDropdownVisible: idVisible,
				onFilterDropdownVisibleChange:(visible) => this.explicitimplicitchange("user_id",visible),
				filterDropdown: this.filterDropdown('user_id',"员工编号/身份证"),
				// filterIcon: <Icon type="search" style={{ color: this.state['user_id'].filtered ? '#FA7252' : '#aaa' }} />,
				filterIcon: <Icon type="search" />,
				render:(text)=>{
					return(
						<div>{text}</div>
					);
				},
			},
			{
				title: '进入黑名单原因',
				dataIndex: 'reason',
				key: 'reason',
				render:(text)=>{
					return(
						<div>{text}</div>
					);
				},
			},
			{
				title: '进入黑名单时间',
				dataIndex: 'create_time',
				key: 'create_time',
				render:(text)=>{
					return(
						<div>{text}</div>
					);
				},
			},
			{
				title: '操作',
				dataIndex: 'remove',
				key: 'remove',
				render: (text, record, index) => <a href="javascript:;" onClick={() => this.showConfirm(record,index)}>移除黑名单</a>
			},
		];
		return (
			<div className={styles.blackWrapper}>
				<h2 style = {{textAlign:'center',marginBottom:30}}>黑名单</h2>
				<div className={styles.blackButtonWrapper}>
					<div>
						<Button type="primary" onClick = {this.deleteAll} disabled = {this.state.selectedRows.length == 0} >批量移除</Button>
					</div>
					<div>
						<Button type="primary" className={styles.blackButtonAdd} onClick={this.empty}>清空</Button>
						<Button type="primary" className={styles.blackButtonAdd} onClick={this.showModal}>新增</Button>
						<Button type="primary" style = {{float:'right', marginRight:-19}}onClick={this.goBack}>返回</Button>
					</div>
				</div>
				<Modal
					title="新增黑名单"
					visible={this.state.visible}
					onOk={this.handleOk}
					onCancel={this.handleCancel}
					key = {this.state.uuid}
				>
					<Row style={{marginTop:"10px"}} >
						<Col span={4}>选择部门:</Col>
						<Col span={20}>
							<Select 
								onSelect={this.optionSelected} 
								style = {{ width: 200 , border:`1px solid ${this.state.deptDangerColor}`,borderRadius:"4px"}}
								value = {this.state.dept_name}
								// placeholder = "请选择所属部门"
							>
								{selectDepartmentDemo}
							</Select>
						</Col>
					</Row>
					<Row style={{marginTop:"10px"}}>
						<Col span={4}>选择管理员:</Col>
						<Col span={20}>
							<Select 
								onSelect = {this.adminOption}
								style={{ width: 120, border: `1px solid ${this.state.adminDangerColor}`,borderRadius:"4px"}} 
								value = {this.state.optionValue}
							>
								{administratorsDemo}
							</Select>
						</Col>
					</Row>
					<Row style={{marginTop:"10px"}}>
						<Col span={8}>加入黑名单原因：</Col>
					</Row>
					<Row style={{marginTop:"10px"}}>
						<TextArea   rows={4} style = {{borderColor: dangerColor}} placeholder = "请输入加入黑名单原因" onChange = {this.valueChange}/>
					</Row>
				</Modal>
				<Table 
					rowSelection = {rowSelection} 
					columns = {columns}  
					dataSource = { blackList }
					className= {styles.orderTable} 
					loading = {this.props.loading}
					pagination = {{
						current:this.props.page,
						total:this.props.total,
						pageSize:this.props.pageSize,
						onChange:this.changePage
					}}
				/>
			</div>
		)
	}
};
// const Blist = Form.create()(Blacklist);
function mapStateToProps(state) {
  	return {
    loading:state.loading.models.officeConfig,
        ...state.officeConfig

  	};
};
export default connect(mapStateToProps)(Blacklist);