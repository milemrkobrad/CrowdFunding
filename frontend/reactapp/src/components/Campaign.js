import React, {Component} from 'react';
import {Button, Input, Header, Table, Tab} from 'semantic-ui-react'
import { createContract } from '../ethereum/crowdfundingContract';
import { web3 } from '../ethereum/web3';

export class Campaign extends Component{
    ONGOING_SATE = '0'
    FAILED_STATE = '1'
    SUCCEEDED_STATE = '2'
    PAID_OUT_STATE = '3'

    state = {
        campaign: {
            name: 'N/A',
            targetAmount: 0,
            totalCollected: 0,
            campaignFinished: false,
            deadline: new Date(0),
            isBeneficiary: false,
            state: ''
        },
        contributionAmount: '0'
    }

    constructor(props){
        super(props)

        this.onContribute = this.onContribute.bind(this);
    }

    async componentDidMount(){        
        //console.log(this.getCampaignAddress());
        const currentCampaign = await this.getCampaign(this.getCampaignAddress());
        // console.log('currenCampaign: ' + currentCampaign);
        // this.setState({
        //     campaign: currentCampaign
        // });
    }

    getCampaignAddress(){
        return this.props.match.params.address;
    }

    async getCampaign(address){
        const contract = await createContract(address);
        const name = await contract.method.name().call().then(console);
        /*
        console.log('acc: ' + contract.defaultHardfork);
        const name = await contract.method.name().call();
        const targetAmount = await contract.method.targetAmount().call();
        const totalCollected = await contract.method.totalCollected().call();
        const beforeDeadline = await contract.method.beforeDeadline().call();
        const beneficiary = await contract.method.beneficiary().call();
        const deadlineSeconds = await contract.method.fundingDeadline().call();
        const state = await contract.method.state().call();


        var deadlineDate = new Date(0);
        deadlineDate.setUTCSeconds(deadlineSeconds);

        const accounts = await web3.eth.getAccounts();
        return {
            name: name,
            targetAmount: targetAmount,
            totalCollected: totalCollected,
            campaignFinished: !beforeDeadline,
            deadline: deadlineDate,
            isBeneficiary: beneficiary.toLowerCase() === accounts[0].toLowerCase(),
            state: state
        }*/
    }

    render(){
        return(
            <div>
                {/* <Table celled padded color="teal" striped>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Value</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        <Table.Row>
                            <Table.Cell singleLine>
                                Name
                            </Table.Cell>
                            <Table.Cell singleLine>
                                {this.state.campaign.name}
                            </Table.Cell>
                        </Table.Row>

                        <Table.Row>
                            <Table.Cell singleLine>
                                Target amount
                            </Table.Cell>
                            <Table.Cell singleLine>
                                {this.state.campaign.targetAmount}
                            </Table.Cell>
                        </Table.Row>

                        <Table.Row>
                            <Table.Cell singleLine>
                                Total collected
                            </Table.Cell>
                            <Table.Cell singleLine>
                                {this.state.campaign.totalCollected}
                            </Table.Cell>
                        </Table.Row>

                        <Table.Row>
                            <Table.Cell singleLine>
                                Campaign finished
                            </Table.Cell>
                            <Table.Cell singleLine>
                                {this.state.campaign.campaignFinished}
                            </Table.Cell>
                        </Table.Row>

                        <Table.Row>
                            <Table.Cell singleLine>
                                Deadline
                            </Table.Cell>
                            <Table.Cell singleLine>
                                {this.state.campaign.deadline}
                            </Table.Cell>
                        </Table.Row>

                        <Table.Row>
                            <Table.Cell singleLine>
                                Is beneficiary
                            </Table.Cell>
                            <Table.Cell singleLine>
                                {this.state.campaign.isBeneficiary}
                            </Table.Cell>
                        </Table.Row>

                        <Table.Row>
                            <Table.Cell singleLine>
                                State
                            </Table.Cell>
                            <Table.Cell singleLine>
                                {this.state.campaign.state}
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table> */}

            </div>
        )
    }

    campaignInteractionSection(){
        if (this.state.campaign.campaignFinished){
            return this.postCampaignInterface()
        }
        else {
            return this.contributeInterface()
        }
    }

    postCampaignInterface(){
        if (this.state.campaign.state === this.ONGOING_SATE){
            return <div>
                <Button type='submit' positive>Finish campaign</Button>
            </div>
        }

        if (this.state.campaign.state === this.SUCCEEDED_STATE && this.state.campaign.isBeneficiary === true){
            return <div>
                <Button type='submit' negative>Collect funds</Button>
            </div>
        }

        if (this.state.campaign.state === this.FAILED_STATE){
            return <div>
                <Button type='submit' negative>Refund</Button>
            </div>
        }
    }

    contributeInterface(){
        return <div>

            <Input
                action={{
                    color: 'teal',
                    content: 'Contribute',
                    onClick: this.onContribute
                }} 
                actionPosition='left'
                label='ETH'
                labelPosition='right'
                placeholder='1'
                onChange={(e)=>this.setState({contributionAmount:e.target.value})}
            />
        </div>
    }

    onContribute(event) {
        alert(`Contributing ${this.state.contributionAmount} to a contract`)
    }
}