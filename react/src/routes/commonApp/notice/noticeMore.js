/**
 * 作者：陈红华
 * 创建日期：2017-07-31
 * 邮箱：1045825949@qq.com
 * 文件说明：门户首页公告列表页面
 */
import { connect } from 'dva';
import Cookie from 'js-cookie';
import {Pagination,Input,Breadcrumb } from 'antd';
const Search = Input.Search;
import {Link} from 'dva/router';
import MessageBacklogList from '../../../components/commonApp/messageBacklogList.js';
import styles from '../pageContainer.css';
import GoBack from '../../../components/commonApp/goback.js';

class NoticeMore extends React.Component {
  state={
    currentPage:1
  }
  // 改变页数
  onChange = (page) => {
    const {dispatch} =this.props;
    this.setState({
      currentPage: page
    });
    // 公告查询
    dispatch({
      type:'noticeMore/noticeInfoQuery',
      formData:{
        arguserid:Cookie.get('userid'),
        arg_page_size:10,
        arg_page_current:page
      }
    });
  }
  // 点击查看操作
  lookDetail=(item)=>{
    const {dispatch}=this.props;
    dispatch({
      type:'noticeMore/readrecordInsert',
      formData:{
        arg_notice_id:item.ID,
        arg_userid:Cookie.get('userid'),
        item:item,
      }
    })
  }
  // 公告搜素
  searchNotice=(val)=>{
    const {dispatch}=this.props;
    dispatch({
      type:'noticeMore/noticeInfoQuery',
      formData:{
        arguserid:Cookie.get('userid'),
        arg_page_size:10,
        arg_page_current:1,
        argtitle:val
      }
    });
  }
  componentWillMount(){
    const {dispatch} =this.props;
    // 公告初始查询
    dispatch({
      type:'noticeMore/noticeInfoQuery',
      formData:{
        'arguserid':Cookie.get('userid'),
        'arg_page_size':10,
        'arg_page_current':this.state.currentPage
      }
    });
  }
  render(){
    const {noticeList,noticeFlag,RowCount}=this.props
    return(
      <div className={styles['pageContainer']}>
        <Breadcrumb separator=">">
          <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item>公告信息</Breadcrumb.Item>
        </Breadcrumb>
        <h2 style={{textAlign:'center'}}>公告信息</h2>
        <span>共{RowCount}条公告</span>
        <Search
          placeholder="请输入公告标题"
          style={{ width: 300 ,float:'right'}}
          onSearch={(value)=>this.searchNotice(value)}
        />
        <MessageBacklogList
          DataList={noticeList}
          dataKey={['n_title','readcount','allfabulous','updatetime']}
          loadFlag={noticeFlag}
          rightContent={{'readcount':1,'allfabulous':1,'updatetime':1}}
          lookDetail={this.lookDetail}
        />

        <div style={{textAlign:'center',marginTop:'20px'}}>
          <Pagination
          current={this.state.currentPage}
          onChange={this.onChange}
          total={Number(RowCount)}/>
        </div>
        <GoBack goUrl={'/commonApp'}/>

      </div>
    )
  }
}
function mapStateToProps (state) {
  const {noticeList,noticeFlag,RowCount}=state.noticeMore
  return {
    noticeList,
    noticeFlag,
    RowCount
  };
}

export default connect(mapStateToProps)(NoticeMore);
