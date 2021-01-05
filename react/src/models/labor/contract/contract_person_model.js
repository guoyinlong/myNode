/**
 *  作者: 王福江
 *  创建日期: 2019-09-03
 *  邮箱：wangfj80@chinaunicom.cn
 *  文件说明：实现劳动合同查询功能
 */
import Cookie from 'js-cookie';
import { message } from 'antd';
import {OU_NAME_CN,OU_HQ_NAME_CN} from '../../../utils/config';
import * as hrService from "../../../services/hr/hrService";
import * as contractService from "../../../services/labor/contract/contractService";
import * as staffLeaveService from "../../../services/labor/staffLeave/staffLeaveService";
const auth_tenantid = Cookie.get('tenantid');
const auth_ou = Cookie.get('OU');
const auth_ou_id = Cookie.get('OUID');
let auth_ou_flag = auth_ou;
if(auth_ou_flag === OU_HQ_NAME_CN){ //截取部门用：如果所属OU是联通软件研究院本部，则auth_ou_flag = 联通软件研究院
  auth_ou_flag = OU_NAME_CN;
}

export default {
  namespace:'contract_person_model',
  state:{
    tableDataList: [],
  },
  reducers:{
    save(state,  action) {
      return { ...state, ...action.payload};
    },
    saveInit(state, {deptList: [], postList: []}) {
      return { ...state, deptList: [], postList: []}
    },
    saveOU(state,{ouList: DataRows}) {
      return { ...state, ouList:DataRows};
    },
    saveDept(state,{deptList: DataRows}) {
      return { ...state, deptList:DataRows};
    },
  },

  effects: {
    * contractPersonDefault({}, {call, put}) {

    },
    * contractPersonSearch({arg_param}, {call, put}) {
       let basicparam = {};
       basicparam["arg_user_id"] = Cookie.get('userid');
       const basicInfoData = yield call(contractService.contractPersonListQuery, basicparam);
       if (basicInfoData.RetCode === '1') {
        for (let i = 0; i < basicInfoData.DataRows.length; i++) {
          basicInfoData.DataRows[i].key = i + 1;
          basicInfoData.DataRows[i].rowKey = i + 1;
        }
        yield put({
          type: 'save',
          payload: {
            tableDataList: basicInfoData.DataRows
          }
        });
      } else {
        message.error(basicInfoData.RetVal);
      }

       /*let personlist = [{
         key:'1',
         user_id:'0869297',
         user_name:'王福江',
         dept_name:'济南软件研究院-结算分中心',
         team_name:'2019结算结构项目组',
         contract_type:'有固定期限',
         contract_time:'36月',
         start_time:'2016-07-01',
         end_time:'2019-06-30'
       },{
         key:'2',
         user_id:'0869297',
         user_name:'王福江',
         dept_name:'济南软件研究院-结算分中心',
         team_name:'2019结算结构项目组',
         contract_type:'有固定期限',
         contract_time:'36月',
         start_time:'2019-07-01',
         end_time:'2022-06-30'
       }];
      yield put({
        type: 'save',
        payload: {
          tableDataList: personlist
        }
      });*/
    },
  },
  subscriptions:{
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/labor/contractPersonSearch') {
          dispatch({ type: 'contractPersonDefault',query });
        }
      });
    }
  }
}
