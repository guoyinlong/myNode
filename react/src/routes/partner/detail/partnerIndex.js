/**
 * 文件说明：合作伙伴详情页
 * 作者：王超
 * 邮箱：wangc235@chinaunicom.cn
 * 创建日期：2018-06-15
 */
import { connect } from 'dva';
import {Tabs,Table,Button,Icon} from  'antd';
import Style from './partnerDetail.less';
import Item from './partnerItem'

class partnerDetail extends React.Component {
    
    state={
        totalScore:0
    }
    
    setScore = (score)=> {
        this.setState({
          totalScore:score
        })
    }
  
    render() {
        return (
            <div className={Style.container}>
                {(this.props.titleObj.length>0&&this.props.kpiObj.length>0)?
                    <div>
                        <div>
                            <div className={Style.leftTitle}>
                                {this.props.titleObj[0].proj_name}
                            </div>
                            <div className={Style.rightTitle}>
                                {`目标分值：${this.state.totalScore}`}
                            </div>
                        </div>
                        <div className={Style.subtitle }>
                            <span><Icon type="nianduhejidu"/>{` ${this.props.year}年 ${this.props.month}月`}</span>
                            <span><Icon type="xingming"/>{` ${this.props.titleObj[0].partner_name}--${this.props.titleObj[0].staff_name}`}</span>
                        </div>
                        {
                            this.props.kpiObj[0].unpass_reason?<div className={Style.reson}>{`退回原因:${this.props.kpiObj[0].unpass_reason}`}</div>:''
                        }
                        
                        <Item handlSetScore={(score)=>{this.setScore(score)}} loading={this.props.loading} title={this.props.titleObj[0]} detail={this.props.kpiObj}/>
                    </div>:'暂无数据....'
                }
            </div>
        )
    }
}


function mapStateToProps(state) {
    const { titleObj,kpiObj,year,month} = state.partnerDetail;
    return {
        titleObj,
        kpiObj,
        year,
        month,
        loading: state.loading.models.partnerDetail,
    };
}
export default connect(mapStateToProps)(partnerDetail) 
//export default partnerDetail

