/**
 * 作者：王超
 * 创建日期：2018-3-14
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：项目指标详情页组件
 */
import { connect } from 'dva';
import Style from '../searchDetail.less';
import { InputNumber,Collapse,Button,message,Icon,Popconfirm } from 'antd';
import Masonry from '../common/Masonry'
import KpiItem from './projectKpiItem';
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
    	dispatch({
        	type:'deatilPM/getManagerDetail',
        	comScorePara:{
                arg_proj_id:this.props.proj_id,
                arg_season:this.props.season,
                arg_year:this.props.year
            },
        	params:{
				arg_flag:1,
				arg_proj_id:this.props.proj_id,
				arg_pm_id:this.props.pm_id,
				arg_season:this.props.season,
				arg_year:this.props.year,
				check_id:this.props.check_id
        	}
    	});
    }

    createHearder = (item)=> {
    	return (
    		<div className={Style.typeTitle}>
                <div>
                    {item[0].kpi_type}
                </div>
            </div>
    	)
    }

    // 保存
    kpiSave = (kpiItem)=> {
    	this.updateKpi(this.props.managerDetailObj,"1","3");
    }

    // 撤回
    kpiRetract = ()=> {
        const {dispatch} = this.props;
        // 待办参数
        let taskPara = '';
        if(this.props.managerDetailObj.arg_taskParam != ''){
            taskPara = this.props.managerDetailObj.arg_taskParam;
        }

      let taskPara2 = '';
      if(this.props.managerDetailObj.arg_taskParam2 != ''){
        taskPara2 = this.props.managerDetailObj.arg_taskParam2;
      }

        dispatch({
            type:'deatilPM/pmRetract',
            params:{
                arg_pm_id:this.props.managerDetailObj.mgr_id,
                arg_pm_name:this.props.managerDetailObj.mgr_name,
                arg_year:this.props.managerDetailObj.year,
                arg_season:this.props.managerDetailObj.season,
                arg_proj_id:this.props.managerDetailObj.proj_id,
                arg_proj_name:this.props.managerDetailObj.proj_name,
                arg_comment:'撤回',
                arg_taskParam:taskPara,
                arg_taskParam2:taskPara2
            },
            detailPara:{
                arg_flag:1,
                arg_proj_id:this.props.proj_id,
                arg_pm_id:this.props.pm_id,
                arg_season:this.props.season,
                arg_year:this.props.year,
                check_id:this.props.check_id
            }
        });
    }

    // 提交
    kpiSubmit = ()=> {
    	let myItem = this.props.managerDetailObj.kpi_detail;

    	if(document.getElementsByClassName('ant-upload-list-item-info').length>0) {

    	    if(document.getElementById('data1').value == '' || document.getElementById('data1').value == undefined) {
    	        message.warning('确认投资替代额不能为空');
                return;
    	    }

    	    if(document.getElementById('data2').value == '' || document.getElementById('data1').value == undefined) {
                message.warning('第三方工作量不能为空');
                return;
            }

            for(let x in myItem) {
                for (let i=0; i<myItem[x].length; i++) {
                    if(myItem[x][i].kpi_flag=="1"||myItem[x][i].kpi_flag=="3") {
                        if(document.getElementById(myItem[x][i].kpi_id).value == "") {
                            message.warning('完成值不能为空');
                            return;
                        }
                    }
                }
            }
    		this.updateKpi(this.props.managerDetailObj,"2","4");
    	} else {
    		message.warning('请上传评分依据');
    	}
    }

    getUpdateDate = (kpiItem)=> {
    	let retDate = [];

    	for(let x in kpiItem) {
            for (let i=0; i<kpiItem[x].length; i++) {
                if(document.getElementById(kpiItem[x][i].kpi_id)) {
                    kpiItem[x][i].pm_finish = document.getElementById(kpiItem[x][i].kpi_id).value;
                    retDate.push(kpiItem[x][i]);
                } else {
                    retDate.push(kpiItem[x][i])
                }
            }
        }
    	return retDate;
    }

    // 保存，提交更新数据
    updateKpi = (kpiItem,type,state)=> {
    	let saveDate = [];
    	let updateDataKpi = [];
    	let updateDataScore = [];
    	let messageType = "";
    	let myItem = [];
    	let paraObj = {};
    	let confirm_money = '';
    	let third_workload = '';

    	let taskPara = '';
        if(this.props.managerDetailObj.arg_taskParam != ''){
            taskPara = this.props.managerDetailObj.arg_taskParam;
        }

    	myItem = Object.values(this.props.managerDetailObj.kpi_detail);
    	saveDate = this.getUpdateDate(myItem);
    	const {dispatch} = this.props;

    	if(document.getElementById('data1').value != undefined) {
    	    confirm_money = document.getElementById('data1').value;
    	}

    	if(document.getElementById('data2').value != undefined) {
            third_workload = document.getElementById('data2').value;
        }

    	for (var i = 0; i < saveDate.length; i++) {
            updateDataKpi.push({
                "update": {
                    "pm_finish": saveDate[i].pm_finish,
                    'kpi_state':type
                },
                "condition": {"kpi_id": saveDate[i].kpi_id}
            });
        }

    	updateDataScore.push({
            "update": {"state": state},
            "condition": {"score_id":this.props.managerDetailObj.score_id }
        });

        if(type == "1") {
            messageType = "保存";
            paraObj = {
                arg_staff_id:this.props.managerDetailObj.mgr_id,
                arg_staff_name:this.props.managerDetailObj.mgr_name,
                arg_season:this.props.managerDetailObj.season,
                arg_year:this.props.managerDetailObj.year,
                arg_proj_id:this.props.managerDetailObj.proj_id,
                arg_proj_name:this.props.managerDetailObj.proj_name,
                arg_pu_dept_name:this.props.managerDetailObj.pu_dept_name,
                arg_confirm_money:confirm_money,
                arg_third_workload:third_workload,
                arg_finish:JSON.stringify(updateDataKpi),
                arg_flag:0,
                arg_taskParam:taskPara
            };
        } else {
            messageType = "提交";
            paraObj = {
                arg_staff_id:this.props.managerDetailObj.mgr_id,
                arg_staff_name:this.props.managerDetailObj.mgr_name,
                arg_season:this.props.managerDetailObj.season,
                arg_year:this.props.managerDetailObj.year,
                arg_proj_id:this.props.managerDetailObj.proj_id,
                arg_proj_name:this.props.managerDetailObj.proj_name,
                arg_pu_dept_name:this.props.managerDetailObj.pu_dept_name,
                arg_confirm_money:confirm_money,
                arg_third_workload:third_workload,
                arg_finish:JSON.stringify(updateDataKpi),
                arg_submit:JSON.stringify(updateDataScore),
                arg_flag:1,
                arg_taskParam:taskPara
            };
        }

    	dispatch({
        	type:'deatilPM/pmUpdateKpi',
        	updatePara:paraObj,
        	detailPara:{
                arg_flag:1,
                arg_proj_id:this.props.proj_id,
                arg_season:this.props.season,
                arg_year:this.props.year,
                arg_pm_id:this.props.pm_id,
                check_id:this.props.check_id
            },
            messageType:messageType
    	});
    }

    render() {
        let kpiItem = [];
    	if(this.props.managerDetailObj.kpi_detail) {
    	    kpiItem = Object.values(this.props.managerDetailObj.kpi_detail);
    	}

        return (
        	kpiItem.length>0?
        	<div>
        	{
                (this.props.retreatMessage != '' && parseInt(this.props.managerDetailObj.kpi_state)==1)?
                <div className={Style.retreatMessage}><span>{`退回原因: ${this.props.retreatMessage}`}</span></div>
                :''
            }
        	   {
                    parseInt(this.props.managerDetailObj.kpi_state)>=2?
                    <p className={Style.dataShow}>
                        <span>确认投资替代额(自有) : <i>{this.props.managerDetailObj.confirm_money} </i></span>
                        <span>第三方工作量 (人月): <i>{this.props.managerDetailObj.third_workload} </i></span>
                        <span>确认投资替代额(外包) : <i>{this.props.comScoreObj.confirmOutMoney==""?'未生成':this.props.comScoreObj.confirmOutMoney} </i></span>
                    </p>:
                    <div className={Style.dataShow}>
                        <span>确认投资替代额(自有) : <InputNumber id='data1' min={0} step={0.1}  defaultValue={this.props.managerDetailObj.confirm_money}/></span>
                        <span>第三方工作量 (人月): <InputNumber id='data2' min={0} step={0.1} defaultValue={this.props.managerDetailObj.third_workload}/></span>
                        <span>确认投资替代额(外包) : <i>{this.props.comScoreObj.confirmOutMoney==""?'未生成':this.props.comScoreObj.confirmOutMoney} </i></span>
                    </div>
                }
            	{
            	<p className={Style.dataShow}>
            	   <span>差旅费用预算(元):<i>
                    {
                        this.props.managerDetailObj.travelBudgetCost == ""?
                        '未出账'
                        :this.props.managerDetailObj.travelBudgetCost
                    }
                    </i> </span>
                    <span>实际差旅成本(元):<i>
                    {
                        this.props.managerDetailObj.actualTravelCost == ""?
                        '未出账'
                        :this.props.managerDetailObj.actualTravelCost
                    }
                    </i></span>
                    <span>全成本(元):<i>
                    {
                        this.props.managerDetailObj.totalCost == ""?
                        "未出账"
                        :this.props.managerDetailObj.totalCost
                    }
                    </i></span>
                    <span>年化人数(人年):<i>
                    {
                        this.props.managerDetailObj.annualPeople == ""?
                        '未生成'
                        :this.props.managerDetailObj.annualPeople
                    }
                    </i></span>
                    <span>自有工作量(人月):<i>
                    {
                        this.props.managerDetailObj.ownWorkload == ""?
                        '未生成'
                        :this.props.managerDetailObj.ownWorkload
                    }
                    </i></span>
                </p>
                }
            	{
            	    <p className={Style.dataShow}>
                        <span>外包工作量(人月):<i>
                        {
                            this.props.managerDetailObj.outPersonWorkload == ""?
                            '未生成'
                            :this.props.managerDetailObj.outPersonWorkload
                        }
                        </i></span>
                    </p>
            	}


        	    {
        	    	kpiItem.map((item,index)=>{
        	    		return (
        	    			<div key={index} className={Style.KpiTypesBox+" "+Style.arr}>
 						      <Collapse  bordered={false} defaultActiveKey={['1']}>
						        <Panel header={this.createHearder(item)} key="1">
							        <Masonry wrapClass={Style.borderR}>
							            {item.map((i,index) => <MasonryItem key={index}><KpiItem kpi={i}/></MasonryItem>)}
						            </Masonry>
						        </Panel>
						      </Collapse>
						    </div>
                        )
                        item[0].kpi_flag="1"
                    })

        	    }

        	    {
        	    	parseInt(this.props.managerDetailObj.kpi_state)>=2 || this.props.isDis?
        	    	<div className={Style.donwload}>
        	    	    <span>评分依据:</span>
        	    	    <span><Icon type="paper-clip" /><a href={this.props.managerDetailObj.file_relativepath}>{this.props.managerDetailObj.file_name}</a></span>
        	    	</div>
        	    	:<UploadFile scoreId={this.props.managerDetailObj.score_id} name={this.props.managerDetailObj.file_name} path={this.props.managerDetailObj.file_relativepath}/>
        	    }

    	        {
    	        	parseInt(this.props.managerDetailObj.kpi_state)>=2 || this.props.isDis?
    	        	<div></div>
          			:<div className={Style.submit}>
          			     <Button disabled={this.props.isDis} onClick={()=>this.kpiSave(kpiItem)}>保存</Button>
          			     <Popconfirm title="确定要提交吗？" okText="确定" cancelText="取消" onConfirm={()=>this.kpiSubmit()}>
          		             <Button disabled={this.props.isDis} type="primary">提交</Button>
          		         </Popconfirm>
          		     </div>
    	        }

    	        {
                    (parseInt(this.props.managerDetailObj.score_state)==4 && parseInt(this.props.managerDetailObj.kpi_state)==2)?
                    <div className={Style.submit}>
                         <Popconfirm title="确定要撤回吗？" okText="确定" cancelText="取消" onConfirm={()=>this.kpiRetract()}>
                             <Button type="primary">撤回</Button>
                         </Popconfirm>
                     </div>:<div></div>
                }
		    </div>
		    :<div></div>
        );
    }
}

function mapStateToProps (state) {
	const {managerDetailObj,isDis,retreatMessage,comScoreObj} = state.deatilPM;
  	return {
	    managerDetailObj,
	    isDis,
	    retreatMessage,
	    comScoreObj
  	};
}

export default connect(mapStateToProps)(CreatContent);
