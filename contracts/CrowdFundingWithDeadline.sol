pragma solidity 0.8.9;

import "./Utils.sol";

contract CrowdFundingWithDeadline {

    using Utils for *;

    enum State { Ongoing, Failed, Succeeded, PaidOut }

    event CampaignFinished(
        address adr,
        uint totalCollected,
        bool succeeded
    );

    string public name; //campaign name
    uint public targetAmount;
    uint public fundingDeadline; // in sec from 1.1.1970
    address public beneficiary;
    State public state;

    mapping(address=>uint) public amounts; //dictionary address, amount -> we will use this if campaign fails and we need to return funds
    bool public collected; //if collected campaign is successful
    uint public totalCollected; //total amount collected

    modifier inState(State expectedState){
        require(state == expectedState, "Invalid state");
        _;
    }

    constructor(
        string memory contractName,
        uint targetAmountEth,
        uint durationInMin,
        address beneficiaryAddress
    ){
        name = contractName;
        //targetAmount = targetAmountEth * 1 ether; 
        targetAmount = Utils.ethToWei(targetAmountEth); 
        //fundingDeadline = currentTime() + durationInMin * 1 minutes;
        fundingDeadline = currentTime() + Utils.minutesToSeconds(durationInMin);
        beneficiary = beneficiaryAddress;
        state = State.Ongoing;
    }

    function contribute() public payable inState(State.Ongoing){
        require(beforeDeadline(), "No contributions after the deadline");
        amounts[msg.sender] += msg.value;
        totalCollected += msg.value;

        if (totalCollected >= targetAmount)
            collected = true;    

    }

    function beforeDeadline() private view returns(bool) {
        return currentTime() < fundingDeadline;
    }

    function currentTime() internal virtual view returns(uint){
        return block.timestamp;
    }

    function finishCrowdFunding() public inState(State.Ongoing){
        require(!beforeDeadline(), "Cannot finish campaign before a deadline");

        if (!collected)
            state = State.Failed;
        else
            state = State.Succeeded;

        emit CampaignFinished(address(this), totalCollected, collected);
    }

    function collect() public inState(State.Succeeded){
        (bool success, ) = (beneficiary.call{value: totalCollected}(""));
        if (success)
            state = State.PaidOut;
        else
            state = State.Failed;
    }

    function withdraw() public inState(State.Failed){
        require(amounts[msg.sender] > 0, "Nothing was contributed");
        uint contributed = amounts[msg.sender];
        amounts[msg.sender] = 0;

        (bool success, ) = (msg.sender.call{value: contributed}(""));
        if (!success)
            amounts[msg.sender] = contributed;    
    }
} 