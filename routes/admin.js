const express = require('express')
const router = express.Router()

    //Inportando o modulo categoria da pasta modles
    const mongoose = require('mongoose')
const { redirect } = require('statuses')
    require('../modles/Categoria')
    const Categoria = mongoose.model('categorias')
    require("../modles/Postagem")
    const Postagem = mongoose.model('postagens')
    const {eAdmin} = require('../helpers/eAdmin')

router.get("/", (req,res)=>{
    res.render('admin/index')
})

router.get('/posts', eAdmin, (rq,res)=>{
    res.send('Pagina de Posts')
})

router.get("/categorias", eAdmin, (req,res)=>{
    Categoria.find().lean().then((categorias) => {
        res.render('admin/categorias', {categorias: categorias})
    }).catch((err)=>{
        req.flash('error_msg', 'Houve erro ao carregar Categorias!')
        res.redirect('/adm')
    })
})
router.get('/categorias/add', eAdmin, (req,res)=>{
    res.render('admin/addcategorias')
})

//Rota que cria a Categoria
router.post('/categorias/nova', eAdmin, (req,res)=>{

    var erros = []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null ){
        erros.push({texto: 'Nome da categoria invalido!'})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: 'Slug da categiria invalido!'})
    }
    if(req.body.nome.length < 2){
        erros.push({texto: 'Nome da categoria muito pequeno!'})
    }
    if(erros.length > 0){
        res.render('admin/addcategorias', {erros: erros})
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
            
        }
        new Categoria(novaCategoria).save().then(()=>{
            req.flash('success_msg', 'Categoria criada com sucesso!')
            res.redirect('/adm/categorias')
        }).catch((err)=>{
            req.flash('error_msg', 'Hou um erro ao criar categoria!')
            res.redirect('/adm/addcategorias')
        })
    }

   
})

router.get('/categorias/lista', (req,res)=>{
    res.render('admin/categorias')
})
//Editar categoria
router.get("/categorias/edit/:id", eAdmin, (req,res)=>{
    Categoria.findOne({_id: req.params.id}).lean().then((categoria)=>{
        res.render('admin/editcategorias', {categoria : categoria})
    }).catch((err)=>{
        req.flash('error_msg', 'Essa Categoria não existe')
        res.redirect('/adm/categorias')
    })
    
})
//Salvar Edição categoria
router.post('/categorias/salvarEdicao', eAdmin, (req,res)=>{
    Categoria.findOne({_id: req.body.id}).then((categoria)=>{
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug
        categoria.save().then(()=>{
            req.flash('success_msg', 'Categpria editada com sucesso!')
            res.redirect('/adm/categorias')
        }).catch((error)=>{
            req.flash('error_msg','Houve um erro ao salvar a edição de categoria')
        res.redirect('adm/categorias')
        })
    }).catch((error)=>{
        req.flash('error_msg', 'Houve um erro ao editar a categoria!')
        res.redirect('adm/categorias')
    })
})

router.post("/categorias/deletar", eAdmin, (req,res) =>{
    Categoria.remove({_id: req.body.id}).then(()=>{
        req.flash("success_msg", "Categoaria eliminada com sucesso!")
        res.redirect("/adm/categorias")
    }).catch((err)=>{
        req.flash("error_msg", "Hou um erro a eliminar categoria")
        res.redirect("/adm/categorias")
    })
} )

//Rota de Postagens
router.get("/postagens", eAdmin, (req,res)=>{
    Postagem.find().lean().populate("categoria").sort({data: "desc"}).then((postagens)=>{
        res.render("admin/postagens", {postagens: postagens})
    }).catch((err)=>{
        req.flash("error_msg", "Houve erro ao listar as postagens")
        console.log("Erro ao listar as postagenes")
        res.redirect("/adm")
    })
})

//Adicionar(regiatrar) postagens
router.get("/postagens/add", eAdmin, (req,res)=>{
    Categoria.find().lean().then((categorias)=>{
        res.render("admin/addpostagem", {categorias: categorias})
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao carregar as categorias")
        res.redirect("/adm/postagens")
    })
})

//Salvar postagem
router.post("/postagens/nova", eAdmin, (req, res)=>{
    var erros = []

    if(req.body.categoria == "0"){
        erros.push({texto: "Categoria invalida, selecione uma categoria"})
    }
    if(erros.length > 0){
        res.render("admin/addpostagem", {erros: erros})
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }
        new Postagem(novaPostagem).save().then(()=>{
            req.flash("success_msg", "Postagem criada com sucesso!")
            res.redirect("/adm/postagens")
        }).catch((error)=>{
            req.flash("error_msg", "Erro ao criar postagem")
            res.redirect("/adm/postagens")
        })
    }  
})
//...........................................Não concluido
//Editar postagem
router.get("/postagens/edit/:id", eAdmin, (req,res)=>{
    Postagem.findOne({_id: req.params.id}).lean().then((postagem)=>{
        Categoria.find().lean().then((categorias)=>{
            res.render("admin/editpostagem", {categorias: categorias, postagem: postagem, teste: "Testar edição de post"})
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro ao interno na edição")
            res.redirect("/adm/postagens")
        })
    }).catch((err)=>{
        req.flash("error_msg", "Erro ao carregar postagem na edição")
        res.redirect("/adm/postagens")
    })
})//****************************************************************************************** */

//Deletar Postagem
router.get("/postagens/deletar/:id", eAdmin, (req,res)=>{
    Postagem.remove({_id: req.params.id}).then((postagem)=>{
        res.redirect("/adm/postagens")
    })
})


/*Exportação*/
module.exports = router