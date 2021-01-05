/**
 * 作者：王超
 * 创建日期：2017-10-19
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：请假单TAB切换
 */
import { connect } from 'dva';
import { Tabs ,Breadcrumb} from 'antd';
import Leave from './leave.js';
import LeaveView from './leaveView.js';
import styles from '../pageContainer.css';
import {Link} from 'dva/router';
const TabPane = Tabs.TabPane;

class LeaveTabs extends React.Component {
	// 初始化请假单日期
	onClick = (e)=> {
		const {dispatch} =this.props;
	    dispatch({
	        type:'leave/selectedTpye',
	        startValue: new Date(),
    		endValue: null
	   })
	}
	
	render() {
		return(
			<div className={styles['pageContainer']}>
				<Breadcrumb separator=">">
		          <Breadcrumb.Item><Link onClick={this.onClick} to='/commonApp'>首页</Link></Breadcrumb.Item>
		          <Breadcrumb.Item>请假申请单</Breadcrumb.Item>
		        </Breadcrumb>
		        <div style={{ marginBottom: 10 }}></div>
				<Tabs defaultActiveKey="1">
				    <TabPane tab="表单填写" key="1"><Leave /></TabPane>
				    <TabPane tab="表单原样预览" key="2"><LeaveView /></TabPane>
				 </Tabs>
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

export default connect(mapStateToProps)(LeaveTabs);