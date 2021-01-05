/**
 * 文件说明：组织绩效考核指标映射表
 * 作者：邬志成
 * 邮箱：wuzc@itnova.com.cn
 * 创建日期：2019-9-16
 */
// 状态映射
export const statusMap = ['未提交', '待评价', '评价完成'];
// 部门映射
export const unitMap = [
    '办公室',
    '财务部',
    '人力资源部',
    '党群部',
    '采购部',
    '项目管理部',
    '创新与能力运营研发事业部',
    '公众研发事业部',
    '公共平台与架构研发事业部',
    '政企与行业研发事业部',
    '计费结算中心',
    '运营保障与调度中心',
    '公共资源与安全中心',
    '济南分院',
    '哈尔滨分院',
    '广州分院',
    '西安分院',
    '南京分院',
    '客户服务研发事业部',
    '数据中台研发事业部',
    '管理信息研发事业部'
];
// 指标类型映射
export const indexTypeMap = [
    '效益类指标',
    '专业化指标',
    'GS重点工作',
    '党建工作',
    '支撑服务',
    '学习与成长',
    '激励约束项'
]
// 环节状态
export const flowStatusMap = ['待办', '办理中', '办结'];
// 打分类型
export const operateTypeMap = ['未参与', '提交', '通过', '退回', '终止'];
// 季度
export const quarterMap = ['第一季度', '第二季度', '第三季度', '第四季度'];
// 年度
export const yearMap = () => {
    const current = new Date().getFullYear();
    return [
        current - 1 + '',
        current + '',
        current + 1 + ''
    ]
};
