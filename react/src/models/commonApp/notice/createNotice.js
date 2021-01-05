/**
 * 作者：陈红华
 * 创建日期：2017-07-31 
 * 邮箱：1045825949@qq.com
 * 文件说明：门户首页创建公告页面model
 */
import * as commonAppService from '../../../services/commonApp/commonAppService.js';
import { routerRedux } from 'dva/router';
import {message} from 'antd'
export default {
  namespace : 'createNotice',
  state : {
    ouDeptListData:[]
  },

  reducers : {
    oudeptList(state,{DataRows}){
      var ouDeptList={};
      var ouArr=[];
     //  获取全部
      for(var i =0;i<DataRows.length;i++){
        DataRows[i].label=DataRows[i].dept_name;
        DataRows[i].value=DataRows[i].dept_id;
        DataRows[i].key=DataRows[i].dept_id;
        if(DataRows[i].dept_name=='联通软件研究院'){
          ouDeptList['all']=DataRows[i]
          ouDeptList['all'].children=[];
        }
      }
     //  获取OU
      for(var r=0;r<DataRows.length;r++){
         if(DataRows[r].deptname_p==ouDeptList['all'].dept_name){
           DataRows[r].children=[];
           ouDeptList['all'].children.push(DataRows[r]);
         }
      }
     //  获取三级部门
      for(var s=0;s<ouDeptList['all'].children.length;s++){
         for(var t=0;t<DataRows.length;t++){
           if(DataRows[t].deptname_p){
             var p_dept=(DataRows[t].deptname_p).split('-')[1];
             if(p_dept==ouDeptList['all'].children[s].dept_name){
               ouDeptList['all'].children[s].children.push(DataRows[t]);
             }
           }
         }
      };
      ouArr.push(ouDeptList.all);
      return{
        ...state,
        ouDeptListData:ouArr
      };
    }
  },


  effects : {
    *noticeAdd({formData}, {call, put}) {
      const{transjsonarray}=formData;
      const {RetCode,RetVal} = yield call(commonAppService.noticeAdd, {transjsonarray});
      if(RetCode=='1'){
        message.success('公告发布成功！');
        yield put(routerRedux.push('/noticeMoreManager'));
      }else{
        message.error('公告发布失败'+RetVal);
      }
    },
    *ouDeptQuery({formData}, {call, put}) {
      const {DataRows,RetCode,RetVal} = yield call(commonAppService.ouDeptQuery, formData);
      if(RetCode=='1'){
        yield put({
          type: 'oudeptList',
          DataRows
        });
        // message.success('公告发布成功！');
      }else{
        message.error('部门信息查询失败'+RetVal);
      }
    }
  },
  subscriptions : {
    setup({dispatch, history}) {

      // return history.listen(({pathname, query}) => {
      //
      //   if (pathname === '/commonApp') {
      //
      //     dispatch({type: 'backlogQuery', query});
      //   }
      // });

          },
        },
      };
