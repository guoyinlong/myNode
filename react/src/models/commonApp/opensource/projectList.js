/*
    @author:zhulei
    @date:2017/11/9
    @email:xiangzl3@chinaunicom.cn
    @description:GitLab-项目列表
*/

import * as gitLabService from '../../../services/commonApp/GitLabService.js';
import {message} from 'antd';
import Cookie from 'js-cookie';

export default {
  namespace: 'projectList',
  state: {
    starList: [],
    commitList: [],
    classList: [],
    projList: [],
    langList: [],
    rowCount: null,
    arr: [],
  },

  reducers: {
    save(state, action) {
      return {...state, ...action.payload};
    },

  },

  effects: {
    * projectListDefault({}, {call, put}) {

      // 调用Gitlab集成项目星级统计服务
      const starData = yield call(gitLabService.starsstatistics);
      if (starData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            starList: starData.DataRows
          },
        });
      } else {
        message.error(starData.RetVal);
      }

      // 调用Gitlab项目提交统计查询服务
      const commitData = yield call(gitLabService.commitsstatistics);
      if (commitData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            commitList: commitData.DataRows,
          }
        });
      } else {
        message.error(commitData.RetVal);
      }

      // 调用Gitlab项目分类统计查询服务
      const classData = yield call(gitLabService.gitlab_projclass_statistics);
      if (classData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            classList: classData.DataRows,
          }
        });
      } else {
        message.error(classData.RetVal);
      }

      // 调用Gitlab项目语言分类查询服务
      const mianLangData = yield call(gitLabService.gitlab_projlang_statistics);
      if (mianLangData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            langList: mianLangData.DataRows,
          }
        });
      } else {
        message.error(mianLangData.RetVal);
      }
      // 调用Gitlab项目字典查询服务
      const projData = yield call(gitLabService.gitlab_query_proj);
      const proJ = projData.DataRows;
      const abcRowCount = Math.ceil(projData.AbcRowCount / 5);
      let tempArray = [];
      const arr = [];
      let counter = 0;
      for (let i = 0; i < proJ.length; i++) {
        let header = proJ[i]["zhBookHeader"];
        let projs = JSON.parse(proJ[i]["projs"]);
        tempArray.push({"zhBookHeader": header});

        for (let j = 0; j < projs.length; j++) {
          let zhname = projs[j]["zhname"];
          let url = projs[j]["gitlab_proj_url"];
          tempArray.push({"zhname": zhname, "gitlab_proj_url": url});
          if (tempArray.length >= abcRowCount) {
            arr[counter] = tempArray.slice(0, tempArray.length + 1);
            counter++;
            tempArray.length = 0;
          }
        }
        if (arr.length === 4) {
          arr[4] = tempArray.slice(0, tempArray.length + 1);
        }

      }

      if (projData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            projList: arr,
          }
        });
      } else {
        message.error(projData.RetVal);
      }


    },//projectListDefault

    * signin({arg_param}, {call}) {
      Cookie.remove('_gitlab_session', {path: '/gitlab'});

      const basicInfoData = yield call(gitLabService.signin, arg_param);
      if (basicInfoData.RetCode === '1') {
        message.success("账号已登录");
        window.location.href =  arg_param["url"];
      } else {
        message.error(basicInfoData.RetVal);
      }
    }
  },
  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname}) => {
        if (pathname === '/commonApp/opensource/projectList') {
          dispatch({type: 'projectListDefault'});
        }
      });

    }
  }


}
