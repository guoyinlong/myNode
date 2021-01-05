/**
 * 作者:陈莲
 * 日期：2018-12-26
 * 邮箱：chenl192@chinaunicom.cn
 * 文件说明：实现个人考核部门项目余数信息逻辑功能
 */
import * as service from '../../../services/employer/empservices'
import message from '../../../components/commonApp/message'
import Cookie from 'js-cookie';
let year = new Date().getFullYear().toString();
let season = Math.floor((new Date().getMonth() + 2) / 3).toString();
if(season === '0'){
  season = '4';
  year = (new Date().getFullYear() - 1).toString()
}
export default {
  namespace: 'projremain',
  state: {
    list:[]
  },

  reducers: {
    /**
     * 作者：张楠华
     * 创建日期：2017-08-21
     * 功能：返回查询结果到routes层
     */
    save(state, { list: ratios,year,season}) {
      return { ...state, list:ratios,year,season};
    },
  },

  effects: {
    /**
     * 作者：张楠华
     * 创建日期：2017-08-21
     * 功能：初始化查询展示部门余数
     */
    *initRemain({}, { call, put }) {
      let postData={
        arg_year:year,
        arg_season:season,
        arg_dept_name:Cookie.get('deptname')
      };
      const data= yield call(service.deptStaffProjSearch, postData);
      let ratios;
      if(data == null){
        message.info("没有数据！");
      }else{
        if(data.RetCode == "1") {
          ratios = data.DataRows;
        }else{
          message.error("查询失败！");
        }
      }
      yield put({
        type: 'save',
        list:ratios,
        year,
        season
      });
    },
  },
  /**
   * 作者：张楠华
   * 创建日期：2017-08-21
   * 功能：监听路径
   */
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/employer/deptprojrank') {
          dispatch({ type: 'initRemain',query });
        }
      });
    },
  },
};
