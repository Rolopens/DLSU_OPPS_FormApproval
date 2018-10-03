var orgs_app = new Vue({
    el: '#orgs',
    data: {
        orgs: [],
        quickview: null
    },
    created: function(){
        axios.get('/organizations')
            .then((rows)=> {
                console.log(rows)
                this.orgs = rows.data.orgs})
    },
    methods: {
        changeStatus(id) {
            axios.put('/organizations', {id:id}).then(response => {
                let data = response.data
                console.log(data)
                if(data.status)
                    quickview.enabled = !quickview.enabled
            })
        },

        changeToSave(name, abbrev, id) {

            if ($("#editBtn").text() == "Edit"){
                $("#orgname").attr("disabled", false);
                $("#orgabbrev").attr("disabled", false);
                $("#editBtn").html("Save");
                $("#orgname").attr("color", "black");
                $("#orgabbrev").attr("color", "black");
            } else if ($("#editBtn").text() == "Save") {
                let n = $("#orgname").val()
                axios.post('/editOrganization', {name:n, abbrev:abbrev, id:id}).then(response => {
                    let data = response.data
                    console.log(data)
                    if (data.msg == "success") {
                        $("#editBtn").html("Edit");
                        $("#orgname").attr("disabled", true);
                        $("#orgabbrev").attr("disabled", true);
                    } else {
                        $("#editBtn").html(data.msg);
                    }
                })
            }
        }
    }
})