import React, { Component } from "react";
import RfpContract from "./artifacts/Rfp.json";
import getWeb3 from "./getWeb3";
import ipfs from "./ipfs";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import dotenv from "dotenv";

import {
  FormGroup,
  FormControl,
  Button,
  Spinner,
  FormFile,
} from "react-bootstrap";

//import Navigation from './Navigation'

class RegisterAgency extends Component {
  constructor(props) {
    super(props);

    this.state = {
      RfpInstance: undefined,
      account: null,
      web3: null,
      name: "",
      age: "12",
      city: "",
      email: "",
      aadharNumber: "",
      panNumber: "FGTPT8972N",
      isVerified: false,
      buffer2: null,
      document: "",
      selectedFile: null,
    };
    this.captureDoc = this.captureDoc.bind(this);
    this.addDoc = this.addDoc.bind(this);
  }

  componentDidMount = async () => {
    //For refreshing page only once
    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }

    try {
      //Get network provider and web3 instance
      const web3 = await getWeb3();

      const accounts = await web3.eth.getAccounts();

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = RfpContract.networks[networkId];
      const instance = new web3.eth.Contract(
        RfpContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      this.setState({
        RfpInstance: instance,
        web3: web3,
        account: accounts[0],
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };
  addDoc = async () => {
    // alert('In add image')
    await ipfs.files.add(this.state.buffer2, (error, result) => {
      if (error) {
        alert(error);
        return;
      }

      //   alert(result[0].hash)
      this.setState({ document: result[0].hash });
      console.log("document:", this.state.document);
    });
  };

  pinFileToIPFS = async (selectedFile) => {
    try {
      let data = new FormData();
      data.append("file", selectedFile);
      data.append("pinataOptions", '{"cidVersion": 0}');
      data.append("pinataMetadata", '{"name": "pinnie"}');
      console.log(selectedFile);
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjYWZiZWZjOS0zYmQzLTQzMTUtOTBhZS1lMTE0ZTk2YzI4YTkiLCJlbWFpbCI6InIucGF0aWRhcjE4MTAwMS4yQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJiMzg4MTdmYjA0OGU5NDJlOTE0ZiIsInNjb3BlZEtleVNlY3JldCI6IjQ5YWQxNTc4YTE3ZTNiZjYxYmViYTAwNDZhOWY3MTg4MzFjMDcxN2U3ZTAxMzEyOTc5OWIzYzMxMDdmNDk5ZWYiLCJpYXQiOjE3MDgyNTExODF9.0gMn_Q95h0rQwNtbaM7UD1Tc4ukblr6sYClAC9EfXY0`,
          },
        }
      );
      const ipfsLink = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
      this.setState({ document: ipfsLink });
      console.log(document);
      console.log(res.data);
      console.log(
        `View the file here: https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`
      );
    } catch (error) {
      console.log(error);
    }
  };

  handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    // Show a confirmation dialog
    const isConfirmed = window.confirm("Do you want to upload this file?");

    // Check if the user confirmed before proceeding
    if (isConfirmed) {
      // Call your pinFileToIPFS function with the selected file
      this.pinFileToIPFS(selectedFile);
    } else {
      // Handle the case when the user cancels the upload
      console.log("File upload cancelled by user");
    }
  };

  RegisterAgency = async () => {
    // this.addDoc();
    // alert('After add image')
    await new Promise((resolve) => setTimeout(resolve, 10000));
    var pattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );

    // if (this.state.name == '' || this.state.age == '' || this.state.city == '' || this.state.aadharNumber == '' || this.state.panNumber == '') {
    //     alert("All the fields are compulsory!");
    // } else if(!Number(this.state.aadharNumber) || this.state.aadharNumber.length != 12 ){
    //     alert("Aadhar Number should be 12 digits long!");
    // } else if(this.state.panNumber.length != 10){
    //     alert("Pan Number should be a 10 digit unique number!");
    // } else if (!Number(this.state.age) || this.state.age < 18) {
    //     alert("Your age must be a number");
    // } else if(this.state.email == '' || !pattern.test(this.state.email)){
    //     alert('Please enter a valid email address\n');
    // }
    // else{
    await this.state.RfpInstance.methods
      .registerAgency(
        this.state.name,
        this.state.age,
        this.state.city,
        this.state.aadharNumber,
        this.state.panNumber,
        this.state.document,
        this.state.email
      )

      .send({
        from: this.state.account,
        gas: 2100000,
      })
      .then((response) => {
        this.props.history.push("/admin/dashboard");
      });

    //Reload
    window.location.reload(false);
    // }
  };

  updateName = (event) => this.setState({ name: event.target.value });
  updateAge = (event) => this.setState({ age: event.target.value });
  updateCity = (event) => this.setState({ city: event.target.value });
  updateEmail = (event) => this.setState({ email: event.target.value });
  updateAadhar = (event) => this.setState({ aadharNumber: event.target.value });
  updatePan = (event) => this.setState({ panNumber: event.target.value });
  captureDoc(event) {
    event.preventDefault();
    const file2 = event.target.files[0];
    const reader2 = new window.FileReader();
    reader2.readAsArrayBuffer(file2);
    reader2.onloadend = () => {
      this.setState({ buffer2: Buffer(reader2.result) });
      console.log("buffer2", this.state.buffer2);
    };
    console.log("caoture doc...");
  }

  render() {
    if (!this.state.web3) {
      return (
        <div className="bodyC">
          {/* <div className="img-wrapper">
                        <img src="https://i.pinimg.com/originals/71/6e/00/716e00537e8526347390d64ec900107d.png" className="logo" />
                        <div className="wine-text-container">
                            <div className="site-title wood-text">Rfp Registry</div>
                        </div>
                    </div> */}
          <div className="auth-wrapper">
            <div className="auth-inner">
              <div>
                <div>
                  <h1>
                    <Spinner animation="border" variant="warning" />
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <>
      <video className='videoTag' id = "myVideo" autoPlay loop muted>
                    <source src={'https://v.ftcdn.net/03/53/86/09/700_F_353860954_nRp3x9nnoaHZ1m0ar4qu8J8fh9SNJ7Fw_ST.mp4'} type='video/mp4' />
                </video>
      <div className="bodyC">
        <div className="img-wrapper">
          {/* <img src="https://i.pinimg.com/originals/71/6e/00/716e00537e8526347390d64ec900107d.png" className="logo" /> */}
          <div className="wine-text-container">
            <div className="site-title wood-text"></div>
          </div>
        </div>
        <div className="auth-wrapper">
          <div className="auth-inner" style={{backgroundColor : 'rgba(255,255,255,0.7)'}}>
            <div className="App">
              <div>
                <div>
                  <h1 style={{ color: "black" }}>Agency Registration</h1>
                </div>
              </div>

              <div className="form">
                <FormGroup>
                  <div className="form-label">Enter Name --</div>
                  <div className="form-input">
                    <FormControl
                      input="text"
                      value={this.state.name}
                      onChange={this.updateName}
                    />
                  </div>
                </FormGroup>

                {/* <FormGroup>
                                    <div className="form-label">
                                        Enter Age --
                      </div>
                                    <div className="form-input">
                                        <FormControl
                                            input='text'
                                            value={this.state.age}
                                            onChange={this.updateAge}
                                        />
                                    </div>
                                </FormGroup> */}

                <FormGroup>
                  <div className="form-label">Enter City --</div>
                  <div className="form-input">
                    <FormControl
                      input="text"
                      value={this.state.city}
                      onChange={this.updateCity}
                    />
                  </div>
                </FormGroup>

                <FormGroup>
                  <div className="form-label">Enter Email Address --</div>
                  <div className="form-input">
                    <FormControl
                      input="text"
                      value={this.state.email}
                      onChange={this.updateEmail}
                    />
                  </div>
                </FormGroup>

                <FormGroup>
                  <div className="form-label">Enter Agency Number --</div>
                  <div className="form-input">
                    <FormControl
                      input="text"
                      value={this.state.aadharNumber}
                      onChange={this.updateAadhar}
                    />
                  </div>
                </FormGroup>

                {/* <FormGroup>
                                    <div className="form-label">
                                        Enter Pan no --
                      </div>
                                    <div className="form-input">
                                        <FormControl
                                            input='text'
                                            value={this.state.panNumber}
                                            onChange={this.updatePan}
                                        />
                                    </div>
                                </FormGroup> */}
                {/* <FormGroup>
                  <label>Add your Aadhar Card (PDF Format)</label>
                  <FormFile id="File2" onChange={this.captureDoc} />
                </FormGroup> */}

                <FormGroup>
                  <label>Add your Aadhar Card (PDF Format)</label>
                  <FormFile id="File2" onChange={this.handleFileChange} />
                </FormGroup>

                <Button onClick={this.RegisterAgency} className="button-vote btn-fill btn-dark">
                  Register as Development Agency
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }
}

export default RegisterAgency;
