require('dotenv').config();
const express =require('express');
const app = express();
const path=require('path');
const port = process.env.PORT;
const api=require('./routes/api');

const siteRoutes=require('./routes/siteRoutes');
//static files
app.use(express.static(path.join(__dirname,'public')));
//set engine view
app.set('views','./views/');
app.set('view engine','twig');
app.use('/',siteRoutes);
app.use('/api',api);

app.listen(port,()=>{
    console.log(`listening on this port ${port}`)
});


