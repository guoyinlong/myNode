/**
 * 作者：罗玉棋
 * 日期：2019-11-18
 * 邮箱：809590923@qq.com
 * 文件说明：中层互评-三度年度个人考核
 */
import * as usersService1 from '../../../services/employer/module.js'
import Cookie from 'js-cookie';
import message from '../../../components/commonApp/message'
const user_id = Cookie.get('userid');
//let defaultYear=new Date().getFullYear()

export default {
  namespace: 'performance',
  state: {
    data:[]
  },

  reducers: {
 
    save(state, {payload}) {
      return { ...state, 
               ...payload
              };
    },
  },

  effects: { 

    *personInfo({postData},{call,put}){
      let {RetCode,RetVal,DataRows}=yield call(usersService1.leaderInfo,postData)
      //let RetCode="1",RetVal="1",DataRows;
        if(RetCode==="1"){
          if(DataRows&&DataRows.length>0){
            yield put({
              type:"save",
              payload:{
                data:DataRows[0]
              }
              })
              message.success("查询成功！",2," ")
          }else{

            yield put({
              type:"save",
              payload:{
                data:{}
              }
              })
           message.warning("暂无数据",2," ")
          }
        } else{
          yield put({
            type:"save",
            payload:{
              data:{}
            }
            })
          message.warning(RetVal,2," ")
        }
      },
  },
  subscriptions: {
    // setup({ dispatch, history }) {
    //   return history.listen(({ pathname, query }) => {
    //     if (pathname === '/humanApp/leader/performance') {
    //       dispatch({type:"personInfo"}) 
    //     }
    //   });
    // },
  },
};
