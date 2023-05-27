module.exports = {
  title: "安全培训合格证书-版面1",
  components: [
    {
      top: "450",
      left: "152",
      w: "194",
      h: "20",
      remark: "发证日期",
      val: "",
      type: "date-val",
      ext:{
        // cmd:[' LODOP.SET_PRINT_STYLEA(0,"FontSize",7); ']
      }
    },
    {
      top: "453",
      left: "134",
      w: "30",
      h: "20",
      remark: "年份",
      val: "",
      type: "date",
      //设置关联组件，统一填充
      relation:[
        {
          top: "453",
          left: "134",
          w: "30",
          h: "20",
          type: "year",
        },{
          top: "453",
          left: "184",
          w: "20",
          h: "20",
          type: "month",
        },{
          top: "453",
          left: "225",
          w: "20",
          h: "20",
          type: "day",
        }
      ]
    },
    {
      top: "453",
      left: "184",
      w: "20",
      h: "20",
      remark: "月",
      val: "",
      type: "month",
    },
    {
      top: "453",
      left: "225",
      w: "20",
      h: "20",
      remark: "日",
      val: "",
      type: "day",
    },

    {
      top: "453",
      left: "277",
      w: "30",
      h: "20",
      remark: "年",
      val: "",
      type: "year",
    },
    {
      top: "453",
      left: "324",
      w: "20",
      h: "20",
      remark: "月",
      val: "",
      type: "month",
    },
    {
      top: "453",
      left: "361",
      w: "20",
      h: "20",
      remark: "日",
      val: "",
      type: "day",
    },

    {
      top: "500",
      left: "204",
      w: "20",
      h: "20",
      remark: "月",
      val: "",
      type: "month",
    },
    {
      top: "500",
      left: "241",
      w: "20",
      h: "20",
      remark: "日",
      val: "",
      type: "day",
    },


    {
      top: "544",
      left: "171",
      w: "194",
      h: "20",
      remark: "证书编号",
      val: "",
      ext:{
        //居中
        cmd:[' LODOP.SET_PRINT_STYLEA(0,"Alignment",2); ']
      }
    },
    {
      top: "127",
      left: "614",
      w: "220",
      h: "20",
      remark: "单位",
      val: "",
    },
    {
      top: "173",
      left: "614",
      w: "220",
      h: "20",
      remark: "姓名",
      val: "",
    },
    {
      top: "221",
      left: "614",
      w: "220",
      h: "20",
      remark: "性别",
      val: "",
    },
    {
      top: "271",
      left: "614",
      w: "220",
      h: "20",
      remark: "职称",
      val: "",
    },
    {
      top: "319",
      left: "614",
      w: "220",
      h: "20",
      remark: "文化程度",
      val: "",
    },
    {
      top: "368",
      left: "614",
      w: "220",
      h: "20",
      remark: "身份证号",
      val: "",
    },
    {
      top: "415",
      left: "614",
      w: "220",
      h: "20",
      remark: "单位类型",
      val: ""
    },
    {
      top: "464",
      left: "614",
      w: "220",
      h: "20",
      remark: "资格类型",
      val: ""
    }
  ]
}