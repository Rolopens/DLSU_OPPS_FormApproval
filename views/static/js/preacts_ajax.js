var test = document.getElementById("formLength").value;
console.log("FORM LENGTH")
console.log(test)
var length = parseInt(test, 10)
//for (var i = 0; i < length; i++) {
//    var form_id = $("#item-" + i).attr("data-id")
//    
//    document.getElementById("item-" + i).addEventListener("click", function () {
//        //ajax request to see the details of the form in quick view
//        
//        $.ajax({
//            url: "preacts/" + form_id,
//            method: "get",
//            contentType: 'application/json',
//            success: function (formData) {
//                var form = JSON.parse(JSON.stringify(formData));
//                $("#Title").text(formData["title"]);
//                $("#Nature").text(formData["nature"]);
//                $("#Type").text(formData["typeOfActivity"]);
//                $("#startDate").text(formData["startDate"]);
//                $("#startTime").text(formData["startDate"]);
//                $("#location").text(formData["venue"]);
//                $("#status").text(formData["status"]);
//                $("#sidebar").attr("data-id", formData["_id"]);
//            }
//        })
//    })
//}


function quickDisplay(form_id) {
    //ajax request to see the details of the form in quick view

    $.ajax({
        url: "preacts/" + form_id,
        method: "get",
        contentType: 'application/json',
        success: function (formData) {
            //var form = JSON.parse(JSON.stringify(formData));
            $("#Title").text(formData["title"]);
            $("#Nature").text(formData["nature"]);
            $("#Type").text(formData["typeOfActivity"]);
            $("#startDate").text(formData["startDate"]);
            $("#startTime").text(formData["startDate"]);
            $("#location").text(formData["venue"]);
            $("#status").text(formData["status"]);
            $("#sidebar").attr("data-id", formData["_id"]);
        },
        error: function (error){
            console.log(error);
            console.log("ERROR HAPPENED");
        } 
    })
}

console.log(document.getElementById("ApproveForm"))

document.getElementById("ApproveForm").addEventListener("click", function () {
    var approvedID = $("#sidebar").attr("data-id")
    console.log(approvedID)
    console.log("APPROVE")
    $.ajax({
        url: "preacts/approve/" + approvedID,
        method: "post",
        contentType: 'application/json',
        success: function (formData) {
            console.log("APPROVE SUCCESS")
            var form = JSON.parse(JSON.stringify(formData));
            //            console.log(form)
            $("#status").text(formData["status"]);
        },
        error: console.log("APPROVE FAIL") //remove debug message laters
    })
})

document.getElementById("RejectForm").addEventListener("click", function () {
    var rejectedID = $("#sidebar").attr("data-id")
    console.log("DISAPPROVE")
    $.ajax({
        url: "preacts/reject/" + rejectedID,
        method: "post",
        contentType: 'application/json',
        success: function (formData) {
            console.log("DISAPPROVE SUCCESS")
            var form = JSON.parse(JSON.stringify(formData));
            //            console.log(form)
            $("#status").text(formData["status"]);
        },
        error: console.log("DISAPPROVE FAIL")
    })
})