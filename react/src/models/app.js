/**
 * 作者：任华维
 * 日期：2017-8-11
 * 邮箱：renhw21@chinaunicom.cn
 * 功能：框架主体
 */
import * as appServices from "../services/app";
import config from "../utils/config";
import { addFavorite, getUuid } from "../utils/func";
import { notification, message, Modal } from "antd";
import { routerRedux } from "dva/router";
import menu from "../utils/menu";
import cookie from "js-cookie";
const { confirm } = Modal;

export default {
  namespace: "app",
  state: {
    login: !config.loginConfig.needLogin || localStorage.getItem("userid"),
    isLoginFailed: false,
    forgetPwdVisible: false, //忘记密码时的模态框
    forgetVerifyCode:
      config.loginConfig.CaptchaAddress +
      "?" +
      (Math.random() * 100000).toFixed(0),
    loginFormForgotKey: "",
    resetPwd: false,
    menuPopoverVisible: false,
    profileVisible: false,
    profilePictures: [],
    modifyPwdVisible: false,
    avatarUrl: localStorage.getItem("avatarUrl"),
    avatarUuid: localStorage.getItem("avatarUuid"),
    siderFold: localStorage.getItem("siderFold") === "true",
    isNavbar: localStorage.getItem("isNavbar") === "true", //document.body.clientWidth < 769,
    user: localStorage.getItem("username"),
    fullName: localStorage.getItem("fullName"),
    userid: localStorage.getItem("userid"),
    theme: localStorage.getItem("themeString"),
    email: null,
    tokenid: null,
    menuOpenKeys: [],
    menu: JSON.parse(localStorage.getItem("menu")) || [],
  },
  effects: {
    /**
     * 作者：任华维
     * 创建日期：2017-8-11
     * 功能：tab切换
     * @param payload 路径
     */
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
     * 作者：任华维
     * 创建日期：2017-8-11
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
     * 作者：任华维
     * 创建日期：2017-8-11
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
     * 作者：任华维
     * 创建日期：2017-8-11
     * 功能：判断登录
     */
    *isLogin({ payload }, { call, put }) {
      const res = yield call(appServices.isLogin);
      if (res.RetCode === "1") {
        if (payload === "/login" || payload === "/login/prjAdminLogin") {
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
        if (payload === "/login" || payload==="/login/prjAdminLogin" ) {
          //登录页判断未登录执行退出成功
          yield put({ type: "logoutSuccess" });
        } else if (payload === "/lock") {
          //锁定页判断未登录执行锁定成功
          yield put({ type: "lockSuccess" });
        } else {
          //其他页判断未登录则跳转至登录页
          yield put(routerRedux.push("/login" || "/login/prjAdminLogin" ));
        }
      }
    },
    /**
     * 作者：任华维
     * 创建日期：2017-8-11
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
     * 作者：任华维
     * 创建日期：2017-8-11
     * 功能：获取模块菜单
     * @param payload arguserid 用户id
     * @param payload argtenantid
     * @param payload argtpid 模块id
     */
    *getSubSystemAndModule({ payload }, { call, put, select }) {
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
            /*menu[i].child.push({
                            key: 'oldProjectManage',
                            name: '原项目管理系统',
                            icon: '',
                        });*/
            menu[i].child = res.DataRows;
            menu[i].child.push({
              key: "projRecord",
              name: "项目推送11",
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
            /*menu[i].child.push({
                          key:'projPrepare',
                          name:'项目筹划',
                          icon:'setting',
                          child:[
                            {
                              key:'memberQuery',
                              name:'人员查询',
                              icon:'',
                            },
                            {
                              key:'projPlan',
                              name:'项目计划',
                              icon:'',
                            }
                          ]
                        });
                        menu[i].child.push({
                          key: 'projMonitor',
                          name: '项目监控',
                          icon: 'setting',
                          child: [
                            {
                              key: 'change',
                              name: '项目变更',
                              icon: '',
                            },
                            {
                              key:'risk',
                              name:'风险跟踪',
                              icon:'',
                            },
                            {
                            key:'issueTrack',
                            name:'问题跟踪',
                            icon:'',
                            }
                          ]
                        });
                        menu[i].child.push({
                          key:'projClosure',
                          name:'项目收尾',
                          icon:'setting',
                          child:[
                            {
                              key:'historyProject',
                              name:'历史项目',
                              icon:'',
                            }
                          ]
                        });*/
            /*menu[i].child.push({
                           key: 'projExecute',
                           name: '项目执行',
                           icon: 'setting',
                           child: [
                             {
                               key: 'report',
                               name: '项目报告',
                               icon: '',
                             }
                           ]
                         });*/

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
          // else if(payload.data[i].key === "adminApp"){
          //   res.DataRows.map((item, index) => {
          //     item.child = JSON.parse(item.child);
          //   })
          //   menu[i].child = res.DataRows;
          //   menu[i].child.push({
          //     key: 'regulationM',
          //     name: '规章制度管理',
          //     icon: 'book',
          //     child: [{
          //       key: 'ruleRegulation',
          //       name: '规章制度',
          //       icon: '',
          //     },
          //     {
          //       key: 'myUpload',
          //       name: '我的上传',
          //       icon: '',
          //     },
          //     {
          //       key: 'myApproval',
          //       name: '我的审批',
          //       icon: '',
          //     },
          //     {
          //       key: 'messFeedback',
          //       name: '留言反馈',
          //       icon: '',
          //     },
          //     {
          //       key: 'downloadReport',
          //       name: '下载量报表',
          //       icon: '',
          //     }]
          //   });
          // }
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
     * 作者：任华维
     * 创建日期：2017-8-11
     * 功能：登录
     * @param payload username
     * @param payload password
     */
    *login({ payload, callback }, { call, put, select }) {
      const res = yield call(appServices.login, payload);
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
            yield put(routerRedux.push("/"));
          }
        }
      } else {
        callback();
        message.error(res.RetVal);
      }
    },
    /**
     * 作者：任华维
     * 创建日期：2017-8-11
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
          "second_login"
        ];
        cookieList.forEach((item) => {
          cookie.remove(item);
        });
        yield put(routerRedux.push("/login" || "/login/prjAdminLogin"));
        setTimeout(() => {
          window.location.reload();
        }, 0);
      }
    },
    /**
     * 作者：任华维
     * 创建日期：2017-8-11
     * 功能：锁屏退出
     */
    *lock({}, { call, put }) {
      const res = yield call(appServices.logout);
      if (res.RetCode === "1") {
        yield put({ type: "lockSuccess" });
      }
    },
    /**
     * 作者：任华维
     * 创建日期：2017-8-11
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
     * 作者：任华维
     * 创建日期：2017-8-11
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
     * 作者：任华维
     * 创建日期：2017-8-11
     * 功能：用户修改密码弹窗
     */
    *getModifyPwdInfo({ payload }, { call, put }) {
      yield put({ type: "showModifyPwdModal" });
    },
    /**
     * 作者：任华维
     * 创建日期：2017-8-11
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
     * 作者：任华维
     * 创建日期：2017-8-11
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
     * 作者：任华维
     * 创建日期：2017-8-11
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
     * 作者：任华维
     * 创建日期：2017-8-11
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
     * 作者：任华维
     * 创建日期：2017-8-11
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
     * 作者：任华维
     * 创建日期：2017-8-11
     * 功能：切换收缩模式
     */
    *changeSider({}, { put }) {
      yield put({ type: "switchNavbar" });
    },
    /**
     * 作者：任华维
     * 创建日期：2017-8-11
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
     * 作者：任华维
     * 创建日期：2017-8-11
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
     * 作者：任华维
     * 创建日期：2017-8-11
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
  },
  reducers: {
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
      document.cookie="second_login="+0;  
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
  subscriptions: {
    setup({ dispatch, history }) {
      //window.onresize = () => dispatch({ type: 'changeNavbar' })
      //监听路由转换，转换后切换菜单
      history.listen(({ pathname }) => {
        //监听路由
        dispatch({
          type: "isLogin",
          payload: pathname,
        });
      });
    },
  },
};
