/**
 * 作者：王超
 * 创建日期：2017-11-20
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：项目评价-TMO
 */
import { connect } from 'dva';
import InitList from './initList';

class projectKpiDetailT extends React.Component {

	render() {
		return(
			<InitList />
		);
	}
}

function mapStateToProps (state) {
	const {year,season} = state.deatilKpiT;
  	return {
	    year,
	    season
  	};
}

export default connect(mapStateToProps)(projectKpiDetailT);