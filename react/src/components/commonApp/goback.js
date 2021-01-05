/**
 * 作者：陈红华
 * 创建日期：2017-07-31
 * 邮箱：1045825949@qq.com
 * 文件说明：门户首页返回按钮
 */
import {Icon} from 'antd';
import React from 'react';
import { Link } from 'dva/router';


class GoBack extends React.Component {
  GoBack=()=>{
    history.go(-1)
  }
  // <div onClick={this.GoBack}>
  //   <a title="返回">
  //     <Icon type='left-square' style={{fontSize:'50px',position:'fixed',top:'100px',right:'5px'}}/>
  //   </a>
  // </div>
  render () {
    return (
      <span></span>

    )
  }
}

export default GoBack;
