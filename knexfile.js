module.exports = {
    client: 'pg',
    connection: { 
        host : '127.0.0.1',
        port : 5432,
        user : 'portal_cp',
        password : '!bj[6YEWm@rB2?q~',
        database : 'portal_cp'
    },
    migrations: {
        tableName: 'migrations'
    },
    seeds: {
        directory: "./seeds"
    }
};