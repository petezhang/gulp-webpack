"use strict";
var modules = ['common','module1','module2'];
var FileConfig = function(){

};
module.exports=new FileConfig();
FileConfig.prototype.modules=function(){
	return modules;
}