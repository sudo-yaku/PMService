module.exports = {
  apps: [
    {
        "name": "iop-pm-service",
        "script": "./dist/src/main.js",
        "node_args": "--max-http-header-size=20000",
        "watch": false,
        "instances": 2,
        "exec_mode": "cluster",
        "env": {
          "PORT": 5178,
          "NODE_ENV": "dev"
        },
        "env_development": {
          "PORT": 5178,
          "NODE_ENV": "dev"
        },
        "env_staging": {
          "PORT": 5178,
          "NODE_ENV": "staging"
        },
        "env_test": {
          "PORT": 5178,
          "NODE_ENV": "test"
        },
        "env_uat": {
          "PORT": 5178,
          "NODE_ENV": "uat"
        },
        "env_production": {
          "PORT": 5178,
          "NODE_ENV": "prod"
        }
    }
  ]
};
