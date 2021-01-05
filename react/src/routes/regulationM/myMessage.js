/**
 * 作者： 卢美娟
 * 创建日期： 2018-07-05
 * 邮箱: lumj14@chinaunicom.cn
 * 功能： 规章制度中查看详情功能
 */
import React from 'react'
import { Modal,  Form,Input, Button,Row, Col,Card,Avatar,message} from 'antd';
import styles from './ruleRegulation/regulationM.less';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
const { TextArea } = Input;

class MyMessage extends React.Component{
  state = {
    visible: false,
    publicContent:'',
  }

  changeDisplay = (i) => {
    const {dispatch} = this.props;
    var data = this.props.myMessageList;
    data[i].flag = parseInt(data[i].flag) + 1;
    dispatch({
      type: 'myMessage/ReMessagequery',
      data,
    });
  }



  deleteMessage = (floor) => {
    const {dispatch} = this.props;
    dispatch({
      type:'myMessage/leaveMsgDel',
      arg_floor_id: floor,
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
      type: 'myMessage/leaveMsgAdd',
      arg_content: this.state.publicContent,
    })
    this.setState({
      publicContent: '',
    })
  }

  render() {
    const {myMessageList} = this.props;
    var content = () => {
      var res = [];
      if(myMessageList){
        for(let i = 0; i < myMessageList.length; i++){
          var subContent = () => {
            var subRes = [];
            if(myMessageList[i].replys){
              if(myMessageList[i].replys.length > 0){
                for(let j = 0; j < myMessageList[i].replys.length; j++){
                  if(myMessageList[i].replys[j].refer_reply_userid == null){
                    subRes.push(
                      <div style = {{padding:20}} key = {j}>
                        <div><a>{myMessageList[i].replys[j].creater_name}</a> : {myMessageList[i].replys[j].content} </div>
                        <div style = {{float:'right'}}>{myMessageList[i].replys[j].create_date} &nbsp;&nbsp;</div>
                      </div>
                    )
                  }else{
                      subRes.push(
                        <div style = {{padding:20}} key = {j}>
                          <div><a>{myMessageList[i].replys[j].creater_name}</a> 回复 <a>{myMessageList[i].replys[j].refer_reply_username}</a>：{myMessageList[i].replys[j].content}</div>
                          <div style = {{float:'right'}}>{myMessageList[i].replys[j].create_date} &nbsp;&nbsp;</div>
                        </div>
                      )
                  }
                }
              }
            }


            return subRes;
          }
          res.push(
            <Row key = {i}>
              <Col span = {24}>
                <Card>
                  <div style = {{float:'left'}}>
                    <Avatar src={`/authentication/useravatar?userid=${myMessageList[i].creater_id}&mode=stream`} />
                    <div style = {{marginTop:10,marginLeft:-7}}>{myMessageList[i].creater_name}</div>
                  </div>
                  <div className="custom-card" style = {{marginLeft:80,marginTop:15}}>
                    <h3>{myMessageList[i].content}</h3>
                  </div>
                  <div style = {{float:'right',marginTop:30,marginRight:20}}>
                     {myMessageList[i].create_date}&nbsp;&nbsp;
                    <a onClick = {()=>this.changeDisplay(i)}>{myMessageList[i].flag % 2 == '1' ?'收起回复':'查看回复'}</a>&nbsp;&nbsp;
                    <a onClick = {()=>this.deleteMessage(myMessageList[i].floor_id)}>删除</a>
                  </div>

                  <div style = {{marginTop:50,marginLeft:100,display:(myMessageList[i].flag % 2 == '1' ? 'block' : 'none'),background:'#F7F8FA'}}>
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
          <h2 style = {{textAlign:'center'}}>我的留言</h2>
          <div style = {{marginTop:30}}>
            {content()}
          </div>
          <div style = {{marginTop:20}}>
            <div style = {{fontWeight:'bold'}}>发表留言</div>
            <TextArea autosize={{ minRows: 2, maxRows: 6 }} onChange = {this.getContent} value = {this.state.publicContent} style = {{width:'100%',marginLeft:'0%',marginTop:10}}/>
            <div style = {{textAlign:'center',marginTop:20}}><Button type = 'primary' onClick = {this.toPublish}>发表</Button></div>
          </div>
          <div className = {styles.btnBottom}></div>
      </div>
    );
  }
}

function mapStateToProps (state) {
  const {query,myMessageList} = state.myMessage;  //lumj
  return {
    loading: state.loading.models.myMessage,
    query,
    myMessageList
  };
}


export default connect(mapStateToProps)(MyMessage);
