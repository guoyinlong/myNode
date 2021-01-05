/**
 * 作者：彭东洋
 * 创建日期：2020-02-18
 * 邮件：pengdy@itnova.com.cn
 * 文件说明：项目配置-归属部门设置 所有model数据
 */
import * as deptSetServices from "../../../../services/project/config/projCheck"
import {message} from 'antd';
export default {
    namespace: "departmentSetting",
    state: {
        dataList: [],//归属部门列表
        deptList: [], //部门列表
        deptId: "",  //下拉框部门id
    },
    reducers: {
        save (state, action) {
            return {
                ...state,
                ...action.payload
            };
        }
    },
    effects: {
        //归属部门列表查询
       * settingPuAllListQuery ({},{put,call}) {
           let postDtat = {
            arg_req_moduleurl: "/projectApp/projConfig/mailNotice"
           }
           const {DataRows, RetCode,CommentInfo} = yield call(deptSetServices.settingPuAllListQuery,postDtat);
           if(RetCode == "1") {
                DataRows.map((v,i) => {
                    if(v.state == "1") {
                        v.State = false  
                    } else {
                        v.State = true  
                    }
                    v.index = i+1
                    v.key = i+1
                })
                yield put({
                    type: "save",
                    payload: {
                        dataList: JSON.parse(JSON.stringify(DataRows)),
                        CommentInfo 
                    }
                })
            }
        },
        //归属部门添加人员
        * settingPuAllInsert ({postDtat},{put,call}) {
            const { RetCode } =yield call(deptSetServices.settingPuAllInsert,postDtat);
            if(RetCode == "1") {
                yield put({
                    type: "settingPuAllListQuery"
                });
                message.success("添加成功")
            } else {
                message.error("添加失败")
            }
        },
        //归属部门状态修改
        *  settingPuAllStateUpdate ({postDtat},{put,call}) {
            const { RetCode } = yield call(deptSetServices.settingPuAllStateUpdate,postDtat)
            if(RetCode == "1") {
                yield put({
                    type: "settingPuAllListQuery"
                });
                message.success("状态修改成功")
            } else {
                message.error("状态修改失败")
            }
        },
        //下拉框查询部门
        * deptquery ({},{put,call}) {
            const postDtat = {
                argtenantid: "10010"
            }
            const {RetCode, DataRows} = yield call(deptSetServices.deptquery,postDtat);
            if(RetCode == "1") {
                yield put ({
                    type: "save",
                    payload: {
                        deptList: JSON.parse(JSON.stringify(DataRows)), 
                    }
                })
            }

        },
    },
    subscriptions:{
        setup({ dispatch,history }) {
            return history.listen(({ pathname,query}) =>{
                if (pathname === '/projectApp/projConfig/departmentSetting') {
                    dispatch({type:"settingPuAllListQuery"})
                    dispatch({type:"deptquery"})
                }
            })
        }
    }
}