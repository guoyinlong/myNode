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
    	const {dispatch} = this.props;
    	
    	dispatch({
        	type:'deatilPM/getManagerTitle',
        	params:{
				arg_mgr_id:window.localStorage.staffid||"",
				arg_season:this.props.season,
				arg_year:this.props.year,
        	}
    	});
    }
	
	setDataObj = (key)=> {
    	const {dispatch} = this.props;
    	dispatch({
        	type:'deatilPM/cleanManagerDetail',
        	params:{}
    	});
    	dispatch({
        	type:'deatilPM/getManagerDetail',
        	params:{
				arg_flag:1,
				arg_proj_id:this.props.managerTitleObj[key.key].proj_id,
				arg_season:this.props.season,
				arg_pm_id:this.props.managerTitleObj[key.key].mgr_id,
				arg_year:this.props.year
        	}
    	});
    	this.setState({
	      selectIndex: key.key
	    })
    }

    render() {
    	let menu = (
    		<Menu onClick={this.setDataObj}>
    		{   
    			this.props.managerTitleObj.map((data,index)=>{
		    		return <Menu.Item key={index}>
				      <a>{data.proj_name}</a>
				    </Menu.Item>
		    	})
    		}
			</Menu>
    	)
    	
        return (
	    	<div className={Style.projectsBox}>
	    		{
	    			this.props.managerTitleObj[this.state.selectIndex]?
	    			<div className={Style.projectTitle}>
	        	    	<div className={Style.staffInfo}>
	        	    	{
	        	    		this.props.managerTitleObj.length>1?
	        	    		<div>
		        	    		<Dropdown overlay={menu}>
							      <a style={{color:'#000'}}>
							          {this.props.managerTitleObj[this.state.selectIndex].proj_name||'项目考核指标'} <Icon type="down" />
							      </a>
							    </Dropdown>
						    </div>
						    :<div>
					            {this.props.managerTitleObj[this.state.selectIndex].proj_name||'项目考核指标'}
					          </div>
	        	    	}
				          <div>
				            <span><Icon type="nianduhejidu"/>{`${this.props.managerTitleObj[this.state.selectIndex].year}年 ${this.props.managerTitleObj[this.state.selectIndex].season}`}</span>
				            <span><Icon type="xingming"/>{this.props.managerTitleObj[this.state.selectIndex].mgr_name}</span>
				            <span><Icon type="xiangmubianhao"/>{this.props.managerTitleObj[this.state.selectIndex].mgr_id}</span>
				            <span><Icon type="gongxiandu"/>主责部门：{this.props.managerTitleObj[this.state.selectIndex].proj_dept_name}</span>
				          </div>
				        </div>
			        </div>:<div></div>
	    		}
	    		{
	    			this.props.managerTitleObj[this.state.selectIndex]?
	    			<Content season={this.props.season} year={this.props.year} proj_id={this.props.managerTitleObj[this.state.selectIndex].proj_id} pm_id={this.props.managerTitleObj[this.state.selectIndex].mgr_id } check_id={this.props.check_id}/>:<div></div>
	    		}
	    	</div>  
        );
    }
}

function mapStateToProps (state) {
	const {managerTitleObj} = state.deatilPM;
  	return {
	    managerTitleObj
  	};
}

export default connect(mapStateToProps)(CreatTitle);
