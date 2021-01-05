/**
 * 作者：王超
 * 创建日期：2017-10-19
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：项目指标详情页组件
 */
import { connect } from 'dva';
import Style from '../searchDetail.less';
import { Collapse,message,Icon } from 'antd';
import Masonry from '../common/Masonry'
import KpiItem from './projectKpiItem';
import GetScore from './getScore';
import UploadFile from './uploadFile';

const MasonryItem = Masonry.MasonryItem
const Panel = Collapse.Panel;

class CreatHeaderM extends React.Component {
    constructor(props) {
        super(props);
    }
    
    createHearder = (item)=> {
    	return (
    		<div className={Style.typeTitle}>
                <div>
                    {item[0].kpi_type}
                </div>
                {
                	(this.props.TMODetailObj[0].score_state==='4' || this.props.TMODetailObj[0].score_state==='5')?
                	<div className={Style.scoreTable}>
	            		<GetScore list={item}/>
	          		</div>:''
                }
            </div>
    	)
    }
    
    render() {
    	let kpiItem = [];
    	let arr = [];
    	
    	arr = Array.from(this.props.TMODetailObj);
    	let n = 0;
    	arr.push("");
    	for (let i = 0; i < arr.length-1; i++) {
            if (arr[i].kpi_type != arr[i+1].kpi_type) {
            	//if(arr[i].kpi_type == 'KPI' || arr[i].kpi_type == 'GS') {
            		kpiItem.push(arr.slice(n, i + 1))
            	//}
                n = i + 1;
            }
        }
    	
        return (
        	kpiItem.length>0?
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
        	    
        	    {
        	    	(parseInt(this.props.TMODetailObj[0].kpi_state)>3)?
        	    	
        	    	<div className={Style.donwload}>
        	    	    <span>评分依据:</span>
        	    	    <span><Icon type="paper-clip" /><a href={this.props.TMODetailObj[0].file_relativepath}>{this.props.TMODetailObj[0].file_name}</a></span>
        	    	</div>
        	    	:<UploadFile scoreId={this.props.TMODetailObj[0].score_id} name={this.props.TMODetailObj[0].file_name} path={this.props.TMODetailObj[0].file_relativepath}/>
        	    }
		    </div>
		    :<div></div>
        );
    }
}
/*CreatHeader.defaultProps = {
    initialValue: ''
};*/

function mapStateToProps (state) {
	const {TMODetailObj} = state.deatilKpiT;
  	return {
	    TMODetailObj
  	};
}

export default connect(mapStateToProps)(CreatHeaderM);