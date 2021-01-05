/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：主框架页面
 */
import React from 'react';
import { connect } from 'dva';
import Index from '../components/layout/Index';
import Login from '../components/Login/Login_2019.js';
import Cookie from 'js-cookie';
import '../themes/common.less';
/**
 * 作者：任华维
 * 创建日期：2017-10-21
 * 功能：主框架组件
 */
function App ({ children, location, dispatch, loading, app }) {
  const {menu, isLoginFailed, email, tokenid, resetPwd, login, userid, user, fullName, avatarUrl, avatarUuid, theme, siderFold, isNavbar, menuPopoverVisible, profileVisible, profilePictures, menuOpenKeys, modifyPwdVisible} = app
  /**
   * 作者：任华维
   * 创建日期：2017-10-21
   * 功能：页头属性
   */
  const headerProps = {
    user,
    userid,
    theme,
    siderFold,
    location,
    isNavbar,
    menuPopoverVisible,
    modifyPwdVisible,
    switchMenuPopover () {
      dispatch({ type: 'app/switchMenuPopver' })
    },
    logout () {
      dispatch({
        type: 'app/logout',
      })
    },
    addFavorite(){
        dispatch({
          type: 'app/getUserIPInfo'
        })
    },
    showProfileModal(data) {
        dispatch({
          type: 'app/getProfile',
          payload: data
        })
    },
    showModifyPwdModal(data){
        dispatch({
          type: 'app/getModifyPwdInfo',
          payload: data
        })
    },
    modifyPasswordOk(data){
        dispatch({
          type: 'app/modifyPassword',
          payload: data
        })
    },
    modifyPasswordCancel(){
        dispatch({
          type: 'app/modifyPassword'
        })
    },
    changeTheme(data){
        dispatch({
          type: 'app/changeTheme',
          payload: data
        })
    },
    switchSider (data) {
        // dispatch({
        //     type: 'app/changeSider',
        //     payload: data
        // })
        dispatch({ type: 'app/switchSider', payload: location.pathname })
    }
  }
  /**
   * 作者：任华维
   * 创建日期：2017-10-21
   * 功能：左侧栏属性
   */
  const siderProps = {
    user,
    userid,
    fullName,
    avatarUrl,
    avatarUuid,
    siderFold,
    location,
    menu,
    menuOpenKeys,
    handleClickNavMenu(data,key){
        dispatch({
          type: 'app/changeSubMenu',
          payload: {data,key},
        })
    },
    lock (data) {
      dispatch({
        type: 'app/lock',
        payload: data
      })
    },
    showProfileModal(data) {
        dispatch({
          type: 'app/getProfile',
          payload: data
        })
    },
    handleClickTab(data) {
        dispatch({
          type: 'app/tabClick',
          payload: data
        })
    },
    handleGetMenu(data) {
        dispatch({
          type: 'app/getMenu',
          payload: data
        })
    },
  }
  /**
   * 作者：任华维
   * 创建日期：2017-10-21
   * 功能：头像对话框属性
   */
  const profileProps = {
    user,
    userid,
    avatarUrl,
    avatarUuid,
    location,
    profileVisible,
    profilePictures,
    handleOk (data) {
        dispatch({
          type: 'app/changeProfile',
          payload: data
        })
    },
    handleCancel () {
        dispatch({
          type: 'app/changeProfile'
        })
    },
    handleReset (data) {
        dispatch({
          type: 'app/resetProfile',
          payload: data
        })
    },
    handleUpload (data,callback) {
        dispatch({
          type: 'app/uploadProfile',
          payload: data,
          onComplete() {
              callback();
          },
        })
    },
  }
  return (
    <div>
      {
        login ?
          <Index
            headerProps={headerProps}
            siderProps={siderProps}
            profileProps={profileProps}
            siderFold={siderFold}
            isNavbar={isNavbar}
            children={children}
            location={location}
            theme={theme}
          />
          :
          <Login
                loading={loading}
                isLoginFailed = {isLoginFailed}
                user={user}
                avatarUrl={avatarUrl}
                email={email}
                tokenid={tokenid}
                resetPwd = {resetPwd}
                dispatch={dispatch}
                forgetPwdVisible={app.forgetPwdVisible}
                forgetVerifyCode={app.forgetVerifyCode}
                loginFormForgotKey={app.loginFormForgotKey}
                onOk={
                    (data,callback) => {
                        dispatch({ type: 'app/login', payload: data, callback: callback })
                    }}
                onFormForgotOk={
                    (data) => {
                        dispatch({ type: 'app/forgot', payload: data })
                    }}
                onFormResetOk={
                    (data) => {
                        dispatch({ type: 'app/reset', payload: data })
                    }}
          />
      }
    </div>
  );
}

function mapStateToProps (state) {
  return {
    app: state.app,
    loading: state.loading.models.app,
  };
}

export default connect(mapStateToProps)(App);
