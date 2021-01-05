/**
 * 作者：任华维
 * 日期：2017-07-31
 * 邮箱：renhw21@chinaunicom.cn
 * 功能：门户菜单列表
 */
import React from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'dva/router';
import config from '../../utils/config';


const SubMenu = Menu.SubMenu;

/**
 * 递归生成菜单配置文件的所有菜单，包括子菜单
 * @param menuArray 菜单数组
 * @param siderFold 是否收缩状态
 * @param parentPath 父菜单的路径
 */
const getMenus = function (menuArray, siderFold, parentPath) {
  const topMenus = menuArray.map(item => item.key);

  return menuArray.map(item => {

    if (item.child) {
      return (
        <SubMenu
          key={item.key}
          title={
            <span>
              {item.icon ? <Icon type={item.icon}/> : ''}
              {siderFold && topMenus.indexOf(item.key) >= 0 ? '' : item.name}
            </span>
          }
        >
          {getMenus(item.child, siderFold, parentPath + item.key + '/')}
        </SubMenu>
      )
    } else {
      return (
        <Menu.Item key={item.key}>
          <Link to={parentPath + item.key}>
            {item.icon ? <Icon type={item.icon}/> : ''}
            {siderFold && topMenus.indexOf(item.key) >= 0 ? '' : item.name}
          </Link>
        </Menu.Item>
      )
    }
  })
}
/**
 * 作者：任华维
 * 创建日期：2017-08-20
 * 功能：菜单列表组件
 */
function Menus ({tabKey, menu, siderFold, location, handleClickNavMenu, className, menuOpenKeys}) {
  const menuItems = getMenus(menu, siderFold, '/' + tabKey + '/');
  const handleClickMenu = (e) => {
      /*if (e.key === "oldProjectManage") {
          const w=window.open('about:blank');
          w.location.href='/ProjectManage/index.html#/mainpage';
      }*/
      if (e.key === "financeCost") {
          const w=window.open('about:blank');
          w.location.href='/finance/index.html#/mainpage';
      }
      // 项目画像
      if (/^(http|https):\/\/.*/i.test(e.key)) {
        const w = window.open('about:blank');
        w.location.href = e.key;
      }
  }
  return (
      <Menu
        className={className}
        mode={siderFold ? 'vertical' : 'inline'}
        theme='dark'
        openKeys={menuOpenKeys}
        onClick={handleClickMenu}
        selectedKeys={menuOpenKeys}
        onOpenChange={(e)=>{handleClickNavMenu(e,tabKey)}}
        defaultOpenKeys={ siderFold ? null : menuOpenKeys }
        defaultSelectedKeys={[location.pathname.split('/').pop() || config.defaultSelectMenu]}
      >
        {menuItems}
      </Menu>
  )
}

export default Menus;
