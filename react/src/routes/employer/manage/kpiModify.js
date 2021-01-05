/**
 * 文件说明：员工指标新增/修改/填写完成情况页面
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-07-20
 */
import KpiDetails from '../../../components/employer/KpiDetails'
import PageSubmit from '../../../components/employer/PageSubmit'
import { connect } from 'dva';
import Style from '../../../components/employer/employer.less'
import {Button,Upload,Modal,Radio} from 'antd'
import config from "../../../utils/config"
import Cookie from 'js-cookie';
import moment from 'moment';
import {splitEnter} from '../../../utils/func'
import message from '../../../components/commonApp/message'
import {postExcelFile} from "../../../utils/func.js"
const staffId = Cookie.get('userid');
const importYear = new Date().getFullYear().toString();
const importSeason = (new Date().getMonth() + 1).toString();
const importDay = new Date().getDate().toString();
const RadioGroup = Radio.Group;
/**
 * 功能：指标目标分值求和
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-07-20
 * @param kpiColl 指标内容集合
 */
function weightSum(kpiColl) {
  let sum = [];
  for(let i = 0;i < kpiColl.length;i++) {
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
function copyKpi (item){
  let kpi ={"kpi_type":item.kpi_type,"kpi_name":item.kpi_name,"kpi_content":item.kpi_content,"formula":item.formula,"target_score":item.target_score,"checker_id":item.checker_id,"checker_name":item.checker_name,"remark":item.remark};
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
function prepareData(kpiColl,year,season,perf_emp_type,flag) {
  let kpiCollection = [];
  let scoreCollection = [];
  let projIds = [];
  for(let i = 0;i < kpiColl.length;i++){
    if(kpiColl[i].state == '1' || kpiColl[i].state == '3'){
      continue
    }
    for(let j = 0;j < kpiColl[i].empKpis.length;j++){
      let k = copyKpi(kpiColl[i].empKpis[j]);
      if(k.checker_id == undefined  || k.checker_name == undefined || k.checker_name == ''){
        message.warning("审核人不能为空，请检查！");
        return 0;
      }
      if(k.target_score === undefined || k.target_score === '' || k.target_score === null){
        message.warning("目标分值不能为空，请检查！");
        return 0;
      }else{
        k.target_score = k.target_score.toString()
      }
      if(k.kpi_name == undefined || k.kpi_name == ''){
        message.warning("分项名称不能为空，请检查！");
        return 0;
      }
      if(k.formula == undefined || k.formula == ''){
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
      k.season =season;
      if(k.kpi_type == config.EVAL_EMP_FIXED_KPI_TYPE || k.kpi_type == config.EVAL_MGR_FIXED_KPI_TYPE){
        k.state ='3';
      }else{
        k.state ='1';
      }

      k.proj_id = kpiColl[i].proj_id;
      k.proj_name = kpiColl[i].proj_name;
      if(perf_emp_type == '0'){
        k.score_type = '1';
      }
      else{
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
    s.season =season;
    if(perf_emp_type == '0'){
      s.score_type = '1';
    }
    else{
      s.score_type = '0';
    }
    s.emp_type = kpiColl[i].emp_type;
    s.state ='1';
    s.tag ='0';

    s.proj_id = kpiColl[i].proj_id;
    s.proj_name = kpiColl[i].proj_name;

    s.checker_id = kpiColl[i].scorers.checker_id;
    s.checker_name = kpiColl[i].scorers.checker_name;
    s.create_time = moment().format('YYYY-MM-DD HH:mm:ss');

    scoreCollection.push(s);
    projIds.push(kpiColl[i].proj_id);

  }
  if(flag =="0"){
    let s = {};
    s.ou = Cookie.get('deptname_p').split('-')[1];
    s.dept_name = kpiColl[0].dept_name;
    s.staff_id = Cookie.get('userid');
    s.staff_name = Cookie.get('username');
    s.year = year;
    s.season =season;
    if(perf_emp_type == '0'){
      s.score_type = '1';
    }
    else{
      s.score_type = '0';
    }
    s.emp_type = kpiColl[0].emp_type;
    s.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
    s.state ='1';
    s.tag ='1';

    scoreCollection.push(s);
  }

  return {"flag":"1","kpiCollection":kpiCollection,"scoreCollection":scoreCollection,"projIds":projIds};
}
let projId = '';
class KpiAdditional extends React.Component {


  state = {
    showAdditional:'false',
    value: '',
    import: {
      action: "/filemanage/fileupload?argappname=examine&argtenantid=10010&arguserid="+staffId+"&argyear="+importYear +
      "&argmonth="+importSeason+"&argday="+importDay,
      method: "POST",
      name: "outsourcer",
      multiple: false,
      showUploadList: false,
      listType: 'text',
      accept: '.xlsx,.xls',
      onChange:(info)=> {
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
  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
    projId = e.target.value;
  }
  //指标补录代码
  componentDidMount(){
    const { noKpiProjList,additionalInfo } = this.props;
    const { showAdditional } = this.state;
    if(showAdditional == 'false'  && noKpiProjList && noKpiProjList.length > 1){
      this.showConfirm(noKpiProjList,additionalInfo);
    }
  }
  componentWillReceiveProps(nextProps){
    const { noKpiProjList,additionalInfo } = nextProps;
    const { showAdditional } = this.state;
    if(showAdditional == 'false' && noKpiProjList && noKpiProjList.length > 1){
      this.showConfirm(noKpiProjList,additionalInfo);
    }
  }
  showConfirm =(noKpiProjList,additionalInfo)=>{
    if(noKpiProjList && noKpiProjList.length){
      const {dispatch} = this.props;
      this.setState({
        showAdditional:'true'
      })
      let content = ''
      for(let i = 0 ; i < noKpiProjList.length; i++){
        content += ',' + noKpiProjList[i].proj_name;
      }
      const radioStyle = {
        display: 'block',
        lineHeight: '30px',
        whiteSpace:'pre-wrap'
      };
      //<p>您当前在<span style={{color:'red',padding:'10px'}}>{content.substring(1)}</span>项目中有有效工时，未填写指标，是否进行指标补录？</p>
      Modal.confirm({
        title: '指标补录',
        content:
          <div style={{fontSize:'16px'}}><p>团队成员最多可以在两个项目进行考核，请选择待补录指标项目：</p>
            <RadioGroup onChange={this.onChange}>
              {noKpiProjList.map((i,index)=>{
                return <Radio  style={radioStyle} value={i.proj_id}>{i.proj_name+'(工时：'+ i.hours +')'}</Radio>
              })}
            </RadioGroup>
          </div>,
        okText: '确认',
        cancelText: '取消',
        onOk(e) {
          if(!projId){
            message.info("请选择项目！")
          }else{
            console.log(projId)
            let params = {projId,noKpiProjList,additionalInfo}
            dispatch({
              type:'additional/specialProjAddKpi',
              params:params
            })
            e()
          }

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
  save =(kpiColl) =>{
    const {dispatch,perf_emp_type} = this.props;

    let state = "0";

    let kpiCollection = [];
    kpiCollection.push({"opt":"delete","data":{"year":this.props.year,"season":this.props.season,"staff_id":Cookie.get('userid'),"state":state}});

    for(let i = 0;i < kpiColl.length;i++){
      if(!kpiColl[i].state || kpiColl[i].state == state){
        for(let j = 0;j < kpiColl[i].empKpis.length;j++){
          let k = copyKpi(kpiColl[i].empKpis[j]);
          if(k.kpi_type != config.EVAL_EMP_FIXED_KPI_TYPE && k.kpi_type != config.EVAL_MGR_FIXED_KPI_TYPE){
            k.ou = kpiColl[i].ou;
            k.dept_name = kpiColl[i].dept_name;
            k.staff_id = Cookie.get('userid');
            k.staff_name = Cookie.get('username');
            k.year = this.props.year;
            k.season =this.props.season;
            k.state =state;
            k.proj_id = kpiColl[i].proj_id;
            k.proj_name = kpiColl[i].proj_name;

            k.kpi_name = k.kpi_name;
            k.kpi_content = k.kpi_content;
            k.formula = k.formula;
            //k.target_score = k.target_score?k.target_score:undefined;
            k.target_score = (k.target_score === undefined || k.target_score === '' || k.target_score === null)?undefined:k.target_score;
            if(perf_emp_type == '0'){
              k.score_type = '1';
            }
            else{
              k.score_type = '0';
            }
            k.emp_type = kpiColl[i].emp_type;
            k.create_time = moment().format('YYYY-MM-DD HH:mm:ss')
            kpiCollection.push({"opt":"insert","data":k});
          }
        }
      }

    }
    dispatch({
      type:'additional/saveKpi',   //此处的manage是src/models/employer/manage.js中的namespace
      params:{transjsonarray:JSON.stringify(kpiCollection)},
    })
  }

  /**
   * 功能：提交按钮-新增、修改、指标完成情况
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-07-20
   * @param kpiColl 指标集
   */
  submit =(kpiColl) =>{
    const {dispatch} = this.props;
    if(this.props.flag == '2'){
      this.saveFinish(kpiColl,'1');
      return
    }
    let sum = weightSum(kpiColl);
    let judgeTotalFlag = 0;
    for(let i = 0; i < sum.length;i++){
      if(kpiColl[i].perf_type_id=='200' && kpiColl[i].dept_name.indexOf(config.EVAL_KPI_SCORE_200_DEPT) != -1){
        if(parseFloat(sum[i].sum).toFixed(2) != 200){
          message.warning(kpiColl[i].perf_name + "  权重和需为200方可提交！");
          judgeTotalFlag = 1;
          break;
        }
      }else if(parseFloat(sum[i].sum).toFixed(2) != 100){
        let tips = kpiColl[i].proj_id?kpiColl[i].perf_name:'';
        message.warning( tips + "  权重和需为100方可提交！");
        judgeTotalFlag = 1;
        break;
      }
    }
    if(judgeTotalFlag == 0){
      let res = prepareData(kpiColl,this.props.year,this.props.season,this.props.perf_emp_type,this.props.flag);

      if(res.flag == 1){
        let params = {t_emp_kpi:JSON.stringify(res.kpiCollection),
          t_emp_score:JSON.stringify(res.scoreCollection),
          flag:'2',
          year:this.props.year,
          season:this.props.season,
          staff_id:Cookie.get("userid")};
        if(this.props.perf_emp_type=="0"){
          params["proj_id"] = JSON.stringify(res.projIds);
        }
        dispatch({
          type:'additional/submitKpi',   //此处的manage是src/models/employer/manage.js中的namespace
          params:params
        })
      }

    }
  }
  /**
   * 功能：模板下载
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-07-20
   */
  downloadTemp =() =>{
    if(this.props.perf_type_id == '200'){
      //综合绩效员工+常设机构负责人
      location.href = "/filemanage/upload/examine/10010/2017/7/13/0860640/综合绩效考核表模板.xls";
    }else if(this.props.perf_type_id == '300'){
      //项目绩效员工
      location.href = "/filemanage/upload/examine/10010/2017/7/13/0860640/业务绩效考核表模板.xls";
    }else if(this.props.perf_type_id == '400'){
      //本部项目经理
      location.href = "/filemanage/upload/examine/10010/2017/7/13/0860640/关键岗位人员业务绩效考核表模板.xls";
    }else if(this.props.perf_type_id == '500'){
      //分院项目经理
      location.href = "/filemanage/upload/examine/10010/2017/7/13/0860640/分院关键岗位人员业务绩效考核表模板.xls";
    }else{
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
    const {dispatch,perf_emp_type,year} = this.props;
    let last_season;
    let last_year = year;
    if(this.props.season == '1'){
      last_season = '4';
      last_year = (parseInt(this.props.year) - 1).toString();
    }else{
      last_season = (parseInt(this.props.season) - 1).toString();
    }
    for(let i = 0; i < this.props.projList.length;i++){
      dispatch({
        type:'additional/lastKpiSearch',   //此处的manage是src/models/employer/manage.js中的namespace
        proj:this.props.projList[i],
        year:last_year,
        season:last_season,
        staff_id:Cookie.get('userid'),
        perf_emp_type
      })
    }
  }
  /**
   * 功能：解析指标文件
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-07-20
   * @param path 文件路径
   */
  analyze (path){
    const {dispatch,perf_emp_type,perf_type_id} = this.props;
    if(perf_emp_type == '0'){
      dispatch({
        type:'additional/projKpiFileAnalyze',   //此处的manage是src/models/employer/manage.js中的namespace
        path:path,
        kpiColl:this.props.projList,
        checkerList:this.props.checkerList,
        perf_type_id
      })
    }else{
      dispatch({
        type:'additional/compKpiFileAnalyze',   //此处的manage是src/models/employer/manage.js中的namespace
        path:path,
        kpiColl:this.props.projList,
        checkerList:this.props.checkerList
      })
    }
  }

  expot_kpi=()=>{
    let param={
    arg_staffid:staffId,
    arg_year:this.props.year,
    arg_season:this.props.season
  }
  postExcelFile(param,"/microservice/allexamine/examine/empkpiexport")
}


  render() {
    //flag  0：新增指标    1：修改指标     2：填写指标完成情况  3：补录指标
    const { loading, projList,checkerList,year,season,perf_emp_type,emp_type,flag,addDisplay,post} = this.props;
    return (
      <div className={Style.wrap}>

        <div className={Style.div_template}>
          <Button onClick={()=>this.downloadTemp()}>下载模板</Button>
          <Button onClick={()=>this.copyLastKpi()}>复制上季度指标</Button>
          <Upload {...this.state.import}><Button>导入</Button></Upload>
          {/* <Button style={{marginLeft:10}} onClick={this.expot_kpi}>导出</Button> */}
        </div>

        {projList && projList.length?
          projList.map((i,index)=>{
            i['year'] = year;
            i['season'] = season;
            i['staff_id'] = Cookie.get('userid');
            i['staff_name'] = Cookie.get('username');
            let edit = 'true';
            if(this.props.flag =='1' &&(i.state =='1' || i.state =='3')){
              edit = 'false'
            }
            //console.log("Kpi Add list:"+JSON.stringify(i))
            return <KpiDetails loading={loading} disabled = {this.disabled} list = {i} perf_emp_type = {perf_emp_type} emp_type = {emp_type}
                               key = {index} checkerList = {checkerList}
                               rankVisible="false" totalScoreVisible="true" edit={edit} flag={this.props.flag}
                               checkerFixed = {this.props.perf_type_id == '300'?'true':'false'} noScore="true"


            />
          })
          :null
        }

        {addDisplay && flag != '2'?<PageSubmit title={perf_emp_type!=0?splitEnter("确定提交指标吗？<br/>当前职位："+post+"<br/>考核类型："+config.EVAL_COMP_EVAL_KPI+"<br/>若职位不符，请联系所属院人力进行修改！<br/>若考核类型不符，请联系部门负责人进行修改！"):splitEnter("确定提交指标吗？<br/>当前职位："+post+"<br/>考核类型："+config.EVAL_PROJ_EVAL_KPI+"<br/>若职位不符，请联系所属院人力进行修改！<br/>若考核类型不符，请联系部门负责人进行修改！")}
                                               hasSave = {false} save={()=>this.save(projList)} submit={()=>this.submit(projList)}/>:null}
        {addDisplay && flag == '2'?<PageSubmit title={'确定提交指标完成情况吗？'}  save={()=>this.save(projList)} submit={()=>this.submit(projList)}/>:null}


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
  const { year,season,projList,checkerList=[],perf_emp_type,emp_type,perf_type_id,flag,
    addDisplay,post,noKpiProjList,additionalInfo} = state.additional;
  if(projList && projList.length){
    projList.map((i,index)=>i.key=index)
  }
  if(checkerList && checkerList.length){
    checkerList.map((i,index)=>i.key=index)
  }
  if(noKpiProjList && noKpiProjList.length){
    noKpiProjList.map((i,index)=>i.key=index)
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
    additionalInfo,
    loading: state.loading.models.additional,
  };
}
export default connect(mapStateToProps)(KpiAdditional)
