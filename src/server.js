const express = require('express')
const server = express()

// pegar o banco de dados
const db = require("./database/db")


// configurar pasta publica
server.use(express.static('public'))

// habilitar o uso do req.body na nossa aplicação
server.use(express.urlencoded({ extended: true }))


// utilizando template engine
const nunjucks = require('nunjucks')
nunjucks.configure('src/views', {
    express: server,
    noCache: true
})


// configurar caminhos da minha aplicação
// página inicial
// req: Requisiçã0
// res: Resposta
server.get('/', function(req, res) {
    return res.render('index.htm', { title: 'Um título' })
})

server.get('/create-point', (req, res) => {

    // req.query: Query strings da nossa url
    // console.log(req.query)


    return res.render('create-point.htm')
})

server.post("/savepoint", (req, res) => {

    // req.body: O corpo do nosso formulário
    // console.log(req.body)

    // inserir dados no banco de dados
    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `

    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if (err) {
            console.log(err)
            return res.send("Erro no cadastro!")
        }

        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("create-point.htm", { saved: true })
    }

    db.run(query, values, afterInsertData)

})


server.get('/search', (req, res) => {

    const search = req.query.search

    if (search == "") {
        // pesquisa vazia
        return res.render('search-results.htm', { total: 0 })
    }


    // pegar os dados do banco de dados
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
        if (err) {
            return console.log(err)
        }

        const total = rows.length

        // mostrar a página HTML com os dados do banco de dados
        return res.render('search-results.htm', { places: rows, total: total })
    })
})


//ligar o servidor

.listen(process.env.PORT || 5000)