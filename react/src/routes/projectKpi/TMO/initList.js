/**
 * 作者：王超
 * 创建日期：2017-11-20
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：项目评价-TMO
 */
import { connect } from 'dva';
import { Table } from 'antd';
import { routerRedux } from 'dva/router';
import styles from '../projectTable.less';

class InitList extends React.Component {
	constructor(props) {
        super(props);
    }
	// 点击进入详情页
    onCellClick = (event) => {
        const{dispatch}=this.props;
        let query={
            year:event.target.getAttribute('data-year'),
            season:event.target.getAttribute('data-season'),
            pm_id:event.target.getAttribute('data-mgrid'),
            proj_id:event.target.id
        }
        dispatch(routerRedux.push({
            pathname:'/projectApp/projexam/examevaluate/projectList/detailKpiTMOLook',query
        }));
    }

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
		        <a onClick={this.onCellClick} id={record.projectId} data-mgrid ={record.pmid} data-season = {record.season} data-year={record.year} href="javascript:;">{record.projectName}</a>
		    </span>
		)
	}, {
        title: '负责人',
        dataIndex: 'pmname',
        key: 'pmname',
    },{
		title: '状态',
		dataIndex: 'projectState',
		key: 'projectState',
		render: (text, record) => (
		    <span>{record.projectState}</span>
		),
	}, {
		title: '考核得分',
		dataIndex: 'projectScore',
		key: 'projectScore',
	}];

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
		} else if(key == 'state') {
			switch(value) {
			    case '2':
                    reVal = '项目经理反馈中';
                    break;
				case '3':
				    reVal = '项目经理反馈中';
				    break;
				case '4':
				    reVal = 'TMO评价中';
				    break;
				case '5':
				    reVal = '部门经理评价中';
				    break;
				case '6':
				    reVal = '考核完成';
				    break;
				default:
				    reVal = '';
			}
		}
		return reVal;
	}

  changeOldText = (key,value)=>{
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
    } else if(key == 'state') {
      switch(value) {
        case '2':
          reVal = '项目经理反馈中';
          break;
        case '3':
          reVal = '项目经理反馈中';
          break;
        case '4':
          reVal = '部门经理评价中';
          break;
        case '5':
          reVal = 'TMO评价中';
          break;
        case '6':
          reVal = '考核完成';
          break;
        default:
          reVal = '';
      }
    }
    return reVal;
  }

	render() {

		let data = [];
		if(this.props.TMOlistObj) {
			data = this.props.TMOlistObj.map((item,index)=>{
				/*if(item.state != '4' || item.state != '5') {
					item.score = "";
				} else if(item.state === '4') {
					item.score = 0;
				} else if(item.state === '5') {
					item.state === item.state;
				}
				*/
				if(item.state != '6') {
				    item.score = "";
				}
				return{
					key:index,
					year:item.year,
					state:item.state,
					pmid:item.mgr_id,
					pmname:item.mgr_name,
					quarter:this.changeText('season',item.season),
					projectName:item.proj_name,
					projectState:((item.year+item.season)<'20204'?this.changeOldText('state',item.state):this.changeText('state',item.state)),
					projectScore:item.score,
					projectId:item.proj_id,
					season:item.season
				}
			})
		}
		return(
			<Table className={styles.orderTable} columns={this.columns} dataSource={data} />
		);
	}
}

function mapStateToProps (state) {
	const { TMOlistObj } = state.deatilKpiT;
  	return {
	    TMOlistObj
  	};
}

export default connect(mapStateToProps)(InitList);
