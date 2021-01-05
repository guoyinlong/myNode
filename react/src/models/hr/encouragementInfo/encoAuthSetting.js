/**
 * 作者：王旭东
 * 创建日期：2019-2-13
 * 邮箱：wangxd347@chinaunicom.cn
 *文件说明：
 */

import * as service from '../../../services/encouragement/services';
import {message} from "antd";
import Cookie from 'js-cookie';

export default {
    namespace: 'encoAuthSetting',
    state: {
        categoryList: [],
        reportList: [],
        reportTypeList:[]
    },

    reducers: {
        save(state, action) {
            return {...state, ...action.payload};
        },
    },

    effects: {
        * initData({}, {call, select, put}) {

            // 查询权限信息表格数据
            const getCategoryData = yield call(service.categorylistS)
            if (getCategoryData.RetCode === '1') {
                let categoryList = getCategoryData.DataRows;
                categoryList.forEach(item => item.key = item.staff_id)
                yield put({
                    type: 'save',
                    payload: {
                        categoryList: categoryList,
                    }
                });
            }

            //查询激励报告信息表格数据
            const getReportList = yield call(service.reportList)
            if (getReportList.RetCode === '1') {
                let reportList = getReportList.DataRows;
                reportList.forEach(item => item.key = item.staff_id)
                yield put({
                    type: 'save',
                    payload: {
                      reportList: reportList,
                    }
                });
            }

            // 查询全部的权限信息类型
            const getAllCategoryData = yield call(service.allCategorylistS, {
                transjsonarray: JSON.stringify({
                    "property": {"category_name": "category_name", "uid": "category_uid"},
                    "condition": {"state": "0"}
                })
            })

            if (getAllCategoryData.RetCode === '1') {
                let allCategoryList = getAllCategoryData.DataRows;
                allCategoryList.forEach(item => item.key = item.category_uid)
                yield put({
                    type: 'save',
                    payload: {
                        allCategoryList: allCategoryList,
                    }
                });
            }


             // 查询激励报告类型
             const getReportType = yield call(service.ReportType)
          if (getReportType.RetCode === '1') {
              let reportTypeList = getReportType.DataRows;
              reportTypeList.forEach(item => item.key = item.code)
              yield put({
                  type: 'save',
                  payload: {
                    reportTypeList: reportTypeList,
                  }
              });
          }

        },

        * saveAuth({staff_id, category_uid_Arrs}, {call, select, put}) {
            let postArr = category_uid_Arrs.map(item => ({"category_uid": item.category_uid, "staff_id": staff_id}))
            // 查询表格数据
            const getSaveData = yield call(service.saveAuthS, {
                transjsonarray: JSON.stringify(postArr)
            })

            if (getSaveData.RetCode === '1') {
                message.info('添加成功！')
            }

            yield put({
                type: 'initData'
            })

        },

        * deleteAuth({staff_id}, {call, select, put}) {

            // let postArr = category_uid_Arrs.map(item => ({"category_uid": item.category_uid, "staff_id": staff_id}))
            const getDelData = yield call(service.deleteAuthS, {
                transjsonarray: JSON.stringify([{"update": {"state": "1"}, "condition": {"staff_id": staff_id}}])
            })

            if (getDelData.RetCode === '1') {
                message.info('删除成功！')
            }

            yield put({
                type: 'initData'
            })

        },

        // 编辑先删除 再添加
        * editAuth({category_uid_Arrs, record}, {call, select, put}) {
            // let postArr = category_uid_Arrs.map(item => ({"category_uid": item.category_uid, "staff_id": staff_id}))
            const getDelData = yield call(service.deleteAuthS, {
                transjsonarray: JSON.stringify([{"update": {"state": "1"}, "condition": {"staff_id": record.staff_id}}])
            })
            if (getDelData.RetCode==='1'){
                yield put({
                    type: 'saveAuth',
                    staff_id: record.staff_id,
                    category_uid_Arrs: category_uid_Arrs,
                })
            }
        },

            // 激励报告添加编辑删除（共用）
            * reportSetting({params}, {call, select, put}) {
            params.report_type=JSON.stringify(params["report_type"])
            const getDelData = yield call(service.ReportSetting, params)
            if (getDelData.RetCode==='1'){
              switch (params.tag) {
                case 'insert':
                  message.success("添加成功！");
                  break;
                case 'update':
                  message.success("设置成功！");
                  break;
                case 'delete':
                  message.success("删除成功！");
                  break
              }
              yield put({ type: 'initData'})
            }else{
              message.warning(getDelData.RetVal)
            }
          },



    },
    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname, query}) => {
                if (pathname === '/humanApp/hr/encoAuthSetting') {
                    dispatch({type: 'initData', query});
                }
            });
        },
    },
};
