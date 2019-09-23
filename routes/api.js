const router=require('express').Router();;
const bodyParser=require('body-parser');
const pusher=require('./pusher');
const conn=require('./db');
var itemsPerPage=0;
var maxNumPerPage=10;
var totalItems=0;
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
// to get all records from info table 
router.get('/all/:start',(req,res)=>{
    var pages=req.params.page || 1;
    var start=req.params.start || itemsPerPage;
    conn.getConnection((err,connect)=>{
        connect.query('select count(*) as total from info',(err,rows,fields)=>{
            if(err){
                throw err
            }else{
                if(rows.length > 0){
                    pages=rows[0].total/maxNumPerPage;
                    totalItems=rows[0].total;
                }
            }
        });
        connect.query('select * from info  order by id DESC limit '+start+','+maxNumPerPage,(err,rows,fields)=>{
            if(err){
                throw err
            }else{
                if(rows.length > 0){
                    res.json({
                        rows:rows,
                        itemsPerPage:itemsPerPage,
                        pages:pages,
                        totalItems:totalItems
                    });
                }else{
                    res.json({msg:"No Records have been added yet"});
                }
               connect.release();
            }
        });
    }); 
});


//to get only one record from info table
router.get('/info/:id',(req,res)=>{
    const id=req.params.id;
    conn.getConnection((err,connect)=>{
        connect.query('select * from info where id="'+id+'"',(err,rows,fields)=>{
            if(err){
                throw err
            }else{
                if(rows.length > 0){
                    res.json(rows);
                }else{
                    res.json({msg:"No Match was found for this id"});
                }
               connect.release();
            }
        });
    });    
});


//to delete only one record from info table
router.delete('/info/:id',(req,res)=>{
    const id=req.params.id;
    conn.getConnection((err,connect)=>{
        connect.query('delete from info where id="'+id+'"',(err,rows,fields)=>{
            if(err){
                throw err
            }else{
                if(rows.affectedRows > 0){
                   res.json({msg:"This Record was deleted successfully",data:rows});
                   pusher.trigger('channel-test','event-test',{
                    msg:'This Record was deleted successfully'
                   });
                }else{
                    pusher.trigger('channel-test','event-test',{
                        msg:'No Match was found for this id'
                       });
                    res.json({msg:"No Match was found for this id"});
                }
               connect.release();
            }
        });
    });
});


//to update only one record from info table
router.put('/info/:id',(req,res)=>{
    const id=req.params.id;
    const name=req.body.name;
    const age=req.body.age;
    const salary=req.body.salary;
    const hire_date=req.body.hire_date;
    const data=[name,parseInt(age),parseInt(salary),hire_date,parseInt(id)];
    conn.getConnection((err,connect)=>{
        connect.query("update info set name=? ,age=? ,salary=? , hire_date=? where id=?",data,(err,result)=>{
            if(err) {
               res.json({msg:"Something Went wrong"});
               pusher.trigger('channel-test','event-test',{
                msg:'Something Went wrong'
               });
               }else{
                res.json({msg:"Record was updated Successfully",data:data});
                pusher.trigger('channel-test','event-test',{
                    msg:'Record was updated Successfully'
                   });      
            }
                  connect.release();
        });
    });
});

//to insert only one record to info table
router.post('/info/add',(req,res)=>{
    const name=req.body.name;
    const age=req.body.age;
    const salary=req.body.salary;
    const hire_date=req.body.hire_date;
    const data=[name,parseInt(age),parseInt(salary),hire_date];
    conn.getConnection((err,connect)=>{
        connect.query("insert into info(name,age,salary,hire_date) values(?,?,?,?)",data,(err,result)=>{
            if(err) {
               res.json({msg:"Something Went wrong"});
               pusher.trigger('channel-test','event-test',{
                msg:'Something Went wrong'
               });
               }else{
                res.json({msg:"Record was added Successfully",data:data});
                pusher.trigger('channel-test','event-test',{
                    msg:'Record was added Successfully'
                   });
                }
                  connect.release();
        });
    });
});

module.exports= router;
