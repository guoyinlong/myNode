/**
 * 作者：杨青
 * 日期：2018-5-8
 * 邮箱：yangq41@chinaunicom.cn
 * 文件说明：科技创新项目支出明细表
 */
import * as costService from '../../../../services/finance/costService';
export default {
  namespace: 'stcpCostDetail',
  state: {
    list:[],
    projList:[],
  },

  reducers: {
    initData(state){
      return {
        ...state,
        list:[],
        projList:[],
        projName:'',
        projCode:'',
        oneProjColumns:[],
        oneProjDetail:[],
      }
    },
    save(state,action) {
      return { ...state, ...action.payload};
    },
  },

  effects: {
    *init({}, { call, put }) {
      const time = new Date().toLocaleDateString();
      let year = time.split("/")[0];
      let month = time.split("/")[1];
      let postData = {};
      postData["arg_total_year"]=year;
      const pmsProjList = yield call(costService.getAllStcpProjDetail,postData);
      if (pmsProjList.RetCode==='1'){
        let projList = pmsProjList.DataRows;
        yield put({
          type: 'save',
          payload:{
            projList:projList,
            year:year,
            month:month,
          }
        });
      }
      let searchData = {};
      searchData["arg_total_year"]=year;
      searchData["arg_total_month"]=month;
      searchData["arg_total_type"]='3';
      yield  put({
        type: 'searchAllStcpProjCostDetail',
        searchData:searchData,
      })
    },
    /**
     * 作者：杨青
     * 创建日期：2018-05-10
     * 功能：查询某个科技创新项目的支出明细
     */
      *searchOneStcpProjCostDetail({searchData},{call,put}){
      if (searchData.arg_pms_proj_code!=='请选择项目名称'){
        const oneProjDetail = yield call(costService.searchOneStcpProjCostDetail,searchData);
        if (oneProjDetail.RetCode==='1'){
          let rowNum = [];
          if (oneProjDetail.pms_proj_name!==undefined){
            let n =0;
            /*for (let i=0;i<oneProjDetail.DataRows.length;i++){
              if(oneProjDetail.DataRows[i].fee_name==='小计'){
                if(n===0){
                  rowNum.push({
                    index:i,
                    rowSpan:i+1,
                  })
                } else {
                  rowNum.push({
                    index:i,
                    rowSpan:i-rowNum[n-1].index-1,
                  })
                }
                n++;
              }
            }
            console.log('rowNum:',rowNum);*/

            for (let i=0;i<oneProjDetail.DataRows.length;i++){
              if(oneProjDetail.DataRows[i].fee_type!==oneProjDetail.DataRows[0].fee_type){
                if (n===0){
                  rowNum.push({
                    index:i-2,
                    rowSpan:i-1,
                    feeType:oneProjDetail.DataRows[0].fee_type,
                  })
                  n++;
                } else if (oneProjDetail.DataRows[i].fee_type!==oneProjDetail.DataRows[i-1].fee_type){
                  rowNum.push({
                    index:i-2,
                    rowSpan:i-rowNum[n-1].index-3,
                    feeType:oneProjDetail.DataRows[i-1].fee_type,
                  })
                  n++;
                }
              }
            }

            //console.log('rowNum:',rowNum);

            let columns = [
              {
                title: '支出性质',
                dataIndex: 'fee_type',
                width: '100px',
                render: (value, row, index) =>{
                  const obj = {
                    children:<div style={{textAlign:'right'}}>{value}</div>,
                    props:{},
                  };
                  if (index===0){
                    obj.props.rowSpan=rowNum[0].rowSpan;
                  } else{
                    for (let i=1;i<rowNum.length;i++){
                      if (index === rowNum[i-1].index+2){
                        obj.props.rowSpan=rowNum[i].rowSpan;
                      } else if ((index === rowNum[i].index+1)||(index===rowNum[0].index+1)||(index === oneProjDetail.DataRows.length-1)){
                        obj.props.colSpan = 0;
                      } else {
                        obj.props.rowSpan=0;
                      }
                    }
                  }
                  return obj;
                }
              },
              {
                title: '支出类别',
                dataIndex: 'fee_name',
                width: '150px',
                render:(value, row, index) =>{
                  const obj = {
                    children:<div style={{textAlign:'right'}}>{value}</div>,
                    props:{},
                  };
                  for (let i=0;i<rowNum.length;i++){
                    if ((index === rowNum[i].index+1)||(index === oneProjDetail.DataRows.length-1)){
                      obj.props.colSpan = 2;
                    }
                  }
                  return obj;
                }
              },
            ];

            let list = [];
            for (let item in oneProjDetail.DataRows[0]) {
              if (item !== 'fee_type' && item !== 'fee_name') {
                list.push(item);
              }
            }

            for (let i = 0; i< list.length; i++) {
              if (i===0){
                columns.push({
                  title:list[0],
                  dataIndex:list[0],
                  width: '200px',
                  render:(value, row, index)=>{
                    const obj = {
                      children:<div style={{textAlign:'right'}}>{value}</div>,
                      props:{},
                    };
                    for (let i=0;i<rowNum.length;i++){
                      if ((index === rowNum[i].index+1)||(index === oneProjDetail.DataRows.length-1)){
                        obj.props.colSpan = list.length;
                      }
                    }

                    return obj;
                  }
                });
              }else if (i>0){
                columns.push({
                  title:list[i],
                  dataIndex:list[i],
                  width: '200px',
                  render:(value, row, index)=>{
                    const obj = {
                      children:<div style={{textAlign:'right'}}>{value}</div>,
                      props:{},
                    };
                    for (let i=0;i<rowNum.length;i++){
                      if ((index === rowNum[i].index+1)||(index === oneProjDetail.DataRows.length-1)){
                        obj.props.colSpan = 0;
                      }
                    }
                    return obj;
                  }
                });
              }
            }

            yield put({
              type: 'save',
              payload:{
                oneProjDetail:oneProjDetail.DataRows,
                year:searchData.arg_total_year,
                month:searchData.arg_total_month,
                projName:oneProjDetail.pms_proj_name,
                projCode:oneProjDetail.pms_proj_code,
                oneProjColumns:columns,
                rowNum:rowNum,
              }
            });
          }else {
            yield put({
              type: 'save',
              payload:{
                year:searchData.arg_total_year,
                month:searchData.arg_total_month,
                projName:'',
                projCode:'',
                oneProjColumns:[],
                oneProjDetail:[],
              }
            });
          }
        }
      }


    },
    /**
     * 作者：杨青
     * 创建日期：2018-05-10
     * 功能：所有科技创新项目的汇总
     */
      *searchAllStcpProjCostDetail({searchData},{call,put}){
      const allProjDetail = yield call(costService.searchAllStcpProjCostDetail,searchData);
      if (allProjDetail.RetCode==='1'){
        if (allProjDetail.DataRows.length!==0){
          let rowNum = [];
          let n = 0;
          for (let i=0;i<allProjDetail.DataRows.length;i++){
            if(allProjDetail.DataRows[i].fee_type!==allProjDetail.DataRows[0].fee_type){
              if (n===0){
                rowNum.push({
                  index:i-2,
                  rowSpan:i-1,
                  feeType:allProjDetail.DataRows[0].fee_type,
                })
                n++;
              } else if (allProjDetail.DataRows[i].fee_type!==allProjDetail.DataRows[i-1].fee_type){
                rowNum.push({
                  index:i-2,
                  rowSpan:i-rowNum[n-1].index-3,
                  feeType:allProjDetail.DataRows[i-1].fee_type,
                })
                n++;
              }
            }
          }

          //console.log('rowNum:',rowNum);
          let columns = [
            {
              title: '支出性质',
              dataIndex: 'fee_type',
              width: '100px',
              render: (value, row, index) =>{
                const obj = {
                  children:<div style={{textAlign:'right'}}>{value}</div>,
                  props:{},
                };
                if (index===0){
                  obj.props.rowSpan=rowNum[0].rowSpan;
                }else{
                  for (let i=1;i<rowNum.length;i++){
                    if (index === rowNum[i-1].index+2){
                      obj.props.rowSpan=rowNum[i].rowSpan;
                    } else if ((index === rowNum[i].index+1)||(index===rowNum[0].index+1)||(index === allProjDetail.DataRows.length-1)){
                      obj.props.colSpan = 0;
                    } else {
                      obj.props.rowSpan=0;
                    }
                  }
                }
                return obj;
              }
            },
            {
              title: '支出类别',
              dataIndex: 'fee_name',
              width: '150px',
              render:(value, row, index) =>{
                const obj = {
                  children:<div style={{textAlign:'right'}}>{value}</div>,
                  props:{},
                };
                for (let i=0;i<rowNum.length;i++){
                  if ((index === rowNum[i].index+1)||(index === allProjDetail.DataRows.length-1)){
                    obj.props.colSpan = 2;
                  }
                }
                return obj;
              }
            },
          ];

          let list = [];
          for (let item in allProjDetail.DataRows[0]) {
            if (item !== 'fee_type' && item !== 'fee_name') {
              list.push(item);
            }
          }

          for (let i = 0; i< list.length; i++) {
            if (i===0){
              columns.push({
                title:list[0],
                dataIndex:list[0],
                width: '200px',
                render:(value, row, index)=>{
                  const obj = {
                    children:<div style={{textAlign:'right'}}>{value}</div>,
                    props:{},
                  };
                  for (let i=0;i<rowNum.length;i++){
                    if ((index === rowNum[i].index+1)||(index === allProjDetail.DataRows.length-1)){
                      obj.props.colSpan = list.length;
                    }
                  }
                  return obj;
                }
              });
            }else if (i>0){
              columns.push({
                title:list[i],
                dataIndex:list[i],
                width: '200px',
                render:(value, row, index)=>{
                  const obj = {
                    children:<div style={{textAlign:'right'}}>{value}</div>,
                    props:{},
                  };
                  for (let i=0;i<rowNum.length;i++){
                    if ((index === rowNum[i].index+1)||(index === allProjDetail.DataRows.length-1)){
                      obj.props.colSpan = 0;
                    }
                  }
                  return obj;
                }
              });
            }
          }

          yield put({
            type: 'save',
            payload:{
              allProjDetail:allProjDetail.DataRows,
              stcpAllYear:searchData.arg_total_year,
              stcpAllMonth:searchData.arg_total_month,
              allProjColumns:columns,
              expExlorNot:true,
              rowNum:rowNum,
            }
          });
        }else {
          yield put({
            type: 'save',
            payload:{
              allProjDetail:[],
              stcpAllYear:searchData.arg_total_year,
              stcpAllMonth:searchData.arg_total_month,
              allProjColumns:[],
              expExlorNot:false,
            }
          });
        }
      }


    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/financeApp/cost_proj_fullcost_mgt/stcp_cost_detail') {
          dispatch({ type: 'initData',query });
          dispatch({ type: 'init',query });
        }
      });
    },
  },
};
