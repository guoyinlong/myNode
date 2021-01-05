/**
 * 作者：张枫
 * 创建日期：2019-09-06
 * 邮件：zhangf142@chinaunicom.cn
 * 文件说明：我的待办
 */
import * as Service from './../../../services/QRCode/officeResService.js';
import Cookie from 'js-cookie';

export default {
  namespace:'todoList',
  state:{
    todoList:[],//待办列表数据
    page:1,
    total:0,
    pageSize:10,
    role:"",//用户角色
  },
  reducers:{
    initData(state) {
      return{
        todoList:[],//待办列表数据
        page:1,
        total:0,
        pageSize:10,
        role:"",//用户角色
      }
    },
    save(state, action) {
      return {...state,...action.payload};
    },
  },
  effects:{
    /**
     * 作者：张枫
     * 创建日期：2019-09-06
     * 邮件：zhangf142@chinaunicom.cn
     */
      *init({}, {select,call,put}) {
      //let { page,pageSize } = yield select(state=>state.todoList)
      let postData = {
        //arg_current_page:page,
        //arg_page_size :pageSize,
      };
      let data = yield call (Service.queryAssetsToDoList,postData);
      if(data.RetCode === "1"){
        data.DataRows.map((item,index)=>
        {
          item.key = index;
         // item.apply_time = item.apply_time.slice(0,item.apply_time.indexOf("."))
        }
        )
        yield put({
          type : "save",
          payload :{
            todoList : data.DataRows,
            total:data.RowCount,
          }})
        }
      yield put({type:"queryRole"})
      },
    //查询用户角色
      *queryRole({},{call,put}){
        let data = yield call(Service.queryUserAssetsRole,"");
        if(data.RetCode === "1"){
          yield put({type:"save",payload:{role:data.RoleTypeId}})
        }
      },
      *changePage({data},{put}){
        yield put({
          type : "save",
          payload:{page:data,}
        })
        yield put({type:"init"})
      },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/adminApp/compRes/todoList') {
          dispatch({type:'init',query});
        }
      });
    },
  }
}
