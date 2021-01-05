/**
 * 作者：邓广晖
 * 创建日期：2019-07-15
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：工时配置 服务
 */
import request from '../../utils/request';

//查询配置列表
export function queryConfigList(params) {
    /*return ({
        "RetVal":"1",
        "RetCode":"1",
        "RowCount": "35",
        "headIndex": [
            {
                key: 'state_code',
                value: '状态码'
            },
            {
                key: 'state_name',
                value: '状态名称'
            },
            {
                key: 'state_type',
                value: '状态类型'
            },
            {
                key: 'remarks',
                value:'描述'
            }
        ],
        "DataRows": [
            {
                key: 1,
                id: 'asdfasdf',
                state_code: 'asdfas',
                state_name: '状态2asd',
                state_type: '研发ryur3',
                remarks: '测试项目大'
            },
            {
                key: 2,
                id: 'fadsfasd',
                state_code: 'asdfas',
                state_name: '状态24545',
                state_type: '研发35454',
                remarks: '测卡机了科技拉的屎项目'
            },
            {
                key: 3,
                id: 'tyitt',
                state_code: 'asdfas 我二哥',
                state_name: '状态2台湾人体',
                state_type: '研发3 是的 ',
                remarks: '测试项目 是梵蒂冈'
            },
        ]
    });*/
    return request('/microservice/timesheet/timesheet_timesheetmanage_timesheetconfiguration_select', params);
}

//新增配置
export function newWorkTimeConfig(params) {
    return request('/microservice/timesheet/timesheet_timesheetmanage_timesheetconfiguration_insert', params);
}

//修改配置
export function editWorkTimeConfig(params) {
    return request('/microservice/timesheet/timesheet_timesheetmanage_timesheetconfiguration_update', params);
}

//配置删除
export function deleteWorkTimeConfig(params) {
    return request('/microservice/timesheet/timesheet_timesheetmanage_timesheetconfiguration_delete', params);
}

