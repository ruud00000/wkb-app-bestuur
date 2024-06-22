module.exports = {
    apps : [
        {
          name: "wkb-app-bestuur",
          script: "./server.js",
          watch: true,
          ignore_watch: ["node_modules", "log.txt", "error.txt"],
          out_file: "./log.txt",
          error_file: "./error.txt",
          time: true,
          env: {
            "PORT": 3003,
            "NODE_ENV": "production"
          },
          env_production: {
              "PORT": 3003,
              "NODE_ENV": "production"
          }
        }
    ]
  }