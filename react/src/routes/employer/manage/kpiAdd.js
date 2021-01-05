/**
 * 文件说明：员工指标新增/修改/填写完成情况页面
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-07-20
 */
import KpiDetails from '../../../components/employer/KpiDetails'
import PageSubmit from '../../../components/employer/PageSubmit'
import {connect} from 'dva';
import Style from '../../../components/employer/employer.less'
import {Button, Upload, Modal, Icon, Select, Popconfirm} from 'antd'
import config from "../../../utils/config"
import Cookie from 'js-cookie';
import moment from 'moment';
import {splitEnter} from '../../../utils/func'
import message from '../../../components/commonApp/message'
import {routerRedux} from 'dva/router';
import {postExcelFile} from "../../../utils/func.js"
const staffId = Cookie.get('userid');
const importYear = new Date().getFullYear().toString();
const importSeason = (new Date().getMonth() + 1).toString();
const importDay = new Date().getDate().toString();
const confirm = Modal.confirm;
const {Option} = Select;

/**
 * 功能：指标目标分值求和
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-07-20
 * @param kpiColl 指标内容集合
 */
function weightSum(kpiColl) {
  let sum = [];
  for (let i = 0; i < kpiColl.length; i++) {
    let params = [];
    kpiColl[i].total = 0;
    let s = 0;
    for (let j = 0; j < kpiColl[i].empKpis.length; j++) {
      let kpi_score = 0;
      if (kpiColl[i].empKpis[j].target_score) {
        kpi_score = parseFloat(kpiColl[i].empKpis[j].target_score);
      }
      s += kpi_score;
      let m = 0;
      for (; m < params.length; m++) {
        if (params[m].checker_id == kpiColl[i].empKpis[j].checker_id) {
          params[m].target_score = parseFloat(params[m].target_score) + kpi_score;
          break;
        }
      }
      if (m == params.length) {
        params.push({
          "checker_id": kpiColl[i].empKpis[j].checker_id,
          "checker_name": kpiColl[i].empKpis[j].checker_name,
          "target_score": parseFloat(kpiColl[i].empKpis[j].target_score)
        });
      }
    }

    let index = 0;
    for (let m = 1; m < params.length; m++) {
      if (parseFloat(params[index].target_score) < parseFloat(params[m].target_score)) {
        index = m;
      }
    }
    kpiColl[i].scorers = params[index];
    sum.push({"sum": s.toFixed(2)});
    kpiColl[i].total = s;
  }
  return sum;
}

/**
 * 功能：浅复制kpi记录
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-07-20
 * @param item 指标项
 * @returns {*} 复制的指标项
 */
function copyKpi(item) {
  let kpi = {
    "kpi_type": item.kpi_type,
    "kpi_name": item.kpi_name,
    "kpi_content": item.kpi_content,
    "formula": item.formula,
    "target_score": item.target_score,
    "checker_id": item.checker_id,
    "checker_name": item.checker_name,
    "remark": item.remark
  };
  return kpi;
}

/**
 * 功能：指标提交前拼服务参数
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-07-20
 * @param kpiColl 指标集
 * @param year 考核年度
 * @param season 考核季度
 * @param perf_emp_type 员工绩效类型
 * @param flag 操作类型：新增/修改/填写完成情况
 * @returns {*} 待提交指标信息
 */
function prepareData(kpiColl, year, season, perf_emp_type, flag, delateProjIds,post) {
  let kpiCollection = [];
  let scoreCollection = [];
  let projIds = [];
  for (let i = 0; i < kpiColl.length; i++) {
    if (kpiColl[i].state == '1' || kpiColl[i].state == '3') {
      continue
    }

    for (let j = 0; j < kpiColl[i].empKpis.length; j++) {
      let k = copyKpi(kpiColl[i].empKpis[j]);
      if (k.checker_id == undefined || k.checker_name == undefined || k.checker_name == '') {
        message.warning("审核人不能为空，请检查！");
        return 0;
      }
      if (k.target_score === undefined || k.target_score === '' || k.target_score === null) {
        message.warning("目标分值不能为空，请检查！");
        return 0;
      } else {
        k.target_score = k.target_score.toString()
      }
      if (k.kpi_name == undefined || k.kpi_name == '') {
        message.warning("分项名称不能为空，请检查！");
        return 0;
      }
      if (k.formula == undefined || k.formula == '') {
        message.warning("计分方法不能为空，请检查！");
        return 0;
      }
      //k.kpi_type = kpiColl[i].empKpis[j].kpi_type;

      k.remark = k.remark;
      k.kpi_name = k.kpi_name;
      k.kpi_content = k.kpi_content;
      k.formula = k.formula;
      k.ou = kpiColl[i].ou;
      k.dept_name = kpiColl[i].dept_name;
      k.staff_id = Cookie.get('userid');
      k.staff_name = Cookie.get('username');
      k.year = year;
      k.season = season;
      k.post_name=post//增加当前职位
      if (k.kpi_type == config.EVAL_EMP_FIXED_KPI_TYPE || k.kpi_type == config.EVAL_MGR_FIXED_KPI_TYPE||k.kpi_type == config.EVAL_CORE_BP_KPI) {
        k.state = '3';
      } else {
        k.state = '1';
      }

      k.proj_id = kpiColl[i].proj_id;
      k.proj_name = kpiColl[i].proj_name;
      if (perf_emp_type == '0') {
        k.score_type = '1';
      }
      else {
        k.score_type = '0';
      }
      k.emp_type = kpiColl[i].emp_type;
      k.create_time = moment().format('YYYY-MM-DD HH:mm:ss');

      kpiCollection.push(k);

    }

    let s = {};
    s.ou = kpiColl[i].ou;
    s.dept_name = kpiColl[i].dept_name;
    s.staff_id = Cookie.get('userid');
    s.staff_name = Cookie.get('username');
    s.year = year;
    s.season = season;
    s.post_name=post//增加当前职位
    if (perf_emp_type == '0') {
      s.score_type = '1';
    }
    else {
      s.score_type = '0';
    }
    s.emp_type = kpiColl[i].emp_type;
    s.state = '1';
    s.tag = '0';

    s.proj_id = kpiColl[i].proj_id;
    s.proj_name = kpiColl[i].proj_name;

    s.checker_id = kpiColl[i].scorers.checker_id;
    s.checker_name = kpiColl[i].scorers.checker_name;
    s.create_time = moment().format('YYYY-MM-DD HH:mm:ss');

    scoreCollection.push(s);

    projIds.push(kpiColl[i].proj_id);

  }

  if (flag == "0") {
    let s = {};
    s.ou = Cookie.get('deptname_p').split('-')[1];
    s.dept_name = kpiColl[0].dept_name;
    s.staff_id = Cookie.get('userid');
    s.staff_name = Cookie.get('username');
    s.year = year;
    s.season = season;
    s.post_name=post//增加当前职位
    if (perf_emp_type == '0') {
      s.score_type = '1';
    }
    else {
      s.score_type = '0';
    }
    s.emp_type = kpiColl[0].emp_type;
    s.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
    s.state = '1';
    s.tag = '1';

    scoreCollection.push(s);
  }

  // 如果是退回修改，存在删除情况，需要将删除的项目id放到 projIds[]
  if(flag==='1'){
    projIds= [...projIds,...delateProjIds]
  }

  return {"flag": "1", "kpiCollection": kpiCollection, "scoreCollection": scoreCollection, "projIds": projIds};
}

class KpiAdd extends React.Component {

  state = {
    showAdditional: 'false',
    import: {
      action: "/filemanage/fileupload?argappname=examine&argtenantid=10010&arguserid=" + staffId + "&argyear=" + importYear +
      "&argmonth=" + importSeason + "&argday=" + importDay,
      method: "POST",
      name: "outsourcer",
      multiple: false,
      showUploadList: false,
      listType: 'text',
      accept: '.xlsx,.xls',
      onChange: (info) => {
        if (info.file.status === 'done') {
          if (info.file.response.RetCode == '1') {
            this.analyze(info.file.response.outsourcer.RelativePath);

            //message.success(`${info.file.name} 导入成功！`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 导入失败！.`);
          }
        }
      }
    }
  };

  showConfirm = (noKpiProjList) => {
    if (noKpiProjList && noKpiProjList.length) {
      const {dispatch, year, season} = this.props;
      this.setState({
        showAdditional: 'true'
      })
      let content = ''
      for (let i = 0; i < noKpiProjList.length; i++) {
        content += ',' + noKpiProjList[i].proj_name;
      }
      //'您当前在'+ content.substring(1) +'项目中有有效工时，但是并未填写指标，是否进行指标补录？',
      Modal.confirm({
        title: '指标补录',
        content: <p>您当前在<span style={{color: 'red', padding: '10px'}}>{content.substring(1)}</span>项目中有有效工时，未填写指标，是否进行指标补录？
        </p>,
        okText: '确认',
        cancelText: '取消',
        onOk() {
          dispatch(routerRedux.push({
            pathname: 'humanApp/employer/manage/kpiAdditional',
            query: {year, season, flag: '3'}
          }));
        },
        onCancel() {
        },
      });
    }

  }
  /**
   * 功能：保存按钮-新增、修改、指标完成情况
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-07-20
   * @param kpiColl 指标集
   */

  save = (kpiColl) => {
    const {dispatch, perf_emp_type} = this.props;
    if (this.props.flag == '2') {  // 填写指标完成情况
      this.saveFinish(kpiColl, '0');
      return
    }
    let state = "0";
    //新增指标
    if (this.props.flag == "0") {
      state = "0";
    } else if (this.props.flag == "1") {//修改指标
      state = "2";
    }
    let kpiCollection = [];
    kpiCollection.push({
      "opt": "delete",
      "data": {"year": this.props.year, "season": this.props.season, "staff_id": Cookie.get('userid'), "state": state}
    });

    for (let i = 0; i < kpiColl.length; i++) {
      if (!kpiColl[i].state || kpiColl[i].state == state) {
        for (let j = 0; j < kpiColl[i].empKpis.length; j++) {
          let k = copyKpi(kpiColl[i].empKpis[j]);
          if (k.kpi_type != config.EVAL_EMP_FIXED_KPI_TYPE && k.kpi_type != config.EVAL_MGR_FIXED_KPI_TYPE) {
            k.ou = kpiColl[i].ou;
            k.dept_name = kpiColl[i].dept_name;
            k.staff_id = Cookie.get('userid');
            k.staff_name = Cookie.get('username');
            k.year = this.props.year;
            k.season = this.props.season;
            k.state = state;
            k.proj_id = kpiColl[i].proj_id;
            k.proj_name = kpiColl[i].proj_name;

            k.kpi_name = k.kpi_name;
            k.kpi_content = k.kpi_content;
            k.formula = k.formula;
            //k.target_score = k.target_score?k.target_score:undefined;
            k.target_score = (k.target_score === undefined || k.target_score === '' || k.target_score === null) ? undefined : k.target_score;
            if (perf_emp_type == '0') {
              k.score_type = '1';
            }
            else {
              k.score_type = '0';
            }
            k.emp_type = kpiColl[i].emp_type;
            k.create_time = moment().format('YYYY-MM-DD HH:mm:ss')
            kpiCollection.push({"opt": "insert", "data": k});
          }
        }
      }

    }

    dispatch({
      type: 'manage/saveKpi',   //此处的manage是src/models/employer/manage.js中的namespace
      params: {transjsonarray: JSON.stringify(kpiCollection)},
    })

  }

  /**
   * 功能：提交按钮-新增、修改、指标完成情况
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-07-20
   * @param kpiColl 指标集
   */
  submit = (kpiColl, flag) => {
  
    let projflage=0
    const {projListOrigin, delateProjIds, perf_emp_type,post} = this.props
    // 提交项目数必须少于等于 2, 且 所在团队的项目 和 填写指标的项目 完全一样才能提交
    if (kpiColl.length <= 2) {

      let projAllMatch = true;  // 全部匹配
      if ((projListOrigin || []).length !== kpiColl.length) {
        projAllMatch = false
        projflage=1
      } else {
        for (let i = 0; i < kpiColl.length; i++) {
          if (!(projListOrigin || []).some(item2 => item2.proj_id === kpiColl[i].proj_id)) {
            projAllMatch = false
          
            break
          }
        }
      }

      // 提交完成情况时  不需要项目全匹配
      // 综合绩效指标时  无项目 不需要全匹配 perf_emp_type === '1'综合绩效 0 项目绩效 ；与score_type相反
      //emp_type=='7'时候代表BP,BP没有项目，不需要全匹配
      if (flag === '2' || perf_emp_type === '1'||kpiColl[0].emp_type=='7') {
        projAllMatch = true
      }


      if (projAllMatch) {
        const {dispatch} = this.props;
        if (this.props.flag == '2') {
          for (let i = 0; i < kpiColl.length; i++) {
            for (let j = 0; j < kpiColl[i].empKpis.length; j++) {
              let k = kpiColl[i].empKpis[j];
              if (k.finish == undefined) {
                k.finish = '';
              }
              if (k.checker_id != config.EVAL_FIXED_KPI_CHECKER_ID && !(k.finish.trim())) {
                message.warning("尚有指标完成情况未填写，只有完全填写完整，才能提交！");
                return
              }
            }
          }
          this.saveFinish(kpiColl, '1');
          return
        }
        let sum = weightSum(kpiColl);
        let judgeTotalFlag = 0;
        for (let i = 0; i < sum.length; i++) {
          if (kpiColl[i].perf_type_id == '200' && kpiColl[i].dept_name.indexOf(config.EVAL_KPI_SCORE_200_DEPT) != -1) {
            if (parseFloat(sum[i].sum).toFixed(2) != 200) {
              message.warning(kpiColl[i].perf_name + "  权重和需为200方可提交！");
              judgeTotalFlag = 1;
              break;
            }
          } else if (parseFloat(sum[i].sum).toFixed(2) != 100) {

            let tips = kpiColl[i].proj_id ? kpiColl[i].perf_name : '';
            message.warning(tips + "  权重和需为100方可提交！");
            judgeTotalFlag = 1;
            break;
          }
        }
        if (judgeTotalFlag == 0) {
          let res = prepareData(kpiColl, this.props.year, this.props.season, this.props.perf_emp_type, this.props.flag,delateProjIds,post);

          if (res.flag == 1) {
            let params = {
              t_emp_kpi: JSON.stringify(res.kpiCollection),
              t_emp_score: JSON.stringify(res.scoreCollection),
              flag: this.props.flag,
              year: this.props.year,
              season: this.props.season,
              staff_id: Cookie.get("userid"),
            };
            if (this.props.perf_emp_type == "0") {
              params["proj_id"] = JSON.stringify(res.projIds);
            }

            if(kpiColl[0].emp_type=='7'){//标志着BP
              params["proj_id"] =null
            }
            //debugger
            dispatch({
              type: 'manage/submitKpi',   //此处的manage是src/models/employer/manage.js中的namespace
              params: params
            })
          }
        }
      } else if(projflage){//有2个项目只填写了一个的情况
          message.info('您还有项目指标未填写，请点击新增项目指标按钮添加，如不需要填写，请联系项目经理退出该团队！', 6)
        }
      // else{
      //   message.info('您所填写的项目和您现在所在这个团队参与的项目不匹配，请重新确认！', 6)//项目id
      //   //您所填写的项目和您现在所在这个团队参与的项目不匹配，请重新确认
      // }

    } else {
      message.info('考核规定，无法同时填写多于2个项目的指标，请处理后重新提交！', 6)
    }

  }

  /**
   * 功能：保存/提交指标完成情况
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-07-20
   * @param kpiColl 指标集
   * @param tag 操作类型，0：保存  1：提交
   */
  saveFinish = (kpiColl, tag) => {
    const {dispatch} = this.props;
    let updateFinish = [];
    for (let i = 0; i < kpiColl.length; i++) {
      for (let j = 0; j < kpiColl[i].empKpis.length; j++) {
        let k = kpiColl[i].empKpis[j];
        if (k.finish == undefined) {
          k.finish = '';
        }
        updateFinish.push({"update": {"finish": k.finish}, "condition": {"id": k.id}});
      }
    }
    dispatch({
      type: 'manage/updateKpi',   //此处的manage是src/models/employer/manage.js中的namespace
      params: {transjsonarray: JSON.stringify(updateFinish)},
      tag
    })
  }

  /**
   * 功能：模板下载
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-07-20
   */
  downloadTemp = () => {
    if (this.props.perf_type_id == '200') {
      //综合绩效员工+常设机构负责人
      location.href = "/filemanage/upload/examine/10010/2017/7/13/0860640/综合绩效考核表模板.xls";
    } else if (this.props.perf_type_id == '300') {
      //项目绩效员工
      location.href = "/filemanage/upload/examine/10010/2017/7/13/0860640/业务绩效考核表模板.xls";
    } else if (this.props.perf_type_id == '400') {
      //本部项目经理
      location.href = "/filemanage/upload/examine/10010/2017/7/13/0860640/关键岗位人员业务绩效考核表模板.xls";
    } else if (this.props.perf_type_id == '500') {
      //分院项目经理
      location.href = "/filemanage/upload/examine/10010/2017/7/13/0860640/分院关键岗位人员业务绩效考核表模板.xls";
    } if (this.props.perf_type_id == '800') {
      //BP
      location.href = "/filemanage/upload/examine/10010/2017/7/13/0860640/BP考核表模板.xls";
    }
    else {
      toastr.error("您尚无绩效类型,无法为您匹配模板,请联系部门负责人为您分配绩效类型！");
    }
  }

  /**
   * 功能：复制上一季度指标
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-07-20
   */
  copyLastKpi = () => {
    const {dispatch, perf_emp_type, year} = this.props;
    let last_season;
    let last_year = year;
    if (this.props.season == '1') {
      last_season = '4';
      last_year = (parseInt(this.props.year) - 1).toString();
    } else {
      last_season = (parseInt(this.props.season) - 1).toString();
    }
    for (let i = 0; i < this.props.projList.length; i++) {
      dispatch({
        type: 'manage/lastKpiSearch',   //此处的manage是src/models/employer/manage.js中的namespace
        proj: this.props.projList[i],
        year: last_year,
        season: last_season,
        staff_id: Cookie.get('userid'),
        perf_emp_type
      })
    }
  }

  // 删除项目列表中的 i 项目
  deleteProjKpi = (projList, i) => {
    this.props.dispatch({
      type: 'manage/deleteProjKpi',
      projList: projList,
      projItem: i,
    })
  }

  // 展示新增弹窗 展示新增列表
  showAddProject = () => {
    this.props.dispatch({
      type: 'manage/empPrProjSearch',
    })

    this.setState({
      showAddModal: true,
    })
  }

  // 选择的项目变化  保存到modal
  projChange = (value) => {
    this.props.dispatch({
      type: 'manage/saveprojectId',
      projectId: value,
    })
  }

  // 添加项目
  addProject = () => {
    if (this.props.projectId === '') {
      message.info('请选择要添加的项目！')
    } else {
      this.props.dispatch({
        type: 'manage/addProject',
        projList: this.props.projList,
        projectId: this.props.projectId,
      })

      this.setState({
        showAddModal: '',
      })
    }
  }

  modalcancel = () => {
    this.setState({
      showAddModal: '',
    })

    this.props.dispatch({
      type: 'manage/saveprojectId',
      projectId: '',
    })
  }

  //指标补录代码
  componentDidMount() {
    const {noKpiProjList} = this.props;
    const {showAdditional} = this.state;
    if (showAdditional == 'false' && noKpiProjList && noKpiProjList.length) {
      this.showConfirm(noKpiProjList);
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  componentWillReceiveProps(nextProps) {
    const {noKpiProjList} = nextProps;
    const {showAdditional} = this.state;
    if (showAdditional == 'false' && noKpiProjList && noKpiProjList.length) {
      this.showConfirm(noKpiProjList);
    }
     if(!this.timer){
      //if(kpi_state==="0"&&list.some(item=>item.state=="0")){
        this.timer = setInterval(() => this.save(this.props.projList), 600000)
        //}
     }
  }

  //指标补录代码
  /**
   * 功能：解析指标文件
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-07-20
   * @param path 文件路径
   */
  analyze(path) {
    const {dispatch, perf_emp_type, perf_type_id,emp_type} = this.props;
    if(emp_type=='7'){//bp的话走 综合绩效
      //debugger
      dispatch({
        type: 'manage/compKpiFileAnalyze',   //此处的manage是src/models/employer/manage.js中的namespace
        path: path,
        kpiColl: this.props.projList,
        checkerList: this.props.checkerList
      })
      return
    }
    if (perf_emp_type == '0') {//业务
      //debugger
      dispatch({
        type: 'manage/projKpiFileAnalyze',   //此处的manage是src/models/employer/manage.js中的namespace
        path: path,
        kpiColl: this.props.projList,
        checkerList: this.props.checkerList,
        perf_type_id
      })
    } else {
      dispatch({
        type: 'manage/compKpiFileAnalyze',   //此处的manage是src/models/employer/manage.js中的namespace
        path: path,
        kpiColl: this.props.projList,
        checkerList: this.props.checkerList
      })
    }
  }

  //指标导出
  expot_kpi=()=>{
      let param={
      arg_staffid:staffId,
      arg_year:this.props.year,
      arg_season:this.props.season
    }
    postExcelFile(param,"/microservice/allexamine/examine/empkpiexport")
  }



  render() {
    //flag  0：新增指标    1：修改指标     2：填写指标完成情况
    const {loading, projList, checkerList, year, season, perf_emp_type, emp_type, flag, addDisplay, post} = this.props;
    return (
      <div className={Style.wrap}>
        <div>
          {
            this.props.flag !== '2' && addDisplay ?
              <div className={Style.div_template} style={{overflow: 'hidden', marginBottom: '10px'}}>
                <Button onClick={() => this.showAddProject()}  style={{marginRight: '20px', display: perf_emp_type=='1'? 'none': ''}}> 新增项目指标 </Button>
                <Button onClick={() => this.downloadTemp()}>下载模板</Button>
                <Button onClick={() => this.copyLastKpi()}>复制上季度指标</Button>
                <Upload {...this.state.import} ><Button>导入</Button></Upload>
                <Button style={{marginLeft:10}} onClick={this.expot_kpi}>导出</Button>
              </div>
              :
              <Button style={{float:"right",display:projList && projList.length?"block":"none"}} onClick={this.expot_kpi}>导出</Button>
          }
          
          {
            <Modal
              onOk={this.addProject}
              onCancel={this.modalcancel}
              width={700}
              visible={this.state.showAddModal === true}
              title={'添加项目'}
            >
              <Select value={this.props.projectId} style={{width: 650}} onChange={this.projChange}>
                {(this.props.projListOrigin || []).map(item => <Option key={item.proj_id}
                                                                       value={item.proj_id}>{item.proj_name}</Option>)}
              </Select>
            </Modal>
          }

        </div>

        <div>
          {
          projList && projList.length ?
            projList.map((i, index) => {
              i['year'] = year;
              i['season'] = season;
              i['staff_id'] = Cookie.get('userid');
              i['staff_name'] = Cookie.get('username');
              let edit = 'true';
              // flag 0/1/2 =》 新增/退回修改/填写完成情况 ； i.state 0/1/2/3 保存/提交/退回/通过
              if (this.props.flag == '1' && (i.state == '1' || i.state == '3')) {
                edit = 'false'
              }
              return (
                <div key={index.toString() + 'div'} style={{position: 'relative', marginTop: '20px'}}>
                  {
                    this.props.flag==='0'||(this.props.flag === '1' && addDisplay && (i.state === '0' || i.state === '2')) ?
                      <Popconfirm
                        title="确定删除该项目指标吗?"
                        onConfirm={() => this.deleteProjKpi(projList, i)}
                        // onCancel={cancel}
                        okText="确定"
                        cancelText="取消"
                      >
                        <Icon
                          key={index.toString() + 'icon'}
                          type="close"
                          style={{color: 'red', position: 'absolute', top: '10px', right: '10px',display: perf_emp_type=='1'? 'none': ''}}
                          // onClick={()=>this.deleteProjKpi(projList, i)}
                        />
                      </Popconfirm>
                      :

                      ''
                  }


                  <KpiDetails
                   // OriginList={this.props.projListOrigin[index]}
                   projListOrigin={this.props.projListOrigin}
                    loading={loading}
                    disabled={this.disabled}
                    list={i}
                    perf_emp_type={perf_emp_type}   // 控制考核人 参数a   （a== 0 或者 a！==0 && b==0） 选择考核人
                    emp_type={emp_type}             // 控制考核人 参数b
                    key={i.proj_id} checkerList={checkerList}
                    rankVisible="false" totalScoreVisible="true" edit={edit} flag={this.props.flag}
                    checkerFixed={this.props.perf_type_id == '300' ? 'true' : 'false'} noScore="true"
                    hasproj={this.props.hasproj}
                    proj_length={projList.length}
                    BP_type={this.props.BP_type}
                  />
                </div>
              )
            })
            : null
          }
        </div>
        <div>
          {addDisplay && flag != '2' ?
            <PageSubmit
              title={perf_emp_type != 0 ? splitEnter("确定提交指标吗？<br/>当前职位：" + post + "<br/>考核类型：" + config.EVAL_COMP_EVAL_KPI + "<br/>若职位不符，请联系所属院人力进行修改！<br/>若考核类型不符，请联系部门负责人进行修改！") : splitEnter("确定提交指标吗？<br/>当前职位：" + post + "<br/>考核类型：" + config.EVAL_PROJ_EVAL_KPI + "<br/>若职位不符，请联系所属院人力进行修改！<br/>若考核类型不符，请联系部门负责人进行修改！")}
              save={() => this.save(projList)}
              submit={() => this.submit(projList)}/>
            : null
          }

          {addDisplay && flag == '2' ?
            <PageSubmit
              title={'确定提交指标完成情况吗？'}
              save={() => this.save(projList)}

              submit={() => this.submit(projList, flag)}/>
            :
            null
          }
        </div>
      </div>
    )
  }
}

/*kpiItemChangeSave={this.kpiItemChangeSave}
addNewKiptoProps={this.addNewKiptoProps}*/
/**
 * 功能：state数据注入组件
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-08-20
 * @param state 状态树
 */
function mapStateToProps(state) {
  const {year, season, projList, checkerList = [], perf_emp_type, emp_type, perf_type_id, flag, addDisplay, post, noKpiProjList, projListOrigin, projectId, delateProjIds,kpi_state,hasproj,BP_type} = state.manage;
  if (projList && projList.length) {
    projList.map((i, index) => i.key = index)
  }
  if (checkerList && checkerList.length) {
    checkerList.map((i, index) => i.key = index)
  }
  if (noKpiProjList && noKpiProjList.length) {
    noKpiProjList.map((i, index) => i.key = index)
  }
  return {
    year,
    season,
    projList,
    checkerList,
    perf_emp_type,
    emp_type,
    perf_type_id,
    flag,
    addDisplay,
    post,
    noKpiProjList,
    projListOrigin,
    projectId,
    loading: state.loading.models.manage,
    delateProjIds,
    kpi_state,
    hasproj,
    BP_type
  };
}

export default connect(mapStateToProps)(KpiAdd)
