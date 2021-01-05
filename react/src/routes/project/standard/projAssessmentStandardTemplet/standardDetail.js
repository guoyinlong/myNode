/**
 * 作者：任华维
 * 日期：2017-11-11
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：项目考核指标主页
 */
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {Table, Tabs, Icon, Breadcrumb, message, Button } from 'antd';
import {getUuid,arrayToArrayGroups,arrayToObjGroups} from '../../../../utils/func';
import AssessmentStandardScore from '../projAssessmentStandardScore';
import PageSubmit from '../../../../components/employer/PageSubmit'
import styles from '../../../../components/employer/searchDetail.less'
/**
 * 作者：任华维
 * 创建日期：2017-11-11
 * 功能：页面组件
 */
function StandardDetail({dispatch,userId,userName, templetList,templetListReset, templetYear,templetSeason,ImmunityFlag,templetState}) {
    const classGroup = arrayToArrayGroups(templetList,'kpi_flag');
    const typeGroup = []
    for (let i = 0; i < classGroup.length; i++) {
        typeGroup.push(arrayToArrayGroups(classGroup[i],'kpi_type'));
    }
    const add = (item) => {
        dispatch({
            type:'standardInfo/templetAdd',
            payload:{
                rw:true,
                editable:true,
                uid:getUuid(32,62),
                f_year:templetYear,
                f_season:templetSeason,
                classify:item.classify,
                kpi_type:item.kpi_type,
                kpi_name:"",
                kpi_content:"",
                formula:"",
                target:"",
                percentile_score:item.percentile_score,
                kpi_ratio:"0",
                kpi_type_ratio:item.kpi_type_ratio,
                kpi_flag:item.kpi_flag,
                kpi_state:'0',
                create_id:userId,
                create_name:userName,
                remark:"",
                tag:"0",
                sort_index:item.sort_index,
                key:getUuid(32,62)
            }
        });
    }
    const del = (item) => {
        const list = arrayToObjGroups(templetList,'kpi_type');
        for (let i = 0; i < list.length; i++) {
            if (list[i].key == item.kpi_type) {
                if (list[i].value.length > 1) {
                    dispatch({
                        type:'standardInfo/templetDel',
                        payload:{'uid':item.uid}
                    });
                } else {
                    message.info('至少需要含有一项内容', 6);
                }
                break;
            }
        }
    }
    const edit = (value, uid, column) => {
        dispatch({
            type:'standardInfo/templetChange',
            payload:{
                'value':value,
                'uid':uid,
                'column':column,
            }
        });
    }
    const reset = (uid, column) => {
        dispatch({
            type:'standardInfo/templetReset',
            payload:{
                'uid':uid,
                'column':column,
            }
        });
    }
    const handleCopy = () => {
        let copySeason = templetSeason-1
        let copyYear = templetYear
        if(copySeason == 0 ){
            copyYear = templetYear-1
            copySeason = 4
        }
        dispatch({
            type:'standardInfo/templetDetailCopy',
            payload:{
                year:copyYear,
                season:copySeason
            }
        })
    }
    const blankValidate = () => {
        return templetList.filter(item => item.kpi_flag === '0' && item.kpi_state === '0' && item.kpi_name.replace(/(^\s*)|(\s*$)/g, "") === '' && parseFloat(item.kpi_ratio).toFixed(1) === '0.0' && item.kpi_content.replace(/(^\s*)|(\s*$)/g, "") === '' && item.formula.replace(/(^\s*)|(\s*$)/g, "") === '');
    }
    const handleSaveClick = () => {
        const blank = blankValidate();
        if (blank.length) {
            for (let i = 0; i < blank.length; i++) {
                const arrary = templetList.filter(item => item.kpi_type === blank[i].kpi_type);
                if (arrary.length > 1) {
                    del(blank[i]);
                }
            }
        }
        dispatch({
            type:'standardInfo/templetUpdate',
            payload:'2'
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
        dispatch({
            type:'standardInfo/templetUpdate',
            payload:'3',
            onComplete(){
                dispatch({
                    type:'standardInfo/TempletListPage'
                });
            },
        });
    };
    const nameValidate = () => {
        const kpi_name = templetList.filter(item => item.kpi_flag === '0' && item.kpi_name.replace(/(^\s*)|(\s*$)/g, "") === '');
        return kpi_name.length>0 ? false : true;
    }
    const ratioValidate = () => {
        const kpi_ratio = templetList.filter(item => item.kpi_flag === '0' && parseFloat(item.kpi_ratio).toFixed(1) === '0.0');
        return kpi_ratio.length>0 ? false : true;
    }
    const contentValidate = () => {
        const kpi_content = templetList.filter(item => item.kpi_flag === '0' && (item.kpi_content.replace(/(^\s*)|(\s*$)/g, "") === '' || item.formula.replace(/(^\s*)|(\s*$)/g, "") === '') );
        return kpi_content.length>0 ? false : true;
    }
    const totalValidate = () => {
        const data = arrayToObjGroups(templetList,'kpi_type').map((item, index) => {
            const obj = {
                'key':item.key,
                'type_ratio':parseFloat(item.value[0].kpi_type_ratio),
                'ratio':0,
                'flag':item.value[0].kpi_flag
            }
            for (let i = 0; i < item.value.length; i++) {
                obj.ratio =  parseFloat((obj.ratio += parseFloat(item.value[i].kpi_ratio)).toFixed(14));
            }
            return obj;
        })
        let flag = true;
        for (let i = 0; i < data.length; i++) {
            if (data[i].flag === '0' && data[i].type_ratio !== data[i].ratio) {
                flag = false;
            }
        }
        return flag;
    }
    const templetModel = typeGroup.map((item, index) => {
        if (item[0][0].kpi_flag === '0') {
            return (
                <div className={styles.projectsBox} key={index}>
                    <div className={styles.projectTitle}>
                        <div className={styles.staffInfo}>
                            <div>{item[0][0].classify}</div>
                            <div>
                                <span><Icon type="nianduhejidu"/>{`${templetYear}年 第${templetSeason}季度`}</span>
                            </div>
                        </div>
                        <div className={styles.staffScore}></div>
                    </div>
                    <AssessmentStandardScore data={item} handleAdd={add} handleDel={del} handleEdit={edit} handleReset={reset} ImmunityFlag = {ImmunityFlag} showFlag = {0} > </AssessmentStandardScore>
                </div>
            )
        }else{
            return;
        }
    } 
  );
  const oldTempletModel = typeGroup.map((item, index) => {
    if (item[0][0].kpi_flag === "0"||item[0][0].kpi_flag === "2") {
      return (
        <div className={styles.projectsBox} key={index}>
          <div className={styles.projectTitle}>
            <div className={styles.staffInfo}>
              <div>{item[0][0].classify}</div>
              <div>
                <span>
                  <Icon type="nianduhejidu" />
                  {`${templetYear}年 第${templetSeason}季度`}
                </span>
              </div>
            </div>
            <div className={styles.staffScore}></div>
          </div>
          <AssessmentStandardScore
            data={item}
            handleAdd={add}
            handleDel={del}
            handleEdit={edit}
            handleReset={reset}
            ImmunityFlag={ImmunityFlag}
            showFlag = {0}
          ></AssessmentStandardScore>
        </div>
      );
    } else {
      return;
    }
  }

  );
  const yearSeasonStr = templetYear + "" + templetSeason;
  const changeNewPageTime = "20204"
  if (yearSeasonStr >= changeNewPageTime) {
    return (
        <div className={styles['wrap']}>
            {
                templetState　!= 3 ? 
                <div className={styles.clearfix}>
                    <Button style={{float:'right'}} onClick= {handleCopy}>复制上一季度指标</Button>
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
            {templetModel}
            {
                templetList[0] && templetList[0].kpi_state !== '3'
                ?
                <PageSubmit title={'确定提交通用指标吗？'} save={handleSaveClick} submit={handleSubmitClick}/>
                :
                <div></div>
            }
        
      </div>
    );
}else{
    return (
        <div className={styles['wrap']}>
            {
                templetState　!= 3 ? 
                <div className={styles.clearfix}>
                    <Button style={{float:'right'}} onClick= {handleCopy}>复制上一季度指标</Button>
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
            
        {oldTempletModel}
        {templetList[0] && templetList[0].kpi_state !== "3" ? (
          <PageSubmit
            title={"确定提交通用指标吗？"}
            save={handleSaveClick}
            submit={handleSubmitClick}
          />
        ) : (
          <div></div>
        )}
      </div>
    );
}
}
function mapStateToProps(state) {
    return {
        loading: state.loading.models.standardInfo,
        ...state.standardInfo
    };
}

export default connect(mapStateToProps)(StandardDetail);
