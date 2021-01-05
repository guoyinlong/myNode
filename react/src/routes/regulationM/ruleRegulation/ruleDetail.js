/**
 * 作者： 卢美娟
 * 创建日期： 2018-07-05
 * 邮箱: lumj14@chinaunicom.cn
 * 功能： 规章制度中查看详情功能
 */
import React from 'react'
import { Modal,  Form,Input,  Button,Row, Col,Tag} from 'antd';
import styles from './regulationM.less';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
const fileAddress = '/filemanage/filedownload?fileIdList=';

class RuleDetail extends React.Component{
  state = {
    visible: false
  }

  goBack = () => {
    const {dispatch} = this.props;
    dispatch(routerRedux.push({
      pathname:'/adminApp/regulationM/ruleRegulation'
    }));

  }

  downloadFile = (fileid,id) => {
    let url = fileAddress + fileid;
    // window.location.assign(url)
    window.open(url);
    //增加下载记录
    const {dispatch} = this.props;
    dispatch({
      type: 'ruleDetail/regulationDownload',
      arg_regulation_id: id,
    })
  }
  downloadAttach = (fileid) => {
    let url = fileAddress + fileid;
    // window.location.assign(url);
    window.open(url);
  }

  componentWillMount = () => {
    const {dispatch} = this.props;
    let id = this.props.location.query.id;
    var data = {
      arg_id:id
    }
    dispatch({
      type:'ruleDetail/getDetail',
      data,
    })
  }

  render() {
    const {detailLists} = this.props;
    console.log("7777");
    console.log(detailLists);
    var detailList = {};
    if(detailLists){
      detailList = detailLists[0];

      var realkeyword = '';
      var  tempkeyword = JSON.parse(detailList.keywords);
      if(tempkeyword){
        for(let a = 0; a < tempkeyword.length; a++){
          realkeyword = realkeyword + tempkeyword[a] + '  ';
        }
      }
    }


    var getAttachments = (attachments) => {
      var res = [];
      if(attachments){
        var attachmentArr = JSON.parse(attachments)

        for(let i = 0; i < attachmentArr.length; i++){
          res.push(<a onClick = {()=>this.downloadAttach(attachmentArr[i].fileid)}><span style = {{marginRight:10}}>{attachmentArr[i].filename}</span></a>);
        }
      }
      return res;
    }
    return (
      <div className = {styles.pageContainer}>
          <h2 style = {{textAlign:'center'}}>详情页</h2>

            <div className = {styles.detailContent}>

              <Row className = {styles.rowStyle}>
                <Col span = {12}>名称：{detailList.title}</Col>
                <Col span = {12}>制度类别：{detailList.category1_name}</Col>
              </Row>

              <Row className = {styles.rowStyle}>
                <Col span = {12}>级别：{detailList.level_name}</Col>
                <Col span = {12}>性质：{detailList.kind_name}</Col>
              </Row>
              <Row className = {styles.rowStyle}>
                <Col span = {12}>密级：{detailList.is_secret === '0' ? '无':'普通商业秘密'}</Col>
                <Col span = {12}>上传时间：{detailList.publish_date}</Col>
              </Row>
              <Row className = {styles.rowStyle}>
                <Col span = {12}>上传者：{detailList.creater_name}</Col>
                <Col span = {12}>上传部门：{detailList.record_belong_orgname}</Col>
              </Row>
              <Row className = {styles.rowStyle}>
                <Col span = {12}>印发时间：{detailList.print_time}</Col>
                <Col span = {12}>下载量：{detailList.downloadtimes}</Col>
              </Row>
              <Row className = {styles.rowStyle}>
                <Col span = {12}>发文文号：{detailList.doc_num}</Col>
                <Col span = {12}>关键字：{realkeyword}</Col>
              </Row>
              <Row className = {styles.rowStyle}>
                <Col span = {24}>体系：{detailList.sys_name?detailList.sys_name:''}</Col>
              </Row>
              <Row className = {styles.rowStyle}>
                <Col span = {24}>摘要：{detailList.summary}</Col>
              </Row>
              <Row className = {styles.rowStyle}>
                <Col span = {12}>正文：<a onClick = {()=>this.downloadFile(detailList.main_fileid,detailList.id)}>{detailList.main_filename}</a></Col>
              </Row>

              <Row className = {styles.rowStyle}>
                <Col span = {12}>附件：{getAttachments(detailList.attachments)}</Col>
              </Row>

            </div>


          <Button type = "primary" className = {styles.btnStyle} onClick = {this.goBack}>返回</Button>
          <div className = {styles.btnBottom}></div>
      </div>
    );
  }
}

function mapStateToProps (state) {
  const {query,detailLists} = state.ruleDetail;  //lumj
  return {
    loading: state.loading.models.ruleDetail,
    query,
    detailLists
  };
}


export default connect(mapStateToProps)(RuleDetail);
// export default RuleDetail;
