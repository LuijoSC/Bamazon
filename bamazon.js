var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Luijo007.",
    database: "bamazon"
});

connection.connect(function(err){
    if (err) throw err;
    console.log("Connection successfull 🙌");
    createTable();
});



var createTable = function(){
    connection.query("SELECT * FROM products", function(err, res){
        for (var i=0; i<res.length; i++){
            console.log(res[i].id+" || "+ res[i].productName+" || "+
                res[i].departmentname+" || "+ res[i].price+" || "+
                res[i].stockquantity+"\n")
        }
        promptClient(res);
    })
};
 
var promptClient = function(res){
    inquirer.prompt([{
        type: "input",
        name: "choice",
        message: "Welcome. Which article would you like to purchase? [Press Q to quit]"
    }]).then(function(answer){
        var correct = false;
        if(answer.choice.toUpperCase()== "Q"){
            process.exit();
        }
        for (var i=0; i<res.length; i++){
            if(res[i].productName == answer.choice){
                correct = true;
                var product = answer.choice;
                var id = i;
                inquirer.prompt({
                    type: "input",
                    name:"quant",
                    message:"How many would you like to buy?",
                    validate: function(value){
                        if(isNaN(value)== false){
                            return true;
                        } else {
                            return false;
                        }
                    }
                }).then(function(answer){
                    if((res[id].stockquantity - answer.quant)>0){
                        connection.query("UPDATE products SET stockquantity='"+(res[id].stockquantity - answer.quant)+"' WHERE productName='"+product+"'", function(err, res2){
                           console.log("You got the product!");
                           createTable(); 
                        })
                    } else {
                        console.log("Not a valid selection!");
                        promptClient(res);
                    }
                })
            }
        }
            if(i==res.length && correct==false){
                console.log("That selection is not valid!");
                promptClient(res);
        }
    })
}