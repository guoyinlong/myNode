/**
 * 作者：李杰双
 * 日期：2017/11/6
 * 邮件：282810545@qq.com
 * 文件说明：
 */
import React from 'react'
import Styles from './successPage.less'
import { Icon } from 'antd'
import {Link} from 'dva/router'
export default class SuccessPage extends React.Component{
  constructor(props){
    super(props)

    let {startTime=0,}=props;
    this.state={
      startTime,
      time:startTime
    }

  }

  componentDidMount(){
    this.timer=setInterval(()=>{
      let time=this.state.time-1
      if(time===0){
        console.log(this.props)
        this.props.history.replace('/commonApp');
        clearInterval(this.timer)
      }else{
        this.setState({
          time
        })
      }
    },1000)


  }
  componentWillUnmount(){
    clearInterval(this.timer)
  }
  render(){
    let {title, desc='', extra, }=this.props;
    let {time}=this.state
    return(
      <div className={Styles.wrap}>
        <div className={Styles.main}>
          <div className={Styles.Icon}><Icon type="check-circle" /></div>
          <h2>{title}</h2>
          <p>
            {desc}
          </p>

          {extra}
          {
            time?<div className={Styles.timer}>{time}后返回 <Link to={'/commonApp'}>首页</Link></div>:null
          }
        </div>

      </div>
    )
  }

}
