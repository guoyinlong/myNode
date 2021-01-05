/**
 * 文件说明：题库管理岗位信息管理页面
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-01-23
 */
import { connect } from 'dva';
import * as service from '../../../services/questions/questionservices';
import {Table,Switch,Input,Button,Tooltip} from  'antd'
import { routerRedux } from 'dva/router';
import message from '../../../components/commonApp/message'
import Style from '../../../components/employer/employer.less'
import tableStyle from '../../../components/common/table.less'

/**
 * 文件说明：题库管理岗位信息管理页面
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-01-23
 */
class PositionSetting extends React.Component{
  state ={
    list:[],
    post:''
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
        dataIndex:'key'
      },
      {
        title:'岗位名称',
        dataIndex:'classify_name',
        width:'200px'
      },
      {
        title:'状态',
        dataIndex:'state',
        render: (text, row, index)=>{
          return <div><Switch checkedChildren="启用" unCheckedChildren="停用" checked={text == '0' ? true : false} onChange={()=>this.onChange(row)}/></div>
        }
      }
  ]
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
    const {list} = this.props;
    this.setState({
      list:[...list]
    })
  }

  /**
   * 功能：启用/停用
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2018-01-23
   * @param record 记录
   */
  onChange= async (record) => {
    const{classify_uid,state}=record;
    const {list}=this.state;
    let newState = state == '0' ? '1' : '0';
    let condition = [{
      'opt':"update",'data':{"update":{"state":newState},"condition":{"classify_uid":classify_uid}}
    }];
    let subRes;

    subRes = await(service.positionupdate({
      "transjsonarray":JSON.stringify(condition)
    }));

    if(subRes && subRes.RetCode === '1'){
      record.state = newState;
      this.setState({
        list:[...list]
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
  /**
   * 功能：新增岗位
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2018-01-23
   */
  add = () =>{
    const {post,list} = this.state;
    const {dispatch} = this.props;
    if(post){
      for(let i = 0 ; list && list.length && i < list.length;i++){
        if(list[i].classify_name == post){
          message.warning("岗位名称重复，请重新输入！")
          return;
        }
      }
      dispatch({
        type:'questionsPosition/addPost',
        post
      })
    }else{
      message.warning("请输入岗位名称！")
    }
  }
  /**
   * 功能：输入框输入事件
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2018-01-23
   * @param e input对象
   */
  enter = (e) =>{
    this.setState({
      post:e.target.value
    })
  }
  pagination={
    showQuickJumper:true,
    showSizeChanger:true,
  }
  render() {
    const {loading} = this.props;
    const {list,post} = this.state;
    return (
      <div className={Style.wrap}>
        <Input placeholder="请输入岗位名称" style={{width:'200px',marginLeft: '5px',marginRight: '40px'}} value={post} onChange={this.enter}/>
        <Tooltip title={post ? '': "请输入岗位名称！"}>
          <Button disabled={!post} type="primary" onClick={this.add}>新增</Button>
        </Tooltip>
        <div className={tableStyle.orderTable}>
          <Table style={{width:'400px',marginTop: '20px'}} size='small' bordered={true}
                 columns={this.columns} dataSource={list} loading={loading} pagination={this.pagination}/>
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
  const { list} = state.questionsPosition;
  if(list.length){
    list.map((i,index)=>i.key=index+1)
  }
  return {
    list:[...list],
    loading: state.loading.models.questionsPosition,
  };
}
export default connect(mapStateToProps)(PositionSetting)

