/**
 * 作者：王超
 * 创建日期：2017-11-20
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：TMO评价列表展示
 */
import { connect } from 'dva';
import { Table, Icon, Select,Input,Row, Col,Button} from 'antd';
import { routerRedux } from 'dva/router';
import styles from './projectTable.less';

const Option = Select.Option;
// 下拉框默认值
const SELECTDEFLUA = "不限";
// 当前年
const THISYEAR = (new Date().getFullYear()).toString();
// 去年
const LASTYEAR = (new Date().getFullYear()-1).toString()

class projectList extends React.Component {

	state = {
	    t_year:SELECTDEFLUA,
	    t_season:SELECTDEFLUA
	    //t_state:window.localStorage.deptValue || ""
	};

	// 表头设置
    columns = [{
	    title: '年度',
	    dataIndex: 'year',
		key: 'year',
	}, {
		title: '季度',
		dataIndex: 'quarter',
		key: 'quarter',
	}, {
		title: '团队名称',
		dataIndex: 'projectName',
		key: 'projectName',
		render: (text, record) => (
		    <span>
		      <a id={record.projectId} data-mgrid ={record.pmid} data-season = {record.season} data-year={record.year} href="javascript:;">{record.projectName}</a>
		    </span>
		),

		// 点击进入详情页
		onCellClick :(record,event) => {

			if(event.target.getAttribute('data-season') == '0') {
			    return;
			}
			const{dispatch}=this.props;
			let query={
		        year:event.target.getAttribute('data-year'),
		        season:event.target.getAttribute('data-season'),
		        pm_id:event.target.getAttribute('data-mgrid'),
		        proj_id:event.target.id
		    }
			dispatch(routerRedux.push({
		        pathname:'/projectApp/projexam/examquery/detailKpi',query
		    }));
		}
	}, {
		title: '状态',
		dataIndex: 'projectState',
		key: 'projectState',
	},{
		title: '通用指标得分',
		dataIndex: 'kpi_score_0',
		key: 'kpi_score_0',
	},{
		title: '专业指标得分',
		dataIndex: 'kpi_score_1',
		key: 'kpi_score_1',
	}, {
		title: '考核得分',
		dataIndex: 'projectScore',
		key: 'projectScore',
	}];

	// 更改下拉框-年
	yearChange = (value)=> {
		this.setState ({
		    t_year: value?value:'不限'
		})
	}

	// 更改季度下拉框
	seasonChange = (value)=> {
		this.setState ({
		    t_season: value?value:'不限'
		})
	}

	// 更改状态下拉框
	/*stateChange = (value)=> {
		console.log(value);
		this.setState ({
		    t_state: value?value:'不限'
		})
	}*/

	// 提交
	submint = ()=> {
		const {dispatch} = this.props;
    	dispatch({
        	type:'projectKpi/selectList',
        	params:{
        		arg_page_current:'1',
				arg_page_size:'',
				proj_name:document.getElementById('projectName').value||"",
				proj_id:'',
				proj_dept_name:window.localStorage.deptValue||'',
				season:(this.state.t_season=="不限")?"":this.state.t_season,
				year:(this.state.t_year=="不限")?"":this.state.t_year,
				states:JSON.stringify([6])
        	}
    	});
	}

	// 后台数据转换成文本
	changeText = (key,value)=>{
		let reVal = '';
		if(key == 'season') {
			switch(value) {
				case '0':
				    reVal = '年度';
				    break;
				case '1':
				    reVal = '第一季度';
				    break;
				case '2':
				    reVal = '第二季度';
				    break;
				case '3':
				    reVal = '第三季度';
				    break;
				case '4':
				    reVal = '第四季度';
				    break;
				default:
				    reVal;
			}
		}
		/*else if(key == 'state') {
			switch(value) {
				case '3':
				    reVal = '待提交';
				    break;
				case '4':
				    reVal = '待评分';
				    break;
				case '5':
				    reVal = '待确认';
				    break;
				case '6':
				    reVal = '考核完成';
				    break;
				case '7':
				    reVal = '待填写';
				    break;
				default:
				    reVal;
			}
		}*/
		return reVal;
	}

	render() {

		let data = [];
		/*let ouData = [];

		if(this.props.deptInfor != null) {
			ouData = this.props.deptInfor.dept['联通软件研究院本部'];
		}*/

		if(this.props.DataRows != null) {
			data = this.props.DataRows.map((item,index)=>{
				return{
					key:index,
					year:item.year,
					quarter:this.changeText('season',item.season),
					projectName:item.proj_name,
					pmid:item.mgr_id,
					//projectState:this.changeText('state',item.state),
					projectState:'考核完成',
					kpi_score_0:item.kpi_score_0,
					kpi_score_1:item.kpi_score_1,
					projectScore:item.score,
					projectId:item.proj_id,
					season:item.season
				}
			})
		}

		return(

			<div className={styles.container}>
			    <div className={styles.title}>结果查询</div>
			    <div className={styles.screen}>
			        <Row>
			            <Col span={5} className={styles.select}>
					      	年度:&nbsp;&nbsp;<Select value={this.state.t_year} onChange={this.yearChange}>
					      		<Option value=''>{SELECTDEFLUA}</Option>
					      		<Option value={THISYEAR}>{THISYEAR}</Option>
					            <Option value={LASTYEAR}>{LASTYEAR}</Option>
					        </Select>
					    </Col>

					    <Col span={5} className={styles.select}>
						    季度:&nbsp;&nbsp;<Select value={this.state.t_season} onChange={this.seasonChange}>
						      <Option value="">{SELECTDEFLUA}</Option>
						      <Option value="0">年度</Option>
						      <Option value="1">第一季度</Option>
						      <Option value="2">第二季度</Option>
						      <Option value="3">第三季度</Option>
						      <Option value="4">第四季度</Option>
						    </Select>
					    </Col>
					    {
					    	/*<Col span={6} className={styles.select}>
						    部门:&nbsp;&nbsp;
						    <Select value={this.state.t_state} onChange={this.stateChange}>
					    {
					    	ouData.map((item,index)=>{
					    		return (
								    <Option key={index} value={item}>{item.split('-')[1]}</Option>
					    		)
					    	})
					    }
					       </Select>
					    </Col>*/
					    }


					    <Col span={12} className={styles.select}>
					    	团队名称:&nbsp;&nbsp;<Input id="projectName" placeholder="请输入团队名称"/>
					    </Col>

					    <Col span={2} className={styles.select} onClick={this.submint}>
					    	<Button type="primary" >{'查询'}</Button>
					    </Col>
					    {
					    	/*<Col span={2} className={styles.select}>
					    		<Button type="primary" >{'重置'}</Button>
					    	</Col>*/
					    }

			    	</Row>
			    </div>
			    <Table className={styles.orderTable} columns={this.columns} dataSource={data} />
			</div>
		);
	}

}

function mapStateToProps (state) {
	const {DataRows} = state.projectKpi;
  	return {
	    DataRows
  	};
}

export default connect(mapStateToProps)(projectList);
