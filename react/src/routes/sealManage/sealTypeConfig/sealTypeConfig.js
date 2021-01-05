/**
 * 作者：窦阳春
 * 日期：2019-9-4
 * 邮箱：douyc@itnova.com.cn
 * 功能：个人查询
 */
import React  from 'react';
import {connect } from 'dva';
import { Table, Button,Tabs, Switch,Popconfirm, message, Modal, Input, Select, Pagination, Spin, Row, Col } from 'antd'
import styles from '../sealQuery/sealPersonalQuery.less'
const TabPane = Tabs.TabPane;
                                                                                                                                              
class SealTypeConfig extends React.PureComponent {
	constructor(props) {super(props);}
	state = {
		isDelTypeVisible: false, // 删除用印配置类型确认
		isDelManagerVisible: false, //删除办公室管理员配置
	}
	
	// 切换tab tabKey为1是用印配置页面 2为管理员配置页面
	changeTabs =(key)=>{
		const { dispatch } = this.props;
		if(key === '1') {
			if (this.props.jump == "1") {
				return
			}else {
				dispatch ({
					type: 'sealTypeConfig/initTypeList',
				})
			}
			
		}else if (key === '2') {
			dispatch({
				type: 'sealTypeConfig/setJump'
			})
			dispatch ({ // 查管理员表格数据
				type: 'sealTypeConfig/queryManagerList'
			})
			dispatch ({ // 查询部门列表
				type: 'sealTypeConfig/queryDeptList' 
			})
		}else if(key === '3') {
			dispatch({
				type: 'sealTypeConfig/specialListSearch'
			})
			dispatch ({ // 查询部门列表
				type: 'sealTypeConfig/queryDeptList' 
			})
		}
	}
	//切换印章证照管理员配置开关状态
    changeManagerState = (record, checked)=>{
		const { dispatch } = this.props;
		dispatch ({
		  type : 'sealTypeConfig/changeManagerState',
		  checked : checked,
		  record : record,
		});
	}
	changeSpecialState = (record,checked)=>{
		const { dispatch } = this.props;
		dispatch ({
		  type : 'sealTypeConfig/changeSpecialState',
		  checked : checked,
		  record : record,
		});
	}
	// 切换印章证照类型配置开关状态
	changeTypeState = (record,checked)=>{
		const { dispatch } = this.props;
		dispatch ({
		  type : 'sealTypeConfig/changeTypeState',
		  checked : checked,
		  record : record,
		});
	}
	// 切换印章证照详情配置开关状态
	changeDetailsState = (record, checked)=>{
		const { dispatch } = this.props;
		dispatch ({
		  type : 'sealTypeConfig/changeDetailsState',
		  checked,
		  record : record,
		});
	}
	  // 点击加号展开table详情的操作
		changeExpandedRows = (expanded, record) => {
			const {expandedRowKeys, dispatch} = this.props;
			let hasKey = expandedRowKeys.includes(record.key) 
			let newExpandedRowKeys = []
			if (hasKey) {
				newExpandedRowKeys = expandedRowKeys.map(v => {
					if (v !== record.key) return v;
				})
			} else {
				newExpandedRowKeys = [...expandedRowKeys, record.key]
				dispatch({
					type: 'sealTypeConfig/queryDetailList',
					record: record,
				})
			}
			dispatch({
				type: 'sealTypeConfig/save',
				payload: {
					expandedRowKeys: newExpandedRowKeys,
					prevSealKey: record.key
				}
			})
		}
		confirm = (e) => {
			message.success('删除成功');
		}
		cancel = (e) => {
			message.error('失败');
		}
	// 设置显示模态框
	setVisible = (value, record) => {
		if (value === "delType") // 删除
		{
			this.setState({
				isDelTypeVisible : true, // 删除用印类型
			})
		}else if (value === 'addType') {
			this.props.dispatch({type : "sealTypeConfig/saveFlag",value});
		}else if (value === 'addDetails') {
			this.props.dispatch({
				type: 'sealTypeConfig/addDetailsList', 
				value,
				record:record
			})
		}else if (value == 'modifyDetails') {
			this.props.dispatch ({
				type: 'sealTypeConfig/modifyDetails', // 修改详情
				value,
				record: record
			})
		}else if (value === 'addManager') {
			this.props.dispatch({type : 'sealTypeConfig/saveFlag',value:value,});
			// this.props.dispatch({type:"sealTypeConfig/queryMeetingTypeList"});
			// this.props.dispatch({type:"sealTypeConfig/queryDeptList"});
		}else if (value === 'modifyManager') { // 修改管理员 点击修改按钮 弹出模态框
			this.props.dispatch({
				type: 'sealTypeConfig/modifyManager',
				record: record
			})
		}else if(value === 'addSpecialItem') { // 增加特殊事项
			this.props.dispatch({
				type: 'sealTypeConfig/addSpecialItem',
			})
		}else if(value === 'modifySpecial') {
			this.props.dispatch({
				type: 'sealTypeConfig/modifySpecialItem',
				record: record
			})
		}
	}
	// 设置不显示模态框
	setUnVisible = (value) => {
		if (value === 'delType') { // 点击取消按钮
			this.setState ({
				isDelTypeVisible: false
			})
		}else if (value === 'addCancel') { // 取消一级模态框
			const {dispatch} = this.props;
			dispatch ({
				type: 'sealTypeConfig/setParam'
			})
		}else if (value === 'addCancelDetalis') { // 取消二级模态框
			const {dispatch} = this.props;
			dispatch ({
				type: 'sealTypeConfig/detailsEmpty'
			})
		}else if (value === 'cancelAddManager') {
			this.props.dispatch({type: 'sealTypeConfig/cancelModifyManager'})
		}else if (value === 'delManager') {
			this.setState ({
				isDelManagerVisible: true // 删除办公室管理员
			})
		}else if (value === 'cancelModifySpecialItem') {
			this.props.dispatch({
				type: 'sealTypeConfig/cancelModifySpecialItem'
			})
		}
	}
	
	// 修改印章类型 （一级）
	modifyType = (record) => {
		this.props.dispatch ({
		type : 'sealTypeConfig/modifyType',
		record : record ,
		})
	}
	// 确认删除用印配置操作 (一级)
	delSealConfig = (value) => {
		const {dispatch} = this.props;
		dispatch({
			type: 'sealTypeConfig/delSealConfig',
			value: value
		})
	}
	// 确认删除用印详情配置操作 （二级）
	delSealDetailsConfig = (record) => {
		this.props.dispatch ({
			type: 'sealTypeConfig/delSealDetailsConfig',
			record: record
		})
	}
	// 确认删除管理员
	delManagerConfig = (record) => {
		this.props.dispatch ({
			type: 'sealTypeConfig/delManagerConfig',
			record: record
		})
	}
	// 确认删除特殊事项
	delSpecialConfig = (record) => {
		this.props.dispatch ({
			type: 'sealTypeConfig/delSpecialConfig',
			record
		})
	}
	// 确认新增印章证照类型（一级）
	confirmAddModifySeal = () => {
		const { dispatch } = this.props;
		dispatch ({
			type: 'sealTypeConfig/confirmAddModifySeal',
		})
	}
	// 确认新增印章证照类型（二级）
	confirmAddModifySealDetails = () => {
		const { dispatch } = this.props;
		dispatch ({
			type: 'sealTypeConfig/confirmAddModifySealDetails',
		})
	}
	// 保存新增Input印章证照类型数据  （一级）
	saveData = ( value )=>{
		const { dispatch } = this.props;
		dispatch ({
			type : 'sealTypeConfig/saveData',
			value : value,
		})
	}
	// 保存新增Input印章证照类型数据  （二级）
	saveDetail = (value) => {
		this.props.dispatch ({
			type: 'sealTypeConfig/saveDetail',
			value: value
		})
	}
	// 保存新增Input特殊事项数据
	saveSpecialIpt = (value) => {
		this.props.dispatch ({
			type: 'sealTypeConfig/saveSpecialIpt',
			value: value
		})
	}
	columns = [{
		title: '序号',
		dataIndex: 'key',
		key: 'name',
	  }, {
		title: '印章证照类型',
		dataIndex: 'seal_name',
		key: '',
		width: '30%',
	  }, {
		title: '操作',
		dataIndex: '',
		key: '',
		render: (text, record) => {
			return (
				<div>
					{(record.key + '').indexOf('.') === -1 ? ( // 一级
						<div>
							<Switch
								checkedChildren = '开'
								unCheckedChildren = '关'
								defaultChecked = {true}
								onChange = {(checked)=>this.changeTypeState(record,checked)}
								checked = { (record.seal_state === '1') ? true : false }
							>
							</Switch> &nbsp; 
							<Button size="small" type="primary" onClick={() =>this.modifyType(record)}>修改</Button> &nbsp;
							<Popconfirm
								title = '确定删除'
								onConfirm = {()=>this.delSealConfig( record )}
								onCancel = {()=>this.setUnVisible("delType")}
								>
								<Button
									type = "primary" size="small"
									onClick = { ()=>this.setVisible("delType")}
									style = {{marginLeft : '5px'}}
									disabled = {((record.sate == '0' || this.props.firstSate == '0') && record.seal_state == '1') 
									|| ((record.sate == '0') && record.seal_state == '0') ? true : false} 
									>删除
								</Button> &nbsp;
							</Popconfirm>
							{/* 点击新增 设置模态框出现 新增印章证照功能 */}
							<Button size="small" type="primary" onClick = {()=> this.setVisible("addDetails",record)}>新增</Button> 
						</div>
					) : ( // 二级
						<div>
							<Switch
									checkedChildren = '开'
									unCheckedChildren = '关'
									defaultChecked = {true}
									onChange = {(checked) => this.changeDetailsState(record, checked)}
									checked = { record.seal_details_state === '1' ? true : false }
									>
                    		</Switch> &nbsp; 
							<Button size="small" type="primary" onClick={() => this.setVisible('modifyDetails', record)}>修改</Button> &nbsp;
							<Popconfirm
								title = '确定删除！'
								onConfirm = {()=>this.delSealDetailsConfig( record )}
								onCancel = {()=>this.setUnVisible("delType")}
								>
								<Button
									type = "primary" size="small"
									onClick = { ()=>this.setVisible("delType")}
									style = {{marginLeft : '5px'}}
									disabled = {record.sate == '0'? true : false} // 0变灰禁用
									>删除
								</Button> &nbsp;
							</Popconfirm>
						</div>
					)}

				</div>
			)
		}
	  }];
	  
	  manageColumns = [{
		title: '序号',
		dataIndex: 'key',
		key: 'index',
		render : ( index ) => {
			return (
			 	<span> { index }</span>
			)
		}
	  },{
		title: '管理员',
		dataIndex: 'manager_name',
		key: '',
		render : ( index ) => {
			return (
			 	<span> { index }</span>
			)
		}
	  }, {
		title: '部门',
		dataIndex: 'dept_name',
		key: '',
	  }, {
		title: '一级用印类型',
		dataIndex: 'seal_category',
		key: '',
		render : ( index ) => {
			return (
			 	<span> { index }</span>
			)
		}
	  },{
		title: '二级用印类型',
		dataIndex: 'seal_name',
		key: '',
		render : ( index ) => {
			return (
			 	<span> { index }</span>
			)
		}
	  }, {
		title: '操作',
		dataIndex: 'oprea',
		key: '',
		render: (text, record) => {
			return (
				<div>
					<Switch
						checkedChildren = '开' defaultChecked
						unCheckedChildren = '关'
						onChange = {(checked)=>this.changeManagerState(record, checked)}
						checked = { record.manager_state === '1' ? true : false } // 1 管理员状态开 0 关闭
					>
					</Switch> &nbsp; 
					<Button size="small" type="primary" onClick={()=>this.setVisible('modifyManager',record)}>修改</Button> &nbsp;
					<Popconfirm
								title = '确定删除'
								onConfirm = {()=>this.delManagerConfig( record )}
								>
								<Button
									type = "primary" size="small"
									style = {{marginLeft : '5px'}}
									disabled = { record.manager_state=="1"?true:false }
									>删除
								</Button> &nbsp;
					</Popconfirm>
				</div>
			)
		}
	  }];
	  specialListColumns = [{
		title: '序号',
		dataIndex: 'key',
		key: 'index',
		render : ( index ) => {
			return (
			 	<span> { index }</span>
			)
		}
	  },{
		title: '特殊事项',
		dataIndex: 'seal_special_matters',
		key: '',
		render : ( index ) => {
			return (
			 	<span> { index }</span>
			)
		}
	  }, {
		title: '部门',
		dataIndex: 'seal_auditor_deptname',
		key: '',
	  },{
		title: '审批人',
		dataIndex: 'seal_auditor_name',
		key: '',
		render : ( index ) => {
			return (
			 	<span> { index }</span>
			)
		}
	  }, {
		title: '操作',
		dataIndex: 'oprea',
		key: '',
		render: (text, record) => {
			return (
				<div>
					<Switch
						checkedChildren = '开' defaultChecked
						unCheckedChildren = '关'
						onChange = {(checked)=>this.changeSpecialState(record, checked)}
						checked = { record.special_state === '1' ? true : false } // 1 管理员状态开 0 关闭
					>
					</Switch> &nbsp; 
					<Button size="small" type="primary" onClick={()=>this.setVisible('modifySpecial',record)}>修改</Button> &nbsp;
					<Popconfirm
								title = '确定删除'
								onConfirm = {()=>this.delSpecialConfig( record )}
								>
								<Button
									type = "primary" size="small"
									style = {{marginLeft : '5px'}}
									disabled = {record.special_state == '1' ? true : false} // 变灰禁用
									>删除
								</Button> &nbsp;
					</Popconfirm>
				</div>
			)
		}
	  }];
	  // 确认新增或者修改管理员
	  confirmAddModifyManager  = () => {
		  this.props.dispatch({
			  type: 'sealTypeConfig/confirmAddModifyManager'
		  })
	  }
	  // 确认新增或修改特殊事项人员配置
	  confirmModifySpecial = () => {
		  this.props.dispatch({
			  type: 'sealTypeConfig/confirmModifySpecial'
		  })
	  }
	  //选择变更部门人员
		selectManager = (value)=>{
			this.props.dispatch({type:"sealTypeConfig/selectManager",value,})
		}
		// 选择变更部门人员(特殊事项)
		selectSpecialManager = (value)=>{
			this.props.dispatch({type:"sealTypeConfig/selectSpecialManager",value,})
		}
	  // 保存选中的一级用印类型
	  sealTypeChange = (value) => {
		  this.props.dispatch({
			  type: 'sealTypeConfig/sealTypeChange',
			  value: value
		  })
	  }
	  // 保存选中的一级用印类型
	detailsTypeChange = (value) => {
		this.props.dispatch({
			type: 'sealTypeConfig/detailsTypeChange',
			value: value
		})
	}
	// 保存选中的部门名称 
	deptChange = (value) => {
		this.props.dispatch({
			type: 'sealTypeConfig/deptChange',
			value
		})
	} 
	// 保存选中的部门名称 (特殊事项)
	deptSpecialChange = (value) => {
		this.props.dispatch({
			type: 'sealTypeConfig/deptSpecialChange',
			value
		})
	} 
	// 改变页码
	changePage = (page) => {
		this.props.dispatch({type: 'sealTypeConfig/savePage', page})
	}
	render() {
		const {sealTypeList, managerList, sealType, sealTypeDetails, prevSealName, sealSecondList,
			departList, staffList, managerParam, specialListData, specialAddParam, sealFirstList} = this.props;
		return (
			<Spin tip="加载中..." spinning={this.props.loading}>
				<div className={styles.pageContainer}>
					<h2 className={styles.tit}>用印配置</h2>
					<Tabs defaultActiveKey={this.props.tabkey} onChange={this.changeTabs}>
						<TabPane tab="用印类型配置" key="1">
							<div style={{textAlign:"right",marginBottom:"5px"}}>
								<Button
								type = "primary"
								onClick = {()=> this.setVisible("addType") }>新增</Button>
							</div>
							<Table  
								onExpand={this.changeExpandedRows} 
								className={styles.orderTable}  
								columns={this.columns} 
								dataSource={sealTypeList}
								expandedRowKeys = {this.props.expandedRowKeys}
								pagination = {true}
								loading={this.props.loading}
							/>
						</TabPane>
						<TabPane tab="办公室管理员配置" key="2">
							<div style={{textAlign:"right",marginBottom:"5px"}}>
									<Button
										type = "primary"
										onClick={()=>this.setVisible('addManager')}
									>新增</Button>		
							</div>
							<Table className={styles.orderTable} columns={this.manageColumns} dataSource={managerList}
								pagination = {false}
								loading={this.props.loading}
							></Table>
							<Pagination
								current = {managerParam.pageCurrent}
								pageSize = {managerParam.pageSize}
								total = {managerParam.manTotalData}
								onChange = {this.changePage}
								style = {{textAlign: 'center', marginTop: '20px'}}
							/>
						</TabPane>
						<TabPane tab="特殊事项审核人员配置" key="3">
							<div style={{textAlign:"right",marginBottom:"5px"}}>
									<Button
										type = "primary"
										onClick={()=>this.setVisible('addSpecialItem')}
									>新增</Button>		
							</div>
							<Table 
								className={styles.orderTable} 
								columns={this.specialListColumns} 
								dataSource={specialListData}
								loading={this.props.loading}
								pagination = {true}>
							</Table>
						</TabPane>
					</Tabs>
					<Modal // 一级
						title = { this.props.typeFlag =="1"?"新增用印类型（1级）":"修改印章证照类型" }
						visible = {this.props.isSealTypeVisible} 
						onOk = {()=>this.confirmAddModifySeal()} // 点击确认新增类型
						onCancel ={()=>this.setUnVisible('addCancel')} // 点击取消 设置模态框不显示
					>
						<span>用印类型名称：</span> &nbsp;
						<Input style = {{width: "40%"}} placeholder = '请输入'
						onChange = {(e)=> this.saveData(e.target.value) }
						value = { sealType }
						>
						</Input>
					</Modal>
					<Modal // 二级
						title = { this.props.typeFlag =="1"?"新增用印类型（2级）":"修改印章证照类型" }
						visible = {this.props.isSealDetailsVisible} 
						onOk = {()=>this.confirmAddModifySealDetails()} 
						onCancel ={()=>this.setUnVisible('addCancelDetalis')} 
					>
						<div style={{marginBottom: "10px"}}>上级类型名称：{prevSealName}</div>
						<span>用印类型名称：</span> &nbsp;
						<Input style = {{width: "40%"}} placeholder = '请输入'
						onChange = {(e)=> this.saveDetail(e.target.value) }
						value = { sealTypeDetails }
						>
						</Input>
					</Modal>	
					<Modal  // 办公室管理员新增或修改
						title = { this.props.managerFlag =="1"?"新增办公室管理员":"修改办公室管理员" }
						visible = {this.props.isManagerVisible} 
						onOk = {()=>this.confirmAddModifyManager()} 
						onCancel ={()=>this.setUnVisible('cancelAddManager')} 
					> 
					<Row>
						<Col span={5} style={{textAlign: "right"}}>
							<span>一级用印类型：</span>
						</Col>
						<Col span={19}>
							<Select  
								value = {managerParam.seal_name}
								onChange = {(value) => this.sealTypeChange(value)}
								style = {{ minWidth :"210px", marginBottom: '10px'}}
								disabled = { this.props.managerFlag=="2"?true:false }
							>
								{
									sealFirstList.length && sealFirstList.map((item,index) => {
										return (
											<Select.Option key={item.sealUuid+index} value={`${item.sealName}#${item.sealUuid}`}>
												{item.sealName}
											</Select.Option>
										)
									})
								}
							</Select>
						</Col>
					</Row>
					<Row>
						<Col span={5} style={{textAlign: "right"}}>
							<span>二级用印类型：</span>
						</Col>
						<Col span={19}>
							<Select 
								value = {managerParam.seal_details_name}
								onChange = {(value) => this.detailsTypeChange(value)}
								style = {{ minWidth :"210px", marginBottom: '10px'}}
								disabled = { this.props.managerFlag=="2"?true:false }
							>
								{
									sealSecondList.length && sealSecondList.map((item, index) => {
										return (
											<Select.Option key={item.sealUuid+index} value = {`${item.sealName}#${item.sealUuid}`}>{item.sealName}</Select.Option>
										)
									})
								}
							</Select>
						</Col>
					</Row>
					<Row>
						<Col span={5} style={{textAlign: "right"}}>
							<span>部门：</span>
						</Col>
						<Col span={19}>
							<Select
								value = {this.props.deptName}
								onChange = {(value) => this.deptChange(value)}
								style = {{ minWidth :"210px", marginBottom: '10px'}}
							>
								{
									departList.length && departList.map((item, index) => {
										item.id = index;
										return (
											<Select.Option key={item.deptid} value = {`${item.deptname}#${item.deptid}`}>
												{item.deptname}
											</Select.Option>
										)
									})
								}
							</Select>
						</Col>
					</Row> 
					<Row>
						<Col span={5} style={{textAlign: "right"}}>
							<span>管理员：</span>
						</Col>
						<Col span={19}>
							<Select
								value = {this.props.staffName}
								onChange = {(value)=> this.selectManager(value)} 
								style = {{ width :"210px"}}
							>
								{
									staffList.length && staffList.map((item, index) => {
										return (
											<Select.Option key={item.userid + index} value={`${item.username}#${item.userid}`}>
												{item.username}
											</Select.Option>
										)
									})
								}
							</Select>
						</Col>
					</Row>
					</Modal>
					<Modal // 特殊事项新增或修改
						title = { this.props.specialFlag =="1"?"新增特殊事项管理员":"修改特殊事项管理员" }
						visible = {this.props.isSpecialVisible} 
						onOk = {()=>this.confirmModifySpecial()} 
						onCancel ={()=>this.setUnVisible('cancelModifySpecialItem')} >
					<Row>
						<Col span={4}  style={{textAlign: "right"}}>
							<span>特殊事项：</span>
						</Col>
						<Col span={20}>
							<Input style = {{width: "210px", marginBottom: '10px'}} placeholder = '请输入'
								onChange = {(e)=> this.saveSpecialIpt(e.target.value) }
								value = { specialAddParam.arg_seal_special_matters }
								// disabled = {this.props.specialFlag =="1" ? false : true}
							>
							</Input>
						</Col>
					</Row>
					<Row>
						<Col span={4}  style={{textAlign: "right"}}>
							<span>部门：</span> 
						</Col>
						<Col span={20}>
							<Select
								value = {specialAddParam.arg_seal_auditor_deptname}
								onChange = {(value) => this.deptSpecialChange(value)}
								style = {{ minWidth :"210px", marginBottom: '10px'}}
							>
								{
									departList.length && departList.map((item, index) => {
										item.id = index;
										return (
											<Select.Option key={item.deptid} value = {`${item.deptname}#${item.deptid}`}>
												{item.deptname}
											</Select.Option>
										)
									})
								}
							</Select> 
						</Col>
					</Row>
					<Row>
						<Col span={4}  style={{textAlign: "right"}}>
							<span>管理员：</span> 
						</Col>
						<Col span={20}>
							<Select
								value = {specialAddParam.arg_seal_auditor_name}
								onChange = {(value)=> this.selectSpecialManager(value)} 
								style = {{ minWidth :"210px"}}
							>
								{
									staffList.length && staffList.map((item, index) => {
										return (
											<Select.Option key={item.userid + index} value={`${item.username}#${item.userid}`}>
												{item.username}
											</Select.Option>
										)
									})
								}
							</Select>
						</Col>
					</Row>
					</Modal>
				</div>
			</Spin>
		)
	}
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.sealTypeConfig, // sealPersonalQuery命名空间下的state数据
    ...state.sealTypeConfig
  };
}

export default connect(mapStateToProps)(SealTypeConfig);
