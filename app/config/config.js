var config = {
    development: {
        port: 3000,
        host: "vanbungkring.dev",
        mongo: "mongodb://localhost:27017/survey"
    },
    test: {
        port: 3000,
        host: "vanbungkring.dev",
        mongo: "mongodb://localhost:27017/vote"
    },
    production: {
        port: 3001,
        host: "vanbungkring.dev",
        mongo: "mongodb://localhost:27017/vote"
    }
}
module.exports = config[process.env.NODE_ENV || 'development'];