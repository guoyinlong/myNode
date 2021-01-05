import React from 'react';
import { connect } from 'dva';
import Style from '../../../components/employer/employer.less';
import { Link } from 'dva/router';
import {Icon} from 'antd';
import style from '../evaluation/staffEvaluation.less'


class  LabelPage extends React.Component{

 human_menu=[
    {
      name: '培训管理',
      icon: 'setting',
      key: 'train',
      child: [
        {
          key: 'trainPlanAndImport',
          name: '培训计划导入',
          module_id: 'aec7452aa79411e997a00242ac110003'
        },
        {
          key: 'trainPlanList',
          name: '培训计划管理',
          module_id: '22219b3fa6e911e997a00242ac110003'
        },
        {
          key: 'train_index',
          name: '培训执行管理',
          module_id: 'ad55c38e5d0211e9a825008cfa042288'
        },
        {
          key: 'trainStatistic',
          name: '培训统计管理',
          module_id: 'ccca346752e111eaa9680242ac110002'
        },
        {
          key: 'trainManage',
          name: '培训配置管理',
          module_id: 'dde673f352e111eaa9680242ac110002'
        },
        {
          key: 'train_do',
          name: '待办/已办审批',
          module_id: '69543b14a6a411e997a00242ac110003'
        },
        {
          key: 'personalClassQueryIndex',
          name: '个人培训情况查询',
          module_id: '4bf66f29c7e711e997a00242ac110003'
        },
        {
          key: 'importClassPerson',
          name: '核心班名单录入',
          module_id: '491f0e10ad1211e997a00242ac110003'
        },
        {
          key: 'create_train_apply',
          name: '培训申请',
          module_id: '2c3d6163af6c11e997a00242ac110003'
        }
      ]
    },
    {
      name: '劳动用工',
      icon: 'setting',
      key: 'labor',
      child: [
        {
          key: 'index',
          name: '离职管理',
          module_id: 'f585b434670011e997a00242ac110003'
        },
        {
          key: 'staffLeave_index',
          name: '查询待办/已办审批',
          module_id: 'c698e64b713611e997a00242ac110003'
        },
        {
          key: 'contractSearch',
          name: '员工劳动合同查询',
          module_id: '6ee5b8d3db4b11e997a00242ac110003'
        }
      ]
    },
    {
      name: '人力管理',
      icon: 'setting',
      key: 'hr',
      child: [
        {
          key: 'basicInfo',
          name: '基本信息管理',
          module_id: '579c325c9c5111e7ad99008cfa042288',
          display:0
        },
        {
          key: 'staffImport',
          name: '员工信息导入',
          module_id: '6713b6e49c5111e7ad99008cfa042288',
          display:1
        },
        {
          key: 'staffInfoSearch',
          name: '员工信息查询',
          module_id: '6dec0d079c5111e7ad99008cfa042288',
          display:0
        },
        {
          key: 'staffInfoEdit',
          name: '个人信息维护',
          module_id: '731dbc559c5111e7ad99008cfa042288',
          display:0
        },
        {
          key: 'staffPostEdit',
          name: '员工职务信息维护',
          module_id: '77f1e4e99c5111e7ad99008cfa042288',
          display:0
        },
        {
          key: 'staffDeptEdit',
          name: '员工部门信息维护',
          module_id: '7d2a6c159c5111e7ad99008cfa042288',
          display:0
        },
        {
          key: 'staffLeave',
          name: '员工离职',
          module_id: '881a470e9c5111e7ad99008cfa042288',
          display:0
        },
        {
          key: 'deptInfo',
          name: '部门负责人维护',
          module_id: '8e6fb3609c5111e7ad99008cfa042288',
          display:1
        },
        {
          key: 'postInfo',
          name: '组织单元职务维护',
          module_id: '9439a2379c5111e7ad99008cfa042288',
          display:1
        },
        {
          key: 'personnelInfo',
          name: '人员变动统计维护',
          module_id: '98f41fc49c5111e7ad99008cfa042288',
          display:0
        },
        {
          key: 'import',
          name: '全面激励信息',
          module_id: '7cb83a76c1fe11e8a340008cfa042288',
          display:0
        },
        {
          key: 'encoAuthSetting',
          name: '激励信息权限设置',
          module_id: '91fbaf2130fc11e99383782bcb561704',
          display:1
        }
      ]
    },
    {
      name: '中层考核',
      icon: 'setting',
      key: 'leader',
      child: [
        {
          key: 'resultInfo',
          name: '结果录入',
          module_id: '7457777d17f411ea91530242ac110003'
        },
        {
          key: 'manage',
          name: '指标管理',
          module_id: '248f588aa25911e7ad99008cfa042288'
        },
        {
          key: 'performance',
          name: '年度考核',
          module_id: 'a5f4cbcc17f411ea91530242ac110003'
        },
        {
          key: 'search',
          name: '指标查询',
          module_id: '248b8842a25911e7ad99008cfa042288'
        },
        {
          key: 'yearInfo',
          name: '年度考核',
          module_id: 'b8f5d1a617f411ea91530242ac110003'
        },
        {
          key: 'value',
          name: '指标评价',
          module_id: '248f5731a25911e7ad99008cfa042288'
        },
        {
          key: 'middleEvaluation',
          name: '360度评价管理',
          module_id: 'ddf7dccb2ba011eaa9680242ac110002'
        },
        {
          key: 'process',
          name: '考核流程',
          module_id: 'dfd32a7deb0d11e7921e008cfa042288'
        }
      ]
    },
    {
      name: '个人考核',
      icon: 'setting',
      key: 'employer',
      child: [
        {
          key: 'labelPage',
          name: '标签页',
          module_id: '359e8a47170a11ea91530242ac110005',
          display:0
        },
        {
          key: 'staffEvaluation',
          name: '职业素养评价',
          module_id: '359e8a47170a11ea91530242ac110003',
          display:0
        },
        {
          key: 'manage',
          name: '指标管理',
          module_id: '01c2466da1c311e7ad99008cfa042288',
          display:1
        },
        {
          key: 'hrsearch',
          name: '指标查询',
          module_id: '01c234d8a1c311e7ad99008cfa042288',
          display:1
        },
        {
          key: 'dmsearch',
          name: '指标查询',
          module_id: '01c23b87a1c311e7ad99008cfa042288',
          display:1
        },
        {
          key: 'pmsearch',
          name: '指标查询',
          module_id: '01c23a61a1c311e7ad99008cfa042288',
          display:1
        },
        {
          key: 'dmprojsearch',
          name: '指标查询',
          module_id: '01c2391fa1c311e7ad99008cfa042288',
          display:1
        },
        {
          key: 'check',
          name: '指标审核',
          module_id: '01c23ebfa1c311e7ad99008cfa042288',
          display:1
        },
        {
          key: 'value',
          name: '指标评价',
          module_id: '01c23fe2a1c311e7ad99008cfa042288',
          display:1
        },
        {
          key: 'pmdistribute',
          name: '正态分布',
          module_id: '01c24215a1c311e7ad99008cfa042288',
          display:1
        },
        {
          key: 'checkerChange',
          name: '考核人变更',
          module_id: '8d131ff182a911eaa9680242ac110002',
          display:0
        },
        {
          key: 'modifyRemainder',
          name: '项目余数变更',
          module_id: '155ff587416d11e9a825008cfa042288',
          display:0
        },
        {
          key: 'deptremain',
          name: '部门余数信息',
          module_id: '01c2368aa1c311e7ad99008cfa042288',
          display:0
        },
        {
          key: 'open',
          name: '开放时间',
          module_id: '01bdce0ea1c311e7ad99008cfa042288',
          display:1
        },
        {
          key: 'state',
          name: '指标状态',
          module_id: '01c24435a1c311e7ad99008cfa042288',
          display:0
        },
        {
          key: 'result',
          name: '考核结果',
          module_id: '01c2455da1c311e7ad99008cfa042288',
          display:1
        },
        {
          key: 'employerAdmin',
          name: '后台管理',
          module_id: 'ad3a0359ae4111e7ad99008cfa042288',
          display:0
        },
        {
          key: 'support',
          name: '支撑评价',
          module_id: '19e232a8b97711e7ad99008cfa042288',
          display:0
        },
        {
          key: 'progress',
          name: '支撑评价进度',
          module_id: 'cab363d5c46111e7ad99008cfa042288',
          display:0
        },
        {
          key: 'pmannual',
          name: '年度考核',
          module_id: 'eab29512f9c111e7921e008cfa042288',
          display:0
        },
        {
          key: 'annual',
          name: '年度考核',
          module_id: '966ade3dd0fd11e7ad99008cfa042288',
          display:0
        },
        {
          key: 'deptprojrank',
          name: '部门内项目余数',
          module_id: '880b3c0808db11e9a825008cfa042288',
          display:0
        },
        {
          key: 'staffManage',
          name: '职业素养评价配置',
          module_id: 'e1c3502917f411ea91530242ac110003',
          display:0
        },
        {
          key: 'globalInfo',
          name: '职业素养评价结果',
          module_id: '11a60a3417f511ea91530242ac110003',
          display:0
        },
        {
          key: 'bpresult',
          name: 'BP考核结果',
          module_id: '11a60a3417f511ea91530242ac1100740',
        }
      ]
    },
    {
      name: '全面激励',
      icon: 'setting',
      key: 'encouragement',
      child: [
        {
          key: 'index',
          name: '首页',
          module_id: 'd495c6a4b17511e8a340008cfa042288'
        },
        {
          key: 'basicinfo',
          name: '基本信息',
          module_id: 'e1554db8b17511e8a340008cfa042288'
        },
        {
          key: 'promotion',
          name: '晋升激励报告',
          module_id: 'ec3066eeb17511e8a340008cfa042288'
        },
        {
          key: 'performance',
          name: '绩效激励报告',
          module_id: 'f393910cb17511e8a340008cfa042288'
        },
        {
          key: 'training',
          name: '培训激励报告',
          module_id: '001e1ae2b17611e8a340008cfa042288'
        },
        {
          key: 'recognized',
          name: '认可激励报告',
          module_id: '06d28c59b17611e8a340008cfa042288'
        },
        {
          key: 'honor',
          name: '荣誉激励报告',
          module_id: '0c48dc44b17611e8a340008cfa042288'
        },
        {
          key: 'longterm',
          name: '长期激励报告',
          module_id: '1851ae97b17611e8a340008cfa042288'
        },
        {
          key: 'welfare',
          name: '福利激励报告',
          module_id: '3ac4c6abb17611e8a340008cfa042288'
        },
        {
          key: 'wage',
          name: '整体薪资报告',
          module_id: '46517cefb17611e8a340008cfa042288'
        },
        {
          key: 'authChange',
          name: '权限配置',
          module_id: '0146f2fcea5c11e9b5050242ac110005'
        },
        {
          key: 'auditPage',
          name: '变更审核',
          module_id: '4dc61a1dea5c11e9b5050242ac110005'
        },
        {
          key: 'personalInfo',
          name: '个人信息变更',
          module_id: '62f09e09ea5c11e9b5050242ac110005'
        }
      ]
    },
    {
      name: '履历管理',
      icon: 'setting',
      key: 'record',
      child: [
        {
          key: 'recordManage',
          name: '履历审核',
          module_id: 'd36b1bdaa53f11eaa9680242ac110002'
        },
        {
          key: 'adminConfig',
          name: '管理员配置',
          module_id: '398fee0da54911eaa9680242ac110002'
        },
        {
          key: 'recordStaff',
          name: '员工履历',
          module_id: '18ab5aa5a54911eaa9680242ac110002'
        }
      ]
  }];

// menu=JSON.parse(localStorage.getItem("menu"))
// parentPath='humanApp/employer/'

// labelmodule(){

//   let labels=[]
//   this.human_menu[4].child.forEach((item)=>{
//     if(item.display==0){
//      let label= <div key={item.key}  className={style.label}>
//      <Link to={this.parentPath + item.key} style={{color: '#fd875a',lineHeight:'31px'}}>
//      {item.name}
//      </Link>
//      </div>
     
//      labels.push(label)
//        } 
//   })
//  return labels
// }




render()
{

return(

<div className={Style.wrap}>
  {/* <div className={style.cardDiv}>
    <p style={{marginTop:14,paddingLeft:15,fontSize:18,color:'#9c9b9a'}}><Icon type="solution" style={{fontSize:20,marginRight:5}}/>绩效管理员</p>
    <hr style={{marginTop:20}}></hr>
    <div style={{width:700,minWidth:680,position:'absolute',top:'83%',left:'52%',marginTop:-350,marginLeft:-350}}>
    {this.labelmodule()}
    </div>
     
     </div> */}
</div>
)

}


}

function mapStateToProps (state) {
  //let {list }=state.labelPage
  return {
    //list:list
  };
}

export default connect(mapStateToProps)(LabelPage);
