/**
 * 作者：罗玉棋
 * 日期：2019-11-04
 * 邮箱：809590923@qq.com
 * 文件说明：员工互评/综合绩效（科委会,360评价,院领导,部门负责人）
 */
import * as Service from '../../../services/employer/search.js'
import message from '../../../components/commonApp/message'
let defaultYear=new Date().getFullYear().toString()
let season = Math.floor((new Date().getMonth() + 2) / 3).toString();
if(season === '0'){
  season = '4';
  defaultYear = (new Date().getFullYear() - 1).toString()
}

function timeStamp(dateStamp){
  let date = new Date(dateStamp);
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
  let H = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  let Mi = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  let S = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  let tempDate = Y + M + D + H + Mi + S;
  //console.log("时间戳转换", tempDate)
  return tempDate;
}


export default {
  namespace: 'staffEvaluation',
  state: {
    data:[],
    dataInfo:{},
  },

  reducers: {
 
    save(state, {payload}) {
      return { ...state, 
               ...payload
              };
    },
  },

  effects: { 
    *staffInfo({},{call,put}){
      let dataInfo=yield call(Service.staffEvaluation,{
       // "e_year":tYear?tYear:defaultYear,
        })
        if(dataInfo.RetCode=="1"){
          dataInfo.DataRows.forEach((item,index)=>{
            item["key"]=index+1
          })
         // message.success("查询成功！")
          yield put({
          type:"save",
          payload:{
          data:[...dataInfo.DataRows],
          dataInfo,
          }
          })
          
        } else{
          message.error(dataInfo.RetVal,2," ")
          yield put({
            type:"save",
            payload:{
            data:[...dataInfo.DataRows],
            dataInfo,
            }
            })
        }
      },

      *middleInfo({},{call,put}){
        let dataInfo=yield call(Service.middleLevelInfo,{
          "arg_login_type": window.localStorage["login_type"]||1,
          "arg_dept_name": window.localStorage["deptname"],
          "arg_proj_id": 'undefined',
          "arg_login_name": window.localStorage["username"],
          "arg_year": window.localStorage["year"]||defaultYear,
          })
          if(dataInfo.RetCode=="1"){
             dataInfo['DataRows']=[
              {
              deptid: "e65c0471179e11e6880d008cfa0427c4",
              deptname: "哈尔滨软件研究院-财务部",
              evalname: "哈尔滨软件研究院-综合部",
              evaluate_item1: "25",
              evaluate_item2: "5",
              evaluate_item3: "5",
              evaluate_item4: "5",
              evaluate_item5: "0",
              evaluate_sum: "40.0",
              post_name: "分院部门经理",
              userid: "0382248",
              username: "李清晨"
              },
              {
              deptid: "e65c03c6179e11e6880d008cfa0427c4",
              deptname: "哈尔滨软件研究院-办公室",
              evalname: "哈尔滨软件研究院-综合部",
              evaluate_item1: "0",
              evaluate_item2: "0",
              evaluate_item3: "0",
              evaluate_item4: "0",
              evaluate_item5: "0",
              evaluate_sum: "0.0",
              post_name: "员工",
              userid: "0160108",
              username: "刘忠吉"	
              },
              // {
              // deptid: "e65c03c6179e11e6880d008cfa0427c4",
              // deptname: "哈尔滨软件研究院-办公室",
              // evalname: "哈尔滨软件研究院-综合部",
              // evaluate_item1: "0",
              // evaluate_item2: "0",
              // evaluate_item3: "0",
              // evaluate_item4: "0",
              // evaluate_item5: "0",
              // evaluate_sum: "0.0",
              // post_name: "员工",
              // userid: "0371518",
              // username: "孙晓东"
              // },
              // {
              // deptid: "e65c03c6179e11e6880d008cfa0427c4",
              // deptname: "哈尔滨软件研究院-办公室",
              // evalname: "哈尔滨软件研究院-综合部",
              // evaluate_item1: "0",
              // evaluate_item2: "0",
              // evaluate_item3: "0",
              // evaluate_item4: "0",
              // evaluate_item5: "0",
              // evaluate_sum: "0.0",
              // post_name: "员工",
              // userid: "0382467",
              // username: "刘滨"
              // },
              // {
              // deptid: "e65c03c6179e11e6880d008cfa0427c4",
              // deptname: "哈尔滨软件研究院-办公室",
              // evalname: "哈尔滨软件研究院-综合部",
              // evaluate_item1: "0",
              // evaluate_item2: "0",
              // evaluate_item3: "0",
              // evaluate_item4: "0",
              // evaluate_item5: "0",
              // evaluate_sum: "0.0",
              // post_name: "员工",
              // userid: "0382473",
              // username: "王艳"
              // },
              // {
              // deptid: "e65c03c6179e11e6880d008cfa0427c4",
              // deptname: "哈尔滨软件研究院-办公室",
              // evalname: "哈尔滨软件研究院-综合部",
              // evaluate_item1: "0",
              // evaluate_item2: "0",
              // evaluate_item3: "0",
              // evaluate_item4: "0",
              // evaluate_item5: "0",
              // evaluate_sum: "0.0",
              // post_name: "员工",
              // userid: "0544804",
              // username: "刘佳"
              // },
              // {
              // deptid: "e65c03c6179e11e6880d008cfa0427c4",
              // deptname: "哈尔滨软件研究院-办公室",
              // evalname: "哈尔滨软件研究院-综合部",
              // evaluate_item1: "0",
              // evaluate_item2: "0",
              // evaluate_item3: "0",
              // evaluate_item4: "0",
              // evaluate_item5: "0",
              // evaluate_sum: "0.0",
              // post_name: "员工",
              // userid: "0718185",
              // username: "殷艳"
              // }
              ]

            dataInfo.DataRows.forEach((item,index)=>{
              item["key"]=index+1,
              item['items_name']="执行能力,创新能力,协作配合,职业道德",
              item['items_scores']= "30,20,30,20",
              item['staff_id']=item.userid
              item['staff_name']=item.username

            })
            let obj={
              state:1,
              e_year:defaultYear,
              name:"副总架构师-综合绩效评分"||window.localStorage["deptname"],
              RowCount:dataInfo.DataRows.length,
              items_comment:"执行能力:认真贯彻落实上级精神，执行本岗位职责和任务的实际效率、质量。,创新能力:结合本岗位工作职责深入思考，敢于创新，提出新eval_staff_capture_proc思路新方法，并在工作实践中加以运用，并取得效果。,协作配合:执行本岗位职责的沟通、协调能力，对上下游岗位的合作与服务能力。,职业道德:对待工作有饱满热情；诚信与公司、同时、合作伙伴、客户和社会。不作假，值得信赖。",
              RetCode:"1"
            }
            yield put({
            type:"save",
            payload:{
            data:[...dataInfo.DataRows],
            dataInfo:obj
            }
            })
            
          } else{
            message.error(dataInfo.RetVal,2," ")
            yield put({
              type:"save",
              payload:{
              data:[...dataInfo.DataRows],
              //dataInfo,
              }
              })
          }
        },

      *ResultSumbit({tYear,tableValue},{call,select,put}){
        let path=window.location.hash
        if(path.includes('middlelevel')){
         yield put({type:'middleSumbit',tableValue})
         return
        }
        const {data}= yield select(state => state.staffEvaluation);
        let InfoList=(data||[]).map((item)=>{
           let obj={}
            obj=tableValue[item.staff_id+""]
            obj["staff_id"]=item.staff_id
            obj["staff_name"]=item.staff_name
          return obj
        })
        let {RetCode,RetVal}=yield call(Service.ResultSumbit,{
          "e_year":tYear?tYear+"":defaultYear+"",
          "DataRows":JSON.stringify(InfoList)
          })
          if(RetCode=="1"){
            message.success("提交成功！",2," ")
            yield put({type:"staffInfo",tYear})
          } else{
            message.error(RetVal,2," ")
          }
        },
        
        //综合绩效评价
        *middleSumbit({tableValue},{call,select,put}){
            const {data,dataInfo}= yield select(state => state.staffEvaluation);
            var myDate = new Date();
            let new_Date=timeStamp(myDate.getTime())
            let submitList=new Array()
            submitList.push({"opt":"delete","table":"A1","data":{"login_name":window.localStorage["username"],"f_year":defaultYear}});
            for(let i =0;i<data.length;i++){
              submitList.push({"opt":"insert","table":"A1","data":{
                  login_name:window.localStorage["username"],
                  dept_id:data[i].deptid,
                  dept_name: data[i].deptname,
                  evaluate_item1: tableValue[data[i]['staff_id']]['创新能力'],
                  evaluate_item2: tableValue[data[i]['staff_id']]['协作配合'],
                  evaluate_item3: tableValue[data[i]['staff_id']]['执行能力'],
                  evaluate_item4: tableValue[data[i]['staff_id']]['职业道德'],
                  evaluate_sum: data[i]['ranking'],
                  staff_name:data[i]['staff_name'], 
                  staff_id:data[i]['staff_id'],
                  create_date:new_Date ,
                 // w_state: '1',
                  w_state: '0',
                  update_date:new_Date,
                  f_year:defaultYear
              }})
          }

               //debugger

          let {RetCode,RetVal}=yield call(Service.middleLeveSubmit,{
            withCredentials: true,
            transjsonarray:JSON.stringify(submitList)
            })
            if(RetCode=="1"){
              message.success("提交成功！",2," ")
              dataInfo.state=2
              yield put({type:"save",payload:{
                dataInfo:{...dataInfo}
              }})
            } else{
              message.error(RetVal,2," ")
            }
          },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/leader/middlelevel') {
          // let obj={     //开发时候先这样写，提交时候这段代码不用
          //   key: "middlelevel",
          //   name: "综合绩效评分",
          //   module_id: "880b3c0808db11e9a825008cfa042281"
          //   }
          //   let list=JSON.parse(window.localStorage.getItem("menu"))
          //   list[3].child[4].child[7]=obj
          //   let str=JSON.stringify(list)
          //   window.localStorage.setItem("menu",str)
          //   dispatch({type:"middleInfo"})
        }
        if(pathname === '/humanApp/employer/staffEvaluation'){
          dispatch({type:"staffInfo"})
        } 

      });
    },
  },
};

