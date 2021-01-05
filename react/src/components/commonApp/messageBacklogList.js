/**
 * 作者：陈红华
 * 创建日期：2017-07-31
 * 邮箱：1045825949@qq.com
 * 文件说明：待办页面列表组件
 */
import React from 'react';
import Cookie from 'js-cookie';
import {Menu, Dropdown, Button, Icon,Spin} from 'antd';
import styles from './messageBacklogList.css';

class MessageBacklogList extends React.Component {

  render () {
    const { DataList, dataKey }=this.props;
    return (
      <div>
        <ul className={ this.props.className || styles['MDContainer']}>
          { DataList.map((i,indexP)=>
            <li key={indexP}>
              <div>
                { dataKey.map((k,index) =>
                  <span key={index} className={this.props.rightContent[k]==1 ? styles['MDRightLook'] : ''}>
                    { k == 'hasDropDown' ?
                      <span className={styles['MDRightLook']}>
                        <a onClick={()=>this.props.menuClick(i,'0')} style={{ margin:'0 10px 0 0' }}>
                          {this.props.menuItem?this.props.menuItem:(i['read_flag']=='0'?'设为已读':'设为未读')}
                        </a>
                        <a onClick={()=>this.props.menuClick(i,'1')}>
                          {this.props.delHide?'':'删除'}
                        </a>
                      </span> : ''}
                    <a className={i['read_flag']=='1'?styles['MessageReadFlag']:''}
                       onClick={()=>this.props.lookDetail(i)}>
                      { k == 'readcount' ? <Icon type="eye-o" /> : ''}
                      { k == 'allfabulous' ? <Icon type="like-o" /> : ''}{i[k]}
                    </a>
                  </span>)
                }
              </div>
            </li>)}
          { DataList.length==0 ? (this.props.loadFlag ?
            <div className={styles['loadingContainer']}>
              <Spin tip="Loading..."  size="large"/>
            </div> : <li>查询无记录</li>) : null}
        </ul>
        <div style={{clear:'both'}}></div>
      </div>
    )
  }
}

MessageBacklogList.propTypes={

}

export default MessageBacklogList;
