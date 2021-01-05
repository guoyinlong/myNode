/**
 * 文件说明：题库管理试题查询/导入页面
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-01-23
 */
import { connect } from 'dva';
import * as service from '../../../services/questions/questionservices';
import {Table,Switch,Input,Button,Select,Upload,Tooltip} from  'antd'
import { routerRedux } from 'dva/router';
import Cookie from 'js-cookie';
import message from '../../../components/commonApp/message'
import QuestionAnswer from '../../../components/questions/QuestionAnswer'
import Style from '../../../components/employer/employer.less'
import tableStyle from '../../../components/common/table.less'
const Option = Select.Option;
const staffId = Cookie.get('userid');
const year = new Date().getFullYear().toString();
const season = (new Date().getMonth() + 1).toString();
const day = new Date().getDate().toString();

/**
 * 文件说明：题库管理试题查询/导入页面
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-01-23
 */
class QuestionImport extends React.Component{
  getParam = () =>{
    const {section,post,type} = this.state;
    const formData = {"arg_section":section,"arg_post":post,"arg_type":type.split(',')[0],"arg_tag":type.split(',')[1]}
    return formData;
  }
  state = {
    quesList:[],
    post:'',
    section:'',
    type:'',
    tag:'',
    disabled:true,
    import: {
      //action: "/filemanage/fileupload?argappname=questions&argtenantid=10010&arguserid="+staffId+"&argyear="+year +
      //"&argmonth="+season+"&argday="+day,
      action: "/microservice/allexamine/questions/questionimport",
      method: "POST",
      data: this.getParam,
      name: "outsourcer",
      multiple: false,
      showUploadList: false,
      listType: 'text',
      accept: '.xlsx,.xls',
      onChange:(info)=> {
        if (info.file.status === 'done') {
          if (info.file.response.RetCode == '1') {
            message.success(`${info.file.name} 导入成功！`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 导入失败！.`);
          }
        }
      }
    }
  }

  /**
   * 功能：组件渲染完后执行操作
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2018-01-23
   */
  componentDidMount(){
    this.init()
  }

  /**
   * 功能：父组件变化后执行操作
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2018-01-23
   */
  componentWillReceiveProps(){
    this.init()
  }

  /**
   * 功能：初始化方法
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2018-01-23
   */
  init =() =>{
    const {quesList} = this.props;
    this.setState({
      quesList:[...quesList]
    })
  }
  /**
   * 功能：表格数据源
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2018-01-23
   */
  columns =[
    {
      title:'序号',
      dataIndex:'key',
      width:"40px"
    },
    {
      title:'试题&答案',
      render: (text, row, index)=>{
        return <div>
          <QuestionAnswer type = {row.type_uid} question = {row.question_name} options = {row.options}
                          answer ={row.answer}></QuestionAnswer>
        </div>
      }
    },
    {
      title:'所属章节',
      dataIndex:'section_name',
      width:"110px",
      render: (text, row, index)=>{return <div>{text.indexOf("通用")!=-1 ?
                                      <div style={{"color":'#FA7252'}}>{text}</div>:
                                      <div >{text}</div>}</div> }
    },
    {
      title:'所属岗位',
      dataIndex:'post_name',
      width:"110px",
      render: (text, row, index)=>{return <div>{text.indexOf("通用")!=-1 ?
                                      <div style={{"color":'#FA7252'}}>{text}</div>:
                                      <div >{text}</div>}</div> }
    },
    {
      title:'状态',
      dataIndex:'state',
      width:"80px",
      render: (text, row, index)=>{
        return <div><Switch checkedChildren="启用" unCheckedChildren="停用" checked={text == '0' ? true : false} onChange={()=>this.onChange(row)}/></div>
      }
    }
  ]

  /**
   * 功能：启用/停用
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2018-01-23
   * @param record 记录
   */
  onChange= async (record) => {
    const{question_uid,relate_uid,sectionRelate_uid,state}=record;
    const{paramTag}=this.props;
    let {quesList}=this.state;
    let newState = state == '0' ? '1' : '0';

    let subRes;

    subRes = await(service.questionstateupdate({
      arg_param_tag:paramTag,
      arg_state:newState,
      arg_question_uid:question_uid,
      arg_partrelate_uid:sectionRelate_uid,
      arg_classifyrelate_uid:relate_uid
    }));

    if(subRes && subRes.RetCode === '1'){
      record.state = newState;
      this.setState({
        quesList:[...quesList]
      })
      if(newState == '0'){
        message.success("启用成功！")
      }else{
        message.success("停用成功！")
      }
    }else{
      message.error("更新失败！")
    }
  };


  //获取表单用户输入的value
  handleChange=function(e,name) {
    this.state[name]=e;
    this.setState({
      name:e
    })
  };
  /**
   * 功能：查询按钮事件
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2018-01-23
   */
  search = () =>{
    const {post,section,type} = this.state;
    const {dispatch} = this.props;
    let query = {
      arg_post:post?post:null,
      arg_section:section?section:null,
      arg_type:type?type.split(',')[0]:null
    }
    dispatch({
      type:'questionsImport/questionsSearch',
      query
    })
  }
  pagination={
    showQuickJumper:true,
    showSizeChanger:true,
  }
  /**
   * 功能：模板下载
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-07-20
   */
  downloadTemp =() =>{
    const {type} = this.state;
    const {typeList} = this.props;
    if(type){
      let url = '';
      for(let i = 0 ; typeList && typeList.length && i < typeList.length; i++){
        if(typeList[i].type_uid == type.split(',')[0]){
          url = typeList[i].template_path;
          break;
        }
      }
      if(url){
        location.href = url;
      }else {
        message.warning("该类试题没有模板，请联系管理员！")
      }
    }else{
      message.warning("请选择试题类型！")
    }
  }
  render() {
    const {loading,classifyList,typeList,sectionList} = this.props;
    const {post,section,type,quesList} = this.state;
    return (
      <div className={Style.wrap}>
        <p style={{float:'left',paddingRight:'10px'}}>章节名称</p>
        <Select style={{width:"130px",float:'left',marginRight: '40px'}} value={section}
                onSelect={(e)=>this.handleChange(e,"section")}>
          <Option value=''>不限</Option>
          {sectionList && sectionList.length?
            sectionList.map(function(t,index){
              return (<Option key={t.part_uid} value={t.part_uid}>{t.part_name}</Option>)
            })
            :null}
        </Select>
        <p style={{float:'left',paddingRight:'10px'}}>岗位名称</p>
        <Select style={{width:"150px",float:'left',marginRight: '40px'}} value={post}
                onSelect={(e)=>this.handleChange(e,"post")}>
          <Option value=''>不限</Option>
          {classifyList && classifyList.length?
            classifyList.map(function(t,index){
              return (<Option key={t.classify_uid} value={t.classify_uid}>{t.classify_name}</Option>)
            })
            :null}
        </Select>
        <p style={{float:'left',paddingRight:'10px'}}>试题类型</p>
        <Select style={{width:"120px",float:'left',marginRight: '40px'}} value={type}
                onSelect={(e)=>this.handleChange(e,"type")}>
          <Option value=''>不限</Option>
          {typeList && typeList.length?
            typeList.map(function(t,index){
              return (<Option key={t.type_uid} value={t.type_uid + ',' + t.tag}>{t.type_name}</Option>)
            })
            :null}
        </Select>
        <Tooltip title={!type ? "试题类型不能为空！" : ''}>
        <Button disabled={!type ? true : false} type="default" onClick={this.downloadTemp} style={{marginRight: '20px'}}>模板下载</Button>
        </Tooltip>
        <Button type="default" onClick={this.search} style={{marginRight: '20px'}}>查询</Button>

          <Upload disabled={!section || !type ? true : false} {...this.state.import}>
            <Tooltip title={!section ? "章节名称不能为空！" : (!type ? "试题类型不能为空！" : '') }>
            <Button disabled={!section || !type ? true : false} type="primary">导入</Button>
            </Tooltip>
          </Upload>

        <div className={tableStyle.orderTable}>
          <Table style={{marginTop: '20px',wordBreak: 'break-all'}} size='small' bordered={true}
                 columns={this.columns} dataSource={quesList} loading={loading} pagination={this.pagination}/>
        </div>
      </div>
    )
  }
}

/**
 * 功能：state数据注入组件
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-09-15
 * @param state 状态树
 */
function mapStateToProps(state) {
  const { classifyList,typeList,sectionList,quesList,paramTag} = state.questionsImport;
  if(classifyList.length){
    classifyList.map((i,index)=>i.key=index+1)
  }
  if(typeList.length){
    typeList.map((i,index)=>i.key=index+1)
  }
  if(sectionList.length){
    sectionList.map((i,index)=>i.key=index+1)
  }
  if(quesList.length){
    quesList.map((i,index)=>i.key=index+1)
  }
  return {
    classifyList:[...classifyList],
    typeList:[...typeList],
    sectionList:[...sectionList],
    quesList:[...quesList],
    paramTag:paramTag,
    loading: state.loading.models.questionsImport,
  };
}
export default connect(mapStateToProps)(QuestionImport)

