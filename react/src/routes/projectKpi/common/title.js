/**
 * 作者：王超
 * 创建日期：2017-10-19
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：项目指标详情页组件
 */
import Style from '../searchDetail.less';
import { Icon } from 'antd';

class CreatTitle extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        	<div className={Style.projectTitle}>
		        <div className={Style.staffInfo}>
		          <div>
		            {this.props.date.title||'项目考核指标'}
		          </div>
		          <div>
		            <span><Icon type="nianduhejidu"/>{`${this.props.date.year}年 ${this.props.date.season}`}</span>
		            <span><Icon type="xingming"/>{this.props.date.mgr_name}</span>
		            <span><Icon type="xiangmubianhao"/>{this.props.date.mgr_id}</span>
		            <span><Icon type="gongxiandu"/>主责部门：{this.props.dep}</span>
		                {
		                	this.props.date.file_name?
		                	<div className={Style.donwload}>
		                		<span>{'评分依据:'}</span><a href={this.props.date.file_relativepath}>{this.props.date.file_name}</a>
		                	</div>
		                	:<div></div>
		                }
		          </div>
		        </div>
		        <div className={Style.staffScore}>
		          <span>总分：<span>{this.props.date.score}
		            <svg id="svg" width="80" height="10">
		              <path d="M0 9 Q37 3, 80 4" stroke="#ff0000" fill="none" style={{strokeWidth:'2px'}}></path>
		            </svg>
		          </span></span>
		        </div>
		    </div>
        );
    }
}

export default CreatTitle;