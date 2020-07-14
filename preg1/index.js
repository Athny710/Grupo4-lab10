const mysql = require('mysql2');
const querystring = require('querystring');
exports.handler = function(event, context, callback) {
    console.log(event);
    if (event.body !== null && event.body !== undefined) {

        var bodyBase64 = Buffer.from(event.body, 'base64').toString();
        var body = querystring.parse(bodyBase64);

        var token = body.token;
        var description = body.description;
        var conn = mysql.createConnection({
            host: "database-1.cdj8o23u9ata.us-east-1.rds.amazonaws.com",
            user: "admin",
            password: "dDW0uvd7oQ0RcoVIz8aq",
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

                var sql = "SELECT * FROM teletok_lambda.token where code=?";
                var parametros = [token];
                conn.query(sql, parametros, function (err11, resultado) {
                    if (err11) {
                        console.log(err11);

                    } else {
                        console.log(resultado);
                        if(resultado.length === 0){
                            callback(err11, {
                                statusCode: 400,
                                body: JSON.stringify({
                                    "error": "TOKEN_INVALID",
                                })
                            });
                        }else{
                            var id = resultado[0].user_id;
                            var sql2 = "INSERT INTO `teletok_lambda`.`post` ( `description`, `user_id`) VALUES ( ?, ?)";
                            var parametros = [description,id];
                            conn.query(sql2, parametros, function (err1, resultado2) {
                                if (err1) {
                                    callback(err1, {
                                        statusCode: 400,
                                        body: JSON.stringify({
                                            "error": "SAVE_ERROR",
                                        })
                                    });
                                } else {
                                    console.log(resultado2)
                                    conn.end(function(err1){
                                        callback(error, {
                                            statusCode: 200,
                                            body: JSON.stringify({
                                                "postId": resultado2.insertId,
                                                "status": "POST_CREATED"
                                            })
                                        });
                                    });


                                }
                            });

                        }
                    }
                });
            }
        });
    }

};
