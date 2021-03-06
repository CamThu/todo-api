var express = require ('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');


const { filter } = require('underscore');
const queryTypes = require('sequelize/lib/query-types');

var app = express ();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;


app.use(bodyParser.json());



app.get('/', function (req, res) {
	 res.send('Todo API  Root');
});

//
app.get('/todos', function (req, res){
	var query = req.query;
	var where = {};

	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;
	}else if (query.hasOwnProperty('completed') && query.completed === 'false'){
		where.completed = false;

	}

	if (query.hasOwnProperty('q') && query.q.length >0){
		where.description = {
			$like: '%' + query.q + '%'
		};
	}

	db.todo.findAll({where: where}).then(function(todos){
		res.json(todos);
	},function(e){
		res.status(500).send();

	})

	/*
	var filteredTodos = todos;
		if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
			filteredTodos = _.where(filteredTodos, {completed: true});
		}else  if (queryParams.hasOwnProperty('completed') && queryParams.completed ==='false'){
			filteredTodos = _.where(filteredTodos, {completed: false});
		}

		if(queryParams.hasOwnProperty('q') &&  queryParams.q.length >0){

			filteredTodos=_.filter(filteredTodos, function (todo) {
				return todo.description. toLowerCase().indexOf(queryParams.q.toLocaleLowerCase()) > -1;
			});
		}

	res.json(filteredTodos);
		*/


});

app.get('/todos/:id', function(req, res){
	
	var todoId = parseInt(req.params.id, 10);

	db.todo.findById(todoId).then(function(todo){
			if (!!todo){
				res.json(todo.toJSON());
			}else {
				res.status(404).send();
			}
	}, function(e){
			res.status(500).send();
	});


	/*
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if(matchedTodo){ 
			res.json(matchedTodo);

	} else {
		res.status(404).send();
	}

	*/

	//res.send('Asking for todo with id of ' + req.params.id);
});



//POST/todos

app.post('/todos', function(req, res){

	var body = _.pick(req.body,'description', 'completed');

	db.todo.create(body).then(function(todo){
		res.json(todo.toJSON());
	}, function(e){
		res.status(400).json(e);
	});

	/*
	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0 ){
		return res.status(400).send();
	}



	body.description = body.description.trim();


	body.id = todoNextId++;

	todos.push(body);

	//console.log ('description: '+  body.description);

	res.json(body);
	*/
});


//Delete /todos/:id

app.delete('/todos/:id', function(req, res){

	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});


	if(matchedTodo){ 
			todos = _.without(todos, matchedTodo);
			res.json (matchedTodo);
	} else {
		res.status(404).json({"error": "no todo found with that id"});
		
	}
} ); 


// PUT//todos//:id

app.put('/todos/:id', function (req, res){

	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttribute = {};

	if (!matchedTodo){

		return res.status(404).send();

	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)){


			validAttribute.completed = body.completed ;

			console.log(validAttribute);
			
	}else if (body.hasOwnProperty('completed') ){

			return res.status(400).send();
	}



	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){


			validAttribute.description = body.description ;


	}else if (body.hasOwnProperty('description') ){

			return res.status(400).send();
	}


	console.log(matchedTodo);
	console.log(validAttribute);

	_.extend(matchedTodo, validAttribute);

	res.json(matchedTodo);

});


db.sequelize.sync().then(function(){
	app.listen (PORT, function (){
		console.log ('Express listening on port ' + PORT + '!' ) ;
	
	} );  
});



