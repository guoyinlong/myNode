/**
 * 文件说明：后台管理员页面
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-09-25
 */
import { connect } from 'dva';
import Style from '../../../components/employer/employer.less'
import styles from '../../../components/common/table.less'
import {Button,Upload,Table,Popconfirm,Spin} from 'antd'
import message from '../../../components/commonApp/message'
import * as service from '../../../services/employer/empservices';

// let year = new Date().getFullYear().toString();
// let season =Math.floor((new Date().getMonth() + 2) / 3).toString();
// if(season == 0){
//   year = (new Date().getFullYear() - 1).toString();
//   season = '4';
// }//这里时间改成后台获取
/**
 * 功能：后台管理员操作
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2017-09-25
 */
class employerAdmin extends React.Component {
  constructor(props){
  super(props)

  }

  state={
    search_loading:false,
     xls:""
  }

componentDidMount(){
  this.pollingSearch()
}

componentWillUnmount(){
  if(this.timer!=null){
    window.clearInterval(this.timer)
    this.timer=null
   }
}

  /**
   *
   * @param year
   */
  startAnnual = (year) => (e) => {
    const {dispatch}=this.props;
    dispatch({
      type:'setting/annualStart',
      year:year
    })
  }

  /**
   *生成匿名账号
   * @param year
   */
  startMutualEval = () => {
    const {dispatch,year}=this.props;
    dispatch({
      type:'setting/mutualEvalStart',
      year:year,
      evalsys_type:"0"
    })
  }
  /**
   * 功能：生产匿名账号
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-12-21
   */
  startLeaderEval = () => {
    const {dispatch,year}=this.props;
    dispatch({
      type:'setting/mutualEvalStart',
      year:year,
      evalsys_type:'1'
    })
  }
  /**
   * 功能：计算年度员工互评成绩
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-12-21
   */
  empResultCompute=(item)=>(e)=>{

    const {dispatch}=this.props;
    dispatch({
      type:'setting/empResultCompute',
      year:item.year,
      result_type:'0'
    })
  }
  /**
   * 功能：计算年度员工互评成绩
   * 作者：陈莲
   * 邮箱：chenl192@chinaunicom.cn
   * 创建日期：2017-12-21
   */
  leaderResultCompute=(item)=>(e)=>{

    const {dispatch}=this.props;
    dispatch({
      type:'setting/leaderResultCompute',
      year:item.year
    })
  }
  columns = [
    {
      title: '编号',
      dataIndex: 'key',
      render: (text) => {
        return text + 1;
      }
    },
    {
      title: '年度',
      dataIndex: 'year'
    },
    {
      title: '年度考核人数',
      dataIndex: 'sum',
      width: '40%'
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: (text,row,index) => {
        return row.sum ? <div style={{color:'#FF7F24'}}>已开启</div>: '未开启';
      }
    },
    {
      title: '操作',
      render: (text, row, index) => {
        return <div>
          {!row.state?
            <Popconfirm title="确认开启年度考核？" onConfirm={ this.startAnnual(row.year)} okText="确定" cancelText="取消">
              <Button type="default">开启</Button>
            </Popconfirm>
            :null}
          {row.state == 7?
            <Popconfirm title="确认重启年度考核？" onConfirm={ this.startAnnual(row.year)} okText="确定" cancelText="取消">
              <Button type="default">重启</Button>
            </Popconfirm>
            :null}
        </div>
      }
    }
  ];

  mutualEvalColumns = [
    {
      title: '编号',
      dataIndex: 'key',
      render: (text) => {
        return text + 1;
      }
    },
    {
      title: '年度',
      dataIndex: 'year'
    },
    {
      title: '员工互评匿名账号数',
      dataIndex: 'counts',
      width: '20%'
    },
    {
      title: '计算成绩人数',
      dataIndex: 'res_counts',
      width: '20%'
    },
    {
      title: '状态',
      render: (text,row,index) => {
        return row.counts ? (row.res_counts ?  <div style={{color:'green'}}>已结束</div> :<div style={{color:'#FF7F24'}}>已开启</div>): '未开启';
      }
    },
    {
      title: '操作',
      render: (text,row,index) => {
        return <div>
          {row.res_counts ? null:
            <Popconfirm title="确认计算本年度员工互评成绩吗？" onConfirm={this.empResultCompute(row)}  okText="确定" cancelText="取消">
              <Button type="primary">计算员工互评成绩</Button>
            </Popconfirm>}

        </div>
      }
    }
  ];

  leaderMutualEvalColumns = [
    {
      title: '编号',
      dataIndex: 'key',
      render: (text) => {
        return text + 1;
      }
    },
    {
      title: '年度',
      dataIndex: 'year'
    },
    {
      title: '中层三度评价匿名账号数',
      dataIndex: 'counts',
      width: '20%'
    },
    {
      title: '计算成绩人数',
      dataIndex: 'res_counts',
      width: '20%'
    },
    {
      title: '状态',
      render: (text,row,index) => {
        return row.counts ? (row.res_counts ?  <div style={{color:'green'}}>已结束</div> :<div style={{color:'#FF7F24'}}>已开启</div>): '未开启';
      }
    },
    {
      title: '操作',
      render: (text,row,index) => {
        return <div>
          {row.res_counts ? null:
            <Popconfirm title="确认关闭中层互评吗？" onConfirm={this.leaderResultCompute(row)}  okText="确定" cancelText="取消">
              <Button type="primary">关 闭</Button>
            </Popconfirm>}

        </div>
      }
    }
  ];

  PresidentColumns = [
    {
      title: '编号',
      dataIndex: 'key',
      render: (text) => {
        return text + 1;
      }
    },
    {
      title: '年度',
      dataIndex: 'year'
    },
    {
      title: '副总架构师考核人数',
      dataIndex: 'sum',
      width: '40%'
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: (text,row,index) => {
        return row.sum ? <div style={{color:'#FF7F24'}}>已开启</div>: '未开启';
      }
    },
    {
      title: '操作',
      render: (text, row, index) => {
        return <div>
          {!row.state?
            <Popconfirm title="确认开启年度考核？" onConfirm={ this.startAnnual(row.year)} okText="确定" cancelText="取消">
              <Button type="default">开启</Button>
            </Popconfirm>
            :null}
          {row.state == 7?
            <Popconfirm title="确认重启年度考核？" onConfirm={ this.startAnnual(row.year)} okText="确定" cancelText="取消">
              <Button type="default">重启</Button>
            </Popconfirm>
            :null}
        </div>
      }
    }
  ];

  timer=null
  //xls="/filemanage/upload/UploadFileDao/UploadFileDao/UploadFileDao/UploadFileDao/UploadFileDao/UploadFileDao/8fe185ecd4924a0a9036658052822787/工时导入反馈20201125153836.xls"

  pollingSearch=async(tip)=>{
   if(this.timer!=null){
    window.clearInterval(this.timer)
    this.timer=null
   }
   if(!this.props.year){//初始化加载的时候
    this.timer=window.setInterval(this.pollingSearch, 500)
    return
   }
  // console.log("是否进入轮询")
    let data= await service.hourssyncresquery({
      arg_year:this.props.year,
      arg_season:this.props.season
    })

    // data.flag=1
    // data.RetVal="请求成功！"
    // console.log("data",data)
    if(data.RetCode=="1"){
      if(data.flag=="0"){
      if(data.RetVal!=""&&data.RetVal!=null){
          message.info(data.RetVal);
        }
        this.setState({search_loading:false,xls:data.DataRows.path||""})
        return
      }
       if(data.flag=="1"){//flag为1开始10s发一次请求
        this.setState({search_loading:true,xls:data.DataRows.path||""})
        this.timer=window.setInterval(this.pollingSearch, 10000)
      }
  }

   
  }

    hourssync=async()=>{
      let data= await service.hourssync({
        arg_year:this.props.year,
        arg_season:this.props.season
      })

      try{
        if(data.RetCode=='2'||data.RetCode=='1'){
          if(data.RetVal!=""&&data.RetVal!=null){
            message.info(data.RetVal);
          }
        }
      }
      catch(e){
      }
    }

    requestRace=()=>{
    this.hourssync()
    this.pollingSearch()
    }


  render() {
    const {annualList,mutualEvalList,leaderEvalList,loading} = this.props;
    let {search_loading,xls}=this.state
    let arr=xls.split("/")
    let str=arr[arr.length-1]
    const importTime={
      /*action: "/filemanage/fileupload?argappname=examine&argtenantid=10010&arguserid=0860640&argyear=2017" +
      "&argmonth=8&argday=12",*/
      action: "/microservice/allexamine/examine/hourssync?arg_year="+this.props.year+"&arg_season="+this.props.season,
      //action:"/microservice/allexamine/examine/timeout",
      method: "POST",
      name: "outsourcer",
      multiple: false,
      showUploadList: false,
      listType: 'text',
      accept: '.xlsx,.xls',
      onChange:(info)=> {
        //console.log(111111111111)
        // if (info.file.status === 'done') {
        //   if (info.file.response.RetCode == '1') {
        //     message.success(`${info.file.name} 工时分数导入成功！`);
        //   } 
        //   // else if (info.file.status === 'error') {
        //   //   message.error(`${info.file.name} 导入失败！.`);
        //   // }
        // }
        
      }
    }

    const importTFS={
      action: "/microservice/allexamine/examine/tfsandhoursimport?arg_year="+this.props.year+"&arg_season="+this.props.season+"&arg_flag=0",
      method: "POST",
      name: "outsourcer",
      multiple: false,
      showUploadList: false,
      listType: 'text',
      accept: '.xlsx,.xls',
      onChange:(info)=> {
        if (info.file.status === 'done') {
          if (info.file.response.RetCode == '1') {
            message.success(`${info.file.name} TFS分数导入成功！`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 导入失败！.`);
          }
        }
      }
    }

    return (
      <div className={Style.wrap}>
        <p style={{fontSize:'large'}}>工时分数同步</p>
        <div style={{marginTop:'10px'}}>
          {/* <Upload {...importTime} style={{marginRight:'30px'}}> */}
          <Button disabled={search_loading} onClick={this.requestRace}>同步工时分数&nbsp;&nbsp;<Spin size="small" spinning={search_loading}></Spin></Button>
          {/* </Upload> */}
          {/* <Button onClick={this.throttle(this.test)}>按钮</Button> */}
          &nbsp;&nbsp;<span onClick={()=>window.open(xls)}><a>{xls?'文件下载    :  '+str:""}</a></span>
          {/* <Upload {...importTFS}><Button>导入TFS分数</Button></Upload> */}
        </div>

        {/* <p style={{fontSize:'large',marginTop:'50px'}}>员工互评</p>
        <Popconfirm title="确定生产本年度员工互评匿名账号吗？" style={{"float":"right","marginRight":'20px',"marginBottom":'10px'}} onConfirm={this.startMutualEval}  okText="确定" cancelText="取消">
          <Button type="primary" style={{"float":"right","marginRight":'20px',"marginBottom":'10px'}}>生成匿名账号</Button>
        </Popconfirm>
        <div style={{marginTop:'10px',clear: 'both'}}>
          <Table className={styles.orderTable} size='small' bordered={true} columns={this.mutualEvalColumns} dataSource={mutualEvalList}
                 loading={loading} pagination={false}/>
        </div> */}

        <p style={{fontSize:'large',marginTop:'50px'}}>中层互评</p>
        <Popconfirm title="确定生产本年度员工互评匿名账号吗？" style={{"float":"right","marginRight":'20px',"marginBottom":'10px'}} onConfirm={this.startLeaderEval}  okText="确定" cancelText="取消">
          <Button type="primary" style={{"float":"right","marginRight":'20px',"marginBottom":'10px'}}>生成匿名账号</Button>
        </Popconfirm>
        <div style={{marginTop:'10px',clear: 'both'}}>
          <Table className={styles.orderTable} size='small' bordered={true} columns={this.leaderMutualEvalColumns} dataSource={leaderEvalList}
                 loading={loading} pagination={false}/>
        </div>

        <p style={{fontSize:'large',marginTop:'50px'}}>年度考核</p>
        <div style={{marginTop:'10px'}}>
          <Table className={styles.orderTable} size='small' bordered={true} columns={this.columns} dataSource={annualList}
                 loading={loading} pagination={false}/>
        </div>

        {/* <p style={{fontSize:'large',marginTop:'50px'}}>副总架构师考核</p>
        <div style={{marginTop:'10px'}}>
          <Table className={styles.orderTable} size='small' bordered={true} columns={this.PresidentColumns} dataSource={annualList}
                 loading={loading} pagination={false}/>
        </div> */}
      </div>
    )
  }
}
function mapStateToProps(state) {
  const { annualList,mutualEvalList,leaderEvalList,year,season} = state.setting;
  if(annualList && annualList.length){
    annualList.map((i,index)=>i.key=index)
  }
  if(mutualEvalList && mutualEvalList.length){
    mutualEvalList.map((i,index)=>i.key=index)
  }
  if(leaderEvalList && leaderEvalList.length){
    leaderEvalList.map((i,index)=>i.key=index)
  }
  return {
    annualList,
    mutualEvalList,
    leaderEvalList,
    loading: state.loading.models.setting,
    year,
    season
  };
}
export default connect(mapStateToProps)(employerAdmin)
