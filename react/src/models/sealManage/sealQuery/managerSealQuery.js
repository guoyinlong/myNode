/**
 * 作者：窦阳春
 * 日期：2019-9-20
 * 邮箱：douyc@itnova.com.cn
 * 功能：管理员用印查询
 */
import Cookie from 'js-cookie';
import { message } from "antd";
import * as Services from '../../../services/sealManage/sealQuery';

// 判断nameId是不是空数组，是空数组返回true 否返回false
function isEmpty(nameId) {
  return (Array.isArray(nameId) && nameId.length === 0)
    || (Object.prototype.isPrototypeOf(nameId) && Object.keys(nameId).length === 0);
}
// 为表格添加key值
function addTabKey(tabData){
  tabData.map((v, i) => {
    v.key = i + 1
  })
}
// function getCurrentTime() {
//   let d = new Date()
//   let year = d.getFullYear();
//   let mon = d.getMonth() + 1;
//   let date = d.getDate();
//   mon = mon < 10 ? '0' + mon : mon 
//   date = date < 10 ? '0' + date : date 
//   let currentTime = year + '-' + mon + '-' + date 
//   return currentTime
// }
// const currentTime = getCurrentTime()
// 多选框处理
function mutiply(value) {
  let IdArr = [];
  value.map((v, i) => {
    let id = v.split("#")[0];
    IdArr.push(id)
  })
  function unique(arr) {
    return Array.from(new Set(arr))
  }
  let IdUnique = unique(IdArr) // id去重
  IdUnique = IdUnique.length>0 ? IdUnique : ['0']
  return IdUnique
}

export default {
  namespace: 'managerSealQuery',
  loading: false,
  state: {
    startTime: '',
    endTime: '',
    startTime2: '', //审核中开始时间
    endTime2: '', // 审核中结束时间
    types: '全部',// 类型默认值 使用类 外借类 刻制类
    types2: '全部',
    typesId: '0', //类型对应id
    typesId2: '0', //审核中 类型对应id
    typesList: [], //类型列表
    state: '全部', // 状态框默认值
    state2: '全部', // 审核中 状态框默认值
    stateId: '0', // 状态框默认对应id值
    stateId2: '0', // 审核中 状态框默认对应id值
    stateList: [], // 状态列表
    stateList2: [], // 审核中 状态列表
    queryType: ['全部'], //
    queryType2: ['全部'], // 审核印章证照类别默认值中 印章证照类别默认值
    typeId: ['0'], // 印章类型默认id
    typeId2: ['0'], // 审核中 印章类型默认id
    typeList: [],
    typeList2: [],
    queryName: ['全部'], //印章证照名称默认值
    nameId: ['0'], // 印章名称默认id
    queryName2: ['全部'], // 审核中 印章证照名称默认值
    nameId2: ['0'], // 审核中 印章名称默认id
    nameList: [],
    nameAllList: [], // 全部二级印章名称保存
    nameAllList2: [],
    nameList2: [], // 审核中
    applyPerson: '', // 申请人
    applyPerson2: '', // 审核中 申请人
    pageCurrent: 1 , //当前页码
    pageSize: 10,
    totalData: 0,
    pageCurrent2: 1,
    totalData2: 0,
    processTab: [], // 流程中列表
    checkingTab: [], // 核定中列表
    tabKey: '1',
    confirmeFlag: "1",
    receiveRecord: {},
    finishRecord: {},
    receiverRows: {}, // 领取人record
    returnRecord: {},
    receiverIpt: '',// 领取人输入框内容
    confirmeIpt: '', // 确认领取领取框内容
    receiverQueryData: [], // 领取人查询数据
    remarks: '', // 备注
    tableUploadFile:[],//上传文件保存数组
    uploadInfoArr: [], // 上传图片的相关参数
    isConfirmeVisible: false
  },

  reducers: { // 刷新数据
    save(state, action) {
      return { ...state,
        ...action.payload
      };
    },
  },

  effects: {
    *saveSecondData({}, {call, put, select}) {
      const postNameData = {
        ouid: Cookie.get("OUID"),
        seal_uuid: '0' //章照一级分类id，默认0
      }
      let nameList = yield call(Services.sealSecondCategoryQuery, postNameData);
      // 请求印章名称数据列表
      if(nameList.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            nameList: JSON.parse(JSON.stringify(nameList.DataRows)),
            nameAllList: nameList.DataRows,
          }
        })
      }
    },
    // 初始化 查询
    *init({}, {call, put, select}) {
      const typesList = [
        {
          "id": "0",
          "typesName": "全部"
        },
        {
          "id": "1",
          "typesName": "使用类"
        },
        {
          "id": "2",
          "typesName": "外借类"
        },
        {
          "id": "3",
          "typesName": "刻制类"
        }
      ]
      // 定义状态列表
      const stateList = [
        {
          "id": "0",
          "stateName": "全部"
        },
        {
          "id": "1",
          "stateName": "待部门负责人审核"
        },
        {
          "id": "2",
          "stateName": "待会签部门审核"
        },
        {
          "id": "3",
          "stateName": "待办公室审核"
        },
        {
          "id": "4",
          "stateName": "待院领导审核"
        },
        {
          "id": "5",
          "stateName": "待管理员审核"
        }
      ]
      // 定义状态列表 审核中
      const stateList2 = [
        {
          "id": "0",
          "stateName": "全部"
        },
        {
          "id": "1",
          "stateName": "审核通过"
        },
        {
          "id": "2",
          "stateName": "待领取"
        },
        {
          "id": "3",
          "stateName": "待使用"
        },
        {
          "id": "4",
          "stateName": "已领取"
        },
        {
          "id": "5",
          "stateName": "已使用"
        },
        {
          "id": "6",
          "stateName": "已归还"
        }
      ]
      yield put({type: 'saveSecondData'})
      // 请求印章类别数据列表
      const postData1 = {
        ouid: Cookie.get("OUID"),
      }
      const typeData = yield call(Services.sealFirstCategoryQuery, postData1);
      if(typeData.RetCode == '1') {
        yield put({
          type: 'save',
          payload: {
            tabKey: '1',
            typesList: JSON.parse(JSON.stringify(typesList)),
            stateList: JSON.parse(JSON.stringify(stateList)),
            stateList2: JSON.parse(JSON.stringify(stateList2)),
            typeList: JSON.parse(JSON.stringify(typeData.DataRows)),
          }
        })
        yield put({type: "firstPage"}) // 流程中查询服务
      }
    },
    *savePage({page}, {put, select}) { 
      const {tabKey} = yield select(state => state.managerSealQuery)
      if(tabKey == '1') {
        yield put({type: 'save', payload: {pageCurrent: page}})
        yield put({type: "firstPage"}) 
      } else if(tabKey == '2') {
        yield put({type: 'save', payload: {pageCurrent2: page}})
        yield put({type: "secondPage"}) 
      }
    },
    // 流程中表格数据查询
    *firstPage({clickQueryPageCurrent}, {call, put, select}) {
      yield put({type: 'save', payload: {tabKey: "1"}})
      const {startTime, types, endTime, typesId, typeId, nameId, applyPerson,
        stateId, pageSize, pageCurrent} = yield select(state => state.managerSealQuery)
      let typesIdData,timePeriod, sealDetailId;
      if(types == "全部") {
        typesIdData = "0"
      }else {
        typesIdData = typesId
      }
      if(startTime == '') {
        timePeriod = '0'
      }else {
        timePeriod = `${startTime},${endTime}`
      }
      if(isEmpty(nameId) == true){
        sealDetailId = '0'
      }else {
        sealDetailId = nameId.join()
      }
      let page_current = 1
      page_current = clickQueryPageCurrent ? clickQueryPageCurrent : pageCurrent
      let tabPost = {
        arg_time_period: timePeriod,
        arg_form_type: typesIdData,
        arg_seal_uuid: typeId.join(),
        arg_seal_details_id: sealDetailId,
        arg_create_user_id: applyPerson,
        arg_state: stateId,
        arg_user_id: Cookie.get("userid"),
        arg_page_size: pageSize,
        arg_page_current: page_current,
        arg_page_state: 0,
      }
      let data = yield call(Services.sealChecking, tabPost)
      addTabKey(data.DataRows) //为表格添加key值
      data.DataRows.map((v) => {
        v.list_state = '0'
        v.searchType = '1'
      })
      if (data.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            processTab: JSON.parse(JSON.stringify(data.DataRows)),
            totalData: parseInt(data.RowCount),
            pageCurrent: page_current
          }
        })
      }
    },
    // 已核定
    *secondPage({clickQueryPageCurrent }, {call, put, select}) {
      const {startTime2,types2, nameId2, endTime2, typeId2, typesId2, applyPerson2, pageCurrent2, 
        stateId2, pageSize} = yield select(state => state.managerSealQuery)
        const postNameData = {
          ouid: Cookie.get("OUID"),
          seal_uuid: '0', //章照一级分类id，默认0
          userid: Cookie.get("userid")
        }
        let nameList = yield call(Services.sealSecondCategoryQuery, postNameData);
        // 请求印章名称数据列表
        if(nameList.RetCode === '1') {
          yield put({
            type: 'save',
            payload: {
              nameList2: JSON.parse(JSON.stringify(nameList.DataRows)),
              nameAllList: nameList.DataRows,
            }
          })
        }
      // 请求印章类别数据列表
      const postData1 = {
        ouid: Cookie.get("OUID"),
        userid: Cookie.get("userid")
      }
      const typeData = yield call(Services.sealFirstCategoryQuery, postData1);
      if(typeData.RetCode === '1'){
        yield put({type: 'save', payload: {typeList2: JSON.parse(JSON.stringify(typeData.DataRows)),}})
      }
      let typesIdData,timePeriod, sealDetailId;
      if(types2 == "全部") {
        typesIdData = "0"
      }else {
        typesIdData = typesId2
      }
      if(startTime2 == '') {
        timePeriod = '0'
      }else {
        timePeriod = `${startTime2},${endTime2}`
      }
      if(isEmpty(nameId2) == true){
        sealDetailId = '0'
      }else {
        sealDetailId = nameId2.join()
      }
      let page_current = 1
      page_current = clickQueryPageCurrent ? clickQueryPageCurrent : pageCurrent2
      let tabPost = {
        arg_time_period: timePeriod,
        arg_form_type: typesIdData,
        arg_seal_uuid: typeId2.join(),
        arg_seal_details_id: sealDetailId,
        arg_create_user_id: applyPerson2,
        arg_state: stateId2,
        arg_user_id: Cookie.get("userid"),
        arg_page_size: pageSize,
        arg_page_current: page_current,
        arg_page_state: 1,
      }
      let data = yield call(Services.sealChecking, tabPost)
      addTabKey(data.DataRows) //为表格添加key值
      data.DataRows.map((v) => {
        v.list_state = '0'
        v.searchType = '1'
      })
      if (data.RetCode === '1') {
        yield put({
          type: 'save',
          payload: {
            checkingTab: JSON.parse(JSON.stringify(data.DataRows)),
            totalData2: parseInt(data.RowCount),
            pageCurrent2: page_current,
            tabKey: '2',
          }
        })
      }
    },
    // 请求查询印章证照名称
    *selectName({}, {call, put, select}) {
      const {tabKey, typeId, typeId2 } = yield select (state => state.managerSealQuery)
      const postData2 = {
        ouid: Cookie.get("OUID"),
        seal_uuid: typeId.join() //章照一级分类id，默认0
      }
      if(tabKey == '1') {
        yield put({
          type: 'save',
          payload: {
            queryName: []
          }
        })
        let nameData = yield call(Services.sealSecondCategoryQuery, postData2);
        // 请求印章名称数据列表
        if(nameData.RetCode === '1') {
          yield put({
            type: 'save',
            payload: {
              nameList: JSON.parse(JSON.stringify(nameData.DataRows))
            }
          })
        }
      }else if(tabKey == '2') {
        yield put({
          type: 'save',
          payload: {
            queryName2: []
          }
        })
        postData2['seal_uuid'] = typeId2.join();
        postData2['userid'] = Cookie.get("userid")
        let nameData = yield call(Services.sealSecondCategoryQuery, postData2);
        // 请求印章名称数据列表
        if(nameData.RetCode === '1') {
          yield put({
            type: 'save',
            payload: {
              nameList2: JSON.parse(JSON.stringify(nameData.DataRows))
            }
          })
        }
      }
    },
    // 保存选中时间值
    *saveSelectTime({value}, {put, select}) {
      const {tabKey} = yield select(state => state.managerSealQuery)
      if(tabKey == '1') {
        yield put({
          type: 'save',
          payload: {
            startTime: value[0],
            endTime: value[1]
          }
        })
      }else if(tabKey == '2') {
        yield put({
          type: 'save',
          payload: {
            startTime2: value[0],
            endTime2: value[1]
          }
        })
      }
    },
    *saveTypes({value}, {put, select}) {
      const {tabKey} = yield select(state => state.managerSealQuery)
      if(tabKey == '1') {
        let arr = value.split('#');
        yield put({
          type: 'save',
          payload: {
            types: value,
            typesId: arr[0]
          }
        })
      }else if (tabKey == '2') {
        let arr = value.split('#');
        yield put({
          type: 'save',
          payload: {
            types2: value,
            typesId2: arr[0],
          }
        })
      }
    },
    // 保存状态选择值和对应id
    *saveState({value}, {call, put, select}) {
      const {tabKey} = yield select(state => state.managerSealQuery)
      let arr = value.split('#');
      if(tabKey == '1') {
        yield put({
          type: 'save',
          payload: {
            stateId: arr[0],
            state: value
          }
        })
      }else if (tabKey == '2') {
        yield put({
          type: 'save',
          payload: {
            state2: value,
            stateId2: arr[0],
          }
        })
      }
    },
    // 保存印章类型值
    *saveSealType({value}, {put, select}) {
      const {tabKey} = yield select(state => state.managerSealQuery)
      value = value.filter((v) => {
        return v!= "全部"
      })
      let typeIdUnique
      if((value.includes("0#全部")) && !(value.includes("0#全部") && value.length==1)) { 
        // typeIdUnique = ['0']
        value = value.filter((v, i) => { 
          return v == "0#全部"
        })
      }
      typeIdUnique = mutiply(value)
      if(tabKey == '1') {
        yield put({
          type: 'save',
          payload: {
            typeId: JSON.parse(JSON.stringify(typeIdUnique)),
            queryType: JSON.parse(JSON.stringify(value)),
          }
        })
      }else if (tabKey == '2') {
        yield put({
          type: 'save',
          payload: {
            queryType2: JSON.parse(JSON.stringify(value)),
            typeId2: JSON.parse(JSON.stringify(typeIdUnique)),
          }
        })
      }
      yield put({type: 'selectName'})
    },
    *saveName({value}, {put, select}) {
      const {tabKey} = yield select(state => state.managerSealQuery)
      value = value.filter((v) => {
        return v!= "全部"
      })
      let nameIdUnique
      if((value.includes("0#全部")) && !(value.includes("0#全部") && value.length==1)) { // 含有全部并且此时有其他选项时
        value = value.filter((v, i) => { // 点击全部其他所有的都清空只显示全部
          return v == "0#全部"
        })
        // nameIdUnique = ['0']
      }
      nameIdUnique = mutiply(value)
      if(tabKey == '1') {
        yield put({
          type: 'save',
          payload: {
            nameId: JSON.parse(JSON.stringify(nameIdUnique)),
            queryName: JSON.parse(JSON.stringify(value))
          }
        })
      }else if(tabKey == '2') {
        yield put({
          type: 'save',
          payload: {
            nameId2: JSON.parse(JSON.stringify(nameIdUnique)),
            queryName2: JSON.parse(JSON.stringify(value))
          }
        })
      }
    },
    *handleApplyPersonChange({value}, {put, select}) {
      const {tabKey} = yield select(state => state.managerSealQuery)
      if(tabKey == '1') {
        yield put({
          type: 'save',
          payload: {
            applyPerson: value
          }
        })
      }else if(tabKey == '2') {
        yield put({
          type: 'save',
          payload: {
            applyPerson2: value
          }
        })
      }
    },
    // 领取人Input框
    *handlereceiverIptChange({value}, {put}) {
      yield put({
        type: 'save',
        payload: {
          receiverIpt: value
        }
      })
    },
    // 备注
    *remarksSave({value}, {put}) {
      yield put({
        type: 'save',
        payload: {
          remarks: value
        }
      })
    },
    // 模态框查询按钮
    *receiveOrConfirmeQuery({}, {call, put, select}) {
      const {receiverIpt} = yield select(state => state.managerSealQuery);
      let postData = {
        arg_parameter: receiverIpt,
      }
      if (receiverIpt == '') {
        message.error("请输入领取人")
        return
      }else {
        const data = yield call(Services.receiverQuery, postData)
        addTabKey(data.DataRows)
        if(data.RetCode === '1') {
          yield put({
            type: 'save',
            payload: {
              receiverQueryData: JSON.parse(JSON.stringify(data.DataRows))
            }
          })
        }
      }
    },
    // 清空功能
    *emptyQuery({}, {call, put, select}) {
      const {tabKey, nameAllList} = yield select(state => state.managerSealQuery)
      if(tabKey == '1') {
        yield put({
          type: 'save',
          payload: {
            startTime: '',
            endTime: '',
            types: '全部',
            typesId: '0',
            state: '全部',
            stateId: '0',
            queryType: ['全部'],
            typeId: ['0'],
            queryName: ['全部'],
            nameId: ['0'],
            nameList: nameAllList,
            applyPerson: '',
            pageCurrent: 1,
            pageCurrent2: 1
          }
        })
        yield put({type: "firstPage"}) // 清空之后查询
      }else if(tabKey == '2') {
        yield put({
          type: 'save',
          payload: {
            startTime2: '',
            endTime2: '',
            types2: '全部',
            typesId2: '0',
            state2: '全部',
            stateId2: '0',
            queryType2: ['全部'],
            typeId2: ['0'],
            queryName2: ['全部'],
            nameId2: ['0'],
            nameList2: nameAllList,
            applyPerson2: '',
          }
        })
        yield put({type: "secondPage"}) // 清空之后查询
      }
    },
    *batchDownload({}, {select}) { // 批量下载
      const {checkingTab } = yield select(state => state.managerSealQuery)
      for(let i=0; i < checkingTab.length; i++) {
        let uuid = checkingTab[i].form_uuid, title = checkingTab[i].form_title
        let url = ''
        if(title.indexOf("院领导名章使用") > -1){
          url = "/microservice/allmanagementofseal/sealOfUse/LeaderSealWord?arg_form_uuid="
        }else if(title.indexOf("营业执照外借") > -1) {
          url = "/microservice/allmanagementofseal/sealOfBorrowAndCarve/ExportSealWord/businessLicenseBorrowWord?form_uuid="
        }else if(title.indexOf("院领导身份证") > -1) {
          url = "/microservice/allmanagementofseal/sealOfUse/LeaderCardWord?arg_form_uuid=";
        }else if(title.indexOf("院领导名章外借") > -1) {
          url = "/microservice/allmanagementofseal/sealOfBorrowAndCarve/ExportSealWord/LeaderSealBorrowWord?form_uuid="
        }else if(title.indexOf("印章外借") > -1) { 
          url = "/microservice/allmanagementofseal/sealOfBorrowAndCarve/ExportSealWord/OfficialSealWord?form_uuid=";
        }else if(title.indexOf("刻章申请") > -1) {
          url = "/microservice/allmanagementofseal/sealOfBorrowAndCarve/ExportSealWord/carveWord?form_uuid=";
        }else if(title.indexOf("营业执照复印件使用") > -1) {
          url = "/microservice/allmanagementofseal/sealOfUse/PermitWord?arg_form_uuid=";
        }else if(title.indexOf("印章使用") > -1) {
          url = "/microservice/allmanagementofseal/sealOfUse/UseSealWord?arg_form_uuid=";
        }
        window.open(url + uuid, '_blank');
      }
      
    },
    // 申请单作废
    *applyAbolish({record}, {call, put}) {
      let postData = {
        arg_form_uuid: record.form_uuid,
        arg_form_check_state: record.form_check_state,
        arg_form_check_state_desc: record.form_check_state_desc,
        arg_user_id: Cookie.get("userid"),
        arg_user_name: Cookie.get("username"),
      }
      const data = yield call(Services.SealFormCancel, postData);
      if(data.RetCode === '1') {
        message.success("申请单作废")
      }
      yield put({type: 'secondPage'}) // 走查询服务
    },
    // 点击确认领取按钮 保存标志位和record数据
    *confirmeReceiveFlag({record}, {put}){
      yield put({
        type: 'save',
        payload: {
          confirmeFlag: "1",
          receiveRecord: record,
          isConfirmeVisible: true
        }
      })
    },
    // 点击确认结束按钮 保存标志位和record数据
    *confirmeFinishFlag({record}, {put}){
      yield put({
        type: 'save',
        payload: {
          confirmeFlag: "2",
          finishRecord: record,
          isConfirmeVisible: true
        }
      })
    },
    // 点击确认归还按钮 保存标志位和record数据
    *confirmeReturnFlag({record}, {put}){
      yield put({
        type: 'save',
        payload: {
          confirmeFlag: "3",
          returnRecord: record,
          isConfirmeVisible: true
        }
      })
    },
    *saveReceiverRows({selectedRows}, {put}) {
      yield put({
        type: 'save',
        payload: {
          receiverRows: selectedRows[0]
        }
      })
    },
    *cancelConfirme({}, {put}){ // 取消
      yield put({type: 'save', payload: {isConfirmeVisible: false}})
    },
    // 确认领取/完成/归还
    *confirme({}, {call, put, select}) {
      let {receiveRecord, finishRecord, receiverRows, confirmeFlag, returnRecord, remarks}
      = yield select(state => state.managerSealQuery)
      let postData = {
        form_uuid: '',
        form_type: '',
        recipients_id: receiverRows.userid,
        recipients_name: receiverRows.username,
        form_desc: remarks, //备注
        create_user_id: Cookie.get("userid"),
        create_user_name: Cookie.get("username")
      }
      if(confirmeFlag == '1') { // 确认领取
        postData['form_uuid'] = receiveRecord.form_uuid
        postData['form_type'] = receiveRecord.form_type
        // if(!receiverRows.username || receiverIpt == '') {
        //   yield put({type: 'save', payload: {isConfirmeVisible: true}})
        //   message.error("数据没有填写完整")
        //   return
        // }
        // else {
          let data = yield call(Services.confirmReceive, postData)
          if(data.RetCode === '1') {
            // message.success("确认领取")
            // receiveRecord.form_uuid = '';
            receiveRecord.form_type = '';
            receiverRows.userid = '';
            receiverRows.username = '';
            yield put({type: 'save', payload: {
              isConfirmeVisible: false,
              receiveRecord: JSON.parse(JSON.stringify(receiveRecord)),
              receiverRows: JSON.parse(JSON.stringify(receiverRows)),
              receiverIpt: '',
              tableUploadFile: [],
              remarks: ''
            }})
          }else{
            message.success("确认失败")
          }
        // }
      }else if(confirmeFlag == '2') { // 确认结束
        postData['form_uuid'] = finishRecord.form_uuid
        postData['form_type'] = finishRecord.form_type
        // if(!receiverRows.username || receiverIpt == '') {
        //   yield put({type: 'save', payload: {isConfirmeVisible: true}})
        //   message.error("数据没有填写完整")
        //   return
        // }
        // else {
          let data = yield call(Services.confirmReceive, postData)
          if(data.RetCode === '1') {
            // message.success("确认完成")
            // finishRecord.form_uuid = '';
            finishRecord.form_type = '';
            receiverRows.userid = '';
            receiverRows.username = '';
            yield put({type: 'save', payload: {
              isConfirmeVisible: false,
              finishRecord: JSON.parse(JSON.stringify(finishRecord)),
              receiverRows: JSON.parse(JSON.stringify(receiverRows)),
              receiverIpt: '',
              tableUploadFile: [],
              remarks: ''
            }})
          }else{
            message.success("确认失败")
          }
        // }
      }else if(confirmeFlag == '3') { // 确认归还
        let record = returnRecord;
        let postData = {
          form_uuid: record.form_uuid,
          create_user_id: Cookie.get("userid"),
          create_user_name: Cookie.get("username")
        }
        let data = yield call(Services.recturnConfirm, postData)
        if(data.RetCode === '1') {
          // message.success("确认归还")
          // returnRecord.form_uuid = '';
          yield put({type: 'save', payload: {
            isConfirmeVisible: false,
            returnRecord: JSON.parse(JSON.stringify(returnRecord)),
            receiverIpt: '',
            remarks: ''
          }})
        }else{
          message.success("确认失败")
        }
      }
      yield put({type: 'secondPage'}) // 走查询服务
      // yield put({
      //   type: 'fileUpload'
      // })
    },
    // 文件上传服务
    *fileUpload({}, {call, put, select}) {
      const {finishRecord, receiveRecord, returnRecord, confirmeFlag, tableUploadFile, uploadInfoArr} = yield select(state => state.managerSealQuery)
      let record = receiveRecord;
      if(confirmeFlag == '1') { // 确认领取
        record = receiveRecord;
      }else if(confirmeFlag == '2') { // 确认完成
        record = finishRecord;
      }else if(confirmeFlag == '3') { // 确认归还
        record = returnRecord;
      }
      let fileList = tableUploadFile
      fileList.map((v, i) => {
        uploadInfoArr.push(
          {
            upload_name: `${v.upload_name}`,
            RelativePath: `${v.RelativePath}`,
            AbsolutePath: `${v.AbsolutePath}`,
            upload_type: `${v.upload_type}`
          }
        )
      })
      let postData = {
        arg_form_uuid: record.form_uuid,
        arg_create_user_id: Cookie.get("userid"),
        arg_create_user_name: Cookie.get("username"),
        arg_upload_info: JSON.stringify(uploadInfoArr)
      }
      let data = yield call(Services.sealFileUpload, postData)
      if(data.RetCode == '1') {
        message.success("确认成功")
        yield put({
          type: 'confirme'
        })
        yield put({type: 'save', payload: {
          tableUploadFile: [],
          uploadInfoArr: []
        }})
      }
    },
    //附件删除
    * deleteUpload({record},{select,put}){
      const { tableUploadFile } = yield select(state=>state.managerSealQuery);
      let a = tableUploadFile.filter(item => {
        return item !== record
      });
      addTabKey(a)
      yield put({
        type:'save',
        payload:{
          tableUploadFile:JSON.parse(JSON.stringify(a))
        }
      })
    },
    // 发送通知
    *sendEmail({record}, {call, put}) {
      let postData = {
        arg_form_uuid: record.form_uuid
      }
      let data = yield call(Services.SendEmailInfo, postData)
      if(data.RetCode == '1') {
        yield put({type: "secondPage"}) 
        message.success("已通知申请人")
      }
    },
    //保存附件名称地址
    * saveUploadFile({value, sss},{select,put}){
      sss == "个人信息图片"? sss = "个人信息图片" : sss = '材料信息图片'
      const {tableUploadFile, confirmeFlag} = yield select(state => state.managerSealQuery);
      let uploadType;
      if(confirmeFlag == '1' || confirmeFlag == '2') { // 确认领取 && 确认完成
        if(sss == '个人信息图片') {
          uploadType = "1"
        }else if(sss == '材料信息图片') {
          uploadType = "2"
        }
      }else if(confirmeFlag == '3') { // 确认归还4
        if(sss == '个人信息图片') {
          uploadType = "3"
        }else if(sss == '材料信息图片') {
          uploadType = "4"
        }
      }
      if(uploadType) {
        tableUploadFile.push({
          upload_name:value.filename.RealFileName,
          AbsolutePath:value.filename.AbsolutePath,
          RelativePath:value.filename.RelativePath,
          // key:value.filename.AbsolutePath,
          upload_number:'',
          upload_decribe: sss,
          upload_type: uploadType
        });
      }
      addTabKey(tableUploadFile)
      yield put({
        type:'save',
        payload:{
          //FileInfo:FileInfo,
          tableUploadFile:JSON.parse(JSON.stringify(tableUploadFile)),
        }
      })
    },
  },

  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/sealManage/managerSealQuery') { //此处监听的是连接的地址
          if (Object.keys(query).length === 0) {
            dispatch({
              type: 'emptyQuery', // 匹配到路由，初始化页面
            });
          }
          dispatch({
            type: 'init', // 匹配到路由，初始化页面
          });
        }
      });
    },
  },
};
