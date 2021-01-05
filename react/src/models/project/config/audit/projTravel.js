/**
 * 作者：金冠超
 * 创建日期：2019-07-18
 * 邮件：jingc@itnova.com.cn
 * 文件说明：项目配置-审核设置 所有model数据
 */
import * as projServices from '../../../../services/project/config/projTravel';
import Cookie from 'js-cookie';

export default {
    namespace:'projTravel',
    state:{
        itemList:[],//表格主体数据
        deptList:[],//部门名称下拉列表
        detailsList:[],//详情数据
        arg_deptname:"",//查询部门的数据
        arg_year:"" //筛选年份
    },
    reducers:{
            save(state, action) {
            return {
                ...state,
                ...action.payload,
            };
            }
        },
    effects:{
      /**
     * 作者：金冠超
     * 修改日期：2019/8/27
     * 功能：基础表格基础数据
     */
        *getItemMessage({},{ put , call }){
            let postData = {
            arg_req_userid: Cookie.get('userid'),
            arg_req_moduleurl:window.location.hash.replace('#/', '').split('?')[0].split('/')[1],
            arg_req_tenantid:"10010"
          }
          const data = yield call(projServices.getItemList,postData);
          if(data.RetCode === '1'){
            yield put({
              type:'save',
              payload:{
                itemList:data.DataRows
              }
            })
          }

        },
      /**
     * 作者：金冠超
     * 修改日期：2019/8/27
     * 功能：获取部门名称下拉列表
     */
      *getDeptList({},{ put , call }){
        const data=yield call(projServices.getDeptList)
        if(data.RetCode === '1'){
          yield put({
            type:'save',
            payload:{
              deptList:data.DataRows
            }
          })
        }
      },
      // /**
      //  * 作者：彭东洋
      //  * 修改日期：2019/8/27
      //  * 功能：查询时更新表格数据
      //  */
      * searchDtat({},{put,call,select}){
        const projTravel = yield select (state => state.projTravel)
        let postYear = !projTravel.arg_year ? null : projTravel.arg_year
        let postData = {
          arg_req_userid: Cookie.get('userid'),
          arg_req_moduleurl:window.location.hash.replace('#/', '').split('?')[0].split('/')[1],
          arg_req_tenantid:"10010",
          arg_deptname: projTravel.arg_deptname,
          arg_year: postYear
        }
        const data = yield call(projServices.getItemList,postData);
          if(data.RetCode === '1'){
            yield put({
              type:'save',
              payload:{
                itemList:data.DataRows
              }
            })
          }
      },
      //保存筛选输入的年份
      * saveYears({postData},{put}) {
        yield put({
          type:"save",
          payload:{
            arg_year:postData.arg_year
          }
        })
      },
      //清空查询的数据
      * clearDtat({},{put}) {
        yield put({
          type:"save",
          payload:{
            arg_year:"",
            arg_deptname: ""
          }
        })
        yield put({
          type:"getItemMessage"
        })
      },
      /**
     * 作者：金冠超
     * 修改日期：2019/8/27
     * 功能：添加新信息
     */
      *addNewMessage({callback,value},{put,call}){
        let postData={
          arg_req_userid: Cookie.get('userid'),
          arg_req_moduleurl:window.location.hash.replace('#/', '').split('?')[0].split('/')[1],
          arg_req_tenantid:"10010",
          arg_dept_id: value.dept_id,
          arg_dept_name:value.dept_name,
          arg_budget_fee:value.arg_budget_fee,
          arg_year:value.year
        }
        const data = yield call(projServices.addNewMessage,postData)
        callback(data.RetCode)
        yield put({
          type:'getItemMessage'
        })
      },
      /**
     * 作者：金冠超
     * 修改日期：2019/8/27
     * 功能：删除信息
     */
      *delMessage({callback,value},{put,call}){
        let postData={
          arg_req_userid: Cookie.get('userid'),
          arg_req_moduleurl:window.location.hash.replace('#/', '').split('?')[0].split('/')[1],
          arg_req_tenantid:"10010",
          arg_id: value.id
        }
        const data = yield call(projServices.delMessage,postData)
        callback(data.RetCode)
        yield put({
          type:'getItemMessage'
        })
      },
      /**
     * 作者：金冠超
     * 修改日期：2019/8/27
     * 功能：修改信息
     */
    *updateMessage({callback,value},{put,call}){
      let postData={
        arg_req_userid: Cookie.get('userid'),
        arg_req_moduleurl:window.location.hash.replace('#/', '').split('?')[0].split('/')[1],
        arg_req_tenantid:"10010",
        arg_id:value.arg_id,
        arg_budget_fee:value.arg_budget_fee,
        arg_remark:value.arg_remark
      }
      const data = yield call(projServices.updateMessage,postData)
      callback(data.RetCode)
      yield put({
        type:'getItemMessage'
      })
    },
      /**
     * 作者：金冠超
     * 修改日期：2019/8/27
     * 功能：详情信息
     */
    *detailsMessage({callback,value},{put,call}){
      let postData={
        arg_req_userid: Cookie.get('userid'),
        arg_req_moduleurl:window.location.hash.replace('#/', '').split('?')[0].split('/')[1],
        arg_req_tenantid:"10010",
        arg_req_deptname:value.deptname,
        arg_req_year:value.year
      }
      const data = yield call(projServices.detailsMessage,postData)
      callback(data.RetCode)
      yield put({
        type:'save',
        payload:{
          detailsList:data.DataRows
        }
      })
    },
    /**
     * 作者：彭东洋
     * 修改日期：2020/03/03
     * 功能：保存部门筛选的数据
     */
    * saveDept({postData},{put,call}){
        yield put ({
          type:"save",
          payload: {
            arg_deptname: postData.arg_deptname
          }
        })
      }
    },


    subscriptions:{
        setup({ dispatch, history }) {
          return history.listen(({ pathname, query}) => {
            if (pathname === '/projectApp/projConfig/projTravel') {
              dispatch({type:'getItemMessage',query})
              dispatch({type:'getDeptList',query})
            }
          });
    
        }
      }
    }