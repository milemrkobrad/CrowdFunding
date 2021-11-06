var CrowdFundingWithDeadline = artifacts.require("./CrowdFundingWithDeadline.sol");

module.exports = function(deployer){
    deployer.deploy(
        CrowdFundingWithDeadline,
        "Test campaign",
        1,
        200,
        "0x3158479784743cCE595E86357aB6563d437F77E3"
    )
}