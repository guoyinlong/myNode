/**
 * 作者：lyq
 * 日期：2020-09-10
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：个人考核考核结果展示
 */
import React from 'react';
import {connect } from 'dva';
import { Table ,Select,Button,Tooltip,Icon,Input,DatePicker } from 'antd';
import message from '../../../components/commonApp/message'
const Option = Select.Option;
const { Column, ColumnGroup } = Table;
import {OU_HQ_NAME_CN} from '../../../utils/config'
import styles from '../../../components/common/table.less'
import Style from '../../../components/employer/employer.less'
import ResultPie from './resultPie'
import { Spin } from 'antd';
import exportExl from '../../../components/commonApp/exportExl'
import {exportResult} from "./exportResult"
/**
 * 作者：张楠华
 * 创建日期：2017-09-13
 * 功能：部门去前缀
 */
function checkdeptname(text,record) {
    return <div style={{textAlign:"left",width: '100px',whiteSpace:'normal'}}>{record.dept_name.split('-')[1]}</div>
}
/**
 * 作者：张楠华
 * 创建日期：2017-09-13
 * 功能：展示考核结果界面
 */
  class BpResult extends React.Component{
    //初始化
    constructor(props){
      super(props);
      this.state = {
        company_type:localStorage.ou,
        deptName:"全部",
        year_type:new Date().getFullYear().toString(),
        season_type:Math.floor((new Date().getMonth()+1 + 2) / 3).toString(),
        loadingFlag:true,
        displayWay:'table',
        displayTabBar:'',
        displayBarTab:'none',
        temp:false,
        yearList:[],
        focusName:"",
        role:0
      }
    }

    componentDidMount=()=>{
      let tYear = new Date().getFullYear()
      let yearList=[]
       for(let i=2016;i<=tYear;i++){
        yearList.push(i)
       }
      this.setState({
        yearList: yearList
      });
      }
  /**
   * 作者：张楠华
   * 创建日期：2017-09-13
   * 功能：选择组织单元传值，后台查询对应组织单元的部门信息，同时控制loadingFlag。
   */
    SelectChange1=(value)=> {
      this.setState({
        company_type:value,
        deptName:"全部",
        loadingFlag:false,
        temp:true,
      });
      const {dispatch} = this.props;
      dispatch({
        type:'result/DeptSearch',
        arg_company_type:value,
      })
    };
  /**
   * 作者：张楠华
   * 创建日期：2017-09-13
   * 功能：选择部门传值
   */
    SelectChange2=(value)=> {
      this.setState({
        deptName:value,
        temp:true,
      })
    };
  /**
   * 作者：张楠华
   * 创建日期：2017-09-13
   * 功能：选择考核年度传值
   */
    SelectChange3=(value)=> {
      this.setState({
        year_type:value,
        temp:true,
      })
    };
  /**
   * 作者：张楠华
   * 创建日期：2017-09-13
   * 功能：选择考核季度传值
   */
    SelectChange4=(value)=> {
      this.setState({
        season_type:value,
        temp:true,
      })
    };
  /**
   * 作者：张楠华
   * 创建日期：2017-09-13
   * 功能：切换至table或者切换至
   */
    switchDisplay1 = () => {
      this.setState({
        displayWay: this.state.displayWay == 'table' ? 'pie' : 'table',
        displayTabBar:'none',
        displayBarTab:'',
        temp:false,
      });
    };
  /**
   * 作者：张楠华
   * 创建日期：2017-09-13
   * 功能：切换至table或者切换至
   */
    switchDisplay2 = () => {
      this.setState({
        displayWay: this.state.displayWay == 'table' ? 'pie' : 'table',
        displayTabBar:'',
        displayBarTab:'none',
        temp:false,
      });
    };
  
    bpSerch=()=>{
      let obj={
        year:this.state.year_type,
        season:this.state.season_type,
        focusName:this.state.focusName,
        role:this.state.role
      }
      this.props.dispatch({
        type: 'result/InitBpSearch',
        objData:obj,
        })
  
    }
  exportExl2 = () => {
    const {resultList} = this.props;
    const data1 = {"title": [{"value": "序号"}, {"value": "员工编号"}, {"value": "姓名"}, {"value": "所在院"}, {"value": "部门"}, {"value": "项目"}, {"value": "职位"},{"value":"项目考核系数"},{"value":"项目系数"},{"value": "考核得分"}, {"value": "考核结果"}]};
    if (resultList !== null && resultList.length !== 0) {
      exportResult(resultList, "考核结果", data1.title)
    } else {
      message.info("查询结果为空！")
    }
  };
  /**
   * 作者：张楠华
   * 创建日期：2017-09-13
   * 功能：清除条件
   */
    clearFilter=()=>{
      let s=this.state;
      let noSearch={};
      for(let k in s){
        if(s[k]!==null&&typeof s[k]==='object'&&s[k].searchText){
          let {searchInput}=s[k];
          searchInput.refs.input.value='';
          noSearch[k]={...s[k],searchText:'',filtered:false,searchInput}
        }
      }
      this.setState({
        ...noSearch,
      })
    };
  /**
   * 作者：张楠华
   * 创建日期：2017-09-13
   * 功能：通过该方法，给表头添加搜索
   */
    setSearchComponent(key){
      if(!this.state[key]){
        this.state[key]={}
      }
      return {
        filterDropdown: (
          <div className={Style.filterDropdown}>
            <Input
              ref={ele => this.state[key].searchInput = ele}
              onChange={this.onInputChange(key)}
              onPressEnter={this.onSearch(key)}
            />
            <Button type="primary" onClick={this.onSearch(key)}>搜索</Button>
          </div>
        ),
        filterIcon: <Icon type="search" style={{ color: this.state[key].filtered ? '#FA7252' : null}} />,
        filterDropdownVisible: this.state[key].filterDropdownVisible||false,
        onFilterDropdownVisibleChange: (visible) => {
          this.setState({
            [key]:{...this.state[key],filterDropdownVisible: visible,}
          },() => this.state[key].searchInput.focus());
        },
      }
    };
  /**
   * 作者：张楠华
   * 创建日期：2017-09-13
   * 功能：表头搜索
   */
    onSearch = (key)=>() => {
      this.setState({
        temp:false,
      });
      const { searchText } = this.state[key];
      this.setState({[key]:{
        ...this.state[key],
        filterDropdownVisible: false,
        filtered: !!searchText,}
      });
    };

    // 同步或者撤销
  updateOrCancelRatio = (flag)=>{
    const {dispatch} = this.props;
    dispatch({
      type:'result/updateOrCancelRatio',
      flag: flag,
      arg_year:this.state.year_type,
      arg_season:this.state.season_type,
      arg_userid:localStorage.userid,
      showResult: this.showResult,
    })
  }

  handleChange=(value,key)=>{
    // console.log("value",value,"key",key)
     switch(key){
     case'focusName': this.setState({focusName:value}); break
     case'role': this.setState({role:value}); break
     }
    }
  /**
   * 作者：张楠华
   * 创建日期：2017-09-13
   * 功能：离开输入框搜索
   */
    onInputChange =(key)=> (e) => {
      this.state[key].searchText=e.target.value
    };
    needSearch=['staff_id','staff_name','dept_name','proj_name','post'];

    render() {
      let {yearList,role,focusName}=this.state
      const columns = [
        {
          title:"序号",
          dataIndex:"",
          key:"index",
          width: '5%',
          render:(text, record,index) => {return (<div style={{textAlign:'right'}}>{index + 1}</div>)}
        },
        // {
        //   title:"排名",
        //   dataIndex:"rownum",
        //   key:"rownum",
        //   width: '5%',
        //   render:(text, record) => {return (<div style={{textAlign:'right'}}>{record.rownum}</div>)},
        // },
        {
          title:"员工编号",
          dataIndex:"staff_id",
          key:"staff_id",
          width: '5%',
        },
        {
          title:"姓名",
          dataIndex:"staff_name",
          key:"staff_name",
          // fixed:"left",
          width: '5%',
          render:(text, record) => {return (<div style={{textAlign:'left'}}>{record.staff_name}</div>)},
        },
        {
          title:"所在院",
          dataIndex:"ou",
          key:"ou",
          width: '10%',
        },
        {
          title:"部门",
          dataIndex:"dept_name",
          key:"dept_name",
          width: '10%',
          render:(text,record)=>checkdeptname(text,record),
        },
        {
          title:"项目",
          dataIndex:"proj_name",
          key:"proj_name",
          width: '15%',
          render:(text, record) => {return (<div style={{textAlign:"left",width: '200px',whiteSpace:'normal'}}>{record.proj_name}</div>)},
        },
        {
          title:"职位",
          dataIndex:"post",
          key:"post",
          width: '5%',
          render:(text,record)=>{return <div style={{textAlign:'left'}}>{record.post}</div>},
        },
        {
          title:"项目考核系数",
          dataIndex:"proj_exam_ratio",
          key:"proj_exam_ratio",
          width: '10%',

          render:(text,record)=>{return <div style={{textAlign:'center'}}>{text || '-'}</div>},
        },
        {
          title:"项目系数",
          dataIndex:"proj_ratio",
          key:"proj_ratio",
          width: '10%',
          render:(text,record)=>{return <div style={{textAlign:'center'}}>{text || '-'}</div>},
        },

        {
          title:"考核得分",
          dataIndex:"lastScore",
          key:"lastScore",
          width: '5%',

          render:(text,record)=>{return <div style={{textAlign:'right'}}>{record.lastScore}</div>},
        },
        {
          title:"预评级",
          dataIndex:"p_rank",
          key:"zhengtai",
          width: '5%',
          render:(text)=>(text?text:""),
        },
        {
          title:"考核结果",
          dataIndex:"rank",
          key:"rank",
          width: '5%',
        },
       
      ];

      let {oulist,loading,list,resultList} = this.props;
      if(resultList && resultList.length){
        resultList.map((i,index)=>{
          i.key=index+"-data";
        })
      }

      if(oulist && oulist.length){
        oulist.map((i,index)=>{
          i.key=index+'-ou';
        })
      }
      //部门列表，同时去前缀
      const DeptList = (list||[]).map((item, index) => {
        return (
          <Option key={item.deptname}>
            {item.deptname.split('-')[1] || item.deptname}
          </Option>
        )
      });
      //组织单元列表
      const OuList = (oulist||[]).map((item, index) => {
        return (
          <Option key={item.OU}>
            {item.OU}
          </Option>
        )
      });
      //本院可以选择组织单元，其他院只能看本院
      const istrue=localStorage.ou==OU_HQ_NAME_CN?false:true;
      //点击组织单元表格不loading，点击按钮才有loading状态
      const flag=this.state.loadingFlag?loading:false;
      //添加表头搜索
      //i代表map里面的每一项，目前是两项staff_name,proj_name。k代表表头信息。
      //遍历表头，如果存在staff_name,proj_name，执行setSearchComponent。
      if(this.needSearch){
        this.needSearch.map(i=> {
          columns.map((k,index)=>{
            if(k.dataIndex===i&&!k.filterDropdown){
              columns[index]={...k,...this.setSearchComponent(i)}
            }
          });
          //点击onSearch进入该方法，通过正则过滤信息，使得resultList过滤出来。
          //如果filtered为true，即有查询条件的时候即进入该方法。resultList做出相应的改变。
          if (this.state[i].filtered) {
            const reg = new RegExp(this.state[i].searchText, 'gi');
            // resultList = resultList.filter(record => reg.test(record[i]));
            resultList = resultList.filter(record => {
              if(reg.lastIndex !== 0){
                reg.lastIndex = 0;
              }
              return reg.test(record[i])
            });

            //如果columns中包含render方法，直接返回record。
            //如果不包含render方法，将match[0]标红，返回
            resultList.map((record) => {
                const match = record[i].match(reg);
                // for(let key=0;key<columns.length;key++){
                //
                //   if(columns[key].dataIndex===i&&columns[key].render){
                //     return record;
                //   }
                // }
                if (!match) {
                  return null;
                }
                return {
                  ...record,
                  [i]: <span>
                      {record[i].split(reg).map((text, i) => (
                        i > 0 ? [<span style={{color:'#ff0000'}}>{match[0]}</span>, text] : text
                      ))}
                    </span>};
              });
            }

        });
      }
      return (
        <div className={Style.wrap} style={{whiteSpace:'nowrap',overflowX:'auto'}}>
          <div style={{textAlign: 'left'}}>
          {/* <span>
            组织单元：
            <Select showSearch style={{ width: 160}} value={this.state.company_type} onSelect={this.SelectChange1} defaultValue={localStorage.ou} disabled={istrue}>
              {OuList}
            </Select>
          </span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span>
            部门：
            <Select showSearch style={{ width: 200 }}   onSelect={this.SelectChange2} value={this.state.deptName}>
              <Option value="全部">全部</Option>
              {DeptList}
            </Select>
          </span>
            &nbsp;&nbsp;&nbsp;&nbsp; */}
            <span>
            考核年度：
            <Select showSearch style={{ width: 120 }} value={this.state.year_type} onSelect={this.SelectChange3} defaultValue={new Date().getFullYear().toString()}>
            {yearList.map(el => {
            return <Option value={el+""} key={el+""} >{el}</Option>;
            })}
            </Select>
            </span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span>
            考核季度：
            <Select showSearch style={{ width: 100 }} value={this.state.season_type} onSelect={this.SelectChange4} defaultValue={Math.floor((new Date().getMonth()+1 + 2) / 3).toString()}>
              <Option value="0" key={"0-season"}>年度考核</Option>
              <Option value="1"key={"1-season"}>第一季度</Option>
              <Option value="2"key={"2-season"}>第二季度</Option>
              <Option value="3"key={"3-season"}>第三季度</Option>
              <Option value="4"key={"4-season"}>第四季度</Option>
            </Select>
          </span>
          &nbsp;&nbsp;
          <span> 群体 :&nbsp;
            <Select style={{width:100}} onChange={(value)=>this.handleChange(value,'role')} dropdownMatchSelectWidth={false} value={role+""} defaultValue={role+""} key={"002"}>
            <Option key={"corePost"} value={"0"}>核心岗</Option>
            <Option key={"staff"} value={"1"}>普通员工</Option>
            </Select>
            </span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span> 归口部门 :&nbsp;
            <Select style={{width:200}} onChange={(value)=>this.handleChange(value,'focusName')} dropdownMatchSelectWidth={false} value={focusName||(this.props.focusDept.length!=0?this.props.focusDept[0].principal_deptname:"")}> 
            {
            (this.props.focusDept||[]).map(
            item => <Option key={item.principal_deptid} value={item.principal_deptname}>{item.principal_deptname}</Option>
            )
            }
            </Select>
            </span>
            &nbsp;&nbsp;
            <Button type="primary" icon="search" onClick={this.bpSerch}>查询</Button>
          {/* <br></br>
          <br></br> */}
          </div>
          <div>
            <h3 style={{float:'left',textAlign: 'left', marginTop: '20px',fontSize: '29px', fontFamily: '宋体', fontWeight: 'bold'}}>
              BP考核结果
            </h3>
            &nbsp;&nbsp;&nbsp;&nbsp;
            {this.state.displayWay === 'table' ?
              <Tooltip title="饼图显示">
                <Icon type = 'bingtu' style={{marginTop: '28px',fontSize:20,cursor:'pointer'}} onClick={this.switchDisplay1}/>
              </Tooltip>
              :
              <Tooltip title="表格显示">
                <Icon type = 'liebiao' style={{marginTop: '28px',fontSize:20,cursor:'pointer'}} onClick={this.switchDisplay2}/>
              </Tooltip>
            }
          </div>

          <div style={{display:this.state.displayTabBar}}>
            {this.needSearch? <Button type='primary' onClick={this.clearFilter} style={{marginTop:'10px',marginLeft:'-117px',marginBottom:'5px'}}>清空条件</Button>:null}
           <div style={{ float: 'right',display:"none"}}>
             <Button type='primary'  style={{marginTop: '10px'}} onClick={()=>this.updateOrCancelRatio('update')} >同步考核系数</Button>
             <Button type='primary' style={{marginTop: '10px'}} onClick={()=>this.updateOrCancelRatio('cancel')} style={{marginLeft:'10px'}}>撤销考核系数</Button>
           </div>
            <div id="table1">
              <Table
                dataSource={resultList}
                pagination={false}
                className={styles.orderTable}
                loading={flag}
                scroll={{x:"1400px"}}
                id='table1'
                columns={columns}
              >
              </Table>
            </div>
            <div style={{textAlign:"right", marginTop:'10px'}}><Button type="primary" icon="download"  onClick={this.exportExl2}>导出</Button></div>
          </div>
          <div style={{display:this.state.displayBarTab}}>
            {this.state.loadingFlag == true && loading == true
              ? <div style={{textAlign:'center'}}><Spin /></div>:null}
            <ResultPie resultList={resultList} temp={this.state.temp}/>
          </div>
        </div>
      );
    }
  }

function mapStateToProps (state) {
  const { oulist,list, query,resultList,focusDept} = state.result;  //lumj//statistic
  return {
    loading: state.loading.models.result,
    list,
    resultList,
    query,
    oulist,
    focusDept
  };
}

export default connect(mapStateToProps)(BpResult);
