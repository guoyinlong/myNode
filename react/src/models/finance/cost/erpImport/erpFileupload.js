/**
 * 作者：陈红华
 * 创建日期：2017-09-13
 * 邮箱：1045825949@qq.com
 * 文件说明：财务全成本erp成本导入
 */
import {message} from 'antd';
import { routerRedux } from 'dva/router';
import * as costService from '../../../../services/finance/costService';
export default {
  namespace : 'erpFileupload',
  state : {

  },
  reducers : {

  },
  effects : {
    // 直接成本阅览
    *straightPreview({formData,previewData}, {call, put}) {
      const {DataRows,RetCode}=yield call(costService.straightPreview, formData);
      if(RetCode=='1'){
        for(var i=0;i<DataRows.length;i++){
          DataRows[i].key='a'+i;
        }
       previewData(DataRows);
      }

    },
    // 间接成本预览
    *IndirectPreview({formData,previewData}, {call, put}) {
      const {DataRows,RetCode}=yield call(costService.IndirectPreview, formData);
      if(RetCode=='1'){
        for(var i=0;i<DataRows[0].length;i++){
          DataRows[0][i].key='b'+i;
        }
        previewData(DataRows[0]);
      }
    },
    // 直接成本数据生成
    *straightpersistence({formData}, {call, put}) {
      const {RetCode}=yield call(costService.straightpersistence, formData);
      if(RetCode=='1'){
        message.success('直接成本数据生成成功！');
      }
      // yield put({
      //   type: 'myMessage',
      //   DataRows
      // });
    },
    // 间接成本数据生成
    *addindirect({formData}, {call, put}) {
      const {RetCode}=yield call(costService.addindirect, formData);
      if(RetCode=='1'){
        message.success('间接成本数据生成成功！');
      }
      // yield put({
      //   type: 'myMessage',
      //   DataRows
      // });
    },
},
  subscriptions : {

  },
}
