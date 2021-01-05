/**
 * 作者：任华维
 * 日期：2017-07-31 
 * 邮箱：renhw21@chinaunicom.cn
 * 功能：门户左侧导航菜单
 */
import React from 'react'
import {Icon,Tabs,Avatar,Row,Col} from 'antd'
import { Link } from 'dva/router';
import styles from '../../themes/main.less'
import config  from '../../utils/config';
import Menus from './Menus';
import FontAwesome  from 'react-fontawesome';
const TabPane = Tabs.TabPane;
/**
 * 作者：任华维
 * 创建日期：2017-08-20
 * 功能：定义左边栏
 */
function Asider ({menu, handleGetMenu, user, userid, fullName, avatarUrl, avatarUuid, siderFold, location, handleClickNavMenu, menuOpenKeys, showProfileModal, handleClickTab}) {
  const menusProps = {
    siderFold,
    location,
    handleClickNavMenu,
    menuOpenKeys,
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
 /**
  * 作者：任华维
  * 创建日期：2017-08-20
  * 功能：变量声明，顶级菜单列表
  */
 const topSubSystem = menu.map((item, index) => {
     return (
         <TabPane tab={<div title={item.name} style={{fontSize:16,textAlign:'center'}}><Icon type={item.icon}/></div>} key={item.key}>
            {
                item.child ? (
                    item.child.length ?
                    <Menus tabKey={item.key} menu={item.child} {...menusProps}/>
                    :
                    <div style={{padding:30,fontSize:16,color:'#89959B',textAlign:'center'}}>
                        改造中，敬请期待！
                    </div>
                ) :
                ''
            }
         </TabPane>
     )
 })
  return (
    <div>
      <div className={styles.logo}>

      {
          siderFold ? <Row>
                        <Col>
                            <Avatar size="large" src={ avatarUrl } onClick={handleAvatarClick}/>
                        </Col>
                      </Row> :
                      <Row>
                        <Col span={7}>
                            <Avatar size="large" src={ avatarUrl } onClick={handleAvatarClick}/>
                        </Col>
                        <Col span={12}>
                            <span style={{ fontSize: 16}} >{fullName}</span>
                        </Col>
                        <Col span={5}>
                            <Link className={styles.icon_lock} to="/lock"><Icon type="suoping"/></Link>
                        </Col>
                      </Row>
      }

      </div>
      <Tabs activeKey={menuOpenKeys[1]} size="small" onTabClick={handleClickTab}>
        {topSubSystem}
      </Tabs>

    </div>

  )
}

export default Asider;
