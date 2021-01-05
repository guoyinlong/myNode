/**
 * 文件说明：全面激励报告首页
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 */

import React from "react";
import { connect } from 'dva';
import {Select, Button, Input, Upload,Tooltip,Table,Popconfirm,Tabs } from 'antd';
import Style from "./import.css";
import Cookie from "js-cookie";
import {OU_HQ_NAME_CN, OU_NAME_CN} from "../../../utils/config";
import message from "../../../components/commonApp/message";
import EditItem from "../../../components/employer/editComponent";
import * as services from '../../../services/encouragement/services';
import { postExcelFile } from '../../../utils/func'
import tableStyle from "../../../components/common/table.less";
import ReportExport from './reportExport.js'
const Option = Select.Option;
const { TabPane } = Tabs;

/**
 * 功能：特殊字符处理
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-01-01
 * @param text 待处理字符串
 */
function splitEnter(text){
  if(text)
    return <p style={{textAlign:'left'}} dangerouslySetInnerHTML={{__html:text.replace(/\n/g,'<br/>')}}></p>
};
class ImportInfo extends React.Component {

  state = {
    ou:null,
    dept:'',
    post:'',
    service:'',
    text:'',
    columns:[],
    width:'800px',
    batchild:'',
    params:{
      method: "POST",
      name: "outsourcer",
      multiple: false,
      showUploadList: false,
      listType: 'text',
      accept: '.xlsx,.xls',
      onChange:(info)=> {
        if (info.file.status === 'done') {
          if (info.file.response.RetCode == '1') {
            this.search(info.file.response.BATCHID)
            message.success(`导入成功！`);
          } else {
            message.error(info.file.response.RetVal);
            //message.info('模板不匹配或其他原因，导致导入失败！');
          }
        }else if (info.file.status === 'error') {
          message.error(` 导入失败！`);
        }
      },
      beforeUpload:(file)=>{
        return new Promise((resolve,reject)=>{
          const formdata = new FormData();
          formdata.append('outsourcer', file);
          const url="/microservice/allencouragement/encouragement/service/excledataverify";
          fetch(url, {
            method: 'POST',
            body: formdata,
          }).then(res =>res.json()).then((data)=>{
            if(data.RetCode=="1"){
              resolve(file)
            }else if (data.RetCode != '1') {
              const dataInfo = data.DataRows
              dataInfo ? 
              message.warning(
                dataInfo.map((item,index)=>{
                  return <span key={index+1} style={{display:'block'}}>{item}</span>
                })
              )
              :
              message.warning(
                data.RetVal
              )
            }
          })
        })
      }
    },
    //以信息类别为key，
    // importService为导入时action的服务地址。
    // searchService：为查询时对应的服务地址，有两种：一种普通adminSimpleQuery；一种加密（培训数量，年度薪酬，积点，福利）adminAdvanceInfoQuery
    //updateService:更新时用到的服务，可以修改某些项。
    //columns:对应的表头
    // width：对应的宽度

    //EditItem组件：
    // isEdit=false 不能编辑，true可以编辑，默认不能编辑状态。
    //show：默认信息：没有默认为空
    //eidt：编辑状态下的组件：两种，一种input，一种select
    //select状态下，多两个参数：init：查询下拉框的信息，param：查询时传递给后台的参数
    //onOk:编辑状态下点击确定时回调
    //onCancel:编辑状态下点击取消回调
    urlMap:{
      "基本信息":{"importService":"/microservice/exceldataimport/encourage/staffbascinfoimport","searchService":"adminSimpleQuery","updateService":"baskInfoUpdate",
      "columns":[
        {
          title:'员工编号',
          dataIndex:'staff_id',
          width:100,
          fixed: 'left',
        },
        {
          title:'姓名',
          dataIndex:'staff_name',
          width:100,
          fixed: 'left',
        },
        {
          title:'基本信息',
          children:[{
            title:'部门',
            dataIndex:'deptname',
            render:(text)=><div style={{textAlign:'left'}}>{text.split('-')[1]}</div>
          },
          {
            title:'员工状态',
            dataIndex:'staff_status',
            width:150,
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        init = {this.getWorkBook}
                        param = "员工状态"
                        edit={
                          <Select
                            style={{width:'100%'}}
                            defaultValue = {text}
                            onChange={this.itemSelectChange(item)}>
                            {this.props.wordBookList.map((i,index)=>
                              <Option key={index} value={i.code}>{i.name}</Option>)
                            }
                          </Select>
                        }
                        onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','staff_status',true)}
                        onCancel={()=>this.itemCancel(item,'staff_status',text)}
              />
          },
          {
            title:'身份证号',
            dataIndex:'id_card',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','id_card')}
                        onCancel={()=>this.itemCancel(item,'id_card',text)}
              />
          },
          {
            title:'出生日期',
            dataIndex:'birthday',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','birthday')}
                        onCancel={()=>this.itemCancel(item,'birthday',text)}
              />
          },
          {
            title:'手机',
            dataIndex:'phone_number',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','phone_number')}
                        onCancel={()=>this.itemCancel(item,'phone_number',text)}
              />
          },
          {
            title:'邮箱',
            dataIndex:'email',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','email')}
                        onCancel={()=>this.itemCancel(item,'email',text)}
              />
          },
          {
            title:'性别',
            dataIndex:'gender',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        init = {this.getWorkBook}
                        param = "性别"
                        edit={
                          <Select
                            style={{width:'100%'}}
                            defaultValue = {text}
                            onChange={this.itemSelectChange(item)}>
                            {this.props.wordBookList.map((i,index)=>
                              <Option key={index} value={i.code}>{i.name}</Option>)
                            }
                          </Select>
                        }
                        onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','gender',true)}
                        onCancel={()=>this.itemCancel(item,'gender',text)}
              />
          },
          {
            title:'婚姻状况',
            dataIndex:'marital_status',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        init = {this.getWorkBook}
                        param = "婚姻状况"
                        edit={
                          <Select
                            style={{width:'100%'}}
                            defaultValue = {text}
                            onChange={this.itemSelectChange(item)}>
                            {this.props.wordBookList.map((i,index)=>
                              <Option key={index} value={i.code}>{i.name}</Option>)
                            }
                          </Select>
                        }
                        onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','marital_status',true)}
                        onCancel={()=>this.itemCancel(item,'marital_status',text)}
              />
          },
          {
            title:'国籍',
            dataIndex:'country',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','country')}
                        onCancel={()=>this.itemCancel(item,'country',text)}
              />
          },
          {
            title:'民族',
            dataIndex:'nation',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','nation')}
                        onCancel={()=>this.itemCancel(item,'nation',text)}
              />
          },
          {
            title:'籍贯',
            dataIndex:'birth_place',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','birth_place')}
                        onCancel={()=>this.itemCancel(item,'birth_place',text)}
              />
          },
          {
            title:'政治面貌',
            dataIndex:'politics_status',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        init = {this.getWorkBook}
                        param = "政治面貌"
                        edit={
                          <Select
                            style={{width:'100%'}}
                            defaultValue = {text}
                            onChange={this.itemSelectChange(item)}>
                            {this.props.wordBookList.map((i,index)=>
                              <Option key={index} value={i.code}>{i.name}</Option>)
                            }
                          </Select>
                        }
                        onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','politics_status',true)}
                        onCancel={()=>this.itemCancel(item,'politics_status',text)}
              />
          },
          {
            title:'入党时间',
            dataIndex:'party_time',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','party_time')}
                        onCancel={()=>this.itemCancel(item,'party_time',text)}
              />
          },
          {
            title:'党内职务',
            dataIndex:'party_post',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','party_post')}
                        onCancel={()=>this.itemCancel(item,'party_post',text)}
              />
          },
          ],
        },
        {
          title:'附加信息',
          children:[{
            title:'户籍所在地',
            dataIndex:'regist_location',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','regist_location')}
                        onCancel={()=>this.itemCancel(item,'regist_location',text)}
              />
          },
          {
            title:'户口类型',
            dataIndex:'regist_type',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        init = {this.getWorkBook}
                        param = "户口类型"
                        edit={
                          <Select
                            style={{width:'100%'}}
                            defaultValue = {text}
                            onChange={this.itemSelectChange(item)}>
                            {this.props.wordBookList.map((i,index)=>
                              <Option key={index} value={i.code}>{i.name}</Option>)
                            }
                          </Select>
                        }
                        onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','regist_type',true)}
                        onCancel={()=>this.itemCancel(item,'regist_type',text)}
              />
          },
          {
            title:'档案存放地点',
            dataIndex:'record_location',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','record_location')}
                        onCancel={()=>this.itemCancel(item,'record_location',text)}
              />
          },
          {
            title:'加入企业年金时间',
            dataIndex:'company_annuity_join_day',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','company_annuity_join_day')}
                        onCancel={()=>this.itemCancel(item,'company_annuity_join_day',text)}
              />
          },
          {
            title:'公积金账号',
            dataIndex:'provident_fund_account',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','provident_fund_card')}
                        onCancel={()=>this.itemCancel(item,'provident_fund_card',text)}
              />
          },
          {
            title:'公积金联名卡号',
            dataIndex:'provident_fund_card',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','party_post')}
                        onCancel={()=>this.itemCancel(item,'party_post',text)}
              />
          },
          {
            title:'是否有亲属在联通系统内',
            dataIndex:'kinsfolk_relation',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        init = {this.getWorkBook}
                        param = "是否有亲属在联通系统内"
                        edit={
                          <Select
                            style={{width:'100%'}}
                            defaultValue = {text}
                            onChange={this.itemSelectChange(item)}>
                            {this.props.wordBookList.map((i,index)=>
                              <Option key={index} value={i.code}>{i.name}</Option>)
                            }
                          </Select>
                        }
                        onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','kinsfolk_relation',true)}
                        onCancel={()=>this.itemCancel(item,'kinsfolk_relation',text)}
              />
          },
          ],
        },
        {
          title:'学历信息',
          children:[{
            title:'最高学位',
            dataIndex:'lastest_degree',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        init = {this.getWorkBook}
                        param = "最高学位"
                        edit={
                          <Select
                            style={{width:'100%'}}
                            defaultValue = {text}
                            onChange={this.itemSelectChange(item)}>
                            {this.props.wordBookList.map((i,index)=>
                              <Option key={index} value={i.code}>{i.name}</Option>)
                            }
                          </Select>
                        }
                        onOk={()=> this.itemSave(item,'eduinfo','eduinfo_uid','lastest_degree',true)}
                        onCancel={()=>this.itemCancel(item,'lastest_degree',text)}
              />
          },
          {
            title:'学位证书编号',
            dataIndex:'degree_certificate_No',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'eduinfo','eduinfo_uid','degree_certificate_No')}
                        onCancel={()=>this.itemCancel(item,'degree_certificate_No',text)}
              />
          },
          {
            title:'最高学历',
            dataIndex:'lastest_education',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        init = {this.getWorkBook}
                        param = "最高学历"
                        edit={
                          <Select
                            style={{width:'100%'}}
                            defaultValue = {text}
                            onChange={this.itemSelectChange(item)}>
                            {this.props.wordBookList.map((i,index)=>
                              <Option key={index} value={i.code}>{i.name}</Option>)
                            }
                          </Select>
                        }
                        onOk={()=> this.itemSave(item,'eduinfo','eduinfo_uid','lastest_education',true)}
                        onCancel={()=>this.itemCancel(item,'lastest_education',text)}
              />
          },
          {
            title:'毕业院校',
            dataIndex:'graduated_school',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'eduinfo','eduinfo_uid','graduated_school')}
                        onCancel={()=>this.itemCancel(item,'graduated_school',text)}
              />
          },
          {
            title:'专业',
            dataIndex:'major',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'eduinfo','eduinfo_uid','major')}
                        onCancel={()=>this.itemCancel(item,'major',text)}
              />
          },
          {
            title:'学习形式',
            dataIndex:'learning_mode',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        init = {this.getWorkBook}
                        param = "学习形式"
                        edit={
                          <Select
                            style={{width:'100%'}}
                            defaultValue = {text}
                            onChange={this.itemSelectChange(item)}>
                            {this.props.wordBookList.map((i,index)=>
                              <Option key={index} value={i.code}>{i.name}</Option>)
                            }
                          </Select>
                        }
                        onOk={()=> this.itemSave(item,'eduinfo','eduinfo_uid','learning_mode',true)}
                        onCancel={()=>this.itemCancel(item,'learning_mode',text)}
              />
          },
          ],
        },
        {
          title:'工龄司龄信息',
          children:[{
            title:'参加工作时间',
            dataIndex:'join_work_day',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','join_work_day')}
                        onCancel={()=>this.itemCancel(item,'join_work_day',text)}
              />
          },
          {
            title:'加入联通系统时间',
            dataIndex:'join_unicom_day',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','join_unicom_day')}
                        onCancel={()=>this.itemCancel(item,'join_unicom_day',text)}
              />
          },
          {
            title:'联通司龄',
            dataIndex:'unicom_age',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','unicom_age')}
                        onCancel={()=>this.itemCancel(item,'unicom_age',text)}
              />
          },
          {
            title:'加入软研院时间',
            dataIndex:'join_ryy_day',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','join_ryy_day')}
                        onCancel={()=>this.itemCancel(item,'join_ryy_day',text)}
              />
          },
          {
            title:'软研院司龄',
            dataIndex:'ryy_age',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','ryy_age')}
                        onCancel={()=>this.itemCancel(item,'ryy_age',text)}
              />
          },
          {
            title:'入职渠道',
            dataIndex:'entry_way',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        init = {this.getWorkBook}
                        param = "入职渠道"
                        edit={
                          <Select
                            style={{width:'100%'}}
                            defaultValue = {text}
                            onChange={this.itemSelectChange(item)}>
                            {this.props.wordBookList.map((i,index)=>
                              <Option key={index} value={i.code}>{i.name}</Option>)
                            }
                          </Select>
                        }
                        onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','entry_way',true)}
                        onCancel={()=>this.itemCancel(item,'entry_way',text)}
              />
          },
            {
            title:'入职前单位',
            dataIndex:'pre_company',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','pre_company')}
                        onCancel={()=>this.itemCancel(item,'pre_company',text)}
              />
          },
          ],
        },
        {
          title:'亲属信息',
          children:[{
            title:'亲属员工编号',
            dataIndex:'kinsfolk_id',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'kinsfolkinfo','kinsfolkinfo_uid','kinsfolk_id')}
                        onCancel={()=>this.itemCancel(item,'kinsfolk_id',text)}
              />
          },
          {
            title:'亲属员工姓名',
            dataIndex:'kinsfolk_name',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'kinsfolkinfo','kinsfolkinfo_uid','kinsfolk_name')}
                        onCancel={()=>this.itemCancel(item,'kinsfolk_name',text)}
              />
          },
          {
            title:'联系电话',
            dataIndex:'kinsfolk_phone',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'kinsfolkinfo','kinsfolkinfo_uid','kinsfolk_phone')}
                        onCancel={()=>this.itemCancel(item,'kinsfolk_phone',text)}
              />
          },
          ],
        },
        {
          title:'操作',
          dataIndex:'delete',
          width:100,
          fixed: 'right',
          render:(text,record)=>
            <Popconfirm title="是否确认删除?" onConfirm={() => this.onDelete(record)}>
              <Button>删除</Button>
            </Popconfirm>
        },
          ],"width":"6800"},
      "合同信息":{"importService":"/microservice/exceldataimport/encourage/contractimport","searchService":"adminSimpleQuery","updateService":"contractUpdate",
        "columns":[
          {
            title:'员工编号',
            dataIndex:'staff_id',
            width:100,
            fixed: 'left',
          },
          {
            title:'姓名',
            dataIndex:'staff_name',
            width:100,
            fixed: 'left',
          },
          {
            title:'合同编号',
            dataIndex:'contract_id',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'contract','contract_uid','contract_id')}
                        onCancel={()=>this.itemCancel(item,'contract_id',text)}
              />
          },
          {
            title:'合同关系',
            dataIndex:'contractual_type',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        init = {this.getWorkBook}
                        param = "合同关系"
                        edit={
                          <Select
                            style={{width:'100%'}}
                            defaultValue = {text}
                            onChange={this.itemSelectChange(item)}>
                            {this.props.wordBookList.map((i,index)=>
                              <Option key={index} value={i.code}>{i.name}</Option>)
                            }
                          </Select>
                        }
                        onOk={()=> this.itemSave(item,'contract','contract_uid','contractual_type',true)}
                        onCancel={()=>this.itemCancel(item,'contractual_type',text)}
              />
          },
          {
            title:'当前劳动合同签订时间',
            dataIndex:'contract_sign_date',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'contract','contract_uid','contract_sign_date')}
                        onCancel={()=>this.itemCancel(item,'contract_sign_date',text)}
              />
          },
          {
            title:'合同期限(年)',
            dataIndex:'contract_term',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'contract','contract_uid','contract_term')}
                        onCancel={()=>this.itemCancel(item,'contract_term',text)}
              />
          },
          {
            title:'操作',
            dataIndex:'delete',
            width:100,
            fixed: 'right',
            render:(text,record)=>
              <Popconfirm title="是否确认删除?" onConfirm={( ) => this.onDelete(record)}>
                <Button>删除</Button>
              </Popconfirm>
          },
        ],"width":"800"},
      "奖惩信息":{"importService":"/microservice/exceldataimport/encourage/rewardimport","searchService":"adminSimpleQuery","updateService":"rewardInfoUpdate",
        "columns":[
          {
            title:'员工编号',
            dataIndex:'staff_id',
            width:100,
            fixed: 'left',
          },
          {
            title:'姓名',
            dataIndex:'staff_name',
            width:100,
            fixed: 'left',
          },
          {
            title:'时间',
            dataIndex:'datetime',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'reward','reward_uid','datetime')}
                        onCancel={()=>this.itemCancel(item,'datetime',text)}
              />
          },
          {
            title:'奖惩级别',
            dataIndex:'reward_level',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        init = {this.getWorkBook}
                        param = "奖惩级别"
                        edit={
                          <Select
                            style={{width:'100%'}}
                            defaultValue = {text}
                            onChange={this.itemSelectChange(item)}>
                            {this.props.wordBookList.map((i,index)=>
                              <Option key={index} value={i.code}>{i.name}</Option>)
                            }
                          </Select>
                        }
                        onOk={()=> this.itemSave(item,'reward','reward_uid','reward_level',true)}
                        onCancel={()=>this.itemCancel(item,'reward_level',text)}
              />
          },
          {
            title:'单位',
            dataIndex:'org_name',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'reward','reward_uid','org_name')}
                        onCancel={()=>this.itemCancel(item,'org_name',text)}
              />
          },
          {
            title:'奖惩类别',
            dataIndex:'reward_category',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        init = {this.getWorkBook}
                        param = "奖惩类别"
                        edit={
                          <Select
                            style={{width:'100%'}}
                            defaultValue = {text}
                            onChange={this.itemSelectChange(item)}>
                            {this.props.wordBookList.map((i,index)=>
                              <Option key={index} value={i.code}>{i.name}</Option>)
                            }
                          </Select>
                        }
                        onOk={()=> this.itemSave(item,'reward','reward_uid','reward_category',true)}
                        onCancel={()=>this.itemCancel(item,'reward_category',text)}
              />
          },
          {
            title:'具体内容',
            dataIndex:'reward_content',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'reward','reward_uid','reward_content')}
                        onCancel={()=>this.itemCancel(item,'reward_content',text)}
              />
          },
          {
            title:'奖惩类型',
            dataIndex:'reward_type',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        init = {this.getWorkBook}
                        param = "奖惩类型"
                        edit={
                          <Select
                            style={{width:'100%'}}
                            defaultValue = {text}
                            onChange={this.itemSelectChange(item)}>
                            {this.props.wordBookList.map((i,index)=>
                              <Option key={index} value={i.code}>{i.name}</Option>)
                            }
                          </Select>
                        }
                        onOk={()=> this.itemSave(item,'reward','reward_uid','reward_type',true)}
                        onCancel={()=>this.itemCancel(item,'reward_type',text)}
              />
          },
          {
            title:'操作',
            dataIndex:'delete',
            width:100,
            fixed: 'right',
            render:(text,record)=>
              <Popconfirm title="是否确认删除?" onConfirm={( ) => this.onDelete(record)}>
                <Button>删除</Button>
              </Popconfirm>
          },
        ],"width":"1400"},
      "借调信息":{"importService":"/microservice/exceldataimport/encourage/kinsfolkimport","searchService":"adminSimpleQuery","updateService":"secondmentUpdate",
        "columns":[
          {
            title:'员工编号',
            dataIndex:'staff_id',
            width:100,
            fixed: 'left',
          },
          {
            title:'姓名',
            dataIndex:'staff_name',
            width:100,
            fixed: 'left',
          },
          {
            title:'借调开始时间',
            dataIndex:'secondment_start',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'secondment','secondment_uid','secondment_start')}
                        onCancel={()=>this.itemCancel(item,'secondment_start',text)}
              />
          },
          {
            title:'借调结束时间',
            dataIndex:'secondment_end',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'secondment','secondment_uid','secondment_end')}
                        onCancel={()=>this.itemCancel(item,'secondment_end',text)}
              />
          },
          {
            title:'借调单位',
            dataIndex:'secondment_company',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'secondment','secondment_uid','secondment_company')}
                        onCancel={()=>this.itemCancel(item,'secondment_company',text)}
              />
          },
          {
            title:'操作',
            dataIndex:'delete',
            width:100,
            fixed: 'right',
            render:(text,record)=>
              <Popconfirm title="是否确认删除?" onConfirm={( ) => this.onDelete(record)}>
                <Button>删除</Button>
              </Popconfirm>
          },
        ],"width":"800"},
      "人才信息":{"importService":"/microservice/exceldataimport/encourage/talentimport","searchService":"adminSimpleQuery","updateService":"talentInfoUpdate",
        "columns":[
          {
            title:'员工编号',
            dataIndex:'staff_id',
            width:100,
            fixed: 'left',
          },
          {
            title:'姓名',
            dataIndex:'staff_name',
            width:100,
            fixed: 'left',
          },
          {
            title:'人才标识',
            dataIndex:'talent_type',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        init = {this.getWorkBook}
                        param = "人才标识"
                        edit={
                          <Select
                            style={{width:'100%'}}
                            defaultValue = {text}
                            onChange={this.itemSelectChange(item)}>
                            {this.props.wordBookList.map((i,index)=>
                              <Option key={index} value={i.code}>{i.name}</Option>)
                            }
                          </Select>
                        }
                        onOk={()=> this.itemSave(item,'talent','talent_uid','talent_type',true)}
                        onCancel={()=>this.itemCancel(item,'talent_type',text)}
              />
          },
          {
            title:'所属专业线',
            dataIndex:'profession_line',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'talent','talent_uid','profession_line')}
                        onCancel={()=>this.itemCancel(item,'profession_line',text)}
              />
          },
          {
            title:'人才评选时间',
            dataIndex:'select_time',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'talent','talent_uid','select_time')}
                        onCancel={()=>this.itemCancel(item,'select_time',text)}
              />
          },
          {
            title:'操作',
            dataIndex:'delete',
            width:100,
            fixed: 'right',
            render:(text,record)=>
              <Popconfirm title="是否确认删除?" onConfirm={( ) => this.onDelete(record)}>
                <Button>删除</Button>
              </Popconfirm>
          },
        ],"width":"800"},
      "考核信息":{"importService":"/microservice/exceldataimport/encourage/examineresultimport","searchService":"adminSimpleQuery",
        "columns":[
          {
            title:'员工编号',
            dataIndex:'staff_id',
            width:100,
            fixed: 'left',
          },
          {
            title:'姓名',
            dataIndex:'staff_name',
            width:100,
            fixed: 'left',
          },
          {
            title:'年度',
            dataIndex:'examine_year',
          },
          {
            title:'考核结果',
            dataIndex:'rank_year',
          },
          {
            title:'季度考核结果',
            children:[
              {
                title:'第一季度',
                dataIndex:'rank_season1',
              },
              {
                title:'第二季度',
                dataIndex:'rank_season2',
              },
              {
                title:'第三季度',
                dataIndex:'rank_season3',
              },
              {
                title:'第四季度',
                dataIndex:'rank_season4',
              },
            ]
          },
          {
            title:'操作',
            dataIndex:'delete',
            width:100,
            fixed: 'right',
            render:(text,record)=>
              <Popconfirm title="是否确认删除?" onConfirm={( ) => this.onDelete(record)}>
                <Button>删除</Button>
              </Popconfirm>
          },
        ],"width":"820"},
      "职称信息":{"importService":"/microservice/exceldataimport/encourage/titleimport","searchService":"adminSimpleQuery","updateService":"titleAndCertificateUpdate",
      "columns":[
        {
          title:'员工编号',
          dataIndex:'staff_id',
          width:100,
          fixed: 'left',
        },
        {
          title:'姓名',
          dataIndex:'staff_name',
          width:100,
          fixed: 'left',
        },
        {
          title:'职称系列',
          dataIndex:'title_type',
          render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        init = {this.getWorkBook}
                        param = "职称系列"
                        edit={
                          <Select
                            style={{width:'100%'}}
                            defaultValue = {text}
                            onChange={this.itemSelectChange(item)}>
                            {this.props.wordBookList.map((i,index)=>
                              <Option key={index} value={i.code}>{i.name}</Option>)
                            }
                          </Select>
                        }
                        onOk={()=> this.itemSave(item,'title','title_uid','title_type',true)}
                        onCancel={()=>this.itemCancel(item,'title_type',text)}
              />
        },
        {
          title:'职称等级',
          dataIndex:'title_level',
          render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        init = {this.getWorkBook}
                        param = "职称等级"
                        edit={
                          <Select
                            style={{width:'100%'}}
                            defaultValue = {text}
                            onChange={this.itemSelectChange(item)}>
                            {this.props.wordBookList.map((i,index)=>
                              <Option key={index} value={i.code}>{i.name}</Option>)
                            }
                          </Select>
                        }
                        onOk={()=> this.itemSave(item,'title','title_uid','title_level',true)}
                        onCancel={()=>this.itemCancel(item,'title_level',text)}
              />
        },
        {
          title:'获得职称时间',
          dataIndex:'title_date',
          render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'title','title_uid','title_date')}
                        onCancel={()=>this.itemCancel(item,'title_date',text)}
              />
        },
        {
          title:'操作',
          dataIndex:'delete',
          width:100,
          fixed: 'right',
          render:(text,record)=>
            <Popconfirm title="是否确认删除?" onConfirm={( ) => this.onDelete(record)}>
              <Button>删除</Button>
            </Popconfirm>
        },
      ],"width":"800"},
      "资格证书信息":{"importService":"/microservice/exceldataimport/encourage/professionimport","searchService":"adminSimpleQuery","updateService":"titleAndCertificateUpdate",
      "columns":[
        {
          title:'员工编号',
          dataIndex:'staff_id',
          width:100,
          fixed: 'left',
        },
        {
          title:'姓名',
          dataIndex:'staff_name',
          width:100,
          fixed: 'left',
        },
        {
          title:'专业技术资格名称',
          dataIndex:'certificate_name',
          render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'certificate','certificate_uid','certificate_name')}
                        onCancel={()=>this.itemCancel(item,'certificate_name',text)}
              />
        },
        {
          title:'专业技术资格证书编号',
          dataIndex:'certificate_No',
          render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'certificate','certificate_uid','certificate_No')}
                        onCancel={()=>this.itemCancel(item,'certificate_No',text)}
              />
        },
        {
          title:'获得时间',
          dataIndex:'certificate_date',
          render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'certificate','certificate_uid','certificate_date')}
                        onCancel={()=>this.itemCancel(item,'certificate_date',text)}
              />
        },
        {
          title:'操作',
          dataIndex:'delete',
          width:100,
          fixed: 'right',
          render:(text,record)=>
            <Popconfirm title="是否确认删除?" onConfirm={( ) => this.onDelete(record)}>
              <Button>删除</Button>
            </Popconfirm>
        },
      ],"width":"800"},
      "岗位职级晋升信息":{"importService":"/microservice/exceldataimport/encourage/postandpromotionimport","searchService":"adminSimpleQuery","updateService":"postAndPromotionUpdate",
        "columns":[
          {
            title:'员工编号',
            dataIndex:'staff_id',
            width:100,
            fixed: 'left',
          },
          {
            title:'姓名',
            dataIndex:'staff_name',
            width:80,
            fixed: 'left',
          },
          {
            title:'年份',
            dataIndex:'year',
            width:80,
            fixed: 'left',
          },
          {
            title:'岗位职级信息',
            children:[
              {
                title:'职级信息（22级）',
                dataIndex:'rank_level',
                render:(text,item)=>
                  <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                            defaultValue={text} maxLength = "200"
                            onChange={this.itemChange(item)}
                            />}
                            onOk={()=> this.itemSave(item,'rank','rank_uid','rank_level')}
                            onCancel={()=>this.itemCancel(item,'rank_level',text)}
                  />
              },
              {
                title:'职级信息（T职级）',
                dataIndex:'rank_sequence',
                render:(text,item)=>
                  <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                            defaultValue={text} maxLength = "200"
                            onChange={this.itemChange(item)}
                            />}
                            onOk={()=> this.itemSave(item,'rank','rank_uid','rank_sequence')}
                            onCancel={()=>this.itemCancel(item,'rank_sequence',text)}
                  />
              },
              {
                title:'绩效职级（T职级）',
                dataIndex:'rank_performance',
                render:(text,item)=>
                  <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                            defaultValue={text} maxLength = "200"
                            onChange={this.itemChange(item)}
                            />}
                            onOk={()=> this.itemSave(item,'rank','rank_uid','rank_performance')}
                            onCancel={()=>this.itemCancel(item,'rank_performance',text)}
                  />
              },
              {
                title:'岗位信息',
                dataIndex:'post',
                render:(text,item)=>
                  <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                            defaultValue={text} maxLength = "200"
                            onChange={this.itemChange(item)}
                            />}
                            onOk={()=> this.itemSave(item,'rank','rank_uid','post')}
                            onCancel={()=>this.itemCancel(item,'post',text)}
                  />
              },
              {
                title:'同级岗位任职开始时间',
                dataIndex:'serve_time',
                render:(text,item)=>
                  <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                            defaultValue={text} maxLength = "200"
                            onChange={this.itemChange(item)}
                            />}
                            onOk={()=> this.itemSave(item,'rank','rank_uid','serve_time')}
                            onCancel={()=>this.itemCancel(item,'serve_time',text)}
                  />
              },
            ]
          },
          {
            title:'晋升信息',
            children:[
              {
                title:'职级调整时间',
                dataIndex:'rank_adjust_time',
                render:(text,item)=>
                  <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                            defaultValue={text} maxLength = "200"
                            onChange={this.itemChange(item)}
                            />}
                            onOk={()=> this.itemSave(item,'promotion','promotion_uid','rank_adjust_time')}
                            onCancel={()=>this.itemCancel(item,'rank_adjust_time',text)}
                  />
              },
              {
                title:'职级调整路径',
                dataIndex:'rank_adjust_mode',
                render:(text,item)=>
                  <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                            init = {this.getWorkBook}
                            param = "职级调整路径"
                            edit={
                              <Select
                                style={{width:'100%'}}
                                defaultValue = {text}
                                onChange={this.itemSelectChange(item)}>
                                {this.props.wordBookList.map((i,index)=>
                                  <Option key={index} value={i.code}>{i.name}</Option>)
                                }
                              </Select>
                            }
                            onOk={()=> this.itemSave(item,'promotion','promotion_uid','rank_adjust_mode',true)}
                            onCancel={()=>this.itemCancel(item,'rank_adjust_mode',text)}
                  />
              },
              {
                title:'职级调整后结果',
                dataIndex:'rank_adjust_result',
                render:(text,item)=>
                  <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                            defaultValue={text} maxLength = "200"
                            onChange={this.itemChange(item)}
                            />}
                            onOk={()=> this.itemSave(item,'promotion','promotion_uid','rank_adjust_result')}
                            onCancel={()=>this.itemCancel(item,'rank_adjust_result',text)}
                  />
              },
              {
                title:'薪档调整时间',
                dataIndex:'payroll_adjust_time',
                render:(text,item)=>
                  <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                            defaultValue={text} maxLength = "200"
                            onChange={this.itemChange(item)}
                            />}
                            onOk={()=> this.itemSave(item,'promotion','promotion_uid','payroll_adjust_time')}
                            onCancel={()=>this.itemCancel(item,'payroll_adjust_time',text)}
                  />
              },
              {
                title:'薪档调整路径',
                dataIndex:'payroll_adjust_mode',
                render:(text,item)=>
                  <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                            init = {this.getWorkBook}
                            param = "薪档调整路径"
                            edit={
                              <Select
                                style={{width:'100%'}}
                                defaultValue = {text}
                                onChange={this.itemSelectChange(item)}>
                                {this.props.wordBookList.map((i,index)=>
                                  <Option key={index} value={i.code}>{i.name}</Option>)
                                }
                              </Select>
                            }
                            onOk={()=> this.itemSave(item,'promotion','promotion_uid','payroll_adjust_mode',true)}
                            onCancel={()=>this.itemCancel(item,'payroll_adjust_mode',text)}
                  />
              },
              {
                title:'薪档调整后结果',
                dataIndex:'payroll_adjust_result',
                render:(text,item)=>
                  <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                            defaultValue={text} maxLength = "200"
                            onChange={this.itemChange(item)}
                            />}
                            onOk={()=> this.itemSave(item,'promotion','promotion_uid','payroll_adjust_result')}
                            onCancel={()=>this.itemCancel(item,'payroll_adjust_result',text)}
                  />
              },
              {
                title:'薪档晋升积分剩余情况',
                dataIndex:'remain_points',
                render:(text,item)=>
                  <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                            defaultValue={text} maxLength = "200"
                            onChange={this.itemChange(item)}
                            />}
                            onOk={()=> this.itemSave(item,'promotion','promotion_uid','remain_points')}
                            onCancel={()=>this.itemCancel(item,'remain_points',text)}
                  />
              },
              {
                title:'是否G/D档封顶',
                dataIndex:'is_stay',
                render:(text,item)=>
                  <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                            init = {this.getWorkBook}
                            param = "是否G/D档封顶"
                            edit={
                              <Select
                                style={{width:'100%'}}
                                defaultValue = {text}
                                onChange={this.itemSelectChange(item)}>
                                {this.props.wordBookList.map((i,index)=>
                                  <Option key={index} value={i.code}>{i.name}</Option>)
                                }
                              </Select>
                            }
                            onOk={()=> this.itemSave(item,'promotion','promotion_uid','is_stay',true)}
                            onCancel={()=>this.itemCancel(item,'is_stay',text)}
                  />
              },
              {
                title:'G/D档封顶年份',
                dataIndex:'stay_time',
                render:(text,item)=>
                  <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                            defaultValue={text} maxLength = "200"
                            onChange={this.itemChange(item)}
                            />}
                            onOk={()=> this.itemSave(item,'promotion','promotion_uid','stay_time')}
                            onCancel={()=>this.itemCancel(item,'stay_time',text)}
                  />
              },
            ]
          },
          {
            title:'操作',
            dataIndex:'delete',
            width:100,
            fixed: 'right',
            render:(text,record)=>
              <Popconfirm title="是否确认删除?" onConfirm={( ) => this.onDelete(record)}>
                <Button>删除</Button>
              </Popconfirm>
          },
        ],"width":"3000"},
      "培训数量信息":{"importService":"/microservice/exceldataimport/encourage/trainingnumimport","searchService":"adminAdvanceInfoQuery","updateService":"trainingnNumUpdate",
        "columns":[
          {
            title:'员工编号',
            dataIndex:'staff_id',
            width:100,
            fixed: 'left',
          },
          {
            title:'姓名',
            dataIndex:'staff_name',
            width:100,
            fixed: 'left',
          },
          {
            title:'年度',
            dataIndex:'year',
            width:100,
            fixed: 'left',
          },
          {
            title:'应参加必修课数量',
            dataIndex:'required_course_plan_num',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'trainingNum','uid','required_course_plan_num')}
                        onCancel={()=>this.itemCancel(item,'required_course_plan_num',text)}
              />
          },
          {
            title:'应参加选修课数量',
            dataIndex:'selected_course_plan_num',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'trainingNum','uid','selected_course_plan_num')}
                        onCancel={()=>this.itemCancel(item,'selected_course_plan_num',text)}
              />
          },
          {
            title:'实际参加必修课数量',
            dataIndex:'required_course_actual_num',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'trainingNum','uid','required_course_actual_num')}
                        onCancel={()=>this.itemCancel(item,'required_course_actual_num',text)}
              />
          },
          {
            title:'实际参加选修课数量',
            dataIndex:'selected_course_actual_num',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'trainingNum','uid','selected_course_actual_num')}
                        onCancel={()=>this.itemCancel(item,'selected_course_actual_num',text)}
              />
          },
          {
            title:'参加内部培训次数',
            dataIndex:'internal_trained_num',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'trainingNum','uid','internal_trained_num')}
                        onCancel={()=>this.itemCancel(item,'internal_trained_num',text)}
              />
          },
          {
            title:'参加外部培训次数',
            dataIndex:'external_trained_num',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'trainingNum','uid','external_trained_num')}
                        onCancel={()=>this.itemCancel(item,'external_trained_num',text)}
              />
          },
          {
            title:'参加线下培训次数',
            dataIndex:'offline_trained_num',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'trainingNum','uid','offline_trained_num')}
                        onCancel={()=>this.itemCancel(item,'offline_trained_num',text)}
              />
          },
          {
            title:'参加线上培训次数',
            dataIndex:'online_trained_num',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'trainingNum','uid','online_trained_num')}
                        onCancel={()=>this.itemCancel(item,'online_trained_num',text)}
              />
          },
          {
            title:'内部授课次数',
            dataIndex:'internal_teaching_num',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'trainingNum','uid','internal_teaching_num')}
                        onCancel={()=>this.itemCancel(item,'internal_teaching_num',text)}
              />
          },
          {
            title:'内部授课总课时数',
            dataIndex:'internal_teaching_hours',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'trainingNum','uid','internal_teaching_hours')}
                        onCancel={()=>this.itemCancel(item,'internal_teaching_hours',text)}
              />
          },
          {
            title:'外部授课次数',
            dataIndex:'external_teaching_num',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'trainingNum','uid','external_teaching_num')}
                        onCancel={()=>this.itemCancel(item,'external_teaching_num',text)}
              />
          },
          {
            title:'外部授课总课时数',
            dataIndex:'external_teaching_hours',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'trainingNum','uid','external_teaching_hours')}
                        onCancel={()=>this.itemCancel(item,'external_teaching_hours',text)}
              />
          },
          {
            title:'导师员工编号',
            dataIndex:'tutor_id',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'trainingNum','uid','tutor_id')}
                        onCancel={()=>this.itemCancel(item,'tutor_id',text)}
              />
          },
          {
            title:'导师姓名',
            dataIndex:'username',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'trainingNum','uid','username')}
                        onCancel={()=>this.itemCancel(item,'username',text)}
              />
          },
          {
            title:'培训费用',
            dataIndex:'training_fees',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'trainingNum','uid','training_fees',false,true)}
                        onCancel={()=>this.itemCancel(item,'training_fees',text)}
              />
          },
          {
            title:'操作',
            dataIndex:'delete',
            width:100,
            fixed: 'right',
            render:(text,record)=>
              <Popconfirm title="是否确认删除?" onConfirm={( ) => this.onDelete(record)}>
                <Button>删除</Button>
              </Popconfirm>
          },
        ],"width":"3300"},
      "培训课程信息":{"importService":"/microservice/exceldataimport/encourage/trainingcourseimport","searchService":"adminSimpleQuery","updateService":"trainingCourseUpdate",
        "columns":[
          {
            title:'员工编号',
            dataIndex:'staff_id',
            width:100,
            fixed: 'left',
          },
          {
            title:'姓名',
            dataIndex:'staff_name',
            width:100,
            fixed: 'left',
          },
          {
            title:'年度',
            dataIndex:'year',
            width:100,
            fixed: 'left',
          },
          {
            title:'课程类型',
            dataIndex:'course_type',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        init = {this.getWorkBook}
                        param = "课程类型"
                        edit={
                          <Select
                            style={{width:'100%'}}
                            defaultValue = {text}
                            onChange={this.itemSelectChange(item)}>
                            {this.props.wordBookList.map((i,index)=>
                              <Option key={index} value={i.code}>{i.name}</Option>)
                            }
                          </Select>
                        }
                        onOk={()=> this.itemSave(item,'trainingCourse','trainingCourse_uid','course_type',true)}
                        onCancel={()=>this.itemCancel(item,'course_type',text)}
              />
          },
          {
            title:'参训/受训方式',
            dataIndex:'training_method',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        init = {this.getWorkBook}
                        param = "参训/受训方式"
                        edit={
                          <Select
                            style={{width:'100%'}}
                            defaultValue = {text}
                            onChange={this.itemSelectChange(item)}>
                            {this.props.wordBookList.map((i,index)=>
                              <Option key={index} value={i.code}>{i.name}</Option>)
                            }
                          </Select>
                        }
                        onOk={()=> this.itemSave(item,'trainingCourse','trainingCourse_uid','training_method',true)}
                        onCancel={()=>this.itemCancel(item,'training_method',text)}
              />
          },
          {
            title:'培训途径',
            dataIndex:'training_route',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        init = {this.getWorkBook}
                        param = "培训途径"
                        edit={
                          <Select
                            style={{width:'100%'}}
                            defaultValue = {text}
                            onChange={this.itemSelectChange(item)}>
                            {this.props.wordBookList.map((i,index)=>
                              <Option key={index} value={i.code}>{i.name}</Option>)
                            }
                          </Select>
                        }
                        onOk={()=> this.itemSave(item,'trainingCourse','trainingCourse_uid','training_route',true)}
                        onCancel={()=>this.itemCancel(item,'training_route',text)}
              />
          },
          {
            title:'课程名',
            dataIndex:'course',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'trainingCourse','trainingCourse_uid','course')}
                        onCancel={()=>this.itemCancel(item,'course',text)}
              />
          },
          {
            title:'课程课时数',
            dataIndex:'course_class',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'trainingCourse','trainingCourse_uid','course_class')}
                        onCancel={()=>this.itemCancel(item,'course_class',text)}
              />
          },
          {
            title:'培训时间',
            dataIndex:'course_training_time',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'trainingCourse','trainingCourse_uid','course_training_time')}
                        onCancel={()=>this.itemCancel(item,'course_training_time',text)}
              />
          },
          {
            title:'操作',
            dataIndex:'delete',
            width:100,
            fixed: 'right',
            render:(text,record)=>
              <Popconfirm title="是否确认删除?" onConfirm={( ) => this.onDelete(record)}>
                <Button>删除</Button>
              </Popconfirm>
          },
        ],"width":"1500"},
      "认可激励信息":{"importService":"/microservice/exceldataimport/encourage/recognizedimport","searchService":"adminSimpleQuery","updateService":"recognizedUpdate",
        "columns":[
          {
            title:'员工编号',
            dataIndex:'staff_id',
            width:100,
            fixed: 'left',
          },
          {
            title:'姓名',
            dataIndex:'staff_name',
            width:100,
            fixed: 'left',
          },
          {
            title:'年度',
            dataIndex:'year',
            width:100,
            fixed: 'left',
          },
          {
            title:'认可类型',
            dataIndex:'recognized_type',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        init = {this.getWorkBook}
                        param = "认可类型"
                        edit={
                          <Select
                            style={{width:'100%'}}
                            defaultValue = {text}
                            onChange={this.itemSelectChange(item)}>
                            {this.props.wordBookList.map((i,index)=>
                              <Option key={index} value={i.code}>{i.name}</Option>)
                            }
                          </Select>
                        }
                        onOk={()=> this.itemSave(item,'recognized','recognized_uid','recognized_type',true)}
                        onCancel={()=>this.itemCancel(item,'recognized_type',text)}
              />
          },
          {
            title:'具体时间',
            dataIndex:'obtain_time',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'recognized','recognized_uid','obtain_time')}
                        onCancel={()=>this.itemCancel(item,'obtain_time',text)}
              />
          },
          {
            title:'内容',
            dataIndex:'content',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'recognized','recognized_uid','content')}
                        onCancel={()=>this.itemCancel(item,'content',text)}
              />
          },
          {
            title:'操作',
            dataIndex:'delete',
            width:100,
            fixed: 'right',
            render:(text,record)=>
              <Popconfirm title="是否确认删除?" onConfirm={( ) => this.onDelete(record)}>
                <Button>删除</Button>
              </Popconfirm>
          },
      ],"width":"1300"},
      "积点信息":{"importService":"/microservice/exceldataimport/encourage/pointsimport","searchService":"adminAdvanceInfoQuery","updateService":"pointsUpdate","secretKey":true,
        "columns":[
          {
            title:'员工编号',
            dataIndex:'staff_id',
            width:100,
            fixed: 'left',
          },
          {
            title:'姓名',
            dataIndex:'staff_name',
            width:100,
            fixed: 'left',
          },
          {
            title:'年份',
            dataIndex:'year',
            width:80,
          },
          {
            title:'基本积点',
            dataIndex:'basic_point',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'points','uid','basic_point')}
                        onCancel={()=>this.itemCancel(item,'basic_point',text)}
              />
          },
          {
            title:'年龄积点',
            dataIndex:'age_point',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'points','uid','age_point')}
                        onCancel={()=>this.itemCancel(item,'age_point',text)}
              />
          },
          {
            title:'司龄积点',
            dataIndex:'company_age_point',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'points','uid','company_age_point')}
                        onCancel={()=>this.itemCancel(item,'company_age_point',text)}
              />
          },
          {
            title:'职级积点',
            dataIndex:'rank_point',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'points','uid','rank_point')}
                        onCancel={()=>this.itemCancel(item,'rank_point',text)}
              />
          },
          {
            title:'培训积点',
            dataIndex:'training_point',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'points','uid','training_point')}
                        onCancel={()=>this.itemCancel(item,'training_point',text)}
              />
          },
          {
            title:'认可积点',
            dataIndex:'recognized_point',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'points','uid','recognized_point')}
                        onCancel={()=>this.itemCancel(item,'recognized_point',text)}
              />
          },
          {
            title:'荣誉积点',
            dataIndex:'honor_point',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'points','uid','honor_point')}
                        onCancel={()=>this.itemCancel(item,'honor_point',text)}
              />
          },
          {
            title:'其他积点',
            dataIndex:'other_point',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'points','uid','other_point')}
                        onCancel={()=>this.itemCancel(item,'other_point',text)}
              />
          },
          {
            title:'认可奖励',
            dataIndex:'recognized_reward',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'points','uid','recognized_reward')}
                        onCancel={()=>this.itemCancel(item,'recognized_reward',text)}
              />
          },
          {
            title:'荣誉奖励',
            dataIndex:'honor_reward',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'points','uid','honor_reward')}
                        onCancel={()=>this.itemCancel(item,'honor_reward',text)}
              />
          },
          {
            title:'年度在岗月份数',
            dataIndex:'num_of_months_work',
            render:(text,item)=>
              <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'points','uid','num_of_months_work')}
                        onCancel={()=>this.itemCancel(item,'num_of_months_work',text)}
              />
          },
          {
            title:'操作',
            dataIndex:'delete',
            width:100,
            fixed: 'right',
            render:(text,record)=>
              <Popconfirm title="是否确认删除?" onConfirm={( ) => this.onDelete(record)}>
                <Button>删除</Button>
              </Popconfirm>
          },
        ],"width":"2000"},
      "福利信息":{"importService":"/microservice/exceldataimport/encourage/welfareinfoimport","searchService":"adminAdvanceInfoQuery","updateService":"annualWelfareUpdate","secretKey":true,
        "columns":[
          {
            title:'员工编号',
            dataIndex:'staff_id',
            width:100,
            fixed: 'left',
          },
          {
            title:'姓名',
            dataIndex:'staff_name',
            width:100,
            fixed: 'left',
          },
          {
            title:'年份',
            dataIndex:'year',
            width:100,
          },
          {
            title:'福利类别',
            children:[
              {
                title:'防暑降温费',
                dataIndex:'防暑降温费',
                render:(text,item)=>
                    <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'welfare','heatstrokeprevention_uid','welfare_amount')}
                        onCancel={()=>this.itemCancel(item,'防暑降温费',text)}
                    />
              },
              {
                title:'过节费',
                dataIndex:'过节费',
                render:(text,item)=>
                    <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'welfare','holiday_uid','welfare_amount')}
                        onCancel={()=>this.itemCancel(item,'过节费',text)}
                    />
              },
              {
                title:'取暖费',
                dataIndex:'取暖费',
                render:(text,item)=>
                    <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'welfare','heating_uid','welfare_amount')}
                        onCancel={()=>this.itemCancel(item,'取暖费',text)}
                    />
              },
              {
                title:'通信补贴',
                dataIndex:'通信补贴',
                render:(text,item)=>
                    <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'welfare','communication_uid','welfare_amount')}
                        onCancel={()=>this.itemCancel(item,'通信补贴',text)}
                    />
              },
              {
                title:'交通补贴',
                dataIndex:'交通补贴',
                render:(text,item)=>
                    <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'welfare','traffic_uid','welfare_amount')}
                        onCancel={()=>this.itemCancel(item,'交通补贴',text)}
                    />
              },
              {
                title:'就餐补贴',
                dataIndex:'就餐补贴',
                render:(text,item)=>
                    <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'welfare','dining_uid','welfare_amount')}
                        onCancel={()=>this.itemCancel(item,'就餐补贴',text)}
                    />
              },
              {
                title:'绿色出行补贴',
                dataIndex:'绿色出行补贴',
                render:(text,item)=>
                    <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'welfare','greentravel_uid','welfare_amount')}
                        onCancel={()=>this.itemCancel(item,'绿色出行补贴',text)}
                    />
              },
              {
                title:'劳保费',
                dataIndex:'劳保费',
                render:(text,item)=>
                    <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'welfare','laborinsurance_uid','welfare_amount')}
                        onCancel={()=>this.itemCancel(item,'劳保费',text)}
                    />
              },
              {
                title:'独生子女费',
                dataIndex:'独生子女费',
                render:(text,item)=>
                    <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'welfare','onechild_uid','welfare_amount')}
                        onCancel={()=>this.itemCancel(item,'独生子女费',text)}
                    />
              },
              {
                title:'体检费',
                dataIndex:'体检费',
                render:(text,item)=>
                    <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'welfare','medicalexamination_uid','welfare_amount')}
                        onCancel={()=>this.itemCancel(item,'体检费',text)}
                    />
              },
              {
                title:'年节福利费',
                dataIndex:'年节福利费',
                render:(text,item)=>
                    <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'welfare','annualwelfare_uid','welfare_amount')}
                        onCancel={()=>this.itemCancel(item,'年节福利费',text)}
                    />
              },
              {
                title:'探亲费',
                dataIndex:'探亲费',
                render:(text,item)=>
                    <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'welfare','visitingrelatives_uid','welfare_amount')}
                        onCancel={()=>this.itemCancel(item,'探亲费',text)}
                    />
              },
              {
                title:'其他',
                dataIndex:'其他',
                render:(text,item)=>
                    <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                        defaultValue={text} maxLength = "200"
                        onChange={this.itemChange(item)}
                        />}
                        onOk={()=> this.itemSave(item,'welfare','other_uid','welfare_amount')}
                        onCancel={()=>this.itemCancel(item,'其他',text)}
                    />
              },
            ]
          },
          {
            title:'操作',
            dataIndex:'delete',
            width:100,
            fixed: 'right',
            render:(text,record)=>
              <Popconfirm title="是否确认删除?" onConfirm={( ) => this.onDelete(record)}>
                <Button>删除</Button>
              </Popconfirm>
          },
        ],"width":"1920"},
      "年度薪酬信息":{"importService":"/microservice/exceldataimport/encourage/annualwageimport","searchService":"adminAdvanceInfoQuery","updateService":"annualWageUpdate","secretKey":true,
        "columns":[
          {
            title:'员工编号',
            dataIndex:'staff_id',
            width:100,
            fixed: 'left',
          },
          {
            title:'姓名',
            dataIndex:'staff_name',
            width:100,
            fixed: 'left',
          },
          {
            title:'年份',
            dataIndex:'year',
            width:80,
            fixed: 'left',
          },
          {
            title:'基本工资',
            dataIndex:'basic_wage',
            render:(text,item)=>
                <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                    edit={<Input
                    defaultValue={text} maxLength = "200"
                    onChange={this.itemChange(item)}
                    />}
                    onOk={()=> this.itemSave(item,'annualWage','uid','basic_wage')}
                    onCancel={()=>this.itemCancel(item,'basic_wage',text)}
                />
          },
          {
            title:'月季度绩效工资',
            dataIndex:'monthly_performance_pay',
            render:(text,item)=>
                <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                    edit={<Input
                    defaultValue={text} maxLength = "200"
                    onChange={this.itemChange(item)}
                    />}
                    onOk={()=> this.itemSave(item,'annualWage','uid','monthly_performance_pay')}
                    onCancel={()=>this.itemCancel(item,'monthly_performance_pay',text)}
                />
          },
          {
            title:'综合补贴',
            dataIndex:'comprehensive_subsidy',
            render:(text,item)=>
                <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                    edit={<Input
                    defaultValue={text} maxLength = "200"
                    onChange={this.itemChange(item)}
                    />}
                    onOk={()=> this.itemSave(item,'annualWage','uid','comprehensive_subsidy')}
                    onCancel={()=>this.itemCancel(item,'comprehensive_subsidy',text)}
                />
          },
          {
            title:'季度绩效工资',
            dataIndex:'quarterly_performance_pay',
            render:(text,item)=>
                <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                    edit={<Input
                    defaultValue={text} maxLength = "200"
                    onChange={this.itemChange(item)}
                    />}
                    onOk={()=> this.itemSave(item,'annualWage','uid','quarterly_performance_pay')}
                    onCancel={()=>this.itemCancel(item,'quarterly_performance_pay',text)}
                />
          },
          {
            title:'年度绩效工资',
            dataIndex:'annual_performance_pay',
            render:(text,item)=>
                <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                    edit={<Input
                    defaultValue={text} maxLength = "200"
                    onChange={this.itemChange(item)}
                    />}
                    onOk={()=> this.itemSave(item,'annualWage','uid','annual_performance_pay')}
                    onCancel={()=>this.itemCancel(item,'annual_performance_pay',text)}
                />
          },
          {
            title:'专项奖励',
            dataIndex:'special_reward',
            render:(text,item)=>
                <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                    edit={<Input
                    defaultValue={text} maxLength = "200"
                    onChange={this.itemChange(item)}
                    />}
                    onOk={()=> this.itemSave(item,'annualWage','uid','special_reward')}
                    onCancel={()=>this.itemCancel(item,'special_reward',text)}
                />
          },
          {
            title:'其他',
            dataIndex:'other_reward',
            render:(text,item)=>
                <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                    edit={<Input
                    defaultValue={text} maxLength = "200"
                    onChange={this.itemChange(item)}
                    />}
                    onOk={()=> this.itemSave(item,'annualWage','uid','other_reward')}
                    onCancel={()=>this.itemCancel(item,'other_reward',text)}
                />
          },
          {
            title:'医疗保险-企业',
            dataIndex:'medical_insurance_company',
            render:(text,item)=>
                <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                    edit={<Input
                    defaultValue={text} maxLength = "200"
                    onChange={this.itemChange(item)}
                    />}
                    onOk={()=> this.itemSave(item,'annualWage','uid','medical_insurance_company')}
                    onCancel={()=>this.itemCancel(item,'medical_insurance_company',text)}
                />
          },
          {
            title:'医疗保险-个人',
            dataIndex:'medical_insurance_personal',
            render:(text,item)=>
                <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                    edit={<Input
                    defaultValue={text} maxLength = "200"
                    onChange={this.itemChange(item)}
                    />}
                    onOk={()=> this.itemSave(item,'annualWage','uid','medical_insurance_personal')}
                    onCancel={()=>this.itemCancel(item,'medical_insurance_personal',text)}
                />
          },
          {
            title:'养老保险-企业',
            dataIndex:'pension_company',
            render:(text,item)=>
                <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                    edit={<Input
                    defaultValue={text} maxLength = "200"
                    onChange={this.itemChange(item)}
                    />}
                    onOk={()=> this.itemSave(item,'annualWage','uid','pension_company')}
                    onCancel={()=>this.itemCancel(item,'pension_company',text)}
                />
          },
          {
            title:'养老保险-个人',
            dataIndex:'pension_personal',
            render:(text,item)=>
                <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                    edit={<Input
                    defaultValue={text} maxLength = "200"
                    onChange={this.itemChange(item)}
                    />}
                    onOk={()=> this.itemSave(item,'annualWage','uid','pension_personal')}
                    onCancel={()=>this.itemCancel(item,'pension_personal',text)}
                />
          },
          {
            title:'失业保险-企业',
            dataIndex:'unemployment_insurance_company',
            render:(text,item)=>
                <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                    edit={<Input
                    defaultValue={text} maxLength = "200"
                    onChange={this.itemChange(item)}
                    />}
                    onOk={()=> this.itemSave(item,'annualWage','uid','unemployment_insurance_company')}
                    onCancel={()=>this.itemCancel(item,'unemployment_insurance_company',text)}
                />
          },
          {
            title:'失业保险-个人',
            dataIndex:'unemployment_insurance_personal',
            render:(text,item)=>
                <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                    edit={<Input
                    defaultValue={text} maxLength = "200"
                    onChange={this.itemChange(item)}
                    />}
                    onOk={()=> this.itemSave(item,'annualWage','uid','unemployment_insurance_personal')}
                    onCancel={()=>this.itemCancel(item,'unemployment_insurance_personal',text)}
                />
          },
          {
            title:'工伤保险-企业',
            dataIndex:'injury_insurance_company',
            render:(text,item)=>
                <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                    edit={<Input
                    defaultValue={text} maxLength = "200"
                    onChange={this.itemChange(item)}
                    />}
                    onOk={()=> this.itemSave(item,'annualWage','uid','injury_insurance_company')}
                    onCancel={()=>this.itemCancel(item,'injury_insurance_company',text)}
                />
          },
          {
            title:'生育保险-企业',
            dataIndex:'maternity_insurance_company',
            render:(text,item)=>
                <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                    edit={<Input
                    defaultValue={text} maxLength = "200"
                    onChange={this.itemChange(item)}
                    />}
                    onOk={()=> this.itemSave(item,'annualWage','uid','maternity_insurance_company')}
                    onCancel={()=>this.itemCancel(item,'maternity_insurance_company',text)}
                />
          },
          {
            title:'住房公积金-企业',
            dataIndex:'housing_fund_company',
            render:(text,item)=>
                <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                    edit={<Input
                    defaultValue={text} maxLength = "200"
                    onChange={this.itemChange(item)}
                    />}
                    onOk={()=> this.itemSave(item,'annualWage','uid','housing_fund_company')}
                    onCancel={()=>this.itemCancel(item,'housing_fund_company',text)}
                />
          },
          {
            title:'住房公积金-个人',
            dataIndex:'housing_fund_personal',
            render:(text,item)=>
                <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                    edit={<Input
                    defaultValue={text} maxLength = "200"
                    onChange={this.itemChange(item)}
                    />}
                    onOk={()=> this.itemSave(item,'annualWage','uid','housing_fund_personal')}
                    onCancel={()=>this.itemCancel(item,'housing_fund_personal',text)}
                />
          },
          {
            title:'企业年金-企业',
            dataIndex:'occupational_pension_company',
            render:(text,item)=>
                <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                    edit={<Input
                    defaultValue={text} maxLength = "200"
                    onChange={this.itemChange(item)}
                    />}
                    onOk={()=> this.itemSave(item,'annualWage','uid','occupational_pension_company')}
                    onCancel={()=>this.itemCancel(item,'occupational_pension_company',text)}
                />
          },
          {
            title:'企业年金-个人',
            dataIndex:'occupational_pension_personal',
            render:(text,item)=>
                <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                    edit={<Input
                    defaultValue={text} maxLength = "200"
                    onChange={this.itemChange(item)}
                    />}
                    onOk={()=> this.itemSave(item,'annualWage','uid','occupational_pension_personal')}
                    onCancel={()=>this.itemCancel(item,'occupational_pension_personal',text)}
                />
          },
          {
            title:'企业年金补缴-企业',
            dataIndex:'occupational_pension_add_company',
            render:(text,item)=>
                <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                    edit={<Input
                    defaultValue={text} maxLength = "200"
                    onChange={this.itemChange(item)}
                    />}
                    onOk={()=> this.itemSave(item,'annualWage','uid','occupational_pension_add_company')}
                    onCancel={()=>this.itemCancel(item,'occupational_pension_add_company',text)}
                />
          },
          {
            title:'企业年金补缴-个人',
            dataIndex:'occupational_pension_add_personal',
            render:(text,item)=>
                <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                    edit={<Input
                    defaultValue={text} maxLength = "200"
                    onChange={this.itemChange(item)}
                    />}
                    onOk={()=> this.itemSave(item,'annualWage','uid','occupational_pension_add_personal')}
                    onCancel={()=>this.itemCancel(item,'occupational_pension_add_personal',text)}
                />
          },
          {
            title:'补充医疗保险-员工',
            dataIndex:'supplementary_medical_insurance_staff',
            render:(text,item)=>
                <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                    edit={<Input
                    defaultValue={text} maxLength = "200"
                    onChange={this.itemChange(item)}
                    />}
                    onOk={()=> this.itemSave(item,'annualWage','uid','supplementary_medical_insurance_staff')}
                    onCancel={()=>this.itemCancel(item,'supplementary_medical_insurance_staff',text)}
                />
          },
          {
            title:'补充医疗保险-子女',
            dataIndex:'supplementary_medical_insurance_child',
            render:(text,item)=>
                <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                    edit={<Input
                    defaultValue={text} maxLength = "200"
                    onChange={this.itemChange(item)}
                    />}
                    onOk={()=> this.itemSave(item,'annualWage','uid','supplementary_medical_insurance_child')}
                    onCancel={()=>this.itemCancel(item,'supplementary_medical_insurance_child',text)}
                />
          },
          {
            title:'特需医疗基金',
            dataIndex:'special_medical_fund',
            render:(text,item)=>
                <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                    edit={<Input
                    defaultValue={text} maxLength = "200"
                    onChange={this.itemChange(item)}
                    />}
                    onOk={()=> this.itemSave(item,'annualWage','uid','special_medical_fund')}
                    onCancel={()=>this.itemCancel(item,'special_medical_fund',text)}
                />
          },
          {
            title:'年度纳税',
            dataIndex:'annual_tax',
            render:(text,item)=>
                <EditItem isEdit={false} show={text ? splitEnter(text) : ''}
                    edit={<Input
                    defaultValue={text} maxLength = "200"
                    onChange={this.itemChange(item)}
                    />}
                    onOk={()=> this.itemSave(item,'annualWage','uid','annual_tax')}
                    onCancel={()=>this.itemCancel(item,'annual_tax',text)}
                />
          },
          {
            title:'操作',
            dataIndex:'delete',
            width:100,
            fixed: 'right',
            render:(text,record)=>
              <Popconfirm title="是否确认删除?" onConfirm={( ) => this.onDelete(record)}>
                <Button>删除</Button>
              </Popconfirm>
          },
        ],"width":"4300"},
      "讲师信息":{"importService":"/microservice/allencouragement/encouragement/service/teacherimport","searchService":"adminSimpleQuery","secretKey":true,
        "columns":[
          {
            title:'员工编号',
            dataIndex:'teacher_id',
            width:100,
            fixed: 'left',
          },
          {
            title:'姓名',
            dataIndex:'teacher_name',
            width:100,
            fixed: 'left',
          },
          {
            title:'讲师等级',
            dataIndex:'teacher_rank',
            width:"30%",
          },
          {
            title:'有效期',
            dataIndex:'valid_time',
            width:"40%",
          },
          {
            title:'有效时间',
            dataIndex:'comment',
            width:"30%",
          },
          {
            title:'操作',
            dataIndex:'delete',
            width:100,
            fixed: 'right',
            render:(text,record)=>
              <Popconfirm title="是否确认删除?" onConfirm={( ) => this.onDelete(record)}>
                <Button>删除</Button>
              </Popconfirm>
          },
        ],"width":"900"},
    },
     currentKey:"1"
  };
  getWorkBook = (field) =>{
    const {dispatch} = this.props;
    dispatch({
      type:'encouragementImport/wordbookQuery',
      field
    });
  }
/**
   * 功能：修改
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2018-01-01
   * @param item
   * @param key
   */
  itemChange=(item)=>(e)=>{
    let value;
    if(e.target){
      value=e.target.value
      item["changedNewValue"]=value
    }
  }
  itemSelectChange=(item)=>(e)=>{
    let value;
    if(e){
      value=e
      item["changedNewValue"]=value
    }
  }
  /**
   * 功能：修改后保存修改项
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2018-01-01
   * @param item
   * @param table 批量服务参数param的key：basicinfo，rank，等
   * @param uidKey 批量服务参数param的key的值   需要更新的数据的uid(更新时需要给后台uid)，如果没有则表示数据不存在 例如'id_card'
   * @param key    批量服务参数param的key的值   需要更新的数据叫什么，例如basicinfo_uid
   * @param isSelect  没有用
   * @param isNumTraining  培训数量中，培训费需要加密
   */
  async itemSave(item,table,uidKey,key,isSelect,isNumTraining) {
    if(!item[uidKey]){
      message.warning("数据库尚无"+item.staff_name+"该类信息，不能修改，请导入此类数据！")
      return
    }
    const { urlMap,service} = this.state;
    //const { wordBookList } = this.props;
    let param;
    let that = this;
    //如果有secretKey，表示加密信息，必须传staff_id
    if(urlMap[service].secretKey || isNumTraining ){
      param = JSON.stringify({[table]:[{uid:item[uidKey],staff_id:item.staff_id,[key]:item['changedNewValue']}]});
    }else{
      param = JSON.stringify({[table]:[{uid:item[uidKey],[key]:item['changedNewValue']}]})
    }
    let saveRes=await services[urlMap[service].updateService]({
      param
    });
    if(saveRes && saveRes.RetCode =='1'){
      // if(isSelect){
      //   for(let i = 0; i < wordBookList.length; i++){
      //     if(wordBookList[i].code == item['changedNewValue']){
      //       item[key]= wordBookList[i].name;
      //       break;
      //     }
      //   }
      // }else{
      //   item[key]=item['changedNewValue']
      // }
      that.search();
      message.success("更新成功！")
    }else{
      message.error("更新失败！")
    }
  }

  /**
   * 功能：修改后保存修改项
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2018-01-01
   * @param item
   * @param key
   * @param history
   */
  itemCancel=(item,key,history)=>(e)=>{
    item[key]=history
  }

  //改变OU，触发查询部门和职务的服务，重新获取该OU下的部门和职务列表。
  handleOuChange = (value) => {
    this.setState ({
      ou: value,
      dept:'',
      post:'',
      service:'',
      text:''
    });
    const {dispatch} = this.props;
    dispatch({
      type:'encouragementImport/init',
    });
    dispatch({
      type:'encouragementImport/getDept',
      arg_param: value
    });
    dispatch({
      type:'encouragementImport/getPost',
      arg_param: value
    });
  };

  //选择部门
  handleDeptChange = (value) => {
    this.setState ({
      dept: value
    })
  };

  //选择职务
  handlePostChange = (value) => {
    this.setState ({
      post: value
    })
  };
  //选择信息类别
  handleServiceChange = (value) => {
    this.setState ({
      service: value,
    });
    this.props.dispatch({
      type: 'encouragementImport/getImportExl',
      value,
    });
  };
  //模糊查询
  handleTextChange = (e) => {
    this.setState ({
      text: e.target.value
    })
  };
  //清空查询条件，只保留OU
  clear = () => {
    this.setState ({
      dept:'',
      post:'',
      text:''
    });
  };

  //查询
  search = (BATCHID) => {
    let ou_search = this.state.ou;
    const { urlMap,dept,post,text,service } = this.state;
    let arg_params = {};
    if(BATCHID){
      arg_params["arg_batchid"] = BATCHID;
      this.setState({
        batchild:BATCHID
      })
      if(service !== ''){
        arg_params["arg_category"] = service;
      }
    }else{
      this.setState({
        batchild:''
      })
      if(ou_search === null){
        ou_search = Cookie.get('OU');
      }
      if(ou_search === OU_HQ_NAME_CN){ //选中联通软件研究院本部，传参：联通软件研究院
        ou_search = OU_NAME_CN;
      }

      arg_params["arg_ou"] = ou_search;
      if(dept !== ''){
        arg_params["arg_deptname"] = ou_search + '-' + dept; //部门传参加上前缀
      }
      if(post !== ''){
        arg_params["arg_postname"] = post;
      }
      if(text !== ''){
        arg_params["arg_search"] = text;
      }
      if(service !== ''){
        arg_params["arg_category"] = service;
      }
    }
    const {dispatch} = this.props;
    dispatch({
      type: 'encouragementImport/'+urlMap[service].searchService,
      param: arg_params
    });
    this.setState({
      columns:urlMap[service].columns,
      width:urlMap[service].width,
    })
  };
  importExl=()=>{
    window.open(this.props.importExl,'_blank');
  };
  exportExl =()=>{
    let paramData = {
      arg_ou:this.state.ou,
      arg_deptname:this.state.dept,
      arg_postname:this.state.post,
      arg_search:this.state.text,
      arg_category:this.state.service
    }
    postExcelFile(paramData,'/microservice/allencouragement/encouragement/service/infoexport')
  }
  // 删除
  onDelete = (record) => {
    if (this.timeOut) {
      clearTimeout(this.timeOut)
    }
    const param = {}
    const {service,batchild} = this.state
    param.name = service
    switch (service) {
      case "基本信息":
        record.basicinfo_uid?param.basicinfo_uid = record.basicinfo_uid?record.basicinfo_uid:'':null
        record.eduinfo_uid?param.eduinfo_uid = record.eduinfo_uid?record.eduinfo_uid:'':null
        record.kinsfolkinfo_uid?param.kinsfolkinfo_uid = record.kinsfolkinfo_uid?record.kinsfolkinfo_uid:'':null
        break;
      case "合同信息":
        record.contract_uid?param.contract_uid = record.contract_uid?record.contract_uid:'':null
        break;
      case "考核信息":
        record.staff_id?param.staff_id = record.staff_id?record.staff_id:'':null
        record.examine_year?param.examine_year = record.examine_year?record.examine_year:'':null
        break;
      case "岗位职级晋升信息":
        record.rank_uid?param.rank_uid = record.rank_uid?record.rank_uid:'':null
        record.promotion_uid?param.promotion_uid = record.promotion_uid?record.promotion_uid:'':null
        break;
      case "人才信息":
        record.talent_uid?param.talent_uid = record.talent_uid?record.talent_uid:'':null
        break;
      case "认可激励信息":
        record.recognized_uid?param.recognized_uid = record.recognized_uid?record.recognized_uid:'':null
        break;
      case "培训课程信息":
        record.trainingCourse_uid?param.trainingCourse_uid = record.trainingCourse_uid?record.trainingCourse_uid:'':null
        break;
      case "借调信息":
        record.secondment_uid?param.secondment_uid = record.secondment_uid?record.secondment_uid:'':null
        break;
      case "职称信息":
        record.title_uid?param.title_uid = record.title_uid?record.title_uid:'':null
        break;
      case "资格证书信息":
        record.certificate_uid?param.certificate_uid = record.certificate_uid?record.certificate_uid:'':null
        break;
      case "奖惩信息":
        record.reward_uid?param.reward_uid = record.reward_uid?record.reward_uid:'':null
        break;
      case "年度薪酬信息":
        record.uid?param.uid = record.uid?record.uid:'':null
        break;
      case "积点信息":
        record.uid?param.uid = record.uid?record.uid:'':null
        break;
      case "福利信息":
        record.heatstrokeprevention_uid?param.heatstrokeprevention_uid = record.heatstrokeprevention_uid?record.heatstrokeprevention_uid:'' :record.heatstrokeprevention_uid
        record.holiday_uid?param.holiday_uid = record.holiday_uid?record.holiday_uid:'':null
        record.traffic_uid?param.traffic_uid = record.traffic_uid?record.traffic_uid:'':null
        record.heating_uid?param.heating_uid = record.heating_uid?record.heating_uid:'':null
        record.communication_uid?param.communication_uid = record.communication_uid?record.communication_uid:'':null
        record.dining_uid?param.dining_uid = record.dining_uid?record.dining_uid:'':null
        record.greentravel_uid?param.greentravel_uid = record.greentravel_uid?record.greentravel_uid:'':null
        record.laborinsurance_uid?param.laborinsurance_uid = record.laborinsurance_uid?record.laborinsurance_uid:'':null
        record.onechild_uid?param.onechild_uid = record.onechild_uid?record.onechild_uid:'':null
        record.medicalexamination_uid?param.medicalexamination_uid = record.medicalexamination_uid?record.medicalexamination_uid:'':null
        record.annualwelfare_uid?param.annualwelfare_uid = record.annualwelfare_uid?record.annualwelfare_uid:'':null
        record.visitingrelatives_uid?param.visitingrelatives_uid = record.visitingrelatives_uid?record.visitingrelatives_uid:'':null
        record.other_uid?param.other_uid = record.other_uid?record.other_uid:'':null
        break;  
      case "培训数量信息":
        record.uid?param.uid = record.uid?record.uid:'':null
        break;
      case "讲师信息":
        record.id?param.uid = record.id?record.id:'':null
        break;
        
      default:
        break;
    }
    const {dispatch} = this.props
    dispatch({
      type:"encouragementImport/deletePersonData",
      param:param
    })
    this.timeOut = setTimeout(() => {
      if (batchild) {
        this.search(batchild)
      } else {
        this.search()
      }
    }, 1000);
  }

  componentWillUnmount (){
    clearTimeout(this.timeOut)
  }

    callback=(key)=>{
    if(key=="1"){
      this.reportExport.clearState()
      this.handleOuChange(Cookie.get('OU'))
    }
    this.setState({
    currentKey:key
    })
  }

  render() {
    const {  deptList,postList,dataList,messageList  } = this.props; // ouList, codesmell删除
    const { service,urlMap,columns,width,params  } = this.state;

    const deptOptionList = deptList.map((item) => {
      return (
        <Option key={item}>
          {item}
        </Option>
      )
    });
    const postOptionList = postList.map((item) => {
      return (
        <Option key={item.post_name}>
          {item.post_name}
        </Option>
      )
    });

    // 信息类别

      const serviceOptionList = messageList.map((item) => {
          return (
              <Option key={item.category_name}>
                  {item.category_name}
              </Option>
          )
      });


    const auth_ou = Cookie.get('OU');
    if(dataList){
      dataList.forEach((i,index)=>{
        i.key = index;
      })
    }
    return (
      <div className={Style.wrap}>
       <Tabs defaultActiveKey="1"onChange={this.callback}>
        <TabPane tab="人员信息" key="1" forceRender>
        <div style={{marginBottom:'10px'}}>
          <span>组织单元：</span>
          <span>{auth_ou}</span>
          <span style={{marginLeft:'50px'}}>部门：</span>
          <Select style={{width: 300}}  onSelect={this.handleDeptChange} value={this.state.dept}>
            {deptOptionList}
          </Select>
          <span style={{marginLeft:'50px'}}>职务：</span>
          <Select style={{width: 200}}  onSelect={this.handlePostChange} value={this.state.post}>
            {postOptionList}
          </Select>
        </div>

        <div style={{marginBottom:'10px'}}>
          <span>信息类别：</span>
          <Select style={{width: 220}}  onSelect={this.handleServiceChange} value={this.state.service}>
            {serviceOptionList}
          </Select>
          <span style={{marginLeft:'50px'}}>模糊搜索：</span>
          <Input style={{width: 200,marginRight:'50px'}} placeholder="姓名/员工编号/邮箱前缀/手机" onChange={this.handleTextChange} value={this.state.text}/>

          {service ?
            <Button type="primary" onClick={()=>this.search()}>{'查询'}</Button>
            : <Tooltip title={"请选择信息类别！"}>
              <Button disabled>查询</Button>
            </Tooltip>}
          <Button type="default" style={{marginLeft:'20px',marginRight:'20px'}} onClick={()=>this.clear()}>{'清空'}</Button>
          {service ?
            <Upload {...params} action={urlMap[service].importService}><Button>导入</Button></Upload>
            : <Tooltip title={"请选择信息类别！"}>
              <Button disabled>导入</Button>
            </Tooltip>}
          {service ?
            <Button style={{marginLeft:'20px'}} onClick={this.importExl}>模板下载</Button>
            : <Tooltip title={"请选择信息类别！"}>
              <Button style={{marginLeft:'20px'}} disabled>模板下载</Button>
            </Tooltip>}
          {service ?
            <Button style={{marginLeft:'20px'}} onClick={this.exportExl}>导出</Button>
            : <Tooltip title={"请选择信息类别！"}>
              <Button style={{marginLeft:'20px'}} disabled>导出</Button>
            </Tooltip>}
        </div>

        {service ?
          <div id="table1" className={tableStyle.orderTable}>
            <Table columns={columns} dataSource={dataList}
                   bordered
                   //size="middle"
                   scroll={{ x:parseInt(width) }}
                   loading = {this.props.loading}
            />
          </div>
        :null}
       </TabPane>
        <TabPane tab="激励报告" key="2" forceRender>
         <ReportExport onRef={(ref)=>this.reportExport=ref} currentKey={this.state.currentKey}>
         </ReportExport>
       </TabPane>
       </Tabs>
      </div>
    )
  }
}

/**
 * 功能：state数据注入组件
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-09-18
 * @param state 状态树
 */
function mapStateToProps(state) {
  const { ouList, deptList,postList,serviceList,dataList,wordBookList,importExl,messageList } = state.encouragementImport;

  return {
    ouList,
    deptList,
    postList,
    serviceList,
      messageList,
    dataList,
    wordBookList,
    importExl,
    loading: state.loading.models.encouragementImport,
  };
}
export default connect(mapStateToProps)(ImportInfo)
