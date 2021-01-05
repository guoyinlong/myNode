/**
 * 作者：任华维
 * 日期：2017-07-31 
 * 邮箱：renhw21@chinaunicom.cn
 * 功能：门户页脚
 */
import React from 'react';
import styles from '../../themes/main.less';
import config  from '../../utils/config';

const Footer = () =>
  <div className={styles.footer}>
    {config.footerText}
  </div>

export default Footer;
