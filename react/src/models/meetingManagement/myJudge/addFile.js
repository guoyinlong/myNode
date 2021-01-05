import * as commonAppService from '../../../services/commonApp/commonAppService.js';
import * as meetManageService from '../../../services/meetingManagement/meetManage.js';
import Cookie from 'js-cookie';
import {
  message
} from 'antd';
import {
  routerRedux
} from 'dva/router';
/**
 * 作者：贾茹
 * 日期：2020-3-28
 * 邮箱：m18311475903@163.com
 * 功能：申请人补充材料
 */
export default {
  namespace: 'addFile',
  state: {
    list: [],
    waitMeetingDetails: [], //详情页面显示的数据
    topicName: '', //议题名称
    judgeTableSource: [], //审批环节table数据
    passData: [], //上个页面穿过来的数据
    materialDetailDisplay: 'none', //上会材料泄密说明显示
    tableMaterialDetailDisplay: '',
    visible: false,
    returnReason: '',
    tableUploadFile: [],
    meetingName: '', //会议名称
    noUpdate: false, //无更改按钮置灰
    meetingRadioValue: '', //上会材料是否涉密
    secretReason: '', //泄密说明
    FileInfo: [],
    topicId: "",
    submitID: "", //查询附件需要
  },

  reducers: {
    save(state, action) {
      return { ...state,
        ...action.payload
      };
    },
  },

  effects: {
    * init({
      query
    }, {
      call,
      put
    }) {
      console.log(JSON.parse(query.value))
      if (JSON.parse(query.value).topic_if_secret === "1") {
        yield put({
          type: 'save',
          payload: {
            materialDetailDisplay: 'block',
            tableMaterialDetailDisplay: 'none'
          }
        });

      } else {
        yield put({
          type: 'save',
          payload: {
            materialDetailDisplay: 'none',
            tableMaterialDetailDisplay: 'block'
          }
        });
      }
      yield put({
        type: 'save',
        payload: {
          passData: JSON.parse(query.value),
          topicName: JSON.parse(query.value).topic_name,
          meetingRadioValue: JSON.parse(query.value).topic_if_secret,
          secretReason: JSON.parse(query.value).topic_secret_reason,
          noUpdate: false, //无更改按钮置灰
          topicId: JSON.parse(query.value).topic_id,
        }
      });
      yield put({
        type: 'waitDetails'
      });

      yield put({
        type: 'judgeMoment'
      })
      /* console.log(JSON.parse(query.value));*/
    },

    * noUpdate({}, {
      put
    }) {
      yield put({
        type: 'save',
        payload: {
          noUpdate: true,
        }
      })
    },

    //议题详情查询
    * waitDetails({}, {
      call,
      select,
      put
    }) {
      const {
        passData
      } = yield select(state => state.addFile);
      /*console.log(detailLine);*/
      const recData = {
        arg_topic_id: passData.topic_id, //-- 会议议题id
        arg_state: passData.list_state, //-- 0待办，1已办，2办结
        arg_batch_id: passData.batch_id, // -- 同一人处理的批次id
        arg_user_id: Cookie.get('userid'),
      };
      const response = yield call(commonAppService.waitDetailsService, recData);
      if (response.RetCode === '1') {
        const res = response.DataRows;
        for (let i = 0; i < res.length; i++) {
          res[i].key = i;
          /*console.log(res[i]);*/
          if (res[i].topic_if_important === '1') {
            yield put({
              type: 'save',
              payload: {
                resonDisplay: 'block',
              }
            })
          } else {
            yield put({
              type: 'save',
              payload: {
                resonDisplay: 'none',
              }
            })
          }
          if (res[i].topic_if_study === '1') {
            yield put({
              type: 'save',
              payload: {
                discussDisplay: 'block',
              }
            })
          } else {
            yield put({
              type: 'save',
              payload: {
                discussDisplay: 'none',
              }
            })
          }
          if (res[i].topic_if_secret === '1') {

            yield put({
              type: 'save',
              payload: {
                meetingRadioValue: res[i].topic_if_secret,
                materialDetailDisplay: 'block',
                tableMaterialDetailDisplay: 'none',
              }
            })
          } else {
            yield put({
              type: 'save',
              payload: {
                meetingRadioValue: res[i].topic_if_secret,
                materialDetailDisplay: 'none',
                tableMaterialDetailDisplay: 'block',
              }
            })
          }
          yield put({
            type: 'save',
            payload: {
              topicId: res[i].topic_id,
              waitMeetingDetails: res[i],
              submitID: res[i].submit_id,
            }
          })
        }
        /* console.log(res);*/
      }
      yield put({
        type: 'searchUploadFile'
      });
      yield put({
        type: 'getMeetingName'
      });

    },

    //点击无更改服务
    * noReset({}, {
      call,
      select,
      put
    }) {
      const {
        passData,
        waitMeetingDetails
      } = yield select(state => state.addFile);
      /* console.log(passData);*/
      const recData = {
        arg_list_related_id: passData.topic_id,
        arg_submit_id: waitMeetingDetails.submit_id,
        arg_create_user_id: Cookie.get('userid'),
        arg_create_user_name: Cookie.get('username'),
      }
      const response = yield call(commonAppService.noReset, recData);
      if (response.RetCode === '1') {
        message.info('提交成功');
        if (passData.submit_id) {
          yield put(routerRedux.push({
            pathname: '/adminApp/meetManage/myJudge'
          }));
        } else {
          yield put(routerRedux.push({
            pathname: '/adminApp/meetManage/topicApply'
          }));
        }

      }
    },

    //查询会议名称
    * getMeetingName({}, {
      call,
      select,
      put
    }) {
      const {
        waitMeetingDetails
      } = yield select(state => state.addFile);
      /*console.log(waitMeetingDetails,waitMeetingDetails);*/
      const recData = {
        arg_topic_id: waitMeetingDetails.topic_id
      };
      const response = yield call(commonAppService.getMeetingName, recData);
      if (response.RetCode === '1') {
        const res = response.DataRows;
        for (let i = 0; i < res.length; i++) {
          res[i].key = i;
          yield put({
            type: 'save',
            payload: {
              meetingName: res[i].note_name
            }
          })
        }

      }
    },

    //保存佐证材料名称地址
    * saveUploadFile({
      value
    }, {
      call,
      select,
      put
    }) {
      /* console.log(value);*/
      const {
        FileInfo,
        tableUploadFile
      } = yield select(state => state.addFile);
      tableUploadFile.push({
        upload_name: value.filename.RealFileName,
        AbsolutePath: value.filename.AbsolutePath,
        RelativePath: value.filename.RelativePath,
        key: value.filename.AbsolutePath,
        upload_type: '2',
        upload_desc: '归档材料'
      });
      /* console.log(tableUploadFile);*/
      /* FileInfo.push({
        upload_name: value.filename.RealFileName,
        RelativePath: value.filename.RelativePath,
        AbsolutePath: value.filename.AbsolutePath,
        upload_type: '2',
        upload_desc: '归档材料'
      });*/
      /*console.log("\""+JSON.stringify(FileInfo)+"\"");*/
      yield put({
        type: 'save',
        payload: {
          FileInfo: tableUploadFile,
          tableUploadFile: JSON.parse(JSON.stringify(tableUploadFile))
        }
      })
    },

    //上传附件删除
    * deleteUpload({
      record
    }, {
      call,
      select,
      put
    }) {
      /*console.log(record);*/
      const {
        tableUploadFile
      } = yield select(state => state.addFile);

      /*tableUploadFile.filter(i=>!i.includes(record.RelativePath));
      console.log(tableUploadFile);*/
      let b = [];
      let c = [];
      for (let i = 0; i < tableUploadFile.length; i++) {
        if (tableUploadFile[i] !== record) {
          b.push(tableUploadFile[i]);
          c.push({
            upload_name: tableUploadFile[i].upload_name,
            RelativePath: tableUploadFile[i].RelativePath,
            AbsolutePath: tableUploadFile[i].AbsolutePath,
            upload_type: '2',
            upload_desc: '归档材料'
          })
        }
      }
      /*console.log(FileInfo);*/
      message.info('删除成功');
      yield put({
        type: 'save',
        payload: {
          noUpdate:true, //无更改按钮置灰
          tableUploadFile: JSON.parse(JSON.stringify(b)),
          FileInfo: c
        }
      })



    },

    //附件查询
    * searchUploadFile({}, {
      call,
      select,
      put
    }) {

      const {
        topicId,
        submitID
      } = yield select(state => state.addFile);
      const recData = {
        arg_topic_id: topicId, // VARCHAR(32), -- 议题id
        arg_submit_id: submitID, // VARCHAR(32) -- 批次id
      };
      const response = yield call(meetManageService.searchFileUpload, recData);
      let c = [];
      if (response.RetCode === '1') {
        const res = response.DataRows;
        /*   console.log(res);*/
        for (let i = 0; i < res.length; i++) {
          res[i].key = i;
          c.push({
            upload_name: res[i].upload_name,
            RelativePath: res[i].upload_url,
            AbsolutePath: res[i].upload_real_url,
            upload_type: '2',
            upload_desc: '归档材料'
          })
        }
        yield put({
          type: 'save',
          payload: {
            tableUploadFile: c,
            FileInfo: c,
          }
        })

      }

    },

    //审批环节调取服务
    * judgeMoment({}, {
      call,
      put,
      select
    }) {

      const {
        passData
      } = yield select(state => state.addFile);
      /* console.log(passData);*/
      const recData = {
        arg_topic_id: passData.topic_id
      };
      const response = yield call(commonAppService.judgeMoment, recData);
      if (response.RetCode === '1') {
        const res = response.DataRows;
        for (let i = 0; i < res.length; i++) {
          res[i].key = i;
        }
        yield put({
          type: 'save',
          payload: {
            judgeTableSource: res
          },
        });
        /* console.log(res);*/
      };

    },


    //modal点击取消时
    * handleModalCancel({}, {
      call,
      put
    }) {
      yield put({
        type: 'save',
        payload: {
          visible: false
        }
      })
    },

    //退审核回服务
    * returnService({}, {
      call,
      put,
      select
    }) {
      const {
        returnReason,
        waitMeetingDetails
      } = yield select(state => state.addFile);
      /* console.log(returnReason);*/
      const recData = {
        arg_return_reason: returnReason, //| VARCHAR(500)|是| 退回原因|
        arg_list_related_id: waitMeetingDetails.topic_id, //| VARCHAR(100)|是| 关联议题id|
        arg_submit_id: waitMeetingDetails.submit_id, //| VARCHAR(32)|是| 提交批次id|
        arg_create_user_id: Cookie.get('userid'), //| VARCHAR(10)|是| 创建人id|
        arg_create_user_name: Cookie.get('username'), //| VARCHAR(10)|是| 创建人姓名|
      }
      const response = yield call(commonAppService.judgeReturn, recData);
      if (response.RetCode === '1') {
        message.info('申请将退回至申请人');


      }
    },

    //上会材料泄密原因说明
    * handleMeetingChange({
      value
    }, {
      put
    }) {
      /* console.log(value);*/
      yield put({
        type: 'save',
        payload: {
          secretReason: value,
        }
      })
    },

    //是否泄密
    * isSecret({
      value
    }, {
      call,
      put
    }) {
      if (value === '1') {
        yield put({
          type: 'save',
          payload: {
            noUpdate: true,
            materialDetailDisplay: 'block',
            tableMaterialDetailDisplay: 'none',
          }
        });

      } else {
        yield put({
          type: 'save',
          payload: {
            noUpdate: true,
            materialDetailDisplay: 'none',
            tableMaterialDetailDisplay: 'block',
            secretReason: '',

          }
        });
      }
      yield put({
        type: 'save',
        payload: {
          meetingRadioValue: value
        }
      });
    },


    //点击提交
    * submissionTopic({}, {
      call,
      select,
      put
    }) {
      const {
        waitMeetingDetails,
        meetingRadioValue,
        secretReason,
        FileInfo
      } = yield select(state => state.addFile);
      /*console.log(meetingRadioValue);*/
      //console.log(FileInfo);
      if (Number(meetingRadioValue) === 0 && FileInfo.length === 0) {
        message.info('请提交相关材料');
      } else if (Number(meetingRadioValue) === 1 && secretReason === "") {
        message.info('请填写相关涉密原因');
      } else {
        const recData = {
          arg_topic_id: waitMeetingDetails.topic_id,
          arg_submit_id: waitMeetingDetails.submit_id,
          arg_upload_info: JSON.stringify(FileInfo), //|TEXT|附件|--附件信息
          arg_user_id: Cookie.get('userid'),
          arg_user_name: Cookie.get('username'),
          arg_topic_if_secret: meetingRadioValue,
          arg_topic_secret_reason: secretReason

        };
        const response = yield call(commonAppService.fileSubmit, recData);
        if (response.RetCode === '1') {
          message.info('提交成功');
          yield put({
            type: 'sendMessage'
          })
          yield put(routerRedux.push({
            pathname: '/adminApp/meetManage/myJudge'
          }));
        }
      }

    },

    //发送通知
    * sendMessage({}, {
      call,
      select,
    }) {
      const {
        topicId
      } = yield select(state => state.addFile);
      const recData = {
        arg_topic_id: topicId
      };
      const response = yield call(meetManageService.sendMessage, recData);
      if (response.RetCode === '1') {
        message.info('已发送审核通知');
      } else {
        message.info('发送审核通知失败');
      }
    },

  },

  subscriptions: {
    setup({
      dispatch,
      history
    }) {
      return history.listen(({
        pathname,
        query
      }) => {
        if (pathname === '/adminApp/meetManage/myJudge/addFile') { //此处监听的是连接的地址
          dispatch({
            type: 'init',
            query
          });
        }
      });
    },
  },
};