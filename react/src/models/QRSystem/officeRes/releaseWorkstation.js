/**
 *  作者:  王均超
 *  创建日期: 2019-09-02
 *  邮箱： wangjc@itnova.com.cn
 *  文件说明： 释放工位数据处理层
 */
import { message } from 'antd'
import Cookie from 'js-cookie';
import * as usersService from '../../../services/workStation/workStation.js';
import { routerRedux } from "dva/router";

export default {
  namespace: 'releaseWorkstation',
  state: {
    applyType: "0",//0 为流动类型 1 为常驻类型
    detail_id: "",
    releaseList: [],
    releaseRowSelectList: [],//释放人员申请勾选数据
    StaffNum: "",//释放人员申请数量
    // 人员页码信息
    page: 1,
    pageSize: 10,
    total: 0,
    applyBegin: null,
    applyEnd: null,
    endBegin: null,
    endEnd: null
  },

  reducers: {

    initData(state) {
      return {
        ...state,
        releaseList: [],//查询列表
        page: 1,
        pageSize: 10,
        total: 0,
        applyBegin: null,
        applyEnd: null,
        endBegin: null,
        endEnd: null
      }
    },
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

  effects: {
    //查询可以释放人员数据
    *queryStaffLitst({ }, { select, put, call }) {
      let { applyBegin, applyEnd, endBegin, endEnd, page, pageSize } = yield select(state => state.releaseWorkstation)
      let postData = {
        arg_page_size: pageSize,
        arg_current_page: page,
        arg_apply_time_left: applyBegin,
        arg_apply_time_right: applyEnd,
        arg_end_time_left: endBegin,
        arg_end_time_right: endEnd,
      };
      let data = yield call(usersService.assetsUseDetail, postData);
      if (data.RetCode === "1") {
        if (data.DataRows.length != 0) {
          data.DataRows.map((item, index) => {
            item.key = index;
            item.apply_time = item.apply_time.slice(0, 10);
          })
        }
        yield put({
          type: "save",
          payload: {
            releaseList: data.DataRows,
            total: Number(data.RowCount),
          }
        })
      }
    },

    //保存释放人员要提交的数据
    *releaseRowSelect({ data }, { select, put, call }) {
      let releaseRowSelectList = [];
      data.length !== 0 && data.map((item, index) => {
        item.key = index;
        releaseRowSelectList.push(item.detail_id)
        releaseRowSelectList.join(",")
      })
      yield put({ type: "save", payload: { releaseRowSelectList: releaseRowSelectList, StaffNum: data.length } })
    },

    //释放人员提交
    *flowSubmit({ }, { put, call, select }) {
      let { releaseRowSelectList, StaffNum } = yield select(state => state.releaseWorkstation)
      let postData = {
        arg_type: 1,
        arg_prop: 0,
        arg_number: StaffNum,
        arg_detail_ids: releaseRowSelectList.join(","),
      };
      let data = yield call(usersService.releaseAssets, postData);
      if (data.RetCode === "1") {
        message.success("释放成功")
        yield put({
          type: "save",
          payload: {
            releaseRowSelectList: [],//释放人员申请勾选数据
            StaffNum: "",//释放人员申请数量
            // 释放人员页码信息
            page: 1,
          }
        })
        yield put(
          routerRedux.push({ pathname: "adminApp/compRes/officeResMain" })
        )
      }
    },
    // 修改释放人员页码
    *changePage({ data }, { put }) {
      yield put({ type: "save", payload: { page: data } })
      yield put({ type: "queryStaffLitst" })
    },

    *init({ }, { select, put, call }) {
      yield put({ type: "queryStaffLitst" })
    },

    //申请开始时间
    *beginTime({ data }, { put }) {
      yield put({ type: "save", payload: { applyBegin: data[0], applyEnd: data[1] } });
      yield put({ type: "queryStaffLitst" });
    },
    //到期时间
    *endTime({ data }, { put }) {
      yield put({ type: "save", payload: { endBegin: data[0], endEnd: data[1] } });
      yield put({ type: "queryStaffLitst" });
    },
    //清空申请时间
    *clearApplyDate({ }, { put }) {
      yield put({ type: "save", payload: { applyBegin: null, applyEnd: null } });
      yield put({ type: "queryStaffLitst" });
    },
    //清空结束时间
    *clearExpireDate({ }, { put }) {
      yield put({ type: "save", payload: { endBegin: null, endEnd: null } });
      yield put({ type: "queryStaffLitst" });
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {

      return history.listen(({ pathname, query }) => {
        if (pathname === '/adminApp/compRes/officeResMain/releaseWorkstation') {
          dispatch({ type: 'init', query });
        }
      });
    },
  },
};
