/**
 * 作者：贾茹
 * 日期：2019-9-17
 * 邮箱：m18311475903@163.com
 * 文件说明：印章使用申请修改
 */

import Cookie from 'js-cookie';
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as sealApplyService from "../../../services/sealManage/sealApply";

export default {
  namespace: 'sealComReset',
  state: {
    deptModal:false, //申请单位弹出框显示
    deptName:"",//页面展示的部门名字
    dept:{},  //申请部门的信息
    useReason:'', //用印事由
    isSecret:3,//用印材料是否涉密
    secretReason:'', //涉密原因
    isReasonDisplay:'none',//涉密原因是否显示
    isFileDisplay:'block',//用印文件是否显示
    tableUploadFile:[],//上传文件保存数组
    fileNumber:'',     //盖章份数
    isRelativeDept:3,//是否需要相关部门会签
    relativeDeptModal:false,//会签部门弹出框
    relativeDeptName:'',//相关会签部门名字
    rDept:[],              //相关会签部门显示
    relativeDeptID:"",//相关会签部门id
    relativeDept:{},  //相关会签部门的信息
    isRelativeDisplay:'',//会签部门显示
    submitObject:'', //文件提交方信息
    submitName:"",//文件提交方显示
    resetFileModal:false, //上传材料后修改是否涉密选项
    resetReasonModal:false, //填写涉密原因后修改涉密选项
    sealList:[],
    isSave:'',
    sealSpacialList:[], //特殊事项列表
    sealSpacial:{}, //选中特殊类型印章类型
    spacialSealDisplay:'none', //特殊事项列表显示否
    searchData:{}, //传需要的数据
    sealNameId:{},
    screateDate:""
  },

  reducers: {
    save(state, action) {
      return { ...state,
        ...action.payload
      };
    },
  },

  effects: {
    * init({query}, {call, put}) {
      console.log(JSON.parse(query.record))
      yield put({
        type:'save',
        payload:{
          passData:JSON.parse(query.record),
          deptModal:false, //申请单位弹出框显示
          deptName:"",//页面展示的部门名字
          dept:{},  //申请部门的信息
          useReason:'', //用印事由
          isSecret:3,//用印材料是否涉密
          secretReason:'', //涉密原因
          isReasonDisplay:'none',//涉密原因是否显示
          isFileDisplay:'block',//用印文件是否显示
          tableUploadFile:[],//上传文件保存数组
          fileNumber:'',     //盖章份数
          isRelativeDept:3,//是否需要相关部门会签
          relativeDeptModal:false,//会签部门弹出框
          relativeDeptName:'',//相关会签部门名字
          rDept:[],              //相关会签部门显示
          relativeDeptID:"",//相关会签部门id
          relativeDept:{},  //相关会签部门的信息
          isRelativeDisplay:'',//会签部门显示
          submitObject:'', //文件提交方信息
          submitName:"",//文件提交方显示
          resetFileModal:false, //上传材料后修改是否涉密选项
          resetReasonModal:false, //填写涉密原因后修改涉密选项
          sealList:[],
          isSave:'',
          sealSpacialList:[], //特殊事项列表
          sealSpacial:{seal_special_uuid:"",seal_special_matters:""}, //选中特殊类型印章类型
          spacialSealDisplay:'none', //特殊事项列表显示否
          searchData:{}, //传需要的数据
          sealNameId:{seal_details_id:'',seal_details_name:''},
        }
      })
      yield put({
        type:'taskInfoSearch'
      })
    },


    //详情数据查询
    * taskInfoSearch({}, {select,call, put}){
      const {passData,dept} = yield select(state=>state.sealComReset);
      console.log(passData)
      let recData={
        arg_submit_id:passData.submit_id,// |	VARCHAR(32)| 是 | 提交批次id
        arg_form_uuid :passData.form_uuid,//| VARCHAR(32)| 是 | 申请单id
        arg_list_state :passData.list_state,//| VARCHAR(2) | 是 | 详情状态描述（0待办，1,2已办，3办结）
        arg_batch_id :passData.batch_id,//| VARCHAR(32) | 是 | 环节id
      };
      const response = yield call(sealApplyService.applyDetail, recData);
      /* console.log(response);*/
      let nameId = {};
      if(response.RetCode === '1'){
        if(response.DataRows){
          const res = response.DataRows;
          for(let i = 0; i <res.length;i++){
              /*console.log(res[i].topic_user_id.split(","));*/
              nameId.seal_details_id = res[i].seal_details_id;
              nameId.seal_details_name = res[i].seal_details_name;

            //设置保存按钮是否置灰
            if(res[i].form_check_state === '0'){
              yield put({
                type:'save',
                payload:{
                  isSave:false
                }
              })
            }else{
              yield put({
                type:'save',
                payload:{
                  isSave:true
                }
              })
            }
            //设置用印文件和涉密原因显示
            if(res[i].form_if_secret === '0'){
              yield put({
                type:'save',
                payload:{
                  isReasonDisplay:'none',//涉密原因是否显示
                  isFileDisplay:'block',//用印文件是否显示*/
                }
              })
            }else{
              yield put({
                type:'save',
                payload:{
                  isReasonDisplay:'block',//涉密原因是否显示
                  isFileDisplay:'none',//用印文件是否显示*/
                }
              })
            }

            //设置会签部门是否显示
            if(res[i].form_if_sign === '0'){
              yield put({
                type:'save',
                payload:{
                  isRelativeDisplay:'none',//会签部门隐藏
                  spacialSealDisplay:'none' //特殊事项隐藏
                }
              })
            }else{
              if(res[i].form_if_approval === "2"){
                yield put({
                  type:'save',
                  payload:{
                    spacialSealDisplay:'inline-block'
                  }
                })
              }else{
                yield put({
                  type:'save',
                  payload:{
                    spacialSealDisplay:'none'
                  }
                })
              }
              yield put({
                type:'save',
                payload:{
                  isRelativeDisplay:'block',//会签部门显示

                }
              })
            }
            res[i].key = i;
            console.log(res[i]);
            dept.deptName = res[i].form_dept_name;
            dept.value = res[i].form_dept_id
            let spacialDept = {};
            spacialDept.seal_special_uuid = res[i].seal_special_uuid,
            spacialDept.seal_special_matters = res[i].seal_special_matters;

              yield put({
                type:'save',
                payload:{
                  searchData:res[i],
                  deptName:res[i].form_dept_name,//页面展示的部门名字
                  sealNameId:nameId,    //默认的印章名称
                  useReason:res[i].form_reason, //用印事由
                  isSecret:Number(res[i].form_if_secret),//用印材料是否涉密
                  secretReason:res[i].form_secret_reason, //涉密原因
                  isRelativeDept:Number(res[i].form_if_sign),//是否需要相关部门会签
                  relativeDeptName:res[i].dept_name.split(','),//相关会签部门名字
                  relativeDeptID:res[i].other_deptid.split(','),
                  rDept:res[i].dept_name.split(','),
                  submitObject:res[i].form_if_approval, //文件提交方信息
                  submitName:res[i].form_if_approval_desc,
                  sealID:res[i].form_uuid,
                  sealSpacial:spacialDept,  //特殊事项
                  screateDate:res[i].screate_date
                }

              })
            }


          }
          /*console.log(res);*/




      }

      yield put({
        type:'sealListSearch'
      })
    },

    //印章类型下拉框查询
    * sealListSearch({},{call,put}){
      let recData={
        arg_seal_ouid:Cookie.get('OUID'),// | varchar(32) | 是 | 印章ouid
        arg_seal_mark:'0',// | char(1) | 是 | 印章唯一标识符（印章：0，领导名章：1，营业执照：2，领导身份证复印件：3，刻章：4）
      }
      const response = yield call(sealApplyService.sealList, recData);
      if(response.RetCode === '1'){
        let res = response.DataRows;
        for(let i = 0 ;i < res.length; i ++ ){
          res[i].key = i;
        }
        yield put({
          type:'save',
          payload:{
            sealList:res
          }
        })
      }
      yield put({
        type:'fileSearch'
      })
      yield put({
        type:'sealSpacialSearch'
      })
    },

    //印章使用特殊事项查询
    * sealSpacialSearch({},{call,put}){
      let recData={
        arg_user_ouid:Cookie.get('OUID'),// | varchar(32) | 是 | 登陆人呢ouid
        arg_state:'1',// | char(1) | 是 | 传1的话查询启用状态否则查询出所有）
      }
      const response = yield call(sealApplyService.personSpacialList, recData);
      if(response.RetCode === '1'){
        let res = response.DataRows;
        for(let i = 0 ;i < res.length; i ++ ){
          res[i].key = i;
        }
        yield put({
          type:'save',
          payload:{
            sealSpacialList:res
          }
        })
      }
    },

    //保存选中印章的类型id
    * getSealTypeId({record},{put}){
      /* console.log(record.target.value)*/
      yield put({
        type:'save',
        payload:{
          sealNameId:JSON.parse(record),
        }
      })
    },

    //获取盖章份数
    * saveNum({e,index},{select,put}){
      //text = e.target.value;
      let { tableUploadFile } = yield select(state => state.sealComReset);
      if(isNaN(e.target.value) === true ||e.target.value>99){
        message.info('请填写两位以内的数字')
      }else {
        tableUploadFile[index].upload_number = e.target.value;
        yield put({
          type: 'save',
          payload: {
            tableUploadFile
          }
        })
      }
    },

    * getSpacialID({record},{select,put}){
      //console.log(record,JSON.parse(record));
      const { relativeDeptID } = yield select(state => state.sealComReset);
      let message = '请选择会签部门'+       JSON.parse(record).seal_auditor_deptname;
      if(JSON.parse(record).seal_special_matters !== "其他"){
        if(relativeDeptID.indexOf(JSON.parse(record).seal_auditor_deptid) === -1){
          message.info(message);
        }
        else{
          yield put({
            type:'save',
            payload:{
              spacialName:JSON.parse(record).seal_special_matters,
              sealSpacial:JSON.parse(record)
            }
          })
        }
      }else{
        yield put({
          type:'save',
          payload:{
            spacialName:JSON.parse(record).seal_special_matters,
            sealSpacial:JSON.parse(record)
          }
        })
      }


    },

    //附件查询
    * fileSearch({}, {select,call, put}){
      const {passData,tableUploadFile} = yield select(state=>state.sealComReset);
      let recData={
        arg_form_uuid :passData.form_uuid,//| VARCHAR(32)| 是 | 申请单id
        arg_submit_id:passData.submit_id,
      };
      const response = yield call(sealApplyService.fileSearch, recData);
      if(response.RetCode === '1') {
        if(response.DataRows){
          const res = response.DataRows;
          for(let i = 0; i <res.length;i++){
            res[i].key = i;
            tableUploadFile.push({upload_name:res[i].upload_name,AbsolutePath:res[i].upload_url,RelativePath:res[i].upload_real_url,key:res[i].upload_url,upload_number:res[i].upload_number});

          }
          //console.log(tableUploadFile);
          yield put({
            type:'save',
            payload:{
              tableUploadFile:JSON.parse(JSON.stringify(tableUploadFile))
            }
          })

        }
      }
    },

 /*   //查询附件删除
    * deleteUpload({record}, {call, select, put}) {
      /!*console.log(record);*!/
      const {tableUploadFile} = yield select(state => state.sealComReset);
      const recData = {
        arg_upload_id: record.upload_id,//上传材料id
      };
      const response = yield call(sealApplyService.deleteUpload, recData);
      if (response.RetVal === '1') {
        message.info('删除成功');
        let a = tableUploadFile.filter(i=>i.upload_name !== record.upload_name );
        yield put({
          type:'save',
          payload:{
            ///FileInfo:FileInfo,
            tableUploadFile:JSON.parse(JSON.stringify(a))
          }
        })
      }
      /!*  yield put({
          type: 'searchUploadFile'
        })*!/

    },*/

    //表格点击上传附件删除
    * localDeleteUpload({record},{call, select, put}){
      console.log(record);
      const {tableUploadFile} = yield select(state => state.sealComReset);

      let a = tableUploadFile.filter(i=>i.RelativePath !== record.RelativePath );
      /* console.log(tableUploadFile)
     console.log(record);*/
      yield put({
        type:'save',
        payload:{
          tableUploadFile:JSON.parse(JSON.stringify(a)),
          //FileInfo:c
        }
      })
    },

    //申请单位弹出框打开
    * handleDeptModal({},{put}){

      yield put({
        type:'save',
        payload:{
          deptModal:true
        }
      })
    },

    //部门弹出框点击取消
    * handleDeptCancel ({},{put}){
      yield put({
        type:'save',
        payload:{
          deptModal:false
        }
      })
    },
    //申请单位选中
    * onDeptChecked({value},{put}){
      console.log(value);
      yield put({
        type:'save',
        payload:{
          dept:value,
        }

        //deptName:value.deptName
      })
    },

    //申请单位点击确定按钮存入
    * handleDeptOk({},{select,put}){

      const { dept } = yield select(state => state.sealComReset);
      /*console.log(dept);*/
      yield put({
        type:'save',
        payload:{
          deptName:dept.deptName,
          deptModal:false
        }
      });

    },

    //用印事由
    * useReason({record},{put}){
      /*console.log(record.target.value);*/
      yield put({
        type:'save',
        payload:{
          useReason:record.target.value
        }
      });
    },

    //用印材料是否涉密
    * isFileSecret({record},{select,put}){
      /*console.log(record.target.value);*/
      const {tableUploadFile,secretReason}=yield select (state=>state.sealComReset);
      yield put({
        type: 'save',
        payload: {
          savemeetingRadioValue: record.target.value,  //暂存是否涉密
        }
      });
      //如果选择否 判断填写了涉密原因
      if(record.target.value===0){
        if(secretReason!==''){
          yield put({
            type:'save',
            payload:{
              resetReasonModal:true, //填写涉密原因后修改涉密选项
            }
          })
        }else{
          yield put({
            type:'save',
            payload:{
              isSecret:record.target.value,
              isFileDisplay:'block', //不涉密用印文件显示
              isReasonDisplay:'none',//涉密原因是否显示
            }
          })
        }
      }else if(record.target.value===1){
        //如果选择是 判断是否上传了文件
        if(tableUploadFile.length!==0){
          yield put({
            type:'save',
            payload:{
              resetFileModal:true, //上传材料后修改是否涉密选项
              /*resetReasonModal:true, //填写涉密原因后修改涉密选项*/
            }
          })
        }else{
          yield put({
            type:'save',
            payload:{
              isSecret:record.target.value,
              isFileDisplay:'none', //不涉密用印文件显示
              isReasonDisplay:'block',//涉密原因是否显示
            }
          })
        }

      }

    },

    //获取涉密原因
    * getSecretReason({record},{put}){
      /*console.log(record.target.value);*/
      yield put({
        type:'save',
        payload:{
          secretReason:record.target.value
        }
      })
    },

    //点击modal取消
    * seceretIsCancel({}, {put}) {
      yield put({
        type: 'save',
        payload: {
          resetFileModal:false,
          resetReasonModal:false,
        }
      })

    },

    //点击确定清空上传的文件和盖章份数
    * clearSecretFile({},{select,put}){
      const { savemeetingRadioValue }=yield select (state=>state.sealComReset);
      yield put({
        type:'save',
        payload:{
          tableUploadFile:[],
          fileNumber:'',     //盖章份数
          resetFileModal:false,
          isSecret:savemeetingRadioValue,
          isFileDisplay:'none', //不涉密用印文件显示
          isReasonDisplay:'block',//涉密原因是否显示
        }
      })
    },

    //点击确定删除涉密原因
    * deleteSecretReason({},{select,put}){
      const { savemeetingRadioValue }=yield select (state=>state.sealComReset);
      yield put({
        type:'save',
        payload:{
          secretReason:'', //涉密原因
          resetReasonModal:false,
          isSecret:savemeetingRadioValue,
          isFileDisplay:'block', //不涉密用印文件显示
          isReasonDisplay:'none',//涉密原因是否显示
        }
      })
    },

    //保存附件名称地址
    * saveUploadFile({value},{select,put}){
      /* console.log(value);*/
      const {tableUploadFile} = yield select(state => state.sealComReset);
      tableUploadFile.push({upload_name:value.filename.RealFileName,AbsolutePath:value.filename.AbsolutePath,RelativePath:value.filename.RelativePath,key:value.filename.AbsolutePath,upload_number:''});
      /* console.log(tableUploadFile);*/
      /*FileInfo.push({arg_upload_name:value.filename.RealFileName,arg_upload_url:value.filename.RelativePath,arg_upload_real_url:value.filename.AbsolutePath});*/
      /*console.log("\""+JSON.stringify(FileInfo)+"\"");*/
      for(let i =0;i<tableUploadFile.length;i++){
        tableUploadFile[i].key = i;
      }
      yield put({
        type:'save',
        payload:{
          //FileInfo:FileInfo,
          tableUploadFile:JSON.parse(JSON.stringify(tableUploadFile))
        }
      })
    },

    //是否需要相关部门会签
    * isRelativeDept({record},{select,put}){
      /*console.log(record);*/
      const { submitObject } = yield select(state => state.sealComReset);
      if(record.target.value === 0){
        yield put({
          type:'save',
          payload:{
            isRelativeDisplay:'none',
            relativeDeptName:[],//相关会签部门名字relativeDeptID
            relativeDeptID:[],
            rDept:[], //相关会签部门显示
            sealSpacialType:{seal_special_uuid:"",seal_special_matters:""}, //特殊事项清空
            spacialName:"",
            spacialSealDisplay:'none', //隐藏特殊事项

          }
        })
      }else{
        if(submitObject === '2'){
          yield put({
            type:'save',
            payload:{
              spacialSealDisplay:'inline-block'
            }
          })
        }else{
          yield put({
            type:'save',
            payload:{
              spacialSealDisplay:'none'
            }
          })
        }
        yield put({
          type:'save',
          payload:{
            isRelativeDisplay:'block'
          }
        })
      }
      yield put({
        type:'save',
        payload:{
          isRelativeDept:record.target.value
        }
      })
    },

    //相关会签部门弹出框打开
    * handleRelativeDeptModal({},{put}){
      yield put({
        type:'save',
        payload:{
          relativeDeptModal:true
        }
      })
    },

    //相关会签部门弹出框点击取消
    * handleRelativeDeptCancel ({},{put}){
      yield put({
        type:'save',
        payload:{
          relativeDeptModal:false
        }
      })
    },
    //申请单位选中onRelativeDeptChecked
    //会签部门单位选中
    * onRelativeDeptChecked({value},{call,select,put}){
      const { relativeDeptName,relativeDeptID, } = yield select(state => state.sealComReset);
      /* console.log(value);*/
      if(value.target.checked===true){
        relativeDeptName.push(value.target.deptName);
        relativeDeptID.push(value.target.value);
        yield put({
          type:'save',
          payload:{
            relativeDeptName: [...relativeDeptName],
            relativeDeptID:[...relativeDeptID]
          }
        });
      }else{
        let dept = relativeDeptName.filter(i=>i!==value.target.deptName);
        let deptid = relativeDeptID.filter(i=>i !== value.target.value);
        yield put({
          type:'save',
          payload:{
            relativeDeptName: [...dept],
            relativeDeptID:[...deptid]
          }
        });
      }
    },

    * handleRelativeDeptOk({},{select,put}){

      const { relativeDeptName } = yield select(state => state.sealComReset);
      const deptFalse=JSON.parse(JSON.stringify(relativeDeptName));
      /* console.log(deptFalse);*/
      yield put({
        type:'save',
        payload:{
          rDept: deptFalse,
          relativeDeptModal:false
        }
      });

    },

    //保存文件提交方
    * submitObject({record},{select,put}){
      /* console.log(record);*/
      const { isRelativeDept } = yield select(state => state.sealComReset);
      if(record === '0'){
        yield put({
          type:'save',
          payload:{
            submitName:'软研院内部',
            sealSpacial:{},
          }
        });
      }else if(record === '1'){
        yield put({
          type:'save',
          payload:{
            submitName:'软研院外部',
            sealSpacial:{},
          }
        });
      }else if(record === '2'){
        //判断特殊事项显示与否
        if(isRelativeDept === 1){
          yield put({
            type:'save',
            payload:{
              spacialSealDisplay:'inline-block'
            }
          });
        }else{
          yield put({
            type:'save',
            payload:{
              spacialSealDisplay:'none'
            }
          });
        }
        yield put({
          type:'save',
          payload:{
            submitName:'软研院外简化流程',
          }
        });
      }
      yield put({
        type:'save',
        payload:{
          submitObject:record,

        }
      });
    },

    //点击保存
    * sealSave({},{select,call,put}){
      const { sealNameId,dept,useReason,sealID,isSecret, secretReason, isRelativeDept, relativeDeptID, submitObject, tableUploadFile, sealSpacial} = yield select(state=>state.sealComReset);
      let recData={
        arg_form_title:'印章使用申请填报',//  varchar(32)  是  申请单标题
        arg_form_uuid:sealID,//        char(32)      否        申请单id，首次保存时可不传，修改时必传
        arg_form_type:'0' ,//       varchar(2)    是        申请单类型 0:使用 1:外借 2:刻章
        arg_seal_details_id :sealNameId.seal_details_id,//varchar(32) | 是 | 用印详情id
        arg_form_dept_id :dept.value,//     char(32)      是        申请部门id
        arg_form_reason :useReason,//      varchar(200)  是         | 是 | 用印事由
        arg_form_if_secret: isSecret,// char(1) | 是 | 是否涉密（0:否1:是）
        arg_form_secret_reason:secretReason, //| varchar(200) | 是 | 涉密原因
        arg_form_if_approval:submitObject,// 是 |申请单范围（0:内部1:外部2:外部无需分管院审核）
        arg_form_if_sign :isRelativeDept,//     char(1)       否        是否需要相关部门会签（0：否，1：是）（刻章类必传）
        arg_sign_deptid :relativeDeptID.toString(),//    varchar(500)  否        会签部门id（刻章类必传）
        arg_create_user_id :Cookie.get('userid'),//   char(7)       是        用户id
        arg_create_user_name:Cookie.get('username'),//  varchar(10)   是        用户姓名
        arg_upload_info:JSON.stringify(tableUploadFile), //[{"upload_name":"111","upload_number":"22","RelativePath":"333","Absolut	ePath":"1244456"},	{"upload_name":"1112","upload_number":"22","RelativePath":"3334", "AbsolutePath":"12444567"}]|
        arg_seal_special_uuid:sealSpacial.seal_special_uuid,// |varchar(32) | 否|特殊事项uuid|
        arg_seal_special_matters:sealSpacial.seal_special_matters,// |varchar(32) | 否|特殊事项名称|
      };
      const response = yield call(sealApplyService.sealComSave, recData);
      if(response.RetCode === '1'){
        message.info('保存成功');
        yield put({
          type:'save',
          payload:{
            sealID:response.return_data
          }
        })
        /*yield put(routerRedux.push({
          pathname: '/adminApp/sealManage/sealIndexApply'
        }))*/
      }
    },

    //判断文件中是否存在相同名字
    * sealSubmit({record},{select,call,put}){
      const { tableUploadFile} = yield select(state=>state.sealComReset);
      //console.log(searchData);
      if(tableUploadFile.length === 0){
        if(record === "提交"){
          yield put({
            type: 'submit',
          })
        }else if(record === "保存"){
          yield put({
            type: 'sealSave',
          })
        }
      }
      else{
        let names = [];
        for(let i = 0;i<tableUploadFile.length;i++){
          names.push(tableUploadFile[i].upload_name)
        }
        //console.log(names);
        let s = names.join(",")+",";
        let boolean = false;
        let m = 0;
        for(let j=0;j<names.length;j++) {
          if (s.replace(names[j] + ",", "").indexOf(names[j] + ",") > -1) {
            message.info("存在相同的文件" + names[j] + ',请重新上传');
            m++;
            break
          }else{
            if(m = names.length){
              boolean = true;
            }
          }
        }
        if(boolean === true){
          if(record === "提交"){
            yield put({
              type: 'submit',
            })
          }else if(record === "保存"){
            yield put({
              type: 'sealSave',
            })
          }
        }
      }

    },

    //点击提交
    * submit({},{select,call,put}){
      const { searchData,useReason, dept,sealID, sealNameId,  isSecret, secretReason, isRelativeDept, relativeDeptID, submitObject, tableUploadFile, sealSpacial} = yield select(state=>state.sealComReset);
      let numbers = [];
      for(let i = 0;i<tableUploadFile.length;i++){
        if(tableUploadFile[i].upload_number!==""){
          numbers.push(tableUploadFile[i].upload_number);
        }
      }
      //console.log(numbers);
      const length = numbers.length;
      if( dept==={} || useReason === "" || sealNameId === {} || isSecret === 3 || isRelativeDept ===3 || submitObject==="" ){
        message.info('有必填项没填')
      }else if(isSecret === 1 && secretReason === ""){
        message.info('有必填项没填')
      }else if(isSecret === 0 && tableUploadFile.length === 0){
        message.info('有必填项没填')
      }else if(tableUploadFile.length !== 0 && tableUploadFile.length !== length){
        message.info('有必填项没填')
      }
      else {
        let recData = {
          arg_form_title: '印章使用申请填报',//  varchar(32)  是  申请单标题
          arg_form_uuid: sealID,//        char(32)      否        申请单id，首次保存时可不传，修改时必传
          arg_form_type: '0',//       varchar(2)    是        申请单类型 0:使用 1:外借 2:刻章
          arg_seal_details_id: sealNameId.seal_details_id,//varchar(32) | 是 | 用印详情id
          arg_form_dept_id: dept.value,//     char(32)      是        申请部门id
          arg_form_reason: useReason,//      varchar(200)  是         | 是 | 用印事由
          arg_form_if_secret: isSecret,// char(1) | 是 | 是否涉密（0:否1:是）
          arg_form_secret_reason: secretReason, //| varchar(200) | 是 | 涉密原因
          arg_form_if_approval: submitObject,// 是 |申请单范围（0:内部1:外部2:外部无需分管院审核）
          arg_form_if_sign: isRelativeDept,//     char(1)       否        是否需要相关部门会签（0：否，1：是）（刻章类必传）
          arg_sign_deptid: relativeDeptID.toString(),//    varchar(500)  否        会签部门id（刻章类必传）
          arg_create_user_id: Cookie.get('userid'),//   char(7)       是        用户id
          arg_create_user_name: Cookie.get('username'),//  varchar(10)   是        用户姓名
          arg_upload_info: JSON.stringify(tableUploadFile), //[{"upload_name":"111","upload_number":"22","RelativePath":"333","Absolut	ePath":"1244456"},	{"upload_name":"1112","upload_number":"22","RelativePath":"3334", "AbsolutePath":"12444567"}]|
          arg_seal_special_uuid: sealSpacial.seal_special_uuid,// |varchar(32) | 否|特殊事项uuid|
          arg_seal_special_matters: sealSpacial.seal_special_matters,// |varchar(32) | 否|特殊事项名称|
          arg_form_check_state: searchData.form_check_state,// | char（1）| 是 | 申请单状态
          arg_form_check_state_desc: searchData.form_check_state_desc,//| varchar(100) | 是|申请单状态描述
        };
        const response = yield call(sealApplyService.sealComSubmit, recData);
        if (response.RetCode === '1') {
          message.info('提交成功');
          yield put({
            type: 'save',
            payload: {
              sealID: response.return_data,
            }
          })
          yield put({
            type:'sendMessages'
          })
        }
      }
    },

    //发送钉钉消息
    * sendMessages({},{put,call,select}){
      const { sealID } = yield select(state=>state.sealComReset);
      let recData={
        arg_form_uuid:sealID,//        char(32)      否        申请单id，首次保存时可不传，修改时必传
      };
      const response = yield call(sealApplyService.sendMessages, recData);
      if(response.RetCode === '1') {
        message.info('消息发送成功');
        window.history.go(-1);
      }
    },

    //点击取消
    * sealCancel({},{}){
      window.history.go(-1);
    },
  },

  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/sealManage/sealPersonalQuery/sealComReset') { //此处监听的是连接的地址
          dispatch({
            type: 'init',
            query
          });
        }
      });
    },
  },
};
