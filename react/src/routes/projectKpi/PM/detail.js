/**
 * 作者：王超
 * 创建日期：2018-3-14
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：项目考核-PM详情页
 */
import { connect } from 'dva';
import Style from '../searchDetail.less';
import TitleM from './title';

class ProjectKpiDetail extends React.Component {
    
    isStart = (obj)=>{
        if(obj[0].season == -1) {
            return '考核还未开始...';
        } else if(obj[0].season == 0){
            return '年度考核已经结束...';
        } else {
            return (
                <TitleM season={obj[0].season} year={obj[0].year} check_id={this.props.location.query.check_id}/>
            )
        }
    }
    
    render() {
        return(
            <div style={{fontSize: '20px'}}>
            {
                this.props.isStartObj?
                    this.isStart(this.props.isStartObj)
                :""
            }
            </div>
        );
    }
}

function mapStateToProps (state) {
    const {isStartObj} = state.deatilPM;
    return {
        isStartObj
    };
}

export default connect(mapStateToProps)(ProjectKpiDetail);