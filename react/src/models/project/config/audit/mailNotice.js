/**
 * 作者：彭东洋
 * 创建日期：2020-02-18
 * 邮件：pengdy@itnova.com.cn
 * 文件说明：项目配置-邮件通知人员设置 所有model数据
 */
import * as mailServices from '../../../../services/project/config/projCheck';
import {message} from 'antd'
export default {
    namespace: 'mailNotice',
    state: {
        capitalList: [], //邮件通知设置列表
        CommentInfo: "", //邮件通知设置文字描述
        UserList: [], //团队创建列表
        teamCommentInfo: "", //团队创建文字描述
    },
    reducers: {
        save (state,action){
            return {
                ...state,
                ...action.payload
            };
        }
    },
    effects: {
        //邮件通知设置查询列表
        * getcapitalList({}, {put , call}) {
            let postDtat = {
                arg_req_moduleurl:"/projectApp/projConfig/mailNotice"
            }
            const {DataRows, RetCode,CommentInfo} = yield call(mailServices.getcapitalList,postDtat);
            if(RetCode == "1") {
                DataRows.map((v,i) => {
                    v.index = i+1
                    v.key = i+1
                })
                yield put({
                    type: "save",
                    payload: {
                        capitalList: JSON.parse(JSON.stringify(DataRows)),
                        CommentInfo 
                    }
                })
            }
        },
        //邮件通知新增人员
        * userInsert({postDtat}, {put, call}) {
            const {RetCode} = yield call(mailServices.userInsert,postDtat);
            if(RetCode == "1") {
                yield put({
                    type: "getcapitalList"
                })
                message.success("添加成功")
            } else {
                message.error("添加失败")
            }
        },
        //邮件通知删除人员
        * userDelete({postDtat},{put, call}) {
            const {RetCode} = yield call(mailServices.userDelete,postDtat);
            if(RetCode == "1") {
                yield put({
                    type: "getcapitalList"
                })
                message.success("删除成功")
            } else {
                message.error("删除失败")
            }
        },
        //团队创建列表查询
        * projnamechangeUserListQuery({},{put, call}) {
            const postDtat = {
                arg_req_moduleurl: "/projectApp/projConfig/mailNotice"
            }
            const {RetCode, DataRows,CommentInfo} = yield call(mailServices.projnamechangeUserListQuery,postDtat);
            if(RetCode == "1") {
                DataRows.map((v,i) => {
                    v.index = i+1
                    v.key = i+1
                })
                yield put ({
                    type: "save",
                    payload: {
                        UserList: JSON.parse(JSON.stringify(DataRows)),
                        teamCommentInfo: CommentInfo
                    }
                })
            }
        },
        //团队创建新增人员
        * projnamechangeUserListInsert({postDtat},{put, call}) {
            const {RetCode} = yield call(mailServices.projnamechangeUserListInsert,postDtat)
            if(RetCode == "1") {
                yield put({
                    type: "projnamechangeUserListQuery"
                })
                message.success("添加成功");
            } else {
                message.error("添加失败")
            }
        },
        //团队创建删除人员
        * projnamechangeUserListDelete ({postDtat},{put, call}) {
            console.log(postDtat,"postDtat")
            const { RetCode } = yield call (mailServices.projnamechangeUserListDelete,postDtat)
            if(RetCode == "1") {
                yield put ({
                    type: "projnamechangeUserListQuery"
                })
                message.success("删除成功")
            } else {
                message.error("删除失败")
            }
        }

    },
    subscriptions:{
        setup({ dispatch,history }) {
            return history.listen(({ pathname,query}) =>{
                if (pathname === '/projectApp/projConfig/mailNotice') {
                    dispatch({type:"getcapitalList"})
                    dispatch({type:"projnamechangeUserListQuery"})
                }
            })
        }
    }
}