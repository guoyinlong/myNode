/**
 * 作者：窦阳春
 * 日期：2020-5-9
 * 邮箱：douyc@itnova.com.cn
 * 功能：检查配置
 */
import React  from 'react';
import {connect } from 'dva';
import { Table, Button,Popconfirm, message, Modal, Input, Pagination, Spin } from 'antd'
import styles from '../../securityCheck/securityCheck.less'                                                                                                                                  
class checkConfig extends React.PureComponent {
	constructor(props) {super(props);}
	state = {
		addVisible: false,
		modalOut: '1',
		checkContent: '',
		recordSave: '',
	}
	oneColumns = [ 
		{
			key: 'key',
			dataIndex: 'key',
			title: '序号'
		},
		{
			key: 'content',
			dataIndex: 'content',
			title: '检查内容'
		},
		{
			key: 'opera',
			dataIndex: 'opera',
			title: '操作',
			render: (text, record) => {
				if(record.children != undefined) {
					return (
						<div>
							<Button size="small" type="primary" onClick={() =>this.addVisible(record, 'oneModify')}>修改</Button> &nbsp;
							<Popconfirm
								title = '确定删除'
								onConfirm = {()=>this.deleteContent( record, 'deleteOne' )}
								>
								<Button 
									type = "primary" size="small"
									style = {{marginLeft : '5px'}}
									disabled = {record.hasTwo!==undefined && record.hasTwo == '1' ? true : false}
									>删除
								</Button> &nbsp;
							</Popconfirm>
							<Button size="small" type="primary" onClick={() =>this.addVisible(record, 'addTwoVisible')}>新增</Button> 
						</div>
					)
				}else {
					return (
						<div id ='a'>
							<Button size="small" type="primary" onClick={() =>this.addVisible(record, 'twoModify')}>修改</Button> &nbsp;
							<Popconfirm
								title = '确定删除'
								onConfirm = {()=>this.deleteContent( record , 'deleteTwo')}
								>
								<Button 
									type = "primary" size="small"
									style = {{marginLeft : '5px'}}
									>删除
								</Button>
							</Popconfirm>
						</div>
					)
				}
			}
		}
	]
	changePage = (page) => { //分页
    this.props.dispatch({type: "checkConfig/changePage", page})
  }
	addVisible = (value1, value2) => {
		if(value2 == 'addOneVisible') {
			this.setState({addVisible: true,modalOut: '1', recordSave: ''})
		}else if(value2 == 'addTwoVisible') {
			this.setState({addVisible: true,modalOut: '2', recordSave: value1})
		}else if(value1 == 'visibleSend') { //点击确定
			let data = {
				content: this.state.checkContent
			}
			let flag = '新增'
			if(this.state.modalOut != '1') {
				data['id'] =  this.state.recordSave.id;
			}else if(this.state.modalOut == '1') {//一级新增
				data['id'] && delete data['id']
			}
			if(this.state.modalOut == '3'||this.state.modalOut == '4'){//修改
				flag = '修改'
			}
			if(data.content == '') {
				message.destroy()
				message.info("检查内容不能为空!")
				return
			}else{ 
				this.props.dispatch({
					type: 'checkConfig/checkConfigAddUpdate',
					data,
					flag,
					recordSave: this.state.recordSave,
					modalOut:this.state.modalOut
				})
				this.setState({addVisible: false, checkContent:''})
			}
		}else if(value1=='cancelVisible') {
			this.setState({addVisible: false, checkContent:''})
		}else if(value2 == 'oneModify') { 
			this.setState({checkContent: value1.content,addVisible: true,modalOut: '3', recordSave: value1})
		}else if(value2 == 'twoModify') {
			this.setState({checkContent: value1.content,addVisible: true,modalOut: '4', recordSave: value1})
		}
	}
	deleteContent = (record, value) => {//删除
		let data = {
			content: record.content,
			id: record.id
		}
		this.props.dispatch({type: "checkConfig/deleteContent", data, value, record})
	}
	checkContent = (e) => { //检查内容
		this.setState({checkContent: e.target.value})
	}
  onExpand = (expanded, record) => {
		if(expanded == true){
			this.props.dispatch({
				type: 'checkConfig/twoconfiglistquery',
				record,
			})
		}else{
			this.props.dispatch({
				type: 'checkConfig/cancelExpand',
				record,
			})
		}
	}
	//----------------------页面渲染----------------------//
	render() {
		const {oneList, expandedRowKeys} = this.props
		const {modalOut, addVisible, checkContent} = this.state;
		let title = modalOut == '1'? '新增检查内容（一级）' :modalOut == '2'?'新增检查内容（二级）'
								:modalOut == '3'?'修改检查内容（一级）' :modalOut == '4'?'修改检查内容（二级）':''
		return(
			// <Spin tip="加载中..." spinning={this.props.loading}>
					<div className={styles.pageContainer}>
						<h2 style = {{textAlign:'center',marginBottom:30}}>检查内容配置</h2>
						<Button type="primary" style = {{marginBottom:10, float:"right"}} 
							onClick={() =>this.addVisible(1,"addOneVisible")}>新增</Button>
							<Modal title = {title}
							 visible = {addVisible}
							 onOk = {() =>this.addVisible("visibleSend")}
							 onCancel = {()=>this.addVisible('cancelVisible')}>
								 检查内容：<Input style={{width:'70%'}} value={checkContent} onChange={(e)=>this.checkContent(e)}/>
							</Modal>
						<Table style = {{marginBottom:10, clear: 'both'}} className={styles.orderTable2}   
							columns = {this.oneColumns}
							dataSource = {oneList}
							pagination = {false}
							onExpand = {this.onExpand}
							expandedRowKeys = {expandedRowKeys}
						/>
						<Pagination
							current = {this.props.pageCurrent}
							pageSize = {100}
							total = {this.props.rowCount}
							onChange = {this.changePage}
							style = {{textAlign: 'center'}}/>
          </div>
			// </Spin>
		)
					
	}
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.checkConfig, 
    ...state.checkConfig
  };
}

export default connect(mapStateToProps)(checkConfig);