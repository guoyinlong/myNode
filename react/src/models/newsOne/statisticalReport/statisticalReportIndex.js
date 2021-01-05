/**
 * 作者：郭银龙
 * 日期：2020-10-12
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：统计报表
 */
import Cookie from 'js-cookie'; 
import { message } from "antd";
import { routerRedux } from 'dva/router';
import * as myserver from '../../../services/newsOne/newsOneServers';
 
export default {
  namespace: 'statisticalReport',
  state: {
    tjbbList:[],//统计报表
    tjbbList2:[],//统计报表列表二级
    xczzList:[],//宣传组织
    gjfhList:[],//稿件复核
    jfxList:[],//加分项
    jfList:[],//积分
    jfguizhe:"",
    //统计列表
    inputvalue1:"",
    inputvalue2:"",
    inputvalue3:"",
    inputvalue4:"",
    // inputvalue5:0,
    //统计图表
    inputvalue6:"",
    inputvalue7:"",
    qudaoDataList:[],
    channelValue:"",
    reportList:[],
    //排名
    gerenList:[],
    namepaiming:'',
    deptList:[],
    zhibuList:[],
   

  },
  reducers: {
    save(state, action) {
      return { ...state,
        ...action.payload
      };
    },
  },
  effects: {
   

  //统计报表
  * tjbbSearch({page,inputvalue1, inputvalue2,inputvalue3,inputvalue4,inputvalue5}, {call, put}){
  let recData = {
    userid: Cookie.get('userid'),
    deptName:inputvalue1?inputvalue1:"",//条件查询，不传时默认查询所有统计报告
    submitTime:inputvalue2?inputvalue2:"",
    submitName:inputvalue3?inputvalue3:"",
    newsName:inputvalue4?inputvalue4:"",
    pubState:inputvalue5?inputvalue5:"",
    pageCurrent:page?page:1,//表示请求第几页, 从1开始, 必须是正整数，默认为第1页
    pageSize:10,//表示每页数量，必须是正整数,默认为所有
  };
      const response = yield call(myserver.tjbb,recData ); 
      if(response.retCode === '1'){
        if(response.dataRows.length>0){
          const res = response.dataRows;
          let array= []
          const {allCount,pageSize,pageCurrent} =response
          res.map((item,index)=>{
            item.key=index;
          })
          if(res.length>0){
            array.push({sum:res[0].sum,key:"id"})
          }
          
          yield put({
            type:'save',
            payload:{
              tjbbList:res,
              alllist:array,
              allCount:allCount,//总数 
              pageCurrent:pageCurrent,//第几页
              pageSize:pageSize,//页面大小
            }
          })
        }
      }else{
        message.error(response.retVal);
      }
  },  
  * tjbbSearch2({id}, {call, put}){
  let recData = {
    userid: Cookie.get('userid'),
    deptId:id?id:"",//条件查询，不传时默认查询所有统计报告
  };
      const response = yield call(myserver.queryStatisticsListTwo,recData ); 
      if(response.retCode === '1'){
        if(response.dataRows){
          const res = response.dataRows;
          res.map((item,index)=>{
            item.key=index;
          })
          const {allCount,pageCount,pageCurrent,rowCount} =response
          yield put({
            type:'save',
            payload:{
              tjbbList2:res,
              allCount:allCount,//总数 
              pageCount:pageCount,
              arg_page_current:pageCurrent,//第几页
              arg_page_size:rowCount,//页面条数
            }
          })
        }
      }else{
        message.error(response.retVal);
      }
  },  
  //统计图表
  * tjtbSearch({inputvalue6,inputvalue7}, {call, put}){
    var date=new Date;
    var y = date.getFullYear()
    let recData = {
      userid: Cookie.get('userid'),
      timeTemp:inputvalue6?inputvalue6:y ,
      deptId:inputvalue7?inputvalue7:"",
    };
      const response = yield call(myserver.TJTBReport, recData);
      const bmlist = yield call(myserver.checkObjectAndContent, );
                if(response.retCode == '1'){
                  if(response.dataRows){ 
                    const res = response.dataRows;
                    yield put({
                      type:'save',
                      payload:{
                        reportList:res,
                        qudaoDataList:bmlist.dataRows,
                      }
                    })
				  }
                }else {
                  message.error(response.retVal);
              }
    },  
 
    //点击统计图横坐标
  * onMyChart({value}, {call, put,select}){
      const {timeTemp} = yield select(v =>v.statisticalReport)
      let recData = {
        userid: Cookie.get('userid'),
        timeTemp:timeTemp?timeTemp:"2020",
        ouName:value,
      };
        const response = yield call(myserver.myechartReport, recData);
                  if(response.retCode == '1'){
                    if(response.dataRows){ 
                      const res = response.dataRows;
                      yield put({
                        type:'save',
                        payload:{
                          MyChartValue:res
                        }
                      })
                    }
                  }else {
                    message.error("暂无数据");
                }
      },  
    //积分排名
  * naneSearch({page,nameRanking,}, {call, put}){
    let recData = {
      userid: Cookie.get('userid'),
      name:nameRanking?nameRanking:"",
      pageCurrent:page==undefined?1:page,//表示请求第几页, 从1开始, 必须是正整数，默认为第1页
      pageSize:10,//表示每页数量，必须是正整数,默认为所有
    };
    const response = yield call(myserver.gerenRanking,recData ); 
    const namepaimingData = yield call(myserver.loginUserRank,recData ); 
    if(response.retCode === '1'){
      if(response.dataRows){
        const res = response.dataRows;
        let array= []
        const {allCount,pageCount,pageCurrent,rowCount} =response
        res.map((item,index)=>{
          item.key=index;
        })
        if(res.length>0){
           array.push({totalNumber:res[0].totalNumber,totalScore:res[0].totalScore,key:"keyid"})
        }
       
        yield put({
          type:'save',
          payload:{
            gerenList:res,
            gerenList2:array,
            allCount:allCount,//总数
            pageCount:pageCount,//总页数
            pageCurrent:pageCurrent,//第几页
            rowCount:rowCount,//页面条数
            namepaiming:namepaimingData.dataRows
          }
        })
      }
    }else{
      message.error(response.retVal);
    }
    }, 
  *deptSearch({page,deptRanking}, {call, put}){
    let recData = {
      userid: Cookie.get('userid'),
      name:deptRanking?deptRanking:"",
      pageCurrent:page==undefined?1:page,//表示请求第几页, 从1开始, 必须是正整数，默认为第1页
      pageSize:1,//表示每页数量，必须是正整数,默认为所有
    };
    const response = yield call(myserver.deptRanking,recData ); 
    if(response.retCode === '1'){
      if(response.dataRows){
        const res = response.dataRows;
        let array= []
        const {allCount,pageCount,pageCurrent,rowCount} =response
        if(res.length>0){
          array.push({totalNumber:res[0].totalNumber,totalScore:res[0].totalScore,key:"keyid"})
        }
        
        res.map((item,index)=>{
          item.key=index;
        })
        yield put({
          type:'save',
          payload:{
            deptList:res,
            gerenList2:array,
            allCount:allCount,//总数
            pageCount:pageCount,//总页数
            pageCurrent:pageCurrent,//第几页
            rowCount:rowCount,//页面条数
          }
        })
      }
    }else{
      message.error(response.retVal==""?"查询失败":response.retVal);
    }
  }, 
  *zhibuSearch({page,zhibuRanking}, {call, put}){
    let recData = {
      userid: Cookie.get('userid'),
      name:zhibuRanking?zhibuRanking:"",
      pageCurrent:page==undefined?1:page,//表示请求第几页, 从1开始, 必须是正整数，默认为第1页
      pageSize:1,//表示每页数量，必须是正整数,默认为所有
    };
      const response = yield call(myserver.zhibuRanking, recData); 
      if(response.retCode === '1'){
        if(response.dataRows){
          const res = response.dataRows;
          let array= []
          const {allCount,pageCount,pageCurrent,rowCount} =response
          if(res.length>0){
            array.push({totalNumber:res[0].totalNumber,totalScore:res[0].totalScore,key:"keyid"})
          }
          res.map((item,index)=>{
            item.key=index;
          })
          yield put({
            type:'save',
            payload:{
              zhibuList:res,
              gerenList2:array,
              allCount:allCount,//总数
              pageCount:pageCount,//总页数
              pageCurrent:pageCurrent,//第几页
              rowCount:rowCount,//页面条数
            }
          })
        }
      }else{
        message.error(response.retVal);
      }
    },  
  //宣传组织
  * xczzSearch({ page,inputvalue8,inputvalue9}, {call, put}){
    let recData = {
      userid: Cookie.get('userid'),
      thoughtName:inputvalue8,
      createTime:inputvalue9,
      pageCurrent:page==undefined?1:page,//表示请求第几页, 从1开始, 必须是正整数，默认为第1页
      pageSize:10,//表示每页数量，必须是正整数,默认为所有
    };
    const response = yield call(myserver.xczz,recData );
    if(response.retCode === '1'){
      if(response.dataRows){
        const res = response.dataRows;
        const {allCount,pageCount,pageCurrent,rowCount} =response
        res.map((item,index)=>{
          item.key=index;
          if (item.zhuangtai == "0") {
            item.zhuangtai = "草稿"
          } else if (item.zhuangtai == "1") {
            item.zhuangtai = "退回"
          }else if (item.zhuangtai == "2") {
            item.zhuangtai = "待部门经理审核"
          }else if (item.zhuangtai == "3") {
            item.zhuangtai = "审核通过"
          }
          
        })
        yield put({
          type:'save',
          payload:{
              xczzList:res,
              allCount:allCount,//总数
              pageCount:pageCount,//总条数
              pageCurrent:pageCurrent,//第几页
              rowCount:rowCount,//页面条数
          }
        })
      }
    }else {
      message.error(response.retVal);
  }
  },
  //宣传组织新增
  // addProOrganization
  *xczzdelete({id}, {call, put}){
    let recData = {
      userid: Cookie.get('userid'),
      id:id?id:"",
    };
    const response = yield call(myserver.xczzDelept,recData);
    if(response.retCode === '1'){
        message.success("删除成功");
        yield put({
          type: 'xczzSearch',
        });
    }else {
      message.error(response.retVal);
    }
  },
  //稿件复核
  * gjfhSearch({page, inputvalue10,inputvalue11}, {call, put}){
    let recData = {
      userid: Cookie.get('userid'),
      name:inputvalue10?inputvalue10:"",//稿件名称
      date:inputvalue11?inputvalue11:"",//稿件时间
      pageCurrent:page==undefined?1:page,//表示请求第几页, 从1开始, 必须是正整数，默认为第1页
      pageSize:10,//表示每页数量，必须是正整数,默认为所有
    };
    const response = yield call(myserver.gjfh,recData);
    if(response.retCode === '1'){
      if(response.dataRows){
        const res = response.dataRows;
        const {allCount,pageCurrent,pageSize} =response
        res.map((item,index)=>{
          item.key=index;
        })
        yield put({
          type:'save',
          payload:{
            gjfhList:res,
            allCount:allCount,//总条数
            pageCurrent:pageCurrent,//第几页
            pageSize:pageSize,//页面条数
          }
        })
      }
    

    }else {
      message.error(response.retVal);
  }
  },
  *deleteNewsCheck({id}, {call, put}){
    let recData = {
      userid: Cookie.get('userid'),
      id:id?id:"",
    };
    const response = yield call(myserver.deleteNewsCheck,recData);
    if(response.retCode === '1'){
        message.success("删除成功");
        yield put({
          type: 'gjfhSearch',
        });
    }else {
      message.error(response.retVal);
  }
  },
      //加分项
  * jfxSearch({ page,inputvalue12}, {call, put}){
    let recData = {
      userid: Cookie.get('userid'),
      name:inputvalue12?inputvalue12:"",
      pageCurrent:page==undefined?1:page,//表示请求第几页, 从1开始, 必须是正整数，默认为第1页
      pageSize:10,//表示每页数量，必须是正整数,默认为所有
    };
      const response = yield call(myserver.jfx,recData);
      if(response.retCode === '1'){
        if(response.dataRows){
          const res = response.dataRows;
          const {allCount,pageCount,pageCurrent,pageSize} =response
          res.map((item,index)=>{
            item.key=index;
            if (item.zhaungtai == "0") {
              item.zhaungtai = "草稿"
            } else if (item.zhaungtai == "1") {
              item.zhaungtai = "退回"
            }else if (item.zhaungtai == "2") {
              item.zhaungtai = "待部门经理审核"
            } else if (item.zhaungtai == "3") {
              item.zhaungtai = "审核通过"
            }
          })
          yield put({
            type:'save',
            payload:{
              jfxList:res,
              allCount:allCount,//总条数
              pageCurrent:pageCurrent,//第几页
              pageSize:pageSize,//页面条数
            }
          })
        }
      }else {
        message.error(response.retVal);
    }
    },
  *deleteBonusItem({id}, {call, put}){
    let recData = {
      userid: Cookie.get('userid'),
      id:id?id:"",
    };
    const response = yield call(myserver.deleteBonusItem,recData);
    if(response.retCode === '1'){
        message.success("删除成功");
        yield put({
          type: 'jfxSearch',
        });
    }else {
      message.error(response.retVal);
  }
  },

    //积分查询
  * jfSearch({ page,inputvalue14,inputvalue15}, {call, put}){
    let recData = {
      userid: Cookie.get('userid'),
      flag:inputvalue14?inputvalue14:"0",
      condition:inputvalue15?inputvalue15:"",
      pageCurrent:page==undefined?1:page,//表示请求第几页, 从1开始, 必须是正整数，默认为第1页
      pageSize:10,//表示每页数量，必须是正整数,默认为所有
    };
      const response = yield call(myserver.jf,recData);
      if(response.retCode === '1'){
        if(response.dataRows){
          const res = response.dataRows;
          const {allCount,pageCount,pageCurrent,rowCount} =response
          res.map((item,index)=>{
            item.key=index;
          })
          yield put({
            type:'save',
            payload:{
              jfList:res,
              jifenvalue: res[0].score?res[0].score:res[0].deptPoints,
              pageCount:pageCount,//总条数
              pageCurrent:pageCurrent,//第几页
              rowCount:rowCount,//页面条数
            }
          })
        }
      }else {
        message.error(response.retVal);
    }
    },
      //积分规则
  * jfguizhe({ }, {call, put}){
      const response = yield call(myserver.reaultSerch);
      if(response.retCode =='1'){
        if(response.dataRows){
          const res = response.dataRows;
          yield put({
            type:'save',
            payload:{
              jfguizhe:res,
            }
          })
        }
      }else {
        message.info("暂无相关文件");
    }
    },
  //积分修改value 
  *setPoints({ score}, {put}) { 
  yield put({
    type:'save',
    payload:{
      jifenvalue: score,
    }
  })
    },
  *jfmodify({record}, {put}) { 
    yield put({
      type:'save',
      payload:{
        jifenvalue: record,
      }
    })
      },
  //积分修改
  * jfSet({id,flag}, {call, put,select}){
  const{jifenvalue} = yield select(v =>v.statisticalReport)
  let recData = {
    id:id,
    score:jifenvalue?jifenvalue:"",
    flag:flag//0个人1部门2支部
  };
    const response = yield call(myserver.jfSet,recData);
    if(response.retCode === '1'){
      yield put({
        type:'jfSearch',
        inputvalue14:flag
      })
      message.success("修改成功");

    }else {
      message.error(response.retVal);
  }
  },

  }, 

  subscriptions: {
    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/adminApp/newsOne/statisticalReport') { //此处监听的是连接的地址
          dispatch({
            type: 'tjbbSearch',
            query
          });
        }
      });
    },
  },
};
