/**
 * 文件说明：正态分布群体配置页面
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-12-06
 */
import { connect } from 'dva';
import styles from '../../../components/common/table.less'
import Style from '../../../components/employer/employer.less'
import {Table,Button,Popconfirm,Modal,Select,Input,Icon} from 'antd'
// import message from '../../../components/commonApp/message'
import EmpList from '../../../components/commonApp/empList'
import {getUuid} from '../../../utils/func';
const Option = Select.Option;
// import { Highlighter } from 'react-highlight-words';
/**
 * 功能：正态分布群体配置操作
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-12-06
 */
class distGroup extends React.Component {
  state ={
    visible:false,
    flag:'',
    tabModalOpName:'',
    tab_year:'',
    tab_season:'',
    company_type:'',
    dept_name:'',
    tab_group:'',
    tab_service:'',
    checker_id:'',
    checker_name:'',
    item:{},

    current: 1,

  }



  /**
   * 功能：删除正态分布群体
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-12-06
   */
  deleteTab=(item)=>(e)=>{

    const {dispatch}=this.props;
    let params = [{"opt":"delete","data":{"uid":item.uid}}];
    dispatch({
      type:'distgroup/deptTabDelete',
      params
    })
  }

  // 清空组件默认值
  clearItem=()=>{
    this.setState({
      item: {}
    })
  }




  /**
   * 功能：更新正态分布群体
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-12-06
   */
  updateTab = () =>{
    const { flag ,item} = this.state;
    const {dispatch}=this.props;
    if(flag === '0'){
      //新增
      let params = [{"opt":"insert","data":{"uid":getUuid(32,62),"dept_name":item.dept_name ? item.dept_name : item.ou,
        "manager_id":item.manager_id,"tabid":item.tabid,"f_year":item.tab_year,"f_season":item.tab_season,"state":'0'}}];
      dispatch({
        type:'distgroup/deptTabAdd',
        params,
        clearItem: this.clearItem,
      })
    }else{
      //修改
      let params = [{"opt":"update","data":{
        "update":{"dept_name":item.dept_name ? item.dept_name : item.ou,
          "manager_id":item.manager_id,"tabid":item.tabid,"f_year":item.tab_year,"f_season":item.tab_season,"state":'0'},
        "condition":{"uid":item.uid}
      }}];

      dispatch({
        type:'distgroup/deptTabUpdate',
        params,
        clearItem: this.clearItem,
      })
    }
    this.setState({
      visible: false
    })
  }

  /**
   * 功能：获取表单用户输入的value
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-12-06
   */
  handleChange=function(e,name) {
    let item = this.state.item;
    item[name] = e;
    this.setState({
      item:item
    })
  };
  /**
   * 功能：获取表单用户输入的value
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-12-06
   */
  checkerChange=(value)=>{
    let item = this.state.item;
    item["checker_id"] = value.userid;      // 遗留的无用变量
    item["checker_name"] = value.username;  // 遗留的无用变量
    item['manager_id'] = value.userid;
    this.setState({
      item:item
    })
  }
  /**
   * 功能：ou变更时，
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-12-06
   */
  SelectChange1=(value)=> {
    let item = this.state.item;
    item["ou"] = value;
    item["dept_name"] = '';
    this.setState({
      item:item
    })

    const {dispatch} = this.props;
    dispatch({
      type:'distgroup/DeptSearch',
      arg_company_type:value,
    })
  };
  /**
   * 功能：显示新增模态框
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-12-06
   */
  showModal = () => {
    this.setState({
      visible: true,
      flag:'0',
      tabModalOpName:'新增分布群体'
    });
  };


  copyLastSeason = () => {
    const {dispatch} = this.props;
    dispatch({
      type:'distgroup/copyLastSeason',
    })
  };
  /**
   * 功能：显示编辑模态框
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-12-06
   */
  editModal = (item) => {
    this.setState({
      visible: true,
      flag:'1',
      tabModalOpName:'修改分布群体',
      item:{"ou":item.dept_name.indexOf('-') == -1 ? item.dept_name : item.dept_name.split('-')[0],"dept_name":item.dept_name.indexOf('-') == -1 ? '' :item.dept_name.split('-')[1],
        "tab_year":item.year,"tab_season":item.season,"tab_group":item.tab_desc,"tab_service":item.service_url,
        "manager_id":item.userid,"uid":item.uid,'tabid':item.tabid}
    });

    // 点击编辑后 查询当前ou的部门
    const {dispatch} = this.props;
    dispatch({
      type:'distgroup/DeptSearch',
      arg_company_type:item.dept_name.indexOf('-') === -1 ? item.dept_name : item.dept_name.split('-')[0],
    })

  };
  /**
   * 功能：隐藏模态框
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-12-06
   */
  hideModal = () => {
    this.clearForm();
    this.setState({
      visible: false
    });
  };
  //清除弹框中内容
  clearForm =() =>{
    // document.querySelector('#kpi_name').value=''
    // document.querySelector('#kpi_content').value=''
    // document.querySelector('#formula').value=''
    // if(document.querySelector('#finish')){
    //   document.querySelector('#finish').value=''
    // }
    //this.state.checker_name = '';
    //this.state.kpi_type = '';
  };
  conditionChange = (pagination, filters, sorter) => {
    // console.log('Various parameters', pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  }


  // 搜索框的输入
  inputChange = (value, type) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'distgroup/inputChange',
      payload: {
        value,
        type,
      }
    });
  }

  // 点击搜索按钮
  search = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'distgroup/search_init',
    });
    this.pageChange(1)
  }

  // 点击清空按钮
  clear = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'distgroup/clear',
    });
    this.pageChange(1)
  }

  pageChange = (page)=>{
    this.setState({
      current: page,
    })
  }


  render() {
    const {distListSearch, distList, loading,ouList,deptList,checkerList,groupList,
      year_search,season_search, dept_name_search,tab_desc_search } = this.props;
    const {item} = this.state;
    // console.log(item)

    let yearOption = [];
    for (let i = 2015, j = Number(new Date().getFullYear()); i <= j; i++) {
      yearOption.push(<Option value={i.toString()} key={i}>{i.toString()}</Option>)
    }

    let pageConfig = {
      showSizeChanger: true,
      current: this.state.current,
      onChange: this.pageChange,
      // onShowSizeChange: this.onShowSizeChange
    }

    const columns = [
      {
        title: '年度',
        dataIndex: 'year',
      },
      {
        title: '季度',
        dataIndex: 'season',
        render: (text) => text !='0' ? `第${text}季度` :'年度考核'
      },
      {
        title: '部门',
        dataIndex: 'dept_name',
        width: '40%',
        key: 'dept_name',
      },
      {
        title: '考核人',
        dataIndex: 'username',
      },
      {
        title: '分布群体',
        dataIndex: 'tab_desc',
        key: 'tab_desc',
      },
      {
        title: '操作',
        render: (text, row, index) => {
          return <div>
            <Button type="default" style={{"marginRight":'10px'}} onClick={()=>this.editModal(row)}>编辑</Button>
            <Popconfirm title="确认删除这个分布群体？" onConfirm={this.deleteTab(row)}  okText="确定" cancelText="取消">
              <Button type="danger">删除</Button>
            </Popconfirm>
          </div>
        }
      }
    ];


    return (
      <div className={Style.wrap}>
        <div style={{marginBottom: '15px'}}>
          <div style={{float:"left"}}>
          <span>年度季度：</span>
          <Select
            style={{width: '75px'}}
            onChange={(value) => this.inputChange(value, 'year_search')}
            value={year_search}
          >
            {yearOption}
          </Select>
          <Select
            style={{width: '100px', marginRight: '20px'}}
            onChange={(value) => this.inputChange(value, 'season_search')}
            value={season_search}
          >
            <Option value="0" key="0">年度考核</Option>
            <Option value="1" key="1">第一季度</Option>
            <Option value="2" key="2">第二季度</Option>
            <Option value="3" key="3">第三季度</Option>
            <Option value="4" key="4">第四季度</Option>
          </Select>
          </div>

          <div style={{float:"left"}}>
          <span>部门：</span>
          <Input
            style={{width: 200, marginRight: '20px'}}
            placeholder=" "
            onChange={(e) => this.inputChange(e.target.value, 'dept_name_search')}
            value={dept_name_search }
          />
          </div>

          <div style={{float:"left"}}>
          <span>分布群体：</span>
          <Input
            style={{width: 200, marginRight: '20px'}}
            placeholder=" "
            onChange={(e) => this.inputChange(e.target.value, 'tab_desc_search')}
            value={tab_desc_search}
          />
          </div>

          <div style={{width: 250,float:"left"}}>
            <Button type="primary" onClick={() => this.clear()}>{'清空'}</Button>
            &nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={() => this.search()}>{'查询'}</Button>
            &nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={this.showModal}>新增</Button>
          </div>
        </div>
        <br></br>
        <br></br>
         <br></br>
        {/*<Button type="primary" style={{textAlign:"right", }} onClick={this.copyLastSeason}>继承</Button>*/}
        <Table className={styles.orderTable} size='small' bordered={true} columns={columns} dataSource={distListSearch || distList}
            scroll={{ x:parseInt(200) }} loading={loading} pagination={pageConfig} onChange={this.conditionChange} />


        <Modal style={{marginTop:'10px'}} title={this.state.tabModalOpName} visible={this.state.visible}
               onOk={this.updateTab} onCancel={this.hideModal}
               okText="确定" cancelText="取消">

          <p style={{float:'left',paddingRight:'10px'}}>考核年度</p>
          <Select style={{width:"160px",float:'left'}} name="tab_year" id="tab_year" value={item.tab_year}
                  onSelect={(e)=>this.handleChange(e,"tab_year")}>
            {yearOption}
          </Select>
          <p style={{float:'left',paddingLeft:'30px',paddingRight:'10px'}}>考核季度</p>
          <Select style={{width:"150px",float:'left'}} name="tab_season" id="tab_season" value={item.tab_season}
                  onSelect={(e)=>this.handleChange(e,"tab_season")}>
            <Option value="0">年度考核</Option>
            <Option value="1">第一季度</Option>
            <Option value="2">第二季度</Option>
            <Option value="3">第三季度</Option>
            <Option value="4">第四季度</Option>
          </Select>
          <div style={{clear:'both',margin:'10px'}}></div>
          <p style={{float:'left',paddingRight:'10px',marginTop:'10px'}}>组织单元</p>
          <Select showSearch style={{ float:'left',width: 160,marginTop:'10px'}} value={item.ou} onSelect={this.SelectChange1}>
            <Option value="请选择组织单元">请选择组织单元</Option>
            {ouList && ouList.length?
              ouList.map(function(t,index){
                return (<Option key={t.OU} value={t.OU}>{t.OU}</Option>)
              })
              :null}
          </Select>
          <p style={{float:'left',paddingRight:'10px',marginLeft:'30px',marginTop:'10px'}}>部门</p>
          <Select showSearch style={{ float:'left',width: 180,marginTop:'10px' }}   onSelect={(e)=>this.handleChange(e,"dept_name")} value={item.dept_name}>
            <Option value="">--</Option>
            {deptList && deptList.length?
              deptList.map(function(t,index){
                return (<Option key={t.deptname} value={t.deptname}>{t.deptname.split('-')[1]||t.deptname}</Option>)
              })
              :null}
          </Select>
          <p style={{float:'left',paddingRight:'24px',marginTop:'10px'}}>考核人</p>
          <EmpList list={checkerList} style={{width:'380px',marginTop:'10px'}}  onChange={this.checkerChange} defaultValue={item.manager_id}/>

          <div style={{clear:'both',margin:'10px'}}></div>
          <p style={{float:'left',paddingRight:'10px',marginTop:'10px',marginBottom:'10px'}}>分布群体</p>
          <Select style={{width:"200px",float:'left',marginTop:'10px',marginBottom:'10px'}} name="tab_group" id="tab_group" value={item.tabid}
                  onSelect={(e)=>this.handleChange(e,"tabid")}>
            <Option value="请选择组织单元">请选择分布群体</Option>
            {groupList && groupList.length?
              groupList.map(function(t,index){
                return (<Option key={t.tabid} value={t.tabid}>{t.tab_desc}</Option>)
              })
              :null}

          </Select>
        </Modal>


      </div>
    )
  }
}
function mapStateToProps(state) {
  const {distListSearch, distList,year,season,ouList,deptList,checkerList,groupList,
    year_search,season_search, dept_name_search,tab_desc_search} = state.distgroup;
  if(distList.length){
    distList.map((i,index)=>i.key=index)
  }
  if(ouList.length){
    ouList.map((i,index)=>i.key=index)
  }
  if(deptList.length){
    deptList.map((i,index)=>i.key=index)
  }
  if(checkerList.length){
    checkerList.map((i,index)=>i.key=index)
  }
  if(groupList.length){
    groupList.map((i,index)=>i.key=index)
  }
  return {
    distListSearch,
    distList,
    year,
    season,
    ouList,
    deptList,
    checkerList,
    groupList,
    year_search,season_search, dept_name_search,tab_desc_search,
    loading: state.loading.models.distgroup,
  };
}
export default connect(mapStateToProps)(distGroup)
