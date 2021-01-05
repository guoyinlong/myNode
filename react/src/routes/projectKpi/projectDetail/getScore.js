/**
 * 作者：王超
 * 创建日期：2017-10-19
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：项目指标详情页组件
 */
import { Table } from 'antd';

class GetScore extends React.Component {
    constructor(props) {
        super(props);
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
				className:'scoreTh'
			})
			if(item.kpi_score){
				data[0]['tScore'+index] = item.kpi_score;
				total += parseFloat(item.kpi_score);
			}
			
		});
		data[0].tScore = total.toFixed(2);
		
		return (
		    <div>
		        <Table bordered size={'small'} columns={columns} dataSource={data} pagination={false}/>
		    </div>
		  )
    }
}

export default GetScore;