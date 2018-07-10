'use strict';

const request = require('request');
const config = require('./config');
const pg = require('pg');
pg.defaults.ssl = true;

module.exports = {

    readSkillSet: function(callback){
        var pool = new pg.Pool(config.PG_CONFIG);
        pool.connect(function (err, client, done) {
            if (err) {
                return console.error('Error acquiring client', err.stack);
            }
            client
                .query(
                    'SELECT skill_set FROM public.employee_table',
                    function (err, result) {
                        if (err) {
                            console.log(err);
                            callback([]);
                        } else {
                            let skills = [];
                            for (let i = 0; i < result.rows.length; i++) {
                                skills.push(result.rows[i]['ab_number']);
                                skills.push(result.rows[i]['first_name']);
                                skills.push(result.rows[i]['last_name']);
                                skills.push(result.rows[i]['skill_set']);

                            }
                            callback(skills)
                        };
                    });
        });
        pool.end();
    },

    readUserSkillSelection: function(callback, userId) {
        var pool = new pg.Pool(config.PG_CONFIG);
        pool.connect(function(err, client, done) {
            if (err) {
                return console.error('Error acquiring client', err.stack);
            }
            client
                .query(
                    'SELECT skill_set FROM public.user_skill_preference WHERE fb_id=$1',
                    [userId],
                    function(err, result) {
                        if (err) {
                            console.log(err);
                            callback('');
                        } else {
                            callback(result.rows[0]['skill_set']);
                        };
                    });

        });
        pool.end();
    },

    updateUserSkillSet: function(skill_set, userId) {
        var pool = new pg.Pool(config.PG_CONFIG);
        pool.connect(function(err, client, done) {
            if (err) {
                return console.error('Error acquiring client', err.stack);
            }

            let sql1 = `SELECT skill_set FROM public.user_skill_preference WHERE fb_id='${userId}' LIMIT 1`;
            client
                .query(sql1,
                    function(err, result) {
                        if (err) {
                            console.log('Query error: ' + err);
                        } else {
                            let sql;
                            if (result.rows.length === 0) {
                                sql = 'INSERT INTO public.user_skill_preference (skill_set, fb_id) VALUES ($1, $2)';
                            } else {
                                sql = 'UPDATE public.user_skill_preference SET skill_set=$1 WHERE fb_id=$2';
                            }
                            client.query(sql,
                                [
                                    skill_set,
                                    userId
                                ]);
                        }
                    }
                );


        });
        pool.end();
    }


}


