
 /**
  * 作者：卢美娟
  * 日期：2018-01-24
  * 邮箱：lumj14@chinaunicom.cn
  * 文件说明：废弃
 */
 import { connect } from 'dva';
 import { Table,  Menu, DatePicker,message,Button,Modal,Input,Tabs  } from 'antd';
 const TabPane = Tabs.TabPane;
 const { TextArea } = Input;
 import moment from 'moment';
 import { routerRedux } from 'dva/router';
 import '../../components/meetSystem/iconfont'
 import Cookie from 'js-cookie';
 import React from 'react'

export default class MeetOrderContent extends React.Component{
  render(){
    return(
      <div>
        <Menu
          selectedKeys={[query.arg_typeid+'']}
          mode="horizontal"
          style={{marginBottom:'20px'}}
          onClick={(item)=>this.room_typeHandler(item)}
          className={styles.menu}
        >
          <Menu.Item key="0">
            <svg className={styles.icon} aria-hidden="true">
              <use xlinkHref="#icon-xiaoxinghuiyishiai"></use>
            </svg>
            小型会议室
          </Menu.Item>
          <Menu.Item key="1">
            <svg className={styles.icon} aria-hidden="true">
              <use xlinkHref="#icon-zhongxinghuiyishiai"></use>
            </svg>
            中型会议室
          </Menu.Item>
          <Menu.Item key="2">
            <svg className={styles.icon} aria-hidden="true">
              <use xlinkHref="#icon-shipinhuiyishi"></use>
            </svg>
            视频会议室
          </Menu.Item>
          <Menu.Item key="3">
            <svg className={styles.icon} aria-hidden="true">
              <use xlinkHref="#icon-peixunshiai"></use>
            </svg>
            培训室
          </Menu.Item>
          <Menu.Item key="4" style={{display:(dname===deptname || edit_staff_id == adminstuffid || edit_staff_id == otherstuffid)?'block':'none'}}>
            <svg className={styles.icon} aria-hidden="true">
              <use xlinkHref="#icon-zhuanyonghuiyishiai"></use>
            </svg>
            专用会会议室
          </Menu.Item>
        </Menu>
        <Table
        columns={this.columns}
        dataSource={list}
        bordered
        pagination={false}
        loading={loading}
        className={styles.otable}
      />
    </div>
    )
  }
}
