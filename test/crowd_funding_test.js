let CrowdFundingWithDeadline = artifacts.require('./TestCrowdFundingWithDeadline')

contract('CrowdFundingWithDeadline', function(accounts){
    let contract;
    let contractCreator = accounts[0];
    let beneficiary = accounts[1];

    const ONE_ETH = 1000000000000000000; //wei

    const ONGOING_STATE = 0;
    const FAILED_STATE = 1;
    const SUCCEEDED_STATE = 2;
    const PAID_OUT_STATE = 3;

    beforeEach(async function(){
        contract = await CrowdFundingWithDeadline.new(
            'funding',
            1,
            10,
            beneficiary,
            {
                from: contractCreator,
                gas: 2000000
            }
        )
    });

    it('contract is initialized', async function(){
        let campainName = await contract.name.call();
        expect(campainName).to.equal('funding');

        let targetAmount = await contract.targetAmount.call();
        expect(parseFloat(targetAmount)).to.equal(ONE_ETH);

        let fundingDeadline = await contract.fundingDeadline.call();
        expect(fundingDeadline.toNumber()).to.equal(600);

        let actualBeneficiary = await contract.beneficiary.call();
        expect(actualBeneficiary).to.equal(beneficiary);

        let state = await contract.state.call();
        expect(parseInt(state.valueOf())).to.equal(ONGOING_STATE);

    }); 

    it('Funds are contributed', async function(){
        await contract.contribute(
            {
                value: ONE_ETH,
                from: contractCreator  
            });

        let contributed = await contract.amounts.call(contractCreator);
        expect(parseFloat(contributed)).to.equal(ONE_ETH);

        let totalCollected = await contract.totalCollected.call();
        expect(parseFloat(totalCollected)).to.equal(ONE_ETH);
    });

    it('cannot contribute after deadline', async function() {
        try{
            await contract.setCurrentTime(601);
            await contract.sendTransaction({
                value: ONE_ETH,
                from: contractCreator
            });
            expect.fail();
        } catch(error){
            expect(error.message).to.equal(ERROR_MSG);
        }
    })
    
    const ERROR_MSG = 'Returned error: VM Exception while processing transaction: revert';

    it('crowdfunding succeeded', async function(){        
        await contract.contribute({value: ONE_ETH, from: contractCreator});
        await contract.setCurrentTime(601);
        await contract.finishCrowdFunding();
        let state = await contract.state.call();

        expect(parseInt(state.valueOf())).to.equal(SUCCEEDED_STATE);
    })

    it('crowdfunding failed', async function(){        
        await contract.setCurrentTime(601);
        await contract.finishCrowdFunding();
        let state = await contract.state.call();

        expect(parseInt(state.valueOf())).to.equal(FAILED_STATE);
    })

    it('collected money paid out', async ()=>{
        await contract.contribute({value: ONE_ETH, from: contractCreator});
        await contract.setCurrentTime(601);
        await contract.finishCrowdFunding();

        let initAmount = await web3.eth.getBalance(beneficiary);
        console.log(beneficiary + " : " + initAmount);
        await contract.collect({from: contractCreator});

        let newBalance = await web3.eth.getBalance(beneficiary);
        console.log(beneficiary + " : " + newBalance);
        expect(newBalance - initAmount).to.equal(ONE_ETH);

        let fundingState = await contract.state.call();
        expect(parseInt(fundingState.valueOf())).to.equal(PAID_OUT_STATE);
    });

    it('withdraw funds from the contract', async ()=>{
        await contract.contribute({value: ONE_ETH - 100, from: contractCreator});
        await contract.setCurrentTime(601);
        await contract.finishCrowdFunding();

        await contract.withdraw({from: contractCreator});
        let amount = await contract.amounts.call(contractCreator);
        expect(amount.toNumber()).to.equal(0);
    });
});