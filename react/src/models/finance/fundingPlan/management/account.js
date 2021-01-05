/**
 * 作者：刘东旭
 * 日期：2018-03-06
 * 邮箱：liudx1006@chinaunicom.cn
 * 文件说明：资金计划-科目管理
 */
import * as accountService from '../../../../services/finance/fundingPlanManagement';
import Cookie from 'js-cookie'
export default {
  namespace: 'accountManagement',
  state: {
    tableData: [], //查询后重构成表格数据
  },

  reducers: {
    save(state, action) {
      return {...state, ...action.payload};
    },
  },

  effects: {
    //默认查询数据
    * accountSearch({}, {call, put}) {
      const data = yield call(accountService.accountSearch);
      if (data.RetCode === '1') {
        if (data.jsonTree) {
          const searchDataReconfiguration = data.jsonTree.map(item => {
            if (item.list) {
              return ({
                key: item.id,
                name: item.name,
                level: '一级',
                id: item.id,
                children: item.list.map(i => ({
                  key: i.id,
                  name: i.name,
                  level: '二级',
                  id: i.id,
                  parentId: i.parentId
                }))
              })
            } else {
              return ({
                  key: item.id,
                  name: item.name,
                  level: '一级',
                  id: item.id,
                }
              )
            }
          });
          yield put({
            type: 'save',
            payload: {
              tableData: searchDataReconfiguration //将查询到的数据存进状态机
            }
          });
        } else {
          yield put({
            type: 'save',
            payload: {
              tableData: [] //将查询到的数据存进状态机
            }
          });
        }
      }
    },

    //增加一级科目
    * accountNew({newInfo}, {call, put}) {
      const userID = localStorage.staffid; //获取当前用户ID
      const DeptID = Cookie.get('dept_id'); //获取当前用户所属部门ID
      let postData = {};
      postData['arg_fee_name'] = newInfo;
      postData['arg_sub_fee_name'] = 'NoValue';
      postData['arg_user_id'] = userID;
      postData['arg_create_deptid'] = DeptID; //操作人员所属部门ID
      const data = yield call(accountService.accountAddFeeName, postData);
      if (data.RetCode === '1') {
        //再查一次数据
        yield put({
          type: 'accountSearch',
        });
      }
    },


    //添加二级科目
    * accountAdd({inputAdd, nameAdd}, {call, put}) {
      const userID = localStorage.staffid; //获取当前用户ID
      const DeptID = Cookie.get('dept_id'); //获取当前用户所属部门ID
      let postData = {};
      postData['arg_fee_name'] = nameAdd;
      postData['arg_sub_fee_name'] = inputAdd;
      postData['arg_user_id'] = userID;
      postData['arg_create_deptid'] = DeptID; //操作人员所属部门ID
      const data = yield call(accountService.accountAddFeeName, postData);
      if (data.RetCode === '1') {
        //再查一次数据
        yield put({
          type: 'accountSearch',
        });
      }
    },

    //删除科目
    * accountDeleteOne({elementName, fatherName}, {call, put}) {
      let firstLevel, secondLevel; //定义一级和二级name
      if (fatherName) { //判断是否存在二级内容
        firstLevel = fatherName;
        secondLevel = elementName;
      } else {
        firstLevel = elementName;
        secondLevel = 'NoValue';
      }
      const userID = localStorage.staffid; //获取当前用户ID
      let postData = {};
      postData['arg_fee_name'] = firstLevel;
      postData['arg_sub_fee_name'] = secondLevel;
      postData['arg_user_id'] = userID;
      const data = yield call(accountService.accountDeleteFeeName, postData);
      if (data.RetCode === '1') {
        //再查一次数据
        yield put({
          type: 'accountSearch',
        });
      }
    },


    //编辑科目
    * accountEdit({nameEdit, inputEdit, fatherName}, {call, put}) {
      let firstLevel, secondLevel, firstLevelNew, secondLevelNew; //定义一级和二级name
      if (fatherName) { //判断是否存在二级内容
        firstLevel = fatherName;
        firstLevelNew = 'NoValue';
        secondLevel = nameEdit;
        secondLevelNew = inputEdit;
      } else {
        firstLevel = nameEdit;
        firstLevelNew = inputEdit;
        secondLevel = 'NoValue';
        secondLevelNew = 'NoValue';
      }
      const userID = localStorage.staffid; //获取当前用户ID
      let postData = {};
      postData['arg_fee_name'] = firstLevel; //一级名称
      postData['arg_new_fee_name'] = firstLevelNew; //新一级名称
      postData['arg_sub_fee_name'] = secondLevel; //二级名称
      postData['arg_new_sub_fee_name'] = secondLevelNew; //新二级名称
      postData['arg_user_id'] = userID;
      const data = yield call(accountService.accountEditName, postData);
      if (data.RetCode === '1') {
        //再查一次数据
        yield put({
          type: 'accountSearch',
        });
      }
    },

  },

  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/financeApp/funding_plan/fundingPlanAccountManagement') {
          dispatch({type: 'accountSearch', query});
        }
      });
    },
  },
};
