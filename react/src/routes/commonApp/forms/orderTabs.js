/**
 * 作者：王超
 * 创建日期：2017-10-19
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：工单TAB切换
 */
import { connect } from 'dva';
import { Tabs ,Breadcrumb} from 'antd';
import WrappedDynamicRule from './order.js';
import OrderView from './orderView.js';
import styles from '../pageContainer.css';
import {Link} from 'dva/router';
const TabPane = Tabs.TabPane;

class OrderTabs extends React.Component {
	
	// 初始化工单开始结束时间
	onClick = (e)=> {
		const {dispatch} =this.props;
	    dispatch({
	        type:'order/changeDateVal',
	        startValue: new Date(),
    		endValue: null
	   })
	}
	
	render() {
		return(
			<div className={styles['pageContainer']}>
				<Breadcrumb separator=">">
		          <Breadcrumb.Item><Link onClick={this.onClick} to='/commonApp'>首页</Link></Breadcrumb.Item>
		          <Breadcrumb.Item>VPN申请单</Breadcrumb.Item>
		        </Breadcrumb>
		        <div style={{ marginBottom: 10 }}></div>
				<Tabs defaultActiveKey="1">
				    <TabPane tab="表单填写" key="1"><WrappedDynamicRule /></TabPane>
				    <TabPane tab="表单原样预览" key="2"><OrderView /></TabPane>
				 </Tabs>
			 </div>
		);
	}
	
}

function mapStateToProps (state) {
	const {startValue,endValue} = state.order;
	return {
	    startValue,
	    endValue
	};
}

export default connect(mapStateToProps)(OrderTabs);