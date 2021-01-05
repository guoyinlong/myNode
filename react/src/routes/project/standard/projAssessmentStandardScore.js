/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：项目考核指标主页
 */
import React from 'react';
import { Table, Row, Col, Input, Button, Icon, Collapse,Tooltip  } from 'antd';
import AssessmentStandardScoreItem from './projAssessmentStandardScoreItem';
import Masonry from '../../../components/employer/Masonry2'
import styles from '../../../components/employer/searchDetail.less'
const MasonryItem = Masonry.MasonryItem;
const Panel = Collapse.Panel;
/**
 * 作者：任华维
 * 创建日期：2017-11-07
 * 功能：页面组件
 */
function AssessmentStandardScore({state,data,handleAdd,handleDel,handleEdit,handleReset,ImmunityFlag,showFlag}) {
    console.log(showFlag)
    const ScoreTable = ({list}) => {
        const columns = list.map((item, index) => {
            return ({
                title : <Tooltip title={item.kpi_name}><span>{item.kpi_name}</span></Tooltip>,
                className : 'scoreTh',
                dataIndex : item.uid,
                width:'80px',
            });
        })
        const obj = {};
        for (let i = 0; i < list.length; i++) {
            obj[list[i].uid] = list[i].kpi_ratio;
        }
        obj.index = 0;
        obj.ratio = list[0].kpi_type_ratio;
      obj.ratio2 = list[0].kpi_type_ratio;
        return (

            list[0].kpi_flag == 2?
              <div>
                <Table rowKey="index" bordered size={'small'} columns={[{title: '约束类总权重',dataIndex: 'ratio',fixed: 'left',width:'70px',className:'scoreTh'},{title: '激励类总权重',dataIndex: 'ratio2',width:'70px',className:'scoreTh'},...columns]} dataSource={[obj]} scroll={{ x: list.length*80+70+70 }} pagination={false}/>
              </div>:
              <div>
                <Table rowKey="index" bordered size={'small'} columns={[{title: '总权重',dataIndex: 'ratio',fixed: 'left',width:'70px',className:'scoreTh'},...columns]} dataSource={[obj]} scroll={{ x: list.length*80+70 }} pagination={false}/>
              </div>


        )
    }
    //新增指标按钮事件
    const pannelHeader = (item) => {

            return (
                item[0].kpi_flag==0&&showFlag==1?<div></div>:
                <div className={styles.typeTitle}>
                    <div>{item[0].kpi_type}
                        {
                            item[0].rw && item[0].kpi_state !== '3' && typeof(state) === "undefined"
                            ?
                            <div className={styles.addKpi} onClick={(e)=>{ e.stopPropagation(); return handleAdd(item[item.length-1])}}>
                                <span>+</span>{'添加指标'}
                            </div>
                            :
                            <div></div>
                        }
                    </div>
                    <div className={styles.scoreTable}>
                        <ScoreTable list={item}/>
                    </div>
                </div>
            )

    }
    // const CardList = ({list}) => {
    //     const columns = list.map((item, index) => {
    //         return (
    //             <MasonryItem key={index}><AssessmentStandardScoreItem data={item} handleDel={handleDel} handleEdit={handleEdit} handleReset={handleReset}></AssessmentStandardScoreItem></MasonryItem>
    //         );
    //     })
    //     return (
    //         <Masonry wrapClass={styles.borderR}>
    //             {columns}
    //         </Masonry>
    //     )
    // }
    const pannel = data.map((item, index) => {



        return (

            <div className={styles.KpiTypesBox+" "+styles.arr}  key={index}>
                <Collapse bordered={false} defaultActiveKey={['0','1','2','3','4','5','6','7','8','9']}>

                    <Panel header={pannelHeader(item)}>
                    <Masonry wrapClass={styles.borderR}>
                        {item.map((item, index) => {
                            return (
                                item.kpi_flag==0&&showFlag==1?<div></div>:
                                <MasonryItem key={item.key?item.key:index}><AssessmentStandardScoreItem state={state} data={item} handleDel={handleDel} handleEdit={handleEdit} handleReset={handleReset} ImmunityFlag = {ImmunityFlag}></AssessmentStandardScoreItem></MasonryItem>
                            );
                        })}
                    </Masonry>
                    </Panel>
                </Collapse>
            </div>
        )
    })
    return (
        <div>
            {pannel}
        </div>
    );
}
export default AssessmentStandardScore;
