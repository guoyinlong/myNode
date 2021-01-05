/**
 * 作者：靳沛鑫
 * 创建日期：2019-6-19
 * 邮件：1677401802@qq.com
 * 文件说明：责任承诺书
 */
import { routerRedux } from 'dva/router';
import * as corePostResponsApplyService from "../../../../services/project/corePostResponsApplyService"
import Cookie from 'js-cookie';
import {message} from "antd";
export default {
    namespace: 'resPostsQuery',
    state: {
        yearList: [],           // 年份
        departmentList: [],     // 生产业务部门
        nameList: [],           // 核心岗位名称
        resPostsList:[],        // 责任承诺书信息列表
        params: {},
        corepositionIds: '',    // 提交数据

    },
    effects: {
      /**
       * 作者：靳沛鑫
       * 创建日期：2019-6-19
       * 邮件：1677401802@qq.com
       * 文件说明：岗位信息初始化
       */
      * init({},{ select, call, put }){
            const { params } = yield select(state => state.resPostsQuery);
            // 初始化数据
            const date = new Date();
            let year = date.getFullYear();
            //年份
            yield put({
              type: 'save',
              payload: {
                yearList: [
                  {year:year},
                  {year:year-1}
                ]
              }
            })
            params.departmentName=[]
            params.positionName=[]
            params.year=[]
        //初始化核心岗位
            yield put({
              type : 'save',
              payload:{
              nameList: [
                  {value:'项目经理'},
                  {value:'小组长'},
                  {value:'业务架构师'}
                ]
              }
            });
            //初始化状态
            yield put({
            type : 'save',
                payload:{
                    params: params,
                }
            });
            //生产业务部门
            yield put({
              type: 'getDepartmentList'
            })

            //初始化责任承诺书信息列表
            yield put({
              type: 'resPostsList'
            })
        },
      //生产业务部门
      * getDepartmentList({},{call, put, select}){
        let data= yield call(corePostResponsApplyService.getDepartmentList);
        if(data.RetCode=='1'){
          yield put({
            type:'save',
            payload:{
              departmentList:data.DataRows
            }
          })
        }
      },
      //责任承诺书信息
      * resPostsList({},{call, put, select}) {  //从接口取值
        const {params} = yield select(state => state.resPostsQuery);
        let data = yield call(corePostResponsApplyService.resCorePostsList, params);
        yield put({
          type : 'save',
          payload:{
            resPostsList: data.DataRows,
          }
        });
      },
      //保存选择信息（下拉选项）
      *saveSelectInfo({value, typeItem},{ call, put, select }){
        const {params, departmentList} = yield select(state => state.resPostsQuery);
        params[typeItem]= value
        if(typeItem=='departmentName') {
          departmentList.map((i) => {
            i.value == value ? params.departmentId = i.key : null
          })
          value==''? params.departmentId=[] : null
        }
        yield put({
          type : 'save',
          payload: {
            params : {...params}
          }
        })
        yield put({
          type: 'resPostsList'
        })
      },
      //上传文件后的信息提交
      * upDataResUrl({ id, name, url },{ call, put, select }){
        let postData = {id, name, url}
        let data=yield call(corePostResponsApplyService.postsResUpDataList, postData);
        if(data.RetCode=='1') {
          yield put({
            type: 'resPostsList'
          })
        }
      },
      //清空
      * resetCond({},{ call, put, select }){
        const { params } = yield select(state => state.resPostsQuery);
        params.departmentName = []
        params.positionName = []
        params.year = []
        params.departmentId=[]
        yield put({
          type : 'save',
          payload:{
            params: {...params},
          }
        });
        yield put({
          type: 'resPostsList'
        })
      },
      //提交
      * upDataResInfo({ record },{ call, put, select }){
          let postData={corepositionIds:record.id+''}
          let data=yield call(corePostResponsApplyService.upDataResInfo, postData);
          if(data.RetCode=='1') {
            message.success(`提交成功`);
            yield put({
              type: 'resPostsList'
            })
          }
        }
    },
    reducers: {
      save(state, action) {
        return {...state, ...action.payload};
      }
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/projectApp/corePost/responsApply') {
                    dispatch({
                        type: 'init',
                        query
                    });
                }
            });
        },
    },
};
