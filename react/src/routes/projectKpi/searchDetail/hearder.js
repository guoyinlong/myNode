/**
 * 作者：王超
 * 创建日期：2017-10-19
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：项目指标详情页组件
 */
import Style from '../searchDetail.less';
import { Collapse } from 'antd';
import Masonry from '../common/Masonry'
import KpiItem from './projectKpiItem';
import GetScore from './getScore';

const MasonryItem = Masonry.MasonryItem
const Panel = Collapse.Panel;

class CreatHeader extends React.Component {
    constructor(props) {
        super(props);
    }
    
    createHearder = (item)=> {
    	return (
    		<div className={Style.typeTitle}>
                <div>
                    {item[0].kpi_type}
                </div>
                <div className={Style.scoreTable}>
            		<GetScore list={item}/>
          		</div>
            </div>
    	)
    }
    
    render() {
    	let kpiItem = [];
    	let arr = this.props.date;
    	let n = 0;
    	arr.push("");
    	for (let i = 0; i < arr.length-1; i++) {
            if (arr[i].kpi_type != arr[i+1].kpi_type) {
                kpiItem.push(arr.slice(n, i + 1))
                n = i + 1;
            }
        }
    	
        return (
        	<div>
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
        	    	})
        	    }
		    </div>
        );
    }
}
/*CreatHeader.defaultProps = {
    initialValue: ''
};*/

export default CreatHeader;