// ecosystem.config.js
module.exports = {
    apps: [
      {
        name: "icepicker",
        script: "npm",
        args: "run start",
        env: {
          NODE_ENV: "development",
          FRONTEND_URL: "http://localhost:3000"
        },
        env_production: {
          NODE_ENV: "production",
          FRONTEND_URL: "https://main.d9pxq75h0yt4e.amplifyapp.com"
        }
      }
    ]
  }
  