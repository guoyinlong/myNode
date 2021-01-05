/**
 * 作者：陈红华
 * 创建日期：2017-07-31
 * 邮箱：1045825949@qq.com
 * 文件说明：门户首页页面model
 */
import * as commonAppService from '../../services/commonApp/commonAppService.js';
import { leaderScoreSearch } from '../../services/leader/leaderservices.js';
import {message} from 'antd';
import Cookie from 'js-cookie';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import {propertySort} from '../../utils/func';
import * as overtimeService from "../../services/overtime/overtimeService";
import * as trainService from "../../services/train/trainService";
import * as contractService from "../../services/labor/contract/contractService";
import * as appServices from '../../services/app';
import config from '../../utils/config';
export default {
  namespace : 'commonApp',
  state : {
    messageList:[],
    backlogList:[],
    fileList:[],
    resourceList:[],
    noticeList:[],
    usersHasPermissionId:[],
    messageFlag:true,
    fileFlag:true,
    SrcFlag:true,
    noticeFlag:true,
    backlogFlag:true,
    historyDate:[],
    leaderFileList:[],

    circulationNoticeList:[],
    circulationNoticeFlag:true,

	avatarUrl: localStorage.getItem('avatarUrl'),
    avatarUuid: localStorage.getItem('avatarUuid'),
    siderFold: localStorage.getItem('siderFold') === 'true',
    isNavbar: localStorage.getItem('isNavbar') === 'true',//document.body.clientWidth < 769,
    user: localStorage.getItem('username'),
    fullName: localStorage.getItem('fullName'),
    userid: localStorage.getItem('userid'),
    theme: localStorage.getItem('themeString'),
    menu: JSON.parse(localStorage.getItem('menu')) || [],

  },

  reducers : {
    myMessage(state, {DataRows,unread_count,messagePageCount}) {
      var messageList=[];
      for(var i=0;i<DataRows.length;i++){
        if(DataRows[i].read_flag=="0"){
          messageList.push(DataRows[i]);
        }
      }
      return {
        ...state,
        messageList:[...messageList],
        unread_count,
        messageFlag:false,
        messagePageCount
      };
    },
    myBacklog(state, {DataRows,RowCount}) {
      return {
        ...state,
        backlogList:[...DataRows],
        backlogFlag:false,
        RowCount
      };
    },
    myFile(state,{DataRows}){
      for(var i=0;i<DataRows.length;i++){
        DataRows[i].file_upload_date=moment(DataRows[i].file_upload_date).format("YYYY-MM-DD");
      }
      return{
        ...state,
        fileList:[...DataRows],
        fileFlag:false
      };
    },
    commonResource(state,{DataRows}){
      return{
        ...state,
        resourceList:[...DataRows],
        SrcFlag:false

      };
    },
    noticeList(state,{DataRows,PageCount}){
      return{
        ...state,
        noticeList:[...DataRows],
        noticeFlag:false,
        noticeMorePageCount:PageCount
      };
    },
    circulationNotice(state,{DataRows,PageCount}){
      return{
        ...state,
        circulationNoticeList:[...DataRows],
        circulationNoticeFlag:false,
        circulationNoticeMorePageCount:PageCount
      };
    },
    // 添加公告权限
    usersHasPermission(state,{DataRows}){
      return{
        ...state,
        usersHasPermissionId:[...DataRows]
      }
    },
    leaderFile(state, data){
      return{
        ...state,
        leaderFileList: data.fileList
      }
    },
	 /**
         * 作者：贾茹
         * 创建日期：2020-7-6
         * 功能：获取系统菜单
         */

    //保存数据
    getUserIPInfoSuccess(state, action) {
      addFavorite("门户", "http:" + action.payload + "/portal/");
      return {
        ...state,
        ...action.payload,
      };
    },
    resetSuccess(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    loginSuccess(state, action) {
      if ("1" === action.payload.info.type) {
        localStorage.setItem("userid", action.payload.info.staff_id);
        localStorage.setItem("deptname", action.payload.info.deptname);
        localStorage.setItem(
          "ou",
          action.payload.info.deptname_p.split("-")[1]
        );
        localStorage.setItem("staffid", action.payload.info.staff_id);
      } else {
        localStorage.setItem("userid", action.payload.info.userid);
        localStorage.setItem("deptname", "");
        localStorage.setItem("ou", "");
        localStorage.setItem("staffid", action.payload.info.userid);
      }

      localStorage.setItem("fullName", action.payload.info.username);
      localStorage.setItem("username", action.payload.info.loginname);
      localStorage.setItem("sys_userid", action.payload.info.userid);
      localStorage.setItem("loginpass", action.payload.info.loginpass);
      localStorage.setItem("usertype", action.payload.info.type);

      localStorage.setItem(
        "avatarUrl",
        action.payload.info.avatarUrl || config.unicom_logo_bg
      );
      localStorage.setItem("avatarUuid", action.payload.info.avatarUuid);
      localStorage.setItem("themeString", action.payload.info.themeString);
      localStorage.setItem("themeUuid", action.payload.info.themeUuid);

      sessionStorage.setItem("roleid", JSON.stringify(action.payload.roleid));
      return {
        ...state,
        ...action.payload,
        isLoginFailed: false,
        user: action.payload.info.loginname,
        fullName: action.payload.info.username,
        userid: action.payload.info.userid,
        avatarUrl: action.payload.info.avatarUrl || config.unicom_logo_bg,
        avatarUuid: action.payload.info.avatarUuid,
        theme: action.payload.info.themeString,
        login: true,
      };
    },
    loginFailed(state, action) {
      return {
        ...state,
        isLoginFailed: true,
      };
    },
    logoutSuccess(state, action) {
      localStorage.clear();
      return {
        ...state,
        user: "",
        fullName: "",
        userid: "",
        avatarUrl: "",
        avatarUuid: "",
        login: false,
      };
    },
    lockSuccess(state, action) {
      localStorage.removeItem("userid");
      localStorage.removeItem("deptname");
      localStorage.removeItem("ou");
      localStorage.removeItem("staffid");
      localStorage.removeItem("fullName");
      localStorage.removeItem("sys_userid");
      localStorage.removeItem("loginpass");
      localStorage.removeItem("usertype");
      localStorage.removeItem("avatarUuid");
      localStorage.removeItem("themeString");
      localStorage.removeItem("themeUuid");
      return {
        ...state,
        login: false,
      };
    },
    //切换收缩模式
    switchSider(state, action) {
      localStorage.setItem("siderFold", !state.siderFold);
      return {
        ...state,
        siderFold: !state.siderFold,
        menuOpenKeys: state.siderFold ? action.payload.split("/") : [],
      };
    },
    //左侧栏显示隐藏
    switchNavbar(state, action) {
      localStorage.setItem("isNavbar", !state.isNavbar);
      return {
        ...state,
        isNavbar: !state.isNavbar,
      };
    },
    //切换小屏幕
    showNavbar(state) {
      return {
        ...state,
        isNavbar: true,
      };
    },
    hideNavbar(state) {
      return {
        ...state,
        isNavbar: false,
      };
    },
    showProfileModal(state, action) {
      return {
        ...state,
        ...action.payload,
        profileVisible: true,
      };
    },
    hideProfileModal(state, action) {
      localStorage.setItem("avatarUrl", action.payload.avatarUrl);
      localStorage.setItem("avatarUuid", action.payload.avatarUuid);
      return {
        ...state,
        ...action.payload,
        profileVisible: false,
      };
    },
    showModifyPwdModal(state, action) {
      return {
        ...state,
        modifyPwdVisible: true,
      };
    },
    hideModifyPwdModal(state, action) {
      return {
        ...state,
        modifyPwdVisible: false,
      };
    },
    changeThemeSuccess(state, action) {
      localStorage.setItem("themeString", action.payload.arg_theme);
      return {
        ...state,
        theme: action.payload.arg_theme,
      };
    },
    //点击小屏幕菜单
    switchMenuPopver(state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      };
    },
    //改变菜单
    changeMenu(state, action) {
      return {
        ...state,
        menuOpenKeys: action.payload,
        login: true,
      };
    },
    menuTree(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    uploadProfileSuccess(state, action) {
      return {
        ...state,
      };
    },
    systemMenu(state, action) {
      localStorage.setItem("menu", JSON.stringify(action.payload));
      return {
        ...state,
        menu: action.payload,
      };
    },
    updateUserInfo(state, action) {
      localStorage.setItem("fullName", action.payload);
      return {
        ...state,
        fullName: action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },

  effects : {
	  /* //初始化数据
     * init({query}, {call, put}) {
           console.log('首页初始化')
          yield put({
            type:'login',

          })
    }, */

    *tabClick({ payload }, { put }) {
      yield put(routerRedux.push("/" + payload));

      // if (payload === "projectManage") {
      //     const w=window.open('about:blank');
      //     w.location.href='/ProjectManage/index.html#/mainpage';
      // }
      // if (payload === "financeManage") {
      //     const w=window.open('about:blank');
      //     w.location.href='/finance/index.html#/mainpage';
      // }
      // if (payload === "hr") {
      //     const w=window.open('about:blank');
      //     w.location.href='/hr/index.html#/mainpage';
      // }
    },

    *changeVerifyCode({}, { put }) {
      yield put({
        type: "save",
        payload: {
          forgetVerifyCode:
            config.loginConfig.CaptchaAddress +
            "?" +
            (Math.random() * 100000).toFixed(0),
        },
      });
    },

    /**
     * 作者：贾茹
     * 创建日期：2020-7-9
     * 功能：密码重置
     * @param payload 用户信息
     */
    *reset({ payload }, { call, put }) {
      try {
        const res = yield call(appServices.reset, payload);
        if (res.RetCode === "1") {
          /*
           * 修改：李杰双
           * 说明：密码重置补全
           */
          message.success("邮件已发送到您的邮箱,请注意查收");
          yield put({
            type: "resetSuccess",
            payload: {
              email: null,
              tokenid: null,
              resetPwd: false,
            },
          });
          yield put({
            type: "setModalVisible",
            modalType: "forgetPwdVisible",
            visible: false,
          });
        }
        if (res.RetCode === "-1" || res.RetCode === "-2") {
          message.error(res.RetVal);
          yield put({
            type: "changeVerifyCode",
          });
        }
      } catch (e) {
        message.error("操作失败！");
      }
    },
    /**
     * 作者：贾茹
     * 创建日期：2020-7-9
     * 功能：忘记密码
     * @param payload 用户名
     */
    *forgot({ payload }, { call, put }) {
      const res = yield call(appServices.forgot, payload);
      if (res.RetCode === "1") {
        yield put({ type: "logoutSuccess" });
      }
    },
    /**
     * 作者：贾茹
     * 创建日期：2020-7-9
     * 功能：登录
     * @param payload username
     * @param payload password
     */
    *login({ payload }, { call, put, select }) {
      console.log('刷新了，login')
      const res = yield call(appServices.isLogin, payload);
      if (res.RetCode === "1") {

        yield put({
          type: "getTopSubSystem",
          payload: {
            argtenantid: res.DataRows[0].tenantid,
            arguserid: res.DataRows[0].userid,
          },
        });
        const res1 = yield call(appServices.getinfo, {
          arguserid: res.DataRows[0].userid,
          argtenantid: "10010",
          argtpid: "c76be9640ab811e7bda502429ca3c6ff",
        });
        if (res1.RetCode === "1") {

          yield put({
            type: "loginSuccess",
            payload: {
              roleid: res1.DataRows[0] ? res1.DataRows[0].role_id : "",
              info: res.DataRows[0],
            },
          });

          const routing = yield select((state) => state.routing);
          if (routing.locationBeforeTransitions.pathname === "/lock") {
            yield put(routerRedux.goBack());
          } else {
            //yield put(routerRedux.push("/"));
          }
        }
      } else {
        //callback();
        message.error(res.RetVal);
      }
    },
    /**
     * 作者：贾茹
     * 创建日期：2020-7-9
     * 功能：判断登录
     */
    *isLogin({ payload }, { call, put }) {
      const res = yield call(appServices.isLogin);
      if (res.RetCode === "1") {
        if (payload === "/login") {
          //登录页判断已登录执行退出
          yield put({ type: "logout" });
        } else if (payload === "/lock") {
          //锁定页判断已登录执行锁定
          yield put({ type: "lock" });
        } else {
          //其他页判断已登录根据路径修改菜单栏选中项

          // 判断当前url是否有权限
          const menulist = JSON.parse(localStorage.getItem("menu"));
          let url = payload;
          if (payload.substr(0, 1) == "/") {
            url = payload.substr(1, payload.length);
          }
          const urlArray = url.split("/");
          let application_auth = false,
            url_auth = false;
          if (
            urlArray.length == 1 ||
            payload === "/travelBudgetChangeReview/travelBudgetHistory" ||
            payload === "/projectApp/timesheetManage/fillSendBack"
          ) {
            (application_auth = true), (url_auth = true);
          }
          // 缓存里包含菜单，并且路由至少2级做判断，主要是去掉首页的相关应用限制
          if (menulist && urlArray.length > 1) {
            menulist.map((item) => {
              if (item.key === urlArray[0]) {
                application_auth = true;
                const menu_child_list = item.child;
                if (urlArray[1] && menu_child_list) {
                  menu_child_list.map((childItem) => {
                    if (childItem.key === urlArray[1]) {
                      const menu_child_child_list = childItem.child;
                      if (urlArray[2] && menu_child_child_list) {
                        menu_child_child_list.map((childChildItem) => {
                          if (childChildItem.key === urlArray[2]) {
                            url_auth = true;
                          }
                        });
                      } else {
                        url_auth = true;
                      }
                    }
                  });
                } else {
                  // 只包含一层URL
                  url_auth = true;
                }
              }
            });
          }

          if (!application_auth) {
            yield put(routerRedux.push("/"));
          } else if (!url_auth) {
            yield put(routerRedux.push("/"));
          }

          yield put({
            type: "changeMenu",
            payload:
              localStorage.getItem("siderFold") === "true"
                ? []
                : payload.split("/"),
          });
        }
      } else {
        if (payload === "/login") {
          //登录页判断未登录执行退出成功
          yield put({ type: "logoutSuccess" });
        } else if (payload === "/lock") {
          //锁定页判断未登录执行锁定成功
          yield put({ type: "lockSuccess" });
        } else {
          //其他页判断未登录则跳转至登录页
          yield put(routerRedux.push("/login"));
        }
      }
    },
    /**
     * 作者：贾茹
     * 创建日期：2020-7-9
     * 功能：获取系统菜单
     * @param payload arguserid 用户id
     * @param payload argtenantid
     */
    *getTopSubSystem({ payload }, { call, put }) {
      const res = yield call(appServices.getTopSubSystem, payload);
      if (res.RetCode === "1") {
        yield put({
          type: "systemMenu",
          payload: res.DataRows,
        });
        yield put({
          type: "getSubSystemAndModule",
          payload: { ...payload, data: res.DataRows },
        });
      }
    },
    /**
     * 作者：贾茹
     * 创建日期：2020-7-9
     * 功能：获取模块菜单
     * @param payload arguserid 用户id
     * @param payload argtenantid
     * @param payload argtpid 模块id
     */
    *getSubSystemAndModule({ payload }, { call, put, select }) {
      console.log(payload.data)
      for (let i = 0; i < payload.data.length; i++) {
        const res = yield call(appServices.getSubSystemAndModule, {
          argtenantid: payload.argtenantid,
          argtpid: payload.data[i].tp_id,
          arguserid: payload.arguserid,
        });
        if (res.RetCode === "1") {
          const menu = yield select((state) => state.app.menu);
          if (payload.data[i].key === "financeApp") {
            res.DataRows.map((item, index) => {
              item.child = JSON.parse(item.child);
            });
            menu[i].child = res.DataRows;
          } else if (payload.data[i].key === "projectApp") {
            res.DataRows.map((item, index) => {
              item.child = JSON.parse(item.child);
            });
            menu[i].child = res.DataRows;
            menu[i].child.push({
              key: "projRecord",
              name: "项目推送",
              icon: "setting",
              child: [
                {
                  key: "projChild",
                  name: "RD推送",
                  icon: "",
                },
                // {
                //   key: "projDetail",
                //   name: "备案",
                //   icon: "",
                // },
              ],
            });
            menu[i].child.push({
              key: "cmdb",
              name: "CMDB",
              icon: "setting",
              child: [
                {
                  key: "cmdbChild",
                  name: "CMDB查询",
                  icon: "",
                },
              ],
            });

            /*
             * 修改：李杰双
             * 功能：固定问卷调查菜单
             * */
          } else if (payload.data[i].key === "commonApp") {
            res.DataRows.map((item, index) => {
              item.child = JSON.parse(item.child);
            });
            menu[i].child = res.DataRows;
            menu[i].child.push({
              key: "questionnaire",
              name: "问卷调查",
              icon: "book",
            });
          }
          else {
            res.DataRows.map((item, index) => {
              item.child = JSON.parse(item.child);
            });
            //生产环境注释掉 个人考核 入口
            //menu[i].child = res.DataRows.filter(j=>(j.key!='employer'));
            //测试及UAT环境开放 个人考核 入口
            menu[i].child = res.DataRows;
          }
          yield put({
            type: "systemMenu",
            payload: menu,
          });
        }
      }
    },

    /**
     * 作者：贾茹
     * 创建日期：2020-7-9
     * 功能：退出
     */
    *logout({}, { call, put }) {
      const res = yield call(appServices.logout);
      if (res.RetCode === "1") {
        let cookieList = [
          "OU",
          "OUID",
          "RLZYJSESSION",
          "avatarUrl",
          "avatarUuid",
          "dept_id",
          "dept_name",
          "deptname",
          "deptname_p",
          "email",
          "loginname",
          "loginpass",
          "staff_id",
          "tenantid",
          "themeString",
          "themeUuid",
          "token",
          "type",
          "userid",
          "userlogin_identifycode",
          "username",
        ];
        cookieList.forEach((item) => {
          cookie.remove(item);
        });
        yield put(routerRedux.push("/login"));
        /* setTimeout(() => {
          window.location.reload();
        }, 0); */
      }
    },
    /**
     * 作者：贾茹
     * 创建日期：2020-7-9
     * 功能：锁屏退出
     */
    *lock({}, { call, put }) {
      const res = yield call(appServices.logout);
      if (res.RetCode === "1") {
        yield put({ type: "lockSuccess" });
      }
    },
    /**
     * 作者：贾茹
     * 创建日期：2020-7-9
     * 功能：获取头像
     * @param payload userid 用户id
     */
    *getProfile({ payload }, { call, put }) {
      const res = yield call(appServices.getAvatarList, payload);
      if (res.RetCode === "1") {
        yield put({
          type: "showProfileModal",
          payload: {
            profilePictures: res.DataRows,
          },
        });
      }
    },
    /**
     * 作者：贾茹
     * 创建日期：2020-7-9
     * 功能：获取当前ip信息
     */
    *getUserIPInfo({ payload }, { call, put }) {
      const res = yield call(appServices.getUserIPInfo);
      if (res.RetCode === "1") {
        yield put({
          type: "getUserIPInfoSuccess",
          payload: {
            userIP: res.RetVal,
          },
        });
      }
    },
    /**
     * 作者：贾茹
     * 创建日期：2020-7-9
     * 功能：用户修改密码弹窗
     */
    *getModifyPwdInfo({ payload }, { call, put }) {
      yield put({ type: "showModifyPwdModal" });
    },
    /**
     * 作者：贾茹
     * 创建日期：2020-7-9
     * 功能：用户修改密码提交
     * @param payload userid
     * @param payload password
     */
    *modifyPassword({ payload }, { call, put }) {
      if (payload) {
        const res = yield call(appServices.modifyPwd, payload);
        if (res.RetCode === "1") {
          yield put({ type: "hideModifyPwdModal" });
          yield put({ type: "logoutSuccess" });
        }
      } else {
        yield put({ type: "hideModifyPwdModal" });
      }
    },
    /**
     * 作者：贾茹
     * 创建日期：2020-7-9
     * 功能：用户修改头像提交
     * @param payload userid
     */
    *changeProfile({ payload }, { call, put }) {
      if (payload) {
        const res = yield call(appServices.modifyAvatar, payload);
        if (res.RetCode === "1") {
          yield put({
            type: "hideProfileModal",
            payload: {
              avatarUrl: payload.arg_relative_url,
              avatarUuid: payload.arg_uuid,
            },
          });
        }
      } else {
        yield put({
          type: "hideProfileModal",
          payload: {
            avatarUrl: localStorage.getItem("avatarUrl"),
            avatarUuid: localStorage.getItem("avatarUuid"),
          },
        });
      }
    },
    /**
     * 作者：贾茹
     * 创建日期：2020-7-9
     * 功能：用户重置头像
     * @param payload userid
     */
    *resetProfile({ payload }, { call, put }) {
      const res = yield call(appServices.resetAvatar, payload);
      if (res.RetCode === "1") {
        yield put({
          type: "hideProfileModal",
          payload: {
            avatarUrl: config.unicom_logo_bg,
            avatarUuid: "",
          },
        });
      }
    },
    /**
     * 作者：贾茹
     * 创建日期：2020-7-9
     * 功能：用户修改主题
     * @param payload userid
     */
    *changeTheme({ payload }, { call, put, select }) {
      const res = yield call(appServices.changeTheme, payload);
      if (res.RetCode === "1") {
        yield put({
          type: "changeThemeSuccess",
          payload: payload,
        });
      }
    },
    /**
     * 作者：贾茹
     * 创建日期：2020-7-9
     * 功能：是否显示导航菜单
     */
    *changeNavbar({}, { put }) {
      if (document.body.clientWidth < 769) {
        yield put({ type: "showNavbar" });
      } else {
        yield put({ type: "hideNavbar" });
      }
    },
    /**
     * 作者：贾茹
     * 创建日期：2020-7-9
     * 功能：切换收缩模式
     */
    *changeSider({}, { put }) {
      yield put({ type: "switchNavbar" });
    },
    /**
     * 作者：贾茹
     * 创建日期：2020-7-9
     * 功能：获取菜单
     */
    *getMenu({ payload }, { call, put, select }) {
      const menu = yield select((state) => state.app.menu);
      yield put({
        type: "menuTree",
        payload: menu,
      });
    },
    /**
     * 作者：贾茹
     * 创建日期：2020-7-9
     * 功能：切换菜单
     */
    *changeSubMenu({ payload }, { call, put }) {
      if (payload.data.find((item) => item === payload.key)) {
        yield put({
          type: "changeMenu",
          payload: payload.data,
        });
      } else {
        payload.data.splice(1, 0, payload.key);
        yield put({
          type: "changeMenu",
          payload: payload.data,
        });
      }
    },
    /**
     * 作者：贾茹
     * 创建日期：2020-7-9
     * 功能：上传头像
     * @param payload 文件
     * @param onComplete 回调
     */
    *uploadProfile({ payload, onComplete }, { call, put }) {
      const formData = new FormData();
      formData.append("file", payload);
      formData.append("argappname", "profile");
      formData.append("argtenantid", "10010");
      formData.append("arguserid", localStorage.getItem("userid"));
      formData.append("argyear", new Date().getFullYear());
      formData.append("argmonth", new Date().getMonth() + 1);
      formData.append("argday", new Date().getDate());
      const res = yield call(appServices.fileUpload, {
        method: "POST",
        body: formData,
      });
      if (res.data.RetCode === "1") {
        yield put({
          type: "changeProfile",
          payload: {
            arg_userid: localStorage.getItem("userid"),
            arg_relative_url: res.data.file.RelativePath,
            arg_real_filename: res.data.file.RealFileName,
          },
        });
        yield put({
          type: "uploadProfileSuccess",
        });
      }
      onComplete();
    },

    /**
     * 作者：邓广晖
     * 创建日期：2018-11-23
     * 功能：设置模态框可见
     * @param modalType 模态框类型
     * @param visible 可见状态
     */
    *setModalVisible({ modalType, visible }, { put }) {
      yield put({
        type: "save",
        payload: {
          [modalType]: visible,
        },
      });
      if (modalType === "forgetPwdVisible" && visible === true) {
        yield put({
          type: "save",
          payload: {
            loginFormForgotKey: getUuid(32, 64),
          },
        });
        yield put({
          type: "changeVerifyCode",
        });
      }
    },
    *backlogQuery({ arg_uesrid = Cookie.get('userid') }, { call, put }) {
      const { DataRows, RowCount } = yield call(commonAppService.backlogQuery, { arg_uesrid });
      yield put({
        type: 'myBacklog',
        DataRows,
        RowCount
      });
    },
    *timeSheetList({ formData }, { call, put }) {
      const { DataRows, RetCode } = yield call(commonAppService.timeSheetList, formData);
      if (RetCode == '1') {
        window.localStorage.timesheetModuleList = JSON.stringify(DataRows);
      }
    },
    *messageQuery({ formData: formData }, { call, put }) {
      let postData = {
        'arg_mess_staff_id_to': Cookie.get('userid'),
        'arg_page_size': formData.arg_page_size || '',
        'arg_page_current': formData.arg_page_current || '',
        'arg_mess_staff_name_from': formData.arg_mess_staff_name_from || ''
      }
      const { DataRows, unread_count, PageCount } = yield call(commonAppService.messageQuery, postData);
      yield put({
        type: 'myMessage',
        DataRows,
        unread_count,
        'messagePageCount': PageCount
      });
    },

    *fileQuery({ file_upload_date, file_type_id }, { call, put }) {
      // const {DataRows} = yield call(commonAppService.fileQuery,{
      //   transjsonarray: JSON.stringify({
      //     "condition":{"file_type_id":file_type_id},
      //     "sequence":[{
      //       "file_upload_date":file_upload_date,
      //     }]
      //   })
      // });
      const { DataRows } = yield call(commonAppService.fileQuery, { arg_ou_id: Cookie.get('OUID'), arg_dept_id: Cookie.get('dept_id'), arg_staff_id: Cookie.get('staff_id') });
      yield put({
        type: 'myFile',
        DataRows
      });
    },
    *fileLoadNum({ formData }, { call, put }) {
      const { file_upload_date, file_type_id, postData } = formData
      // const {DataRows} =
      yield call(commonAppService.fileLoadNum, postData);
      yield put({
        type: 'fileQuery',
        file_upload_date,
        file_type_id
      });
    },
    *ResourceQuery({ file_upload_date, file_type_id }, { call, put }) {
      const { DataRows } = yield call(commonAppService.fileQuery, {
        transjsonarray: JSON.stringify({
          "condition": { "file_type_id": file_type_id },
          "sequence": [{
            "file_upload_date": file_upload_date,
          }]
        })
      });
      yield put({
        type: 'commonResource',
        DataRows
      });
    },
    // 流程流转公告设为已读
    *messageReadFlagCirculationNotice({ formData: formData }, { call, put }) {
      const { arg_staff_id, arg_notice_id } = formData;
      let postData = {
        arg_staff_id,
        arg_notice_id
      }
      let postDataQuery = {
        arg_userid: arg_staff_id,
        arg_page_size: 5,
        arg_page_current: 1
      }
      const { RetCode } = yield call(commonAppService.circulationNoticeRead, postData);
      if (RetCode == '1') {
        const { DataRows, PageCount } = yield call(commonAppService.circulationNoticeInfoQuery, postDataQuery);
        yield put({
          type: 'circulationNotice',
          DataRows,
          PageCount
        });
      }
      else { message.warn('改为已读状态失败！'); }
    },
    // 消息单条设为已读
    *messageReadFlag({ formData: formData }, { call, put }) {
      const { arg_staff_id, arg_mess_id, arg_page_size, arg_page_current, arg_mess_staff_name_from } = formData;
      let postData = {
        arg_staff_id,
        arg_mess_id
      }
      const { RetCode } = yield call(commonAppService.messageReadFlag, postData);
      if (RetCode == '1') {
        // message.success('消息为已读状态！');
        yield put({
          type: 'messageQuery',
          formData: {
            arg_page_size,
            arg_page_current,
            arg_mess_staff_name_from
          }
        });
      } else { message.warn('改为已读状态失败！'); }
    },
    // 消息设为未读
    *messageNotRead({ formData: formData }, { call, put }) {
      const { arg_staff_id, arg_mess_id, arg_page_size, arg_page_current, arg_mess_staff_name_from } = formData;
      let postData = {
        arg_staff_id,
        arg_mess_id
      }
      const { RetCode } = yield call(commonAppService.messageNotRead, postData);
      if (RetCode == '1') {
        // message.success('消息设为未读成功！');
        yield put({
          type: 'messageQuery',
          formData: {
            arg_page_size,
            arg_page_current,
            arg_mess_staff_name_from
          }
        });
      } else { message.warn('消息设为未读失败！'); }
    },
    // 删除消息
    *messageDelete({ formData }, { call, put }) {
      const { mess_status, mess_id, arg_page_size, arg_page_current, arg_mess_staff_name_from } = formData
      const { RetCode } = yield call(commonAppService.messageDelete, {
        transjsonarray: JSON.stringify([{
          "update": { "mess_status": mess_status },
          "condition": { "mess_id": mess_id }
        }])
      }
      )
      if (RetCode == '1') {
        // message.success('删除成功！');
        yield put({
          type: 'messageQuery',
          formData: {
            arg_page_size,
            arg_page_current,
            arg_mess_staff_name_from
          }
        });
      } else {
        message.warn('删除失败！');
      }
    },

    *noticeInfoQuery({ formData }, { call, put }) {
      const { arguserid, arg_page_size, arg_page_current } = formData
      let postData = {
        arguserid,
        arg_page_size,
        arg_page_current
      }
      const { DataRows, PageCount } = yield call(commonAppService.noticeInfoQuery, postData);
      yield put({
        type: 'noticeList',
        DataRows,
        PageCount
      });
    },
    //流程流转，消息查询
    *circulationNoticeInfoQuery({ formData }, { call, put }) {
      const { arg_userid, arg_page_size, arg_page_current } = formData
      let postData = {
        arg_userid,
        arg_page_size,
        arg_page_current
      }
      const { DataRows, PageCount } = yield call(commonAppService.circulationNoticeInfoQuery, postData);
      yield put({
        type: 'circulationNotice',
        DataRows,
        PageCount
      });
    },
    *readrecordInsert({ formData }, { call, put }) {
      const { arg_notice_id, arg_userid, item, visibleCreateNotice } = formData
      const { RetCode } = yield call(commonAppService.readrecordInsert, { arg_notice_id, arg_userid });
      if (RetCode == '1') {
        yield put(routerRedux.push({
          pathname: '/noticeDetail',
          query: { id: item.ID, n_title: item.n_title, role: visibleCreateNotice ? 'manager' : 'user' }
        }));
      }
    },
    // 公告创建权限
    *getUsersByRoleId({ formData }, { call, put }) {
      const { DataRows, RetCode } = yield call(commonAppService.getAnnounceUsersByRoleId, formData);
      if (RetCode == '1') {
        yield put({
          type: 'usersHasPermission',
          DataRows
        });
      }
      //else{
      //  message.error('获取公告权限失败！'+RetVal);
      //}
    },
    *getUserId({ payload }, { call, put, select }) {
      const res = yield call(commonAppService.p_if_isout, { arg_username: payload });
      if (res.RetCode === '1') {
        yield put({
          type: 'taskListQuery',
          payload: res.DataRows[0].userid
        });
      }
    },
    // 查询待办列表
    *taskListQuery({ payload }, {call, put}) {
        const [newsList,timeSheetRes, fundingPlanRes, taskListRes, teamManageRes, partnerRes, roleRes,overtimeRes,leaveRes,trainRes, meetingMyWait, appraiseRes,absenceRes,laborSympathyRes,attendRes,mySealWaitRes] = yield [
           //新闻
           call(commonAppService.showTodoApprovalList, {user_id:Cookie.get('userid'), page_size:"10",page_current:"1",flag:"0"}),
            call(commonAppService.backlogQuery, {arg_userid:localStorage.userid}),
            call(commonAppService.fundingPlanQuery, {arg_user_id:payload}),
            call(commonAppService.taskListQuery, {arg_task_staff_id_to:payload}),
            call(commonAppService.projSearchTeam, {staffId:payload,queryType:"0"}),
            call(commonAppService.p_service_confirm_task_search, {arg_userid:payload}),
            call(commonAppService.p_purchase_getroles, {arg_user_id:payload}),
            /* 提交加班管理的待办 */
            call(commonAppService.overtimeUndoTask_Query, {arg_user_id:payload}),
            /* 提交离职管理的待办 */
            call(commonAppService.leaveUndoTask_Query, {arg_user_id:payload,arg_pass:Cookie.get('loginpass')}),
            /* 提交培训管理的待办 */                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
            call(commonAppService.trainUndoTask_Query, {arg_user_id:payload}),
            //待办会议显示列表查询
            call(commonAppService.myMeetingWait, {arg_user_id :Cookie.get('userid')}),
            //待办干部管理待评议列表查询
            call(commonAppService.apprasieUndoListQuery, {arg_user_id :Cookie.get('userid')}),
            call(commonAppService.absenceUndoTask_Query, {arg_user_id :Cookie.get('userid')}),
            call(commonAppService.laborSympathyUndoTask_Query, {arg_user_id :Cookie.get('userid')}),
            call(commonAppService.attendUndoTask_Query, {arg_user_id :Cookie.get('userid')}),
			      //印章待办
            call(commonAppService.mySealWait, {arg_user_id :Cookie.get('userid')}),
           
        ];
        if (newsList.retCode == "1" && timeSheetRes.RetCode === '1' && taskListRes.RetCode === '1' && teamManageRes.retCode === '1' && fundingPlanRes.RetCode === '1'
          && partnerRes.RetCode === '1' && roleRes.RetCode === '1' && overtimeRes.RetCode === '1' && leaveRes.RetCode === '1' && trainRes.RetCode === '1'
          && meetingMyWait.RetCode === '1' && appraiseRes.RetCode === '1' && absenceRes.RetCode === '1' && laborSympathyRes.RetCode === '1' && attendRes.RetCode === '1'
          && mySealWaitRes.RetCode === '1') {
            //新闻待办时间
            newsList.dataRows.pageItems.map((item, index) => {
              item.sortDate = item.createTime.slice(0,19);
              item.key=index;
              item.type = '1';
            });
          //印章按时间排序
          mySealWaitRes.DataRows.map((item, index) => {
            item.sortDate = item.update_date.slice(0,19);
            item.key=index;
            item.type = '1';
          });
		      //会议待办按时间排序
          meetingMyWait.DataRows.map((item, index) => {
            item.sortDate = item.create_date.slice(0,19);
            item.key=index;
            item.type = '1';
          });
          //按时间排序
          timeSheetRes.DataRows.map((item, index) => {
              item.sortDate = item.mess_date_show;
              item.task_id = item.proj_code+index;
          })
          fundingPlanRes.DataRows.map((item, index) => {
            item.sortDate = item.messDateShow;
            item.task_id = item.teamId + index;
          })
          taskListRes.DataRows.map((item, index) => {
              item.sortDate = item.task_date_show;

          if (item.task_param && item.task_content) {
            item.task_param = JSON.parse(item.task_param);
            item.task_content = JSON.parse(item.task_content);
          }
        })
        teamManageRes.dataRows.map((item, index) => {
          item.task_content = {
            'create_byname': item.createByName,
            'create_byid': item.createBy,
            'tag': (item.previousProcessState === '3' || item.previousProcessState === '6' ? '3' : item.previousProcessState),
            'content': (item.proj && item.proj.projName) ? item.proj.projName : ""
          }
          item.task_id = item.opt;
          item.task_proj_sub_show = '团队管理';
          item.task_staff_name_from = item.staffIdName || "";
          item.task_type = '999';//团队管理
          item.task_status = item.handleId === '2' ? '3' : item.handleId;
          item.sortDate = item.createTime;
        })
        partnerRes.DataRows.map((item, index) => {
          item.task_content = {
            'create_byname': item.mgr_name,
            'create_byid': item.create_by,
            'tag': roleRes.RetNum === '2' ? '3' : item.state,
            'content': item.proj_name
          }
          item.task_id = item.batchid;
          item.task_proj_sub_show = item.proj_type;
          item.task_staff_name_from = item.create_by_name;
          item.task_type = '998';//合作伙伴
          item.task_status = '0';
          item.sortDate = item.create_time;
        })

        // 增加加班待办
        overtimeRes.DataRows.map((item) => {
          item.sortDate = item.create_time;
          item.task_id = item.task_id;
          item.task_content = item.task_name + "：" + item.step;
          item.task_proj_sub_show = '节假日加班处理';
          item.task_staff_name_from = item.create_person_name;
          item.task_type = item.task_type;
          item.task_status = '1';
        })


          // 增加离职待办
          leaveRes.DataRows.map((item) => {
            item.sortDate = item.create_time;
            item.task_id = item.task_id;
            item.task_content = item.task_name +"："+ item.step;
            item.task_proj_sub_show = item.stepName;
            item.task_staff_name_from = item.create_person_name;
            item.task_type = item.task_type;
            item.task_status = '1';
          })
          // 请假管理待办
          absenceRes.DataRows.map((item) => {
            item.sortDate = item.create_time;
            item.task_id = item.proc_task_id;
            item.task_content = item.step;
            item.task_proj_sub_show = '请假审批处理';
            item.task_staff_name_from = item.create_person_name;
            item.task_type = item.task_type;
            item.task_status = '1';
          })
          // 工会慰问审批待办
          laborSympathyRes.DataRows.map((item) => {
            item.sortDate = item.create_time;
            item.task_id = item.proc_task_id;
            item.task_content = item.step;
            item.task_proj_sub_show = '工会慰问审批处理';
            item.task_staff_name_from = item.create_person_name;
            item.task_type = item.task_type;
            item.task_status = '1';
          })
            // 考勤管理审批待办
          attendRes.DataRows.map((item) => {
            item.sortDate = item.create_time;
            item.task_id = item.proc_task_id;
            item.task_content = item.step;
            item.task_proj_sub_show = '考勤管理审批处理';
            item.task_staff_name_from = item.create_person_name;
            item.task_type = item.task_type;
            item.task_status = '1';
          })
          // 增加培训审批待办
          trainRes.DataRows.map((item) => {
            item.sortDate = item.create_time;
            item.task_id = item.task_id;
            item.task_content = item.task_name +"："+ item.step;
            item.task_proj_sub_show = '培训审批处理';
            item.task_staff_name_from = item.create_person_name;
            item.task_type = item.task_type;
            item.task_status = '1';
          });

          // 增加干部管理待评议待办
          appraiseRes.DataRows.map((item) => {
            item.sortDate = item.create_time;
            item.task_content = item.task_name;
            item.task_type = item.task_type;
            item.comment_type = item.comment_type;
          });
            const data = [...taskListRes.DataRows, ...timeSheetRes.DataRows, ...teamManageRes.dataRows,...fundingPlanRes.DataRows,
            ...partnerRes.DataRows,...overtimeRes.DataRows,...leaveRes.DataRows,...trainRes.DataRows,...meetingMyWait.DataRows,
            ...appraiseRes.DataRows,...absenceRes.DataRows,...laborSympathyRes.DataRows,...attendRes.DataRows,...mySealWaitRes.DataRows
            ];
            if (data.length) {
                data.sort(propertySort(data,'sortDate',true));
            }
            yield put({
                type: 'myBacklog',
                DataRows:data,
                RowCount:data.length
            });
        }
    },
    // 跳转合作伙伴待办详情页
    *taskPartnerPage({ payload }, { call, put }) {
      yield put(routerRedux.push({ pathname: '/taskPartner', query: payload }));
    },
    // 跳转待办详情页
    *taskDetailPage({ payload }, { call, put }) {
      yield put(routerRedux.push({ pathname: '/taskDetail', query: payload }));
    },
    // 跳转项目考核待办详情页
    *taskProKpiPage({ param }, { call, put }) {
      const { RetCode, DataRows } = yield call(commonAppService.checkHisquery, { transjsonarray: '{"sequence":[{"check_auto_id":0}],"condition":{"check_batchid":' + param.check_batchid + '}}' });
      if (RetCode === '1') {
        if (DataRows[DataRows.length - 1].current_link_roleid === 'TMO') {
          yield put(routerRedux.push({ pathname: '/tasProkKpiTMO', query: param }));
        } else {
          yield put(routerRedux.push({ pathname: '/tasProkKpiDM', query: param }));
        }
      }

    },
    // 跳转待办详情页
    *taskASPage({ payload }, { call, put }) {
      yield put(routerRedux.push({ pathname: '/taskAS', query: payload }));
    },
    // 跳转待办详情页
    *taskTeamManagePage({ payload }, { call, put }) {
      yield put(routerRedux.push({ pathname: '/taskTeamManage', query: payload }));
    },
    //跳转到项目变更的详情页( 先判断待办中的项目变更是否被审核过，如果没被审核过，跳转到详情页，如果被审核过，返回列表页)
    *changeCheck({ payload }, { put, call }) {
      if (payload.arg_handle_flag === 0) {
        const data = yield call(commonAppService.taskIsChecked, {
          arg_task_id: payload.arg_task_id,
          arg_task_uuid: payload.arg_task_uuid
        });
        if (data.RetCode === '1') {
          if (data.RetNum === '1') {
            yield put(routerRedux.push({ pathname: '/projChangeCheck', query: payload }));
          } else {
            yield put(routerRedux.push({ pathname: '/taskList' }));
            message.error('项目变更已经被审核！');
          }
        }
      } else {
        yield put(routerRedux.push({ pathname: '/projChangeCheck', query: payload }));
      }
    },
    //跳转到交付物管理的详情页
    *deliverableCheck({ payload }, { put, call }) {
      if (payload.arg_handle_flag === 0) {
        const data = yield call(commonAppService.taskIsChecked, {
          arg_task_id: payload.arg_task_id,
          arg_task_uuid: payload.arg_task_uuid
        });
        if (data.RetCode === '1') {
          if (data.RetNum === '1') {
            yield put(routerRedux.push({ pathname: '/deliverableManage', query: payload }));
          } else {
            yield put(routerRedux.push({ pathname: '/taskList' }));
            message.error('交付物变更已经被审核！');
          }
        }
      } else {
        yield put(routerRedux.push({ pathname: '/deliverableManage', query: payload }));
      }
    },

    //跳转到 审核TMO修改全成本详情页
    *modifyFullcostCheck({ payload }, { put, call }) {
      if (payload.arg_handle_flag === 0) {
        const data = yield call(commonAppService.taskIsChecked, {
          arg_task_id: payload.arg_task_id,
          arg_task_uuid: payload.arg_task_uuid
        });
        if (data.RetCode === '1') {
          if (data.RetNum === '1') {
            yield put(routerRedux.push({ pathname: '/projFullcostView', query: payload }));
          } else {
            yield put(routerRedux.push({ pathname: '/taskList' }));
            message.error('TMO修改全成本已经被审核！');
          }
        }
      } else {
        yield put(routerRedux.push({ pathname: '/projFullcostView', query: payload }));
      }
    },

    // 获取部门领导报告
    *getLeaderFileList({ payload }, { put, call }) {
      const data = yield call(leaderScoreSearch, payload);
      if (data.RetCode === '1') {
        yield put({
          type: 'leaderFile',
          fileList: data.DataRows
        })
      }
    },


    *deleteOvertimeApproval({ payload }, { call, put }) {
      //项目组查询
      let param = {
        arg_apply_id: payload.task_id,
        arg_apply_type: payload.apply_type,
      };
      yield call(overtimeService.deleteApproval, param);
    },


    *deleteTrainClassApplyApproval({ payload }, { call }) {
      let param = {
        arg_apply_id: payload.task_id,
        arg_apply_type: payload.train_type,
      };
      yield call(trainService.deleteApproval, param);
    },

    //删除待办的阅后即焚信息
    *deleteContractApproval({ payload }, { call }) {
      let param = {
        arg_apply_id: payload.task_id,
        arg_apply_type: payload.apply_type,
      };
      yield call(contractService.deleteContractApproval, param);
    },

  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/commonApp') { //此处监听的是连接的地址
          dispatch({
            type: 'login',
            query
          });
        }
      });
    },
  },
}
