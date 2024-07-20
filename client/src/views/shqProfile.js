import React, {Component} from 'react'
import Rfp from "../artifacts/Rfp.json"
import getWeb3 from "../getWeb3"

import '../index.css';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { DrizzleProvider } from 'drizzle-react';
import { Table, Spinner } from 'react-bootstrap';
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardText,
    FormGroup,
    Form,
    Input,
    Row,
    Col,
  } from "reactstrap";

import {
    LoadingContainer,
    AccountData,
    ContractData,
    ContractForm
} from 'drizzle-react-components'

const drizzleOptions = {
    contracts: [Rfp]
}

// var agencys = 0;
// var shhqs = 0;
var shhq;
var shqTable = [];
var verification = [];

class shqProfile extends Component {
    constructor(props){
        super(props)

        this.state = {
            RfpInstance: undefined,
            account: null,
            web3: null,
            agencys: 0,
            shhqs: 0,
            verified: false,
        }
    }

    componentDidMount = async () => {
        //For refreshing page only once
        if(!window.location.hash){
            window.location = window.location + '#loaded';
            window.location.reload();
        }

        try{
            //Get network provider and web3 instance
            const web3 = await getWeb3();

            const accounts = await web3.eth.getAccounts();

            const currentAddress = await web3.currentProvider.selectedAddress;
            console.log(currentAddress);
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = Rfp.networks[networkId];
            const instance = new web3.eth.Contract(
                Rfp.abi,
                deployedNetwork && deployedNetwork.address,
            );

            this.setState({ RfpInstance: instance, web3: web3, account: accounts[0] });

            var shq_verify = await this.state.RfpInstance.methods.isVerified(currentAddress).call();
            console.log(shq_verify);
            this.setState({verified: shq_verify})    
            var not_verify = await this.state.RfpInstance.methods.isRejected(currentAddress).call();
            console.log(not_verify);
            if(shq_verify){
              verification.push(<p id = "verified">Verified <i class="fas fa-user-check"></i></p>);
            }else if(not_verify){
              verification.push(<p  id = "rejected">Rejected <i class="fas fa-user-times"></i></p>);
            }else{
              verification.push(<p id = "unknown">Not Yet Verified <i class="fas fa-user-cog"></i></p>);
            }

            shhq = await this.state.RfpInstance.methods.getShqDetails(currentAddress).call();
            console.log(shhq);
            console.log(shhq[0]);
            console.log(shhq[2]);
            console.log(shhq[3]);
            console.log(shhq[4]);
            console.log(shhq[5]);
            
            //shqTable.push(<div><p>Name: {shhq[0]}</p><p>Age: {shhq[1]}</p><p>Aadhar Number: {shhq[2]}</p><p>Pan Number: {shhq[3]}</p><p>Owned Rfps: {shhq[4]}</p></div>);
              shqTable.push(<>
              <Row>
                <Col md="12">
                  <FormGroup>
                    <label>Your Wallet Address: </label>
                    <Input
                      disabled
                      type="text"
                      value={currentAddress}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="12">
                  <FormGroup>
                    <label>Name</label>
                    <Input
                      disabled
                      type="text"
                      value={shhq[0]}
                    />
                  </FormGroup>
                </Col>

              </Row>
              <Row>
                <Col md="12">
                  <FormGroup>
                    <label>Age</label>
                    <Input
                      disabled
                      type="text"
                      value={shhq[1]}
                    />
                  </FormGroup>
                </Col>
                
              </Row>
              <Row>
                <Col md="12">
                  <FormGroup>
                    <label>Aadhar Number</label>
                    <Input
                    disabled
                    type="text"
                    value={shhq[2]}  
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="12">
                  <FormGroup>
                    <label>Pan Number</label>
                    <Input
                    disabled
                    type="text"
                    value={shhq[3]}  
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="12">
                  <FormGroup>
                    <label>Your Aadhar Document</label>
                    <div class="post-meta"><span class="timestamp"> <a href={`${shhq[5]}`} target="_blank">Here</a></span></div>
                  </FormGroup>
                </Col>
              </Row>
              </>);  

        }catch (error) {
            // Catch any errors for any of the above operations.
            alert(
              `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
          }
    };

    render() {
        if (!this.state.web3) {
        return (
            <div>
            <div>
                <h1>
                <Spinner animation="border" variant="primary" />
                </h1>
            </div>
            
            </div>
        );
        }

        return (
            <div className="content">
            <DrizzleProvider options={drizzleOptions}>
            <LoadingContainer>
                
                {/* <div >
                    <h5>Shq Profile</h5>
                
                        {shqTable}
        
                </div> */}
                        <Row>
                            <Col md="8">
                                <Card>
                                    <CardHeader>
                                        <h5 className="title">Shq Profile</h5>
                                        <h5 className="title">{verification}</h5>

                                    </CardHeader>
                                    <CardBody>
                                        <Form>
                                            {shqTable}
                                            <Button href="/Shq/updateShq"  className="btn-fill btn-dark" disabled={!this.state.verified} color="primary">
                                            Edit Profile
                                      </Button>
                                        </Form>
                                    </CardBody>
                                    <CardFooter>
                                     
                                    </CardFooter>
                                </Card>
                            </Col>
                        </Row>
            </LoadingContainer>
            </DrizzleProvider>
            </div>
        );

    }    
}

export default shqProfile;