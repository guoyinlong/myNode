/**
 * 作者：靳沛鑫
 * 日期：2019-05-28
 * 邮箱：1677401802@qq.com
 * 文件说明：岗位信息
 */
import {message} from "antd";
import cookie from "js-cookie";
import * as corePositionService from "../../../services/project/corePositionService"
import {routerRedux} from "dva/router";
export default {
  namespace: "postInfo",
  state: {
    yearList: [],             //年份
    postsState: [],           //状态
    deptList:[],              //部门
    projUnitList:[],          //生产单元名称
    teamCoefficient:[],       //团队系数
    OUList:[],                //人员所属院
    targetPfRankList:[],      //目标绩效职级
    postsInfoList:[],         //岗位信息列表
    userNameList:[],          //员工姓名
    params:{},                //负责储存下拉选项的信息
    chgMake:{},               //负责存储编辑按钮传来的变量
    projectCodeList:[],       //部门名称 部门id 生产编号
    saveStatus:[]             //岗位状态
  },
  effects: {
    // 初始化
    * init({}, {call, put, select}) {
      // ou[]  type[]
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
      //生产业务部门
      yield put({
        type: 'getDeptList'
      })

      yield put({
        type: 'save',
        payload: {
          postsState: [
            {key:'1',value:'有效'},
            {key:'0',value:'失效'},
          ]
        }
      })
      /*yield put({
        type: 'save',
        payload: {
          postsState: [
            {key:'0',value:'空缺'},
            {key:'1',value:'拟聘任'},
            {key:'2',value:'已聘任'},
            {key:'3',value:'失效'}
          ]
        }
      })*/
      //生产单元名称
      yield put({
        type: 'getProjectList'
      })
      //人员所属院
      yield put({
        type: 'getOuList'
      })
      //团队系数
      yield put({
        type: 'getTeamCoefficient'
      })
      //初始化列表
      yield put({
        type: 'postInfoList'
      })
    },
    * postInfoList({},{call, put, select}){  //从接口取值
      const { params } = yield select(state => state.postInfo);
      let data = yield call(corePositionService.postInfoList, params);
      let datas =yield call(corePositionService.buttonPermission);
      params.isAdd=datas.DataRows.displayAdd
      params.isDownload=datas.DataRows.displayDownload
      params.isImport=datas.DataRows.displayImport
      params.isExport=datas.DataRows.displayExport
      params.isEdit=datas.DataRows.displayEdit
      params.isConfirmEmploy=datas.DataRows.displayConfirmEmploy
      params.isSetExpired=datas.DataRows.displaySetExpired
      yield put({
          type:'save',
          payload:{
            params:{...params}
          }
      })
      if(data.RetCode=='1'){
        yield put({
          type:'save',
          payload:{
            postsInfoList:data.DataRows
          }
        })
      }else{
        message.error('查询列表失败');
      }
     },
    //生产业务部门
    * getDeptList({},{call, put, select}){
     let data = yield call(corePositionService.getDeptList);
     if(data.RetCode=='1'){
      yield put({
        type:'save',
        payload:{
          deptList:data.DataRows
        }
      })
     }
    },
    //生产单元名称
    * getProjectList({},{call, put, select}) {
      let data = yield call(corePositionService.getProjectList);
      yield put({
        type:'save',
        payload:{
          projUnitList:data.DataRows
        }
      })
    },
    //人员所属院
    * getOuList({},{call, put, select}){
      let data = yield call(corePositionService.getOuList);
      if(data.RetCode=='1'){
        yield put({
          type:'save',
          payload:{
            OUList:data.DataRows
          }
        })
      }
    },
    //团队系数
    * getTeamCoefficient({},{call, put, select}){
      yield put({
        type:'save',
        payload:{
          teamCoefficient:['1','1.03','1.05','1.08']
        }
      })
      /*let data = yield call(corePositionService.getTeamCoefficient);
      if(data.RetCode=='1'){

      }*/
    },
    // 保存选择条件
    * saveSelectInfo( { value, typeItem } ,{call, put, select}) {       //routes-->models
      const { params } = yield select(state => state.postInfo);
      params[typeItem] = value;
      yield put({
        type: 'save',
        payload:{
          params : {...params},
        }
      });
      yield put({
        type: 'postInfoList'
      })
    },
    * saveSelectStatus( { value } ,{call, put, select}) {       //routes-->models
      const { params } = yield select(state => state.postInfo);
      yield put({
        type:'save',
        payload:{
          saveStatus:value
        }
      })
      let data = yield call(corePositionService.postInfoList, params);
      if(data.RetCode=='1'){
        let dataType=[]
        data.DataRows.map((item)=>{
          if(value=='0'&&item.status=='3'){
            dataType.push(item)
          }else if(value=='1'&&item.status!='3'){
            dataType.push(item)
          }
        })
        yield put({
          type:'save',
          payload:{
            postsInfoList:dataType
          }
        })
      }else{
        message.error('查询列表失败');
      }
    },
    //清空
    * resetCond({}, {call, put, select}){
      const { params } = yield select(state => state.postInfo);
      params.departmentName = [];
      params.year = [];
      params.projectName = [];
      params.status = [];
      params.teamCoefficient = [];
      params.affiliatedAcademy = [];
      yield put({
        type: 'save',
        payload:{
          params : {...params},
          saveStatus : []
        }
      });
      yield put({
        type: 'postInfoList'
      })
    },
   // 编辑模态窗预设值生成
   * temporarycache({elem, index} ,{call, put, select}){
     const { postsInfoList, chgMake, deptList, projUnitList } = yield select(state => state.postInfo)
     for(let key in chgMake){
       delete chgMake[key];
     }
     if(elem!='add'){
       for(let key in postsInfoList[index]){
         chgMake[key]=postsInfoList[index][key];
       }
       deptList.map((i)=>{
         i.value==postsInfoList[index].departmentName ? chgMake.departmentId=i.key : null
       })
       projUnitList.map((i)=>{
         i.value==postsInfoList[index].projectName ? chgMake.projectId=i.key : null
       })

       chgMake.teamCoefficient=chgMake.teamCoefficient.toString()
       let targetList=[]
       switch(chgMake.rank){
         case 0: targetList=['T2.1','T2.2','T2.3'];chgMake.rank='普通'; break;
         case 1: targetList=['T3.1','T3.2','T3.3'];chgMake.rank='高级'; break;
         case 2: targetList=['T4.1'];chgMake.rank='总监'; break;
       }
       chgMake.appointWay=='0' ? chgMake.appointWay='续聘' : chgMake.appointWay='竞聘'
       let postData={departmentId:chgMake.departmentId}
       let datas = yield call(corePositionService.projectNameCode, postData);
       yield put({
         type: 'save',
         payload:{
           projectCodeList:datas.DataRows
         }
       });
       yield put({
         type: 'save',
         payload:{
           chgMake,
         }
       });
       yield put({
         type: 'save',
         payload:{
           targetPfRankList : targetList,
         }
       });
     }else{
       yield put({
         type: 'save',
         payload:{
           projectCodeList:[]
         }
       });
     }
     let data = yield call(corePositionService.userAndAcademyNames);
     yield put({
       type: 'save',
       payload:{
         userNameList:data.DataRows
       }
     });
   },
   // 储存模态窗值得变动
   * changedMake({ value, typeItem} ,{call, put, select}){
     const { chgMake, deptList, projectCodeList} = yield select(state => state.postInfo)
     chgMake[typeItem]=value
     //传输是部门或者单位名称时传递id
     if(typeItem=='departmentName'){
       chgMake.projectName=[]
       chgMake.projectCode=[]
       deptList.map((i)=>{
         i.value==value ? chgMake.departmentId=i.key : null
       })
       let postData={departmentId:chgMake.departmentId}
       let data = yield call(corePositionService.projectNameCode, postData);
       yield put({
         type: 'save',
         payload:{
           projectCodeList:data.DataRows
         }
       });
     }
     if(typeItem=='projectName'){
       projectCodeList.map((i)=>{
         i.name==value ? (chgMake.projectCode=i.code , chgMake.projectId=i.key) : null
       })
     }
     //绩效
     let targetList=[]
     if(typeItem=='rank'){
       chgMake.targetPerformanceRank=[]
       switch(value){
         case '0': targetList=['T2.1','T2.2','T2.3'];chgMake.rank='普通';break;
         case '1': targetList=['T3.1','T3.2','T3.3'];chgMake.rank='高级';break;
         case '2': targetList=['T4.1'];chgMake.rank='总监';break;
       }
       yield put({
         type: 'save',
         payload:{
           targetPfRankList : targetList,
         }
       });
     }
     //聘任方式
     if(typeItem=='appointWay'){
       value=='0' ? chgMake.appointWay='续聘' : chgMake.appointWay='竞聘'
     }
     yield put({
       type: 'save',
       payload:{
         chgMake : {...chgMake},
       }
     });
   },
   //人员及其所属院
   * userAndAcademyNames({name}, {call, put, select}){
     const { chgMake, userNameList} = yield select(state => state.postInfo);
     userNameList.map((i)=>{
           if(i.userId==name.slice(-7)){
             chgMake.corepositionUsername=i.username
             chgMake.corepositionUserId=i.userId
             chgMake.affiliatedAcademy=i.affiliatedAcademy
           }
         })
     yield put({
       type: 'save',
       payload:{
         chgMake : {...chgMake},
       }
     });
   },
   //模态窗确认
   * addCorePosts({title}, {call, put, select}){
     const { chgMake } = yield select(state => state.postInfo);
     if(chgMake.rank){
       switch(chgMake.rank){
         case '普通': chgMake.rank='0';break;
         case '高级': chgMake.rank='1';break;
         case '总监': chgMake.rank='2';break;
       }
     }
     if(chgMake.appointWay){
       chgMake.appointWay=='续聘' ? chgMake.appointWay='0' : chgMake.appointWay='1'
     }
     if(title=='新增核心岗位'){
        let data=yield call(corePositionService.addCorePosts, chgMake);
        if (data.RetCode == '1') {
          message.success('提交成功');
        }
     }else if(title=='编辑核心岗位'){
        let data=yield call(corePositionService.editCorePosts, chgMake);
        if (data.RetCode == '1') {
          message.success('提交成功');
        }
     }else if(title=='编辑核心岗位选定人信息'){
        let data=yield call(corePositionService.editCorePostsPerson, chgMake);
        if (data.RetCode == '1') {
          message.success('提交成功');
        }
     }
     yield put({
       type: 'postInfoList'
     });
     yield put({
       type: 'save',
       payload:{
         chgMake : {...chgMake},
       }
     });
   },
   // 确认聘任
   * confirmemploy({index}, {call, put, select}){
     const { postsInfoList } = yield select(state => state.postInfo);
     let postData = {id:postsInfoList[index].id}
     let data=yield call(corePositionService.confirmEmploy, postData);
     if (data.RetCode == '1') {
       message.success('聘任成功');
     }
     yield put({
       type: 'postInfoList'
     })
   },
    // 确认失效
    * setExpired({index}, {call, put, select}){
      const { postsInfoList } = yield select(state => state.postInfo);
      let postData = {id:postsInfoList[index].id}
      let data=yield call(corePositionService.setexpired, postData);
      if (data.RetCode == '1') {
        message.success('操作成功');
      }
      yield put({
        type: 'postInfoList'
      })
    },
  },

  reducers: {
    save(state, action) {
      return {...state, ...action.payload};
    }
  },
  subscriptions: {                                     //订阅models-->routes
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/projectApp/corePost/postInfo') {
          dispatch({type: 'init'});
        }
      });
    },
  }
};
