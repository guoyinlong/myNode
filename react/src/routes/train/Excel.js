/**
 * 文件说明：excel批量导入
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-07-10
 **/
import React, { Component } from 'react';
import { Button, Icon, message } from 'antd';
import styles from './Excel.less';
import * as XLSX from 'xlsx';
class Excel extends Component {
  onImportExcel = file => {
    let importType = this.props.importType;
    let importRecord = this.props.importRecord;
    // 获取上传的文件对象
    const { files } = file.target;
    // 通过FileReader对象读取文件
    const fileReader = new FileReader();
    fileReader.onload = event => {
      try {
        const { result } = event.target;
        // 以二进制流方式读取得到整份excel表格对象
        const workbook = XLSX.read(result, { type: 'binary' });
        // 存储获取到的数据
        let data = [];
        // 遍历每张工作表进行读取（这里默认只读取第一张表）
        for (const sheet in workbook.Sheets) {
          //esline-disable-next-line
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            // 利用 sheet_to_json 方法将 excel 转成 json 数据
            data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
            break; // 如果只取第一张表，就取消注释这行
          }
        }
        // 最终获取到并且格式化后的 json 数据
        const {dispatch} = this.props;
        if(importType === 'compulsory' ){
          dispatch({
          type:'train_create_model/centerClassCompulsoryImport',
          param:data
        });
          message.success('导入成功,请同步！')
        }

        if(importType === 'certificationList' ){
          dispatch({
          type:'exam_checklist_model/centerExamImport',
          param:data
        });
          message.success('导入成功,请同步！')
        }
        if(importType === 'elective' ){
          dispatch({
            type:'train_create_model/centerClassElectiveImport',
            param:data
          });
          message.success('导入成功,请同步！')
        }
        if(importType === 'branch_department' ){
          dispatch({
            type:'train_create_model/BranchAndDepartmentImport',
            param:data
          });
          message.success('导入成功,请提交保存！')
        }
        if(importType === 'certification' ){
          dispatch({
            type:'train_create_model/CreateCertificationImport',
            param:data
          });
          message.success('导入成功,请提交保存！')
        }
        if(importType === 'personImport' ){
          dispatch({
            type:'train_create_model/personDataOfClassImport',
            param:data
          });
          this.props.updateVisible(true);
          this.props.updateRecord(importRecord);
        }
      } catch (e) {
        // 这里可以抛出文件类型错误不正确的相关提示
        message.error('文件类型不正确！');
      }
    };
    // 以二进制方式打开文件
    fileReader.readAsBinaryString(files[0]);
  };
  render() {
    return (
        <Button className={styles['upload-wrap']}>
          <Icon type='upload'/>
          <input className={styles['file-uploader']} type='file' accept='.xlsx, .xls' onClick={(event)=> { event.target.value = null }} onChange={this.onImportExcel} />
          <span className={styles['upload-text']}>批量导入</span>
        </Button>
    );
  }
}

export default Excel;
