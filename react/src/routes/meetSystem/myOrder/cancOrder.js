/**
 * 作者： 卢美娟
 * 创建日期： 2017-08-10
 * 邮箱: lumj14@chinaunicom.cn
 * 功能： 我的预定中取消预定模块
 */

import React from 'react'
import { Popconfirm, message } from 'antd';

/**
 * 作者： 卢美娟
 * 创建日期： 2017-08-10
 * 功能： 我的预定中取消预定类
 */
class cancDetail extends React.Component{
   confirm(e) {
    message.success('Click on Yes');
  }

   cancel(e) {
    message.error('Click on No');
  }

  render() {
    return (
      <Popconfirm title="Are you sure delete this task?" onConfirm={confirm} onCancel={cancel} okText="Yes" cancelText="No">
       <a href="#">Delete</a>
     </Popconfirm>

    );
  }
}

export default cancDetail;
