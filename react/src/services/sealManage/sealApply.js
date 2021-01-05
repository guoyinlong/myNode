/**
 * 作者： 贾茹
 * 创建日期： 2019-9-9
 * 邮箱: m18311475903@163.com
 * 功能： 印章证照管理接口服务
 */
import request from '../../utils/request';

//工作台待办列表数据查询服务
export function taskList(param) {
  return request('/microservice/management_of_seal/seal_undo_list_search',param);
 /* return ({
      RetCode: "1", RetVal: "1", DataRows: [
        {
          tid: '待办列表',//待办表id
          page_state:'0',//页面跳转标识
          list_uuid: '111',//通知uuid
          form_uuid: '222',//关联申请信息表uuid
          batch_id: '环节id',//环节id
          submit_id: '提交批次id',
          list_state: '',// 待办通知状态（0待办）
          list_receive_id: '',//接收人id',
          list_receive_name: '',//接收人名称
          tcreate_user_id: '',//待办创建人id
          tcreate_user_name: '张枫',//待办创建人名称
          tcreate_date: '',//代办
          sid: '',//申请单
          seal_details_id: '',//表中的:章照详情idseal_
          seal_details_name: '印章使用申请填报',//章,//照
          form_type: '',//申
          form_name: '',//
          form_reason: '',//
          form_if_secret: '',//是否涉密（0：否
          form_secret_reason: '',//
          form_if_sign: '',//是否需要相关部门会签（0：否
          form_if_approval: '',//申
          form_out_company: '',//提交对方
          form_dept_id: '',//申请或
          form_seal_demand: '',//刻章规
          form_actual_usename: '',//实际使用
          form_borrow_date: '',//
          form_return_date: '',//
          form_copy_quantity: '',//复
          form_use_day: '',//
          form_check_state: '',//申请单
          form_check_state_desc: '',//申请单当前
          form_check_reject_reason: '',//
          form_last_check_state: '',//上一
          form_last_check_state_desc: '',//上一流程
          form_next_check_state: '',//
          form_next_check_state_desc: '',//下一
          actual_recipients_id: '',//实际领
          actual_recipients_name: '',//实际领
          form_des: '',
          screate_user_id: '',//申,//请单创
          screate_user_name: '',//申,//请单创
          screate_date: '',//申请单
          update_user_id: '',//申请单修
          update_user_name: '',//申,//请单修
          update_date: '2019-09-09 13:00:00',//申请单
        },
        {
          tid: '待办列表',//待办表id
          page_state:'1',//页面跳转标识
          list_uuid: '111',//通知uuid
          form_uuid: '222',//关联申请信息表uuid
          batch_id: '环节id',//环节id
          submit_id: '提交批次id',
          list_state: '',// 待办通知状态（0待办）
          list_receive_id: '',//接收人id',
          list_receive_name: '',//接收人名称
          tcreate_user_id: '',//待办创建人id
          tcreate_user_name: '张枫',//待办创建人名称
          tcreate_date: '',//代办
          sid: '',//申请单
          seal_details_id: '证照id',//表中的:章照详情idseal_
          seal_details_name: '印章外借申请填报',//章照
          form_type: '申请单类型',//申请单类型
          form_name: '刻章名称',//刻章名称
          form_reason: '用印事由或刻章是由',//
          form_if_secret: '是否涉密',//是否涉密（0：否
          form_secret_reason: '涉密原因',//
          form_if_sign: '0',//是否需要相关部门会签（0：否
          form_if_approval: '申请单范围',//申请单范围
          form_out_company: '提交对方单位名称',//提交对方单位名称
          form_dept_id: '申请或借用部门',//申请或借用部门
          form_seal_demand: '刻章规格及要求',//刻章规格及要求
          form_actual_usename: '实际使用人活部门',//实际使用
          form_borrow_date: '借用时间',//借用时间
          form_return_date: '归还时间',//归还时间
          form_copy_quantity: '复印件分数',//复印件分数
          form_use_day: '有效天数',//有效天数
          form_check_state: '',//申请单
          form_check_state_desc: '',//申请单当前
          form_check_reject_reason: '',//
          form_last_check_state: '',//上一
          form_last_check_state_desc: '',//上一流程
          form_next_check_state: '',//
          form_next_check_state_desc: '',//下一
          actual_recipients_id:'实际领取人id',//实际领取人id
          actual_recipients_name:'实际领取人名称',//实际领取人名称
          form_des: '',
          screate_user_id: '申请单创建人id',//申请单创建人id
          screate_user_name: '申请单创建人名字',//申请单创建人名字
          screate_date: '',//申请单
          update_user_id: '',//申请单修
          update_user_name: '',//申,//请单修
          update_date: '2019-09-09 13:00:00',//申请单
        },
        {
          tid: '待办列表',//待办表id
          page_state:'2',//页面跳转标识
          list_uuid: '111',//通知uuid
          form_uuid: '222',//关联申请信息表uuid
          batch_id: '环节id',//环节id
          submit_id: '提交批次id',
          list_state: '',// 待办通知状态（0待办）
          list_receive_id: '',//接收人id',
          list_receive_name: '',//接收人名称
          tcreate_user_id: '',//待办创建人id
          tcreate_user_name: '张枫',//待办创建人名称
          tcreate_date: '',//代办
          sid: '',//申请单
          seal_details_id: '',//表中的:章照详情idseal_
          seal_details_name: '领导名章使用申请填报',//章,//照
          form_type: '',//申
          form_name: '',//
          form_reason: '',//
          form_if_secret: '',//是否涉密（0：否
          form_secret_reason: '',//
          form_if_sign: '',//是否需要相关部门会签（0：否
          form_if_approval: '',//申
          form_out_company: '',//提交对方
          form_dept_id: '',//申请或
          form_seal_demand: '',//刻章规
          form_actual_usename: '',//实际使用
          form_borrow_date: '',//
          form_return_date: '',//
          form_copy_quantity: '',//复
          form_use_day: '',//
          form_check_state: '',//申请单
          form_check_state_desc: '',//申请单当前
          form_check_reject_reason: '',//
          form_last_check_state: '',//上一
          form_last_check_state_desc: '',//上一流程
          form_next_check_state: '',//
          form_next_check_state_desc: '',//下一
          actual_recipients_id: '',//实际领
          actual_recipients_name: '',//实际领
          form_des: '',
          screate_user_id: '申请单创建人id',//申请单创建人id
          screate_user_name: '申请单创建人名字',//申请单创建人名字
          screate_date: '',//申请单
          update_user_id: '',//申请单修
          update_user_name: '',//申,//请单修
          update_date: '2019-09-09 13:00:00',//申请单
        },
        {
          tid: '待办列表',//待办表id
          page_state:'3',//页面跳转标识
          list_uuid: '111',//通知uuid
          form_uuid: '222',//关联申请信息表uuid
          batch_id: '环节id',//环节id
          submit_id: '提交批次id',
          list_state: '',// 待办通知状态（0待办）
          list_receive_id: '',//接收人id',
          list_receive_name: '',//接收人名称
          tcreate_user_id: '',//待办创建人id
          tcreate_user_name: '张枫',//待办创建人名称
          tcreate_date: '',//代办
          sid: '',//申请单
          seal_details_id: '',//表中的:章照详情idseal_
          seal_details_name: '领导名章外借申请填报',//章,//照
          form_type: '',//申
          form_name: '',//
          form_reason: '',//
          form_if_secret: '',//是否涉密（0：否
          form_secret_reason: '',//
          form_if_sign: '',//是否需要相关部门会签（0：否
          form_if_approval: '',//申
          form_out_company: '',//提交对方
          form_dept_id: '',//申请或
          form_seal_demand: '',//刻章规
          form_actual_usename: '',//实际使用
          form_borrow_date: '',//
          form_return_date: '',//
          form_copy_quantity: '',//复
          form_use_day: '',//
          form_check_state: '',//申请单
          form_check_state_desc: '',//申请单当前
          form_check_reject_reason: '',//
          form_last_check_state: '',//上一
          form_last_check_state_desc: '',//上一流程
          form_next_check_state: '',//
          form_next_check_state_desc: '',//下一
          actual_recipients_id: '',//实际领
          actual_recipients_name: '',//实际领
          form_des: '',
          screate_user_id: '申请单创建人id',//申请单创建人id
          screate_user_name: '申请单创建人名字',//申请单创建人名字
          screate_date: '',//申请单
          update_user_id: '',//申请单修
          update_user_name: '',//申,//请单修
          update_date: '2019-09-09 13:00:00',//申请单
        },
        {
          tid: '待办列表',//待办表id
          page_state:'4',//页面跳转标识
          list_uuid: '111',//通知uuid
          form_uuid: '222',//关联申请信息表uuid
          batch_id: '环节id',//环节id
          submit_id: '提交批次id',
          list_state: '',// 待办通知状态（0待办）
          list_receive_id: '',//接收人id',
          list_receive_name: '',//接收人名称
          tcreate_user_id: '',//待办创建人id
          tcreate_user_name: '张枫',//待办创建人名称
          tcreate_date: '',//代办
          sid: '',//申请单
          seal_details_id: '',//表中的:章照详情idseal_
          seal_details_name: '营业执照使用申请填报',//章,//照
          form_type: '',//申
          form_name: '',//
          form_reason: '',//
          form_if_secret: '',//是否涉密（0：否
          form_secret_reason: '',//
          form_if_sign: '',//是否需要相关部门会签（0：否
          form_if_approval: '',//申
          form_out_company: '',//提交对方
          form_dept_id: '',//申请或
          form_seal_demand: '',//刻章规
          form_actual_usename: '',//实际使用
          form_borrow_date: '',//
          form_return_date: '',//
          form_copy_quantity: '',//复
          form_use_day: '',//
          form_check_state: '',//申请单
          form_check_state_desc: '',//申请单当前
          form_check_reject_reason: '',//
          form_last_check_state: '',//上一
          form_last_check_state_desc: '',//上一流程
          form_next_check_state: '',//
          form_next_check_state_desc: '',//下一
          actual_recipients_id: '',//实际领
          actual_recipients_name: '',//实际领
          form_des: '',
          screate_user_id: '申请单创建人id',//申请单创建人id
          screate_user_name: '申请单创建人名字',//申请单创建人名字
          screate_date: '',//申请单
          update_user_id: '',//申请单修
          update_user_name: '',//申,//请单修
          update_date: '2019-09-09 13:00:00',//申请单
        },
        {
          tid: '待办列表',//待办表id
          page_state:'5',//页面跳转标识
          list_uuid: '111',//通知uuid
          form_uuid: '222',//关联申请信息表uuid
          batch_id: '环节id',//环节id
          submit_id: '提交批次id',
          list_state: '',// 待办通知状态（0待办）
          list_receive_id: '',//接收人id',
          list_receive_name: '',//接收人名称
          tcreate_user_id: '',//待办创建人id
          tcreate_user_name: '张枫',//待办创建人名称
          tcreate_date: '',//代办
          sid: '',//申请单
          seal_details_id: '',//表中的:章照详情idseal_
          seal_details_name: '营业执照外借申请填报',//章,//照
          form_type: '',//申
          form_name: '',//
          form_reason: '',//
          form_if_secret: '',//是否涉密（0：否
          form_secret_reason: '',//
          form_if_sign: '',//是否需要相关部门会签（0：否
          form_if_approval: '',//申
          form_out_company: '',//提交对方
          form_dept_id: '',//申请或
          form_seal_demand: '',//刻章规
          form_actual_usename: '',//实际使用
          form_borrow_date: '',//
          form_return_date: '',//
          form_copy_quantity: '',//复
          form_use_day: '',//
          form_check_state: '',//申请单
          form_check_state_desc: '',//申请单当前
          form_check_reject_reason: '',//
          form_last_check_state: '',//上一
          form_last_check_state_desc: '',//上一流程
          form_next_check_state: '',//
          form_next_check_state_desc: '',//下一
          actual_recipients_id: '',//实际领
          actual_recipients_name: '',//实际领
          form_des: '',
          screate_user_id: '申请单创建人id',//申请单创建人id
          screate_user_name: '申请单创建人名字',//申请单创建人名字
          screate_date: '',//申请单
          update_user_id: '',//申请单修
          update_user_name: '',//申,//请单修
          update_date: '2019-09-09 13:00:00',//申请单
        },
        {
          tid: '待办列表',//待办表id
          page_state:'6',//页面跳转标识
          list_uuid: '111',//通知uuid
          form_uuid: '222',//关联申请信息表uuid
          batch_id: '环节id',//环节id
          submit_id: '提交批次id',
          list_state: '',// 待办通知状态（0待办）
          list_receive_id: '',//接收人id',
          list_receive_name: '',//接收人名称
          tcreate_user_id: '',//待办创建人id
          tcreate_user_name: '张枫',//待办创建人名称
          tcreate_date: '',//代办
          sid: '',//申请单
          seal_details_id: '',//表中的:章照详情idseal_
          seal_details_name: '领导身份证复印件使用',//章,//照
          form_type: '',//申
          form_name: '',//
          form_reason: '',//
          form_if_secret: '',//是否涉密（0：否
          form_secret_reason: '',//
          form_if_sign: '',//是否需要相关部门会签（0：否
          form_if_approval: '',//申
          form_out_company: '',//提交对方
          form_dept_id: '',//申请或
          form_seal_demand: '',//刻章规
          form_actual_usename: '',//实际使用
          form_borrow_date: '',//
          form_return_date: '',//
          form_copy_quantity: '',//复
          form_use_day: '',//
          form_check_state: '',//申请单
          form_check_state_desc: '',//申请单当前
          form_check_reject_reason: '',//
          form_last_check_state: '',//上一
          form_last_check_state_desc: '',//上一流程
          form_next_check_state: '',//
          form_next_check_state_desc: '',//下一
          actual_recipients_id: '',//实际领
          actual_recipients_name: '',//实际领
          form_des: '',
          screate_user_id: '申请单创建人id',//申请单创建人id
          screate_user_name: '申请单创建人名字',//申请单创建人名字
          screate_date: '',//申请单
          update_user_id: '',//申请单修
          update_user_name: '',//申,//请单修
          update_date: '2019-09-09 13:00:00',//申请单
        },
        {
          tid: '待办列表',//待办表id
          page_state:'7',//页面跳转标识
          list_uuid: '111',//通知uuid
          form_uuid: '222',//关联申请信息表uuid
          batch_id: '环节id',//环节id
          submit_id: '提交批次id',
          list_state: '',// 待办通知状态（0待办）
          list_receive_id: '',//接收人id',
          list_receive_name: '',//接收人名称
          tcreate_user_id: '',//待办创建人id
          tcreate_user_name: '张枫',//待办创建人名称
          tcreate_date: '',//代办
          sid: '',//申请单
          seal_details_id: '',//表中的:章照详情idseal_
          seal_details_name: '刻章申请填报',//章,//照
          form_type: '',//申
          form_name: '',//
          form_reason: '',//
          form_if_secret: '',//是否涉密（0：否
          form_secret_reason: '',//
          form_if_sign: '',//是否需要相关部门会签（0：否
          form_if_approval: '',//申
          form_out_company: '',//提交对方
          form_dept_id: '',//申请或
          form_seal_demand: '和其他印章类型一致',//刻章规
          form_actual_usename: '',//实际使用
          form_borrow_date: '',//
          form_return_date: '',//
          form_copy_quantity: '',//复
          form_use_day: '',//
          form_check_state: '',//申请单
          form_check_state_desc: '',//申请单当前
          form_check_reject_reason: '',//
          form_last_check_state: '',//上一
          form_last_check_state_desc: '',//上一流程
          form_next_check_state: '',//
          form_next_check_state_desc: '',//下一
          actual_recipients_id: '',//实际领
          actual_recipients_name: '',//实际领
          form_des: '',
          screate_user_id: '申请单创建人id',//申请单创建人id
          screate_user_name: '申请单创建人名字',//申请单创建人名字
          screate_date: '',//申请单
          update_user_id: '',//申请单修
          update_user_name: '',//申,//请单修
          update_date: '2019-09-09 13:00:00',//申请单
        },
      ]
    }
  )*/
}

//工作台已办列表数据查询服务
export function completeList(param) {
  return request('/microservice/management_of_seal/seal_handled_list_search',param);
  /*return ({
      RetCode: "1", RetVal: "1", DataRows: [
        {
          tid: '待办列表',//待办表id
          page_state:'0',//页面跳转标识
          list_uuid: '111',//通知uuid
          form_uuid: '222',//关联申请信息表uuid
          batch_id: '环节id',//环节id
          submit_id: '提交批次id',
          list_state: '',// 待办通知状态（0待办）
          list_receive_id: '',//接收人id',
          list_receive_name: '',//接收人名称
          tcreate_user_id: '',//待办创建人id
          tcreate_user_name: '张枫',//待办创建人名称
          tcreate_date: '',//代办
          sid: '',//申请单
          seal_details_id: '',//表中的:章照详情idseal_
          seal_details_name: '印章使用申请填报',//章,//照
          form_type: '',//申
          form_name: '',//
          form_reason: '',//
          form_if_secret: '',//是否涉密（0：否
          form_secret_reason: '',//
          form_if_sign: '',//是否需要相关部门会签（0：否
          form_if_approval: '',//申
          form_out_company: '',//提交对方
          form_dept_id: '',//申请或
          form_seal_demand: '',//刻章规
          form_actual_usename: '',//实际使用
          form_borrow_date: '',//
          form_return_date: '',//
          form_copy_quantity: '',//复
          form_use_day: '',//
          form_check_state: '',//申请单
          form_check_state_desc: '',//申请单当前
          form_check_reject_reason: '',//
          form_last_check_state: '',//上一
          form_last_check_state_desc: '',//上一流程
          form_next_check_state: '',//
          form_next_check_state_desc: '',//下一
          actual_recipients_id: '',//实际领
          actual_recipients_name: '',//实际领
          form_des: '',
          screate_user_id: '',//申,//请单创
          screate_user_name: '',//申,//请单创
          screate_date: '',//申请单
          update_user_id: '',//申请单修
          update_user_name: '',//申,//请单修
          update_date: '2019-09-09 13:00:00',//申请单
        },
        {
          tid: '待办列表',//待办表id
          page_state:'1',//页面跳转标识
          list_uuid: '111',//通知uuid
          form_uuid: '222',//关联申请信息表uuid
          batch_id: '环节id',//环节id
          submit_id: '提交批次id',
          list_state: '',// 待办通知状态（0待办）
          list_receive_id: '',//接收人id',
          list_receive_name: '',//接收人名称
          tcreate_user_id: '',//待办创建人id
          tcreate_user_name: '张枫',//待办创建人名称
          tcreate_date: '',//代办
          sid: '',//申请单
          seal_details_id: '',//表中的:章照详情idseal_
          seal_details_name: '印章外借申请填报',//章,//照
          form_type: '',//申
          form_name: '',//
          form_reason: '',//
          form_if_secret: '',//是否涉密（0：否
          form_secret_reason: '',//
          form_if_sign: '',//是否需要相关部门会签（0：否
          form_if_approval: '',//申
          form_out_company: '',//提交对方
          form_dept_id: '',//申请或
          form_seal_demand: '',//刻章规
          form_actual_usename: '',//实际使用
          form_borrow_date: '',//
          form_return_date: '',//
          form_copy_quantity: '',//复
          form_use_day: '',//
          form_check_state: '',//申请单
          form_check_state_desc: '',//申请单当前
          form_check_reject_reason: '',//
          form_last_check_state: '',//上一
          form_last_check_state_desc: '',//上一流程
          form_next_check_state: '',//
          form_next_check_state_desc: '',//下一
          actual_recipients_id: '',//实际领
          actual_recipients_name: '',//实际领
          form_des: '',
          screate_user_id: '',//申,//请单创
          screate_user_name: '',//申,//请单创
          screate_date: '',//申请单
          update_user_id: '',//申请单修
          update_user_name: '',//申,//请单修
          update_date: '2019-09-09 13:00:00',//申请单
        },
        {
          tid: '待办列表',//待办表id
          page_state:'2',//页面跳转标识
          list_uuid: '111',//通知uuid
          form_uuid: '222',//关联申请信息表uuid
          batch_id: '环节id',//环节id
          submit_id: '提交批次id',
          list_state: '',// 待办通知状态（0待办）
          list_receive_id: '',//接收人id',
          list_receive_name: '',//接收人名称
          tcreate_user_id: '',//待办创建人id
          tcreate_user_name: '张枫',//待办创建人名称
          tcreate_date: '',//代办
          sid: '',//申请单
          seal_details_id: '',//表中的:章照详情idseal_
          seal_details_name: '领导名章使用申请填报',//章,//照
          form_type: '',//申
          form_name: '',//
          form_reason: '',//
          form_if_secret: '',//是否涉密（0：否
          form_secret_reason: '',//
          form_if_sign: '',//是否需要相关部门会签（0：否
          form_if_approval: '',//申
          form_out_company: '',//提交对方
          form_dept_id: '',//申请或
          form_seal_demand: '',//刻章规
          form_actual_usename: '',//实际使用
          form_borrow_date: '',//
          form_return_date: '',//
          form_copy_quantity: '',//复
          form_use_day: '',//
          form_check_state: '',//申请单
          form_check_state_desc: '',//申请单当前
          form_check_reject_reason: '',//
          form_last_check_state: '',//上一
          form_last_check_state_desc: '',//上一流程
          form_next_check_state: '',//
          form_next_check_state_desc: '',//下一
          actual_recipients_id: '',//实际领
          actual_recipients_name: '',//实际领
          form_des: '',
          screate_user_id: '',//申,//请单创
          screate_user_name: '',//申,//请单创
          screate_date: '',//申请单
          update_user_id: '',//申请单修
          update_user_name: '',//申,//请单修
          update_date: '2019-09-09 13:00:00',//申请单
        },
        {
          tid: '待办列表',//待办表id
          page_state:'3',//页面跳转标识
          list_uuid: '111',//通知uuid
          form_uuid: '222',//关联申请信息表uuid
          batch_id: '环节id',//环节id
          submit_id: '提交批次id',
          list_state: '',// 待办通知状态（0待办）
          list_receive_id: '',//接收人id',
          list_receive_name: '',//接收人名称
          tcreate_user_id: '',//待办创建人id
          tcreate_user_name: '张枫',//待办创建人名称
          tcreate_date: '',//代办
          sid: '',//申请单
          seal_details_id: '',//表中的:章照详情idseal_
          seal_details_name: '领导名章外借申请填报',//章,//照
          form_type: '',//申
          form_name: '',//
          form_reason: '',//
          form_if_secret: '',//是否涉密（0：否
          form_secret_reason: '',//
          form_if_sign: '',//是否需要相关部门会签（0：否
          form_if_approval: '',//申
          form_out_company: '',//提交对方
          form_dept_id: '',//申请或
          form_seal_demand: '',//刻章规
          form_actual_usename: '',//实际使用
          form_borrow_date: '',//
          form_return_date: '',//
          form_copy_quantity: '',//复
          form_use_day: '',//
          form_check_state: '',//申请单
          form_check_state_desc: '',//申请单当前
          form_check_reject_reason: '',//
          form_last_check_state: '',//上一
          form_last_check_state_desc: '',//上一流程
          form_next_check_state: '',//
          form_next_check_state_desc: '',//下一
          actual_recipients_id: '',//实际领
          actual_recipients_name: '',//实际领
          form_des: '',
          screate_user_id: '',//申,//请单创
          screate_user_name: '',//申,//请单创
          screate_date: '',//申请单
          update_user_id: '',//申请单修
          update_user_name: '',//申,//请单修
          update_date: '2019-09-09 13:00:00',//申请单
        },
        {
          tid: '待办列表',//待办表id
          page_state:'4',//页面跳转标识
          list_uuid: '111',//通知uuid
          form_uuid: '222',//关联申请信息表uuid
          batch_id: '环节id',//环节id
          submit_id: '提交批次id',
          list_state: '',// 待办通知状态（0待办）
          list_receive_id: '',//接收人id',
          list_receive_name: '',//接收人名称
          tcreate_user_id: '',//待办创建人id
          tcreate_user_name: '张枫',//待办创建人名称
          tcreate_date: '',//代办
          sid: '',//申请单
          seal_details_id: '',//表中的:章照详情idseal_
          seal_details_name: '营业执照使用申请填报',//章,//照
          form_type: '',//申
          form_name: '',//
          form_reason: '',//
          form_if_secret: '',//是否涉密（0：否
          form_secret_reason: '',//
          form_if_sign: '',//是否需要相关部门会签（0：否
          form_if_approval: '',//申
          form_out_company: '',//提交对方
          form_dept_id: '',//申请或
          form_seal_demand: '',//刻章规
          form_actual_usename: '',//实际使用
          form_borrow_date: '',//
          form_return_date: '',//
          form_copy_quantity: '',//复
          form_use_day: '',//
          form_check_state: '',//申请单
          form_check_state_desc: '',//申请单当前
          form_check_reject_reason: '',//
          form_last_check_state: '',//上一
          form_last_check_state_desc: '',//上一流程
          form_next_check_state: '',//
          form_next_check_state_desc: '',//下一
          actual_recipients_id: '',//实际领
          actual_recipients_name: '',//实际领
          form_des: '',
          screate_user_id: '',//申,//请单创
          screate_user_name: '',//申,//请单创
          screate_date: '',//申请单
          update_user_id: '',//申请单修
          update_user_name: '',//申,//请单修
          update_date: '2019-09-09 13:00:00',//申请单
        },
        {
          tid: '待办列表',//待办表id
          page_state:'5',//页面跳转标识
          list_uuid: '111',//通知uuid
          form_uuid: '222',//关联申请信息表uuid
          batch_id: '环节id',//环节id
          submit_id: '提交批次id',
          list_state: '',// 待办通知状态（0待办）
          list_receive_id: '',//接收人id',
          list_receive_name: '',//接收人名称
          tcreate_user_id: '',//待办创建人id
          tcreate_user_name: '张枫',//待办创建人名称
          tcreate_date: '',//代办
          sid: '',//申请单
          seal_details_id: '',//表中的:章照详情idseal_
          seal_details_name: '营业执照外借申请填报',//章,//照
          form_type: '',//申
          form_name: '',//
          form_reason: '',//
          form_if_secret: '',//是否涉密（0：否
          form_secret_reason: '',//
          form_if_sign: '',//是否需要相关部门会签（0：否
          form_if_approval: '',//申
          form_out_company: '',//提交对方
          form_dept_id: '',//申请或
          form_seal_demand: '',//刻章规
          form_actual_usename: '',//实际使用
          form_borrow_date: '',//
          form_return_date: '',//
          form_copy_quantity: '',//复
          form_use_day: '',//
          form_check_state: '',//申请单
          form_check_state_desc: '',//申请单当前
          form_check_reject_reason: '',//
          form_last_check_state: '',//上一
          form_last_check_state_desc: '',//上一流程
          form_next_check_state: '',//
          form_next_check_state_desc: '',//下一
          actual_recipients_id: '',//实际领
          actual_recipients_name: '',//实际领
          form_des: '',
          screate_user_id: '',//申,//请单创
          screate_user_name: '',//申,//请单创
          screate_date: '',//申请单
          update_user_id: '',//申请单修
          update_user_name: '',//申,//请单修
          update_date: '2019-09-09 13:00:00',//申请单
        },
        {
          tid: '待办列表',//待办表id
          page_state:'6',//页面跳转标识
          list_uuid: '111',//通知uuid
          form_uuid: '222',//关联申请信息表uuid
          batch_id: '环节id',//环节id
          submit_id: '提交批次id',
          list_state: '',// 待办通知状态（0待办）
          list_receive_id: '',//接收人id',
          list_receive_name: '',//接收人名称
          tcreate_user_id: '',//待办创建人id
          tcreate_user_name: '张枫',//待办创建人名称
          tcreate_date: '',//代办
          sid: '',//申请单
          seal_details_id: '',//表中的:章照详情idseal_
          seal_details_name: '领导身份证复印件使用',//章,//照
          form_type: '',//申
          form_name: '',//
          form_reason: '',//
          form_if_secret: '',//是否涉密（0：否
          form_secret_reason: '',//
          form_if_sign: '',//是否需要相关部门会签（0：否
          form_if_approval: '',//申
          form_out_company: '',//提交对方
          form_dept_id: '',//申请或
          form_seal_demand: '',//刻章规
          form_actual_usename: '',//实际使用
          form_borrow_date: '',//
          form_return_date: '',//
          form_copy_quantity: '',//复
          form_use_day: '',//
          form_check_state: '',//申请单
          form_check_state_desc: '',//申请单当前
          form_check_reject_reason: '',//
          form_last_check_state: '',//上一
          form_last_check_state_desc: '',//上一流程
          form_next_check_state: '',//
          form_next_check_state_desc: '',//下一
          actual_recipients_id: '',//实际领
          actual_recipients_name: '',//实际领
          form_des: '',
          screate_user_id: '',//申,//请单创
          screate_user_name: '',//申,//请单创
          screate_date: '',//申请单
          update_user_id: '',//申请单修
          update_user_name: '',//申,//请单修
          update_date: '2019-09-09 13:00:00',//申请单
        },
        {
          tid: '待办列表',//待办表id
          page_state:'7',//页面跳转标识
          list_uuid: '111',//通知uuid
          form_uuid: '222',//关联申请信息表uuid
          batch_id: '环节id',//环节id
          submit_id: '提交批次id',
          list_state: '',// 待办通知状态（0待办）
          list_receive_id: '',//接收人id',
          list_receive_name: '',//接收人名称
          tcreate_user_id: '',//待办创建人id
          tcreate_user_name: '张枫',//待办创建人名称
          tcreate_date: '',//代办
          sid: '',//申请单
          seal_details_id: '',//表中的:章照详情idseal_
          seal_details_name: '刻章申请填报',//章,//照
          form_type: '',//申
          form_name: '',//
          form_reason: '',//
          form_if_secret: '',//是否涉密（0：否
          form_secret_reason: '',//
          form_if_sign: '',//是否需要相关部门会签（0：否
          form_if_approval: '',//申
          form_out_company: '',//提交对方
          form_dept_id: '',//申请或
          form_seal_demand: '和其他印章类型一致',//刻章规
          form_actual_usename: '',//实际使用
          form_borrow_date: '',//
          form_return_date: '',//
          form_copy_quantity: '',//复
          form_use_day: '',//
          form_check_state: '',//申请单
          form_check_state_desc: '',//申请单当前
          form_check_reject_reason: '',//
          form_last_check_state: '',//上一
          form_last_check_state_desc: '',//上一流程
          form_next_check_state: '',//
          form_next_check_state_desc: '',//下一
          actual_recipients_id: '',//实际领
          actual_recipients_name: '',//实际领
          form_des: '',
          screate_user_id: '',//申,//请单创
          screate_user_name: '',//申,//请单创
          screate_date: '',//申请单
          update_user_id: '',//申请单修
          update_user_name: '',//申,//请单修
          update_date: '2019-09-09 13:00:00',//申请单
        },
      ]
    }
  )*/
}

//工作台办结列表数据查询服务
export function finishedList(param) {
  return request('/microservice/management_of_seal/seal_completed_list_search',param);
 /* return ({
      RetCode: "1", RetVal: "1", DataRows: [
        {
          tid: '待办列表',//待办表id
          page_state:'0',//页面跳转标识
          list_uuid: '111',//通知uuid
          form_uuid: '222',//关联申请信息表uuid
          batch_id: '环节id',//环节id
          submit_id: '提交批次id',
          list_state: '',// 待办通知状态（0待办）
          list_receive_id: '',//接收人id',
          list_receive_name: '',//接收人名称
          tcreate_user_id: '',//待办创建人id
          tcreate_user_name: '张枫',//待办创建人名称
          tcreate_date: '',//代办
          sid: '',//申请单
          seal_details_id: '',//表中的:章照详情idseal_
          seal_details_name: '印章使用申请填报',//章,//照
          form_type: '',//申
          form_name: '',//
          form_reason: '',//
          form_if_secret: '',//是否涉密（0：否
          form_secret_reason: '',//
          form_if_sign: '',//是否需要相关部门会签（0：否
          form_if_approval: '',//申
          form_out_company: '',//提交对方
          form_dept_id: '',//申请或
          form_seal_demand: '',//刻章规
          form_actual_usename: '',//实际使用
          form_borrow_date: '',//
          form_return_date: '',//
          form_copy_quantity: '',//复
          form_use_day: '',//
          form_check_state: '',//申请单
          form_check_state_desc: '',//申请单当前
          form_check_reject_reason: '',//
          form_last_check_state: '',//上一
          form_last_check_state_desc: '',//上一流程
          form_next_check_state: '',//
          form_next_check_state_desc: '',//下一
          actual_recipients_id: '',//实际领
          actual_recipients_name: '',//实际领
          form_des: '',
          screate_user_id: '',//申,//请单创
          screate_user_name: '',//申,//请单创
          screate_date: '',//申请单
          update_user_id: '',//申请单修
          update_user_name: '',//申,//请单修
          update_date: '2019-09-09 13:00:00',//申请单
        },
        {
          tid: '待办列表',//待办表id
          page_state:'1',//页面跳转标识
          list_uuid: '111',//通知uuid
          form_uuid: '222',//关联申请信息表uuid
          batch_id: '环节id',//环节id
          submit_id: '提交批次id',
          list_state: '',// 待办通知状态（0待办）
          list_receive_id: '',//接收人id',
          list_receive_name: '',//接收人名称
          tcreate_user_id: '',//待办创建人id
          tcreate_user_name: '张枫',//待办创建人名称
          tcreate_date: '',//代办
          sid: '',//申请单
          seal_details_id: '',//表中的:章照详情idseal_
          seal_details_name: '印章外借申请填报',//章,//照
          form_type: '',//申
          form_name: '',//
          form_reason: '',//
          form_if_secret: '',//是否涉密（0：否
          form_secret_reason: '',//
          form_if_sign: '',//是否需要相关部门会签（0：否
          form_if_approval: '',//申
          form_out_company: '',//提交对方
          form_dept_id: '',//申请或
          form_seal_demand: '',//刻章规
          form_actual_usename: '',//实际使用
          form_borrow_date: '',//
          form_return_date: '',//
          form_copy_quantity: '',//复
          form_use_day: '',//
          form_check_state: '',//申请单
          form_check_state_desc: '',//申请单当前
          form_check_reject_reason: '',//
          form_last_check_state: '',//上一
          form_last_check_state_desc: '',//上一流程
          form_next_check_state: '',//
          form_next_check_state_desc: '',//下一
          actual_recipients_id: '',//实际领
          actual_recipients_name: '',//实际领
          form_des: '',
          screate_user_id: '',//申,//请单创
          screate_user_name: '',//申,//请单创
          screate_date: '',//申请单
          update_user_id: '',//申请单修
          update_user_name: '',//申,//请单修
          update_date: '2019-09-09 13:00:00',//申请单
        },
        {
          tid: '待办列表',//待办表id
          page_state:'2',//页面跳转标识
          list_uuid: '111',//通知uuid
          form_uuid: '222',//关联申请信息表uuid
          batch_id: '环节id',//环节id
          submit_id: '提交批次id',
          list_state: '',// 待办通知状态（0待办）
          list_receive_id: '',//接收人id',
          list_receive_name: '',//接收人名称
          tcreate_user_id: '',//待办创建人id
          tcreate_user_name: '张枫',//待办创建人名称
          tcreate_date: '',//代办
          sid: '',//申请单
          seal_details_id: '',//表中的:章照详情idseal_
          seal_details_name: '领导名章使用申请填报',//章,//照
          form_type: '',//申
          form_name: '',//
          form_reason: '',//
          form_if_secret: '',//是否涉密（0：否
          form_secret_reason: '',//
          form_if_sign: '',//是否需要相关部门会签（0：否
          form_if_approval: '',//申
          form_out_company: '',//提交对方
          form_dept_id: '',//申请或
          form_seal_demand: '',//刻章规
          form_actual_usename: '',//实际使用
          form_borrow_date: '',//
          form_return_date: '',//
          form_copy_quantity: '',//复
          form_use_day: '',//
          form_check_state: '',//申请单
          form_check_state_desc: '',//申请单当前
          form_check_reject_reason: '',//
          form_last_check_state: '',//上一
          form_last_check_state_desc: '',//上一流程
          form_next_check_state: '',//
          form_next_check_state_desc: '',//下一
          actual_recipients_id: '',//实际领
          actual_recipients_name: '',//实际领
          form_des: '',
          screate_user_id: '',//申,//请单创
          screate_user_name: '',//申,//请单创
          screate_date: '',//申请单
          update_user_id: '',//申请单修
          update_user_name: '',//申,//请单修
          update_date: '2019-09-09 13:00:00',//申请单
        },
        {
          tid: '待办列表',//待办表id
          page_state:'3',//页面跳转标识
          list_uuid: '111',//通知uuid
          form_uuid: '222',//关联申请信息表uuid
          batch_id: '环节id',//环节id
          submit_id: '提交批次id',
          list_state: '',// 待办通知状态（0待办）
          list_receive_id: '',//接收人id',
          list_receive_name: '',//接收人名称
          tcreate_user_id: '',//待办创建人id
          tcreate_user_name: '张枫',//待办创建人名称
          tcreate_date: '',//代办
          sid: '',//申请单
          seal_details_id: '',//表中的:章照详情idseal_
          seal_details_name: '领导名章外借申请填报',//章,//照
          form_type: '',//申
          form_name: '',//
          form_reason: '',//
          form_if_secret: '',//是否涉密（0：否
          form_secret_reason: '',//
          form_if_sign: '',//是否需要相关部门会签（0：否
          form_if_approval: '',//申
          form_out_company: '',//提交对方
          form_dept_id: '',//申请或
          form_seal_demand: '',//刻章规
          form_actual_usename: '',//实际使用
          form_borrow_date: '',//
          form_return_date: '',//
          form_copy_quantity: '',//复
          form_use_day: '',//
          form_check_state: '',//申请单
          form_check_state_desc: '',//申请单当前
          form_check_reject_reason: '',//
          form_last_check_state: '',//上一
          form_last_check_state_desc: '',//上一流程
          form_next_check_state: '',//
          form_next_check_state_desc: '',//下一
          actual_recipients_id: '',//实际领
          actual_recipients_name: '',//实际领
          form_des: '',
          screate_user_id: '',//申,//请单创
          screate_user_name: '',//申,//请单创
          screate_date: '',//申请单
          update_user_id: '',//申请单修
          update_user_name: '',//申,//请单修
          update_date: '2019-09-09 13:00:00',//申请单
        },
        {
          tid: '待办列表',//待办表id
          page_state:'4',//页面跳转标识
          list_uuid: '111',//通知uuid
          form_uuid: '222',//关联申请信息表uuid
          batch_id: '环节id',//环节id
          submit_id: '提交批次id',
          list_state: '',// 待办通知状态（0待办）
          list_receive_id: '',//接收人id',
          list_receive_name: '',//接收人名称
          tcreate_user_id: '',//待办创建人id
          tcreate_user_name: '张枫',//待办创建人名称
          tcreate_date: '',//代办
          sid: '',//申请单
          seal_details_id: '',//表中的:章照详情idseal_
          seal_details_name: '营业执照使用申请填报',//章,//照
          form_type: '',//申
          form_name: '',//
          form_reason: '',//
          form_if_secret: '',//是否涉密（0：否
          form_secret_reason: '',//
          form_if_sign: '',//是否需要相关部门会签（0：否
          form_if_approval: '',//申
          form_out_company: '',//提交对方
          form_dept_id: '',//申请或
          form_seal_demand: '',//刻章规
          form_actual_usename: '',//实际使用
          form_borrow_date: '',//
          form_return_date: '',//
          form_copy_quantity: '',//复
          form_use_day: '',//
          form_check_state: '',//申请单
          form_check_state_desc: '',//申请单当前
          form_check_reject_reason: '',//
          form_last_check_state: '',//上一
          form_last_check_state_desc: '',//上一流程
          form_next_check_state: '',//
          form_next_check_state_desc: '',//下一
          actual_recipients_id: '',//实际领
          actual_recipients_name: '',//实际领
          form_des: '',
          screate_user_id: '',//申,//请单创
          screate_user_name: '',//申,//请单创
          screate_date: '',//申请单
          update_user_id: '',//申请单修
          update_user_name: '',//申,//请单修
          update_date: '2019-09-09 13:00:00',//申请单
        },
        {
          tid: '待办列表',//待办表id
          page_state:'5',//页面跳转标识
          list_uuid: '111',//通知uuid
          form_uuid: '222',//关联申请信息表uuid
          batch_id: '环节id',//环节id
          submit_id: '提交批次id',
          list_state: '',// 待办通知状态（0待办）
          list_receive_id: '',//接收人id',
          list_receive_name: '',//接收人名称
          tcreate_user_id: '',//待办创建人id
          tcreate_user_name: '张枫',//待办创建人名称
          tcreate_date: '',//代办
          sid: '',//申请单
          seal_details_id: '',//表中的:章照详情idseal_
          seal_details_name: '营业执照外借申请填报',//章,//照
          form_type: '',//申
          form_name: '',//
          form_reason: '',//
          form_if_secret: '',//是否涉密（0：否
          form_secret_reason: '',//
          form_if_sign: '',//是否需要相关部门会签（0：否
          form_if_approval: '',//申
          form_out_company: '',//提交对方
          form_dept_id: '',//申请或
          form_seal_demand: '',//刻章规
          form_actual_usename: '',//实际使用
          form_borrow_date: '',//
          form_return_date: '',//
          form_copy_quantity: '',//复
          form_use_day: '',//
          form_check_state: '',//申请单
          form_check_state_desc: '',//申请单当前
          form_check_reject_reason: '',//
          form_last_check_state: '',//上一
          form_last_check_state_desc: '',//上一流程
          form_next_check_state: '',//
          form_next_check_state_desc: '',//下一
          actual_recipients_id: '',//实际领
          actual_recipients_name: '',//实际领
          form_des: '',
          screate_user_id: '',//申,//请单创
          screate_user_name: '',//申,//请单创
          screate_date: '',//申请单
          update_user_id: '',//申请单修
          update_user_name: '',//申,//请单修
          update_date: '2019-09-09 13:00:00',//申请单
        },
        {
          tid: '待办列表',//待办表id
          page_state:'6',//页面跳转标识
          list_uuid: '111',//通知uuid
          form_uuid: '222',//关联申请信息表uuid
          batch_id: '环节id',//环节id
          submit_id: '提交批次id',
          list_state: '',// 待办通知状态（0待办）
          list_receive_id: '',//接收人id',
          list_receive_name: '',//接收人名称
          tcreate_user_id: '',//待办创建人id
          tcreate_user_name: '张枫',//待办创建人名称
          tcreate_date: '',//代办
          sid: '',//申请单
          seal_details_id: '',//表中的:章照详情idseal_
          seal_details_name: '领导身份证复印件使用',//章,//照
          form_type: '',//申
          form_name: '',//
          form_reason: '',//
          form_if_secret: '',//是否涉密（0：否
          form_secret_reason: '',//
          form_if_sign: '',//是否需要相关部门会签（0：否
          form_if_approval: '',//申
          form_out_company: '',//提交对方
          form_dept_id: '',//申请或
          form_seal_demand: '',//刻章规
          form_actual_usename: '',//实际使用
          form_borrow_date: '',//
          form_return_date: '',//
          form_copy_quantity: '',//复
          form_use_day: '',//
          form_check_state: '',//申请单
          form_check_state_desc: '',//申请单当前
          form_check_reject_reason: '',//
          form_last_check_state: '',//上一
          form_last_check_state_desc: '',//上一流程
          form_next_check_state: '',//
          form_next_check_state_desc: '',//下一
          actual_recipients_id: '',//实际领
          actual_recipients_name: '',//实际领
          form_des: '',
          screate_user_id: '',//申,//请单创
          screate_user_name: '',//申,//请单创
          screate_date: '',//申请单
          update_user_id: '',//申请单修
          update_user_name: '',//申,//请单修
          update_date: '2019-09-09 13:00:00',//申请单
        },
        {
          tid: '待办列表',//待办表id
          page_state:'7',//页面跳转标识
          list_uuid: '111',//通知uuid
          form_uuid: '222',//关联申请信息表uuid
          batch_id: '环节id',//环节id
          submit_id: '提交批次id',
          list_state: '',// 待办通知状态（0待办）
          list_receive_id: '',//接收人id',
          list_receive_name: '',//接收人名称
          tcreate_user_id: '',//待办创建人id
          tcreate_user_name: '张枫',//待办创建人名称
          tcreate_date: '',//代办
          sid: '',//申请单
          seal_details_id: '',//表中的:章照详情idseal_
          seal_details_name: '刻章申请填报',//章,//照
          form_type: '',//申
          form_name: '',//
          form_reason: '',//
          form_if_secret: '',//是否涉密（0：否
          form_secret_reason: '',//
          form_if_sign: '',//是否需要相关部门会签（0：否
          form_if_approval: '',//申
          form_out_company: '',//提交对方
          form_dept_id: '',//申请或
          form_seal_demand: '和其他印章类型一致',//刻章规
          form_actual_usename: '',//实际使用
          form_borrow_date: '',//
          form_return_date: '',//
          form_copy_quantity: '',//复
          form_use_day: '',//
          form_check_state: '',//申请单
          form_check_state_desc: '',//申请单当前
          form_check_reject_reason: '',//
          form_last_check_state: '',//上一
          form_last_check_state_desc: '',//上一流程
          form_next_check_state: '',//
          form_next_check_state_desc: '',//下一
          actual_recipients_id: '',//实际领
          actual_recipients_name: '',//实际领
          form_des: '',
          screate_user_id: '',//申,//请单创
          screate_user_name: '',//申,//请单创
          screate_date: '',//申请单
          update_user_id: '',//申请单修
          update_user_name: '',//申,//请单修
          update_date: '2019-09-09 13:00:00',//申请单
        },
      ]
    }
  )*/
}

//待办已办办结详情查询
export function applyDetail(param) {
  return request('/microservice/management_of_seal/seal_to_do_form_search',param);

}

//外借类和刻章类审批通过
export function borrowApproval(param) {
  return request('/microservice/allmanagementofseal/sealOfBorrowAndCarve/approvalPass',param);
 /* return ({
      RetCode: "1", RetVal: "1"
    }
  )*/
}

//外借类和刻章类审批退回
export function borrowReturn(param) {
  return request('/microservice/allmanagementofseal/sealOfBorrowAndCarve/approvalRefuse',param);
  /*return ({
      RetCode: "1", RetVal: "1"
    }
  )*/
}

//附件查询
export function fileSearch(param) {
  return request('/microservice/management_of_seal/seal_upload_search',param);
 /* return ({
      RetCode: "1", RetVal: "1",
      DataRows:[
        {
          id:'',// --主键id
          form_uuid:'',//申请单uuid
          upload_id:'',// 上传材料id
          upload_name:'材料测试1',//上传材料名称
          upload_number:'3',//上传材料分数
          upload_url:'',// 相对路径
          upload_real_url:'',// 绝对路径
          upload_type:'0',//附件类型（0:申请材料1:领取或使用个人信息图片2:领取或使用材料信息图片 3：归还时个人信息图片4：归还时材料信息图片）
          upload_desc:'',//附件备注
          create_user_id:'',// 创建者id
          create_user_name:'',// 创建者名称
          create_date:'',// 创建时间
          update_user_id:'',// 修改者id
          update_user_name:'',// 修改者名称
          update_date:'',// 修改时间
        }
      ]
    }
  )*/
}

//附件删除
export function deleteUpload(param) {
  return request('/microservice/management_of_seal/seal_upload_delete',param);

}


//审批环节查询
export function judgeHistory(param) {
  return request('/microservice/allmanagementofseal/sealOfBorrowAndCarve/approvalProcessSearch',param);
  /*return ({
      RetCode: "1", RetVal: "1"
    }
  )*/
}
// 申请单终止
export function sealRequesitionStop(param) {
  return request('/microservice/allmanagementofseal/sealOfBorrowAndCarve/requisitionStop', param);
  // return {
  //   "RetCode": "1",
  //   "RetVal": "1"
  // }
}
// 个人查询页面申请单删除服务
export function  sealPersonalDel(param) {
  return request('/microservice/allmanagementofseal/sealOfBorrowAndCarve/requisitionDelete',param);
  // return {
  //   "RetCode": "1",
  //   "RetVal": "1"
  // }
}
// 申请信息详情查询
export function applyDetailSerch(param) {
  return request('/microservice/management_of_seal/seal_form_search',param);
 /* return {
    RetCode: "1",
    RetVal: "1",
    "DataRows":[
      {
        sid: '', //申请单排序id
        seal_type_details: "",//表中的:章照详情idseal_uuid
        seal_details_name: "详情名称",//详情名称
        seal_type_name: '用章类型',//大类名称
        page_state: "0",//页面跳转标识（0：印章使用1：印章外借2：领导名章使用3：领导名章外借4：营业执照使用5：营业执照外借6：领导身份证复印件使用7：刻章）
        form_type: "申请单类型",//申请单类型
        form_name: "刻章名称",//刻章名称
        form_reason: "用印事由",//用印事由
        form_if_secret: '0',//是否涉密（0：否1：是）
        form_secret_reason: "涉密原因",//涉密原因
        form_if_sign: "0",//是否需要相关部门会签（0：否1：是）
        dept_name: "会签部门名称",//会签部门名称
        form_if_approval: "申请单范围",//申请单范围
        form_if_approval_desc: "form_if_approval_desc",
        form_out_company: "提交对方单位名称",//提交对方单位名称
        form_dept_id: "申请或借用部门",//申请或借用部门
        form_seal_demand: "刻章规格及要求",//刻章规格及要求
        form_actual_usename: "实际使用人/部门",//实际使用人/部门
        form_borrow_date: "2019-09-08 3:00",//借用时间
        form_return_date: "2019-09-08 6:00",//归还时间
        form_copy_quantity:"4",//复印件分数
        form_use_day: "3",//有效天数
        form_check_state: "申请单当前状态",//申请单当前状态
        form_check_state_desc: "申请单当前状态描述",//申请单当前状态描述
        form_check_reject_reason: "退回原因",//退回原因
        form_last_check_state: "上一流程状态",//上一流程状态
        form_last_check_state_desc: "上一流程状态描述",//上一流程状态描述
        form_next_check_state: "下一环节状态",//下一环节状态
        form_next_check_state_desc: "下一环节状态描述",//下一环节描述
        actual_recipients_id: "实际领取人id",//实际领取人id
        actual_recipients_name: "实际领取人名称",//实际领取人名称
        form_desc: "备注",//备注
        screate_user_id: "申请单创建人id",//申请单创建人id
        screate_user_name: "申请单创建人名称",//申请单创建人名称
        screate_date: "2019-03-06",//申请单创建时间
        update_user_id: "申请单修改人id",//申请单修改人id
        update_user_name: "申请单修改人名称",//申请单修改人名称
        update_date: "2019-08-06",//申请单修改时间
      }
    ]
  }*/
}
// 个人查询申请页 用印查询 附件查询
export function uploadSearch(param) {
  // return request('/microservice/management_of_seal/seal_upload_search',param);
  return {
    RetCode: "1",
    RetVal: "1",
    "DataRows":[
      {
        id: "22", //--主键id
        form_uuid: "116516",//申请单uuid
        upload_id: "5920", //上传材料id
        upload_name: "文件名1",//上传材料名称
        upload_number: "3",//上传材料份数
        upload_url: "", //相对路径
        upload_real_url: "", //绝对路径
        upload_type: "申请材料",//附件类型（0:申请材料1:领取或使用个人信息图片2:领取或使用材料信息图片 3：归还时个人信息图片4：归还时材料信息图片）
        upload_desc: "附件备注1",//附件备注
        create_user_id: "0052", //创建者id
        create_user_name: "李斯", //创建者名称
        create_date: "2019-07-08", //创建时间
        update_user_id: "0230", //修改者id
        update_user_name: "章叁",// 修改者名称
        update_date: "2019-08-02" //修改时间
      },
      {
        id: "222", //--主键id
        form_uuid: "11651216",//申请单uuid
        upload_id: "592120", //上传材料id
        upload_name: "文件名211",//上传材料名称
        upload_number: "5",//上传材料份数
        upload_url: "", //相对路径
        upload_real_url: "", //绝对路径
        upload_type: "领取或使用个人信息图片",//附件类型（0:申请材料1:领取或使用个人信息图片2:领取或使用材料信息图片 3：归还时个人信息图片4：归还时材料信息图片）
        upload_desc: "附件备注2",//附件备注
        create_user_id: "0052", //创建者id
        create_user_name: "李斯q", //创建者名称
        create_date: "2019-07-08", //创建时间
        update_user_id: "0230", //修改者id
        update_user_name: "章叁qw",// 修改者名称
        update_date: "2019-08-02" //修改时间
      },
    ]
  }
}
// 外借类与刻章类申请单审批环节查询 （审批流程）
export function  approvalProcess(param) {
  return request('/microservice/allmanagementofseal/sealOfBorrowAndCarve/approvalProcessSearch',param);
  /*return {
    "RetCode": "1",
    "RetVal": "1",
    "DataRows":[
      {
        "process_state":"0",  //--环节状态,0:办毕 1:办理中
        "process_name":"环节名称1",  //--环节名称
        "approval_person":"薛刚",  //--审批人姓名
        "approval_type":"审批类型1",  //--审批类型
        "approval_desc":"审批意见1",  //--审批意见
        "approval_datetime":"2019-09-05"   //--审批时间
      },
      {
        "process_state":"1",  //--环节状态,0:办毕 1:办理中
        "process_name":"环节名称11",  //--环节名称
        "approval_person":"薛刚",  //--审批人姓名
        "approval_type":"审批类型11",  //--审批类型
        "approval_desc":"审批意见11",  //--审批意见
        "approval_datetime":"2019-09-10"   //--审批时间
      },
    ]
  }*/
}
// 用印配置页面 新增用印类型名称
export function  sealTypeName(param) {
  return request('/microservice/management_of_seal/seal_type_add',param);
}
// 用印类型配置(查询)
export function sealTypeConfigSearch1(param) {
  //debugger
  return request('/microservice/management_of_seal/seal_type_list_seach',param);
}
// 用章详情配置（二级表格数据） 传入arg_seal_uuid章照类型id(查询)
export function sealTypeConfigDetailSearch(param) {
  return request('/microservice/management_of_seal/seal_details_list_seach',param);
}
// 删除用印配置操作
export function sealTypeDelete(param) {
  return request('/microservice/management_of_seal/seal_type_delete',param);
}

//印章申请填报点击保存
export function sealComSave(param) {
  return request('/microservice/allmanagementofseal/sealOfUse/SealFormSave',param);
  /*return {
    "RetCode": "1",
    "RetVal": "1"
  }*/
}

//印章申请填报点击提交
export function sealComSubmit(param) {
  return request('/microservice/allmanagementofseal/sealOfUse/SealFormUpdate',param);
 /* return {
    "RetCode": "1",
    "RetVal": "1"
  }*/
}

//印章审批通过
export function sealComApproval(param) {
  return request('/microservice/allmanagementofseal/sealOfUse/SealApproved',param);
  /* return {
     "RetCode": "1",
     "RetVal": "1"
   }*/
}

//印章审批退回
export function sealComRefuse(param) {
  return request('/microservice/allmanagementofseal/sealOfUse/SealReturn',param);
  /* return {
     "RetCode": "1",
     "RetVal": "1"
   }*/
}
//印章类型下拉框查询
export function sealList(param) {
  return request('/microservice/management_of_seal/seal_list_search',param);
  /*return {
    "RetCode": "1",
    "RetVal": "1",
    DataRows: [

      {
        seal_details_id:'1234344',// ---章照详情id
        seal_uuid:'1234567890', //---章照uuid
        seal_details_name:'证照名称',//---章照详情名称
        seal_details_state:'',//---章照详情状态
        create_user_id:'',//---创建人
        create_user_name:'',
      }
    ]
  }*/
}

//院领导名章点击保存
export function sealLeaderSave(param) {
  return request('/microservice/allmanagementofseal/sealOfUse/LeadersealFormSave',param);
  /*return {
    "RetCode": "1",
    "RetVal": "1"
  }*/
}

//院领导名章点击提交
export function sealLeaderSubmit(param) {
  return request('/microservice/allmanagementofseal/sealOfUse/LeadersealFormUpdate',param);
  /*return {
    "RetCode": "1",
    "RetVal": "1"
  }*/
}

//院领导名章点击同意
export function sealLeaderApproval(param) {
  return request('/microservice/allmanagementofseal/sealOfUse/LeadersealApproved',param);
  /*return {
    "RetCode": "1",
    "RetVal": "1"
  }*/
}

//院领导名章点击退回
export function sealLeaderRefuse(param) {
  return request('/microservice/allmanagementofseal/sealOfUse/LeadersealReturn',param);
  /*return {
    "RetCode": "1",
    "RetVal": "1"
  }*/
}

//复印件点击保存   (营业执照复印件和院领导名章复印件)
export function businessLicenseSave(param) {
  return request('/microservice/allmanagementofseal/sealOfUse/PermitFormSave',param);
  /*return {
    "RetCode": "1",
    "RetVal": "1"
  }*/
}

//复印件点击提交  (营业执照复印件和院领导名章复印件)
export function businessLicenseSubmit(param) {
  return request('/microservice/allmanagementofseal/sealOfUse/PermitFormUpdate',param);
 /* return {
    "RetCode": "1",
    "RetVal": "1"
  }*/
}

//营业执照使用点击通过
export function businessLicenseApproval(param) {
  return request('/microservice/allmanagementofseal/sealOfUse/PermitApproved',param);
  /*return {
    "RetCode": "1",
    "RetVal": "1"
  }*/
}

//营业执照使用点击退回
export function businessLicenseRefuse(param) {
  return request('/microservice/allmanagementofseal/sealOfUse/PermitReturn',param);
  /*return {
    "RetCode": "1",
    "RetVal": "1"
  }*/
}

//外借类与刻章类点击保存
export function sealSave(param) {
  return request('/microservice/allmanagementofseal/sealOfBorrowAndCarve/borrowAndCarveSaveOrUpdate',param);
  /*return {
    "RetCode": "1",
    "RetVal": "1"
  }*/
}

//外借类与刻章类点击提交
export function sealSubmit(param) {
  return request('/microservice/allmanagementofseal/sealOfBorrowAndCarve/borrowAndCarveSubmit',param);
 /* return {
    "RetCode": "1",
    "RetVal": "1"
  }*/
}

//院领导身份证使用点击通过
export function leaderIDApproval(param) {
  return request('/microservice/allmanagementofseal/sealOfUse/LeadersealApproved',param);
  /*return {
    "RetCode": "1",
    "RetVal": "1"
  }*/
}

//院领导身份证使用点击退回
export function leaderIDRefuse(param) {
  return request('/microservice/allmanagementofseal/sealOfUse/LeadersealReturn',param);
}

// 用章详情配置(增加)
export function sealTypeConfigAddDetail(param) {
  return request('/microservice/management_of_seal/seal_details_add',param);
}
//用章类型配置(修改)
export function sealTypeConfigUpdate(param) {
  return request('/microservice/management_of_seal/seal_type_update',param);
}
//用章详情配置(修改)
export function sealTypeConfigDetailUpdate(param) {
  return request('/microservice/management_of_seal/seal_details_update',param);
}

// 用章详情配置(删除)
export function sealTypeConfigDelDetail(param) {
  return request('/microservice/management_of_seal/seal_details_delete',param);
}

// 办公室管理员配置页面列表查询
export function sealTypeManagerListSearch(param) {
  return request('/microservice/management_of_seal/managerListSearch',param);
}

// 办公室管理员新增与修改
export function sealManagerSaveOrUpdate(param) {
  return request('/microservice/allmanagementofseal/sealOfBorrowAndCarve/managerSaveOrUpdate',param);
}

// 办公室管理员删除
export function sealTypeConfigManagerDel(param) {
  return request('/microservice/allmanagementofseal/sealOfBorrowAndCarve/managerDelete',param);
}

// 部门列表查询 departmentListQuery
export function searchDeptList(param) {
  return request('/microservice/allmanagementofseal/sealOfBorrowAndCarve/departmentListQuery',param);
}

// 部门员工查询
export function deptUserListQuery(param) {
  return request('/microservice/allmanagementofseal/sealOfBorrowAndCarve/deptUserListQuery',param);
}

//特殊事项查询
export function personSpacialList(param) {
  return request('/microservice/management_of_seal/seal_special_list_search',param);

}

//发送钉钉消息
export function sendMessages(param) {
  return request('/microservice/allmanagementofseal/sealOfUse/SendMessage',param);

}
