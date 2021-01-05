/**
 * 作者：王超
 * 创建日期：2018-3-14
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：项目指标详情页组件
 */
import Style from '../searchDetail.less';
import { connect } from 'dva';
import { Input  } from 'antd';
const { TextArea } = Input;

class KpiItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        //判断自主研发运维占比指标是否进行考核豁免
        if(this.props.kpi.kpi_name === "自主研发（运维）占比" &&this.props.kpi.kpi_assessment === '0' ){
            console.log(this.props.kpi.pm_finish,"pm_finish")
            console.log(this.props.isDis,"isDis")
        }

        let tuggle = true;
        if(this.props.kpi.kpi_name === "自主研发（运维）占比" &&this.props.kpi.kpi_assessment === '0' ){
            tuggle = this.props.isDis;
            console.log(tuggle,"tuggle")
        }
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
                    <span>指标定义：</span>
                    <span>{this.props.kpi.kpi_content}</span>
                </div>
				{
                    this.props.kpi.kpi_flag === "0"  && this.props.kpi.kpi_assessment != undefined?
                    <div style = {{display:'flex',alignItems:"center"}}>
                        <span style = {{whiteSpace: "nowrap",width:'auto'}}>考核方式变更：</span>
                        {
                            this.props.kpi.kpi_assessment === "0" ? "是" : "否"
                        }
                    </div>
                    :
                    ""
                }
                {
                    this.props.kpi.kpi_flag === "0" && this.props.kpi.kpi_assessment === "0"?
                    <div style = {{display:'flex',alignItems:'center'}}>
                        <span style = {{whiteSpace:"nowrap",width:'auto'}}>申请变更理由：</span>
                        {
                            this.props.kpi.reason
                        }
                    </div>
                    :
                    ""
                }
		        <div>
			        <span>目标值：</span>
			        <span>{this.props.kpi.target}</span>
		        </div>
		        <div>
			        <span>完成值：</span>
			        <span>
			        {  this.props.kpi.kpi_flag == "1"||this.props.kpi.kpi_flag == "3"?
			        	(parseInt(this.props.kpi.kpi_state) > 1  || this.props.isDis  )&& tuggle?
			        	<span>{this.props.kpi.pm_finish}</span>
			        	:<div><TextArea maxLength={1000} id={this.props.kpi.kpi_id} defaultValue={this.props.kpi.pm_finish} autosize autosize={{ minRows: 4}}/><span>(最多1000字)</span></div>:
                <span>{this.props.kpi.pm_finish}</span>
			        }

			        </span>
		        </div>
        	</div>
        );
    }
}

function mapStateToProps (state) {
	const {isDis,retreatMessage} = state.deatilPM;
  	return {
	    isDis,retreatMessage
  	};
}

export default connect(mapStateToProps)(KpiItem);
