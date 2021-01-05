/**
 * 作者：任华维
 * 日期：2017-07-31
 * 邮箱：renhw21@chinaunicom.cn
 * 功能：门户布局
 */
import React, { Component } from 'react';
import classnames from 'classnames';
import Asider from './Asider';
import Footer from './Footer';
import Bread from './Bread';
import Header from './Header';
import Profile from './Profile';
import config from '../../utils/config';
import styles from '../../themes/main.less';
import moment from 'moment';
/**
 * 作者：任华维
 * 创建日期：2017-08-20
 * 功能：主页布局
 */
class MainLayout extends Component {
    constructor (props) {
        super(props);
        this.state = {
          time: null
        }
    }
    interval = null;
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    componentDidMount() {
        this.setState({time:moment().format('HH:mm:ss')});
        this.interval = setInterval(() => {
            this.setState({time:moment().format('HH:mm:ss')});
            if (this.props.siderProps.userid !== localStorage.getItem('userid')) {
                window.location.reload();
            }
        }, 500);
    }
    render() {
        const {theme, isNavbar, siderFold, siderProps, headerProps, profileProps, children, location } = this.props;
        const layoutClass = classnames(
            styles[theme],
            styles.layout,
            { [styles.fold]: isNavbar ? false : siderFold },
            { [styles.withnavbar]: isNavbar }
        );

        const asideClass = classnames(
            styles.sider,
            { [styles.light]: false }
        );

        const contentClass = classnames(
            styles.content,
            { [styles.hasBread]: config.needBread }
        )

        const isShowBread = (location.pathname === '/commonApp'
        || location.pathname === '/adminApp'
        || location.pathname === '/financeApp'
        || location.pathname === '/humanApp'
        || location.pathname === '/projectApp') ||
        (location.pathname.indexOf('commonApp') == -1
        && location.pathname.indexOf('adminApp') == -1
        && location.pathname.indexOf('financeApp') == -1
        && location.pathname.indexOf('humanApp') == -1
        && location.pathname.indexOf('projectApp') == -1) ? false : true;

        return (
            <div className={layoutClass}>
                {!isNavbar ?
                <aside className={asideClass}>
                    <div className={styles['siderbar-bg-img']} style={{background: '#fff url('+config.img_sider+') no-repeat fixed left bottom'}}></div>
                    <Asider {...siderProps}/>
                </aside> : ''}
                {/*
                  修改：李杰双
                  功能：加id='main_container' 方便获取dom 实现回到顶部功能
                */}
                <div className={styles.main} id='main_container'>
                    <Profile newKey={moment().valueOf()} {...profileProps} />
                    <Header {...headerProps}/>
                    {config.needBread && isShowBread ? <Bread location={location}/> : ''}
                    <div className={styles.container}>
                        <div className={contentClass} id="content">
                            {children}
                        </div>
                    </div>
                    {config.needFooter ? <Footer/> : ''}
                </div>
            </div>
        )
    }
}

export default MainLayout;
