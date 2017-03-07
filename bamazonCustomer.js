var mysql = require("mysql");
var prompt = require("prompt");
var inquirer = require("inquirer");


var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: 'root', 
	password: 'root',
	database: 'bamazon'
});

// connection.connect(function(err){
// 	if(err) throw err;
// 	console.log("connected as id " + connection.threadId);
// });

function showStore(){
	connection.query(
		"SELECT item_id, product_name, price FROM products",

		function(err, res){
			if(err) throw err;
			for (var i = 0; i < res.length; i++) {
			console.log(`item ID: ${res[i].item_id}`);
			console.log(`product name: ${res[i].product_name}`);
			console.log(`price: $ ${res[i].price}`);
			console.log("---------------------");
		}
		buyProduct();
		});
};

showStore();

function buyProduct(){
	
	inquirer.prompt([
		{
    		type: "input",
    		message: "Please enter the id of the item you would like to buy",
    		name: "id"
  		},
  		{
  			type: "input", 
  			message: "Please enter the quantity you wish to purchase",
  			name: "quantity"
  		},

  		]).then(function(data){
  			connection.query(
  				"SELECT * FROM products WHERE item_id = ?", data.id,
  				function(err, res){
					if(err) throw err;
					if (data.quantity > res[0].stock_quantity){
						console.log("We have insufficient quantity of that item");
						buyProduct();
					}else{
						// console.log(res);
						connection.query(
							"UPDATE products SET stock_quantity = ? WHERE item_id = ?", [(res[0].stock_quantity - data.quantity), data.id]
							,function(err, result){
							if(err) throw err;
							total = (data.quantity * res[0].price)
							console.log("Your total is: $" + total + ".  Please enter your credit card information.  (just kidding)");
							storeReturn();
							});
  					};
				});

		});

};

function storeReturn(){
	inquirer.prompt([
		{
    		type: "confirm",
    		message: "Return to store?",
    		name: "confirm",
    		default: true
  		}

  		]).then(function(data){
  			if (data.confirm === true){
  				showStore();
  			}else{
  				console.log("Thank you for shopping.  Goodbye.");
  			}
  		})

};