/**
 * 作者：王超
 * 创建日期：2018-3-14
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：项目考核-PM详情页
 */
import { connect } from 'dva';
import Style from '../searchDetail.less';
import Title from './title';

class ProjectKpiDetail extends React.Component {
        
    render() {
        return(
            <div>
                <Title year={this.props.data.year} proj_id={this.props.data.proj_id} season={this.props.data.season} pm_id={this.props.data.pm_id} task_id={this.props.data.task_id} check_batchid={this.props.data.check_batchid}/>
            </div>
        );
    }
}

export default ProjectKpiDetail;