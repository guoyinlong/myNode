/**
 * 作者：罗玉棋
 * 日期：2019-11-04
 * 邮箱：809590923@qq.com
 * 文件说明：中层互评-结果导入
 */
import * as usersService1 from '../../../services/employer/module.js'
import message from '../../../components/commonApp/message'
import Cookie from 'js-cookie';
const user_id = Cookie.get('userid');
//let defaultYear=new Date().getFullYear()
function reverse(array){
  var newArr = [];
  for(var i=array.length-1;i>=0;i--){
      newArr[newArr.length] = array[i];
  }
  return newArr;
}

export default {
  namespace: 'resultInfo',
  state: {
    data:[],
    loading:false,
    disabled:false,
    ban:false,
    yearList:["2019"]
  },

  reducers: {
 
    save(state, {payload}) {
      return { ...state, 
               ...payload
              };
    },
  },

  effects: { 

    *leaderEvalStateSearch({}, {call, put}) {
      const leaderRes = yield call(usersService1.mutualEvalStateSearch,
        {
          "arg_evalsys_type":"1"
        });
      if(leaderRes.RetCode==='1' && leaderRes.DataRows && leaderRes.DataRows.length){
        
        let arr=leaderRes.DataRows.map(item=>item.year).filter(item=>parseInt(item)>=2019)
        let res=reverse(arr)
        yield put({
          type: 'save',
          payload:{
            yearList:res
          }
         
        });
      }
      yield put({type:"staffInfo"})
    },

    *staffInfo({tYear,callback},{call,put,select}){
      let {yearList}=yield select((state) => state.resultInfo)
      yield put({type:"save",payload:{loading:true}})
      let {RetCode,RetVal,DataRows}=yield call(usersService1.staffInfo,{
        "arg_year":tYear?tYear:yearList[yearList.length-1],
        })
        if(RetCode=="1"){
          if(DataRows.length>0){
         
            DataRows.forEach((item,index)=>{
              item["key"]=index+1+""
              item["evaluate_sum"]?item["evaluate_sum"]:item["evaluate_sum"]=0
              item["per_score"]?item["per_score"]:item["per_score"]=0
            })
            yield put({
            type:"save",
            payload:{
            data:[...DataRows],
            loading:false
            }
            })
            yield put({type:"seachInfo",tYear})
           // message.success("查询成功！",2," ")
          }else{
            yield put({
              type:"save",
              payload:{
              data:[],
              loading:false
              }
              })
              message.warning("暂无数据",2," ")
          }
        
          if(callback)callback(false)
         

        } else{
          yield put({
            type:"save",
            payload:{
            data:[]
            }
            })
          message.error(RetVal,2," ")
          if(callback)callback(false)
        }
      },
 
      *submitInfo({tYear,personInfo,successBack},{call,put,select}){
        let {yearList}=yield select((state) => state.resultInfo)
        let {RetCode,RetVal}=yield call(usersService1.updateInfo,{
          "arg_year":tYear?tYear:yearList[yearList.length-1],
           "tag":1,
           "enterUserid":user_id,
           "leaderScore":JSON.stringify(Object.values(personInfo))
          })
          if(RetCode=="1"){
            
            message.success("保存成功！",2," ")
            
          // yield put({type:"staffInfo",tYear})
           if(successBack)successBack(true)
          } else{
            if(successBack)successBack(false)
            message.error(RetVal,2," ")
          }
        },


        *seachInfo({tYear},{call,put,select}){
          let {yearList}=yield select((state) => state.resultInfo)
          let {RetCode,RetVal,DataRows}=yield call(usersService1.seachInfo,{
            "arg_year":tYear?tYear:yearList[yearList.length-1]
            })
            if(RetCode=="1"){
              yield put({
                type:"save",
                payload:{
                disabled:DataRows[0].count==0?false:true,
                ban:DataRows[0].count==0?false:true,
                }
                })
        
            } else{
              message.error(RetVal,2," ")
            }
          },


  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/humanApp/leader/resultInfo') {//开发时候先这样写，提交时候这段代码不用
          dispatch({type:"leaderEvalStateSearch"})
        }
      });
    },
  },
};

