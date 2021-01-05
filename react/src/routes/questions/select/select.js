/**
 * 文件说明：题库管理试题查询/导入页面
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-01-23
 */
import { connect } from 'dva';
import {Table,Button,Select,Tooltip,Icon,InputNumber} from  'antd'
import message from '../../../components/commonApp/message'
import exportWord from '../../../components/commonApp/exportWord'
import TestPaper from '../../../components/questions/TestPaper'
import Style from './questions.less'
import style from '../../../components/employer/employer.less'
import tableStyle from '../../../components/common/table.less'
const Option = Select.Option;
const dateFormat='YYYY-MM-DD';
import moment from 'moment';
/**
 * 文件说明：题库管理试题抽选页面
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-01-23
 */
class QuestionSelect extends React.Component{
  state ={
    list:[],
    post:'',
    part:'',
    type:'',
    tag:'',
    total:0,
    conditionList:[]
  }
  componentWillReceiveProps(newProps){
    const {tag} = this.state;
    if(newProps.countList && newProps.countList.length && tag === '0'){
      let {conditionList} = this.state;
      let index = newProps.countList[0].index;
      let count = newProps.countList[0].count;
      let targetScore = newProps.countList[0].targetScore;
      conditionList[index]["sum"] = count;
      conditionList[index]["target_score"] = targetScore;
      if(conditionList[index]["count"] > count){
        conditionList[index]["count"] = count;
      }
      if(conditionList[index]["target_score"] && conditionList[index]["count"]){
        conditionList[index]["total_score"] = conditionList[index]["target_score"] * conditionList[index]["count"];
      }else{
        conditionList[index]["total_score"] = 0;
      }
      let total = 0;
      for(let i = 0; conditionList && i < conditionList.length ;i++){
        total += conditionList[i]["total_score"];
      }
      conditionList[index]["flag"] = conditionList[index].part && conditionList[index].type && conditionList[index].difficulty && conditionList[index].count;
      this.setState({
        conditionList:[...conditionList],
        total
      })
    }
  }

  /**
   * 功能：数据源新增查询条件
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2018-01-23
   */
  add = () => {
    let {post,conditionList} = this.state;
    if(post){
      conditionList.push({"part":'',"difficulty":'',"count":'',"type":'',"flag":'0',"sum":'0',"total_score":'',"score":''});
      conditionList.map((i,index)=>i.key=index+1);
      this.setState({
        conditionList:[...conditionList]
      })
    }else{
      message.warning("请先选择岗位信息！")
    }

  }
  /**
   * 功能：数据源删除查询条件
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2018-01-23
   * @param index：记录索引
   */
  delete = (index) =>{
    let {conditionList} = this.state;
    conditionList.splice(index,1);
    let total = 0;
    for(let i = 0; conditionList && i < conditionList.length ;i++){
      total += conditionList[i]["total_score"];
    }
    this.setState({
      conditionList:[...conditionList],
      total,
      tag:'2'
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
      width:"40px",
      render: (text, row, index)=>{return <div>{index+1}</div>}
    },
    {
      title:'章节类型',
      dataIndex:'part',
      width:"140px",
      render: (text, row, index)=>{
        return <div>
          <Select style={{width:"140px",float:'left'}} value={row.part}
                  onSelect={(e)=>this.handleChange(e,index,"part")}>

            {this.props.partList && this.props.partList.length?
              this.props.partList.map(function(t,index){
                return (<Option key={t.part_uid} value={t.part_uid}>{t.part_name}</Option>)
              })
              :null}
          </Select>
        </div>
      }
    },
    {
      title:'试题类型',
      dataIndex:'type',
      width:"140px",
      render: (text, row, index)=>{
        return <div>
          <Select style={{width:"140px",float:'left'}} value={row.type}
                  onSelect={(e)=>this.handleChange(e,index,"type")}>

            {this.props.typeList && this.props.typeList.length?
              this.props.typeList.map(function(t,index){
                return (<Option key={t.type_uid} value={t.type_uid}>{t.type_name}</Option>)
              })
              :null}
          </Select>
        </div>
      }
    },
    {
      title:'难易程度',
      dataIndex:'difficulty',
      width:"80px",
      render: (text, row, index)=>{
        return <div>
          <Select style={{width:"80px",float:'left'}} value={row.difficulty}
                  onSelect={(e)=>this.handleChange(e,index,"difficulty")}>

            {this.props.difficultyList && this.props.difficultyList.length?
              this.props.difficultyList.map(function(t,index){
                return (<Option key={t.difficulty_uid} value={t.difficulty_uid}>{t.difficulty_name}</Option>)
              })
              :null}
          </Select>
        </div>
      }
    },
    {
      title:'已录入试题数量',
      dataIndex:'sum',
      width:"110px",
      render: (text, row, index)=>{return <div>{text}</div>}
    },
    {
      title:'选择数量',
      dataIndex:'count',
      width:"110px",
      render: (text, row, index)=>{
        return <div>
                  <Tooltip title={ !(row.part && row.type && row.difficulty) ? '章节、类型、难易程度确定后，方可根据试题总数量选择试题数' : ""}>
                    <InputNumber disabled={!(row.part && row.type && row.difficulty)}
                                 min={0} max={row.sum} value={row.count}  onChange={(e)=>this.onChange(e,index)} />
                  </Tooltip>
                </div>
      }
    },
    {
      title:'每题分数',
      dataIndex:'target_score',
      width:"110px",
      render: (text, row, index)=>{return <div>{text}</div>}
    },
    {
      title:'该类题型分数',
      dataIndex:'total_score',
      width:"110px",
      render: (text, row, index)=>{return <div>{text}</div>}
    },
    {
      title:<div className={Style.add} >
                <Icon type="plus-circle"  onClick={ this.add }/>
            </div>,
      width:"60px",
      render: (text, row, index)=>{
        return <div onClick={()=>this.delete(index)}>删除</div>
      }
    }
  ]

  /**
   * 功能：选择试题数量变化
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2018-01-29
   * @param e 变化后的值
   * @param index 数组索引
   */
  onChange =  (e,index) => {
    let {conditionList} = this.state;
    conditionList[index]["count"] = e;
    if(conditionList[index]["target_score"] && conditionList[index]["count"]){
      conditionList[index]["total_score"] = conditionList[index]["target_score"] * conditionList[index]["count"];
    }else{
      conditionList[index]["total_score"] = 0;
    }
    let total = 0;
    for(let i = 0; conditionList && i < conditionList.length ;i++){
      total += conditionList[i]["total_score"];
    }
    conditionList[index]["flag"] = conditionList[index].part && conditionList[index].type && conditionList[index].difficulty && conditionList[index].count;
    this.setState({
      conditionList:[...conditionList],
      total,
      tag:'1'
    })
  };


  /**
   * 功能：获取表单用户输入的value
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2018-01-23
   * @param e
   * @param index
   * @param name
   */
  handleChange=function(e,index,name) {
    let {conditionList} = this.state;
    conditionList[index][name] = e;
    conditionList[index]["flag"] = conditionList[index].part && conditionList[index].type && conditionList[index].difficulty && conditionList[index].count;
    this.setState({
      conditionList:[...conditionList],
      tag:'0'
    })
    if(conditionList[index].part && conditionList[index].type && conditionList[index].difficulty){
      const {post} = this.state;
      const {dispatch} = this.props;
      dispatch({
        type:'questionSelect/toSelectCountSearch',
        index,
        query:{"arg_post":post,"arg_part":conditionList[index].part,"arg_type":conditionList[index].type,"arg_difficulty":conditionList[index].difficulty}
      })
    }
  };
  postChange=function(e) {
    this.setState({
      post:e
    })
  };
  /**
   * 功能：查询按钮事件
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2018-01-23
   */
  search = () =>{
    const {conditionList,post} = this.state;
    if(!post){
      message.warning("请选择岗位！")
    }else if(!conditionList.length){
      message.warning("请添加筛选条件！")
    }else{
      for(let i = 0; i < conditionList.length;i++){
        if(!conditionList[i].flag){
          message.warning("请检查筛选条件是否有空或者试题选择数量为0！");
          return;
        }
      }
      const {dispatch} = this.props;
      dispatch({
        type:'questionSelect/questionsSearch',
        post,
        condition:conditionList
      })
    }
  }
  /**
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2018-01-28
   * 功能：导出
   */
  expWord=()=>{
    const {post} = this.state;
    let tab=document.querySelector(`#result div`);
    let tabAnswer=document.querySelector(`#answer div`);
    //let tabBlank=document.querySelector(`#blank div`);
    exportWord()(tab,this.getPostName(post)+'笔试试题'+moment().format(dateFormat));
    exportWord()(tabAnswer,this.getPostName(post)+'试题答案'+moment().format(dateFormat));
    //exportWord()(blank,this.getPostName(post)+'答题纸'+moment().format(dateFormat));
  }
  /**
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2018-01-28
   * 功能：根据岗位id获取岗位名称
   * @param id
   * @returns {string}
   */
  getPostName = (id) =>{
    const {classifyList} = this.props;
    for(let i = 0 ; classifyList && classifyList.length && i < classifyList.length; i++){
      if(classifyList[i].classify_uid == id){
        return classifyList[i].classify_name
      }
    }
    return '';
  }


  render() {
    const {loading,classifyList,quesList,totalScore} = this.props;
    const {post,conditionList,total} = this.state;
    return (
      <div className={style.wrap}>
        <p style={{float:'left',paddingRight:'10px'}}>岗位名称</p>
        <Select style={{width:"160px",float:'left',marginRight: '40px'}} name="kpi_type" id="kpi_type" value={post}
                onSelect={(e)=>this.postChange(e)}>

          {classifyList && classifyList.length?
            classifyList.map(function(t,index){
              return (<Option key={t.classify_uid} value={t.classify_uid}>{t.classify_name}</Option>)
            })
            :null}
        </Select>

        <Tooltip title={quesList && quesList.length ? "" : "尚未生成数据，不能导出！" }>
          <Button type="primary" disabled={!(quesList && quesList.length)} style={{float:'right'}} onClick={this.expWord}>导出</Button>
        </Tooltip>
        <Tooltip title={post ? (!conditionList.length ? '请添加筛选条件！':'') : "请选择岗位！" }>
          <Button disabled={!post || !conditionList.length ? true : false} type="default" onClick={this.search}
                  style={{marginRight: '20px',float:'right'}} >生成</Button>
        </Tooltip>
        <span style={{marginRight: '20px',marginTop: '5px',float:'right'}}>目标分值：{total}</span>

        <div className={tableStyle.orderTable} style={{clear: 'both',marginTop: '40px'}}>
          <Table style={{marginTop: '20px',wordBreak: 'break-all'}} size='small' bordered={true}
                 columns={this.columns} dataSource={conditionList} loading={loading} pagination={false}/>
        </div>
        {quesList && quesList.length ?
          <div>
            <div id="result">
              <TestPaper list ={quesList} total_score={totalScore} only_answer={false}>
              </TestPaper>
            </div>
            <div id="answer" style={{"display":'none'}}>
              <TestPaper list ={quesList} total_score={totalScore} only_answer={true}>
              </TestPaper>
            </div>
            <div id="blank" style={{"display":'none'}}>
              <div>
                <div style={{"fontSize": "16pt",
                  "fontWeight": "bold",
                  "textAlign": "center","lineHeight": "150%"}}>答题纸</div>
                <div style={{height:'3000px'}}></div>
              </div>

            </div>
          </div>

          :null}

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
  const { classifyList,typeList,partList,quesList,difficultyList,countList,totalScore} = state.questionSelect;
  if(classifyList.length){
    classifyList.map((i,index)=>i.key=index+1)
  }
  if(typeList.length){
    typeList.map((i,index)=>i.key=index+1)
  }
  if(partList.length){
    partList.map((i,index)=>i.key=index+1)
  }
  if(quesList.length){
    quesList.map((i,index)=>i.key=index+1)
  }
  if(difficultyList.length){
    difficultyList.map((i,index)=>i.key=index+1)
  }
  if(countList.length){
    countList.map((i,index)=>i.key=index+1)
  }
  return {
    totalScore,
    classifyList:[...classifyList],
    typeList:[...typeList],
    partList:[...partList],
    quesList:[...quesList],
    difficultyList:[...difficultyList],
    countList:[...countList],
    loading: state.loading.models.questionSelect,
  };
}
export default connect(mapStateToProps)(QuestionSelect)

