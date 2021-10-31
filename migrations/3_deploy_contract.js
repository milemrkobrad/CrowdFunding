var CrowdFundingWithDeadline = artifacts.require("./CrowdFundingWithDeadline.sol");

module.exports = function(deployer){
    deployer.deploy(
        CrowdFundingWithDeadline,
        "Test campaign",
        1,
        200,
        "0x1e48f20f1F86DB68144BaeCbad280BF284485315"
    )
}