/**
 * 作者：陈红华
 * 创建日期：2017-07-31
 * 邮箱：1045825949@qq.com
 * 文件说明：门户首页公告详情页面
 */
import { connect } from 'dva';
import Cookie from 'js-cookie';
import {Icon,Spin,Badge,Breadcrumb }from 'antd'
import styles from './noticeDetail.css';
import {Link} from 'dva/router';
import styleC from '../pageContainer.css';
import GoBack from '../../../components/commonApp/goback.js';
import moment from 'moment';

class NoticeDetail extends React.Component{
  state={
    thumbNumber:'0'
  }
  noticeGiveThumbsup=()=>{
    const{dispatch,noticeCntList,isfabulous}=this.props;
    dispatch({
      type:'noticeDetail/noticeGiveThumbsup',
      formData:{
        arg_notice_id:this.props.location.query.id,
        arg_notice_file:noticeCntList[0].n_title,
        arg_userid:Cookie.get('userid'),
        arg_isfabulous:isfabulous=='0'?'1':'0'
      }
    })
  }
  componentWillMount(){
    const{dispatch}=this.props;
    const noticeId=this.props.location.query.id;
    // const noticeTitle=this.props.location.query.n_title;
    // 查询公告内容
    dispatch({
      type:'noticeDetail/noticeCntQuery',
      formData:{
        transjsonarray:JSON.stringify(
          {"condition":{id:noticeId}}
        )
      }
    })
    // 查询公告附件
    dispatch({
      type:'noticeDetail/noticeFileQuery',
      formData:{
        transjsonarray:JSON.stringify(
          {"condition":{nf_notice_id:noticeId,nf_state:'0'}}
        )
      }
    })
    // 查询是否点赞及点赞数
    dispatch({
      type:'noticeDetail/noticeThumbQuery',
      formData:{
        arg_notice_id:noticeId,
        arg_userid:Cookie.get('userid'),
      }
    })
  }
  render(){
    // <span>{noticeFileList.length==0?(noticeFileFlag?<li><Spin/></li>:null):'附件信息：'}</span>
    const{noticeCntList,noticeFileList,noticeFileFlag,noticeCntFlag,noticeThumbNum,isfabulous}=this.props;
    return(
      <div className={styleC['pageContainer']}>
        <Breadcrumb separator=">">
          <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to={this.props.location.query.role=='manager'?'/noticeMoreManager':'noticeMoreUser'}>公告信息</Link></Breadcrumb.Item>
          <Breadcrumb.Item>公告详情</Breadcrumb.Item>
        </Breadcrumb>
        <div className={styles['n_title']}>
          <h2>{noticeCntList[0]?noticeCntList[0].n_title:''}</h2>
          <p style={{margin:'12px'}}>{noticeCntList[0]?noticeCntList[0].createusername+' 创建于 '+moment(noticeCntList[0].updatetime).format("YYYY-MM-DD HH:mm:ss"):''}</p>
        </div>
        <div className={styles['n_content']}>
          {noticeCntList.length==0?(noticeCntFlag?<div><Spin/></div>:null):null}
          <div dangerouslySetInnerHTML={{
                __html:noticeCntList[0]?noticeCntList[0].n_content:""
              }}>
          </div>
        </div>
        <div className={styles.noticeUlContent}>
          {noticeFileList.length==0?(noticeFileFlag?<li><Spin/></li>:null):
            <ul>
              {noticeFileList.map((i,index)=><li key={index}><a href={i.nf_file_path} target='_blank'><Icon type="file-text" style={{fontSize:'18px',marginRight:'3px'}} />{'附件'+(index+1)+'： '+i.nf_file_name}</a></li>)}
            </ul>
          }
        </div>
        <div className={styles.likeOrdis} style={isfabulous=='1'?{color: "#FA7252"}:{color: "#89949b"}}>
          <dl onClick={this.noticeGiveThumbsup}>
            <dt style={{position:'relative'}}>
              <span style={{position:'absolute',top:'-20px',right:'-20px'}}>
                <Badge count={noticeThumbNum} overflowCount={999}/>
              </span>
              <Icon type="like-o" />
            </dt>
            <dd>{isfabulous=='1'?'取消赞':'赞一下'}</dd>
          </dl>
        </div>
        <GoBack />
      </div>
    )
  }
}
function mapStateToProps (state) {
  const{noticeCntList,noticeFileList,noticeFileFlag,noticeCntFlag,noticeThumbNum,isfabulous}=state.noticeDetail
  return {
    noticeCntList,
    noticeFileList,
    noticeFileFlag,
    noticeCntFlag,
    noticeThumbNum,
    isfabulous
  };
}

export default connect(mapStateToProps)(NoticeDetail);
