/**
 * 作者：陈红华
 * 创建日期：2017-09-13
 * 邮箱：1045825949@qq.com
 * 文件说明：财务全成本erp成本导入
 */
import { connect } from 'dva';
import Cookie from 'js-cookie';
import moment from 'moment';
import { Input,Select,DatePicker,Row,Col,Button,Modal,Table } from 'antd';
const Option = Select.Option;
const { MonthPicker} = DatePicker;
import FileUpload from '../../../../components/commonApp/fileUpdata.js';
import tableStyle from '../../../../components/common/table.less';
import styles from '../feeManager/costmainten.less';
import commonStyle from '../costCommon.css';
import {getOU} from '../costCommon.js';

const IndirectColumns=[{
    title: '单位',
    dataIndex: 'ou',
    key: 'ou',
  },{
    title: '部门',
    dataIndex: 'dept_name',
    key: 'dept_name',
  },{
    title: '项目编码',
    dataIndex: 'proj_code',
    key: 'proj_code',
  },{
    title: '项目名称',
    dataIndex: 'proj_name',
    key: 'proj_name',
    width:'200px'

  }
]
const straightColumns=[{
    title: '科目代码',
    dataIndex: 'fee_code',
    key: 'fee_code',
  },{
    title: '科目描述',
    dataIndex: 'fee_name',
    key: 'fee_name',
  },{
    title: '金额',
    dataIndex: 'fee',
    key: 'fee',
  }
]
class ErpFileupload extends React.Component {
  state={
    OUs:[],
    OU:Cookie.get('OU'),
    month:moment().format("YYYY-MM"),
    IndirectPreviewVisible:false,
    straightPreviewVisible:false
  }
  // 关闭模态框
  onCancel=(tag)=>{
    tag=='0'?this.setState({IndirectPreviewVisible:false}):this.setState({straightPreviewVisible:false})
  }
  // 生成数据
  generatedData=(tag)=>{
    const {dispatch}=this.props;
    var straightUpload=this.refs.straightUpload.getData();
    var indirectUpload=this.refs.indirectUpload.getData();
    dispatch({
      type:tag=='0'?'erpFileupload/straightpersistence':'erpFileupload/addindirect',
      formData:{
        ou:this.state.OU,
        total_year_month:this.state.month,
        xlsfilepath:tag=='0'?straightUpload[0].RelativePath:indirectUpload[0].RelativePath,
        staff_id:Cookie.get('userid'),
        OriginalFileName:tag=='0'?straightUpload[0].OriginalFileName:indirectUpload[0].OriginalFileName,
        RealFileName:tag=='0'?straightUpload[0].RealFileName:indirectUpload[0].RealFileName,
      }
    })
    tag=='0'?this.setState({IndirectPreviewVisible:false}):this.setState({straightPreviewVisible:false})
  }
  // 点击上传预览
  getPreviewData=(tag)=>{
    const {dispatch}=this.props;
    var straightUpload=this.refs.straightUpload.getData();
    var indirectUpload=this.refs.indirectUpload.getData();
    dispatch({
      type:tag=='0'?'erpFileupload/straightPreview':'erpFileupload/IndirectPreview',
      formData:{
        ou:this.state.OU,
        total_year_month:this.state.month,
        xlsfilepath:tag=='0'?straightUpload[0].RelativePath:indirectUpload[0].RelativePath
      },
      previewData:(DataRows)=>{
        if(tag=='0'){
          this.setState({IndirectPreviewVisible:true,IndirectPreview:DataRows})
        }else if(tag=='1'){

          this.setState({straightPreviewVisible:true,straightPreview:DataRows})
        }
      }
    })

  }
  //OU
  OUhandleChange=(value)=>{
    this.setState({
      OU:value
    })
  }
  // 月份
  onChangeDatePicker=(date, dateString)=>{
    this.setState({
      month:dateString
    })
  }
  componentWillMount(){
    var OUData=getOU('/erp_fileupload_mgt');
    OUData.then((data)=>{
      this.setState({
        OUs:data.DataRows,
        // OU:data.DataRows[0].dept_name
      })
    })
  }

  ren=(i)=>{
    return (text, record, index)=>{ return record.fee[i]}
  }
  render(){
    const {IndirectPreview,straightPreview}=this.state;
    if(IndirectPreview){
      for(var i=0;i<IndirectPreview[0].fee_name.length;i++){
        var data={
          title: IndirectPreview[0].fee_name[i],
          render:this.ren(i)
          // render:(i)=>{
          //   return (text,record,index)=>{ return record.fee[i] }
          // }
        };
        IndirectColumns.push(data);
      }
    }
    return(
      <div className={commonStyle.container}>
        <div>
          <span>部门/OU：
            <Select value={this.state.OU} onChange={this.OUhandleChange} style={{minWidth:'180px'}}>
              {this.state.OUs.map((i,index)=><Option key={index} value={i.dept_name}>{i.dept_name}</Option>)}
            </Select>
          </span>
          <span style={{display:'inline-block',marginLeft:'20px'}}>
            月份：
            <MonthPicker onChange={this.onChangeDatePicker} value={moment(this.state.month, 'YYYY-MM')} allowClear={false}/>
          </span>
          <Row>
            <Col xs={24} sm={12} md={12} lg={12} xl={12} style={{padding:'15px 15px 15px 0'}}>
              <div className={commonStyle.erpTitleStyle}>
                <p>直接成本：<a href='/filemanage/download/cos/straight_Export.xls'>直接成本导入模板下载</a></p>
              </div>
              <div className={commonStyle.erpFileuploadStyle}><FileUpload ref='straightUpload' fileStyle={true}/></div>
              <p style={{textAlign:'center'}}><Button type="primary" onClick={()=>this.getPreviewData('0')}>上传</Button></p>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12} style={{padding:'15px 0 15px 15px'}}>
              <div className={commonStyle.erpTitleStyle} >
                <p>间接成本：<a href='/filemanage/download/cos/indirect_Export.xls'>间接成本导入模板下载</a></p>
              </div>
              <div className={commonStyle.erpFileuploadStyle}><FileUpload ref='indirectUpload' fileStyle={true}/></div>
              <p style={{textAlign:'center'}}><Button type="primary" onClick={()=>this.getPreviewData('1')}>上传</Button></p>
            </Col>
          </Row>
        </div>
        <Modal
          title="直接成本预览"
          width='95%'
          style={{top:'5vh',overflow:'scroll'}}
          visible={this.state.IndirectPreviewVisible}
          onCancel={()=>this.onCancel('0')}
          footer={[
            <Button key="back" size="large" onClick={()=>this.onCancel('0')}>返回</Button>,
            <Button key="submit" type="primary" size="large"  onClick={()=>this.generatedData('0')}>生成数据</Button>,
          ]}
        >
          <div className={styles.costmaintenTable+' '+tableStyle.orderTable} style={{height:'70vh',overflow:'scroll'}}>
            <Table columns={IndirectColumns} dataSource={IndirectPreview} pagination={false}/>
          </div>
        </Modal>
        <Modal
          title="间接成本预览"
          width='95%'
          style={{top:'5vh',overflow:'scroll'}}
          visible={this.state.straightPreviewVisible}
          onCancel={()=>this.onCancel('1')}
          footer={[
            <Button key="back" size="large" onClick={()=>this.onCancel('1')}>返回</Button>,
            <Button key="submit" type="primary" size="large"  onClick={()=>this.generatedData('1')}>生成数据</Button>,
          ]}
        >
          <div className={styles.costmaintenTable+' '+tableStyle.orderTable} style={{height:'70vh',overflow:'scroll'}}>
            <Table columns={straightColumns} dataSource={straightPreview} pagination={false}/>
          </div>
        </Modal>
      </div>
    )
  }
}
function mapStateToProps (state) {
  // const {}=state.erpFileupload;
  return {

  };
}

export default connect(mapStateToProps)(ErpFileupload);
