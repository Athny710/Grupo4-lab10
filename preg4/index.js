const mysql = require('mysql2');
const querystring = require('querystring');

exports.handler = function(event, context, callback) {

    if (event.body !== null && event.body !== undefined) {

        var bodyBase64 = Buffer.from(event.body, 'base64').toString();
        var body = querystring.parse(bodyBase64);

        var token = body.token;
        var comentario = body.comentario;
        var postid = body.postid;

        var conn = mysql.createConnection({
            host: "database-1.cwaflgqidzea.us-east-1.rds.amazonaws.com",
            user: "admin",
            password: "a5yL98uj0EVok9KraXkP",
            port: 3306,
            database: "teletok_lambda"
        });

        conn.connect(function(error) {
            if (error) {
                conn.end(function() {
                    callback(error, {
                        statusCode: 400,
                        body: JSON.stringify({
                            "estado": "error",
                            "msg": "error en la conexión a base de datos"
                        })
                    });
                });
            }
            else {
                console.log("nada");
                var userid = "SELECT user_id FROM token where code = ?";
                conn.query(userid, token, function(error1, result1){
                    if (error1){
                        conn.end(function() {
                            callback(error, {
                                statusCode: 400,
                                body: JSON.stringify({
                                    "estado": "error",
                                    "msg": "no existe el token enviado",
                                    "err": error
                                })
                            });
                        });
                    }else{

                        var sql = "INSERT INTO `teletok_lambda`.`post_comment` (`message`, `user_id`, `post_id`) VALUES (?, ?, ?);";
                        conn.query(sql, [comentario,result1,postid], function(error, result) {
                            if (error) {
                                conn.end(function() {
                                    callback(error, {
                                        statusCode: 400,
                                        body: JSON.stringify({
                                            "estado": "error",
                                            "msg": "error al registrar el comentario",
                                            "err": error
                                        })
                                    });
                                });
                            }
                            else {
                                sql = "SELECT pc.id FROM post_comment pc order by pc.id desc limit 1";
                                conn.query(sql, function(err, result) {
                                    conn.end(function() {
                                        callback(null, {
                                            statusCode: 200,
                                            body: JSON.stringify({
                                                "commentId": sql,
                                                "status": "COMMENT_CREATED"
                                            })
                                        });
                                    });
                                });
                            }
                        });


                    }

                });
            }

        });
    }

};
