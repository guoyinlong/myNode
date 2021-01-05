/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：项目考核指标主页
 */
import React from 'react';
import { Input, Button, Icon, Popconfirm, InputNumber ,Radio, Select  } from 'antd';
import EditItem from '../../../components/employer/editComponent'
import {splitEnter} from '../../../utils/func';
import styles from '../../../components/employer/searchDetail.less'
const { TextArea } = Input;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
/**
 * 作者：任华维
 * 创建日期：2017-11-07
 * 功能：页面组件
 */
function AssessmentStandardScoreItem({state,data,handleDel,handleEdit,handleReset,ImmunityFlag}) {
    const test =()=>{}
    const isShowPageSubmit = (data) => {
        let flag = false;
        if (data && (data.kpi_fill_state === '0'
          || data.kpi_fill_state === '1'
          || (data.kpi_fill_state === '3' && typeof(state) === "undefined"))) {
            flag = true;
        }
        return flag
    };
    function handleChange(value) {
        handleEdit(value, data.uid, "kpi_name");
      }
    return (
        <div className={styles.kpiBox}>
            <div className={styles.kpiItemTitle}>
                <div>
                    {
                        data.rw && typeof(state) === "undefined"
                        ?
                        <Popconfirm title="确定删除该项指标吗?" onConfirm={()=>handleDel(data)} okText="确定" cancelText="取消">
                            <Icon className={styles.delKpi} type='shijuan-shanchuzhibiao' />
                        </Popconfirm>
                        :
                        <span></span>
                    }
                    {
                        data.rw  && typeof(state) === "undefined"? (
                            data.kpi_flag != "2" ? (
                              <EditItem
                                isEdit={data.kpi_state === "2" ? false : true}
                                show={data.kpi_name}
                                edit={
                                  <Input
                                    placeholder="请输入指标名称"
                                    style={{ width: "100%" }}
                                    defaultValue={data.kpi_name}
                                    onChange={(e) =>
                                      handleEdit(e.target.value, data.uid, "kpi_name")
                                    }
                                  />
                                }
                                onOk={test}
                                onCancel={() => {
                                  handleReset(data.uid, "kpi_name");
                                }}
                              />
                            ) : (
                              <EditItem
                                isEdit={data.kpi_state === "2" ? false : true}
                                show={data.kpi_name}
                                edit={
                                  <Select
                                    defaultValue={data.kpi_name}
                                    style={{ width: 120 }}
                                    onChange={handleChange}
                                  >
                                    <Option value="激励类">激励类</Option>
                                    <Option value="约束类">约束类</Option>
                                  </Select>
                                }
                                onOk={test}
                                onCancel={() => {
                                  handleReset(data.uid, "kpi_name");
                                }}
                              />
                            )
                          ) : (
                            data.kpi_name
                          )
                            }

                </div>
                {
                    
                    <div>权重：
                    {
                        data.rw && typeof(state) === "undefined"
                        ?
                        <EditItem
                            style={{width:'135px'}}
                            isEdit={data.kpi_state === '2' ? false : true}
                            show={data.kpi_ratio}
                            edit={
                                data.kpi_flag != "2" ?(
                                <InputNumber min={0} max={100} defaultValue={data.kpi_ratio} onChange={(value)=>handleEdit(value,data.uid,'kpi_ratio')}/>
                                ):(
                                    <InputNumber min={0} max={5} defaultValue={data.kpi_ratio} onChange={(value)=>handleEdit(value,data.uid,'kpi_ratio')}/>
                                )
                                
                            }
                            onOk={test}
                            onCancel={()=>{handleReset(data.uid,'kpi_ratio')}}/>
                        :
                        data.kpi_ratio
                    }
                    </div>
                }
            </div>
            <div>
                <span>指标定义：</span>
                <span>
                    {
                        data.rw && typeof(state) === "undefined"
                        ?
                        <EditItem
                            isEdit={data.kpi_state === '2' ? false : true}
                            show={data.kpi_content}
                            edit={
                                <TextArea rows={2}  defaultValue={data.kpi_content}  onChange={(e)=>handleEdit(e.target.value,data.uid,'kpi_content')}/>}
                            onOk={test}
                            onCancel={()=>{handleReset(data.uid,'kpi_content')}}/>
                        :
                        splitEnter(data.kpi_content)
                    }
                </span>
            </div>
            <div>
                <span>评价标准：</span>
                <span>
                    {
                        data.rw && typeof(state) === "undefined"
                        ?
                        <EditItem
                            isEdit={data.kpi_state === '2' ? false : true}
                            show={data.formula}
                            edit={<TextArea rows={4} placeholder="请以百分制填写计算标准" defaultValue={data.formula}  onChange={(e)=>handleEdit(e.target.value,data.uid,'formula')}/>}
                            onOk={test}
                            onCancel={()=>{handleReset(data.uid,'formula')}}/>
                        :
                        splitEnter(data.formula)
                    }
                </span>
            </div>
            {
                // data.kpi_flag === '0' && (ImmunityFlag || data.kpi_assessments == "0") && (data.kpi_state == "1" || data.kpi_state == "2" || (data.kpi_state == "0" && data.kpi_assessments == "0") || data.kpi_state == "3")
                data.kpi_flag === '0' && (ImmunityFlag || data.kpi_assessments == "0") //通用指标 模板设定 考核设定选择考核豁免为是的状态 显示考核豁免
                ?
                <div style = {{display:"flex",alignItems:"center",justifyContent:"flex-start"}}>
                    <span style = {{whiteSpace:"nowrap",width:"auto"}}>考核方式变更：</span>
                    <span>
                        {
                            data.rw //条件成立进入通用模板设置（未提交之前的设置页面）
                            ?
                            <div>
                                <EditItem
                                isEdit={data.kpi_state === '2' ? false : true}
                                show={
                                    <span>{data.kpi_assessments === '0'? '是' : '否' }</span>
                                }
                                edit={
                                    <RadioGroup defaultValue = {data.kpi_assessments ? data.kpi_assessments : "1"} onChange={(e)=>handleEdit(e.target.value,data.uid,'kpi_assessments')}>
                                        <RadioButton value="0">是</RadioButton>
                                        <RadioButton value="1">否</RadioButton>
                                    </RadioGroup>
                                }
                                onOk={test}
                                onCancel={()=>{handleReset(data.uid,'kpi_assessments')}}/>
                            </div>
                            : 
                            // data.kpi_state == "0" &&  (data.kpi_fill_state == "0" || data.kpi_fill_state == "1")
                            data.kpi_state == "3" //通用模板提交之后的状态
                            ?
                            <span>{data.kpi_assessments === '0'? '是' : '否' }</span> //成立显示考核豁免信息的是或者否
                            :
                            data.kpi_state == "0"  && (isShowPageSubmit(data)) //成立的话进入项目经理的填写状态（考核设定页面）
                            ?
                            <div>
                                <EditItem 
                                isEdit={data.kpi_state === '2' || (data.kpi_state === '0' && ImmunityFlag ) || (data.kpi_fill_state == "1" || data.kpi_fill_state == "3")? false : true}
                                show={
                                    <span>{data.kpi_assessment === '0'? '是' : '否' }</span>
                                }
                                edit={
                                    <RadioGroup defaultValue = {data.kpi_assessment ? data.kpi_assessment : "1"} onChange={(e)=>handleEdit(e.target.value,data.uid,'kpi_assessment')}>
                                        <RadioButton value="0">是</RadioButton>
                                        <RadioButton value="1">否</RadioButton>
                                    </RadioGroup>
                                }
                                onOk={test}
                                onCancel={()=>{handleReset(data.uid,'kpi_assessment')}}/>
                            </div>
                            :
                            <span>{data.kpi_assessment === '0'? '是' : '否' }</span>
                        }
                    </span>
                </div>
                :
                ""
            }

            {
                // data.kpi_assessment === "0" && data.kpi_state === "0" && data.kpi_flag === '0'
                data.kpi_assessment === "0" && data.kpi_flag === '0'
                ?
                <div style = {{display: "flex",alignItems:"center"}}>
                    <span style = {{whiteSpace:"nowrap",width:"auto"}}>申请变更理由：</span>
                    <span>
                        {
                            typeof(state) === "undefined" &&  (data.kpi_fill_state === "0" || data.kpi_fill_state === "1" || data.kpi_fill_state === "3")
                            ?
                            <EditItem
                                // isEdit={(data.kpi_state === '2' || data.kpi_state === '0') && data.kpi_fill_state == "1" ? false : true}
                                isEdit={data.kpi_state === '2' || (data.kpi_state === '0' && ImmunityFlag ) || (data.kpi_fill_state == "1" || data.kpi_fill_state == "3")? false : true}
                                show={data.reason}
                                edit={<TextArea rows={4} placeholder="请填写申请考核方式变更理由" defaultValue={data.reason}  onChange={(e)=>handleEdit(e.target.value,data.uid,'reason')}/>}
                                onOk={test}
                                onCancel={()=>{handleReset(data.uid,'reason')}}/>
                            :
                            splitEnter(data.reason)
                        }
                    </span>
                </div>
                :
                ""
            }
            {
                data.kpi_flag === '0'
                ?
                <div>
                    <span>系统计算：</span>
                    <span>
                        {
                            data.rw
                            ?
                            <EditItem
                                isEdit={data.kpi_state === '2' ? false : true}
                                show={
                                    <span>{data.tag === '1'? '是' : '否' }</span>
                                }
                                edit={
                                    <RadioGroup defaultValue={data.tag} onChange={(e)=>handleEdit(e.target.value,data.uid,'tag')}>
                                        <RadioButton value="1">是</RadioButton>
                                        <RadioButton value="0">否</RadioButton>
                                    </RadioGroup>
                                }
                                onOk={test}
                                onCancel={()=>{handleReset(data.uid,'tag')}}/>
                            :
                            <span>{data.tag === '1'? '是' : '否' }</span>
                        }
                    </span>
                </div>
                :
                ''
            }
        </div>
    );
}
export default AssessmentStandardScoreItem;
