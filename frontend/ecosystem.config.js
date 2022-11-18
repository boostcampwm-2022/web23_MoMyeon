module.exports = {
  app: [
    {
      name: "front-server",
      script: "yarn start",
      intances: 3,
      exec_mode: "cluser",
      merger_logs: true,
      autorestart: true,
      watch: false,
    },
  ],
};
