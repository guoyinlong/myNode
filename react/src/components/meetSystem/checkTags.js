/**
 * 作者：李杰双
 * 日期：2017/10/15
 * 邮件：282810545@qq.com
 * 文件说明：会议日期选择组件
 */
import React from 'react'
import {
  Button,
  Tag
} from 'antd';
const { CheckableTag } = Tag;
import  styles from './roomOrder.less'
export default class CheackTabs extends React.Component{
  render(){

    const {tabsData,style}=this.props

    return<div className={styles.orderTabs} style={{...style}}>
      {tabsData.map((i,index)=>{
      return  i.disabled? <Button key={index} disabled={i.disabled}>{i.text}</Button>: <CheckableTag
         key={index}
         checked={i.checked}
         onChange={(checked)=>{
           if(this.props.tabsChange){
             return this.props.tabsChange(checked,index)
           }
           return
         }}
         style={{display:i.show===false?'none':'inline-block'}}
        >
          {i.text}
        </CheckableTag>

      })}
    </div>
  }
}
