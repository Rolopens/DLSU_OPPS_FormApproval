var postacts_app = new Vue({
    el: '#postacts',
    data: {
        filter: {
            status: [
                "Early Complete",
                "Late Complete",
                "Early Incomplete",
                "Late Incomplete",
                "Acknowledgement Cancellation"
            ],
            colleges: [
                "Liberal Arts (CLA)",
                "Computer Studies (CCS)",
                "Engineering (GCOE)",
                "Business (RVM-COB)",
                "Education (BAG-CED)",
                "Economics (SOE)"
            ]
        }
        ,
//        whoami: null
    }
//    ,
//    created: function(){
//      axios.get('/whoami')
//      .then((rows)=> {console.log(rows);this.whoami = rows.data.user;return this.whoami;})
    }
//                           ,
//    methods: {

//    }
})
