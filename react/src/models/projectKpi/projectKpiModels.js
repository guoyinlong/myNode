/**
 * 作者：王超
 * 创建日期：2017-11-20
 * 邮箱：wangc235@chinaunicom.cn
 * 文件说明：项目考核
 */
import * as service from '../../services/projectKpi/projectKpiServices';
export default {
  namespace : 'projectKpi',
  state : {
      DataRows: null,
      title:"",
      file_name:"",
      file_relativepath:"",
      year:"",
      season:"",
      mgr_id:"",
      mgr_name:"",
      proj_dept_name:"",
      score:"",
      deptInfor:null,
      scoreTable:null
  },

  reducers : {
    r_selectList(state,{DataRows,title,file_name,file_relativepath,year,season,mgr_id,mgr_name,proj_dept_name,score}){
        switch(season) {
			case '0':
			    season = '年度';
			    break;
			case '1':
			    season = '第一季度';
			    break;
			case '2':
			    season = '第二季度';
			    break;
			case '3':
			    season = '第三季度';
			    break;
			case '4':
			    season = '第四季度';
			    break;
			default:
			    season;
		}
      return{
        ...state,
        DataRows,
        title,
        file_name,
        file_relativepath,
        year,
        season,
        mgr_id,
        mgr_name,
        proj_dept_name,
        score
      };
    },
    r_selectDetail(state,{scoreTable,title,file_name,file_relativepath,year,season,mgr_id,mgr_name,proj_dept_name,score}){
        switch(season) {
			case '0':
			    season = '年度';
			    break;
			case '1':
			    season = '第一季度';
			    break;
			case '2':
			    season = '第二季度';
			    break;
			case '3':
			    season = '第三季度';
			    break;
			case '4':
			    season = '第四季度';
			    break;
			default:
			    season;
		}
      return{
        ...state,
        scoreTable,
        title,
        file_name,
        file_relativepath,
        year,
        season,
        mgr_id,
        mgr_name,
        proj_dept_name,
        score
      };
    },
    r_getDeptInfor(state,{deptInfor}){
      return{
        ...state,
        deptInfor
      };
    },
    r_cleanData(state){
      return{
        ...state,
        DataRows:null
      };
    }
  },

  effects : {
    *selectList({params}, {call, put}) {
      const {DataRows,RowCount}=yield call(service.selectproject, params);
      if(RowCount !=0 ) {
      	  yield put({
	          type: 'r_selectList',
	          DataRows,
	          title:DataRows[0].proj_name,
	          file_name:DataRows[0].file_name,
	          file_relativepath:DataRows[0].file_relativepath,
	          year:DataRows[0].year,
	          season:DataRows[0].season,
	          mgr_id:DataRows[0].mgr_id,
	          mgr_name:DataRows[0].mgr_name,
	          proj_dept_name:DataRows[0].proj_dept_name,
	          score:DataRows[0].score
          });
      } else {
      	yield put({
	          type: 'r_selectList',
	          DataRows:[],
	          title:"",
	          file_name:"",
	          file_relativepath:"",
	          year:"",
	          season:"",
	          mgr_id:"",
	          mgr_name:"",
	          proj_dept_name:"",
	          score:""
          });
      }
    },
    *selectDetail({params}, {call, put}) {
      const {DataRows,RowCount}=yield call(service.selectproject, params);
      if(RowCount !=0 ) {
      	  yield put({
	          type: 'r_selectDetail',
	          scoreTable:DataRows,
	          title:DataRows[0].proj_name,
	          file_name:DataRows[0].file_name,
	          file_relativepath:DataRows[0].file_relativepath,
	          year:DataRows[0].year,
	          season:DataRows[0].season,
	          mgr_id:DataRows[0].mgr_id,
	          mgr_name:DataRows[0].mgr_name,
	          proj_dept_name:DataRows[0].proj_dept_name,
	          score:DataRows[0].score
          });
      } else {
      	yield put({
	          type: 'r_selectDetail',
	          scoreTable:null,
	          title:"",
	          file_name:"",
	          file_relativepath:"",
	          year:"",
	          season:"",
	          mgr_id:"",
	          mgr_name:"",
	          proj_dept_name:"",
	          score:""
          });
      }
    },
    *getDeptInfor({params}, {call, put}) {
      const {DataRows,RetCode}=yield call(service.selectDept, params);
      if(RetCode !=0 ) {
      	  yield put({
	          type: 'r_getDeptInfor',
	          deptInfor:DataRows
          });
      }
    }
},
  subscriptions : {
	setup({ dispatch, history }) {
		return history.listen(({ pathname,query }) => {
		    if (pathname === '/projectApp/projexam/examquery') {
		        dispatch({
		        	type: 'getDeptInfor',
		        	params:{
		            	arg_tenantid:'10010'
		            }
		        	});
		    }

		    if (pathname === '/projectApp/projexam/examquery/proList') {
		    	dispatch({type: 'getDeptInfor'});
		    	dispatch({type: 'r_cleanData'});
		        dispatch({
		        	type: 'selectList',
		        	params:{
		            	arg_page_current:'1',
						arg_page_size:'',
						proj_name:"",
						proj_id:'',
						proj_dept_name:query.dept,
						//proj_dept_name:'公共平台与架构部',
						season:"",
						year:"",
						states:JSON.stringify([6])
		            }
		        });
		    }
	    });
	}
  }
}
