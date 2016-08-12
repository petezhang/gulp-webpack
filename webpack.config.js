var path = require('path');
var FileConfig = require('./FileConfig.js');
var entrys=initEntry();

module.exports = {
	entry: entrys,
	output: {
		path: path.join(__dirname, 'dist/'),
		filename: '[name].js'
	}
};
// 初始化多入口配置
function initEntry(){
	var entrys={};
	var modules = FileConfig.modules();
	modules.forEach(function(module) {
		entrys[module+'/js/index']='./src/'+module+'/js/index.js'
	});
	console.log(entrys);
	return entrys;
}
