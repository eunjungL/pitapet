const { response } = require('express');
const express = require('express');
const app = express();
const body_parser = require('body-parser');
app.use(body_parser.urlencoded({ extended: false}));
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-pool');
const cron = require('node-cron');

// router header add
const register_router = require('./create_animal');
const qna_router = require('./question_and_answer');
const review_router = require('./review');
const information_router=require('./information');
const signup_router = require('./signup_test');
const mypage_router=require('./mypage');
const hospital_router=require('./hospital');
const store_router=require('./store');
const board_router=require('./board_and_comment');
const care_service_router = require('./create_care_service');

app.use(express.static('upload'));

const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

var db = require('./db');


app.use(session({
    key: 'LoginSession',
    secret: 'Secret',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({
        host: 'localhost',
        user: 'dldms',
        password: 'password!',
        database: 'pit_a_pet'
    })
}))




app.get('/login',(req,res)=> { 
    var current=``;
            if(req.session.user_id){//로그인 한 경우
                var id=req.session.user_id;
                current=`<li> <a href="/logout">로그아웃</a> </li>
                <li> <a href="/mypage">${id}--마이페이지</a> </li>`
                console.log(id)
            }
            else{
                current=`<li> <a href="/login">로그인</a> </li>
                <li> <a href="/signup">회원가입</a> </li>`
            }
    var output=`
        
        <head>
        <title>login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" charset="utf-8">
        <script src="https://kit.fontawesome.com/9702f82de3.js" crossorigin="anonymous"></script>
            <style>
            body{
                margin: 0;
            }
            a{
                text-decoration: none;
                color: black;
            }
            .navbar{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                
            }
            .navbar_logo{
                font-size: 30px;
            
            }
            .navbar_logo i{
                color: blue;
            }
            
            .navbar_menu{
                display: flex;
                list-style: none;
                padding-left: 0;
            }
            
            .navbar_menu li{
                padding: 8px 40px;
                font-size: 20px;
             
            }
            .navbar_menu li:hover{
                border-bottom:3px solid blue;
            }
            .navbar_menu ul{
                align-items: center;
                list-style: none;
                padding-left: 0;
                display: none;
            }
            .navbar_menu ul li{
                padding: 8px 5px;
            }
            .navbar_menu li:hover ul{
                display: flex;
                position: absolute;
            }
            .navbar_menu li:hover li:hover{
                box-sizing: border-box;
            }
            .navbar_icons{
                list-style: none;
                display: flex;
                margin: 0;
                padding-left:0;
            }
            .navbar_icons li{
                padding: 8px 12px;
            }
            
            .navbar_icons li:hover{
                border-bottom: 3px solid blue;
            }
            .nav_selected{
                color: blue;
            }
            </style>
        <style>
            form {
            border: 3px
            backgroung-color:#C4D6F238;
            border-radius: 10px;
            position: absolute;
            width: 25vw;
            height: 15vh;
            left: 50%;
            top: 35%;
            
        }

            input[type=text], input[type=password] {
            width: 100%;
            padding: 12px 20px;
            margin: 8px 0;
            display: inline-block;
            border: 1px solid #ccc;
            box-sizing: border-box;
            border-radius: 15px;
            }

            button {
            background-color: #0066FF;
            color: white;
            padding: 14px 20px;
            margin: 8px 0;
            border: none;
            cursor: pointer;
            width: 100%;
            border-radius: 15px;
            }

            button:hover {
            opacity: 0.8;
            }

            
            .imgcontainer {
            position: absolute;
            width: 15vw;
            height: 20vh;
            left: 30%;
            top: 40%;
            
            }

            img.avatar {
                border-radius: 70%;
                width: 100%;


            }

            .container {
            padding: 45px;
            border:45px;
            border-top-left-radius: 15px;
            border-top-right-radius: 15px;
            box-shadow:5px 5px  rgba(0, 0, 0, 0.17);

            }

            .container2 {
            padding: 15px;
            border-bottom-right-radius: 15px;
            border-bottom-left-radius: 15px;
            box-shadow: 5px 5px  rgba(0, 0, 0, 0.17);


            }

            .text{
                position: absolute;
                width: 255px;
                height: 56px;
                              
                font-weight: bold;
                font-size: 35px;
                
                
                color: #0066FF;
                
            }
            hr.one{
            width:90%;
            color:black;
            text-align:center;
            }

            span.id {
            float:left;
            padding-top: 10px;
            }

            span.psw {
            float: right;
            padding-top: 10px;
            }

            .signup{
            text-align:center;
            padding-top: 10px;

            }
            
            </style>
        </head>
        <body>
            <nav class="navbar">
            <div class="navbar_logo">
                <a href="/"><i class="fas fa-paw"></i></a>
                <a href="/">pit-a-pet</a>
            </div>

            <ul class="navbar_menu">
                <li> <a href="/qna">Q&A</a> </li>
                <li> <a href="/review">리뷰</a> </li>
                <li> <a href="/information">기본 정보</a> </li>
                <li> <a href="/hospital">동반 정보</a>
                    <ul class="sub">
                        <li> <a href="/hospital">병원</a> </li>
                        <li> <a href="/store">매장</a> </li>
                    </ul>
                </li>
                <li> <a href="/board">커뮤니티</a> </li>
            </ul>

            <ul class ="navbar_icons">
                ${current}
            </ul>
        </nav>
            <div class="imgcontainer">
                <img src="https://s3.ap-northeast-2.amazonaws.com/elasticbeanstalk-ap-northeast-2-176213403491/media/magazine_img/magazine_262/%EC%8D%B8%EB%84%A4%EC%9D%BC.jpg" alt="Avatar" class="avatar">
                <div class="text"> Pit-a-Pet Login </div>
                </div>
            <form action="/login" method="post">
                
                <div class="container" style="background-color:#C4D6F2">
                    <label for="id"><b>ID</b></label>
                    <input type="text" name="id" placeholder="id"  >
                    <label for="psw"><b>Password</b></label>
                    <input type="password" name="password" placeholder="password" >
                    
                    <button type="submit" >로그인</button>
               
                    <span class="id"> <a href="/find_id">아이디 찾기</a></span>
                    <span class="psw"> <a href="/find_password">비밀번호 찾기</a></span>
                
                </div>

                <div class = "container2" style="background-color:#C4D6F2">
                <hr class="one">

                    <div class="signup">회원이 아니신가요? <a href="/signup"> 회원가입 하러가기</a></div>
                </div>

            </form>
            
        </body>
        
    `;
    res.send(output);
})



app.get('/index',function(req,res){
    if(!req.session.login){
        req.session.login = false
        req.session.id = -1
    }
    res.render('index');
});

function main_template(current,question_list,review_list,board_list,hospital_list,store_list ){
    return `
    <!doctype html>
    <html>
        <head>
            <title>main</title>
            <meta charset="utf-8">
            <script src="https://kit.fontawesome.com/9702f82de3.js" crossorigin="anonymous"></script>
            <style>
            body{
                margin: 0;
            }
            a{
                text-decoration: none;
                color: black;
            }
            .navbar{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                
            }
            .navbar_logo{
                font-size: 30px;
            
            }
            .navbar_logo i{
                color: blue;
            }
            
            .navbar_menu{
                display: flex;
                list-style: none;
                padding-left: 0;
            }
            
            .navbar_menu li{
                padding: 8px 40px;
                font-size: 20px;
             
            }
            .navbar_menu li:hover{
                border-bottom:3px solid blue;
            }
            
            .navbar_menu ul{
                align-items: center;
                list-style: none;
                padding-left: 0;
                display: none;
            }
            .navbar_menu ul li{
                padding: 8px 5px;
            }
            .navbar_menu li:hover ul{
                display: flex;
                position: absolute;
            }
            .navbar_menu li:hover li:hover{
                box-sizing: border-box;
            }
            .navbar_icons{
                list-style: none;
                display: flex;
                margin: 0;
                padding-left:0;
            }
            .navbar_icons li{
                padding: 8px 12px;
            }
            
            .navbar_icons li:hover{
                border-bottom: 3px solid blue;
            }


            .container {
                display: grid;
                grid: '. .';
                gap: 30px; /* ⬅️ */
                /* row-gap: 16px; */
                /* column-gap: 16px; */
              }
              .item { 
                padding: 0 30px;
                background: lightgray; 
                margin: 20px;
                border-radius:20px;
              }
              .title{
                border-bottom: 3px solid blue;
              }
              .qrow{
                display: flex;
                list-style: none;
                padding-left:0;
                justify-content: space-between;
            }
            </style>
        </head>
        <body>
        <nav class="navbar">
        <div class="navbar_logo">
            <a href="/"><i class="fas fa-paw"></i></a>
            <a href="/">pit-a-pet</a>
        </div>

        <ul class="navbar_menu">
            <li> <a href="/qna">Q&A</a> </li>
            <li> <a href="/review">리뷰</a> </li>
            <li> <a href="/information">기본 정보</a> </li>
            <li> <a href="/hospital">동반 정보</a>
                <ul class="sub">
                    <li> <a href="/hospital">병원</a> </li>
                    <li> <a href="/store">매장</a> </li>
                </ul>
            </li>
            <li> <a href="/board">커뮤니티</a> </li>
        </ul>

        <ul class ="navbar_icons">
            ${current}
        </ul>
    </nav>
        </div>
            <div class="container">
                <div class="item">
                    <h2><a href="/qna" class="title">Q&A</a></h2>
                    <h4 class="contents"> ${question_list}</h4>
                </div>

                <div class="item">
                    <h2><a href="/review" class="title">리뷰</a></h2>
                    <h4 class="contents"> ${review_list}</h4>
                </div>

                <div class="item">
                    <h2><a href="/board" class="title">커뮤니티</a></h2>
                    <h4 class="contents"> ${board_list}</h4>
                </div>

                <div class="item">
                    <h2><a href="/hospital" class="title">병원</a></h2>
                    <h4 class="contents">${hospital_list}</h4>
                </div>

                <div class="item">
                    <h2><a href="/store" class="title">매장</a></h2>
                    <h4 class="contents">${store_list}</h4>
                </div>
            </div>
        </body>
    </html>
    `;
}

function id_found_template(current,found_id){
    return `
    <!doctype html>
    <html>
        <head>
            <title>ID found</title>
            <script src="https://kit.fontawesome.com/9702f82de3.js" crossorigin="anonymous"></script>
            <style>
            body{
                margin: 0;
            }
            a{
                text-decoration: none;
                color: black;
            }
            .navbar{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                
            }
            .navbar_logo{
                font-size: 30px;
            
            }
            .navbar_logo i{
                color: blue;
            }
            
            .navbar_menu{
                display: flex;
                list-style: none;
                padding-left: 0;
            }
            
            .navbar_menu li{
                padding: 8px 40px;
                font-size: 20px;
             
            }
            .navbar_menu li:hover{
                border-bottom:3px solid blue;
            }
            
            .navbar_menu ul{
                align-items: center;
                list-style: none;
                padding-left: 0;
                display: none;
            }
            .navbar_menu ul li{
                padding: 8px 5px;
            }
            .navbar_menu li:hover ul{
                display: flex;
                position: absolute;
            }
            .navbar_menu li:hover li:hover{
                box-sizing: border-box;
            }
            .navbar_icons{
                list-style: none;
                display: flex;
                margin: 0;
                padding-left:0;
            }
            .navbar_icons li{
                padding: 8px 12px;
            }
            
            .navbar_icons li:hover{
                border-bottom: 3px solid blue;
            }
            .nav_selected{
                color: blue;
            }
            <meta charset="utf-8">
            <style>
            form {
                display: flex;
                flex-direction: column;
                max-width: 500px;
                width: 100%;
                margin-top: 10%;
                margin-left: auto;
                margin-right: auto;
            }
    
            input[type=text] {
                width: 100%;
                padding: 12px 20px;
                margin: 8px 0;
                display: inline-block;
                border: 1px solid #ccc;
                box-sizing: border-box;
                border-radius: 15px;
            }

            button {
                background-color: #0066FF;
                color: white;
                padding: 14px 20px;
                margin: 8px 0;
                border: none;
                cursor: pointer;
                width: 100%;
                border-radius: 15px;
            }
        
            button:hover {
                opacity: 0.8;
            }
            .find_id {
                display: flex;
                flex-direction: column;
                max-width: 500px;
                width: 100%;
                margin-top: 10%;
                margin-left: auto;
                margin-right: auto;
            }
            #found_id {
                font-size: 20px;
            }
            </style>
        </head>
        <body>
        <nav class="navbar">
            <div class="navbar_logo">
                <a href="/"><i class="fas fa-paw"></i></a>
                <a href="/">pit-a-pet</a>
            </div>

            <ul class="navbar_menu">
                <li> <a href="/qna">Q&A</a> </li>
                <li> <a href="/review">리뷰</a> </li>
                <li> <a href="/information">기본 정보</a> </li>
                <li> <a href="/hospital">동반 정보</a>
                    <ul class="sub">
                        <li> <a href="/hospital">병원</a> </li>
                        <li> <a href="/store">매장</a> </li>
                    </ul>
                </li>
                <li> <a href="/board">커뮤니티</a> </li>
            </ul>

            <ul class ="navbar_icons">
                ${current}
            </ul>
        </nav>
            <div class="find_id">
                <h1>아이디 찾기</h1>
                <p id="found_id">귀하의 아이디는 <strong>[ ${found_id} ]</strong> 입니다!</p>
                <button type="button" onclick="location.href='/login'">로그인</button>
            </div>
        </body>
    </html>
    `;
}

app.get('/', function (req, res, next) {

    var current=``;
    var question_list = ``;
    var review_list=``;
    var board_list=``;
    var hospital_list=``;
    var store_list=``;
    db.query(`SELECT * FROM question ORDER BY date DESC`, function(error, questions) {
        if (Object.keys(questions).length > 0) {
            for (var i = 0; i < Object.keys(questions).length; i++) {
                const qdate = String(questions[i].date).split(" ");
                var formating_qdate = qdate[3] + "-" + qdate[1] + "-" + qdate[2] + "-" + qdate[4];
                question_list += `
                <ul class="qrow">
                <li><a href="/qna/question/${questions[i].question_number}">${questions[i].title}</a></li> 
                <li>${formating_qdate}</li>
                </ul>`;
                if(i==4){break;}
            }
        } else {
            question_list = `작성한 질문이 없습니다.`;
        }
        console.log("qna 쿼리")
    });
    db.query(`SELECT * FROM review ORDER BY date DESC`, function(error, reviews) {
        if (Object.keys(reviews).length > 0) {
            for (var i = 0; i < Object.keys(reviews).length; i++) {
                const rdate = String(reviews[i].date).split(" ");
                var formating_rdate = rdate[3] + "-" + rdate[1] + "-" + rdate[2] + "-" + rdate[4];
                review_list += `
                <ul class="qrow">
                <li><a href="/review/${reviews[i].review_number}">${reviews[i].title}</a></li> 
                <li>${formating_rdate}</li>
                </ul>`;
                if(i==4){break;}
            }
        } else {
            review_list = `작성한 리뷰가 없습니다.`;
        }
    });

    db.query(`SELECT * FROM hospital LEFT JOIN hospital_pet ON hospital.hospital_name=hospital_pet.hospital_name LEFT JOIN hospital_time ON hospital.hospital_name=hospital_time.hospital_name ORDER BY hospital.hospital_name ASC, FIELD (day,'월요일','화요일','수요일','목요일','금요일','토요일','일요일'); `,
    function(err,hospitals){
        if (err) throw err;
        else{
            var H_H=" ";
            var H_D=" ";
            var H_pet_list=``;
            var H_count=0;
            var H_num1=0;
            for (var i=0; H_num1<5;i++){
                if(H_H!=hospitals[i].hospital_name){
                    H_pet_list+=`${hospitals[i].pet},`;
                    H_H=hospitals[i].hospital_name;
                    H_D=hospitals[i].day;
                }
                else{
                    if(H_D==hospitals[i].day){
                        if(H_count==0){
                            H_pet_list+=`${hospitals[i].pet}, `
                        }
                    }
                    else{
                        H_count++;
                        H_D=hospitals[i].day;
                    }
                }
                if(H_H!=hospitals[i+1].hospital_name){
                    hospital_list+=`
                    <ul class="qrow">
                    <li><a href="/hospital/info/?id=${hospitals[i].hospital_name}">${hospitals[i].hospital_name}</a></li> 
                    <li>${H_pet_list}</li>
                    </ul>
                    `;
                    H_num1++;
                if(i+1!=(hospitals).length){
                    H_pet_list=` `;
                    H_day_list=` `;
                    H_count=0;
                }
                }
            }
        }
    });
    
    db.query(`SELECT * FROM store LEFT JOIN store_pet ON store.store_name=store_pet.store_name LEFT JOIN store_time ON store.store_name=store_time.store_name ORDER BY store.store_name ASC, FIELD (day,'월요일','화요일','수요일','목요일','금요일','토요일','일요일'); `,
    function(err,stores){
        if (err) throw err;
        else{
            var S_H=" ";
            var S_D=" ";
            var S_pet_list=``;
            var S_count=0;
            var S_num1=0;
            for (var i=0; S_num1<5;i++){
                if(S_H!=stores[i].store_name){
                    S_pet_list+=`${stores[i].pet},`;
                    S_H=stores[i].store_name;
                    S_D=stores[i].day;
                }
                else{
                    if(S_D==stores[i].day){
                        if(S_count==0){
                            S_pet_list+=`${stores[i].pet}, `
                        }
                    }
                    else{
                        S_count++;
                        S_D=stores[i].day;
                    }
                }
                if(S_H!=stores[i+1].store_name){
                    store_list+=`
                    <ul class="qrow">
                    <li><a href="/store/info/?id=${stores[i].store_name}">${stores[i].store_name}</a></li> 
                    <li>${S_pet_list}</li>
                    </ul>
                    `;
                    S_num1++;
                if(i+1!=(stores).length){
                    S_pet_list=` `;
                    S_day_list=` `;
                    S_count=0;
                }
                }
            }
        }
    });
    if(req.session.user_id)//로그인 한 경우
    {
       var id=req.session.user_id;

        current=`<li> <a href="/logout">로그아웃</a> </li>
        <li> <a href="/mypage">${id}---마이페이지</a> </li>`

        db.query(`SELECT * FROM board ORDER BY date DESC`, function(error, boards) {
            if (Object.keys(boards).length > 0) {
                for (var i = 0; i < Object.keys(boards).length; i++) {
                    const bdate = String(boards[i].date).split(" ");
                    var formating_bdate = bdate[3] + "-" + bdate[1] + "-" + bdate[2] + "-" + bdate[4];
                    board_list += `
                    <ul class="qrow">
                    <li><a href="/board/written/${boards[i].board_number}">${boards[i].title}</a></li> 
                    <li>${formating_bdate}</li>
                    </ul>
                    `;
                    if(i==4){break;}
                }
            } else {
                board_list = `작성한 커뮤니티가 없습니다.`;
            }console.log(id);
        res.end(main_template(current,question_list,review_list,board_list,hospital_list,store_list));
        });
        
    }else{//로그인 안한 경우
        current=`<li> <a href="/login">로그인</a> </li>
        <li> <a href="/signup">회원가입</a> </li>`
        console.log("로그인 안한 상태");
        board_list = `로그인을 해주세요.`;
        db.query(`SELECT * FROM board ORDER BY date DESC`, function(error, boards) {
            if (Object.keys(boards).length > 0) {

            } else{

            }res.end(main_template(current,question_list,review_list,board_list,hospital_list,store_list));
        });
        
    }
});



app.post('/login', function(req, res) {
    var id = req.body.id;
    var password = req.body.password;

    db.query('SELECT * FROM user WHERE id = ? ',[id],
        function(error,results){
            if (error) throw error;
            else {
                if(results.length>0){
                    bcrypt.compare(password, results[0].password, function(err,result){
                        if(result){
                            req.session.loggedin = true;
                            req.session.user_id = id;
                            req.session.save(function() {
                                res.redirect('/');
                            });
                        }else{
                            res.send('<script type="text/javascript">alert("로그인 정보가 일치하지 않습니다."); document.location.href="/login";</script>');    
                            console.log(req.body.password + ", " + results[0].password);
                        }
                    });
                } else {
                    res.send('<script type="text/javascript">alert("존재하지 않는 아이디입니다!"); document.location.href="/login";</script>');    
                    res.end();
                }
            }
        });
});

// router add
app.use('/register', register_router);
app.use('/qna', qna_router);
app.use('/review', review_router);
app.use('/information',information_router);
app.use('/signup', signup_router);
app.use('/mypage',mypage_router)
app.use('/board',board_router);
app.use('/hospital',hospital_router);
app.use('/store',store_router);
app.use('/create_care_service',care_service_router);

app.get('/logout',(req,res)=>{
    if(req.session.id){
        req.session.destroy(function(err){
            if (err) throw err;
            res.redirect('/');
        });
    }
    else{
        res.redirect('/');
    }

})

app.get('/find_id', (req, res)=>{
    var current=``;
    if(req.session.user_id){//로그인 한 경우
        var id=req.session.user_id;
        current=`<li> <a href="/logout">로그아웃</a> </li>
        <li> <a href="/mypage">${id}--마이페이지</a> </li>`
        console.log(id)
    }
    else{
        current=`<li> <a href="/login">로그인</a> </li>
        <li> <a href="/signup">회원가입</a> </li>`
    }
    var output = `
    <!doctype html>
    <html>
        <head>
            <title>Find ID</title>
            <meta charset="utf-8">
            <script src="https://kit.fontawesome.com/9702f82de3.js" crossorigin="anonymous"></script>
            <style>
            body{
                margin: 0;
            }
            a{
                text-decoration: none;
                color: black;
            }
            .navbar{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                
            }
            .navbar_logo{
                font-size: 30px;
            
            }
            .navbar_logo i{
                color: blue;
            }
            
            .navbar_menu{
                display: flex;
                list-style: none;
                padding-left: 0;
            }
            
            .navbar_menu li{
                padding: 8px 40px;
                font-size: 20px;
             
            }
            .navbar_menu li:hover{
                border-bottom:3px solid blue;
            }
            
            .navbar_menu ul{
                align-items: center;
                list-style: none;
                padding-left: 0;
                display: none;
            }
            .navbar_menu ul li{
                padding: 8px 5px;
            }
            .navbar_menu li:hover ul{
                display: flex;
                position: absolute;
            }
            .navbar_menu li:hover li:hover{
                box-sizing: border-box;
            }
            .navbar_icons{
                list-style: none;
                display: flex;
                margin: 0;
                padding-left:0;
            }
            .navbar_icons li{
                padding: 8px 12px;
            }
            
            .navbar_icons li:hover{
                border-bottom: 3px solid blue;
            }
            .nav_selected{
                color: blue;
            }
            </style>

            <style>
            form {
                display: flex;
                flex-direction: column;
                max-width: 500px;
                width: 100%;
                margin-top: 10%;
                margin-left: auto;
                margin-right: auto;
            }
    
            input[type=text] {
                width: 100%;
                padding: 12px 20px;
                margin: 8px 0;
                display: inline-block;
                border: 1px solid #ccc;
                box-sizing: border-box;
                border-radius: 15px;
            }

            button {
                background-color: #0066FF;
                color: white;
                padding: 14px 20px;
                margin: 8px 0;
                border: none;
                cursor: pointer;
                width: 100%;
                border-radius: 15px;
            }
        
            button:hover {
                opacity: 0.8;
            }
            </style>
        </head>
        <body>
        <nav class="navbar">
            <div class="navbar_logo">
                <a href="/"><i class="fas fa-paw"></i></a>
                <a href="/">pit-a-pet</a>
            </div>

            <ul class="navbar_menu">
                <li> <a href="/qna">Q&A</a> </li>
                <li> <a href="/review">리뷰</a> </li>
                <li> <a href="/information">기본 정보</a> </li>
                <li> <a href="/hospital">동반 정보</a>
                    <ul class="sub">
                        <li> <a href="/hospital">병원</a> </li>
                        <li> <a href="/store">매장</a> </li>
                    </ul>
                </li>
                <li> <a href="/board">커뮤니티</a> </li>
            </ul>

            <ul class ="navbar_icons">
                ${current}
            </ul>
        </nav>
            <form action="/find_id" method="post">
                <h1>아이디 찾기</h1>
                <label for="nickname">닉네임</label>
                <p><input type="text" name="nickname" placeholder="nickname" maxlength="10"></p>
                <label for="email">이메일</label>
                <p><input type="text" name="email" placeholder="email" maxlength="30"></p>
                <button type="submit">확인</button>
            </form>
        </body>
    </html>
    `;
    res.send(output);
})

app.post('/find_id', function(req,res) {
    const written = req.body;
    const nickname = written.nickname;
    const email = written.email;
    var current=``;
            if(req.session.user_id){//로그인 한 경우
                var uid=req.session.user_id;
                current=`<li> <a href="/logout">로그아웃</a> </li>
                <li> <a href="/mypage">${uid}--마이페이지</a> </li>`
                console.log(uid)
            }
            else{
                current=`<li> <a href="/login">로그인</a> </li>
                <li> <a href="/signup">회원가입</a> </li>`
            }
    db.query(`SELECT * FROM user WHERE nickname = ? AND email = ? `,[nickname, email], function(error, users) {
        if(error) {
            throw error;
        }
        if (nickname.length < 1) {
            res.send('<script type="text/javascript">alert("닉네임을 입력해주세요.");location.href="/find_id";</script>');
        } else if (email.length < 1) {
            res.send('<script type="text/javascript">alert("이메일을 입력해주세요.");location.href="/find_id";</script>');
        } else if (users.length > 0) {
            let found = 0;
            for (var i = 0; i < Object.keys(users).length; i++) {
                if(nickname === users[i].nickname) {
                    if(email === users[i].email) {
                        const id = users[i].id;
                        res.send(id_found_template(current,id));
                        found = 1;
                    }
                }
            }
            if (!found) {
                console.log("something went wrong");
                throw error;
            }
        } else {
            res.send('<script type="text/javascript">alert("입력하신 정보와 일치하는 회원 아이디가 존재하지 않습니다.");location.href="/find_id";</script>');
        }     
    })
})

app.get('/find_password', (req, res)=>{
    var current=``;
            if(req.session.user_id){//로그인 한 경우
                var id=req.session.user_id;
                current=`<li> <a href="/logout">로그아웃</a> </li>
                <li> <a href="/mypage">${id}--마이페이지</a> </li>`
                console.log(id)
            }
            else{
                current=`<li> <a href="/login">로그인</a> </li>
                <li> <a href="/signup">회원가입</a> </li>`
            }
    var output = `
    <!doctype html>
    <html>
        <head>
            <title>Find Password</title>
            <meta charset="utf-8">
            <script src="https://kit.fontawesome.com/9702f82de3.js" crossorigin="anonymous"></script>
            <style>
            body{
                margin: 0;
            }
            a{
                text-decoration: none;
                color: black;
            }
            .navbar{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                
            }
            .navbar_logo{
                font-size: 30px;
            
            }
            .navbar_logo i{
                color: blue;
            }
            
            .navbar_menu{
                display: flex;
                list-style: none;
                padding-left: 0;
            }
            
            .navbar_menu li{
                padding: 8px 40px;
                font-size: 20px;
             
            }
            .navbar_menu li:hover{
                border-bottom:3px solid blue;
            }
            
            .navbar_menu ul{
                align-items: center;
                list-style: none;
                padding-left: 0;
                display: none;
            }
            .navbar_menu ul li{
                padding: 8px 5px;
            }
            .navbar_menu li:hover ul{
                display: flex;
                position: absolute;
            }
            .navbar_menu li:hover li:hover{
                box-sizing: border-box;
            }
            .navbar_icons{
                list-style: none;
                display: flex;
                margin: 0;
                padding-left:0;
            }
            .navbar_icons li{
                padding: 8px 12px;
            }
            
            .navbar_icons li:hover{
                border-bottom: 3px solid blue;
            }
            .nav_selected{
                color: blue;
            }</style>
            <style>
            form {
                display: flex;
                flex-direction: column;
                max-width: 500px;
                width: 100%;
                margin-top: 10%;
                margin-left: auto;
                margin-right: auto;
            }
    
            input[type=text] {
                width: 100%;
                padding: 12px 20px;
                margin: 8px 0;
                display: inline-block;
                border: 1px solid #ccc;
                box-sizing: border-box;
                border-radius: 15px;
            }

            button {
                background-color: #0066FF;
                color: white;
                padding: 14px 20px;
                margin: 8px 0;
                border: none;
                cursor: pointer;
                width: 100%;
                border-radius: 15px;
            }
        
            button:hover {
                opacity: 0.8;
            }
            </style>
        </head>
        <body>
        <nav class="navbar">
            <div class="navbar_logo">
                <a href="/"><i class="fas fa-paw"></i></a>
                <a href="/">pit-a-pet</a>
            </div>

            <ul class="navbar_menu">
                <li> <a href="/qna">Q&A</a> </li>
                <li> <a href="/review">리뷰</a> </li>
                <li> <a href="/information">기본 정보</a> </li>
                <li> <a href="/hospital">동반 정보</a>
                    <ul class="sub">
                        <li> <a href="/hospital">병원</a> </li>
                        <li> <a href="/store">매장</a> </li>
                    </ul>
                </li>
                <li> <a href="/board">커뮤니티</a> </li>
            </ul>

            <ul class ="navbar_icons">
                ${current}
            </ul>
        </nav>
            <form action="/find_password" method="post">
                <h1>비밀번호 찾기</h1>
                <label for="id">아이디</label>
                <p><input type="text" name="id" placeholder="id"></p>
                <label for="email">이메일</label>
                <p><input type="text" name="email" placeholder="email"></p>
                <button type="submit">확인</button>
            </form>
        </body>
    </html>
    `;
    res.send(output);
})

app.post('/find_password', async (req, res) => {
    const written = req.body;
    const id = written.id;
    const email = written.email;

    var find_password_user_email;

    db.query(`SELECT * FROM user`, function(error, rows) {
        if (error) throw error;
        
        if (id.length < 1) {
            res.send('<script type="text/javascript">alert("아이디를 입력해주세요.");location.href="/find_password";</script>');
        } else if (email.length < 1) {
            res.send('<script type="text/javascript">alert("이메일을 입력해주세요.");location.href="/find_password";</script>');
        } else if (rows.length > 0) {
            for(let i = 0; i < rows.length; i++) {
                if (rows[i].id == id && rows[i].email == email) {
                    find_password_user_email = rows[i].email;
                }
            }

            if (find_password_user_email) {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    port: 465,
                    secure: true, // true for 465, false for other ports
                    auth: {
                        user: '20171641@sungshin.ac.kr',
                        pass: 'pitapet!'
                    },
                });
                
                var variable = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z".split(",");
                var randomPassword = createRandomPassword(variable, 8);
    
                function createRandomPassword(variable, passwordLength) {
                    var randomString = "";
                    for (var j=0; j<passwordLength; j++)
                        randomString += variable[Math.floor(Math.random()*variable.length)];
                    return randomString
                }
    
                bcrypt.hash(randomPassword, 10, function(error, hash) {
                    db.query(`UPDATE user SET password=? WHERE id = ?`,
                    [hash, id], 
                    function(err, result) {
                        if (err) {
                            res.send(err);
                            throw err;
                        }
                        else{
                            console.log(result);
                            req.session.destroy(function(err){
                                if (err) throw err;
                            });
                        }                
                    });
                });
    
                const mailOptions = {
                    from: '20171641@sungshin.ac.kr',
                    to: find_password_user_email,
                    subject: 'PitaPet에서 임시 비밀번호를 알려드립니다!',
                    html:
                    "<h1>PitaPet에서 새로운 비밀번호를 알려드립니다.</h1> <h2> 임시 비밀번호 : " + randomPassword
                    + "</h2>" +'<h3 style="color: crimson;">임시 비밀번호로 로그인 하신 후, 반드시 비밀번호를 수정해 주세요!</h3>',
                };
              
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                    } 
                    else {
                        console.log('Email sent: ' + info.response);
                    }
                });

                return res.send('<script type="text/javascript">alert("이메일을 전송했습니다. 메일함을 확인해주세요");location.href="/";</script>');
            } else {
                return res.send('<script type="text/javascript">alert("존재하지 않는 회원입니다. 아이디 또는 이메일을 확인해주세요.");location.href="/find_password";</script>');
            }
        } 
    })
});

db.query(`SELECT * FROM user`, function(error, users) {
    console.log(users);
})

const transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: '20171641@sungshin.ac.kr',
      pass: 'pitapet!'
    }
  }));
  
  function send_mail(address, name, category) {
    const mailOptions = {
      from: '20171641@sungshin.ac.kr',
      to: address,
      subject: 'PitaPet에서 '+name+'의 '+category+'을 알려드립니다!',
      text: name+'의 '+category+'입니다!'
    };
     
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
  
  //매일 오전 10시에 실행
  cron.schedule('0 2 1-31 * *', function() {
    var mail_number_array = [];
    var owner_id_array = [];
    var name_array = [];
    var mail_category_array = [];
    var now = new Date();
    console.log(now);
  
    db.query('SELECT * FROM care_service WHERE care_service.mail_number IN (SELECT mail_number FROM care_service_date WHERE DATE_FORMAT(mail_date, "%Y-%m-%d") = CURDATE())', (error, rows1) => {
      if (error) throw error;
      else {
        console.log("오늘 날짜인 케어 서비스\n");
        for(let i = 0; i < rows1.length; i++){
          mail_number_array[i] = rows1[i].mail_number;
          owner_id_array[i] = rows1[i].owner_id;
          name_array[i] = rows1[i].name;
          mail_category_array[i] = rows1[i].mail_category;
          console.log(mail_number_array[i], owner_id_array[i], name_array[i], mail_category_array[i]);
        }
      }
  
      db.query('SELECT * FROM user', (error, rows2) => {
        if (error) throw error;
        else {
          for (var i=0; i<owner_id_array.length; i++) {
            for (var j=0; j<rows2.length; j++) {
              if (rows2[j].id == owner_id_array[i]) {
                send_mail(rows2[j].email, name_array[i], mail_category_array[i]);
              }
            }
          }
        }
      });
  
    });
  });

app.listen(80);