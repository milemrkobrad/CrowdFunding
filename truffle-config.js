module.exports = {

  networks: {
    ganache:{
      host: "localhost",
      //port: 7545,
      port: 8545,
      gas: 5000000,
      network_id: "*" //Match any network
    } 
  },
  compilers: {
    solc: {
      version: "^0.8.9"
    }
  }
};
