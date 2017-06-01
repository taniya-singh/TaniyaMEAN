var name, id;

var addFunction = function(n1,n2){
	return n1 + n2;
}

exports.setName = function(n3){
	name = n3;
}

exports.setId = function(n4){
	id = n4;
}


exports.abc = function(){
 return {
	name: name,
	id: id
	}
 
}

exports.add = addFunction;

