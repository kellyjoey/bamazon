var mysql = require("mysql");
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

function managerView(){

	inquirer.prompt([
		{
    		type: "list",
    		message: "What do you want to do?",
    		choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
    		name: "menu"
  		},
  	]).then(function(choice){
  		switch(choice.menu){

  			case "View Products for Sale":
  			// console.log("view products for sale");
  			managerStore();
  			break;

  			case "View Low Inventory":
  			// console.log("view low inventory");
  			lowInventory();
  			break;

  			case "Add to Inventory":
  			inventory();
  			break;

  			case "Add New Product":
  			console.log("add new product");
  			addProduct();
  			break;

  		}
  	})
};

managerView();

function managerStore(){
	connection.query(
		"SELECT item_id, product_name, price, stock_quantity FROM products",

		function(err, res){
			if(err) throw err;
			for (var i = 0; i < res.length; i++) {
			console.log(`item ID: ${res[i].item_id}`);
			console.log(`product name: ${res[i].product_name}`);
			console.log(`price: $ ${res[i].price}`);
			console.log(`stock_quantity: ${res[i].stock_quantity}`);
			console.log("---------------------");
			}
			managerMenu();

		});
};

function lowInventory(){
	connection.query(
		"SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5", 

		function(err, res){
			if (err) throw err;
			if (res.length === 0){
				console.log("No Low Inventory to report");
			}else{
				for (var i = 0; i < res.length; i++) {
					console.log(`item ID: ${res[i].item_id}`);
					console.log(`product name: ${res[i].product_name}`);
					console.log(`price: $ ${res[i].price}`);
					console.log(`stock_quantity: ${res[i].stock_quantity}`);
					console.log("---------------------");
				}
			};
		});
	managerMenu();
};

function inventory(){

	connection.query(
		"SELECT item_id, product_name, price, stock_quantity FROM products",

		function(err, res){
			if(err) throw err;
			for (var i = 0; i < res.length; i++) {
			console.log(`item ID: ${res[i].item_id}`);
			console.log(`product name: ${res[i].product_name}`);
			console.log(`price: $ ${res[i].price}`);
			console.log(`stock_quantity: ${res[i].stock_quantity}`);
			console.log("---------------------");
			}
		addInventory();	
		}); 
};

function addInventory(){	
	inquirer.prompt([
		{
    		type: "input",
    		message: "Please enter the id of the item you would like to add inventory",
    		name: "id"
  		},
  		{
  			type: "input", 
  			message: "Please enter the quantity you wish to add",
  			name: "quantity"
  		},

  		]).then(function(data){
  			console.log("inventory added");
  			connection.query(
  				"SELECT * FROM products WHERE item_id = ?", data.id,
  				function(err, res){
					if(err) throw err;
				
			connection.query(
				"UPDATE products SET stock_quantity = ? WHERE item_id = ?", [(parseInt(res[0].stock_quantity) + parseInt(data.quantity)), data.id]
				,function(err, result){
				if(err) throw err;
				updatedStock = (parseInt(res[0].stock_quantity) + parseInt(data.quantity));
				console.log("Updated inventory: " + res[0].product_name + " quantity: " + updatedStock);
				managerMenu();
				});
  		});
	});
};

function managerMenu(){
	inquirer.prompt([
		{
    		type: "confirm",
    		message: "Return to menu?",
    		name: "confirm",
    		default: true
  		}

  		]).then(function(data){
  			if (data.confirm === true){
  				managerView();
  			}else{
  				console.log("Logging out");
  			}
  		})
};

function addProduct(){
	inquirer.prompt([
	{
		type: "input",
		message: "Name of product to add",
		name: "name"
	},
	{
		type: "input",
		message: "Department",
		name: "department"
	},
	{
		type: "input",
		message: "Price $",
		name: "price"
	},
	{
		type: "input",
		message: "stock quantity",
		name: "quantity"
	}
	]).then(function(data){

		connection.query(
				"INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)", [data.name, data.department, data.price, data.quantity]
				,function(err, result){
				if(err) throw err;
				console.log("You added: " + data.name + " quantity: " + data.quantity);
				managerMenu();
				});
	})
};
