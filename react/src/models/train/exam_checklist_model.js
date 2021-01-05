/**
 * 文件说明：培训管理-创建培训计划model
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-07-09
 **/
import Cookie from "js-cookie";
import * as trainService from "../../services/train/trainService";
import { message } from "antd";
import * as overtimeService from "../../services/overtime/overtimeService";

//导入文件数据整理
function dataFrontDataExam(data) {
  let frontDataList = [];
  var number = '0';
  for (let item in data) {
      number++;
      let newData = {
        //序号
        indexID: data[item].序号,
        //年份
        exam_year: data[item].年份,
        //认证名称
        exam_name:data[item].认证名称,
        //认证单位
        exam_unit:data[item].认证单位,
      };
      frontDataList.push(newData);
  }
  return frontDataList;
}

export default {
  namespace: 'exam_checklist_model', 
  state: {
    user_id: '',
    nextPostName: '',
    nextDataList: [],
    //培训课程信息（总院必修）
    importaExamDataList: [],
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

  effects: {
    *initTrain({ param }, { put, call }) {
      yield put({
        type: 'save',
        payload: {
            importaExamDataList: [],
        }
      });
    },
    *centerExamImport({ param }, { put }) {
      console.log('//////////');
      console.log(param);
      console.log('//////////');
      yield put({
        type: 'save',
        payload: {
            importaExamDataList: [],
        }
      });
      yield put({
        type: 'save',
        payload: {
          importaExamDataList: dataFrontDataExam(param),
          haveData: true
        }
      });
    },
    //保存全院级必修课程信息
    * examChecklistSubmit({ certificationList, resolve }, { call }) {
      //回滚参数
      let postData = {};
      try {
        //回滚标志
        let rollbackFlag = 0;
        /* 保存培训计划train_class_center表 Begin */
        for (let i = 0; i < certificationList.length; i++) {
          const saveClassInfo = yield call(trainService.certificationListSave, certificationList[i]);
          if (saveClassInfo.RetCode !== '1') {
            /* 回滚功能 */
            message.error('保存失败');
            rollbackFlag = 1;
            break;
          }
        }
        if (rollbackFlag === 1) {
          /* 回滚功能:数据库 */
          message.error('提交失败');
          resolve("false");
        } else {
          message.success('提交成功');
          resolve("success");
        }
        /* 保存培训计划train_class_center表 End */
      } catch (error) {
        /* 回滚功能:数据库 */
        try {
        } catch (e1) {
          message.error('回滚失败');
          resolve("false");
        }
      } 
    },
   
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, param, query }) => {
        if (pathname === '/humanApp/train/trainPlanAndImport/exam_checklist') {
          dispatch({ type: 'initTrain', param });
        }
      });
    }
  },
};
