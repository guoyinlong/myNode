/**
 * 作者：李杰双
 * 日期：2017/10/15
 * 邮件：282810545@qq.com
 * 文件说明：19大主题配置
 */

import Login from './login_UI'
import config from '../../utils/config';
import styles from './Login.less';

export default class Login_19da extends Login{
  bg='login_center_19da'
  imgs=[<img className={styles["login_bottom"]} src={config.login_bottom_19da} style={{left:'50%',bottom:'45px',width:'400px',transform:'translateX(-16%)'}}/>,
    <img className={styles["login_left"]} src={config.login_left_19da} style={{width:'45%'}}/>,
    <img className={styles["login_right"]} src={config.login_right_19da} style={{width:'45%'}}/>]
  unicom=<h2 style={{color:'#fff',fontSize:'85px',textShadow:'2px 2px 4px rgba(0,0,0,1)'}}>联通软件研究院</h2>
  timer={
    date:{textShadow:'2px 2px 5px #000000',color:'#fff'},
    time:{color:'#fff'}
  }
}
