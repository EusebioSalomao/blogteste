//configurar a conexão com BD online

if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://salomao:terebango12@blogappbango.26ndxtk.mongodb.net/test"}
}else{
    module.exports = {mongoURI: "mongodb://localhost/blogapp"}
}