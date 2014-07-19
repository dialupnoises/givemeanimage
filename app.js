var yesno = require('yesno'),
    colors = require('colors'),
    commander = require('commander'),
    fs = require('fs'),
    path = require('path'),
    nodeDir = require('node-dir'),
    open = require('open'),
    copyPaste = require('copy-paste'),
    imgur = require('imgur-node-api');

commander
	.version('0.1.0')
	.usage('<directory>')
	.option('-f, --filter [file types]', 'include only files with these types, comma-seperated (optional)')
	.option('-r, --recursive', 'search subdirectories too')
	.option('--imgurid [imgur client id]' , 'for image uploading')
	.parse(process.argv);

function error(msg)
{
	console.log(msg.red);
	process.exit(0);
}

if(!commander.args || commander.args.length == 0)
	error('You must provide an input directory!');

var directory = commander.args[0];
if(!fs.existsSync(directory))
	error('The supplied input directory doesn\'t exist!');

directory = path.resolve(directory);
console.log(('Finding an image in ' + directory).cyan);

var fileTypes;
if(commander.filter)
{
	console.log(('\tUsing filter: ' + commander.filter).cyan);
	fileTypes = commander.filter.split(',');
}

if(commander.imgurid)
	imgur.setClientID(commander.imgurid);

if(commander.recursive)
	console.log('\tSearching recursively'.cyan);

if(commander.recursive)
{
	nodeDir.files(directory, function(err, files) {
		if(err) error(err);
		if(commander.filter)
			finishedCallback(files.filter(function(file) {
				return fileTypes.indexOf(path.extname(file).substr(1)) != -1;
			}));
		else
			finishedCallback(files);
	});
}
else
{
	var found = [];
	var statsStarted = 0, statsFinished = 0;
	fs.readdir(directory, function(err, files) {
		files.forEach(function(file) {
			if(commander.filter && fileTypes.indexOf(path.extname(file).substr(1)) == -1)
				return;
			statsStarted++;
			fs.stat(path.join(directory, file), function(err, stat) {
				if(stat.isFile())
					found.push(path.join(directory, file));
				statsFinished++;
				if(statsFinished >= statsStarted)
					finishedCallback(found);
			});
		});
	});
}

function finishedCallback(files)
{
	console.log(('Found ' + files.length + ' files.').cyan);
	var file = files[Math.floor(Math.random() * files.length)];
	console.log('Random file: ' + file);
	askQuestions(file, files);
}

function askQuestions(file, files)
{
	yesno.ask('Open file?', true, function(ok) {
		if(ok)
			open(file);
		yesno.ask('Choose another file?', false, function(ok) {
			if(ok)
				finishedCallback(files);
			else
				yesno.ask('Copy to clipboard?', true, function(ok) {
					if(ok)
						copy(file);
					yesno.ask('Upload file?', true, function(ok) {
						if(!ok)
							process.exit(0);
						imgur.upload(file, function(err, res) {
							if(err) error(err);
							copy(res.data.link, function() {
								console.log(res.data.link);
								process.exit(0);
							});
						});
					});
				});
		});
	});
}