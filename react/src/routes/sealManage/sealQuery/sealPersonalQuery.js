/**
 * 作者：窦阳春
 * 日期：2019-9-4
 * 邮箱：douyc@itnova.com.cn
 * 功能：个人查询
 */
import React from 'react';
import Cookie from 'js-cookie';
import {connect } from 'dva';
import { DatePicker, Table, Button, Select, Row, Col, Popconfirm, Pagination, Spin } from 'antd'
import styles from './sealPersonalQuery.less'
import { routerRedux } from 'dva/router';

import moment from 'moment';
// import { Record } from 'immutable';
const username = Cookie.get("username")
const dateFormat = 'YYYY-MM-DD' || ''; // 解决时间格式问题
class SealPersonalQuery extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		size: 'default', // 日期选择器的大小
		}
	}
	handleSizeChange = (e) => {
		this.setState({ size: e.target.value });
	};
  // 查询功能
	personQuery = () => {
		const {dispatch} = this.props;
		dispatch({
			type: 'sealPersonalQuery/personQuery',
			clickQueryPageCurrent: '1'
		})
	}
  // 点击清空查询条件
 	 emptyQuery = () => {
		this.props.dispatch({
			type: 'sealPersonalQuery/emptyQuery',
		})
  	}
  // 获取日期
//   	onDateChange = (value) => { // 输出开始时间和结束时间
// 		console.log(value[0]._d)
// 	  	console.log(value[0].format(dateFormat));
// 		console.log(value[1].format(dateFormat));
// 		this.props.dispatch({
// 			type: 'sealPersonalQuery/',
// 			value: value
// 		})
//   }
    //时间改变的方法
	onPickerChange = (date, dateString) => {
		// console.log("data",date,"dateString",dateString);
		// console.log("dateString",dateString[0],"dateString",dateString[1]);
		this.props.dispatch({
			type: 'sealPersonalQuery/onPickerChange',
			value: dateString
		})
	  }
  // 当点击的状态改变的时候 获取状态并改变状态值
	onStateChange = (value) => { // 输出选择的状态
		this.props.dispatch({
		type: 'sealPersonalQuery/onStateChange',
		value: value
		})
	}
  // 获取印章证照类别
	onTypeChange = (value) => {
		this.props.dispatch({
			type: 'sealPersonalQuery/onTypeChange',
			value: value
		})
	}
	// 组件挂载 请求印章证照类别查询服务
	componentDidMount() {
		this.props.dispatch({
			type: 'sealPersonalQuery/selectType'
		})
	}
	// 获取印章证照名称
	onNameChange = (value) => {
		this.props.dispatch({
			type: 'sealPersonalQuery/onNameChange',
			value: value
		})
	}
	// 删除草稿操作
	delSealApply = (value) => {
		const {dispatch} = this.props;
		dispatch({
			type: 'sealPersonalQuery/delSealApply',
			value: value
		})
	}
	// 撤回 
	formRecall = (value) => {
		const {dispatch} = this.props;
		dispatch({
			type: 'sealPersonalQuery/formRecall',
			value
		})
	}
	// 终止
	stopApply = (record) => {
		this.props.dispatch({
			type: 'sealPersonalQuery/stopApply',
			record
		})
	}
	// 跳转详情页
	gotoApplyDetail = (record) => {
		let pathName = '/adminApp/sealManage/sealPersonalQuery/sealLeaderDetail';
		if(record.title.indexOf("院领导名章使用") > -1) {
			pathName = '/adminApp/sealManage/sealPersonalQuery/sealLeaderDetail';
		}else if(record.title.indexOf("营业执照外借") > -1) {
			pathName = '/adminApp/sealManage/sealPersonalQuery/borrowBusinessDetail';
		}else if(record.title.indexOf("院领导身份证") > -1) {
			pathName = '/adminApp/sealManage/sealPersonalQuery/leaderIDDetail';
		}else if(record.title.indexOf("院领导名章外借") > -1) {
			pathName = '/adminApp/sealManage/sealPersonalQuery/borrowLeaderDetail'
		}else if(record.title.indexOf("印章外借") > -1) {
			pathName = '/adminApp/sealManage/sealPersonalQuery/borrowSealDetail'
		}else if(record.title.indexOf("刻章申请") > -1) {
			pathName = '/adminApp/sealManage/sealPersonalQuery/markSealDetail'
		}else if(record.title.indexOf("营业执照复印件使用") > -1) {
			pathName = '/adminApp/sealManage/sealPersonalQuery/businessLicenseDetail'
		}else if(record.title.indexOf("印章使用") > -1) {
			pathName = '/adminApp/sealManage/sealPersonalQuery/sealComDetail'
		}
		this.props.dispatch(routerRedux.push({
			pathname: pathName,
			query:  {
				record: JSON.stringify(record)
			}
		}))
	}
	// 跳转修改
	gotoModify = (record) => {
		let pathName = '/adminApp/sealManage/sealPersonalQuery/sealLeaderReset';
		if(record.title.indexOf("院领导名章使用") > -1) {
			pathName = '/adminApp/sealManage/sealPersonalQuery/sealLeaderReset'
		}else if(record.title.indexOf("营业执照外借") > -1) {
			pathName = '/adminApp/sealManage/sealPersonalQuery/borrowBusinessReset';
		}else if(record.title.indexOf("院领导身份证") > -1) {
			pathName = '/adminApp/sealManage/sealPersonalQuery/leaderIDReset';
		}else if(record.title.indexOf("院领导名章外借") > -1) {
			pathName = '/adminApp/sealManage/sealPersonalQuery/borrowLeaderReset'
		}else if(record.title.indexOf("印章外借") > -1) {
			pathName = '/adminApp/sealManage/sealPersonalQuery/borrowSealReset'
		}else if(record.title.indexOf("刻章申请") > -1) {
			pathName = '/adminApp/sealManage/sealPersonalQuery/markSealReset'
		}else if(record.title.indexOf("营业执照复印件使用") > -1) {
			pathName = '/adminApp/sealManage/sealPersonalQuery/businessLicenseReset'
		} else if(record.title.indexOf("印章使用") > -1) {
			pathName = '/adminApp/sealManage/sealPersonalQuery/sealComReset'
		}
		this.props.dispatch(routerRedux.push({
			pathname: pathName,
			query:  {
				record: JSON.stringify(record)
			}
		}))
	}
   // 表格
	columns = [
		{
			key: 'index',
			dataIndex: 'index',
			title: '序号'
		},
		{
			key: 'title',
			dataIndex: 'title',
			title: '印章证照名称'
		},
		{
			key: 'dept_name',
			dataIndex: 'dept_name',
			title: '申请单位'
		},
		{
			key: 'applicant_name',
			dataIndex: 'applicant_name',
			title: '申请人'
		},
		{
			key: 'create_date',
			dataIndex: 'create_date',
			title: '申请时间'
		},
		{
			key: 'state',
			dataIndex: 'state',
			title: '状态'
		},
		{
			key: 'handle',
			dataIndex: 'handle',
			title: '操作',
		  	render:(text,record) => {
				if (record.stateCode == '0' && record.applicant_name == username) {
					return (
						<div>
							<Button size="small" type="primary" onClick={() =>this.gotoModify(record)}>修改</Button> &nbsp;
							<Popconfirm
								title = '确定删除'
								onConfirm = {()=>this.delSealApply( record )}
								>
								<Button
									type = "primary" size="small"
									style = {{marginTop : '3px'}}
									>删除
								</Button>
							</Popconfirm>
						</div>
					)
				}
				else if(record.stateCode == '1' && record.form_last_check_state == '-1' && record.applicant_name == username) {
					return(
						<div>
							<Button style = {{marginBottom : '3px'}} size="small" type="primary"
								onClick = {()=>this.gotoApplyDetail(record)}>详情</Button> &nbsp;
								<Popconfirm // 作废
									title = '确定作废'
									onConfirm = {()=>this.formRecall( record )}
									>
									<Button
										type = "primary" size="small"
										style = {{marginTop : '3px'}}
										>作废
									</Button>
								</Popconfirm>
						</div>
					)
				}
				else if ((record.stateCode == '4' || record.stateCode == '7'  || record.stateCode == '10'
						||record.stateCode == '13' ||record.stateCode == '16' ||record.stateCode == '19' ||record.stateCode == '22')
						&& record.applicant_name == username) { //退回
					return (
						<div>
							<Button style = {{marginBottom : '3px'}} size="small" type="primary"
								onClick = {()=>this.gotoApplyDetail(record)}>详情</Button> &nbsp;
							<Button size="small" type="primary" onClick={() =>this.gotoModify(record)}>修改</Button> &nbsp;
							<Popconfirm
								title = '确定终止'
								onConfirm = {()=>this.stopApply( record )}
								>
								<Button
									type = "primary" size="small"
									style = {{marginTop : '3px'}}
									>终止
								</Button>
							</Popconfirm>
						</div>
					)
				}
				return (
					<div>
						<Button size="small" type="primary" onClick={() =>this.gotoApplyDetail(record)}>详情</Button>
					</div>
				)
			}
		}
	]
	// 获取当前时间设置为默认显示的时间
		getCurrentTime = () => {
			let d = new Date()
			let year = d.getFullYear();
			let mon = d.getMonth() + 1;
			let date = d.getDate();
			mon = mon < 10 ? '0' + mon : mon
			date = date < 10 ? '0' + date : date
			let currentTime = year + '-' + mon + '-' + date
			return currentTime
		}
	// 返回得到的状态值列表
	getSealStateList = () => {
			const {stateData} = this.props;
			const data = stateData[0];
			let sealStateList = [];
			for (let v in data) {
				sealStateList.push({
					state: v,
					stateValue: data[v]
				})
			}
			return sealStateList;
	}
    // 改变页码
	changePage = (page) => {
	this.props.dispatch({type: 'sealPersonalQuery/savePage', page})
	}

  render() {
	let { stateData, sealPersonalList,typeData, nameData } = this.props;
	typeData.length == 0 ? null : (typeData = [{sealUuid: "0", sealName: "全部"}, ...typeData]);
	nameData.length == 0 ? null : (nameData = [{sealUuid: "0", sealName: "全部"}, ...nameData]);
	const { RangePicker} = DatePicker;
	const { Option } = Select;
	const sealStateList = this.getSealStateList();
	const currentTime = this.getCurrentTime();
	// 把状态返回值列表展示在Option选项中
    const sealStateOption = stateData.length === 0 ? ''
    : sealStateList.map((item, index) => (
        <Option key={item.stateValue+''} value={index+''}>{item.stateValue}</Option>
	))
	// 把证照类型返回值展示在Option选项中
	const sealTypeOption = typeData.length === 0 ? [] : typeData.map((item) => {
		return <Option key={item.sealUuid} value={`${item.sealUuid}#${item.sealName}`}>{item.sealName}</Option>
	})
    return (
    	<Spin tip="加载中..." spinning={this.props.loading}>
			<div className={styles.pageContainer}>
				<div className={styles.selectContainer}>
					<h2 className={styles.tit}>个人查询</h2>
					<Row style={{ textAlign: "right" ,lineHeight:"30px"}}>
						<Col span={4}>
							<span>日期： </span>
						</Col>
						<Col span={5} style={{ textAlign: "left" }}>
							<RangePicker value={   // 判断开始时间和结束时间是不是''是就显示null， 否则显示自己设置的值
								this.props.startTime=== ''
								|| this.props.endTime===''
								? null : [moment(this.props.startTime, dateFormat), moment(this.props.endTime, dateFormat)]}
								format={dateFormat}
								placeholder={[currentTime,currentTime]} // 默认显示的时间范围
								onChange={this.onPickerChange} style={{ width: "200px" }}/>
						</Col>
						<Col span={4}>
							<span>状态：</span>
						</Col>
						<Col span={8} style={{ textAlign: "left" }}>
							<Select value={this.props.queryState} style={{ width: "200px" }} onChange={this.onStateChange} >
								{sealStateOption}
							</Select>
						</Col>
					</Row>
					<Row style={{ textAlign: "right" ,lineHeight:"30px", marginTop: "10px"}}>
						<Col span={4}>
							<span>印章证照类别： </span>
						</Col>
						<Col span={5} style={{ textAlign: "left" }}>
							<Select mode="multiple"
								value={this.props.queryType}
								onChange={this.onTypeChange}
								style={{ minWidth: "200px" }}
								onFocus={this.selectType}
								placeholder = "请选择"
								>
								{sealTypeOption}
							</Select>
						</Col>
						<Col span={4}>
							<span>印章证照名称：</span>
						</Col>
						<Col span={6} style={{ textAlign: "left" }}>
							<Select mode="multiple"
								value = {this.props.queryName}
								style = {{width: '200px'}}
								onChange = {this.onNameChange}
								placeholder = "请选择"
							>
							{
								nameData.length === 0 ? [] : nameData.map((item) => {
									return <Option key={item.sealUuid} value={`${item.sealUuid}#${item.sealName}`}>
									{item.sealName}</Option>
								})
							}
							</Select>
						</Col>
						<Col span={5} style={{ textAlign: "left" }}>
						<Button type="primary" onClick={this.personQuery} style={{ marginRight: "15px" }}>查询</Button>
						<Button type="primary" onClick={this.emptyQuery}>清空</Button>
						</Col>
					</Row>
				</div>
				{/* <Table columns={this.columns} dataSource={this.data} className={styles.orderTable} /> */}
				<Table
					columns = {this.columns}
					dataSource = {sealPersonalList}
					className={styles.orderTable}
					bordered={true}
					loading={this.props.loading}
					pagination={false}/>
				<Pagination
					current = {this.props.pageCurrent}
					pageSize = {this.props.pageSize}
					total = {this.props.totalData}
					onChange = {this.changePage}
					style = {{textAlign: 'center', marginTop: '20px'}}
					/>
			</div>
		</Spin>
    )
  }
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.sealPersonalQuery, // sealPersonalQuery命名空间下的state数据
    ...state.sealPersonalQuery
  };
}

export default connect(mapStateToProps)(SealPersonalQuery);
