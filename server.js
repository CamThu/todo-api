var express = require ('express');
var app = express ();
var PORT = process.env.PORT || 3000;
var todos =  [ {
	id: 1,
	desciption: 'Meet mom for lunch',
	complete: false

	}, {
	id: 2,
	desciption: "Go to market",
	complete: false


	}, {

	id: 3,
	description: 'Feed the cat',
	complete: true

	}


];

app.get('/', function (req, res) {
	 res.send('Todo API  Root');
});

//
app.get('/todos', function (req, res){
	res.json(todos);

});

app.get('/todos/:id', function(req, res){

	var todoId = parseInt(req.params.id, 10);

	var statustodo;

	for (i=0; i<todos.length; i++){
		if (todoId === todos[i].id){
			res.json(todos[i]);

			statustodo = true;
		}

	}

	if (!statustodo) {

		res.status(404).send();
	}


	//res.send('Asking for todo with id of ' + req.params.id);
})


app.listen (PORT, function (){
	console.log ('Express listening on port ' + PORT + '!' ) ;

} );  
