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

    render() {
    	let total1 = 0;
        let total = 0;
        let data = [{
        	tScore:0
		}];
		let data1 = [{
        	tScore:0
        }];
		let columns = [{
			title: '生产单元总分',
			dataIndex: 'tScore',
			key: 'tScore',
			width:'70px',
			className:'scoreTh'
		}];
		let columns1 = [{
			title: '一级考核总分',
			dataIndex: 'tScore1',
			key: 'tScore1',
			width:'70px',
			className:'scoreTh'
		}];

		this.props.list.map((item,index)=>{
			columns1.push({
				title: '指标'+(index+1),
				dataIndex: 'tScore1'+index,
				key: 'tScore1'+index,
				width:'70px',
				className:'scoreTh',
				render: (text, record) => (
					<span name={item.kpi_id}>
					{text}
					</span>
				)
			})
			columns.push({
				title: '指标'+(index+1),
				dataIndex: 'tScore'+index,
				key: 'tScore'+index,
				width:'70px',
				className:'scoreTh',
				render: (text, record) => (
					<span name={item.kpi_id}>
					{text}
					</span>
				)
			})

			if(item.kpi_score){
				data[0]['tScore'+index] = item.kpi_score;
				//if(!item.tag && item.tag!= '0') {
				    if(item.kpi_score != '--') {
				        total += parseFloat(item.kpi_score);
				    }
				data1[0]['tScore1'+index] = (item.kpi_score/0.9).toFixed(2);
				//if(!item.tag && item.tag!= '0') {
				    if(item.kpi_score != '--') {
				        total1 += parseFloat(data1[0]['tScore1'+index]);
				    }
				//}
			}

			columns1[0].render = (text, record) => (
			    <span name={item.kpi_type}>
			    {total1.toFixed(2)}
			    </span>
			)


			columns[0].render = (text, record) => (
			    <span name={item.kpi_type}>
			    {total.toFixed(2)}
			    </span>
			)


		});

		return (
			(this.props.list[0].kpi_flag==1||this.props.list[0].kpi_flag==0)?
		    <div>
				<Table bordered size={'small'} columns={columns} dataSource={data} pagination={false}/>
		        <Table bordered size={'small'} columns={columns1} dataSource={data1} pagination={false}/>

		    </div>
			:
			<div>
		        <Table bordered size={'small'} columns={columns} dataSource={data} pagination={false}/>

		    </div>
		  )
    }
}

/*function mapStateToProps (state) {
	const {comScoreObj} = state.taskDeatilPM;
  	return {
	    comScoreObj
  	};
}*/

//export default connect(mapStateToProps)(GetScore);
export default GetScore;
