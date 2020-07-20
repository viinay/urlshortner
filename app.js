const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const monk = require('monk');
const morgan = require('morgan');//logger
const nanoid = require('nanoid');
const urlSchema = require('./models/urls');
const app = express();

//MIDDLEWARES
app.use(express.json());
app.use(express.static('./public'));
app.use(cors())
app.use(morgan('tiny'))
app.use(helmet())

//MONGODB
const db = monk('localhost/ulrshortner')
const urlcol = db.get('urls')
urlcol.createIndex({'slug':1},{unique:1})

//ROUTES
app.get('/',(req,res)=>{
    console.log('root route')
    res.json({
        message:'root route active'
    })
})

app.post('/url',async (req,res,next)=>{
    let {slug,url} = req.body;
    try{
        await urlSchema.validate({
            slug,
            url
        });

        if(!slug){
            slug = await nanoid(5);
        }
        slug = slug.toLowerCase();
        const newUrl = {slug,url}
        const created = await urlcol.insert(newUrl)
        res.json(created)
    }catch(error){
        if(error.message.startsWith('E11000')){
            error.message = `Slug ${slug} already in use.`
            return next(error)
        }
        next(error)
    }
})

app.use((error,req,res,next)=>{
    if(error.status){
        res.status(error.status);
    }else{
        res.status(500);
    }

    res.json({
        message:error.message,
        stack:error.stack
    })
})

app.get('/:slug',async (req,res)=>{
    let { slug } = req.params;
    slug = slug.toLowerCase();
    try{
        const url = await urlcol.findOne({slug});
        if(!url){
            res.redirect(`/?error=${slug} not found`)
        }else{
            res.redirect(url.url)
        }
    }catch(error){
        if(error.status){
            res.status(error.status)
        }else{
            res.status(500)
        }
        res.redirect(`/?error=page not found`)
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>console.log(`app listening on http://localhost:${PORT}`))