/**
 * 作者：靳沛鑫
 * 创建日期：2019-6-12
 * 邮件：1677401802@qq.com
 * 文件说明：竞聘续聘申请
 */
import { routerRedux } from 'dva/router';
import * as corePostApplyService from "../../../services/project/corePostApplyService"
import * as corePositionService from "../../../services/project/corePositionService"
import Cookie from 'js-cookie';
import {Select, message} from "antd";
import React from "react";
export default {
    namespace: 'postsQuery',
    state: {
        yearList: [],           // 年份
        postsName:[],           // 核心岗位名称
        postsList: [],          // 竞聘核心岗位列表
        postsContList: [],      // 续聘核心岗位列表
        params: {},
        userNameList: [],       // 查询人员
        selectedRowKeys: [],    // 勾选数据
        selectedShowList: [],   // 勾选预览数据（table多选）
    },
    effects: {
      /**
       * 作者：靳沛鑫
       * 创建日期：2019-6-12
       * 邮件：1677401802@qq.com
       * 文件说明：岗位信息初始化
       */
      * init({},{ select, call, put }){
            const { params } = yield select(state => state.postsQuery);
            // 初始化年份
            const date = new Date();
            let year = date.getFullYear();
            //年份
            yield put({
              type: 'save',
              payload: {
                yearList: [
                  {year:year},
                  {year:year-1}
                ]
              }
            })
            //初始化状态
            params.croeKey = 1
            params.corepositionIds = []
            params.year=[]
            params.name=[]
            params.isenable=true
            yield put({
            type : 'save',
                payload:{
                  postsName: [
                    {value:'项目经理'},
                    {value:'小组长'},
                    {value:'业务架构师'}
                  ],
                    params: params,
                }
            });
            //初始化竞聘列表
            yield put({
              type: 'postsList'
            })
           //初始化续聘列表
            yield put({
              type: 'postsContList'
            })
        },
      * postsList({},{call, put, select}) {  //从接口取值
        const {params} = yield select(state => state.postsQuery);
        let data = yield call(corePostApplyService.postsList, params);
        if(data.RetCode=='1'){
          yield put({
            type : 'save',
            payload:{
              postsList: data.DataRows,
            }
          });
        }
      },
      * postsContList({},{call, put, select}) {  //从接口取值
        const {params} = yield select(state => state.postsQuery);
        let data = yield call(corePostApplyService.postsContList, params);
        if(data.RetCode=='1'){
          yield put({
            type : 'save',
            payload:{
              postsContList: data.DataRows,
            }
          });
        }
      },
      //保存选择信息（下拉选项）
      *saveSelectInfo({value, typeItem},{ call, put, select }){
        const {params} = yield select(state => state.postsQuery);
        if(typeItem=='status'){
          switch(value){
            case '空缺': value=0;break;
            case '拟聘任': value=1;break;
            case '已聘任': value=2;break;
          }
        }
        params[typeItem]= value
        yield put({
          type : 'save',
          payload: {
            params : {...params}
          }
        })
        yield put({
          type: 'postsList'
        })
        yield put({
          type: 'postsContList'
        })
      },
      //上传文件后的信息提交
      * upDataUrl({ corepositionId, name, url },{ call, put, select }){
       let postData = {corepositionId, name, url}
       yield call(corePostApplyService.upDataUrl, postData);
        yield put({
          type: 'postsList'
        })
      },
      //清空和提交
      * resetCond({ elem },{ call, put, select }){
        const { params } = yield select(state => state.postsQuery);
        let postData={corepositionIds:params.corepositionIds+''}
        if(params.croeKey==1 && elem && params.corepositionIds != ''){
            let data=yield call(corePostApplyService.appCorePosition, postData);
            if (data.RetCode == '1') {
              message.success('提交成功');
            }else{
              message.error('提交失败');
            }
        }else if(params.croeKey==2 && elem && params.corepositionIds != ''){
            let data=yield call(corePostApplyService.appCorePositions, postData);
            if (data.RetCode == '1') {
              message.success('提交成功');
            }else{
              message.error('提交失败');
            }
        }else{
          params.year=[]
          params.name=[]
          params.corepositionIds = []
        }
        yield put({
          type: 'postsList'
        })
        yield put({
          type: 'postsContList'
        })
        params.year=[]
        params.name=[]
        params.corepositionIds = []
        yield put({
          type : 'save',
          payload: {
            params : {...params}
          }
        })
      },
      //添加人模态窗
      * addPerson({record},{ call, put, select }){
        const { params } = yield select(state => state.postsQuery);
        params.username=record.corepositionUserName
        params.affiliatedAcademy=record.affiliatedAcademy
        params.userId=record.corepositionUserId
        params.id=record.id
        yield put({
          type: 'save',
          payload:{
            params : {...params},
          }
        });
        yield put({
          type: 'userAndAcademyNames'
        })
      },
      //人员及其所属院
      * userAndAcademyNames({id}, {call, put, select}){
        const { params, userNameList} = yield select(state => state.postsQuery);
        let data = yield call(corePositionService.userAndAcademyNames);
        if(data.RetCode=='1'){
          userNameList.map((i)=>{
            if(i.userId==id.slice(-7)){
              params.username=i.username
              params.corepositionUserId=i.userId
              params.affiliatedAcademy=i.affiliatedAcademy
            }
          })
          yield put({
            type: 'save',
            payload:{
              userNameList: data.DataRows
            }
          });
          yield put({
            type: 'save',
            payload:{
              params : {...params},
            }
          });
        }
      },
      //选项卡
      * coreUpId({ key },{ call, put, select }){
        const { params } = yield select(state => state.postsQuery);
        if(params.croeKey != key){
          params.corepositionIds = []
          params.isenable=true
        }
        params.croeKey = key
        yield put({
          type: 'save',
          params: {...params}
        })
      },
      //保存多选信息
      * saveSelectedInfo({ selectedRows, selectedRowKeys },{ call, put, select }) {
        const { params } = yield select(state => state.postsQuery);
          params.isenable=true
          if(selectedRows.length!=0){
            selectedRows.map((item)=>{
              params.corepositionIds.push(item.id)
            })
            params.isenable=false
          }
          yield put({
            type: 'save',
            params: {...params}
          })
        },
      //模态窗确定
      * addCorePosts({callback}, {call, put, select}){
        const { params } = yield select(state => state.postsQuery);
        let postData = { corepositionId:params.id, corepositionUserId:params.corepositionUserId}
        let data=yield call(corePostApplyService.addPersons, postData);
        if (data.RetCode == '1') {
          message.success('提交成功');
          params.addCorRule='1'
        }else{
          params.addCorRule='0'
          params.message=data.RetVal
        }
        callback(params.addCorRule)
        if(params.addCorRule=='0'){
          switch(params.message){
            case '缺少参数corepositionUserId': params.message='请填写核心岗位人';break;
            default : break
          }
          message.error(params.message);
        }else{
          yield put({
            type: 'postsContList'
          })
        }
        yield put({
          type: 'save',
          payload:{
            params : {...params},
          }
        });
      }

    },
    reducers: {
      save(state, action) {
        return {...state, ...action.payload};
      }
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                if (pathname === '/projectApp/corePost/apply') {
                    dispatch({
                        type: 'init',
                        query
                    });
                }
            });
        },
    },
};
