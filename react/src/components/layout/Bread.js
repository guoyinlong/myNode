/**
 * 作者：任华维
 * 日期：2017-07-31
 * 邮箱：renhw21@chinaunicom.cn
 * 功能：门户面包屑（未完成未使用）
 */
import React, { PropTypes } from 'react';
import { Breadcrumb, Icon } from 'antd';
import styles from '../../themes/main.less';
import menu  from '../../utils/menu';
import config from '../../utils/config';

let pathSet = []

/**
 * 作者：任华维
 * 创建日期：2017-08-20
 * 功能：获取路径
 * @param 路径数组
 * @param 父路径
 */
const getPathSet = function (menuArray, parentPath = '/') {
  menuArray.map(item => {
    pathSet[(parentPath + item.key).replace(/\//g, '-').hyphenToHump()] = {
      path: parentPath + item.key,
      name: item.name,
      icon: item.icon || '',
      clickable: item.clickable===undefined
    }
    if (item.child) {
      getPathSet(item.child, parentPath + item.key + '/')
    }
  })
}

getPathSet(menu);
/**
 * 作者：任华维
 * 创建日期：2017-08-20
 * 功能：面包屑组件
 */
function Bread ({ location }) {
  let pathNames = [];
  location.pathname.substr(1).split('/').map((item, key) => {
    if (key > 0) {
      pathNames.push((pathNames[key - 1] + '-' + item).hyphenToHump())
    } else {
      pathNames.push(('-' + item).hyphenToHump())
    }
  })

  const breads = pathNames.map((item, key) => {
    //判断是否默认打开的主页
    if (!(item in pathSet)) {
      item = ('-' + config.defaultSelectMenu).hyphenToHump();
    }

    return (
      <Breadcrumb.Item
        key={key}
        {...((pathNames.length - 1===key) || !pathSet[item].clickable) ? '' : { href: '#' + pathSet[item].path }}
      >
        {
          pathSet[item].icon ?
            <Icon type={pathSet[item].icon}/>
            : ''
        }
        <span>{pathSet[item].name}</span>
      </Breadcrumb.Item>
    )
  })

  return (
    <div className={styles.bread}>
      <Breadcrumb>
        {pathNames[0] !== 'CommonApp' ? <Breadcrumb.Item><a href="#">首页</a></Breadcrumb.Item> : ''}
        {breads}
      </Breadcrumb>
    </div>
  )
}

Bread.propTypes = {
  location: PropTypes.object
}

export default Bread;
