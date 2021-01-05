/**
 * 作者：邓广晖
 * 创建日期：2018-05-18
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：共用的方法
 */
import Cookie from 'js-cookie';
// 生成uuid方法
export function getUuid(len, radix) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    let uuid = [];
    radix = radix || chars.length;
    if (len) {
        for (let i = 0; i < len; i++) {
            uuid[i] = chars[0 | Math.random() * radix];
        }
    } else {
        let r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        for (let i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
}


// 获取用户id
export function getUserId() {
    return Cookie.get('userid');
}

// 获取租户名称
export function getTenantName() {
    return '中国联通';
}

// 获取用户名称
export function getUserName() {
    return Cookie.get('username');
}

// 获取租户id
export function getTenantId() {
    return Cookie.get('tenantid');
}

// 获取组织id
export function getOrgId() {
    return Cookie.get('dept_id');
}

// 员工id
export function getStaffId() {
    return Cookie.get('staff_id');
}

// 获取模块url
export function getModuleUrlIndex() {
    return window.location.hash.replace('#/', '').split('?')[0].split('/')[1];
    /* let url = window.location.hash.replace('#/','').split('?')[0];
    let moduleUrl = '';
    switch (url) {
        case 'systemManager/tenantManager':
            moduleUrl = 'tenantmgt';                 //租户管理
            break;
        case 'systemManager/subsystemManager':
            moduleUrl = 'sysmgt';                    //子系统管理
            break;
        case 'systemManager/moduleManager':
            moduleUrl = 'modulemgt';                 //模块管理
            break;
        case 'authorityManager/moduleGroupManager':
            moduleUrl = 'modulegrpmgt';              //模块组管理
            break;
        case 'authorityManager/roleManager':
            moduleUrl = 'rolemgt';                   //角色管理
            break;
        case 'authorityManager/memAthrManager':
            moduleUrl = 'userauthmgt';               //人员权限管理
            break;
        default:
            moduleUrl = '';
    }
    return moduleUrl; */
}

// 转变为千分位
export function change2Thousands(value) {
    if (value !== undefined) {
        return value.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
    } else {
        return '';
    }
}

// 判断元素是否在数组中
export function isInArray(arr, value) {
    for (let i = 0; i < arr.length; i++) {
        if (value === arr[i]) {
            return true;
        }
    }
    return false;
}

// 基本信息中，返回变化的数据
export function getBasicInfoChangeData(oldObj, newObj) {
    let obj = {};
    for (let item in newObj) {
        //如果旧数据没有这个字段，将其置为“”
        if (!(item in oldObj)) {
            oldObj[item] = '';
        }
        //对于金额类别（总预算，预估工作量）,需要使用数字型进行比较
        if (item === 'replace_money' || item === 'fore_workload') {
            if (Number(oldObj[item]) !== Number(newObj[item])) {
                obj[item] = newObj[item];
            }
        }
        else if (item === 'begin_time' || item === 'end_time') {
            //对于时间类别（开始时间，结束时间），将moment对象转为字符串
            if (oldObj[item] !== newObj[item].format("YYYY-MM-DD")) {
                obj[item] = newObj[item].format("YYYY-MM-DD");
            }
        }
        else {
            if (oldObj[item].trim() !== newObj[item].trim()) {
                obj[item] = newObj[item].trim();
            }
        }
    }
    return obj;
}

