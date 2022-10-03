// const express = require('express');
// const path = require('path');

var express = require('express')
var exec = require('child_process').exec;
var fs = require('fs')
var app = express();
const path = require('path');
const bodyParser = require("body-parser");
var cors = require('cors')
app.use(bodyParser.urlencoded({extended:true}))

app.use(bodyParser.json())


// const app = express();

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// An api endpoint that returns a short list of items
var initcode  = `import sys \nsys.stdin = open('input'+sys.argv[1]+'.txt', 'r')\nstdoutOrigin=sys.stdout\nsys.stdout = open("log.txt", "w")\n`


app.post('/compile',(req,res)=>{
	console.log(req.body);
	let uid = Math.ceil(Math.random()*9000);
	// code = "print(input()//2)"
         // input =  "\"" +  req.body.input + "\"";
	//input =  input.split('\n').join("\"\\n\"") 
input = req.body.input
input = "\""+input+"\""
input = input.split("\n").join("\"\n\"")

console.log("input",input);	
code = initcode+req.body.code
	
	fs.writeFile("./file"+uid+".txt", code, function(err) {
		if(err) {
			return console.log(err);
		}
		console.log("codefile creation completed");
		fs.writeFile("./input"+uid+".txt", input , function(err) {
			if(err) {
				return console.log(err);
			}
	 exec("docker run --name "+uid+" -it -d sidd293/test ",(e,stdout,stderr)=>{
			if(e instanceof Error){
				// res.send(r)
				return;
			}
			cid  = stdout.toString(); 
			console.log(`docker cp input${uid}.txt ${uid}:/app`)
		console.log("docker server running",cid);
		exec("docker cp file"+uid+".txt "+uid+":/app",(e,stdout,stderr)=>{
			if(e instanceof Error){
				console.log(stderr.toString());
				return;
			}
			console.log("file copied")
		
			exec("docker cp input"+uid+".txt "+uid+":/app",(e,stdout,stderr)=>{
				if(e instanceof Error){
					console.log(stdout.toString());
					return;
				}
				console.log("file copied")
				console.log("docker exec "+uid+" node rce.js "+uid);
				exec("docker exec "+uid+" node rce "+uid,(e,stdout,stderr)=>{
					if(e instanceof Error){
						// res.send(r)
						return;
	
	
					}
					// let serr = ""
					let sout = ""
					exec("docker exec "+uid+" tail log.txt",(e,stdout,stderr)=>{
						if(e instanceof Error){
							// res.send(r)
							// res.send(stderr.toString())
						sout = stderr.toString()
							console.log(stderr);
							return;}
			sout =stdout.toString();


					console.log("output",stdout.toString());
					res.send(sout);
					exec("docker stop "+uid,(e,stdout,stderr)=>{
						if(e instanceof Error){
						//	res.send(sout);
							return;}
	
							exec("docker rm "+uid,(e,stdout,stderr)=>{
								if(e instanceof Error){
//									res.send(sout);
									return;}
			
				//	res.send(sout);
							// console.log("output",stdout.toString());
							// res.send(stdout.toString())
						
							});
	
	
	
	   
					// console.log("output",stdout.toString());
					// res.send(stdout.toString())
				
					});
					});
		
				console.log(stdout.toString());
				});
	
			
			});
	
	
	
	
		});
		})
		});  
	
	
	
	
	}); 
	
	})


app.get('/api/getList', (req,res) => {
	var list = ["item1", "item2", "item3"];
	res.json(list);
	console.log('Sent list of items');
});



// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
	res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = 5000;
app.listen(port);

console.log('App is listening on port ' + port);
