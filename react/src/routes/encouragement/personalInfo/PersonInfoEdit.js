/**
 * 作者：罗玉棋
 * 日期：2019-09-16
 * 邮件：809590923@qq.com
 * 文件说明：个人信息修改页面组件
 */
import React from 'react'
import { connect } from 'dva';
import {Icon,Tooltip} from 'antd'
import Styles from './personInfoedit.less'
 class PersonInfoEdit extends React.Component{
  constructor(props){
    super(props)
    this.state={
      ...props,
    }

  }
  componentWillReceiveProps(nextProps){
    let {show,edit}=nextProps
    this.setState({show,edit})
  }
  editHandle=()=>{
    let {editCount}=this.props
    editCount=editCount+1
    this.setState({
      isEdit:true,
    })
    this.props.dispatch({
      type: "personalInfo/save",
      payload: {
        editCount
      }
    });
  }
  editHandleDone=()=>{
    this.props.onOk()
    let {uneditCount}=this.props
    uneditCount=uneditCount+1
    this.setState({
      isEdit:false,
    })
    this.props.dispatch({
      type: "personalInfo/save",
      payload: {
        uneditCount
      }
    });
  }
  cancelHandle=()=>{
    this.props.onCancel()
    let {uneditCount}=this.props
    uneditCount=uneditCount+1
    this.setState({
      isEdit:false,
    })
    this.props.dispatch({
      type: "personalInfo/save",
      payload: {
        uneditCount
      }
    });
  }
  getEditIcon=()=>{
    const {init}=this.props;
    return init?
    <Tooltip title={"该行数据正在被审核！"}>
    <Icon type='bianji' style={{color:"gray"}} />
    </Tooltip>
    :<Icon type='bianji' onClick={this.editHandle}/>
  }
  render(){
    let {show,edit,isEdit}=this.state;
    let thatshow=show;
    let flage=thatshow.split("~")[1]=="true"?true:false;

    return (
      <div className={Styles.editItemWrap} style={{...this.props.style}}>
         {isEdit?edit:show?
         (
         show.indexOf("~")>0?
         show.split("~")[0]:show
         )
         :<span>&nbsp;</span>}
        <div className={Styles.btnGroup+" "+(isEdit?Styles.btnShow:'')}>
          {
         flage?
            (isEdit?
              <span>
                <Icon type='shijuan-queding' onClick={this.editHandleDone}/>
                <Icon type='shijuan-quxiao' onClick={this.cancelHandle}/>
              </span>
              :this.getEditIcon()):null
              
          }
        </div>
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
   ...state.personalInfo 
  };
}
export default connect(mapStateToProps)(PersonInfoEdit)
