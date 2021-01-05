/**
 * 作者：王超
 * 创建日期：2017-11-20
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：项目评价-TMO
 */
import { connect } from 'dva';
import { Steps,Button  } from 'antd';
import styles from '../projectTable.less';
import { routerRedux } from 'dva/router';
const Step = Steps.Step;
const seasonArr = ['第一季度','第二季度','第三季度','第四季度'];

class StartProject extends React.Component {
	constructor(props) {
        super(props);
    }

	showList = ()=>{
		const{dispatch}=this.props;
		let query={
			year:this.props.year,
	        season:this.props.season
	    }
		dispatch(routerRedux.push({
	        pathname:'/projectApp/projexam/examevaluate/projectList',query
	    }));
	}

	startKpi = ()=>{
		const {dispatch} = this.props;
    	dispatch({
        	type:'deatilKpiT/startKpi',
        	params:{
				arg_year:this.props.year,
                arg_season:parseInt(this.props.suspending_season),
                arg_create_by:window.localStorage.userid,
                arg_update_by:window.localStorage.userid,
                arg_state:"0"
        	}
    	});
	}

	buildYearDate = ()=> {
		const {dispatch} = this.props;
    	dispatch({
        	type:'deatilKpiT/buildYearData',
        	params:{
				arg_year:this.props.year
        	}
    	});
	}

	setSeason = ()=> {

		if(this.props.season == '-1' && this.props.showButton) {
			return (
				<h4><Button onClick={this.startKpi} type="primary">开启考核</Button></h4>
			)
		} else if(this.props.season != '-1' && this.props.season != '0') {
			return (
				<h4>当前考核季:{seasonArr[parseInt(this.props.season)-1]}</h4>
			)
		}
	}

	creatIco = ()=>{
		let html = [];
		for(let i=0; i<4; i++) {
			if(i+1 == parseInt(this.props.suspending_season)) {
				if(this.props.season === '-1') {
					html.push(<span key={i} className={styles.progress}>{seasonArr[i]}</span>)
				} else {
					html.push(<span onClick={this.showList} key={i} className={styles.progress+' '+styles.pointer}>{seasonArr[i]}</span>)
				}

			} else {
				html.push(<span key={i} className={styles.finished}>{seasonArr[i]}</span>)
			}
		}
		return html;
	}

	render() {
		return(
			<div className={styles.steps}>
				<h2>{this.props.year}年项目考核</h2>
				{
					this.setSeason()
				}
				<div>
				    {
				    	this.creatIco()
				    }
				</div>
				{
					(this.props.season == '0'&& this.props.showButton)?
					<Button onClick={this.buildYearDate} type="primary">生成年度数据</Button>
					:''
				}

			</div>
		);
	}
}

function mapStateToProps (state) {
	const { year,season,suspending_season,showButton } = state.deatilKpiT;
  	return {
  		year,
	    season,
	    suspending_season,
	    showButton
  	};
}

export default connect(mapStateToProps)(StartProject);
