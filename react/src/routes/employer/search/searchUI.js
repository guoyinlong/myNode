/**
 * 作者：李杰双
 * 日期：2017/9/1
 * 邮件：282810545@qq.com
 * 文件说明：指标查询UI页面
 */

import React from 'react'
import {Table,Input,Button,Icon} from 'antd'
import Cookie from 'js-cookie';
import message from '../../../components/commonApp/message'
import { routerRedux } from 'dva/router';
import styles from '../../../components/employer/employer.less'
import tableStyle from '../../../components/common/table.less'
import { postExcelFile }from '../../../utils/func.js'
import exportExl from '../../../components/commonApp/exportExl'

export  default  class SearchUI extends React.Component{
  constructor(props){
    super(props)
    const{thead,needSearch}=this.props
    this.state={
      filterInfo:{}
    }
    if(thead){
      this.thead=thead
    }
    if(needSearch){
      this.needSearch=needSearch
    }
  }
componentDidMount=()=>{
  const{condition,dept_name,staff_id,staff_name,proj_name,proj_name_0}=this.props;
  let state={}
  state["filterInfo"]=condition=="{}"?{}:JSON.parse(condition),
  state["staff_id"]=staff_id=="{}"?{}:JSON.parse(staff_id)
  state["staff_name"]=staff_name=="{}"?{}:JSON.parse(staff_name)
  this.needSearch.includes("dept_name")?(state["dept_name"]=dept_name=="{}"?{}:JSON.parse(dept_name)):""
  this.needSearch.includes("proj_name")?(state["proj_name"]=proj_name=="{}"?{}:JSON.parse(proj_name)):""
  this.needSearch.includes("proj_name_0")?(state["proj_name_0"]=proj_name_0=="{}"?{}:JSON.parse(proj_name_0)):""
  let path =location.hash.split('/')[location.hash.split('/').length-1].split("?")[0]
  state["path"]=path
  this.setState({
    ...state
   },()=>{
    window.history.pushState({},0,`/#/humanApp/employer/${path}`)
   })
}
  flags={
    needPro_id:false
  }

  stateMap={
    '0':'待提交',
    '1':'待审核',
    '2':'审核未通过',
    '3':'待评价',
    '4':'待确认',
    '5':'复议',
    '6':'待评级',
    '7':'待评级',
    '8':'待评级',
    '9':'待评级',
    '10':'考核完成',
    'A':'完成情况未填报'
  };
  colorMap={
    0: '#FA7252',
    1: '#FA7252',
    2: 'red',
    3: '#FA7252',
    4: '#FA7252',
    5: '#FA7252',
    6: '#FA7252',
    7: '#FA7252',
    8: '#FA7252',
    9: '#FA7252',
    10: 'green',
    A:'red'
  };
  /**
   * 作者：李杰双
   * 功能：动态生成可查询表头
   */
  setSearchComponent(key){
    if(!this.state[key]){
      this.state[key]={}
    }

    return {
      filterDropdown: (
        <div className={styles.filterDropdown}>
          <Input
            ref={ele => this.state[key].searchInput = ele}
            value={this.state[key].searchText}
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
  }
  /**
   * 作者：李杰双
   * 功能：根据输入值更新
   */
  onInputChange =(key)=> (e) => {
    //this.state[key].searchText=e.target.value
    let Inputext=e.target.value
     this.setState(
       { [key]:{...this.state[key],searchText: e.target.value,filtered:false }}
      //  ,()=>{
      //    if(Inputext==""){
      //     this.clearInfo()
      //     clearCondition=key
      //    }
      //   }
       );
  }
  /**
   * 作者：李杰双
   * 功能：根据输入值搜索表格
   */
  onSearch = (key)=>() => {
    const { searchText } = this.state[key];
    //  if(key=="dept_name"){
    //   window.localStorage.setItem("dept_name",searchText)
    //  }
    this.setState({[key]:{
      ...this.state[key],
      filterDropdownVisible: false,
      filtered: !!searchText
    }}
    // ,()=>{searchText==""?this.clearInfo():""}
    );
  }

  clearInfo=()=>{

  }



  /**
   * 作者：李杰双
   * 功能：动态生成表头
   */
  getHeader=()=>{
    if(this.needSearch&&!this.needSearch.length){
      return [...this.thead]
    }
    return [
      {
        title:'年度',
        dataIndex:'year'
      },
      {
        title:'季度',
        dataIndex:'season',
        render: (text) => text !='0' ? `第${text}季度` :'年度考核'
      },
      {
        title:'姓名',
        dataIndex:'staff_name',
      },
      {
        title: '员工编号',
        dataIndex: 'staff_id',
        render: (text) => <div>'{text}'</div>
      },
      {
        title:'绩效类型',
        dataIndex:'score_type',
        render:(text)=>text==='1'?'项目绩效':'综合绩效'
      },
      {
        title:'项目名称',
        dataIndex:'proj_name_0',
        className:tableStyle.breakcontent,
        render:(text)=>{

          if(text){
            let nameArr=text.split(',');
            return nameArr.map((i,index)=><div  key={index} style={{textAlign:'left',wordBreak:'break-all'}}>{i}</div>)
          }
          return text
        },
      },
      {
        title:'评级',
        dataIndex:'rank_0',
        render:(text)=>{
          if(text){
            let nameArr=text.split(',');
            return nameArr.map((i,index)=><div style={{height:'16px'}} key={index}>{i}</div>)
          }
          return text
        },
      },
      {
        title:'状态',
        dataIndex:'state',
        // render:(text)=>{
        //   return this.stateMap[text]
        // },
        render:(text)=>{
          return <div style={{ color: this.colorMap[text] }}>{this.stateMap[text]}</div>
        }

      },
      {
        title:'考核得分',
        dataIndex:'score',
        render:(text)=><div style={{textAlign:'right'}}>{text}</div>
      },
      {
        title:'考核评级',
        dataIndex:'rank'
      }
    ];
  }

  /**
   * 作者：李杰双
   * 功能：点击行进入详情页面
   */
  rowClickHandle=(record, index, event)=>{
   const target=event.target
    if(target.nodeName==='BUTTON'||target.parentNode.nodeName==='BUTTON'){
      return
    }
    const{staff_id,year,season,state,proj_id}=record;
    const {needPro_id} = this.flags
    if(season==='0'){
      message.info('年度考核无指标详情！')
      return
    }
    if(state==='0'){
      message.info('指标未提交！')
      return
    }
    const {dispatch}=this.props;
    let query={};
    if(needPro_id){
      query={
        staff_id,
        year,
        season,
        proj_id,
        stateTemp : state,
        //selectState:this.state.filterInfo?this.state.filterInfo.state?this.state.filterInfo.state.join(","):[]:[]
        filterInfo:Object.keys(this.state.filterInfo).length=="0"?1:JSON.stringify(this.state.filterInfo),
        dept_name:this.state.dept_name?JSON.stringify({
          filterDropdownVisible:this.state.dept_name.filterDropdownVisible,
          filtered:this.state.dept_name.filtered,
          searchText:this.state.dept_name.searchText,
        }):1,
        search_staff_id: JSON.stringify({
          filterDropdownVisible:this.state.staff_id.filterDropdownVisible,
          filtered:this.state.staff_id.filtered,
          searchText:this.state.staff_id.searchText,
        }),
        search_staff_name: JSON.stringify({
          filterDropdownVisible:this.state.staff_name.filterDropdownVisible,
          filtered:this.state.staff_name.filtered,
          searchText:this.state.staff_name.searchText,
        }),
        proj_name:JSON.stringify({
          filterDropdownVisible:this.state.proj_name.filterDropdownVisible,
          filtered:this.state.proj_name.filtered,
          searchText:this.state.proj_name.searchText,
        }),
      }
    }else{
      query={
        staff_id,
        year,
        season,
        stateTemp : state,
        //selectState:this.state.filterInfo?this.state.filterInfo.state?this.state.filterInfo.state.join(","):[]:[]
        filterInfo:Object.keys(this.state.filterInfo).length=="0"?1:JSON.stringify(this.state.filterInfo),  
        //dept_name:Object.keys(this.state.dept_name).length=="0"?"":JSON.stringify(this.state.dept_name)//里面有searchInput不能转
        dept_name:this.state.dept_name?JSON.stringify({
          filterDropdownVisible:this.state.dept_name.filterDropdownVisible,
          filtered:this.state.dept_name.filtered,
          searchText:this.state.dept_name.searchText,
        }):1,
        search_staff_id: JSON.stringify({
          filterDropdownVisible:this.state.staff_id.filterDropdownVisible,
          filtered:this.state.staff_id.filtered,
          searchText:this.state.staff_id.searchText,
        }),
        search_staff_name: JSON.stringify({
          filterDropdownVisible:this.state.staff_name.filterDropdownVisible,
          filtered:this.state.staff_name.filtered,
          searchText:this.state.staff_name.searchText,
        }),
        proj_name_0:this.state.proj_name_0?JSON.stringify({
          filterDropdownVisible:this.state.proj_name_0.filterDropdownVisible,
          filtered:this.state.proj_name_0.filtered,
          searchText:this.state.proj_name_0.searchText,
        }):1,
        proj_name:this.state.proj_name?JSON.stringify({
          filterDropdownVisible:this.state.proj_name.filterDropdownVisible,
          filtered:this.state.proj_name.filtered,
          searchText:this.state.proj_name.searchText,
        }):1,
      }
    }
    let path =location.hash.split('/')[location.hash.split('/').length-1].split("?")[0]
    dispatch(routerRedux.push({
      pathname:`/humanApp/employer/${path}/searchDetail` ,
      //pathname:`/humanApp/employer/hrsearch/searchDetail` ,
      query,
    }));
  };

  pagination={
    showQuickJumper:true,
    showSizeChanger:true,
    defaultPageSize:20,
    pageSizeOptions:['20', '40', '80', '200', '400']
  }

  /**
   * 作者：李杰双
   * 功能：清除所有搜索条件
   */
  clearFilter=()=>{
    //console.log(this.state)
    let s=this.state;let noSearch={}
    for(let k in s){
      if(s[k]!==null&&typeof s[k]==='object'&&s[k].searchText){
        let {searchInput}=s[k];
        searchInput?searchInput.refs.input.value='':""
        noSearch[k]={...s[k],searchText:'',filtered:false,searchInput}
      }
    }
    this.setState({
      ...noSearch,
      filterInfo:{}
    })
  }
  //收集筛选时选中的信息
  tableChangeHandle=(pagination, filters, sorter)=>{
   // console.log(filters)
    this.setState({
      filterInfo:filters
    })
  }

  needSearch=['staff_name','proj_name_0','staff_id'];

  needFilter=[
    {key:'season',filters: [{text: '第1季度', value: '1',},{text: '第2季度', value: '2',}, {text: '第3季度', value: '3',},{text: '第4季度', value: '4',},{text: '年度考核', value: '0',}]},
    {key:'year',filters: [{text: '2016年', value: '2016',},{text: '2017年', value: '2017',},{text: '2018年', value: '2018',},{text: '2019年', value: '2019',},{text: '2020年', value: '2020',}]},
    {key:'state',
      filters: [
        {
          text: '待提交',
          value: '待提交',
        },
        {
          text: '待审核',
          value: '待审核',
        },
        {
          text: '审核未通过',
          value: '审核未通过',
        },
        {
          text: '完成情况未填报',
          value: '完成情况未填报',
        },
        {
          text: '待评价',
          value: '待评价',
        },
        // {
        //   text: '待确认',
        //   value: '待确认',
        // },
        {
          text: '待评级',
          value: '待评级',
        },
        {
          text: '考核完成',
          value: '考核完成',
        },
      ],
      onFilter: (value, record) => this.stateMap[record.state]=== value
    
    }
  ]

  /**
   * 作者：罗玉棋
   * 邮箱：809590923@qq.com
   * 创建日期：2020-08-14
   * 功能：excel分布结果导出
   */
  expExl=()=>{
    let url='/microservice/allexamine/examine/empkpiqueryexport'
    let params={}
    let {season,year,dept_param}=this.props;
    let {filterInfo,staff_name,staff_id,dept_name,proj_name,selectOuid,proj_name_0}=this.state

    let path =location.hash.split('/')[location.hash.split('/').length-1].split("?")[0]
    params['arg_cur_season']=season
    params['arg_cur_year']=year
    params['arg_ou']=selectOuid || Cookie.get('deptname_p').split('-')[1]
    params['arg_year']=filterInfo.year==undefined?null:filterInfo.year.length==0?null:filterInfo.year
    params['arg_season']=filterInfo.season==undefined?null:filterInfo.season.length==0?null:filterInfo.season
    params['arg_staff_name']=staff_name.searchText==undefined?null:staff_name.searchText==""?null:staff_name.searchText
    params['arg_staff_id']=staff_id.searchText==undefined?null:staff_id.searchText==""?null:staff_id.searchText
    params['arg_state']=filterInfo.state==undefined?null:filterInfo.state.length==0?null:filterInfo.state
    params['arg_dept_name']=dept_name?dept_name.searchText==undefined?null:dept_name.searchText==""?null:dept_name.searchText:null
    params['arg_proj_name']=proj_name?(proj_name.searchText==undefined?null:proj_name.searchText==""?null:proj_name.searchText):null

    if(path=='dmsearch'){  //部门指标导出
      params['arg_dept_name']=dept_param
    }
    if(path=='pmsearch'){  //项目经理导出
      params['arg_mgr_id']=Cookie.get('userid')
    }
   if(path=='dmprojsearch'){ //部门带项目导出
    params['arg_dept_name']=dept_param
    params['arg_proj_name']=proj_name_0?proj_name_0.searchText==undefined?null:proj_name_0.searchText==""?null:proj_name_0.searchText:null
   }
   //0:hr 1:项目 2:部门 3:部门含项目名 4 :bp

   if(path=='bpsearch'){  //bp导出
    params['arg_year']=this.state.search_year||year
    params['arg_season']=this.state.search_season||season
    params['arg_flag']=4;
    params['arg_tag']=this.state.role||0,
    params['arg_pu_dept_name']=this.state.arg_pu_dept_name||this.props.focusDept[0].principal_deptname,
    params['arg_ou']=null
  }

    switch(path){
      case'hrsearch':
      params['arg_flag']=0;
      params['arg_tag']=Cookie.get('role')||'0',
      params['arg_year']=(JSON.parse(sessionStorage.getItem("search_year"))||[]).join(",")||year
      params['arg_season']=(JSON.parse(sessionStorage.getItem("search_season"))||[]).join(",")||season
      break;
      case'pmsearch':
      params['arg_flag']=1;
      break;
      case 'dmsearch':
      params['arg_flag']=2;
      break;
      case 'dmprojsearch':
      params['arg_flag']=3;
      break;
    }

     if(params['arg_state']!=null&&params['arg_state'].length!=0){
      params['arg_state']=params['arg_state'].map(item=>{
        for(let index in this.stateMap){
         if(item==this.stateMap[index]){

           item=[6,7,8,9].includes(Number(index))?"6,7,8,9":index
         }
        }
        return item
      })
     }
        // debugger
      for(let index in params){
       if(params[index]==null){
        delete params[index]
       }
        
        if(params[index] instanceof Array){
          if(params[index].length>1){
            params[index]=params[index].join(",")
          }else{
            params[index]=params[index].join("")
          }
        }
        
      }

    //  console.log("params",params)
    //  debugger
     postExcelFile(params,url)

    // let tab=document.querySelector('#content div')
    // exportExl()(tab,'指标信息导出')
  }

  reload=()=>{
    let path =location.hash.split('/')[location.hash.split('/').length-1].split("?")[0]
    this.props.dispatch(routerRedux.push({
      pathname:`/humanApp/employer/${path}`
    }));
  }

  render(){
    let {list,loading}=this.props;
    (list||[]).forEach((item,index)=>item.key=index+"data")
    let thead=this.thead||this.getHeader()
    //给头部添加搜索组件
    //debugger
    if(!this.thead){
      //加自定义搜索
      if(this.needSearch&&this.needSearch.length){
        this.needSearch.map(i=>{

          thead.map((k,index)=>{
            if(k.dataIndex===i&&!k.filterDropdown){
              thead[index]={...k,...this.setSearchComponent(i)}
            }
          })
          //debugger
          if(this.state[i].filtered){

            const reg = new RegExp(this.state[i].searchText, 'gi');

            //list=list.filter(item=>reg.test(item[i])).map(item=>{
            list=list.filter(item=>{
              if(reg.lastIndex !== 0){
                reg.lastIndex = 0;
              }
              return reg.test(item[i])
            }).map(item=>{
              const match = item[i].match(reg)
              for(let key=0;key<thead.length;key++){
                //debugger
                if(thead[key].dataIndex===i&&thead[key].render){
                  return item
                }
              }
              return {...item,[i]:<span>
              {item[i].split(reg).map((text, index) => (
                index > 0 ? [<span className={styles.highlight}>{match[0]}</span>, text] : text
              ))}
            </span>}
            })
          }
        })
      }
      //加自定义过滤
      if(this.needFilter&&this.needFilter.length){
        this.needFilter.map(i=>{
          thead.map(k=>{
            if(i.key===k.dataIndex){
              k.filters=i.filters
              k.onFilter=(value,record)=>record[i.key].indexOf(value) === 0
              if(i.onFilter){
                k.onFilter=i.onFilter
              }
              //debugger
              k.filteredValue=this.state.filterInfo?this.state.filterInfo[k.dataIndex]?this.state.filterInfo[k.dataIndex]:[]:[]

            }
          })
        })
        ///onFilter: (value, record) => record.address.indexOf(value) === 0,
      }
    }

    return(
      <div>
      <div className={styles.wrap+' '+tableStyle.orderTable}>

        {this.needFilter||this.needSearch? <Button type='primary' onClick={this.clearFilter} style={{float:'right'}}>清空条件</Button>:null}
     
      <Button type='primary' icon="download"  onClick={this.expExl} 
      style={{float:'right',marginRight:10}}
      disabled={this.state.path=="bpsearch"?this.props.focusDept.length==0?true:false:false}
      >导出</Button>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
        {/* <Tooltip placement="top" title={"清除缓存并强制刷新"}>
        <Button type='primary' icon="reload" onClick={this.reload} style={{float:'right',marginBottom:'10px',marginRight:"10px"}}>刷新</Button>
        </Tooltip> */}
        <Table
          rowClassName={(record)=>record.state!=='0'?styles.rowClass:null}
          //rowKey='id'
          onChange={this.tableChangeHandle}
          pagination={this.pagination}
          columns={thead}
          dataSource={list}
          loading={loading}
          scroll={{y:false,x:500}}
          onRowClick={this.props.rowClickHandle?this.props.rowClickHandle:this.rowClickHandle}
          style={{marginTop:this.state.path=='hrsearch'?15:0}}/>
          
      </div>
       </div>
    )
  }
}

