/**
* 作者：任华维
* 日期：2017/12/15
 * 邮箱：renhw21@chinaunicom.cn
* 文件说明：00主题配置
*/

import Login from './login_UI'
import config from '../../utils/config';
import styles from './Login.less';

export default class Login_00 extends Login{
    bg = 'login_00_bg';
    imgs = [
        <img key='2' className={styles["login_left_00"]} src={config.login_left_00}/>,
        <img key='3' className={styles["login_right_00"]} src={config.login_right_00}/>
    ];
    unicom = <h2 style={{color:'#000',fontSize:'85px'}}>联通软件研究院</h2>;
    timer = {
        date:{color:'#000'},
        time:{color:'#000'}
    }
}
