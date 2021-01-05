/**
 * 文件说明：个人考核相关服务
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-07-15
 */
import request from "../../utils/request";

//首页信息查询
export function templateQuery(params) {
  return request("/microservice/encourage/reporttextquery", params);
  // const text = {
  //   RetCode: '1',
  //   RetValue: 1,
  //   DataRows:[{"content":'2018'}]
  // };
  // return text;
}
//首页信息查询
export function indexInfoQuery(params) {
  return request("/microservice/allencouragement/encouragement/service/mastersendwordquery", params);
}
//种类信息查询
export function categoryQuery(params) {
  return request("/microservice/standardquery/encourage/categoryquery", params);
}
//基本信息固定查询
export function basicInfoQuery(params) {
  return request("/microservice/encourage/basicinfoquery", params);
}
//基本信息可选查询
export function basicOptionInfoQuery(params) {
  return request("/microservice/encourage/basicoptioninfoquery", params);
}
//晋升激励报告信息查询
export function promotionInfoQuery(params) {
  return request("/microservice/encourage/promotioninfoquery", params);
}
//绩效激励报告信息查询
export function performanceInfoQuery(params) {
  return request("/microservice/encourage/examresultquery", params);
}
//培训激励报告信息查询
export function trainingInfoQuery(params) {
  return request(
    "/microservice/allencouragement/encouragement/service/traininginfoquery",
    params
  );
}
//培训激励内训师查询服务
export function internalTrainer(params) {
  return request(
    "/microservice/allencouragement/encouragement/service/traininternalteacherquery",
    params
  )
}
//培训激励绩效职级信息查询
export function performanceQuery(params) {
  return request(
    '/microservice/allencouragement/encouragement/service/performancerankquery',
    params
  )
}
//认可激励报告信息查询
export function recognizedInfoQuery(params) {
  return request(
    "/microservice/allencouragement/encouragement/service/recognizeinfoquery",
    params
  );
}
//荣誉报告信息查询
export function honorInfoQuery(params) {
  return request(
    "/microservice/allencouragement/encouragement/service/honorinfoquery",
    params
  );

  // const text = {
  //   "DataRows": {
  //     "honor_money": "0",
  //     "honor_point": "0",
  //     "honors": [
  //       {
  //         "data": [
  //           {
  //             "category": "专业发明专利",
  //             "data": [
  //               {
  //                 "content": "奖励内容2"
  //               },
  //               {
  //                 "content": "奖励内容3"
  //               },
  //               {
  //                 "content": "奖励内容奖励内容奖励内容奖励内容奖励内容奖励内容奖励内容奖励内容奖励内容奖励内容奖励内容奖励内容奖励内容奖励内容2"
  //               },
  //               {
  //                 "content": "奖励内容3"
  //               },
  //             ]
  //           }
  //         ],
  //         "level": "省部级"
  //       },
  //       {
  //         "data": [
  //           {
  //             "category": "期刊发表文章",
  //             "data": [
  //               {
  //                 "content": "奖励内容3"
  //               }
  //             ]
  //           },
  //           {
  //             "category": "国家权威认证证书",
  //             "data": [
  //               {
  //                 "content": "奖励内容2"
  //               }
  //             ]
  //           }
  //         ],
  //         "level": "集团级"
  //       },
  //       {
  //         "data": [
  //           {
  //             "category": "国家权威认证证书",
  //             "data": [
  //               {
  //                 "content": "奖励内容1"
  //               }
  //             ]
  //           }
  //         ],
  //         "level": "院级"
  //       }
  //     ]
  //   },
  //   "RetCode": "1",
  //   "RetVal": "查询完成"
  // }
  // return text;
}
//长期激励报告信息查询
export function longtermInfoQuery(params) {
  return request(
    "/microservice/allencouragement/encouragement/service/companyannuityinfoquery",
    params
  );
}
//福利报告信息查询
export function welfareInfoQuery(params) {
  return request(
    "/microservice/allencouragement/encouragement/service/welfareinfoquery",
    params
  );
}
//整体薪酬报告信息查询
export function wageInfoQuery(params) {
  return request(
    "/microservice/allencouragement/encouragement/service/wageinfoquery",
    params
  );
}
//有权限的服务信息查询
export function userServiceQuery(params) {
  return request("/microservice/serviceauth/p_usergetservice", params);
}
//基本信息导入服务
export function staffBascInfoImport(params) {
  return request(
    "/microservice/exceldataimport/encourage/staffbascinfoimport",
    params
  );
}
//合同信息导入服务
export function contractImport(params) {
  return request(
    "/microservice/exceldataimport/encourage/contractimport",
    params
  );
}
//奖惩信息导入服务
export function rewardimport(params) {
  return request(
    "/microservice/exceldataimport/encourage/rewardimport",
    params
  );
}

//借调信息导入服务
export function kinsfolkimport(params) {
  return request(
    "/microservice/exceldataimport/encourage/kinsfolkimport",
    params
  );
}

//人才信息导入服务
export function talentImport(params) {
  return request(
    "/microservice/exceldataimport/encourage/talentimport",
    params
  );
}

//考核信息导入服务
export function examineResultImport(params) {
  return request(
    "/microservice/exceldataimport/encourage/examineresultimport",
    params
  );
}
//职称信息导入服务
export function professionImport(params) {
  return request(
    "/microservice/exceldataimport/encourage/professionimport",
    params
  );
}
//职级晋升信息导入服务
export function postAndPromotionImport(params) {
  return request(
    "/microservice/exceldataimport/encourage/postandpromotionimport",
    params
  );
}
//培训数量信息导入服务
export function trainingNumImport(params) {
  return request(
    "/microservice/exceldataimport/encourage/trainingnumimport",
    params
  );
}
//培训课程信息导入服务
export function trainingCourseImport(params) {
  return request(
    "/microservice/exceldataimport/encourage/trainingcourseimport",
    params
  );
}

//认可激励信息导入服务
export function recognizedImport(params) {
  return request(
    "/microservice/exceldataimport/encourage/recognizedimport",
    params
  );
}

//积点信息导入服务
export function pointsImport(params) {
  return request(
    "/microservice/exceldataimport/encourage/pointsimport",
    params
  );
}
//福利信息导入服务
export function welfareInfoImport(params) {
  return request(
    "/microservice/exceldataimport/encourage/welfareinfoimport",
    params
  );
}

//年度薪酬福利信息导入服务
export function annualWageImport(params) {
  return request(
    "/microservice/exceldataimport/encourage/annualwageimport",
    params
  );
}

//导入数据查询服务
export function adminSimpleQuery(params) {
  return request("/microservice/encourage/adminsimplequery", params);
}
//导入加密数据查询服务
export function adminAdvanceInfoQuery(params) {
  return request(
    "/microservice/allencouragement/encouragement/service/adminadvanceinfoquery",
    params
  );
}

//基本信息更新服务
export function baskInfoUpdate(params) {
  return request(
    "/microservice/allencouragement/encouragement/service/baskinfoupdate",
    params
  );
}

//积点信息更新服务
export function pointsUpdate(params) {
  return request(
    "/microservice/allencouragement/encouragement/service/pointsupdate",
    params
  );
}

//福利信息更新服务
export function annualWelfareUpdate(params) {
  return request(
    "/microservice/allencouragement/encouragement/service/annualwelfareupdate",
    params
  );
}

//年度薪酬信息更新服务
export function annualWageUpdate(params) {
  return request(
    "/microservice/allencouragement/encouragement/service/annualwageupdate",
    params
  );
}

//人才信息更新服务
export function talentInfoUpdate(params) {
  return request(
    "/microservice/allencouragement/encouragement/service/talentinfoupdate",
    params
  );
}

//岗位职级晋升信息更新服务
export function postAndPromotionUpdate(params) {
  return request(
    "/microservice/allencouragement/encouragement/service/postandpromotionupdate",
    params
  );
}

//认可激励信息更新服务
export function recognizedUpdate(params) {
  return request(
    "/microservice/allencouragement/encouragement/service/recognizedupdate",
    params
  );
}

//培训课程信息更新服务
export function trainingCourseUpdate(params) {
  return request(
    "/microservice/allencouragement/encouragement/service/trainingcourseupdate",
    params
  );
}

//培训数量信息更新服务
export function trainingnNumUpdate(params) {
  return request(
    "/microservice/allencouragement/encouragement/service/trainingnumupdate",
    params
  );
}

//奖惩信息更新服务
export function rewardInfoUpdate(params) {
  return request(
    "/microservice/allencouragement/encouragement/service/rewardinfoupdate",
    params
  );
}

//合同信息更新服务
export function contractUpdate(params) {
  return request(
    "/microservice/allencouragement/encouragement/service/contractupdate",
    params
  );
}

//借调信息更新服务templateQuery
export function secondmentUpdate(params) {
  return request(
    "/microservice/allencouragement/encouragement/service/secondmentupdate",
    params
  );
}

//职称资格证书信息更新服务
export function titleAndCertificateUpdate(params) {
  return request(
    "/microservice/allencouragement/encouragement/service/titleandcertificateupdate",
    params
  );
}

//
export function wordbookQuery(params) {
  return request("/microservice/encourage/workbookquery", params);
}
//职称资格证书信息更新服务
export function getImportExl(params) {
  return request("/microservice/standardquery/encourage/categoryquery", params);
}
//管理员分配分类信息/分配信息列表查询
export function categorylistS(params) {
  return request("/microservice/encourage/admincategorylistquery", params);
}

// 查询全部的权限类别
export function allCategorylistS(params) {
  return request("/microservice/standardquery/encourage/categoryquery", params);
}

// 新增权限
export function saveAuthS(params) {
  return request(
    "/microservice/transinsert/encourage/admincategoryadd",
    params
  );
}

// 删除服务
export function deleteAuthS(params) {
  return request(
    "/microservice/transupdate/encourage/admincategoryalter",
    params
  );
}

// 项目余数查询
export function remainderListS(params) {
  return request("/microservice/examine/projrankquery", params);
}

// 项目余数更新
export function projRankUpdateS(params) {
  return request("/microservice/examine/projrankupdate", params);
}

// 修改历史
export function remainderHistoryS(params) {
  return request("/microservice/examine/deptrankhisquery", params);
}

// 项目余数历史
export function projRemainderHistoryS(params) {
  return request('/microservice/examine/projrankhistoryquery',params);
}

// 部门群体余数新增
export function addDeptRemainS(params) {
  return request("/microservice/examine/deptrankadd", params);
}

// 部门余数退回
export function rejectDataS(params) {
  return request("/microservice/examine/withdrawdeptdistribute", params);
}

// 项目余数退回
export function rejectProjDataS(params) {
  return request("/microservice/examine/withdrawprojdistribute", params);
}

//权限页面分类信息
export function typeInfoShow(params) {
  return request("/microservice/standardquery/encourage/categoryquery", params);
}
//权限页面下拉列表数据信息
export function metedataShow(params) {
  return request("/microservice/standardquery/encourage/metadataquery", params);
}
//权限页面table信息
export function formData(params) {
  return request("/microservice/encourage/metadataconfigquery", params);
}
//权限页面字段增加
export function fieldChang(params) {
  return request(
    "/microservice/allencouragement/encouragement/service/metadataalter",
    params
  );
}
//审核人信息增加
export function checkerAdd(params) {
  return request(
    "/microservice/allencouragement/encouragement/service/metadataconfigadd",
    params
  );
}
//审核人信息更新
export function checkerChang(params) {
  return request(
    "/microservice/allencouragement/encouragement/service/metadataconfigupdate",
    params
  );
}
//审核人和字段信息的删除
export function deleteInfo(params) {
  return request("/microservice/encourage/metadataconfigadel", params);
}
//查询待办
export function selectPending(params) {
  return request("/microservice/encourage/tobecheckquery", params);
}
//审核界面全部数据
export function checkInfo(params) {
  return request(
    "/microservice/allencouragement/encouragement/service/staffinfoquery",
    params
  );
}
//修改过的单元格数据
export function tbInfo(params) {
  return request(
    "/microservice/allencouragement/encouragement/service/checkdataquery",
    params
  );
}
//提交审核
export function submitCheck(params) {
  return request(
    "/microservice/allencouragement/encouragement/service/checkerdeal/",
    params
  );
}

// 培训课程信息查询
export function trainNameQuery(params) {
  return request('/microservice/encourage/trainingnamequery',params);
}

// 全面激励审核列表
export function getCheckMenu(params) {
  return request('microservice/standardquery/encourage/tobecheckquery',params);
}

// 审核详细
export function getChangeDetail(params) {
  return request('microservice/standardquery/encourage/checkdataquery',params);
}

// 审核操作
export function checkOperate(params) {
  return request('/microservice/allencouragement/encouragement/service/checkerdeal/',params);

}
//激励报告表格数据
export function reportList(params) {
  return request('/microservice/allencouragement/encouragement/service/adminreportlistquery',params);
}
//激励报告类型
export function ReportType(params) {
  return request('/microservice/allencouragement/encouragement/service/reportlistquery',params);
}
//激励报告添加更新删除
export function ReportSetting(params) {
  return request('/microservice/allencouragement/encouragement/service/adminreportsetting',params);
}
//激励报告导出
export function reportExport(params) {
  return request('/microservice/allencouragement/encouragement/export/reportexportpdf',params);
}
//BP增删改查
export function BPinfo(params) {
  return request('/microservice/allexamine/examine/principaldeptconf',params);
}