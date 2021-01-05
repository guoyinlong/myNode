import * as projServices from "../../../../services/project/projChild";
import Cookie from "js-cookie";

export default {
  namespace: "projChild",
  state: {
    ou_name: "", //OU默认为全部*/
    proj_code: "", //项目编码默认为‘’
    proj_name: "", //项目名称默认为‘’
    mgr_name: "", //项目经理默认为‘’
    page: 1,
    view: "查看",
    status: {},
    rowCount: 0,
    //状态数据
    projParam: {
      proj_name: "",
      proj_code: "",
      mgr_name: "",
      record_state: ["未推送", "已推送"],
      tag_key: "",
      key: "",
    },
    //列表数据
    dataSource: [],
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    initData(state) {
      return {
        ...state,
        ou_name: "", //OU默认为全部*/
        proj_code: "", //项目编码默认为‘’
        proj_name: "", //项目名称默认为‘’
        mgr_name: "", //项目经理默认为‘’
        page: 1,
        view: "查看",
        status: {},
        rowCount: 0,
        //列表数据
        dataSource: [],
      };
    },
  },

  effects: {
    *inited({ query }, { put, }) {
      yield put({
        type: "querydata",
      });
      yield put({
        type: "initData",
      });
    },

    /**
     * 作者：张建鹏
     * 日期：2020-05-07
     * 说明：项目列表查询 数据展示
     **/
    *projServices({}, { call, select, put }) {
      let { projParam } = yield select((state) => state.projChild);
      let postDate = {
        arg_staff_id: Cookie.get("userid"),
      };
      let data = yield call(projServices.queryProjChild, postDate);
      if (data.RetCode === "1") {
        data.DataRows.forEach((item, index) => {
          item.key = index;
          projParam.key = index;
          item.i = (index % 10) + 1;
          item.tag_show = item.record_state == 1 ? "已推送" : "未推送";
        });
      }
      yield put({
        type: "save",
        payload: {
          dataSource: JSON.parse(JSON.stringify(data.DataRows)),
          projParam: JSON.parse(JSON.stringify(projParam)),
          rowCount: data.RowCount,
        },
      });
      yield put({
        type: "querydata",
      });
    },

    /**
     * 作者：张建鹏
     * 创建日期：2020-4-17
     * 功能：input赋值
     * @param value 选择的key
     * @param objParam 输入的对象参数
     */
    *setInputShow({ value, objParam }, { put, select }) {
      let { projParam } = yield select((state) => state.projChild);
      projParam[objParam] = value;
      yield put({
        type: "save",
        payload: {
          projParam: JSON.parse(JSON.stringify(projParam)),
        },
      });

    },

    /**
     * 作者：张建鹏
     * 创建日期：2020-4-17
     * 功能：设置select的值
     * @param value 选择的key
     * @param objParam 输入的对象参数
     */
    *setSelect({ value, objParam }, { put, select }) {
      let { projParam } = yield select((state) => state.projChild);
      //此处要做一个验证
      projParam[objParam] = value;
      yield put({
        type: "save",
        payload: {
          projParam: JSON.parse(JSON.stringify(projParam)),
        },
      });
    },

    /**
     * 作者：张建鹏
     * 创建日期：2020-4-17
     * 功能：按钮事件
     * @param objParam 输入的对象参数
     */
    *inquire({ typeItem }, { put, select }) {
      if (typeItem === "query") {
        yield put({
          type: "querydata",
        });
      } else if (typeItem === "clear") {
        yield put({
          type: "initQueryProjInfo",
        });
      }
    },

    /**
     * 作者：张建鹏
     * 创建日期：2020-4-17
     * 功能：重置
     */
    *initQueryProjInfo({}, { put }) {
      // let { projParam } = yield select((state) => state.projChild);
      let projParam = {
        proj_name: "",
        proj_code: "",
        mgr_name: "",
        record_state: ["未推送", "已推送"],
        tag_key: "",
      };
      yield put({
        type: "save",
        payload: {
          projParam: JSON.parse(JSON.stringify(projParam)),
        },
      });
      yield put({
        type: "querydata",
      });
    },

    /**
     * 作者：张建鹏
     * 创建日期：2020-4-17
     * 功能：查询数据
     * @param objParam 输入的对象参数
     */
    *querydata({}, { put, select, call }) {
      let { projParam } = yield select((state) => state.projChild);
      let postDate = {
        arg_staff_id: Cookie.get("userid"),
        arg_proj_name: projParam.proj_name,
        arg_proj_code: projParam.proj_code,
        arg_mgr_name: projParam.mgr_name,
        arg_mar_code: projParam.mar_code,
        record_state: projParam.tag_key,
      };
      let data = yield call(projServices.queryProjChild, postDate);
      if (data.RetCode == "1") {
        data.DataRows.forEach((item, index) => {
          item.key = index;
          item.i = (index % 10) + 1;
          item.tag_show = item.record_state == 1 ? "已推送" : "未推送";
        });
      }
      yield put({
        type: "save",
        payload: {
          dataSource: JSON.parse(JSON.stringify(data.DataRows)),
          projParam: JSON.parse(JSON.stringify(projParam)),
          rowCount: data.RowCount,
        },
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === "/projectApp/projRecord/projChild") {
          dispatch({ type: "inited", query });
        }
      });
    },
  },
};
