var express = require('express');
var bodyParser = require('body-parser');
const fs = require('fs');
var app = express();
/*
Write a server that receives transactions and compiles them in to blocks. The blocks should:
- Contain no more than 10 transactions per block
- Include the 10 most profitable transactions as of the time the block is created
 */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
		extended: true
	}));
app.listen(2000);

function GetSortOrder(prop) {
	return function (a, b) {
		if (a[prop] < b[prop]) {
			return 1;
		} else if (a[prop] > b[prop]) {
			return -1;
		}
		return 0;
	}
}
//var blocks;
var blocks = [];
function Create2DArray(rows) {
	var arr = [];

	for (var i = 0; i < rows; i++) {
		arr[i] = [];
	}

	return arr;
}

let doProcess = async function (robj) {
	return new Promise(function (resolve, reject) {
		var obj = robj;
		var bal;
		var newdata;
		var exx = false;
		fs.exists('tempstore.json', function (exists) {

			if (exists) {
				fs.readFile('tempstore.json', function readFileCallback(err, data) {

					newdata = data;
					exx = true;
					//obj = req.body;


				});
			} else {
				//obj = req.body;
				console.log("tempdatastore not found");
			}
		});
		console.log("%%%%%%%%%%");
		if (exx) {
			var job = JSON.parse(newdata);
			//console.log("job count =" + job.length);
			var m = job.length;
			var ct = 0;
			for (var item2 in job) {
				ct++;
				console.log("ct=" + ct);
				obj.push(JSON.stringify(job[item2]));
				console.log("pushed " + JSON.stringify(job[item2]));
				if (ct == m) {
					//console.log("exceeded");
					//console.log(" obj count=" + obj.length);
					break;
					return false;
				}
			}
		}
		obj.sort(GetSortOrder("profit"));

		var i = 0;
		var k = 0;
		var bst2 = "";
		var oct = obj.length;
		for (var item in obj) {

			//console.log(i + ".." + obj[item].profit);
			var bst = JSON.stringify(obj[item]);
			bst2 = bst2 + bst;

			i++;

			if (i == 10) {

				i = 0;
				var nblok = [];
				var bst3 = "block" + k + ":" + bst2
					nblok.push(bst3);
				bst3 = "";
				var fname = Date.now() + 'blocks.txt';
				fs.writeFile(fname, nblok, function (err, result) {
					if (err)
						console.log('error', err);
					console.log(" Blocks written to " + fname);
				});
				bst2 = "";
				k = k + 1;
				//console.log("incremented k=" + k);
				var q = k * 10;
				if (oct < 10 * (k + 1)) {

					bal = obj.slice(q, oct);
					//console.log("finished looping");
					break;

				}
			}

		}

		resolve(bal);
	});
	//resolve(obj);
}

let fileSave = async function (obj) {
	return new Promise(function (resolve, reject) {

		var json = JSON.stringify(obj);

		fs.exists('tempstore.json', function (exists) {

			if (exists) {

				//console.log("yes file exists");
				fs.unlinkSync('tempstore.json');
			} else {
				//console.log(" creating file");
				fs.writeFileSync("tempstore.json");
			}
		});

		fs.writeFile('tempstore.json', json, function (err, result) {
			if (err)
				console.log('error', err);
		});
		resolve("200");
	});
}
app.post("/", async function (req, res) {
	//console.log(req.body) // populated!
	var obj = req.body;
	//blocks = Create2DArray(10);
	//console.log(" length is " + obj.length);

	let result = await doProcess(obj);
	let flr = await fileSave(result);
	//let flr = result;
	res.send(200, flr);

});
