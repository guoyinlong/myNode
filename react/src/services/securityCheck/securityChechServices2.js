/**
 * 作者：gyl
 * 创建日期： 2020-4-21
 * 邮箱: guoyl@itnova.com.cn
 * 功能： 安全管理系统服务接口
 */
import request from '../../utils/request';
// 我的消息(魏永杰)
// | arg_state        | varchar(32) | 是       | 0、待办（默认查询待办）；1、已办 |
// | arg_page_size    | int(11)     | 否       | 页面大小（默认为10）             |
// | arg_page_current | int(11)     | 否       | 当前页数（默认为第一页）         |
export function myNews(param) { 
	return request('/microservice/securityinspect/queryInformation',param);
    return {
        "retVal": "1",
        "retCode": "1",
        "allCount": "5",        //-- 查询出的总条数
        "pageCount": "1",		//-- 当前页码
        "rowCount": "5",        //-- 每页显示的总条数
        "pageCurrent": "1",		//-- 当前页码
        "dataRows": [
            {
                "infoId": "0",		//-- 消息id，
                "rekatedId":"0", //   -- 消息关联id
				"relatedType":"1",//      -- 消息类型    （0、督查信息   1、任务信息  2、检查结果信息 3、统计信息 4、任务详情）
				"informationType":"安全检查任务",
				//通报审批,统计审批,整改通知,整改通知,员工自查,安全检查反馈,员工督察,安全检查任务
                "state":"0",		//	-- 消息状态   0、代办  1、已办  
                "createTime":"2020-10-22", //   -- 消息创建时间
                "createUserId":"创建者userid1",	//-- 创建者userid
				"createUserName":"秦斌"	,//	--创建者姓名
				"createUserDeptName":"财务部",//创建者所在的部门
				"createUserRoleName":"项目制管理平台-安全检查管理(二期)-安委办主办安全检查任务"//创建者角色
			
            },
            {
                "infoId": "1",		//-- 消息id，
                "rekatedId":"1", //   -- 消息关联id
				"relatedType":"1",//      -- 消息类型    （0、督查信息   1、任务信息  2、检查结果信息 3、统计信息 4、任务详情）
				"informationType":"安全检查任务",
                "state":"0",		//	-- 消息状态   0、代办  1、已办  
                "createTime":"2020-10-20", //   -- 消息创建时间
                "createUserId":"创建者userid3",	//-- 创建者userid
				"createUserName":"秦斌",	//	--创建者姓名
				"createUserDeptName":"财务部",//创建者所在的部门
				"createUserRoleName":"项目制管理平台-安全检查管理(二期)-安委办主办安全检查任务"//创建者角色
            }
            ,
            {
                "infoId": "2",		//-- 消息id，
                "rekatedId":"2", //   -- 消息关联id
				"relatedType":"4",//      -- 消息类型    （0、督查信息   1、任务信息  2、检查结果信息 3、统计信息 4、任务详情）
				"informationType":"整改通知",//整改通知
                "state":"0",		//	-- 消息状态   0、代办  1、已办  
                "createTime":"2020-10-22", //   -- 消息创建时间
                "createUserId":"创建者userid1",	//-- 创建者userid
				"createUserName":"张三",	//	--创建者姓名
				"createUserDeptName":"财务部",//创建者所在的部门
				"createUserRoleName":"项目制管理平台-安全检查管理(二期)-安委办主办整改通知"//创建者角色
            },
            {
                "infoId": "3",		//-- 消息id，
                "rekatedId":"3", //   -- 消息关联id
				"relatedType":"1",//      -- 消息类型    （0、督查信息   1、任务信息  2、检查结果信息 3、统计信息 4、任务详情）
				"informationType":"员工自查",//员工自查任务
                "state":"0",		//	-- 消息状态   0、代办  1、已办  
                "createTime":"2020-10-21", //   -- 消息创建时间
                "createUserId":"创建者userid2",	//-- 创建者userid
				"createUserName":"里斯"	,//	--创建者姓名
				"createUserDeptName":"财务部",//创建者所在的部门
				"createUserRoleName":"项目制管理平台-安全检查管理(二期)-安委办主办员工自查任务"//创建者角色
            },
            {
                "infoId": "4",		//-- 消息id，
                "rekatedId":"4", //   -- 消息关联id
				"relatedType":"4",//      -- 消息类型    （0、督查信息   1、任务信息  2、检查结果信息 3、统计信息 4、任务详情）
				"informationType":"整改反馈消息",//整改反馈消息页面
                "state":"0",		//	-- 消息状态   0、代办  1、已办  
                "createTime":"2020-10-20", //   -- 消息创建时间
                "createUserId":"创建者userid3",	//-- 创建者userid
				"createUserName":"赵六",	//	--创建者姓名
				"createUserDeptName":"财务部",//创建者所在的部门
				"createUserRoleName":"项目制管理平台-安全检查管理(二期)-安委办主办整改反馈消息页面"//创建者角色
            },
            {
                "infoId": "5",		//-- 消息id，
                "rekatedId":"5", //   -- 消息关联id
				"relatedType":"0",//      -- 消息类型    （0、督查信息   1、任务信息  2、检查结果信息 3、统计信息 4、任务详情）
				"informationType":"员工督查",//员工督查反馈
                "state":"0",		//	-- 消息状态   0、代办  1、已办  
                "createTime":"2020-10-20", //   -- 消息创建时间
                "createUserId":"创建者userid3",	//-- 创建者userid
				"createUserName":"薛刚",	//	--创建者姓名
				"createUserDeptName":"财务部",//创建者所在的部门
				"createUserRoleName":"项目制管理平台-安全检查管理(二期)-安委办主办员工督查反馈"//创建者角色
            },
            {
                "infoId": "6",		//-- 消息id，
                "rekatedId":"6", //   -- 消息关联id
				"relatedType":"4",//      -- 消息类型    （0、督查信息   1、任务信息  2、检查结果信息 3、统计信息 4、任务详情）
				"informationType":"安全检查反馈",//对不合格的整改反馈
                "state":"0",		//	-- 消息状态   0、代办  1、已办  
                "createTime":"2020-10-20", //   -- 消息创建时间
                "createUserId":"创建者userid3",	//-- 创建者userid
				"createUserName":"张青"	,//	--创建者姓名
				"createUserDeptName":"财务部",//创建者所在的部门
				"createUserRoleName":"项目制管理平台-安全检查管理(二期)-安委办主办对不合格的整改反馈"//创建者角色
			},
			{
                "infoId": "7",		//-- 消息id，
                "rekatedId":"7", //   -- 消息关联id
				"relatedType":"2",//      -- 消息类型    （0、督查信息   1、任务信息  2、检查结果信息 3、统计信息 4、任务详情）
				"informationType":"通报意见",//通报意见征求反馈
                "state":"0",		//	-- 消息状态   0、代办  1、已办  
                "createTime":"2020-10-20", //   -- 消息创建时间
                "createUserId":"创建者userid3",	//-- 创建者userid
				"createUserName":"张峰",	//	--创建者姓名
				"createUserDeptName":"财务部",//创建者所在的部门
				"createUserRoleName":"项目制管理平台-安全检查管理(二期)-安委办主办通报意见征求反馈"//创建者角色
			},
			{
                "infoId": "8",		//-- 消息id，
                "rekatedId":"8", //   -- 消息关联id
				"relatedType":"3",//      -- 消息类型    （0、督查信息   1、任务信息  2、检查结果信息 3、统计信息 4、任务详情）
				"informationType":"审批统计报告",//审批统计报告
                "state":"0",		//	-- 消息状态   0、代办  1、已办  
                "createTime":"2020-10-20", //   -- 消息创建时间
                "createUserId":"创建者userid3",	//-- 创建者userid
				"createUserName":"王二",	//	--创建者姓名
				"createUserDeptName":"财务部",//创建者所在的部门
				"createUserRoleName":"项目制管理平台-安全检查管理(二期)-安委办主办审批统计报告"//创建者角色
			},
			{
                "infoId": "9",		//-- 消息id，
                "rekatedId":"9", //   -- 消息关联id
				"relatedType":"3",//      -- 消息类型    （0、督查信息   1、任务信息  2、检查结果信息 3、统计信息 4、任务详情）
				"informationType":"审批统计报告",//审批统计报告
                "state":"0",		//	-- 消息状态   0、代办  1、已办  
                "createTime":"2020-10-20", //   -- 消息创建时间
                "createUserId":"创建者userid3",	//-- 创建者userid
				"createUserName":"王二",	//	--创建者姓名
				"createUserDeptName":"财务部",//创建者所在的部门
				"createUserRoleName":"项目制管理平台-安全检查管理(二期)-安委办主办审批统计报告(分院)"//创建者角色
            },{
                "infoId": "9",		//-- 消息id，
                "rekatedId":"9", //   -- 消息关联id
				"relatedType":"3",//      -- 消息类型    （0、督查信息   1、任务信息  2、检查结果信息 3、统计信息 4、任务详情）
				"informationType":"审批统计报告",//审批统计报告
                "state":"0",		//	-- 消息状态   0、代办  1、已办  
                "createTime":"2020-10-20", //   -- 消息创建时间
                "createUserId":"创建者userid3",	//-- 创建者userid
				"createUserName":"王二",	//	--创建者姓名
				"createUserDeptName":"财务部",//创建者所在的部门
				"createUserRoleName":"项目制管理平台-安全检查管理(二期)-安委办主办审批统计报告(分院)"//创建者角色
            }
    
        ],
       
    }
}
// 服务21：查角色(魏永杰)
export function queryUserInfo(param) {
	return request('/microservice/securityinspect/queryUserInfo',param);
	 return {
        "RetVal": "1",
        "retCode": "1",
        "dataRows": [
           {
                "userId": "0563582",
                "userName": "秦斌",
                "deptId": "e65c07d7179e11e6880d008cfa0427c4",
                "deptName": "联通软件研究院-办公室（党委办公室）",
								"roleName": "项目制管理平台-安全检查管理-各分院安委办主办,项目制管理平台-安全检查管理-软研院安委办主办",
								// "roleName": "办公室安全接口人",
								// "roleName": "安全员",
								// "roleName": "分院部门安全员", 
                "ouid": "e65c02c2179e11e6880d008cfa0427c4"
            }
        ],
       
    }
}
// 通报意见征求和审批统计(苗健)
export function Notification(param) {
	return request('/microservice/securityinspect/clickinfoquery',param);            
    return {
        "retCode":"1",
        "retVal":"...",
        "dataRows":[
            {
                "type":"1"      ,      //--表明这是哪种信息：0,表示通报征求和审批统计;1,表示员工督查反馈;2,整改反馈和整改通知;3,安全检查和员工自查;
                "createUserName":"杨青",//	--发布人
                "startTime":"2020-03-04",		//	--起始时间
                "endTime":"2020-03-5",		//	--截止时间
                "taskTitle":"检查主题",		//	--检查主题
                "taskType":"safeCheck",	 	//	--检查方式（安委办统查（safeCheck）   安委办抽查（ safeSpotCheck）  专项检查（specialCheck） 分院统查（branchSafeCheck） 分院抽查（branchSportCheck） 分院专项检查（branchSpecialCheck） 部门自查（deptSelfCheck）  部门间互查（deptEoCheck）  部门统查（deptSafeCheck）  部门抽查（deptSportCheck）  员工自查（staffSelfCheck） 工作通知（workNotified））返回数字
                "taskTypeDesc":"...", //	--返回检查方式的中文名称
                "examineObj":"全员",	//	--检查对象,多个用逗号隔开
                "result":"任务结果",		//	--任务结果
                "examineImg":"https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png,https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",	//	--图片，用逗号隔开
                "statistics":[
            	{
            		"ourHospital":{				//--本院各部门数据统计
                        "xAxis":[
                            {
                                "type":"category",
                                "data":["A部门","B部门"]	//--返回的是院里的部门
                            }
                        ],
                        "yAxis":[
                            {"type":"value"}
                        ],
                        "series":[
                            {
                                "name":"合格",
                                "type":"bar",
                                "data":[5,8,6,9,1,2] //返回的是每个部门的合格人数
                            },
                            {
                                "name":"不合格",
                                "type":"bar",
                                "data":[5,8,6,9,1,2] //返回的是每个部门的不合格人数
                            }
                        ]
                    },
                    "ou":{			//--各分院数据统计，
                        "xAxis":[
                            {
                                "type":"category",
                                "data":["A分院","B分院"]	//--返回的是分院的名字
                            }
                        ],
                        "yAxis":[
                            {"type":"value"}
                        ],
                        "series":[
                            {
                                "name":"合格",
                                "type":"bar",
                                "data":[5,8,6,9,1,2] //返回的是每个分院的合格人数
                            },
                            {
                                "name":"不合格",
                                "type":"bar",
                                "data":[5,8,6,9,1,2] //返回的是每个分院的不合格人数
                            }
                        ]
                    }

            	}
            ]
            }
        ]
    }
}
// 整改反馈和整改通知(苗健)
export function rectificationNotice(param) {
	return request('/microservice/securityinspect/clickinfoquery',param);
    return {
		"retCode":"1",
        "retVal":"...",
        "dataRows":[
			{
				"informationType":"整改通知/整改反馈",   //  --当前消息类型，以文字形式返回 
				"assetsName":"A-001",	//		--资产名称
				"assetsArea":"办公室",	//		--所属区域
				"dutyUserName":"张青",	//		--责任人员
				"dutyDeptName":"财务部",	//		--所属部门
				"stateReform":"https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png,https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
				"examinState":"检查情况",	//			--检查情况
				"reformOpinion":"有待加强",	//			--建议
				"problemLevel":"average",	//		--情况等级，严重（severe）、差（poor）、一般（average）、轻微（mild）、好（good），良好（well），非常好（perfect）,
				"endTime":"2020-04-06",		//		--截止时间
				"reformSet":[		//		--整改信息
					{
						"img":"https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png,https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",				//--整改图片，用逗号隔开
						"appraiseContent":"还是不合格请继续整改",	//--评价
						"appraiseDesc":"已经整改完毕"		//--描述
						
					},
					{
						"img":"https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png,https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png,https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png,",				//--整改图片，用逗号隔开
						"appraiseContent":"",	//--评价
						"appraiseDesc":"已经整改完毕"		//--描述
					}
				]
				
			}
		]
	}
}
// 派发安全检查(苗健)
export function EmployeeSelfexamination2(param) {
	return request('/microservice/securityinspect/clickinfoquery',param);
    return {
		"retCode":"1",
		"retVal":"...",
		"dataRows":[
			{
				"type":"3"		,					//--表明这是哪种信息：0,表示通报征求和审批统计;1,表示员工督查反馈;2,整改反馈和整改通知;3,安全检查和员工自查;
				"createUserName":"薛刚",				//	--发布人
				"startTime":"2020-03-04",						//	--开始时间
				"endTime":"2020-03-05",							//	--截止时间
				"taskTitle":"10月份安全检查",						//	--检查主题
				"taskType":"safeSpotCheck",	 				//--检查方式（安委办统查（safeCheck）   安委办抽查（ safeSpotCheck）  专项检查（specialCheck） 分院统查（branchSafeCheck） 分院抽查（branchSportCheck） 分院专项检查（branchSpecialCheck） 部门自查（deptSelfCheck）  部门间互查（deptEoCheck）  部门统查（deptSafeCheck）  部门抽查（deptSportCheck）  员工自查（staffSelfCheck） 工作通知（workNotified））
				"taskTypeDesc":"返回检查方式的中文名称" ,			//--返回检查方式的中文名称
				"examineObj":"检查对象，多个用逗号隔开",				 //--检查对象，多个用逗号隔开
				"noticeScopetype":"通知对象",					//--通知对象
				"otherOu":"1",						//--是否通知分院（0、不涉及   1、涉及）
				"demand":"检查要求"		,					//--检查要求
				"examineContent":"检查内容"	,				//--检查内容
				"examineImg":"https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png,https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png,https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",					//	--检查规范，图片，用逗号隔开
			}
		] 
	}
}
// 员工自查(苗健)
export function EmployeeSelfexamination(param) {
	return request('/microservice/securityinspect/clickinfoquery',param);
    return {
		"retCode":"1",
		"retVal":"...",
		"dataRows":[
			{
				"type":"3"		,					//--表明这是哪种信息：0,表示通报征求和审批统计;1,表示员工督查反馈;2,整改反馈和整改通知;3,安全检查和员工自查;
				"createUserName":"薛刚",				//	--发布人
				"startTime":"2020-03-04",						//	--开始时间
				"endTime":"2020-03-05",							//	--截止时间
				"taskTitle":"10月份安全检查",						//	--检查主题
				"taskType":"specialCheck",	 				//--检查方式（安委办统查（safeCheck）   安委办抽查（ safeSpotCheck）  专项检查（specialCheck） 分院统查（branchSafeCheck） 分院抽查（branchSportCheck） 分院专项检查（branchSpecialCheck） 部门自查（deptSelfCheck）  部门间互查（deptEoCheck）  部门统查（deptSafeCheck）  部门抽查（deptSportCheck）  员工自查（staffSelfCheck） 工作通知（workNotified））
				"taskTypeDesc":"返回检查方式的中文名称" ,			//--返回检查方式的中文名称
				"examineObj":"检查对象，多个用逗号隔开",				 //--检查对象，多个用逗号隔开
				"noticeScopetype":"通知对象",					//--通知对象
				"otherOu":"1",						//--是否通知分院（0、不涉及   1、涉及）
				"demand":"检查要求"		,					//--检查要求
				"examineContent":"检查内容"	,				//--检查内容
				"examineImg":"https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png,https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png,https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",					//	--检查规范，图片，用逗号隔开
				"desc":"描述描述"							//--描述
			}
		] 
	}
}
// 员工督查反馈(苗健)
export function employeeInspectionFeedback (param) {
	return request('/microservice/securityinspect/clickinfoquery',param);
    return {
		"retCode":"1",
		"retVal":"...",
		"dataRows":[
			{
				"type":"1"   ,        // --表明这是哪种信息：0,表示通报征求和审批统计;1,表示员工督查反馈;2,整改反馈和整改通知;3,安全检查和员工自查;
				"assetsName":"A1-001",	//--资产名称
				"assetsArea":"会议区",	//--所属区域
				"dutyDeptName":"公共平台与架构研发事业部",	//--所属部门
				"dutyUserName":"杨青",	//--责任人员
				"img":"https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png,https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",			//--情况反馈，图片
				"situation":"线路危险"		//--督查建议
			}
		]
	}
} 
// 通知整改(苗健)
export function tongzhizhengai (param) {
	return request('/microservice/securityinspectemployeeInspectionFeedback',param);
    return {
		"retCode":"1" ,
		"retVal":"...",
		"dataRows":[
			{
				"state":"200",
				"msg":"成功"
			}

		]
	}
} 


// 我收到的通知(苗健)
export function NotificationIndex (param) {
	return request('/microservice/securityinspect/myreceivenoticequery',param);
    return {
		"retCode":"1" ,
		"retVal":"...",
		"dataRows":[
	
				
						{
							"notificationId":"1", 		//--通知id
							"startTime":"2020-03-04",				//--开始时间
							"endTime":"2020-03-05",				//--截止时间，安全检查任务通知可能需要
							"createTime":"2020-03-06",			//--通知创建时间
							"createUserId":"1",			//--创建者Id
							"createUserName":"麻子",		//--创建者姓名
							"createUserDeptName":"财务部",	//--创建者部门
							"createUserOuName":"安委办总院",		//--创建者所在院
							"createUserRoleName":"项目制管理平台-安全检查管理(二期)-安委办主办",	//	--创建者角色
							"notificationType":"安全检查通知"		//--返回内容类型，一共有安全检查通知、通报审批意见、检查上报、统计审批意见、统计报告、督查整改意见、督查消息抄送、表扬和检查通报九种
						},
						{
							"notificationId":"2", 		//--通知id
							"startTime":"2020-03-04",				//--开始时间
							"endTime":"2020-03-05",				//--截止时间，安全检查任务通知可能需要
							"createTime":"2020-03-06",			//--通知创建时间
							"createUserId":"2",			//--创建者Id
							"createUserName":"王二",		//--创建者姓名
							"createUserDeptName":"财务部",	//--创建者部门
							"createUserOuName":"安委办总院",		//--创建者所在院
							"createUserRoleName":"项目制管理平台-安全检查管理(二期)-安委办主办",	//	--创建者角色
							"notificationType":"通报审批意见"		//--返回内容类型，一共有安全检查通知、通报审批意见、检查上报、统计审批意见、统计报告、督查整改意见、督查消息抄送、表扬和检查通报九种
						},
						{
							"notificationId":"3", 		//--通知id
							"startTime":"2020-03-04",				//--开始时间
							"endTime":"2020-03-05",				//--截止时间，安全检查任务通知可能需要
							"createTime":"2020-03-06",			//--通知创建时间
							"createUserId":"3",			//--创建者Id
							"createUserName":"赵楼",		//--创建者姓名
							"createUserDeptName":"财务部",	//--创建者部门
							"createUserOuName":"安委办总院",		//--创建者所在院
							"createUserRoleName":"项目制管理平台-安全检查管理(二期)-安委办主办",	//	--创建者角色
							"notificationType":"检查上报"		//--返回内容类型，一共有安全检查通知、通报审批意见、检查上报、统计审批意见、统计报告、督查整改意见、督查消息抄送、表扬和检查通报九种
						},
						{
							"notificationId":"4", 		//--通知id
							"startTime":"2020-03-04",				//--开始时间
							"endTime":"2020-03-05",				//--截止时间，安全检查任务通知可能需要
							"createTime":"2020-03-06",			//--通知创建时间
							"createUserId":"4",			//--创建者Id
							"createUserName":"王武",		//--创建者姓名
							"createUserDeptName":"财务部",	//--创建者部门
							"createUserOuName":"安委办总院",		//--创建者所在院
							"createUserRoleName":"项目制管理平台-安全检查管理(二期)-安委办主办",	//	--创建者角色
							"notificationType":"统计审批意见"		//--返回内容类型，一共有安全检查通知、通报审批意见、检查上报、统计审批意见、统计报告、督查整改意见、督查消息抄送、表扬和检查通报九种
						},
						{
							"notificationId":"5", 		//--通知id
							"startTime":"2020-03-04",				//--开始时间
							"endTime":"2020-03-05",				//--截止时间，安全检查任务通知可能需要
							"createTime":"2020-03-06",			//--通知创建时间
							"createUserId":"5",			//--创建者Id
							"createUserName":"里斯",		//--创建者姓名
							"createUserDeptName":"财务部",	//--创建者部门
							"createUserOuName":"安委办总院",		//--创建者所在院
							"createUserRoleName":"项目制管理平台-安全检查管理(二期)-安委办主办统计报告",	//	--创建者角色
							"notificationType":"统计报告"		//--返回内容类型，一共有安全检查通知、通报审批意见、检查上报、统计审批意见、统计报告、督查整改意见、督查消息抄送、表扬和检查通报九种
						},{
							"notificationId":"6", 		//--通知id
							"startTime":"2020-03-04",				//--开始时间
							"endTime":"2020-03-05",				//--截止时间，安全检查任务通知可能需要
							"createTime":"2020-03-06",			//--通知创建时间
							"createUserId":"6",			//--创建者Id
							"createUserName":"张三",		//--创建者姓名
							"createUserDeptName":"财务部",	//--创建者部门
							"createUserOuName":"安委办总院",		//--创建者所在院
							"createUserRoleName":"项目制管理平台-安全检查管理(二期)-安委办主办",	//	--创建者角色
							"notificationType":"督查整改意见"		//--返回内容类型，一共有安全检查通知、通报审批意见、检查上报、统计审批意见、统计报告、督查整改意见、督查消息抄送、表扬和检查通报九种
						},{
							"notificationId":"7", 		//--通知id
							"startTime":"2020-03-04",				//--开始时间
							"endTime":"2020-03-05",				//--截止时间，安全检查任务通知可能需要
							"createTime":"2020-03-06",			//--通知创建时间
							"createUserId":"7",			//--创建者Id
							"createUserName":"张峰",		//--创建者姓名
							"createUserDeptName":"财务部",	//--创建者部门
							"createUserOuName":"安委办总院",		//--创建者所在院
							"createUserRoleName":"项目制管理平台-安全检查管理(二期)-安委办主办",	//	--创建者角色
							"notificationType":"督查消息抄送"		//--返回内容类型，一共有安全检查通知、通报审批意见、检查上报、统计审批意见、统计报告、督查整改意见、督查消息抄送、表扬和检查通报九种
						},{
							"notificationId":"8", 		//--通知id
							"startTime":"2020-03-04",				//--开始时间
							"endTime":"2020-03-05",				//--截止时间，安全检查任务通知可能需要
							"createTime":"2020-03-06",			//--通知创建时间
							"createUserId":"8",			//--创建者Id
							"createUserName":"杨青",		//--创建者姓名
							"createUserDeptName":"财务部",	//--创建者部门
							"createUserOuName":"安委办总院",		//--创建者所在院
							"createUserRoleName":"项目制管理平台-安全检查管理(二期)-安委办主办",	//	--创建者角色
							"notificationType":"表扬"		//--返回内容类型，一共有安全检查通知、通报审批意见、检查上报、统计审批意见、统计报告、督查整改意见、督查消息抄送、表扬和检查通报九种
						},{
							"notificationId":"9", 		//--通知id
							"startTime":"2020-03-04",				//--开始时间
							"endTime":"2020-03-05",				//--截止时间，安全检查任务通知可能需要
							"createTime":"2020-03-06",			//--通知创建时间
							"createUserId":"9",			//--创建者Id
							"createUserName":"薛刚",		//--创建者姓名
							"createUserDeptName":"财务部",	//--创建者部门
							"createUserOuName":"安委办总院",		//--创建者所在院
							"createUserRoleName":"项目制管理平台-安全检查管理(二期)-安委办主办",	//	--创建者角色
							"notificationType":"检查通报"		//--返回内容类型，一共有安全检查通知、通报审批意见、检查上报、统计审批意见、统计报告、督查整改意见、督查消息抄送、表扬和检查通报九种
						}
				
	
		],
		"rowCount":"总行数",
		"pageCount":"总页数"
	}
}
// 我发送的通知(苗健)
export function NotificationIndex2 (param) {
	return request('/microservice/securityinspect/mysendnoticequery',param);
    return {
		"retCode":"1" ,
		"retVal":"...",
		"dataRows":[
			{
				"notificationId":"1", 		//--通知id
				"startTime":"2020-03-04",				//--开始时间
				"endTime":"2020-03-05",				//--截止时间，安全检查任务通知可能需要
				"createTime":"2020-03-06",			//--通知创建时间
				"createUserId":"1",			//--创建者Id
				"createUserName":"薛刚",		//--创建者姓名
				"createUserDeptName":"财务部",	//--创建者部门
				"createUserOuName":"安委办总院",		//--创建者所在院
				"createUserRoleName":"项目制管理平台-安全检查管理(二期)-安委办主办",	//	--创建者角色
				"notificationType":"检查通报"		//--返回内容类型，一共有安全检查通知、通报审批意见、检查上报、统计审批意见、统计报告、督查整改意见、督查消息抄送、表扬和检查通报九种
			},{
				"notificationId":"2", 		//--通知id
				"startTime":"2020-03-04",				//--开始时间
				"endTime":"2020-03-05",				//--截止时间，安全检查任务通知可能需要
				"createTime":"2020-03-06",			//--通知创建时间
				"createUserId":"2",			//--创建者Id
				"createUserName":"杨青",		//--创建者姓名
				"createUserDeptName":"财务部",	//--创建者部门
				"createUserOuName":"安委办总院",		//--创建者所在院
				"createUserRoleName":"项目制管理平台-安全检查管理(二期)-安委办主办",	//	--创建者角色
				"notificationType":"表扬"		//--返回内容类型，一共有安全检查通知、通报审批意见、检查上报、统计审批意见、统计报告、督查整改意见、督查消息抄送、表扬和检查通报九种
			}

					]	,	
		"RowCount":"总行数",
		"PageCount":"总页数"
	}
}
// 安全检查通知(苗健)
export function Anquanjianchatongzhi (param) {
	return request(' /microservice/securityinspect/clicknoticequery',param);
    return {
		"retCode":"1" ,
		"retVal":"...",
		"dataRows":[
			{
				"type":"2",						//--返回内容类型，0为督查反馈和抄送，1为统计审批反馈和统计报告，2为安全检查通知详情，3为通报意见通知，4为表扬通知
				"createUserName":"薛刚",				//--发布人
				"startTime":"2020-03-03",	
				"endTime":"2020-03-05",						//--起始时间
				"taskTitle":"10月份安全检查",						//--检查主题
				"taskType":"safeSpotCheck",						//检查方式（安委办统查（safeCheck）   安委办抽查（ safeSpotCheck）  专项检查（specialCheck） 分院统查（branchSafeCheck） 分院抽查（branchSportCheck） 分院专项检查（branchSpecialCheck） 部门自查（deptSelfCheck）  部门间互查（deptEoCheck）  部门统查（deptSafeCheck）  部门抽查（deptSportCheck）  员工自查（staffSelfCheck） 工作通知（workNotified））
				"taskTypeDesc":"" 	,			//--返回检查方式的中文名称
				"examineObj":"会议区",					//--检查对象
				"noticeScopetype":"0",				//----通知对象，0=本部/分院全员，1=本部全员，2=分院全员，3=部门全员 4=部分可见				
				"OtherOu":"0",						//--是否设计分院，0设计，1不涉及
				 "demand":"及时发现问题，解决问题，对检查出来的安全隐患及时进行处理"		,				//	--检查要求
				"examineContent":"库房物品摆放是否妥当、有无使用非办公类小家电、有无私拉电线"	,			//--检查内容
				"examineImg":"https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png,https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",					//	--检查规范，图片，用逗号隔开
			}
		]
	}
}
// 通报意见通知(苗健)
export function Tongbaoyijian (param) {
	return request('/microservice/securityinspect/clicknoticequery',param);
    return {
		"retCode":"1" ,
		"retVal":"...",
		"dataRows":[
			{
				"type":"3",						//--返回内容类型，0为督查反馈和抄送，1为统计审批反馈和统计报告，2为安全检查通知详情，3为通报意见通知，4为表扬通知
				"createUserName":"薛刚",			//	--发布人
				"startTime":"2020-03-04",					//	--起始时间
				"endTime":"2020-03-05",					//	--结束时间
				"taskTitle":"10月份安全检查",					//	--检查主题
				"taskType":"safeSpotCheck",					//	--检查方式（安委办统查（safeCheck）   安委办抽查（ safeSpotCheck）  专项检查（specialCheck） 分院统查（branchSafeCheck） 分院抽查（branchSportCheck） 分院专项检查（branchSpecialCheck） 部门自查（deptSelfCheck）  部门间互查（deptEoCheck）  部门统查（deptSafeCheck）  部门抽查（deptSportCheck）  员工自查（staffSelfCheck） 工作通知（workNotified））
				"taskTypeDesc":"..." ,			//	--返回检查方式的中文名称
				"examineObj":"会议区,检查对象2",				//	--检查对象,多个用逗号隔开
				"result":"需要修改的一共有1条，其中：严重1条，值得表扬的一共有1条，其中：非常好1条，公共平台与架构研发事业部1条不合格；1条值得表扬；",					//	--任务结果
				"examineImg":"https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png,https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",				//	--图片,多个逗号隔开
				"statistics":"",			//	--统计数据，暂时这样
				"noticeOpinion":"同意"				//	--通报意见
			}
		]
	}
}
// 督查反馈和抄送(苗健)
export function Jianchafankui (param) {
	return request('/microservice/securityinspect/clicknoticequery',param);
    return {
		"retCode":"1" ,
		"retVal":"...",
		"dataRows":[
			{
				"type":"0",						//--返回内容类型，0为督查反馈和抄送，1为统计审批反馈和统计报告，2为安全检查通知详情，3为通报意见通知，4为表扬通知
				"assetsName":"A-001",				//--资产名称
				"assetsArea":"会议区",				//--所属区域
				"dutyUsername":"扬请",				//--责任人员
				"dutyDeptName":"公共平台与架构研发事业部",				//--所属部门
				"img":"https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png,https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",						//--情况反馈,图片，多个用逗号隔开
				"advice":"建议",					//--建议
				"checkCase":"这件事情正在着手整改",					//--检查情况
			}
		]
	}
}
// 统计审批反馈和统计报告(苗健)
export function Tongjishenpi (param) {
	return request('/microservice/securityinspect/clicknoticequery',param);
    return {
		"retCode":"1" ,
		"retVal":"...",
		"dataRows":[
			{
			"notificationType":"统计审批意见/统计报告", // --返回通知类型
			"title":"哈尔滨分院2019年度统计报告",						//--标题
			"createUserName":"薛刚",			//	--发布人
            "startTime":"2018-10-10",					//--开始时间
            "endTime":"2019-10-10",					//--结束时间
            "statisticResult":"需要修改的一共有1条，其中：严重1条，值得表扬的一共有1条",			//--检查结果/统计结果
            "image":"https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png,https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",						//--图片
			"opinion":"同意",					//--审批意见
			"statistics":""					//	--统计数据暂时这样				//	--统计数据暂时这样
			}
		]
	}
}
// 表扬通知(苗健)
export function Biaoyangtongzhi (param) {
	return request('/microservice/securityinspect/clicknoticequery',param);
    return {
		"retCode":"1" ,
		"retVal":"...",
		"dataRows":[
			{
				"notificationType":"表扬",		//--返回通知类型
				"assetsName":"A1-001",				//--资产名称
				"assetsArea":"会议区",				//--所属区域
				"dutyUsername":"杨青",				//--责任人员
				"dutyDeptName":"公共平台与架构研发事业部",				//--所属部门
				"img":"https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png,https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",						//--情况反馈，图片
				"checkCase":"加油，为你点赞！",					//--检查情况
				"advice":"点赞",					//--建议
				"problemLevel":"perfect"   			//--情况等级，返回英文，严重（severe）、差（poor）、一般（average）、轻微（mild）、好（good），良好（well），非常好（perfect）
			}
		]
	}
}
// 接口人上报的安全检查情况(苗健)
export function Jianchaqingkuang (param) {
	return request('/microservice/securityinspect/clicknoticequery',param);
    return {
		"retCode":"1" ,
		"retVal":"...",
		"dataRows":[
			{
				"notificationType":"检查上报",						//--返回内容类型，0为督查反馈和抄送，1为统计审批反馈和统计报告，2为安全检查通知详情，3为通报意见通知，4为表扬通知
				"createUserName":"薛刚",			//	--发布人
				"startTime":"2020-03-04",					//	--起始时间
				"endTime":"2020-03-05",					//	--结束时间
				"taskTitle":"10月份安全检查",					//	--检查主题
				"taskType":"safeSpotCheck",					//	--检查方式（安委办统查（safeCheck）   安委办抽查（ safeSpotCheck）  专项检查（specialCheck） 分院统查（branchSafeCheck） 分院抽查（branchSportCheck） 分院专项检查（branchSpecialCheck） 部门自查（deptSelfCheck）  部门间互查（deptEoCheck）  部门统查（deptSafeCheck）  部门抽查（deptSportCheck）  员工自查（staffSelfCheck） 工作通知（workNotified））
				"taskTypeDesc":"..." ,			//	--返回检查方式的中文名称
				"examineObj":"会议区,检查对象2",				//	--检查对象,多个用逗号隔开
				"result":"需要修改的一共有1条，其中：严重1条，值得表扬的一共有1条，其中：非常好1条，公共平台与架构研发事业部1条不合格；1条值得表扬；",					//	--任务结果
				"examineImg":"https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png,https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",				//	--图片,多个逗号隔开
				"statistics":"",			//	--统计数据，暂时这样
			}
		]
	}
}
// 通报页面(苗健)
export function tongbao (param) {
	return request('/microservice/securityinspect/clicknoticequery',param);
    return {
		"retCode":"1" ,
		"retVal":"...",
		"dataRows":[
			{
				"notificationType":"检查通报",						//--返回内容类型，0为督查反馈和抄送，1为统计审批反馈和统计报告，2为安全检查通知详情，3为通报意见通知，4为表扬通知
				"createUserName":"薛刚",			//	--发布人
				"startTime":"2020-03-04",					//	--起始时间
				"endTime":"2020-03-05",					//	--结束时间
				"taskTitle":"10月份安全检查",					//	--检查主题
				"taskType":"safeSpotCheck",					//	--检查方式（安委办统查（safeCheck）   安委办抽查（ safeSpotCheck）  专项检查（specialCheck） 分院统查（branchSafeCheck） 分院抽查（branchSportCheck） 分院专项检查（branchSpecialCheck） 部门自查（deptSelfCheck）  部门间互查（deptEoCheck）  部门统查（deptSafeCheck）  部门抽查（deptSportCheck）  员工自查（staffSelfCheck） 工作通知（workNotified））
				"taskTypeDesc":"..." ,			//	--返回检查方式的中文名称
				"examineObj":"会议区,检查对象2",				//	--检查对象,多个用逗号隔开
				"result":"需要修改的一共有1条，其中：严重1条，值得表扬的一共有1条，其中：非常好1条，公共平台与架构研发事业部1条不合格；1条值得表扬；",					//	--任务结果
				"examineImg":"https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png,https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",				//	--图片,多个逗号隔开
				"statistics":"",			//	--统计数据，暂时这样
			}
		]
	
	}
}
// 部门安全员/分院接口人上报(苗健)(统计通报页面/分院统计报告)
export function fenyuanshangbao (param) {
	return request('/microservice/securityinspect/clicknoticequery',param);
    return {
		"retCode":"1" ,
		"retVal":"...",
		"dataRows":[
			
			{
				"notificationType":"统计报告" , //--返回通知类型
				"title":"2019年度统计报告",						//--标题
				"createUserName":"张三",			//	--发布人
				"startTime":"2020-03-03",					//--开始时间
				"endTime":"2020-03-05",					//--结束时间
				"statisticResult":"需要修改的一共有1条，其中：严重1条，值得表扬的一共有1条，其中：非常好1条，公共平台与架构研发事业部1条不合格；1条值得表扬；",			//--检查结果/统计结果
				"image":"https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png,https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",						//--图片
				"statistics":""					//	--统计数据暂时这样
			}
			
			
		]
	}
}

//消息提交处理
//对通报结果进行审批（苗健）
export function duitongbaoshenpi (param) {
	return request('/microservice/securityinspect/circulatenoticeadd',param);
  
    return {
		"retCode":"1" ,//  0失败/1成功
		"retVal":"...",//失败信息
		"dataRows":[
		]
	}
}  
export function duitongjibaogaoshenpi (param) {
	return request('/microservice/securityinspect/statisticsapproveadd',param);
    return {
		"retCode":"1" ,//  0失败/1成功
		"retVal":"...",//失败信息
		"dataRows":[
		]
	}
}

//整改反馈消息提交(对整改后的结果进行反馈)（苗健）
export function duizhenggaifankuishenpi (param) {
	return request('/microservice/securityinspect/reformfeedback',param);
    return {
		"retCode":"1" ,//  0失败/1成功
		"retVal":"...",//失败信息
		"dataRows":[
		]
	}
}
//整改通知和不及格反馈的整改反馈(用户对整改后的结果进行提交)（苗健）
export function duizhenggaibujigedeshenpi (param) {
	return request('/microservice/securityinspect/reformsubmit',param);
    return {
		"retCode":"1" ,//  0失败/1成功
		"retVal":"...",//失败信息
		"dataRows":[
		]
	}
}
//员工督查反馈通知(对员工督查的情况进行通知)（苗健）
// | argOpinion | string | 是       | 安委办对员工督查反馈的通知内容                               |
// | argInfoId  | string | 是       | 当前消息的id                                                 |
// | argCopy    | string | 是       | 通知的对象，多个用户用","隔开，用于传角色id,但如果是这三种情况：0-本部/分部全员 1-本部全员 2-分院全员 3-部门全员 |
// | type       | int    | 是       | 三种类型：0代表反馈，1代表通知责任人员，2代表结束流程 
export function duiyuangongduchashenpi (param) {
	return request('/microservice/securityinspect/staffinspectinform',param);
    return {
		"retCode":"1" ,//  0失败/1成功
		"retVal":"...",//失败信息
		"dataRows":[ ]
	}
}
 
//////////////////////////
// 服务1 查询 查任务（王培忠）
export function queryTaskList(param) {
    return request('/microservice/securityinspect/queryTaskList',param);
    return {
			"retCode":"1",
			"RetVal":"...",
			"DataRows":[
				{
						"taskTitle":"安全检查任务一",
						"startTime":"2020-05-10",
						"endTime":"2020-05-10",
						"taskType": "safeCheck", //--任务状态，模糊查询(0、安委办统查 1、安委办抽查 2、专项检查 3、分院统查 4、分院抽查 5、分院专项检查 6、部门自查 7、部门间互查  8、部门统查  9、部门抽查  10、员工自查 11、工作通知),返回的是数字,
					  'taskTypeDesc': '安委办统查',
						"taskStatus":"0",//0、全部 1、草稿  2、检查中   3、检查结束 4、已通知
						'taskStatusDesc': '草稿',
						'taskId': '01',
						"otherOu":"0" //--（0、不涉及   1、涉及） 返回的是数字
				},
				{
						"taskTitle":"安全检查任务一",
						"startTime":"2020-05-10",
						"endTime":"2020-05-10",
						"taskType":"safeSpotCheck", //--任务状态，模糊查询(0、安委办统查 1、安委办抽查 2、专项检查 3、分院统查 4、分院抽查 5、分院专项检查 6、部门自查 7、部门间互查  8、部门统查  9、部门抽查  10、员工自查 11、工作通知),返回的是数字,
					  'taskTypeDesc': '安委办抽查',
						"taskStatus":"0",
						'taskStatusDesc': '检查中',
						'taskId': '02',
						"otherOu":"1" //--（0、不涉及   1、涉及） 返回的是数字
				},
				{
						"taskTitle":"安全检查任务一",
						"startTime":"2020-05-10",
						"endTime":"2020-05-10",
						"taskType":"safeSpotCheck", //--任务状态，模糊查询(0、安委办统查 1、安委办抽查 2、专项检查 3、分院统查 4、分院抽查 5、分院专项检查 6、部门自查 7、部门间互查  8、部门统查  9、部门抽查  10、员工自查 11、工作通知),返回的是数字,
					  'taskTypeDesc': '安委办抽查',
						"taskStatus":"3",
						'taskStatusDesc': '检查结束',
						'taskId': '03',
						"otherOu":"1" //--（0、不涉及   1、涉及） 返回的是数字
				},
				{
						"taskTitle":"安全检查任务一",
						"startTime":"2020-05-10",
						"endTime":"2020-05-13",
						"taskType":"deptSelfCheck", //--任务状态，模糊查询(0、安委办统查 1、安委办抽查 2、专项检查 3、分院统查 4、分院抽查 5、分院专项检查 6、部门自查 7、部门间互查  8、部门统查  9、部门抽查  10、员工自查 11、工作通知),返回的是数字,
					  'taskTypeDesc': '部门自查',
						"taskStatus":"6",
						'taskStatusDesc': '检查中',
						'taskId': '04',
						"otherOu":"1" //--（0、不涉及   1、涉及） 返回的是数字
				},
				{
						"taskTitle":"安全检查任务一",
						"startTime":"2020-05-10",
						"endTime":"2020-05-11",
						"taskType":"1", //--任务状态，模糊查询(0、安委办统查 1、安委办抽查 2、专项检查 3、分院统查 4、分院抽查 5、分院专项检查 6、部门自查 7、部门间互查  8、部门统查  9、部门抽查  10、员工自查 11、工作通知),返回的是数字,
					  'taskTypeDesc': '部门互查',
						"taskStatus":"7",
						'taskStatusDesc': '检查结束',
						'taskId': '05'
				},
				{
						"taskTitle":"安全检查任务一",
						"startTime":"2020-05-10",
						"endTime":"2020-05-14",
						"taskType":"branchSafeCheck", //--任务状态，模糊查询(0、安委办统查 1、安委办抽查 2、专项检查 3、分院统查 4、分院抽查 5、分院专项检查 6、部门自查 7、部门间互查  8、部门统查  9、部门抽查  10、员工自查 11、工作通知),返回的是数字,
					  'taskTypeDesc': '分院统查',
						"taskStatus":"1",
						'taskStatusDesc': '草稿',
						'taskId': '06',
						"otherOu":"1" //--（0、不涉及   1、涉及） 返回的是数字
				},
				{
						"taskTitle":"安全检查任务一",
						"startTime":"2020-05-10",
						"endTime":"2020-05-14",
						"taskType":"branchSportCheck", //--任务状态，模糊查询(0、安委办统查 1、安委办抽查 2、专项检查 3、分院统查 4、分院抽查 5、分院专项检查 6、部门自查 7、部门间互查  8、部门统查  9、部门抽查  10、员工自查 11、工作通知),返回的是数字,
					  'taskTypeDesc': '分院抽查',
						"taskStatus":"2",
						'taskStatusDesc': '检查中',
						'taskId': '07',
						"otherOu":"1" //--（0、不涉及   1、涉及） 返回的是数字
				},
				{
						"taskTitle":"安全检查任务一",
						"startTime":"2020-05-10",
						"endTime":"2020-05-14",
						"taskType":"branchSpecialCheck", //--任务状态，模糊查询(0、安委办统查 1、安委办抽查 2、专项检查 3、分院统查 4、分院抽查 5、分院专项检查 6、部门自查 7、部门间互查  8、部门统查  9、部门抽查  10、员工自查 11、工作通知),返回的是数字,
					  'taskTypeDesc': '专项检查',
						"taskStatus":"2",
						'taskStatusDesc': '检查结束',
						'taskId': '08',
						"otherOu":"0" //--（0、不涉及   1、涉及） 返回的是数字
				},
				{
						"taskTitle":"安全检查任务一",
						"startTime":"2020-05-10",
						"endTime":"2020-05-14",
						"taskType":"branchSpecialCheck", //--任务状态，模糊查询(0、安委办统查 1、安委办抽查 2、专项检查 3、分院统查 4、分院抽查 5、分院专项检查 6、部门自查 7、部门间互查  8、部门统查  9、部门抽查  10、员工自查 11、工作通知),返回的是数字,
					  'taskTypeDesc': '专项检查',
						"taskStatus":"2",
						'taskStatusDesc': '检查结束',
						'taskId': '09',
						"otherOu":"1" //--（0、不涉及   1、涉及） 返回的是数字
				},
				{
						"taskTitle":"安全检查任务一",
						"startTime":"2020-05-10",
						"endTime":"2020-05-14",
						"taskType":"branchSpecialCheck", //--任务状态，模糊查询(0、安委办统查 1、安委办抽查 2、专项检查 3、分院统查 4、分院抽查 5、分院专项检查 6、部门自查 7、部门间互查  8、部门统查  9、部门抽查  10、员工自查 11、工作通知),返回的是数字,
					  'taskTypeDesc': '专项检查',
						"taskStatus":"2",
						'taskStatusDesc': '检查结束',
						'taskId': '10',
						"otherOu":"1" //--（0、不涉及   1、涉及） 返回的是数字
				},
				{
						"taskTitle":"安全检查任务一",
						"startTime":"2020-05-10",
						"endTime":"2020-05-14",
						"taskType":"branchSpecialCheck", //--任务状态，模糊查询(0、安委办统查 1、安委办抽查 2、专项检查 3、分院统查 4、分院抽查 5、分院专项检查 6、部门自查 7、部门间互查  8、部门统查  9、部门抽查  10、员工自查 11、工作通知),返回的是数字,
					  'taskTypeDesc': '专项检查',
						"taskStatus":"2",
						'taskStatusDesc': '检查结束',
						'taskId': '11',
						"otherOu":"1" //--（0、不涉及   1、涉及） 返回的是数字
				},
			],
			"allCount":"11", //总条数
			"rowCount":"10", //--每页显示的总条数
			"pageCount":"...", //--总页数
			"pageCurrent":"1" //--当前第几页
		}
}
//服务2 服务2 查询检查对象和检查内容（王培忠）
export function checkObjectAndContent(param) {
    return request('/microservice/securityinspect/queryInspectObjectAndContent',param);
    return { // aaa.dataRows[0].examineObj    aaa.dataRows[0].content
		'retCode':"1",
		"RetVal":"....",
		"dataRows":[{
			"examineObj":[
				{"content":"办公区"},
				{"content":"临时研发区"},
				{"content":"监控中心"},
				{"content":"员工活动区"},
				{"content":"水吧区"},
				{"content":"通信机房"},
				{"content":"文件档案室"},
				{"content":"仓库"},
				{"content":"专项内容"},
				{"content":"重点部位"},
				{"content":"其他区域"},
			], // --全部的检查对象
			"content":[{
				"label": '安全责任履行',
				"children": [{
					"label": '部门安全责任制是否落实',
				}, {
					"label": '部门安全员是否履行安全督查并协助部门开展安全管理',
				}],
			}, {
				"label": '办公用电管理', 
				"children": [{
					"label": '员工工位电源安装使用是否安全可靠',
				}, {
					"label": '有无使用非办公类小家电',
				}],
			}] //----全部的检查内容
		}]
	}
}
//服务 5  删除任务（王培忠）
export function delTask(param) {
    return request('/microservice/securityinspect/delTask',param);
    return {
        'retCode':"1",
        "RetVal":"....."
    }
}
// 返回全部角色
export function queryRole(param) {
	return request('/microservice/securityinspect/queryRole',param);
	return {
			'retCode':"1",
			"RetVal":".....",
			"dataRows": [  
				{
					"roleId": 'eqwewqdas1dsa2131222222222221',
					"roleName": "项目制管理平台-安全检查管理-院领导"
				},
				{
					"roleId": 'eqwewqdasds2a21312222222s22221',
					"roleName": "项目制管理平台-安全检查管理-院分管领导"
				},
				{
					"roleId": 'eqwewqda3sdsa21s31222222222221',
					"roleName": "项目制管理平台-安全检查管理-各部门/中心负责人"
				},
				{
					"roleId": 'eqwewqdasdsa2131222252222222s1',
					"roleName": "项目制管理平台-分院院领导"
				},
				{
					"roleId": 'eqwewqdasdsa21312222225222221',
					"roleName": "项目制管理平台-分院办公室负责人"
				},
				{
					"roleId": 'eqwewqdasdsa21312222s222252221',
					"roleName": "项目制管理平台-分院办公室安全接口人"
				}, 
				{
					"roleId": '111eqwewqdas1dsa213122ff2222222221',
					"roleName": "项目制管理平台-安全检查管理-分院领导" 
				},
				{
					"roleId": '111eqwewqdas1dsa21312222bf22222221',
					"roleName": "项目制管理平台-安全检查管理-各部门/中心经理"  
				},
				{
					"roleId": '111eqwewqdas1dsa213v12wew222b22222221',
					"roleName": "项目制管理平台-安全检查管理-各部门/中心安全员"  
				},
				{
					"roleId": '111eqwewqdas1dsa2dfs131222222222221',
					"roleName": "项目制管理平台-安全检查管理-22"  
				},
				{
					"roleId": '111eqwewqdas1dsa2dfs131222222222221',
					"roleName": "项目制管理平台-安全检查管理-22"  
				},
			],
	}
}
//建立派发任务
export function addTask(param) {
	return request('/microservice/securityinspect/addtaskbyinfoid',param);
	return {
		'retCode':"1",                //       --   1表示创建任务成功
		"RetVal":"....."
	}
}
//任务详情
export function queryTaskInform(param) {
	return request('/microservice/securityinspect/queryTaskInform',param);
	return {
		'retCode':"1",               
		"RetVal":".....",
		"dataRows":[
			{
				"createUserName":"杨青", // --发布人
				"startTime":"2015-02-03",
				"endTime":"2015-03-03",
				"taskTitle":"任务详情",
				"taskType":"safeSpotCheck", //--检查方式，模糊查询 安委办统查（safeCheck）   安委办抽查（ safeSpotCheck）  专项检查（specialCheck） 分院统查（branchSafeCheck） 分院抽查（branchSportCheck） 分院专项检查（branchSpecialCheck） 部门自查（deptSelfCheck）  部门间互查（deptEoCheck）  部门统查（deptSafeCheck）  部门抽查（deptSportCheck）  员工自查（staffSelfCheck） 工作通知（workNotified） --返回的是括号里面的单词,
				"taskTypeDesc":"安委办抽查", //--返回的是单词对应的汉字
				"examineObj": ['办公区', '员工活动区'], //--检查对象
				"belongUserName": ['eqwewqdas1dsa2131222222222221', 'eqwewqdasds2a21312222222s22221'],//--通知对象
				"otherOu":"0", //--是否涉及分院
				"examineContent":['部门安全责任制是否落实','部门安全员是否履行安全督查并协助部门开展安全管理'], // --检查内容
				"demand":"检查要求" ,//--'检查要求
				"examineImg": [{'AbsolutePath': '10.245.47.2/filemanage/upload/writeFileUpdate/10010/2020/4/26/0893287/d42be66bb3a34abbaa2616b493955977/窦阳春_天梯初级证书.png',
				'ExternalAbsolutePath': '10.0.47.2/filemanage/upload/writeFileUpdate/10010/2020/4/26/0893287/d42be66bb3a34abbaa2616b493955977/窦阳春_天梯初级证书.png',
				'FileId': '39e0b3fdecb84c5d9bcc7baeb28052c1',
				'OriginalFileName': '窦阳春_天梯初级证书.png',
				'RealFileName': '窦阳春_天梯初级证书.png',
				'RelativePath': '/filemanage/upload/writeFileUpdate/10010/2020/4/26/0893287/d42be66bb3a34abbaa2616b493955977/窦阳春_天梯初级证书.png'},
				] //--检查规范
			}
		]
	}
}
//修改任务
export function editTask(param) {
	return request('/microservice/securityinspect/editTask',param);
	return {
		'retCode':"1",     
		"retVal":"...",
	}
}

//服务7 查询本院以及分院多级表格之院系（魏永杰）
export function queryCourtyardAndDeptAndStaff(param) {
// 	| 参数名称          | 类型        | 是否必传 | 描述                                               |
// | ----------------- | ----------- | -------- | -------------------------------------------------- |
// | arg_statistics_id | varchar(32) | 是       | 统计任务的id                                       |
// | arg_yard_state    | varchar(32) | 是       | 0、查询本部\本院多级表格     1、查询各分院多级表格 |
// | arg_item_state    | varchar(32) | 是       | 0、表扬     1、不合格                              |
	return request('/microservice/securityinspect/queryStatisticsItem',param);
	return{	// 不合格  查询本部\本院多级表格
	    "retCode": "1",
	    "dataRows": [
	        {
	            "ouId": "e65c02c2179e11e6880d008cfa0427c4",
	            "ouName": "联通软件研究院本部",
	            "ouNoNum": "5",
	            "ouYesNum": null,
	            "deptInfos": [
	                {
	                    "deptName": "联通软件研究院-财务部",
	                    "deptId": "e65c082b179e11e6880d008cfa0427c4",
	                    "depNoNum": "4",
	                    "depNum": "14",
	                    "depYesNum": null,
	                    "userInfos": [
	                        {
	                            "itemId": "1d6f51c234c14ac2973009c6636833c6",
	                            "userId": "0000171",
	                            "userName": "王文静",
	                            "examinTime": "2020-05-06 12:45:42.0",
	                            "noticeOptName": "秦斌",
	                            "questionTypeId": "123444",
	                            "count": null
	                        },
	                        {
	                            "itemId": "f1de8c89781d4210832bdc41cefbf762",
	                            "userId": "0000171",
	                            "userName": "王文静",
	                            "examinTime": "2020-05-06 11:36:37.0",
	                            "noticeOptName": "秦斌",
	                            "questionTypeId": "123444",
	                            "count": null
	                        },
	                        {
	                            "itemId": "5b556ff823f048e9ad7482566c4b2617",
	                            "userId": "0000171",
	                            "userName": "王文静",
	                            "examinTime": "2020-05-06 12:53:29.0",
	                            "noticeOptName": "秦斌",
	                            "questionTypeId": "123444",
	                            "count": null
	                        },
	                        {
	                            "itemId": "f1de8c89781d4210832bdc41wg90f762",
	                            "userId": "0000171",
	                            "userName": "王文静",
	                            "examinTime": "2020-05-11 10:47:20.0",
	                            "noticeOptName": "秦斌",
	                            "questionTypeId": "123444",
	                            "count": null
	                        }
	                    ]
	                },
	                {
	                    "deptName": "联通软件研究院-办公室（党委办公室）",
	                    "deptId": "e65c07d7179e11e6880d008cfa0427c4",
	                    "depNoNum": "1",
	                    "depNum": "3",
	                    "depYesNum": null,
	                    "userInfos": [
	                        {
	                            "itemId": "fdasfashgdfgsdfgrrsd",
	                            "userId": "0893139",
	                            "userName": "侯智霞",
	                            "examinTime": "2020-05-19 17:41:28.0",
	                            "noticeOptName": "秦斌",
	                            "questionTypeId": "15351531",
	                            "count": null
	                        }
	                    ]
	                }
	            ]
	        }
	    ],
	    "retVal": "1"
	}

	// {
	// 	// 表扬  查询本部\本院多级表格
	//     "retCode": "1",
	//     "dataRows": [
	//         {
	//             "ouId": "e65c02c2179e11e6880d008cfa0427c4",//--本院以及分院的id
	//             "ouName": "联通软件研究院本部",//--本院以及分院的名字
	//             "ouNoNum": null,
	//             "ouYesNum": "3", //-- 表扬数量
	//             "deptInfos": [
	//                 {
	//                     "deptName": "联通软件研究院-财务部",//--部门名称
	//                     "deptId": "e65c082b179e11e6880d008cfa0427c4",//--部门id
	//                     "depNoNum": null,
	//                     "depNum": null,
	//                     "depYesNum": "2",//--表扬数量
	//                     "userInfos": [
	//                         {
	//                             "itemId": "5b556ff823f048e9ad7482566c4b2617",
	//                             "userId": "0000171",
	//                             "userName": "王文静",
	//                             "examinTime": "2020-05-06 12:53:29.0",
	//                             "noticeOptName": "秦斌",
	//                             "questionTypeId": "123444",
	//                             "count": "2"
	// 						},
	// 						{
	//                             "itemId": "5b556ff823f048e9ad7482566c4b2617",
	//                             "userId": "0000171",
	//                             "userName": "王文静",
	//                             "examinTime": "2020-05-06 12:53:29.0",
	//                             "noticeOptName": "秦斌",
	//                             "questionTypeId": "123444",
	//                             "count": "2"
	//                         }
	//                     ]
	//                 },
	//                 {
	//                     "deptName": "联通软件研究院-办公室（党委办公室）",
	//                     "deptId": "e65c07d7179e11e6880d008cfa0427c4",
	//                     "depNoNum": null,
	//                     "depNum": null,
	//                     "depYesNum": "1",
	//                     "userInfos": [
	//                         {
	//                             "itemId": "fdsafadsfadsfwaefasg",
	//                             "userId": "0886977",
	//                             "userName": "范付纸",
	//                             "examinTime": "2020-05-19 17:37:58.0",
	//                             "noticeOptName": "秦斌",
	//                             "questionTypeId": "15351531",
	//                             "count": "1"
	//                         }
	//                     ]
	//                 }
	//             ]
	// 		},
			
	//     ],
	//     "retVal": "1"
	// }

	// {
	// 	// // 表扬  查询各分院多级表格     做好了
	// 	"retCode": "1",
	// 	"dataRows": [
	// 		{
	// 			"ouId": "e65c02c2179e11e6880d008cfa0427c4",
	// 			"ouName": "联通软件研究院本部",
	// 			"ouNoNum": null,
	// 			"ouYesNum": "2",
	// 			"deptInfos": [
	// 				{
	// 					"deptName": "联通软件研究院-财务部",
	// 					"deptId": "e65c082b179e11e6880d008cfa0427c4",
	// 					"depNoNum": null,
	// 					"depNum": null,
	// 					"depYesNum": "1",
	// 					"userInfos": [
	// 						{
	// 							"itemId": "ad8789as7d89a7sd",
	// 							"userId": "0000171",
	// 							"userName": "王文静",
	// 							"examinTime": "2020-05-25 13:45:15.0",
	// 							"noticeOptName": null,
	// 							"questionTypeId": null,
	// 							"count": "1"
	// 						}
	// 					]
	// 				},
	// 				{
	// 					"deptName": "联通软件研究院-办公室（党委办公室）",
	// 					"deptId": "e65c07d7179e11e6880d008cfa0427c4",
	// 					"depNoNum": null,
	// 					"depNum": null,
	// 					"depYesNum": "1",
	// 					"userInfos": [
	// 						{
	// 							"itemId": "fdsafadsfadsfwaefasg",
	// 							"userId": "0886977",
	// 							"userName": "范付纸",
	// 							"examinTime": "2020-05-19 17:37:58.0",
	// 							"noticeOptName": "秦斌",
	// 							"questionTypeId": "15351531",
	// 							"count": "1"
	// 						}
	// 					]
	// 				}
	// 			]
	// 		},
	// 		{
	// 			"ouId": "e65c072a179e11e6880d008cfa0427c4",
	// 			"ouName": "哈尔滨软件研究院",
	// 			"ouNoNum": null,
	// 			"ouYesNum": "1",
	// 			"deptInfos": [
	// 				{
	// 					"deptName": "哈尔滨软件研究院-计费结算分中心",
	// 					"deptId": "40a32036873211e78cdc782bcb561704",
	// 					"depNoNum": null,
	// 					"depNum": null,
	// 					"depYesNum": "1",
	// 					"userInfos": [
	// 						{
	// 							"itemId": "fgdgsdfgsdfgsdfgsdfgsdf",
	// 							"userId": "0890786",
	// 							"userName": "孙宇",
	// 							"examinTime": "2020-05-19 15:51:49.0",
	// 							"noticeOptName": "王浩",
	// 							"questionTypeId": "15351531",
	// 							"count": "1"
	// 						}
	// 					]
	// 				}
	// 			]
	// 		},
	// 		{
	// 			"ouId": "e65c067b179e11e6880d008cfa0427c4",
	// 			"ouName": "济南软件研究院",
	// 			"ouNoNum": null,
	// 			"ouYesNum": "1",
	// 			"deptInfos": [
	// 				{
	// 					"deptName": "济南软件研究院-计费分中心",
	// 					"deptId": "409c4bd8873211e78cdc782bcb561704",
	// 					"depNoNum": null,
	// 					"depNum": null,
	// 					"depYesNum": "1",
	// 					"userInfos": [
	// 						{
	// 							"itemId": "gfgtgsdfhsdhstsrdgsd",
	// 							"userId": "0900681",
	// 							"userName": "杜文娜",
	// 							"examinTime": "2020-05-19 16:07:26.0",
	// 							"noticeOptName": "胡海波",
	// 							"questionTypeId": "15351531",
	// 							"count": "1"
	// 						}
	// 					]
	// 				}
	// 			]
	// 		}
	// 	],
	// 	"retVal": "1"
	// }








// // 不合格  查询各分院多级表格
// {
//     "retCode": "1",
//     "dataRows": [
//         {
//             "ouId": "e65c02c2179e11e6880d008cfa0427c4",
//             "ouName": "联通软件研究院本部",
//             "ouNoNum": "5",
//             "ouYesNum": null,
//             "deptInfos": [
//                 {
//                     "deptName": "联通软件研究院-财务部",
//                     "deptId": "e65c082b179e11e6880d008cfa0427c4",
//                     "depNoNum": "4",
//                     "depNum": "14",
//                     "depYesNum": null,
//                     "userInfos": [
//                         {
//                             "itemId": "f1de8c89781d4210832bdc41cefbf762",
//                             "userId": "0000171",
//                             "userName": "王文静",
//                             "examinTime": "2020-05-06 11:36:37.0",
//                             "noticeOptName": "秦斌",
//                             "questionTypeId": "123444",
//                             "count": null
//                         },
//                         {
//                             "itemId": "5b556ff823f048e9ad7482566c4b2617",
//                             "userId": "0000171",
//                             "userName": "王文静",
//                             "examinTime": "2020-05-06 12:53:29.0",
//                             "noticeOptName": "秦斌",
//                             "questionTypeId": "123444",
//                             "count": null
//                         },
//                         {
//                             "itemId": "f1de8c89781d4210832bdc41wg90f762",
//                             "userId": "0000171",
//                             "userName": "王文静",
//                             "examinTime": "2020-05-11 10:47:20.0",
//                             "noticeOptName": "秦斌",
//                             "questionTypeId": "123444",
//                             "count": null
//                         },
//                         {
//                             "itemId": "1d6f51c234c14ac2973009c6636833c6",
//                             "userId": "0000171",
//                             "userName": "王文静",
//                             "examinTime": "2020-05-06 12:45:42.0",
//                             "noticeOptName": "秦斌",
//                             "questionTypeId": "123444",
//                             "count": null
//                         }
//                     ]
//                 },
//                 {
//                     "deptName": "联通软件研究院-办公室（党委办公室）",
//                     "deptId": "e65c07d7179e11e6880d008cfa0427c4",
//                     "depNoNum": "1",
//                     "depNum": "3",
//                     "depYesNum": null,
//                     "userInfos": [
//                         {
//                             "itemId": "fdasfashgdfgsdfgrrsd",
//                             "userId": "0893139",
//                             "userName": "侯智霞",
//                             "examinTime": "2020-05-19 17:41:28.0",
//                             "noticeOptName": "秦斌",
//                             "questionTypeId": "15351531",
//                             "count": null
//                         }
//                     ]
//                 }
//             ]
//         },
//         {
//             "ouId": "e65c072a179e11e6880d008cfa0427c4",
//             "ouName": "哈尔滨软件研究院",
//             "ouNoNum": "1",
//             "ouYesNum": null,
//             "deptInfos": [
//                 {
//                     "deptName": "哈尔滨软件研究院-计费结算分中心",
//                     "deptId": "40a32036873211e78cdc782bcb561704",
//                     "depNoNum": "1",
//                     "depNum": "1",
//                     "depYesNum": null,
//                     "userInfos": [
//                         {
//                             "itemId": "hfghdhdfghdhdfrsdggd",
//                             "userId": "0899641",
//                             "userName": "王春波",
//                             "examinTime": "2020-05-19 15:58:37.0",
//                             "noticeOptName": "王浩",
//                             "questionTypeId": "15351531",
//                             "count": null
//                         }
//                     ]
//                 }
//             ]
//         },
//         {
//             "ouId": "e65c067b179e11e6880d008cfa0427c4",
//             "ouName": "济南软件研究院",
//             "ouNoNum": "1",
//             "ouYesNum": null,
//             "deptInfos": [
//                 {
//                     "deptName": "济南软件研究院-计费分中心",
//                     "deptId": "409c4bd8873211e78cdc782bcb561704",
//                     "depNoNum": "1",
//                     "depNum": "1",
//                     "depYesNum": null,
//                     "userInfos": [
//                         {
//                             "itemId": "fdasfsafsafasfasfgrfds",
//                             "userId": "0904684",
//                             "userName": "吴春博",
//                             "examinTime": "2020-05-19 16:17:01.0",
//                             "noticeOptName": "胡海波",
//                             "questionTypeId": "15351531",
//                             "count": null
//                         }
//                     ]
//                 }
//             ]
//         }
//     ],
//     "retVal": "1"
// }
}
//服务9 查询本院以及分院多级表格之员工（王培忠）
export function queryStaffByDept(param) {
	return request('/microservice/securityinspect/queryStaffByDept',param); 
	return {
		'retCode':"1",     
		"retVal":"...",
		'dataRows': [
			{
				"staffId":"11",// --员工Id
				"assetsId" : '1',
				"staffName":"王五", //--员工名称
				"assetsName":"C1-221", //--资产名字
				"assetsArea":"办公室" ,//-/-资产所属区域
				"examinState":"0", //-- 检查情况(0、表扬  1、待整改   2、已整改)
				"examinStateDesc": "表扬",
				"problemleLevel":"轻微", //--问题等级
				"inspectTime":"2019-09-13 10:37:23",// --检查时间
        "inspectSituation": '事故险于隐患，请进行整改！' //检查情况  事故险于隐患，请进行整改！
			},
			{
				"staffId":"121",// --员工Id
				"assetsId" : '1',
				"staffName":"王1五", //--员工名称
				"assetsName":"C1-221", //--资产名字
				"assetsArea":"办公室" ,//-/-资产所属区域
				"examinState":"1", //-- 检查情况(0、表扬  1、待整改   2、已整改)
				"examinStateDesc": "待整改",
				"problemleLevel":"轻微", //--问题等级
				"inspectTime":"2019-09-13 10:37:23",// --检查时间
        "inspectSituation": '事故险于隐患，请进行整改！' //检查情况  事故险于隐患，请进行整改！
			},
			{
				"staffId":"113",// --员工Id
				"assetsId" : '1',
				"staffName":"王2五", //--员工名称
				"assetsName":"C1-221", //--资产名字
				"assetsArea":"办公室" ,//-/-资产所属区域
				"examinState":"1", //-- 检查情况(0、表扬  1、待整改   2、已整改)
				"examinStateDesc": "待整改",
				"problemleLevel":"轻微", //--问题等级
				"inspectTime":"2019-09-13 10:37:23",// --检查时间
        "inspectSituation": '事故险于隐患，请进行整改！' //检查情况  事故险于隐患，请进行整改！
			},
		],
		"allCount":"30", //--总条数
		"rowCount":"10",// --每页显示的总条数
		"pageCount":"3",// --总页数
		"pageCurrent":"1" ,//--当前第几页
	}
}
//服务15 查询 统计首页（苗健）
export function statisticsHome(param) {
// 	| argCondition   | String | 否       | 条件查询，不传时默认查询所有统计报告               |
// | argPageCurrent | int    | 是       | 表示请求第几页, 从1开始, 必须是正整数，默认为第1页 |
// | argPageSize    | int    | 是       | 表示每页数量，必须是正整数,默认为所有              |
	return request('/microservice/securityinspect/statisticshomepage',param); 
	return {
		"retCode":"1" ,
		"retVal":"...",
		"datarows":[
			{
				"statisticsId":"1"	,				//--统计报告id
				"statisticsName":"软研院2019年年度检查报告"	,				//--统计报告标题
				"setType":"0"	,					//--报告类型，返回数字：0代表年度，1代表上半年   2代表下半年
				"statisticsStatus":"0",				//--报告状态，返回数字，0代表未发布，1代表已发布
				"failUnm":"10"	,					//--不合格人数，
			},
			{
				"statisticsId":"2"	,				//--统计报告id
				"statisticsName":"哈尔滨分院2018年上半年检查报告"	,				//--统计报告标题
				"setType":"1"	,					//--报告类型，返回数字：0代表年度，1代表上半年   2代表下半年
				"statisticsStatus":"1"	,			//--报告状态，返回数字，0代表未发布，1代表已发布
				"failUnm":"8"	,					//--不合格人数
			},
			{
				"statisticsId":"3"	,				//--统计报告id
				"statisticsName":"软研院2018年下半年检查报告"	,				//--统计报告标题
				"setType":"2"	,					//--报告类型，返回数字：0代表年度，1代表上半年   2代表下半年
				"statisticsStatus":"1"	,			//--报告状态，返回数字，0代表未发布，1代表已发布
				"failUnm":"5"	,					//--不合格人数
			},
			{
				"statisticsId":"4"	,				//--统计报告id
				"statisticsName":"软研院2019年年度检查报告"	,				//--统计报告标题
				"setType":"0"	,					//--报告类型，返回数字：0代表年度，1代表上半年   2代表下半年
				"statisticsStatus":"0",				//--报告状态，返回数字，0代表未发布，1代表已发布
				"failUnm":"10"	,					//--不合格人数，
			},
			{
				"statisticsId":"5"	,				//--统计报告id
				"statisticsName":"哈尔滨分院2018年上半年检查报告"	,				//--统计报告标题
				"setType":"1"	,					//--报告类型，返回数字：0代表年度，1代表上半年   2代表下半年
				"statisticsStatus":"1"	,			//--报告状态，返回数字，0代表未发布，1代表已发布
				"failUnm":"8"	,					//--不合格人数
			},
			{
				"statisticsId":"6"	,				//--统计报告id
				"statisticsName":"软研院2018年下半年检查报告"	,				//--统计报告标题
				"setType":"2"	,					//--报告类型，返回数字：0代表年度，1代表上半年   2代表下半年
				"statisticsStatus":"1"	,			//--报告状态，返回数字，0代表未发布，1代表已发布
				"failUnm":"5"	,					//--不合格人数
			},
			{
				"statisticsId":"7"	,				//--统计报告id
				"statisticsName":"软研院2019年年度检查报告"	,				//--统计报告标题
				"setType":"0"	,					//--报告类型，返回数字：0代表年度，1代表上半年   2代表下半年
				"statisticsStatus":"0",				//--报告状态，返回数字，0代表未发布，1代表已发布
				"failUnm":"10"	,					//--不合格人数，
			},
			{
				"statisticsId":"8"	,				//--统计报告id
				"statisticsName":"哈尔滨分院2018年上半年检查报告"	,				//--统计报告标题
				"setType":"1"	,					//--报告类型，返回数字：0代表年度，1代表上半年   2代表下半年
				"statisticsStatus":"1"	,			//--报告状态，返回数字，0代表未发布，1代表已发布
				"failUnm":"8"	,					//--不合格人数
			},
			{
				"statisticsId":"9"	,				//--统计报告id
				"statisticsName":"软研院2018年下半年检查报告"	,				//--统计报告标题
				"setType":"2"	,					//--报告类型，返回数字：0代表年度，1代表上半年   2代表下半年
				"statisticsStatus":"1"	,			//--报告状态，返回数字，0代表未发布，1代表已发布
				"failUnm":"5"	,					//--不合格人数
			},
			{
				"statisticsId":"10"	,				//--统计报告id
				"statisticsName":"哈尔滨分院2018年上半年检查报告"	,				//--统计报告标题
				"setType":"1"	,					//--报告类型，返回数字：0代表年度，1代表上半年   2代表下半年
				"statisticsStatus":"1"	,			//--报告状态，返回数字，0代表未发布，1代表已发布
				"failUnm":"8"	,					//--不合格人数
			},
			{
				"statisticsId":"11"	,				//--统计报告id
				"statisticsName":"软研院2018年下半年检查报告"	,				//--统计报告标题
				"setType":"2"	,					//--报告类型，返回数字：0代表年度，1代表上半年   2代表下半年
				"statisticsStatus":"1"	,			//--报告状态，返回数字，0代表未发布，1代表已发布
				"failUnm":"5"	,					//--不合格人数
			}
		],
		"allCount":"11", //--总条数
		"rowCount":"10",// --每页显示的总条数
		"pageCount":"2",// --总页数
		"pageCurrent":"1" ,//--当前第几页
	}
}
// 服务26：修改统计结果的接口
// | 参数名称           | 类型         | 是否必传 | 描述               |
// | ------------------ | ------------ | -------- | ------------------ |
// | arg_statistics_id  | varchar(32)  | 是       | 统计任务的id       |
// | arg_result_content | varchar(500) | 是       | 修改后的总结性的话 |
// | arg_result_img     | varchar(100) | 否       | 要添加的图片       |
export function updateStatistics (param) {
	return request('/microservice/securityinspect/updateStatistics',param);
    return {
		"retCode":"1" ,//  0失败/1成功
		"retVal":"...",//失败信息
		
	}
}
// // 服务27：统计通报接口
// | 参数名称          | 类型         | 是否必传 | 描述                                                         |
// | ----------------- | ------------ | -------- | ------------------------------------------------------------ |
// | arg_statistics_id | varchar(32)  | 是       | 统计id                                                       |
// | arg_visible       | varchar(500) | 是       | 0、本部\分院全员，1、本部全员、2、分院全员  3、部门全员  其他的请传入对应的角色id，若多个角色，请中间用逗号隔开。 |
export function statisticsNoti (param) {
	return request('/microservice/securityinspect/statisticsNoti',param);
    return {
		"retVal": "1",
		"retCode": "1"
	}
}
// 服务28：统计送安委办领导接口（包含送安委办领导（安委办主办）、送安委办（分院办公室安全接口人））

// | 参数名称          | 类型        | 是否必传 | 描述         |
// | ----------------- | ----------- | -------- | ------------ |
// | arg_statistics_id | varchar(32) | 是       | 统计任务的id |
export function notiStatisticsLead (param) {
	return request('/microservice/securityinspect/notiStatisticsLead',param);
    return {
		"retCode":"1" ,//  0失败/1成功
		"retVal":"...",//失败信息
		
	}
}
// 服务29：查询办公室主管/副院长

// | 参数名称          | 类型        | 是否必传 | 描述         |
// | ----------------- | ----------- | -------- | ------------ |
// | arg_statistics_id | varchar(32) | 是       | 统计任务的id |
export function queryOffice (param) {
	return request('/microservice/securityinspect/queryOffice',param);
    return {
		"retCode": "1",
		"dataRows": [
			{
				"userId": "0849592",
				"userName": "侯欣硕",
				"deptId": "e65c00aa179e11e6880d008cfa0427c4",
				"deptName": "济南软件研究院-办公室",
				"roleId": "687asd8078a9s7d80ayaf078ayd7asd91",
				"roleName": "项目制管理平台-安全检查管理(二期)-各部门/中心负责人",
				"ouId": "e65c067b179e11e6880d008cfa0427c4",
				"ouName": "济南软件研究院"
			},
			{
				"userId": "0849578",
				"userName": "杜一腾",
				"deptId": "e65c00aa179e11e6880d008cfa0427c4",
				"deptName": "济南软件研究院-办公室",
				"roleId": "687asd8078a9s7d80ayaf078ayd7asd92",
				"roleName": "项目制管理平台-安全检查管理(二期)-各部门/中心负责人",
				"ouId": "e65c067b179e11e6880d008cfa0427c4",
				"ouName": "济南软件研究院"
			},
			{
				"userId": "0738866",
				"userName": "王超",
				"deptId": "e65c00aa179e11e6880d008cfa0427c43",
				"deptName": "济南软件研究院-办公室",
				"roleId": "687asd8078a9s7d80ayaf078ayd7asd9",
				"roleName": "项目制管理平台-安全检查管理(二期)-各部门/中心负责人",
				"ouId": "e65c067b179e11e6880d008cfa0427c4",
				"ouName": "济南软件研究院"
			},
			{
				"userId": "0340156",
				"userName": "丛新法",
				"deptId": "e65c0055179e11e6880d008cfa0427c44",
				"deptName": "济南软件研究院-管理层",
				"roleId": "asdyasda5s8d6a8sd6a8d7a567as5d56",
				"roleName": "项目制管理平台-安全检查管理(二期)-分管副院长",
				"ouId": "e65c067b179e11e6880d008cfa0427c4",
				"ouName": "济南软件研究院"
			}
		],
		"retVal": "1"
	}
}
// 服务30：报送办公室主管/副院长
// | 参数名称          | 类型        | 是否必传 | 描述                                                         |
// | ----------------- | ----------- | -------- | ------------------------------------------------------------ |
// | arg_statistics_id | varchar(32) | 是       | 统计任务的id                                                 |
// | arg_user_ids      | varchar(32) | 是       | 在服务30中用户选的userId的拼接，如果多个用户，则中间用逗号拼接 |
export function setInformToOffice (param) {
	return request('/microservice/securityinspect/setInformToOffice',param);
    return {
		"retCode":"1" ,//  0失败/1成功
		"retVal":"...",//失败信息
		
	}
}
// // 服务31：信息发布按钮（将统计结果发布
// | 参数名称          | 类型        | 是否必传 | 描述         |
// | ----------------- | ----------- | -------- | ------------ |
// | arg_statistics_id | varchar(32) | 是       | 统计任务的id |
export function issueStatistics (param) {
	return request('/microservice/securityinspect/issueStatistics',param);
    return {
		"retCode":"1" ,//  0失败/1成功
		"retVal":"...",//失败信息
		
	}
}
// 创建报告点击生成报告，生成指定年份的生成报告 
// | 参数名称   | 类型 | 是否必传 | 描述                                                         |
// | ---------- | ---- | -------- | ------------------------------------------------------------ |
// | buttonType | int  | 是       | 创建的是年度还是半年的统计报告，年度传0，半年传1             |
// | year       | int  | 是       | 传具体的年份                                                 |
// | month      | int  | 否       | 如果选的是年度就不要传了，如果选的是半年，上半年传0，下半年传1 |
export function newbaogao (param) {
	return request('/microservice/securityinspect/generateStatisticsReport',param);
    return {
		"retCode":"1",
		"retVal":"...",
		"dataRows":[
			{
				"publisher":"张三",//--发布人
				"title":"2020年度统计报告",//--统计报告的标题，例如2019年度统计报告
				"theTimeStart":"2020-01-06",//--时间范围开始
				"theTimeEnd":"2020-06-01",//--时间范围结束
				"inspectionResults":"结果有一两个人不过关",//--检查结果
				"ourHospital":{
					"xAxis":[
						{
							"type":"category",
							"data":["A分院","B分院","C分院","D分院","E分院","F分院"]	//--返回的是院里的部门
						}
					],
					"yAxis":[
						{"type":"value"}
					],
					"series":[
						{
							"name":"表扬",
							"type":"bar",
							"data":[5,8,6,9,1,2] //返回的是每个部门的合格人数
						},
						{
							"name":"不合格",
							"type":"bar",
							"data":[5,8,6,9,1,2] //返回的是每个部门的不合格人数
						},
						{
							"name":"安全隐患",
							"type":"bar",
							"data":[5,4,6,2,6,7,5]
						}
					]
				},
				"ou":{
					"xAxis":[
						{
							"type":"category",
							"data":["A分院","B分院","C分院","D分院","E分院","F分院"]	//--返回的是分院的名字
						}
					],
					"yAxis":[
						{"type":"value"}
					],
					"series":[
						{
							"name":"表扬",
							"type":"bar",
							"data":[5,8,6,9,1,2] //返回的是每个分院的合格人数
						},
						{
							"name":"不合格",
							"type":"bar",
							"data":[5,8,6,9,1,2] //返回的是每个分院的不合格人数
						},
						{
							"name":"安全隐患",
							"type":"bar",
							"data":[5,4,6,2,6,7,5]
						}
					]
				},
				"PieChart":{
					"series":[
						{
							"name":"合格量",
							"type":"pie",
							data:[
								{value:12, name:'部门一'},
								{value:15, name:'部门二'},
								{value:20, name:'部门三'},
								{value:25, name:'部门四'},
								{value:30, name:'部门五'},
								{value:23, name:'部门六'},
								{value:16, name:'部门日'}
	
							]
						},
						{
							"name":"不合格量",
							"type":"pie",
							data:[
								{value:12, name:'部门一'},
								{value:15, name:'部门二'},
								{value:20, name:'部门三'},
								{value:25, name:'部门四'},
								{value:30, name:'部门五'},
								{value:23, name:'部门六'},
								{value:16, name:'部门日'}
	
							]
						},
						{
							"name":"安全隐患量",
							"type":"pie",
							data:[
								{value:12, name:'部门一'},
								{value:15, name:'部门二'},
								{value:20, name:'部门三'},
								{value:25, name:'部门四'},
								{value:30, name:'部门五'},
								{value:23, name:'部门六'},
								{value:16, name:'部门日'}
	
							]
						}
					]
				}
			}
		]
	}
}
export function baoGaoInfor (param) {
	return request('/microservice/securityinspect/queryStatistics',param);
	return {
		"dataRows": [
			{
				"statisticsId": "ecfa7541a6e2452db6bb5e7be20896f1",
				"statisticsName": "软研院2019年度统计报告",
				"failNum": "6",
				"createTime": "2020-05-27 15:47:54.0",
				"issueTime": null,
				"issueUserId": "0563582",
				"issueUserName": "秦斌",
				"issueDeptId": "e65c07d7179e11e6880d008cfa0427c4",
				"issueDeptName": "联通软件研究院-办公室（党委办公室）",
				"issueOuId": "e65c02c2179e11e6880d008cfa0427c4",
				"issueOuName": "联通软件研究院本部",
				"setType": "0",
				"setYear": "2019",
				"statisticsStartTime": "2019-01-01 00:00:00.0",
				"statisticsEndTime": "2019-12-31 23:59:59.0",
				"statisticsStatus": "0", //0:未发布   1:已发布
				"checkResult": "需要修改的一共有10条,其中严重7条，差3条，需要表扬的一共有0条。",
				"imgs": null,
				"statisticsTable": "[{\"ourHospital\":{\"yAxis\":[{\"type\":\"value\"}],\"xAxis\":[{\"data\":[\"联通软件研究院-党群部（党委宣传部）\",\"联通软件研究院-采购部\",\"联通软件研究院-项目管理部\",\"联通软件研究院-公众研发事业部\",\"联通软件研究院-创新与合作研发事业部\",\"联通软件研究院-公共平台与架构研发事业部\",\"联通软件研究院-运营保障与调度中心\",\"联通软件研究院-计费结算中心\",\"联通软件研究院-集客与行业研发事业部\",\"联通软件研究院-共享资源中心\",\"联通软件研究院-纪委\",\"联通软件研究院-政企与行业研发事业部\",\"联通软件研究院-创新与能力运营事业部\",\"联通软件研究院-客户服务研发事业部\",\"联通软件研究院-公共平台与架构部\",\"联通软件研究院-软件开发部\",\"联通软件研究院-项目与质量支撑部\",\"联通软件研究院-运营支撑部\",\"联通软件研究院-管理层\",\"联通软件研究院-办公室（党委办公室）\",\"联通软件研究院-财务部\",\"联通软件研究院-人力资源部（党委组织部）\",\"联通软件研究院-需求分析部\"],\"type\":\"category\"}],\"series\":[{\"data\":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0],\"name\":\"表扬\",\"type\":\"bar\"},{\"data\":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,3,0,0],\"name\":\"不合格\",\"type\":\"bar\"},{\"data\":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,14,0,0],\"name\":\"安全隐患\",\"type\":\"bar\"}]},\"PieChart\":{\"series\":[{\"data\":[{\"name\":\"联通软件研究院-党群部（党委宣传部）\",\"value\":0},{\"name\":\"联通软件研究院-采购部\",\"value\":0},{\"name\":\"联通软件研究院-项目管理部\",\"value\":0},{\"name\":\"联通软件研究院-公众研发事业部\",\"value\":0},{\"name\":\"联通软件研究院-创新与合作研发事业部\",\"value\":0},{\"name\":\"联通软件研究院-公共平台与架构研发事业部\",\"value\":0},{\"name\":\"联通软件研究院-运营保障与调度中心\",\"value\":0},{\"name\":\"联通软件研究院-计费结算中心\",\"value\":0},{\"name\":\"联通软件研究院-集客与行业研发事业部\",\"value\":0},{\"name\":\"联通软件研究院-共享资源中心\",\"value\":0},{\"name\":\"联通软件研究院-纪委\",\"value\":0},{\"name\":\"联通软件研究院-政企与行业研发事业部\",\"value\":0},{\"name\":\"联通软件研究院-创新与能力运营事业部\",\"value\":0},{\"name\":\"联通软件研究院-客户服务研发事业部\",\"value\":0},{\"name\":\"联通软件研究院-公共平台与架构部\",\"value\":0},{\"name\":\"联通软件研究院-软件开发部\",\"value\":0},{\"name\":\"联通软件研究院-项目与质量支撑部\",\"value\":0},{\"name\":\"联通软件研究院-运营支撑部\",\"value\":0},{\"name\":\"联通软件研究院-管理层\",\"value\":0},{\"name\":\"联通软件研究院-办公室（党委办公室）\",\"value\":1},{\"name\":\"联通软件研究院-财务部\",\"value\":1},{\"name\":\"联通软件研究院-人力资源部（党委组织部）\",\"value\":0},{\"name\":\"联通软件研究院-需求分析部\",\"value\":0}],\"name\":\"合格量\",\"type\":\"pie\"},{\"data\":[{\"name\":\"联通软件研究院-党群部（党委宣传部）\",\"value\":0},{\"name\":\"联通软件研究院-采购部\",\"value\":0},{\"name\":\"联通软件研究院-项目管理部\",\"value\":0},{\"name\":\"联通软件研究院-公众研发事业部\",\"value\":0},{\"name\":\"联通软件研究院-创新与合作研发事业部\",\"value\":0},{\"name\":\"联通软件研究院-公共平台与架构研发事业部\",\"value\":0},{\"name\":\"联通软件研究院-运营保障与调度中心\",\"value\":0},{\"name\":\"联通软件研究院-计费结算中心\",\"value\":0},{\"name\":\"联通软件研究院-集客与行业研发事业部\",\"value\":0},{\"name\":\"联通软件研究院-共享资源中心\",\"value\":0},{\"name\":\"联通软件研究院-纪委\",\"value\":0},{\"name\":\"联通软件研究院-政企与行业研发事业部\",\"value\":0},{\"name\":\"联通软件研究院-创新与能力运营事业部\",\"value\":0},{\"name\":\"联通软件研究院-客户服务研发事业部\",\"value\":0},{\"name\":\"联通软件研究院-公共平台与架构部\",\"value\":0},{\"name\":\"联通软件研究院-软件开发部\",\"value\":0},{\"name\":\"联通软件研究院-项目与质量支撑部\",\"value\":0},{\"name\":\"联通软件研究院-运营支撑部\",\"value\":0},{\"name\":\"联通软件研究院-管理层\",\"value\":0},{\"name\":\"联通软件研究院-办公室（党委办公室）\",\"value\":1},{\"name\":\"联通软件研究院-财务部\",\"value\":3},{\"name\":\"联通软件研究院-人力资源部（党委组织部）\",\"value\":0},{\"name\":\"联通软件研究院-需求分析部\",\"value\":0}],\"name\":\"不合格量\",\"type\":\"pie\"},{\"data\":[{\"name\":\"联通软件研究院-党群部（党委宣传部）\",\"value\":0},{\"name\":\"联通软件研究院-采购部\",\"value\":0},{\"name\":\"联通软件研究院-项目管理部\",\"value\":0},{\"name\":\"联通软件研究院-公众研发事业部\",\"value\":0},{\"name\":\"联通软件研究院-创新与合作研发事业部\",\"value\":0},{\"name\":\"联通软件研究院-公共平台与架构研发事业部\",\"value\":0},{\"name\":\"联通软件研究院-运营保障与调度中心\",\"value\":0},{\"name\":\"联通软件研究院-计费结算中心\",\"value\":0},{\"name\":\"联通软件研究院-集客与行业研发事业部\",\"value\":0},{\"name\":\"联通软件研究院-共享资源中心\",\"value\":0},{\"name\":\"联通软件研究院-纪委\",\"value\":0},{\"name\":\"联通软件研究院-政企与行业研发事业部\",\"value\":0},{\"name\":\"联通软件研究院-创新与能力运营事业部\",\"value\":0},{\"name\":\"联通软件研究院-客户服务研发事业部\",\"value\":0},{\"name\":\"联通软件研究院-公共平台与架构部\",\"value\":0},{\"name\":\"联通软件研究院-软件开发部\",\"value\":0},{\"name\":\"联通软件研究院-项目与质量支撑部\",\"value\":0},{\"name\":\"联通软件研究院-运营支撑部\",\"value\":0},{\"name\":\"联通软件研究院-管理层\",\"value\":0},{\"name\":\"联通软件研究院-办公室（党委办公室）\",\"value\":6},{\"name\":\"联通软件研究院-财务部\",\"value\":14},{\"name\":\"联通软件研究院-人力资源部（党委组织部）\",\"value\":0},{\"name\":\"联通软件研究院-需求分析部\",\"value\":0}],\"name\":\"安全隐患量\",\"type\":\"pie\"}]},\"ou\":{\"yAxis\":[{\"type\":\"value\"}],\"xAxis\":[{\"data\":[\"西安软件研究院\",\"广州软件研究院\",\"南京软件研究院\",\"济南软件研究院\",\"哈尔滨软件研究院\"],\"type\":\"category\"}],\"series\":[{\"data\":[0,0,0,1,1],\"name\":\"表扬\",\"type\":\"bar\"},{\"data\":[0,0,0,1,1],\"name\":\"不合格\",\"type\":\"bar\"},{\"data\":[0,0,0,6,5],\"name\":\"安全隐患\",\"type\":\"bar\"}]}}]"
			}
		],
		"retCode": "1",
		"retVal": "1"
	}
}