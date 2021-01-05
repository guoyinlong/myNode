/**
 * 作者：任华维
 * 日期：2017-07-31
 * 邮箱：renhw21@chinaunicom.cn
 * 功能：门户页头
 */
import React from 'react'
import { Menu, Icon, Popover, Switch, Modal } from 'antd'
import styles from '../../themes/main.less';
import Menus from './Menus';
import ModifyPwd from './ModifyPwd';

import config from '../../utils/config';
import moment from 'moment';
import FontAwesome  from 'react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
const confirm = Modal.confirm;
const SubMenu = Menu.SubMenu
/**
 * 作者：任华维
 * 创建日期：2017-08-20
 * 功能：页头组件
 */
function Header ({changeTheme, theme, user, userid, siderFold, isNavbar, menuPopoverVisible, location, switchMenuPopover, logout, switchSider,showProfileModal,showModifyPwdModal,modifyPwdVisible,modifyPasswordOk,modifyPasswordCancel,addFavorite}) {
    /**
     * 作者：任华维
     * 创建日期：2017-08-20
     * 功能：系统退出
     * @param event
     */
  const handleLogoutClick = e => {
      confirm({
        title: '确定要退出系统吗？',
        onOk() {
          logout()
        },
      });
  };
  /**
   * 作者：任华维
   * 创建日期：2017-08-20
   * 功能：点击菜单
   * @param event
   */
  const handleClickMenu = e => {
    //e.key==='logout' && logout();
  };
  /**
   * 作者：任华维
   * 创建日期：2017-08-20
   * 功能：点击头像
   * @param event
   */
  const handleAvatarClick = e => {
     showProfileModal({arg_userid:userid});
  };
  return (
    <div className={styles.header} style={{background: '#fff url('+config.img_header+') no-repeat 50px 0',backgroundSize:'contain'}}>
      <div className={styles.siderbutton} onClick={switchSider}>
        <Icon type={siderFold ? 'menu-unfold' : 'menu-fold'}/>
      </div>
      <div className={styles.headerLogo}>
        <img src={config.unicom_logo}/>
      </div>
      <Menu className='header-menu' mode='horizontal'>
        <SubMenu key="logo" onTitleClick={handleClickMenu} title={<Icon type="loading" spin style={{width:25}}/>}/>
        <SubMenu title={<FontAwesome name="cog" /*spin*//>}>
          <Menu.Item key='changeProfile'>
            <a onClick={handleAvatarClick}>更换头像</a>
          </Menu.Item>
          <Menu.Item key='changePassword'>
            <a onClick={showModifyPwdModal}>修改密码</a>
          </Menu.Item>
          <Menu.Item key='changeTheme'>
            <a>
                换肤 <Switch defaultChecked={theme !== 'light'} onChange={(checked) => changeTheme({arg_theme:(checked ? "rubix" : "light"),arg_userid:userid})}/>
            </a>
          </Menu.Item>
          <Menu.Item key='logout'>
            <a onClick={handleLogoutClick}>退出登录</a>
          </Menu.Item>
        </SubMenu>
        <SubMenu title='联通软件研究院'/>
      </Menu>
      <ModifyPwd modifyPwdVisible={modifyPwdVisible} modifyPasswordOk={modifyPasswordOk} modifyPasswordCancel={modifyPasswordCancel}></ModifyPwd>
    </div>
  )
}

export default Header;
