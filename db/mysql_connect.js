const mysql=require('mysql')
require('dotenv/config')
var dbCoon=mysql.createConnection({
    user:process.env.mysql_user,
    password:process.env.mysql_password,
    database:process.env.mysql_db_name,
    host:process.env.mysql_instance_name
})
dbCoon.connect((err)=>{
    if(!err){
        console.log("veritabanına bağlantı")
    }else{
        console.log("bağlantı hatası")
    }
})
module.exports=dbCoon