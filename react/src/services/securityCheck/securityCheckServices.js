/**
 * 作者：窦阳春
 * 创建日期： 2020-4-21
 * 邮箱: douyc@itnova.com.cn
 * 功能： 安全管理系统服务接口
 */
import request from '../../utils/request';
import Cookies from 'js-cookie';
let userid = Cookies.get("userid")
// 服务21：查角色(魏永杰)
export function queryUserInfo(param) {
    return request('/microservice/securityinspect/queryUserInfo',{...param, userid});
    // return {
    //     "RetVal": "1",
    //     "retCode": "1",
    //     "dataRows": [
    //        {
    //             "userId": "0563582",
    //             "userName": "秦斌",
    //             "deptId": "e65c07d7179e11e6880d008cfa0427c4",
    //             "deptName": "联通软件研究院-办公室（党委办公室）",
		// 						"roleName": "项目制管理平台-安全检查管理-各分院安委办主办,项目制管理平台-安全检查管理-软研院安委办主办",
		// 						// "roleName": "办公室安全接口人",
		// 						// "roleName": "安全员",
		// 						// "roleName": "分院部门安全员", 
    //             "ouid": "e65c02c2179e11e6880d008cfa0427c4"
    //         }
    //     ],
       
    // }
}
// 服务1 查询 查任务（王培忠）
export function queryTaskList(param) {
    return request('/microservice/securityinspect/queryTaskList',{...param, userid});
    return {
			"retCode":"1",
			"retVal":"...",
			"dataRows":[
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
						'taskStatusDesc': '检查完成',
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
						'taskStatusDesc': '检查完成',
						'taskId': '05'
				},
				{
						"taskTitle":"安全检查任务一",
						"startTime":"2020-05-10",
						"endTime":"2020-05-11",
						"taskType":"8", //--任务状态，模糊查询(0、安委办统查 1、安委办抽查 2、专项检查 3、分院统查 4、分院抽查 5、分院专项检查 6、部门自查 7、部门间互查  8、部门统查  9、部门抽查  10、员工自查 11、工作通知),返回的是数字,
					  'taskTypeDesc': '部门统查',
						"taskStatus":"7",
						'taskStatusDesc': '检查完成',
						'taskId': '05'
				},
				{
						"taskTitle":"安全检查任务一",
						"startTime":"2020-05-10",
						"endTime":"2020-05-11",
						"taskType":"9", //--任务状态，模糊查询(0、安委办统查 1、安委办抽查 2、专项检查 3、分院统查 4、分院抽查 5、分院专项检查 6、部门自查 7、部门间互查  8、部门统查  9、部门抽查  10、员工自查 11、工作通知),返回的是数字,
					  'taskTypeDesc': '部门抽查',
						"taskStatus":"7",
						'taskStatusDesc': '检查中',
						'taskId': '05'
				},
				{
						"taskTitle":"安全检查任务一",
						"startTime":"2020-05-10",
						"endTime":"2020-05-11",
						"taskType":"10", //--任务状态，模糊查询(0、安委办统查 1、安委办抽查 2、专项检查 3、分院统查 4、分院抽查 5、分院专项检查 6、部门自查 7、部门间互查  8、部门统查  9、部门抽查  10、员工自查 11、工作通知),返回的是数字,
					  'taskTypeDesc': '员工自查',
						"taskStatus":"7",
						'taskStatusDesc': '检查完成',
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
						'taskStatusDesc': '检查完成',
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
						'taskStatusDesc': '检查完成',
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
						'taskStatusDesc': '检查完成',
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
						'taskStatusDesc': '检查完成',
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
    return request('/microservice/securityinspect/queryInspectObjectAndContent',{...param, userid});
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
    return request('/microservice/securityinspect/delTask',{...param, userid});
    // return {
    //     'retCode':"1",
    //     "RetVal":"....."
    // }
}
// 返回全部角色
export function queryRole(param) {
	return request('/microservice/securityinspect/queryRole',{...param, userid});
	return {
			'retCode':"1",
			"RetVal":".....",
			"dataRows": [  
				{
					"roleId": 'eqwewqdas1dsa2131d222222222221',
					"roleName": "项目制管理平台-安全检查管理-院领导"
				},
				{
					"roleId": 'eqwewqdasds2a21312d222222s22221',
					"roleName": "项目制管理平台-安全检查管理-院分管领导"
				},
				{
					"roleId": 'eqwewqda3sdsa21s3122222f2222221',
					"roleName": "项目制管理平台-安全检查管理-各部门/中心负责人"
				},
				{
					"roleId": 'eqwewqdasdsa2131222252w222222s1',
					"roleName": "项目制管理平台-分院院领导"
				},
				{
					"roleId": 'eqwewqdasdsa213122 22225222221',
					"roleName": "项目制管理平台-分院办公室负责人"
				},
				{
					"roleId": 'eqwewqdasdsa21312222s 222252221',
					"roleName": "项目制管理平台-分院办公室安全接口人"
				}, 
				{
					"roleId": '111eqwewqdas1dsa21312 2ff2222222221',
					"roleName": "项目制管理平台-安全检查管理-分院领导" 
				},
				{
					"roleId": '111eqwewqdas1dsa2131222d2bf22222221',
					"roleName": "项目制管理平台-安全检查管理-各部门/中心经理"  
				},
				{
					"roleId": '111eqwewqdas1dsva213v12wew222b22222221',
					"roleName": "项目制管理平台-安全检查管理-各部门/中心安全员"  
				},
				{
					"roleId": '111eqwewqdas1dsa2sdfs131222222222221',
					"roleName": "项目制管理平台-安全检查管理-22"  
				},
				{
					"roleId": '111eqwewqdas1dsa2sdfs1312g22222222221',
					"roleName": "项目制管理平台-安全检查管理-22"  
				},
			],
	}
}
//建立任务
export function addTask(param) {
	return request('/microservice/securityinspect/addTask',{...param, userid});
	// return {
	// 	'retCode':"1",                //       --   1表示创建任务成功
	// 	"RetVal":"....."
	// }
}
//任务详情
export function queryTaskInform(param) {
	return request('/microservice/securityinspect/queryTaskInform',{...param, userid});
	// return {
	// 	'retCode':"1",               
	// 	"RetVal":".....",
	// 	"dataRows":[
	// 		{
	// 			"createUserName":"杨青", // --发布人
	// 			"startTime":"2015-02-03",
	// 			"endTime":"2015-03-03",
	// 			"taskTitle":"任务详情",
	// 			"taskType":"safeSpotCheck", //--检查方式，模糊查询 安委办统查（safeCheck）   安委办抽查（ safeSpotCheck）  专项检查（specialCheck） 分院统查（branchSafeCheck） 分院抽查（branchSportCheck） 分院专项检查（branchSpecialCheck） 部门自查（deptSelfCheck）  部门间互查（deptEoCheck）  部门统查（deptSafeCheck）  部门抽查（deptSportCheck）  员工自查（staffSelfCheck） 工作通知（workNotified） --返回的是括号里面的单词,
	// 			"taskTypeDesc":"安委办统查", //--返回的是单词对应的汉字
	// 			"examineObj": ['办公区', '员工活动区'], //--检查对象
	// 			"belongUserName": ['eqwewqdas1dsa2131222222222221', 'eqwewqdasds2a21312222222s22221', '0', '1'],//--通知对象
	// 			"otherOu":"0", //--是否涉及分院
	// 			"examineContent":['部门安全责任制是否落实','部门安全员是否履行安全督查并协助部门开展安全管理'], // --检查内容
	// 			"demand":"检查要求" ,//--'检查要求
	// 			"examineImg": [
	// 				{
	// 					'AbsolutePath': '10.245.47.2/filemanage/upload/writeFileUpdate/10010/2020/4/26/0893287/d42be66bb3a34abbaa2616b493955977/窦阳春_天梯初级证书.png',
	// 					'ExternalAbsolutePath': '10.0.47.2/filemanage/upload/writeFileUpdate/10010/2020/4/26/0893287/d42be66bb3a34abbaa2616b493955977/窦阳春_天梯初级证书.png',
	// 					'FileId': '39e0b3fdecb84c5d9bcc7baeb28052c1',
	// 					'OriginalFileName': '窦阳春_天梯初级证书.png',
	// 					'RealFileName': '窦阳春_天梯初级证书.png',
	// 					'RelativePath': '/filemanage/upload/writeFileUpdate/10010/2020/4/26/0893287/d42be66bb3a34abbaa2616b493955977/窦阳春_天梯初级证书.png'
	// 				},
	// 				{
	// 					'AbsolutePath': '10.245.47.2/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/2168a52fffaf41f8ae2758fca8a3df41/窦阳春_天梯初级证书 (1).png',
	// 					'ExternalAbsolutePath': '10.0.47.2/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/39929a9d04504ef1b1a23bbad999cf2f/窦阳春_天梯初级证书.png',
	// 					'FileId': 'c406175c2c8d40279063dcb2924a6d3c',
	// 					'OriginalFileName': '窦阳春_天梯初级证书.png',
	// 					'RealFileName': '窦阳春_天梯初级证书.png',
	// 					'RelativePath': '/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/39929a9d04504ef1b1a23bbad999cf2f/窦阳春_天梯初级证书.png'
	// 				},
	// 				{
	// 					'AbsolutePath': '10.245.47.2/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/f9eb4fcd4dba4d7ca8e6d4ad26c6b38f/窦阳春_能力开放体系初级证书.png',
	// 					'ExternalAbsolutePath': '10.0.47.2/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/f9eb4fcd4dba4d7ca8e6d4ad26c6b38f/窦阳春_能力开放体系初级证书.png',
	// 					'FileId': '"10ede805b3554f8f97a597191cfd589a"',
	// 					'OriginalFileName': '窦阳春_能力开放体系初级证书.png',
	// 					'RealFileName': '窦阳春_能力开放体系初级证书.png',
	// 					'RelativePath': '/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/f9eb4fcd4dba4d7ca8e6d4ad26c6b38f/窦阳春_能力开放体系初级证书.png'
	// 				},
	// 				{
	// 					'AbsolutePath': '10.245.47.2/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/aa017e6b13be4908ad93e761f0f9a9b8/窦阳春_天宫初级证书.png',
	// 					'ExternalAbsolutePath': '10.0.47.2/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/aa017e6b13be4908ad93e761f0f9a9b8/窦阳春_天宫初级证书.png',
	// 					'FileId': '300a93a40d524e80b70a6d4948446f05',
	// 					'OriginalFileName': '窦阳春_天宫初级证书.png',
	// 					'RealFileName': '窦阳春_天宫初级证书.png',
	// 					'RelativePath': '/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/aa017e6b13be4908ad93e761f0f9a9b8/窦阳春_天宫初级证书.png'
	// 				},
	// 				{
	// 					'AbsolutePath': '"10.245.47.2/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/a830b166d5b347ddbcf9e7da7bd2db27/Desert.jpg"',
	// 					'ExternalAbsolutePath': '"10.245.47.2/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/a830b166d5b347ddbcf9e7da7bd2db27/Desert.jpg"',
	// 					'FileId': 'e2fd01e7049b4ef0b055db5c5c8d73c2',
	// 					'OriginalFileName': 'Desert.jpg',
	// 					'RealFileName': 'Desert.jpg',
	// 					'RelativePath': '/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/a830b166d5b347ddbcf9e7da7bd2db27/Desert.jpg'
	// 				},
	// 				{
	// 					'AbsolutePath': '10.245.47.2/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/922e8da1c7ce466f97673581637d5493/广州分院图片.jpg',
	// 					'ExternalAbsolutePath': '10.245.47.2/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/922e8da1c7ce466f97673581637d5493/广州分院图片.jpg',
	// 					'FileId': '"f8a500d84d40475a8e98988d25ce1e08"',
	// 					'OriginalFileName': '广州分院图片.jpg',
	// 					'RealFileName': '广州分院图片.jpg',
	// 					'RelativePath': '/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/922e8da1c7ce466f97673581637d5493/广州分院图片.jpg'
	// 				},
	// 				{
	// 					'AbsolutePath': '10.245.47.2/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/b7affb31ce6d444c8a34b92ec10d56e5/005E9Ryxgy1g8f4bubsdmj30ew0ciq3h.jpg',
	// 					'ExternalAbsolutePath': '10.245.47.2/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/b7affb31ce6d444c8a34b92ec10d56e5/005E9Ryxgy1g8f4bubsdmj30ew0ciq3h.jpg',
	// 					'FileId': '25cfc22e7c0e4b77bfe2063248cc03ec',
	// 					'OriginalFileName': '005E9Ryxgy1g8f4bubsdmj30ew0ciq3h.jpg',
	// 					'RealFileName': '005E9Ryxgy1g8f4bubsdmj30ew0ciq3h.jpg',
	// 					'RelativePath': '/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/b7affb31ce6d444c8a34b92ec10d56e5/005E9Ryxgy1g8f4bubsdmj30ew0ciq3h.jpg'
	// 				},
	// 				{
	// 					'AbsolutePath': '10.245.47.2/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/0828e10a7ac74b1bb94e647251e45384/壁纸1.jpg',
	// 					'ExternalAbsolutePath': '10.245.47.2/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/0828e10a7ac74b1bb94e647251e45384/壁纸1.jpg',
	// 					'FileId': '867196209cbe46338cb1eef64976aa61',
	// 					'OriginalFileName': '壁纸1.jpg',
	// 					'RealFileName': '壁纸1.jpg',
	// 					'RelativePath': '/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/0828e10a7ac74b1bb94e647251e45384/壁纸1.jpg'
	// 				},
	// 				{
	// 					'AbsolutePath': '10.245.47.2/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/0828e10a7ac74b1bb94e647251e45384/壁纸1.jpg',
	// 					'ExternalAbsolutePath': '10.245.47.2/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/0828e10a7ac74b1bb94e647251e45384/壁纸1.jpg',
	// 					'FileId': '867196209cbe46338cb1eef64976aa62',
	// 					'OriginalFileName': '壁纸1.jpg',
	// 					'RealFileName': '壁纸1.jpg',
	// 					'RelativePath': '/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/0828e10a7ac74b1bb94e647251e45384/壁纸1.jpg'
	// 				},
	// 				{
	// 					'AbsolutePath': '10.245.47.2/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/17f34978d4f144a2ab9fc5251cbb1c77/微信图片_20200406213807.png',
	// 					'ExternalAbsolutePath': '10.245.47.2/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/17f34978d4f144a2ab9fc5251cbb1c77/微信图片_20200406213807.png',
	// 					'FileId': '30d71737d2424a9798746391787c8622',
	// 					'OriginalFileName': '微信图片_20200406213807.png',
	// 					'RealFileName': '微信图片_20200406213807.png',
	// 					'RelativePath': '/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/17f34978d4f144a2ab9fc5251cbb1c77/微信图片_20200406213807.png'
	// 				},
	// 			] //--检查规范
	// 		}
	// 	]
	// }
}
//修改任务
export function editTask(param) {
	return request('/microservice/securityinspect/editTask',{...param, userid});
	// return {
	// 	'retCode':"1",     
	// 	"retVal":"...",
	// }
}
//服务7 查询本院以及分院多级表格之院系（王培忠）
export function queryCourtyardAndDeptAndStaff(param) {
	return request('/microservice/securityinspect/queryCourtyardAndDeptAndStaff',{...param, userid});
	// return {
	// 	"retCode":"1",
	// 	"retVal":"...",
	// 	"dataRows":[
	// 		{
	// 			"yardId":"11", //--本院以及分院的id
	// 			"yardName":"联通软件研究院本部", //--本院以及分院的名字
	// 			"praise":"1", //-- 表扬数量
	// 			"wRectification":"2", //-- 待整改数量
	// 			"examinStateDesc": "待通知",
	// 			"dept":[
	// 				{
	// 					"deptId":"11" ,//--部门id
	// 					"deptName":"人力资源", //--部门名称
	// 					"praise":"1", //--表扬数量
	// 					"wRectification":"1", //--待整改数量
	// 					"informReform":"0", //(0、待通知   1、已通知) --是否发起通知，反的是数字.
	// 					"staff":[
	// 						{
	// 							"staffId":"1",//--员工Id
	// 							"staffName":"章叁", //--员工名称
	// 							"assetsName":"A1-001",// --资产名字
	// 							"assetsArea":"办公室",// --资产所属区域
	// 							"examinState":"0",// -- 检查情况(0、表扬  1、待整改   2、已整改) --反的是数字
	// 							"examinStateDesc": "表扬"
	// 						},
	// 						{
	// 							"staffId":"2",//--员工Id
	// 							"staffName":"李四", //--员工名称
	// 							"assetsName":"A1-001",// --资产名字
	// 							"assetsArea":"办公室",// --资产所属区域
	// 							"examinState":"1",// -- 检查情况(0、表扬  1、待整改   2、已整改) --反的是数字
	// 							"examinStateDesc": "待整改"
	// 						},
	// 						{
	// 							"staffId":"3",//--员工Id
	// 							"staffName":"王五", //--员工名称
	// 							"assetsName":"A1-0012",// --资产名字
	// 							"assetsArea":"办公室",// --资产所属区域
	// 							"examinState":"2",// -- 检查情况(0、表扬  1、待整改   2、已整改) --反的是数字
	// 							"examinStateDesc": "待整改"
	// 						},
	// 					]
	// 				},
	// 				{
	// 					"deptId":"22" ,//--部门id
	// 					"assetsId" : '1',
	// 					"deptName":"财务部", //--部门名称
	// 					"praise":"2", //--表扬数量
	// 					"wRectification":"0", //--待整改数量
	// 					"informReform":"0", //(0、待通知   1、已通知) --是否发起通知，反的是数字.
	// 					"staff":[
	// 						{
	// 							"staffId":"1",//--员工Id
	// 							"staffName":"章叁", //--员工名称
	// 							"assetsName":"A1-001",// --资产名字
	// 							"assetsId" : '1',
	// 							"assetsArea":"办公室",// --资产所属区域
	// 							"examinState":"0",// -- 检查情况(0、表扬  1、待整改   2、已整改) --反的是数字
	// 							"examinStateDesc": "表扬"
	// 						},
	// 						{
	// 							"staffId":"2",//--员工Id
	// 							"assetsId" : '1',
	// 							"staffName":"李四", //--员工名称
	// 							"assetsName":"A1-001",// --资产名字
	// 							"assetsArea":"办公室",// --资产所属区域
	// 							"examinState":"1",// -- 检查情况(0、表扬  1、待整改   2、已整改) --反的是数字
	// 							"examinStateDesc": "待整改"
	// 						},
	// 						{
	// 							"staffId":"3",//--员工Id
	// 							"assetsId" : '1',
	// 							"staffName":"王五", //--员工名称
	// 							"assetsName":"A1-0012",// --资产名字
	// 							"assetsArea":"办公室",// --资产所属区域
	// 							"examinState":"2",// -- 检查情况(0、表扬  1、待整改   2、已整改) --反的是数字
	// 							"examinStateDesc": "待整改"
	// 						},
	// 					]
	// 				},
	// 			]
	// 		},
	// 		{
	// 			"yardId":"22", //--本院以及分院的id
	// 			"yardName":"哈尔滨分院", //--本院以及分院的名字
	// 			"praise":"2", //-- 表扬数量
	// 			"wRectification":"0", //-- 待整改数量
	// 			"dept":[
	// 				{
	// 					"deptId":"11" ,//--部门id
	// 					"deptName":"人力资源", //--部门名称
	// 					"praise":"1", //--表扬数量
	// 					"assetsId" : '1',
	// 					"wRectification":"0", //--待整改数量
	// 					"informReform":"1", //(0、待通知   1、已通知) --是否发起通知，反的是数字.
	// 					"staff":[
	// 						{
	// 							"staffId":"1",//--员工Id
	// 							"assetsId" : '1',
	// 							"staffName":"章叁", //--员工名称
	// 							"assetsName":"A1-001",// --资产名字
	// 							"assetsArea":"办公室",// --资产所属区域
	// 							"examinState":"0",// -- 检查情况(0、表扬  1、待整改   2、已整改) --反的是数字
	// 							"examinStateDesc": "表扬"
	// 						},
	// 						{
	// 							"staffId":"2",//--员工Id
	// 							"assetsId" : '1',
	// 							"staffName":"李四", //--员工名称
	// 							"assetsName":"A1-001",// --资产名字
	// 							"assetsArea":"办公室",// --资产所属区域
	// 							"examinState":"1",// -- 检查情况(0、表扬  1、待整改   2、已整改) --反的是数字
	// 							"examinStateDesc": "待整改"
	// 						},
	// 						{
	// 							"staffId":"3",//--员工Id
	// 							"assetsId" : '1',
	// 							"staffName":"王五", //--员工名称
	// 							"assetsName":"A1-0012",// --资产名字
	// 							"assetsArea":"办公室",// --资产所属区域
	// 							"examinState":"2",// -- 检查情况(0、表扬  1、待整改   2、已整改) --反的是数字
	// 							"examinStateDesc": "待整改"
	// 						},
	// 					]
	// 				},
	// 				{
	// 					"deptId":"22" ,//--部门id
	// 					"assetsId" : '1',
	// 					"deptName":"财务部", //--部门名称
	// 					"praise":"2", //--表扬数量
	// 					"wRectification":"1", //--待整改数量
	// 					"informReform":"0", //(0、待通知   1、已通知) --是否发起通知，反的是数字.
	// 					"staff":[
	// 						{
	// 							"staffId":"1",//--员工Id
	// 							"assetsId" : '1',
	// 							"staffName":"章叁", //--员工名称
	// 							"assetsName":"A1-001",// --资产名字
	// 							"assetsArea":"办公室",// --资产所属区域
	// 							"examinState":"0",// -- 检查情况(0、表扬  1、待整改   2、已整改) --反的是数字
	// 							"examinStateDesc": "表扬"
	// 						},
	// 						{
	// 							"staffId":"2",//--员工Id
	// 							"assetsId" : '1',
	// 							"staffName":"李四", //--员工名称
	// 							"assetsName":"A1-001",// --资产名字
	// 							"assetsArea":"办公室",// --资产所属区域
	// 							"examinState":"1",// -- 检查情况(0、表扬  1、待整改   2、已整改) --反的是数字
	// 							"examinStateDesc": "待整改"
	// 						},
	// 						{
	// 							"staffId":"3",//--员工Id
	// 							"assetsId" : '1',
	// 							"staffName":"王五", //--员工名称
	// 							"assetsName":"A1-0012",// --资产名字
	// 							"assetsArea":"办公室",// --资产所属区域
	// 							"examinState":"2",// -- 检查情况(0、表扬  1、待整改   2、已整改) --反的是数字
	// 							"examinStateDesc": "待整改"
	// 						},
	// 					]
	// 				},
	// 			]
	// 		},
	// 		{
	// 			"yardId":"33", //--本院以及分院的id
	// 			"yardName":"西安分院", //--本院以及分院的名字
	// 			"praise":"2", //-- 表扬数量
	// 			"wRectification":"2", //-- 待整改数量
	// 			"dept":[
	// 				{
	// 					"deptId":"11" ,//--部门id
	// 					"assetsId" : '1',
	// 					"deptName":"人力资源", //--部门名称
	// 					"praise":"1", //--表扬数量
	// 					"wRectification":"1", //--待整改数量
	// 					"informReform":"0", //(0、待通知   1、已通知) --是否发起通知，反的是数字.
	// 					"staff":[
	// 						{
	// 							"staffId":"1",//--员工Id
	// 							"assetsId" : '1',
	// 							"staffName":"章叁", //--员工名称
	// 							"assetsName":"A1-001",// --资产名字
	// 							"assetsArea":"办公室",// --资产所属区域
	// 							"examinState":"0",// -- 检查情况(0、表扬  1、待整改   2、已整改) --反的是数字
	// 							"examinStateDesc": "表扬"
	// 						},
	// 						{
	// 							"staffId":"2",//--员工Id
	// 							"assetsId" : '1',
	// 							"staffName":"李四", //--员工名称
	// 							"assetsName":"A1-001",// --资产名字
	// 							"assetsArea":"办公室",// --资产所属区域
	// 							"examinState":"1",// -- 检查情况(0、表扬  1、待整改   2、已整改) --反的是数字
	// 							"examinStateDesc": "待整改"
	// 						},
	// 						{
	// 							"staffId":"3",//--员工Id
	// 							"assetsId" : '1',
	// 							"staffName":"王五", //--员工名称
	// 							"assetsName":"A1-0012",// --资产名字
	// 							"assetsArea":"办公室",// --资产所属区域
	// 							"examinState":"2",// -- 检查情况(0、表扬  1、待整改   2、已整改) --反的是数字
	// 							"examinStateDesc": "待整改"
	// 						},
	// 					]
	// 				},
	// 				{
	// 					"deptId":"22" ,//--部门id
	// 					"assetsId" : '1',
	// 					"deptName":"财务部", //--部门名称
	// 					"praise":"2", //--表扬数量
	// 					"wRectification":"1", //--待整改数量
	// 					"informReform":"1", //(0、待通知   1、已通知) --是否发起通知，反的是数字.
	// 					"staff":[
	// 						{
	// 							"staffId":"1",//--员工Id
	// 							"assetsId" : '1',
	// 							"staffName":"章叁", //--员工名称
	// 							"assetsName":"A1-001",// --资产名字
	// 							"assetsArea":"办公室",// --资产所属区域
	// 							"examinState":"0",// -- 检查情况(0、表扬  1、待整改   2、已整改) --反的是数字
	// 							"examinStateDesc": "表扬"
	// 						},
	// 						{
	// 							"staffId":"2",//--员工Id
	// 							"assetsId" : '1',
	// 							"staffName":"李四", //--员工名称
	// 							"assetsName":"A1-001",// --资产名字
	// 							"assetsArea":"办公室",// --资产所属区域
	// 							"examinState":"1",// -- 检查情况(0、表扬  1、待整改   2、已整改) --反的是数字
	// 							"examinStateDesc": "待整改"
	// 						},
	// 						{
	// 							"staffId":"3",//--员工Id
	// 							"assetsId" : '1',
	// 							"staffName":"王五", //--员工名称
	// 							"assetsName":"A1-0012",// --资产名字
	// 							"assetsArea":"办公室",// --资产所属区域
	// 							"examinState":"2",// -- 检查情况(0、表扬  1、待整改   2、已整改) --反的是数字
	// 							"examinStateDesc": "待整改"
	// 						},
	// 					]
	// 				},
	// 			]
	// 		},
	// 		{
	// 			"yardId":"44", //--本院以及分院的id
	// 			"yardName":"广州分院", //--本院以及分院的名字
	// 			"praise":"2", //-- 表扬数量
	// 			"wRectification":"2", //-- 待整改数量
	// 			"dept":[
	// 				{
	// 					"deptId":"11" ,//--部门id
	// 					"assetsId" : '1',
	// 					"deptName":"人力资源", //--部门名称
	// 					"praise":"1", //--表扬数量
	// 					"wRectification":"1", //--待整改数量
	// 					"informReform":"0", //(0、待通知   1、已通知) --是否发起通知，反的是数字.
	// 					"staff":[
	// 						{
	// 							"staffId":"1",//--员工Id
	// 							"assetsId" : '1',
	// 							"staffName":"章叁", //--员工名称
	// 							"assetsName":"A1-001",// --资产名字
	// 							"assetsArea":"办公室",// --资产所属区域
	// 							"examinState":"0",// -- 检查情况(0、表扬  1、待整改   2、已整改) --反的是数字
	// 							"examinStateDesc": "表扬"
	// 						},
	// 						{
	// 							"staffId":"2",//--员工Id
	// 							"assetsId" : '1',
	// 							"staffName":"李四", //--员工名称
	// 							"assetsName":"A1-001",// --资产名字
	// 							"assetsArea":"办公室",// --资产所属区域
	// 							"examinState":"1",// -- 检查情况(0、表扬  1、待整改   2、已整改) --反的是数字
	// 							"examinStateDesc": "待整改"
	// 						},
	// 						{
	// 							"staffId":"3",//--员工Id
	// 							"assetsId" : '1',
	// 							"staffName":"王五", //--员工名称
	// 							"assetsName":"A1-0012",// --资产名字
	// 							"assetsArea":"办公室",// --资产所属区域
	// 							"examinState":"2",// -- 检查情况(0、表扬  1、待整改   2、已整改) --反的是数字
	// 							"examinStateDesc": "待整改"
	// 						},
	// 					]
	// 				},
	// 				{
	// 					"deptId":"22" ,//--部门id
	// 					"assetsId" : '1',
	// 					"deptName":"财务部", //--部门名称
	// 					"praise":"2", //--表扬数量
	// 					"wRectification":"1", //--待整改数量
	// 					"informReform":"0", //(0、待通知   1、已通知) --是否发起通知，反的是数字.
	// 					"staff":[
	// 						{
	// 							"staffId":"1",//--员工Id
	// 							"assetsId" : '1',
	// 							"staffName":"章叁", //--员工名称
	// 							"assetsName":"A1-001",// --资产名字
	// 							"assetsArea":"办公室",// --资产所属区域
	// 							"examinState":"0",// -- 检查情况(0、表扬  1、待整改   2、已整改) --反的是数字
	// 							"examinStateDesc": "表扬"
	// 						},
	// 						{
	// 							"staffId":"2",//--员工Id
	// 							"assetsId" : '1',
	// 							"staffName":"李四", //--员工名称
	// 							"assetsName":"A1-001",// --资产名字
	// 							"assetsArea":"办公室",// --资产所属区域
	// 							"examinState":"1",// -- 检查情况(0、表扬  1、待整改   2、已整改) --反的是数字
	// 							"examinStateDesc": "待整改"
	// 						},
	// 						{
	// 							"staffId":"3",//--员工Id
	// 							"assetsId" : '1',
	// 							"staffName":"王五", //--员工名称
	// 							"assetsName":"A1-0012",// --资产名字
	// 							"assetsArea":"办公室",// --资产所属区域
	// 							"examinState":"2",// -- 检查情况(0、表扬  1、待整改   2、已整改) --反的是数字
	// 							"examinStateDesc": "待整改"
	// 						},
	// 					]
	// 				},
	// 			]
	// 		},
	// 		{
	// 			"yardId":"55", //--本院以及分院的id
	// 			"yardName":"南京分院", //--本院以及分院的名字
	// 			"praise":"2", //-- 表扬数量
	// 			"wRectification":"2", //-- 待整改数量
	// 			"dept":[
	// 				{
	// 					"deptId":"11" ,//--部门id
	// 					"assetsId" : '1',
	// 					"deptName":"人力资源", //--部门名称
	// 					"praise":"1", //--表扬数量
	// 					"wRectification":"1", //--待整改数量
	// 					"informReform":"1", //(0、待通知   1、已通知) --是否发起通知，反的是数字.
	// 					"staff":[
	// 						{
	// 							"staffId":"1",//--员工Id
	// 							"assetsId" : '1',
	// 							"staffName":"章叁", //--员工名称
	// 							"assetsName":"A1-001",// --资产名字
	// 							"assetsArea":"办公室",// --资产所属区域
	// 							"examinState":"0",// -- 检查情况(0、表扬  1、待整改   2、已整改) --反的是数字
	// 							"examinStateDesc": "表扬"
	// 						},
	// 						{
	// 							"staffId":"2",//--员工Id
	// 							"assetsId" : '1',
	// 							"staffName":"李四", //--员工名称
	// 							"assetsName":"A1-001",// --资产名字
	// 							"assetsArea":"办公室",// --资产所属区域
	// 							"examinState":"1",// -- 检查情况(0、表扬  1、待整改   2、已整改) --反的是数字
	// 							"examinStateDesc": "待整改"
	// 						},
	// 						{
	// 							"staffId":"3",//--员工Id
	// 							"assetsId" : '1',
	// 							"staffName":"王五", //--员工名称
	// 							"assetsName":"A1-0012",// --资产名字
	// 							"assetsArea":"办公室",// --资产所属区域
	// 							"examinState":"2",// -- 检查情况(0、表扬  1、待整改   2、已整改) --反的是数字
	// 							"examinStateDesc": "待整改"
	// 						},
	// 					]
	// 				},
	// 				{
	// 					"deptId":"22" ,//--部门id
	// 					"assetsId" : '1',
	// 					"deptName":"财务部", //--部门名称
	// 					"praise":"2", //--表扬数量
	// 					"wRectification":"1", //--待整改数量
	// 					"informReform":"1", //(0、待通知   1、已通知) --是否发起通知，反的是数字.
	// 					"staff":[
	// 						{
	// 							"staffId":"1",//--员工Id
	// 							"assetsId" : '1',
	// 							"staffName":"章叁", //--员工名称
	// 							"assetsName":"A1-001",// --资产名字
	// 							"assetsArea":"办公室",// --资产所属区域
	// 							"examinState":"0",// -- 检查情况(0、表扬  1、待整改   2、已整改) --反的是数字
	// 							"examinStateDesc": "表扬"
	// 						},
	// 						{
	// 							"staffId":"2",//--员工Id
	// 							"assetsId" : '1',
	// 							"staffName":"李四", //--员工名称
	// 							"assetsName":"A1-001",// --资产名字
	// 							"assetsArea":"办公室",// --资产所属区域
	// 							"examinState":"1",// -- 检查情况(0、表扬  1、待整改   2、已整改) --反的是数字
	// 							"examinStateDesc": "待整改"
	// 						},
	// 						{
	// 							"staffId":"3",//--员工Id
	// 							"assetsId" : '1',
	// 							"staffName":"王五", //--员工名称
	// 							"assetsName":"A1-0012",// --资产名字
	// 							"assetsArea":"办公室",// --资产所属区域
	// 							"examinState":"2",// -- 检查情况(0、表扬  1、待整改   2、已整改) --反的是数字
	// 							"examinStateDesc": "待整改"
	// 						},
	// 					]
	// 				},
	// 			]
	// 		},
	// 		{
	// 			"yardId":"66", //--本院以及分院的id
	// 			"yardName":"济南分院", //--本院以及分院的名字
	// 			"praise":"2", //-- 表扬数量
	// 			"wRectification":"2", //-- 待整改数量
	// 			"dept":[
	// 				{
	// 					"deptId":"11" ,//--部门id
	// 					"assetsId" : '1',
	// 					"deptName":"人力资源", //--部门名称
	// 					"praise":"1", //--表扬数量
	// 					"wRectification":"1", //--待整改数量
	// 					"informReform":"0", //(0、待通知   1、已通知) --是否发起通知，反的是数字.
	// 					"staff":[
	// 						{
	// 							"staffId":"1",//--员工Id
	// 							"assetsId" : '1',
	// 							"staffName":"章叁", //--员工名称
	// 							"assetsName":"A1-001",// --资产名字
	// 							"assetsArea":"办公室",// --资产所属区域
	// 							"examinState":"0",// -- 检查情况(0、表扬  1、待整改   2、已整改) --反的是数字
	// 							"examinStateDesc": "表扬"
	// 						},
	// 						{
	// 							"staffId":"2",//--员工Id
	// 							"assetsId" : '1',
	// 							"staffName":"李四", //--员工名称
	// 							"assetsName":"A1-001",// --资产名字
	// 							"assetsArea":"办公室",// --资产所属区域
	// 							"examinState":"1",// -- 检查情况(0、表扬  1、待整改   2、已整改) --反的是数字
	// 							"examinStateDesc": "待整改"
	// 						},
	// 						{
	// 							"staffId":"3",//--员工Id
	// 							"assetsId" : '1',
	// 							"staffName":"王五", //--员工名称
	// 							"assetsName":"A1-0012",// --资产名字
	// 							"assetsArea":"办公室",// --资产所属区域
	// 							"examinState":"2",// -- 检查情况(0、表扬  1、待整改   2、已整改) --反的是数字
	// 							"examinStateDesc": "待整改"
	// 						},
	// 					]
	// 				},
	// 				{
	// 					"deptId":"22" ,//--部门id
	// 					"assetsId" : '1',
	// 					"deptName":"财务部", //--部门名称
	// 					"praise":"2", //--表扬数量
	// 					"wRectification":"1", //--待整改数量
	// 					"informReform":"1", //(0、待通知   1、已通知) --是否发起通知，反的是数字.
	// 					"staff":[
	// 						{
	// 							"staffId":"1",//--员工Id
	// 							"assetsId" : '1',
	// 							"staffName":"章叁", //--员工名称
	// 							"assetsName":"A1-001",// --资产名字
	// 							"assetsArea":"办公室",// --资产所属区域
	// 							"examinState":"0",// -- 检查情况(0、表扬  1、待整改   2、已整改) --反的是数字
	// 							"examinStateDesc": "表扬"
	// 						},
	// 						{
	// 							"staffId":"2",//--员工Id
	// 							"assetsId" : '1',
	// 							"staffName":"李四", //--员工名称
	// 							"assetsName":"A1-001",// --资产名字
	// 							"assetsArea":"办公室",// --资产所属区域
	// 							"examinState":"1",// -- 检查情况(0、表扬  1、待整改   2、已整改) --反的是数字
	// 							"examinStateDesc": "待整改"
	// 						},
	// 						{
	// 							"staffId":"3",//--员工Id
	// 							"assetsId" : '1',
	// 							"staffName":"王五", //--员工名称
	// 							"assetsName":"A1-0012",// --资产名字
	// 							"assetsArea":"办公室",// --资产所属区域
	// 							"examinState":"2",// -- 检查情况(0、表扬  1、待整改   2、已整改) --反的是数字
	// 							"examinStateDesc": "待整改"
	// 						},
	// 					]
	// 				},
	// 			]
	// 		},
	// 	]
	// }
}
//点击弹出的详情tab
export function queryItem(param) {
	return request('/microservice/securityinspect/queryItem',{...param, userid});
	return {
		"retVal": "1",
		"retCode": "1",
		"dataRows": [
			{
				"itemId":"11",      // -- 详情id
				 "instId":"111",     // -- 流程id，用于标注该人的检查流程。也可以看作唯一标记键
				"taskId":"22",      // —— 所属任务id
				"taskType":"安委办检查",    // -- 所属任务类型
				"userId":"11122",	  // -- 整改人
				"userName":"李四",  	//--整改人名称
				"ouId":"wwq",			//--整改人所属ou
				"deptId":"asdasd",			//--整改人所属部门
				"deptName":"财务部",			//--整改人所属部门名称
				"assetsId":"2432",			//--资产id
				"assetsName":"A2-002",			//--资产名称
				"assetsArea":"办公室",			//--资产所属区域
				"examineTime":"2020-05-05",			//--检查时间
				"problemLevel":"severe",			//--问题等级问题等级 严重（severe）、差（poor）、一般（average）、轻微（mild）、好（good），良好（well），非常好（perfect）
				"reformOpinion":"事故陷于隐患，请及时整改！" ,		//-- 整改意见 情况详情
				"img": [
					{
						'AbsolutePath': '10.245.47.2/filemanage/upload/writeFileUpdate/10010/2020/4/26/0893287/d42be66bb3a34abbaa2616b493955977/窦阳春_天梯初级证书.png',
						'ExternalAbsolutePath': '10.0.47.2/filemanage/upload/writeFileUpdate/10010/2020/4/26/0893287/d42be66bb3a34abbaa2616b493955977/窦阳春_天梯初级证书.png',
						'FileId': '39e0b3fdecb84c5d9bcc7baeb28052c1',
						'OriginalFileName': '窦阳春_天梯初级证书.png',
						'RealFileName': '窦阳春_天梯初级证书.png',
						'RelativePath': '/filemanage/upload/writeFileUpdate/10010/2020/4/26/0893287/d42be66bb3a34abbaa2616b493955977/窦阳春_天梯初级证书.png'
					},
					{
						'AbsolutePath': '10.245.47.2/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/2168a52fffaf41f8ae2758fca8a3df41/窦阳春_天梯初级证书 (1).png',
						'ExternalAbsolutePath': '10.0.47.2/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/39929a9d04504ef1b1a23bbad999cf2f/窦阳春_天梯初级证书.png',
						'FileId': 'c406175c2c8d40279063dcb2924a6d3c',
						'OriginalFileName': '窦阳春_天梯初级证书.png',
						'RealFileName': '窦阳春_天梯初级证书.png',
						'RelativePath': '/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/39929a9d04504ef1b1a23bbad999cf2f/窦阳春_天梯初级证书.png'
					},
					{
						'AbsolutePath': '10.245.47.2/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/f9eb4fcd4dba4d7ca8e6d4ad26c6b38f/窦阳春_能力开放体系初级证书.png',
						'ExternalAbsolutePath': '10.0.47.2/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/f9eb4fcd4dba4d7ca8e6d4ad26c6b38f/窦阳春_能力开放体系初级证书.png',
						'FileId': '"10ede805b3554f8f97a597191cfd589a"',
						'OriginalFileName': '窦阳春_能力开放体系初级证书.png',
						'RealFileName': '窦阳春_能力开放体系初级证书.png',
						'RelativePath': '/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/f9eb4fcd4dba4d7ca8e6d4ad26c6b38f/窦阳春_能力开放体系初级证书.png'
					},
					{
						'AbsolutePath': '10.245.47.2/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/aa017e6b13be4908ad93e761f0f9a9b8/窦阳春_天宫初级证书.png',
						'ExternalAbsolutePath': '10.0.47.2/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/aa017e6b13be4908ad93e761f0f9a9b8/窦阳春_天宫初级证书.png',
						'FileId': '300a93a40d524e80b70a6d4948446f05',
						'OriginalFileName': '窦阳春_天宫初级证书.png',
						'RealFileName': '窦阳春_天宫初级证书.png',
						'RelativePath': '/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/aa017e6b13be4908ad93e761f0f9a9b8/窦阳春_天宫初级证书.png'
					},
					{
						'AbsolutePath': '10.245.47.2/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/ad38d905b4684bdd8b7e7292c49db2f8/位置.svg',
						'ExternalAbsolutePath': '10.0.47.2/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/ad38d905b4684bdd8b7e7292c49db2f8/位置.svg',
						'FileId': 'ba29eb229f974950afaa1da1f9366280',
						'OriginalFileName': '位置.svg',
						'RealFileName': '位置.svg',
						'RelativePath': '/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/ad38d905b4684bdd8b7e7292c49db2f8/位置.svg'
					},
				] //--检查规范
			}
		]
	}
}
//服务11 通知整改（王培忠）
export function addNoticeRectification(param) {
	return request('/microservice/securityinspect/addNoticeRectification',{...param, userid});
	return {
		'retCode':"1",     
		"retVal":"...",
	}
}
//服务10 查询检查详情（王培忠） 检查结果统计
export function queryInspectDetail(param) {
	return request('/microservice/securityinspect/queryInspectDetail',{...param, userid});
	return {
			"retCode":"1",
			"retVal":"...",
			"dataRows":[
				{
					"ourHospital":{
						// "xAxis":[
						// 	{
						// 		"type":"category",
						// 		"data":["公共平台架构部","财务部", "人力资源部", "政委"]	//--返回的是院里的部门
						// 	}
						// ],
						// "yAxis":[
						// 	{"type":"value"}
						// ],
						// "series":[
						// 	{
						// 		"name":"合格",
						// 		"type":"bar",
						// 		"data":[5,8,6,9] //返回的是每个部门的合格人数
						// 	},
						// 	{
						// 		"name":"不合格",
						// 		"type":"bar",
						// 		"data":[1,6,6,8] //返回的是每个部门的不合格人数
						// 	}
						// ]
						xAxis: {
							type: 'category',
							data: ['轻微', '一般', '差', '严重', '好', '很好', '非常好']
							},
							yAxis: {
									type: 'value'
							},
							series: [{
									data: [2, 4, 2, 6, 7, 3, 1],
									type: 'bar'
							}]
							},
					"ou":{
						"xAxis":[
							{
								"type":"category",
								"data":["哈尔滨软件研究院","济南软件研究院", "广州软件研究院", "西安软件研究院", "南京软件研究院"]	//--返回的是分院的名字
							}
						],
						"yAxis":[
							{"type":"value"}
						],
						"series":[
							{
								"name":"合格",
								"type":"bar",
								"data":[5,8,6,9,4] //返回的是每个分院的合格人数
							},
							{
								"name":"不合格",
								"type":"bar",
								"data":[3,4,6,4,4] //返回的是每个分院的不合格人数
							}
						]
					}
				}
			]
		}
	}

//服务12：修改任务结果的接口
export function updateResult(param) {
	return request('/microservice/securityinspect/updateResult',{...param, userid});
	return {
		'retCode':"1",     
		"retVal":"...",
	}
}
//服务14：送安委办领导接口（包含送安委办领导（安委办主办）、送安委办（分院办公室安全接口人）、上报（部门安全员））
export function notification(param) {
	return request('/microservice/securityinspect/notification',{...param, userid}); 
	return {
		'retCode':"1",     
		"retVal":"...",
	}
}
//服务9 查询本院以及分院多级表格之员工（王培忠）
export function queryStaffByDept(param) {
	return request('/microservice/securityinspect/queryStaffByDept',{...param, userid}); 
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
//查任务结果(魏永杰) 
export function queryCheckSub(param) {
	return request('/microservice/securityinspect/queryCheckSub',{...param, userid}); 
	return {
    "retCode": "1",
    "retVal": "1",
    "dataRows": [
        {
            "id": "1",
            "taskId": "ahdiuashdiahsdinsabsadljabsbjkas",
            "result": "result",
            "result2": "一共有3个不合格，5条值得表扬", //结果
            "imgs": [
							{
								'AbsolutePath': '10.245.47.2/filemanage/upload/writeFileUpdate/10010/2020/4/26/0893287/d42be66bb3a34abbaa2616b493955977/窦阳春_天梯初级证书.png',
								'ExternalAbsolutePath': '10.0.47.2/filemanage/upload/writeFileUpdate/10010/2020/4/26/0893287/d42be66bb3a34abbaa2616b493955977/窦阳春_天梯初级证书.png',
								'FileId': '39e0b3fdecb84c5d9bcc7baeb28052c1',
								'OriginalFileName': '窦阳春_天梯初级证书.png',
								'RealFileName': '窦阳春_天梯初级证书.png',
								'RelativePath': '/filemanage/upload/writeFileUpdate/10010/2020/4/26/0893287/d42be66bb3a34abbaa2616b493955977/窦阳春_天梯初级证书.png'
							},
							{
								'AbsolutePath': '10.245.47.2/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/2168a52fffaf41f8ae2758fca8a3df41/窦阳春_天梯初级证书 (1).png',
								'ExternalAbsolutePath': '10.0.47.2/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/39929a9d04504ef1b1a23bbad999cf2f/窦阳春_天梯初级证书.png',
								'FileId': 'c406175c2c8d40279063dcb2924a6d3c',
								'OriginalFileName': '窦阳春_天梯初级证书.png',
								'RealFileName': '窦阳春_天梯初级证书.png',
								'RelativePath': '/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/39929a9d04504ef1b1a23bbad999cf2f/窦阳春_天梯初级证书.png'
							},
							{
								'AbsolutePath': '10.245.47.2/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/f9eb4fcd4dba4d7ca8e6d4ad26c6b38f/窦阳春_能力开放体系初级证书.png',
								'ExternalAbsolutePath': '10.0.47.2/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/f9eb4fcd4dba4d7ca8e6d4ad26c6b38f/窦阳春_能力开放体系初级证书.png',
								'FileId': '"10ede805b3554f8f97a597191cfd589a"',
								'OriginalFileName': '窦阳春_能力开放体系初级证书.png',
								'RealFileName': '窦阳春_能力开放体系初级证书.png',
								'RelativePath': '/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/f9eb4fcd4dba4d7ca8e6d4ad26c6b38f/窦阳春_能力开放体系初级证书.png'
							},
							{
								'AbsolutePath': '10.245.47.2/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/aa017e6b13be4908ad93e761f0f9a9b8/窦阳春_天宫初级证书.png',
								'ExternalAbsolutePath': '10.0.47.2/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/aa017e6b13be4908ad93e761f0f9a9b8/窦阳春_天宫初级证书.png',
								'FileId': '300a93a40d524e80b70a6d4948446f05',
								'OriginalFileName': '窦阳春_天宫初级证书.png',
								'RealFileName': '窦阳春_天宫初级证书.png',
								'RelativePath': '/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/aa017e6b13be4908ad93e761f0f9a9b8/窦阳春_天宫初级证书.png'
							},
							{
								'AbsolutePath': '10.245.47.2/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/ad38d905b4684bdd8b7e7292c49db2f8/位置.svg',
								'ExternalAbsolutePath': '10.0.47.2/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/ad38d905b4684bdd8b7e7292c49db2f8/位置.svg',
								'FileId': 'ba29eb229f974950afaa1da1f9366280',
								'OriginalFileName': '位置.svg',
								'RealFileName': '位置.svg',
								'RelativePath': '/filemanage/upload/portalFileUpdate/10010/2020/5/11/0893287/ad38d905b4684bdd8b7e7292c49db2f8/位置.svg'
							},
							{
								'AbsolutePath': '',
								'ExternalAbsolutePath': '',
								'FileId': '',
								'OriginalFileName': '',
								'RealFileName': '',
								'RelativePath': ''
							},
							{
								'AbsolutePath': '',
								'ExternalAbsolutePath': '',
								'FileId': '',
								'OriginalFileName': '',
								'RealFileName': '',
								'RelativePath': ''
							},
							{
								'AbsolutePath': '',
								'ExternalAbsolutePath': '',
								'FileId': '',
								'OriginalFileName': '',
								'RealFileName': '',
								'RelativePath': ''
							},
						],//--检查规范,
            "createTime": "2020-04-21 15:02:18"
        }
		]
	}
}
//送安委办领导接口（包含送安委办领导（安委办主办）、送安委办（分院办公室安全接口人）、上报（部门安全员）
export function notiLead(param) {
	return request('/microservice/securityinspect/notiLead',{...param, userid}); 
	return {
    "retCode": "1",
    "retVal": "1",
	}
}
//服务11 查询 所有一级检查内容配置列表（苗健）
export function oneconfiglistquery(param) {
	return request('/microservice/securityinspect/oneconfiglistquery',{...param, userid}); 
	return {
		"retCode":"1" ,
		"retVal":"...",
		"dataRows":[
			{
				"id":"z1",      //-- 一级配置id
				"content":"安全责任履行",        //-- 一级配置内容
			},
			{
				"id":"z2",      //-- 一级配置id
				"content":"办公用电管理"        //-- 一级配置内容
			},
			{
				"id":"z3",      //-- 一级配置id
				"content":"办公区管理"        //-- 一级配置内容
			},
			{
				"id":"z4",      //-- 一级配置
				"content":"临时场地管理"        //-- 一级配置内容
			},
			{
				"id":"z5",      //-- 一级配置id
				"content":"公共区域管理"        //-- 一级配置内容
			},
			{
				"id":"z6",      //-- 一级配置id
				"content":"档案库房管理"        //-- 一级配置内容
			}
		],
		"rowCount":"20", //总行数
		"pageCount":"3" //总页数
	}
}
//服务11 查询 所有二级检查内容配置列表（苗健）
export function twoconfiglistquery(param) {
	return request('/microservice/securityinspect/twoconfiglistquery',{...param, userid}); 
	return {
		"retCode":"1" ,
		"retVal":"...",
		"dataRows":[
			{
				"id":"z11",      //-- 一级配置id
				"content":"安全责任履行",        //-- 一级配置内容
			},
			{
				"id":"z21",      //-- 一级配置id
				"content":"办公用电管理"        //-- 一级配置内容
			},
			{
				"id":"z31",      //-- 一级配置id
				"content":"办公区管理"        //-- 一级配置内容
			},
			{
				"id":"z41",      //-- 一级配置
				"content":"临时场地管理"        //-- 一级配置内容
			},
			{
				"id":"z51",      //-- 一级配置id
				"content":"公共区域管理"        //-- 一级配置内容
			},
			{
				"id":"3w32111",      //-- 一级配置id
				"content":"档案库房管理"        //-- 一级配置内容
			}
		],
	}
}
//服务13 创建 内容配置的新增（苗健）
export function checkconfigadd(param) {
	return request('/microservice/securityinspect/checkconfigadd',{...param, userid}); 
	return {
    "retCode": "1",
    "retVal": "1",
    "dataRows":[
			{
				"id":"21" 				//--当前新增的配置id
			}
		]
	}
}
//服务13 修改 内容配置的修改（苗健）
export function checkconfigupdate(param) {
	return request('/microservice/securityinspect/checkconfigupdate',{...param, userid}); 
	return {
    "retCode": "1",
    "retVal": "1",
    "dataRows":[
			{
				"id":"21" 				//--当前新增的配置id
			}
		]
	}
}
//服务14 删除 内容配置的删除（苗健）
export function checkconfigdelete(param) {
	return request('/microservice/securityinspect/checkconfigdelete',{...param, userid}); 
	return {
    "retCode": "1",
    "retVal": "1",
	}
}
// 服务25：查询四纵五维中更新状态
export function queryUpdateState(param) {
	return request('/microservice/securityinspect/queryUpdateState',{...param, userid}); 
	return {
    "pageCurrent": 1,		//-- 当前页
    "retVal": 1,
    "retCode": 1,
    "rowCount": 10,			//-- 每页显示数量
    "allCount": 16,			//-- 总条数
    "pageCount": 1,			//-- 总页数
    "dataRows": [
        {
            "ruleId": "3ac4526ed92b4b7c873306547c16d3de",	//-- 规则id
            "siteId": "1",									//-- 所处位置编号
            "content": "测试修改",                           //-- 内容
            "createTime": "2020-05-12 15:05:47.0",			//-- 修改或创建时间
            "createUserId": "0563582",						//-- 创建者id
            "createUserName": "秦斌",						//-- 创建者姓名
            "createDeptId": "e65c07d7179e11e6880d008cfa0427c4",    //-- 创建者所处部门id
            "createDeptName": "联通软件研究院-办公室（党委办公室）",		//-- 创建者所处部门名称
            "createOuId": "e65c02c2179e11e6880d008cfa0427c4",		//-- 创建者所处院id
            "createOuName": "联通软件研究院本部",                //-- 创建者所处院名称
            "ruleState": "1"							//-- 规则当前状态 （不需要管）
        },
        {
            "ruleId": "3ac4526ed92b4b7c873306547c16d3de",	//-- 规则id
            "siteId": "1",									//-- 所处位置编号
            "content": "测试修改",                           //-- 内容
            "createTime": "2020-05-12 15:05:47.0",			//-- 修改或创建时间
            "createUserId": "0563582",						//-- 创建者id
            "createUserName": "张青",						//-- 创建者姓名
            "createDeptId": "e65c07d7179e11e6880d008cfa0427c4",    //-- 创建者所处部门id
            "createDeptName": "联通软件研究院-办公室（党委办公室）",		//-- 创建者所处部门名称
            "createOuId": "e65c02c2179e11e6880d008cfa0427c4",		//-- 创建者所处院id
            "createOuName": "联通软件研究院本部",                //-- 创建者所处院名称
            "ruleState": "1"							//-- 规则当前状态 （不需要管）
        },
        {
            "ruleId": "3ac4526ed92b4b7c873306547c16d3de",	//-- 规则id
            "siteId": "1",									//-- 所处位置编号
            "content": "测试修改",                           //-- 内容
            "createTime": "2020-05-12 15:05:47.0",			//-- 修改或创建时间
            "createUserId": "0563582",						//-- 创建者id
            "createUserName": "栗子",						//-- 创建者姓名
            "createDeptId": "e65c07d7179e11e6880d008cfa0427c4",    //-- 创建者所处部门id
            "createDeptName": "联通软件研究院-办公室（党委办公室）",		//-- 创建者所处部门名称
            "createOuId": "e65c02c2179e11e6880d008cfa0427c4",		//-- 创建者所处院id
            "createOuName": "联通软件研究院本部",                //-- 创建者所处院名称
            "ruleState": "1"							//-- 规则当前状态 （不需要管）
        },
    ]
	}
}
// 服务23：四纵五维查询
export function queryRule(param) {
	return request('/microservice/securityinspect/queryRule',{...param, userid}); 
	return {
    "retCode": "1",
    "retVal": "1",
    "dataRows":   [
        {
            "ruleId": "3ac4526ed92b4b7c873306547c16d3de",	//-- 规则id
            "siteId": "1",									//-- 所处位置编号
            "content": "1.《关于调整联通软件研究院安全生产管理委员会成员及安委办机构职责的通知》（软研院[2017]83号）<br/>2.《软件研究院安全生产监督管理实施办法（一级制度）》（软研院【2019】69号）<br/>",                           //-- 内容
            "createTime": "2020-05-12 15:05:47.0",			//-- 修改或创建时间
            "createUserId": "0563582",						//-- 创建者id
            "createUserName": "秦斌",						//-- 创建者姓名
            "createDeptId": "e65c07d7179e11e6880d008cfa0427c4",    //-- 创建者所处部门id
            "createDeptName": "联通软件研究院-办公室（党委办公室）",		//-- 创建者所处部门名称
            "createOuId": "e65c02c2179e11e6880d008cfa0427c4",		//-- 创建者所处院id
            "createOuName": "联通软件研究院本部",                //-- 创建者所处院名称
            "ruleState": "1"							//-- 规则当前状态 （不需要管）
        },
        {
            "ruleId": "3ac4526ed92b4b7c873306547c16d3de",	//-- 规则id
            "siteId": "2",									//-- 所处位置编号
            "content": "测试修改",                           //-- 内容
            "createTime": "2020-05-12 15:05:47.0",			//-- 修改或创建时间
            "createUserId": "0563582",						//-- 创建者id
            "createUserName": "秦斌",						//-- 创建者姓名
            "createDeptId": "e65c07d7179e11e6880d008cfa0427c4",    //-- 创建者所处部门id
            "createDeptName": "▲安委办人员构成：主  任：分管办公室的院党委成员（副院长）副主任：本部办公室、人力资源部、党群部负责人和软研院安全总监 成  员：本部各部门、中心安全员和各分院办公室负责人",		//-- 创建者所处部门名称
            "createOuId": "e65c02c2179e11e6880d008cfa0427c4",		//-- 创建者所处院id
            "createOuName": "联通软件研究院本部",                //-- 创建者所处院名称
            "ruleState": "1"							//-- 规则当前状态 （不需要管）
        },
        {
            "ruleId": "3ac4526ed92b4b7c873306547c16d3de",	//-- 规则id
            "siteId": "3",									//-- 所处位置编号
            "content": "▲生产运营安全支撑系统：<br/>1.天眼平台<br/>2.任务调度平台<br/>3.生产变更流程<br/><br/>▲信息网络安全支撑系统：<br/>1.安全管理平台（somc）<br/>2.安全管理平台ITSM系统<br/>3.软研院核心业务动态防护系统<br/>4.软研院水滴运维管理平台<br/><br/>▲综合安全支撑系统：<br/>安全检查“PC+钉钉端”系统<br/>",                         //-- 内容
            "createTime": "2020-05-12 15:05:47.0",			//-- 修改或创建时间
            "createUserId": "0563582",						//-- 创建者id
            "createUserName": "秦斌",						//-- 创建者姓名
            "createDeptId": "e65c07d7179e11e6880d008cfa0427c4",    //-- 创建者所处部门id
            "createDeptName": "▲安委办人员构成：主  任：分管办公室的院党委成员（副院长）副主任：本部办公室、人力资源部、党群部负责人和软研院安全总监 成  员：本部各部门、中心安全员和各分院办公室负责人",		//-- 创建者所处部门名称
            "createOuId": "e65c02c2179e11e6880d008cfa0427c4",		//-- 创建者所处院id
            "createOuName": "联通软件研究院本部",                //-- 创建者所处院名称
            "ruleState": "1"							//-- 规则当前状态 （不需要管）
        },
        {
            "ruleId": "3ac4526ed92b4b7c873306547c16d3de",	//-- 规则id
            "siteId": "4",									//-- 所处位置编号
            "content": "1.《大BSS生产运营规范规程》<br/>2.《软研院网络与信息安全事件应急处置预案》（总则）<br/>",                         //-- 内容
            "createTime": "2020-05-12 15:05:47.0",			//-- 修改或创建时间
            "createUserId": "0563582",						//-- 创建者id
            "createUserName": "秦斌",						//-- 创建者姓名
            "createDeptId": "e65c07d7179e11e6880d008cfa0427c4",    //-- 创建者所处部门id
            "createDeptName": "▲安委办人员构成：主  任：分管办公室的院党委成员（副院长）副主任：本部办公室、人力资源部、党群部负责人和软研院安全总监 成  员：本部各部门、中心安全员和各分院办公室负责人",		//-- 创建者所处部门名称
            "createOuId": "e65c02c2179e11e6880d008cfa0427c4",		//-- 创建者所处院id
            "createOuName": "联通软件研究院本部",                //-- 创建者所处院名称
            "ruleState": "1"							//-- 规则当前状态 （不需要管）
        },
        {
            "ruleId": "3ac4526ed92b4b7c873306547c16d3de",	//-- 规则id
            "siteId": "5",									//-- 所处位置编号
            "content": "▲生产运营安全风控点清单（部分，可更新）：<br/>1.监控告警存在疏漏<br/>2.运营维护基础管理待优化完善，强化落实执行<br/>3.应急能力不足，发生故障后，用户影响降低慢<br/>4.人员能力不足或安全意识不够，导致操作配置错误，引起不必要损失<br/>5.非运维团队人员拥有主机、数据库操作权限的从账号，导致生产环境变更不可控。<br/>5.监控告警纳入<br/><br/>▲信息网络安全风控点清单（部分，可更新）：<br/>1.办公终端中毒、弱口令<br/>2.系统名称不统一<br/>3.vpn、4A账号权限过大<br/>4.公网系统、重点系统漏洞<br/>5.系统备案信息不全、更新不及时<br/>6.公网系统、重点系统漏洞<br/>7.设备保障<br/><br/>▲综合安全风控点清单（部分，可更新）：<br/>1.办公用电安全隐患<br/>2.办公设备设施安全隐患&nbsp;<br/>3.安全防火安全隐患<br/>4.安全防盗隐患<br/>5.安全防丢失隐患<br/>",                         //-- 内容
            "createTime": "2020-05-12 15:05:47.0",			//-- 修改或创建时间
            "createUserId": "0563582",						//-- 创建者id
            "createUserName": "秦斌",						//-- 创建者姓名
            "createDeptId": "e65c07d7179e11e6880d008cfa0427c4",    //-- 创建者所处部门id
            "createDeptName": "",		//-- 创建者所处部门名称
            "createOuId": "e65c02c2179e11e6880d008cfa0427c4",		//-- 创建者所处院id
            "createOuName": "联通软件研究院本部",                //-- 创建者所处院名称
            "ruleState": "1"							//-- 规则当前状态 （不需要管）
        },
        {
            "ruleId": "3ac4526ed92b4b7c873306547c16d3de",	//-- 规则id
            "siteId": "6",									//-- 所处位置编号
            "content": "▲生产运营安全制度规定：<br/>《大BSS生产运营规范》<br/>▲信息网络安全制度规定：<br/>1.《软研院系统安全问题问责办法》<br/>2.《软研院网络与信息安全管理办法》<br/>▲综合安全制度规定：<br/>1.《软研院安全生产管理规定（试行）》（软研院[2016]48号）<br/>2.《软件研究院综合安全管理工作实施细则（二级制度）》（软研院【2020】11号）<br/>",                         //-- 内容
            "createTime": "2020-05-12 15:05:47.0",			//-- 修改或创建时间
            "createUserId": "0563582",						//-- 创建者id
            "createUserName": "秦斌",						//-- 创建者姓名
            "createDeptId": "e65c07d7179e11e6880d008cfa0427c4",    //-- 创建者所处部门id
            "createDeptName": "▲生产运营安全制度规定：<br/>《大BSS生产运营规范》<br/>▲信息网络安全制度规定：<br/>1.《软研院系统安全问题问责办法》<br/>2.《软研院网络与信息安全管理办法》<br/>▲综合安全制度规定：<br/>1.《软研院安全生产管理规定（试行）》（软研院[2016]48号）<br/>2.《软件研究院综合安全管理工作实施细则（二级制度）》（软研院【2020】11号）<br/>",		//-- 创建者所处部门名称
            "createOuId": "e65c02c2179e11e6880d008cfa0427c4",		//-- 创建者所处院id
            "createOuName": "联通软件研究院本部",                //-- 创建者所处院名称
            "ruleState": "1"							//-- 规则当前状态 （不需要管）
        },
        {
            "ruleId": "3ac4526ed92b4b7c873306547c16d3de",	//-- 规则id
            "siteId": "7",									//-- 所处位置编号
            "content": "▲安委办下设三个安全组：<br/>生产运营安全组：<br/>组长：运营保障与调度中心负责人<br/>副组长：五部三中心负责人和各分院分管副院长<br/>成员：各生产单元负责人和部门安全员<br/>信息网络安全组：<br/>组长：共享资源中心负责人<br/>副组长：五部三中心负责人和各分院分管副院长<br/>成员：信息安全组成员、安全员和各系统负责人<br/>综合安全安全组：<br/>组长：办公室负责人<br/>副组长：本部人力资源部及各分院办公室负责人<br/>成员：本部及各分院各对口部门安全员<br/>",                         //-- 内容
            "createTime": "2020-05-12 15:05:47.0",			//-- 修改或创建时间
            "createUserId": "0563582",						//-- 创建者id
            "createUserName": "秦斌",						//-- 创建者姓名
            "createDeptId": "e65c07d7179e11e6880d008cfa0427c4",    //-- 创建者所处部门id
            "createDeptName": "▲安委办人员构成：主  任：分管办公室的院党委成员（副院长）副主任：本部办公室、人力资源部、党群部负责人和软研院安全总监 成  员：本部各部门、中心安全员和各分院办公室负责人",		//-- 创建者所处部门名称
            "createOuId": "e65c02c2179e11e6880d008cfa0427c4",		//-- 创建者所处院id
            "createOuName": "联通软件研究院本部",                //-- 创建者所处院名称
            "ruleState": "1"							//-- 规则当前状态 （不需要管）
        },
        {
            "ruleId": "3ac4526ed92b4b7c873306547c16d3de",	//-- 规则id
            "siteId": "8",									//-- 所处位置编号
            "content": "▲生产运营安全应急预案：<br/>&nbsp;大bss系统生产运营23种场景应急预案<br/>▲信息网络安全应急预案：<br/>1.《拒绝服务攻击应急预案》<br/>2.《恶意代码应急预案》<br/>3.《漏洞攻击应急预案》<br/>4.《网络钓鱼事件应急预案》<br/>5.《网络窃听扫描应急预案》<br/>6.《信息泄漏应急预案》<br/>▲综合安全应急预案：<br/>《软件研究院综合安全突发情况应急处置管理总体预案》（软研院【2020】12号）<br/>",                         //-- 内容
            "createTime": "2020-05-12 15:05:47.0",			//-- 修改或创建时间
            "createUserId": "0563582",						//-- 创建者id
            "createUserName": "秦斌",						//-- 创建者姓名
            "createDeptId": "e65c07d7179e11e6880d008cfa0427c4",    //-- 创建者所处部门id
            "createDeptName": "▲安委办人员构成：主  任：分管办公室的院党委成员（副院长）副主任：本部办公室、人力资源部、党群部负责人和软研院安全总监 成  员：本部各部门、中心安全员和各分院办公室负责人",		//-- 创建者所处部门名称
            "createOuId": "e65c02c2179e11e6880d008cfa0427c4",		//-- 创建者所处院id
            "createOuName": "联通软件研究院本部",                //-- 创建者所处院名称
            "ruleState": "1"							//-- 规则当前状态 （不需要管）
        },
        {
            "ruleId": "3ac4526ed92b4b7c873306547c16d3de",	//-- 规则id
            "siteId": "9",									//-- 所处位置编号
            "content": "各单位结合实际制定相应操作可作的制度规定（办法）",                         //-- 内容
            "createTime": "2020-05-12 15:05:47.0",			//-- 修改或创建时间
            "createUserId": "0563582",						//-- 创建者id
            "createUserName": "秦斌",						//-- 创建者姓名
            "createDeptId": "e65c07d7179e11e6880d008cfa0427c4",    //-- 创建者所处部门id
            "createDeptName": "▲安委办人员构成：主  任：分管办公室的院党委成员（副院长）副主任：本部办公室、人力资源部、党群部负责人和软研院安全总监 成  员：本部各部门、中心安全员和各分院办公室负责人",		//-- 创建者所处部门名称
            "createOuId": "e65c02c2179e11e6880d008cfa0427c4",		//-- 创建者所处院id
            "createOuName": "联通软件研究院本部",                //-- 创建者所处院名称
            "ruleState": "1"							//-- 规则当前状态 （不需要管）
        },
        {
            "ruleId": "3ac4526ed92b4b7c873306547c16d3de",	//-- 规则id
            "siteId": "10",									//-- 所处位置编号
            "content": "各单位结合工作业务，内部明确相应安全负责人、项目班组安全员",                         //-- 内容
            "createTime": "2020-05-12 15:05:47.0",			//-- 修改或创建时间
            "createUserId": "0563582",						//-- 创建者id
            "createUserName": "秦斌",						//-- 创建者姓名
            "createDeptId": "e65c07d7179e11e6880d008cfa0427c4",    //-- 创建者所处部门id
            "createDeptName": "▲安委办人员构成：主  任：分管办公室的院党委成员（副院长）副主任：本部办公室、人力资源部、党群部负责人和软研院安全总监 成  员：本部各部门、中心安全员和各分院办公室负责人",		//-- 创建者所处部门名称
            "createOuId": "e65c02c2179e11e6880d008cfa0427c4",		//-- 创建者所处院id
            "createOuName": "联通软件研究院本部",                //-- 创建者所处院名称
            "ruleState": "1"							//-- 规则当前状态 （不需要管）
        },
        {
            "ruleId": "3ac4526ed92b4b7c873306547c16d3de",	//-- 规则id
            "siteId": "11",									//-- 所处位置编号
            "content": "各单位充分利用已具备的相应安全支撑系统或工具并落地执行",                         //-- 内容
            "createTime": "2020-05-12 15:05:47.0",			//-- 修改或创建时间
            "createUserId": "0563582",						//-- 创建者id
            "createUserName": "秦斌",						//-- 创建者姓名
            "createDeptId": "e65c07d7179e11e6880d008cfa0427c4",    //-- 创建者所处部门id
            "createDeptName": "▲安委办人员构成：主  任：分管办公室的院党委成员（副院长）副主任：本部办公室、人力资源部、党群部负责人和软研院安全总监 成  员：本部各部门、中心安全员和各分院办公室负责人",		//-- 创建者所处部门名称
            "createOuId": "e65c02c2179e11e6880d008cfa0427c4",		//-- 创建者所处院id
            "createOuName": "联通软件研究院本部",                //-- 创建者所处院名称
            "ruleState": "1"							//-- 规则当前状态 （不需要管）
        },
        {
            "ruleId": "3ac4526ed92b4b7c873306547c16d3de",	//-- 规则id
            "siteId": "12",									//-- 所处位置编号
            "content": "各单位结合工作实际制定完善并落实应急预案",                         //-- 内容
            "createTime": "2020-05-12 15:05:47.0",			//-- 修改或创建时间
            "createUserId": "0563582",						//-- 创建者id
            "createUserName": "秦斌",						//-- 创建者姓名
            "createDeptId": "e65c07d7179e11e6880d008cfa0427c4",    //-- 创建者所处部门id
            "createDeptName": "▲安委办人员构成：主  任：分管办公室的院党委成员（副院长）副主任：本部办公室、人力资源部、党群部负责人和软研院安全总监 成  员：本部各部门、中心安全员和各分院办公室负责人",		//-- 创建者所处部门名称
            "createOuId": "e65c02c2179e11e6880d008cfa0427c4",		//-- 创建者所处院id
            "createOuName": "联通软件研究院本部",                //-- 创建者所处院名称
            "ruleState": "1"							//-- 规则当前状态 （不需要管）
        },
        {
            "ruleId": "3ac4526ed92b4b7c873306547c16d3de",	//-- 规则id
            "siteId": "13",									//-- 所处位置编号
            "content": "实时梳理安全隐患风控清单，并及时更新和固化",                         //-- 内容
            "createTime": "2020-05-12 15:05:47.0",			//-- 修改或创建时间
            "createUserId": "0563582",						//-- 创建者id
            "createUserName": "秦斌",						//-- 创建者姓名
            "createDeptId": "e65c07d7179e11e6880d008cfa0427c4",    //-- 创建者所处部门id
            "createDeptName": "▲安委办人员构成：主  任：分管办公室的院党委成员（副院长）副主任：本部办公室、人力资源部、党群部负责人和软研院安全总监 成  员：本部各部门、中心安全员和各分院办公室负责人",		//-- 创建者所处部门名称
            "createOuId": "e65c02c2179e11e6880d008cfa0427c4",		//-- 创建者所处院id
            "createOuName": "联通软件研究院本部",                //-- 创建者所处院名称
            "ruleState": "1"							//-- 规则当前状态 （不需要管）
        },
        {
            "ruleId": "3ac4526ed92b4b7c873306547c16d3de",	//-- 规则id
            "siteId": "14",									//-- 所处位置编号
            "content": "各项目组结合实际制定相应操作可作的细化制度规定（办法），与各第三方协作单位签订安全协议书",                         //-- 内容
            "createTime": "2020-05-12 15:05:47.0",			//-- 修改或创建时间
            "createUserId": "0563582",						//-- 创建者id
            "createUserName": "秦斌",						//-- 创建者姓名
            "createDeptId": "e65c07d7179e11e6880d008cfa0427c4",    //-- 创建者所处部门id
            "createDeptName": "▲安委办人员构成：主  任：分管办公室的院党委成员（副院长）副主任：本部办公室、人力资源部、党群部负责人和软研院安全总监 成  员：本部各部门、中心安全员和各分院办公室负责人",		//-- 创建者所处部门名称
            "createOuId": "e65c02c2179e11e6880d008cfa0427c4",		//-- 创建者所处院id
            "createOuName": "联通软件研究院本部",                //-- 创建者所处院名称
            "ruleState": "1"							//-- 规则当前状态 （不需要管）
        },
        {
            "ruleId": "3ac4526ed92b4b7c873306547c16d3de",	//-- 规则id
            "siteId": "15",									//-- 所处位置编号
            "content": "各项目组结合工作业务，内部和第三方协作单位均明确相应安全负责人、项目班组及重点接口人和岗位区域安全员",                         //-- 内容
            "createTime": "2020-05-12 15:05:47.0",			//-- 修改或创建时间
            "createUserId": "0563582",						//-- 创建者id
            "createUserName": "秦斌",						//-- 创建者姓名
            "createDeptId": "e65c07d7179e11e6880d008cfa0427c4",    //-- 创建者所处部门id
            "createDeptName": "▲安委办人员构成：主  任：分管办公室的院党委成员（副院长）副主任：本部办公室、人力资源部、党群部负责人和软研院安全总监 成  员：本部各部门、中心安全员和各分院办公室负责人",		//-- 创建者所处部门名称
            "createOuId": "e65c02c2179e11e6880d008cfa0427c4",		//-- 创建者所处院id
            "createOuName": "联通软件研究院本部",                //-- 创建者所处院名称
            "ruleState": "1"							//-- 规则当前状态 （不需要管）
        },
        {
            "ruleId": "3ac4526ed92b4b7c873306547c16d3de",	//-- 规则id
            "siteId": "16",									//-- 所处位置编号
            "content": "各项目组充分利用部门已具备的相应安全支撑系统或工具并落地执行",                         //-- 内容
            "createTime": "2020-05-12 15:05:47.0",			//-- 修改或创建时间
            "createUserId": "0563582",						//-- 创建者id
            "createUserName": "秦斌",						//-- 创建者姓名
            "createDeptId": "e65c07d7179e11e6880d008cfa0427c4",    //-- 创建者所处部门id
            "createDeptName": "▲安委办人员构成：主  任：分管办公室的院党委成员（副院长）副主任：本部办公室、人力资源部、党群部负责人和软研院安全总监 成  员：本部各部门、中心安全员和各分院办公室负责人",		//-- 创建者所处部门名称
            "createOuId": "e65c02c2179e11e6880d008cfa0427c4",		//-- 创建者所处院id
            "createOuName": "联通软件研究院本部",                //-- 创建者所处院名称
            "ruleState": "1"							//-- 规则当前状态 （不需要管）
        },
        {
            "ruleId": "3ac4526ed92b4b7c873306547c16d3de",	//-- 规则id
            "siteId": "17",									//-- 所处位置编号
            "content": "各项目组结合工作实际，除执行部门制定的应急预案外，做好本项目组的单元单项应急预案的落地实施，保证定人定岗，不留死角",                         //-- 内容
            "createTime": "2020-05-12 15:05:47.0",			//-- 修改或创建时间
            "createUserId": "0563582",						//-- 创建者id
            "createUserName": "秦斌",						//-- 创建者姓名
            "createDeptId": "e65c07d7179e11e6880d008cfa0427c4",    //-- 创建者所处部门id
            "createDeptName": "▲安委办人员构成：主  任：分管办公室的院党委成员（副院长）副主任：本部办公室、人力资源部、党群部负责人和软研院安全总监 成  员：本部各部门、中心安全员和各分院办公室负责人",		//-- 创建者所处部门名称
            "createOuId": "e65c02c2179e11e6880d008cfa0427c4",		//-- 创建者所处院id
            "createOuName": "联通软件研究院本部",                //-- 创建者所处院名称
            "ruleState": "1"							//-- 规则当前状态 （不需要管）
        },
        {
            "ruleId": "3ac4526ed92b4b7c873306547c16d3de",	//-- 规则id
            "siteId": "18",									//-- 所处位置编号
            "content": "实时梳理迭代安全隐患风控明细单，及时更新优化，保证项目组内各种安全隐患清",                         //-- 内容
            "createTime": "2020-05-12 15:05:47.0",			//-- 修改或创建时间
            "createUserId": "0563582",						//-- 创建者id
            "createUserName": "秦斌",						//-- 创建者姓名
            "createDeptId": "e65c07d7179e11e6880d008cfa0427c4",    //-- 创建者所处部门id
            "createDeptName": "▲安委办人员构成：主  任：分管办公室的院党委成员（副院长）副主任：本部办公室、人力资源部、党群部负责人和软研院安全总监 成  员：本部各部门、中心安全员和各分院办公室负责人",		//-- 创建者所处部门名称
            "createOuId": "e65c02c2179e11e6880d008cfa0427c4",		//-- 创建者所处院id
            "createOuName": "联通软件研究院本部",                //-- 创建者所处院名称
            "ruleState": "1"							//-- 规则当前状态 （不需要管）
        },
    ]
	}
}
//服务24：修改四纵五维单元格内容 
export function updateRule(param) {
	return request('/microservice/securityinspect/updateRule',{...param, userid}); 
	return {
    "retCode": "1",
    "retVal": "1",
	}
}
