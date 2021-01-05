import * as  CMDBService from "../../../services/project/CMDBService"
export default{
    namespace:"cmdbChild",

    state:{
        projectData: [],
        queryData: null
    },

    reducers:{
        save(state, action){
            return {
                ...state,
                ...action.payload,
            }
        },
    },

    effects: {
        // 进入页面时的初始化方法
        *inited(parm, { put ,select, call}) {
          let responseData = yield call(CMDBService.initedCMDBData);
          responseData.dataRows
          yield put({
              type: "save",
              payload: {
                  projectData:responseData.dataRows,
          }
        })
    },
        // 查询方法
    *queryData(param, { put, select, call }) {
        let { queryData } = yield select((state) => state.cmdbChild);
        // 传递查询参数到service，访问查询接口获取数据
        let projectData = yield call(CMDBService.queryCMDBData, queryData);
        // 此处使用模拟数据
        // 得到接口返回的list数据，通过save方法存储到state
        yield put({
            type: "save",
            payload: {
                projectData:projectData.dataRows,
        }
    });
    },
        // 更新查询参数方法，当router页面上的数据框值发生变化时，将查询数据存储到state
    *updateProjectID(param, { put }) {
        yield put({
        type: "save",
        payload: {
            queryData: {
                projectID: param.projectID
            }
        }
    })
    }
},

    subscriptions: {
        setup({ dispatch, history }) {
        return history.listen(({ pathname, query }) => {
            if (pathname === "/projectApp/cmdb/cmdbChild") {
                dispatch({ type: "inited", onload });
                }
            });
        },
    },
};
