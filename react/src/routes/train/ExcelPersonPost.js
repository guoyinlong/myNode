/**
 * 文件说明：excel批量导入
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-08-19
 **/
import React, { Component } from 'react';
import { Button, Icon, message } from 'antd';
import styles from './Excel.less';
import * as XLSX from 'xlsx';
class ExcelPersonPost extends Component {
  onImportExcel = file => {
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
        let devopsPostData = [];
        let safePostData = [];
        let testPostData = [];
        let backPostData = [];
        let frontPostData = [];
        let frameworkPostData = [];
        let requirePostData = [];
        let UIPostData = [];
        // 遍历每张工作表进行读取（这里默认只读取第一张表）
        for (const sheet in workbook.Sheets) {
          //esline-disable-next-line
          //运维岗
          if (workbook.Sheets.hasOwnProperty(sheet) && sheet === "运维岗") {
            // 利用 sheet_to_json 方法将 excel 转成 json 数据
            devopsPostData = devopsPostData.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
            continue; // 如果只取第一张表，就取消注释这行
          }
          //安全岗
          else if (workbook.Sheets.hasOwnProperty(sheet) && sheet === "安全岗") {
            // 利用 sheet_to_json 方法将 excel 转成 json 数据
            safePostData = safePostData.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
            continue; // 如果只取第一张表，就取消注释这行
          }
          //测试岗
          else if (workbook.Sheets.hasOwnProperty(sheet) && sheet === "测试岗") {
            // 利用 sheet_to_json 方法将 excel 转成 json 数据
            testPostData = testPostData.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
            continue; // 如果只取第一张表，就取消注释这行
          }
          //后端开发岗
          else if (workbook.Sheets.hasOwnProperty(sheet) && sheet === "后端开发岗") {
            // 利用 sheet_to_json 方法将 excel 转成 json 数据
            backPostData = backPostData.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
            continue; // 如果只取第一张表，就取消注释这行
          }
          //前端开发岗
          else if (workbook.Sheets.hasOwnProperty(sheet) && sheet === "前端开发岗") {
            // 利用 sheet_to_json 方法将 excel 转成 json 数据
            frontPostData = frontPostData.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
            continue; // 如果只取第一张表，就取消注释这行
          }
          //架构师（研发）岗
          else if (workbook.Sheets.hasOwnProperty(sheet) && sheet === "架构师（研发）岗") {
            // 利用 sheet_to_json 方法将 excel 转成 json 数据
            frameworkPostData = frameworkPostData.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
            continue; // 如果只取第一张表，就取消注释这行
          }
          //需求产品设计岗
          else if (workbook.Sheets.hasOwnProperty(sheet) && sheet === "需求产品设计岗") {
            // 利用 sheet_to_json 方法将 excel 转成 json 数据
            requirePostData = requirePostData.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
            continue; // 如果只取第一张表，就取消注释这行
          }
          //UI设计岗
          else if (workbook.Sheets.hasOwnProperty(sheet) && sheet === "UI设计岗") {
            // 利用 sheet_to_json 方法将 excel 转成 json 数据
            UIPostData = UIPostData.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
            continue; // 如果只取第一张表，就取消注释这行
          }
        }
        // 最终获取到并且格式化后的 json 数据
        const {dispatch} = this.props;
          dispatch({
          type:'importPersonPost/personPostImportOperation',
          devopsPostData ,
          safePostData ,
          testPostData ,
          backPostData ,
          frontPostData ,
          frameworkPostData ,
          requirePostData ,
          UIPostData ,
        });
          message.success('导入成功,请同步！')
          this.props.updateVisible(true);
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

export default ExcelPersonPost;
