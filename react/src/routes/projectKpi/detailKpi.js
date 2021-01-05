/**
 * 作者：王超
 * 创建日期：2017-11-20
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：指标详情（废弃）
 */
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Table, Icon, Select,Input,Row, Col,Button} from 'antd';
import styles from './projectTable.less';

class projectDetail extends React.Component {
	
	state = {
	    tableTitle:''
	};
	
	// 表头
    columns = [{
	  title: '指标分类',
	  dataIndex: 'kpi_type',
	  key: 'kpi_type',
	  width: 150
	}, {
	  title: '指标名称',
	  dataIndex: 'kpi_name',
	  key: 'kpi_name',
	  width: 150
	}, {
	  title: '计算公式/积分方法',
	  dataIndex: 'formula',
	  key: 'formula',
	  width: 300
	}, {
	  title: '目标值/预设值',
	  dataIndex: 'target',
	  key: 'target',
	  width: 150
	}, {
	  title: 'PM完成值',
	  dataIndex: 'pm_finish',
	  key: 'pm_finish',
	  width: 150
	}, {
	  title: 'TMO完成值',
	  dataIndex: 'finish',
	  key: 'finish',
	  width: 150
	}, {
	  title: 'KPI分数',
	  dataIndex: 'percentile_score',
	  key: 'percentile_score',
	  width: 150
	}, {
	  title: '权重',
	  dataIndex: 'kpi_ratio',
	  key: 'kpi_ratio',
	  width: 150
	}, {
	  title: '得分',
	  dataIndex: 'kpi_score',
	  key: 'kpi_score',
	  width: 150
	}];
	
	// 初始化数据
	componentWillMount(){
    	const {dispatch} = this.props;
    	dispatch({
        	type:'projectKpi/selectList',
        	params:{
				proj_id:this.props.location.query.id,
				season:this.props.location.query.season,
				year:this.props.location.query.year,
        	}
    	});
    }
	
	
	render() {
		let data = [];
		if(this.props.DataRows != null) {
			data = this.props.DataRows.map((item,index)=>{
			    
				return{
					key:index,
					kpi_type:item.kpi_type,
					kpi_name:item.kpi_name,
					formula:item.formula,   
					target:item.target,     
					pm_finish:item.pm_finish?item.pm_finish:"",
					finish:item.finish?item.finish:"",
					percentile_score:item.percentile_score?item.percentile_score:"",
					kpi_ratio:item.kpi_ratio,
					kpi_score:item.kpi_score?item.kpi_score:"",
					proj_name:item.proj_name?item.proj_name:""
				}
			})
		}
		return(
			<div className={styles.container+" "+styles.detail}>
			    <h1 className={styles.title}>{this.props.title}</h1>
			    <h3>项目周期:{this.props.year}年/{this.props.season}</h3>
			    <h4>
			        <span>NO: {this.props.mgr_id}</span>
			        <span>项目经理:  {this.props.mgr_name}</span>    
			        <span>主责部门:  {this.props.proj_dept_name}</span>    
			        <span>总分:  {this.props.score}</span>
			    </h4>
			    <Table className={styles.detailKpiTable} columns={this.columns} dataSource={data} bordered pagination={false} scroll={{y:300}}/>
			    <div className={styles.donwload}><a href={this.props.file_relativepath}>评分依据 : {this.props.file_name}</a></div>
			</div>
		);
	}
	
}

function mapStateToProps (state) {
	const {DataRows,title,file_name,file_relativepath,year,season,mgr_id,mgr_name,proj_dept_name,score} = state.projectKpi;
  	return {
	    DataRows,
        title,
        file_name,
        file_relativepath,
        year,
        season,
        mgr_id,
        mgr_name,
        proj_dept_name,
        score
  	};
}

export default connect(mapStateToProps)(projectDetail);