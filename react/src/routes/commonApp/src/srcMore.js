/**
 * 作者：陈红华
 * 创建日期：2017-07-31
 * 邮箱：1045825949@qq.com
 * 文件说明：门户首页常用表单页面
 */
import { connect } from 'dva';
import { Button ,Row, Col ,Input,Table,Breadcrumb} from 'antd';
import {Link} from 'dva/router';
import { routerRedux } from 'dva/router';
const Search = Input.Search;
import GoBack from '../../../components/commonApp/goback.js';
import styles from '../pageContainer.css';
import {getFileSize} from '../../../components/commonApp/commonAppConst.js';

class SrcMore extends React.Component {
  // 点击某一行
  onRowClick=(i)=>{
    const {dispatch} =this.props;
    dispatch(routerRedux.push({
      pathname:i.path
    }));
    // window.open(i.path,'_blank')
  }
  // 表单搜素
  searchSrc=(val)=>{
    const {dispatch}=this.props;
    dispatch({
      type:'srcMore/ResourceQuery',
      formData:{transjsonarray: JSON.stringify({
          "condition":{"file_type_id":'5','file_name':val},
          "sequence":[{
            "file_upload_date":'1',
          }]
        })
      }
    });
  }

  componentWillMount(){
    const {dispatch} =this.props;
    // 常用资料
    dispatch({
      type:'srcMore/ResourceQuery',
      formData:{transjsonarray: JSON.stringify({
          "condition":{"file_type_id":'5'},
          "sequence":[{
            "file_upload_date":'1'
          }]
        })
      }
    });
  }
  render(){
    const columns = [{
      title: '序号',dataIndex: 'key',
      sorter: (a, b) => a.key - b.key,
    }, {
      title: '表单名称',dataIndex: 'file_name',
      sorter: (a, b) => a.file_name.length  - b.file_name.length ,
    }
  ];
    // const {resourceList,loading} = this.props;
    const {loading} = this.props;
    const resourceList=[{'file_name':'vpn申请单','path':'downloadorder'},{'file_name':'请假申请单','path':'downloadleave'}]
    for (let i = 0; i < resourceList.length; i++) {
      resourceList[i].fileSize=getFileSize(resourceList[i].file_size);
      resourceList[i]['key']=i+1;
    }

    return(
      <div className={styles['pageContainer']}>
        <Breadcrumb separator=">">
          <Breadcrumb.Item><Link to='/commonApp'>首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item>常用表单</Breadcrumb.Item>
        </Breadcrumb>
        <h2 style={{textAlign:'center'}}>常用表单</h2>
        <div style={{ marginBottom: 16 }}>
         <span>&nbsp;&nbsp;共有{resourceList.length}条记录</span>
        </div>
        <div className={styles['srcTableRowClassName']}>
          <Table
           columns={columns} loading={loading}
           dataSource={resourceList}
           onRowClick={(i)=>this.onRowClick(i)} />
        </div>

        <GoBack goUrl={'/commonApp'}/>
      </div>
    )
  }
}
function mapStateToProps (state) {
  const {resourceList}=state.srcMore;
  return {
    loading: state.loading.models.commonApp,
    resourceList
  };
}

export default connect(mapStateToProps)(SrcMore);
