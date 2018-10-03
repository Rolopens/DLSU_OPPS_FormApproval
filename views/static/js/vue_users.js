var users_app = new Vue({
    el: '#users',
    data: {
        accounts: [],
        orgs: [],
        roles: [],
        quickview: null,
        user: {
            email:'',
            password: '',
            cpassword: '',
            status: true,
            org_id: 0,
            role_id: 0
        }
    },
    created: function(){
        axios.get('/users')
        .then((rows)=>{ console.log(rows);this.accounts = rows.data.users})
        axios.get('/users/organizations')
            .then((rows)=> {console.log(rows);this.orgs = rows.data.orgs[0]})
        axios.get('/roles')
            .then((rows)=> this.roles = rows.data.roles)
    },
    methods: {
        onSubmit() {
            axios.post('/accounts', {
                data: JSON.stringify(this.user)
            }).then(function(response) {
                console.log(response)
                if(response.error != undefined)
                    $("#error_msg").html(response.error)
            })
        },
        changeStatus(email, role_id, org_id) {
            axios.put('/accounts', 
                {email:email,
                role_id: role_id,
                org_id,org_id}
            ).then(response => {
                let data = response.data
                console.log(data)
                if(data.status)
                    quickview.enabled = !quickview.enabled
            })
        }
    }
})