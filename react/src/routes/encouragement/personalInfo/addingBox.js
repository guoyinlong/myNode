/**
 * 作者：罗玉棋
 * 日期：2019-09-20
 * 邮件：809590923@qq.com
 * 文件说明：个人信息修改页增加map
 */
const boxMap={

  "培训课程信息":[
    // {name: "员工编号",fieldKey: "staff_id",type: "I",edit: false,val: sys_userid},
    // {name: "姓名",fieldKey: "staff_name",type: "I",edit: false,val: fullName},
    { name: "年度", fieldKey: "year", type: "S", edit: true },
    { name: "课程类型", fieldKey: "course_type", type: "S", edit: true },
    {name: "参训/受训方式",fieldKey: "training_method",type: "S",edit: true},
    { name: "培训途径", fieldKey: "training_route", type: "S", edit: true },
    { name: "课程名", fieldKey: "course", type: "I", edit: true },
    { name: "课程课时数", fieldKey: "course_class", type: "I", edit: true },
    {name: "培训时间",fieldKey: "course_training_time",type: "D",edit: true}
  ],
    
   "资格证书信息":[
    // {name: "员工编号",fieldKey: "staff_id",type: "I",edit: false,val: sys_userid},
    // {name: "姓名",fieldKey: "staff_name",type: "I",edit: false,val: fullName},
    { name: "专业资格名称", fieldKey: "certificate_name", type: "I", edit: true },
    { name: "专业资格证书编号", fieldKey: "certificate_No", type: "I", edit: true },
    {name: "获得该职称时间",fieldKey: "certificate_date",type: "D",edit: true}
    ],

    "奖惩信息":[
      // {name: "员工编号",fieldKey: "staff_id",type: "I",edit: false,val: sys_userid},
      // {name: "姓名",fieldKey: "staff_name",type: "I",edit: false,val: fullName},
      { name: "时间", fieldKey: "datetime", type: "D", edit: true },
      { name: "奖惩级别", fieldKey: "reward_level", type: "S", edit: true },
      {name: "单位",fieldKey: "org_name",type: "I",edit: true},
      { title:"奖惩类别",name: "奖惩类别", fieldKey: "reward_category", type: "S", edit: true },
      { name: "具体内容", fieldKey: "reward_content", type: "I", edit: true },
      { title:"奖惩类型",name: "奖惩类型", fieldKey: "reward_type", type: "S", edit: true }
    ],

    "借调信息":[
      // {name: "员工编号",fieldKey: "staff_id",type: "I",edit: false,val: sys_userid},
      // {name: "姓名",fieldKey: "staff_name",type: "I",edit: false,val: fullName},
      { name: "借调开始日期", fieldKey: "secondment_start", type: "D", edit: true },
      { name: "借调结束日期", fieldKey: "secondment_end", type: "D", edit: true },
      {name: "借调单位",fieldKey: "secondment_company",type: "I",edit: true}
    ],

    "人才信息":[
      // {name: "员工编号",fieldKey: "staff_id",type: "I",edit: false,val: sys_userid},
      // {name: "姓名",fieldKey: "staff_name",type: "I",edit: false,val: fullName},
      { name: "人才标识", fieldKey: "talent_type", type: "S", edit: true },
      { name: "所属专业线", fieldKey: "profession_line", type: "I", edit: true },
      {name: "评选时间",fieldKey: "select_time",type: "D",edit: true}
    ],
    
    "职称信息":[
      // {name: "员工编号",fieldKey: "staff_id",type: "I",edit: false,val: sys_userid},
      // {name: "姓名",fieldKey: "staff_name",type: "I",edit: false,val: fullName},
      { name: "职称系列", fieldKey: "title_type", type: "S", edit: true },
      { name: "职称等级", fieldKey: "title_level", type: "S", edit: true },
      {name: "获得职称时间",fieldKey: "title_date",type: "D",edit: true}
    ]	

}

export default boxMap;
		
		