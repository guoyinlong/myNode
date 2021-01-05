/**
 * 作者：李杰双
 * 日期：2017/09/01
 * 邮件：282810545@qq.com
 * 文件说明：个人考核可编辑组件
 */
import React from 'react'
import {Icon} from 'antd'
import Styles from './editComponent.less'
export  default  class EditComponent extends React.Component{
  constructor(props){
    super(props)
    this.state={
      ...props
    }

  }
  componentWillReceiveProps(nextProps){
    let {show,edit}=nextProps
    this.setState({show,edit})
  }

  editHandle=()=>{
    this.setState({
      isEdit:true
    })
    const { init,param } = this.props;

    if(init){
      init(param);
    }
  }

  editHandleDone=()=>{
    this.props.onOk()
    this.setState({
      isEdit:false
    })

  }
  cancelHandle=()=>{
    this.props.onCancel()
    this.setState({
      isEdit:false
    })
  }
  render(){
    let {show,edit,isEdit}=this.state
    //debugger
    return (
      <div className={Styles.editItemWrap} style={{...this.props.style}}>
        {isEdit?edit:show?show:<span>&nbsp;</span>}
        <div className={Styles.btnGroup+" "+(isEdit?Styles.btnShow:'')}>
          {
            isEdit
              ?<span>
                <Icon type='shijuan-queding' onClick={this.editHandleDone}/>
                <Icon type='shijuan-quxiao' onClick={this.cancelHandle}/>
              </span>
              :<Icon type='bianji' onClick={this.editHandle}/>
          }



        </div>
      </div>
    )
  }
}

