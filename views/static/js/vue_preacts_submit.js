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
        forms: null,
        searchQuery: '',
        show: null,
        pending: null,
        approved: null,
        all: null,
        unreviewed: null,
        rejected: null
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
                this.pendingFilter();
                this.createNumbers();
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
                        axios.get("/preacts/getAllFormsOfUser/"+ this.whoami._id).then((rows) => {
                            this.forms = rows.data.forms;
                            this.filterOut();
                            return this.forms;
                        })  
                    }
                    else{
                        this.whoami = rows.data.user;
                        axios.get('/preacts/getAllOwnedFormsWithMatchingString/forms/' + this.whoami._id + '/' + this.searchQuery).then((rows) => {
                            this.forms = rows.data.forms;
                            this.filterOut();
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
                    axios.get("/preacts/sortEventDateAsc/"+ this.whoami._id).then((rows) => {
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
                    axios.get("/preacts/sortEventDateDesc/"+ this.whoami._id).then((rows) => {
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
                    axios.get("/preacts/sortFormDateAsc/"+ this.whoami._id).then((rows) => {
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
                    axios.get("/preacts/sortFormDateDesc/"+ this.whoami._id).then((rows) => {
                        this.forms = rows.data.forms;
                        this.filterOut();
                        return this.forms;
                    })  
                })              
        },
        allFilter(){
            this.show = this.forms;
            this.quickview = null;
        },
        approvedFilter(){
            listForms = [];
            for (form in this.forms){
                if(this.forms[form].status == 'Approved'){
                    listForms.push(this.forms[form]);
                }
            }
            this.show = listForms;
            this.quickview = null;
        },
        pendingFilter(){
            listForms = [];
            for (form in this.forms){
                if(this.forms[form].status == 'Pending'){
                    listForms.push(this.forms[form]);
                }
            }
            this.show = listForms;
            this.quickview = null;
        },
        rejectedFilter(){
            listForms = [];
            for (form in this.forms){
                if(this.forms[form].status == 'Fully Rejected'){
                    listForms.push(this.forms[form]);
                }
            }
            this.show = listForms;
            this.quickview = null;
        },
        unreviewedFilter(){
            listForms = [];
            for (form in this.forms){
                if(this.forms[form].status == 'Rejected'){
                    listForms.push(this.forms[form]);
                }
            }
            this.show = listForms;
            this.quickview = null;
        },
        filterOut(){
            var x = $("#options .active").text();
            if (x.includes('All')){
                this.allFilter()
            }else if(x.includes('Pending')){
                this.pendingFilter();
            }else if(x.includes('Approved')){
                this.approvedFilter();
            }else if(x.includes('Rejected')){
                this.rejectedFilter();
            }else if(x.includes('Unreviewed')){
                this.unreviewedFilter();
            } 
        },
        createNumbers(){
            listForms = [];
            for (form in this.forms){
                if(this.forms[form].status == 'Approved'){
                    listForms.push(this.forms[form]);
                }
            }
            this.approved = listForms.length;
            listForms = [];
            for (form in this.forms){
                if(this.forms[form].status == 'Pending'){
                    listForms.push(this.forms[form]);
                }
            }
            this.pending = listForms.length;
            listForms = [];
            for (form in this.forms){
                if(this.forms[form].status == 'Fully Rejected'){
                    listForms.push(this.forms[form]);
                }
            }
            this.rejected = listForms.length;
            listForms = [];
            for (form in this.forms){
                if(this.forms[form].status == 'Rejected'){
                    listForms.push(this.forms[form]);
                }
            }
            this.unreviewed = listForms.length;
            listForms = [];
            this.all = this.forms.length;
        },
        unselectActivity(event){
            if(event.target.className != "itemRow") {
                this.quickview = null;
                $('.content-wrapper').removeClass('active');
            }
        }
    }
})
