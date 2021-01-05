/**
 * 作者：王超
 * 创建日期：2017-11-20
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：部门卡片页面
 */
import { connect } from 'dva';
import { Card, Col, Row,Icon} from 'antd';
import { routerRedux } from 'dva/router';
import styles from './projectTable.less';

class ListCard extends React.Component {

	toList = (params)=>{
		let query = {
			dept:params
		}

		window.localStorage.deptValue = params;
		const{dispatch}=this.props;
		dispatch(routerRedux.push({
	        pathname:'/projectApp/projexam/examquery/proList',query
	    }));
	}

	render() {
		let ouData = [];
		if(this.props.deptInfor != null) {
			ouData = this.props.deptInfor;
		}

		return(
			<div className={styles.container}>
			    <Row gutter={16}>
			    {
			    	ouData.map((item,index)=>{
			    		return (
			    			<Col style={{margin:'5px'}} key={index} span={7}>
						        <Card onClick={()=>this.toList(item.pu_dept_name)}>
						            <h3 style={{marginBottom:'5px',fontWeight:'bold'}}><Icon type="tags" />{item.pu_dept_name.split('-')[0]}</h3>
						            <div>{item.pu_dept_name.split('-')[1]}</div>
						        </Card>
						    </Col>
			    		)
			    	})
			    }

			    </Row>
			</div>
		);
	}

}

function mapStateToProps (state) {
	const {deptInfor} = state.projectKpi;
  	return {
	    deptInfor
  	};
}

export default connect(mapStateToProps)(ListCard);
