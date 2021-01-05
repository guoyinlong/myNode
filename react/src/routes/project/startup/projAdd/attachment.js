/**
 * 作者：邓广晖
 * 创建日期：2017-10-11
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：实现项目启动的附件功能
 */
import React from 'react';
import {Upload, Button, Icon, message, Table, Input} from 'antd';
import {getUuid} from '../../../../components/commonApp/commonAppConst';
import styles from './attachment.less';
import Cookie from 'js-cookie';
import config from '../../../../utils/config'

/**
 * 作者：邓广晖
 * 创建日期：2017-10-11
 * 功能：附件上传组件
 */
class Attachment extends React.Component {
    state = {
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
                //判断新增加的文件名是否重名,需要出去类型为delete的
                let {attachmentList} = this.props;
                if (attachmentList.length > 0) {
                    for (let i = 0; i < attachmentList.length; i++) {
                        if (attachmentList[i].opt_type !== 'delete') {
                            if (file.name === attachmentList[i].file_name) {
                                message.error(config.FILE_NAME_IS_REPEAT);
                                return false;
                            }
                        }
                    }
                }
            },
            onChange: (info) => {
                const status = info.file.status;
                let objFile = {};
                if (status === 'done') {
                    if (info.file.response.RetCode === '1') {
                        objFile.file_name = info.file.response.filename.OriginalFileName;
                        objFile.file_byname = info.file.response.filename.OriginalFileName.split('.')[0];
                        objFile.opt_type = 'insert';       //新添加的文件  标志位insert
                        objFile.att_id = getUuid(32, 62);  //att_id，32位随机数
                        //objFile.key = this.props.attachmentList.length;  //新添加的文件的key从之前列表的长度开始
                        objFile.file_relativepath = info.file.response.filename.RelativePath;
                        objFile.url = info.file.response.filename.AbsolutePath;
                        const {dispatch} = this.props;
                        dispatch({
                            type: 'projectInfo/addAttachment',
                            attachmentList: this.props.attachmentList,
                            objFile: objFile
                        });
                        return true;
                    } else if (status === 'error') {
                        message.error(`${info.file.name} 上传失败.`);
                        return false;
                    }
                }
            }
        },
        currentFileByName: ''
    }

    columns = [
        {
            title: '序号',
            dataIndex: '',
            width: '4%',
            render: (text, record, index) => {
                return (<span>{index + 1}</span>)
            }
        },
        {
            title: '文件名称',
            dataIndex: 'file_name',
            width: '20%',
        },
        {
            title: '文件别名',
            dataIndex: 'file_byname',
            width: '20%',
            render: (text, record, index) => {
                return (
                    <div>
                        <Input
                            defaultValue={text}
                            onFocus={e => this.setPreFileByName(e)}
                            onBlur={e => this.setAfterFileByName(e, record.key)}
                        />
                    </div>
                )
            }
        },
        {
            title: '操作',
            dataIndex: '',
            width: '10%',
            render: (text, record, index) => {
                return (
                    <span>
                        <a className={styles["book-detail"] + ' ' + styles.bookTag}
                            onClick={() => this.downloadAttachment(record)}>{'下载'}
                        </a>
                        &nbsp;&nbsp;
                        <a className={styles["book-detail"] + ' ' + styles.bookTag}
                           onClick={() => this.deleteAttachment(record.key)}>{'删除'}
                        </a>
                    </span>
                )
            }
        }
    ];

    /**
     * 作者：邓广晖
     * 创建日期：2017-10-11
     * 功能：附件下载功能
     * @param record 一条记录
     */
    downloadAttachment = (record) =>{
        window.open('/filemanage/filedownload?RelativePath=' + record.file_relativepath);
    };

    /**
     * 作者：邓广晖
     * 创建日期：2017-10-11
     * 功能：删除附件功能
     * @param key 附件索引
     */
    deleteAttachment = (key) => {
        const {dispatch} = this.props;
        dispatch({
            type: 'projectInfo/deleteAttachment',
            key: key,
        });
    };

    /**
     * 作者：邓广晖
     * 创建日期：2017-10-11
     * 功能：文件别名修改时缓存修改前名称
     * @param e 输入事件
     */
    setPreFileByName = (e) => {
        this.setState({currentFileByName: e.target.value});
    };

    /**
     * 作者：邓广晖
     * 创建日期：2017-10-11
     * 功能：文件别名重名或者为空时，变成之前名称
     * @param e 输入事件
     */
    setAfterFileByName = (e, key) => {
        const {dispatch} = this.props;
        if (e.target.value === '') {
            dispatch({
                type: 'projectInfo/editAttachment',
                key: key,
                text: this.state.currentFileByName
            });
            e.target.value = this.state.currentFileByName;
            message.error('文件别名不能为空，恢复为之前名称');
        } else {
            //判断文件别名是否重复
            let fileByNameIsRepeat = false;
            if (this.props.attachmentList.length > 0) {
                for (let i = 0; i < this.props.attachmentList.length; i++) {
                    //用于对比的附件列表 应该 排除当前 编辑时的附件
                    //编辑附件别名时，附件别名不能与在列表里的附件别名一样，列表附件需要过滤 opt_type为delete的
                    if (this.props.attachmentList[i].opt_type !== 'delete' && i !== key) {
                        if (this.props.attachmentList[i].file_byname === e.target.value) {
                            fileByNameIsRepeat = true;
                            break;
                        }
                    }
                }
            }
            //如果文件别名没有重复，进行编辑确认
            if (fileByNameIsRepeat === false) {
                dispatch({
                    type: 'projectInfo/editAttachment',
                    key: key,
                    text: e.target.value
                });
            } else {
                //如果文件别名重复，恢复之前名字
                dispatch({
                    type: 'projectInfo/editAttachment',
                    key: key,
                    text: this.state.currentFileByName
                });
                e.target.value = this.state.currentFileByName;
                message.error('文件别名不能重复，恢复为之前名称');
            }
        }
    };

    /**
     * 作者：邓广晖
     * 创建日期：2017-10-11
     * 功能：获取所有附件信息
     */
    getAttachmentiInfo = () => {
        const {attachmentList} = this.props;
        let arg_proj_attachment_json = [];
        if (attachmentList.length) {
            for (let i = 0; i < attachmentList.length; i++) {
                let obj = {};
                switch (attachmentList[i].opt_type) {
                    case 'insert':
                        obj['att_id'] = attachmentList[i].att_id;  //att_id，32位随机数，必传
                        obj['file_byname'] = attachmentList[i].file_byname; //file_byname：文件别名，必传
                        obj['file_name'] = attachmentList[i].file_name;  //file_name：文件名称，必传
                        obj['file_url'] = attachmentList[i].url;   //file_url：文件绝对路径，必传
                        obj['file_relativepath'] = attachmentList[i].file_relativepath;  //file_relativepath：文件相对路径，必传
                        obj['file_tag'] = '0';   //file_tag:0启用，必传
                        obj['att_opt'] = 'insert';   //att_opt:必传，insert
                        arg_proj_attachment_json.push(obj);
                        break;
                    case 'update':
                        obj['file_byname'] = attachmentList[i].file_byname;  //file_byname：文件别名，必传
                        obj['file_name'] = attachmentList[i].file_name;  //file_name：文件名称，必传
                        obj['att_opt'] = 'update';   //att_opt:必传update
                        //obj['att_id'] = attachmentList[i].att_id;  //att_id必传
                        obj['att_form_id'] = attachmentList[i].att_form_id;  //att_form_id：修改必传
                        arg_proj_attachment_json.push(obj);
                        break;
                    case 'delete':
                        //obj['file_tag'] = '1';// file_tag: 1，必传
                        obj['att_opt'] = 'delete';  //att_opt:必传delete
                        //obj['att_id'] = attachmentList[i].att_id;  //att_id必传
                        obj['att_form_id'] = attachmentList[i].att_form_id;  //att_form_id：修改必传
                        arg_proj_attachment_json.push(obj);
                        break;
                }
            }
        }
        return arg_proj_attachment_json;
    };

    render() {
        const {attachmentList} = this.props;
        return (
            <div className={styles.infoWidth}>
                <div className={styles.newFileList}>
                    <strong>{'附件信息'}</strong>
                    &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
                    <Upload {...this.state.uploadFile}>
                        <Button type="primary">
                            <Icon type="upload"/> {'选择文件'}
                        </Button>
                    </Upload>
                </div>
                <div style={{marginTop: 20}}>
                    <strong>{'已选文件'}</strong>
                    <Table columns={this.columns}
                           dataSource={attachmentList.filter(item => item.opt_type !== 'delete')}
                           pagination={false}
                           className={styles.orderTable}
                    />
                </div>
            </div>
        );
    }
}

export default Attachment;
