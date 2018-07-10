'use strict';

const config = require('./config');
const pg = require('pg');
pg.defaults.ssl = true;

const connectionString = "postgres://vfhukphadhunyp:c7628b3efb9b895eef7d6577b8e4264cad035da597b44994a41efee00e5acfba@ec2-107-21-201-57.compute-1.amazonaws.com:5432/d1ugjq07qtkn6k";

var pool = new pg.Pool(config.PG_CONFIG);
pool.connect(connectionString, function (err, client, done)  {
        if (err) throw err;

        client.query(
                'INSERT into employee_table' +
                '(ab_number, first_name, last_name, skill_set, years_of_experience, previous_job, phone_number) ' +
                'VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING ab_number',
                [ab_number, first_name, last_name, skill_set, years_of_experience, previous_job, phone_number],
                function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('row inserted with id: ' + result.rows[0].ab_number);
                    }
                    ;
                });
    });




