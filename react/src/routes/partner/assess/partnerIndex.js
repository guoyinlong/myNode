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

class assessPartnerDetail extends React.Component {
    
    state = {
        myTitleObj:this.props.titleObj,
        myKpiObj:this.props.kpiObj,
        myYear:this.props.year,
        myMonth:this.props.month,
        totalScore:0
    }
    
    componentWillReceiveProps(state) {
        this.setState({
            myTitleObj:state.titleObj,
            myKpiObj:state.kpiObj,
            myYear:state.year,
            myMonth:state.month
        });
    }
    
    setScore = (score)=> {
        this.setState({
          totalScore:score
        })
    }
    
    createDom = ()=> {
        if(this.state.myTitleObj.length>0&&this.state.myKpiObj.length>0) {
            return (
                <div>
                    <div>
                        <div style={{float: 'left',paddingLeft:'10px'}}>
                            <div className={Style.leftTitle}>
                                {this.state.myTitleObj[0].proj_name}
                            </div>
                            <div className={Style.subtitle }>
                                <span><Icon type="nianduhejidu"/>{` ${this.state.myYear}年 ${this.state.myMonth}月`}</span>
                                <span><Icon type="xingming"/>{` ${this.state.myTitleObj[0].partner_name}--${this.state.myTitleObj[0].staff_name}`}</span>
                            </div>
                        </div>
                        <div className={Style.rightTitle}>
                            <span>总分：
                                <span className={Style.totalScore} id='totalScore'>{this.state.totalScore}
                                <svg className={Style.svg} id="svg" width="80" height="10">
                                  <path d="M0 9 Q37 3, 80 4" stroke="#ff0000" fill="none" style={{strokeWidth:'2px'}}></path>
                                </svg>
                                </span>
                            </span>
                        </div>
                    </div>
                    
                    <Item handlSetScore={(score)=>{this.setScore(score)}} loading={this.props.loading} detail={this.state.myKpiObj} param={{'userId':this.state.myTitleObj[0].staff_id,'year':this.state.myYear,'month':this.state.myMonth}}/>
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
    const { titleObj,kpiObj,year,month} = state.assessDetailModels;
    return {
        titleObj,
        kpiObj,
        year,
        month,
        loading: state.loading.models.assessDetailModels,
    };
}
export default connect(mapStateToProps)(assessPartnerDetail) 

