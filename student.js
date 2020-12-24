console.log("hello")
var express = require('express')
var app=express();
var cors= require('cors');
var mysql = require('mysql')
var bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(cors())

const db = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'root',
    database:'projectdb'
})

app.get("/api/getResult", (req,res)=>{

    let sql = "select * from Candidate_Detail where first_round= (select max(first_round) from Candidate_Detail)";
    let sql1= "select avg(first_round) as avg_score from Candidate_Detail"

    let sql2="select * from Candidate_Detail where second_round= (select max(second_round) from Candidate_Detail)";
    let sql3= "select avg(second_round) as avg_score from Candidate_Detail"
    
    let sql4="select * from Candidate_Detail where third_round= (select max(third_round) from Candidate_Detail)";
    let sql5= "select avg(third_round) as avg_score from Candidate_Detail"


    db.query(sql,(err,result)=>{
        console.log(result);
        console.log(result[0].username)
        val=result[0].username
        

        db.query(sql1,(err,result1)=>{
            val1=result1[0].avg_score;
           // res.json({Stage:"Round One", Highest_Score:val, Average_Score:val1})
        })
       
        db.query(sql2,(err,result2)=>{
       

               val2=result2[0].username;

        })

        db.query(sql3,(err,result3)=>{

            val3=result3[0].avg_score;

})

    db.query(sql4,(err,result4)=>{

    val4=result4[0].username;

})
db.query(sql5,(err,result5)=>{

    val5=result5[0].avg_score;

    res.json({ Round_One:{
            Highest_Score1:val,
             Average_Score1:val1,
    },
             
             Round_Two:{   
             Highest_Score2:val2,
             Average_Score2:val3
            },
      
            Round_Three:{
            Highest_Score3:val4,
            Average_Score3:val5,
            }
            
            })

})

        })


    })
    
   






app.post('/addStudent', function(req,res){

    const {student_id,username,first_round,second_round,third_round,email} =req.body
  let msg={};
    db.getConnection(function(err){
        if(err){
            console.log("connection failed" + err)
        }
 else{

    const sql="insert into Candidate_Detail (student_id,username,first_round,second_round,third_round,email) values (?,?,?,?,?,?)";
    let fill=[student_id,username,first_round,second_round,third_round,email];
    db.query(sql,fill ,(err,result)=>{
       //console.log(result);
       if(err){
           console.log(err)
           console.log("insertion failed" + err)
       }else{
          
          db.query("select * from Candidate_Detail",(err,result)=>{
             if(!err && result.length>0){
                 console.log(result)
                 
               res.send({result,msg:"successfully added student"});
             }else{
                 console.log("error")
             }
          }) 
       }
    })
}
    })
});

//Based on the name you will get the score of all the test.
app.get('/getScore/:name',function(req,res){

    const name= req.params.name
    db.getConnection(function(err){
        if(err){
            console.log(err)
        }else{

            let fill=[name];
            let sql= "select * from Candidate_Detail where username=?"

            db.query(sql,fill,(err,result)=>{
                if(!err && result.length>0){
                    console.log(result)
                    res.json({First_Round_Score:result[0].first_round,
                        Second_Round_Score:result[0].second_round,
                        third_Round_Score:result[0].third_round
                    })
                }
            })
           
        }
    })
})


app.listen(700, function(){
    console.log("server is up and runnning ")
})

