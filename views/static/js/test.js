$(document).ready(function(){
    $('#test').click(function(){
        axios.put('/organizations', {name:'Moo Media'}).then(response => {
            let data = response.data
            console.log(data)
            $('#test-text').html(data.timestamp)
        })
    })
})