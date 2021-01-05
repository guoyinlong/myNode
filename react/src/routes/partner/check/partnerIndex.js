/**
 * 文件说明：合作伙伴详情页
 * 作者：王超
 * 邮箱：wangc235@chinaunicom.cn
 * 创建日期：2018-06-15
 */
import { connect } from 'dva';
import {Icon} from  'antd';
import Style from './partnerDetail.less';
import Item from './partnerItem'

class checkPartnerDetail extends React.Component {
    
    state={
        myTitleObj:this.props.titleObj,
        myKpiObj:this.props.kpiObj,
        myYear:this.props.year,
        myMonth:this.props.month
        
    }
    
    componentWillReceiveProps(state) {
        this.setState({
            myTitleObj:state.titleObj,
            myKpiObj:state.kpiObj,
            myYear:state.year,
            myMonth:state.month
        });
    }
    
    createDom = ()=> {
        if(this.state.myTitleObj.length>0&&this.state.myKpiObj.length>0) {
            return (
                <div>
                    <div>
                        <div className={Style.leftTitle}>
                            {this.state.myTitleObj[0].proj_name}
                        </div>
                        <div className={Style.rightTitle}>
                            {`分值：--`}
                        </div>
                    </div>
                    <div className={Style.subtitle }>
                        <span><Icon type="nianduhejidu"/>{` ${this.state.myYear}年 ${this.state.myMonth}月`}</span>
                        <span><Icon type="xingming"/>{` ${this.state.myTitleObj[0].partner_name}--${this.state.myTitleObj[0].staff_name}`}</span>
                    </div>
                    <Item loading={this.props.loading} detail={this.state.myKpiObj} param={{'userId':this.state.myTitleObj[0].staff_id,'year':this.state.myYear,'month':this.state.myMonth}}/>
                </div>
            )
        } else {
            return (
                '暂无数据....'
            )
        }
    }
    
    render() {
        return (
            <div className={Style.container}>
            {this.props.loading?<div>数据加载中...</div>:this.createDom()} 
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { titleObj,kpiObj,year,month} = state.checkDetailModels;
    
    return {
        titleObj,
        kpiObj,
        year,
        month,
        loading: state.loading.models.checkDetailModels,
    };
}
export default connect(mapStateToProps)(checkPartnerDetail) 

