/**
 * 作者：孙姣姣
 * 日期：2017-9-12
 * 邮件：sunjiaojiao@163.com
 * 文件说明：项目启动中涉及到的常量
 */
import { Select} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const Option = Select.Option;

import {
    OU_HQ_NAME_CN,
    OU_HAERBIN_NAME_CN,
    OU_JINAN_NAME_CN,
    OU_XIAN_NAME_CN,
    OU_GUANGZHOU_NAME_CN,
    PROJ_BUSSINESS_ID_1,
    PROJ_BUSSINESS_ID_2,
    PROJ_BUSSINESS_ID_3,
    PROJ_BUSSINESS_ID_4,
    PROJ_BUSSINESS_ID_5
} from '../../utils/config';

const ouDataList = [
    OU_HQ_NAME_CN,
    OU_HAERBIN_NAME_CN,
    OU_JINAN_NAME_CN,
    OU_XIAN_NAME_CN,
    OU_GUANGZHOU_NAME_CN
];

const ouOptionList = ouDataList.map((item) => {
    return (
        <Option key={item} value={item}>
            {item}
        </Option>
    )
});

const CHECK_INFO_RULE = '请检查输入项是否满足规则';

//获取uuid
function getuuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;
    if (len) {
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
        var r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random()*16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
}
function add0(m){return m<10?'0'+m:m }
//格式化日期+时间
 function formatData(){
    var time = new Date();
    var y = time.getFullYear();
    var m = time.getMonth()+1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y+'-'+add0(m)+'-'+add0(d)+" "+add0(h)+':'+add0(mm)+':'+add0(s);
}
//判断是否对象为空
function isEmptyObject(e) {
  var t;
  for (t in e)
      return !1;
  return !0;
}

//项目分类，项目编码（内部），项目编码（PMS）的提示信息
const projLabelText = (<div>
  <div>项目类、项目类(纯第三方)和小组类的团队系数、投资替代额、预估工作量必填；</div>
  <div>支撑类的团队系数、投资替代额、预估工作量非必填。</div>
</div>);
const projCodeText = (<div>
  <div>生产编码:做为软研院项目内部管理唯一标识。
  </div>
</div>);
const oldProjCodeText = (<div>
  <div>项目编码(PMS):通过PMS系统产生的编码，例如科技创新类项目、第三方采购项目。
  </div>
</div>);


//判断元素是否在数组中
function isInArray(arr,value){
  for(let i = 0; i < arr.length; i++){
    if(value === arr[i]){
      return true;
    }
  }
  return false;
}

//将文本中<br>标签替换成\r\n
function changeBr2RN(value) {
    if(typeof(value) === 'string'){
        let tempValue = value.replace(/<br>/g,'\r\n'); //去除br
        tempValue = tempValue.replace(/&gt;/g,'>');    //转 >
        tempValue = tempValue.replace(/&lt;/g,'<');    //转 <
        return tempValue;
    }
    else if (value === undefined) {
        return ''
    }
    else{
        return value;
    }
}

//根据ou得到bussiness_id
function getOuBussinessId(ou){
    switch (ou) {
        case OU_HQ_NAME_CN :
            return PROJ_BUSSINESS_ID_1;
            break;
        case OU_HAERBIN_NAME_CN :
            return PROJ_BUSSINESS_ID_2;
            break;
        case OU_JINAN_NAME_CN :
            return PROJ_BUSSINESS_ID_3;
            break;
        case OU_XIAN_NAME_CN:
            return PROJ_BUSSINESS_ID_4;
            break;
        case OU_GUANGZHOU_NAME_CN:
            return PROJ_BUSSINESS_ID_5;
            break;
        default:
            return '';
    }
}

function setFieldItemData (obj,isChange) {
    const fieldList = [
        'proj_name',     'proj_code',     'proj_shortname',  'proj_type',     'proj_ratio',
        'replace_money', 'fore_workload', 'begin_time',      'end_time',      'dept_name',
        'mgr_name',      'pu_dept_name',  'client',          'mandator',      'client_tel',
        'client_mail',   'work_target',   'proj_range',      'quality_target','proj_check',
        'proj_repair'
    ];
    let newObj = {};
    for (let i = 0; i < fieldList.length; i++) {
        //对于时间类，用moment
        if (fieldList[i] === 'begin_time' || fieldList[i] === 'end_time' ) {
            newObj[fieldList[i]] = obj[fieldList[i]] ? moment(obj[fieldList[i]]) : null;
        } else {
            newObj[fieldList[i]] = obj[fieldList[i]] ? changeBr2RN(obj[fieldList[i]]).toString() : '';
        }
    }
    //如果是变更时或者TMO修改时，下面几项不能修改
    if (isChange === 'isChange' || isChange === 'TMOmodify') {
        delete newObj.proj_code;
        delete newObj.proj_type;
        delete newObj.begin_time;
        delete newObj.mgr_name;
        delete newObj.dept_name;
        //proj_label不在主项目信息里面
        if (isChange === 'TMOmodify') {
            //如果是TMO修改，结束时间也不能修改
            delete newObj.end_time;
            delete newObj.replace_money;
            delete newObj.fore_workload;
        }
    }
    return newObj;
}

//基本信息中，返回变化的数据
function getBasicInfoChangeData(oldObj, newObj) {
    let obj = {};
    for ( let item in newObj) {
        //如果新数据未定义或者为null，将其置为“”
        if (newObj[item] === undefined || newObj[item] === null) {
            newObj[item] = '';
        }
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

function numToCh(index) {
    if (index === 0) {
        return '';
    } else if ( index === 1) {
        return '一期';
    } else if ( index === 2) {
        return '二期';
    } else if ( index === 3) {
        return '三期';
    } else if ( index === 4) {
        return '四期';
    } else if ( index === 5) {
        return '五期';
    } else if ( index === 6) {
        return '六期';
    } else if ( index === 7) {
        return '七期';
    } else if ( index === 8) {
        return '八期';
    } else if ( index === 9) {
        return '九期';
    } else if ( index === 10) {
        return '十期';
    } else if ( index === 11) {
        return '十一期';
    } else if ( index === 12) {
        return '十二期';
    } else if ( index === 13) {
        return '十三期';
    } else if ( index === 14) {
        return '十四期';
    } else if ( index === 15) {
        return '十五期';
    } else if ( index === 16) {
        return '十六期';
    } else if ( index === 17) {
        return '十七期';
    } else if ( index === 18) {
        return '十八期';
    } else if ( index === 19) {
        return '十九期';
    } else if ( index === 20) {
        return '二十期';
    }
}

function pmsStageList(stageLength) {
    let pmsStageOption = [];
    pmsStageOption.push(
        <Option value={'0'} key={'0'} style={{width:80}}>
            {''}
        </Option>
    );
    for (let i = 0; i < stageLength; i++) {
        pmsStageOption.push(
            <Option value={(i+1).toString()} key={(i+1).toString()} style={{width:80}}>
                {numToCh(i+1)}
            </Option>
        );
    }
    return pmsStageOption;
}


function checkProjLabel (param){
    switch (param) {
        case '0':
            return '项目制';
            break;
        case '1':
            return '小组制';
            break;
        case '2':
            return '支撑制';
            break;
    }
};

//项目类型展示
function checkProjType (param){
    switch (param) {
        case 'W1':
            return '战略预研项目（W1）';
            break;
        case 'W2':
            return '常态化需求项目（W2）';
            break;
        case 'W3':
            return '工程建设类项目（W3）';
            break;
        case 'W4':
            return '联合创新类项目（W4）';
            break;
        case 'W5':
            return '嵌入式类项目（W5）';
            break;
        case 'W6':
            return '直接维护类项目（W6）';
            break;
        case 'N1':
            return '内部预研项目（N1）';
            break;
        case 'N2':
            return '内部委托项目（N2）';
            break;
        case 'N3':
            return '内部常态化项目（N3）';
            break;
        case 'R1':
            return '科技创新项目（R1）';
            break;
        case 'R2':
            return '传统工程项目（R2）';
            break;
        case 'R3':
            return '自主研发项目（R3）';
            break;
        case 'R4':
            return '第三方承建项目（R4）';
            break;
        case 'R5':
            return '成果推广项目（R5）';
            break;
        case 'R6':
            return '基础设施项目（R6）';
            break;
        case 'Q1':
            return '嵌入式团队（Q1）';
            break;
        case 'O1':
            return '自主运营项目（O1）';
            break;
        case 'O2':
            return '第三方运营项目（O2）';
            break;
        case 'H1':
            return '传统硬件设备采购（H1）';
            break;
        case 'H2':
            return '云公司租赁（H2）';
            break;
    }
};



export default {
    getuuid,
    formatData,
    isEmptyObject,
    projLabelText,
    projCodeText,
    oldProjCodeText,
    isInArray,
    getOuBussinessId,
    ouOptionList,
    setFieldItemData,
    getBasicInfoChangeData,
    changeBr2RN,
    numToCh,
    pmsStageList,
    CHECK_INFO_RULE,
    checkProjLabel,
    checkProjType,
}
