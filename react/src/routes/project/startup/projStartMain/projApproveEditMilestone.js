/**
 * 作者：邓广晖
 * 创建日期：2018-02-28
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：实现项目启动里面已立项的里程碑修改
 */
import React from 'react';
import {Table, Input, Spin, Tooltip, Modal, Icon, Button, Upload, message, Popover} from 'antd';
import styles from './projStartMain.less';
import {getuuid} from '../../projConst.js';
import MileStoneEdit from './mileStoneModule/mileStoneEdit';
import MileStoneAdd from './mileStoneModule/mileStoneAdd';
import DeliverableCategory from './mileStoneModule/deliverableCategory';
import config from '../../../../utils/config';
import Cookie from 'js-cookie';

const dateFormat = 'YYYY-MM-DD';
const {TextArea} = Input;
const {confirm} = Modal;

/**
 * 作者：邓广晖
 * 创建日期：2018-02-22
 * 功能：实现项目启动已立项的里程碑
 */
class ProjApproveEditMilestone extends React.PureComponent {

  state = {
    mileEditModalVisible: false, /*里程碑编辑的模态框可见状态*/
    /*mileInfo：点击 编辑 按钮时，缓存当前里程碑基本信息*/
    mileInfo: {
      mile_name: '',
      plan_begin_time: '',
      plan_end_time: '',
      plan_workload: '',
      index: 0
    },
    mileAddModalVisible: false, /*里程碑添加的模态框可见状态*/

    uploadFile: {
      name: 'filename',
      multiple: false,
      showUploadList: false,
      action: '/filemanage/fileupload',
      data: {
        argappname: 'projectFile',
        argtenantid: Cookie.get('tenantid'),
        arguserid: Cookie.get('userid'),
        argyear: new Date().getFullYear(),
        argmonth: new Date().getMonth() + 1,
        argday: new Date().getDate()
      },
      beforeUpload: (file) => {
        this.setState({
          isUploadingFile: true
        });
        //判断新增加的文件名是否重名(一个里程碑中的文件不能重名),需要出去类型为delete的
        //let fileList = this.props.mileInfoList[this.state.mileIndex].deliverables[this.state.deliverableIndex].files;
        let deliverables = this.props.mileInfoList[this.state.mileIndex].deliverables;
        if (deliverables.length > 0) {
          for (let i = 0; i < deliverables.length; i++) {
            let fileList = deliverables[i].files;
            for (let j = 0; j < fileList.length; j++) {
              if (fileList[j].opt_type !== 'delete') {
                if (file.name === fileList[j].pmdf_file_name) {
                  message.error(config.FILE_NAME_IS_REPEAT);
                  this.setState({
                    isUploadingFile: false
                  });
                  return false;
                }
              }
            }
          }
        }
        /*if(fileList.length > 0){
          for(let i = 0; i< fileList.length; i++){
            if(fileList[i].opt_type !== 'delete'){
              if(file.name === fileList[i].file_name){
                message.error(config.FILE_NAME_IS_REPEAT);
                this.setState({
                  isUploadingFile:false
                });
                return false;
              }
            }
          }
        }*/
      },
      onChange: (info) => {
        const status = info.file.status;
        let fileList = this.props.mileInfoList[this.state.mileIndex].deliverables[this.state.deliverableIndex].files;
        let objFile = {};
        if (status === 'done') {
          if (info.file.response.RetCode === '1') {
            objFile.pmdf_file_name = info.file.response.filename.OriginalFileName;
            objFile.pmdf_file_byname = info.file.response.filename.OriginalFileName.split('.')[0];
            objFile.opt_type = 'insert';       //新添加的文件  标志位insert
            objFile.pmdf_id = getuuid(32, 62);      //att_id，32位随机数
            //objFile.pmdf_pmdid = getuuid(32,62);   //文件绑定交付物的id，32位随机数
            objFile.key = fileList.length;     //新添加的文件的key从之前列表的长度开始
            objFile.pmdf_file_path = info.file.response.filename.RelativePath;
            objFile.pmdf_file_url = info.file.response.filename.AbsolutePath;
            const {dispatch} = this.props;
            dispatch({
              type: 'projStartMainPage/addDeliverableFile',
              mileIndex: this.state.mileIndex,
              deliverableIndex: this.state.deliverableIndex,
              objFile: objFile
            });
            this.setState({
              isUploadingFile: false
            });
            return true;
          } else if (status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
            this.setState({
              isUploadingFile: false
            });
            return false;
          }
        }
      }
    },
    currentFileByName: '',
    reasonVisible: false,
    reasonValue: '', /*修改原因*/
    isUploadingFile: false, /*是否正在上传文件*/
    mileIndex: 0, /*上传文件时，里程碑的索引值*/
    deliverableIndex: 0, /*上传文件时，交付物的索引值*/

    currentMileDeliverList: [], /*点击交付物类别时，缓存当前里程碑存在的交付物类别的名称*/
    selectedDeliCategory: [], /*勾选弹出的交付物类别时，缓存勾选的类别的id*/
    clickDeliveryMileIndex: 0, /*点击 交付物类别 时，当前里程碑的索引值*/
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-02-28
   * 功能：改变里程碑页面的显示，查看页面（view）和编辑页面（edit）
   * @param pageToType 想要切换成的页面
   */
  changeMilestoneShow = (pageToType) => {
    this.props.dispatch({
      type: 'projStartMainPage/changeMilestoneShow',
      pageToType: pageToType
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-02-28
   * 功能：里程碑编辑页面，点击返回时判断有无数据变化
   */
  goBackView = () => {
    //判断是否有变化的数据
    const {array_milestone, array_milestone_del, array_mile_del_file} = this.getMileChangeData();
    if (array_milestone.length === 0 && array_milestone_del.length === 0 && array_mile_del_file.length === 0) {
      this.changeMilestoneShow('view');
    } else {
      let thisMe = this;
      confirm({
        title: config.CONTENT_CHANGE,
        onOk() {
          thisMe.changeMilestoneShow('view');
        },
        onCancel() {
        },
      });
    }
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-01
   * 功能：模态框显示
   * @param type 模态框类型
   */
  showModal = (type) => {
    this.setState({[type]: true})
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-01
   * 功能：点击 编辑 按钮时，缓存当前里程碑基本信息
   * @param record 表格的一条记录
   */
  setCurrentMileInfo = (record) => {
    this.setState({
      mileInfo: {
        mile_name: record.mile_name,
        plan_begin_time: record.plan_begin_time,
        plan_end_time: record.plan_end_time,
        plan_workload: record.plan_workload,
        index: record.key
      },
      mileEditModalVisible: true
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-01
   * 功能：删除里程碑
   * @param record 表格的一条记录
   */
  deleteMilestone = (record) => {
    //删除时，可能需要有限制
    this.props.dispatch({
      type: 'projStartMainPage/deleteMilestone',
      index: record.key
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-01
   * 功能：编辑里程碑模态框关闭
   * @param flag 关闭模态框时的标志，为confirm，cancel
   */
  hideMileEditModal = (flag) => {
    if (flag === 'confirm') {
      this.refs.mileStoneEdit.validateFields((err, values) => {
        if (err) {
          return;
        } else {
          const {dispatch} = this.props;
          dispatch({
            type: 'projStartMainPage/editMilestone',
            values: values,
            index: this.state.mileInfo.index
          });
          this.setState({mileEditModalVisible: false});
        }
      });
    } else {
      this.setState({mileEditModalVisible: false});
    }
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-01
   * 功能：添加里程碑模态框关闭
   * @param flag 关闭模态框时的标志，为confirm，cancel
   */
  hideMileAddModal = (flag) => {
    if (flag === 'confirm') {
      this.refs.mileStoneAdd.validateFields((err, values) => {
        if (err) {
          return;
        } else {
          const {dispatch} = this.props;
          const plan_begin_time = values.plan_begin_time.format(dateFormat);
          const plan_end_time = values.plan_end_time.format(dateFormat);
          let mileParams = {
            mile_name: values.mile_name,
            plan_begin_time: plan_begin_time,
            plan_end_time: plan_end_time,
            plan_workload: Number(values.plan_workload)
          };
          dispatch({
            type: 'projStartMainPage/addMilestone',
            data: mileParams,
          });
          this.setState({mileAddModalVisible: false});
        }
      });
    } else {
      this.setState({mileAddModalVisible: false});
    }
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-02
   * 功能：文件别名修改时缓存修改前名称
   * @param e 输入事件
   */
  setPreFileByName = (e) => {
    this.setState({
      currentFileByName: e.target.value
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-02
   * 功能：文件别名重名或者为空时，变成之前名称
   * @param e 输入事件
   * @param mileIndex 里程碑索引值
   * @param deliverableIndex 交付物索引值
   * @param fileIndex 文件索引值
   */
  setAfterFileByName = (e, mileIndex, deliverableIndex, fileIndex) => {
    //let fileList = this.props.mileInfoList[mileIndex].deliverables[deliverableIndex].files;
    const {dispatch} = this.props;
    if (e.target.value === '') {
      dispatch({
        type: 'projStartMainPage/editDeliverableFile',
        mileIndex: mileIndex,
        deliverableIndex: deliverableIndex,
        fileIndex: fileIndex,
        text: this.state.currentFileByName
      });
      e.target.value = this.state.currentFileByName;
      message.error('文件别名不能为空，恢复为之前名称');
    } else {
      //判断文件别名是否重复
      let fileByNameIsRepeat = false;
      let deliverables = this.props.mileInfoList[this.state.mileIndex].deliverables;
      if (deliverables.length > 0) {
        for (let i = 0; i < deliverables.length; i++) {
          let fileList = deliverables[i].files;
          for (let j = 0; j < fileList.length; j++) {
            //用于对比的文件列表 应该 排除当前 编辑时的文件
            if (deliverableIndex === i && j === fileIndex) {
              continue;
            }
            //编辑文件别名时，文件别名不能与在列表里的文件别名一样，列表文件需要过滤 opt_type为delete的
            if (fileList[j].opt_type !== 'delete') {
              if (fileList[j].pmdf_file_byname === e.target.value) {
                fileByNameIsRepeat = true;
                break;
              }
            }
          }
        }
      }
      //如果文件别名没有重复，进行编辑确认
      if (fileByNameIsRepeat === false) {
        dispatch({
          type: 'projStartMainPage/editDeliverableFile',
          mileIndex: mileIndex,
          deliverableIndex: deliverableIndex,
          fileIndex: fileIndex,
          text: e.target.value
        });
      } else {
        //如果文件别名重复，恢复之前名字
        dispatch({
          type: 'projStartMainPage/editDeliverableFile',
          mileIndex: mileIndex,
          deliverableIndex: deliverableIndex,
          fileIndex: fileIndex,
          text: this.state.currentFileByName
        });
        e.target.value = this.state.currentFileByName;
        message.error('文件别名不能重复，恢复为之前名称');
      }
    }
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-02
   * 功能：限制文件别名长度
   * @param e 输入事件
   */
  judgeFileNameLength = (e) => {
    if (e.target.value.length > 200) {
      message.error('文件别名不能大于200字');
      e.target.value = e.target.value.substring(0, 200);
    }
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-02
   * 功能：删除交付物文件
   * @param mileIndex 里程碑索引值
   * @param deliverableIndex 交付物索引值
   * @param fileIndex 文件索引值
   */
  deleteDeliverableFile = (mileIndex, deliverableIndex, fileIndex) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'projStartMainPage/deleteDeliverableFile',
      mileIndex: mileIndex,
      deliverableIndex: deliverableIndex,
      fileIndex: fileIndex
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-02
   * 功能：上传交付物文件时，设置当前里程碑和交付物的索引值
   * @param mileIndex 里程碑索引值
   * @param deliverableIndex 交付物索引值
   */
  setMileAndDeliverableIndex = (mileIndex, deliverableIndex) => {
    this.setState({
      mileIndex: mileIndex, /*上传文件时，里程碑的索引值*/
      deliverableIndex: deliverableIndex, /*上传文件时，交付物的索引值*/
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-05
   * 功能：删除交付物
   * @param mileIndex 里程碑索引值
   * @param deliverableIndex 交付物索引值
   */
  deleteMileDeliverable = (mileIndex, deliverableIndex) => {
    this.props.dispatch({
      type: 'projStartMainPage/deleteMileDeliverable',
      mileIndex: mileIndex,
      deliverableIndex: deliverableIndex,
    });
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-02
   * 功能：添加交付物模态框关闭
   * @param flag 关闭模态框时的标志，为confirm，cancel
   */
  hideDeliverableAddModal = (flag) => {
    if (flag === 'confirm') {
      let {selectedDeliCategory, newAddDeliverable} = this.refs.deliverableCategory.state;
      //当有勾选操作时，确定按钮才起作用，即使这时候添加的类别，如果没有勾选，添加的类别添加不进去
      if (selectedDeliCategory.length) {
        this.props.dispatch({
          type: 'projStartMainPage/addMilestoneDeliverable',
          selectedDeliCategory: selectedDeliCategory,
          newAddDeliverable: newAddDeliverable,
          mileIndex: this.state.clickDeliveryMileIndex,
        });
      }
    }
    this.setState({deliverableAddModalVisible: false})
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-05
   * 功能：点击添加交付类别时，将当前已经有的类别过滤，设置为不可选
   * @param deliverables 点击交付类别时，当前已经存在的交付物列表
   * @param mileIndex 点击交付类别时，当前里程碑索引值
   */
  clickAddDeliverableCategory = (deliverables, mileIndex) => {
    let currentMileDeliverList = [];
    for (let i = 0; i < deliverables.length; i++) {
      currentMileDeliverList.push(deliverables[i].del_name);
    }
    this.setState({
      currentMileDeliverList: currentMileDeliverList,
      clickDeliveryMileIndex: mileIndex,
      deliverableAddModalVisible: true
    })
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-06
   * 功能：提交里程碑数据
   */
  submitMilestone = () => {
    //显示修改原因之前，需要判断剩余工作量是否为0 ，是否有变化的数据
    //判断剩余工作量是否为0
    const {remainWorkLoad} = this.props;
    if (Number(Number(remainWorkLoad).toFixed(2)) !== 0) {
      message.error('剩余工作量必须为0');
      return 1;
    }
    //判断是否有变化的数据
    const {array_milestone, array_milestone_del, array_mile_del_file} = this.getMileChangeData();
    if (array_milestone.length === 0 && array_milestone_del.length === 0 && array_mile_del_file.length === 0) {
      message.error(config.CONTENT_NOT_CHANGE_NO_SUBMIT);
      return 1;
    }
    this.showModal('reasonVisible');
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-01-22
   * 功能：隐藏修改原因模态框
   * @param flag 关闭模态的标志
   */
  hideReasonModal = (flag) => {
    if (flag === 'confirm') {
      if (this.state.reasonValue.trim() === '') {
        message.error(config.MODIFY_REASON_EMPTY);
      } else {
        this.props.dispatch({
          type: 'projStartMainPage/submitMilestone',
          object_milestone: this.getMileChangeData(),
          reasonValue: this.state.reasonValue.trim()
        });
      }
    }
    this.setState({
      reasonVisible: false,
      reasonValue: ''
    })
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-03-05
   * 功能：获取里程碑中变化的数据
   */
  getMileChangeData = () => {
    const {mileInfoList, mileInfoListOriginal, deliverableCategoryList} = this.props;
    let object_milestone = {};
    let array_milestone = [], array_milestone_del = [], array_mile_del_file = [], array_del = [];
    //处理里程碑数据，包括里程碑，交付物，文件
    for (let i = 0; i < mileInfoList.length; i++) {
      //处理里程碑数据
      if (mileInfoList[i].opt_type !== 'search') {
        let obj = {};
        obj.proj_id = this.props.queryData.proj_id;
        obj.mile_uid = mileInfoList[i].mile_uid;
        if (mileInfoList[i].opt_type === 'insert') {
          obj.flag = 'insert';
          obj.mile_name = mileInfoList[i].mile_name;
          obj.plan_begin_time = mileInfoList[i].plan_begin_time;
          obj.plan_end_time = mileInfoList[i].plan_end_time;
          obj.plan_workload = mileInfoList[i].plan_workload.toString();
          obj.progress = (mileInfoList[i].plan_workload / this.props.fore_workload * 100).toFixed(2);
        } else if (mileInfoList[i].opt_type === 'update') {
          //经过model里面的判断，如果为update类型，则至少有一个值发生变化
          //所以此处传的值不会传空字段
          obj.flag = 'update';
          //如果里程碑名称改变了，传值
          if (mileInfoList[i].mile_name !== mileInfoListOriginal[i].mile_name) {
            obj.mile_name = mileInfoList[i].mile_name;
          }
          //如果里程碑计划开始时间改变了，传值
          if (mileInfoList[i].plan_begin_time !== mileInfoListOriginal[i].plan_begin_time) {
            obj.plan_begin_time = mileInfoList[i].plan_begin_time;
          }
          //如果里程碑计划结束时间改变了，传值
          if (mileInfoList[i].plan_end_time !== mileInfoListOriginal[i].plan_end_time) {
            obj.plan_end_time = mileInfoList[i].plan_end_time;
          }
          //如果里程碑计划工作量改变了，传值
          //这里使用Number的原因是，mileStoneList里面存的数字是字符串型的，
          // 当为分别为 ‘4.0’ 和‘4’时，使用字符串认为是不等的,其实是相等的
          if (Number(mileInfoList[i].plan_workload) !== Number(mileInfoListOriginal[i].plan_workload)) {
            obj.plan_workload = mileInfoList[i].plan_workload.toString();
            obj.progress = (mileInfoList[i].plan_workload / this.props.fore_workload * 100).toFixed(2);
          }
        } else if (mileInfoList[i].opt_type === 'delete') {
          obj.flag = 'delete';
          obj.mile_name = mileInfoList[i].mile_name;
        }
        array_milestone.push(obj);
      }

      //处理交付物数据
      let deliverables = mileInfoList[i].deliverables;
      if(deliverables.length > 0){
        for (let j = 0; j < deliverables.length; j++) {
          //处理交付物数据
          if (deliverables[j].opt_type !== 'search') {
            let deliveryObj = {};
            deliveryObj.proj_id = this.props.queryData.proj_id;
            deliveryObj.pmd_id = deliverables[j].pmd_id;
            deliveryObj.pmd_delid = deliverables[j].pmd_delid;
            deliveryObj.del_name = deliverables[j].del_name;
            deliveryObj.flag = deliverables[j].opt_type;          //操作类型，只有insert 和 delete
            deliveryObj.mile_name = mileInfoList[i].mile_name;
            deliveryObj.pmd_mileid = mileInfoList[i].mile_uid;
            array_milestone_del.push(deliveryObj);
          }

          //处理文件数据
          let files = deliverables[j].files;
          for (let k = 0; k < files.length; k++) {
            if (files[k].opt_type !== 'search') {
              let fileObj = {};
              fileObj.proj_id = this.props.queryData.proj_id;          //项目id
              fileObj.pmdf_id = files[k].pmdf_id;                      //交付物文件id
              fileObj.pmdf_file_name = files[k].pmdf_file_name;        //文件名
              fileObj.pmdf_pmdid = deliverables[j].pmd_id;             //文件绑定交付物的id
              fileObj.mile_uid = mileInfoList[i].mile_uid;             //里程碑uid
              fileObj.mile_name = mileInfoList[i].mile_name;           //里程碑名称
              fileObj.del_id = deliverables[j].pmd_delid;              //交付物id
              fileObj.del_name = deliverables[j].del_name;             //交付物名称
              if (files[k].opt_type === 'insert') {
                fileObj.flag = 'insert';
                fileObj.pmdf_file_byname = files[k].pmdf_file_byname;
                fileObj.pmdf_file_url = files[k].pmdf_file_url;        //绝对路径
                fileObj.pmdf_file_path = files[k].pmdf_file_path;      //相对路径
              } else if (files[k].opt_type === 'update') {
                fileObj.flag = 'update';
                fileObj.pmdf_file_byname = files[k].pmdf_file_byname;
              } else if (files[k].opt_type === 'delete') {
                fileObj.flag = 'delete';
              }
              array_mile_del_file.push(fileObj);
            }
          }
        }
      }
    }

    //处理新增加的交付物可选择类别
    for (let i = 0; i < deliverableCategoryList.length; i++) {
      if ('opt_type' in deliverableCategoryList[i] && deliverableCategoryList[i].opt_type === 'insert') {
        array_del.push({
          flag: 'insert',
          del_id: deliverableCategoryList[i].del_id,
          del_name: deliverableCategoryList[i].del_name,
        });
      }
    }

    //将数据组合在一起
    //arg_object_milestone={"array_milestone":[],"array_del":[],"array_milestone_del":[],"array_mile_del_file":[]}
    object_milestone.array_milestone = array_milestone;
    object_milestone.array_milestone_del = array_milestone_del;
    object_milestone.array_mile_del_file = array_mile_del_file;
    object_milestone.array_del = array_del;
    return object_milestone;
  };

  /**
   * 作者：邓广晖
   * 创建日期：2018-01-22
   * 功能：设置输入型框的值
   * @param e 输入事件
   * @param inputType 输入的类型
   */
  setInputValue = (e, inputType) => {
    this.state[inputType] = e.target.value;
  };


  columns = [
    {
      title: '序号',
      dataIndex: '',
      width: '5%',
      render: (text, record, index) => {
        return (<div>{index + 1}</div>)
      }
    }, {
      title: '里程碑名称',
      dataIndex: 'mile_name',
      width: '37%',
      render: (text, record, index) => {
        return <div style={{textAlign: 'left'}}>{text}</div>
      }
    }, {
      title: '开始时间',
      dataIndex: 'plan_begin_time',
      width: '10%'
    }, {
      title: '结束时间',
      dataIndex: 'plan_end_time',
      width: '10%'
    }, {
      title: '计划工作量（人月）',
      dataIndex: 'plan_workload',
      width: '15%',
      render: (text, record, index) => {
        return <div>{Number(text).toFixed(1)}</div>
      }
    }, {
      title: '进度',
      dataIndex: 'mile_month_progress',
      width: '10%',
      render: (text, record, index) => {
        return <div>{text + '%'}</div>
      }
    }, {
      title: '操作',
      dataIndex: '',
      width: '16%',
      render: (text, record, index) => {
        let mileEditContent = '';   //canEdit = '0'时的情况
        if (record.canEdit === '1') {
          //判断里程碑里面有无文件
          let deliverables = record.deliverables;
          let mileHaveFiles = false;
          if (deliverables.length > 0) {
            for (let i = 0; i < deliverables.length; i++) {
              if (deliverables[i].files.filter(item => item.opt_type !== 'delete').length > 0) {
                mileHaveFiles = true;
                break;
              }
            }
          }
          if (mileHaveFiles === true) {
            mileEditContent = (
              <span>
                <Tooltip title='删除所有文件才能编辑里程碑'>
                  <span className={styles.fileCannotOperateStyle}>{'编辑'}</span>
                </Tooltip>
                &nbsp;&nbsp;
                <Tooltip title='删除所有文件才能删除里程碑'>
                  <span className={styles.fileCannotOperateStyle}>{'删除'}</span>
                </Tooltip>
              </span>
            );
          } else {
            mileEditContent = (
              <span>
                <a className={styles.fileOperateStyle}
                 onClick={() => this.setCurrentMileInfo(record)}
                >{'编辑'}
                </a>
                &nbsp;&nbsp;
                <a className={styles.fileOperateStyle}
                   onClick={() => this.deleteMilestone(record)}
                >{'删除'}
                </a>
              </span>
            );
          }
        } else if (record.canEdit === '2' || record.canEdit === '3') {
          mileEditContent = (
            <span>
              <a className={styles.fileOperateStyle}
                 onClick={() => this.setCurrentMileInfo(record)}
              >{'编辑'}
              </a>
              &nbsp;&nbsp;
              <a className={styles.fileOperateStyle}
                 onClick={() => this.deleteMilestone(record)}
              >{'删除'}
              </a>
            </span>
          );
        }
        return mileEditContent;
      }
    }
  ];

  render() {
    const expandedRowRender = (outerRecord) => {
      let deliverablesList = [];
      let deliverables = outerRecord.deliverables.filter(item => item.opt_type !== 'delete');
      for (let i = 0; i < deliverables.length; i++) {
        let files = deliverables[i].files;
        let fileTableData = [];
        for (let j = 0; j < files.length; j++) {
          fileTableData.push(files[j]);
        }
        //过滤掉文件类型为 delete的文件，不显示
        fileTableData = fileTableData.filter(item => item.opt_type !== 'delete');
        let fileColumns = [
          {
            title: '文件名',
            dataIndex: 'pmdf_file_name',
            width: '40%',
            render: (text, record, index) => {
              return (
                <div style={{textAlign: 'left', paddingLeft: 20}}>{(index + 1).toString() + '.' + text}</div>
              )
            }
          },
          {
            title: '文件别名',
            dataIndex: 'pmdf_file_byname',
            width: '40%',
            render: (text, record, index) => {
              return (
                <div>
                  <Input
                    defaultValue={text}
                    onFocus={e => this.setPreFileByName(e)}
                    onBlur={e => this.setAfterFileByName(e, outerRecord.key, deliverables[i].key, record.key)}
                    onChange={this.judgeFileNameLength}
                  />
                </div>
              )
            }
          },
          {
            title: '操作',
            dataIndex: '',
            width: '20%',
            render: (text, record, index) => {
              return (
                <div style={{textAlign: 'left'}}>
                  <a className={styles.fileOperateStyle} href={record.pmdf_file_path}>{'下载'}</a>
                  &nbsp;&nbsp;
                  <a className={styles.fileOperateStyle}
                     onClick={() => this.deleteDeliverableFile(outerRecord.key, deliverables[i].key, record.key)}
                  >
                    {'删除'}
                  </a>
                  &nbsp;&nbsp;
                  {record.opt_type === 'insert' ?
                    null
                    :
                    <Popover
                      content={
                        <div>
                          <div style={{marginBottom: 10}}>
                            <div className={styles.popStyle}>{'审核人'}</div>
                            <div style={{display: 'inline-block'}}>{record.pmdf_check_username}</div>
                          </div>
                          <div style={{marginBottom: 10}}>
                            <div className={styles.popStyle}>{'审核时间'}</div>
                            <div style={{display: 'inline-block'}}>{record.pmdf_check_time}</div>
                          </div>
                          <div style={{marginBottom: 10}}>
                            <div className={styles.popStyle}>{'上传人'}</div>
                            <div style={{display: 'inline-block'}}>{record.pmdf_create_username}</div>
                          </div>
                          <div style={{marginBottom: 10}}>
                            <div className={styles.popStyle}>{'上传时间'}</div>
                            <div style={{display: 'inline-block'}}>{record.pmdf_create_time}</div>
                          </div>
                        </div>
                      }
                    >
                      <span className={styles.fileOperateStyle} style={{color: '#00a2ff'}}>{'详细'}</span>
                    </Popover>
                  }
                </div>
              )
            }
          }
        ];
        deliverablesList.push(
          <div key={deliverables[i].key}>
            <div className={styles.deliverableStyle}>
              {deliverables[i].del_name}
              <Upload {...this.state.uploadFile}>
                <Tooltip title={'上传文件'}>
                  <Icon type='upload'
                        style={{marginLeft: 15, color: '#00a2ff', cursor: 'pointer'}}
                        onClick={() => this.setMileAndDeliverableIndex(outerRecord.key, deliverables[i].key)}
                  />
                </Tooltip>
              </Upload>
              {fileTableData.length ?
                <Tooltip title={'删除文件才能删除交付物'}>
                  <Icon type='delete'
                        style={{marginLeft: 15, color: 'grey', cursor: 'pointer'}}
                  />
                </Tooltip>
                :
                <Tooltip title={'删除交付物'}>
                  <Icon type='delete'
                        style={{marginLeft: 15, color: '#00a2ff', cursor: 'pointer'}}
                        onClick={() => this.deleteMileDeliverable(outerRecord.key, deliverables[i].key)}
                  />
                </Tooltip>
              }
            </div>
            {fileTableData.length ?
              <Table
                columns={fileColumns}
                dataSource={fileTableData}
                pagination={false}
                showHeader={false}
                className={styles.fileTable}
              />
              :
              <div style={{color: '#949393'}}>该交付物无文件数据</div>
            }
          </div>
        );
      }
      return (
        <div>
          <div style={{textAlign: 'left', color: '#00a2ff'}}>
            <span style={{cursor: 'pointer'}}
                  onClick={() => this.clickAddDeliverableCategory(deliverables, outerRecord.key)}
            >交付物类别
            </span>
          </div>
          {deliverablesList.length ?
            <div>
              {deliverablesList}
            </div>
            :
            <div style={{color: '#949393'}}>该里程碑无交付物数据</div>
          }

        </div>
      );
    };

    return (
      <div>
        {/*<Spin tip={config.IS_LOADING} spinning={this.props.historyTableLoad}>

      </Spin>*/}
        <div>
          <div style={{textAlign: 'right'}}>
            <Button type='primary' onClick={this.submitMilestone}>{'提交'}</Button>
            &nbsp;&nbsp;
            <Button type='primary' onClick={this.goBackView}>{'返回'}</Button>
          </div>
        </div>
        <div style={{textAlign: 'center', fontSize: '20px', marginBottom: 10}}>
          <span>总共工作量</span>
          <span style={{color: 'red'}}>{this.props.fore_workload}</span>
          <span>人月</span>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span>待分配工作量</span>
          <span style={{color: 'red'}}>{Number(this.props.remainWorkLoad).toFixed(1)}</span>
          <span>人月</span>
        </div>
        {/*剩余工作量为0或者小于0时，不让添加*/}
        {Number(Number(this.props.remainWorkLoad).toFixed(1)) <= 0 || this.props.remainWorkLoad === undefined ?
          null
          :
          <Tooltip
            title={'添加里程碑'}
          >
            <Icon
              type='plus'
              className={styles.addMilestone}
              onClick={() => this.showModal('mileAddModalVisible')}
            />
          </Tooltip>
        }
        <Table columns={this.columns}
               dataSource={this.props.mileInfoList.filter(item => item.opt_type !== 'delete')}
               className={styles.mileStoneTable}
               pagination={false} //分页器，配置项参考 pagination，设为 false 时不展示和进行分页
               defaultExpandAllRows={false}
               expandedRowRender={expandedRowRender}
        />
        {/*编辑里程碑时的模态框*/}
        <Modal visible={this.state.mileEditModalVisible}
               key={getuuid(20, 62)}
               width={640}
               title={'编辑里程碑'}
               onOk={() => this.hideMileEditModal('confirm')}
               onCancel={() => this.hideMileEditModal('cancel')}
        >
          <MileStoneEdit
            ref="mileStoneEdit"
            mile_name={this.state.mileInfo.mile_name}
            plan_begin_time={this.state.mileInfo.plan_begin_time}
            plan_end_time={this.state.mileInfo.plan_end_time}
            plan_workload={this.state.mileInfo.plan_workload}
            index={this.state.mileInfo.index}
            begin_time={this.props.begin_time}
            end_time={this.props.end_time}
            fore_workload={this.props.fore_workload}
            remainWorkLoad={this.props.remainWorkLoad}
            mileStoneList={this.props.mileInfoList}
          />
        </Modal>

        {/*添加里程碑时的模态框*/}
        <Modal visible={this.state.mileAddModalVisible}
               key={getuuid(20, 62)}
               width={640}
               title={'添加里程碑'}
               onOk={() => this.hideMileAddModal('confirm')}
               onCancel={() => this.hideMileAddModal('cancel')}
        >
          <MileStoneAdd
            ref="mileStoneAdd"
            begin_time={this.props.begin_time}
            end_time={this.props.end_time}
            fore_workload={this.props.fore_workload}
            remainWorkLoad={this.props.remainWorkLoad}
            mileStoneList={this.props.mileInfoList}
          />
        </Modal>

        {/*添加交付物类别时的模态框*/}
        <Modal visible={this.state.deliverableAddModalVisible}
               key={getuuid(20, 62)}
               width={700}
               title={'交付物类别'}
               onOk={() => this.hideDeliverableAddModal('confirm')}
               onCancel={() => this.hideDeliverableAddModal('cancel')}
        >
          <DeliverableCategory
            ref='deliverableCategory'
            deliverableCategoryList={this.props.deliverableCategoryList}
            currentMileDeliverList={this.state.currentMileDeliverList}
            dispatch={this.props.dispatch}
          />
        </Modal>

        {/*修改原因模态框*/}
        <Modal visible={this.state.reasonVisible}
               key={getuuid(20, 62)}
               title={config.MODIFY_REASON}
               onOk={() => this.hideReasonModal('confirm')}
               onCancel={() => this.hideReasonModal('cancel')}
        >
          <div>
            <div>
              <div style={{color: 'red', display: 'inline-block', verticalAlign: 'top', marginRight: 5}}>{"*"}</div>
              <div style={{display: 'inline-block', width: '97%'}}>
                <TextArea rows={4} onChange={(e) => this.setInputValue(e, 'reasonValue')}/>
              </div>
            </div>
            {this.props.fullCostEditFlag === '3' ?
              <div>
                <span style={{color: 'red'}}>{this.props.fullCostEditVal}</span>
              </div>
              :
              null
            }

          </div>
        </Modal>
      </div>
    );
  }
}

export default ProjApproveEditMilestone;
