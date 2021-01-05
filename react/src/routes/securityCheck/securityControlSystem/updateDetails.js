/**
 * 作者：窦阳春
 * 日期：2019-5-15
 * 邮箱：douyc@itnova.com.cn
 * 功能：安控体系首页
 */
import React  from 'react';
import {connect } from 'dva';
import { Table, Button, Tabs, Pagination, Spin } from 'antd'
import styles from '../../securityCheck/securityCheck.less'
const TabPane = Tabs.TabPane;                                                                                                                                
class updateDetails extends React.PureComponent {
	constructor(props) {super(props);}
	state = {
		key: "0"
  }
	changePage = (page) => { //分页
		this.props.dispatch({type: "updateDetails/changePage", page, key: this.state.key})
  }
	changeTabs = (key) => {
		this.setState({key: key})
		this.props.dispatch({
			type: 'updateDetails/queryUpdateState',
			key
		})
	}
	columns = [
		{
			key: 'key',
			dataIndex: 'key',
			title: '序号'
		},
		{
			key: 'createDeptName',
			dataIndex: 'createDeptName',
			title: '部门',
		},
		{
			key: 'createTime',
			dataIndex: 'createTime',
			title: '更新时间',
		},
		{
			key: 'createUserName',
			dataIndex: 'createUserName',
			title: '更新人员',
		},
	]
	//----------------------页面渲染----------------------//
	render() {
		const {dataList} = this.props
		let tableDiv = () => {
			return (
				<div>
				{
					dataList ?
					<Table 
						columns = {this.columns}
						dataSource = {dataList}
						className={styles.orderTable}
						bordered={true}
						loading={this.props.loading}
						pagination={false}/> 
						: ''
				}
				</div>
			)
		}
		let tableDivData = tableDiv()
		return(
			<Spin tip="加载中..." spinning={this.props.loading}>
					<div className={styles.pageContainer}>
						<h2 style = {{textAlign:'center',marginBottom:30}}>更新详情</h2>
            <Button style = {{float: 'right'}} size="default" type="primary" >
							<a href="javascript:history.back(-1)">返回</a>
						</Button>
						<Tabs onChange={this.changeTabs} defaultActiveKey={"0"}
						style = {{marginBottom: 10}}>
							<TabPane tab="总院" key="0">{tableDivData}</TabPane>
							<TabPane tab="分院" key="1">{tableDivData}</TabPane>
						</Tabs>
						<Pagination 
							current = {this.props.pageCurrent}
							pageSize = {10}
							total = {this.props.allCount}
							onChange = {this.changePage}
							style = {{textAlign: 'center'}}
							/>
          </div>
			</Spin>
		)
					
	}
}
function mapStateToProps (state) {
  return {
    loading: state.loading.models.updateDetails, 
    ...state.updateDetails
  };
}

export default connect(mapStateToProps)(updateDetails);
