pragma solidity 0.8.9;

library Utils{ 
    function ethToWei(uint sumInEth) public pure returns(uint){
        return sumInEth * 1 ether;  
    }

    function minutesToSeconds(uint timeInMin) public pure returns(uint){
        return timeInMin * 1 minutes;
    }
    
}
