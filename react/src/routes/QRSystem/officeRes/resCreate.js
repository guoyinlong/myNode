/**
 *  作者: 卢美娟
 *  创建日期: 2018-04-11
 *  邮箱：lumj14@chinaunicom.cn
 *  文件说明：通用模态框，add，edit等
 */
import React from 'react';
import {message,Button,Input,Form,Checkbox,Radio, Upload, Icon, Modal} from 'antd';
import styles from './officeRes.less';
import antdStyles from './editAntd.less';
import request from '../../../utils/request';

class ResCreate extends React.Component {

  state = {
  }


  render(){
      return(
        <div>create res</div>
      )

  }
}

export default Form.create()(ResCreate);
