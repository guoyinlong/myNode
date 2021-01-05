/**
 * 作者：王超
 * 创建日期：2017-10-19
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：项目指标详情页组件
 */
import { connect } from 'dva';
import Style from '../searchDetail.less';
import { Collapse,Button,message,Icon,Popconfirm } from 'antd';
import Masonry from '../common/Masonry'
import KpiItem from './projectKpiItem';
import UploadFile from './uploadFile';

const MasonryItem = Masonry.MasonryItem
const Panel = Collapse.Panel;

class CreatHeaderM extends React.Component {
    constructor(props) {
        super(props);
    }
    
    // 初始化数据
	componentWillMount(){
    	const {dispatch} = this.props;
    	dispatch({
        	type:'deatilKpiM/getManagerDetail',
        	params:{
				arg_flag:1,
				arg_proj_id:this.props.proj_id,
				arg_season:this.props.season,
				arg_year:this.props.year
        	}
    	});
    }
    
    createHearder = (item)=> {
    	return (
    		<div className={Style.typeTitle}>
                <div>
                    {item[0].kpi_type}
                </div>
            </div>
    	)
    }
    
    // 保存
    kpiSave = (kpiItem)=> {
    	this.updateKpi(this.props.managerDetailObj,"1","3");
    }
    
    // 提交
    kpiSubmit = (kpiItem)=> {
    	//let submitDate = [];
    	if(document.getElementsByClassName('ant-upload-list-item-info').length>0) {
    		for (var i = 0; i < this.props.managerDetailObj.length; i++) {
    			if(this.props.managerDetailObj[i].kpi_flag=="1") {
    				if(document.getElementById(this.props.managerDetailObj[i].kpi_id).value == "") {
    					message.warning('完成值不能为空');
    					return;
    				}
    				
    			}
            }
    		this.updateKpi(this.props.managerDetailObj,"2","4");
    	} else {
    		message.warning('请上传评分依据');
    	}
    }
    
    getUpdateDate = (kpiItem)=> {
    	let retDate = [];
    	kpiItem.map((item,index)=>{
    		if(document.getElementById(item.kpi_id)) {
    			item.pm_finish = document.getElementById(item.kpi_id).value;
    			retDate.push(item);
    		} else {
    			retDate.push(item)
    		}
    	})
    	return retDate;
    }
    
    // 保存，提交更新数据
    updateKpi = (kpiItem,type,state)=> {
    	let saveDate = [];
    	let updateDataKpi = [];
    	let updateDataScore = [];
    	let messageType = "";
    	
    	if(type == "1") {
    		messageType = "保存";
    	} else {
    		messageType = "提交";
    	}
    	
    	saveDate = this.getUpdateDate(kpiItem);
    	const {dispatch} = this.props;
    	for (var i = 0; i < saveDate.length; i++) {
            updateDataKpi.push({
                "update": {
                    "pm_finish": saveDate[i].pm_finish,
                    'kpi_state':type
                },
                "condition": {"kpi_id": saveDate[i].kpi_id}
            });
        }
    	
    	updateDataScore.push({
            "update": {"state": state},
            "condition": {"score_id":this.props.managerDetailObj[0].score_id }
        });
       
    	dispatch({
        	type:'deatilKpiM/pmUpdateKpi',
        	params:{
				"transjsonarray": JSON.stringify(updateDataKpi)
        	},
        	nextObj:{
        		"transjsonarray": JSON.stringify(updateDataScore)
        	},
        	messageType:messageType,
        	detailPara:{
        		arg_flag:1,
				arg_proj_id:this.props.proj_id,
				arg_season:this.props.season,
				arg_year:this.props.year
        	}
    	});
    }
    
    render() {
    	
    	let kpiItem = [];
    	let arr = [];
    	arr = Array.from(this.props.managerDetailObj);
    	let n = 0;
    	arr.push("");
    	for (let i = 0; i < arr.length-1; i++) {
            if (arr[i].kpi_type != arr[i+1].kpi_type) {
            	//if(arr[i].kpi_type == 'KPI' || arr[i].kpi_type == 'GS') {
            	if(arr[i].kpi_flag == '1') {
            		kpiItem.push(arr.slice(n, i + 1))
            	}
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
        	    	parseInt(this.props.managerDetailObj[0].kpi_state)>1 || this.props.isDis?
        	    	<div className={Style.donwload}>
        	    	    <span>评分依据:</span>
        	    	    <span><Icon type="paper-clip" /><a href={this.props.managerDetailObj[0].file_relativepath}>{this.props.managerDetailObj[0].file_name}</a></span>
        	    	</div>
        	    	:<UploadFile scoreId={this.props.managerDetailObj[0].score_id} name={this.props.managerDetailObj[0].file_name} path={this.props.managerDetailObj[0].file_relativepath}/>
        	    }
        	    
    	        {
    	        	parseInt(this.props.managerDetailObj[0].kpi_state)>1 || this.props.isDis?
    	        	<div></div>
          			:<div className={Style.submit}>
          			     <Button disabled={this.props.isDis} onClick={()=>this.kpiSave(kpiItem)}>保存</Button>
          			     <Popconfirm title="确定要提交吗？" okText="确定" cancelText="取消" onConfirm={()=>this.kpiSubmit()}>
          		             <Button disabled={this.props.isDis} type="primary">提交</Button>
          		         </Popconfirm>
          		     </div>
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
	const {managerDetailObj,isDis} = state.deatilKpiM;
  	return {
	    managerDetailObj,
	    isDis
  	};
}

export default connect(mapStateToProps)(CreatHeaderM);