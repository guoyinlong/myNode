/**
 * 作者：王超
 * 创建日期：2017-10-19
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：工单原单预览
 */
import { connect } from 'dva';
import { Breadcrumb } from 'antd';
import { Link } from 'dva/router';
import styles from '../pageContainer.css';
import defaultAvt from '../../../assets/Images/form/order.png'

class OrderView extends React.Component {
	
	render() {
		return(
			<div style={{textAlign: 'center'}} className={styles['pageContainer']}>
		        <div style={{ marginBottom: 16 }}></div>
		        <img src={defaultAvt}/>
			 </div>
		);
	}
	
}

export default OrderView;