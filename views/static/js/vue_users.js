var users_app = new Vue({
    el: '#users',
    data: {
        accounts: [],
        orgs: [],
        roles: [],
        quickview: null,
        user: {
            email: '',
            password: '',
            cpassword: '',
            status: true,
            org_id: 0,
            role_id: 0
        },
        whoami: null
    },
    created: function () {
        axios.get('/whoami')
            .then((rows) => {
                console.log(rows);
                this.whoami = rows.data.user;
                return this.whoami;
            })
            .then((currUser) => {
                axios.get('/users/orgtype/' + currUser.user_roles[0].org.type)
                    .then((rows) => {
                        console.log(rows);
                        this.accounts = rows.data.users;
                    })
            })
        axios.get('/orgs')
            .then((rows) => {
                console.log(rows);
                this.orgs = rows.data.orgs;
            })
        axios.get('/roles')
            .then((rows) => {
                console.log(rows);
                this.roles = rows.data.roles;
            })
    },
    methods: {
        quickviewUser(_id) {
            axios.get('/users/id/' + _id)
                .then((response) => {
                    if (response.error != undefined)
                        $("#error_msg").html(response.error)
                    else {
                        Vue.set(users_app, 'quickview', response.data.user);
                    }
                })
        },
        onSubmit() {
            axios.post('/accounts', {
                data: JSON.stringify(this.user)
            }).then(function (response) {
                console.log(response)
                if (response.error != undefined)
                    $("#error_msg").html(response.error)
            })
        },
        changeStatus(email, role_id, org_id) {
            axios.put('/accounts', {
                email: email,
                role_id: role_id,
                org_id: org_id
            }).then(response => {
                let data = response.data
                console.log(data)
                if (data.status)
                    quickview.enabled = !quickview.enabled
            })
        }
    }
})
