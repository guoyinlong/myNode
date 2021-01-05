/**
 * 作者：陈红华
 * 创建日期：2017-07-31
 * 邮箱：1045825949@qq.com
 * 文件说明：门户首页培训资料页面
**/
import { connect } from 'dva';
import {Row, Col , Button ,Icon,Modal,TreeSelect ,Input,Breadcrumb } from 'antd';
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

class TrainingMore extends React.Component {

  // 点击上传资料按钮
  goTrainUpload=()=>{
    const {dispatch}=this.props;
    dispatch(routerRedux.push({
      pathname:'/trainUpload'
    }));
  }
  // 批量下载
  fileLoadLot = () => {
    const{fileList}=this.props;
    var selectedRowKeys=this.refs.trainSelect.getData();
    var RelativePathPost=[];
    for(var i=0;i<selectedRowKeys.length;i++){
      RelativePathPost.push(fileList[selectedRowKeys[i]-1].file_path)
    }
    window.location.href="/filemanage/filedownload?RelativePath="+RelativePathPost.join(';;;')
  }
  // 点击下载按钮
  trainLoad=(i)=>{
    const {fileList}=this.props;
    const {dispatch}=this.props;
    dispatch({
      type:'trainingMore/fileLoadNum',
      formData:{
        postData:{
          transjsonarray:JSON.stringify([
              {
                update:{"file_hints":(parseInt(fileList[i].file_hints)+1).toString()},
                condition:{"file_code":fileList[i].file_code}
              }
          ])
        },
        file_upload_date:'1',
        file_type_id:'6'
      }
    })
    window.open(fileList[i]['file_path'],'_blank')
  }
  // 资料搜素
  searchTrain=(val)=>{
    var {dispatch}=this.props;
    dispatch({
      type:'trainingMore/fileQuery',
      formData:{transjsonarray: JSON.stringify({
          "condition":{"file_type_id":'6'},
          "sequence":[{
            "file_upload_date":'1',
          }]
        })
      },
      flag:'1',
      title:val
    });
  }

  componentWillMount(){
    const {dispatch} =this.props;
    // 培训基地
    dispatch({
      type:'trainingMore/fileQuery',
      formData:{transjsonarray: JSON.stringify({
          "condition":{"file_type_id":'6'},
          "sequence":[{
            "file_upload_date":'1',
          }]
        })
      },
      flag:'0',
      title:''
    });
    dispatch({
      type:'trainingMore/getUsersByRoleId',
      formData:{
        arg_roleid:tUploadFile_roleid
      }
    })
  }

  render(){
    const {fileList,loading,usersHasPermissionId}=this.props;
    var visibleUpload=false;
    for(var i=0;i<usersHasPermissionId.length;i++){
      if(Cookie.get('userid')==usersHasPermissionId[i].staff_id){
        visibleUpload=true;
      }
    }
    window.sessionStorage['trainRole']=visibleUpload?'1':'0';//1=>上传者权限 0=>普通用户角色；
    const columns = [{
        title: '序号',dataIndex: 'key',
        sorter: (a, b) => a.key - b.key,
      }, {
        title: '文件名称',dataIndex: 'file_name',
        sorter: (a, b) => a.file_name.length  - b.file_name.length ,
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
        title: '操作',dataIndex: 'file_handle'
      }
    ];

    for (let i = 0; i < fileList.length; i++) {
      fileList[i].fileSize=getFileSize(fileList[i].file_size);
      fileList[i]['key']=i+1;
      fileList[i].file_handle=<Button type="primary" onClick={()=>this.trainLoad(i)}>
                               下载
                              </Button>
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

        <Search
          placeholder="请输入资料名字"
          style={{ width: 300 ,float:'right'}}
          onSearch={(value)=>this.searchTrain(value)}
        />

        <TrainingSrcTable columns={columns} loading={loading} listInfo={fileList} fileLoadLot={this.fileLoadLot} ref='trainSelect'/>
        <GoBack/>
      </div>
    )
  }
}
function mapStateToProps (state) {
  const {fileList,usersHasPermissionId}=state.trainingMore;
  return {
    fileList,
    loading: state.loading.models.commonApp,
    usersHasPermissionId
  };
}
export default connect(mapStateToProps)(TrainingMore);
