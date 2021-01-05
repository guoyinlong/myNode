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
        selectIndex: 0
    }

    render() {
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
                  <span>
                    <Icon type="nianduhejidu"/>
                    {`${this.props.managerTitleObj[this.state.selectIndex].year}年 ${this.props.managerTitleObj[this.state.selectIndex].season}`}
                  </span>
                  <span><Icon type="xingming"/>{this.props.managerTitleObj[this.state.selectIndex].mgr_name}</span>
                  <span><Icon type="xiangmubianhao"/>{this.props.managerTitleObj[this.state.selectIndex].mgr_id}</span>
                  <span><Icon type="gongxiandu"/>主责部门：{this.props.managerTitleObj[this.state.selectIndex].proj_dept_name}</span>
                </div>
              </div>
              <div className={Style.staffScore}>
                
              </div>
            </div>
            :
            <div></div>
	    		}
	    		{
	    			this.props.managerTitleObj[this.state.selectIndex]?
	    			<Content
              task_id={this.props.task_id}
              check_batchid={this.props.check_batchid}
              season={this.props.season}
              year={this.props.year}
              proj_id={this.props.por_id}
              pm_id={this.props.pm_id}/>
             :
             <div></div>
	    		}
	    	</div>
        );
    }
}

function mapStateToProps (state) {
	const {managerTitleObj,totalScore} = state.taskDeatilTMO;
  	return {
	    managerTitleObj,
	    totalScore
  	};
}

export default connect(mapStateToProps)(CreatTitle);
