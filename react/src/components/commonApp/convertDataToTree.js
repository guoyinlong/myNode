
/**
 * 作者：邓广晖
 * 创建日期：2017-8-21
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：将部门信息转变成树结构
 */
export function convertDeptTreeData(data){
  /*  方法参考地址  http://blog.csdn.net/qinshenxue/article/details/38372653
   *  selectable 表示当前节点是否可选
   *  如果想设置一级节点不可选，返回值后使用  data[0]['selectable'] = false
   *  如果是二级节点不可选，返回值后使用
   *    for(let i =0;i<data[0].children.length) data[0].children[i]['selectable']=false
   *  如果是三级节点不可选，返回值后需要使用  两次 循环来设置
   * */
  let pos={};       //用于保存每个已添加到tree中的节点在tree中位置信息
  let tree=[];
  let i=0;
  while(data.length!=0){
    if(data[i].dept_pid=="00000000000000000000000000000000"){    //如果当前节点的父节点是根节点
      tree.push({
        dept_id:data[i].dept_id,        //dept_id只是用来构造树时建立索引
        label:data[i].dept_name,
        key:data[i].dept_name,
        value:data[i].dept_name,
        children:[]
      });
      pos[data[i].dept_id]=[tree.length-1];
      data.splice(i,1);          //从列表中删除当前节点
      i--;
    }else{
      let posArr = pos[data[i].dept_pid];
      if(posArr!=undefined){

        let obj=tree[posArr[0]];
        for(let j=1;j<posArr.length;j++){
          obj=obj.children[posArr[j]];
        }
        obj.children.push({
          dept_id:data[i].dept_id,
          label:data[i].dept_name,
          key:data[i].dept_name,
          value:data[i].dept_name,
          children:[]
        });
        pos[data[i].dept_id]=posArr.concat([obj.children.length-1]);
        data.splice(i,1);
        i--;
      }
    }
    i++;
    if(i>data.length-1){
      i=0;
    }
  }
  return tree;
}
