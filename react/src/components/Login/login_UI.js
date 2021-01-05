import React from 'react';
import { Row, Col, Form, Input, Icon, Button, Modal, Select}from 'antd';
import FontAwesome  from 'react-fontawesome';
import LoginForm from './LoginForm';
import LoginFormForgot from './LoginFormForgot';
import LoginFormReset from './LoginFormReset';
import styles from './Login.less';
import config from '../../utils/config';
import moment from 'moment';
import md5 from 'md5';
const FormItem = Form.Item;
const Option = Select.Option;

export default class Login extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      time: null,
      date: null,
      visible: false
    }

  }
  // imgs={
  //   login_bottom:'login_bottom_zhong',
  //   login_left:'login_left_zhong',
  //   login_right:'login_right_zhong',
  //   login_center:'login_center_zhong'
  // }
  // imgs=[<img className={styles["login_bottom"]} src={config.login_bottom} />,
  // <img className={styles["login_left"]} src={config.login_left} />,
  //   <img className={styles["login_right"]} src={config.login_right}/>]

  /**
   * 修改：李杰双
   * 功能：抽出可配置项
   * @param imgs:Array 页面装饰图
   * @param unicom:Component 页面中间标题
   * @param timer:Object timer.data 日期样式 timer.time 时间样式
   * @param bg:String 背景附加类名
   */

  imgs=[]
  //unicom=<img className={styles["login_unicom"]} src={config.login_unicom} />
  unicom=<h2 style={{color:'#fff',fontSize:'85px'}}>联通软件研究院</h2>
  timer={
    date:{color:'#fff'},
    time:{color:'#fff'}
  }
  bg=''
  interval = null;
  onForgotClick = (e) => {
    this.setState({
      visible: true,
    });
  }

  onModalOk = (data) => {
    this.props.onFormResetOk(data);
    this.onModalCancel();
  }
  onModalCancel = () => {
    this.setState({
      visible: false,
    });
  }
  getTimeState() {
    return {
      time: moment().format('HH:mm:ss'),
      //date: moment().format('YYYY-MM-DD')
      date: moment().format('YYYY年MM月DD日')
    };
  }

  back(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.router.goBack();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidMount() {
    this.setState(this.getTimeState());
    this.interval = setInterval(() => {
      this.setState(this.getTimeState());
    }, 500);
  }
  render () {
    const {isLoginFailed, user, resetPwd, email, tokenid, avatarUrl } = this.props;
    //const {login_bottom,login_left,login_right,login_center}=this.imgs
    return (
      <div className={styles['login-page']+' '+styles[this.bg]}>
        {this.imgs}
        {/*<img className={styles["login_bottom"]} src={config[login_bottom]} />*/}
        {/*<img className={styles["login_left"]} src={config[login_left]} />*/}
        {/*<img className={styles["login_right"]} src={config[login_right]} />*/}
        <div className={styles.form}>
          <LoginFormForgot
            visible={this.state.visible}
            onModalOk={this.onModalOk}
            onModalCancel={this.onModalCancel}>
          </LoginFormForgot>
          <Row>
            <Col>
              <div className={styles["login-box"]}>
                {this.unicom}
                {/*<img className={styles["login_unicom"]} src={config.login_unicom} />*/}

              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className={styles["login-box"]}>
                {resetPwd ?
                  <LoginFormReset email={email} tokenid={tokenid} onFormResetOk={this.props.onFormResetOk}></LoginFormReset>
                  :
                  <LoginForm isLoginFailed={isLoginFailed} user={user} profile={avatarUrl} onLoginOk={this.props.onOk} onForgotClick={this.onForgotClick}></LoginForm>
                }
              </div>
            </Col>
          </Row>
          {resetPwd ? ''
            :
            <Row>
              <Col>
                <div className={styles["login-box"]}>
                  <h1 style={{color: '#000', fontSize: 81, fontWeight: 300,letterSpacing:'7px',...this.timer.date}}>{this.state.time}</h1>
                  <div style={{color: '#000',paddingTop:'10px',fontSize:'16px',...this.timer.time}}>{this.state.date}</div>
                </div>
              </Col>
            </Row>
          }
        </div>
      </div>
    )
  }
}
