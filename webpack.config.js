var path = require('path');
var glob = require('glob');
var webpack=require('webpack');
var FileConfig = require('./FileConfig.js');
var entrys=initEntry();

module.exports = {
	entry: entrys,
	output: {
		path: path.join(__dirname, 'dist/'),
		filename: '[name].js',
		publicPath:'./',
	},
	module:{
		loaders:[
		]
	},
	plugins:[
		new webpack.optimize.CommonsChunkPlugin({
			name:'common',
			filename:'static/common.js',
			minChunks:2
		})
	]
};
// 初始化多入口配置
function initEntry(){
	var entrys={};
	var modules = FileConfig.modules();
	modules.forEach(function(module) {
		_init_('./src/'+module+'/js/*.js')
	});
	function _init_(globPath,pathDir){
		var files = glob.sync(globPath,pathDir);
		for (var i = 0; i < files.length; i++) {
			var entry = files[i];
			var dirname = path.dirname(entry);
			var extname = path.extname(entry);
			var basename = path.basename(entry, extname);
			var pathname = path.join(dirname, basename);
			pathname =pathname.replace(/^src\\/, '');
			entrys[pathname] = entry;
			// console.log(dirname+'===='+extname+'===='+basename+'===='+pathname+'===='+entry)
		}
	}
	return entrys;
}
