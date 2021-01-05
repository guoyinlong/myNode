export default {
  namespace: "BPpage",
  state:{},
  
  effects:{


  },

  reducers:{



  },

  subscriptions:{

    setup({dispatch, history}) {
      return history.listen(({pathname,query}) => {
        // if (pathname === '/humanApp/employer/BPpage') {
        //   let obj={
        //     key: 'BPpage',
        //     name: 'BP配置页面',
        //     module_id: '11a60a3417f511ea91530242ac110008',
        //     //display:1
        //   }
        //     let list=JSON.parse(window.localStorage.getItem("menu"))
        //     list[3].child[4].child[23]=obj
        //     let str=JSON.stringify(list)
        //     window.localStorage.setItem("menu",str)
        // }
      });
    }

  }

}