/**
 * 作者：张楠华
 * 创建日期：2018-06-19
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：权限控制配置文件
 */
export default {
  FeeNameAddBat:'/microservice/transinsert/cos/feenameadd_bat',//费用项新增
  FeeNameUpdateBat:'/microservice/transupdate/cos/feenameupdate_bat',//费用项修改
  OuFullCostPublish:'/microservice/cos/projbudgetgoingpublish',//ou/部门项目全成本预算完成情况 发布
  OuFullCostUnpublish:'/microservice/cos/projbudgetgoingunpublish',//ou/部门项目全成本预算完成情况 撤销
  OuFullCostCreate:'/microservice/cos/proj_budget_going_generate',////ou/部门项目全成本预算完成情况 生成
  StraightRelease:'/microservice/transupdate/cos/straightupd_bat',//直接成本管理 发布
  StraightCancelRelease:'/microservice/cosservice/projectcost/allcost/straightcancelrelease',//直接成本管理 撤销发布
  IndirectRelease:'/microservice/transupdate/cos/indirectupd_bat',//间接成本管理 发布
  IndirectCancelRelease:'/microservice/cosservice/projectcost/allcost/indirectcancelrelease',//间接成本管理 撤销发布
  projCostDetailSyn : '/microservice/projcostdetail/dw_to_research_proj_cost' //项目成本明细表 同步
}
