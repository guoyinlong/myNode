/**
 * 作者：郭银龙
 * 创建日期： 2020-9-28
 * 邮箱: guoyl@itnova.com.cn
 * 功能： 新闻宣传系统服务接口
 */
import request from '../../utils/request';

//稿件首页
export function manuscriptManagement(param) {
	return request('/microservice/newsmanager/queryNews', param);
}
//稿件新增
export function addNews(param) {
	return request('/microservice/newsmanager/addNews', param);
}
//稿件删除
export function delNews(param) {
	return request('/microservice/newsmanager/delNews', param);
}
//服务2  申请单位
export function checkObjectAndContent(param) {
    return request('/microservice/newsmanager/queryDept', param);
}
//服务2  作者
export function author(param) {
    // return request('/microservice/newsmanager/queryInspectObjectAndContent', param);
    return {
		'retCode':"1",
		"RetVal":"2",
		"dataRows":[

            {
                "id": "1",
                "roleName": "文稿作者"
            },
            {
                "id": "2",
                "roleName": "图片作者"
            },
            {
                "id": "3",
                "roleName": "视频剪辑人员"
            },
            {
                "id": "4",
                "roleName": "H5编辑人员"
            },
            {
                "id": "5",
                "roleName": "其他q"
            }
			],

	}
}
//服务2  提交人
export function tijiaoren(param) {
     return request('/microservice/newsmanager/queryUserByDeptId', param);
}
//服务2  稿件详情
export function gaojianxiangqing(param) {
    return request('/microservice/newsmanager/queryFixedNews', param);
}
//服务2  稿件发布情况首页
export function qingkuangfankui(param) {
    return request('/microservice/newsmanager/queryNewsPub', param);
}
//稿件原名
export function querySourceNews(param) {
    return request('/microservice/newsmanager/querySourceNews', param);
}
//服务2  稿件发布新增
export function addPub(param) {
    return request('/microservice/newsmanager/addPub', param);
}
// 稿件发布详情
export function sucaifankuixiangqing(param) {
   return request('/microservice/newsmanager/queryFixNewsPub', param);
}

//统计报表
export function tjbb(param) {
	return request('/microservice/newsmanager/queryStatisticsListOne', param);
}
export function queryStatisticsListTwo(param) {
	return request('/microservice/newsmanager/queryStatisticsListTwo', param);
}
//统计图表统计图-每月量和分院量
export function TJTBReport (param) {
	return request('/microservice/newsmanager/queryStaticsPic', param);
}
//统计图表统计图-分院详情部门量
export function myechartReport (param) {
	return request('/microservice/newsmanager/queryStaticsPicByOu', param);
}
//个人排名列表
export function gerenRanking(param) {
	return request('/microservice/newsmanager/queryPersonalRanking', param);
}
//个人在本院的排名
export function loginUserRank(param) {
	return request('/microservice/newsmanager/loginUserRank', param);
}
//部门排名
export function deptRanking(param) {
	return request('/microservice/newsmanager/queryDeptRanking', param);
}
//支部排名
export function zhibuRanking(param) {
	return request('/microservice/newsmanager/queryZhiBuRanking', param);
}
//宣传组织首页表格列表
export function xczz(param) {
	return request('/microservice/newsmanager/selectProOrganizationLikePage', param);
}
//宣传组织删除
export function xczzDelept(param) {
	return request('/microservice/newsmanager/deleteProOrganization', param);
}
//宣传组织新增
export function addProOrganization(param) {
	return request('/microservice/newsmanager/addProOrganization', param);
}
//宣传组织填报，队长队员查询
export function queryDeptThought(param) {
	return request('/microservice/newsmanager/queryDeptThought', param);
}
//宣传组织详情
export function queryDeptDetail(param) {
    return request('/microservice/newsmanager/queryProOrganizationDetail', param);
}
//宣传组织修改
export function xczzUpdate(param) {
	return request('/microservice/newsmanager/updateProOrganization', param);
}
//稿件复核
export function gjfh(param) {
	return request('/microservice/newsmanager/queryNewsCheck', param);
}
//稿件复核删除
export function deleteNewsCheck(param) {
	return request('/microservice/newsmanager/deleteNewsCheck', param);
}
//稿件复核详情
export function queryMyCheckItem(param) {
	return request('/microservice/newsmanager/queryMyCheckItem', param);

}
//加分项
export function jfx(param) {
	return request('/microservice/newsmanager/queryBonusItemsList', param);
}
//积分
export function jf(param) {
	return request('/microservice/newsmanager/queryPoints', param);
}
//我的审核-我的待办列表
export function queryMyCheckTodo(param) {
    return request('/microservice/newsmanager/queryMyCheckTodo', param)
}
//我的审核-我的待办列表
export function queryCheckItem(param) {
    return request('/microservice/newsmanager/queryCheckItem', param)
}
//我的审核-我的已办列表
export function queryMyCheckDone(param) {
    return request('/microservice/newsmanager/queryMyCheckDone', param)
}
//我的审核-我的办结列表
export function queryMyCheckFinish(param) {
    return request('/microservice/newsmanager/queryMyCheckFinish', param)
}
//新闻配置中拟宣/发布渠道配置和新闻公告 宣传公告配置
export function pubAnnouncement(param) {
    return request('/microservice/newsmanager/pubAnnouncement', param)
}
//新闻配置中拟宣/发布渠道配置和新闻公告
export function  pubChannelAdd(param) {
    return request('/microservice/newsmanager/pubChannelAdd', param)
}
//拟宣/发布渠道删除
export function  pubChannelDel(param) {
    return request('/microservice/newsmanager/pubChannelDel', param)
}
//拟宣/发布渠道修改
export function  pubChannelEdit(param) {
    return request('/microservice/newsmanager/pubChannelEdit', param)
}
//拟宣/发布渠道查询一级查询
export function  pubChannelQueryOne(param) {
    return request('/microservice/newsmanager/pubChannelQueryOne', param)
}
//拟宣/发布渠道查询二级查询
export function  pubChannelQueryTwo(param) {
    return request('/microservice/newsmanager/pubChannelQueryTwo', param)
}
//新增宣传类型的接口
export function addPromotionType(param) {
    return request('/microservice/newsmanager/addPromotionType', param)
}
//查询宣传类型的接口
export function queryPromotionType(param) {
    return request('/microservice/newsmanager/queryPromotionType', param)
}
//删除宣传类型
export function deletePromotionType(param) {
    return request('/microservice/newsmanager/deletePromotionType', param)
}
//修改宣传类型
export function updatePromotionType(param) {
    return request('/microservice/newsmanager/updatePromotionType', param)
}
//查询宣传计划配置列表
export function queryPubPlan(param) {
    return request('/microservice/newsmanager/queryPubPlan', param)
}
//新增宣传计划
export function addPubPlan(param) {
    return request('/microservice/newsmanager/addPubPlan', param)
}
///删除宣传计划
export function deletePubPlan(param) {
    return request('/microservice/newsmanager/deletePubPlan', param)
}
//更新宣传计划
export function updatePubPlan(param) {
    return request('/microservice/newsmanager/updatePubPlan', param)
}
//查询宣传计划中新增-部门
export function queryPlanDept(param) {
    return request('/microservice/newsmanager/queryPlanDept', param)
}
//查询宣传计划中新增-拟发布平台查询
export function queryTwoChannel(param) {
    return request('/microservice/newsmanager/queryTwoChannel', param)
}
//新增宣传奖项
export function addPubReward(param) {
    return request('/microservice/newsmanager/addPubReward', param)
}
//删除宣传奖项
export function deletePubReward(param) {
    return request('/microservice/newsmanager/deletePubReward', param)
}
//查询宣传奖项
export function queryPubReward(param) {
    return request('/microservice/newsmanager/queryPubReward', param)
}
//修改宣传奖项
export function updatePubReward(param) {
    return request('/microservice/newsmanager/updatePubReward', param)
}
//新增保密文件
export function addSecretFile(param) {
    return request('/microservice/newsmanager/addSecretFile', param)
}
//删除保密文件
export function deleteSecret(param) {
    return request('/microservice/newsmanager/deleteSecret', param)
}
//查询保密文件配置列表
export function querySecretFile(param) {
    return request('/microservice/newsmanager/querySecretFile', param)
}
//根据时间查询 争优创先结果
export function queryByTimeUploadEvaluation(param) {
    return request('/microservice/newsmanager/queryByTimeUploadEvaluation', param)
}
//新增舆情管理接口
export function addPubSentiment(param) {
    return request('/microservice/newsmanager/addPubSentiment', param)
}
///舆情管理审批环节详情查询
export function queryPubSentimentExamineItem(param) {
    return request('/microservice/newsmanager/queryPubSentimentExamineItem', param)
}
///舆情管理详情查询
export function queryPubSentimentItem(param) {
    return request('/microservice/newsmanager/queryPubSentimentItem', param)
}
//查询一级舆情报告列表
export function queryPubSentimentList(param) {
    return request('/microservice/newsmanager/queryPubSentimentList', param)
}
//查询二级舆情报告列表
export function queryTwoPubSentiment(param) {
    return request('/microservice/newsmanager/queryTwoPubSentiment', param)
}
//新闻宣传员配置 查找宣传配置列表
export function queryNewsPub(param) {
    return request('/microservice/newsmanager/queryPublicist', param);
}
export function queryOuDept(param) {
    return request('/microservice/newsmanager/queryOuDept',param)
}
//宣传渠道类型查询（查询条件下拉框）
export function channelRequest(param) {
    return request('/microservice/newsmanager/queryPublicityChannelType',param)
}
//部门
export function queryDept(param) {
    return request('/microservice/newsmanager/queryDept',param)
}
//宣传渠道备案列表模糊查询
export function queryPublicityChannel(param) {
    return request('/microservice/newsmanager/queryPublicityChannel', param)
}
//宣传渠道备案详情数据查询
export function queryPublicityChannelDetail(param) {
    return request('/microservice/newsmanager/queryPublicityChannelDetail', param)
}
//宣传渠道备案审批环节数据查询
export function queryRecordExamineItem(param) {
  return request('/microservice/newsmanager/queryRecordExamineItem', param)
}
//新闻资源池你宣传渠道下拉框数据查询
export function queryPoolPub(param) {
    return request('/microservice/newsmanager/queryPoolPub', param)
}
//新闻资源池模糊查询
export function queryNewsPool(param) {
    return request('/microservice/newsmanager/queryNewsPoolNew', param)
}
//新闻资源池详情查询
export function queryFixedNewsPool(param) {
    return request('/microservice/newsmanager/queryFixedNewsPool', param)
}
//案例与经验分享首页案例标题插查询
export function queryTitleName(param) {
    return request('/microservice/newsmanager/queryTitleName',param)
}
//案例与经验分享首页删除
export function deleteCaseCaseExSharing(param) {
    return request('/microservice/newsmanager/deleteCaseCaseExSharing',param)
}

//案例与标题模糊新增页面提交
export function addCaseCaseExSharing(param) {
    return request('/microservice/newsmanager/addCaseCaseExSharing', param)
}
//案例与标题模糊查询接口
export function queryCaseExSharing(param) {
    return request('/microservice/newsmanager/queryCaseExSharing',param)
}
 //案例与标题详情修改页面审批环节接口
 export function queryShareExamineItem(param) {
    return request('/microservice/newsmanager/queryShareExamineItem', param)
  }
//舆情管理中宣传渠道查询
export function queryChannelInPubSentiment(param) {
    return request('/microservice/newsmanager/queryChannelInPubSentiment', param)
}
//新闻工作报告根据时间名称查询分页
export function queryNewsReportLike(param) {
    return request('/microservice/newsmanager/queryNewsReportLike', param)
}
//自有宣传渠道新增页面提交
export function  addPublicityChannel(param) {
    return request('/microservice/newsmanager/addPublicityChannel', param)
}
//自有宣传渠道首页删除服务
export function  deletePublicityChannel(param) {
    return request('/microservice/newsmanager/deletePublicityChannel', param)
}
//自有宣传渠道修改页面提交服务
export function  updatePublicityChannel(param) {
    return request('/microservice/newsmanager/updatePublicityChannel', param)
}
//稿件新增查询保密文件
export function onlySecret(param) {
    return request('/microservice/newsmanager/onlySecret',param)
}
//稿件新增
export function editNews(param) {
	return request('/microservice/newsmanager/editNews',param);
}
//案例与标题详情查询接口
export function queryCaseCaseExSharingDetail(param) {
    return request('/microservice/newsmanager/queryCaseCaseExSharingDetail', param)
}
//案例与标题详情修改页面提交保存接口
export function updateCaseCaseExSharing(param) {
    return request('/microservice/newsmanager/updateCaseCaseExSharing', param)
}
//稿件复核新增
export function addNewsCheck(param) {
	return request('/microservice/newsmanager/addNewsCheck', param);
}
//加分项新增
export function addBonusItem(param) {
	return request('/microservice/newsmanager/addBonusItem', param);
}
//加分项详情
export function queryBonusItem(param) {
	return request('/microservice/newsmanager/queryBonusItem', param);
}
//加分项删除
export function deleteBonusItem(param) {
	return request('/microservice/newsmanager/deleteBonusItem', param);
}
//加分项修改
export function updateBonusItem(param) {
	return request('/microservice/newsmanager/updateBonusItem', param);
}
//积分规则
export function reaultSerch(param) {
    return request('/microservice/newsmanager/onlyRule', param)
}
//修改舆情
export function updatePubSentiment(param) {
    return request('/microservice/newsmanager/updatePubSentiment', param)
}
//删除舆情管理
export function deletePubSentiment(param) {
    return request('/microservice/newsmanager/deletePubSentiment', param)
}
//稿件名称的发布情况
export function queryStatisticsListItem(param) {
	return request('/microservice/newsmanager/queryStatisticsListItem', param);
}
//稿件复核修改
export function updateNewsCheck(param) {
	return request('/microservice/newsmanager/updateNewsCheck', param);
}
//积分修改
export function jfSet(param) {
	return request('/microservice/newsmanager/updateScore', param);
}
//新闻资源池点击处理
export function queryPoolProcess(param) {
    return request('/microservice/newsmanager/queryPoolProcess', param)
}
//争优创先首页-上传
export function uploadEvaluationUpload(param) {
    return request('/microservice/newsmanager/uploadEvaluationUpload', param)
}
//查询发布稿件原名称
export function queryNewsByUser(param) {
    return request('/microservice/newsmanager/queryNewsByUser', param);
}
//新增工作报告
export function addNewsReport(param) {
    return request('/microservice/newsmanager/addNewsReport', param)
}
//新闻工作报告详情
export function selectOneDetail(param) {
    return request('/microservice/newsmanager/selectOneDetail', param)
}
//新闻资源池点击下载
export function queryNewsPoolDown(param) {
	return request('/microservice/newsmanager/queryNewsPoolDown', param)
}
//查询发布稿件原名称
export function queryNewsByUsers(param) {
	return request('/microservice/newsmanager/queryNewsByUsers', param);
}//新闻宣传贡献清单
//培训备案 -培训备案上传
export function addTrainUpload(param) {
    return request('/microservice/newsmanager/addTrainUpload', param);
  }
  //个人培训记录模糊查询
  export function queryTrainLike(param) {
    return request('/microservice/newsmanager/queryTrainLike', param);
  }
  ///查询所有培训名字
  export function queryDistinctName(param) {
    return request('/microservice/newsmanager/queryDistinctName', param);
  }
  //培训中个人培训记录详情
  export function queryTrainDetail(param) {
    return request('/microservice/newsmanager/queryTrainDetail', param);
  }
  //查询去重部门
  export function queryDistinctDeptName(param) {
    return request('/microservice/newsmanager/queryDistinctDeptName', param);
  }
  //培训申请 -培训填报
  export function addTrainFill(param) {
    return request('/microservice/newsmanager/addTrainFill', param);
  }
  //组织本单位报送查询
  export function organizationUnitSend(param) {
    return request('/microservice/newsmanager/organizationUnitSend', param);
  }
  //新闻宣传员部门查询
  export function queryDeptByOuId(param) {
    return request('/microservice/newsmanager/queryDeptByOuId', param);
  }
  //新闻宣传员部门员工查询
  export function queryUserListByDeptId(param) {
    return request('/microservice/newsmanager/queryUserListByDeptId', param);
  }
  //新增新闻宣传员
  export function addPublicist(param) {
    return request('/microservice/newsmanager/addPublicist', param);
  }
  //删除新闻宣传员
  export function deletePublicist(param) {
    return request('/microservice/newsmanager/deletePublicist', param);
  }
  //修改新闻宣传员
  export function updatePublicist(param) {
    return request('/microservice/newsmanager/updatePublicist', param);
  }
  export function queryMaterialItem(param) {
    return request('/microservice/newsmanager/queryMaterialItem', param);
 }
//我的审核启动
export function beginTask(param) {
    return request('/microservice/newsmanager/workflow/beginTask', param);
 }
 export function completeTask(param) {
    return request('/microservice/newsmanager/workflow/completeTask', param);
 }
 //待办列表
 export function showTodoApprovalList(param) {
    return request('/microservice/newsmanager/workflow/showTodoApprovalList', param);
 }
 //待办详情
 export function showTodoApprovalDetail(param) {
    return request('/microservice/newsmanager/workflow/showTodoApprovalDetail', param);
    }
 //新闻宣传贡献清单-软件研究院重大活动支撑 -填报
 export function addActivity(param) {
    return request('/microservice/newsmanager/addActivity', param);
  }
  //新闻宣传贡献清单-软件研究院重大活动支撑 -查询个人重大活动支撑列表的接口
  export function queryActivityList(param) {
    return request('/microservice/newsmanager/queryActivityList', param);
  }
  //新闻宣传贡献清单-软件研究院重大活动支撑 -重大活动支撑上传
  export function activityUpload(param) {
    return request('/microservice/newsmanager/activityUpload', param);
  }
  //新闻宣传贡献清单-软件研究院重大活动支撑 -详情
  export function queryActivityItem(param) {
    return request('/microservice/newsmanager/queryActivityItem', param);
  }
  //新闻宣传贡献清单-软件研究院重大活动支撑 -审批环节
  export function queryActivityExamineItem(param) {
    return request('/microservice/newsmanager/queryActivityExamineItem', param);
  }
  //新闻宣传贡献清单-新闻工作贡献清单的其他查询
  export function queryOther(param) {
    return request('/microservice/newsmanager/queryOther', param);
  }
   //稿件审批环节
   export function queryNewsLink(param) {
    return request('/microservice/newsmanager/queryNewsExamineItem', param);
  }
   //加分项审批环节
   export function queryBonusExamineItem(param) {
    return request('/microservice/newsmanager/queryBonusExamineItem', param);
  }
   //稿件复核审批环节
   export function queryMyCheckExamineItem(param) {
    return request('/microservice/newsmanager/queryMyCheckExamineItem', param);
  }
  //新闻宣传贡献清单-查询当前登录人是否是管理员
 export function queryAdminInActivity(param) {
    return request('/microservice/newsmanager/queryAdminInActivity', param);
  }
  //新闻宣传贡献清单-查询新闻贡献清单中所选中人的重大活动支撑接口
  export function queryUserActivityList(param) {
    return request('/microservice/newsmanager/queryUserActivityList', param);
  }
  //新闻宣传贡献清单-重大活动支撑接口-修改
 export function updateActivity(param) {
    return request('/microservice/newsmanager/updateActivity', param);
  }
  //新闻宣传贡献清单-重大活动支撑接口-删除
  export function deleteActivity(param) {
    return request('/microservice/newsmanager/deleteActivity', param);
  }
  //新闻宣传贡献清单-重大活动支撑接口-下载
  export function downloadActivity(param) {
    return request('/microservice/newsmanager/downloadActivity', param);
  }
  //争先创优-新闻工作报告审批详情
  export function queryReportExamineItem(param) {
    return request('/microservice/newsmanager/queryNewsReportExamineItem', param);
  }
  //争先创优-新闻工作报告审批修改页面提交
  export function updateNewsReport(param) {
    return request('/microservice/newsmanager/updateNewsReport', param);
  }
  //争先创优-新闻工作报告删除
  export function deleteNewsReport(param) {
    return request('/microservice/newsmanager/deleteNewsReport', param);
  }
  //全员贡献清单-查询全员贡献清单
  export function queryContributionList(param) {
    return request('/microservice/newsmanager/queryContributionList', param);
  }
  //查询培训审批环节详情
  export function queryTrainExamineItem(param) {
   return request('/microservice/newsmanager/queryTrainExamineItem', param);
 }
 //培训上传-修改
 export function updateTrainFill(param) {
   return request('/microservice/newsmanager/updateTrainFill', param);
 }
 //查询宣传组织审批环节
 export function queryProOrganizationExamineItem(param) {
    return request('/microservice/newsmanager/queryProOrganizationExamineItem', param);
  }
//争先创优评优查询 -导入
export function queryEvaluateByUploadTime(param) {
  return request('/microservice/newsmanager/queryEvaluateByUploadTime', param);
}
//争先创优首页图片上传
export function uploadImag(param) {
    return request('/microservice/newsmanager/uploadImag', param);
  }
//争先创优评优查询 -删除
export function deleteEvaluate(param) {
  return request('/microservice/newsmanager/deleteEvaluate', param);
}
//争先创优评优查询 -图片上传
export function uploadImage(param) {
  return request('/microservice/newsmanager/uploadImage', param);
}
//新闻宣传贡献清单 -培训批量上传-培训物料上传
export function uploadMaterial(param) {
  return request('/microservice/newsmanager/uploadMaterial', param);
}
//新闻宣传贡献清单 -培训查询包含Excel的数据与DB中的数据
export function queryTrainResultAndTrainByJobNumber(param) {
  return request('/microservice/newsmanager/queryTrainResultAndTrainByJobNumber', param);
}
//新闻宣传贡献清单 -重大活动批量文件上传
export function uploadActivityImage(param) {
  return request('/microservice/newsmanager/uploadActivityImage', param);
}
//新闻宣传贡献清单 -批量上传Excel培训记录的详情
export function queryTrainResultDetail(param) {
  return request('/microservice/newsmanager/queryTrainResultDetail', param);
}
//新闻宣传贡献清单 -培训与批量导入培训记录删除
export function deleteTrainAndTrainResult(param) {
  return request('/microservice/newsmanager/deleteTrainAndTrainResult', param);
}
//新闻宣传贡献清单 -培训查询包含Excel的数据与DB中的数据, 包括没有审核通过的数据
export function queryTrainResultAndTrainByIdAll(param) {
  return request('/microservice/newsmanager/queryTrainResultAndTrainByIdAll', param);
}
// 争先创优首页图片删除
export function deleteImage(param) {
  return request('/microservice/newsmanager/deleteImage', param);
}