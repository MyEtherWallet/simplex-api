module.exports = {
  apps : [{
    name: "simplex-api",
    script: "./dist/index.js",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}