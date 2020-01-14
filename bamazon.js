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