/**
 * 作者：陈红华
 * 创建日期：2017-07-31
 * 邮箱：1045825949@qq.com
 * 文件说明：门户首页公告信息页面model（普通用户）
 */
import * as commonAppService from '../../../services/commonApp/commonAppService.js';
import {message} from 'antd';
import Cookie from 'js-cookie';
import { routerRedux } from 'dva/router';
import moment from 'moment';
export default {
  namespace : 'noticeMore',
  state : {
    noticeList:[],
    noticeFlag:true,
  },

  reducers : {
    noticeList(state,{DataRows,PageCount,RowCount}){
      return{
        ...state,
        noticeList:[...DataRows],
        noticeFlag:false,
        noticeMorePageCount:PageCount,
        RowCount
      };
    },

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
    },

    *noticeInfoQuery ({formData}, {call, put}) {
      var data= yield call(commonAppService.noticeInfoQuery,formData);
      if(!data.DataRows){
        data.DataRows=[];
      }
      const {DataRows,PageCount,RowCount} =data;
      yield put({
        type: 'noticeList',
        DataRows,
        PageCount,
        RowCount
      });
    },
    *readrecordInsert({formData}, {call, put}) {
      const {arg_notice_id,arg_userid,item}=formData
      const {RetCode}= yield call(commonAppService.readrecordInsert,{arg_notice_id,arg_userid});
      if(RetCode=='1'){
        yield put(routerRedux.push({
          pathname:'/noticeDetail',
          query:{id:item.ID,n_title:item.n_title}
        }));
      }
    },
},
  subscriptions : {

  },
}
