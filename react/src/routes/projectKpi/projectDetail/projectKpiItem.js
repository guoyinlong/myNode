/**
 * 作者：王超
 * 创建日期：2017-10-19
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：项目指标详情页组件
 */
import Style from '../searchDetail.less';

class KpiItem extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
        	<div className={Style.kpiBox}>
        		<div className={Style.kpiItemTitle}>
		        	<div>{this.props.kpi.kpi_name}</div>
		        	<div>得分：<span>{this.props.kpi.kpi_score}</span></div>
		        </div>
		        <div>
			        <span>计算公式/积分方法：</span>
			        <span>{this.props.kpi.formula}</span>
		        </div>
		        <div>
			        <span>目标值/预设值：</span>
			        <span>{this.props.kpi.target}</span>
		        </div>
		        <div>
			        <span>完成值：</span>
			        <span>{this.props.kpi.pm_finish}</span>
		        </div>
		        <div>
			        <span>审核意见：</span>
			        <span>{this.props.kpi.finish}</span>
		        </div>
		        <div>
			        <span>KPI分数：</span>
			        <span>{this.props.kpi.percentile_score}</span>
		        </div>
		        <div>
			        <span>权重：</span>
			        <span>{this.props.kpi.kpi_ratio}</span>
		        </div>
        	</div>
        );
    }
}
export default KpiItem;