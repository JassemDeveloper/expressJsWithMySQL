$(document).ready(function(){
var page=1;
var start=0;
paginationDiv=$('#pagination');
dataDiv=$('#data');
$.ajax({
    url:'/api/all/'+start,
    method:"get",
    success:function(res){
            var loadmore='<a class="btn btn-primary" id="loadMore">Load More</a>'
            if(page == 1){
                start=res.itemsPerPage + 10;
                var data='';
                res.rows.forEach(function(i){
                    data +="<div class='col-4 animation'>";
                    data +="<a href='/info/"+i.id+"'>";
                    data +="<div class='card' >";
                    data +="<div class='row'>";
                    data +="<div class='col-6'>";
                    data +="<img class='profile-img' src='/img/profile.png'>";
                    data +="</div>";
                    data +="<div class='col-6'>";
                    data +="<b> Name: </b><br/>";
                    data +=i.name+"<br/>";
                    data +="<b> age: </b><br/>";
                    data +=i.age+"<br/>";
                    data +="<b> Hire Date: </b><br/>";
                    data +=formatDate(i.hire_date)+"<br/>";
                    data +="</div>";
                    data +="</div>";
                    data +="</div>";
                    data +="</a>";
                    data +="</div>";
                });
                dataDiv.html(data);
            }
            if(res.pages > 1 ){
                paginationDiv.html(loadmore);
                $('#loadMore').on('click',function(){
                    page=page+1;
                    if(parseInt(res.pages) > 1 && page < (parseInt(res.pages)+1)){
                        start=start + 10;
                        $.ajax({
                            url:'/api/all/'+start,
                            method:"get",
                            success:function(res){
                                var data='';
                                res.rows.forEach(function(i){
                                    data +="<div class='col-4  animation'>";
                                    data +="<a href='/info/"+i.id+"'>";
                                    data +="<div class='card' >";
                                    data +="<div class='row'>";
                                    data +="<div class='col-6'>";
                                    data +="<img class='profile-img' src='/img/profile.png'>";
                                    data +="</div>";
                                    data +="<div class='col-6'>";
                                    data +="<b> Name: </b><br/>";
                                    data +=i.name+"<br/>";
                                    data +="<b> age: </b><br/>";
                                    data +=i.age+"<br/>";
                                    data +="<b> Hire Date: </b><br/>";
                                    data +=formatDate(i.hire_date)+"<br/>";
                                    data +="</div>";
                                    data +="</div>";
                                    data +="</div>";
                                    data +="</a>";
                                    data +="</div>";
                                });
                                dataDiv.append(data);
                            },
                            error:function(err){
                                console.log(err);
                            }
                });
            }else{
                    paginationDiv.html('No More data to be loaded');
            }
        });


    }

        },
    error:function(err){
        console.log(err);
    }
});

$("#myform").submit(function(e){
   var form= $('#myform').serialize();
   $.ajax({
    url:'/api/info/add',
    method:"post",
    data:form,
    success:function(res){
        bootbox.alert(res.msg);
        setTimeout(function(){
            window.location.reload(true);
        },2000);
    },
    error:function(err){
        console.log(err);
    }
})
    return false;
});

clickableB=$('.clickableB');
clickableB.on('click',function(e){
    e.preventDefault();
    var id=this.getAttribute('data-id');
    var action=this.getAttribute('data-action');
   if(action == 'delete'){
       showBox('confirm Delete Action',function(result){
        if(result){
                $.ajax({
                    url:'/api/info/'+id,
                    method:"delete",
                    success:function(res){
                        bootbox.alert(res.msg +" <br/>you will be redirected to home page in 3 seconds");
                        setTimeout(function(){
                            window.location.href='/';
                        },3000);
                    },
                    error:function(err){
                        console.log(err);
                    }
                })
          }else{
            bootbox.alert("You Clicked Cancelled");  
          }
       });
   }else if(action == 'update'){
    showBox('confirm Update Action',function(result){
        if(result){
            $('#deleteB').hide();
            $('#updateB').hide();
            $('#saveB').show();
            $('#cancelB').show();
            $('.field').prop("disabled", false);
          }else{
            bootbox.alert("You Clicked Cancelled");  
          }
       });
    }else if(action == 'save'){
    showBox('confirm Save Action',function(result){
        if(result){
            var form=$('#myform').serialize();
            $.ajax({
                url:'/api/info/'+id,
                method:"put",
                data:form,
                success:function(res){
                    bootbox.alert(res.msg);
                    setTimeout(function(){
                        window.location.reload(true);
                    },2000);
                },
                error:function(err){
                    console.log(err);
                }
            })
          }else{
            bootbox.alert("You Clicked Cancelled");  
          }
       });
   }else if(action == 'cancel'){
        $('#deleteB').show();
        $('#updateB').show();
        $('#saveB').hide();
        $('#cancelB').hide();
        $('.field').prop("disabled", true);
   }else if(action == 'clear'){
    $(this).closest('form').find("input[type=text]").val("");
   }

});

function showBox(msgArg,callbackArg){
    bootbox.confirm({
        message: msgArg,
        buttons: {
            confirm: {
                label: 'Yes',
                className: 'btn-danger'
            },
            cancel: {
                label: 'No',
                className: 'btn-primary'
            }
        },
        callback: function (result) {
            callbackArg(result);
        }
    });
}
});

function formatDate(dateArg){
var date=new Date(dateArg);
var year=date.getFullYear();
var month=date.getMonth()+1;
var day=date.getDate();

return month +"/"+day + "/"+year;
}