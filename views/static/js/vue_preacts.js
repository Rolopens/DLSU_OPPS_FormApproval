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
                "Economics (SOE)",
                "Science (COS)"
            ]
        },
        whoami: null,
        quickview: null,
        forms: null,
        searchQuery: '',
        show: null
    },
    created: function () {
        axios.get('/whoami')
            .then((rows) => {
                console.log(rows);
                this.whoami = rows.data.user;
                //console.log(this.whoami._id)
            //this.whoami._id
                axios.get('/preacts/getAllForms/forms/' + this.whoami._id).then((rows) => {
                    console.log(rows);
                    this.forms = rows.data.forms;
                    this.show = this.forms
                    return this.forms;
                })
                return this.whoami;
            })


        //        axios.get('/preacts/getAllForms/forms/' + whoami._id).then((rows)=>{
        //                console.log(rows);
        //                this.forms = rows.data.forms;
        //                return this.forms;
        //        })
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
        },
        approveForm(_id) {
            axios.post("/preacts/approve/" + _id)
                .then((response) => {
                    if (response.error != undefined)
                        $("#error_msg").html(response.error)
                    else {
                        Vue.set(preacts_app, 'quickview', response.data.formData1);
                        location.reload(true);
                    }
                })
            axios.get('/preacts/getAllForms/forms').then((rows) => {
                console.log(rows);
                this.forms = rows.data.forms;
                //                return this.forms;
            })
        },
        rejectForm(_id, comment) {
            axios.post("/preacts/commentreject/" + _id + "/" +comment)
                .then((response) => {
                    if (response.error != undefined)
                        $("#error_msg").html(response.error)
                    else {
                        Vue.set(preacts_app, 'quickview', response.data.formData1);
                        location.reload(true);
                    }
                })
            axios.get('/preacts/getAllForms/forms').then((rows) => {
                console.log(rows);
                this.forms = rows.data.forms;
                //                return this.forms;
            })
        },
        fullyRejectForm(_id, comment) {
            axios.post("/preacts/commentfullReject/" + _id+ "/" +comment)
                .then((response) => {
                    if (response.error != undefined)
                        $("#error_msg").html(response.error)
                    else {
                        Vue.set(preacts_app, 'quickview', response.data.formData1);
                        location.reload(true);
                    }
                })
            axios.get('/preacts/getAllForms/forms').then((rows) => {
                console.log(rows);
                this.forms = rows.data.forms;
                //                return this.forms;
            })
        },   
        removeSearchQuery: function() {
          this.searchQuery = '';
          this.isResult = false;
//            console.log("test2");
        },
        submitSearch: function() {            
            console.log(this.searchQuery);
                        
            axios.get('/whoami')
                .then((rows) => {
                    if(this.searchQuery == ""){                        
                        this.whoami = rows.data.user;                        
                        axios.get('/preacts/getAllForms/forms/' + this.whoami._id).then((rows) => {
                            this.forms = rows.data.forms;
                            return this.forms;
                        })  
                    }
                    else{
                        console.log("Here!");
                        this.whoami = rows.data.user;
                        axios.get('/preacts/getAllFormsWithMatchingString/forms/' + this.whoami._id + '/' + this.searchQuery).then((rows) => {
                            this.forms = rows.data.forms;
                            return this.forms;
                        })
                    }
                })
              
            console.log(this.forms);
        },
        sortEventDateAsc: function() {            
            axios.get('/whoami')
                .then((rows) => {
                    this.whoami = rows.data.user;                        
                    axios.get("/preacts/sortEventDateAscChecked/"+ this.whoami._id).then((rows) => {
                        this.forms = rows.data.forms;
                        this.filterOut();
                        return this.forms;
                    })  
                })              
        },
        sortEventDateDesc: function() {            
            axios.get('/whoami')
                .then((rows) => {
                    this.whoami = rows.data.user;                        
                    axios.get("/preacts/sortEventDateDescChecked/"+ this.whoami._id).then((rows) => {
                        this.forms = rows.data.forms;
                        this.filterOut();
                        return this.forms;
                    })  
                })              
        },
        sortFormDateAsc: function() {            
            axios.get('/whoami')
                .then((rows) => {
                    this.whoami = rows.data.user;                        
                    axios.get("/preacts/sortFormDateAscChecked/"+ this.whoami._id).then((rows) => {
                        this.forms = rows.data.forms;
                        this.filterOut();
                        return this.forms;
                    })  
                })              
        },
        sortFormDateDesc: function() {            
            axios.get('/whoami')
                .then((rows) => {
                    this.whoami = rows.data.user;                        
                    axios.get("/preacts/sortFormDateDescChecked/"+ this.whoami._id).then((rows) => {
                        this.forms = rows.data.forms;
                        this.filterOut();
                        return this.forms;
                    })  
                })              
        },
        allFilter(){
            this.show = this.forms
            this.quickview = null;
        },
        approvedFilter(){
            listForms = [];
            for (form in this.forms){
                if(this.forms[form].status == 'Approved'){
                    listForms.push(this.forms[form]);
                }
            }
            this.show = listForms
            this.quickview = null;
        },
        pendingFilter(){
            listForms = [];
            for (form in this.forms){
                if(this.forms[form].status == 'Pending'){
                    listForms.push(this.forms[form]);
                }
            }
            this.show = listForms
            this.quickview = null;
        },
        rejectedFilter(){
            listForms = [];
            for (form in this.forms){
                if(this.forms[form].status == 'Fully Rejected'){
                    listForms.push(this.forms[form]);
                }
            }
            this.show = listForms
            this.quickview = null;
        },
        unreviewedFilter(){
            listForms = [];
            for (form in this.forms){
                if(this.forms[form].status == 'Rejected'){
                    listForms.push(this.forms[form]);
                }
            }
            this.show = listForms
            this.quickview = null;
        },
        filterOut(){
            var x = $("#options .active").text();
            if (x == 'All'){
                this.allFilter()
            }else if(x == 'Pending'){
                this.pendingFilterFilter()
            }else if(x == 'Approved'){
                this.approvedFilter()
            }else if(x == 'Rejected'){
                this.rejectedFilter()
            }else if(x == 'Unreviewed'){
                this.unreviewedFilter()
            }
        }
    }
})
