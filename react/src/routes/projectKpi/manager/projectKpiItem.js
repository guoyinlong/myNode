/**
 * 作者：王超
 * 创建日期：2017-10-19
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：项目指标详情页组件
 */
import Style from '../searchDetail.less';
import { connect } from 'dva';
import { Input  } from 'antd';
const { TextArea } = Input;

class KpiItemM extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
    	
        return (
        	<div className={Style.kpiBox}>
        		<div className={Style.kpiItemTitle}>
		        	<div>{this.props.kpi.kpi_name}</div>
		        	<div style={{display:'none'}}>得分：<span>{this.props.kpi.kpi_score}</span></div>
		        	
		        </div>
		        <div>
			        <span>指标说明：</span>
			        <span>{this.props.kpi.formula}</span>
		        </div>
		        <div>
			        <span>目标值：</span>
			        <span>{this.props.kpi.target}</span>
		        </div>
		        <div>
			        <span>完成值：</span>
			        <span>
			        {  
			        	parseInt(this.props.kpi.kpi_state) > 1  || this.props.isDis?
			        	<span>{this.props.kpi.pm_finish}</span>
			        	:<div><TextArea maxLength={200} id={this.props.kpi.kpi_id} defaultValue={this.props.kpi.pm_finish} autosize autosize={{ minRows: 4}}/><span>(最多200字)</span></div>
			        }
			        
			        </span>
		        </div>
        	</div>
        );
    }
}

function mapStateToProps (state) {
	const {isDis} = state.deatilKpiM;
  	return {
	    isDis
  	};
}

export default connect(mapStateToProps)(KpiItemM);