/**
 * 作者：陈红华
 * 创建日期：2017-07-31
 * 邮箱：1045825949@qq.com
 * 文件说明：门户首页培训资料页面model
 */
import * as commonAppService from '../../../services/commonApp/commonAppService.js';
import {message} from 'antd';
import Cookie from 'js-cookie';
import moment from 'moment';
export default {
  namespace : 'trainingMore',
  state : {
    fileList:[],
    userHasPermission:false,
    fileFlag:true,
    fileContent:[],
  },
  reducers : {
    myFile(state,{DataRows,RowCount}){
      for(var i=0;i<DataRows.length;i++){
        DataRows[i].file_upload_date=moment(DataRows[i].file_upload_date).format("YYYY-MM-DD");
      }
      return{
        ...state,
        fileList:[...DataRows],
        fileFlag:false,
        RowCount
      };
    },
    saveType(state, { docTypelist: DataRows}) {
      return { ...state, docTypelist:DataRows};
    },
    // 搜索按钮搜索资料名称
    searchFileFilter(state,{DataRows,RowCount,title}){
      var fileList=[];
      for(var i=0;i<DataRows.length;i++){
        DataRows[i].file_upload_date=moment(DataRows[i].file_upload_date).format("YYYY-MM-DD");
        if(DataRows[i].file_name.indexOf(title)!=-1){
          fileList.push(DataRows[i]);
        }
      }
      return{
        ...state,
        fileList:[...fileList],
        fileFlag:false,
        RowCount
      };
    },

    // 培训资料上传文件权限
    usersHasPermission(state,{isAdmin}){
      return{
        ...state,
        isAdmin:isAdmin,
      }
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
    },

    // 点击编辑，获取文件信息
    saveFileContent(state,{DataRows}){
      return{
        ...state,
        fileContent:[...DataRows]
      }
    },
  },

  effects : {
    *fileQuery({arg_ou_id=Cookie.get('OUID'),arg_file_name,arg_dept_id=Cookie.get('dept_id'),arg_staff_id=Cookie.get('staff_id'),flag,title}, {call, put}) {
      const {DataRows,RowCount} = yield call(commonAppService.fileQuery,{arg_ou_id,arg_file_name,arg_dept_id,arg_staff_id});
      yield put({
        type: 'myFile',
        DataRows,
        RowCount
      });
      // if(flag=='0'){//初始化查询
      //   yield put({
      //     type: 'myFile',
      //     DataRows,
      //     RowCount
      //   });
      // }else if(flag=='1'){//搜索按钮查询
      //   yield put({
      //     type: 'searchFileFilter',
      //     DataRows,
      //     RowCount,
      //     title
      //   });
      // }

    },
    *fileLoadNum({formData}, {call, put}) {
      const{file_upload_date,file_type_id,postData}=formData
      // const {DataRows} =
      yield call(commonAppService.fileLoadNum,postData);
      yield put({
        type: 'fileQuery',
        formData:{transjsonarray: JSON.stringify({
            "condition":{"file_type_id":file_type_id},
            "sequence":[{
              "file_upload_date":file_upload_date,
            }]
          })
        }
      });
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
    },

    // 培训资料上传文件
    *getUsersByRoleId({arg_staff_id}, {call, put}) {
      const {isAdmin,RetCode} = yield call(commonAppService.getUsersByRoleId,{arg_staff_id});
      if(RetCode=='1'){
        yield put({
          type: 'usersHasPermission',
          isAdmin
        });
      }else{
        message.error('获取文件上传权限失败！');
      }
    },
    *trainSrcAddFile({formData}, {call, put}) {
      const {RetCode} = yield call(commonAppService.trainSrcAddFile,formData);
      if(RetCode=='1'){
          message.success('文件上传成功！')
          yield put({
            type:'fileQuery',
            formData:{transjsonarray: JSON.stringify({
                "condition":{"file_type_id":'1'},
                "sequence":[{
                  "file_upload_date":'6',
                }]
              })
            }
          })
      }else{
        message.error('文件上传失败！');
      }
    },

    //根据文件名删除文件lumj
    *deleteByFIleId({arg_file_id}, {call, put}) {
      const {RetCode,RetVal} = yield call(commonAppService.deleteByFIleId, {arg_file_id});
      if(RetCode=='1'){
        message.success('删除文件成功！');
       //刷新
        var arg_ou_id = Cookie.get('OUID')
        const {DataRows,RowCount} = yield call(commonAppService.fileQuery,{arg_ou_id,arg_dept_id:Cookie.get('dept_id'),arg_staff_id:Cookie.get('staff_id')});
        yield put({
          type: 'myFile',
          DataRows,
          RowCount
        });
      }else{
        message.error('删除文件失败'+RetVal);
      }
    },
    //根据文件名查询文件lumj
    *searchByFIleId({arg_file_id}, {call, put}) {
      const {DataRows,RetCode,RetVal} = yield call(commonAppService.searchByFIleId, {arg_file_id});
      if(RetCode=='1'){
        yield put({
          type: 'saveFileContent',
          DataRows
        });
      }else{
        message.error('查询文件失败'+RetVal);
      }
    },

    *getdocType({arg_ou_id = Cookie.get('OUID')}, {call, put}) {
      const {RetCode,DataRows} = yield call(commonAppService.getdocType,{arg_ou_id});
      if(RetCode=='1'){
        yield put({
          type: 'saveType',
          docTypelist: DataRows,
        });
      }else{
        message.error('获取文档类型失败！');
      }
    },

    *filedownload({arg_file_id}, {call, put}) {
      const {RetCode} = yield call(commonAppService.filedownload,{arg_file_id});
      if(RetCode=='1'){
        // //刷新
        var arg_ou_id = Cookie.get('OUID')
        const {DataRows,RowCount} = yield call(commonAppService.fileQuery,{arg_ou_id,arg_dept_id:Cookie.get('dept_id'),arg_staff_id:Cookie.get('staff_id')});
        yield put({
          type: 'myFile',
          DataRows,
          RowCount
        });
      }else{
        message.error('获取文档类型失败！');
      }
    },

    *changeFileNameType({arg_file_id,arg_file_name,arg_type_id}, {call, put}) {
      const {RetCode} = yield call(commonAppService.changeFileNameType,{arg_file_id,arg_file_name,arg_type_id});
      if(RetCode=='1'){
        message.success("更改成功");
        // //刷新
        var arg_ou_id = Cookie.get('OUID')
        const {DataRows,RowCount} = yield call(commonAppService.fileQuery,{arg_ou_id,arg_dept_id:Cookie.get('dept_id'),arg_staff_id:Cookie.get('staff_id')});
        yield put({
          type: 'myFile',
          DataRows,
          RowCount
        });

      }else{
        message.error('更改文档失败！');
      }
    },
},
  subscriptions : {
    setup({ dispatch, history }) {

      return history.listen(({ pathname, query }) => {

        if (pathname === '/trainingMore') {
          dispatch({ type: 'getdocType',query });
        }
      });
    },
  },
}
