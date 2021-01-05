/**
 * 作者：王超
 * 创建日期：2017-11-20
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：项目考核-TMO
 */
import * as service from '../../services/projectKpi/projectKpiServices';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
    namespace : 'deatilKpiT',
    state : {
        TMOlistObj: [],
        year:"",
        season:"",
        suspending_season:"",
        TMODetailObj:[],
        numberDate:"",  // 年化人数
        hourDate:[],    // 工时数据
        financeDate:"", //成本费用
        OUDate:"",
        allFeeSumDate:"", // 全成本
        subDate:"", // 确认投资替代额
        totalScore:0, // 总分
        subScore:0,   // 包含固定指标总分
        kpi1:0,          //成本费用预算完成率
        kpi2:0,           // 投资产出收益比
        kpi3:0,           // 人均产能
        kpi4:0,          // 工时偏差率
        subkpi1:0,        // 效益指标总分
        tzHour:0,          //投资替代额确认工时
        showButton:false
    },

    reducers : {
    	r_getInfor(state,{year,season,suspending_season}){
    		return{
            	...state,
            	year,
            	season,
            	suspending_season
            };
    	},
		r_getTMOlist(state,{TMOlistObj,TMODetailObj,numberDate,hourDate,financeDate,OUDate,allFeeSumDate,subDate}){
        	return{
            	...state,
            	TMOlistObj,
            	TMODetailObj,
            	numberDate,
		        hourDate,
		        financeDate,
		        OUDate,
		        allFeeSumDate,
		        subDate,
            };
        },
        r_getTMODetail(state,{TMODetailObj,subDate,totalScore}){
        	return{
            	...state,
            	TMODetailObj,
            	subDate,
            	totalScore,
            	tzHour:TMODetailObj[0].plan_completion
            };
        },
        r_tzHour(state,{tzHour}){
        	return{
            	...state,
            	tzHour
            };
        },
        r_changeSubDate(state,{subDate}){
        	return{
            	...state,
            	subDate,
            	kpi2:0,
            	kpi3:0
            };
        },
        r_getProjectNumber(state,{numberDate}){
        	return{
            	...state,
            	numberDate
            };
        },
        r_getProjectHour(state,{hourDate}){
        	return{
            	...state,
            	hourDate
            };
        },
        r_getFinance(state,{financeDate}){

        	if(parseFloat(financeDate[0].implementation_cost_budget) != 0) {
        		let num = parseFloat(financeDate[0].implementation_cost_fee)/parseFloat(financeDate[0].implementation_cost_budget);
	        	let score = 0;
	        	if(num<1) {
	    				score = 100;
	    			} else {
	    				num = parseFloat(num%100);
	    				num = 100-(num.toFixed(2))*30;
	    				if(num<0) {
	    					score = 0;
	    				} else {
	    					score = num;
	    				}
	    			}

	        	return{
	            	...state,
	            	financeDate,
	            	kpi1:score
	           }
        } else {
          return{
            	...state,
            	financeDate,
            	kpi1:0
           }
	    }

        },
        r_getOU(state,{OUDate}){
        	return{
            	...state,
            	OUDate
            };
        },
        r_getAllFeeSum(state,{allFeeSumDate}){
        	return{
            	...state,
            	allFeeSumDate
            };
        },
        r_setTotalScore(state,{subScore}){

        	return{
            	...state,
            	subScore
            };
        },
        r_setSubkpi1(state){
        	let subNum = 0;
        	let Num1 = 0;
        	let Num2 = 0;
        	let Num3 = 0;
        	//let Num4 = 0;
        	Num1 = (parseFloat(state.kpi1)*(2)/100).toFixed(2);
    		Num2 = (parseFloat(state.kpi2)*(8)/100).toFixed(2);
    		Num3 = (parseFloat(state.kpi3)*(5)/100).toFixed(2);
    		//Num4 = (parseFloat(state.kpi4)*(7)/100).toFixed(2);
    		subNum = (parseFloat(Num1)+parseFloat(Num2)+parseFloat(Num3)).toFixed(2);
    		return{
            	...state,
            	subkpi1:subNum
            };
        },
        r_setkpi2Score(state){
        	if(state.allFeeSumDate !='' && state.subDate !='' && parseFloat(state.allFeeSumDate) != 0) {
        		let num = state.subDate/state.allFeeSumDate;
        		let score = 0;
        		if(num<1) {
    				score = (num*80).toFixed(2);
    			} else if(num>=1) {
    				score = (100+((num-1)*10)).toFixed(2);
    			}

    			return{
	            	...state,
	            	kpi2:score
	            };
        	} else {
        		return{
	            	...state
	            };
        	}

        },
        r_setkpi3Score(state){
        	if(state.numberDate !='' && state.subDate !=''&& parseFloat(state.numberDate[0].population_year) !=0) {
        		let num = parseFloat((state.subDate/10000)/state.numberDate[0].population_year);
        		let score = 0;
        		if(num>35) {
    				score = 100;
    			} else if(33<=num&&num<35) {
    				num = 35-num;
    				num = (100-num*10).toFixed(2);
    				if(num<0) {
    					score = 0;
    				} else {
    					score = num;
    				}
    			} else if(num<33) {
    				num = 33-num;
    				num = (100-num*20).toFixed(2);
    				if(num<0) {
    					score = 0;
    				} else {
    					score = num;
    				}
    			}

    			return{
	            	...state,
	            	kpi3:score
	            };
        	} else {
        		return{
	            	...state,
	            	kpi3:0
	            };
        	}
        },
        r_isSTMO(state,{flag}){
        	if(flag == 1) {
        		return{
	            	...state,
	            	showButton:true
	            };
        	} else {
        		return{
	            	...state,
	            	showButton:false
	            };
        	}

        },
        r_setkpi4Score(state){
        	if(state.hourDate[0] && state.tzHour != 0) {
        		let num = parseFloat(state.hourDate[0].total/state.tzHour).toFixed(4);

        		let score = 0;
        		if(num>=0.9 && num<=1.1) {
        			score = 100;
        		} else if((num>=0.8 && num<0.9) || (num>1.1&&num<=1.2)) {
        			score = 100-Math.abs(num-1)*100;
        		} else if((num>0.5 && num<0.8) || (num>1.2&&num<1.5)) {
        			score = 100-Math.abs(num-1)*150;
        		} else if(num>=1.5 || num<=0.5) {
        			score = 0;
        		}
        		if(score>100) {
    				score = 100;
    			} else if(score<0) {
    				score = 0;
    			}

        		return{
	            	...state,
	            	kpi4:score
	            };
        	} else {
        		return{
	            	...state,
	            	kpi4:0
	            };
        	}
        },
        r_getSubScore(state){

        	return{
	            ...state,
	            subScore:parseFloat(state.totalScore)+parseFloat(state.subkpi1)+parseFloat(state.kpi4)*(7)/100
	        };
        }
	},

    effects : {
    	*startKpi({params},{call, put}) {
          const { RetCode,RetVal }=yield call(service.startKpi,params);
          if(RetCode === "1") {
          	  message.success(RetVal);
          	  setTimeout(function(){
          	  	location.reload();
          	  },1000)

          }
        },
        *buildYearData({params},{call, put}) {
          const { RetCode,RetVal }=yield call(service.buildYearData,params);
          if(RetCode === "1") {
          	  message.success(RetVal);
          	  yield put({
	              type: 'getInfor'
	          });
          }
        },
        *getInfor({params},{call, put}) {
          const {DataRows,RetCode,suspending_season}=yield call(service.getInfor,params);
          if(RetCode === "1") {
	          yield put({
	              type: 'r_getInfor',
	              year:DataRows[0].year,
	              season:DataRows[0].season,
	              suspending_season:suspending_season
	          });
          }
        },

        *updateKpiNewFile({params,nexObj},{call, put}) {
            const {RetCode}=yield call(service.updateKpiFile,params);
            if(RetCode === '1') {
            	message.success('上传成功');
            } else {
            	message.error('上传失败');
            }
        },

        *updateKpiFile({params,nexObj},{call, put}) {
            const {RetCode}=yield call(service.updateKpiFile,params);
            if(RetCode === '1') {
            	yield put({
	                type: 'deleteKpiFile',
	                params:nexObj
	            });
            } else {
            	message.error('删除失败');
            }
        },

        *deleteKpiFile({params},{call, put}) {
            const {RetCode}=yield call(service.deleteKpiFile,params);
            if(RetCode === '1') {
            	message.success('删除成功');
            } else {
            	message.error('删除失败');
            }
        },

        *isSTMO({params},{call, put}) {
          const {RetCode,flag}=yield call(service.isSTMO,params);
          if(RetCode === "1") {
	          yield put({
	              type: 'r_isSTMO',
	              flag
	          });
          }
        },

        *getTMOlist({params},{call, put}) {
          const {DataRows,RetCode,RowCount}=yield call(service.getTMOlist,params);
          if(RetCode === "1" && RowCount !=0) {
	          yield put({
	                type: 'r_getTMOlist',
	                TMOlistObj:DataRows,
	                TMODetailObj:[],
					numberDate:"",
					hourDate:[],
					financeDate:"",
					OUDate:"",
					allFeeSumDate:"",
					subDate:"",
					totalScore:0, // 总分
			        subScore:0,
			        kpi1:0,
			        kpi2:0,
			        kpi3:0,
			        kpi4:0,
			        subkpi1:0,
			        tzHour:0
	          });
          } else {
          	yield put({
	                type: 'r_getTMOlist',
	                TMOlistObj:null,
	                TMODetailObj:[],
					numberDate:"",
					hourDate:[],
					financeDate:"",
					OUDate:"",
					allFeeSumDate:"",
					subDate:"",
					totalScore:0, // 总分
			        subScore:0,
			        kpi1:0,
			        kpi2:0,
			        kpi3:0,
			        kpi4:0,
			        subkpi1:0,
			        tzHour:0
	          });
          }
        },
        *getTMODetail({params},{call, put}) {
          const {DataRows,RetCode,RowCount}=yield call(service.getManagerDetail,params);
          if(RetCode === "1" && RowCount !=0) {
          	let score = 0;
          	for(let i=0; i<DataRows.length; i++){
          		if(!(DataRows[i].kpi_name ==="成本费用预算完成率" || DataRows[i].kpi_name ==="投资产出收益比" || DataRows[i].kpi_name ==="人均产能" || DataRows[i].kpi_name ==="工时偏差率")){
          			score += parseFloat(DataRows[i].kpi_score);
          		}
          	}

	          yield put({
	              type: 'r_getTMODetail',
	              TMODetailObj:DataRows,
	              subDate:(parseFloat(DataRows[0].replace_money)+parseFloat(DataRows[0].in_money)-parseFloat(DataRows[0].out_money)).toFixed(2),
	              totalScore:score.toFixed(2)
	          });

	          yield put({
	              type: 'r_setkpi2Score'
	          });

	          yield put({
	              type: 'r_setkpi3Score'
	          });

	          yield put({
	              type: 'r_setkpi4Score'
	          });

	          yield put({
	              type: 'r_setSubkpi1'
	          });

	          yield put({
	              type: 'r_getSubScore'
	          });
          }
        },
        *getProjectNumber({params},{call, put}) {
          const {DataRows,RetCode,RowCount}=yield call(service.getProjectNumber,params);
          if(RetCode === "1" && RowCount !=0) {
	          yield put({
	              type: 'r_getProjectNumber',
	              numberDate:DataRows
	          });

	          yield put({
	              type: 'r_setkpi3Score'
	          });

	          yield put({
	              type: 'r_setSubkpi1'
	          });

	          yield put({
	              type: 'r_getSubScore'
	          });
          }
        },
        *getProjectHour({params},{call, put}) {
          const {DataRows,RetCode,RowCount}=yield call(service.getProjectHour,params);
          if(RetCode === "1" && RowCount !=0) {
	          yield put({
	              type: 'r_getProjectHour',
	              hourDate:DataRows
	          });

	          yield put({
	              type: 'r_setkpi4Score'
	          });
	          yield put({
	              type: 'r_getSubScore'
	          });
          }
        },
        *getFinance({params},{call, put}) {
          const {DataRows,RetCode,RowCount}=yield call(service.getFinance,params);
          if(RetCode === "1" && RowCount !=0) {
	          yield put({
	              type: 'r_getFinance',
	              financeDate:DataRows
	          });

	          yield put({
	              type: 'r_setSubkpi1'
	          });

	          yield put({
	              type: 'r_getSubScore'
	          });
          }
        },
        *getOU({params,nextObj},{call, put}) {
          const {DataRows,RetCode,OUCount}=yield call(service.getOU,params);
          if(RetCode === "1" && OUCount !=0) {
	          yield put({
	              type: 'r_getOU',
	              OUDate:DataRows
	          });

	          if(OUCount === "1") {
	              yield put({
		              type: 'getAllFeeSum',
		              params:{
		              	argouone:DataRows[0].ou,
		              	arg_proj_id:nextObj.arg_proj_id,
		              	arg_total_year:nextObj.arg_total_year,
		              	arg_start_month:nextObj.arg_start_month,
		              	arg_end_month:nextObj.arg_end_month,
		              }
		          });
	          } else if(OUCount === "2") {
		          	yield put({
			              type: 'getAllFeeSum',
			              params:{
			              	argouone:DataRows[0].ou,
			              	argoutwo:DataRows[1].ou,
			              	arg_proj_id:nextObj.arg_proj_id,
			              	arg_total_year:nextObj.arg_total_year,
			              	arg_start_month:nextObj.arg_start_month,
			              	arg_end_month:nextObj.arg_end_month,
			              }
			        });
	          } else {
	          	yield put({
			              type: 'getAllFeeSum',
			              params:{
			              	argouone:DataRows[0].ou,
			              	argoutwo:DataRows[1].ou,
			              	argouthree:DataRows[2].ou,
			              	arg_proj_id:nextObj.arg_proj_id,
			              	arg_total_year:nextObj.arg_total_year,
			              	arg_start_month:nextObj.arg_start_month,
			              	arg_end_month:nextObj.arg_end_month,
			              }
			        });
	          }
          }
        },
        *getAllFeeSum({params},{call, put}) {
          const {cost_fee,isoutacct}=yield call(service.getAllFeeSum,params);
          if(isoutacct === "Y") {
	          yield put({
	              type: 'r_getAllFeeSum',
	              allFeeSumDate:cost_fee
	          });

	          yield put({
	              type: 'r_setkpi2Score'
	          });

	          yield put({
	              type: 'r_setSubkpi1'
	          });

	          yield put({
	              type: 'r_getSubScore'
	          });
          }
        },

        *isUpDateByTmo({params,data},{call, put}) {
          const {RetCode}=yield call(service.isUpDateByTmo,params);
          data.t_proj_kpi_data.push(data.t_proj_score_data);
          if(RetCode === "1") {
          	  data.t_proj_kpi_data.push(data.t_proj_money_info_data1);
	          yield put({
	              type: 'saveByTmo',
	              params:{
	              	"transjsonarray": JSON.stringify(data.t_proj_kpi_data),
	              	"season":params.arg_season,
	              	"year":params.arg_year,
	              	"type":params.type,
	              	"projId":data.projId
	              }
	          });
          } else {
          	  data.t_proj_kpi_data.push(data.t_proj_money_info_data2);
              yield put({
	              type: 'saveByTmo',
	              params:{
	              	"transjsonarray": JSON.stringify(data.t_proj_kpi_data),
	              	"season":params.arg_season,
	              	"year":params.arg_year,
	              	"type":params.type,
	              	"projId":data.projId
	              }
	          });
          }
        },
        *saveByTmo({params},{call, put}) {
          const {RetCode}=yield call(service.saveByTmo,{'transjsonarray':params.transjsonarray});
          if(RetCode === "1") {
          	if(params.type == 'save') {
          		message.success('保存成功！');
	            yield put(routerRedux.push({pathname:'/projectApp/projexam/examevaluate/projectList',query:{year:params.year,season:params.season}}));
          	} else {
          		yield put({
	              type: 'submintByTmo',
	              params:{
	              	arg_proj_id: params.projId,
	              	arg_season:params.season,
	              	arg_year:params.year
	              }
	          });
          	}
          } else {
          	if(params.type == 'save') {
          		message.error('保存失败');
          	} else {
          		message.error('提交失败');
          	}

          }
        },
        *submintByTmo({params},{call, put}) {
          const {RetCode}=yield call(service.submintByTmo,params);
          if(RetCode === "1") {
	          message.success('提交成功！');
	          yield put(routerRedux.push({pathname:'/projectApp/projexam/examevaluate/projectList',query:{year:params.year,season:params.season}}));
          } else {
          	message.error('提交失败');
          }
        }
    },
    subscriptions : {
		setup({ dispatch, history }) {
      		return history.listen(({ pathname,query }) => {
	        if (pathname === '/projectApp/projexam/examevaluate/projectList') {
	            dispatch({
	            	type: 'getTMOlist',
	            	params:{
		            	year:query.year,
		                season:query.season,
		                states:JSON.stringify([2,3,4,5,6])
		            }
	            });
	        }
	        if (pathname === '/projectApp/projexam/examevaluate') {
	            dispatch({type: 'getInfor'});
	            dispatch({
	            	type: 'isSTMO',
	            	params:{
		            	arg_userid:window.localStorage.userid,
		                arg_rolename:'项目制管理平台-项目考核-STMO'
		            }
	            });
	        }
	        if (pathname === '/projectApp/projexam/examevaluate/projectList/detailKpiTMO') {
	            dispatch({
	            	type: 'getTMODetail',
	            	params:{
		            	arg_year:query.arg_year,
		                arg_season:query.arg_season,
		                arg_proj_id:query.arg_proj_id,
		                arg_flag:0
		            }
	            });

	            if(query.arg_state === '4' || query.arg_state === '5') {
	            	dispatch({
		            	type: 'getProjectNumber',
		            	params:{
			            	arg_year:query.arg_year,
			                arg_season:query.arg_season,
			                arg_proj_id:query.arg_proj_id,
			            }
		            });

		            dispatch({
		            	type: 'getProjectHour',
		            	params:{
			            	arg_year:query.arg_year,
			                arg_season:query.arg_season,
			                arg_proj_id:query.arg_proj_id,
			            }
		            });

		            let startMonth = 0;
		            let endMonth = 0;
		            switch(query.arg_season){
						case '1':
						  startMonth = 1;
						  endMonth = 3;
						  break;
						case '2':
						  startMonth = 4;
						  endMonth = 6;
						  break;
						case '3':
						  startMonth = 7;
						  endMonth = 9;
						  break;
						case '4':
						  startMonth = 10;
						  endMonth = 12;
						  break;
					}
		            dispatch({
		            	type: 'getFinance',
		            	params:{
			            	argtotalyear:query.arg_year,
			                argprojid:query.arg_proj_id,
			                argstartmonth:startMonth,
			                argendmonth:endMonth
			            }
		            });

		            dispatch({
		            	type: 'getOU',
		            	params:{
			            	arg_flag:0,
			                arg_proj_id:query.arg_proj_id
			            },
			            nextObj:{
			            	arg_proj_id:query.arg_proj_id,
			            	arg_total_year:query.arg_year,
			            	arg_start_month:startMonth,
			            	arg_end_month:endMonth
			            }
		            });
	            }
	        }
	      });
	    }
    }
}
