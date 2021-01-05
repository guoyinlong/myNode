/**
 * 作者：王超
 * 创建日期：2018-3-14
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：项目指标详情页组件
 */
import { connect } from 'dva';
import Style from '../searchDetail.less';
import { Collapse,Button,message,Icon,Popconfirm } from 'antd';
import Masonry from '../common/Masonry'
import GetScoreTMO from './getScoreTMO';
import KpiItemTMO from './projectKpiItemTMO';

const MasonryItem = Masonry.MasonryItem
const Panel = Collapse.Panel;


class CreatContent extends React.Component {
    constructor(props) {
        super(props);
    }
    
    // 初始化数据
	componentWillMount(){
    	const {dispatch} = this.props;
    	dispatch(this.getParam('taskDeatilTMO/getManagerDetail',{},''));
    }
	
	getParam = (type,updatePara,messageType)=> {
        return {
            type:type,
            updatePara:updatePara,
            params:{
                arg_flag:0,
                arg_proj_id:this.props.proj_id,
                arg_pm_id:this.props.pm_id,
                arg_season:this.props.season,
                arg_year:this.props.year
            },
            check_batchid:{
                check_batchid:this.props.check_batchid
            },
            task_id:{
                task_id:this.props.task_id
            },
            comScorePara:{
                arg_proj_id:this.props.proj_id,
                arg_season:this.props.season,
                arg_year:this.props.year
            },
            messageType:messageType
        }
    }
    
    createHearder = (item)=> {
        return (
            <div className={Style.typeTitle}>
                <div>
                    {item[0].kpi_type}
                </div>
                <div className={Style.scoreTable}>
                    <GetScoreTMO list={item}/>
                </div>
            </div>
        )
    }
    
    creatTMODOM = (kpiItem)=>{
        return (
            kpiItem.length>0?
            <div>
                <p className={Style.dataShow}>
                    <span>确认投资替代额(自有·元) : <i>{this.props.managerDetailObj.confirm_money==""?'未填写':this.props.managerDetailObj.confirm_money} </i></span>
                    <span>确认投资替代额(外包·元) : <i>{this.props.comScoreObj.confirmOutMoney==""?'未生成':this.props.comScoreObj.confirmOutMoney} </i></span>
                </p>
                <p className={Style.dataShow}>
                    <span>差旅费用预算(元):<i>
                    {
                        this.props.comScoreObj.travelBudgetCost == ""?
                        '未出账'
                        :this.props.comScoreObj.travelBudgetCost
                    }
                    </i> </span>
                    <span>实际差旅成本(元):<i>
                    {
                        this.props.comScoreObj.actualTravelCost == ""?
                        '未出账'
                        :this.props.comScoreObj.actualTravelCost
                    }
                    </i></span>
                    <span>全成本(元):<i>
                    {
                        this.props.comScoreObj.totalCost == ""?
                        "未出账"
                        :this.props.comScoreObj.totalCost
                    }
                    </i></span>
                    <span>年化人数(人年):<i>
                    {
                        this.props.comScoreObj.annualPeople == ""?
                        '未出账'
                        :this.props.comScoreObj.annualPeople
                    }
                    </i></span>
                    
                </p>
                <p className={Style.dataShow}>
                    <span>自有工作量(人月):<i>
                    {
                        this.props.comScoreObj.ownWorkload == ""?
                        '未出账'
                        :this.props.comScoreObj.ownWorkload
                    }
                    </i></span>
                    <span>外包工作量(人月):<i>
                    {
                        this.props.comScoreObj.outPersonWorkload == ""?
                        '未出账'
                        :this.props.comScoreObj.outPersonWorkload
                    }
                    </i></span>
                    <span>第三方工作量 (人月): <i>{this.props.managerDetailObj.third_workload==""?'未填写':this.props.managerDetailObj.third_workload} </i></span>
                </p>
                {
                    kpiItem.map((item,index)=>{
                        return (
                            <div key={index} className={Style.KpiTypesBox+" "+Style.arr}>
                              <Collapse  bordered={false} defaultActiveKey={['1']}>
                                <Panel header={this.createHearder(item)} key="1">
                                    <Masonry wrapClass={Style.borderR}>
                                        {item.map((i,index) => <MasonryItem key={index}><KpiItemTMO kpi={i}/></MasonryItem>)}
                                    </Masonry>
                                </Panel>
                              </Collapse>
                            </div>
                        )
                    })
                }
                
                <div className={Style.donwload}>
                    <span>评分依据:</span>
                    <span><Icon type="paper-clip" /><a href={this.props.managerDetailObj.file_relativepath}>{this.props.managerDetailObj.file_name}</a></span>
                </div>
            </div>
            :<div></div>
        )
    }
    
    render() {
        let kpiItem = [];
    	if(this.props.managerDetailObj.kpi_detail) {
    	    kpiItem = Object.values(this.props.managerDetailObj.kpi_detail);
    	}
    	return this.creatTMODOM(kpiItem)
    }
}

function mapStateToProps (state) {
	const {managerDetailObj,taskObj,comScoreObj} = state.taskDeatilTMO;
  	return {
	    managerDetailObj,
	    taskObj,
	    comScoreObj
  	};
}

export default connect(mapStateToProps)(CreatContent);