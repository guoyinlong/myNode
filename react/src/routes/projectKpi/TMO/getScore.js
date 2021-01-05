/**
 * 作者：王超
 * 创建日期：2017-10-19
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：项目指标详情页组件
 */
import { Table } from 'antd';
import { connect } from 'dva';

class GetScore extends React.Component {
    constructor(props) {
        super(props);
    }
    
    setScore = (item,text)=>{
    	
    	if(item.kpi_name === '成本费用预算完成率') {
    		return (parseFloat(this.props.kpi1)*(item.kpi_ratio)/100).toFixed(2);
    	} else if(item.kpi_name === '投资产出收益比') {
    		return (parseFloat(this.props.kpi2)*(item.kpi_ratio)/100).toFixed(2);
    	} else if(item.kpi_name === '人均产能') {
    		return (parseFloat(this.props.kpi3)*(item.kpi_ratio)/100).toFixed(2);
    	} else if(item.kpi_name === '工时偏差率') {
    		return (parseFloat(this.props.kpi4)*(item.kpi_ratio)/100).toFixed(2);
    	} else {
    		return text;
    	}
    }
    
    setSubScore1 = (item,total)=>{
    	if(item.kpi_type === '效益指标') {
    		return this.props.subkpi1;
    	} if(item.kpi_type === '管理指标') {
    		return (parseFloat(this.props.kpi4)*0.07+parseFloat(total)).toFixed(2);
    	} else {
    		return total;
    	}
    }

    render() {
    	
        let total = 0;
        let data = [{
        	tScore:0
        }];
		let columns = [{ 
			title: '总分',
			dataIndex: 'tScore', 
			key: 'tScore', 
			width:'70px', 
			className:'scoreTh'
		}];
		
		this.props.list.map((item,index)=>{
			columns.push({
				title: '指标'+(index+1),
				dataIndex: 'tScore'+index, 
				key: 'tScore'+index, 
				width:'70px', 
				className:'scoreTh',
				render: (text, record) => (
					<span name={item.kpi_id}>
					{this.setScore(item,text)}
					</span>
				)
			})
			
			if(item.kpi_score){
				data[0]['tScore'+index] = item.kpi_score;
				if(!item.tag && item.tag!= '0') {
					total += parseFloat(item.kpi_score);
				}
				
			}
			
			columns[0].render = (text, record) => (
			    <span name={item.kpi_type}>
			    {   
			        this.setSubScore1(item,total.toFixed(2))
			    }
			    </span>
			)
		});
		
		return (
		    <div>
		        <Table bordered size={'small'} columns={columns} dataSource={data} pagination={false}/>
		    </div>
		  )
    }
}

function mapStateToProps (state) {
	const {kpi1,kpi2,kpi3,kpi4,subkpi1} = state.deatilKpiT;
  	return {
	    kpi1,
	    kpi2,
	    kpi3,
	    kpi4,
	    subkpi1
  	};
}

export default connect(mapStateToProps)(GetScore);