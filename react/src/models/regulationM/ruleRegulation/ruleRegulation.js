/**
 *  作者: 卢美娟
 *  创建日期: 2018-06-13
 *  邮箱：lumj14@chinaunicom.cn
 *  文件说明：规章制度上传数据处理层
 */
import {message} from 'antd'
import Cookie from 'js-cookie';
import * as usersService from '../../../services/regulationM/regulationM.js';
import exportExcel from '../../../routes/absence/ExcelExport';

export default {
  namespace: 'ruleRegulation',
  state: {
    isModalVisible:false,
    data:[],
    exportList:[]
  },

  reducers: {
    saveRegulation(state, { regulationList: DataRows,RowCount:RowCount }) {
      return { ...state, regulationList:DataRows,RowCount:RowCount};
    },

    saveCategoryType(state, { categoryTypeList: DataRows,RowCount, }) {
      return { ...state, categoryTypeList:DataRows,RowCount,};
    },
    saveRoleID(state, { roldID: roleidString,}) {
      return { ...state, roldID: roleidString,};
    },
    save(state, action) {
      return { ...state,
        ...action.payload
      };
    },
  },

  effects: {
    *regulationQuery({data}, { call, put }) {
      const {DataRows,RowCount,RetCode} = yield call(usersService.regulationQuery, {...data});
      console.log('DataRows',DataRows)
      if(RetCode == '1'){
        for(let i = 0; i < RowCount; i++){
          DataRows[i].key = i;
        }
        yield put({
          type: 'saveRegulation',
          regulationList: DataRows,
          RowCount:RowCount,
        });
        yield put({
          type: 'save',
          payload:{
            exportList: DataRows,
            exportCount:RowCount,
          }
          
        });
      }
    },

    *regulationDownload({arg_regulation_id}, { call, put }) {
      const {RetCode} = yield call(usersService.regulationDownload, {arg_regulation_id});
      if(RetCode == '1'){
        // message.success("增加了一次下载记录");
      }
    },

    *filedownload({data}, { call, put }) {
      const {RetCode} = yield call(usersService.filedownload, {...data});
      if(RetCode == '1'){
        // message.success("增加了一次下载记录");
      }
    },

    *filegetzippath({data}, { call, put }) {
      const {RetCode,filepath} = yield call(usersService.filegetzippath, {...data});
      if(RetCode == '1'){
        console.log(filepath);
        window.open(filepath)
      }
    },


    *regulationCategoryQuery({data}, { call, put }) {
      const {DataRows,RowCount,RetCode} = yield call(usersService.regulationCategoryAllQuery, {...data});
      if(RetCode == '1'){
        yield put({
          type: 'saveCategoryType',
          categoryTypeList: DataRows,
          RowCount,
        });
      }
    },

    *getRoleQuery({data2}, { call, put }) {
      const {DataRows,RowCount,RetCode} = yield call(usersService.getRoleQuery, {...data2});
      if(RetCode == '1'){
        var roleidString = '';
        for(let i = 0; i < RowCount; i++){
          roleidString += DataRows[i].role_id + ',';
        }
        yield put({
          type: 'saveRoleID',
          roldID: roleidString,
        });
      }
    },

    //点击导出
    * export({}, { put }){
        yield put({
          type:'save',
          payload:{
            isModalVisible:true
          }
        })
    },
    //点击取消
    * handleCancel({}, { put }){
      yield put({
        type:'save',
        payload:{
          isModalVisible:false
        }
      })
  },
  //点击确定
  * handleOk({}, { put,call,select }){
    const { exportList } = yield select (state =>state.ruleRegulation)
      yield put({
        type:'save',
        payload:{
          isModalVisible:false
        }
      })
      exportList.map(item=>{
          item.category1_name = item.category1_name?item.category1_name:''
          item.doc_num = item.doc_num?item.doc_num:''
          item.sys_name = item.sys_name?item.sys_name:''
          item.print_time = item.print_time?item.print_time:''
          item.is_secret = item.is_secret==='0'?'无':'普通商业秘密'
          item.is_enabled = item.is_enabled==='1'?'有效':'无效'
      })
    let condition = {};
    condition = {
      '制度类别': 'category1_name',
      '名称': 'title',
      '发文文号': 'doc_num',
      '体系': 'sys_name',
      '级别': 'level_name',
      '性质': 'kind_name',
      '密级': 'is_secret',
      '印发时间': 'print_time',
      '是否有效': 'is_enabled',
    };
    if (exportList.length > 0) {
      exportExcel(exportList, '规章制度详细信息', condition);
    } else {
      message.info("暂无数据，无法导出");
    }
  }
  },


    subscriptions: {
      setup({ dispatch, history }) {

        return history.listen(({ pathname, query }) => {
          if (pathname === '/adminApp/regulationM/ruleRegulation') {
            var data = {
              // arg_page_size:10,
              // arg_page_current:1,
            }
            dispatch({ type: 'regulationQuery',data });
            dispatch({type:'regulationCategoryQuery',data}) //查询规章制度类别
            var data2 = {
              argtenantid: '10010',
              arguserid: Cookie.get('staff_id'),
            }
            dispatch({type: 'getRoleQuery', data2})
          }
        });
      },
    },
};
