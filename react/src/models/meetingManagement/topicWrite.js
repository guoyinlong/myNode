/**
 * 作者：贾茹
 * 日期：2019-5-24
 * 邮箱：m18311475903@163.com
 * 文件说明：议题填报
 */
import * as meetManageService from '../../services/meetingManagement/meetManage.js';
import Cookie from 'js-cookie';
import {
  message
} from "antd";
import {
  routerRedux
} from 'dva/router';

export default {
  namespace: 'topicWrite',
  state: {
    applyR: [],
    list: [],
    name: [],
    id: [],
    loading: false,
    topicName: '', //议题名称
    meetingTypes: [], //会议类型
    meetingTypeId: '', //会议类型id
    deptId: [], //申请单位id
    applyReset: [], //全局搜索选中汇报人姓名
    applyResetID: '', //全局搜索选中汇报人id
    deptPartId: [], //列席部门
    radioValue: '', //是否属于三重一大选择
    resonDisplay: 'none', //是否显示三重一大原因
    resonValue: '', //属于三重一大原因
    noStarDisplay: 'inline-block', //显示是否属前置讨论事项
    StarDisplay: 'none', //显示是否需要党委会前置讨论
    discussRadioValue: '', //是否属于前置讨论项选择
    discussDisplay: 'none', //前置讨论项原因是否显示
    discussValue: '', //属于前置讨论项原因
    textCont: '', //待决议事情内容
    deptRadioValue: '', //是否已征求各部门意见
    meetingRadioValue: '', //上会材料是否泄密选择
    meetingDisplay: 'none', //上会材料泄密说明显示隐藏
    meetingValue: '', //上会材料泄密原因说明
    materialsDisplay: 'block', //上会材料提交
    saveIsSecrate: '', //议题保存上会材料是否泄密保存
    fileList: [], //文件上传
    tableUploadFile: [], //文件上传显示在table里面的数据
    visible: false, //人员列表弹出框控制
    deptVisible: false, //点击弹出申请单位的弹出框选择
    partdeptVisible: false, //点击弹出列席的弹出框选择
    deptInputs: [], //申请单位选择框显示内容
    outInputs: [], //列席部门选择框显示内容
    outDeptId: [], //列席部门选中
    Dept: [], //申请单位显示
    outDept: [], //列席部门显示
    partDept: [],
    writeMinute: '10', //预计汇报时间
    applyPersons: [], //汇报人
    outSearchPerson: '', //人员不在下拉框显示
    outPersonTableSource: [], //人员不在table表格显示
    personValue: [], //人员不在选中保存
    discussModalDisplayvisible: false, //总经理办公会选中 并且需要党委会参与讨论
    meetingTopicName: '', //前置议题名称
    meetingMeetingName: '', //前置会议名称
    outMeetingMeetingName: '', //其他议题名称
    reletiveDiscussDisplay: 'none', //总经理办公会前置相关议题 内容是否显示
    tableMeetingType: [], //总办会选择相关议题
    seceretIsVisible: false, //是否修改议题材料是否涉密
    NOseceretIsVisible: false, //是否修改议题材料是否涉密
    savemeetingRadioValue: '', //暂存是否涉密
    FileInfo: [], //附件信息
    /* FileRelativePath:'',             //附件相对地址
     FileAbsolutePath:'',             //附件绝对地址*/
    topicId: "", //议题id  发送审核通知需
    importantReason: [], //三重一大原因列表
    reasonSelected: [], //选中的三中一大原因及编码
    reasonSelectedName: "",
    srarchImportant: {}, //三重一大参考文件查询
  },

  reducers: {
    save(state, action) {
      return { ...state,
        ...action.payload
      };
    },
  },

  effects: {
    * init({}, {
      call,
      put
    }) {
      yield put({
        type: 'save',
        payload: {
          applyR: [],
          list: [],
          name: [],
          id: [],
          loading: false,
          topicName: '', //议题名称
          meetingTypes: [], //会议类型
          meetingTypeId: '', //会议类型id
          deptId: [], //申请单位id
          applyReset: [], //全局搜索选中汇报人姓名
          applyResetID: '', //全局搜索选中汇报人id
          deptPartId: [], //列席部门
          radioValue: '', //是否属于三重一大选择
          resonDisplay: 'none', //是否显示三重一大原因
          resonValue: '', //属于三重一大原因
          noStarDisplay: 'inline-block', //显示是否属前置讨论事项
          StarDisplay: 'none', //显示是否需要党委会前置讨论
          discussRadioValue: '', //是否属于前置讨论项选择
          discussDisplay: 'none', //前置讨论项原因是否显示
          discussValue: '', //属于前置讨论项原因
          textCont: '', //待决议事情内容
          deptRadioValue: '', //是否已征求各部门意见
          meetingRadioValue: '', //上会材料是否泄密选择
          meetingDisplay: 'none', //上会材料泄密说明显示隐藏
          meetingValue: '', //上会材料泄密原因说明
          materialsDisplay: 'block', //上会材料提交
          saveIsSecrate: '', //议题保存上会材料是否泄密保存
          fileList: [], //文件上传
          tableUploadFile: [], //文件上传显示在table里面的数据
          visible: false, //人员列表弹出框控制
          deptVisible: false, //点击弹出申请单位的弹出框选择
          partdeptVisible: false, //点击弹出列席的弹出框选择
          deptInputs: [], //申请单位选择框显示内容
          outInputs: [], //列席部门选择框显示内容
          outDeptId: [], //列席部门选中
          Dept: [], //申请单位显示
          outDept: [], //列席部门显示
          partDept: [],
          writeMinute: '10', //预计汇报时间
          applyPersons: [], //汇报人
          outSearchPerson: '', //人员不在下拉框显示
          outPersonTableSource: [], //人员不在table表格显示
          personValue: [], //人员不在选中保存
          discussModalDisplayvisible: false, //总经理办公会选中 并且需要党委会参与讨论
          meetingTopicName: '', //前置议题名称
          meetingMeetingName: '', //前置会议名称
          outMeetingMeetingName: '', //其他议题名称
          reletiveDiscussDisplay: 'none', //总经理办公会前置相关议题 内容是否显示
          tableMeetingType: [], //总办会选择相关议题
          FileInfo: [], //附件信息
          isDept: '', //申请单位  院级  分院级
          evidenceFile: [], //佐证材料
          isUrgent: '', //紧急程度
          urgentReason: '', //紧急原因及拟上会时间
          newTopicId: '1',
          meetingTypeName: '', //会议类型的名称
        }
      });
      yield put({
        type: 'getTopicMeetingName',
      });
      yield put({
        type: 'srarchImportant',
      });
    },

    //三重一大参考附件查询
    * srarchImportant({}, {
      call,
      put
    }) {
      const recData = {
        arg_topic_id: Cookie.get('OUID'), //| VARCHAR(32)|是| ouid
        arg_submit_id: '1', //| VARCHAR(32)|  批次id
      };
      /*console.log(recData);*/
      const response = yield call(meetManageService.searchFileUpload, recData);
      if (response.RetCode === '1') {
        if (response.DataRows) {
          const res = response.DataRows;
          for (let i = 0, j = res.length; i < j; i++) {
            console.log(res[i]);
            res[i].key = i;
            yield put({
              type: 'save',
              payload: {
                // 把数据通过save函数存入state
                srarchImportant: res[i],
              },

            });
          }
          //console.log(res);

        }

      };

    },

    //选中的三重一大原因的保存
    * saveSeletedReason({
      record
    }, {
      put
    }) {
      //console.log(JSON.parse(record),typeof JSON.parse(record));
      yield put({
        type: 'save',
        payload: {
          reasonSelected: JSON.parse(record),

        }
      })
    },

    //三重一大原因列表查询
    * importantReason({}, {
      call,
      put,
      select
    }) {
      const {
        isDept,
        meetingTypeId
      } = yield select(state => state.topicWrite);
      console.log(meetingTypeId)
      let recData;
      if (Number(isDept) === 0) {
        recData = {
          arg_ouid: 'e65c02c2179e11e6880d008cfa0427c4',
          arg_type_id: JSON.parse(meetingTypeId).type_id
        };
      } else {
        recData = {
          arg_ouid: Cookie.get('OUID'),
          arg_type_id: JSON.parse(meetingTypeId).type_id
        };
      }
      /*console.log(recData);*/
      const response = yield call(meetManageService.importantReason, recData);
      /* console.log(response);*/
      if (response.RetCode === '1') {
        const res = response.DataRows;
        for (let i = 0, j = res.length; i < j; i++) {
          /* console.log(OUs[i]);*/
          res[i].key = i;
        }
        console.log(res);
        yield put({
          type: 'save',
          payload: {
            // 把数据通过save函数存入state
            importantReason: res,
          },

        });
      };
    },

    //申请单位  院级  分院级
    * isDept({
      record
    }, {
      put,
      select
    }) {
      const {
        meetingTypeName,
        reasonSelected
      } = yield select(state => state.topicWrite);
      yield put({
        type: 'save',
        payload: {
          isDept: record.target.value,
        }
      })
      if (meetingTypeName !== "" || reasonSelected !== []) {
        yield put({
          type: 'save',
          payload: {
            meetingTypeName: "",
            reasonSelected: []
          }
        })
      }

      yield put({
        type: 'meetingTypeSearch',
      });

    },

    //保存  紧急程度  一般  紧急
    * isUrgent({
      record
    }, {
      put
    }) {
      // const { deptId } = yield select (state =>state.topicWrite);
      if (record.target.value === 0) {
        yield put({
          type: 'save',
          payload: {
            urgentReason: '',
          }
        })
      }
      yield put({
        type: 'save',
        payload: {
          isUrgent: record.target.value,
        }
      })
    },

    //保存  紧急原因
    * urgentReason({
      record
    }, {
      put
    }) {
      yield put({
        type: 'save',
        payload: {
          urgentReason: record.target.value,
        }
      })
    },

    //保存申请单位级别
    * saveDept({
      record
    }, {
      put
    }) {
      yield put({
        type: 'save',
        payload: {
          isDept: record.target.value,
        }
      })
    },

    //弹出相关议题modal
    * openModal({}, {
      put
    }) {
      yield put({
        type: 'save',
        payload: {
          discussModalDisplayvisible: true,
        }
      })
    },
    //议题名称
    * handleTopicName({
      value
    }, {
      call,
      select,
      put
    }) {
      yield put({
        type: 'save',
        payload: {
          topicName: value,
        }
      })
    },

    //会议类型下拉框选项查询
    * meetingTypeSearch({}, {
      select,
      call,
      put
    }) {
      const {
        isDept
      } = yield select(state => state.topicWrite);
      let recData;
      if (Number(isDept) === 0) {
        recData = {
          arg_type_ou_id: 'e65c02c2179e11e6880d008cfa0427c4',
        };
      } else {
        recData = {
          arg_type_ou_id: Cookie.get('OUID'),
        };
      }
      /*console.log(recData);*/
      const response = yield call(meetManageService.meetingTypeSearch, recData);
      /* console.log(response);*/
      if (response.RetCode === '1') {
        const res = response.DataRows;
        for (let i = 0, j = res.length; i < j; i++) {
          /* console.log(OUs[i]);*/
          res[i].key = i;
        }
        yield put({
          type: 'save',
          payload: {
            // 把数据通过save函数存入state
            meetingTypes: res,
          },

        });
      };
    },

    //获取会议类型id后保存
    * handleMeetingTypeId({
      value
    }, {
      call,
      select,
      put
    }) {
      /* console.log(JSON.parse(value).type_name=== '总经理办公会');*/
      const {
        discussRadioValue,
      } = yield select(state => state.topicWrite);
      yield put({
        type: 'save',
        payload: {
          meetingTypeName: JSON.parse(value).type_name
        }
      });
      if (JSON.parse(value).type_name === '总经理办公会') {

        yield put({
          type: 'save',
          payload: {
            noStarDisplay: 'none',
            StarDisplay: 'inline-block'
          }
        });
      } else {
        if (discussRadioValue === 1) {
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
        yield put({
          type: 'save',
          payload: {
            noStarDisplay: 'inline-block',
            StarDisplay: 'none',
            reletiveDiscussDisplay: 'none'
          }
        });
      }
      yield put({
        type: 'save',
        payload: {
          /* meetingTypeId:JSON.parse(value).type_id*/
          radioValue: '',
          resonValue: '',
          discussRadioValue: '',
          discussValue: '',
          discussDisplay: 'none',
          meetingTypeId: value
        }
      });
      yield put({
        type: 'importantReason'
      })
    },

    //申请单位选中
    * onDeptChecked({
      value
    }, {
      call,
      select,
      put
    }) {
      const {
        deptInputs,
        deptId
      } = yield select(state => state.topicWrite);
      /* console.log(value);*/
      if (value.target.checked === true) {
        deptInputs.push(value.target.deptName);
        deptId.push(value.target.value);
        yield put({
          type: 'save',
          payload: {
            deptInputs: [...deptInputs],
            deptId: [...deptId]
          }
        });
      } else {
        let dept = deptInputs.filter(i => i !== value.target.deptName);
        let deptid = deptId.filter(i => i !== value.target.value);
        yield put({
          type: 'save',
          payload: {
            deptInputs: [...dept],
            deptId: [...deptid]
          }
        });
      }
    },

    //选中汇报人
    * displayApplyPerson({
      item
    }, {
      put
    }) {
      console.log(item);
      yield put({
        type: 'save',
        payload: {
          // 把数据通过save函数存入state
          applyReset: item,
        },

      });
    },

    //获取汇报人下拉框数据
    * getApplyPerson({}, {
      call,
      select,
      put
    }) {

      const {
        deptId
      } = yield select(state => state.topicWrite);
      const recData = {
        arg_dept_id: deptId.join(),
      };
      const response = yield call(meetManageService.applyPerson, recData);
      if (response.RetCode === '1') {
        const res = response.DataRows;
        for (let i = 0, j = res.length; i < j; i++) {
          res[i].key = i;
        }
        /* console.log(res);*/
        yield put({
          type: 'save',
          payload: {
            // 把数据通过save函数存入state
            applyPersons: res,
          },

        });
      };

    },

    //人员不在下拉框请显示
    * handleOutSearchPerson({
      value
    }, {
      call,
      select,
      put
    }) {
      yield put({
        type: 'save',
        payload: {
          outSearchPerson: value,
        }
      })

    },

    //搜索人员不在下拉框时查询服务
    * searchOutPerson({
      value
    }, {
      call,
      select,
      put
    }) {
      const {
        outSearchPerson
      } = yield select(state => state.topicWrite);
      const recData = {
        arg_parameter: outSearchPerson
      };
      const response = yield call(meetManageService.searchApplyPerson, recData);
      if (response.RetCode === '1') {
        const res = response.DataRows;
        /*console.log(res);*/
        for (let i = 0; i < res.length; i++) {
          res[i].key = res[i].userid;
        }
        yield put({
          type: 'save',
          payload: {
            outPersonTableSource: res
          }
        })

      } else {
        message.info('请确认输入是否正确，未查到相关数据')
      }

    },

    //搜索人员选中
    * outPersonChecked({
      value
    }, {
      put
    }) {
      console.log(value);
      yield put({
        type: 'save',
        payload: {
          personValue: value
        }

      })

    },

    //全局搜索汇报人弹出框点击确定
    * handlePersonOk({}, {
      call,
      select,
      put
    }) {

      const {
        applyReset,
        personValue,
        applyR
      } = yield select(state => state.topicWrite);
      /*console.log(applyReset,applyResetID);*/
      let a = [];
      let b = [];
      for (let i = 0; i < personValue.length; i++) {

        a.push(personValue[i].username);
        b.push(JSON.stringify({
          userid: personValue[i].userid,
          username: personValue[i].username
        }));
      }
      /* console.log(b);*/
      yield put({
        type: 'save',
        payload: {
          // 把数据通过save函数存入state
          applyReset: applyReset.concat(a),
          applyR: applyR.concat(b),
          //applyPersons:JSON.parse(JSON.stringify(applyPersons)),
        },
      });
      yield put({
        type: 'save',
        payload: {
          visible: false,
        }
      })
    },

    //预计填报时间
    * handleMinute({
      value
    }, {
      call,
      select,
      put
    }) {
      const num = /^\d+$/;
      if (value.match(num) || value === "") {
        yield put({
          type: 'save',
          payload: {
            writeMinute: value,
          }
        });
      } else {
        message.info('请填写数字，时间不得超过30分钟')
      }


    },

    //三重一大单选框
    * onRadioChange({
      value
    }, {
      call,
      select,
      put
    }) {
      /*console.log(value);*/
      if (value === 1) {
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
            resonValue: '',
            resonDisplay: 'none',
          }
        });
      }
      yield put({
        type: 'save',
        payload: {
          radioValue: value,
        }
      })
    },

    //三重一大原因
    * handleReasonChange({
      value
    }, {
      call,
      select,
      put
    }) {
      yield put({
        type: 'save',
        payload: {
          resonValue: value,
        }
      })
    },

    //前置讨论事项单选框
    * onDiscussChange({
      value
    }, {
      call,
      select,
      put
    }) {
      const {
        meetingTypeId
      } = yield select(state => state.topicWrite);
      /* console.log(value,meetingTypeId);*/
      if (value === 1 && JSON.parse(meetingTypeId).type_name === '总经理办公会') {
        yield put({
          type: 'save',
          payload: {
            discussModalDisplayvisible: true,
            reletiveDiscussDisplay: 'block',
            discussDisplay: 'none'

          }
        })
      } else if (value === 1 && JSON.parse(meetingTypeId).type_name !== '总经理办公会') {
        yield put({
          type: 'save',
          payload: {
            discussModalDisplayvisible: false,
            reletiveDiscussDisplay: 'none',
            discussDisplay: 'block',
          }
        });
      } else if (value === 0) {
        /*console.log('111');*/
        yield put({
          type: 'save',
          payload: {
            discussValue: '',
            discussDisplay: 'none',
            reletiveDiscussDisplay: 'none'
          }
        });
      }

      yield put({
        type: 'save',
        payload: {
          discussRadioValue: value,
        }
      })
    },

    //属于前置讨论事项原因：
    * handleDiscussChange({
      value
    }, {
      call,
      select,
      put
    }) {
      yield put({
        type: 'save',
        payload: {
          discussValue: value,
        }
      })
    },

    //前置弹框内容保存
    * handleMeetingTopicName({
      value
    }, {
      put
    }) {
      yield put({
        type: 'save',
        payload: {
          meetingTopicName: value,
        }
      })
    },

    //会议名称
    * handleMeetingMeetingName({
      value
    }, {
      put
    }) {
      yield put({
        type: 'save',
        payload: {
          meetingMeetingName: value,
        }
      })
    },

    //其他议题
    * handleOutMeetingMeetingNameName({
      value
    }, {
      put
    }) {
      yield put({
        type: 'save',
        payload: {
          discussValue: value,
          outMeetingMeetingName: value
        }
      })
    },

    //选中table一行数据
    * meetingTypeStudyChecked({
      value
    }, {
      put
    }) {
      let topic = [];
      for (let i = 0; i < value.length; i++) {
        topic.push(value[i].topic_name)
      }
      yield put({
        type: 'save',
        payload: {
          discussValue: topic.join('    '),
        }
      })
    },

    //点击清空清空条件
    * meetingStudyClear({}, {
      put
    }) {
      yield put({
        type: 'save',
        payload: {
          meetingTopicName: '',
          meetingMeetingName: '',

        }
      })
    },

    //点击查询查询相应议题的名称
    * getTopicMeetingName({}, {
      call,
      select,
      put
    }) {
      const {
        meetingTopicName,
        meetingMeetingName
      } = yield select(state => state.topicWrite);
      const recData = {
        arg_topic_name: meetingTopicName, //议题名称
        arg_note_name: meetingMeetingName //会议名称
      }
      const response = yield call(meetManageService.topicStudyList, recData);
      if (response.RetCode === '1') {
        const res = response.DataRows;
        /*console.log(res);*/
        for (let i = 0; i < res.length; i++) {
          res[i].key = i;
        }
        yield put({
          type: 'save',
          payload: {
            tableMeetingType: res
          }
        })
      }
    },

    //点击前置相关议题modal确定
    * okStudyModal({}, {
      put
    }) {
      yield put({
        type: 'save',
        payload: {
          discussModalDisplayvisible: false,
        }
      })
    },

    //点击前置相关议题modal取消
    * cancelStudyModal({}, {
      put
    }) {
      yield put({
        type: 'save',
        payload: {
          discussModalDisplayvisible: false,
        }
      })
    },

    // 待决议事项内容
    * handleWaitChange({
      value
    }, {
      call,
      select,
      put
    }) {
      /* console.log(value);*/
      yield put({
        type: 'save',
        payload: {
          textCont: value,
        }
      })
    },

    //是否已征求各部门意见
    * onDeptChange({
      value
    }, {
      call,
      select,
      put
    }) {
      /*console.log(value);*/
      yield put({
        type: 'save',
        payload: {
          deptRadioValue: value,
        }
      })
    },

    //上会材料是否泄密 修改状态
    * onMeetingChange({
      value
    }, {
      call,
      select,
      put
    }) {
      const {
        meetingValue,
        tableUploadFile
      } = yield select(state => state.topicWrite);
      yield put({
        type: 'save',
        payload: {
          savemeetingRadioValue: value, //暂存是否涉密
        }
      });

      if (value === 1 && tableUploadFile.length !== 0) {
        yield put({
          type: 'save',
          payload: {
            seceretIsVisible: true,
          }
        })
      } else if (value === 1 && tableUploadFile.length === 0) {
        yield put({
          type: 'save',
          payload: {
            seceretIsVisible: false,
            meetingRadioValue: value,
            saveIsSecrate: value,
            meetingDisplay: 'block',
            materialsDisplay: 'none',
          }
        })
      } else if (value === 0 && meetingValue === '') {
        yield put({
          type: 'save',
          payload: {
            meetingRadioValue: value,
            saveIsSecrate: value,
            meetingDisplay: 'none',
            materialsDisplay: 'block',
          }
        })
      } else {
        yield put({
          type: 'save',
          payload: {
            /* meetingDisplay: 'none',
             materialsDisplay:'block',*/
            meetingValue: '',
            NOseceretIsVisible: true,

          }
        });
      }

    },

    //上会材料泄密原因说明
    * handleMeetingChange({
      value
    }, {
      call,
      select,
      put
    }) {
      /* console.log(value);*/

      yield put({
        type: 'save',
        payload: {
          meetingValue: value,
        }
      })
    },

    //人员不在模块点击显示弹出框
    * showPersonModal({}, {
      call,
      select,
      put
    }) {
      yield put({
        type: 'save',
        payload: {
          visible: true,
          outPersonTableSource: [],
        }
      })
    },

    //人员不在模块点击显示弹出框点击取消
    * handlePersonCancel({}, {
      call,
      select,
      put
    }) {
      yield put({
        type: 'save',
        payload: {
          visible: false,
        }
      })
    },

    //申请单位点击确定按钮存入
    * handleDeptOk({
      value
    }, {
      call,
      select,
      put
    }) {
      const {
        deptInputs
      } = yield select(state => state.topicWrite);
      /*   console.log(deptInputs);*/
      const deptFalse = JSON.parse(JSON.stringify(deptInputs));
      /* console.log(deptFalse);*/
      yield put({
        type: 'save',
        payload: {
          Dept: deptFalse,
          deptVisible: false,
        }
      });
      yield put({
        type: 'getApplyPerson',

      })

    },

    //申请单位后面点击icon
    /*  * iconClear({},{put}){
          yield put({
            type:'save',
            payload:{
              Dept: [],
              deptId:[],
              deptInputs:[],
              applyPersons:[],
              applyReset:[],          //全局搜索选中汇报人姓名
              applyResetID:'',
            }
          });
      },*/

    //列席部门后面icon点击
    /*  * iconOutClear({},{put}){
        yield put({
          type:'save',
          payload:{
            deptPartId:[],
            outInputs:[],         //列席部门选择框显示内容
            outDeptId:[],         //列席部门选中
            outDept:[],
          }
        });
      },*/

    //列席部门选中
    * outPartDeptChecked({
      value
    }, {
      call,
      select,
      put
    }) {
      const {
        outInputs,
        outDeptId
      } = yield select(state => state.topicWrite);
      if (value.target.checked === true) {
        outInputs.push(value.target.deptName);
        outDeptId.push(value.target.value);
        yield put({
          type: 'save',
          payload: {
            outInputs: [...outInputs],
            outDeptId: [...outDeptId]
          }
        });
      } else {
        let dept = outInputs.filter(i => i !== value.target.deptName);
        let deptid = outDeptId.filter(i => i !== value.target.value);
        yield put({
          type: 'save',
          payload: {
            outInputs: [...dept],
            outDeptId: [...deptid]
          }
        });
      }

    },

    //列席部门点击确定
    * handlePartDeptOk({
      value
    }, {
      call,
      select,
      put
    }) {
      const {
        outInputs
      } = yield select(state => state.topicWrite);
      if (outInputs.length > 5) {
        message.info('您已选择超过5个列席部门，建议不超过5个');
      }
      /*console.log(outInputs);*/
      const outdeptFalse = JSON.parse(JSON.stringify(outInputs));
      /*console.log(outdeptFalse);*/
      yield put({
        type: 'save',
        payload: {
          outDept: outdeptFalse,
          partdeptVisible: false,
        }
      })
      /*console.log(Dept);*/
    },

    //点击弹出申请单位弹出框
    * handleDeptModal({}, {
      call,
      select,
      put
    }) {
      yield put({
        type: 'save',
        payload: {
          deptVisible: true,
        }
      })
    },

    //点击弹出列席部门弹出框
    * handlePartDeptModal({}, {
      call,
      select,
      put
    }) {
      yield put({
        type: 'save',
        payload: {
          partdeptVisible: true,
        }
      })
    },

    //点击取消按钮取消申请单位弹出框
    * handleDeptCancel({}, {
      call,
      select,
      put
    }) {
      yield put({
        type: 'save',
        payload: {
          deptVisible: false,
        }
      })
    },

    //点击取消按钮取消列席部门弹出框
    * handlePartDeptCancel({}, {
      call,
      select,
      put
    }) {
      yield put({
        type: 'save',
        payload: {
          partdeptVisible: false,
        }
      })
    },

    //议题填报点击保存
    * saveTopic({}, {
      call,
      select,
      put
    }) {
      const {
        evidenceFile,
        reasonSelected,
        isDept,
        isUrgent,
        urgentReason,
        newTopicId,
        tableUploadFile,
        topicName,
        radioValue,
        applyR,
        applyReset,
        deptId,
        meetingTypeId,
        writeMinute,
        outDeptId,
        resonValue,
        saveIsSecrate,
        discussRadioValue,
        discussValue,
        deptRadioValue,
        meetingValue,
        textCont
      } = yield select(state => state.topicWrite);
      let file = evidenceFile.concat(tableUploadFile);
      let a = applyReset.filter(i => !i.includes('userid'));
      //let b = applyR.filter(i=>JSON.parse(i).userid)
      /* console.log(applyReset)
       console.log(applyR)*/
      let b = [];
      for (let i = 0; i < applyR.length; i++) {
        for (let j = 0; j < a.length; j++) {
          if (JSON.parse(applyR[i]).username === a[j]) {
            b.push(applyR[i]);
          }
        }
      }
      let applyUser = applyReset.filter(i => i.includes('userid')).concat(b);
      let ids = applyUser.map(i => JSON.parse(i).userid);
      let names = applyUser.map(i => JSON.parse(i).username);

      /* console.log(names);
       console.log(ids);*/
      let m = ids.filter(function(element, index, self) {
        return self.indexOf(element) === index;
      });
      let n = names.filter(function(element, index, self) {
        return self.indexOf(element) === index;
      });
      /*console.log(m,n);*/
      if (writeMinute > 30) {
        message.info('汇报时间不可大于30分钟')
      } else if (writeMinute === "") {
        message.info('请填写预计汇报时间')
      } else if (saveIsSecrate === 0 && tableUploadFile.length === 0) {
        message.info('请上传上会材料');
      } else if (writeMinute === '' || topicName === '' || radioValue === '' || applyUser === [] || outDeptId === '') {
        message.info('有必填项没填');
      } else {
        if (outDeptId.length > 5) {
          message.info('您已经选择了5个以上列席部门，建议不超过5个');
          const recData = {
            arg_topic_dept_id: deptId.toString(), // 申请部门id，id可以多个用逗号隔开 |
            arg_topic_user_id: m.join(), //| 是 | 议题汇报人id，可以多个，用逗号隔开|
            arg_topic_user_name: n.join(), //是 | 议题汇报人名称，可以多个，用逗号隔开 |
            arg_topic_name: topicName, //是 | 议题名称   |
            arg_topic_type: JSON.parse(meetingTypeId).type_id, //是   | 议题类型id |
            arg_topic_reporting_time: writeMinute, //是 | 议题汇报时长 |
            arg_topic_if_important: radioValue, //是 | 是否是三重一大|
            arg_topic_important_reason: reasonSelected.reason_uuid, // 否 | 三重一大原因 |
            arg_topic_if_study: discussRadioValue, //否 | 是否是前置议题 |
            arg_topic_study_id: discussValue, //否 |总办会:前置研究的议题id，党委会:是前置讨论事项的原因 |
            arg_topic_other_dept_id: outDeptId.toString(), // 是 | 参与议题的部门id  |
            arg_topic_content: textCont, // 是 | 待决议事项  |
            arg_topic_if_secret: saveIsSecrate, //议题是否涉密
            arg_topic_secret_reason: meetingValue, //材料涉密说明
            arg_create_user_id: Cookie.get('userid'), // 是 | 创建人id  |,
            arg_create_user_name: Cookie.get('username'), //是 | 创建人姓名  |
            arg_upload_info: JSON.stringify(file),
            arg_topic_id: newTopicId, // | VARCHAR(32) | 是 | 议题id|
            arg_topic_level: isDept, //|VARCHAR(1) | 是 |议题层级
            arg_topic_urgent: isUrgent, // | VARCHAR(1)|是|议题紧急程度|
            arg_urgent_reason: urgentReason, // |VARCHAR(TEXT)|否|紧急原因|
            arg_topic_check_state: '0', // |VARCHAR(1)|是| 议题状态|


          };
          const response = yield call(meetManageService.saveTopic, recData);
          if (response.RetCode === '1') {
            message.info('保存成功');
            yield put(routerRedux.push({
              pathname: '/adminApp/meetManage/topicApply'
            }));
          }
        } else {
          const recData = {
            arg_topic_dept_id: deptId.toString(), // 申请部门id，id可以多个用逗号隔开 |
            arg_topic_user_id: m.join(), //| 是 | 议题汇报人id，可以多个，用逗号隔开|
            arg_topic_user_name: n.join(), //是 | 议题汇报人名称，可以多个，用逗号隔开 |
            arg_topic_name: topicName, //是 | 议题名称   |
            arg_topic_type: JSON.parse(meetingTypeId).type_id, //是   | 议题类型id |
            arg_topic_reporting_time: writeMinute, //是 | 议题汇报时长 |
            arg_topic_if_important: radioValue, //是 | 是否是三重一大|
            arg_topic_important_reason: reasonSelected.reason_uuid, // 否 | 三重一大原因 |
            arg_topic_if_study: discussRadioValue, //否 | 是否是前置议题 |
            arg_topic_study_id: discussValue, //否 |总办会:前置研究的议题id，党委会:是前置讨论事项的原因 |
            arg_topic_other_dept_id: outDeptId.toString(), // 是 | 参与议题的部门id  |
            arg_topic_content: textCont, // 是 | 待决议事项  |
            arg_topic_if_secret: saveIsSecrate, //议题是否涉密
            arg_topic_secret_reason: meetingValue, //材料涉密说明
            arg_create_user_id: Cookie.get('userid'), // 是 | 创建人id  |,
            arg_create_user_name: Cookie.get('username'), //是 | 创建人姓名  |
            arg_upload_info: JSON.stringify(file),
            arg_topic_id: newTopicId, // | VARCHAR(32) | 是 | 议题id|
            arg_topic_level: isDept, //|VARCHAR(1) | 是 |议题层级
            arg_topic_urgent: isUrgent, // | VARCHAR(1)|是|议题紧急程度|
            arg_urgent_reason: urgentReason, // |VARCHAR(TEXT)|否|紧急原因|
            arg_topic_check_state: '0', // |VARCHAR(1)|是| 议题状态|

          };
          const response = yield call(meetManageService.saveTopic, recData);
          if (response.RetCode === '1') {
            message.info('保存成功');
            yield put({
              type: 'save',
              payload: {
                newTopicId: response.RetVal
              }
            })
          }
        }
      }
    },

    //点击提交
    * submissionTopic({}, {
      call,
      select,
      put
    }) {
      const {
        reasonSelected,
        evidenceFile,
        isDept,
        isUrgent,
        urgentReason,
        newTopicId,
        tableUploadFile,
        topicName,
        radioValue,
        deptId,
        meetingTypeId,
        applyR,
        applyReset,
        writeMinute,
        outDeptId,
        resonValue,
        saveIsSecrate,
        discussRadioValue,
        discussValue,
        deptRadioValue,
        meetingValue,
        textCont
      } = yield select(state => state.topicWrite);
      //console.log(reasonSelected)
      //处理佐证材料和上会材料传递格式
      let file = evidenceFile.concat(tableUploadFile);

      let a = applyReset.filter(i => !i.includes('userid'));
      //let b = applyR.filter(i=>JSON.parse(i).userid)
      /* console.log(applyReset)
       console.log(applyR)*/
      let b = [];
      for (let i = 0; i < applyR.length; i++) {
        for (let j = 0; j < a.length; j++) {
          if (JSON.parse(applyR[i]).username === a[j]) {
            b.push(applyR[i]);
          }
        }
      }

      let applyUser = applyReset.filter(i => i.includes('userid')).concat(b);
      let ids = applyUser.map(i => JSON.parse(i).userid);
      let names = applyUser.map(i => JSON.parse(i).username);

      /* console.log(names);
       console.log(ids);*/
      let m = ids.filter(function(element, index, self) {
        return self.indexOf(element) === index;
      });
      let n = names.filter(function(element, index, self) {
        return self.indexOf(element) === index;
      });
      if (writeMinute > 30) {
        message.info('汇报时间不可大于30分钟')
      } else if (isDept === '' || isUrgent === '' || writeMinute === '' || topicName === '' || deptId === '' || applyReset === '' || outDeptId === '') {
        message.info('有必填项没填');
      } else if (Number(isUrgent) === 1 && urgentReason === '') {
        message.info('请填写紧急原因');
      } else if (Number(radioValue) === 1 && reasonSelected.length === 0) {
        message.info('请选择三重一大原因');
      } else if (Number(radioValue) === 1 && evidenceFile.length === 0) {
        message.info('请上传佐证材料');
      } else {
        if (tableUploadFile.length === 0 && saveIsSecrate === 0) {
          message.info('请上传上会材料');
        } else {
          if (outDeptId.length > 5) {
            message.info('您已经选择了5个以上列席部门，建议不超过5个');
            const recData = {
              arg_topic_dept_id: deptId.toString(), // 申请部门id，id可以多个用逗号隔开 |
              arg_topic_user_id: m.join(), //| 是 | 议题汇报人id，可以多个，用逗号隔开|
              arg_topic_user_name: n.join(), //是 | 议题汇报人名称，可以多个，用逗号隔开 |
              arg_topic_name: topicName, //是 | 议题名称   |
              arg_topic_type: JSON.parse(meetingTypeId).type_id, //是   | 议题类型id |
              arg_topic_reporting_time: writeMinute, //是 | 议题汇报时长 |
              arg_topic_if_important: radioValue, //是 | 是否是三重一大|
              arg_topic_important_reason: reasonSelected.reason_uuid, // 否 | 三重一大原因 |
              arg_topic_if_study: discussRadioValue, //否 | 是否是前置议题 |
              arg_topic_study_id: discussValue, //否 |总办会:前置研究的议题id，党委会:是前置讨论事项的原因 |
              arg_topic_other_dept_id: outDeptId.toString(), // 是 | 参与议题的部门id  |
              arg_topic_content: textCont, // 是 | 待决议事项  |
              arg_topic_if_secret: saveIsSecrate, //议题是否涉密
              arg_topic_secret_reason: meetingValue, //材料涉密说明
              arg_create_user_id: Cookie.get('userid'), // 是 | 创建人id  |,
              arg_create_user_name: Cookie.get('username'), //是 | 创建人姓名  |
              arg_upload_info: JSON.stringify(file),
              arg_topic_id: newTopicId, // | VARCHAR(32) | 是 | 议题id|
              arg_topic_level: isDept, //|VARCHAR(1) | 是 |议题层级
              arg_topic_urgent: isUrgent, // | VARCHAR(1)|是|议题紧急程度|
              arg_urgent_reason: urgentReason, // |VARCHAR(TEXT)|否|紧急原因|
              arg_topic_check_state: '0', // |VARCHAR(1)|是| 议题状态|
              arg_topic_check_state_desc: '议题保存', //| VARCHAR(100)|是| 议题状态描述|

            };
            const response = yield call(meetManageService.submissionTopic, recData);
            if (response.RetCode === '1') {
              message.info('提交成功');
              yield put({
                type: 'sendMessage'
              })
              yield put(routerRedux.push({
                pathname: '/adminApp/meetManage/topicApply'
              }))
            }
          } else {
            const recData = {
              arg_topic_dept_id: deptId.toString(), // 申请部门id，id可以多个用逗号隔开 |
              arg_topic_user_id: m.join(), //| 是 | 议题汇报人id，可以多个，用逗号隔开|
              arg_topic_user_name: n.join(), //是 | 议题汇报人名称，可以多个，用逗号隔开 |
              arg_topic_name: topicName, //是 | 议题名称   |
              arg_topic_type: JSON.parse(meetingTypeId).type_id, //是   | 议题类型id |
              arg_topic_reporting_time: writeMinute, //是 | 议题汇报时长 |
              arg_topic_if_important: radioValue, //是 | 是否是三重一大|
              arg_topic_important_reason: reasonSelected.reason_uuid, // 否 | 三重一大原因 |
              arg_topic_if_study: discussRadioValue, //否 | 是否是前置议题 |
              arg_topic_study_id: discussValue, //否 |总办会:前置研究的议题id，党委会:是前置讨论事项的原因 |
              arg_topic_other_dept_id: outDeptId.toString(), // 是 | 参与议题的部门id  |
              arg_topic_content: textCont, // 是 | 待决议事项  |
              arg_topic_if_secret: saveIsSecrate, //议题是否涉密
              arg_topic_secret_reason: meetingValue, //材料涉密说明
              arg_create_user_id: Cookie.get('userid'), // 是 | 创建人id  |,
              arg_create_user_name: Cookie.get('username'), //是 | 创建人姓名  |
              arg_upload_info: JSON.stringify(file),
              arg_topic_id: newTopicId, // | VARCHAR(32) | 是 | 议题id|
              arg_topic_level: isDept, //|VARCHAR(1) | 是 |议题层级
              arg_topic_urgent: isUrgent, // | VARCHAR(1)|是|议题紧急程度|
              arg_urgent_reason: urgentReason, // |VARCHAR(TEXT)|否|紧急原因|
              arg_topic_check_state: '0', // |VARCHAR(1)|是| 议题状态|
              arg_topic_check_state_desc: '议题保存', //| VARCHAR(100)|是| 议题状态描述|

            };
            const response = yield call(meetManageService.submissionTopic, recData);
            if (response.RetCode === '1') {
              message.info('提交成功');
              let res = response.RetVal;
              /* console.log(res);*/
              yield put({
                type: 'save',
                payload: {
                  topicId: res
                }
              })
              yield put({
                type: 'sendMessage'
              })
              yield put(routerRedux.push({
                pathname: '/adminApp/meetManage/topicApply'
              }))
            }
          }
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
      } = yield select(state => state.topicWrite);
      const recData = {
        arg_topic_id: topicId
      }
      const response = yield call(meetManageService.sendMessage, recData);
      if (response.RetCode === '1') {
        message.info('已发送审核通知');
      } else {
        message.info('发送审核通知失败');
      }
    },

    //点击取消 返回上一级并清空填报内容
    * cancelTopic({}, {
      call,
      select,
      put
    }) {
      yield put(routerRedux.push({
        pathname: '/adminApp/meetManage/topicApply'
      }));
      yield put({
        type: 'save',
        payload: {
          applyR: [],
          list: [],
          name: [],
          id: [],
          loading: false,
          topicName: '', //议题名称
          meetingTypes: [], //会议类型
          meetingTypeId: '', //会议类型id
          deptId: [], //申请单位id
          applyReset: [], //全局搜索选中汇报人姓名
          applyResetID: '', //全局搜索选中汇报人id
          deptPartId: [], //列席部门
          radioValue: '', //是否属于三重一大选择
          resonDisplay: 'none', //是否显示三重一大原因
          resonValue: '', //属于三重一大原因
          noStarDisplay: 'inline-block', //显示是否属前置讨论事项
          StarDisplay: 'none', //显示是否需要党委会前置讨论
          discussRadioValue: '', //是否属于前置讨论项选择
          discussDisplay: 'none', //前置讨论项原因是否显示
          discussValue: '', //属于前置讨论项原因
          textCont: '', //待决议事情内容
          deptRadioValue: '', //是否已征求各部门意见
          meetingRadioValue: '', //上会材料是否泄密选择
          meetingDisplay: 'none', //上会材料泄密说明显示隐藏
          meetingValue: '', //上会材料泄密原因说明
          materialsDisplay: 'block', //上会材料提交
          saveIsSecrate: '', //议题保存上会材料是否泄密保存
          fileList: [], //文件上传
          tableUploadFile: [], //文件上传显示在table里面的数据
          visible: false, //人员列表弹出框控制
          deptVisible: false, //点击弹出申请单位的弹出框选择
          partdeptVisible: false, //点击弹出列席的弹出框选择
          deptInputs: [], //申请单位选择框显示内容
          outInputs: [], //列席部门选择框显示内容
          outDeptId: [], //列席部门选中
          Dept: [], //申请单位显示
          outDept: [], //列席部门显示
          partDept: [],
          writeMinute: '10', //预计汇报时间
          applyPersons: [], //汇报人
          outSearchPerson: '', //人员不在下拉框显示
          outPersonTableSource: [], //人员不在table表格显示
          personValue: [], //人员不在选中保存
          discussModalDisplayvisible: false, //总经理办公会选中 并且需要党委会参与讨论
          meetingTopicName: '', //前置议题名称
          meetingMeetingName: '', //前置会议名称
          outMeetingMeetingName: '', //其他议题名称
          reletiveDiscussDisplay: 'none', //总经理办公会前置相关议题 内容是否显示
        }
      })
    },

    //保存佐证材料名称地址
    * saveEvidenceFile({
      value
    }, {
      call,
      select,
      put
    }) {
      console.log(value);
      const {
        evidenceFile
      } = yield select(state => state.topicWrite);
      evidenceFile.push({
        upload_name: value.filename.RealFileName,
        AbsolutePath: value.filename.AbsolutePath,
        RelativePath: value.filename.RelativePath,
        key: value.filename.AbsolutePath,
        upload_type: '0',
        upload_desc: '佐证材料'
      });
      /* console.log(tableUploadFile);*/
      /*FileInfo.push({arg_upload_name:value.filename.RealFileName,arg_upload_url:value.filename.RelativePath,arg_upload_real_url:value.filename.AbsolutePath});*/
      /*console.log("\""+JSON.stringify(FileInfo)+"\"");*/
      yield put({
        type: 'save',
        payload: {
          //FileInfo:FileInfo,
          evidenceFile: JSON.parse(JSON.stringify(evidenceFile))
        }
      })
    },

    //保存附件名称地址
    * saveUploadFile({
      value
    }, {
      call,
      select,
      put
    }) {
      /* console.log(value);*/
      const {
        tableUploadFile
      } = yield select(state => state.topicWrite);
      tableUploadFile.push({
        upload_name: value.filename.RealFileName,
        AbsolutePath: value.filename.AbsolutePath,
        RelativePath: value.filename.RelativePath,
        key: value.filename.AbsolutePath,
        upload_type: '1',
        upload_desc: '上会材料'
      });
      /* console.log(tableUploadFile);*/
      /*FileInfo.push({arg_upload_name:value.filename.RealFileName,arg_upload_url:value.filename.RelativePath,arg_upload_real_url:value.filename.AbsolutePath});*/
      /*console.log("\""+JSON.stringify(FileInfo)+"\"");*/
      yield put({
        type: 'save',
        payload: {
          //FileInfo:FileInfo,
          tableUploadFile: JSON.parse(JSON.stringify(tableUploadFile))
        }
      })
    },

    //删除佐证材料
    * deleteEvidenceFile({
      record
    }, {
      call,
      select,
      put
    }) {
      const {
        evidenceFile
      } = yield select(state => state.topicWrite);
      for (let i = 0; i < evidenceFile.length; i++) {
        const a = evidenceFile.filter(v => v.AbsolutePath !== record.AbsolutePath);
        yield put({
          type: 'save',
          payload: {
            evidenceFile: JSON.parse(JSON.stringify(a)),
          }
        })
      }
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
      } = yield select(state => state.topicWrite);
      const recData = {
        RelativePath: record.RelativePath, //上传材料路径
      };
      const response = yield call(meetManageService.writedeleteUpload, recData);
      if (response.RetCode === '1') {
        message.info('删除成功');
        /*tableUploadFile.filter(i=>!i.includes(record.RelativePath));
        console.log(tableUploadFile);*/
        let b = [];
        let c = [];
        for (let i = 0; i < tableUploadFile.length; i++) {
          if (tableUploadFile[i] !== record) {
            b.push(tableUploadFile[i]);
            c.push({
              arg_upload_name: tableUploadFile[i].upload_name,
              arg_upload_url: tableUploadFile[i].RelativePath,
              arg_upload_real_url: tableUploadFile[i].AbsolutePath
            })
          }
        }
        /*console.log(FileInfo);*/
        yield put({
          type: 'save',
          payload: {
            tableUploadFile: JSON.parse(JSON.stringify(b)),
            FileInfo: c
          }
        })

      }

    },

    //确认修改上会材料涉密选项
    * seceretIsOk({}, {
      call,
      put,
      select
    }) {
      const {
        savemeetingRadioValue,
        tableUploadFile
      } = yield select(state => state.topicWrite);
      /*console.log(tableUploadFile);*/
      if (tableUploadFile.length) {
        let urlID = [];
        for (let i = 0; i < tableUploadFile.length; i++) {
          urlID.push(tableUploadFile[i].RelativePath);
        }
        const recData = {
          RelativePath: urlID.join(), //上传材料id
        };
        const response = yield call(meetManageService.writedeleteUpload, recData);
        if (response.RetCode === '1') {
          message.info('删除成功');
          yield put({
            type: 'save',
            payload: {
              seceretIsVisible: false,
              meetingRadioValue: savemeetingRadioValue,
              saveIsSecrate: savemeetingRadioValue,
              meetingDisplay: 'block',
              materialsDisplay: 'none',
              tableUploadFile: [],
              FileInfo: []
            }
          });
          yield put({
            type: 'searchUploadFile'
          })
        } else {
          message.info('删除失败');
        }

      } else {
        yield put({
          type: 'save',
          payload: {
            seceretIsVisible: false,
            meetingRadioValue: savemeetingRadioValue,
            saveIsSecrate: savemeetingRadioValue,
            meetingDisplay: 'block',
            materialsDisplay: 'none',
          }
        })
      }


    },

    //点击取消修改议题涉密
    * seceretIsCancel({}, {
      put
    }) {
      yield put({
        type: 'save',
        payload: {
          seceretIsVisible: false,
          NOseceretIsVisible: false,
        }
      })

    },

    //点击否时删除泄密原因说明、
    * deleteSecretReason({}, {
      select,
      put
    }) {
      const {
        savemeetingRadioValue
      } = yield select(state => state.topicWrite);
      yield put({
        type: 'save',
        payload: {
          meetingDisplay: 'none',
          materialsDisplay: 'block',
          meetingValue: '',
          NOseceretIsVisible: false,
          meetingRadioValue: savemeetingRadioValue,
          saveIsSecrate: savemeetingRadioValue,
        }
      });
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
        if (pathname === '/adminApp/meetManage/topicApply/topicWrite') { //此处监听的是连接的地址
          dispatch({
            type: 'init',
            query
          });
        }
      });
    },
  },
};