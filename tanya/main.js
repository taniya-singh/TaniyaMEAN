var math = require("./math.js");

console.log(math.add(2,3));
math.setName("kamal");
math.setId(2);

console.log(math.abc());



//

var express = require("express");
var app = express();

app.get("/", function(req,res){
	res.send("hello world");
})

app.listen(3000);
