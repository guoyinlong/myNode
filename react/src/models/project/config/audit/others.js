/**
 * 作者：彭东洋
 * 创建日期：2020-02-18
 * 邮件：pengdy@itnova.com.cn
 * 文件说明：项目配置-其他设置 所有model数据
 */
import * as othersServices from '../../../../services/project/config/projCheck';
import { message } from 'antd';
export default {
    namespace: "others",
    state:{
        departmentsList: [], //归属部门列表
        CommentInfo: "",//其他设置文字描述
    },
    reducers: {
        save (state,action){
            return {
                ...state,
                ...action.payload
            };
        }
    },
    effects:{
        //其他设置列表查询
        * settingTmoEditUserListQuery({}, {put , call}) {
            let postDtat = {
                arg_req_moduleurl:"/projectApp/projConfig/mailNotice"
            }
            const {DataRows, RetCode,CommentInfo} = yield call(othersServices.settingTmoEditUserListQuery,postDtat);
            if(RetCode == "1") {
                DataRows.map((v,i) => {
                    v.index = i+1
                    v.key = i+1
                })
                yield put({
                    type: "save",
                    payload: {
                        departmentsList: JSON.parse(JSON.stringify(DataRows)),
                        CommentInfo 
                    }
                })
            }
        },
        //其他设置删除人员
        * settingTmoEditUserDelete({postDtat},{call,put}) {
            const {RetCode} = yield call(othersServices.settingTmoEditUserDelete,postDtat);
            if(RetCode == "1") {
                yield put({
                    type: "settingTmoEditUserListQuery"
                })
                message.success("删除成功")
            } else {
                message.error("删除失败")
            }
        },
        //其他设置新增人员
        * settingTmoEditUserInsert({postDtat},{call,put}) {
            const {RetCode} = yield call(othersServices.settingTmoEditUserInsert,postDtat);
            if(RetCode == "1") {
                yield put ({
                    type: "settingTmoEditUserListQuery"
                });
                message.success("新增成功")
            } else {
                message.error("新增失败")
            }
        }
    },
    subscriptions:{ 
        setup({dispatch,history}) {
            return history.listen(({pathname,query}) =>{
                if(pathname === "/projectApp/projConfig/others") {
                    dispatch({type:"settingTmoEditUserListQuery"})
                }
            })
        }
    }
}