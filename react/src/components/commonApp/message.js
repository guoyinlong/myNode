/**
 * 作者：李杰双
 * 日期：2017/9/1
 * 邮件：282810545@qq.com
 * 文件说明：消息组件
 */

import 'rc-notification/assets/index.css';
import Notification from 'rc-notification';
const notification = Notification.newInstance();
import { Alert } from 'antd';
import styles from './message.css'
import {INFO_TITLE,WARNIGN_TITLE,SUCCESS_TITLE,ERROR_TITLE} from '../../utils/config'
/*
* message.info(信息(必传),持续时间(非必传 0为不自动消失),标题(非必传))
* @param:desc(string) 说明 必传
* @param:duration(number) 延迟 非必传 默认2s
* @param:title(string) 标题 非必传
* */
function getAlert(title,desc,type) {
  return <div className={styles.messageCustom}>
    <Alert
      message={title}
      description={desc}
      type={type}
      showIcon
    />
  </div>
}
let defaultConfig={
  closable: true,
  style:{
    padding:'0',
    right:'50%',
    top:'50%'
  },
  duration:2
}
export default {
  info(desc,duration=2,title){
    //defaultConfig.duration = duration ? duration : defaultConfig.duration;
    notification.notice({
      ...defaultConfig,
      content:getAlert(title?title:INFO_TITLE,desc,'info'),
      duration
    });
  },
  warning(desc,duration=2,title){
    //defaultConfig.duration = duration ? duration : defaultConfig.duration;
    notification.notice({
      ...defaultConfig,
      content:getAlert(title?title:WARNIGN_TITLE,desc,'warning'),
      duration
    });
  },
  error(desc,duration=2,title){
    //defaultConfig.duration = duration ? duration : defaultConfig.duration;
    notification.notice({
      ...defaultConfig,
      content:getAlert(title?title:ERROR_TITLE,desc,'error'),
      duration
    });
  },
  success(desc,duration=2,title){
    //defaultConfig.duration = duration ? duration : defaultConfig.duration;
    notification.notice({
      ...defaultConfig,
      content:getAlert(title?title:SUCCESS_TITLE,desc,'success'),
      duration
    });
  },
}
