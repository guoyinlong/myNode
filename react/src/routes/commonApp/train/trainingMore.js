/**
 * 作者：陈红华
 * 创建日期：2017-07-31
 * 邮箱：1045825949@qq.com
 * 文件说明：门户首页培训资料页面
**/
import { connect } from 'dva';
import {Row, Col , Button ,Icon,Modal,TreeSelect ,Input,Breadcrumb,Select,message } from 'antd';
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
import {Link} from 'dva/router';
const Search = Input.Search;
import TrainingSrcTable from '../../../components/commonApp/trainingSrc.js';
import GoBack from '../../../components/commonApp/goback.js';
import styles from '../pageContainer.css';
import Cookie from 'js-cookie';
import moment from 'moment';
import {tUploadFile_roleid,argtenantid,getFileSize} from '../../../components/commonApp/commonAppConst.js';
import { routerRedux } from 'dva/router';



function showseeopeartion (text, record,index,that) {
    var isVisiable = (record.uploader_id == Cookie.get('staff_id'));
    return <div style={{textAlign:"center",}}>
      <div style = {{float:'left'}}><Button type="primary" onClick={()=>that.trainLoad(record.key-1,record)}> 下载</Button></div>
      <div style = {{float:'left',marginLeft:5}}><Button type="primary" className={isVisiable?styles['trainingMoreUploadShow']:styles['trainingMoreUploadHide']}
        onClick={()=>that.trainEdit(index,record)}> 编辑</Button></div>
      <div style = {{float:'left',marginLeft:5}}><Button type="primary" className={isVisiable?styles['trainingMoreUploadShow']:styles['trainingMoreUploadHide']}
        onClick={()=>that.showConfirm(index,record)}> 删除</Button></div>
    </div>
}
function showsFileName (text, record,index,that) {
    return <div>
        {record.file_name}.{record.postfix}
    </div>
}

class TrainingMore extends React.Component {
  state={
    editModalVisible:false,
    searchText: '',
    filtered: false,
    typeValue:'', //更新分类的时候的新的typeid
    typeValueName:'', //typename
    newFileName:'',
  }
  // 编辑模态框关闭
  hideEditModel=(flag,fileid,filename,typeid)=>{
    const {dispatch}=this.props;
    if(flag=='confirm'){
      //更改文件名称/文档分类
      if(filename == null || filename == undefined || filename == ''){
        message.info("文档分类新名称不能为空");
        return;
      }
      dispatch({
        type:'trainingMore/changeFileNameType',
        arg_file_id: fileid,
        arg_file_name: filename,
        arg_type_id: typeid,
      })
    }
    // dispatch(routerRedux.push({
    //   pathname:'/trainingMore'
    // }));
    this.setState({editModalVisible:false})

  }
  // 点击上传资料按钮
  goTrainUpload=()=>{
    const {dispatch}=this.props;
    dispatch(routerRedux.push({
      pathname:'/trainUpload'
    }));
  }
  // 点击编辑文档类型按钮
  godocType=()=>{
    const {dispatch}=this.props;
    dispatch(routerRedux.push({
      pathname:'/docType'
    }));
  }
  // 批量下载
  fileLoadLot = () => {
    const{fileList,dispatch}=this.props;
    var selectedRowKeys=this.refs.trainSelect.getData();
    for(var i=0;i<selectedRowKeys.length;i++){
      dispatch({
        type:'trainingMore/filedownload',
        arg_file_id:fileList[selectedRowKeys[i]-1].id
      })
    }
    var RelativePathPost=[];
    for(var i=0;i<selectedRowKeys.length;i++){
      RelativePathPost.push(fileList[selectedRowKeys[i]-1].file_path)
    }
    window.location.href="/filemanage/filedownload?RelativePath="+RelativePathPost.join(';;;')
  }
  // 点击下载按钮
  trainLoad=(i,record)=>{
    const {fileList,dispatch}=this.props;
    dispatch({
      type:'trainingMore/filedownload',
      arg_file_id:record.id
    })
    window.open(fileList[i]['file_path'],'_blank')
  }
  // 点击编辑按钮
  trainEdit=(i,record)=>{
    // alert(JSON.stringify(record))
    var {dispatch}=this.props;
    this.setState({
      editModalVisible: true,
      newFileName: record.file_name,
      typeValueName: record.file_type,
    })
    // dispatch({
    //   type:'trainingMore/saveFileContent',
    //   DataRows: record,
    // })
    //调用查询文件
    dispatch({
      type:'trainingMore/searchByFIleId',
      arg_file_id: record.id,
    })
  }
  // 点击删除按钮
  showConfirm=(i,record)=>{
    var {dispatch}=this.props;
    Modal.confirm({
      title: '您确定要删除此文档?',
      onOk() {
        //调用删除文档服务
        dispatch({
          type:'trainingMore/deleteByFIleId',
          arg_file_id: record.id,
        })

      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  // 资料搜素
  searchTrain=(val)=>{
    var {dispatch}=this.props;
    dispatch({
      type:'trainingMore/fileQuery',
      arg_ou_id:Cookie.get('OUID'),
      arg_file_name:val,
      flag:1,
    });
  }

  componentWillMount(){
    const {dispatch} =this.props;
    // 培训基地
    dispatch({
      type:'trainingMore/fileQuery',
      // formData:{transjsonarray: JSON.stringify({
      //     // "condition":{"file_type_id":'6'},
      //     "condition":{"arg_ou_id":Cookie.get('OUID')},
      //     // "sequence":[{
      //     //   "file_upload_date":'1',
      //     // }]
      //   })
      // },
      flag:'0',
      title:''
    });
    dispatch({
      type:'trainingMore/getUsersByRoleId',
      arg_staff_id: Cookie.get('staff_id')
      // formData:{
      //   arg_roleid:tUploadFile_roleid
      // }
    })
  }

  onInputChange = (e) => {
     this.setState({ searchText: e.target.value });
   }
  handleChange = (value) => {
   this.setState({
     typeValue:value
   })
 }
  handleChange2 = (value) => {
   this.setState({
     newFileName:value.target.value,
   })
 }

  render(){
    const {fileList,loading,fileContent,isAdmin,docTypelist}=this.props;

    var visibleUpload=false;
    var tempfileType = [];
    if(docTypelist != undefined){
      for(let i = 0; i < docTypelist.length; i++){
        tempfileType.push(
          {
            text: docTypelist[i].name,
            value: docTypelist[i].name,
          }
        )
      }
    }
    // console.log(tempfileType)
    visibleUpload = isAdmin;
    window.sessionStorage['trainRole']=visibleUpload?'1':'0';//1=>上传者权限 0=>普通用户角色；
    const columns = [{
        title: '序号',dataIndex: 'key',
        sorter: (a, b) => a.key - b.key,
      }, {
        title: '文件名称',
        // dataIndex: 'file_name',
        sorter: (a, b) => a.file_name.length  - b.file_name.length ,
        render: (text, record, index) =>showsFileName (text, record, index,this),
          // filterDropdown: (
          //   <div className={styles['custom-filter-dropdown'] }>
          //     <Input
          //       ref={ele => this.searchInput = ele}
          //       placeholder="输入文件名称"
          //       value={this.state.searchText}
          //       onChange={this.onInputChange}
          //       onPressEnter={this.searchTrain(this.state.searchText)}
          //     />
          //     <Button type="primary" onClick={this.searchTrain(this.state.searchText)}>查询</Button>
          //   </div>
          // ),
          // filterIcon: <Icon type="smile-o" style={{ color: this.state.filtered ? '#108ee9' : '#aaa' }} />,
          // filterDropdownVisible: this.state.filterDropdownVisible,
          // onFilterDropdownVisibleChange: (visible) => {
          //   this.setState({
          //     filterDropdownVisible: visible,
          //   }, () => this.searchInput.focus());
          // },


      },{
        title: '文档类型',dataIndex: 'file_type',
        sorter: (a, b) => a.file_type.length  - b.file_type.length ,
        filters:tempfileType,
        onFilter: (value, record) => record.file_type.includes(value),
      }, {
        title: '上传时间',dataIndex: 'file_upload_date',
        sorter: (a, b) =>new Date(a.file_upload_date).getTime() - new Date(b.file_upload_date).getTime(),
      }, {
        title: '文件大小',dataIndex: 'fileSize',
        sorter: (a, b) => a.file_size - b.file_size,
      },{
        title: '下载量',dataIndex: 'file_hints',
        sorter: (a, b) => a.file_hints - b.file_hints,
      },{
        title: '操作',dataIndex: 'file_handle',
        render: (text, record, index) =>showseeopeartion (text, record, index,this),
      }
    ];

    for (let i = 0; i < fileList.length; i++) {
      fileList[i].fileSize=getFileSize(fileList[i].file_size);
      fileList[i]['key']=i+1;
      // fileList[i].file_handle=<Button type="primary" onClick={()=>this.trainLoad(i)}>
      //                          下载
      //                         </Button>
    }
    var modelTypeOption = () =>{
      // alert(JSON.stringify(docTypelist))
      var res = [];
      if(docTypelist != undefined){
        for(let i = 0; i < docTypelist.length; i++){
          res.push(
            <Select.Option key ={i} value={docTypelist[i].type_id}>{docTypelist[i].name}</Select.Option>
          )
        }
      }
      return res;
    }


    return(
      <div className={styles['pageContainer']}>
        <Breadcrumb separator=">">
          <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item>常用资料</Breadcrumb.Item>
        </Breadcrumb>
        <h2 style={{textAlign:'center'}}>常用资料</h2>
        <Button type="primary" style={{float:'right',marginLeft:'10px'}} onClick={this.goTrainUpload}
        className={visibleUpload?styles['trainingMoreUploadShow']:styles['trainingMoreUploadHide']}>上传资料</Button>
        <Button type="primary" style={{float:'right',marginLeft:'10px'}} onClick={this.godocType}
        className={visibleUpload?styles['trainingMoreUploadShow']:styles['trainingMoreUploadHide']}>编辑文档类型</Button>
        <Search
          placeholder="请输入资料名字"
          style={{ width: 200 ,float:'right'}}
          onSearch={(value)=>this.searchTrain(value)}
        />

        <TrainingSrcTable columns={columns} loading={loading} listInfo={fileList} fileLoadLot={this.fileLoadLot} ref='trainSelect'/>

        <Modal visible={this.state.editModalVisible} width='700px' height = '600px'  title="编辑文档分类" onCancel={()=>this.hideEditModel('cancel')}
            footer={[<Button key="back" size="large" onClick={()=>this.hideEditModel('cancel')}>关闭</Button>,
            <Button key="submit" type="primary" size="large"
            onClick={()=>this.hideEditModel('confirm',(fileContent.length == 0? '': fileContent[0].id),this.state.newFileName,this.state.typeValue)}>确定</Button>]}
          >
          <div>

            <div style={{paddingBottom:'20px'}}>
              <div style = {{float:'left'}}> 原名称：</div>
              <div style = {{color:'#ef5555',marginLeft: 50,width:500,float:'left'}}>
                <Input   disabled value = {fileContent.length == 0? '': fileContent[0].file_name}/>
              </div>
              <div style = {{marginLeft:10}}>.{fileContent.length == 0? 'docx': fileContent[0].postfix}</div>
            </div>

            <div style={{paddingBottom:'20px'}}>
              <div style = {{float:'left'}}> 新名称：</div>
              <div style = {{color:'#ef5555',marginLeft: 50,width:500,float:'left'}}>
                <Input  value = {this.state.newFileName} onChange={this.handleChange2}/>
              </div>
              <div style = {{marginLeft:10}}>.{fileContent.length == 0? 'docx': fileContent[0].postfix}</div>
            </div>

            <br/>
            <div  style={{paddingBottom:'20px'}}>{fileContent.length == 0? '默认文件名': fileContent[0].file_name}.{fileContent.length == 0? 'docx': fileContent[0].postfix}</div>

            <div style = {{float:'left',paddingBottom:'20px'}}>
              新分类：
            </div>
            <Select defaultValue = {this.state.typeValueName}  style = {{width:250,marginLeft:50}} onChange = {this.handleChange}>
              {modelTypeOption()}
            </Select>

          </div>
        </Modal>

        <GoBack/>
      </div>
    )
  }
}
function mapStateToProps (state) {
  const {fileList,fileContent,docTypelist,isAdmin}=state.trainingMore;
  return {
    fileList,
    loading: state.loading.models.commonApp,
    fileContent,
    docTypelist,//文档分类
    isAdmin
  };
}
export default connect(mapStateToProps)(TrainingMore);
