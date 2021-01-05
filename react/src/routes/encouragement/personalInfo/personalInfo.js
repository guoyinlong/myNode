/**
 * 作者：罗玉棋
 * 日期：2019-09-12
 * 邮箱：809590923@qq.com
 * 文件说明：个人信息修改页
 * */
import React from "react";
import { connect } from 'dva';
import {Select, Button, Input,Tooltip,Table,Tabs,message,Collapse,Modal,Icon,Pagination,Spin,Card} from 'antd';
import Style from "./personal.less";
import Cookie from "js-cookie";
import PersonInfo from "./PersonInfoEdit.js";
import AddInfo from "./addForm.js";
import CompareInfo from "../CompareInfo/CompareInfo.js"
import tableStyle from "../../../components/common/table.less";
import Selector from './selector';
import * as personservice from "../../../services/encouragement/personalServices";
import moment from 'moment';
import 'moment/locale/zh-cn';
const { Panel } = Collapse;
const Option = Select.Option;
const { TabPane } = Tabs;
const categoryArr=["培训课程信息","资格证书信息","奖惩信息","借调信息","人才信息","职称信息"]
let wordBookList=[]
//功能：特殊字符处理
function splitEnter(text){
  return text+""
};
//分页
const chunk = (arr, size) =>{
  return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );
}
class PersonalInfo extends React.Component {
  state = {
    ou:null,
    dept:'',
    post:'',
    service:'',
    visible:false,
    editlInfoLoading:false,
    addlInfoLoading:false,
    text:'',
    submitList:[],
    columns:[],
    width:'800px',
    formVisble:false,
    category_id:"",
    btnshow:true,
    pureList:[],
    currentEditPage:1,
    currentAddPage:1,
    activeKey:"1",
    welfareIndex:"",//福利信息中文key
    opt:"",
    typeloading:false,
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
            render:(text,item)=>
            <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}                             
                      param = "姓名"
                      edit={<Input
                        defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                        onChange={this.itemChange(item,'staff_name')}
                      />}
                      onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','staff_name',"姓名",)}
                      onCancel={()=>this.itemCancel(item,'staff_name',text)}
            />
          },
          {
            title:'基本信息',
            children:[{
              title:'部门',
              dataIndex:'deptname',
              render:(text)=><div style={{textAlign:'left'}}>{text?text.split('-')[1]:""}</div>
            },
              {
                title:'员工状态',
                dataIndex:'staff_status',
                width:150,
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}                             
                            param = "员工状态"
                            edit={
                           <Selector                        
                            fieldName="员工状态"
                            style={{width:'100%'}}
                            defaultValue={text?text.split("~")[0]:""}
                             onChange={this.itemSelectChange(item,'staff_status')}>
                          </Selector>
                            }
                            onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','staff_status',"员工状态",)}
                            onCancel={()=>this.itemCancel(item,'staff_status',text)}
                  />
              },
              {
                title:'身份证号',
                dataIndex:'id_card',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'id_card')}
                            />}
                            onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','id_card')}
                            onCancel={()=>this.itemCancel(item,'id_card',text)}
                  />
              },
              {
                title:'出生日期',
                dataIndex:'birthday',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'birthday')}
                            />}
                            onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','birthday')}
                            onCancel={()=>this.itemCancel(item,'birthday',text)}
                  />
              },
              {
                title:'手机',
                dataIndex:'phone_number',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'phone_number')}
                            />}
                            onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','phone_number')}
                            onCancel={()=>this.itemCancel(item,'phone_number',text)}
                  />
              },
              {
                title:'邮箱',
                dataIndex:'email',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'email')}
                            />}
                            onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','email')}
                            onCancel={()=>this.itemCancel(item,'email',text)}
                  />
              },
              {
                title:'性别',
                dataIndex:'gender',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}                            
                            param = "性别"
                            edit={
                           <Selector                        
                            fieldName="性别"
                            style={{width:'100%'}}
                            defaultValue={text?text.split("~")[0]:""}
                             onChange={this.itemSelectChange(item,'gender')}>
                          </Selector>
                            }
                            onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','gender',"性别")}
                            onCancel={()=>this.itemCancel(item,'gender',text)}
                  />
              },
              {
                title:'婚姻状况',
                dataIndex:'marital_status',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}                           
                            param = "婚姻状况"
                            edit={
                           <Selector                        
                            fieldName="婚姻状况"
                            style={{width:'100%'}}
                            defaultValue={text?text.split("~")[0]:""}
                             onChange={this.itemSelectChange(item,'marital_status')}>
                          </Selector>
                            }
                            onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','marital_status',"婚姻状况")}
                            onCancel={()=>this.itemCancel(item,'marital_status',text)}
                  />
              },
              {
                title:'国籍',
                dataIndex:'country',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'country')}
                            />}
                            onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','country')}
                            onCancel={()=>this.itemCancel(item,'country',text)}
                  />
              },
              {
                title:'民族',
                dataIndex:'nation',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'nation')}
                            />}
                            onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','nation')}
                            onCancel={()=>this.itemCancel(item,'nation',text)}
                  />
              },
              {
                title:'籍贯',
                dataIndex:'birth_place',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'birth_place')}
                            />}
                            onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','birth_place')}
                            onCancel={()=>this.itemCancel(item,'birth_place',text)}
                  />
              },
              {
                title:'政治面貌',
                dataIndex:'politics_status',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}                            
                            param = "政治面貌"
                            edit={
                           <Selector                        
                            fieldName="政治面貌"
                            style={{width:'100%'}}
                            defaultValue={text?text.split("~")[0]:""}
                             onChange={this.itemSelectChange(item,'politics_status')}>
                          </Selector>
                            }
                            onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','politics_status',"政治面貌")}
                            onCancel={()=>this.itemCancel(item,'politics_status',text)}
                  />
              },
              {
                title:'入党时间',
                dataIndex:'party_time',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'party_time')}
                            />}
                            onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','party_time')}
                            onCancel={()=>this.itemCancel(item,'party_time',text)}
                  />
              },
              {
                title:'党内职务',
                dataIndex:'party_post',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'party_post')}
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
                <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                          edit={<Input
                            defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                            onChange={this.itemChange(item,'regist_location')}
                          />}
                          onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','regist_location')}
                          onCancel={()=>this.itemCancel(item,'regist_location',text)}
                />
            },
              {
                title:'户口类型',
                dataIndex:'regist_type',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}                             
                            param = "户口类型"
                            edit={
                           <Selector                        
                            fieldName="户口类型"
                            style={{width:'100%'}}
                            defaultValue={text?text.split("~")[0]:""}
                             onChange={this.itemSelectChange(item,'regist_type')}>
                          </Selector>
                            }
                            onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','regist_type',"户口类型")}
                            onCancel={()=>this.itemCancel(item,'regist_type',text)}
                  />
              },
              {
                title:'档案存放地点',
                dataIndex:'record_location',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'record_location')}
                            />}
                            onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','record_location')}
                            onCancel={()=>this.itemCancel(item,'record_location',text)}
                  />
              },
              {
                title:'加入企业年金时间',
                dataIndex:'company_annuity_join_day',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'company_annuity_join_day')}
                            />}
                            onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','company_annuity_join_day')}
                            onCancel={()=>this.itemCancel(item,'company_annuity_join_day',text)}
                  />
              },
              {
                title:'公积金账号',
                dataIndex:'provident_fund_account',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'provident_fund_account')}
                            />}
                            onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','provident_fund_card')}
                            onCancel={()=>this.itemCancel(item,'provident_fund_card',text)}
                  />
              },
              {
                title:'公积金联名卡号',
                dataIndex:'provident_fund_card',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'provident_fund_card')}
                            />}
                            onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','party_post')}
                            onCancel={()=>this.itemCancel(item,'party_post',text)}
                  />
              },
              {
                title:'是否有亲属在联通系统内',
                dataIndex:'kinsfolk_relation',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}                            
                            param = "是否有亲属在联通系统内"
                            edit={
                           <Selector                        
                            fieldName="是否有亲属在联通系统内"
                            style={{width:'100%'}}
                            defaultValue={text?text.split("~")[0]:""}
                             onChange={this.itemSelectChange(item,'kinsfolk_relation')}>
                          </Selector>
                            }
                            onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','kinsfolk_relation',"是否有亲属在联通系统内")}
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
                <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}                          
                          param = "最高学位"
                          edit={
                            <Selector                        
                            fieldName="最高学位"
                            style={{width:'100%'}}
                            defaultValue={text?text.split("~")[0]:""}
                             onChange={this.itemSelectChange(item,'lastest_degree')}>
                          </Selector>
                          }
                          onOk={()=> this.itemSave(item,'eduinfo','eduinfo_uid','lastest_degree',"最高学位")}
                          onCancel={()=>this.itemCancel(item,'lastest_degree',text)}
                />
            },
              {
                title:'学位证书编号',
                dataIndex:'degree_certificate_No',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'degree_certificate_No')}
                            />}
                            onOk={()=> this.itemSave(item,'eduinfo','eduinfo_uid','degree_certificate_No')}
                            onCancel={()=>this.itemCancel(item,'degree_certificate_No',text)}
                  />
              },
              {
                title:'最高学历',
                dataIndex:'lastest_education',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}                          
                            param = "最高学历"
                            edit={
                           <Selector                        
                            fieldName="最高学历"
                            style={{width:'100%'}}
                            defaultValue={text?text.split("~")[0]:""}
                             onChange={this.itemSelectChange(item,'lastest_education')}>
                          </Selector>
                            }
                            onOk={()=> this.itemSave(item,'eduinfo','eduinfo_uid','lastest_education',"最高学历")}
                            onCancel={()=>this.itemCancel(item,'lastest_education',text)}
                  />
              },
              {
                title:'毕业院校',
                dataIndex:'graduated_school',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'graduated_school')}
                            />}
                            onOk={()=> this.itemSave(item,'eduinfo','eduinfo_uid','graduated_school')}
                            onCancel={()=>this.itemCancel(item,'graduated_school',text)}
                  />
              },
              {
                title:'专业',
                dataIndex:'major',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'major')}
                            />}
                            onOk={()=> this.itemSave(item,'eduinfo','eduinfo_uid','major')}
                            onCancel={()=>this.itemCancel(item,'major',text)}
                  />
              },
              {
                title:'学习形式',
                dataIndex:'learning_mode',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}                            
                            param = "学习形式"
                            edit={
                           <Selector                        
                            fieldName="学习形式"
                            style={{width:'100%'}}
                            defaultValue={text?text.split("~")[0]:""}
                             onChange={this.itemSelectChange(item,'learning_mode')}>
                          </Selector>
                            }
                            onOk={()=> this.itemSave(item,'eduinfo','eduinfo_uid','learning_mode',"学习形式")}
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
                <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                          edit={<Input
                            defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                            onChange={this.itemChange(item,'join_work_day')}
                          />}
                          onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','join_work_day')}
                          onCancel={()=>this.itemCancel(item,'join_work_day',text)}
                />
            },
              {
                title:'加入联通系统时间',
                dataIndex:'join_unicom_day',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'join_unicom_day')}
                            />}
                            onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','join_unicom_day')}
                            onCancel={()=>this.itemCancel(item,'join_unicom_day',text)}
                  />
              },
              {
                title:'联通司龄',
                dataIndex:'unicom_age',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'unicom_age')}
                            />}
                            onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','unicom_age')}
                            onCancel={()=>this.itemCancel(item,'unicom_age',text)}
                  />
              },
              {
                title:'加入软研院时间',
                dataIndex:'join_ryy_day',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'join_ryy_day')}
                            />}
                            onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','join_ryy_day')}
                            onCancel={()=>this.itemCancel(item,'join_ryy_day',text)}
                  />
              },
              {
                title:'软研院司龄',
                dataIndex:'ryy_age',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'ryy_age')}
                            />}
                            onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','ryy_age')}
                            onCancel={()=>this.itemCancel(item,'ryy_age',text)}
                  />
              },
              {
                title:'入职渠道',
                dataIndex:'entry_way',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}                             
                            param = "入职渠道"
                            edit={
                           <Selector                        
                            fieldName="入职渠道"
                            style={{width:'100%'}}
                            defaultValue={text?text.split("~")[0]:""}
                             onChange={this.itemSelectChange(item,'entry_way')}>
                          </Selector>
                            }
                            onOk={()=> this.itemSave(item,'basicinfo','basicinfo_uid','entry_way',"入职渠道")}
                            onCancel={()=>this.itemCancel(item,'entry_way',text)}
                  />
              },
              {
                title:'入职前单位',
                dataIndex:'pre_company',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'pre_company')}
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
                <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                          edit={<Input
                            defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                            onChange={this.itemChange(item,'kinsfolk_id')}
                          />}
                          onOk={()=> this.itemSave(item,'kinsfolkinfo','kinsfolkinfo_uid','kinsfolk_id')}
                          onCancel={()=>this.itemCancel(item,'kinsfolk_id',text)}
                />
            },
              {
                title:'亲属员工姓名',
                dataIndex:'kinsfolk_name',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'kinsfolk_name')}
                            />}
                            onOk={()=> this.itemSave(item,'kinsfolkinfo','kinsfolkinfo_uid','kinsfolk_name')}
                            onCancel={()=>this.itemCancel(item,'kinsfolk_name',text)}
                  />
              },
              {
                title:'联系电话',
                dataIndex:'kinsfolk_phone',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'kinsfolk_phone')}
                            />}
                            onOk={()=> this.itemSave(item,'kinsfolkinfo','kinsfolkinfo_uid','kinsfolk_phone')}
                            onCancel={()=>this.itemCancel(item,'kinsfolk_phone',text)}
                  />
              },
            ],
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
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'contract_id')}
                        />}
                        onOk={()=> this.itemSave(item,'contract','contract_uid','contract_id')}
                        onCancel={()=>this.itemCancel(item,'contract_id',text)}
              />
          },
          {
            title:'合同关系',
            dataIndex:'contractual_type',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}                         
                        param = "合同关系"
                        edit={
                       <Selector                        
                            fieldName="合同关系"
                            style={{width:'100%'}}
                            defaultValue={text?text.split("~")[0]:""}
                             onChange={this.itemSelectChange(item,'contractual_type')}>
                          </Selector>
                        }
                        onOk={()=> this.itemSave(item,'contract','contract_uid','contractual_type',"合同关系")}
                        onCancel={()=>this.itemCancel(item,'contractual_type',text)}
              />
          },
          {
            title:'当前劳动合同签订时间',
            dataIndex:'contract_sign_date',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'contract_sign_date')}
                        />}
                        onOk={()=> this.itemSave(item,'contract','contract_uid','contract_sign_date')}
                        onCancel={()=>this.itemCancel(item,'contract_sign_date',text)}
              />
          },
          {
            title:'合同期限(年)',
            dataIndex:'contract_term',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'contract_term')}
                        />}
                        onOk={()=> this.itemSave(item,'contract','contract_uid','contract_term')}
                        onCancel={()=>this.itemCancel(item,'contract_term',text)}
              />
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
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'datetime')}
                        />}
                        onOk={()=> this.itemSave(item,'reward','reward_uid','datetime')}
                        onCancel={()=>this.itemCancel(item,'datetime',text)}
              />
          },
          {
            title:'奖惩级别',
            dataIndex:'reward_level',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}                         
                        param = "奖惩级别"
                        edit={
                           <Selector                        
                            fieldName="奖惩级别"
                            style={{width:'100%'}}
                            defaultValue={text?text.split("~")[0]:""}
                            onChange={this.itemSelectChange(item,"reward_level")}>
                          </Selector>
                        }
                        onOk={()=> this.itemSave(item,'reward','reward_uid','reward_level',"奖惩级别")}
                        onCancel={()=>this.itemCancel(item,'reward_level',text)}
              />
          },
          {
            title:'单位',
            dataIndex:'org_name',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'org_name')}
                        />}
                        onOk={()=> this.itemSave(item,'reward','reward_uid','org_name')}
                        onCancel={()=>this.itemCancel(item,'org_name',text)}
              />
          },
          {
            title:'奖惩类别',
            dataIndex:'reward_category',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}                        
                        param = "奖惩类别"
                        edit={
                           <Selector                        
                            fieldName="奖惩类别"
                            style={{width:'100%'}}
                            defaultValue={text?text.split("~")[0]:""}
                             onChange={this.itemSelectChange(item,'reward_category')}>
                          </Selector>
                        }
                        onOk={()=> this.itemSave(item,'reward','reward_uid','reward_category',"奖惩类别")}
                        onCancel={()=>this.itemCancel(item,'reward_category',text)}
              />
          },
          {
            title:'具体内容',
            dataIndex:'reward_content',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'reward_content')}
                        />}
                        onOk={()=> this.itemSave(item,'reward','reward_uid','reward_content')}
                        onCancel={()=>this.itemCancel(item,'reward_content',text)}
              />
          },
          {
            title:'奖惩类型',
            dataIndex:'reward_type',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}       
                        param = "奖惩类型"
                        edit={
                          <Selector                        
                            fieldName="奖惩类型"
                            style={{width:'100%'}}
                            defaultValue={text?text.split("~")[0]:""}
                             onChange={this.itemSelectChange(item,'reward_type')}>
                          </Selector>
                        }
                        onOk={()=> this.itemSave(item,'reward','reward_uid','reward_type',"奖惩类型")}
                        onCancel={()=>this.itemCancel(item,'reward_type',text)}
              />
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
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'secondment_start')}
                        />}
                        onOk={()=> this.itemSave(item,'secondment','secondment_uid','secondment_start')}
                        onCancel={()=>this.itemCancel(item,'secondment_start',text)}
              />
          },
          {
            title:'借调结束时间',
            dataIndex:'secondment_end',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'secondment_end')}
                        />}
                        onOk={()=> this.itemSave(item,'secondment','secondment_uid','secondment_end')}
                        onCancel={()=>this.itemCancel(item,'secondment_end',text)}
              />
          },
          {
            title:'借调单位',
            dataIndex:'secondment_company',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'secondment_company')}
                        />}
                        onOk={()=> this.itemSave(item,'secondment','secondment_uid','secondment_company')}
                        onCancel={()=>this.itemCancel(item,'secondment_company',text)}
              />
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
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}                         
                        param = "人才标识"
                        edit={
                           <Selector                        
                            fieldName="人才标识"
                            style={{width:'100%'}}
                            defaultValue={text?text.split("~")[0]:""}
                             onChange={this.itemSelectChange(item,'talent_type')}>
                          </Selector>
                        }
                        onOk={()=> this.itemSave(item,'talent','talent_uid','talent_type',"人才标识")}
                        onCancel={()=>this.itemCancel(item,'talent_type',text)}
              />
          },
          {
            title:'所属专业线',
            dataIndex:'profession_line',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'profession_line')}
                        />}
                        onOk={()=> this.itemSave(item,'talent','talent_uid','profession_line')}
                        onCancel={()=>this.itemCancel(item,'profession_line',text)}
              />
          },
          {
            title:'人才评选时间',
            dataIndex:'select_time',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'select_time')}
                        />}
                        onOk={()=> this.itemSave(item,'talent','talent_uid','select_time')}
                        onCancel={()=>this.itemCancel(item,'select_time',text)}
              />
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
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}                        
                        param = "职称系列"
                        edit={
                           <Selector                        
                            fieldName="职称系列"
                            style={{width:'100%'}}
                            defaultValue={text?text.split("~")[0]:""}
                             onChange={this.itemSelectChange(item,'title_type')}>
                          </Selector>
                        }
                        onOk={()=> this.itemSave(item,'title','title_uid','title_type',"职称系列")}
                        onCancel={()=>this.itemCancel(item,'title_type',text)}
              />
          },
          {
            title:'职称等级',
            dataIndex:'title_level',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}                         
                        param = "职称等级"
                        edit={
                           <Selector                        
                            fieldName="职称等级"
                            style={{width:'100%'}}
                            defaultValue={text?text.split("~")[0]:""}
                             onChange={this.itemSelectChange(item,'title_level')}>
                          </Selector>
                        }
                        onOk={()=> this.itemSave(item,'title','title_uid','title_level',"职称等级")}
                        onCancel={()=>this.itemCancel(item,'title_level',text)}
              />
          },
          {
            title:'获得职称时间',
            dataIndex:'title_date',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'title_date')}
                        />}
                        onOk={()=> this.itemSave(item,'title','title_uid','title_date')}
                        onCancel={()=>this.itemCancel(item,'title_date',text)}
              />
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
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'certificate_name')}
                        />}
                        onOk={()=> this.itemSave(item,'certificate','certificate_uid','certificate_name')}
                        onCancel={()=>this.itemCancel(item,'certificate_name',text)}
              />
          },
          {
            title:'专业技术资格证书编号',
            dataIndex:'certificate_No',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'certificate_No')}
                        />}
                        onOk={()=> this.itemSave(item,'certificate','certificate_uid','certificate_No')}
                        onCancel={()=>this.itemCancel(item,'certificate_No',text)}
              />
          },
          {
            title:'获得时间',
            dataIndex:'certificate_date',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'certificate_date')}
                        />}
                        onOk={()=> this.itemSave(item,'certificate','certificate_uid','certificate_date')}
                        onCancel={()=>this.itemCancel(item,'certificate_date',text)}
              />
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
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'rank_level')}
                            />}
                            onOk={()=> this.itemSave(item,'rank','rank_uid','rank_level')}
                            onCancel={()=>this.itemCancel(item,'rank_level',text)}
                  />
              },
              {
                title:'职级信息（T职级）',
                dataIndex:'rank_sequence',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'rank_sequence')}
                            />}
                            onOk={()=> this.itemSave(item,'rank','rank_uid','rank_sequence')}
                            onCancel={()=>this.itemCancel(item,'rank_sequence',text)}
                  />
              },
              {
                title:'绩效职级（T职级）',
                dataIndex:'rank_performance',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'rank_performance')}
                            />}
                            onOk={()=> this.itemSave(item,'rank','rank_uid','rank_performance')}
                            onCancel={()=>this.itemCancel(item,'rank_performance',text)}
                  />
              },
              {
                title:'岗位信息',
                dataIndex:'post',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'post')}
                            />}
                            onOk={()=> this.itemSave(item,'rank','rank_uid','post')}
                            onCancel={()=>this.itemCancel(item,'post',text)}
                  />
              },
              {
                title:'同级岗位任职开始时间',
                dataIndex:'serve_time',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'serve_time')}
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
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'rank_adjust_time')}
                            />}
                            onOk={()=> this.itemSave(item,'promotion','promotion_uid','rank_adjust_time')}
                            onCancel={()=>this.itemCancel(item,'rank_adjust_time',text)}
                  />
              },
              {
                title:'职级调整路径',
                dataIndex:'rank_adjust_mode',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}                             
                            param = "职级调整路径"
                            edit={
                           <Selector                        
                            fieldName="职级调整路径"
                            style={{width:'100%'}}
                            defaultValue={text?text.split("~")[0]:""}
                             onChange={this.itemSelectChange(item,'rank_adjust_mode')}>
                          </Selector>
                            }
                            onOk={()=> this.itemSave(item,'promotion','promotion_uid','rank_adjust_mode',"职级调整路径")}
                            onCancel={()=>this.itemCancel(item,'rank_adjust_mode',text)}
                  />
              },
              {
                title:'职级调整后结果',
                dataIndex:'rank_adjust_result',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                            defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'rank_adjust_result')}
                            />}
                            onOk={()=> this.itemSave(item,'promotion','promotion_uid','rank_adjust_result')}
                            onCancel={()=>this.itemCancel(item,'rank_adjust_result',text)}
                  />
              },
              {
                title:'薪档调整时间',
                dataIndex:'payroll_adjust_time',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'payroll_adjust_time')}
                            />}
                            onOk={()=> this.itemSave(item,'promotion','promotion_uid','payroll_adjust_time')}
                            onCancel={()=>this.itemCancel(item,'payroll_adjust_time',text)}
                  />
              },
              {
                title:'薪档调整路径',
                dataIndex:'payroll_adjust_mode',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}                             
                            param = "薪档调整路径"
                            edit={
                           <Selector                        
                            fieldName="薪档调整路径"
                            style={{width:'100%'}}
                            defaultValue={text?text.split("~")[0]:""}
                             onChange={this.itemSelectChange(item,'payroll_adjust_mode')}>
                          </Selector>
                            }
                            onOk={()=> this.itemSave(item,'promotion','promotion_uid','payroll_adjust_mode',"薪档调整路径")}
                            onCancel={()=>this.itemCancel(item,'payroll_adjust_mode',text)}
                  />
              },
              {
                title:'薪档调整后结果',
                dataIndex:'payroll_adjust_result',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'payroll_adjust_result')}
                            />}
                            onOk={()=> this.itemSave(item,'promotion','promotion_uid','payroll_adjust_result')}
                            onCancel={()=>this.itemCancel(item,'payroll_adjust_result',text)}
                  />
              },
              {
                title:'薪档晋升积分剩余情况',
                dataIndex:'remain_points',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'remain_points')}
                            />}
                            onOk={()=> this.itemSave(item,'promotion','promotion_uid','remain_points')}
                            onCancel={()=>this.itemCancel(item,'remain_points',text)}
                  />
              },
              {
                title:'是否G/D档封顶',
                dataIndex:'is_stay',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}                             
                            param = "是否G/D档封顶"
                            edit={
                           <Selector                        
                            fieldName="是否G/D档封顶"
                            style={{width:'100%'}}
                            defaultValue={text?text.split("~")[0]:""}
                             onChange={this.itemSelectChange(item,'is_stay')}>
                          </Selector>
                            }
                            onOk={()=> this.itemSave(item,'promotion','promotion_uid','is_stay',"是否G/D档封顶")}
                            onCancel={()=>this.itemCancel(item,'is_stay',text)}
                  />
              },
              {
                title:'G/D档封顶年份',
                dataIndex:'stay_time',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'stay_time')}
                            />}
                            onOk={()=> this.itemSave(item,'promotion','promotion_uid','stay_time')}
                            onCancel={()=>this.itemCancel(item,'stay_time',text)}
                  />
              },
            ]
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
               <PersonInfo init={item.lock}  isEdit={false} show={text ? splitEnter(text) : ''}
                edit={<Input
                  defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                  onChange={this.itemChange(item,'required_course_plan_num')}
                />}
                onOk={()=> this.itemSave(item,'trainingNum','uid','required_course_plan_num')}
                onCancel={()=>this.itemCancel(item,'required_course_plan_num',text)}
                />
          },
          {
            title:'应参加选修课数量',
            dataIndex:'selected_course_plan_num',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'selected_course_plan_num')}
                        />}
                        onOk={()=> this.itemSave(item,'trainingNum','uid','selected_course_plan_num')}
                        onCancel={()=>this.itemCancel(item,'selected_course_plan_num',text)}
              />
          },
          {
            title:'实际参加必修课数量',
            dataIndex:'required_course_actual_num',
            render:(text,item)=>
            <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'required_course_actual_num')}
                        />}
                        onOk={()=> this.itemSave(item,'trainingNum','uid','required_course_actual_num')}
                        onCancel={()=>this.itemCancel(item,'required_course_actual_num',text)}
              />
              
            
          },
          {
            title:'实际参加选修课数量',
            dataIndex:'selected_course_actual_num',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'selected_course_actual_num')}
                        />}
                        onOk={()=> this.itemSave(item,'trainingNum','uid','selected_course_actual_num')}
                        onCancel={()=>this.itemCancel(item,'selected_course_actual_num',text)}
              />
          },
          {
            title:'参加内部培训次数',
            dataIndex:'internal_trained_num',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'internal_trained_num')}
                        />}
                        onOk={()=> this.itemSave(item,'trainingNum','uid','internal_trained_num')}
                        onCancel={()=>this.itemCancel(item,'internal_trained_num',text)}
              />
          },
          {
            title:'参加外部培训次数',
            dataIndex:'external_trained_num',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'external_trained_num')}
                        />}
                        onOk={()=> this.itemSave(item,'trainingNum','uid','external_trained_num')}
                        onCancel={()=>this.itemCancel(item,'external_trained_num',text)}
              />
          },
          {
            title:'参加线下培训次数',
            dataIndex:'offline_trained_num',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'offline_trained_num')}
                        />}
                        onOk={()=> this.itemSave(item,'trainingNum','uid','offline_trained_num')}
                        onCancel={()=>this.itemCancel(item,'offline_trained_num',text)}
              />
          },
          {
            title:'参加线上培训次数',
            dataIndex:'online_trained_num',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'online_trained_num')}
                        />}
                        onOk={()=> this.itemSave(item,'trainingNum','uid','online_trained_num')}
                        onCancel={()=>this.itemCancel(item,'online_trained_num',text)}
              />
          },
          {
            title:'内部授课次数',
            dataIndex:'internal_teaching_num',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'internal_teaching_num')}
                        />}
                        onOk={()=> this.itemSave(item,'trainingNum','uid','internal_teaching_num')}
                        onCancel={()=>this.itemCancel(item,'internal_teaching_num',text)}
              />
          },
          {
            title:'内部授课总课时数',
            dataIndex:'internal_teaching_hours',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'internal_teaching_hours')}
                        />}
                        onOk={()=> this.itemSave(item,'trainingNum','uid','internal_teaching_hours')}
                        onCancel={()=>this.itemCancel(item,'internal_teaching_hours',text)}
              />
          },
          {
            title:'外部授课次数',
            dataIndex:'external_teaching_num',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'external_teaching_num')}
                        />}
                        onOk={()=> this.itemSave(item,'trainingNum','uid','external_teaching_num')}
                        onCancel={()=>this.itemCancel(item,'external_teaching_num',text)}
              />
          },
          {
            title:'外部授课总课时数',
            dataIndex:'external_teaching_hours',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'external_teaching_hours')}
                        />}
                        onOk={()=> this.itemSave(item,'trainingNum','uid','external_teaching_hours')}
                        onCancel={()=>this.itemCancel(item,'external_teaching_hours',text)}
              />
          },
          {
            title:'导师员工编号',
            dataIndex:'tutor_id',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'tutor_id')}
                        />}
                        onOk={()=> this.itemSave(item,'trainingNum','uid','tutor_id')}
                        onCancel={()=>this.itemCancel(item,'tutor_id',text)}
              />
          },
          {
            title:'导师姓名',
            dataIndex:'username',
            render:(text,item)=>
               <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'username')}
                        />}
                        onOk={()=> this.itemSave(item,'trainingNum','uid','username')}
                        onCancel={()=>this.itemCancel(item,'username',text)}
                      />
           
          
          },
          {
            title:'培训费用',
            dataIndex:'training_fees',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'training_fees')}
                        />}
                        onOk={()=> this.itemSave(item,'trainingNum','uid','training_fees',false,true)}
                        onCancel={()=>this.itemCancel(item,'training_fees',text)}
              />
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
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}                       
                        param = "课程类型"
                        edit={
                           <Selector                        
                            fieldName="课程类型"
                            style={{width:'100%'}}
                            defaultValue={text?text.split("~")[0]:""}
                             onChange={this.itemSelectChange(item,'course_type')}>
                          </Selector>
                        }
                        onOk={()=> this.itemSave(item,'trainingCourse','trainingCourse_uid','course_type',"课程类型")}
                        onCancel={()=>this.itemCancel(item,'course_type',text)}
              />
          },
          {
            title:'参训/受训方式',
            dataIndex:'training_method',
            render:(text,item)=> <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}                        
                        param = "参训/受训方式"
                        edit={
                           <Selector                        
                            fieldName="参训/受训方式"
                            style={{width:'100%'}}
                            defaultValue={text?text.split("~")[0]:""}
                             onChange={this.itemSelectChange(item,'training_method')}
                            >

                          </Selector>
                        }
                        onOk={()=> this.itemSave(item,'trainingCourse','trainingCourse_uid','training_method',"参训/受训方式")}
                        onCancel={()=>this.itemCancel(item,'training_method',text)}
              />
            
          },
          {
            title:'培训途径',
            dataIndex:'training_route',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}                        
                        param = "培训途径"
                        edit={
                           <Selector                        
                            fieldName="培训途径"
                            style={{width:'100%'}}
                            defaultValue={text?text.split("~")[0]:""}
                             onChange={this.itemSelectChange(item,'training_route')}>
                          </Selector>
                        }
                        onOk={()=> this.itemSave(item,'trainingCourse','trainingCourse_uid','training_route',"培训途径")}
                        onCancel={()=>this.itemCancel(item,'training_route',text)}
              />
          },
          {
            title:'课程名',
            dataIndex:'course',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'course')}
                        />}
                        onOk={()=> this.itemSave(item,'trainingCourse','trainingCourse_uid','course')}
                        onCancel={()=>this.itemCancel(item,'course',text)}
              />
          },
          {
            title:'课程课时数',
            dataIndex:'course_class',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'course_class')}
                        />}
                        onOk={()=> this.itemSave(item,'trainingCourse','trainingCourse_uid','course_class')}
                        onCancel={()=>this.itemCancel(item,'course_class',text)}
              />
          },
          {
            title:'培训时间',
            dataIndex:'course_training_time',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'course_training_time')}
                        />}
                        onOk={()=> this.itemSave(item,'trainingCourse','trainingCourse_uid','course_training_time')}
                        onCancel={()=>this.itemCancel(item,'course_training_time',text)}
              />
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
              <PersonInfo init={item.lock} init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}                       
                        param = "认可类型"
                        edit={
                           <Selector                        
                            fieldName="认可类型"
                            style={{width:'100%'}}
                            defaultValue={text?text.split("~")[0]:""}
                             onChange={this.itemSelectChange(item,'recognized_type')}>
                          </Selector>
                        }
                        onOk={()=> this.itemSave(item,'recognized','recognized_uid','recognized_type',"认可类型")}
                        onCancel={()=>this.itemCancel(item,'recognized_type',text)}
              />
          },
          {
            title:'具体时间',
            dataIndex:'obtain_time',
            render:(text,item)=>
              <PersonInfo init={item.lock}  isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'obtain_time')}
                        />}
                        onOk={()=> this.itemSave(item,'recognized','recognized_uid','obtain_time')}
                        onCancel={()=>this.itemCancel(item,'obtain_time',text)}
              />
          },
          {
            title:'内容',
            dataIndex:'content',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'content')}
                        />}
                        onOk={()=> this.itemSave(item,'recognized','recognized_uid','content')}
                        onCancel={()=>this.itemCancel(item,'content',text)}
              />
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
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'basic_point')}
                        />}
                        onOk={()=> this.itemSave(item,'points','uid','basic_point')}
                        onCancel={()=>this.itemCancel(item,'basic_point',text)}
              />
          },
          {
            title:'年龄积点',
            dataIndex:'age_point',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'age_point')}
                        />}
                        onOk={()=> this.itemSave(item,'points','uid','age_point')}
                        onCancel={()=>this.itemCancel(item,'age_point',text)}
              />
          },
          {
            title:'司龄积点',
            dataIndex:'company_age_point',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'company_age_point')}
                        />}
                        onOk={()=> this.itemSave(item,'points','uid','company_age_point')}
                        onCancel={()=>this.itemCancel(item,'company_age_point',text)}
              />
          },
          {
            title:'职级积点',
            dataIndex:'rank_point',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'rank_point')}
                        />}
                        onOk={()=> this.itemSave(item,'points','uid','rank_point')}
                        onCancel={()=>this.itemCancel(item,'rank_point',text)}
              />
          },
          {
            title:'培训积点',
            dataIndex:'training_point',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'training_point')}
                        />}
                        onOk={()=> this.itemSave(item,'points','uid','training_point')}
                        onCancel={()=>this.itemCancel(item,'training_point',text)}
              />
          },
          {
            title:'认可积点',
            dataIndex:'recognized_point',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'recognized_point')}
                        />}
                        onOk={()=> this.itemSave(item,'points','uid','recognized_point')}
                        onCancel={()=>this.itemCancel(item,'recognized_point',text)}
              />
          },
          {
            title:'荣誉积点',
            dataIndex:'honor_point',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'honor_point')}
                        />}
                        onOk={()=> this.itemSave(item,'points','uid','honor_point')}
                        onCancel={()=>this.itemCancel(item,'honor_point',text)}
              />
          },
          {
            title:'其他积点',
            dataIndex:'other_point',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'other_point')}
                        />}
                        onOk={()=> this.itemSave(item,'points','uid','other_point')}
                        onCancel={()=>this.itemCancel(item,'other_point',text)}
              />
          },
          {
            title:'认可奖励',
            dataIndex:'recognized_reward',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'recognized_reward')}
                        />}
                        onOk={()=> this.itemSave(item,'points','uid','recognized_reward')}
                        onCancel={()=>this.itemCancel(item,'recognized_reward',text)}
              />
          },
          {
            title:'荣誉奖励',
            dataIndex:'honor_reward',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'honor_reward')}
                        />}
                        onOk={()=> this.itemSave(item,'points','uid','honor_reward')}
                        onCancel={()=>this.itemCancel(item,'honor_reward',text)}
              />
          },
          {
            title:'年度在岗月份数',
            dataIndex:'num_of_months_work',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'num_of_months_work')}
                        />}
                        onOk={()=> this.itemSave(item,'points','uid','num_of_months_work')}
                        onCancel={()=>this.itemCancel(item,'num_of_months_work',text)}
              />
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
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'防暑降温费','heatstrokeprevention_uid')}
                            />}
                            onOk={()=> this.itemSave(item,'welfare_amount','heatstrokeprevention_uid','防暑降温费')}
                            onCancel={()=>this.itemCancel(item,'防暑降温费',text)}
                  />
              },
              {
                title:'过节费',
                dataIndex:'过节费',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'过节费','holiday_uid')}
                            />}
                            onOk={()=> this.itemSave(item,'welfare_amount','holiday_uid','过节费')}
                            onCancel={()=>this.itemCancel(item,'过节费',text)}
                  />
              },
              {
                title:'取暖费',
                dataIndex:'取暖费',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'取暖费','heating_uid')}
                            />}
                            onOk={()=> this.itemSave(item,'welfare_amount','heating_uid','取暖费')}
                            onCancel={()=>this.itemCancel(item,'取暖费',text)}
                  />
              },
              {
                title:'通信补贴',
                dataIndex:'通信补贴',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'通信补贴','communication_uid')}
                            />}
                            onOk={()=> this.itemSave(item,'welfare_amount','communication_uid','通信补贴')}
                            onCancel={()=>this.itemCancel(item,'通信补贴',text)}
                  />
              },
              {
                title:'交通补贴',
                dataIndex:'交通补贴',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'交通补贴','traffic_uid')}
                            />}
                            onOk={()=> this.itemSave(item,'welfare_amount','traffic_uid','交通补贴')}
                            onCancel={()=>this.itemCancel(item,'交通补贴',text)}
                  />
              },
              {
                title:'就餐补贴',
                dataIndex:'就餐补贴',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'就餐补贴','dining_uid')}
                            />}
                            onOk={()=> this.itemSave(item,'welfare_amount','dining_uid','就餐补贴')}
                            onCancel={()=>this.itemCancel(item,'就餐补贴',text)}
                  />
              },
              {
                title:'绿色出行补贴',
                dataIndex:'绿色出行补贴',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'绿色出行补贴','greentravel_uid')}
                            />}
                            onOk={()=> this.itemSave(item,'welfare_amount','greentravel_uid','绿色出行补贴')}
                            onCancel={()=>this.itemCancel(item,'绿色出行补贴',text)}
                  />
              },
              {
                title:'劳保费',
                dataIndex:'劳保费',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'劳保费','laborinsurance_uid')}
                            />}
                            onOk={()=> this.itemSave(item,'welfare_amount','laborinsurance_uid','劳保费')}
                            onCancel={()=>this.itemCancel(item,'劳保费',text)}
                  />
              },
              {
                title:'独生子女费',
                dataIndex:'独生子女费',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'独生子女费','onechild_uid')}
                            />}
                            onOk={()=> this.itemSave(item,'welfare_amount','onechild_uid','独生子女费')}
                            onCancel={()=>this.itemCancel(item,'独生子女费',text)}
                  />
              },
              {
                title:'体检费',
                dataIndex:'体检费',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'体检费','medicalexamination_uid')}
                            />}
                            onOk={()=> this.itemSave(item,'welfare_amount','medicalexamination_uid','体检费')}
                            onCancel={()=>this.itemCancel(item,'体检费',text)}
                  />
              },
              {
                title:'年节福利费',
                dataIndex:'年节福利费',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'年节福利费','annualwelfare_uid')}
                            />}
                            onOk={()=> this.itemSave(item,'welfare_amount','annualwelfare_uid','年节福利费')}
                            onCancel={()=>this.itemCancel(item,'年节福利费',text)}
                  />
              },
              {
                title:'探亲费',
                dataIndex:'探亲费',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'探亲费','visitingrelatives_uid')}
                            />}
                            onOk={()=> this.itemSave(item,'welfare_amount','visitingrelatives_uid','探亲费')}
                            onCancel={()=>this.itemCancel(item,'探亲费',text)}
                  />
              },
              {
                title:'其他',
                dataIndex:'其他',
                render:(text,item)=>
                  <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                            edit={<Input
                              defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                              onChange={this.itemChange(item,'其他','other_uid')}
                            />}
                            onOk={()=> this.itemSave(item,'welfare_amount','other_uid','其他')}
                            onCancel={()=>this.itemCancel(item,'其他',text)}
                  />
              },
            ]
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
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'basic_wage')}
                        />}
                        onOk={()=> this.itemSave(item,'annualWage','uid','basic_wage')}
                        onCancel={()=>this.itemCancel(item,'basic_wage',text)}
              />
          },
          {
            title:'月季度绩效工资',
            dataIndex:'monthly_performance_pay',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'monthly_performance_pay')}
                        />}
                        onOk={()=> this.itemSave(item,'annualWage','uid','monthly_performance_pay')}
                        onCancel={()=>this.itemCancel(item,'monthly_performance_pay',text)}
              />
          },
          {
            title:'综合补贴',
            dataIndex:'comprehensive_subsidy',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'comprehensive_subsidy')}
                        />}
                        onOk={()=> this.itemSave(item,'annualWage','uid','comprehensive_subsidy')}
                        onCancel={()=>this.itemCancel(item,'comprehensive_subsidy',text)}
              />
          },
          {
            title:'季度绩效工资',
            dataIndex:'quarterly_performance_pay',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'quarterly_performance_pay')}
                        />}
                        onOk={()=> this.itemSave(item,'annualWage','uid','quarterly_performance_pay')}
                        onCancel={()=>this.itemCancel(item,'quarterly_performance_pay',text)}
              />
          },
          {
            title:'年度绩效工资',
            dataIndex:'annual_performance_pay',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'annual_performance_pay')}
                        />}
                        onOk={()=> this.itemSave(item,'annualWage','uid','annual_performance_pay')}
                        onCancel={()=>this.itemCancel(item,'annual_performance_pay',text)}
              />
          },
          {
            title:'专项奖励',
            dataIndex:'special_reward',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'special_reward')}
                        />}
                        onOk={()=> this.itemSave(item,'annualWage','uid','special_reward')}
                        onCancel={()=>this.itemCancel(item,'special_reward',text)}
              />
          },
          {
            title:'其他',
            dataIndex:'other_reward',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'other_reward')}
                        />}
                        onOk={()=> this.itemSave(item,'annualWage','uid','other_reward')}
                        onCancel={()=>this.itemCancel(item,'other_reward',text)}
              />
          },
          {
            title:'医疗保险-企业',
            dataIndex:'medical_insurance_company',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'medical_insurance_company')}
                        />}
                        onOk={()=> this.itemSave(item,'annualWage','uid','medical_insurance_company')}
                        onCancel={()=>this.itemCancel(item,'medical_insurance_company',text)}
              />
          },
          {
            title:'医疗保险-个人',
            dataIndex:'medical_insurance_personal',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'medical_insurance_personal')}
                        />}
                        onOk={()=> this.itemSave(item,'annualWage','uid','medical_insurance_personal')}
                        onCancel={()=>this.itemCancel(item,'medical_insurance_personal',text)}
              />
          },
          {
            title:'养老保险-企业',
            dataIndex:'pension_company',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'pension_company')}
                        />}
                        onOk={()=> this.itemSave(item,'annualWage','uid','pension_company')}
                        onCancel={()=>this.itemCancel(item,'pension_company',text)}
              />
          },
          {
            title:'养老保险-个人',
            dataIndex:'pension_personal',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'pension_personal')}
                        />}
                        onOk={()=> this.itemSave(item,'annualWage','uid','pension_personal')}
                        onCancel={()=>this.itemCancel(item,'pension_personal',text)}
              />
          },
          {
            title:'失业保险-企业',
            dataIndex:'unemployment_insurance_company',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'unemployment_insurance_company')}
                        />}
                        onOk={()=> this.itemSave(item,'annualWage','uid','unemployment_insurance_company')}
                        onCancel={()=>this.itemCancel(item,'unemployment_insurance_company',text)}
              />
          },
          {
            title:'失业保险-个人',
            dataIndex:'unemployment_insurance_personal',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'unemployment_insurance_personal')}
                        />}
                        onOk={()=> this.itemSave(item,'annualWage','uid','unemployment_insurance_personal')}
                        onCancel={()=>this.itemCancel(item,'unemployment_insurance_personal',text)}
              />
          },
          {
            title:'工伤保险-企业',
            dataIndex:'injury_insurance_company',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'injury_insurance_company')}
                        />}
                        onOk={()=> this.itemSave(item,'annualWage','uid','injury_insurance_company')}
                        onCancel={()=>this.itemCancel(item,'injury_insurance_company',text)}
              />
          },
          {
            title:'生育保险-企业',
            dataIndex:'maternity_insurance_company',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'maternity_insurance_company')}
                        />}
                        onOk={()=> this.itemSave(item,'annualWage','uid','maternity_insurance_company')}
                        onCancel={()=>this.itemCancel(item,'maternity_insurance_company',text)}
              />
          },
          {
            title:'住房公积金-企业',
            dataIndex:'housing_fund_company',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'housing_fund_company')}
                        />}
                        onOk={()=> this.itemSave(item,'annualWage','uid','housing_fund_company')}
                        onCancel={()=>this.itemCancel(item,'housing_fund_company',text)}
              />
          },
          {
            title:'住房公积金-个人',
            dataIndex:'housing_fund_personal',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'housing_fund_personal')}
                        />}
                        onOk={()=> this.itemSave(item,'annualWage','uid','housing_fund_personal')}
                        onCancel={()=>this.itemCancel(item,'housing_fund_personal',text)}
              />
          },
          {
            title:'企业年金-企业',
            dataIndex:'occupational_pension_company',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'occupational_pension_company')}
                        />}
                        onOk={()=> this.itemSave(item,'annualWage','uid','occupational_pension_company')}
                        onCancel={()=>this.itemCancel(item,'occupational_pension_company',text)}
              />
          },
          {
            title:'企业年金-个人',
            dataIndex:'occupational_pension_personal',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'occupational_pension_personal')}
                        />}
                        onOk={()=> this.itemSave(item,'annualWage','uid','occupational_pension_personal')}
                        onCancel={()=>this.itemCancel(item,'occupational_pension_personal',text)}
              />
          },
          {
            title:'企业年金补缴-企业',
            dataIndex:'occupational_pension_add_company',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'occupational_pension_add_company')}
                        />}
                        onOk={()=> this.itemSave(item,'annualWage','uid','occupational_pension_add_company')}
                        onCancel={()=>this.itemCancel(item,'occupational_pension_add_company',text)}
              />
          },
          {
            title:'企业年金补缴-个人',
            dataIndex:'occupational_pension_add_personal',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'occupational_pension_add_personal')}
                        />}
                        onOk={()=> this.itemSave(item,'annualWage','uid','occupational_pension_add_personal')}
                        onCancel={()=>this.itemCancel(item,'occupational_pension_add_personal',text)}
              />
          },
          {
            title:'补充医疗保险-员工',
            dataIndex:'supplementary_medical_insurance_staff',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'supplementary_medical_insurance_staff')}
                        />}
                        onOk={()=> this.itemSave(item,'annualWage','uid','supplementary_medical_insurance_staff')}
                        onCancel={()=>this.itemCancel(item,'supplementary_medical_insurance_staff',text)}
              />
          },
          {
            title:'补充医疗保险-子女',
            dataIndex:'supplementary_medical_insurance_child',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'supplementary_medical_insurance_child')}
                        />}
                        onOk={()=> this.itemSave(item,'annualWage','uid','supplementary_medical_insurance_child')}
                        onCancel={()=>this.itemCancel(item,'supplementary_medical_insurance_child',text)}
              />
          },
          {
            title:'特需医疗基金',
            dataIndex:'special_medical_fund',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'special_medical_fund')}
                        />}
                        onOk={()=> this.itemSave(item,'annualWage','uid','special_medical_fund')}
                        onCancel={()=>this.itemCancel(item,'special_medical_fund',text)}
              />
          },
          {
            title:'年度纳税',
            dataIndex:'annual_tax',
            render:(text,item)=>
              <PersonInfo init={item.lock} isEdit={false} show={text ? splitEnter(text) : ''}
                        edit={<Input
                          defaultValue={text?text.split("~")[0]:""} maxLength = "200"
                          onChange={this.itemChange(item,'annual_tax')}
                        />}
                        onOk={()=> this.itemSave(item,'annualWage','uid','annual_tax')}
                        onCancel={()=>this.itemCancel(item,'annual_tax',text)}
              />
          },
        ],"width":"4300"},
    },
  };

  //选择类别
  handleServiceChange = (value,option) => {
    this.setState ({
      typeloading: true
    });
   let categoryId=option.props.dataKey;
   let btnshow= !categoryArr.some(item=>item==value)
  
    new Promise((resolve)=>{
    this.props.dispatch({
      type:"personalInfo/fieldInfo",
      category_id:categoryId,
      resolve
    })
    }).then(res=>{
     let {fieldList}=this.props 
      this.setState ({
        typeloading: false,
        service: value,
        category_id:categoryId,
        btnshow:!(fieldList||[]).some(item=>"1"==item.revisability)||btnshow,
      });
    })
   
   };

  //查询
  search = () => { 
  const { urlMap,service,category_id,submitList} = this.state;
  const {dispatch} = this.props;
  new Promise(resolve=>{
    dispatch({
      type:"personalInfo/fieldInfo",
      category_id:category_id,
      resolve
    })
  }).then(res=>{
    const{fieldList}=this.props
    this.setState({
      btnshow:!(fieldList||[]).some(item=>"1"==item.revisability)||!categoryArr.some(item=>item==service)
    })
  })

  if(submitList.length!=0){
    this.setState({
      visible:true,
    })
    return
    }

  if(category_id!=""&&service!=""){
    dispatch({
      type:"personalInfo/lockRow",
      category_id:category_id,
      category_name:service
    })

    this.setState({
      columns:urlMap[service].columns,
      width:urlMap[service].width,
    })

  }
  this.forceUpdate()
};

  //改变的数据
  itemChange=(item,dataindex,onlyUid)=>(e)=>{
    let uidkey,value;
    onlyUid==undefined?
     uidkey=this.getRowUid(dataindex)
    :
    uidkey=onlyUid
    if(e.target){
      value=e.target.value
      item[item[uidkey]+dataindex]=value
    }
  }
  //下拉改变的数据
  itemSelectChange=(item,dataindex)=>(e)=>{
    let uidkey=this.getRowUid(dataindex);
    let value;
    if(e){
      value=e
      item[item[uidkey]+dataindex]=value//行和列进行匹配确定唯一值
    }
  }
  //要确定indexOf("uid")是唯一的情况，不然返回多个数组是不对的
   getRowUid=(dataIndex)=>{
    const {fieldList,UidMap}=this.props;
    let uid, keyName;

    fieldList.forEach(item=>{
        if( item.column_name==dataIndex){
          uid= item.uid
        }
      }
    )

    if(uid){
      UidMap.forEach((table)=>{
      if(table.field_uid.indexOf(uid)>=0){
      keyName=table.table_uid 
        } 
      })
    }

      return keyName
   }

  /**
   * 功能：修改后保存修改项
   * @param item  那一行的数据
   * @param table 批量服务参数param的key：basicinfo，rank，等
   * @param uidKey 行编号
   * @param key  dataindex  
   * @param isSelect select中的参数
   * @param isNumTraining  培训数量中，培训费需要加密
   */ 
   //item,'rank','rank_uid','rank_level'
   itemSave=async (item,table,uidKey,key,isSelect,isNumTraining)=> {
    //console.log(item,table,uidKey,key,isSelect,isNumTraining,item[uidKey])
    if(!item[uidKey]){
      message.warning("数据库尚无"+item.staff_name+"该类信息，不能修改，请导入此类数据！")
      return
    }
    let { DataRows }=await personservice.wordbookQuery({ arg_field_name: isSelect });
    wordBookList=DataRows;
    const {fieldList,originalList}=this.props;
    const {category_id,service}=this.state
    let field_uid,field_name;
    
    if(table=="welfare_amount"){

      fieldList.forEach(item=>{
        if( item.column_comment==key){
          field_uid=item.uid
          field_name=item.column_comment
        }
      }
      )
    }else{
      fieldList.forEach(item=>{
        if( item.column_name==key){
          field_uid=item.uid
          field_name=item.column_comment
        }
      }
      )
    }
     //原始数据
    let preDdata,newval,isDateValid;
    originalList.forEach((org)=>{
      if(org[uidKey]==item[uidKey]){
        preDdata=org[key]
        if(moment(org[key].split("~")[0],"YYYY-MM-DD",true).isValid()){
        if(moment(item[item[uidKey]+key].trim(),"YYYY-MM-DD",true).isValid()){
          newval=item[item[uidKey]+key]
          isDateValid=true
        }else{
          message.warning("时间格式不正确，请重新填写！")
          isDateValid=false
        }
       }else{
          newval=item[item[uidKey]+key]
          isDateValid=true
        }
       
      }
    })
    if(!isDateValid) return;
    //考虑下拉选择是自己的情况，此时要转为code
    //对new-data进行处理
  
    if(newval.replace(/\s*/g,"").length==0){
      message.warning("内容不能为空,请重新填写！")
      return
    }
    let param = 
        {
          opt:"update",
          year:item.year,
          category_uid:category_id,
          category_name:service,
          data_uid:item[uidKey],//那一行的数据
          field_uid:field_uid,
          field_name:field_name,
          pre_data:this.keyvalueMap(preDdata),//对pre-data进行处理
          new_data:newval,
        }
    
        this.pureData(param,field_uid,item,uidKey,key)
  } 
      //对下拉框opt为code处理
  keyvalueMap=(fieldValue)=>{

    let val,result;
    if(fieldValue.indexOf("~")>0){
    let str=fieldValue.split("~")[0];
    val= str.indexOf(" ")?str.replace(/\s*/g,""):str
    }else{
      val=fieldValue
    }
    //循环很多次要是单次不跳出的话就会继续被循环赋值     
    wordBookList.forEach(item1=>{
      if(item1.name==val){
      result=item1.code;
      return
      }
      if(item1.code==val){
      result=item1.name
        return         
      }
    })
    result==undefined?result=val:result
      return result
    }

  //暂时保存的数据
  pureData=(param,field_uid,row,uidKey,key)=>{
    //每次保存时候就只是一个所以保证了数据的唯一性
    let {pureList}=this.state;
    let matching=false;
    if(pureList.length>0){
      pureList.forEach((item,index)=>{  
      if(field_uid==item.field_uid&&row[uidKey]==item.data_uid){//行列都相等唯一确认格子的数据
        pureList[index]=param;//基本数据类型值改变了数组还是原来的，引用类型改变了就是改变了原本的数据（替换）
        matching=true
      }
    })
      if(!matching){
        pureList.push(param);
      }
     
    }else{
      pureList.push(param);
    }
   //保存最新数据后对现有项进行处理
   row[row[uidKey]+key]==""?
   row[key]=" "+"~true":
   typeof(parseInt(row[row[uidKey]+key]))=="number" ?
   row[key]=this.keyvalueMap(row[row[uidKey]+key])+"~true":
   row[key]=row[row[uidKey]+key]+"~true" 
    let original;
    const { copyList }=this.props
    copyList.forEach(el=>{
      if(el[uidKey]==row[uidKey]){
       el[key]==row[key].replace(/\s*/g,"")?
       //el[key]==row[key]?
      original=this.keyvalueMap(row[key]).replace(/\s*/g,""):original=false
      }
    })
     //pureList=pureList.filter(item=>(item.new_data!=original));
    pureList=pureList.filter(item=>(
      item.new_data==""?
      item.new_data.replace(/\s*/g,"")===original
      :
      item.new_data.replace(/\s*/g,"")!==original
      
      ));//去除左右两边的空格
   
    this.setState({
    submitList:pureList,
    pureList:pureList
    })
     //react强制更新
    this.forceUpdate()
  }

  //取消
  itemCancel=(item,key,history)=>(e)=>{
    item[key]=history
  }

  //提交数据
  handDataInfo=()=>{
   let{uneditCount,editCount}=this.props
   if(editCount!=uneditCount){
    message.warning("有修改过的信息没有保存，请核对信息后再提交！",3)
    return
   }
   let {submitList,category_id }=this.state
   let formatList=JSON.stringify(submitList)
   new Promise((resolve)=>{
   this.props.dispatch({
     type:"personalInfo/submit",
     formatList,
     category_id,
     resolve
   }),

   this.setState({
     submitList:[],
     pureList:[]
   })

 }).then(res=>{
   this.search()
  })
  }
  
  //增加按钮个人信息
  addInfo=()=>{
  this.setState({
    formVisble:true
  })
  }
  //取消-弹出框
  handCancel=()=>{
    this.setState({
      formVisble:false
    })
  }
 //修改信息弹出框
  editCancel=()=>{
    this.setState({
      visible:false
    })
    this.setState({
      submitList:[],
      pureList:[]
    })
  }
 //修改信息弹出框
 editOk=()=>{
  this.setState({
    visible:false
  })
 this.handDataInfo()
 }
  //确认增加-弹出框
  handOk=(values)=>{
    this.setState({
      formVisble:false
    })
   new Promise((resolve)=>{
    this.props.dispatch({
      type:"personalInfo/addInfo",
      values,
      resolve
    })
   }).then(res=>{
      this.search()
     }
   ) 
  }

  //tab切换监听
  callback=key=>{
  //提交后这里要查一下提交时选择的类的信息和对应的被锁住的信息
  key=="1"?(
  this.setState({
    activeKey:"1"
  }),
 this.props.tableList.length==0?"":this.search()
  )
  :
  (
  this.setState({
    activeKey:"2"
  }),
  this.props.dispatch({
    type:"personalInfo/historyInfo"
    })
  )
  }

  changePanel = key => {
    let option=""
    let paramsList = this.props.historyList;
    paramsList.forEach((item) => {
      if (key == item.key) {
       
         if(item.opt=="update"){
          this.props.dispatch({
            type: "personalInfo/save",
            payload: {
              update_loading: true,
               dataList:[],
               tbList:[]
            }
          });
         }
         if(item.opt=="insert"){
           
          this.props.dispatch({
            type: "personalInfo/save",
            payload: {
              insert_loading: true,
              insert_dataList:[],
               insert_tbList:[]
            }
          });
         }
        
        this.props.dispatch({
          type: "personalInfo/dataInfo",
          category_name: item.category_name,
          batchid: item.batchid,
          arg_categoryid:item.category_uid,
          opt:item.opt
        });
        option=item.opt
      }
    });
    this.props.dispatch({
      type:"personalInfo/historyInfo"
      })
   this.setState({
    opt:option
   })

  };


  changeEditPage= (page) => {
    this.setState({
      editlInfoLoading:true
    })
    setTimeout(() => {
      this.setState({
        currentEditPage: page,
        editlInfoLoading:false
      });
    }, 500); 
  }

  changeAddPage= (page) => {
    this.setState({
      addlInfoLoading:true
    })
    setTimeout(() => {
      this.setState({
        currentAddPage: page,
        addlInfoLoading:false
      });
    }, 500); 
  }

  render() {
    let { tableList,categoryList,historyList,dataList,tbList,historyMap,insert_tbList, insert_dataList,insert_historyMap} = this.props; // ouList, codesmell删除
    const { service,btnshow,columns,width,formVisble,submitList,activeKey,category_id,typeloading} = this.state;
    let editlength=historyList.filter((item)=>item.opt=="update").length;
    let editPageData=chunk(historyList.filter((item)=>item.opt=="update"),6)[this.state.currentEditPage-1];
    let addlength=historyList.filter((item)=>item.opt=="insert").length;
    let addPageData=chunk(historyList.filter((item)=>item.opt=="insert"),6)[this.state.currentAddPage-1]
    // 信息类别
    const serviceOptionList = categoryList.map((item) => {
      return (
        <Option value={item.category_name} key={item.uid} dataKey={item.uid}> 
          {item.category_name}
        </Option>
      )
    });

    const auth_ou = Cookie.get('OU');

    if(tableList){
      tableList.forEach((i,index)=>{
        i.key = index;
      })
    }

    const editlInfo=(editPageData||[]).map((item,index) => {
        return (
          <Panel
            header={
              <div style={{border:"1px soild #000000"}}>
              <span> 我对 【{item.category_name}】
                  做了以下修改
                </span>
                <div style={{float: "right",width:"200px",height:"20px"}}>
                <div style={{float: "left",width:"130px"}}>
                {item.create_time}
                </div>
                <div style={{width:"65px",float: "right",color: item.flag == 1 ? "#FFA54F" : item.flag==-1? "#00CD00":item.tag==1?"#00CD00":"#FF6347"}}>
                 {item.flag == "1" ? "待审核" : item.flag == "-1" ? "修改成功":item.flag == "2" ? item.tag==1 ? "已通过":"未通过":"" }
                </div>
                </div>
              </div>
                   }
            key={item.key} style={{backgroundColor: (index)%2==0?"#ffffff":"rgb(216, 237, 242)"}}
          >
            <div style={{backgroundColor: "rgba(243, 253, 253, 0.87)"}} className={Style.collapse}>
              <br></br> <br></br><br></br>
              <CompareInfo
                category_name={item.category_name}
                dataList={dataList}
                loading={this.props.update_loading}
                tbList={tbList}
                UidMap={historyMap}
              ></CompareInfo>
              <br/><br/><br></br>
            {item.unpass_reason?
            <div>
            <Card title="未通过原因"extra={<Icon type="exclamation-circle" />}  
            style={{ width: 370,height:190,marginLeft:15,backgroundColor:"rgba(214, 239, 244, 0.86)" }}className={Style.card}>
            {item.unpass_reason}
            </Card>
            <br></br>
            </div>
            :
            ""
            }
            </div>
          </Panel>
        )
    });

    const addlInfo=(addPageData||[]).map((item,index) => {
      return (
        <Panel
          header={
            <div>
            <span> 我对 【{item.category_name}】
                做了以下新增
              </span>
              <div style={{float: "right",width:"200px",height:"20px"}}>
                <div style={{float: "left",width:"130px"}}>
                {item.create_time}
                </div>
                <div style={{width:"65px",float: "right",color: item.flag == 1 ? "#FFA54F" : item.flag==-1? "#00CD00":item.tag==1?"#00CD00":"#FF6347"}}>
                 {item.flag == "1" ? "待审核" : item.flag == "-1" ? "新增成功":item.flag == "2" ? item.tag==1 ? "已通过":"未通过":"" }
                </div>
                </div>
            </div>
                 }
          key={item.key} style={{backgroundColor: (index)%2==0?"#ffffff":"rgb(216, 237, 242)"}}
        >
        
          <div className={Style.collapse} style={{backgroundColor: "rgba(243, 253, 253, 0.87)"}} >
            <br></br> <br></br><br></br>
            <CompareInfo
              category_name={item.category_name}
              dataList={insert_dataList}
              loading={this.props.insert_loading}
              tbList={insert_tbList}
              UidMap={insert_historyMap}
              opt="insert"
            ></CompareInfo>
            <br/><br/> <br></br>
            {item.unpass_reason?
            <div>
            <Card title="未通过原因"extra={<Icon type="exclamation-circle" />}  
            style={{ width: 370,height:190,marginLeft:15,background:"rgba(214, 239, 244, 0.86)" }}className={Style.card}>
            {item.unpass_reason}
            </Card>
            <br></br>
            </div>
            :
            ""
            }
          </div>
        </Panel>
      )
    });
    return (
      <div style={{backgroundColor:"#f9fbfd",minHeight:"76vh",padding:15}}>
      <div className={tableStyle.orderTable} >
       <Tabs onChange={this.callback} activeKey={activeKey}>
       <TabPane tab="修改个人信息" key="1">
        <div style={{marginBottom:'10px',fontSize:16}}>
          <span >组织单元：</span>
          <span>{auth_ou}</span>
        </div>
        <div style={{marginBottom:'10px',fontSize:16}}>
          <span>信息类别：</span>
          <Select style={{width: 220}}  onSelect={this.handleServiceChange} value={this.state.service}>
            {serviceOptionList}
          </Select>
          {service ?
            <Button type="primary" onClick={()=>this.search()} style={{marginLeft:10}}>{'查询'}</Button>
            : <Tooltip title={"请选择信息类别！"}>
              <Button style={{marginLeft:10}} disabled>查询</Button>
            </Tooltip>}

            <Button 
            className={Style.btn_type} 
            style={{marginLeft:50}}
             onClick={()=>this.addInfo()}
             disabled={btnshow} 
             loading={typeloading}>
                增加
            </Button>

            <Button style={{float:"right"}} className={Style.btn_type} onClick={()=>this.handDataInfo()} disabled={submitList.length>0?false:true}>
            提交
            </Button>

        </div>
        {columns ?
        <Spin spinning={this.props.loading}>
          <div id="table1" className={tableStyle.orderTable} style={{textAlign:"center"}}>          
            <Table columns={columns} dataSource={tableList}
                   bordered
                   scroll={{ x:parseInt(width) }}
            />       
          </div>
          </Spin>
          :null}
   
          </TabPane>
          <TabPane tab="个人提交历史" key="2" >
            <div style={{fontSize:18,marginBottom:10,color:"#696969"}}><Icon type="file-text" />修改</div>
          
            {this.state.activeKey=="2"&&
          <Spin spinning={this.state.editlInfoLoading}>
          <Collapse accordion onChange={this.changePanel} style={{backgroundColor: "#E9F0F5"}} className={Style.collapse}>
            {editlInfo}
          </Collapse>
          </Spin>
            }
              {editlength==0?<div style={{textAlign:"center",color:"#9C9C9C",marginTop:10}}>暂无修改历史</div>
              :
             <Pagination style={{marginTop:20,textAlign:"center"}}  total={editlength} defaultPageSize={6}
              current={this.state.currentEditPage} onChange={this.changeEditPage} 
             />
              }
            <br/>
            <div style={{width:"100%",height:1,border:"0.5px solid #B5B5B5",transform:"scaleY(0.5)"}}></div>
            <br/>
            <div style={{fontSize:18,marginBottom:10,color:"#696969"}}><Icon type="plus" />新增</div>
            
            {this.state.activeKey=="2"&&
             <Spin spinning={this.state.addlInfoLoading} >
             <Collapse accordion onChange={this.changePanel} style={{backgroundColor: "#E9F0F5"}} className={Style.collapse} >
             {addlInfo}
             </Collapse>
             </Spin>
              }
              {addlength==0?<div style={{textAlign:"center",color:"#9C9C9C",marginTop:10}}>暂无新增历史</div>
              :
              <Pagination style={{marginTop:20,textAlign:"center"}}  total={addlength} defaultPageSize={6}
              current={this.state.currentAddPage} onChange={this.changeAddPage}
             />
            }
         </TabPane>
          </Tabs>

          {formVisble?
           <AddInfo
           onCancel={this.handCancel}
           category_name={service}
           category_id={category_id}
           onSubmit={this.handOk}
           fieldList={this.props.fieldList}
           >

          </AddInfo>:""}

          <Modal
          cancelText="放弃更改"
          okText="确定"
          maskClosable={false}
          title={<span><Icon type="exclamation-circle"/> 是否提交更改后的数据?</span>}
          visible={this.state.visible}
          onOk={this.editOk}
          onCancel={this.editCancel}
          closable={false}
        >
          <p>您刚刚对此类信息做了更改，若提交则点击确定，反之请点击放弃更改</p>
          
        </Modal>
      </div>
      </div>
    )
  }
}


function mapStateToProps(state) {
  const { ouList,serviceList,tableList,categoryList,fieldList,copyList,lockList,historyList,originalList,editCount,uneditCount,
    dataList,tbList,UidMap,historyMap,insert_tbList,insert_dataList,insert_loading,insert_historyMap,update_loading} = state.personalInfo;
  return {
    ouList,
    serviceList,
    categoryList,
    tableList,
    loading: state.loading.models.personalInfo,
    fieldList,
    copyList,
    lockList,
    historyList,
    dataList,
    tbList,
    UidMap,
    historyMap,
    insert_tbList,
    insert_dataList,
    insert_loading,
    insert_historyMap,
    update_loading,
    originalList,
    editCount,
    uneditCount
  };
}
export default connect(mapStateToProps)(PersonalInfo)
