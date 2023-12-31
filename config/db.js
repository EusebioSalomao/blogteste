//configurar a conexão com BD online
/*
if(process.env.NODE_ENV == "production"){
	console.log("Aguardando a conexão online...")
    module.exports = {mongoURI: "mongodb+srv://salomao:terebango12@cluster01.t0vjw4p.mongodb.net/?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoURI: "mongodb://localhost/blogapp"}
}*/
const mongoose = require("mongoose")

const connectDB = ()=>{
	console.log("Aguardando a conexão online...");
	mongoose.connect("mongodb+srv://salomao:terebango12@cluster01.t0vjw4p.mongodb.net/?retryWrites=true&w=majority").then(()=>{
		console.log("BD Atlas conectado com sucesso!")
	}).catch(()=>{
		console.log("Erro com a conexão, BD Atlas!")
		mongoose.connect("mongodb://127.0.0.1/blogapp").then(()=>{
		console.log("BD Local conectado com sucesso!")
	}).catch(()=>{
		console.log("Erro com a conexão, BD Local!")
	})
	})
}


module.exports = connectDB