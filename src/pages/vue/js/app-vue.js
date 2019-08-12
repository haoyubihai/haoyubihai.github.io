var box2 = new Vue({
    el: "#box2",
    data: {
        message: "hello"
    }
})
var  app2 = new Vue({
    el:"#app-2",
    data:{
        message:'页面加载于'+new Date().toLocaleDateString()
    }
})

var app3 = new Vue({
    el:"#app-3",
    data:{
        seen:true
    }
})

var app4 = new Vue({
    el:"#app-4",
    data:{
        todos:[
            {text:"android"},
            {text:"ios"},
            {text:"pc"},
        ]
    }
})
var app5 = new Vue({
    el:"#app-5",
    data:{
        message:'hello Vue.js'
    },
    methods:{
        reverseMessage:function () {
            this.message = this.message.split('').reverse().join('')

        }
    }
})

var app6 = new Vue({
    el:"#app-6",
    data:{
        message:'Hello vue'
    }
})

//定义名为todo-item 新的组件
Vue.component('todo-item',{
    props:['todo'],
    template:'<li>{{todo.text}}</li>'
})

var app7 = new Vue({
    el:"#app-7",
    data:{
        widgets:[
            {id:0,text:'自定义组件0'},
            {id:1,text:'自定义组件1'},
            {id:2,text:'自定义组件2'}
        ]
    }
})

