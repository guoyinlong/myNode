import Cookie from "js-cookie";
import * as projAssessmentStandardServices from '../../../services/project/projAssessmentStandard';
import message from "../../../components/commonApp/message";
import { arrayToArrayGroups } from "../../../utils/func";
import ColumnGroup from "antd/lib/table/ColumnGroup";
import * as serviceDM from '../../../services/employer/empservices';
import moment from 'moment';
import * as serviceConfirmServices from "../../../services/project/serviceConfirm";
export default{
    namespace:"selectRemainder",

    state:{
        departmentName:"",
        projectData: [],
        queryData: [],
        year:"",
        years: [],
        season: "",
      deptList:[],
      showSelect:false
    },

    reducers:{
        save(state, action){
            return {
                ...state,
                ...action.payload,
            }
        },
        projQuerySuccess(state, {payload}) {
            return {
                ...state,
                ...payload
            };
        },
    },

    effects: {

        *inited(parm, { put, select ,call}) {

          const rolersp = yield call(projAssessmentStandardServices.rolePower,{'arg_userid':localStorage.getItem("staffid"),'arg_roleName':'项目制管理平台-项目考核管理-考核结果查询接口人'})
          let showSelect = false
          if (rolersp.RetCode == 1){
            showSelect = true
          }
            var year = moment().year().toString();
            var season = moment().quarter().toString();
            var years = []
          for(var yearIndex = (year - 3) ; yearIndex <= year; yearIndex++){
            years.push(yearIndex + "")
          }

          var departmentName = localStorage.getItem("deptname")
           var  req = {
                'arg_year':year,
                'arg_season':season,
                'arg_dept_name':departmentName,
            }

             const rsp = yield call(projAssessmentStandardServices.getRemainder,req)

            const projectData=[]

            if(rsp.RetCode=="1"){

                for (var index=0;index<rsp.DataRows.length;index++){

                    projectData.push({
                        'index':index,
                        'year':rsp.DataRows[index].year,
                        'season':rsp.DataRows[index].season,
                        'department':rsp.DataRows[index].dept_name,
                        'remainderA': rsp.DataRows[index].a_nums,
                        'remainderB': rsp.DataRows[index].b_nums,
                        'remainderC': rsp.DataRows[index].c_nums,

                    })
                }
            }
          let deptList = []
          if (rolersp.RetCode == 1){
            const deptRes = yield call(serviceConfirmServices.project_common_get_all_pu_department,{'arg_tenantid':10010})

            if(deptRes.RetVal){
              for(let index = 0; index<deptRes.DataRows.length; index++){

                deptList.push(deptRes.DataRows[index].pu_dept_name)
              }
            }
          }else{
            showSelect = true
            var deptListRsp = yield call(projAssessmentStandardServices.getDept,{'arg_manger_id':localStorage.getItem("userid") })

            for (let index = 0 ; index<deptListRsp.DataRows.length ; index++){

              deptList.push(deptListRsp.DataRows[index]['deptname'])
            }
          }
        yield put({
            type: "save",
            payload: {
                projectData,
                years,
                year,
                season,
              deptList,
              departmentName,
              showSelect
        }
        })

    },

        *projQuery ({payload}, { call, put, select }) {


            yield put({
            type: "save",
            payload: {

                ...payload,

        }} )

        },
        *updateDepartmentName(param, { put }) {
            yield put({
            type: "save",
            payload: {

                    departmentName: param.departmentName

            }
        })
        } ,
        *queryData (parm, { call, put, select }) {
            const {year,season,departmentName} = yield select(state => state.selectRemainder);


           var  req = {
                'arg_year':year,
                'arg_season':season,
                'arg_dept_name':departmentName,
            }

             const rsp = yield call(projAssessmentStandardServices.getRemainder,req)
            const projectData=[]
            if(rsp.RetCode=="1"){
                for (var index=0;index<rsp.DataRows.length;index++){
                    projectData.push({
                        'index':index,
                        'year':rsp.DataRows[index].year,
                        'season':rsp.DataRows[index].season,
                        'department':rsp.DataRows[index].dept_name,
                        'remainderA': rsp.DataRows[index].a_nums,
                        'remainderB': rsp.DataRows[index].b_nums,
                        'remainderC': rsp.DataRows[index].c_nums,

                    })
                }
            }
        yield put({
            type: "save",
            payload: {
                projectData,

        }
        })

        },
},

    subscriptions: {
        setup({ dispatch, history }) {
        return history.listen(({ pathname, query }) => {
            if (pathname === "/projectApp/projexam/remainder") {
                dispatch({ type: "inited", onload });
                }
            });
        },
    },
};
