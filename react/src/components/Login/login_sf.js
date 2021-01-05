/**
* 作者：任华维
* 日期：2018/02/05
 * 邮箱：renhw21@chinaunicom.cn
* 文件说明：春节主题配置
*/

import Login from './login_UI'
import config from '../../utils/config';
import styles from './Login.less';

export default class Login_sf extends Login{
    bg = 'login_sf_bg';
    imgs = [
        <img key='2' className={styles["login_sf_lt"]} src={config.login_sf_lt}/>,
        <img key='3' className={styles["login_sf_rt"]} src={config.login_sf_rt}/>,
        <img key='4' className={styles["login_sf_lb"]} src={config.login_sf_lb}/>,
        <img key='5' className={styles["login_sf_rb"]} src={config.login_sf_rb}/>
    ];
    unicom = <h2 style={{color:'#000',fontSize:'85px'}}>联通软件研究院</h2>;
    timer = {
        date:{color:'#000'},
        time:{color:'#000'}
    }
}
