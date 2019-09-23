const express=require('express');
const moment = require('moment');
const router=express.Router();
const http = require('http');
router.get('/',(req,res)=>{
res.render('index',{
    title:"Home Page",
    homeURL:"/",
    infoURL:"/page"
});
});
router.get('/new',(req,res)=>{
res.render('newRecord',{
    title:"Add New Record"
})
});
router.get('/page',(req,res,next)=>{
    var fullUrl = req.protocol + '://' + req.get('host');
    var collectData='';
    var final='';
    const page = req.params.page || 1; // Page
    const items=req.params.items || 0;
    http.get(fullUrl+'/api/all/'+items,(response)=>{
        response.on('data',function(chunk){
            collectData += chunk;
        });
        response.on('end',()=>{
            final = JSON.parse(collectData);
            console.log(final);
            var formatedData=[];
            var empty=true;
            if(final.rows == undefined){
                final.rows=0;
            }else if(final.rows.length > 0  ){
                empty=false;
                final.rows.forEach(element => {
                    var hireDate=moment(element.hire_date).format('YYYY-MM-DD');
                    var diffDuration = moment.duration(moment().diff(hireDate));
                    var obj={
                        id:element.id,
                        name:element.name,
                        age:element.age,
                        salary:element.salary,
                        hire_date:moment(element.hire_date).format('YYYY-MM-DD'),
                        hired_since:diffDuration.years() +" years " + parseInt(diffDuration.months()) +" months" +  diffDuration.days() + " days" 
                    }
                    formatedData.push(obj);
                });
            }

            res.render('page',{
                title:'Info Page Using Twig Template',
                data:formatedData,
                isEmpty:empty,
                msg:final.msg,
                pages:final.pages,
                currentPage:page,
                itemsPerPage:parseInt(final.itemsPerPage),
            });

        });
    });



});
/*
router.get('/',(req,res,next)=>{
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    var collectData='';
    var final='';
    const page = req.params.page || 1; // Page
    http.get(fullUrl+'api/all/'+page,(response)=>{
        response.on('data',function(chunk){
            collectData += chunk;
        });
        
        response.on('end',()=>{
            final = JSON.parse(collectData);
            var formatedData=[];
            var empty=true;
            if(final.rows.length > 0 ){
                empty=false;
                final.rows.forEach(element => {
                    var hireDate=moment(element.hire_date).format('YYYY-MM-DD');
                    var diffDuration = moment.duration(moment().diff(hireDate));
                    var obj={
                        id:element.id,
                        name:element.name,
                        age:element.age,
                        salary:element.salary,
                        hire_date:moment(element.hire_date).format('YYYY-MM-DD'),
                        hired_since:diffDuration.years() +" years " + parseInt(diffDuration.months()) +" months" +  diffDuration.days() + " days" 
                    }
                    formatedData.push(obj);
                });
            }

            res.render('index',{
                title:'Home Page Using Twig Template',
                data:formatedData,
                isEmpty:empty,
                msg:final.msg,
                pages:final.pages,
                currentPage:page,
                nextPage:parseInt(page) +1
            });
        });
    });
});
*/
router.get('/info/:id',(req,res,next)=>{
    var id=req.params.id;
    var fullUrl = req.protocol + '://' + req.get('host') ;
    var collectData='';
    var final='';
    var foramtedData=[];
    http.get(fullUrl+'/api/info/'+id,(response)=>{
        response.on('data',function(chunk){
            collectData += chunk;
        });
        response.on('end',()=>{
            final=JSON.parse(collectData);
            final.forEach(element => {
                var hireDate=moment(element.hire_date).format('YYYY-MM-DD');
                var diffDuration = moment.duration(moment().diff(hireDate));
                var obj={
                    id:element.id,
                    name:element.name,
                    age:element.age,
                    salary:element.salary,
                    hire_date:moment(element.hire_date).format('YYYY-MM-DD'),
                    hired_since:diffDuration.years() +" years " + parseInt(diffDuration.months()) +" months" +  diffDuration.days() + " days" 
                }
                foramtedData.push(obj);
            });
            res.render('details',{
                title:'More Info Details Page Using Twig Template',
                data:foramtedData
                        });
        });
    });
});

// This page is not implemented yet
router.get('/contactus',(req,res,next)=>{
    res.send('Contact Us Page')
});

// This page is not implemented yet
router.get('/aboutus',(req,res,next)=>{
    res.send('About Us')
});

// This page is not implemented yet
router.get('/helpus',(req,res,next)=>{
    res.send('Help  Us')
});

module.exports=router;