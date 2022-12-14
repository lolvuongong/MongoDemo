const { ObjectId } = require('bson')
var expesss = require('express')
var app = expesss()

var mongoClient = require('mongodb').MongoClient
var url = 'mongodb://0.0.0.0:27017'

app.set('view engine','hbs')
app.use(expesss.urlencoded({extended:true}))

app.get('/edit',async(req,res)=>{
    const id = req.query.id
    let client = await mongoClient.connect(url)
    let db = client.db("GCH1003")
    const productToEdit  = await db.collection('products').findOne({_id:ObjectId(id)})
    res.render("edit", {product: productToEdit})
})

app.post('/edit',async(req,res)=>{
    const id = req.body.id
    const name = req.body.txtName
    const price = req.body.txtPrice
    const picUrl = req.body.txtPic
    let client = await mongoClient.connect(url)
    let db = client.db("GCH1003")
    await db.collection("products").updateOne({_id:ObjectId(id)},
                    {$set :{"name":name,"price":price,"picture":picUrl}})
    res.redirect('/view')
})

app.get('/delete',async (req,res)=>{
    const id = req.query.id
    let client = await mongoClient.connect(url)
    let db = client.db("GCH1003")
    await db.collection("products").deleteOne({_id:ObjectId(id)})
    res.redirect('/view')
})

app.get('/view',async (req,res)=>{
    let client = await mongoClient.connect(url)
    let db = client.db("GCH1003")
    let results = await db.collection("products").find().toArray()
    console.log(results)
    res.render('allProduct',{results:results})
})

app.post('/new',async (req,res)=>{
    const name = req.body.txtName
    const price = req.body.txtPrice
    const picUrl = req.body.txtPic
    const newProduct = {
        name :name,
        price: Number.parseFloat(price),
        picture: picUrl
    }
    let client = await mongoClient.connect(url)
    let db = client.db("GCH1003")
    let id = await db.collection("products").insertOne(newProduct)
    console.log(id)
    res.render('home')

})

app.get('/new',(req,res)=>{
    res.render('newProduct')
})

app.get('/',(req,res)=>{
    res.render('home')
})

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log("Server is running!")

