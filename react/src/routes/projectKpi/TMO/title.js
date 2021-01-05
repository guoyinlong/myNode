/**
 * 作者：王超
 * 创建日期：2017-10-19
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：项目指标详情页组件
 */
import { connect } from 'dva';
import Style from '../searchDetail.less';
import { Icon,InputNumber,Button,Popconfirm,message  } from 'antd';
import Hearder from './hearder';

class CreatTitle extends React.Component {
    constructor(props) {
        super(props);
    }
    
    // 生成UUID
    getUUID = ()=>{
        function S4() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        }
        return (S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4());
    }
    
    submintData = ()=> {
    	
    	const {dispatch} = this.props;
    	let projId = this.props.TMODetailObj[0].proj_id;
    	let year = this.props.TMODetailObj[0].year;
    	let season = this.props.TMODetailObj[0].season;
    	let updateBy = window.localStorage.userid;
    	
    	if(this.props.numberDate === "") {
    		message.warning('年化人数数据未出账！');
    		return;
    	} else if(this.props.hourDate.length == 0) {
    		message.warning('工时数据未出账！');
    		return;
    	} else if(this.props.financeDate === "") {
    		message.warning('成本费用未出账！');
    		return;
    	} else if(this.props.allFeeSumDate === "") {
    		message.warning('全成本未出账！');
    		return;
    	} else if(document.getElementsByClassName('ant-upload-list-item-info').length == 0){
    		message.warning('请上传评分依据');
    		return;
    	} else {
    		this.saveData('submint');
    	}
    }
    
    saveData = (type)=>{
    	
    	// 保存服务所需参数
    	let t_proj_money_info_data1 = {};
    	let t_proj_money_info_data2 = {};
    	let t_proj_kpi_data = [];
    	let t_proj_score_data = {};
    	let projId = this.props.TMODetailObj[0].proj_id;
    	let year = this.props.TMODetailObj[0].year;
    	let score_id = this.props.TMODetailObj[0].score_id;
    	let season = this.props.TMODetailObj[0].season;
    	let dom = document;
    	let objProjother = {'replace_money':'0.00','in_money':'0.00','out_money':'0.00','plan_completion':'0.00'};
    	let objProjother2 = {'replace_money':'0.00','in_money':'0.00','out_money':'0.00','plan_completion':'0.00','proj_id':projId,'year':year,'season':season,'id':this.getUUID()};
    	const {dispatch} = this.props;
    	
    	objProjother.replace_money = dom.getElementById('data1').value==''?'0.00':dom.getElementById('data1').value;
    	objProjother.in_money = dom.getElementById('data2').value==''?'0.00':dom.getElementById('data2').value;
    	objProjother.out_money = dom.getElementById('data3').value==''?'0.00':dom.getElementById('data3').value;
    	objProjother.plan_completion = dom.getElementById('data4').value==''?'0.00':dom.getElementById('data4').value;
    	
    	t_proj_money_info_data1={"opt":"update","table":"other","data":objProjother
                                 ,'condition':{"proj_id":projId,'year':year,'season':season}};
                                 
        t_proj_money_info_data2 = {"opt":"insert","table":"other","data":objProjother2};
        
        this.props.TMODetailObj.map((item,index)=>{
        	if(item != "") {
	        	t_proj_kpi_data.push(
	        		{"opt":"update","table":"kpi","data":
	                {  "percentile_score": String(document.getElementById(item.kpi_id).value||0),
	                    "finish": document.getElementsByName('f_'+item.kpi_id)[0].value||"",
	                    'kpi_state':'3',
	                    "kpi_score":String(document.getElementsByName(item.kpi_id)[0].innerHTML||0)},
	                    'condition':{"kpi_id": item.kpi_id}}
	        	)
        	}
        	
        	
        });
        
        t_proj_score_data = {"opt":"update","table":"score","data":
                        {  "score": String(this.props.subScore.toFixed(2)), "state": '5'}
                            ,'condition':{"score_id": score_id}}
        
    	dispatch({
        	type:'deatilKpiT/isUpDateByTmo',
        	params:{
        		arg_proj_id:projId,
        		arg_year:year,
        		arg_season:season,
        		type:type
        	},
        	data:{
        		t_proj_money_info_data1,
        		t_proj_money_info_data2,
        		t_proj_kpi_data,
        		t_proj_score_data,
        		projId
        		
        	}
    	});
    }
    
    onChangeNum = (id,value)=>{
    	
    	const {dispatch} = this.props;
    	let data1 = document.getElementById('data1').value;
    	let data2 = document.getElementById('data2').value;
    	let data3 = document.getElementById('data3').value;
    	let subData = 0;
    	if(value == "" || value == undefined) {
    		value = 0;
    	}
    	if(data1 == "" || data1 == undefined) {
    		data1 = 0;
    	}
    	if(data2 == "" || data2 == undefined) {
    		data2 = 0;
    	}
    	if(data3 == "" || data3 == undefined) {
    		data3 = 0;
    	}
    	
    	if(id === 'data1') {
    		subData = (value+parseFloat(data2)-parseFloat(data3)).toFixed(2);
    	} else if(id === 'data2') {
    		subData = (parseFloat(data1)+value-parseFloat(data3)).toFixed(2);
    	} else if(id === 'data3'){
    		subData = (parseFloat(data1)+parseFloat(data2)-value).toFixed(2);
    	} else if(id === 'data3'){
    		subData = (parseFloat(data1)+parseFloat(data2)-value).toFixed(2);
    	} else if(id === 'data4'){
    		dispatch({
	        	type:'deatilKpiT/r_tzHour',
	        	tzHour:value
	    	});
	    	dispatch({
	        	type:'deatilKpiT/r_setkpi4Score'
	    	});
    	}
    	
    	if(id === 'data1' || id === 'data2' || id === 'data3') {
    		dispatch({
	        	type:'deatilKpiT/r_changeSubDate',
	        	subDate:subData
	    	});
	    	dispatch({
	        	type:'deatilKpiT/r_setkpi2Score'
	    	});
	    	dispatch({
	        	type:'deatilKpiT/r_setkpi3Score'
	    	});
    	}
    	dispatch({
        	type:'deatilKpiT/r_setSubkpi1'
    	});
    	
    	dispatch({
            type: 'deatilKpiT/r_getSubScore'
        });
    }
   
    render() {
    	
        return (
	    	<div className={Style.projectsBox}>
	    		{
	    			this.props.TMODetailObj[0]?
		    			<div className={Style.projectTitle}>
		        	    	<div className={Style.staffInfo}>
					          <div>
					            {this.props.TMODetailObj[0].proj_name||'项目考核指标'}
					          </div>
					          <div>
					            <span><Icon type="nianduhejidu"/>{`${this.props.TMODetailObj[0].year}年 ${this.props.TMODetailObj[0].season}季度`}</span>
					            <span><Icon type="xingming"/>{this.props.TMODetailObj[0].mgr_name}</span>
					            <span><Icon type="xiangmubianhao"/>{this.props.TMODetailObj[0].mgr_id}</span>
					            <span><Icon type="gongxiandu"/>主责部门：{this.props.TMODetailObj[0].proj_dept_name}</span>
					          </div>
					        </div>
					        {
					        	(this.props.TMODetailObj[0].score_state==='4' || this.props.TMODetailObj[0].score_state==='5')?
					        	<div className={Style.staffScore}>
					          		<span>总分：
					          			<span id='totalScore'>{this.props.subScore.toFixed(2)}
							            <svg id="svg" width="80" height="10">
							              <path d="M0 9 Q37 3, 80 4" stroke="#ff0000" fill="none" style={{strokeWidth:'2px'}}></path>
							            </svg>
					          			</span>
					          		</span>
				        		</div>:''
					        }
					        
				        </div>:''
		    		}
		    		{
		    			this.props.TMODetailObj[0]&&(this.props.TMODetailObj[0].score_state==='4' || this.props.TMODetailObj[0].score_state==='5')?
		    			<div className={Style.dataShow}>
				            <span>成本费用完成额(元):<i>
				            {
				            	this.props.financeDate == ""?
				            	'未出账'
				            	:this.props.financeDate[0].implementation_cost_fee
				            }
				            </i></span>
				            <span>成本费用预算值(元):<i>
				            {
				            	this.props.financeDate == ""?
				            	'未出账'
				            	:this.props.financeDate[0].implementation_cost_budget
				            }
				            </i></span>
				            <span>全成本(元):<i>
				            {
				            	this.props.allFeeSumDate == ""?
				            	'未出账'
				            	:this.props.allFeeSumDate
				            }
				            </i></span>
				            <span>年化人数(人年):<i>
				            {
				            	this.props.numberDate == ""?
				            	"未出账"
				            	:this.props.numberDate[0].population_year
				            }
				            </i></span>
				            <span>本季度工时数(人月):<i>
				            {
				            	this.props.hourDate == ""?
				            	'未出账'
				            	:this.props.hourDate[0].total
				            }
				            </i> </span>
				        </div>:''
		    		}
		    		
			        
			        {
			        	this.props.TMODetailObj[0]&&(this.props.TMODetailObj[0].score_state==='4' || this.props.TMODetailObj[0].score_state==='5')?
			        	<div className={Style.arithmetic}>
			        		<em>确认投资替代额:</em>
			    		    <InputNumber style={{width:'100px'}} id='data1'  min={0} step={0.01} onChange={(e)=>{this.onChangeNum('data1',e)}} defaultValue={this.props.TMODetailObj[0].replace_money}/><em>+</em>
			    		    <InputNumber style={{width:'100px'}} id='data2'  min={0} step={0.01} onChange={(e)=>{this.onChangeNum('data2',e)}} defaultValue={this.props.TMODetailObj[0].in_money}/><em>-</em>
			    		    <InputNumber style={{width:'100px'}} id='data3'  min={0} step={0.01} onChange={(e)=>{this.onChangeNum('data3',e)}} defaultValue={this.props.TMODetailObj[0].out_money}/><em>=</em>
			    		    <span id='subData'>{this.props.subDate}</span>
			    		    <i>(公式:预估投资替代额(元)+转入额(元)-转出额(元)=确认投资替代额(元) )</i>
			    		</div>:''
			        }
			        {
			        	this.props.TMODetailObj[0]&&(this.props.TMODetailObj[0].score_state==='4' || this.props.TMODetailObj[0].score_state==='5')?
				        	<div className={Style.dataShow}>
				            <span>投资替代额确认工时 : <InputNumber id='data4' min={0} step={0.1} onChange={(e)=>{this.onChangeNum('data4',e)}} defaultValue={this.props.tzHour}/> (人月)</span>
				        </div>:''
			        }
	    		<Hearder />
	    		{
	    			this.props.TMODetailObj[0]&&(this.props.TMODetailObj[0].score_state==='4' || this.props.TMODetailObj[0].score_state==='5')?
	    			<div className={Style.submit}>
	  			      <Button onClick={()=>this.saveData('save')}>保存</Button>
	  			      <Popconfirm title="确定要提交吗？" onConfirm={this.submintData} okText="确定" cancelText="取消">
	  		              <Button type="primary">提交</Button>
	  		          </Popconfirm>
	  		        </div>:''
	    		}
	    		
	    	</div>  
        );
    }
}

function mapStateToProps (state) {
	const {TMODetailObj,numberDate,hourDate,financeDate,OUDate,allFeeSumDate,subDate,totalScore,subkpi1,subScore,tzHour} = state.deatilKpiT;
  	return {
	    TMODetailObj,
	    numberDate,
	    hourDate,
	    financeDate,
	    OUDate,
	    allFeeSumDate,
	    subDate,
	    totalScore,
	    subkpi1,
	    subScore,
	    tzHour
  	};
}

export default connect(mapStateToProps)(CreatTitle);
