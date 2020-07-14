const mysql = require('mysql2');

exports.handler = (event, context, callback) => {

    var conn = mysql.createConnection({
        host: "database-lab10.ci5ys4ttduae.us-east-1.rds.amazonaws.com",
        user: "admin",
        password: "hEDSOa0YQEnSvLlNP019",
        port: 3306,
        database: "teletok_lambda"
    });
    var id = event.pathParameters.id;
    var query = "SELECT * FROM teletok_lambda.post where id= ?";
    var query2 = "SELECT * FROM teletok_lambda.post_comment where post_id = ?";
    var query3 = "SELECT username FROM teletok_lambda.user where id = ?"
    var params = [id];
    conn.query(query,params, function(err, result){
        conn.query(query2, params, function(err, result2){
            var params2 = [result[0].id];
            conn.query(query3, params2, function(err, result3){

                if(err){
                    conn.end();
                    callback({
                        statusCode: 400,
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Content-Type': "application/json"
                        },
                        body: JSON.stringify({
                            "estado": "error",
                            "msg": "err"
                        })
                    });
                }else{
                    conn.end(function(err){
                        var resultadoFinal = {
                            "id": result[0].id,
                            "description": result[0].description,
                            "creation_date": result[0].creation_date,
                            "username": result3[0].username,
                            "comentCount": result2.length,
                            "coments": result2
                        };
                        callback(null, {
                            statusCode: 200,
                            headers: {
                                'Access-Control-Allow-Origin': '*',
                                'Content-Type': "application/json"
                            },
                            body: JSON.stringify({
                                "estado": "ok",
                                "msg": resultadoFinal
                            })
                        });
                    });
                }
            });
        });
    });
};
