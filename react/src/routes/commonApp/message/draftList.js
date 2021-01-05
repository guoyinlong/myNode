/**
 * 作者：薛刚
 * 创建日期：2018-12-13
 * 邮箱：xueg@chinaunicom.cn
 * 文件说明：门户首页草稿列表页面
 */
import { connect } from 'dva';
import Cookie from 'js-cookie';
import { Row, Col, Pagination, Select, Icon, Breadcrumb, Radio, Badge } from 'antd';
const Option = Select.Option;
import { Link, routerRedux } from "dva/router";
import MessageBacklogList from '../../../components/commonApp/messageBacklogList.js';
import styles from'../pageContainer.css';
import GoBack from '../../../components/commonApp/goback.js';

class draftList extends React.Component {

  componentWillMount(){
    const { dispatch } = this.props;
    // 获取草稿列表
    dispatch({
      type:'draftList/draftQuery',
      payload: {
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
    const draftlist = [];
    return(
      <div className={styles['pageContainer']}>
        <Breadcrumb separator=">">
          <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item>消息列表</Breadcrumb.Item>
        </Breadcrumb>
        <Radio.Group className={styles.radioButton} value="draft"
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
        <h2 style={{textAlign:'center'}}>草稿列表</h2>
        <MessageBacklogList
          DataList={ draftlist }
          dataKey={['content','hasDropDown','mess_date_show']}
        />
      </div>
    )
  }
}
function mapStateToProps (state) {
  const { messageList, messageFlag, unread_count, RowCount} = state.draftList;
  return {
    messageList,
    unread_count,
    messageFlag,
    RowCount
  };
}

export default connect(mapStateToProps)(draftList);
