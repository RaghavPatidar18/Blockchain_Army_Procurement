require("@nomicfoundation/hardhat-toolbox");
require('solidity-coverage');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  skipFiles: ['contracts\Migrations.sol'],
};

// module.exports = {
//   solidity: {
//     compilers: [
//       {
//         version: "0.8.0", // or any other version you want to support
//       },
//       {
//         version: "0.5.16", // or any other version you want to support
//       },
//       // Add more compiler versions as needed
//     ]
//   }
// };

// npx hardhat coverage