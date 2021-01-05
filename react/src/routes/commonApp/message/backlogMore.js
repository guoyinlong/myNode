/**
 * 作者：陈红华
 * 创建日期：2017-07-31
 * 邮箱：1045825949@qq.com
 * 文件说明：门户首页待办任务页面
 */
import { Row, Col ,Pagination,Breadcrumb} from 'antd';
import { connect } from 'dva';
import Cookie from 'js-cookie';
import {Link} from 'dva/router';
import MessageBacklogList from '../../../components/commonApp/messageBacklogList.js';
import styles from'../pageContainer.css';
import GoBack from '../../../components/commonApp/goback.js';

class BacklogMore extends React.Component {
  state={current:1}
  // 页数改变
  onChange = (page) => {
    this.setState({
      current: page
    });
  }
  lookDetailB=(i)=>{
    window.open('/ProjectManage/index.html#/mainpage/ts_timesheet/ts_mydeal?moduleId=0','_blank')
  }
  componentWillMount(){
    const {dispatch} =this.props;
    // 待办
    dispatch({
      type:'backlogMore/backlogQuery',
      arg_mgr_id:Cookie.get('userid')
    });
  }


  render(){
    const {backlogList,backlogFlag,RowCount}=this.props;
    return(
      <div className={styles['pageContainer']}>
        <Breadcrumb separator=">">
          <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item>待办任务</Breadcrumb.Item>
        </Breadcrumb>
        <h2 style={{textAlign:'center'}}>待办任务</h2>
        <p>共{RowCount}条待办记录</p>
        <MessageBacklogList
          DataList={backlogList}
          dataKey={['sta_type','mess_date_show']}
          rightContent={{mess_date_show:'1'}}
          loadFlag={backlogFlag}
          lookDetail={this.lookDetailB}
        />
        <div style={{textAlign:'center',marginTop:'20px'}}>
          <Pagination current={this.state.current} total={Number(RowCount)} onChange={this.onChange}/>
        </div>
        <GoBack goUrl={'/commonApp'}/>
      </div>
    )
  }
}
function mapStateToProps (state) {
  const {backlogList,backlogFlag,RowCount} =state.backlogMore;
  return {
    backlogList,
    backlogFlag,
    RowCount
  };
}

export default connect(mapStateToProps)(BacklogMore);
