// start in dev environment: pm2 start pm2.config.js --env development, ignore --env in production.

module.exports = {
    apps: [{
        name: "crawler",
        script: "./app.js",
        watch: true,
        env: {
            "NODE_ENV": "prod",
        },
        env_dev: {
            "NODE_ENV": "dev"
        },
        env_qa: {
            "NODE_ENV": "qa"
        }
    }]
}