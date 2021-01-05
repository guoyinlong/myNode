/**
 * 作者： 彭东洋
 * 创建日期： 2019-09-17
 * 邮箱: pengdy@itnova.com.cn
 * 功能： 管理员审批状态
 */

import  React from 'react';
import { connect } from 'dva';
import {Table, message, Button, Row, Col } from 'antd';
import  styles from './managerDetail.less'
import { routerRedux } from 'dva/router';
class ApplyDetail extends React.Component {
	state = {

	};
  	//条回到申请记录查询页面
	goBackManger = () => {
		const {dispatch} = this.props;
		dispatch(routerRedux.push({
		pathname:'/adminApp/compRes/officeResMain/apply/applyRecord'
		}));
	};
	render() {
		const newData = this.props.location.query;//url传递的参数
		const dataSource =JSON.parse(newData.ReviewInfo);
		//审核状态对应关系
		const mappingTable = {
			DeptManageReview: "待部门经理审核",
			DeptManageDisagree: "部门经理退回",
			AdminReview: "待属地管理员审核",
			AdminDisagree: "属地管理员退回",
			AdminAgree: "审核通过",
			Cancel: "取消申请"
		}
		const mappingApproval = {
			DeptManageReview: "部门经理审批",
			AdminReview: "管理员审批"
		};
		if(dataSource[0].TASK_DEF_KEY_ == "DeptAdminApply" || dataSource[0].TASK_DEF_KEY_ == "DeptManageApply") {
			dataSource.splice(0,1)
		};
		dataSource.map((v,i) => {
			for(let key in mappingApproval) {
				if(v.TASK_DEF_KEY_ == key ) {
					v.TASK_DEF_KEY_ = mappingApproval[key]
				};
			};
			v.deal_state = v.deal_state == 0 ? "待办" : "办毕";
			for( let key in mappingTable) {
				if(newData.state == key ) {
					v.state = mappingTable[key]
				};
			};
			if( v.END_TIME_) {
				v.END_TIME_ = v.END_TIME_.split(".")[0]
			};
			v.index = i+1;
			v.key = i+1;
			v.approvalResult = "";
			if(v.TASK_DEF_KEY_ == "部门经理审批" && (v.state == "待属地管理员审核" || v.state == "审核通过" || v.state == "属地管理员退回")) {
				v.approvalResult = "同意";
			} else if(v.TASK_DEF_KEY_ == "部门经理审批" && (v.state == "部门经理退回")) {
				v.approvalResult = "退回";
			};
			if(v.TASK_DEF_KEY_ == "管理员审批" && (v.state == "属地管理员退回")) {
				v.approvalResult = "退回";
			} else if(v.TASK_DEF_KEY_ == "管理员审批" && v.state == "审核通过"){
				v.approvalResult = "同意";
			};
		});
		const columns = [
			{
				title: "序号",
				dataIndex: "index",
				key: "index",
				render: (text) => {
					return (
						<div>{text}</div>
					);
				}
			},
			{
				title: "审批环节",
				dataIndex: "TASK_DEF_KEY_",
				key: "TASK_DEF_KEY_",
				render: (text) => {
					return (
						<div>{text}</div>
					);
				}
			},
			{
				title: "状态",
				dataIndex: "deal_state",
				key: "deal_state",
				render: (text) => {
					return (
						<div>{text}</div>
					);
				}
			},
			{
				title: "审批时间",
				dataIndex: "END_TIME_",
				key: "END_TIME_",
				render: (text) => {
					return (
						<div>{text}</div>
					);
				}
			},
			{
				title: "审批结果",
				dataIndex: "approvalResult",
				key: "approvalResult",
				render: (text) => {
					return (
						<div>{text}</div>
					);
				}
			},
			{
				title: "审批意见",
				dataIndex: "comment",
				key: "comment",
				render: (text) => {
					return (
						<div>{text}</div>
					);
				}
			},
		];
		return (
			<div className = {styles.pageContainer}>
				<h2 style = {{textAlign:'center'}}>申请记录查询</h2>
				<Button type= "primary" className = {styles.btnButton} onClick = {this.goBackManger}>返回</Button>
				<div className = {styles.detailContent} >
					<Row className = {styles.rowStyles}>
						<Col span = {12}>申请人员：{newData.user_name}</Col>
						<Col span = {12}>申请部门：{newData.dept_name}</Col>
					</Row>
					<Row className = {styles.rowStyles}>
						<Col span = {12}>申请时间：{newData.apply_time}</Col>
						<Col span = {12}>申请数量：{newData.num}</Col>
					</Row>

					<Row className = {styles.rowStyles}>
						<Col span = {12}>开始时间：{newData.begin_time}</Col>
						<Col span = {12}>到期时间：{newData.end_time}</Col>
					</Row>

					<Row className = {styles.rowStyles}>
						<Col span = {12}>申请类型：{newData.type_desc}</Col>
						<Col span = {12}>申请时长：{newData.days}天</Col>
					</Row>
				</div>
				{/* {
				newData.state == "DeptManageDisagree" || newData.state == "AdminDisagree"
				?  <Table columns = {columns} dataSource= {dataSource} className = {styles.orderTable}></Table>
				: ""
				} */}
				<Table
					columns = {columns}
					dataSource= {dataSource}
					className = {styles.orderTable}
					pagination = {false}
				>
				</Table>
			</div>
		);
	};
};
function mapStateToProps (state) {
  return {
    loading:state.loading.models.mangerApplyRecord,
    ...state.mangerApplyRecord
  };
};
export default connect (mapStateToProps)(ApplyDetail);
