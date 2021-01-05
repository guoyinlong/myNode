/**
 * 作者：李杰双
 * 日期：2017/9/1
 * 邮件：282810545@qq.com
 * 文件说明：员工分配数据
 */
import * as usersService from '../../../services/employer/empservices';

import moment from 'moment'
import message from '../../../components/commonApp/message'
import Cookie from 'js-cookie';
import {EVAL_EMP_POST,EVAL_MGR_POST,EVAL_GROUP_LEADER_POST} from '../../../utils/config'

//const staff_id=Cookie.get('staff_id')
//const fullName=Cookie.get('username')

export default {
  namespace : 'empKind',
  state : {
    list: [],
    query: {},
    userState: 2,
    modalVisible:false,
    searchRoomRes:[],
    pageCondition:{}
  },

  reducers : {
    save(state, {list: DataRows}){

      //debugger
      return {
        ...state,
        list: DataRows,

      };
    },
    cBoxChange(state,{index:index}){

      let newList=[...state.list];
      newList[index].checked=!newList[index].checked

      return {
        ...state,
        list:newList
      }
    },
    checkedAll(state,{checked:checked}){
      let newList=state.list.map(i=>{
        i.checked=checked
        return i
      })
      return {
        ...state,
        list:newList
      }

    },
    changeType(state,{data:data}){
      let newList=[...state.list];
      for(let i =0;i<data.length;i++){
        for(let k=0;k<newList.length;k++){
          if(data[i].condition.uuid===newList[k].uuid){
            newList[k].emp_type=data[i].update.emptype
            newList[k].checked=false;
            continue
          }
        }
      }

      return {
        ...state,
        list:newList
      }
    }
  },

  effects : {
    *fetch({pageCondition}, {call, put}) {
      //debugger
      const {DataRows} = yield call(usersService.ouFetch,
        {
          arg_tenantid:Cookie.get('tenantid'),
          arg_user_id:Cookie.get('userid')
        });
      if(DataRows.length){
        const {tenantid}=Cookie.get();
        let arg_dept_id='(';
        DataRows.forEach((i,index)=>{

          if(index===DataRows.length-1){
            arg_dept_id+=`"${i.dept_id}")`
          }else{
            arg_dept_id+=`"${i.dept_id}",`
          }
        })
        const resList=yield call(usersService.empclassquery,{
          arg_post_name:`("${EVAL_EMP_POST}","${EVAL_MGR_POST}","${EVAL_GROUP_LEADER_POST}")`,
         // arg_dept_id:`("${dept_id}")`,
          arg_dept_id,
          arg_ou_id:DataRows[0].ou_id,
          arg_tenant_id:tenantid,
          ...pageCondition

        })
        if(resList.DataRows.length){
          resList.DataRows.map((i,index)=>{
            i.key=index;
            i.checked=false
          })
          yield put({
              type: 'save',
              list: resList.DataRows,
              pageCondition
            });
        }
      }

    },
    *update_persion_type({emptype,uuid},{call,put}){

      let postData=[{"update":{emptype},"condition":{uuid}}]
      const {RetCode}=yield call(usersService.update_persion_type,{
        transjsonarray:JSON.stringify(postData)
      })
      if(RetCode==='1'){
        message.success('修改成功')
        yield put({
          type:'changeType',
          data:postData
        })
      }else{
        message.error('修改失败')
      }
    },
    *update_persion_type_all({emptype,checkedArr},{call,put,select}){

      var list=yield select(state => state.empKind.list);
      let postData=[];
      //旧批量修改
      checkedArr.map(i=>{
        if(i){
          postData.push({
            condition:{uuid:list[i].uuid},
            update:{emptype}
          })
        }
      })
      //debugger

      //新批量修改
      // checkedArr.map(()=>{
      //   if(i){
      //     postData.push({
      //       condition:{uuid:list[i].uuid},
      //       update:{emptype}
      //     })
      //   }
      // })
      if(!postData.length){
        return
      }
      const {RetCode}=yield call(usersService.update_persion_type,{
        transjsonarray:JSON.stringify(postData)
      })
      if(RetCode==='1'){
        message.success('修改成功')
        yield put({
          type:'changeType',
          data:postData
        })
      }else{
        message.error('修改失败')
      }
    },
    *update_persion_type_all_new({emptype,list,checked},{call,put}){

      let postData=[];

      checked.map((i,index)=>{

        if(i){
          postData.push({
            condition:{uuid:list[index].uuid},
            update:{emptype}
          })
        }
      })

      if(!postData.length){
        return
      }
      const {RetCode}=yield call(usersService.update_persion_type,{
        transjsonarray:JSON.stringify(postData)
      })
      if(RetCode==='1'){
        message.success('修改成功')
        yield put({
          type:'changeType',
          data:postData
        })
      }else{
        message.error('修改失败')
      }
    }

  },
  subscriptions : {
    setup({dispatch, history}) {

      return history.listen(({pathname}) => {

        if (pathname === '/humanApp/employer/kindDist') {

          dispatch({type: 'fetch',
            pageCondition:{
            arg_page_num:10, arg_start:1}});
        }
      });

    },
  },
};
