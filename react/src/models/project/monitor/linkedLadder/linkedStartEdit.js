/*
 * 作者: 王西光
 * Date: 2020-09-11 23:23:26
 * 邮箱: wangxg928@chinaunicom.cn
 * 说明: 
 */
import * as linkedServices from '../../../../services/project/projService';
import Cookie from 'js-cookie';
import { message } from 'antd';
import * as projServices from "../../../../services/project/projMilestone";

export default {
    namespace: 'linkedStartEdit',
    state: {
        visible: false,
        visible2: false,
        selectedRows: [],
        newsInput:'',          // 新增按钮中输入框输入的内容
        dataRows: [],          // 查询已关联的天梯项目
        userDate: {},          // 被项目的信息
        tiantiQuery: [],       //查询未关联的天梯
        puDeptNameList: [],     //归口部门列表
        // deptId: '',
        // tianTiName: {},
        // email: {},
        datawe:[],
//-------------------------里程碑管理----------------------------------
        dataFirst: [],         //一级里程碑
        data2Rows: [],         //二级
        tianti: [],            //天梯工程数据
        tiantiKey: "",         //天梯工程选择key
        projIds:"",            //projId
        dataAll:{},             //里程碑列表全部数据
        selectedRowKeys:[],    //天梯工程选项按钮
    },
    reducers: {
        initData(state) {
            return {
                ...state,
                visible: false,
                visible2: false,
                selectedRows: [],
                newsInput:'', // 新增按钮中输入框输入的内容
                dataRows: [], // 查询已关联的天梯项目
                userDate: {}, // 被项目的信息
                tiantiQuery: [], //查询未关联的天梯
                puDeptNameList: [],     //归口部门列表
                // deptId: '',
                // tianTiName: '',
                // email: '',
                selectedRowKeys:[],    //天梯工程选项按钮
            };
        },
        save(state, action) {
            return { ...state, ...action.payload };
        }
    },
    effects: {
        //获得已关联的天梯工程数据
        *getLinkedRelation({e, projId},{ call, put, select }) {
          let { projIds } = yield select(state => state.linkedStartEdit)
          const proj_id = { projId }
          const response = yield call(linkedServices.tiantiRelation, proj_id);
          // if(response.retCode === "1") {
          //     const list = response.dataRows || [];
          //     if(list) {
          //         yield put({
          //             type: 'save',
          //             payload: {
          //                 planLibList: list
          //             }
          //         });
          //     }
          // }
          yield put({
              type: 'save',
              payload: {
                  dataRows: response.dataRows,
                  // projIds: projId
              }
          });
          // console.log(response,123)

          yield put({
              type: 'projPuNameSearch'
          });
      },

      //查询天梯工程
      *getNoLinked({condition},{ call, put, select }) {
          // yield put({
          //     type: 'save',
          //     payload: {
          //         deptId: '',
          //         tianTiName: '',
          //         email: ''
          //     }
          // });
          // const param = {
          //     tianTiName,
          //     deptId,
          //     email,
          // }
          const response = yield call(linkedServices.noTiantiRelation, condition);
          
          yield put({
              type: 'save',
              payload: {
                  tiantiQuery: response.dataRows,
              }
          });

          // console.log(response,22222223)
      },

      //新建并关联天梯
      *setNewTianti({tiantiLinkDTO},{ call, put, select }) {
          
          const response = yield call(linkedServices.newTiantiRelation, tiantiLinkDTO);

          if (response.retCode === "1") {
            message.success("新增成功！")
          }else{
            message.error(response.retVal)
          }
          yield put({
              type: 'getLinkedRelation',
              projId: tiantiLinkDTO.projId
          });

          // console.log(response,22222223)
      },

      //取消已关联的天梯工程
      *cancelTianti({tiantiLinkDTO},{ call, put, select }) {
          
          // const param = {
          //     tiantiLinkDTO,
          //     projId
          // }
          // console.log(param)
          const response = yield call(linkedServices.cancelTiantiRelation, tiantiLinkDTO);
          if(response.retCode === "1") {
              message.success("取消关联成功")
          }else{
            message.error("取消关联失败")
          }
          yield put({
              type: 'getLinkedRelation',
              projId: tiantiLinkDTO.projId
          });

          // console.log(response,22222223)
      },

      //关联已存在天梯
      *relationExistTianti({tiantiLinkDTO},{ call, put, select }) {
          
          const response = yield call(linkedServices.relationExistRelation, tiantiLinkDTO);

          if (response.retCode == "1") {
            message.success("关联成功！")
          }else{
            message.error(response.retVal)
          }
          yield put({
              type: 'getLinkedRelation',
              projId: tiantiLinkDTO.projId
          });

          yield put({
              type: 'getNoLinked',
          });

          // console.log(response,3333333)
      },

      /**
       * 作者：胡月
       * 创建日期：2017-10-11
       * 功能：项目基本信息查询
       * 邓广晖  2018-01-19  修改，查询添加 arg_userid
       * 邓广晖  2018-01-21  修改，将query改为queryData
       * @param query url的请求参数
       */
      *projectInfoQuery({projId}, {call, put, select}) {
          // const { queryData } = yield select(state => state.projStartMainPage);
          let postData = {
              arg_proj_id: projId,
              arg_flag: 1,
              arg_userid: Cookie.get('userid')
          };
          const data = yield call(linkedServices.getprojectInfo, postData);

          // console.log(data.DataRows,22222223)
          yield put({
              type: 'save',
              payload: {
                  userDate: data.DataRows[0],
              }
          });

          // const tianQuery = data.DataRows[0];
          // yield put({
          //     type: 'tiantiQuery',
          //     postData: {
          //         isPrimary: '1',
          //         // marName: tianQuery.mgr_name,
          //         // projCode: tianQuery.proj_code,
          //         // projName: tianQuery.re_proj_name,
          //         // marName: tianQuery.pu_dept_name,
          //     }
          // });
      },

      /**
       * 作者：胡月
       * 创建日期：2017-10-11
       * 功能：项目基本信息查询
       * 邓广晖  2018-01-19  修改，查询添加 arg_userid
       * 邓广晖  2018-01-21  修改，将query改为queryData
       * @param query url的请求参数
       */
      // *tiantiQuery({postData}, {call, put, select}) {
      //     // console.log(this.state,233)

      //     const data = yield call(linkedServices.tiantiQueryPrimaryChild, postData);
      //     console.log(data,5555555)
      // },
      /**
       * 作者：邓广晖
       * 创建日期：2017-12-20
       * 功能：归属部门列表查询
       */
      *projPuNameSearch({}, {call, put}) {
          const puData = yield call(linkedServices.departmentQuery, {
              arg_tenantid: Cookie.get('tenantid')
          });
          if (puData.RetCode === '1') {
              yield put({
                  type: 'save',
                  payload: {
                      puDeptNameList: puData.DataRows
                  }
              });
          } else {
              yield put({
                  type: 'save',
                  payload: {
                      puDeptNameList: []
                  }
              });
          }
      },



        //------------------------------------里程碑管理------------------------------------------------------------------
        *querydata({proj_id, key}, { put, select, call }) {
          // console.log("proj_id++++++++++++++++");
          // console.log(proj_id);
          // console.log("key++++++++++++++++");
          // console.log(key);
            //一级里程碑数据  二级里程碑数据  天体工程数据
            let { dataFirst, data2Rows, tianti, projIds ,dataAll } = yield select((state) => state.linkedStartEdit);
            let params = {
              projId: proj_id,
              // projId: "256742340121587712",
              // milestId: "256791846808711168",
              // isPrimary: "1",
            };
            // console.log("params++++++++++++++++++++++");
            // console.log(params);
            let data = yield call(projServices.proMilestoneLord, params);
            if (data.retCode === "1") {
              dataFirst = data.dataRows;
              dataAll = data
              dataFirst.forEach((item, index) => {
                item.key = index;
                item.i = (index % 10) + 1;
                item.children1 = []
              });
              // console.log("dataFirst+++++++++++++++++++++++++++");
              // console.log(dataFirst);
            }else{
              message.error("一级里程碑数据查询失败！")
            }

            // console.log("dataFirst.milestId++++++++++++++++++++++++++++++++++");
            // console.log(key,"*****************************");
            let dataTianti = yield call(projServices.proMilestoneTianti, params);
            if (dataTianti.retCode === "1") {
              tianti = dataTianti.dataRows;
              // console.log("dataTianti+++++++++++++++++++++++++++++++++++++");
              // console.log(dataTianti);
            }else{
              message.error("天梯工程数据查询失败！")
            }
            //查询生产单元列表
            let prodList = yield call(projServices.prodList, params);
            yield put({
              type: "save",
              payload: {
                dataFirst: JSON.parse(JSON.stringify(data.dataRows)),
                tianti: JSON.parse(JSON.stringify(dataTianti.dataRows)),
                dataAll: JSON.parse(JSON.stringify(dataAll)),
              },
            });
          },

          //二级查询
          *data2list({tableRow,keyId}, { put, select, call }){
            // console.log(tableRow,"tableRow++++++++++++++++")
            let id = tableRow === undefined ? "" : tableRow
            let keyIndex = keyId === undefined ? id :keyId
            // console.log(keyIndex,"keyIndex11111")
            let { dataFirst, tianti, projIds } = yield select((state) => state.linkedStartEdit);
              // console.log(id,"++++++++++++++++++++");
              let params2 = {
                // milestId: tableRow !== "" ? dataFirst[tableRow].milestId : "",               //以及里程碑id
                milestId: dataFirst[keyIndex].milestId
                // projId: "256742340121587712",
                // milestId: "256791846808711168",
                // isPrimary: "1",
              };
              // console.log(params2,"231312323");
              let data2 = yield call(projServices.proMilestoneLevel2, params2);
              let data2Rows = [];
              if (data2.retCode === "1") {
                data2Rows = data2.dataRows;
                data2Rows.forEach((item, index) => {
                  item.key = index;
                  item.i = (index % 10) + 1;
                });
                // dataFirst[id].children = []
                // let we = JSON.parse(JSON.stringify(data2Rows))
                // dataFirst.forEach((v,i) => {
                //   if(i == id) {
                //     dataFirst[id].children1 = we
                //   }
                // })
                dataFirst[keyIndex].children1 = JSON.parse(JSON.stringify(data2Rows))
                dataFirst[keyIndex].children1.forEach((item,index)=>{
                  item.key = index
                })
                // console.log(dataFirst,"dataFirst++++++++++++")
                // console.log(data2Rows,"__________________________________________")
              }else{
                message.error("二级里程碑数据查询失败！")
              }
              // console.log(dataFirst,"+++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
              yield put({
                type: "save",
                payload: {
                  // data2Rows: data2.dataRows,
                  data2Rows: JSON.parse(JSON.stringify(data2Rows)),
                  dataFirst: JSON.parse(JSON.stringify(dataFirst))
                },
              });
          },

          //二级里程碑添加
          *savedataFirst(
            { e, values, transferStart, transferEnd, name, zhuKey, key, proj_id },
            { put, select, call }
          ) {
            //选择天梯工程key值
            let { tiantiKey, tianti, dataFirst } = yield select((state) => state.linkedStartEdit);
            var ladderId = "";
            let principalemail = "";
            let principaleid = "";
            let principalename = "";
            if (tiantiKey !== "") {
              ladderId = tianti[tiantiKey].ladderProjectId;
              principalemail = tianti[tiantiKey].email
              principaleid = tianti[tiantiKey].pmId
              principalename = tianti[tiantiKey].pmName
            } else {
              ladderId = "undefined";
            }
            let ladderN = "";
            if (values.ladderName !== "") {
              ladderN = tianti[values.ladderName].ladderProjectName;
            } else {
              ladderId = "undefined";
              ladderN = "undefined";
            }
            let params = {
              ladderName: ladderN,                          //天梯工程名称
              milestoneName: values.milestName,             //史诗故事名称
              expectStartTime: transferStart,               //预计开始时间
              expectEndTime: transferEnd,                   //预计结束时间
              planWorkload: values.planWorkload,            //预计工作量
              ladderId: ladderId,                           //天梯工程Id
              milestId: dataFirst[zhuKey].milestId,               //一级里程碑id
              weightAllocation: values.weightAllocation,    //权重分配
              createByMile: Cookie.get("email"),            //创建者邮箱
              responsibleId: principaleid,                  //负责人id
              responsiblePeople: principalemail,            //负责人邮箱
              responsibleName: principalename               //负责人
            };

            let tableRow = zhuKey
            const status = yield call(projServices.proMilestoneAdd, params);
            if (status.retCode == "1") {
              message.success("二级里程碑添加成功！")
            }else{
              message.error(status.retVal)
            }
            yield put({ type: "data2list",tableRow});
          },

          //天梯工程选择
          *setSelect({ e ,name}, { put, select, call }) {
            let { tiantiKey, tianti } = yield select((state) => state.linkedStartEdit);
            tiantiKey = e;
            yield put({
              type: "save",
              payload: {
                tiantiKey: JSON.parse(JSON.stringify(tiantiKey)),
              },
            });
          },

          //二级里程碑修改
          *editSave({ values, tableRow, key, proj_id, milestoneId }, { select, call,put }) {
            //天梯工程数据   ladderName1
            let { tianti, tiantiKey, data2Rows} = yield select((state) => state.linkedStartEdit);
            let ladderId = tiantiKey == "" ? "" : tianti[tiantiKey].ladderProjectId;
            let ladderN = tiantiKey == "" ? values.ladderName1 : tianti[tiantiKey].ladderProjectName;
            let principalemail = tiantiKey == "" ? "" : tianti[tiantiKey].email
            let principalid = tiantiKey == "" ? "" : tianti[tiantiKey].pmId
            let principalname = tiantiKey == "" ? "" : tianti[tiantiKey].pmName
            let params = {
              milestoneName: values.milestoneName,                //里程碑名称
              expectEndTime: values.expectEndTime._i,             //计划结束时间
              expectStartTime: values.expectStartTime._i,          //计划开始时间
              planWorkload: values.planWorkload,                  //计划工作量
              ladderId: ladderId,                                 //天梯工程ID
              milestoneId:milestoneId,                            //二级里程碑ID
              weightAllocation: values.weightAllocation,          //权重分配
              responsiblePeople: principalemail,                  //责任人邮箱
              ladderName: ladderN,                                //天梯工程name
              updateBy: Cookie.get("userid"),                     //修改人ID
              updateName:Cookie.get("username"),                  //修改人名称
              responsibleName: principalname,                     //负责人姓名
              responsibleId: principalid                          //负责人id
            };
            let keyId = key
            let response = yield call(projServices.editSave, params);
            if (response.retCode == "1") {
              message.success("更新成功")
            }else{
              message.error(response.retVal)
            }
            yield put({ type: "data2list",tableRow,keyId});
          },
          
          //二级里程碑删除
          *proMilestoneDelete({ record ,key, proj_id,zhuKey1}, { put, select, call }) {
            let { data2Rows,dataFirst} = yield select((state) => state.linkedStartEdit);
            let params = {
              // milestoneId: data2Rows[record.key].milestoneId,
              milestoneId:dataFirst[zhuKey1].children1[record.key].milestoneId
            };
            let tableRow = key
            let keyId = zhuKey1
            const status = yield call(projServices.proMilestoneDelete, params);
            if (status.retCode == "1") {
               message.success("删除成功")
            }else{
              message.error("删除失败！")
            }
            yield put({ type: "data2list", tableRow,keyId});
          },
    },
    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname, query}) => {
                if (pathname === '/projectApp/projMonitor/linkedStartEdit') {
                    dispatch({type: 'initData'});

                    dispatch({type: 'getLinkedRelation'});
                    dispatch({type: 'getNoLinked'});
                    dispatch({type: 'setNewTianti'});
                    dispatch({ type: 'projectInfoQuery' });
                    dispatch({type: 'relationExistTianti'});
                    dispatch({type: 'tiantiQuery'});

                    dispatch({type: 'projTypeSearch'});
                    dispatch({type: 'projPuNameSearch'});

                } 
            });
        },
    },
}
