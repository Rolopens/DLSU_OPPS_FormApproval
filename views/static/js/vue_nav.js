var nav = new Vue({
    el: "#primary-nav",
    data: {
        active: {
            preacts: false,
            preactsSubmission: false,
            accounts: false,
            organization: false
        }
    },
    mounted: function () {
        for (key in this.active) {
            if (window.location.href.endsWith(key)) {
                this.active[key] = true
            }
        }
    }
})