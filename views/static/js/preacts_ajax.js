var test = document.getElementById("formLength").value
        var length = parseInt(test, 10)
        for (var i = 0; i < length;i++){
            var form_id = $("#item-"+i).attr("data-id")
            document.getElementById("item-" + i).addEventListener("click", function(){
                //ajax request to see the details of the form in quick view
                $.ajax({
                    url: "preacts/" + form_id,
                    method: "get",
                    contentType: 'application/json',
                    success: function(formData){
                        var form = JSON.parse(JSON.stringify(formData));
                        $("#Title").text(form[i-1]["title"]);
                        $("#Nature").text(form[i-1]["nature"]);
                        $("#Type").text(form[i-1]["typeOfActivity"]);
                        $("#startDate").text(form[i-1]["startDate"]);
                        $("#startTime").text(form[i-1]["startDate"]);
                        $("#location").text(form[i-1]["venue"]);
                        $("#status").text(form[i-1]["status"]);
                        $("#sidebar").attr("data-id", form[i-1]["_id"]);
                    }
                })
            }) 
        }
        
        document.getElementById("ApproveForm").addEventListener("click", function(){
            var approvedID = $("#sidebar").attr("data-id")
            $.ajax({
                url: "preacts/approve/" + approvedID,
                method: "post",
                contentType: 'application/json',
                success: function(formData){
                    var form = JSON.parse(JSON.stringify(formData));
                    console.log(form)
                    $("#status").text(form[i-1]["status"]);
                }
            })
        })
        
        document.getElementById("RejectForm").addEventListener("click", function(){
            var rejectedID = $("#sidebar").attr("data-id")
            $.ajax({
                url: "preacts/reject/" + rejectedID,
                method: "post",
                contentType: 'application/json',
                success: function(formData){
                    var form = JSON.parse(JSON.stringify(formData));
                    console.log(form)
                    $("#status").text(form[i-1]["status"]);
                }
            })
        })