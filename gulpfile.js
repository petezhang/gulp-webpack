var gulp = require("gulp");

/*引入组件*/
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var rename = require('gulp-rename');
var contact = require('gulp-concat');
var uglify = require('gulp-uglify');
var webpack = require('webpack');
var rev = require('gulp-rev-append');
var connect = require('gulp-connect');
var clean = require('gulp-clean');
var notify = require('gulp-notify');
var imagemin = require('gulp-imagemin');

var webpackConfig = require('./webpack.config.js')
var FileConfig = require('./FileConfig.js');


// handleErrors
var handleErrors = function() {
	var args = Array.prototype.slice.call(arguments);
	notify.onError({
		title: 'compile error',
		message: '<%=error.message %>'
	}).apply(this, args);
	this.emit();
};

// taskList
var taskList = [];

// 服务器启动
gulp.task('connect', function() {
		connect.server({
			root: 'dist',
			port: '8010',
			livereload: true
		});
	})
	// 清除文件
gulp.task('clean', function() {
	return gulp.src('dist/').
	pipe(clean())
})

// webpack
gulp.task('webpack', function(callback) {
	var myConfig = Object.create(webpackConfig);
	webpack(myConfig, function(err, stats) {
		console.log(myConfig.entry)
		callback()
	})
})



// 默认任务
gulp.task('default', ['clean'], function(options) {
	var modules = FileConfig.modules();
	modules.forEach(function(module) {
		creatTask(module)
	});
	taskList.push('webpack');
	gulp.task('build and watch task', taskList, function() {
		console.log('=============== build finished and watch starting ==============='.green);
		gulp.start(['connect']);
	})
	gulp.start('build and watch task');
	})
// 创建task
function creatTask(module) {
	// html添加版本号
	gulp.task(module + '-html', function() {
			gulp.src('src/' + module + '/**/*.html').
			pipe(rev()).
			on('error', handleErrors).
			pipe(gulp.dest('dist/' + module + '/')).
			pipe(connect.reload());
		})
		// css 合并
	gulp.task(module + '-css', function() {
		gulp.src('src/' + module + '/css/**/*.css').
		pipe(contact('main.css')).
		pipe(less()).
		pipe(gulp.dest('dist/' + module + '/css')).
		pipe(connect.reload());
	})

	// 检查js代码
	gulp.task(module + '-jsHint', function() {
			gulp.src('src/' + module + '/js/**/*.js')
				.pipe(jshint())
				.on('error', handleErrors)
				.pipe(jshint.reporter('default')).
			pipe(connect.reload());
		})
		// 图片压缩
	gulp.task(module + '-imagemin', function() {
		gulp.src('src/' + module + '/img/**/*').
		pipe(imagemin()).
		pipe(gulp.dest('dist/' + module + '/img')).
		pipe(connect.reload());
	});
	taskList.push(module + '-html', module + '-css', module + '-jsHint', module + '-imagemin');
	watchTask(module);
};
// 创建watchTask
function watchTask(module){
	//代码监控
	gulp.task(module+'-watch', function() {
		gulp.watch('src/'+module+'/js/**/*.js', [module+'-jsHint','webpack']);
		gulp.watch('src/'+module+'/**/*.html', [module+'-html']);
		gulp.watch('src/'+module+'/css/**/*.css', [module+'-css']);
		gulp.watch('src/'+module+'/img/**/*.{jpg,png,gif,svg}', [module+'-imagemin']);
	});
	gulp.start(module+'-watch')
}