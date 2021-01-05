/**
 * 作者：罗玉棋
 * 日期：2019-12-18
 * 邮箱：809590923@qq.com
 * 文件说明：中层互评导出
 */
import * as usersService1 from '../../../services/employer/module.js'
import message from '../../../components/commonApp/message'
//let defaultYear=new Date().getFullYear();
//let count=5
export default {
  namespace: 'middleEvaluation',
  state: {
    data:[],
    loading:false,
    columns :[
      {
        title: "年度",
        dataIndex:"year",
        key:"0",
        fixed:"left",
        width:100
      },
      {
        title: "员工编号",
        dataIndex:"staff_id",
        key:"1",
        fixed:"left",
        width:100
      },
      {
        title: "姓名",
        dataIndex: "staff_name",
        key:"2",
        fixed:"left",
        width:100
      },
      {
        title: "三度评价",
        children:[
          {
            title: "贡献度",
            dataIndex: "evaluate_score1",
            key:"3"
          },
          {
            title: "胜任度",
            dataIndex: "evaluate_score2",
            key:"4"
          },
          {
            title: "公信度",
            dataIndex: "evaluate_score3",
            key:"5"
          },
        ]
      },
      {
        title: "领导班子聘任意见",
        children:[
          {
            title: "聘任",
            dataIndex: "leader_true",
            key:"6"
          },
          {
            title: "不聘任",
            dataIndex: "leader_false",
            key:"7"
          },
          {
            title: "弃权",
            dataIndex: "leader_waiver",
            key:"8"
          },
          {
            title: "不聘任率",
            key:"9",
            render:(value,record)=>{
            return   (parseInt(record.leader_false )/parseInt(record.leader_advice)*100||0).toFixed(2)+"%"
            }
          },
          {
            title: "参评人数",
            key:"10",
            dataIndex: "leader_advice",
          },

        ]

      },
      {
        title: "中层互评聘任意见",
        children:[
          {
            title: "聘任",
            dataIndex: "middle_true",
            key:"11",
          },
          {
            title: "不聘任",
            dataIndex: "middle_false",
            key:"12",
          },
          {
            title: "弃权",
            dataIndex: "middle_waiver",
            key:"13",
          },
          {
            title: "不聘任率",
            key:"14",
            render:(value,record)=>{
             return   (parseInt(record.middle_false )/parseInt(record.middle_advice)*100||0).toFixed(2)+"%"
            }
          },
          {
            title: "参评人数",
            dataIndex: "middle_advice",
            key:"15",
          },
        ]

      },
      {
        title: "本部门核心岗位及员工代表聘任意见",
        children:[
          {
            title: "聘任",
            dataIndex: "other_true",
            key:"16",
          },
          {
            title: "不聘任",
            dataIndex: "other_false",
            key:"17",
          },
          {
            title: "弃权",
            dataIndex: "other_waiver",
            key:"18",
          },
          {
            title: "不聘任率",
            key:"19",
            render:(value,record)=>{
              return   (parseInt(record.other_false )/parseInt(record.other_advice)*100||0).toFixed(2)+"%"
             }
          },
          {
            title: "参评人数",
            dataIndex: "other_advice",
            key:"20",
          },
        ]
      },

      {
        title: "整体不聘任率",
        key:"21",
        fixed:"right",
        width:100,
        render:(value,record)=>{
          return   ((parseInt(record.leader_false)+parseInt(record.middle_false)+parseInt(record.other_false))/parseInt(record.count)*100||0).toFixed(2)+"%"
        
         }
      },

    ],
    Tablecolumns :[
      {
        title: "年度",
        dataIndex:"year",
        key:"22",
        fixed:"left",
        width:100
      },
      {
        title: "员工编号",
        dataIndex:"staff_id",
        key:"23",
        fixed:"left",
        width:100
      },
      {
        title: "姓名",
        dataIndex: "staff_name",
        key:"24",
        fixed:"left",
        width:100
      },
      {
        title: "三度评价",
        children:[
          {
            title: "贡献度",
            dataIndex: "evaluate_score1",
            key:"25",
          },
          {
            title: "胜任度",
            dataIndex: "evaluate_score2",
            key:"26",
          },
          {
            title: "公信度",
            dataIndex: "evaluate_score3",
            key:"27",
          },
        ]
      },
      {
        title: "领导班子聘任意见",
        children:[
          {
            title: "聘任",
            dataIndex: "leader_true",
            key:"28",
          },
          {
            title: "不聘任",
            dataIndex: "leader_false",
            key:"29",
          },
          {
            title: "弃权",
            dataIndex: "leader_waiver",
            key:"30",
          },
          {
            title: "不聘任率",
            key:"31",
            render:(value,record)=>{
              return   (parseInt(record.leader_false )/parseInt(record.leader_advice)*100||0).toFixed(2)+"%"
              }
          },
          {
            title: "参评人数",
            dataIndex: "leader_advice",
            key:"32",
          },

        ]

      },
      {
        title: "整体不聘任率",
        key:"33",
        fixed:"right",
        width:100,
        render:(value,record)=>{
          return   ((parseInt(record.leader_false)+parseInt(record.middle_false)+parseInt(record.other_false))/parseInt(record.count)*100||0).toFixed(2)+"%"
         }
      },

    ]
  },

  reducers: {
 
    save(state, {payload}) {
      return { ...state, 
               ...payload
              };
    },
  },

  effects: { 
    *middleEvalInfo({tYear,callback},{call,put}){
      let {RetCode,RetVal,DataRows}=yield call(usersService1.middleInfo,{
      "arg_year":tYear
      })
      if(RetCode==="1"){
        DataRows.forEach((element,i)=> {
          element.key=i+""
        });
        yield put({
          type:"save",
          payload:{
            data:[...DataRows]
          }
        })
        } else{
          yield put({
            type:"save",
            payload:{
              data:[]
            }
          })
          message.warning(RetVal,2," ")
        }
        if(callback)callback(false)
      },

  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/leader/middleEvaluation') {//开发时候先这样写，提交时候这段代码不用
          // let obj={
          //   key: "middleEvaluation",
          //   name: "中层互评管理",
          //   module_id: "980b3c0808db11e9a825008cfa042281"
          //   }
          //   let list=JSON.parse(window.localStorage.getItem("menu"))
          //   list[3].child[3].child[5]=obj
          //   let str=JSON.stringify(list)
          //   window.localStorage.setItem("menu",str)
            // dispatch({type:"middleEvalInfo"})
        }
      });
    },
  },
};

