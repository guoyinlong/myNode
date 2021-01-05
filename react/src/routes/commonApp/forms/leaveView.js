/**
 * 作者：王超
 * 创建日期：2017-10-19
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：请假单原单预览
 */
import { connect } from 'dva';
import { Breadcrumb } from 'antd';
import { Link } from 'dva/router';
import styles from '../pageContainer.css';
import leave from '../../../assets/Images/form/leave.png';
import leave_deputy from '../../../assets/Images/form/leave_deputy.png';
import leave_employee from '../../../assets/Images/form/leave_employee.png';

class LeaveView extends React.Component {
	
	render() {
		
	    const {employeeType}=this.props;
	    let imgSrc = "";
	    switch(employeeType) {
			case 0:
			  imgSrc = leave;
			  break;
			case 1:
			  imgSrc = leave_deputy;
			  break;
			case 2:
			  imgSrc = leave_employee;
			  break;
			default:
			  imgSrc = leave_employee;
		}
	    
		return(
			<div style={{textAlign: 'center'}} className={styles['pageContainer']}>
		        <div style={{ marginBottom: 16 }}></div>
		        <img src={imgSrc}/>
			 </div>
		);
	}
	
}

function mapStateToProps (state) {
	const {employeeType} = state.leave;
	return {
	    employeeType
	};
}

export default connect(mapStateToProps)(LeaveView);