module.exports = {
  apps: [
    {
      name: 'customer-web',
      script: './.output/server/index.mjs',
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}
