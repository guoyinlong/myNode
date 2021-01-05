import Cookie from "js-cookie";
import * as timeManageService from '../../../services/project/timeManagement';
import * as serviceDM from '../../../services/employer/empservices';
import message from "../../../components/commonApp/message";
import { arrayToArrayGroups } from "../../../utils/func";
import ColumnGroup from "antd/lib/table/ColumnGroup";
import * as service from '../../../services/projectKpi/projectKpiServices';
import * as projAssessmentStandardServices from '../../../services/project/projAssessmentStandard';
import moment from 'moment';
export default{
    namespace:"resultRate",

    state:{
        projectData: [],
        queryData: [],
        department:"",
      deptList : [],
        year:"",
        season:"",
        suspending_season:"",
        userId: localStorage.getItem("userid"),
        userName: localStorage.getItem("fullName"),
        showSubmit: false,
        ratingFinish: false,
        scoringFinish :false,
        isStart:false,
        remainderA :0,
        remainderB :0,
        remainderC :0,
        aNum :0,
        bNum :0,
        cNum :0,
        sum  :0,
        visible: false,
    },

    reducers:{
        r_getInfor(state,{year,season,suspending_season}){
    		return{
            	...state,
            	year,
            	season,
            	suspending_season
            };
        },
        // updateRating(state,{rating,rank}){
        //     state.projectData[rank].rating = rating
    	// 	return{
        //     	...state,

        //     };
    	// },
        save(state,  {payload}){
            return {
                ...state,
                ...payload,
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
        *inited(parm, { call,put, select }) {
            const {DataRows,RetCode,suspending_season}=yield call(service.getInfor,parm);
            let sum = 0.0
            let bNum = 0.0
            let cNum = 0.0
            let aNum = 0.0
           let year = DataRows[0].year
           let season = DataRows[0].season
            if(RetCode === "1") {
                yield put({
                    type: 'r_getInfor',
                    year:year,
                    season:season,
                    suspending_season:suspending_season
                });


            }
            var deptList = []

          var deptListRsp = yield call(projAssessmentStandardServices.getDept,{'arg_manger_id':localStorage.getItem("userid") })

          for (let index = 0 ; index<deptListRsp.DataRows.length ; index++){
            var department = deptListRsp.DataRows[0]['deptname']
            deptList.push(deptListRsp.DataRows[index]['deptname'])
          }

           var req = {
                    'year_':year,
                    'quarterly':season,
                    'department':department,
                }
            var rsp = yield call(projAssessmentStandardServices.scoreRank,req)

            let showSubmit =false
            let ratingFinish =false
            let scoringFinish =false
            var rating = ""
            var projectData = []
            if(rsp.RetCode === "1") {
                for(var index = 0; index < rsp.DataRows.length; index++){
                    sum++
                    if(index>rsp.DataRows.length*0.5){
                        rating = "C"
                        cNum ++
                    }else if(index>rsp.DataRows.length*0.2){
                        rating = "B"
                        bNum ++
                    }else{
                        rating = "A"
                        aNum++
                    }
                    projectData.push(
                        {
                            'rank' : index+1,
                            'teamName' : rsp.DataRows[index].proj_name,
                            'projCode' : rsp.DataRows[index].proj_code,
                            'pm' : rsp.DataRows[index].mgr_name,
                            'tyScore' : rsp.DataRows[index].flag_0_sum,
                            'zyScore' : rsp.DataRows[index].flag_1_sum,
                            'jlScore' : rsp.DataRows[index].flag_2_sum,
                            'djScore' : rsp.DataRows[index].flag_3_sum,
                            'totalScore' : rsp.DataRows[index].score,
                            'rating' : rating,

                        }
                    )
                }

                if (rsp.RetNum == 0&&rsp.RetNum2 != 0 ){
                  showSubmit = true
                }
              if (rsp.RetNum2 == 0 ){
                ratingFinish = true
              }
              if (rsp.RetNum == 0 ){
                scoringFinish = true
              }
            }
            let remainderA = (sum*0.2-aNum).toFixed(1)
            let remainderB = (sum*0.3-bNum).toFixed(1)
            let remainderC = (sum*0.5-cNum).toFixed(1)
            if(DataRows[0].season ==4){
                req = {
                'arg_year':year,
                'arg_season':-1,
                'arg_dept_name':department,
              }

              const rsp1 = yield call(projAssessmentStandardServices.getRemainder,req)
              if(rsp1.RetCode=="1"){
                remainderA = 0
                remainderB = 0
                remainderC = 0
                for (var index=0;index<rsp1.DataRows.length;index++){
                    remainderA += rsp1.DataRows[index].a_nums
                    remainderB += rsp1.DataRows[index].b_nums
                    remainderC += rsp1.DataRows[index].c_nums
                }
              }
            }

            yield put({
                type: "save",
                payload: {
                   'department' : department,
                    'projectData' : projectData,
                  'showSubmit' : showSubmit,
                  'ratingFinish' :ratingFinish,
                  'scoringFinish' : scoringFinish,
                  'remainderA': remainderA,
                  'remainderB': remainderB,
                  'remainderC': remainderC,
                  'aNum' : aNum,
                  'bNum' : bNum,
                  'cNum' : cNum,
                  'sum' : sum,
                  'deptList' : deptList,
            }
            })



    },

    *updateRating({rank,rating }, { call, put, select }) {
          let {projectData,aNum,bNum,cNum,sum,season} = yield select(status => status.resultRate)
          if (season != 4) {
            switch (projectData[rank].rating) {
              case 'A':
                aNum--;
                break;
              case 'B':
                bNum--;
                break;
              case 'C':
                cNum--;
            }
            switch (rating) {
              case 'A':
                aNum++;
                break;
              case 'B':
                bNum++;
                break;
              case 'C':
                cNum++;
            }
          }
          projectData[rank].rating = rating

              yield put({
                type: "save",
                payload: {
                  'projectData' : projectData,
                  'remainderA': (sum*0.2-aNum).toFixed(1),
                  'remainderB': (sum*0.3-bNum).toFixed(1),
                  'remainderC': (sum*0.5-cNum).toFixed(1),
                  'aNum' : aNum,
                  'bNum' : bNum,
                  'cNum' : cNum,
            }
            })
          },

      *updateOUName(param, { put ,select, call}) {
        let {year,season} = yield select(status => status.resultRate)
        var req = {
          'year_':year,
          'quarterly':season,
          'department':param.department,
        }
        var rsp = yield call(projAssessmentStandardServices.scoreRank,req)
        let sum = 0.0
        let bNum = 0.0
        let cNum = 0.0
        let aNum = 0.0
        let showSubmit =false
        let ratingFinish =false
        let scoringFinish =false
        var rating = ""
        var projectData = []
        if(rsp.RetCode === "1") {
          for(var index = 0; index < rsp.DataRows.length; index++){
            sum++
            if(index>rsp.DataRows.length*0.5){
              rating = "C"
              cNum ++
            }else if(index>rsp.DataRows.length*0.2){
              rating = "B"
              bNum ++
            }else{
              rating = "A"
              aNum++
            }
            projectData.push(
              {
                'rank' : index+1,
                'teamName' : rsp.DataRows[index].proj_name,
                'projCode' : rsp.DataRows[index].proj_code,
                'pm' : rsp.DataRows[index].mgr_name,
                'tyScore' : rsp.DataRows[index].flag_0_sum,
                'zyScore' : rsp.DataRows[index].flag_1_sum,
                'jlScore' : rsp.DataRows[index].flag_2_sum,
                'djScore' : rsp.DataRows[index].flag_3_sum,
                'totalScore' : rsp.DataRows[index].score,
                'rating' : rating,

              }
            )
          }

          if (rsp.RetNum == 0&&rsp.RetNum2 != 0 ){
            showSubmit = true
          }
          if (rsp.RetNum2 == 0 ){
            ratingFinish = true
          }
          if (rsp.RetNum == 0 ){
            scoringFinish = true
          }
        }
        let remainderA = (sum*0.2-aNum).toFixed(1)
        let remainderB = (sum*0.3-bNum).toFixed(1)
        let remainderC = (sum*0.5-cNum).toFixed(1)
        if(season ==4){
          req = {
            'arg_year':year,
            'arg_season':-1,
            'arg_dept_name':param.department,
          }

          const rsp1 = yield call(projAssessmentStandardServices.getRemainder,req)
          if(rsp1.RetCode=="1"){
            remainderA = 0
            remainderB = 0
            remainderC = 0
            for (var index=0;index<rsp1.DataRows.length;index++){
              remainderA += rsp1.DataRows[index].a_nums
              remainderB += rsp1.DataRows[index].b_nums
              remainderC += rsp1.DataRows[index].c_nums
            }
          }
        }

        yield put({
          type: "save",
          payload: {
            'department' : param.department,
            'projectData' : projectData,
            'showSubmit' : showSubmit,
            'ratingFinish' :ratingFinish,
            'scoringFinish' : scoringFinish,
            'remainderA': remainderA,
            'remainderB': remainderB,
            'remainderC': remainderC,
            'aNum' : aNum,
            'bNum' : bNum,
            'cNum' : cNum,
            'sum' : sum,

          }
        })

      } ,
    *submit({}, { call, put, select }) {
        const {projectData,year,season,department, remainderA, remainderB, remainderC} = yield select(status => status.resultRate)
        var str = ""
        for(var index = 0; index<projectData.length; index++){
            str = str + projectData[index].projCode+"$"+projectData[index].rating+"$"
            if (index!=projectData.length-1){
                str = str+"#"
            }
        }
            var req = {
                'arg_year' : year,
                'arg_season' : season,
                'arg_information' : str
            }
        const rsp = yield call(projAssessmentStandardServices.updateRating,req)
        if (rsp.RetCode == 1){
            const rsp2 = yield call(projAssessmentStandardServices.computeRemainder,{'year1': year, 'quarterly' : season, 'department' : department , 'a_num': remainderA, 'b_num' :remainderB, 'c_num':remainderC})
        }
      yield put({
        type: "save",
        payload: {
          'visible' : false,
          'showSubmit': false,
          'ratingFinish': true,
          'scoringFinish' :true,
        }
      })
        },
      *showModal({}, { call, put, select }) {
        const {visible} = yield select(status => status.resultRate)
        yield put({
          type: "save",
          payload: {
            'visible' : !visible,
          }
        })
      },

},

    subscriptions: {
        setup({ dispatch, history }) {
        return history.listen(({ pathname, query }) => {


            if (pathname === "/projectApp/projexam/rating") {
                dispatch({ type: "inited", onload });
                }
            });
        },
    },
};
