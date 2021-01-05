/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：项目考核指标主页
 */
import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {Table, Input, InputNumber, Checkbox, Row, Col, Icon, Button, Select, Popconfirm , Pagination, Breadcrumb, message } from 'antd';
import {getUuid,arrayToArrayGroups} from '../../../../utils/func';
import styles from '../projAssessmentStandard.less';
const Option = Select.Option;
const ButtonGroup = Button.Group;
/**
 * 作者：任华维
 * 创建日期：2017-11-07
 * 功能：页面组件
 */
 function StandardInfo({dispatch, userId, userName,templetList, templetYear, templetSeason,role}) {
     const columns = [{
         title: '指标分类',
         dataIndex: 'kpi_flag',
         width: '20%',
         render: (text, record) => (
             <div>
                 {
                     record.editable
                     ?
                     <Select defaultValue={text} style={{margin: '-5px 0',width:'100%'}} onChange={value => handleChange(value, record.uid, 'kpi_flag')}>
                         <Option value="0">通用考核指标</Option>
                         <Option value="1">专业考核指标</Option>
                         <Option value="3">党建与学习成长类</Option>
                     </Select>
                     :
                     text === '0' ? '通用考核指标' :text === '1' ?'专业考核指标': text === "3" ? "党建与学习成长类" :  ""
                     }
             </div>
         )
     }, {
         title: '指标名称',
         dataIndex: 'kpi_type',
         width: '20%',
         render: (text, record) => (
             <div>
                 {
                     record.editable
                     ?
                     <Input style={{ margin: '-5px 0' }} value={text} onChange={e => handleChange(e.target.value, record.uid, 'kpi_type')} />
                     :
                     text
                 }
             </div>
         )
     },{
      title: "分值",
      dataIndex: "kpi_point",
      width: "15%",
      render: (text, record) => (
        <div>
          {record.editable ? (
            <InputNumber
              min={0}
              max={100}
              style={{ margin: "-5px 0", width: "100%" }}
              value={text}
              onChange={(value) => handleChange(value, record.uid, "kpi_point")}
            />
          ) : (
            text
          )}
        </div>
      ),
    },
    {
      title: "权重",
      dataIndex: "kpi_weight",
      width: "15%",
      render: (text, record) => (
        <div>
          {record.editable ? (
            <InputNumber
              min={0}
              max={100}
              style={{ margin: "-5px 0", width: "100%" }}
              value={text}
              onChange={(value) =>
                handleChange(value, record.uid, "kpi_weight")
              }
            />
          ) : (
            text
          )}
        </div>
      ),
    }, {
         title: '指标权重',
         dataIndex: 'kpi_type_ratio',
         width: '15%',
         render: (text, record) => (
          <div>{<p>{parseFloat((record.kpi_weight * 0.01 * record.kpi_point).toFixed(15)) || 0}</p>}</div>
         ),
     }, {
         title: '操作',
         dataIndex: 'operation',
         width: '15%',
         render: (text, record) => {
             const { editable,kpi_state } = record;
             return (
                 <div className="editable-row-operations">
                 {
                     kpi_state === '1' || kpi_state === '2' || kpi_state === '3'
                     ?

                     <ButtonGroup>
                        <Button size='small' disabled>编辑</Button>
                        <Button size='small' disabled>删除</Button>
                     </ButtonGroup>
                     :
                     <ButtonGroup>
                         {
                            editable
                            ?
                            <Button size='small' onClick={() => save(record.uid)}>保存</Button>
                            :
                            <Button size='small' onClick={() => edit(record.uid)}>编辑</Button>
                         }
                         <Popconfirm title="确定要删除该指标吗?" onConfirm={() => del(record.uid)}>
                             <Button size='small'>删除</Button>
                         </Popconfirm>
                     </ButtonGroup>
                 }


                 </div>

             );
         },
     }];
     const oldColumns = [
      {
        title: '指标分类',
        dataIndex: 'kpi_flag',
        width: '30%',
        render: (text, record) => (
            <div>
                {
                    record.editable
                    ?
                    <Select defaultValue={text} style={{margin: '-5px 0',width:'100%'}} onChange={value => handleChange(value, record.uid, 'kpi_flag')}>
                        <Option value="0">通用考核指标</Option>
                        <Option value="1">专业考核指标</Option>
                    </Select>
                    :
                    text === '0' ? '通用考核指标' :text === '1' ?'专业考核指标': ''
                }
            </div>
        )
    }, {
        title: '指标名称',
        dataIndex: 'kpi_type',
        width: '30%',
        render: (text, record) => (
            <div>
                {
                    record.editable
                    ?
                    <Input style={{ margin: '-5px 0' }} value={text} onChange={e => handleChange(e.target.value, record.uid, 'kpi_type')} />
                    :
                    text
                }
            </div>
        )
    }, {
        title: '指标权重',
        dataIndex: 'kpi_type_ratio',
        width: '20%',
        render: (text, record) => (
            <div>
                {
                    record.editable
                    ?
                    <InputNumber min={0} max={100} style={{ margin: '-5px 0',width:'100%'}} value={text} onChange={value => handleChange(value, record.uid, 'kpi_type_ratio')} />
                    :
                    text
                }
            </div>
        ),
    }, {
        title: '操作',
        dataIndex: 'operation',
        width: '20%',
        render: (text, record) => {
            const { editable,kpi_state } = record;
            return (
                <div className="editable-row-operations">
                {
                    kpi_state === '1' || kpi_state === '2' || kpi_state === '3'
                    ?

                    <ButtonGroup>
                       <Button size='small' disabled>编辑</Button>
                       <Button size='small' disabled>删除</Button>
                    </ButtonGroup>
                    :
                    <ButtonGroup>
                        {
                           editable
                           ?
                           <Button size='small' onClick={() => save(record.uid)}>保存</Button>
                           :
                           <Button size='small' onClick={() => edit(record.uid)}>编辑</Button>
                        }
                        <Popconfirm title="确定要删除该指标吗?" onConfirm={() => del(record.uid)}>
                            <Button size='small'>删除</Button>
                        </Popconfirm>
                    </ButtonGroup>
                }


                </div>

            );
        },
      },
    ];
     const handleChange = (value, uid, column) => {
         dispatch({
             type:'standardInfo/templetChange',
             payload:{
                 'value':value,
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
             type:'standardInfo/templetCopy',
             payload:{
                 year:copyYear,
                 season:copySeason
             }
         })
     }
     const edit = (uid) => {
         dispatch({
             type:'standardInfo/templetEdit',
             payload:{'uid':uid}
         });
     }
     const save = (uid) => {
         dispatch({
             type:'standardInfo/templetSave',
             payload:{'uid':uid}
         });
     }
     const del = (uid) => {
         dispatch({
             type:'standardInfo/templetDel',
             payload:{'uid':uid}
         });
     }
     const add = () => {
         if (requiredValidate(templetList)) {
             dispatch({
                 type:'standardInfo/templetAdd',
                 payload:{
                     editable:true,
                     uid:getUuid(32,62),
                     f_year:templetYear,
                     f_season:templetSeason,
                     classify:"",
                     kpi_type:"",
                     kpi_name:"",
                     kpi_content:"",
                     formula:"",
                     target:"",
                     percentile_score:"0",
                     kpi_ratio:"0",
                     kpi_type_ratio:"0",
                     kpi_flag:"",
                     kpi_state:"",
                     create_id:userId,
                     create_name:userName,
                     remark:"",
                     tag:"0",
                     sort_index:templetList.length? templetList[templetList.length-1].sort_index:'0'
                 }
             });
         } else {
             message.info('请先补齐空白内容', 6);
         }
     }
     const tempDetail = () => {
         dispatch({
             type:'standardInfo/templetDetailPage',
             payload:{'year':templetYear,'season':templetSeason}
         });
     }
     const tempSave = () => {
         dispatch({
             type:'standardInfo/templetUpdate',
             payload:'0'
         });
     }
     const tempSubmit = () => {
      let res = ratioValidate(templetList);
      if (requiredValidate(templetList) && res === "0") {
        dispatch({
          type: "standardInfo/templetUpdate",
          payload: "1",
          // onComplete() {
          //   dispatch({
          //     type: "standardInfo/templetDetailPage",
          //     payload: { year: templetYear, season: templetSeason },
          //   });
          // },
        });
      } else {
        if (!requiredValidate(templetList)) {
          message.error("内容不能为空", 6);
        } else if (res === "1") {
          message.error("通用指标和专业指标总分要为100", 6);
        } else if (res === "2") {
          message.error("党建与学习成长类总分要为100", 6);
        } else {
          message.error("指标权重总分要为100", 6);
        }
      }

     }
     const requiredValidate = (data) => {
         let flag = true;
         const list = data.filter(item => item.kpi_flag.replace(/(^\s*)|(\s*$)/g, "") === '' || item.kpi_type.replace(/(^\s*)|(\s*$)/g, "") === '');
         if (list.length > 0) {
             flag = false;
         }
         return flag;
     }
     const ratioValidate = (data) => {
      let flag = false;
      let ratio = 0; //指标权重
      let party_build = 0; //党建与学习成长类
      let frist_ratio = 0; //一级指标
      let res = 0;
      for (let i = 0; i < data.length; i++) {

        if (data[i].kpi_flag !== "2") {
          ratio += parseFloat(data[i].kpi_type_ratio);
        }

        if (data[i].kpi_flag === "0" || data[i].kpi_flag === "1") {
          frist_ratio += parseFloat(data[i].kpi_point);
        } else if (data[i].kpi_flag === "3") {
          party_build += parseFloat(data[i].kpi_point);
        }
      }
      // if (frist_ratio !== 100) {
      //     return '1';
      // }else if (party_build !== 100) {
      //     return '2'
      // }else

      if (ratio !== 100) {
        return "3";
      }
      return "0";
     }
     const dataFormat = function(data){
         const array = [];
         for (let i = 0; i < data.length; i++) {
             if (data[i].kpi_flag !== '2') {
                 array.push(data[i]);
             }
         }
         const temp = [];
         const list = arrayToArrayGroups(array,'kpi_type');
         for (let i = 0; i < list.length; i++) {
             temp.push(list[i][0]);
         }
         return temp;
     }(templetList);
     const yearSeasonStr = templetYear + "" + templetSeason;
    const changeNewPageTime = "20204";
    if (yearSeasonStr >= changeNewPageTime) {

      return (

        <div className={styles["wrap"]}>
          {/*
               <Breadcrumb separator=">">
                   <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
                   <Breadcrumb.Item>指标模版</Breadcrumb.Item>
               </Breadcrumb>
          */}
          <h2 style={{ textAlign: "center" }}>
            {templetYear}第{templetSeason}季度模版设定
          </h2>
          <Row type="flex" justify="space-between" style={{ padding: "10px 0" }}>
            <Col>
              {dataFormat[0] &&
              (dataFormat[0].kpi_state === "1" ||
                dataFormat[0].kpi_state === "2" ||
                dataFormat[0].kpi_state === "3") ? (role?(<div></div>):(
                <Button type="primary" onClick={tempDetail}>
                  {dataFormat[0].kpi_state === "3" ? "查看指标" : "添加指标"}
                </Button>
  )            ) : role ? (
                <Button type="primary" onClick={add}>
                  添加
                </Button>
              ) : (
                <div></div>
              )}
            </Col>
            <Col>
              {
              dataFormat[0] &&
              (dataFormat[0].kpi_state === "1" ||
                dataFormat[0].kpi_state === "2" ||
                dataFormat[0].kpi_state === "3") ? (
                <div></div>
              ) : role ?
              (
                <Row gutter={8} type="flex" justify="end">
                  <Col>
                    <Button onClick={handleCopy}>复制上一季度模板</Button>
                  </Col>
                  <Col>
                    <Button onClick={tempSave}>保存</Button>
                  </Col>
                  <Col>
                    <Popconfirm
                      title="确定要提交考核指标吗?"
                      onConfirm={tempSubmit}
                    >
                      <Button type="primary">提交</Button>
                    </Popconfirm>
                  </Col>
                </Row>
              ) : (
                <div></div>
              )}
            </Col>
          </Row>
          <Table
            className={styles.orderTable}
            rowKey="uid"
            pagination={false}
            dataSource={dataFormat}
            columns={columns}
          />
        </div>
      );
    } else {
     return (
         <div className={styles['wrap']}>
         {/*
             <Breadcrumb separator=">">
                 <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
                 <Breadcrumb.Item>指标模版</Breadcrumb.Item>
             </Breadcrumb>
        */}
             <h2 style={{textAlign:'center'}}>{templetYear}第{templetSeason}季度模版设定</h2>
             <Row type="flex" justify="space-between" style={{'padding':'10px 0'}}>
                <Col>
                {
                    dataFormat[0] && (dataFormat[0].kpi_state === '1' || dataFormat[0].kpi_state === '2' || dataFormat[0].kpi_state === '3')
                    ?
                    <Button type="primary" onClick={tempDetail}>
                        {dataFormat[0].kpi_state === '3' ? '查看指标' : '添加指标'}
                    </Button>
                    :
                    <Button type="primary" onClick={add}>添加</Button>
                }

                </Col>
                <Col>
                {
                    dataFormat[0] && (dataFormat[0].kpi_state === '1' || dataFormat[0].kpi_state === '2' || dataFormat[0].kpi_state === '3')
                    ?
                    <div></div>
                    :
                    <Row gutter={8} type="flex" justify="end">
                        <Col>
                            <Button onClick={handleCopy}>复制上一季度模板</Button>
                        </Col>
                        <Col>
                            <Button onClick={tempSave}>保存</Button>
                        </Col>
                        <Col>
                            <Popconfirm title="确定要提交考核指标吗?" onConfirm={tempSubmit}>
                                <Button type="primary">提交</Button>
                            </Popconfirm>

                        </Col>
                    </Row>
                }
                </Col>
             </Row>
             <Table className={styles.orderTable} rowKey='uid' pagination={false} dataSource={dataFormat} columns={oldColumns} />
         </div>
     );
 }}

function mapStateToProps(state) {
    const {userId, userName, templetList,templetYear,role,templetSeason} = state.standardInfo;
    return {
      loading: state.loading.models.standardInfo,
      userId,
      userName,
      templetList,
      templetYear,
      templetSeason,
      role,
    };
}

export default connect(mapStateToProps)(StandardInfo);
