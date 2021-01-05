/**
 * 作者：郭银龙
 * 日期：2020-10-12
 * 邮箱：guoyl@itnova.com.cn
 * 文件说明：统计报表
 */  
import React from 'react';
import {connect } from 'dva';
import Cookie from 'js-cookie';
import styles from '../style.less';
import { routerRedux } from 'dva/router';
import { Table, Tabs, Button, Input,Pagination,DatePicker,Card,Select,Popconfirm,message,Modal,TreeSelect,BackTop} from "antd";
const Option = Select.Option;
import moment from 'moment'; 
const { TabPane } = Tabs;
const dateFormat = 'YYYY'; 
const format = 'YYYY';
import Statistics from './tongJiReport' //统计图
import {postExcelFile} from "../../../utils/func.js"


class statisticalReport extends React.Component {
  state={
    //   callbackId:query.callbackId,
    isDelTypeVisible:false,
    ontabs:"0" ,
    //统计列表
    inputvalue1:"",
    inputvalue2:"",
    inputvalue3:"",
    inputvalue4:"",
    inputvalue5:"",
    //统计图表时间
    inputvalue6:"",
    inputvalue7:"",
    // 排名
    nameRanking:"",
    deptRanking:"",
    zhibuRanking:"",
    //宣传组织
    inputvalue8:"",
    inputvalue9:"",
    //稿件复核
    inputvalue10:"",
    inputvalue11:"",
     //加分项
     inputvalue12:"",
     inputvalue13:"",
     //积分项
     inputvalue14:"0",
     inputvalue15:"",
     visible: false,//积分项modole显示
     jifenvalue:this.props.jfList?this.props.jfList.score:"",
     scoreid:"",
     expandedRowKeys:[]

  }

  getYearData = () => {
    var myDate = new Date();       
    var thisYear = myDate.getFullYear();  // 获取当年年份
    var Section = thisYear - 2010;  // 声明一个变量 获得当前年份至想获取年份差 
    var arrYear = []; // 声明一个空数组 把遍历出的年份添加到数组里
    for(var i = 0;i<=Section;i++){
        arrYear.push(thisYear--)
    }
    return arrYear
  }

  //清空
    empty=(a)=>{
        if(a==1){
            this.props. dispatch({
                type:"statisticalReport/tjbbSearch",
            })
        }else if(a==2){
            this.props.dispatch({
                type: "statisticalReport/naneSearch", 
            })

        }else if(a==3){
            this.props.dispatch({
                type: "statisticalReport/deptSearch", 
            })
            
        }else if(a==4){
            this.props.dispatch({
                type: "statisticalReport/zhibuSearch", 
            })
            
        }else if(a==5){
            this.props.dispatch({
                type: "statisticalReport/xczzSearch", 
            })
            
        }else if(a==6){
            this.props.dispatch({
                type: "statisticalReport/gjfhSearch", 
            })
            
        }else if(a==7){
            this.props.dispatch({
                type: "statisticalReport/jfxSearch", 
            })
            
        }else if(a==8){
            this.props.dispatch({
                type: "statisticalReport/jfSearch", 
            })
        }
        this.setState({
            inputvalue1:"",
            inputvalue2:"",
            inputvalue3:"",
            inputvalue4:"",
            inputvalue5:"",
            //统计图表时间  
            inputvalue6:"",
            inputvalue7:"",
            // 排名
            nameRanking:"",
            deptRanking:"",
            zhibuRanking:"",
            //宣传组织
            inputvalue8:"",
            inputvalue9:"",
            //稿件复核
            inputvalue10:"",
            inputvalue11:"",
            //加分项
            inputvalue12:"",
            inputvalue13:"",
            //积分项
            inputvalue14:"",
            inputvalue15:"",
        })

    }
    componentDidMount(){
        let callbackid=this.props.location.query.callbackId
        if(callbackid=="tongjibaobiao"){
            this.props. dispatch({
                type:"statisticalReport/tjbbSearch",
                })
        }else if(callbackid=="xuanchaunzuzhi"){
            this.props. dispatch({
            type:"statisticalReport/xczzSearch",
            })
        } else if(callbackid=="gaojianfuhe"){
            this.props. dispatch({
            type:"statisticalReport/gjfhSearch",
            })
        }else if(callbackid=="jiafenxiang"){
            this.props. dispatch({
            type:"statisticalReport/jfxSearch",
            })
        }
    }
    callback=(e)=> {
    if(e=="tongjibaobiao"){
        this.props. dispatch({
            type:"statisticalReport/tjbbSearch",
            })
    }else if(e=="xuanchaunzuzhi"){
        this.props. dispatch({
        type:"statisticalReport/xczzSearch",
        })
    } else if(e=="gaojianfuhe"){
        this.props. dispatch({
        type:"statisticalReport/gjfhSearch",
        })
    }else if(e=="jiafenxiang"){
        this.props. dispatch({
        type:"statisticalReport/jfxSearch",
        })
    }
    
    }
    callback2=(e)=> {
        if(e=="tongjiliebiao"){
        this.props. dispatch({
            type:"statisticalReport/tjbbSearch",
        })
        }else if(e=="tongjitubiao"){
        this.props. dispatch({
        type:"statisticalReport/tjtbSearch",
        })
        } else if(e=="jifenpaiming"){
        this.props. dispatch({
            type:"statisticalReport/naneSearch",
        })
        this.props. dispatch({
            type:"statisticalReport/jfguizhe",
        })
       
        }
    
    }
    callback3=(e)=> {
        if(e=="geren"){
        this.props. dispatch({
            type:"statisticalReport/naneSearch",
        })
        }else if(e=="bumen"){
        this.props. dispatch({
        type:"statisticalReport/deptSearch",
        })
        } else if(e=="zhibu"){
        this.props. dispatch({
        type:"statisticalReport/zhibuSearch",
        })
        }
    
    }
    callback4=(e)=> {
        if(e=="jiafenxiang"){
        this.props. dispatch({
            type:"statisticalReport/jfxSearch",
        })
        }else if(e=="jifenxiugai"){
        this.props. dispatch({
        type:"statisticalReport/jfSearch",
        })
        }
    
    }

    //统计报表导出
    manuscriptInFor=(e)=>{
        window.open("/microservice/newsmanager/statisticsListAllExportByDept?deptId="+e.deptId+"&deptName="+e.deptName,"_self")
    }
    //总导出
    ExportAll=()=>{
        {this.props.tjbbList.length>0?
        window.open("/microservice/newsmanager/statisticsListAllExport","_self")
        : message.error('暂无数据')}
        
    }
    //部门
    bumen=(e)=>{
        this.setState({
            inputvalue1:e.target.value
        })

    }
    //提交时间
    changeDate = (date,dateString) => {
        this.setState({
        inputvalue2:dateString
    })
            };
    //提交人
    ren=(e)=>{
        this.setState({
            inputvalue3:e.target.value
        })
    }
    //稿件名称
    mingcheng=(e)=>{
        this.setState({
            inputvalue4:e.target.value
        })
    }
    //稿件状态
    zhuangtai=(select)=>{
        this.setState({
            inputvalue5:select
        })
    }
    //搜索
    sousuo=()=>{
    const {inputvalue1, inputvalue2,inputvalue3,inputvalue4,inputvalue5}=this.state
        this.props. dispatch({
            type:"statisticalReport/tjbbSearch",
            inputvalue1,
            inputvalue2,
            inputvalue3,
            inputvalue4,
            inputvalue5,
        })
    }
    //分页
    changePage = (page) => {
    this.props.dispatch({
        type: "statisticalReport/tjbbSearch", page})
    }
    //展开二级统计列表
    onExpand=(expanded,record)=>{
    this.props.dispatch({
        type: "statisticalReport/tjbbSearch2", 
        id:record.deptId
    })
    }
    //展开二级统计列表的详情跳转
    manuscriptDetail=(e)=>{
        this.props.dispatch(routerRedux.push({
            pathname:'/adminApp/newsOne/statisticalReport/manuscriptDetail',
            query: {
                id:JSON.parse(JSON.stringify(e.newsId))
            }
        }));
    }
    //年份时间条件查询
    onChangeYear=(value)=>{
        this.setState({
            inputvalue6:value
        })
    }
    // 统计图部门
    onChangeBumen=(value)=>{
        this.setState({
            inputvalue7:value
        })
    }
    //统计图查询
    TBsousuo=()=>{
        const {inputvalue6, inputvalue7}=this.state
        this.props. dispatch({
            type:"statisticalReport/tjtbSearch",
            inputvalue6,
            inputvalue7,
        })
    }
    //排名查询条件监听
    namecheng=(e)=>{
        this.setState({
            nameRanking:e.target.value
        })

    }
    deptcheng=(e)=>{
        this.setState({
            deptRanking:e.target.value
        })
        
    }
    zhibucheng=(e)=>{
        this.setState({
            zhibuRanking:e.target.value
        })
        
    }
    //排名搜索
    namesousuo=()=>{
        const {nameRanking}=this.state
        this.props.dispatch({
            type: "statisticalReport/naneSearch", 
            nameRanking
        })
    }
    deptsousuo=()=>{
        const {deptRanking}=this.state
        this.props.dispatch({
            type: "statisticalReport/deptSearch", 
            deptRanking
        })
        
    }
    zhibusousuo=()=>{
        const {zhibuRanking}=this.state
        this.props.dispatch({
            type: "statisticalReport/zhibuSearch", 
            zhibuRanking
        })
        
    }
    //个人排名导出
    nameExport=()=>{
        {this.props.gerenList.length>0?
             window.open("/microservice/newsmanager/personalRankingExport","_self")
        : message.error('暂无数据')}
       
    }
    //部门排名导出
    deptExport=()=>{
        {this.props.deptList.length>0?
            window.open("/microservice/newsmanager/deptRankingExport","_self")
        :message.error('暂无数据')}
        
    }
    //支部排名导出
    zhibuExport=()=>{
        {this.props.zhibuList.length>0?
            window.open("/microservice/newsmanager/zhibuRankingExport","_self")
        :message.error('暂无数据')}
        
    }
    //排名分页
    //分页
    nameChangePage = (page) => {
        this.props.dispatch({
            type: "statisticalReport/naneSearch", page})
        }
    deptChangePage = (page) => {
        this.props.dispatch({
            type: "statisticalReport/deptSearch", page})
        }
    zhibuChangePage = (page) => {
        this.props.dispatch({
            type: "statisticalReport/zhibuSearch", page})
        }

    //宣传组织
    //宣传组织分页
    xczzChangePage=(page)=>{
        this.props.dispatch({
            type: "statisticalReport/xczzSearch", page})
        }
    //宣传组织查询
    //思想文化宣传队名称条件监听
    xczzXuanChuanDui=(e)=>{
        this.setState({
            inputvalue8:e.target.value
        })
    }
    //时间条件监听
    xczzChangeDate=(date,dateString)=>{
        this.setState({
            inputvalue9:dateString
        })
    }
    //去查询
    xczzsousuo=()=>{
        const {inputvalue8,inputvalue9}=this.state
        this.props.dispatch({
            type: "statisticalReport/xczzSearch", 
            inputvalue8,
            inputvalue9,
        })
        }
    //宣传组织删除
    confirm=(e)=> {
        this.props.dispatch({
            type: "statisticalReport/xczzdelete", 
            id:e.id
        })
        }
        cancel=(e)=> {
        message.error('删除失败');
        }
    //宣传组织新增
    xczznewAdd=(e)=>{
        this.props.dispatch(routerRedux.push({
            pathname:'/adminApp/newsOne/statisticalReport/newPublicity',
        }));
        }
    //宣传组织修改
    xiugai=(e)=>{
        this.props.dispatch(routerRedux.push({
            pathname:'/adminApp/newsOne/statisticalReport/newSetPublicity',
            query: {
                newsId:JSON.parse(JSON.stringify(e.id))
            }
        }));
    }
        //宣传组织详情
    goTodetai=(e)=>{
        this.props.dispatch(routerRedux.push({
            pathname:'/adminApp/newsOne/statisticalReport/publicityDetail',
            query: {
                newsId:JSON.parse(JSON.stringify(e.id))
            }
        }));
        }

    //宣传组织导出
    Export=(e)=>{
            window.open("/microservice/newsmanager/exportProOrganization?id="+e.id,"_self")
    }
    // <--稿件复核-->
    //稿件复核监听稿件名称
    gjfhXuanChuanName=(e)=>{
        this.setState({
            inputvalue10:e.target.value
        })
    }
    //稿件复核监听时间
    gjfhChangeDate=(data,dateString)=>{
        this.setState({
            inputvalue11:dateString
        })
    }
    //稿件复核查询
    gjfhsousuo=()=>{
        const{inputvalue10,inputvalue11}=this.state
        this.props.dispatch({
            type: "statisticalReport/gjfhSearch", 
            inputvalue10,
            inputvalue11,
        })
    }
    //稿件复核新增
    gjfhnewAdd=(e)=>{
        this.props.dispatch(routerRedux.push({
            pathname:'/adminApp/newsOne/statisticalReport/newManuscriptReview',

        })); 
    }
    // 稿件复核修改
    gjfhModify=(e)=>{
        this.props.dispatch(routerRedux.push({
            pathname:'/adminApp/newsOne/statisticalReport/newSetManuscriptReview',
            query: {
                newsId:JSON.parse(JSON.stringify(e.id))
            }
        }));
    }
    //稿件复核详情
    gjfhInfo=(e)=>{
        this.props.dispatch(routerRedux.push({
            pathname:'/adminApp/newsOne/statisticalReport/manuscriptReviewDetail',
            query: {
                newsId:JSON.parse(JSON.stringify(e.id))
            }
        }));
    }

    // 稿件复核删除
    confirm2=(e)=> {
        this.props.dispatch({
            type: "statisticalReport/deleteNewsCheck", 
            id:e.id,
        })
    } 
    cancel2=(e)=> {
        message.error('删除失败');
    }
    //   稿件复核分页
    gjfhchangePage=(page)=>{
        this.props.dispatch({
            type: "statisticalReport/gjfhSearch", page})
    }
    // <--加分项-->
    // 加分项申请部门条件监听
    jfxcheng=(e)=>{
            this.setState({
                inputvalue12:e.target.value
            })
    }
    // 加分项查询
    jfxsousuo=()=>{
        const{inputvalue12}=this.state
        this.props.dispatch({
            type: "statisticalReport/jfxSearch", 
            inputvalue12,
        })
    }
    // 加分项新增
    jfxAdd=()=>{
        this.props.dispatch(routerRedux.push({
            pathname:'/adminApp/newsOne/statisticalReport/newBonus',
        }));
    }
    // 加分项修改
    jfxModify=(e)=>{
        this.props.dispatch(routerRedux.push({
            pathname:'/adminApp/newsOne/statisticalReport/newSetBonus',
            query: {
                newsId:JSON.parse(JSON.stringify(e.id))
            }
        }));
    }
     // 加分项详情
     jfxInfo=(e)=>{
        this.props.dispatch(routerRedux.push({
            pathname:'/adminApp/newsOne/statisticalReport/bonusDetail',
            query: {
                newsId:JSON.parse(JSON.stringify(e.id))
            }
        }));
    }
    //加分项分页
    jiafenxiangChangePage=(page)=>{
        this.props.dispatch({
            type: "statisticalReport/jfxSearch", 
            page,
        })
    }
    // 加分项删除
    confirm3=(e)=> {
        this.props.dispatch({
            type:'statisticalReport/deleteBonusItem',
            id:JSON.parse(JSON.stringify(e.id))
        })
    } 
    cancel3=(e)=> {
        message.error('删除失败');
    }

    //积分选择事项监听
    onChangeShixiang=(value)=>{
        this.setState({
            inputvalue14:value
        })
        this.props.dispatch({
            type: "statisticalReport/jfSearch", 
            inputvalue14:value
        })
    }
    //积分工号条件监听
    jfcheng=(e)=>{
        this.setState({
            inputvalue15:e.target.value
        })
    }
    //积分查询
    jfsousuo=()=>{
        const{inputvalue14,inputvalue15}=this.state
        this.props.dispatch({
            type: "statisticalReport/jfSearch", 
            inputvalue14,
            inputvalue15
        })
    }
    //积分修改
    returnModel =(value,value2)=>{
        if(value2!==undefined){
            this.props.dispatch({
                type:'statisticalReport/'+value,
                record : value2,
            })
        }else{
            this.props.dispatch({
                type:'statisticalReport/'+value,
            })
        }
    };
 //设置显示
  showModal = (e) => {
    this.props.dispatch({
        type: "statisticalReport/setPoints", 
        score:e.score,
        
    })
    this.setState({
      visible: true,
      scoreid:e.id
    });
  };
  //积分修改确定
  handleOk = () => {
      const{inputvalue14,scoreid}=this.state
    this.setState({
      visible: false,
    });
    this.props.dispatch({
        type: "statisticalReport/jfSet", 
        id:scoreid,
        flag:inputvalue14
    })
  };
//取消
  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };
  changeRowsKey(expanded, record) {
    let temp = []
    if (expanded) {
      temp.push(record.key)
    }
    this.setState({
      expandedRowKeys: temp
    })
    this.props.dispatch({
        type: "statisticalReport/tjbbSearch2", 
        id:record.deptId
    })
  }
  jiFenChangePage = (page) => {
      const{inputvalue14}=this.state
    this.props.dispatch({
        type: "statisticalReport/jfSearch", page,inputvalue14})
    }

 
  render(){
    const {tjbbList,alllist,tjbbList2,xczzList,gjfhList, tongjitubiaoList,jifenpaimingList,qudaoDataList,reportList,MyChartValue,
        gerenList,gerenList2,deptList,zhibuList,jfxList,jfList
    } = this.props
    const columns1 = [
        {  
            title: "序号",
            key:(text,record,index)=>`${index+1}`,
            render:(text,record,index)=>`${index+1}`,
        },
        {  
            title: "部门/分院/支部",
            dataIndex: "deptName",
            key: "deptName",
           
        },
        {
            title: "新闻稿数量",
            dataIndex: "num",
            key: "num",
           
        },
        {
            title: "操作",
            dataIndex: "operation",
            key: "operation",
            render: (text,e) => {
                return (
                    <div className = {styles.editStyle}>
                        <Button size="default" type="primary"  onClick = {() => this.manuscriptInFor(e)}  style= {{marginRight: "10px"}}>导出</Button>
                       
                    </div>
                );
            }
        }
        
       
    ];
    const columns11 = [
        {  
            title: "序号",
            key:(text,record,index)=>`${index+1}`,
            render:(text,record,index)=>`${index+1}`,
        },
        {  
            title: "稿件名称",
            dataIndex: "newsName",
            key: "newsName",
           
        },
        {
            title: "发布稿件名称",
            dataIndex: "releaseNewsName",
            key: "releaseNewsName",
           
        },
        {  
            title: "发布渠道",
            dataIndex: "releaseChannel",
            key: "releaseChannel",
           
        },
        {
            title: "提交人",
            dataIndex: "createByName",
            key: "createByName",
           
        },
        {
            title: "是否原创",
            dataIndex: "isOriginal",
            key: "isOriginal",
           
        },
        {  
            title: "提交时间",
            dataIndex: "startTime",
            key: "startTime",
           
        },
        {
            title: "发布状态",
            dataIndex: "state",
            key: "state",
           
        },
        {
            title: "操作",
            dataIndex: "operation",
            key: "operation",
            render: (text,e) => {
                return (
                    e.state=="已发布"?
                    <div className = {styles.editStyle}>
                        <Button size="default" type="primary"  onClick = {() => this.manuscriptDetail(e)}  style= {{marginRight: "10px"}}>详情</Button>
                    </div>
                    :""
                );
            }
        }
        
       
    ];
    const columns2 = [
        {  
            title: "序号",
            key:(text,record,index)=>`${index+1}`,
            render:(text,record,index)=>`${index+1}`,
            width:"6%",
        },
        {  
            title: "思想文化宣传队名称",
            dataIndex: "thoughtName",
            key: "thoughtName",
            // width: "15%",
           
        },
        {
            title: "思想文化宣传队队长/新闻宣传员",
            dataIndex: "thoughtCaptain",
            key: "thoughtCaptain",
            width: "10%",
        },
        {
            title: "思想文化宣传队队员",
            dataIndex: "thoughtTeam",
            key: "thoughtTeam",
            // width: "15%",
        },
        {
            title: "提交人",
            dataIndex: "createByName",
            key: "createByName",
            width: "10%",
        },
        {
            title: "单位",
            dataIndex: "deptName",
            key: "deptName",
            // width: "15%",
        },
        {
            title: "提交时间",
            dataIndex: "createTime",
            key: "createTime",
            // width: "15%",
        },
        {
            title: "状态",
            dataIndex: "state",
            key: "state",
            width: "10%",
        },
        {
            title: "操作",
            dataIndex: "operation",
            key: "operation",
            //   width: "15%",
            render: (text,e) => {
                return (
                    <div>
                        <div className = {styles.editStyle}>
                            <Button size="default" type="primary"  onClick = {() => this.goTodetai(e)}  style= {{marginRight: "10px",marginTop:10}}>详情</Button>
                            <Button size="default" type="primary"  onClick = {() => this.Export(e)}  style= {{marginRight: "10px",marginTop:10}}>导出</Button>
                        
                        </div>
                        <div className = {styles.editStyle}>
                            <Button size="default" type="primary"   style= {{marginRight: "10px",marginTop:10}}>
                                <Popconfirm
                                    title="是否确认删除?"
                                    onConfirm={() => this.confirm(e)}
                                    onCancel={this.cancel}
                                    okText="是"
                                    cancelText="否"
                                >
                                    <a href="#">删除</a>
                                </Popconfirm>
                            </Button>
                            <Button size="default" type="primary"  onClick = {() => this.xiugai(e)}  style= {{marginRight: "10px",marginTop:10}}>修改</Button>
                            
                        </div>
                    </div>
                    
                );
            }
        }
    ];
    const columns3 = [
        {  
            title: "序号",
            key:(text,record,index)=>`${index+1}`,
            render:(text,record,index)=>`${index+1}`,
            width:"6%",
        },
        {  
            title: "稿件名称",
            dataIndex: "newsName",
            key: "newsName",
           
        },
        {
            title: "时间",
            dataIndex: "releaseTime",
            key: "releaseTime",
           
        },
        {
            title: "状态",
            dataIndex: "state",
            key: "state",
           
        },
        {
            title: "操作",
            dataIndex: "operation",
            key: "operation",
            render: (text,e) => {
                return (
                    <div className = {styles.editStyle}>
                        <Button size="default" type="primary"  onClick = {() => this.gjfhInfo(e)}  style= {{marginRight: "10px"}}>详情</Button>
                        {e.state=="草稿"||e.state=="退回"?
                        <Button size="default" type="primary"  onClick = {() => this.gjfhModify(e)}  style= {{marginRight: "10px"}}>修改</Button>
                        :""
                        }
                        {e.state=="草稿"||e.state=="退回"?
                        <Button size="default" type="primary"    style= {{marginRight: "10px"}}>
                        <Popconfirm
                                title="是否确认删除?"
                                onConfirm={() => this.confirm2(e)}
                                onCancel={this.cancel2}
                                okText="是"
                                cancelText="否"
                            >
                                <a href="#">删除</a>
                            </Popconfirm>
                        </Button>
                        :""
                    }
                       
                    </div>
                );
            }
        }
    ];

    const columns5 = [
        {  
            title: "序号",
            key:(text,record,index)=>`${index+1}`,
            render:(text,record,index)=>`${index+1}`,
            width:"13%",
        },
        {  
            title: "名字",
            dataIndex: "name",
            key: "name",
           
        },
        {
            title: "发布稿件数量",
            dataIndex: "number",
            key: "number",
           
        },
        {
            title: "积分",
            dataIndex: "score",
            key: "score",
            width:"17%",
           
        },
        {
            title: "时间",
            dataIndex: "date",
            key: "date",
            width:"18%",
        }
       
    ];
    const columns6 = [
        {  
            title: "序号",
            key:(text,record,index)=>`${index+1}`,
            render:(text,record,index)=>`${index+1}`,
            width:"13%",
        },
        {  
            title: "部门名称",
            dataIndex: "name",
            key: "name",
           
        },
        {
            title: "发布稿件数量",
            dataIndex: "number",
            key: "number",
           
        },
        {
            title: "积分",
            dataIndex: "score",
            key: "score",
            width:"17%",
           
        },
        {
            title: "时间",
            dataIndex: "date",
            key: "date",
            width:"18%",
           
        }
    ];
    const columns7 = [
        {  
            title: "序号",
            key:(text,record,index)=>`${index+1}`,
            render:(text,record,index)=>`${index+1}`,
            width:"13%",
        },
        {  
            title: " 支部名称",
            dataIndex: "name",
            key: "name",
           
        },
        {
            title: "发布稿件数量",
            dataIndex: "number",
            key: "number",
            width:"20%",
           
        },
        {
            title: "积分",
            dataIndex: "score",
            key: "score",
            width:"17%",
           
        },
        {
            title: "时间",
            dataIndex: "date",
            key: "date",
            width:"18%",
        }
        
        
    ];
    const columns8 = [
        {  
            title: "序号",
            key:(text,record,index)=>`${index+1}`,
            render:(text,record,index)=>`${index+1}`,
        },
        {  
            title: " 加分事项",
            dataIndex: "newsName",
            key: "newsName",
           
        },
        {
            title: "申请部门",
            dataIndex: "createDeptName",
            key: "createDeptName",
           
        },
        {
            title: "申请时间",
            dataIndex: "createTime",
            key: "createTime",
           
        },
        {
            title: "状态",
            dataIndex: "state",
            key: "state",
           
        },
        {
            title: "操作",
            dataIndex: "operation",
            key: "operation",
            render: (text,e) => {
                return (
                    <div className = {styles.editStyle}>
                        <Button size="default" type="primary"  onClick = {() => this.jfxInfo(e)}  style= {{marginRight: "10px"}}>详情</Button>
                        {e.state=="草稿"||e.state=="退回"?
                        <Button size="default" type="primary"  onClick = {() => this.jfxModify(e)}  style= {{marginRight: "10px"}}>修改</Button>
                        :""}
                        {e.state=="草稿"||e.state=="退回"?
                        <Button size="default" type="primary"    style= {{marginRight: "10px"}}>
                        <Popconfirm
                                title="是否确认删除?"
                                onConfirm={() => this.confirm3(e)}
                                onCancel={this.cancel3}
                                okText="是"
                                cancelText="否"
                            >
                                <a href="#">删除</a>
                            </Popconfirm>
                        </Button>
                       :""}
                    </div>
                );
            }
        }
       
    ];
    const columns9 = [
        {  
            title: "序号",
            key:(text,record,index)=>`${index+1}`,
            render:(text,record,index)=>`${index+1}`,
        },
        { 
            title: "人员名称",
            dataIndex: "name",
            key: "name",
           
        },
        {
            title: "工号",
            dataIndex: "relatedId",
            key: "relatedId",
           
        },
        {
            title: "积分",
            dataIndex: "score",
            key: "score",
           
        },
        {
            title: "操作",
            dataIndex: "operation",
            key: "operation",
            render: (text,e) => {
                return (
                    <div className = {styles.editStyle}>
                        <Button size="default" type="primary"  onClick={()=>this.showModal(e)}    style= {{marginRight: "10px"}}> 修改 </Button>
                        <Modal
                            title="积分修改"
                            visible={this.state.visible}
                            onOk={()=>this.handleOk()}
                            onCancel={this.handleCancel}
                            >
                            积分：<Input type="number" style={{width:'60%'}} value={this.props.jifenvalue}
                            onChange={(e)=>this.returnModel('jfmodify',e.target.value)}
                             />
                        </Modal>
                    </div>
                );
            }
        }
    ];
    const columns99 = [
        {  
            title: "序号",
            key:(text,record,index)=>`${index+1}`,
            render:(text,record,index)=>`${index+1}`,
        },
        { 
            title: "单位名称",
            dataIndex: "name",
            key: "name",
           
        },
        {
            title: "积分",
            dataIndex: "score",
            key: "score",
           
        },
        {
            title: "操作",
            dataIndex: "operation",
            key: "operation",
            render: (text,e) => {
                return (
                    <div className = {styles.editStyle}>
                        <Button size="default" type="primary"  onClick={()=>this.showModal(e)}    style= {{marginRight: "10px"}}> 修改 </Button>
                        <Modal
                            title="积分修改"
                            visible={this.state.visible}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            >
                            积分：<Input type="number" style={{width:'60%'}} value={this.props.jifenvalue}
                            onChange={(e)=>this.returnModel('jfmodify',e.target.value)}/>
                        </Modal>
                    </div>
                );
            }
        }
    ];
    const columns999 = [
        {  
            title: "序号",
            key:(text,record,index)=>`${index+1}`,
            render:(text,record,index)=>`${index+1}`,
        },
        { 
            title: "稿件名称",
            dataIndex: "name",
            key: "name",
           
        },
        {
            title: "积分",
            dataIndex: "score",
            key: "score",
           
        },
        {
            title: "操作",
            dataIndex: "operation",
            key: "operation",
            render: (text,e) => {
                return (
                    <div className = {styles.editStyle}>
                        <Button size="default" type="primary"  onClick={()=>this.showModal(e)}    style= {{marginRight: "10px"}}> 修改 </Button>
                        <Modal
                            title="积分修改"
                            visible={this.state.visible}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            >
                            积分：<Input type="number" style={{width:'60%'}} value={this.props.jifenvalue}
                            onChange={(e)=>this.returnModel('jfmodify',e.target.value)}
                             />
                        </Modal>
                    </div>
                );
            }
        }
    ];
    // 统计列表合计
    const columnv = [
    
        {
            title: '门店',
            width:"13%",
            key:(text,record,index)=>`${index+1}`,
            render: (text, record) =><span>合计</span>
            
        },
        {
            title: '部门/分院/支部',
            dataIndex: "deptName",
            key: "deptName",
        },
        {
            title: '数量',
            dataIndex: 'sum',
            key: 'sum',
            width:"17%",
        },
        {
            title: "操作",
            dataIndex: "operation",
            key: "operation",
            width:"18%",
            render: (text,e) => {
                return (
                    <div className = {styles.editStyle}>
                    
                    </div>
                );
            }
        }
    ];
    // 个人排名合计
    const columngeren1 = [
   
        {
            title: '门店',
            width:"13%",
            key:(text,record,index)=>`${index+1}`,
            render: (text, record) =><span>合计</span>
            
        },
        {
            title: '部门/分院/支部',
            dataIndex: "totalNumber1",
            key: "totalNumber1",
        },
        {
            title: '部门/分院/支部',
            dataIndex: "totalNumber",
            key: "totalNumber",
            width:"37%",
        },
        {
            title: '数量',
            dataIndex: 'totalScore',
            key: 'totalScore',
            width:"17%",
        },
        {
            title: "操作",
            dataIndex: "operation",
            key: "operation",
            width:"18%",
            render: (text,e) => {
                return (
                    <div className = {styles.editStyle}>
                       
                    </div>
                );
            }
        }
    ];
      // 部门支部排名合计
      const columngeren = [
   
        {
            title: '门店',
            width:"13%",
            key:(text,record,index)=>`${index+1}`,
            render: (text, record) =><span>合计</span>
            
        },
        {
            title: '部门/分院/支部',
            dataIndex: "totalNumber1",
            key: "totalNumber1",
        },
        {
            title: '部门/分院/支部',
            dataIndex: "totalNumber",
            key: "totalNumber",
            width:"20%",
        },
        {
            title: '数量',
            dataIndex: 'totalScore',
            key: 'totalScore',
            width:"17%",
        },
        {
            title: "操作",
            dataIndex: "operation",
            key: "operation",
            width:"18%",
            render: (text,e) => {
                return (
                    <div className = {styles.editStyle}>
                       
                    </div>
                );
            }
        }
    ];
    const expandedRowRender = ( record )=>{
        return (
                <Table
                pagination = { false }
                columns = {columns11 }
                dataSource = { tjbbList2[0]!=null?tjbbList2:[]}
                className = { styles.orderTable }
                
                >
                </Table>
            )
        };
    //统计图表部门选择
    qudaoDataList.length === 0 ? [] : qudaoDataList.map((item,index) => { 
                item.key = index;
                item.title = item.deptName
                item.value = item.deptId
                item.disabled = true;
                item.children.map((v, i) => {
                v.key = index + '-' + i;
                v.title = v.deptName
                v.value = v.deptId
              })
    })
    let yearList = this.getYearData().map((item, i) => {
        return <Option key={i} value={item+''}>{item}</Option>
      })
    return (
      <div className={styles['pageContainer']}>
        <Tabs 
        defaultActiveKey={this.props.location.query.callbackId}
        onTabClick={(e)=>this.callback(e)}
        >
          <TabPane tab="统计报表" key="tongjibaobiao">
                 <Tabs 
                    defaultActiveKey={"tongjiliebiao"}
                    onTabClick={(e)=>this.callback2(e)}
                    >
                    <TabPane tab="统计列表" key="tongjiliebiao">
                        <div>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;部门： <Input
                                        value={this.state.inputvalue1}
                                        style={{ width: 200,marginBottom:20,marginRight:20}}
                                        onChange ={this.bumen }
                                        placeholder={"部门"}
                                        />
                        提交时间：  <DatePicker
                                        onChange = {this.changeDate} 
                                        style = {{width:200, marginRight:10}}
                                        value={this.state.inputvalue2 == '' ? null : moment(this.state.inputvalue2, dateFormat)}
                                        />
                        &nbsp;提交人： <Input
                                        value={this.state.inputvalue3}
                                        style={{ width: 200,marginBottom:20,marginRight:20}}
                                        onChange ={this.ren }
                                        placeholder={"提交人"}
                                        />
                        </div>
                        <div>
                        稿件名称： <Input
                                    value={this.state.inputvalue4}
                                    style={{ width: 200,marginBottom:20,marginRight:20}}
                                    onChange ={this.mingcheng }
                                    placeholder={"稿件名称"}
                                    />
                        发布状态：
                                <Select 
                                    onChange={this.zhuangtai}
                                    style={{ minWidth: "200px", maxWidth: 940,marginRight:20 }}
                                    placeholder = "请选择"
                                    value={this.state.inputvalue5}
                                    >
                                    <Option  value={"1"}>是</Option>
                                    <Option  value={"0"}>否</Option>
                                </Select>
                                    <div style= {{float: "right"}}>
                                        <Button size="default" type="primary" onClick={()=>{this.empty(1)}} style= {{marginRight: "10px"}}>清空</Button>
                                        <Button size="default" type="primary" onClick={this.sousuo} style= {{marginRight: "10px"}}>查询</Button>
                                        <Button size="default" type="primary" onClick={this.ExportAll} style= {{marginRight: "10px"}}>导出</Button>
                                    </div>
                        </div>
                   
                    
                        
                   
                    <Table 
                        expandable={{ expandedRowRender }} //这里的函数要在render中用const声明，做展开行数据处理
                        expandedRowKeys={this.state.expandedRowKeys}//默认无展开时值为[]，有展开时值为[key]
                        columns = {columns1}
                        className = {styles.orderTable}
                        dataSource = {tjbbList}
                        pagination={false}
                        expandedRowRender = { expandedRowRender }
                        onExpand={(expanded, record) => this.changeRowsKey(expanded, record)}//点击展开时重新赋值Rowskey
                        scroll={{ x: 1000 }}
                        footer={() => {
                        return (
                            <Table
                                showHeader={false} // table 的 columns 头部隐藏
                                columns={columnv}
                                dataSource={alllist}
                                bordered
                                pagination={false}
                                className = {styles.orderTable2}
                            />
                        )
                        }}
                        />
                        <Pagination
                        current = {this.props.pageCurrent!=""?this.props.pageCurrent:1}
                        pageSize = {10}
                        total = {this.props.allCount!=""?this.props.allCount:1}
                        onChange = {this.changePage}
                        style = {{textAlign: 'center', marginTop: '20px'}}
                        />
                    
                    </TabPane>
                    <TabPane tab="统计图表" key="tongjitubiao">
                    {reportList.monthlyRelease?<div>
                    选择时间：    
                     
                            <Select 
                                allowClear  
                                style={{ minWidth: '8%' ,marginRight:10}}  
                                onChange={this.onChangeYear}>
                                {yearList}
                            </Select>
                                              
                    选择部门：<TreeSelect
                                showSearch
                                style={{ minWidth: "250px", maxWidth: 260 , marginRight:10}}
                                dropdownStyle={{ maxHeight: 500, minHeight: 200,width: 540 , overflow: 'auto' }}
                                placeholder="请选择部门"
                                treeData={qudaoDataList}
                                allowClear
                                treeDefaultExpandAll
                                onChange={this.onChangeBumen}
                            >
                            </TreeSelect>
                    <Button size="default" type="primary" onClick={this.TBsousuo} style= {{marginLight: "20px"}}>查询</Button>
                    {reportList.monthlyRelease?
                            <Card style = {{marginBottom:10}} title={  <span style = {{fontWeight:900}}> <h2>每月发布量:</h2> </span> }>
                              <Statistics statisticsData = {reportList.monthlyRelease}/>
                            </Card> 
                     :""}
                    {reportList.annualPublicityWork?
                            <Card style = {{marginBottom:10}} title={  <span style = {{fontWeight:900}}> <h2>年度宣传计划完成统计:</h2> </span> }>
                              <Statistics statisticsData = {reportList.annualPublicityWork} dispatch={this.props.dispatch}/>
                            </Card> 
                     :""}
                      {MyChartValue?
                            <Card style = {{marginBottom:10}} title={  <span style = {{fontWeight:900}}> <h2>各部门的年度宣传工作计划完成统计:</h2> </span> }>
                              <Statistics statisticsData = {MyChartValue}  />
                            </Card> 
                     :""}
                         </div> :""} 
                    </TabPane>
                    <TabPane tab="积分排名" key="jifenpaiming">
                        <a href={this.props.jfguizhe.url} style={{display:"inline-block",margin:10}}>{this.props.jfguizhe.fileName}</a>
                    <Tabs 
                    defaultActiveKey={"geren"}
                    onTabClick={(e)=>this.callback3(e)}
                    >
                        
                    <TabPane tab="个人排名" key="geren">
                        {this.props.namepaiming.rank==""?<h4>暂无排名</h4>:
                        <h4>您在{this.props.namepaiming.ouName}的排名是：{this.props.namepaiming.rank}</h4>
                        }
                      
                    名字： <Input
                                value={this.state.nameRanking}
                                style={{ width: 200,marginBottom:20,marginRight:20,marginTop:20}}
                                onChange ={this.namecheng }
                                placeholder={"请输入名字"}
                                />
                        <div style= {{float: "right"}}>
                            <Button size="default" type="primary" onClick={()=>{this.empty(2)}} style= {{marginRight: "10px"}}>清空</Button>
                            <Button size="default" type="primary" onClick={this.namesousuo} style= {{marginRight: "10px"}}>查询</Button>
                            <Button size="default" type="primary" onClick={this.nameExport} style= {{marginRight: "10px"}}>导出</Button>
                        </div>
                    <Table 
                                columns = {columns5}
                                className = {styles.orderTable}
                                dataSource = {gerenList}
                                pagination={false}
                                footer={() => {
                                    return (
                                        <Table
                                            showHeader={false} // table 的 columns 头部隐藏
                                            columns={columngeren1}
                                            dataSource={gerenList2}
                                            bordered
                                            pagination={false}
                                            className = {styles.orderTable2}
                                        />
                                    )
                            }}
                            />
                    <Pagination
                                current = {this.props.pageCurrent   !=""?this.props.pageCurrent:1}
                                pageSize = {10}
                                total = {this.props.allCount!=""?this.props.allCount:1}
                                onChange = {this.nameChangePage}
                                style = {{textAlign: 'center', marginTop: '20px'}}
                               
                                />
                    </TabPane>
                    <TabPane tab="部门排名" key="bumen">
                    单位： <Input
                                                 value={this.state.deptRanking}
                                                    style={{ width: 200,marginBottom:20,marginRight:20}}
                                                     onChange ={this.deptcheng }
                                                     placeholder={"请输入单位名称"}
                                                     />
                            <div style= {{float: "right"}}>
                                        <Button size="default" type="primary" onClick={()=>{this.empty(3)}} style= {{marginRight: "10px"}}>清空</Button>
                                        <Button size="default" type="primary" onClick={this.deptsousuo} style= {{marginRight: "10px"}}>查询</Button>
                                        <Button size="default" type="primary" onClick={this.deptExport} style= {{marginRight: "10px"}}>导出</Button>
                            </div>
                    <Table 
                                columns = {columns6}
                                className = {styles.orderTable}
                                dataSource = {deptList}
                                pagination={false}
                                footer={() => {
                                    return (
                                        <Table
                                            showHeader={false} // table 的 columns 头部隐藏
                                            columns={columngeren}
                                            dataSource={gerenList2}
                                            bordered
                                            pagination={false}
                                            className = {styles.orderTable2}
                                        />
                                    )
                            }}
                            />
                            <Pagination
                                current = {this.props.pageCount   !=""?this.props.pageCount:1}
                                pageSize = {10}
                                total = {this.props.allCount!=""?this.props.allCount:1}
                                onChange = {this.deptChangePage}
                                style = {{textAlign: 'center', marginTop: '20px'}}
                                />
                    </TabPane>
                    <TabPane tab="支部排名" key="zhibu">
                    支部： <Input
                                                 value={this.state.zhibuRanking}
                                                    style={{ width: 200,marginBottom:20,marginRight:20}}
                                                     onChange ={this.zhibucheng }
                                                     placeholder={"请输入支部名称"}
                                                     />
                            <div style= {{float: "right"}}>
                                        <Button size="default" type="primary" onClick={()=>{this.empty(4)}} style= {{marginRight: "10px"}}>清空</Button>
                                        <Button size="default" type="primary" onClick={this.zhibusousuo} style= {{marginRight: "10px"}}>查询</Button>
                                        <Button size="default" type="primary" onClick={this.zhibuExport} style= {{marginRight: "10px"}}>导出</Button>
                            </div>
                    <Table 
                                columns = {columns7}
                                className = {styles.orderTable}
                                dataSource = {zhibuList}
                                pagination={false}
                                footer={() => {
                                    return (
                                        <Table
                                            showHeader={false} // table 的 columns 头部隐藏
                                            columns={columngeren}
                                            dataSource={gerenList2}
                                            bordered
                                            pagination={false}
                                            className = {styles.orderTable2}
                                        />
                                    )
                            }}
                            />
                            <Pagination
                                current = {this.props.pageCount   !=""?this.props.pageCount:1}
                                pageSize = {10}
                                total = {this.props.allCount!=""?this.props.allCount:1}
                                onChange = {this.zhibuChangePage}
                                style = {{textAlign: 'center', marginTop: '20px'}}
                                />
                            
                    </TabPane>
                    
                    </Tabs>
                            
                    </TabPane>
                    
                </Tabs>
          </TabPane>
          <TabPane tab="宣传组织" key="xuanchaunzuzhi">
                    思想文化宣传队名称： <Input
                                            value={this.state.inputvalue8}
                                            style={{ width: 200,marginBottom:20,marginRight:20}}
                                            onChange ={this.xczzXuanChuanDui }
                                            placeholder={"部门"}
                                            />
                    提交时间：  <DatePicker onChange = {this.xczzChangeDate} 
                                            style = {{width:200, marginRight:10}}
                                            value={this.state.inputvalue9 == '' ? null : moment(this.state.inputvalue9, dateFormat)}
                                            />
                                    <div style= {{float: "right"}}>
                                        <Button size="default" type="primary" onClick={()=>{this.empty(5)}} style= {{marginRight: "10px"}}>清空</Button>
                                        <Button size="default" type="primary" onClick={this.xczzsousuo} style= {{marginRight: "10px"}}>查询</Button>
                                        <Button size="default" type="primary" onClick={this.xczznewAdd} style= {{marginRight: "10px"}}>新增</Button>
                                    </div>
                                <Table 
                                    columns = {columns2}
                                    className = {styles.orderTable}
                                    dataSource = {xczzList}
                                    pagination={false}
                                />
                                <Pagination
                                    current = {this.props.pageCurrent!=""?this.props.pageCurrent:1}
                                    pageSize = {10}
                                    total = {this.props.allCount!=""?this.props.allCount:1}
                                    onChange = {this.xczzChangePage}
                                    style = {{textAlign: 'center', marginTop: '20px'}}
                                />
                  
          </TabPane>
          <TabPane tab="稿件复核" key="gaojianfuhe">
          稿件名称： <Input
                        value={this.state.inputvalue10}
                        style={{ width: 200,marginBottom:20,marginRight:20}}
                        onChange ={this.gjfhXuanChuanName }
                        placeholder={"部门"}
                        />
        提交时间：  <DatePicker onChange = {this.gjfhChangeDate} 
                        style = {{width:200, marginRight:10}}
                        value={this.state.inputvalue11 == '' ? null : moment(this.state.inputvalue11, dateFormat)}
                        />
                    <div style= {{float: "right"}}>
                        <Button size="default" type="primary" onClick={()=>{this.empty(6)}} style= {{marginRight: "10px"}}>清空</Button>
                        <Button size="default" type="primary" onClick={this.gjfhsousuo} style= {{marginRight: "10px"}}>查询</Button>
                        <Button size="default" type="primary" onClick={this.gjfhnewAdd} style= {{marginRight: "10px"}}>新增</Button>
                    </div>
          <Table 
                    columns = {columns3}
                    className = {styles.orderTable}
                    dataSource = {gjfhList}
                    pagination={false}
                />
                <Pagination
                    current = {this.props.pageCurrent   !=""?this.props.pageCurrent:1}
                    pageSize = {10}
                    total = {this.props.allCount!=""?this.props.allCount:1}
                    onChange = {this.gjfhchangePage}
                    style = {{textAlign: 'center', marginTop: '20px'}}
                    />
                  
          </TabPane>
          <TabPane tab="加分项" key="jiafenxiang">
          <Tabs 
                    defaultActiveKey={"jiafenxiang"}
                    onTabClick={(e)=>this.callback4(e)}
                    >
                    <TabPane tab="加分项申请" key="jiafenxiang">
                    申请部门： <Input
                                value={this.state.inputvalue12}
                                style={{ width: 200,marginBottom:20,marginRight:20,marginTop:20}}
                                onChange ={this.jfxcheng }
                                placeholder={"申请部门"}
                                />
                        <div style= {{float: "right"}}>
                            <Button size="default" type="primary" onClick={()=>{this.empty(7)}} style= {{marginRight: "10px"}}>清空</Button>
                            <Button size="default" type="primary" onClick={this.jfxsousuo} style= {{marginRight: "10px"}}>查询</Button>
                            <Button size="default" type="primary" onClick={this.jfxAdd} style= {{marginRight: "10px"}}>新增</Button>
                        </div>
                    <Table 
                                columns = {columns8}
                                className = {styles.orderTable}
                                dataSource = {jfxList}
                                pagination={false}
                            />
                    <Pagination
                                current = {this.props.pageCurrent   !=""?this.props.pageCurrent:1}
                                pageSize = {10}
                                total = {this.props.allCount!=""?this.props.allCount:1}
                                onChange = {this.jiafenxiangChangePage}
                                style = {{textAlign: 'center', marginTop: '20px'}}
                                />
                    </TabPane>
                    <TabPane tab="积分修改" key="jifenxiugai">
                    选择事项：<Select 
                                value={this.state.inputvalue14}
                                onChange={this.onChangeShixiang}
								style={{ minWidth: "200px", maxWidth: 940,marginRight:20 }}
								placeholder = "请选择"
								>
								<Option  value={"0"}>个人</Option>
                                <Option  value={"1"}>单位</Option>
                                <Option  value={"2"}>稿件</Option>
							</Select>
                            {this.state.inputvalue14==0?
                            "工号："
                            :(this.state.inputvalue14==1?
                                "单位名称："
                                :(this.state.inputvalue14==2?"稿件名称：":"工号："))}
                             <Input
                                value={this.state.inputvalue15}
                                style={{ width: 200,marginBottom:20,marginRight:20}}
                                    onChange ={this.jfcheng }
                                    placeholder={"工号"}
                                    />
                         
                    
                            <div style= {{float: "right"}}>
                                        <Button size="default" type="primary" onClick={()=>{this.empty(8)}} style= {{marginRight: "10px"}}>清空</Button>
                                        <Button size="default" type="primary" onClick={this.jfsousuo} style= {{marginRight: "10px"}}>查询</Button>
                            </div>
                    <Table 
                                columns = {
                                    this.state.inputvalue14==0?
                                    columns9:(this.state.inputvalue14==1?columns99:(
                                        this.state.inputvalue14==2? columns999:columns9
                                    ))
                                }
                                className = {styles.orderTable}
                                dataSource = {jfList}
                                pagination={false}
                            />  
                            <Pagination
                                current = {this.props.pageCurrent   !=""?this.props.pageCurrent:1}
                                pageSize = {10}
                                total = {this.props.allCount!=""?this.props.allCount:1}
                                onChange = {this.jiFenChangePage}
                                style = {{textAlign: 'center', marginTop: '20px'}}
                                />
                    </TabPane>
                    </Tabs>
          </TabPane>
        
        </Tabs>
      </div>

    )
  }
}
function mapStateToProps (state) {

  return {
    loading: state.loading.models.statisticalReport,
    ...state.statisticalReport
  };
}
export default connect(mapStateToProps)(statisticalReport);
