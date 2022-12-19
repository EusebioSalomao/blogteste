const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
require('../modles/Usuario')
const Usuario = mongoose.model('usuarios')
const bcrypt = require('bcryptjs')
const passport = require('passport')

//Rotas de registro de usuario
    //Formulario de registro de usuario
    router.get('/registro', (req,res)=>{
        res.render('usuarios/registro')
    })

    //Salvar registro de usuario
        router.post('/registro', (req, res)=>{
            var erros = []
            if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
                erros.push({texto: 'Nome de usuario invalido!'})
            }
            if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
                erros.push({texto: 'email invalido!'})
            }
            if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
                erros.push({texto: 'Senha invalida'})
            }

            if(req.body.senha.length < 4){
                erros.push({texto: 'Senha muito curta! A senha deve ter no mínimo 4 caracter.'})
            }
            if(req.body.senha != req.body.senha2){
                erros.push({texto: 'As senhas são diferentes!'})
            }

            if(erros.length > 0){
                res.render('usuarios/registro', {erros})
            }else{
                Usuario.findOne({email: req.body.email}).then((usuario)=>{
                    if(usuario){
                        req.flash('error_msg', 'Já existe uma conta com este email cadastreado no nosso sistema!')
                        res.redirect('/user/registro')
                    }else{
                        const novoUsuario = {
                            nome: req.body.nome,
                            email: req.body.email,
                            senha: req.body.senha
                        }

                        bcrypt.genSalt(10, (erro, salt) =>{
                            bcrypt.hash(novoUsuario.senha, salt, (erro, hash) =>{
                                if(erro){
                                    req.flash('error_msg', 'Houve um erro ao encripitar a senha')
                                    res.redirect('/user/registro')
                                }

                                novoUsuario.senha = hash
                                new Usuario(novoUsuario).save().then(()=>{
                                    req.flash('success_msg', 'Usuario criado com sucesso!')
                                    res.redirect('/')
                                }).catch((eror)=>{
                                    req.flash('error_msg', 'Houve um erro ao salvar usuario')
                                })

                            })
                        })

                    }

                }).catch((error)=>{
                    req.flash('error_msg', 'Hou um erro ao pesquisar email de usuario')
                    res.redirect('/')
                })
            }

        })

        //rota de login
        router.get('/login', (req,res)=>{
            res.render('usuarios/login')
        })

        router.post('/login', (req, res, next)=>{
            passport.authenticate('local', {
                successRedirect: '/',
                failureRedirect: '/user/login',
                failureFlash: true
            })(req, res, next)
        })

        router.get('/logout', (req, res, next) => {
            req.logout(function(err) {
                if (err) { return next(err) }
                req.flash('success_msg', 'Sessão encerrada com sucesso!')
                res.redirect('/')

              })
        })






//++++++++++++++++++++++ Exptotação do modulo
module.exports = router