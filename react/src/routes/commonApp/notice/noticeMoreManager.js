/**
 * 作者：陈红华
 * 创建日期：2017-07-31
 * 邮箱：1045825949@qq.com
 * 文件说明：门户首页公告列表页面（管理员）
 */
import { connect } from 'dva';
import Cookie from 'js-cookie';
import { routerRedux } from 'dva/router';
import {Button,Pagination,Select,Input,Breadcrumb,message} from 'antd';
const Search = Input.Search;
const Option = Select.Option;
import {Link} from 'dva/router';
import MessageBacklogList from '../../../components/commonApp/messageBacklogList.js';
import styles from '../../../components/commonApp/messageBacklogList.css';
import styleC from '../pageContainer.css';
import GoBack from '../../../components/commonApp/goback.js';

class NoticeMoreManager extends React.Component {
  state={
    currentPage:1,
    selectValue:'全部'
  }
  // 改变页数
  onChange = (page) => {
    const {dispatch} =this.props;
    const {selectValue}=this.state;
    this.setState({
      currentPage: page,
    });
    if(selectValue=='全部'){
      dispatch({
        type:'noticeMoreManager/noticeInfoQuery',
        formData:{
          'arguserid':Cookie.get('userid'),
          'arg_page_size':10,
          'arg_page_current':page
        }
      });
    }else if(selectValue=='我的创建'){
      dispatch({
        type:'noticeMoreManager/noticeListByManager',
        formData:{
          arguserid:Cookie.get('userid'),
          arg_page_size:10,
          arg_page_current:page
        }
      });
    }
  }
  goCreateNotice=()=>{
    const {dispatch} =this.props;
    dispatch(routerRedux.push({
      pathname:'/noticeCreate'
    }));
  }
  // 点击编辑或删除
  menuClick=(i,tag)=>{
    const {dispatch} =this.props;
    // 如果点击了编辑 进入编辑页面
    if(tag=='0'){
      dispatch(routerRedux.push({
        pathname:'/noticeModify',
        query:{id:i.ID,title:i.n_title,endDate:i.end_date}
      }));
    }else if(tag=='1'){//如果点击了删除按钮，进行删除操作

    }

  }
  // 点击查看操作
  lookDetail=(item)=>{
    const {dispatch}=this.props;
    // 阅读量
    dispatch({
      type:'noticeMoreManager/readrecordInsert',
      formData:{
        arg_notice_id:item.ID,
        arg_userid:Cookie.get('userid'),
        item:item,
      }
    })
  }
  // 全部公告or我创建的公告
  handleSelectChange=(value)=>{
    const {dispatch}=this.props;
    this.setState({
      selectValue: value,
      currentPage: 1,
    });
    if(value=='全部'){
      dispatch({
        type:'noticeMoreManager/noticeInfoQuery',
        formData:{
          'arguserid':Cookie.get('userid'),
          'arg_page_size':10,
          'arg_page_current':1
        }
      });
    }else if(value=='我的创建'){
      dispatch({
        type:'noticeMoreManager/noticeListByManager',
        formData:{
          arguserid:Cookie.get('userid'),
          arg_page_size:10,
          arg_page_current:1
        }
      });
    }
  }
  // 公告搜素
  searchNotice=(val)=>{
    const {dispatch}=this.props;
    const {selectValue}=this.state;
    if(selectValue=='全部'){
      dispatch({
        type:'noticeMoreManager/noticeInfoQuery',
        formData:{
          arguserid:Cookie.get('userid'),
          arg_page_size:10,
          arg_page_current:1,
          argtitle:val
        }
      });
    }else if(selectValue=='我的创建'){
      dispatch({
        type:'noticeMoreManager/noticeListByManager',
        formData:{
          arguserid:Cookie.get('userid'),
          arg_page_size:10,
          arg_page_current:1,
          argtitle:val
        }
      });
    }
  }
  componentWillMount(){
    const {dispatch} =this.props;
    if(window.sessionStorage.noticeRole=='0'){
      message.info('您没有创建公告的权限，请联系管理员！');
      return;
    }
    // 全部公告
    dispatch({
      type:'noticeMoreManager/noticeInfoQuery',
      formData:{
        arguserid:Cookie.get('userid'),
        arg_page_size:10,
        arg_page_current:1
      }
    });

  }
  render(){
    const{noticeManagerList,noticeManagerFlag}=this.props;
    var RowCount=Number(this.props.RowCount);
    return(
      <div className={window.sessionStorage.noticeRole=='1'?styleC.pageContainer:styleC.noticeJurisdictionUser}>
        <Breadcrumb separator=">">
          <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item>公告信息</Breadcrumb.Item>
        </Breadcrumb>
        <h2 style={{textAlign:'center'}}>公告信息</h2>
        <div>
          <Select defaultValue="全部" style={{ width: 120,marginRight:'10px' }} onChange={this.handleSelectChange}>
            <Option value="全部">全部</Option>
            <Option value="我的创建">我的创建</Option>
          </Select>
          <span>共{RowCount}条公告</span>
          <Button type="primary" onClick={this.goCreateNotice} style={{float:'right',marginLeft:'10px'}}>创建公告</Button>
          <Search
            placeholder="请输入公告标题"
            style={{ width: 300 ,float:'right'}}
            onSearch={(value)=>this.searchNotice(value)}
          />

        </div>
        <MessageBacklogList
          DataList={noticeManagerList}
          dataKey={this.state.selectValue=="我的创建"?['n_title','hasDropDown','readcount','allfabulous','updatetime']:['n_title','readcount','allfabulous','updatetime']}
          loadFlag={noticeManagerFlag}
          currentPage={this.state.currentPage}
          menuItem={'编辑'}
          delHide={true}
          menuClick={this.menuClick}
          rightContent={{'readcount':1,'allfabulous':1,'updatetime':1}}
          lookDetail={this.lookDetail}
        />

        <div style={{textAlign:'center',marginTop:'20px'}}>
          <Pagination
          current={this.state.currentPage}
          onChange={this.onChange}
          total={RowCount}/>
        </div>
        <GoBack />
      </div>
    )
  }
}
function mapStateToProps (state) {
  console.log(state.noticeMoreManager)
  const {noticeManagerList,noticeManagerFlag,RowCount}=state.noticeMoreManager
  return {
    noticeManagerList,
    noticeManagerFlag,
    RowCount
  };
}

export default connect(mapStateToProps)(NoticeMoreManager);
