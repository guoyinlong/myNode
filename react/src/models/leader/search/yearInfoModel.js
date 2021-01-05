

/**
 * 作者：罗玉棋
 * 日期：2019-11-18
 * 邮箱：809590923@qq.com
 * 文件说明：查询年度全部人员信息
 */
import * as usersService1 from '../../../services/employer/module.js'
import Cookie from 'js-cookie';
import message from '../../../components/commonApp/message'
const user_id = Cookie.get('userid');
//let defaultYear=new Date().getFullYear()

export default {
  namespace: 'yearInfo',
  state: {
    //默认表头
    TableRowColumn:[
      {
        title: "序号",
        key:"0",
        render:(value,record,index)=>{
          return index+1
        }
      },
      {
        title: "年度",
        dataIndex: "year",
        key:"1",
      },
      {
        title: "员工编号",
        dataIndex: "staff_id",
        key:"2",
      },
      {
        title: "姓名",
        dataIndex: "staff_name",
        key:"3",
      },
      {
        title: "部门",
        dataIndex: "dept_name",
        key:"4",
      },
      {
        title: "组织绩效得分",
        children:[
          {
            title: "效益类指标",
            key:"5",
            dataIndex:"org_performance",
            "render":(value)=>{
              return value?value:"－"
            }
          },
          {
            title: "专业化指标",
            key:"6",
            dataIndex:"org_specialization",
            "render":(value)=>{
              return value?value:"－"
            }
          },
          {
            title: "GS重点工作",
            key:"7",
            dataIndex:"org_GS",
            "render":(value)=>{
              return value?value:"－"
            }
          },
          {
            title: "党建工作",
            dataIndex:"org_party",
            key:"7",
            "render":(value)=>{
              return value?value:"－"
            }
          },
          {
            title: "支撑服务",
            dataIndex:"org_support",
            key:"8",
            "render":(value)=>{
              return value?value:"－"
            }
          },
          {
            title: "学习与成长",
            dataIndex:"org_learnAndgrowth",
            key:"9",
            "render":(value)=>{
              return value?value:"－"
            }
          },
          {
            title: "加减分",
            dataIndex:"org_ouaddOrsubtract",
            key:"10",
            "render":(value)=>{
              return value?value:"－"
            }
          },
        ]
      },
      {
        title: "个人绩效得分",
        children:[
          {
            title: "效益类指标",
            key:"11",
            dataIndex:"per_performance",
            "render":(value)=>{
              return value?value:"－"
            }
          },
          {
            title: "专业化指标",
            key:"12",
            dataIndex:"per_specialization",
            "render":(value)=>{
              return value?value:"－"
            }
          },
          {
            title: "GS重点工作",
            key:"13",
            dataIndex:"per_GS",
            "render":(value)=>{
              return value?value:"－"
            }
          },
          {
            title: "党建工作",
            key:"14",
            dataIndex:"per_party",
            "render":(value)=>{
              return value?value:"－"
            }
          },
          {
            title: "支撑服务",
            key:"15",
            dataIndex:"per_support",
            "render":(value)=>{
              return value?value:"－"
            }
          },
          {
            title: "学习与成长",
            key:"16",
            dataIndex:"per_learnAndgrowth",
            "render":(value)=>{
              return value?value:"－"
            }
          },
          {
            title: "加减分",
            key:"17",
            dataIndex:"per_ouaddOrsubtract",
            "render":(value)=>{
              return value?value:"－"
            }
          },
        ]
        
      
      },
      {
        title: "三度评价",
        children:[
          {
            title: "贡献度",
            dataIndex: "evaluate_score1",
            key:"18",
            "render":(value)=>{
              return value?value:"－"
            }
          },
          {
            title: "胜任度",
            key:"19",
            dataIndex: "evaluate_score2",
            "render":(value)=>{
              return value?value:"－"
            }
          },
          {
            title: "公信度",
            key:"20",
            dataIndex: "evaluate_score3",
            "render":(value)=>{
              return value?value:"－"
            }
          },
        ]
      },
      {
        title: "个人加减分",
        key:"21",
        dataIndex: "addorsubtract_score",
        "render":(value)=>{
          return value?value:"－"
        }
      },
      {
        title: "总分",
        key:"22",
        dataIndex: "person_sum",
        "render":(value)=>{
          return value?value:"－"
        }
      },
      {
        title: "考核结果",
        key:"23",
        dataIndex: "examine_result",
        "render":(value)=>{
          return value?value:"－"
        }
      },
      
    ],

    Table2RowColumn:[
      {
        title: "序号",
        key:"24",
        render:(value,record,index)=>{
          return index+1
        }
      },
      {
        title: "年度",
        key:"25",
        dataIndex: "year",
      },
      {
        title: "员工编号",
        key:"26",
        dataIndex: "staff_id",
      },
      {
        title: "姓名",
        key:"27",
        dataIndex: "staff_name",
      },
      {
        title: "部门",
        key:"28",
        dataIndex: "dept_name",
      },
      {
        title: "三度评价",
        key:"29",
        children:[
          {
            title: "贡献度",
            key:"30",
            dataIndex: "evaluate_score1",
            "render":(value)=>{
              return value?value:"－"
            }
          },
          {
            title: "胜任度",
            key:"31",
            dataIndex: "evaluate_score2",
            "render":(value)=>{
              return value?value:"－"
            }
          },
          {
            title: "公信度",
            key:"32",
            dataIndex: "evaluate_score3",
            "render":(value)=>{
              return value?value:"－"
            }
          },
        ]
      },
      {
        title: "个人加减分",
        key:"33",
        dataIndex: "addorsubtract_score",
        "render":(value)=>{
          return value?value:"－"
        }
      },
      {
        title: "总分",
        key:"34",
        dataIndex: "person_sum",
        "render":(value)=>{
          return value?value:"－"
        }
      },
      {
        title: "考核结果",
        key:"35",
        dataIndex: "examine_result",
        "render":(value)=>{
          return value?value:"－"
        }
      },
      
    ],

    deptlist:[],
    leaderInfo:[],
    tableFlage:false
  },

  reducers: {
 
    save(state, {payload}) {
      return { ...state, 
               ...payload
              };
    },

  },

  effects: { 
    *deptlist({tYear},{call,put}){
      let {RetCode,RetVal,DataRows}=yield call(usersService1.deptlist,{
        "arg_year":tYear?tYear:2019
      })
        if(RetCode==="1"){
          if(DataRows&&DataRows.length>0){ 
          yield put({
          type:"save",
          payload:{
            deptlist:[...DataRows]
          }
          })
        }
         else{
          yield put({
            type:"save",
            payload:{
              deptlist:[]
            }
            })
        }
      }else{
        message.error(RetVal,2," ")

      }
      },
     
      *columnInfo({tYear},{call,put,select}){
        let {TableRowColumn}=yield select(state => state.yearInfo)
        let {RetCode,RetVal,organization,personal}=yield call(usersService1.columnInfo,{
        "arg_year":tYear?tYear:2019
        })
          if(RetCode==="1"){

            if( JSON.stringify(organization)!="{}"){

              let orgList=[],perList=[],orgindex,perindex;
              for( orgindex in organization){
                let orgitem={
                  "title":orgindex,
                  "dataIndex":organization[orgindex],
                   "render":(value)=>{
                     return value?value:"－"
                   }
                }
                orgList.push(orgitem)
              }
  
              for( perindex in personal){
                let peritem={
                  "title":perindex,
                  "dataIndex":personal[perindex],
                  "render":(value)=>{
                    return value?value:"－"
                  }
                }
                perList.push(peritem)
              }
             TableRowColumn[5].children=[...orgList]
             TableRowColumn[6].children=[...perList]
             TableRowColumn.forEach((table,t)=>{
              table["key"]=t+1+""
          })
         // console.log(TableRowColumn)
             
              yield put({
              type:"save",
              payload:{
                TableRowColumn:[...TableRowColumn],
                tableFlage:true
              }
              })
            }else{
              yield put({
                type:"save",
                payload:{
                  tableFlage:false
                }
                })
            }
          } else{
            message.error(RetVal,2," ")
          }
        },

      *leaderInfo({tYear,deptname,staff},{call,put}){
        let postData={}
        if(deptname&&staff){
           postData={
            "arg_year":tYear?tYear:2019,
            "arg_staffId":user_id,
            "arg_deptname":deptname,
            "arg_all":staff,
            "arg_tag":1
            }
        }
        else if(deptname){
          postData={
          "arg_year":tYear?tYear:2019,
          "arg_staffId":user_id,
          "arg_deptname":deptname,
          "arg_tag":1
          }
          }
          else if(staff){
            postData={
              "arg_year":tYear?tYear:2019,
              "arg_staffId":user_id,
              "arg_all":staff,
              "arg_tag":1
              }
          }else{
            postData={
              "arg_year":tYear?tYear:2019,
              "arg_staffId":user_id,
              "arg_tag":1
              }
          }
        
        let {RetCode,RetVal,DataRows}=yield call(usersService1.leaderInfo,postData)
          if(RetCode==="1"){
            yield put({ type:"columnInfo",tYear})
            DataRows.forEach((e,i)=>{
                e.key=e.staff_id
            })
            if(DataRows&&DataRows.length>0){
              yield put({
                type:"save",
                payload:{
                  leaderInfo:[...DataRows]
                }
                })
               message.success("查询成功！",1," ")
            }else{
              yield put({
                type:"save",
                payload:{
                  leaderInfo:[...DataRows]
                }
                })
                message.warning("暂无数据",1," ")
            }
          } else{
            yield put({
              type:"save",
              payload:{
                leaderInfo:[]
              }
              })
            message.error(RetVal,2," ")
          }
        },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/leader/yearInfo') {
          // dispatch({type:"leaderInfo"}) 
          // dispatch({type:"deptlist"}) 
        }
      });
    },
  },
};
