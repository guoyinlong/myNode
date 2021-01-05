/**
 * 作者：王超
 * 创建日期：2018-3-14
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：项目指标详情页组件
 */
import { connect } from 'dva';
import Style from '../searchDetail.less';
import { Collapse,Button,message,Icon,Popconfirm } from 'antd';
import Masonry from './Masonry';
import GetScoreTMO from './getScoreTMO';
import KpiItemDM from './projectKpiItemDM';
import UploadFile from './uploadFile';

const MasonryItem = Masonry.MasonryItem
const Panel = Collapse.Panel;


class CreatContent extends React.Component {
    constructor(props) {
        super(props);
    }

    // 初始化数据
	componentWillMount(){
    	const {dispatch} = this.props;
    	dispatch(this.getParam('taskDeatilTMO/getDMManagerDetail',{},''));
    }

	// 保存
    kpiSave = (kpiItem)=> {
        this.updateKpi(this.props.managerDetailObj,"5","5");
    }

    // 提交
    kpiSubmit = (kpiItem)=> {
      if(this.props.isDM) {
        this.updateKpi(this.props.managerDetailObj, "6", "6");
      }else{
        this.updateKpi(this.props.managerDetailObj, "5", "6");
      }

    }

    getUpdateDate = (kpiItem)=> {
        let retDate = [];

        for(let x in kpiItem) {
            for (let i=0; i<kpiItem[x].length; i++) {
                if(document.getElementById(kpiItem[x][i].kpi_id)) {
                    if(document.getElementsByName('f_'+kpiItem[x][i].kpi_id)) {
                        kpiItem[x][i].finish = document.getElementsByName('f_'+kpiItem[x][i].kpi_id)[0].value;
                    }
                    if(document.getElementsByName('span_'+kpiItem[x][i].kpi_id)) {
                        kpiItem[x][i].kpi_score = document.getElementsByName('span_'+kpiItem[x][i].kpi_id)[0].innerHTML;
                    }
                    kpiItem[x][i].percentile_score = document.getElementById(kpiItem[x][i].kpi_id).value;

                    retDate.push(kpiItem[x][i]);
                } else {
                    retDate.push(kpiItem[x][i])
                }
            }
        }
        return retDate;
    }

    dmSubmit = (updateDataKpi,flag)=> {

        return {
            arg_dm_id:window.localStorage.staffid,
            arg_dm_name:window.localStorage.fullName,
            arg_proj_id:this.props.managerDetailObj.proj_id,
            arg_proj_name:this.props.managerDetailObj.proj_name,
            arg_season:this.props.season,
            arg_year:this.props.year,
            arg_pm_id:this.props.pm_id,
            arg_pm_name:JSON.parse(this.props.taskObj.task_content).create_byname,
            arg_data:JSON.stringify(updateDataKpi),
            arg_taskParam:this.props.taskObj.task_param,
          arg_dept: this.props.puDept,
            arg_flag:flag
        };
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

    // 保存，提交更新数据
    updateKpi = (kpiItem,type,state)=> {
        let saveDate = [];
        let updateDataKpi = [];
        //let updateDataScore = [];
        //let messageType = "";
        let myItem = [];
        //let paraObj = {};


        myItem = Object.values(this.props.managerDetailObj.kpi_detail);
        saveDate = this.getUpdateDate(myItem);
        const {dispatch} = this.props;

        for (var i = 0; i < saveDate.length; i++) {

            if(state == "5"){
                if(saveDate[i].kpi_score == '--') {
                    updateDataKpi.push(
                    {"opt":"update","table":"kpi","data":
                        {
                            "finish": saveDate[i].finish,
                            "percentile_score": saveDate[i].percentile_score,
                            'kpi_state':state},
                            'condition':{"kpi_id": saveDate[i].kpi_id}}
                    )
                } else {
                    updateDataKpi.push(
                        {"opt":"update","table":"kpi","data":
                        {
                            "finish": saveDate[i].finish,
                            "kpi_score": saveDate[i].kpi_score,
                            "percentile_score": saveDate[i].percentile_score,
                            'kpi_state':state},
                            'condition':{"kpi_id": saveDate[i].kpi_id}}
                    )
                }
                if(i==saveDate.length-1){
                  updateDataKpi.push(
                    {"opt":"update","table":"score","data":
                        {

                          'production_score':(parseFloat(this.props.totalScore)+parseFloat(this.props.tyScore)+parseFloat(this.props.jlScore)+parseFloat(this.props.djScore)).toFixed(2)},
                      'condition':{"score_id": this.props.managerDetailObj.score_id}}
                  )
                }

            } else {
                if(saveDate[i].kpi_score == '--') {
                    updateDataKpi.push({
                        "data": {
                            "finish": saveDate[i].finish,
                            "percentile_score": saveDate[i].percentile_score,
                            'kpi_state':state
                        },
                        "condition": {"kpi_id": saveDate[i].kpi_id},
                        "opt":"update",
                        "table":"kpi"
                    });
                } else {
                    updateDataKpi.push({
                        "data": {
                            "finish": saveDate[i].finish,
                            "kpi_score": saveDate[i].kpi_score,
                            "percentile_score": saveDate[i].percentile_score,
                            'kpi_state':state
                        },
                        "condition": {"kpi_id": saveDate[i].kpi_id},
                        "opt":"update",
                        "table":"kpi"
                    });
                }
            }
        }

        if(state == "5") {

            let paraObj = {
                "transjsonarray":JSON.stringify(updateDataKpi)
            };
           dispatch(this.getParam('taskDeatilTMO/saveKpi',paraObj,'保存'));
           //dispatch(this.getParam('taskDeatilTMO/dmUpdateKpi',this.dmSubmit(updateDataKpi,0),'保存'));

        } else {

            updateDataKpi.push({"opt":"update","table":"score","data":
                        {  "score":((parseFloat(this.props.totalScore)+parseFloat(this.props.tyScore))/0.9+parseFloat(this.props.jlScore)).toFixed(2) , "production_score":(parseFloat(this.props.totalScore)+parseFloat(this.props.tyScore)+parseFloat(this.props.jlScore)+parseFloat(this.props.djScore)).toFixed(2), "state": type}
                            ,'condition':{"score_id": this.props.managerDetailObj.score_id}})
            dispatch(this.getParam('taskDeatilTMO/dmUpdateKpi',this.dmSubmit(updateDataKpi,1),'提交'));
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

    creatDMDOM = (kpiItem)=>{

        return (
            kpiItem.length>0?
            <div>
                <p className={Style.dataShow}>
                    <span>确认投资替代额(自有·元) : <i>{this.props.managerDetailObj.confirm_money} </i></span>
                    <span>第三方工作量 (人月): <i>{this.props.managerDetailObj.third_workload} </i></span>
                    <span>确认投资替代额(外包·元) : <i>{this.props.comScoreObj.confirmOutMoney==""?'未生成':this.props.managerDetailObj.confirmOutMoney} </i></span>
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
                        '未生成'
                        :this.props.comScoreObj.annualPeople
                    }
                    </i></span>
                    <span>自有工作量(人月):<i>
                    {
                        this.props.comScoreObj.ownWorkload == ""?
                        '未生成'
                        :this.props.comScoreObj.ownWorkload
                    }
                    </i></span>
                </p>
                <p className={Style.dataShow}>
                    <span>外包工作量(人月):<i>
                    {
                        this.props.comScoreObj.outPersonWorkload == ""?
                        '未生成'
                        :this.props.comScoreObj.outPersonWorkload
                    }
                    </i></span>
                </p>
                {
                    kpiItem.map((item,index)=>{

                        return (
                            <div key={index} className={Style.KpiTypesBox+" "+Style.arr}>
                              <Collapse  bordered={false} defaultActiveKey={['1']}>
                                <Panel header={this.createHearder(item)} key="1">
                                    <Masonry wrapClass={Style.borderR}>
                                        {
                                            item.map((i,index) => <MasonryItem key={index}><KpiItemDM kpi={i}/></MasonryItem>)
                                        }
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

                <div className={Style.submit}>
                    <Button onClick={()=>this.kpiSave(kpiItem,'DM')}>保存</Button>
                    <Popconfirm title="确定要提交吗？" okText="确定" cancelText="取消" onConfirm={()=>this.kpiSubmit(kpiItem)}>
                        <Button  type="primary">提交</Button>
                    </Popconfirm>
                </div>
            </div>
            :<div></div>
        )
    }


    render() {
        let kpiItem = [];
        console.log(123,this.props.managerDetailObj)
    	if(this.props.managerDetailObj.kpi_detail) {
    	    kpiItem = Object.values(this.props.managerDetailObj.kpi_detail);
    	}
    	return this.creatDMDOM(kpiItem)
    }
}

function mapStateToProps (state) {
	const {managerDetailObj,taskObj,comScoreObj,totalScore,tyScore,djScore,jlScore,showSubimt, managerTitleObj, isDM,puDept} = state.taskDeatilTMO;
  	return {
	    managerDetailObj,
	    taskObj,
	    comScoreObj,
        totalScore,
        tyScore,
        djScore,
        jlScore,
        showSubimt,
      managerTitleObj,
      isDM,
      puDept
  	};
}

export default connect(mapStateToProps)(CreatContent);
