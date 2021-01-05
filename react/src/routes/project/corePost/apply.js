/**
 * 作者：靳沛鑫
 * 日期：2019-06-12
 * 邮箱：1677401802@qq.com
 * 文件说明：竞聘续聘申请
 */
import React from 'react';
import { connect } from 'dva/index';
import { Link, routerRedux } from 'dva/router';
import {
  Table,
  Tabs,
  Select,
  Icon,
  Upload,
  Button,
  Pagination,
  Row,
  Col,
  DatePicker,
  message,
  Input,
  Modal,
  Popconfirm
} from 'antd';
import styles from './corePosts.less';
import Cookie from "js-cookie";
//import moment from 'moment';

//const Search = Input.Search;
const { TabPane } = Tabs;
const Option = Select.Option;

class Query extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            expand: false,
            visible: false,
            selectedRowKeys: [],
            loading: false,
            corepositionId : ''
        };
    }
  /**
   * 作者：靳沛鑫
   * 日期：2019-06-4
   * 邮箱：1677401802@qq.com
   * 文件说明：上传
   */
    uploads = {
     name: 'file',
     showUploadList: false,
     action: '/filemanage/fileupload',
     data:{
         argappname:'appFileUpdate',
         argtenantid:'10010',
         arguserid:Cookie.get('userid'),
         argyear:new Date().getFullYear(),
         argmonth:new Date().getMonth()+1,
         argday:new Date().getDate()
     }
   };
  /**
   * 作者：靳沛鑫
   * 日期：2019-06-12
   * 邮箱：1677401802@qq.com
   * 文件说明：竞聘信息
   */
    columns = [{
        title: '项目/小组名称',
        className: styles.columnLeft,
        dataIndex: 'projectName',
        width: '15%',
        render: (text, record, index) => {
            return <p>{text}</p>
        }
    },{
        title: '团队系数',
        dataIndex: 'teamCoefficient',
        width: '10%',
        render: (text) => {
          return <p style={{textAlign: 'center'}}>{text}</p>
        }
    },{
        title: '核心岗位',
        dataIndex: 'name',
        width: '10%',
        render: (text) => {
          return <p style={{textAlign: 'center'}}>{text}</p>
        }
    },{
        title:'等级',
        dataIndex:'rank',
        width: '5%',
        render: (text) => {
          return <p style={{textAlign: 'center'}}>
            {
              text == '0' ? '普通' : (text > 1 ? '总监' : '高级')
            }
          </p>
        }
    },{
        title:'目标绩效职级',
        dataIndex:'targetPerformanceRank',
        width: '12%',
        render: (text) => {
          return <p style={{textAlign: 'center'}}>{text}</p>
        }
    },{
        title:'备注',
        dataIndex:'note',
        width: '10%',
    },{
        title:'申请状态',
        dataIndex:'status',
        width: '8%',
        render: (text) => {
          return <p style={{textAlign: 'center'}}>
            {
              text == '0' ? '未提交' : (text > 1 ? '审核通过' : '审核中')
            }
          </p>
        }
    },{
        title:'文件',
        dataIndex:'fileName',
        width: '17%',
        render: (text, record, index) => {
          return <a style={{textAlign: 'center'}} onClick = {() => this.downloadUpload(record)}>{text}</a>
        }
    },{
        title:'操作',
        //dataIndex:'fileUrl',
        width: '10%',
        render: (record)=> {
                return (
                    <div style={{textAlign: 'center'}}>
                        <Upload {...this.uploads} onChange={(info) => this.upDataUrl(info, record.id) }>
                            <Button type='primary' disabled={record.status!='0'} style={{marginLeft: 0}}>{'上传'}</Button>
                        </Upload>
                    </div>
                )
            }
    }];
   downloadUpload = (record) =>{
     let url =record.fileUrl;
     window.open(url);
   };
   /**
    * 作者：靳沛鑫
    * 日期：2019-06-12
    * 邮箱：1677401802@qq.com
    * 文件说明：续聘信息
    */
   columnsCont = [{
     title: '项目/小组名称',
     className: styles.columnLeft,
     dataIndex: 'projectName',
     width: '15%',
     render: (text, record, index) => {
       return <p>{text}</p>
     }
   },{
     title: '团队系数',
     dataIndex: 'teamCoefficient',
     width: '10%',
   },{
     title: '核心岗位',
     dataIndex: 'name',
     width: '10%',
   },{
     title:'等级',
     dataIndex:'rank',
     width: '5%',
     render: (text) => {
       return <p>
         {
           text == '0' ? '普通' : (text > 1 ? '总监' : '高级')
         }
       </p>
     }
   },{
     title:'目标绩效职级',
     dataIndex:'targetPerformanceRank',
     width: '12%',
   },{
      title:'姓名',
      dataIndex:'corepositionUserName',
      width: '6%',
    },{
      title:'人员所属院',
      dataIndex:'affiliatedAcademy',
      width: '9%',
    },{
      title:'申请状态',
      dataIndex:'status',
      width: '10%',
      render: (text) => {
        return <p>
          {
            text == '0' ? '未提交' : (text > 1 ? '审核通过' : '审核中')
          }
        </p>
      }
    },{
      title:'备注',
      dataIndex:'note',
      width: '10%',
    },{
      title:'操作',
      width: '10%',
      render: (record)=> {
        return (
          <div style={{textAlign: 'center'}}>
            <Button type='primary' disabled={record.status!='0'} onClick = {(e)=>this.addPerson(record,e)}>{'添加人'}</Button>
          </div>
        )
      }
    }];

   /**
    * 作者：靳沛鑫
    * 日期：2019-06-13
    * 邮箱：1677401802@qq.com
    * 文件说明：清空和提交
    */
     resetCond = (elem) => {
         const {dispatch} = this.props;
         dispatch({type: 'postsQuery/resetCond',elem});
         this.setState({
           selectedRowKeys : []
         })
    };
    /**
     * 作者：靳沛鑫
     * 日期：2019-06-14
     * 邮箱：1677401802@qq.com
     * 文件说明：提交上传信息
     */
    upDataUrl = (info, elem) => {
      if(info.file.response){
        if (info.file.response.RetCode == '1') {
          const {dispatch} = this.props;
          dispatch({
            type: 'postsQuery/upDataUrl',
            corepositionId: elem,
            name: info.file.name,
            url: info.file.response.file.RelativePath
          });
          message.success(`${info.file.name} 上传成功`);
        } else{
          message.error(`上传失败！`);
        }
      }

    }
    /**
     * 作者：靳沛鑫
     * 日期：2019-06-12
     * 邮箱：1677401802@qq.com
     * 文件说明：保存搜索内容
     */
    saveSelectInfo = (value, typeItem) => {
      const {dispatch} = this.props
      dispatch({
        type: 'postsQuery/saveSelectInfo',
        value: value,
        typeItem: typeItem
      });
    }
   /**
    * 作者：靳沛鑫
    * 日期：2019-06-13
    * 邮箱：1677401802@qq.com
    * 文件说明：添加人模态窗
    */
   addPerson =(record, e) => {
      this.setState({
        visible1: true })
      const {dispatch} = this.props
      dispatch({
        type: 'postsQuery/addPerson',
        record,
     });
   }
   /**
    * 作者：靳沛鑫
    * 日期：2019-06-14
    * 邮箱：1677401802@qq.com
    * 文件说明：查询人员及其所属院
    */
   userAndAcademyNames = (id) =>{
     const {dispatch} = this.props
    dispatch({
      type:'postsQuery/userAndAcademyNames',id
    })
   }
   /**
    * 作者：靳沛鑫
    * 日期：2019-05-29
    * 邮箱：1677401802@qq.com
    * 文件说明：模态窗确定
    */
   addCorePosts = () =>{
     const {dispatch} = this.props
     dispatch({type: 'postsQuery/addCorePosts',
               callback:(res)=>{
                 if(res=='1'){
                   this.setState({
                     visible1:false})
                 }
               }
     });

   }
   /**
    * 作者：靳沛鑫
    * 日期：2019-06-14
    * 邮箱：1677401802@qq.com
    * 文件说明：模态窗取消
    */
   handleCancel1 = () =>{
      this.setState({
       visible1:false,
     })
   };
   //选项卡
   callback=(key)=> {
      const {dispatch} = this.props
      dispatch({
        type: 'postsQuery/coreUpId',
        key
      });
     this.setState({
       selectedRowKeys : []
     })
    }
    render(){
        const { yearList, postsName, postsList, params, postsContList, userNameList } = this.props;
        //年份默认当前年
        const year_list = yearList.map((item, index)=>{
          let items=item.year.toString();
            return (
                <Option value={items} key={index}>{items}</Option>
            )
        });
        //核心岗位名称
        const posts_name = postsName.map((item, index)=>{
          return (
            <Option value={item.value} key={index} title={item.value}>{item.value}</Option>
          )
        });
        //员工名单
        const userName_List = userNameList.map((item, index) => {
            return (
                <Option value={item.username+item.userId} key={index} title={item.username}>{item.username}</Option>
            )
        })
        // 这里为每一条记录添加一个key，从0开始
        if(postsList.length){
            postsList.map((i,index)=>{
                i.key=index;
            })
        }
       if(postsContList.length){
         postsContList.map((i,index)=>{
           i.key=index;
         })
       }

      /**
       * 作者：靳沛鑫
       * 创建日期：2019-06-12
       * 邮箱：1677401802@qq.com
       * 说明：勾选数据
       **/
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows)=>{
              this.setState({
                selectedRowKeys : selectedRowKeys
              })
              const {dispatch} = this.props
              dispatch({
                type: 'postsQuery/saveSelectedInfo',
                selectedRows : selectedRows,
                selectedRowKeys : this.state.selectedRowKeys,
              });
            },
           getCheckboxProps: (record) => ({
              disabled: !(record.status=='0' && (typeof (record.fileId)=='string' || typeof (record.corepositionUserName)=='string'))
            }),
            selectedRowKeys:this.state.selectedRowKeys,
        };

        return (
            <div className={styles.container}>
                <h2 style={{textAlign:'center', fontWeight:'bolder'}}>竞聘续聘申请</h2>
                <Row gutter={20} style={{marginTop:12}}>
                    <Col span={7}>
                        <span className={styles.label}>业务部门：</span>
                        <span className={styles.topText}>{Cookie.get('dept_name')}</span>
                    </Col>
                    <Col span={5}>
                        <span className={styles.label}>年份：</span>
                        <Select
                            showSearch={true}
                            placeholder='2019'
                            value={params.year}
                            className={styles.selectWidth4Year}
                            onChange={(value) => this.saveSelectInfo(value, 'year')}
                        >
                            {year_list}
                        </Select>
                    </Col>
                    <Col span={6}>
                        <span className={styles.label}>核心岗位：</span>
                        <Select
                            showSearch={true}
                            placeholder='全部'
                            value={params.name}
                            className={styles.selectWidth4State}
                            dropdownMatchSelectWidth={false}
                            onChange={(value) => this.saveSelectInfo(value, 'name')}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                          <Option value='' key='0' title='全部'>全部</Option>
                          {posts_name}
                        </Select>
                    </Col>
                    <Col span={6} style={{textAlign:'right'}}>
                        <Button type="primary" style={{marginRight:20}} onClick={()=>this.resetCond(false)}>清空</Button>
                    </Col>
                </Row>
                <Row style={{marginTop:12, marginBottom:12}}>
                    <Col span={7} style={{textAlign:'left'}}>
                        <Popconfirm
                          title={'请问您确认提交么？'}
                          okText="是"
                          cancelText="否"
                          onConfirm={()=>this.resetCond(true)}
                        >
                            <Button type="primary" disabled={params.isenable}>提交</Button>
                        </Popconfirm>

                    </Col>
                </Row>
              <Tabs onChange={this.callback} type="card">
                  <TabPane tab="竞聘申请" key="1">
                      <Table
                        columns={this.columns}
                        dataSource={postsList}
                        pagination={false}
                        rowSelection={rowSelection}
                        bordered={true}
                        className={styles.table}
                      >
                      </Table>
                </TabPane>
                <TabPane tab="续聘申请" key="2">
                      <Table
                        columns={this.columnsCont}
                        dataSource={postsContList}
                        pagination={false}
                        rowSelection={rowSelection}
                        bordered={true}
                        className={styles.table}
                      >
                      </Table>
                </TabPane>
              </Tabs>
              <Modal
                title='添加人信息'
                visible={this.state.visible1}
                onCancel={this.handleCancel1}
                onOk={this.addCorePosts}
                width="700px"
              >
                <Row style={{marginTop:'20px', textAlign:'right', lineHeight:'30px'}}>
                  <Col span={5}><span style={{color:'red'}}>*</span>姓&emsp;&emsp;&emsp;&emsp;&emsp;名：</Col>
                  <Col span={5}>
                    <Select style={{width: 150}} showSearch placeholder={'必选'} value={params.username} onChange={(value)=> this.userAndAcademyNames(value)}>{userName_List}</Select>
                  </Col>
                  <Col span={5}>人&ensp;员&ensp;所&ensp;属&ensp;院：</Col>
                  <Col span={5}>
                    <Input style={{textAlign:'left', width: 195}}placeholder={'选择姓名后生成'} value={params.affiliatedAcademy}/>
                  </Col>
                </Row>
              </Modal>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        loading: state.loading.models.postsQuery,
        ...state.postsQuery
    };
}

export default connect(mapStateToProps)(Query);
