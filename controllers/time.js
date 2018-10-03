module.exports.controller = function (app) {
    app.get('/time', function(req, res) {
	   res.send({
           timestamp: (new Date ()).toLocaleString()
       })
    })
}