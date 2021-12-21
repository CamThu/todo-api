var Sequelite = require('sequelize');
var sequelize = new Sequelite(undefined, undefined, undefined, {
        'dialect': 'sqlite',
        'storage': __dirname + '/basic-sqlite-database.sqlite'

});


var Todo =sequelize.define('todo', {
    description: {
        type: Sequelite.STRING,
        allowNull: false,
        validate: {
            len: [1, 250]
        }

    },
    completed: {
        type: Sequelite.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

sequelize.sync({force:true})
.then(function(){

    console.log('Everything is synced');

    Todo.findById(1).then(function(todo){

        if(todo){
            console.log(todo.toJSON());

        }else {
            console.log('Todo not found');
        }
    })


      
    /*
    Todo.create({
        description: 'Update Mindset'

    }).then (function (){
        return Todo.findById(1);
    }).then (function(todos){
        if(todos){
            console.log(todos.toJSON());
        }else{
            console.log('no todo found!');
        }
    }).catch(function(e){
        console.log(e);
    })

    */

    /*
    Todo.create({
       description: 'Take out trash',
    }).then (function (todo) {

        return Todo.create({
            description: 'Clean office'
        });
    
    }).then(function(){

     //    return Todo.findById(1);
      return Todo.findAll({
            where: {
                description: {
                    $like: '%Office%'
                }
            }
        }); 
      
    }).then (function(todos){
        if(todos){
            todos.forEach(function(todo){
                console.log(todo.toJSON());
            })
          
        }else {
            console.log('no todo found!');
        }
        
    }).catch (function(e){
        console.log(e);
    });

    */
});