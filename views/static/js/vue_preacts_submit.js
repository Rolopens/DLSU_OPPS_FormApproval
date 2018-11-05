var preacts_app = new Vue({
    el: '#preacts',
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
        },
        whoami: null,
        quickview: null,
        forms: null
    },
    created: function () {
        axios.get('/whoami')
            .then((rows) => {
                console.log(rows);
                this.whoami = rows.data.user;
                return this.whoami;
            })
            .then((user)=>{
                axios.get("/preacts/getAllFormsOfUser/"+ user._id).then((rows)=>{
                console.log(rows);
                this.forms = rows.data.forms;
                return this.forms;
                })
            })
        
        
    },
    methods: {
        quickviewForm(_id) {
            axios.get('preacts/' + _id)
                .then((response) => {
                    if (response.error != undefined)
                        $("#error_msg").html(response.error)
                    else {
                        Vue.set(preacts_app, 'quickview', response.data.form);
                    }
                })
        }
    }
})
