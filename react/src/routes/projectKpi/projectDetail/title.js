/**
 * 作者：王超
 * 创建日期：2018-3-14
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：项目指标详情页组件
 */
import { connect } from 'dva';
import Style from '../searchDetail.less';
import Content from './content';
import { Icon, Menu, Dropdown } from 'antd';

class CreatTitle extends React.Component {
    constructor(props) {
        super(props);
    }
    
    // 一个项目经理对应多个项目的情况
    state ={
        selectIndex:0
    }
    
    // 初始化数据
	componentWillMount(){
    	//const {dispatch} = this.props;
    	/*dispatch({
            type:'taskDeatilTMO/cleanManagerDetail',
            params:{}
        });*/
    	/*dispatch({
        	type:'taskDeatilTMO/getManagerTitle',
        	params:{
				arg_mgr_id:this.props.pm_id||"",
				arg_season:this.props.season,
				arg_year:this.props.year,
        	}
    	});*/
    }
	
	setDataObj = (key)=> {
    	//const {dispatch} = this.props;
    	
    	/*dispatch({
            type:'taskDeatilTMO/cleanManagerDetail',
            params:{}
        });*/
    	
    	/*dispatch({
        	type:'taskDeatilTMO/getManagerDetail',
        	params:{
				arg_flag:1,
				arg_proj_id:this.props.managerTitleObj[key.key].proj_id,
				arg_season:this.props.season,
				arg_year:this.props.year
        	}
    	});*/
    	/*this.setState({
	      selectIndex: key.key
	    })*/
    }

    render() {
        if(this.props.managerTitleObj.length>0) {
            for(let i=0; i<this.props.managerTitleObj.length; i++) {
                if(this.props.managerTitleObj[i].proj_id == this.props.proj_id) {
                    this.props.managerTitleObj[0] = this.props.managerTitleObj[i];
                }
            }
        }
    	/*let menu = (
    		<Menu onClick={this.setDataObj}>
    		{   
    			this.props.managerTitleObj.map((data,index)=>{
		    		return <Menu.Item key={index}>
				      <a>{data.proj_name}</a>
				    </Menu.Item>
		    	})
    		}
			</Menu>
    	)*/
    	
        return (
           
	    	<div className={Style.projectsBox}>
	    		{
	    			this.props.managerTitleObj[this.state.selectIndex]?
	    			<div className={Style.projectTitle}>
	        	    	<div className={Style.staffInfo}>
	        	    	 <div>
                            {this.props.managerTitleObj[this.state.selectIndex].proj_name||'项目考核指标'}
                          </div>
						  
				          <div>
				            <span><Icon type="nianduhejidu"/>{`${this.props.managerTitleObj[this.state.selectIndex].year}年 ${this.props.managerTitleObj[this.state.selectIndex].season}`}</span>
				            <span><Icon type="xingming"/>{this.props.managerTitleObj[this.state.selectIndex].mgr_name}</span>
				            <span><Icon type="xiangmubianhao"/>{this.props.managerTitleObj[this.state.selectIndex].mgr_id}</span>
				            <span><Icon type="gongxiandu"/>主责部门：{this.props.managerTitleObj[this.state.selectIndex].proj_dept_name}</span>
				          </div>
				        </div>
				        <div className={Style.staffScore}>
				            {
				                this.props.managerTitleObj[this.state.selectIndex].score&&this.props.managerTitleObj[this.state.selectIndex].score != ''?
				                <span>总分：
                                    <span id='totalScore'>{this.props.managerTitleObj[this.state.selectIndex].score}
                                    <svg id="svg" width="80" height="10">
                                      <path d="M0 9 Q37 3, 80 4" stroke="#ff0000" fill="none" style={{strokeWidth:'2px'}}></path>
                                    </svg>
                                    </span>
                                </span>:''
				            }
                            
                        </div>
			        </div>:<div></div>
	    		}
	    		{
	    			this.props.managerTitleObj[this.state.selectIndex]?
	    			<Content season={this.props.season} year={this.props.year} proj_id={this.props.proj_id} pm_id={this.props.pm_id}/>:<div></div>
	    		}
	    	</div>  
        );
    }
}

function mapStateToProps (state) {
	const {managerTitleObj} = state.taskDeatilTMO;
  	return {
	    managerTitleObj
  	};
}

export default connect(mapStateToProps)(CreatTitle);
