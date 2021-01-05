/**
 * 作者： 卢美娟
 * 创建日期： 2018-07-03
 * 邮箱: lumj14@chinaunicom.cn
 * 功能： 规章制度中查看详情功能
 */
import React from 'react'
import { Modal,  Form,Input, Button,Row, Col,Card,Avatar,message} from 'antd';
import styles from './regulationM.less';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
const { TextArea } = Input;

class GlobalMessage extends React.Component{
  state = {
    visible: false,
    displayState: 'none',
    replyContent: '',//回复的留言内容
    currentNum: 0, //当前处理的楼数
    realDataRows:[],
    publicContent: '', //发布的留言内容
    replyLevel:1,//回复等级 1-一级；2-二级
    replyLevelNum:0, //回复是是一个楼层中第几个人的回复
  }

  goBack = () => {
    const {dispatch} = this.props;
    dispatch(routerRedux.push({
      pathname:'/adminApp/regulationM/ruleRegulation'
    }));

  }

  changeDisplay = (i) => {
    document.getElementById(`area${i}`).focus(); //没生效，？
    this.setState({
      replyContent:'',
      currentNum:i,
    })
    const {dispatch} = this.props;
    var data = this.props.globalMessageList;
    data[i].flag = parseInt(data[i].flag) + 1;
    dispatch({
      type: 'globalMessage/ReglobalMessagequery',
      data,
    });
  }

  replySub = (i,name,flag,j) => {
    document.getElementById(`area${i}`).focus();
    this.setState({
      replyContent:`回复 ${name}：`,
      currentNum:i,
      replyLevel:flag,
      replyLevelNum:j,
    })
  }

  getContent = (e) => {
    this.setState({
      publicContent: e.target.value,
    })
  }

  toPublish = () => {
    const {dispatch} = this.props;
    if(this.state.publicContent.replace(/\s/g, "").length == 0){
      message.info("留言不能为空！");
      return;
    }
    dispatch({
      type: 'globalMessage/leaveMsgAdd',
      arg_content: this.state.publicContent,
    })
    this.setState({
      publicContent:'',
    })
  }

  getReplyItemContent = (e) => {
    this.setState({
      replyContent: e.target.value,
    })
  }

  publicItemContent = (item) => {
    const {dispatch} = this.props;
    var fdStart = this.state.replyContent.indexOf('回复');
    var finalString = '';
    if(fdStart == 0){
      console.log(this.state.replyContent);
      var strArr = this.state.replyContent.split('：');
      var resArr = [];
      for(let i = 1; i < strArr.length; i++){
        resArr[i-1] = strArr[i];
      }
      finalString = resArr.join(':');
      if(finalString.replace(/\s/g, "").length == 0){
        message.info("留言不能为空！");
        return;
      }
    }
    if(this.state.replyContent.replace(/\s/g, "").length == 0){
      message.info("留言不能为空！");
      return;
    }
    var data = {};
    if(this.state.replyLevel === 1){
      data = {
        arg_floor_id: item.floor_id,
        arg_content: this.state.replyContent,
      }
    }else if(this.state.replyLevel === 2){
      data = {
        arg_floor_id: item.floor_id,
        arg_content: this.state.replyContent,
        arg_refer_reply_id: item.replys[this.state.replyLevelNum.refer_reply_id],
      }
    }

    dispatch({
      type:'globalMessage/leaveMsgReply',
      data,
    })
    this.setState({
      replyContent:'',
    })
  }


  render() {
    const {globalMessageList} = this.props;
    var content = () => {
      var res = [];
      if(globalMessageList){
        for(let i = 0; i < globalMessageList.length; i++){
          var subContent = () => {
            var subRes = [];
            if(globalMessageList[i].replys){
              if(globalMessageList[i].replys.length > 0){
                for(let j = 0; j < globalMessageList[i].replys.length; j++){
                  if(globalMessageList[i].replys[j].refer_reply_userid == null){
                    subRes.push(
                      <div style = {{padding:20}} key = {j}>
                        <div><a>{globalMessageList[i].replys[j].creater_name}</a> : {globalMessageList[i].replys[j].content} </div>
                        <div style = {{float:'right'}}>{globalMessageList[i].replys[j].create_date} &nbsp;&nbsp;<a onClick = {()=>this.replySub(i,globalMessageList[i].replys[j].creater_name,1,j)}>回复</a></div>
                      </div>
                    )
                  }else{
                      subRes.push(
                        <div style = {{padding:20}} key = {j}>
                          <div><a>{globalMessageList[i].replys[j].creater_name}</a> 回复 <a>{globalMessageList[i].replys[j].refer_reply_username}</a>：{globalMessageList[i].replys[j].content}</div>
                          <div style = {{float:'right'}}>{globalMessageList[i].replys[j].create_date} &nbsp;&nbsp;<a onClick = {()=>this.replySub(i,globalMessageList[i].replys[j].creater_name,2,j)}>回复</a></div>
                        </div>
                      )
                  }
                }
              }
            }

            subRes.push(
              <div>
                <div><TextArea autoFocus id = {`area${i}`} ref = {`area${i}`} value = {(this.state.currentNum == i) ? this.state.replyContent:''} autosize={{ minRows: 2, maxRows: 6 }} style = {{width:'92%',marginLeft:'4%',marginTop:10}} onChange = {this.getReplyItemContent}/></div>
                <Button type = 'primary' size = 'small' style = {{float:'right',marginRight:'4%',marginTop:10}} onClick = {()=>this.publicItemContent(globalMessageList[i])}>发表</Button>
                <div style = {{height:50}}></div>
              </div>
            )
            return subRes;
          }
          res.push(
            <Row key = {i}>
              <Col span = {24}>
                <Card>
                  <div style = {{float:'left'}}>
                    <Avatar src={`/authentication/useravatar?userid=${globalMessageList[i].creater_id}&mode=stream`} />
                    <div style = {{marginTop:10,marginLeft:-7}}>{globalMessageList[i].creater_name}</div>
                  </div>
                  <div className="custom-card" style = {{marginLeft:80,marginTop:15}}>
                    <h3>{globalMessageList[i].content}</h3>
                  </div>
                  <div style = {{float:'right',marginTop:30,marginRight:20}}>
                     {globalMessageList[i].create_date}&nbsp;&nbsp;
                    <a onClick = {()=>this.changeDisplay(i)}>{globalMessageList[i].flag % 2 == '1' ?'收起回复':'查看回复'}</a>
                  </div>
                  <div style = {{marginTop:50,marginLeft:100,display:(globalMessageList[i].flag % 2 == '1' ? 'block' : 'none'),background:'#F7F8FA'}}>
                    {subContent()}
                  </div>
                </Card>
              </Col>
            </Row>
          )
        }
      }
      return res;
    }
    return (
      <div className = {styles.pageContainer}>
          <h2 style = {{textAlign:'center'}}>留言</h2>
          <div style = {{marginTop:30}}>
            {content()}
          </div>

          <div style = {{marginTop:20}}>
            <div style = {{fontWeight:'bold'}}>发表留言</div>
            <TextArea autoFocus autosize={{ minRows: 2, maxRows: 6 }} onChange = {this.getContent} value = {this.state.publicContent} style = {{width:'100%',marginLeft:'0%',marginTop:10}}/>
            <div style = {{textAlign:'center',marginTop:20}}><Button type = 'primary' onClick = {this.toPublish}>发表</Button></div>
          </div>

          <Button style = {{marginTop:30}} type = "primary" className = {styles.btnStyle} onClick = {this.goBack}>返回</Button>
          <div className = {styles.btnBottom}></div>
      </div>
    );
  }
}

function mapStateToProps (state) {
  const {query,globalMessageList} = state.globalMessage;  //lumj
  return {
    loading: state.loading.models.globalMessage,
    query,
    globalMessageList
  };
}


export default connect(mapStateToProps)(GlobalMessage);
