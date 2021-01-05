/**
 * 作者：金冠超
 * 创建日期：2019-07-18
 * 邮件：jingc@itnova.com.cn
 * 文件说明：项目配置-审核设置 所有model数据
 */
import * as projServices from '../../../../services/project/config/projCheck';
import Cookie from 'js-cookie';

export default {
    namespace:'projCheck',
    state:{

      ldentityList:[],//业务标识列表内容
      tacheList:[],//审核环节列表内容
      roleList:[],//审核角色列表内容
      assignUserList:[],//关联表内容
      RoleId:"",//暂存role_id
      messageList:[],
      tacheInfo:"",//审核环节提示信息
      ldentityInfo:"",//业务标识提示信息
      roleInfo: ""//审核角色提示信息
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
     * 功能：获取表格数据
     */
      *getMassageOfTab({},{ put , call }){
        let postData = {
          arg_req_userid: Cookie.get('userid'),
          arg_req_moduleurl:window.location.hash.replace('#/', '').split('?')[0].split('/')[1],
          arg_req_tenantid:"10010"
        }
        //获取业务标识内容
        const dataLdentity = yield call(projServices.ldentityList,postData);
        if(dataLdentity.RetCode === '1'){
          yield put({
            type:'save',
            payload:{
              ldentityList:dataLdentity.DataRows,
              ldentityInfo:dataLdentity.CommentInfo
            }
          })
        }
        //获取审核环节内容
        const dataTache = yield call(projServices.tacheList,postData);
        if(dataTache.RetCode === '1'){
          yield put({
            type:'save',
            payload:{
              tacheList:dataTache.DataRows,
              tacheInfo:dataTache.CommentInfo
            }
          })
        }
        //获取角色列表内容
        const dataRole = yield call(projServices.roleList,postData);
        if(dataRole.RetCode === '1'){
          yield put({
            type:'save',
            payload:{
              roleList:dataRole.DataRows,
              roleInfo:dataRole.CommentInfo
            }
          })
        }
      },

    /**
     * 作者：金冠超
     * 修改日期：2019/8/27
     * 功能：获取关联表格数据
     */
    *getIconMassage({value},{ put , call }){
      let postData = {
        arg_req_userid: Cookie.get('userid'),
        arg_req_moduleurl:window.location.hash.replace('#/', '').split('?')[0].split('/')[1],
        arg_req_tenantid:"10010",
        role_id:value
      }
          //获取关联表内容
          const dataRelation = yield call(projServices.assignUserList,postData);
          if(dataRelation.RetCode === '1'){
            yield put({
              type:'save',
              payload:{
                assignUserList:dataRelation.DataRows
              }
            })
          }
        },
    /**
     * 作者：金冠超
     * 修改日期：2019/8/27
     * 功能：新增一条业务标识列表内容
     */
    *addLdentity({value,callback},{put,call}){
      let postData={
        arg_req_userid: Cookie.get('userid'),
        arg_req_moduleurl:window.location.hash.replace('#/', '').split('?')[0].split('/')[1],
        arg_req_tenantid:"10010",
        ldentity_id:value.ldentity_id,
        ldentity_name:value.ldentity_name,
        ldentity_state:value.ldentity_state,
        ldentity_note:value.ldentity_note ? value.ldentity_note : ""
      }
       const data = yield call(projServices.addLdentity,postData)
       callback(data.RetCode)
       yield put ({
        type:'getMassageOfTab'
      })
    },
    /**
     * 作者：金冠超
     * 修改日期：2019/9/3
     * 功能：修改一条业务标识列表内容
     */
    *updateLdentity({value,callback},{put,call}){
      let postData={
        arg_req_userid: Cookie.get('userid'),
        arg_req_moduleurl:window.location.hash.replace('#/', '').split('?')[0].split('/')[1],
        arg_req_tenantid:"10010",
        ldentity_id:value.ldentity_id,
        ldentity_name:value.ldentity_name,
        ldentity_state:value.ldentity_state,
        ldentity_note:value.ldentity_note ? value.ldentity_note : ""
      }
       const data = yield call(projServices.updateLdentity,postData)
       callback(data.RetCode)
       yield put ({
        type:'getMassageOfTab'
      })
    },
    /**
     * 作者：金冠超
     * 修改日期：2019/8/27
     * 功能：删除一条业务标识列表内容
     */
    *delLdentity({value,callback},{put,call}){
      let postData={
        arg_req_userid: Cookie.get('userid'),
        arg_req_moduleurl:window.location.hash.replace('#/', '').split('?')[0].split('/')[1],
        arg_req_tenantid:"10010",
        ldentity_id:value.ldentity_id
      }
      const data = yield call(projServices.delLdentity,postData)
      callback(data.RetCode)
      yield put ({
        type:'getMassageOfTab'
      })
    },
    /**
     * 作者：金冠超
     * 修改日期：2019/8/27
     * 功能：新增一条审核环节列表内容
     */
    *addTache({value,callback},{put,call}){
      let postData={
        arg_req_userid: Cookie.get('userid'),
        arg_req_moduleurl:window.location.hash.replace('#/', '').split('?')[0].split('/')[1],
        arg_req_tenantid:"10010",
        tache_id:value.tache_id,
        tache_name:value.tache_name
      }
       const data = yield call(projServices.addTache,postData)
       callback(data.RetCode)
       yield put ({
        type:'getMassageOfTab'
      })
    },
     /**
     * 作者：金冠超
     * 修改日期：2019/8/27
     * 功能：修改一条审核环节列表内容
     */
    *updateTache({value,callback},{put,call}){
      let postData={
        arg_req_userid: Cookie.get('userid'),
        arg_req_moduleurl:window.location.hash.replace('#/', '').split('?')[0].split('/')[1],
        arg_req_tenantid:"10010",
        tache_id:value.tache_id,
        tache_name:value.tache_name
      }
       const data = yield call(projServices.updateTache,postData)
       callback(data.RetCode)
       yield put ({
        type:'getMassageOfTab'
      })
    },
      /**
     * 作者：金冠超
     * 修改日期：2019/8/27
     * 功能：删除一条审核环节列表内容
     */
    *delTache({value,callback},{put,call}){
      let postData={
        arg_req_userid: Cookie.get('userid'),
        arg_req_moduleurl:window.location.hash.replace('#/', '').split('?')[0].split('/')[1],
        arg_req_tenantid:"10010",
        tache_id:value.tache_id
      }
      const data = yield call(projServices.delTache,postData)
      callback(data.RetCode)
      yield put ({
        type:'getMassageOfTab'
      })
    },
    /**
     * 作者：金冠超
     * 修改日期：2019/8/27
     * 功能：新增一条审核角色列表内容
     */
    *addRole({value,callback},{put,call}){
      let postData={
        arg_req_userid: Cookie.get('userid'),
        arg_req_moduleurl:window.location.hash.replace('#/', '').split('?')[0].split('/')[1],
        arg_req_tenantid:"10010",
        role_name:value.role_name,
        role_flag:value.role_flag,
        role_abbreviation:value.role_abbreviation,
        role_type:value.role_type
      }
       const data = yield call(projServices.addRole,postData)
       callback(data.RetCode)
       yield put ({
         type:'getMassageOfTab'
       })
    },
    /**
     * 作者：金冠超
     * 修改日期：2019/8/27
     * 功能：修改一条审核角色列表内容
     */
    *updateRole({value,callback},{select,put,call}){
      const {RoleId} = yield select(state => state.projCheck)
      let postData={
        arg_req_userid: Cookie.get('userid'),
        arg_req_moduleurl:window.location.hash.replace('#/', '').split('?')[0].split('/')[1],
        arg_req_tenantid:"10010",
        role_name:value.role_name,
        role_flag:value.role_flag,
        role_abbreviation:value.role_abbreviation,
        role_type:value.role_type,
        role_id:RoleId
      }
       const data = yield call(projServices.updateRole,postData)
       callback(data.RetCode)
       yield put ({
         type:'getMassageOfTab'
       })
    },
    /**
     * 作者：金冠超
     * 修改日期：2019/8/27
     * 功能：删除一条审核角色内容
     */
    *delRole({value,callback},{put,call}){
      let postData={
        arg_req_userid: Cookie.get('userid'),
        arg_req_moduleurl:window.location.hash.replace('#/', '').split('?')[0].split('/')[1],
        arg_req_tenantid:"10010",
        role_id:value.role_id
      }
      const data = yield call(projServices.delRole,postData)
      callback(data.RetCode)
      yield put ({
        type:'getMassageOfTab'
      })
    },
    /**
     * 作者：金冠超
     * 修改日期：2019/8/27
     * 功能：暂存被点击“分配用户”按钮的role_id数据
     */
    *addRoleId({value},{put}){
      yield put({
        type:'save',
        payload:{
          RoleId:value
        }
      })
      yield put({
        type:'getIconMassage',
        value:value
      })
    },
   /**
     * 作者：金冠超
     * 修改日期：2019/8/27
     * 功能：基础查询数组
     */
    *getMessageList({},{call,put}){

      const data = yield call(projServices.getMessageList,{arg_null:null})
      yield put({
        type:'save',
        payload:{
          messageList:data.DataRows
        }
        
      })
    },
   /**
     * 作者：金冠超
     * 修改日期：2019/8/29
     * 功能：返回对应查询值
     */
    *inquireMessage({value,callback},{call}){
      const data = yield call(projServices.getMessageList,{arg_null:null})
      let list
      data.DataRows.map(
        (item) => {
           if(item.userid == value){ list = item}
          })
      callback(list)
    },
   /**
     * 作者：金冠超
     * 修改日期：2019/8/29
     * 功能：添加分配用户数据
     */
    *increaseUser({callback,value},{select,call,put}){
      const {RoleId} = yield select(state => state.projCheck)
      const postData = {
        arg_req_userid: Cookie.get('userid'),
        arg_req_moduleurl:window.location.hash.replace('#/', '').split('?')[0].split('/')[1],
        arg_req_tenantid:"10010",
        role_id:RoleId,
        role_user_id:value.userId,
        user_dept_id:value.deptId,
        is_work:"1"
      }
      const data = yield call(projServices.increaseUser,postData)
      callback(data.RetCode)
      yield put ({
        type:'getIconMassage',
        value:RoleId
      })
    },
       /**
     * 作者：金冠超
     * 修改日期：2019/9/2
     * 功能：移除分配用户数据
     */
    *delUser({callback,value},{select,call,put}){
      const {RoleId} = yield select(state => state.projCheck)
      const postData = {
        arg_req_userid: Cookie.get('userid'),
        arg_req_moduleurl:window.location.hash.replace('#/', '').split('?')[0].split('/')[1],
        arg_req_tenantid:"10010",
        role_id:RoleId,
        relation_id:value
      }
      const data = yield call(projServices.delUser,postData)
      callback(data.RetCode)
      yield put({
        type:'getIconMassage',
        value:RoleId
      })
    }

    },
    subscriptions:{
        setup({ dispatch, history }) {
          return history.listen(({ pathname, query}) => {
            if (pathname === '/projectApp/projConfig/projCheck') {
              dispatch({type:'getMassageOfTab',query})
            }
          });
    
        }
      }
    }