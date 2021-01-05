import Cookie from "js-cookie";
import * as projAssessmentStandardServices from '../../../services/project/projAssessmentStandard';
import message from "../../../components/commonApp/message";
import { arrayToArrayGroups } from "../../../utils/func";
import ColumnGroup from "antd/lib/table/ColumnGroup";
import * as serviceDM from '../../../services/employer/empservices';
import moment from 'moment';
import * as serviceConfirmServices from "../../../services/project/serviceConfirm";
export default{
    namespace:"resultQuery",

    state:{
        name:"",
        projectData: [],
        queryData: [],
        ou:"",
        pm:'',
        startYear:'',
        startSeason:'',
        endYear:'',
        endSeason:'',
        syears:[],
        eyears:[],
      deptList:[],
      showSelect:false,
      department:""
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

        *inited(parm, {call, put, select }) {
            const rolersp = yield call(projAssessmentStandardServices.rolePower,{'arg_userid':localStorage.getItem("staffid"),'arg_roleName':'项目制管理平台-项目考核管理-考核结果查询接口人'})
            let showSelect = false

            var startYear = moment().year().toString();
            var startSeason = moment().quarter().toString();
            var endYear = moment().year().toString();
            var endSeason = moment().quarter().toString();

                var department = localStorage.getItem("deptname")
            const rsp = yield call(projAssessmentStandardServices.showRating,{"arg_dept_name":department,"arg_start_year":startYear,"arg_start_season":startSeason,"arg_end_year":endYear,"arg_end_season":endSeason})
            var syears=[]
            var eyears=[]
          for(var yearIndex = (startYear - 3) ; yearIndex <= startYear; yearIndex++){
            syears.push(yearIndex + "")
            eyears.push(yearIndex + "")
          }
            var projectData = []

                for(let data in rsp.data) {

                  projectData.push(rsp.data[data])
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

            var ou = department

             yield put({
                type: "save",
                payload: {
                    projectData,
                    startYear,
                    startSeason,
                    endYear,
                    endSeason,
                    syears,
                    eyears,
                    ou,
                  deptList,
                  showSelect,

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
        *updateOUName(param, { put }) {
            yield put({
            type: "save",
            payload: {

                    ou: param.ou

            }
        })
        } ,

        *queryData (parm, { call, put, select }) {

            const {ou, startYear, startSeason, endSeason, endYear} = yield select(status => status.resultQuery)

            const rsp = yield call(projAssessmentStandardServices.showRating,{"arg_dept_name":ou,"arg_start_year":startYear,"arg_start_season":startSeason,"arg_end_year":endYear,"arg_end_season":endSeason})
            var projectData= []

              for(let data in rsp.data) {
                projectData.push(rsp.data[data])
              }

            yield put({
            type: "save",
            payload: {
               projectData,


        }} )

        },
},

    subscriptions: {
        setup({ dispatch, history }) {
        return history.listen(({ pathname, query }) => {
            if (pathname === "/projectApp/projexam/productunitquery") {
                dispatch({ type: "inited", onload });
                }
            });
        },
    },
};
