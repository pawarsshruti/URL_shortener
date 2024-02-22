const express=require("express")
const mongoose=require("mongoose")
//const ShortURL=require("./models/shorturl");
const shortUrl = require("./models/shorturl");
const app=express()

mongoose.connect('mongodb://localhost/urlShortener',
{
    useNewUrlParser: true, 
  useUnifiedTopology: true,
});



app.set('view engine','ejs')
app.use(express.urlencoded({extended:false}))


app.get("/", async(req,res) =>
{
    const shortUrlsList= await shortUrl.find()
  res.render('index',{shortUrls:shortUrlsList})
})

app.post("/shortUrls",async(req,res)=>
{
    const fullUrl=req.body.fullUrl;
    await shortUrl.create({full:fullUrl  })
    res.redirect("/")
        }
    )

app.get("/:shortUrl", async (req,res) =>
{
    const foundShortUrl = await shortUrl.findOne({
        short: req.params.shortUrl 
    })
    if(foundShortUrl == null)  return res.sendStatus(404);
    
    foundShortUrl.clicks++;
    foundShortUrl.save();

    return res.redirect(foundShortUrl.full);

});

app.listen(process.env.PORT || 5000)

