/**
 * 作者：罗玉棋
 * 创建日期：2019-9-11
 * 邮箱：809590923@qq.com
 * 文件说明:表格数据-修改对比map
 */
let bookObj = {
  年龄积点: "age_point",
  年度绩效工资: "annual_performance_pay",
  年度纳税: "annual_tax",
  基本积点: "basic_point",
  基本工资: "basic_wage",
  出身日期: "birthday",
  籍贯: "birth_place",
  获得该专业资格时间: "certificate_date",
  专业资格名称: "certificate_name",
  专业资格证书编号: "certificate_No",
  司龄积点: "company_age_point",
  加入企业年金时间: "company_annuity_join_day",
  综合补贴: "comprehensive_subsidy",
  内容: "content",
  合同关系: "contractual_type",
  合同编号: "contract_id",
  当前劳动合同签订时间: "contract_sign_date",
  "合同状态": "contract_state",
  合同期限: "contract_term",
  国籍: "country",
  课程名称: "course",
  课程课时数: "course_class",
  培训课时费用: "course_class_fees",
  培训开始时间: "course_training_time",
  "课程类型": "course_type",
  时间: "datetime",
  学位证书编号: "degree_certificate_No",
  毕业证书编号: "diploma_No",
  邮件: "email",
  入职渠道: "entry_way",
  外部授课总课时数: "external_teaching_hours",
  外部授课次数: "external_teaching_num",
  参加外部培训次数: "external_trained_num",
  性别: "gender",
  毕业日期: "graduated_date",
  毕业学校: "graduated_school",
  荣誉积点: "honor_point",
  荣誉奖励: "honor_reward",
  "住房公积金-企业": "housing_fund_company",
  "住房公积金-个人": "housing_fund_personal",
  身份证: "id_card",
  "工伤保险-企业": "injury_insurance_company",
  内部授课总课时数: "internal_teaching_hours",
  内部授课次数: "internal_teaching_num",
  参加内部培训次数: "internal_trained_num",
  "是否封顶": "is_stay",
  加入软研院时间: "join_ryy_day",
  加入联通时间: "join_unicom_day",
  参加工作时间: "join_work_day",
  亲属员工编号: "kinsfolk_id",
  亲属员工姓名: "kinsfolk_name",
  亲属员工联系方式: "kinsfolk_phone",
  "是否有亲属在联通系统内": "kinsfolk_relation",
  最高学位: "lastest_degree",
  最高学历: "lastest_education",
  学习形式: "learning_mode",
  离开软研院时间: "leave_ryy_day",
  专业: "major",
  婚姻状况: "marital_status",
  "生育保险-企业": "maternity_insurance_company",
  "医疗保险-企业": "medical_insurance_company",
  "医疗保险-个人": "medical_insurance_personal",
  月季度绩效工资: "monthly_performance_pay",
  民族: "nation",
  年度在岗月份数: "num_of_months_work",
  具体时间: "obtain_time",
  "企业年金补缴-企业": "occupational_pension_add_company",
  "企业年金补缴-个人": "occupational_pension_add_personal",
  "企业年金-企业": "occupational_pension_company",
  "企业年金-个人": "occupational_pension_personal",
  参加线下培训次数: "offline_trained_num",
  参加线上培训次数: "online_trained_num",
  组织结构ID: "org_id",
  组织机构名称: "org_name",
  其他积点: "other_point",
  其他奖励: "other_reward",
  党内职务: "party_post",
  入党时间: "party_time",
  薪档调整路径: "payroll_adjust_mode",
  薪档调整后结果: "payroll_adjust_result",
  薪档调整时间: "payroll_adjust_time",
  "养老保险-企业": "pension_company",
  "养老保险-个人": "pension_personal",
  电话号码: "phone_number",
  其他党派名称: "politics_name",
  政治面貌: "politics_status",
  入职前单位: "pre_company",
  公积金个人账号: "provident_fund_account",
  公积金联名卡号: "provident_fund_card",
  季度绩效工资: "quarterly_performance_pay",
  职级调整路径: "rank_adjust_mode",
  职级调整后结果: "rank_adjust_result",
  职级调整时间: "rank_adjust_time",
  职级积点: "rank_point",
  认可积点: "recognized_point",
  认可奖励: "recognized_reward",
  "认可类型":
    "recognized_type",
  档案所在地: "record_location",
  地域名称: "region_name",
  户籍所在地: "regist_location",
  户口类型: "regist_type",
  "薪档晋升积分剩余情况": "remain_points",
  实际参加必修课数量: "required_course_actual_num",
  应参加必修课数量: "required_course_plan_num",
  奖惩类别: "reward_category",
  奖惩内容: "reward_content",
  奖惩级别: "reward_level",
  "奖惩类型": "reward_type",
  借调公司: "secondment_company",
  借调结束日期: "secondment_end",
  借调开始日期: "secondment_start",
  实际参加选修课数量: "selected_course_actual_num",
  应参加选修课数量: "selected_course_plan_num",
  特需医疗基金: "special_medical_fund",
  专项奖励: "special_reward",
  用户姓名: "staff_name",
  员工状态: "staff_status",
  员工类型: "staff_type",
  " D/G档封顶年份": "stay_time",
  "补充医疗保险-子女": "supplementary_medical_insurance_child",
  "补充医疗保险-员工": "supplementary_medical_insurance_staff",
  获得该职称时间: "title_date",
  职称等级: "title_level",
  职称系列: "title_type",
  培训费用: "training_fees",
  "参训/受训方式": "training_method",
  培训积点: "training_point",
  "培训途径": "training_route",
  导师员工编号: "tutor_id",
  "失业保险-企业": "unemployment_insurance_company",
  "失业保险-个人": "unemployment_insurance_personal",
  福利金额: "welfare_amount",
  福利类别: "welfare_type",
  性格特征: "character",
  "职级信息(数字)":"rank_level",
  "职级信息(T序列)":"rank_sequence",
  "绩效职级":"rank_performance",
  "岗位信息":"post",
  "同级岗位任职开始时间":"serve_time",
  人才标识:"talent_type",
  所属专业线:"profession_line",
  评选时间:"select_time",
  "防暑降温费":"防暑降温费",
  "过节费":"过节费",
  "取暖费":"取暖费",
  "通信补贴":"通信补贴",
  "交通补贴":"交通补贴",
  "就餐补贴":"就餐补贴",
  "绿色出行补贴":"绿色出行补贴",
  "劳保费":"劳保费",
  "独生子女费":"独生子女费",
  "体检费":"体检费",
  "年节福利费":"年节福利费",
  "探亲费":"探亲费",
  "其他":"其他"
};

const urlMap={
  基本信息: {
    columns: [
      {
        title: "员工编号",
        dataIndex: "staff_id",
        width: 100,
        fixed: "left"
      },
      {
        title: "姓名",
        dataIndex: "staff_name",
        width: 100,
        fixed: "left"
      },
      {
        title: "基本信息",
        children: [
          {
            title: "部门",
            dataIndex: "deptname"
          },
          {
            title: "员工状态",
            dataIndex: "staff_status",
            width: 150
          },
          {
            title: "身份证号",
            dataIndex: "id_card"
          },
          {
            title: "出生日期",
            dataIndex: "birthday"
          },
          {
            title: "手机",
            dataIndex: "phone_number"
          },
          {
            title: "邮箱",
            dataIndex: "email"
          },
          {
            title: "性别",
            dataIndex: "gender"
          },
          {
            title: "婚姻状况",
            dataIndex: "marital_status"
          },
          {
            title: "国籍",
            dataIndex: "country"
          },
          {
            title: "民族",
            dataIndex: "nation"
          },
          {
            title: "籍贯",
            dataIndex: "birth_place"
          },
          {
            title: "政治面貌",
            dataIndex: "politics_status"
          },
          {
            title: "入党时间",
            dataIndex: "party_time"
          },
          {
            title: "党内职务",
            dataIndex: "party_post"
          }
        ]
      },
      {
        title: "附加信息",
        children: [
          {
            title: "户籍所在地",
            dataIndex: "regist_location"
          },
          {
            title: "户口类型",
            dataIndex: "regist_type"
          },
          {
            title: "档案存放地点",
            dataIndex: "record_location"
          },
          {
            title: "加入企业年金时间",
            dataIndex: "company_annuity_join_day"
          },
          {
            title: "公积金账号",
            dataIndex: "provident_fund_account"
          },
          {
            title: "公积金联名卡号",
            dataIndex: "provident_fund_card"
          },
          {
            title: "是否有亲属在联通系统内",
            dataIndex: "kinsfolk_relation"
          }
        ]
      },
      {
        title: "学历信息",
        children: [
          {
            title: "最高学位",
            dataIndex: "lastest_degree"
          },
          {
            title: "学位证书编号",
            dataIndex: "degree_certificate_No"
          },
          {
            title: "最高学历",
            dataIndex: "lastest_education"
          },
          {
            title: "毕业院校",
            dataIndex: "graduated_school"
          },
          {
            title: "专业",
            dataIndex: "major"
          },
          {
            title: "学习形式",
            dataIndex: "learning_mode"
          }
        ]
      },
      {
        title: "工龄司龄信息",
        children: [
          {
            title: "参加工作时间",
            dataIndex: "join_work_day"
          },
          {
            title: "加入联通系统时间",
            dataIndex: "join_unicom_day"
          },
          {
            title: "联通司龄",
            dataIndex: "unicom_age"
          },
          {
            title: "加入软研院时间",
            dataIndex: "join_ryy_day"
          },
          {
            title: "软研院司龄",
            dataIndex: "ryy_age"
          },
          {
            title: "入职渠道",
            dataIndex: "entry_way"
          },
          {
            title: "入职前单位",
            dataIndex: "pre_company"
          }
        ]
      },
      {
        title: "亲属信息",
        children: [
          {
            title: "亲属员工编号",
            dataIndex: "kinsfolk_id"
          },
          {
            title: "亲属员工姓名",
            dataIndex: "kinsfolk_name"
          },
          {
            title: "联系电话",
            dataIndex: "kinsfolk_phone"
          }
        ]
      }
    ],
    width: "6800"
  },
  合同信息: {
    columns: [
      {
        title: "员工编号",
        dataIndex: "staff_id",
        width: 100,
        fixed: "left"
      },
      {
        title: "姓名",
        dataIndex: "staff_name",
        width: 100,
        fixed: "left"
      },
      {
        title: "合同编号",
        dataIndex: "contract_id"
      },
      {
        title: "合同关系",
        dataIndex: "contractual_type"
      },
      {
        title: "当前劳动合同签订时间",
        dataIndex: "contract_sign_date"
      },
      {
        title: "合同期限(年)",
        dataIndex: "contract_term"
      }
    ],
    width: "800"
  },
  奖惩信息: {
    columns: [
      {
        title: "员工编号",
        dataIndex: "staff_id",
        width: 100,
        fixed: "left"
      },
      {
        title: "姓名",
        dataIndex: "staff_name",
        width: 100,
        fixed: "left"
      },
      {
        title: "时间",
        dataIndex: "datetime",
        // width: 200
      },
      {
        title: "奖惩级别",
        dataIndex: "reward_level",
        // width: 200
      },
      {
        title: "单位",
        dataIndex: "org_name",
        // width: 200
      },
      {
        title: "奖惩类别",
        dataIndex: "reward_category",
        // width: 200
      },
      {
        title: "具体内容",
        dataIndex: "reward_content",
        // width: 200
      },
      {
        title: "奖惩类型",
        dataIndex: "reward_type",
        width: 200
      }
    ],
    width: "900"
  },
  借调信息: {

    columns: [
      {
        title: "员工编号",
        dataIndex: "staff_id",
        width: 100,
        fixed: "left"
      },
      {
        title: "姓名",
        dataIndex: "staff_name",
        width: 100,
        fixed: "left"
      },
      {
        title: "借调开始时间",
        dataIndex: "secondment_start"
      },
      {
        title: "借调结束时间",
        dataIndex: "secondment_end"
      },
      {
        title: "借调单位",
        dataIndex: "secondment_company"
      }
    ],
    width: "800"
  },
  人才信息: {
    columns: [
      {
        title: "员工编号",
        dataIndex: "staff_id",
        width: 100,
        fixed: "left"
      },
      {
        title: "姓名",
        dataIndex: "staff_name",
        width: 100,
        fixed: "left"
      },
      {
        title: "人才标识",
        dataIndex: "talent_type"
      },
      {
        title: "所属专业线",
        dataIndex: "profession_line"
      },
      {
        title: "人才评选时间",
        dataIndex: "select_time"
      }
    ],
    width: "800"
  },
  考核信息: {
    columns: [
      {
        title: "员工编号",
        dataIndex: "staff_id",
        width: 100,
        fixed: "left"
      },
      {
        title: "姓名",
        dataIndex: "staff_name",
        width: 100,
        fixed: "left"
      },
      {
        title: "年度",
        dataIndex: "examine_year"
      },
      {
        title: "考核结果",
        dataIndex: "rank_year"
      },
      {
        title: "季度考核结果",
        children: [
          {
            title: "第一季度",
            dataIndex: "rank_season1"
          },
          {
            title: "第二季度",
            dataIndex: "rank_season2"
          },
          {
            title: "第三季度",
            dataIndex: "rank_season3"
          },
          {
            title: "第四季度",
            dataIndex: "rank_season4"
          }
        ]
      }
    ],
    width: "820"
  },
  职称信息: {
    columns: [
      {
        title: "员工编号",
        dataIndex: "staff_id",
        width: 100,
        fixed: "left"
      },
      {
        title: "姓名",
        dataIndex: "staff_name",
        width: 100,
        fixed: "left"
      },
      {
        title: "职称系列",
        dataIndex: "title_type"
      },
      {
        title: "职称等级",
        dataIndex: "title_level"
      },
      {
        title: "获得职称时间",
        dataIndex: "title_date"
      }
    ],
    width: "800"
  },
  资格证书信息: {
    columns: [
      {
        title: "员工编号",
        dataIndex: "staff_id",
        width: 100,
        fixed: "left"
      },
      {
        title: "姓名",
        dataIndex: "staff_name",
        width: 100,
        fixed: "left"
      },
      {
        title: "专业技术资格名称",
        dataIndex: "certificate_name"
      },
      {
        title: "专业技术资格证书编号",
        dataIndex: "certificate_No"
      },
      {
        title: "获得时间",
        dataIndex: "certificate_date"
      }
    ],
    width: "800"
  },
  岗位职级晋升信息: {
    columns: [
      {
        title: "员工编号",
        dataIndex: "staff_id",
        width: 100,
        fixed: "left"
      },
      {
        title: "姓名",
        dataIndex: "staff_name",
        width: 80,
        fixed: "left"
      },
      {
        title: "年份",
        dataIndex: "year",
        width: 80,
        fixed: "left"
      },
      {
        title: "岗位职级信息",
        children: [
          {
            title: "职级信息（22级）",
            dataIndex: "rank_level"
          },
          {
            title: "职级信息（T职级）",
            dataIndex: "rank_sequence"
          },
          {
            title: "绩效职级（T职级）",
            dataIndex: "rank_performance"
          },
          {
            title: "岗位信息",
            dataIndex: "post"
          },
          {
            title: "同级岗位任职开始时间",
            dataIndex: "serve_time"
          }
        ]
      },
      {
        title: "晋升信息",
        children: [
          {
            title: "职级调整时间",
            dataIndex: "rank_adjust_time"
          },
          {
            title: "职级调整路径",
            dataIndex: "rank_adjust_mode"
          },
          {
            title: "职级调整后结果",
            dataIndex: "rank_adjust_result"
          },
          {
            title: "薪档调整时间",
            dataIndex: "payroll_adjust_time"
          },
          {
            title: "薪档调整路径",
            dataIndex: "payroll_adjust_mode"
          },
          {
            title: "薪档调整后结果",
            dataIndex: "payroll_adjust_result"
          },
          {
            title: "薪档晋升积分剩余情况",
            dataIndex: "remain_points"
          },
          {
            title: "是否G/D档封顶",
            dataIndex: "is_stay"
          },
          {
            title: "G/D档封顶年份",
            dataIndex: "stay_time"
          }
        ]
      }
    ],
    width: "3000"
  },
  培训数量信息: {
    columns: [
      {
        title: "员工编号",
        dataIndex: "staff_id",
        width: 100,
        fixed: "left"
      },
      {
        title: "姓名",
        dataIndex: "staff_name",
        width: 100,
        fixed: "left"
      },
      {
        title: "年度",
        dataIndex: "year",
        width: 100,
        fixed: "left"
      },
      {
        title: "应参加必修课数量",
        dataIndex: "required_course_plan_num",
        
      },
      {
        title: "应参加选修课数量",
        dataIndex: "selected_course_plan_num"
      },
      {
        title: "实际参加必修课数量",
        dataIndex: "required_course_actual_num"
      },
      {
        title: "实际参加选修课数量",
        dataIndex: "selected_course_actual_num"
      },
      {
        title: "参加内部培训次数",
        dataIndex: "internal_trained_num"
      },
      {
        title: "参加外部培训次数",
        dataIndex: "external_trained_num"
      },
      {
        title: "参加线下培训次数",
        dataIndex: "offline_trained_num"
      },
      {
        title: "参加线上培训次数",
        dataIndex: "online_trained_num"
      },
      {
        title: "内部授课次数",
        dataIndex: "internal_teaching_num"
      },
      {
        title: "内部授课总课时数",
        dataIndex: "internal_teaching_hours"
      },
      {
        title: "外部授课次数",
        dataIndex: "external_teaching_num"
      },
      {
        title: "外部授课总课时数",
        dataIndex: "external_teaching_hours"
      },
      {
        title: "导师员工编号",
        dataIndex: "tutor_id"
      },
      {
        title: "导师姓名",
        dataIndex: "username"
      },
      {
        title: "培训费用",
        dataIndex: "training_fees"
      }
    ],
    width: "3300"
  },
  培训课程信息: {
    columns: [
      {
        title: "员工编号",
        dataIndex: "staff_id",
        width: 100,
        fixed: "left"
      },
      {
        title: "姓名",
        dataIndex: "staff_name",
        width: 100,
        fixed: "left"
      },
      {
        title: "年度",
        dataIndex: "year",
        width: 100,
        fixed: "left"
      },
      {
        title: "课程类型",
        dataIndex: "course_type"
      },
      {
        title: "参训/受训方式",
        dataIndex: "training_method"
      },
      {
        title: "培训途径",
        dataIndex: "training_route"
      },
      {
        title: "课程名",
        dataIndex: "course"
      },
      {
        title: "课程课时数",
        dataIndex: "course_class"
      },
      {
        title: "培训时间",
        dataIndex: "course_training_time"
      }
    ],
    width: "1500"
  },
  认可激励信息: {
    columns: [
      {
        title: "员工编号",
        dataIndex: "staff_id",
        width: 100,
        fixed: "left"
      },
      {
        title: "姓名",
        dataIndex: "staff_name",
        width: 100,
        fixed: "left"
      },
      {
        title: "年度",
        dataIndex: "year",
        width: 100,
        fixed: "left"
      },
      {
        title: "认可类型",
        dataIndex: "recognized_type"
      },
      {
        title: "具体时间",
        dataIndex: "obtain_time"
      },
      {
        title: "内容",
        dataIndex: "content"
      }
    ],
    width: "1300"
  },
  积点信息: {
    columns: [
      {
        title: "员工编号",
        dataIndex: "staff_id",
        width: 100,
        fixed: "left"
      },
      {
        title: "姓名",
        dataIndex: "staff_name",
        width: 100,
        fixed: "left"
      },
      {
        title: "年份",
        dataIndex: "year",
        width: 80
      },
      {
        title: "基本积点",
        dataIndex: "basic_point"
      },
      {
        title: "年龄积点",
        dataIndex: "age_point"
      },
      {
        title: "司龄积点",
        dataIndex: "company_age_point"
      },
      {
        title: "职级积点",
        dataIndex: "rank_point"
      },
      {
        title: "培训积点",
        dataIndex: "training_point"
      },
      {
        title: "认可积点",
        dataIndex: "recognized_point"
      },
      {
        title: "荣誉积点",
        dataIndex: "honor_point"
      },
      {
        title: "其他积点",
        dataIndex: "other_point"
      },
      {
        title: "认可奖励",
        dataIndex: "recognized_reward"
      },
      {
        title: "荣誉奖励",
        dataIndex: "honor_reward"
      },
      {
        title: "年度在岗月份数",
        dataIndex: "num_of_months_work"
      }
    ],
    width: "2000"
  },
  福利信息: {
    columns: [
      {
        title: "员工编号",
        dataIndex: "staff_id",
        width: 100,
        fixed: "left"
      },
      {
        title: "姓名",
        dataIndex: "staff_name",
        width: 100,
        fixed: "left"
      },
      {
        title: "年份",
        dataIndex: "year",
        width: 100
      },
      {
        title: "福利类别",
        children: [
          {
            title: "防暑降温费",
            dataIndex: "防暑降温费"
          },
          {
            title: "过节费",
            dataIndex: "过节费"
          },
          {
            title: "取暖费",
            dataIndex: "取暖费"
          },
          {
            title: "通信补贴",
            dataIndex: "通信补贴"
          },
          {
            title: "交通补贴",
            dataIndex: "交通补贴"
          },
          {
            title: "就餐补贴",
            dataIndex: "就餐补贴"
          },
          {
            title: "绿色出行补贴",
            dataIndex: "绿色出行补贴"
          },
          {
            title: "劳保费",
            dataIndex: "劳保费"
          },
          {
            title: "独生子女费",
            dataIndex: "独生子女费"
          },
          {
            title: "体检费",
            dataIndex: "体检费"
          },
          {
            title: "年节福利费",
            dataIndex: "年节福利费"
          },
          {
            title: "探亲费",
            dataIndex: "探亲费"
          },
          {
            title: "其他",
            dataIndex: "其他"
          }
        ]
      }
    ],
    width:"3000"
  },
  年度薪酬信息: {
    columns: [
      {
        title: "员工编号",
        dataIndex: "staff_id",
        width: 100,
        fixed: "left"
      },
      {
        title: "姓名",
        dataIndex: "staff_name",
        width: 100,
        fixed: "left"
      },
      {
        title: "年份",
        dataIndex: "year",
        width: 80,
        fixed: "left"
      },
      {
        title: "基本工资",
        dataIndex: "basic_wage"
      },
      {
        title: "月季度绩效工资",
        dataIndex: "monthly_performance_pay"
      },
      {
        title: "综合补贴",
        dataIndex: "comprehensive_subsidy"
      },
      {
        title: "季度绩效工资",
        dataIndex: "quarterly_performance_pay"
      },
      {
        title: "年度绩效工资",
        dataIndex: "annual_performance_pay"
      },
      {
        title: "专项奖励",
        dataIndex: "special_reward"
      },
      {
        title: "其他",
        dataIndex: "other_reward"
      },
      {
        title: "医疗保险-企业",
        dataIndex: "medical_insurance_company"
      },
      {
        title: "医疗保险-个人",
        dataIndex: "medical_insurance_personal"
      },
      {
        title: "养老保险-企业",
        dataIndex: "pension_company"
      },
      {
        title: "养老保险-个人",
        dataIndex: "pension_personal"
      },
      {
        title: "失业保险-企业",
        dataIndex: "unemployment_insurance_company"
      },
      {
        title: "失业保险-个人",
        dataIndex: "unemployment_insurance_personal"
      },
      {
        title: "工伤保险-企业",
        dataIndex: "injury_insurance_company"
      },
      {
        title: "生育保险-企业",
        dataIndex: "maternity_insurance_company"
      },
      {
        title: "住房公积金-企业",
        dataIndex: "housing_fund_company"
      },
      {
        title: "住房公积金-个人",
        dataIndex: "housing_fund_personal"
      },
      {
        title: "企业年金-企业",
        dataIndex: "occupational_pension_company"
      },
      {
        title: "企业年金-个人",
        dataIndex: "occupational_pension_personal"
      },
      {
        title: "企业年金补缴-企业",
        dataIndex: "occupational_pension_add_company"
      },
      {
        title: "企业年金补缴-个人",
        dataIndex: "occupational_pension_add_personal"
      },
      {
        title: "补充医疗保险-员工",
        dataIndex: "supplementary_medical_insurance_staff"
      },
      {
        title: "补充医疗保险-子女",
        dataIndex: "supplementary_medical_insurance_child"
      },
      {
        title: "特需医疗基金",
        dataIndex: "special_medical_fund"
      },
      {
        title: "年度纳税",
        dataIndex: "annual_tax"
      }
    ],
    width: "4300"
  }
}

export default {bookObj,urlMap};