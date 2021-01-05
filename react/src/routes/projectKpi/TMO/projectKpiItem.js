/**
 * 作者：王超
 * 创建日期：2017-10-19
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：TMO评价详情页
 */
import Style from '../searchDetail.less';
import { connect } from 'dva';
import { Input,InputNumber  } from 'antd';
const { TextArea } = Input;

class KpiItemT extends React.Component {
    constructor(props) {
        super(props);
    }
    
    onBlur = (domId,ratio)=> {
    	let dom = document;
    	if(dom.getElementById(domId).value == "") {
    		dom.getElementById(domId).value = 0;
    		this.changeScore(domId,0,ratio);
    	}
    }
    
    setScore = (kpiName,kpi_ratio,kpiId,type)=>{
    	
    	if(type == '1') {
    		if(kpiName === '成本费用预算完成率'){
	    		return (parseFloat(this.props.kpi1)*(kpi_ratio)/100).toFixed(2);;
	    	} else if(kpiName === '人均产能') {
	    		return (parseFloat(this.props.kpi3)*(kpi_ratio)/100).toFixed(2);;
	    	} else if(kpiName === '投资产出收益比') {
	    		return (parseFloat(this.props.kpi2)*(kpi_ratio)/100).toFixed(2);;
	    	} else if(kpiName === '工时偏差率') {
	    		return (parseFloat(this.props.kpi4)*(kpi_ratio)/100).toFixed(2);;
	    	}
    	} else {
    		if(kpiName === '成本费用预算完成率'){
	    		return parseFloat(this.props.kpi1).toFixed(2);;
	    	} else if(kpiName === '人均产能') {
	    		return parseFloat(this.props.kpi3).toFixed(2);;
	    	} else if(kpiName === '投资产出收益比') {
	    		return parseFloat(this.props.kpi2).toFixed(2);;
	    	} else if(kpiName === '工时偏差率') {
	    		return parseFloat(this.props.kpi4).toFixed(2);;
	    	}
    	}
    	
    }
    
    setInputNumber = ()=> {
    	if(this.props.kpi.score_state ==='3' || this.props.kpi.score_state ==='7') {
    		return (
    			<span id={this.props.kpi.kpi_id}>{this.props.kpi.percentile_score}</span>
    		)
    	} else {
    		if(this.props.kpi.kpi_flag == '2') {
    			if(this.props.kpi.kpi_name.indexOf('约束扣分') != -1) {
    				return (
	    				<div>
	    				    <InputNumber onBlur={()=>{this.onBlur(this.props.kpi.kpi_id,this.props.kpi.kpi_ratio)}} onChange={(value)=>{this.changeScore(this.props.kpi.kpi_id,value,this.props.kpi.kpi_ratio)}} id={this.props.kpi.kpi_id} min={-10} step={0.1} max={0} defaultValue={this.props.kpi.percentile_score}/><span style={{color:'red'}}>（注:只能输入负值)</span>
	    				</div>
	    			)
    			} else {
    				return (
	    				<div>
	    				    <InputNumber onBlur={()=>{this.onBlur(this.props.kpi.kpi_id,this.props.kpi.kpi_ratio)}} onBlur={()=>{this.onBlur(this.props.kpi.kpi_id,this.props.kpi.kpi_ratio)}} onChange={(value)=>{this.changeScore(this.props.kpi.kpi_id,value,this.props.kpi.kpi_ratio)}} id={this.props.kpi.kpi_id} min={0} step={0.1} max={20}  defaultValue={this.props.kpi.percentile_score}/>
	    				</div>
	    			)
    			}
    		} else {
    			return (
    				<div>
    				    <InputNumber onBlur={()=>{this.onBlur(this.props.kpi.kpi_id,this.props.kpi.kpi_ratio)}} onChange={(value)=>{this.changeScore(this.props.kpi.kpi_id,value,this.props.kpi.kpi_ratio)}} id={this.props.kpi.kpi_id} min={0} step={0.1} max={100}  defaultValue={this.props.kpi.percentile_score}/>
    				</div>
    			)
    		}
    	}
    }
    
    // 分数自动计算 
    changeScore = (othis,value,ratio)=>{
    	
    	let dom = document;
    	let kpiItem = [];
    	let arr = this.props.TMODetailObj;
    	let n = 0;
    	let subScore = 0;
    	let totalScore = 0;
    	
    	if(value === "") {
    		return;
    	}
    	
    	arr.push("");
    	for (let i = 0; i < arr.length-1; i++) {
            if (arr[i].kpi_type != arr[i+1].kpi_type) {
                kpiItem.push({
                	key:arr[i].kpi_type,
                	value:arr.slice(n, i + 1)
                })
                n = i + 1;
            }
        }
    	
    	if(dom.getElementsByName(othis).length>0) {
    		dom.getElementsByName(othis)[0].innerHTML = (parseFloat(value)*parseFloat(ratio)/100).toFixed(2);
        }
    	
    	if(dom.getElementsByName('span_'+othis).length>0) {
    		dom.getElementsByName('span_'+othis)[0].innerHTML = (parseFloat(value)*parseFloat(ratio)/100).toFixed(2);
        } 
        
    	kpiItem.map((item,index)=>{
    		if(dom.getElementsByName(item.key).length>0) {
    			for(let i=0; i<item.value.length; i++) {
    				if(item.value[i].kpi_type == item.key) {
    					/*if(item.value[i].tag&&item.value[i].tag === "0") {
    						continue;
    					}*/
    					subScore += parseFloat(dom.getElementsByName(item.value[i].kpi_id)[0].innerHTML);
    				}
    			}
    			dom.getElementsByName(item.key)[0].innerHTML = subScore.toFixed(2);
    			
    			totalScore += parseFloat(subScore);
    			subScore = 0;
    		}
    	})

    	// 计算总分
    	const {dispatch} = this.props;
    	dispatch({
        	type:'deatilKpiT/r_setTotalScore',
        	subScore:totalScore
    	});
    	/*dispatch({
        	type:'deatilKpiT/r_getSubScore'
    	});*/
    }
    
    render() {
    	
        return (
        	<div className={Style.kpiBox}>
        		<div className={Style.kpiItemTitle}>
		        	<div>{this.props.kpi.kpi_name}</div>
		        	{   (this.props.kpi.tag && this.props.kpi.tag === '0')?
			        	<div>得分：<span name={'span_'+this.props.kpi.kpi_id}>{this.setScore(this.props.kpi.kpi_name,this.props.kpi.kpi_ratio,this.props.kpi.kpi_id,'1')}</span></div>
			        	:<div>得分：<span name={'span_'+this.props.kpi.kpi_id}>{this.props.kpi.kpi_score}</span></div>
			        }
		        </div>
		        <div>
			        <span>指标说明：</span>
			        <span>{this.props.kpi.formula}</span>
		        </div>
		        <div>
			        <span>目标值：</span>
			        <span>{this.props.kpi.target}</span>
		        </div>
		        {   (this.props.kpi.kpi_flag === "0")?
		        	''
		        	:<div>
				        <span>完成值：</span>
				        <span>{this.props.kpi.pm_finish}</span>
			        </div>
		        }
		        {
		        	(this.props.kpi.kpi_flag === "0")?
		        	<span name={'f_'+this.props.kpi.kpi_id}></span>
		        	:<div>
				        <span>审核意见：</span>
				        <span>
				        {  
				        	(this.props.kpi.score_state ==='3' || this.props.kpi.score_state ==='7') ?
				        	<span>{this.props.kpi.finish}</span>
				        	:<div><TextArea maxLength={200} name={'f_'+this.props.kpi.kpi_id} defaultValue={this.props.kpi.finish} autosize autosize={{ minRows: 4}}/><span>(最多200字)</span></div>
				        }
				        </span>
			        </div>
		        }
		        
		        {
		        	(this.props.kpi.kpi_flag === "0" && this.props.kpi.tag != undefined)?
		        	<div>
		        		<span>得分：</span>
		        		<span id={this.props.kpi.kpi_id} name={'span_'+this.props.kpi.kpi_id}>{this.setScore(this.props.kpi.kpi_name,this.props.kpi.kpi_ratio,this.props.kpi.kpi_id,'2')}</span><i>(百分制)</i>
		        	</div>
		        	:<div>
				        <span>得分：</span>
				        <span name={'span_'+this.props.kpi.kpi_id}>
				        {  
				        	this.setInputNumber()
				        }
				        </span><i>(百分制)</i>
			        </div>
		        }
		        {
		        	this.props.kpi.kpi_flag == 2?
		        	<div style={{display: 'none'}}>
				        <span>权重：</span>
				        <span>{this.props.kpi.kpi_ratio}</span>
			        </div>
			        :<div>
				        <span>权重：</span>
				        <span>{this.props.kpi.kpi_ratio}</span>
			        </div>
		        }
        	</div>
        );
    }
}

function mapStateToProps (state) {
	const {TMODetailObj,totalScore,financeDate,numberDate,subDate,allFeeSumDate,kpi1,kpi2,kpi3,kpi4} = state.deatilKpiT;
  	return {
	    TMODetailObj,
	    totalScore,
	    financeDate,
	    numberDate,
	    subDate,
	    allFeeSumDate,
	    kpi1,
	    kpi2,
	    kpi3,
	    kpi4
  	};
}

export default connect(mapStateToProps)(KpiItemT);