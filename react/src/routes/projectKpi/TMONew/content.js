/**
 * 作者：王超
 * 创建日期：2018-3-14
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：项目指标详情页组件
 */
import { connect } from 'dva';
import Style from '../searchDetail.less';
import { Collapse, Button, message, Icon, Popconfirm } from 'antd';
import Masonry from './Masonry';
import GetScoreTMO from './getScoreTMO';
import KpiItemTMO from './projectKpiItemTMO';
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

      dispatch(this.getParam('taskDeatilTMO/getManagerDetail',{},''));
      console.log(this.props)
    }

	  // 保存
    kpiSave = ()=> {
      this.updateKpi(this.props.managerDetailObj,"4","3");
    }

    // 提交
    kpiSubmit = ()=> {
      if(document.getElementsByClassName('ant-upload-list-item-info').length>0) {
        this.updateKpi(this.props.managerDetailObj,"5","4");
      } else {
        message.warning('请上传评分依据');
        return
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

    TMOSubmit = (updateDataKpi,flag)=> {

      return {
        arg_tmo_id: window.localStorage.staffid,
        arg_tmo_name: window.localStorage.fullName,
        arg_proj_id: this.props.managerDetailObj.proj_id,
        arg_proj_name: this.props.managerDetailObj.proj_name,
        arg_season: this.props.season,
        arg_year: this.props.year,
        arg_pm_id: this.props.pm_id,
        arg_pm_name: JSON.parse(this.props.taskObj.task_content).create_byname,
        arg_data: JSON.stringify(updateDataKpi),
        arg_taskParam: this.props.taskObj.task_param,
        arg_dept: this.props.puDept,
        arg_flag: flag,
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
      let updateDataKpi = [];
      let paraObj = {};
      const myItem = Object.values(this.props.managerDetailObj.kpi_detail);
      const saveDate = this.getUpdateDate(myItem);
      const { dispatch } = this.props;
      for (var i = 0; i < saveDate.length; i++) {
        if(state == "3"){
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

      if(state == "3") {
        // paraObj = {
        //   "transjsonarray":JSON.stringify(updateDataKpi)
        // };
        // dispatch(this.getParam('taskDeatilTMO/saveKpi',paraObj,'保存'));
          dispatch(this.getParam('taskDeatilTMO/TMOUpdateKpi',this.TMOSubmit(updateDataKpi,0),'保存'));
      } else {
        updateDataKpi.push({"opt":"update","table":"score","data":
        {  "score": this.props.totalScore, "state": type}
          ,'condition':{"score_id": this.props.managerDetailObj.score_id}})
        dispatch(this.getParam('taskDeatilTMO/TMOUpdateKpi',this.TMOSubmit(updateDataKpi,1),'提交'));
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
              <span>确认投资替代额(自有·元) :
                <i>{this.props.managerDetailObj.confirm_money=="" ? '未填写' : this.props.managerDetailObj.confirm_money }</i>
              </span>
              <span>确认投资替代额(外包·元) :
                <i>{this.props.comScoreObj.confirmOutMoney=="" ? '未生成' : this.props.comScoreObj.confirmOutMoney}</i>
              </span>
            </p>
            <p className={Style.dataShow}>
              <span>差旅费用预算(元):
                <i>{this.props.comScoreObj.travelBudgetCost == ""? '未出账' : this.props.comScoreObj.travelBudgetCost}</i>
              </span>
              <span>实际差旅成本(元):
                <i>{this.props.comScoreObj.actualTravelCost == "" ? '未出账' : this.props.comScoreObj.actualTravelCost}</i>
              </span>
              <span>全成本(元):
                <i>{this.props.comScoreObj.totalCost == "" ? "未出账" : this.props.comScoreObj.totalCost}</i>
              </span>
              <span>年化人数(人年):
                <i>{this.props.comScoreObj.annualPeople == "" ? '未出账' : this.props.comScoreObj.annualPeople}</i>
              </span>
            </p>
            <p className={Style.dataShow}>
              <span>自有工作量(人月):
                <i>{this.props.comScoreObj.ownWorkload == ""? '未出账' : this.props.comScoreObj.ownWorkload}</i>
              </span>
              <span>外包工作量(人月):
                <i>{this.props.comScoreObj.outPersonWorkload == "" ? '未出账' : this.props.comScoreObj.outPersonWorkload}</i>
              </span>
              <span>第三方工作量 (人月):
                <i>{this.props.managerDetailObj.third_workload=="" ? '未填写' : this.props.managerDetailObj.third_workload}</i>
              </span>
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
              <UploadFile scoreId={this.props.managerDetailObj.score_id} name={this.props.managerDetailObj.file_name} path={this.props.managerDetailObj.file_relativepath}/>
            </div>
            <div className={Style.submit}>
              <Button onClick={()=>this.kpiSave(kpiItem,'TMO')}>保存</Button>
              <Popconfirm title="确定要提交吗？" okText="确定" cancelText="取消" onConfirm={()=>this.kpiSubmit(kpiItem)}>
                <Button disabled={this.props.showSubimt}  type="primary">提交</Button>
              </Popconfirm>
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
	const {managerDetailObj,taskObj,comScoreObj,showSubimt,totalScore,managerTitleObj,puDept} = state.taskDeatilTMO;
  return {
    managerDetailObj,
    taskObj,
    comScoreObj,
    showSubimt,
    totalScore,
    managerTitleObj,
    puDept
  };
}

export default connect(mapStateToProps)(CreatContent);
