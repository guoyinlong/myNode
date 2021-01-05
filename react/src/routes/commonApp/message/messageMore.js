/**
 * 作者：陈红华
 * 创建日期：2017-07-31
 * 邮箱：1045825949@qq.com
 * 文件说明：门户首页消息列表页面
 */
import { connect } from 'dva';
import Cookie from 'js-cookie';
import { Row, Col, Pagination, Select, Icon, Breadcrumb, Radio, Badge } from 'antd';
const Option = Select.Option;
import { Link, routerRedux } from "dva/router";
import MessageBacklogList from '../../../components/commonApp/messageBacklogList.js';
import styles from'../pageContainer.css';
import GoBack from '../../../components/commonApp/goback.js';

class MessageMore extends React.Component {
  state={
    current:1,
    selectName:''
  }
  // 改变页数
  onChange = (page) => {
    const {dispatch} =this.props;
    this.setState({
      current: page
    });
    // 消息
    dispatch({
      type:'messageMore/messageQuery',
      formData:{
        'arg_mess_staff_id_to':Cookie.get('userid'),
        'arg_page_size':10,
        'arg_page_current':page,
        'arg_mess_staff_name_from':this.state.selectName
      }
    })
  }

  // 全部设为已读
  setToRead= (list,allIsReadFlag)=>{
    const {dispatch} =this.props;
    var messIds=[];
    for(let i=0;i<list.length;i++){
      messIds.push(list[i]['mess_id']);
    }
    if(allIsReadFlag==true){  // 全部设为未读
      dispatch({
        type:'messageMore/messageNotReadBat',
        formData:{
          'arg_staff_id':Cookie.get('userid'),
          'arg_mess_ids':messIds.join(','),
          'arg_page_size':10,
          'arg_page_current':this.state.current,
          'arg_mess_staff_name_from':this.state.selectName
        }
      });
    }else{//全部设为已读
      dispatch({
        type:'messageMore/messageReadBat',
        formData:{
          'arg_staff_id':Cookie.get('userid'),
          'arg_mess_ids':messIds.join(','),
          'arg_page_size':10,
          'arg_page_current':this.state.current,
          'arg_mess_staff_name_from':this.state.selectName
        }
      });
    }
  }
  // 点击删除或设为已读/设为未读
  handleMenuClick=(i,tag)=>{
    const {dispatch} =this.props;
    if(tag=='0'){
      if(i['read_flag']=='0'){
        // 设为已读
        dispatch({
          type:'messageMore/messageReadFlag',
          formData:{
            'arg_staff_id':Cookie.get('userid'),
            'arg_mess_id':i.mess_id,
            'arg_page_size':10,
            'arg_page_current':this.state.current,
            'arg_mess_staff_name_from':this.state.selectName
          }
        });
      }else{
        // 设为未读
        dispatch({
          type:'messageMore/messageNotRead',
          formData:{
            'arg_staff_id':Cookie.get('userid'),
            'arg_mess_id':i.mess_id,
            'arg_page_size':10,
            'arg_page_current':this.state.current,
            'arg_mess_staff_name_from':this.state.selectName
          }
        });
      }

    }else if(tag=='1'){
      // 删除消息
      dispatch({
        type:'messageMore/messageDelete',
        formData:{
          'mess_status':'1',
          'mess_id':i.mess_id,
          'arg_page_size':10,
          'arg_page_current':this.state.current,
          'arg_mess_staff_name_from':this.state.selectName
        }
      });
    }
  }
  handleChange = (value)=> {
    this.setState({
      selectName: value,
    });
    const {dispatch} =this.props;
    dispatch({
      type:'messageMore/messageQuery',
      formData:{
        'arg_mess_staff_id_to':Cookie.get('userid'),
        'arg_page_size':10,
        'arg_page_current':1,
        'arg_mess_staff_name_from':value
      }
    });
  }
  lookDetail=(item)=>{
    const {dispatch} =this.props;
    // 设为已读
    dispatch({
      type:'messageMore/messageReadFlag',
      formData:{
        'arg_staff_id':Cookie.get('userid'),
        'arg_mess_id':item.mess_id,
        'arg_page_size':10,
        'arg_page_current':this.state.current,
        'arg_mess_staff_name_from':this.state.selectName
      }
    });
    if(item.mess_staff_name_from === '工时管理') {
      dispatch(
        routerRedux.push({
          pathname: 'projectApp/projMonitor/change',
        })
      );
    }
  }
  componentWillMount(){
    const {dispatch} =this.props;
    // 消息
    dispatch({
      type:'messageMore/messageQuery',
      formData:{
        'arg_mess_staff_id_to':Cookie.get('userid'),
        'arg_page_size':10,
        'arg_page_current':1,
        'arg_mess_staff_name_from':''
      }
    });
  }

  getData = (value) => {
    const type = value.target.value;
    const { dispatch } = this.props;
    if(type === 'undo') {
      dispatch(routerRedux.push({
        pathname:'/taskList'
      }));

    } else if(type === 'notice') {
      dispatch(routerRedux.push({
        pathname:'/noticeList'
      }));
    } else if(type === 'draft') {
      dispatch(routerRedux.push({
        pathname:'/draftList'
      }));
    }
  };

  render(){
    const { messageList, unread_count, messageFlag, RowCount }=this.props;
    var allIsReadFlag=false;
    for(var i=0;i<messageList.length;i++){
      if(messageList[i].read_flag=='1'){
        allIsReadFlag=true;
      }
    }
    // const {dispatch}=this.props;
    return(
      <div className={styles['pageContainer']}>
        <Breadcrumb separator=">">
          <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item>消息列表</Breadcrumb.Item>
        </Breadcrumb>
        <Radio.Group className={styles.radioButton} value="notice"
                     onChange={value => this.getData(value)}>
          <Radio.Button value="undo">
            <div style={{ display: 'flex', alignItems: 'center'}}>
              <span>待办</span><Badge count={window.localStorage.getItem('undoList')} style={{ fontSize: '12px', marginLeft: '2px'}}/>
            </div>
          </Radio.Button>
          <Radio.Button value="notice">
            <div style={{ display: 'flex', alignItems: 'center'}}>
              <span>消息</span><Badge count={window.localStorage.getItem('noticeList')} style={{ fontSize: '12px', marginLeft: '2px'}}/>
            </div>
          </Radio.Button>
          <Radio.Button value="draft">草稿</Radio.Button>
        </Radio.Group>
        <h2 style={{textAlign:'center'}}>消息列表</h2>
        <Select defaultValue="全部" style={{ width: 120,marginRight:'10px'}} onChange={this.handleChange}>
          <Option value="">全部</Option>
          <Option value="项目管理">项目管理</Option>
        </Select>
        <span>共{RowCount}条消息&nbsp;&nbsp;未读{unread_count}条</span>
        <span style={{float:'right',color:'#317EF3',cursor:'pointer'}}
        onClick={()=>this.setToRead(messageList,allIsReadFlag)}>{allIsReadFlag?'本页全部设为未读':'本页全部设为已读'}</span>

        <MessageBacklogList
          DataList={messageList}
          dataKey={['content','hasDropDown','mess_date_show']}
          rightContent={{'mess_date_show':'1'}}
          loadFlag={messageFlag}
          lookDetail={this.lookDetail}
          menuClick={this.handleMenuClick}
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
  const { messageList, messageFlag, unread_count, RowCount } = state.messageMore;
  return {
    messageList,
    unread_count,
    messageFlag,
    RowCount
  };
}

export default connect(mapStateToProps)(MessageMore);
