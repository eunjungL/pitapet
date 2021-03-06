const { response } = require('express');
const express = require('express');
const app = express.Router();

const body_parser = require('body-parser');
app.use(body_parser.urlencoded({ extended: false}));

var db = require('./db');

function template(current,animal_name, name_check_txt) {
    return `
    <!doctype html>
    <html>
        <head>
            <title>create care service</title>
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
                margin-top: 3%;
                margin-left: auto;
                margin-right: auto;
            }
    
            input[type=text], textarea[name=note] {
                width: 100%;
                padding: 12px 20px;
                margin: 8px 0;
                display: inline-block;
                border: 1px solid #ccc;
                box-sizing: border-box;
                border-radius: 15px;
            }

            input[type=date], select[name=category] {
                width: 60%;
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
                <li> <a href="/review">??????</a> </li>
                <li> <a href="/information">?????? ??????</a> </li>
                <li> <a href="/hospital">?????? ??????</a>
                    <ul class="sub">
                        <li> <a href="/hospital">??????</a> </li>
                        <li> <a href="/store">??????</a> </li>
                    </ul>
                </li>
                <li> <a href="/board">????????????</a> </li>
            </ul>

            <ul class ="navbar_icons">
                ${current}
            </ul>
        </nav>
            <form action="/create_care_service/create_mail" method="post">
                <h1>??????????????? ????????????</h1>
                <label for="pet_name">??????</label>
                <p><input type="text" name="pet_name" maxlength="10" placeholder="??????"></textarea></p>
                <label for="category">????????????</label>
                <p><select name="category"> 
                    <option value="?????? ?????????">?????? ?????????</option>
                    <option value="?????????">?????????</option>
                    <option value="??????">??????</option>
                    <option value="?????????">?????????</option>
                </select></p>
                <label for="mail_date">??????</label>
                <p><input type="date" name="mail_date" min="1990-01-01" max="2022-12-31" value="2021-12-01"></p>
                <label for="note">????????????</label>
                <p><textarea name="note" maxlength="20"></textarea></p>
                <button type="submit">????????????</button>
            </form>
        </body>
    </html>
    `;
}

app.get('/', function(req, res) {
    var current=``;
            if(req.session.user_id){//????????? ??? ??????
                var uid=req.session.user_id;
                current=`<li> <a href="/logout">????????????</a> </li>
                <li> <a href="/mypage">${uid}--???????????????</a> </li>`
                console.log(uid)
            }
            else{
                current=`<li> <a href="/login">?????????</a> </li>
                <li> <a href="/signup">????????????</a> </li>`
            }
    res.end(template(current,"", ""));
});


app.post('/create_mail', function(req, res) {
    const body = req.body;
    const owner = req.session.user_id;
    const pet_name = body.pet_name;
    const category = body.category;
    const date = body.mail_date;
    const note = body.note;
    var mail_num;
    if (pet_name.length < 1) {
        res.send('<script type="text/javascript">alert("???????????? ????????? ??????????????????.");location.href="/create_care_service";</script>');
    } else {
        db.query(`INSERT INTO care_service (owner_id, name, mail_category, account) VALUES(?, ?, ?, ?)`,
        [owner, pet_name, category, note],
        function(error, result) {
            if (error) {
                res.send(error);
                throw error;
            }
            console.log(result);
        });

        db.query('SELECT mail_number FROM care_service order by mail_number desc limit 1', (error, result) => {
            if (error) throw error;
            else mail_num = result[0].mail_number;
            console.log(mail_num);

            db.query('INSERT INTO care_service_date (mail_number, mail_date) VALUES(?, ?)',
            [mail_num, date],
            function(error, result) {
                if (error) {
                    res.send(error);
                    throw error;
                }
                console.log(result);
                res.redirect('/mypage/');
                res.end();
            });
        });
    } 
});

db.query(`SELECT * FROM care_service`, function(error, care_services) {
    console.log(care_services);
})

module.exports = app;