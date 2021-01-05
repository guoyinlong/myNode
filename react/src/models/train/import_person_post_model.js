/**
 *  作者: 翟金亭
 *  创建日期: 2019-08-19
 *  邮箱：zhaijt33@chinaunicom.cn
 *  文件说明：实现员工岗位导入
 */
import * as trainService from "../../services/train/trainService";
import Cookie from 'js-cookie';
import { OU_NAME_CN, OU_HQ_NAME_CN } from '../../utils/config';
import { message } from "antd";

const auth_tenantid = Cookie.get('tenantid');
const auth_ou = Cookie.get('OU');
const ou_id = Cookie.get('OUID');
let auth_ou_flag = auth_ou;
if (auth_ou_flag === OU_HQ_NAME_CN) { //截取部门用：如果所属OU是联通软件研究院本部，则auth_ou_flag = 联通软件研究院
  auth_ou_flag = OU_NAME_CN;
}

//当前时间
function getCurrentDate() {
  let date = new Date().getDate();
  let month = new Date().getMonth() + 1;
  let year = new Date().getFullYear();
  return `${year}-${month < 10 ? `0${month}` : `${month}`}-${date < 10 ? `0${date}` : `${date}`}`
}

//导入文件数据整理
function dataFrontDataImportPersonPost(data) {
  let frontDataList = [];
  let i = 1;
  for (let item in data) {
    let newData = {
      //序号
      indexID: i,
      //用户名
      loginname: data[item].用户名,
      //姓名
      user_name: data[item].姓名,
      //所属单位
      dept_name: data[item].所属单位,
      //注册方式
      register_type: data[item].注册方式,
      //注册状态
      register_status: data[item].注册状态,
      //更新人员
      update_person: data[item].更新者,
      //更新日期
      update_time: getCurrentDate(),
      //邮箱
      mail: data[item].邮箱,
      //项目
      proj_name: data[item].项目,
    };
    frontDataList.push(newData);
    i++;
  }
  return frontDataList;
}

export default {
  namespace: 'importPersonPost',
  state: {
    ouList: [],
    postList: [],
    initPost: [],
    allPostDataList: [],
    importUIPostDataDataList: [],
    importrequirePostDataList: [],
    importframeworkPostDataDataList: [],
    importfrontPostDataList: [],
    importbackPostDataList: [],
    importtestPostDataList: [],
    importsafePostDataList: [],
    importdevopsPostDataList: [],
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    saveOU(state, { ouList: DataRows }) {
      return { ...state, ouList: DataRows };
    },
  },
  effects: {

    *ouSearchDefault({ }, { call, put }) {

      let getPostParam = {};
      getPostParam["arg_ou_id"] = ou_id;
      const getPostData = yield call(trainService.getPostList, getPostParam);
      if (getPostData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            postList: getPostData.DataRows,
            initPost: getPostData.DataRows[0].train_post_id,
          }
        });
      } else {
        message.error('没有查询内容');
      }

      //从服务获取OU列表
      let postData_getOU = {};
      postData_getOU["arg_tenantid"] = auth_tenantid;
      const getOuData = yield call(trainService.getOuList, postData_getOU);
      if (getOuData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            ouList: getOuData.DataRows
          }
        });
      } else {
        message.error('没有查询内容');
      }
    },

    *allPostSearch({ param }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          allPostDataList: []
        }
      });
      //查询对应岗位的人员信息
      let getAllPostParam = {};

      getAllPostParam["arg_ou_id"] = param.arg_ou_id;
      getAllPostParam["arg_post_id"] = param.arg_post_id;
      getAllPostParam["arg_user_id"] = param.arg_user_id;
      const getAllPostData = yield call(trainService.getAllPostList, getAllPostParam);
      if (getAllPostData.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            allPostDataList: getAllPostData.DataRows
          }
        });
      } else {
        message.error('没有查询内容');
      }
    },

    //批量导入前台存储，尚未写入数据库
    *personPostImportOperation({ devopsPostData, safePostData, testPostData, backPostData, frontPostData, frameworkPostData, requirePostData, UIPostData }, { put }) {
      yield put({
        type: 'save',
        payload: {
          importUIPostDataDataList: [],
          importrequirePostDataList: [],
          importframeworkPostDataDataList: [],
          importfrontPostDataList: [],
          importbackPostDataList: [],
          importtestPostDataList: [],
          importsafePostDataList: [],
          importdevopsPostDataList: [],
        }
      });
      if (devopsPostData) {
        yield put({
          type: 'save',
          payload: {
            importdevopsPostDataList: dataFrontDataImportPersonPost(devopsPostData),
            haveData: true
          }
        });
      }
      if (safePostData) {
        yield put({
          type: 'save',
          payload: {
            importsafePostDataList: dataFrontDataImportPersonPost(safePostData),
            haveData: true
          }
        });
      }
      if (testPostData) {
        yield put({
          type: 'save',
          payload: {
            importtestPostDataList: dataFrontDataImportPersonPost(testPostData),
            haveData: true
          }
        });
      }
      if (backPostData) {
        yield put({
          type: 'save',
          payload: {
            importbackPostDataList: dataFrontDataImportPersonPost(backPostData),
            haveData: true
          }
        });
      }
      if (frontPostData) {
        yield put({
          type: 'save',
          payload: {
            importfrontPostDataList: dataFrontDataImportPersonPost(frontPostData),
            haveData: true
          }
        });
      }
      if (frameworkPostData) {
        yield put({
          type: 'save',
          payload: {
            importframeworkPostDataDataList: dataFrontDataImportPersonPost(frameworkPostData),
            haveData: true
          }
        });
      }
      if (requirePostData) {
        yield put({
          type: 'save',
          payload: {
            importrequirePostDataList: dataFrontDataImportPersonPost(requirePostData),
            haveData: true
          }
        });
      }
      if (UIPostData) {
        yield put({
          type: 'save',
          payload: {
            importUIPostDataDataList: dataFrontDataImportPersonPost(UIPostData),
            haveData: true
          }
        });
      }
    },

    //批量导入人岗信息，写入数据库
    *importPersonPostInfoSaveOperation({ transferUIPostDataDataList, transferrequirePostDataList, transferframeworkPostDataDataList, transferfrontPostDataList, transferbackPostDataList,
      transfertestPostDataList, transfersafePostDataList, transferdevopsPostDataList, train_person_post_id, resolve }, { call }) {
      let postData = {};
      postData["arg_train_person_post_id"] = train_person_post_id;
      postData["arg_import_id"] = '';

      try {
        //回滚标志
        let rollbackFlag = 0;
        if (transferUIPostDataDataList.length > 0) {
          for (let i = 0; i < transferUIPostDataDataList.length; i++) {
            const savePersonPostInfo = yield call(trainService.trainPersonPostImportSubmit, transferUIPostDataDataList[i]);
            if (savePersonPostInfo.RetCode !== '1') {
              message.error('保存失败');
              rollbackFlag = 1;
              break;
            }
          }
        }
        if (transferrequirePostDataList.length > 0) {
          for (let i = 0; i < transferrequirePostDataList.length; i++) {
            const savePersonPostInfo = yield call(trainService.trainPersonPostImportSubmit, transferrequirePostDataList[i]);
            if (savePersonPostInfo.RetCode !== '1') {
              message.error('保存失败');
              rollbackFlag = 2;
              break;
            }
          }
        }
        if (transferframeworkPostDataDataList.length > 0) {
          for (let i = 0; i < transferframeworkPostDataDataList.length; i++) {
            const savePersonPostInfo = yield call(trainService.trainPersonPostImportSubmit, transferframeworkPostDataDataList[i]);
            if (savePersonPostInfo.RetCode !== '1') {
              message.error('保存失败');
              rollbackFlag = 3;
              break;
            }
          }
        }
        if (transferfrontPostDataList.length > 0) {
          for (let i = 0; i < transferfrontPostDataList.length; i++) {
            const savePersonPostInfo = yield call(trainService.trainPersonPostImportSubmit, transferfrontPostDataList[i]);
            if (savePersonPostInfo.RetCode !== '1') {
              message.error('保存失败');
              rollbackFlag = 4;
              break;
            }
          }
        }
        if (transferbackPostDataList.length > 0) {
          for (let i = 0; i < transferbackPostDataList.length; i++) {
            const savePersonPostInfo = yield call(trainService.trainPersonPostImportSubmit, transferbackPostDataList[i]);
            if (savePersonPostInfo.RetCode !== '1') {
              message.error('保存失败');
              rollbackFlag = 5;
              break;
            }
          }
        }
        if (transfertestPostDataList.length > 0) {
          for (let i = 0; i < transfertestPostDataList.length; i++) {
            const savePersonPostInfo = yield call(trainService.trainPersonPostImportSubmit, transfertestPostDataList[i]);
            if (savePersonPostInfo.RetCode !== '1') {
              message.error('保存失败');
              rollbackFlag = 6;
              break;
            }
          }
        }
        if (transfersafePostDataList.length > 0) {
          for (let i = 0; i < transfersafePostDataList.length; i++) {
            const savePersonPostInfo = yield call(trainService.trainPersonPostImportSubmit, transfersafePostDataList[i]);
            if (savePersonPostInfo.RetCode !== '1') {
              message.error('保存失败');
              rollbackFlag = 7;
              break;
            }
          }
        }
        if (transferdevopsPostDataList.length > 0) {
          for (let i = 0; i < transferdevopsPostDataList.length; i++) {
            const savePersonPostInfo = yield call(trainService.trainPersonPostImportSubmit, transferdevopsPostDataList[i]);
            if (savePersonPostInfo.RetCode !== '1') {
              message.error('保存失败');
              rollbackFlag = 8;
              break;
            }
          }
        }
        console.log(rollbackFlag);
        if (rollbackFlag !== 0) {
          message.error('提交失败');
          yield call(trainService.deleteTrainPersonPostImportSubmit, postData);
          resolve("false");
        } else {
          message.success('提交成功');
          resolve("success");
        }
      } catch (error) {
        message.error('回滚失败');
        resolve("false");
      }
    },

    //删除一条数据
    *deletPersonPostOperation({ paramData, selectedItem, resolve }, { call, put }) {
      let deleteFlag = 0;
      let postData = {};
      postData["arg_train_person_post_id"] = '';
      let queryParam = {};
      queryParam["arg_post_id"] = paramData.arg_post_id;
      queryParam["arg_ou_id"] = paramData.arg_ou_id;
      queryParam["arg_user_id"] = paramData.arg_user_id;
      for (let i = 0; i < selectedItem.length; i++) {
        postData["arg_import_id"] = selectedItem[i].id;
        const deletePersonPostInfo = yield call(trainService.deleteTrainPersonPostImportSubmit, postData);
        if (deletePersonPostInfo.RetCode !== '1') {
          deleteFlag = 1;
          break;
        }
      }
      if (deleteFlag !== 1) {
        message.success('删除成功');
        resolve("success");
        yield put({
          type: 'allPostSearch',
          param: queryParam
        });
      } else if (deleteFlag === 1) {
        resolve("false");
      }
    },

    //修改岗位
    *updatePersonPostInfoSaveOperation({ transferUpdatePostDataList, paramData, resolve }, { call, put }) {
      let updateFlag = 0;
      let postData = {};
      let queryParam = {};
      queryParam["arg_post_id"] = paramData.arg_post_id;
      queryParam["arg_ou_id"] = paramData.arg_ou_id;
      queryParam["arg_user_id"] = paramData.arg_user_id;

      for (let i = 0; i < transferUpdatePostDataList.length; i++) {
        postData["arg_login_name"] = transferUpdatePostDataList[i].arg_login_name;
        postData["arg_update_person"] = transferUpdatePostDataList[i].arg_update_person;
        postData["arg_train_post_id"] = transferUpdatePostDataList[i].arg_train_post_id;
        postData["arg_import_id"] = transferUpdatePostDataList[i].arg_import_id;
        const updatePersonPostInfo = yield call(trainService.updateTrainPersonPostImportSubmit, postData);
        if (updatePersonPostInfo.RetCode !== '1') {
          updateFlag = 1;
          break;
        }
      }
      if (updateFlag !== 1) {
        message.success('更新成功');
        resolve("success");
        yield put({
          type: 'allPostSearch',
          param: queryParam
        });
      } else if (deleteFlag === 1) {
        resolve("false");
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/train/trainManage/importPersonPost') {
          dispatch({ type: 'ouSearchDefault', query });
        }
      });
    }
  }
};
