/**
 * 作者：任华维
 * 日期：2017-11-11
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：项目考核指标主页
 */
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {Table, Tabs, Icon, Breadcrumb ,message, Button} from 'antd';
import AssessmentStandardScore from '../projAssessmentStandardScore';
import PageSubmit from '../../../../components/employer/PageSubmit'
import {getUuid,arrayToArrayGroups,arrayToObjGroups} from '../../../../utils/func';
import styles from '../../../../components/employer/searchDetail.less'
/**
 * 作者：任华维
 * 创建日期：2017-11-11
 * 功能：页面组件
 */
function AssessmentStandardDetail({dispatch, loading, location, list,listClone, year,season, detail,userId,userName,ImmunityFlag,role,state,kpiState}) {
    const typeGroup = arrayToArrayGroups(list,'kpi_type');

    const add = (item) => {
        const id = getUuid(32,62);
        dispatch({
            type:'projAssessmentStandardDetail/itemAdd',
            payload:{
                'rw':true,
                'kpi_id':id,
                'uid':id,
                'proj_code':item.proj_code,
                'proj_id':item.proj_id,
                'year':item.year,
                'season':item.season,
                'classify':item.classify,
                'kpi_flag':item.kpi_flag,
                'kpi_type':item.kpi_type,
                'kpi_name':'',
                'kpi_content':'',
                'formula':'',
                'target':'',
                'percentile_score':item.percentile_score,
                'kpi_ratio':'0',
                'kpi_score':'0',
                'kpi_type_ratio':item.kpi_type_ratio,
                'remark':item.remark,
                'kpi_state':'0',
                'kpi_fill_state':item.kpi_fill_state,
                'tag':'0',
                //  "kpi_assessment": "1",      //新增考核豁免的标志
                'sort_index':item.sort_index,
                'key':id
            }
        });
    }
    const del = (item) => {
        const data = arrayToObjGroups(list,'kpi_type');
        for (let i = 0; i < data.length; i++) {
            if (data[i].key == item.kpi_type) {
                if (data[i].value.length > 1) {
                    dispatch({
                        type:'projAssessmentStandardDetail/itemDel',
                        payload:{'uid':item.uid}
                    });
                } else {
                    message.info('至少需要含有一项内容', 6);
                }
            }
        }
    }
    const edit = (value, uid, column) => {
        dispatch({
            type:'projAssessmentStandardDetail/itemChange',
            payload:{
                'value':value,
                'uid':uid,
                'column':column,
            }
        });
    }
    const reset = (uid, column) => {
        dispatch({
            type:'projAssessmentStandardDetail/itemReset',
            payload:{
                'uid':uid,
                'column':column,
            }
        });
    }
    //验证新添加的卡片是否内容全部为空
    const blankValidate = () => {
        return list.filter(item => item.kpi_flag == role && item.kpi_state === '0' && item.kpi_name.replace(/(^\s*)|(\s*$)/g, "") === '' && parseFloat(item.kpi_ratio).toFixed(1) === '0.0' && item.kpi_content.replace(/(^\s*)|(\s*$)/g, "") === '' && item.formula.replace(/(^\s*)|(\s*$)/g, "") === '');
    }
    //pm保存
    const handleSaveClick = () => {
        const blank = blankValidate();
        if (blank.length) {
            for (let i = 0; i < blank.length; i++) {
                const arrary = list.filter(item => item.kpi_type === blank[i].kpi_type);
                if (arrary.length > 1) {
                    del(blank[i]);
                }
            }
        }
        dispatch({
            type:'projAssessmentStandardDetail/projKpiUpdate',
            payload:location.query.current ? '3' : '1'
        });
    };
    const handleSubmitClick = () => {
        if (!nameValidate()) {
            message.error('指标名不能为空', 6);
            return;
        }
        if (!ratioValidate()) {
            message.error('指标权重不能为0', 6);
            return;
        }
        if (!contentValidate()) {
            message.error('指标内容不能为空', 6);
            return;
        }
        if (!totalValidate()) {
            message.error('权重总数不匹配', 6);
            return;
        }
        if (assessmentsValidate()) {
            message.error('豁免原因不能为空', 6);
            return;
        }
        dispatch({
            type:'projAssessmentStandardDetail/projKpiUpdate',
            payload:'2'
        });
    };
    const assessmentsValidate = () => {
        const kpi_assessments = list.filter((item) => {
            return item.kpi_assessments == "0" && item.kpi_assessment == "0"
        })
        if(kpi_assessments.length == 0) {
            return false
        } else {
            let kpi_assessment = kpi_assessments.filter((item) => {
                return item.reason != undefined && item.reason.length != 0 && item.reason.replace(/(^\s*)|(\s*$)/g, "") != ""
            })
            return kpi_assessment.length > 0 ? false : true
        }
    }
    const nameValidate = () => {
        const kpi_name = list.filter(item =>  item.kpi_name.replace(/(^\s*)|(\s*$)/g, "") === '');
        return kpi_name.length>0 ? false : true;
    }
    const ratioValidate = () => {
        const kpi_ratio = list.filter(item =>  parseFloat(item.kpi_ratio).toFixed(1) === '0.0');
        return kpi_ratio.length>0 ? false : true;
    }
    const contentValidate = () => {
        const kpi_content = list.filter(item =>  (item.kpi_content.replace(/(^\s*)|(\s*$)/g, "") === '' || item.formula.replace(/(^\s*)|(\s*$)/g, "") === '') );
        return kpi_content.length>0 ? false : true;
    }
    const totalValidate = () => {
    let flag = true;
    let addCount = 0;
    let subCount = 0;
    const data = arrayToObjGroups(list, "kpi_type").map((item, index) => {
      const obj = {
                'key':item.key,
                'type_ratio':parseFloat(item.value[0].kpi_type_ratio),
                'ratio':0,
                'flag':item.value[0].kpi_flag
            }
            for (let i = 0; i < item.value.length; i++) {
        if (
          item.value[i].kpi_flag == 2 &&
          parseFloat(item.value[i].kpi_ratio) > 5
        ) {
          flag = false;
        }
        if (item.value[i].kpi_flag == 2) {
          if (item.value[i].kpi_name == "激励类") {
            addCount += parseFloat(item.value[i].kpi_ratio);
          } else {
            subCount += parseFloat(item.value[i].kpi_ratio);
          }
        }
            obj.ratio =  parseFloat((obj.ratio += parseFloat(item.value[i].kpi_ratio)).toFixed(14));
            }
            return obj;
    });

    for (let i = 0; i < data.length; i++) {
        console.log()
      if (data[i].flag == "2" ) {
          if((addCount != 5 || subCount != 5)){
              flag = false;
          }

      } else if ( data[i].type_ratio !== data[i].ratio) {
        flag = false;
            }
        }
        return flag;
    }
    const isShowPageSubmit = () => {
        let flag = false;
        if (list[0] && (list[0].kpi_fill_state === '0'
          || list[0].kpi_fill_state === '1'
          || (list[0].kpi_fill_state === '3' && typeof(state) === "undefined")) && role) {
            flag = true;
        }
        return flag
    };
    const handleCopy = () =>{
        let query = {}
        query.id = location.query.id
        query.season = location.query.season
        query.year = location.query.year
        dispatch({
            type:'projAssessmentStandardDetail/projectDetailCopy',
            payload: query
        });
    };
  const yearSeasonstr = year + "" + season;
  const changeNewPageTime = "20204";
  console.log(yearSeasonstr)
  console.log(changeNewPageTime)
  if (yearSeasonstr >= changeNewPageTime) {
    return (
      <div className={styles["wrap"]}>
        {(kpiState == "" || kpiState == "1") &&
        location != undefined &&
        detail.mgr_name == localStorage.getItem("fullName") ? (
          <div className={styles.clearfix}>
            <Button style={{ float: "right" }} onClick={handleCopy}>
              复制上一季度指标
            </Button>
          </div>
        ) : (
          <div></div>
        )}
        {/*
            <Breadcrumb separator=">">
                <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
                <Breadcrumb.Item><Link to='/projectApp/projAssessment/projAssessmentStandard'>指标管理</Link></Breadcrumb.Item>
                <Breadcrumb.Item>项目指标</Breadcrumb.Item>
            </Breadcrumb>
            */}
        <div className={styles.projectsBox}>
          <div className={styles.projectTitle}>
            <div className={styles.staffInfo}>
              <div>{detail.proj_name}</div>
              <div>
                <span>
                  <Icon type="nianduhejidu" />
                  {`${year}年 第${season}季度`}
                </span>
                <span>
                  <Icon type="xingming" />
                  {detail.mgr_name}
                </span>
                <span>
                  <Icon type="xiangmubianhao" />
                  {detail.mgr_id}
                </span>
              </div>
            </div>
            <div className={styles.staffScore}></div>
          </div>
          <AssessmentStandardScore
            state={state}
            data={typeGroup}
            handleAdd={add}
            handleDel={del}
            handleEdit={edit}
            handleReset={reset}
            ImmunityFlag={ImmunityFlag}
       
          ></AssessmentStandardScore>
        </div>
        {isShowPageSubmit() ? (
          <PageSubmit
            title={"确定提交考核指标吗？"}
            save={handleSaveClick}
            submit={handleSubmitClick}
          />
        ) : (
          <div></div>
        )}
      </div>
    );
  } else {
    return (
        <div className={styles['wrap']}>
            {
                (kpiState == "" || kpiState == '1')&&(location!=undefined)&&(detail.mgr_name == localStorage.getItem("fullName"))
                ?
                <div className={styles.clearfix}>
                    <Button style={{float:"right"}} onClick={handleCopy}>复制上一季度指标</Button>
                </div>
                :
                <div></div>
            }
            {/*
            <Breadcrumb separator=">">
                <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
                <Breadcrumb.Item><Link to='/projectApp/projAssessment/projAssessmentStandard'>指标管理</Link></Breadcrumb.Item>
                <Breadcrumb.Item>项目指标</Breadcrumb.Item>
            </Breadcrumb>
            */}
            <div className={styles.projectsBox}>
                <div className={styles.projectTitle}>
                    <div className={styles.staffInfo}>
                        <div>{detail.proj_name}</div>
                        <div>
                            <span><Icon type="nianduhejidu"/>{`${year}年 第${season}季度`}</span>
                            <span><Icon type="xingming"/>{detail.mgr_name}</span>
                            <span><Icon type="xiangmubianhao"/>{detail.mgr_id}</span>
                        </div>
                    </div>
                    <div className={styles.staffScore}></div>
                </div>
                <AssessmentStandardScore state={state} data={typeGroup} handleAdd={add} handleDel={del} handleEdit={edit} handleReset={reset} ImmunityFlag = {ImmunityFlag} ></AssessmentStandardScore>

            </div>
            {
                isShowPageSubmit()
                ?
                <PageSubmit title={'确定提交考核指标吗？'} save={handleSaveClick} submit={handleSubmitClick}/>
                :
                <div></div>
            }
        </div>
    );
}
}
function mapStateToProps(state) {
    return {
        loading: state.loading.models.projAssessmentStandardDetail,
        ...state.projAssessmentStandardDetail,
    };
}

export default connect(mapStateToProps)(AssessmentStandardDetail);
