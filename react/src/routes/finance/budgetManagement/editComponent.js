/**
 * 作者:张楠华
 * 创建日期：2017-09-13
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：表格编辑
 */
import React from 'react'
import {Icon} from 'antd'
import Styles from './costmainten.less'
export  default  class EditComponent extends React.Component{
  constructor(props){
    super(props);
    this.state={
      ...props
    }
  }
  componentWillReceiveProps(nextProps){
    let {show,edit}=nextProps;
    this.setState({show,edit})
  }
  editHandle=()=>{
    this.setState({
      isEdit:true
    });
  };
  editHandleDone=()=>{
    this.props.onOk();
    this.setState({
      isEdit:false
    })
  };
  cancelHandle=()=>{
    this.props.onCancel();
    this.setState({
      isEdit:false
    })
  };
  render(){
    let {show,edit,isEdit}=this.state;
    return (
      <div className={Styles.editItemWrap} style={{...this.props.style}}>
        {isEdit?edit:show?show:<span>&nbsp;</span>}
        <div className={Styles.btnGroup+" "+(isEdit?Styles.btnShow:'')}>
          {
            this.props. disabled ?
              ''
              :
              isEdit ?
                <span>
                  <Icon type='shijuan-queding' onClick={this.editHandleDone}/>
                  <Icon type='shijuan-quxiao' onClick={this.cancelHandle}/>
                </span>
                :
                <Icon type='bianji' onClick={this.editHandle}/>
          }
        </div>
      </div>
    )
  }
}

