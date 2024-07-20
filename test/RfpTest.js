const { expect } = require("chai");
const {
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

  describe("Rfp contract", function () {
  
    async function deployRfp() {
      // Get the Signers here.
      const [owner, addr1, addr2 , shq , addr3] = await ethers.getSigners();
  
      // To deploy our contract, we just have to call ethers.deployContract and await
      // its waitForDeployment() method, which happens once its transaction has been
      // mined.
      const hardhatToken = await ethers.deployContract("Rfp");
  
      await hardhatToken.waitForDeployment();
  
      // Fixtures can return anything you consider useful for your tests
      return { hardhatToken, owner, addr1, addr2 ,shq ,addr3};
    }

    // You can nest describe calls to create subsections.
  describe("Deployment", function () {
   
    it("Should set the right owner", async function () {
     
      const { hardhatToken, owner } = await loadFixture(deployRfp);
      expect(await hardhatToken.RfpAdmin()).to.equal(owner.address);
      
    });
  });


  describe("getRfpCount", function () {
    it("Should return the correct RFP count", async function () {
      const { hardhatToken, owner } = await loadFixture(deployRfp);
      expect(await hardhatToken.RfpAdmin()).to.equal(owner.address);

      const count = await hardhatToken.getRfpCount();
      expect(count).to.equal(0); 
    });
  });
  
  describe("getAgencyCount", function () {
    it("Should return the correct agency count", async function () {
      const { hardhatToken, owner } = await loadFixture(deployRfp);
      expect(await hardhatToken.RfpAdmin()).to.equal(owner.address);

      const count = await hardhatToken.getAgencyCount();
      expect(count).to.equal(0); 
    });
  });
  
  describe("getShqCount", function () {
    it("Should return the correct shq count", async function () {
      const { hardhatToken, owner } = await loadFixture(deployRfp);
      expect(await hardhatToken.RfpAdmin()).to.equal(owner.address);

      const count = await hardhatToken.getShqCount();
      expect(count).to.equal(0); 
    });
  });
  
  describe("getBidCount", function () {
    it("Should return the correct bid count", async function () {
      const { hardhatToken, owner } = await loadFixture(deployRfp);
      expect(await hardhatToken.RfpAdmin()).to.equal(owner.address);

      const count = await hardhatToken.getBidCount();
      expect(count).to.equal(0); 
    });
  });


  describe("registerAgency", function () {
    it("Should register an agency", async function () {
      const { hardhatToken, owner , addr1} = await loadFixture(deployRfp);
      expect(await hardhatToken.RfpAdmin()).to.equal(owner.address);
  
      // Register the agency
      await hardhatToken.connect(addr1).registerAgency("Agency Name", 25, "City", "1234567890", "ABCDE1234F", "Document", "email@example.com");
      
      // console.log(addr1.address);
      // Check if the agency is registered
      const isRegistered = await hardhatToken.isRegistered(addr1.address);
      const isAgency = await hardhatToken.isAgency(addr1.address);
     
      expect(isRegistered).to.be.true;
      expect(isAgency).to.be.false;

      // Check if agency details are stored correctly
      const agencyDetails = await hardhatToken.getAgencyDetails(addr1.address);

      expect(agencyDetails[0]).to.equal("Agency Name");
      expect(agencyDetails[1]).to.equal("City");
      expect(agencyDetails[2]).to.equal("ABCDE1234F");
      expect(agencyDetails[3]).to.equal('Document');
      expect(agencyDetails[4]).to.equal("email@example.com");
      expect(agencyDetails[5]).to.equal(25);
      expect(agencyDetails[6]).to.equal('1234567890');

      // Check if the agency is in the agency list
      const agencyList = await hardhatToken.getAgency();
      expect(agencyList).to.include(addr1.address);

    });
  });

    describe("verifyAgency", function () {
      it("Should verify an agency", async function () {
        const { hardhatToken, owner , addr1} = await loadFixture(deployRfp);
      expect(await hardhatToken.RfpAdmin()).to.equal(owner.address);
  
      // Register the agency
      await hardhatToken.connect(addr1).registerAgency("Agency Name", 25, "City", "1234567890", "ABCDE1234F", "Document", "email@example.com");
      
        // Verify the agency
        await hardhatToken.connect(owner).verifyAgency(addr1.address);
  
        // Check if the agency is verified
        const isVerified = await hardhatToken.AgencyVerification(addr1.address);
        expect(isVerified).to.be.true;
      });
  
    });

    describe("rejectAgency", function () {
      it("Should reject an agency", async function () {
        const { hardhatToken, owner , addr1} = await loadFixture(deployRfp);
      expect(await hardhatToken.RfpAdmin()).to.equal(owner.address);
  
      // Register the agency
      await hardhatToken.connect(addr1).registerAgency("Agency Name", 25, "City", "1234567890", "ABCDE1234F", "Document", "email@example.com");
      
        // Reject the agency
        await hardhatToken.connect(owner).rejectAgency(addr1.address);
  
        // Check if the agency is rejected
        const isRejected = await hardhatToken.AgencyRejection(addr1.address);
        expect(isRejected).to.be.true;
      });
    });

     describe("updateAgency", function () {
        it("Should update agency details", async function () {
          const { hardhatToken, owner , addr1} = await loadFixture(deployRfp);
      expect(await hardhatToken.RfpAdmin()).to.equal(owner.address);

          // Register the agency
      await hardhatToken.connect(addr1).registerAgency("Agency Name", 25, "City", "1234567890", "ABCDE1234F", "Document", "email@example.com");
      
          // Update the agency details
          const newName = "New Name";
          const newAge = 35;
          const newCity = "New City";
          const newAadharNumber = "0987654321";
          const newEmail = "newemail@example.com";
          const newPanNumber = "ZYXWV5432R";
          await hardhatToken.connect(addr1).updateAgency(newName, newAge, newCity, newAadharNumber, newEmail, newPanNumber);
      
          // Retrieve the updated agency details
          const [name, city , panNumber, document ,email ,  age ,   aadharNumber ] = await hardhatToken.getAgencyDetails(addr1.address);
      
          // Check if the details are updated correctly
          expect(name).to.equal(newName);
          expect(age).to.equal(newAge);
          expect(city).to.equal(newCity);
          expect(aadharNumber).to.equal(newAadharNumber);
          expect(email).to.equal(newEmail);
          expect(panNumber).to.equal(newPanNumber);
        });
      });


      describe("getAgencyDetails", function () {
        it("Should return correct details of the agency", async function () {
          // Get the deployed contract and accounts

          const { hardhatToken, owner , addr1} = await loadFixture(deployRfp);
          expect(await hardhatToken.RfpAdmin()).to.equal(owner.address);
    
      
          // Register the agency
          const name = "Agency Name";
          const age = 25;
          const city = "City";
          const aadharNumber = "1234567890";
          const panNumber = "ABCDE1234F";
          const email = "email@example.com";
          const document = "Document";
          await hardhatToken.connect(addr1).registerAgency(name, age, city, aadharNumber, panNumber, document, email);
      
          // Retrieve the updated agency details
          const [rname, rcity , rpanNumber, rdocument ,remail ,   rage ,   raadharNumber ] = await hardhatToken.getAgencyDetails(addr1.address);
      
          // Check if the details are updated correctly
          expect(name).to.equal(rname);
          expect(age).to.equal(rage);
          expect(city).to.equal(rcity);
          expect(aadharNumber).to.equal(raadharNumber);
          expect(email).to.equal(remail);
          expect(panNumber).to.equal(rpanNumber);
        });
      });


      describe("getAgency", function () {
        it("Should return array of agency addresses", async function () {
          // Get the deployed contract and accounts

          const { hardhatToken, owner , addr1 , addr2 } = await loadFixture(deployRfp);
          expect(await hardhatToken.RfpAdmin()).to.equal(owner.address);
    
          // Register agencies
          await hardhatToken.connect(addr1).registerAgency("Agency 1", 30, "City 1", "1234567890", "email1@example.com", "ABCDE1234F", "Document 1");
          await hardhatToken.connect(addr2).registerAgency("Agency 2", 35, "City 2", "0987654321", "email2@example.com", "ZYXWV5432R", "Document 2");
      
          // Retrieve the array of agency addresses
          const agencyAddresses = await hardhatToken.getAgency();
      
          // Check if the returned array contains the addresses of the registered agencies
          expect(agencyAddresses).to.have.lengthOf(2);
          expect(agencyAddresses).to.include(addr1.address);
          expect(agencyAddresses).to.include(addr2.address);
        });
      });

      describe("registerShq", function () {
        it("Should register an SHQ", async function () {
          const { hardhatToken, owner, addr2 } = await loadFixture(deployRfp);
          expect(await hardhatToken.RfpAdmin()).to.equal(owner.address);
      
          // Register the SHQ
          await hardhatToken.connect(addr2).registerShq("SHQ Name", 30, "9876543210", "ABCDE1234F", "Owned RFPs", "SHQ Document");
      
          // Check if the SHQ is registered
          const isRegistered = await hardhatToken.isRegistered(addr2.address);
          const isShq = await hardhatToken.isShq(addr2.address);
      
          expect(isRegistered).to.be.true;
          expect(isShq).to.be.true;
      
          // Check if SHQ details are stored correctly
          const shqDetails = await hardhatToken.getShqDetails(addr2.address);
      
          expect(shqDetails[0]).to.equal("SHQ Name");
          expect(shqDetails[1]).to.equal(30);
          expect(shqDetails[2]).to.equal("9876543210");
          expect(shqDetails[3]).to.equal("ABCDE1234F");
          expect(shqDetails[4]).to.equal("Owned RFPs");
          expect(shqDetails[5]).to.equal("SHQ Document");
      
          // Check if the SHQ is in the SHQ list
          const shqList = await hardhatToken.getShq();
          expect(shqList).to.include(addr2.address);
        });
      });
      
      describe("updateShq", function () {
        it("Should update SHQ details", async function () {
          const { hardhatToken, owner, addr2 } = await loadFixture(deployRfp);
          expect(await hardhatToken.RfpAdmin()).to.equal(owner.address);
      
          // Register the SHQ
          await hardhatToken.connect(addr2).registerShq("Initial Name", 30, "9876543210", "ABCDE1234F", "Initial RFPs", "SHQ Document");
      
          // Update SHQ details
          await hardhatToken.connect(addr2).updateShq("Updated Name", 35, "9876543210", "FGHIJ5678K", "Updated RFPs");
      
          // Check if SHQ details are updated correctly
          const shqDetails = await hardhatToken.getShqDetails(addr2.address);
      
          expect(shqDetails[0]).to.equal("Updated Name");
          expect(shqDetails[1]).to.equal(35);
          expect(shqDetails[2]).to.equal("9876543210");
          expect(shqDetails[3]).to.equal("FGHIJ5678K");
          expect(shqDetails[4]).to.equal("Updated RFPs");
        });
      });
      
      describe("getShq", function () {
        // it("Should return the list of SHQ addresses", async function () {
        //   const { hardhatToken, owner, addr2, addr3 } = await loadFixture(deployRfp);
        //   expect(await hardhatToken.RfpAdmin()).to.equal(owner.address);
      
        //   // Register multiple SHQs
        //   await hardhatToken.connect(addr2).registerShq("SHQ 1", 30, "9876543210", "ABCDE1234F", "RFPs 1", "Document 1");
        //   await hardhatToken.connect(addr3).registerShq("SHQ 2", 35, "9876543211", "FGHIJ5678K", "RFPs 2", "Document 2");
      
        //   // Get the list of SHQs
        //   const shqList = await hardhatToken.getShq();
      
        //   // Check if SHQ addresses are included in the list
        //   expect(shqList).to.include(addr2.address);
        //   expect(shqList).to.include(addr3.address);
        // });
      
        it("Should return an empty array if no SHQs are registered", async function () {
          const { hardhatToken } = await loadFixture(deployRfp);
      
          // Get the list of SHQs
          const shqList = await hardhatToken.getShq();
      
          // Check if the list is empty
          expect(shqList).to.be.an('array').that.is.empty;
        });
      });
      
      describe("getShqDetails", function () {
        it("Should return the details of the SHQ", async function () {
          const { hardhatToken, owner, addr2 } = await loadFixture(deployRfp);
          expect(await hardhatToken.RfpAdmin()).to.equal(owner.address);
      
          // Register the SHQ
          await hardhatToken.connect(addr2).registerShq("SHQ Name", 30, "9876543210", "ABCDE1234F", "RFPs Owned", "SHQ Document");
      
          // Get the details of the SHQ
          const shqDetails = await hardhatToken.getShqDetails(addr2.address);
      
          // Check if SHQ details are returned correctly
          expect(shqDetails[0]).to.equal("SHQ Name");
          expect(shqDetails[1]).to.equal(30);
          expect(shqDetails[2]).to.equal("9876543210");
          expect(shqDetails[3]).to.equal("ABCDE1234F");
          expect(shqDetails[4]).to.equal("RFPs Owned");
          expect(shqDetails[5]).to.equal("SHQ Document");
        });
      });

      describe("verifyShq", function () {
        it("Should verify the SHQ", async function () {
          const { hardhatToken, owner, addr2 } = await loadFixture(deployRfp);
          expect(await hardhatToken.RfpAdmin()).to.equal(owner.address);
      
          // Register the SHQ
          await hardhatToken.connect(addr2).registerShq("SHQ Name", 30, "9876543210", "ABCDE1234F", "RFPs Owned", "SHQ Document");
      
          // Verify the SHQ
          await hardhatToken.verifyShq(addr2.address);
      
          // Check if SHQ is verified
          const isVerified = await hardhatToken.isVerified(addr2.address);
          expect(isVerified).to.be.true;
        });
      });
      
      describe("rejectShq", function () {
        it("Should reject the SHQ", async function () {
          const { hardhatToken, owner, addr2 } = await loadFixture(deployRfp);
          expect(await hardhatToken.RfpAdmin()).to.equal(owner.address);
      
          // Register the SHQ
          await hardhatToken.connect(addr2).registerShq("SHQ Name", 30, "9876543210", "ABCDE1234F", "RFPs Owned", "SHQ Document");
      
          // Reject the SHQ
          await hardhatToken.rejectShq(addr2.address);
      
          // Check if SHQ is rejected
          const isRejected = await hardhatToken.isRejected(addr2.address);
          expect(isRejected).to.be.true;
        });
      });
      
      describe("addRfp", function () {
        it("Should add a new RFP", async function () {
          const { hardhatToken, owner, addr2 } = await loadFixture(deployRfp);
          expect(await hardhatToken.RfpAdmin()).to.equal(owner.address);
      
          // Register an agency and verify it
          await hardhatToken.connect(addr2).registerAgency("Agency Name", 25, "City", "1234567890", "ABCDE1234F", "Document", "email@example.com");
          await hardhatToken.connect(owner).verifyAgency(addr2.address);
      
          // Add a new RFP
          const area = 1000;
          const city = "City";
          const state = "State";
          const rfpPrice = 10000;
          const propertyPID = 12345;
          const surveyNum = 54321;
          const ipfsHash = "IPFS Hash";
          const document = "Document";
      
          await hardhatToken.connect(addr2).addRfp(area, city, state, rfpPrice, propertyPID, surveyNum, ipfsHash, document);
      
          // Check if the RFP details are stored correctly
          const rfpDetails = await hardhatToken.rfps(1);
      
          expect(rfpDetails.id).to.equal(1);
          expect(rfpDetails.area).to.equal(area);
          expect(rfpDetails.city).to.equal(city);
          expect(rfpDetails.state).to.equal(state);
          expect(rfpDetails.rfpPrice).to.equal(rfpPrice);
          expect(rfpDetails.rfpssId).to.equal(propertyPID);
          expect(rfpDetails.physicalSurveyNumber).to.equal(surveyNum);
          expect(rfpDetails.ipfsHash).to.equal(ipfsHash);
          expect(rfpDetails.document).to.equal(document);
      
          // Check if the RFP owner is set correctly
          const rfpOwner = await hardhatToken.getRfpOwner(1);
          expect(rfpOwner).to.equal(addr2.address);
        });
      
      });
      
      describe("verifyRfp", function () {
        it("Should verify the RFP", async function () {
          const { hardhatToken, owner, addr2 } = await loadFixture(deployRfp);
          expect(await hardhatToken.RfpAdmin()).to.equal(owner.address);
      
          // Register an agency and verify it
          await hardhatToken.connect(addr2).registerAgency("Agency Name", 25, "City", "1234567890", "ABCDE1234F", "Document", "email@example.com");
          await hardhatToken.connect(owner).verifyAgency(addr2.address);
      
          // Add a new RFP
          await hardhatToken.connect(addr2).addRfp(1000, "City", "State", 10000, 12345, 54321, "IPFS Hash", "Document");
      
          // Verify the RFP
          await hardhatToken.verifyRfp(1);
      
          // Check if RFP is verified
          const isVerified = await hardhatToken.isRfpVerified(1);
          expect(isVerified).to.be.true;
        });
      });

      describe("isRfpVerified", function () {
        it("Should return true if RFP is verified", async function () {
          const { hardhatToken, owner, addr2 } = await loadFixture(deployRfp);
          expect(await hardhatToken.RfpAdmin()).to.equal(owner.address);
      
          // Register an agency and verify it
          await hardhatToken.connect(addr2).registerAgency("Agency Name", 25, "City", "1234567890", "ABCDE1234F", "Document", "email@example.com");
          await hardhatToken.connect(owner).verifyAgency(addr2.address);
      
          // Add a new RFP
          await hardhatToken.connect(addr2).addRfp(1000, "City", "State", 10000, 12345, 54321, "IPFS Hash", "Document");
      
          // Verify the RFP
          await hardhatToken.verifyRfp(1);
      
          // Check if RFP is verified
          const isVerified = await hardhatToken.isRfpVerified(1);
          expect(isVerified).to.be.true;
        });
      
        it("Should return false if RFP is not verified", async function () {
          const { hardhatToken, owner, addr2 } = await loadFixture(deployRfp);
          expect(await hardhatToken.RfpAdmin()).to.equal(owner.address);
      
          // Register an agency and verify it
          await hardhatToken.connect(addr2).registerAgency("Agency Name", 25, "City", "1234567890", "ABCDE1234F", "Document", "email@example.com");
          await hardhatToken.connect(owner).verifyAgency(addr2.address);
      
          // Add a new RFP
          await hardhatToken.connect(addr2).addRfp(1000, "City", "State", 10000, 12345, 54321, "IPFS Hash", "Document");
      
          // Check if RFP is verified
          const isVerified = await hardhatToken.isRfpVerified(1);
          expect(isVerified).to.be.false;
        });
      });
      
      describe("getArea", function () {
        it("Should return the correct area of an RFP", async function () {
          const { hardhatToken, owner, addr2 } = await loadFixture(deployRfp);
          expect(await hardhatToken.RfpAdmin()).to.equal(owner.address);
      
          // Register an agency and verify it
          await hardhatToken.connect(addr2).registerAgency("Agency Name", 25, "City", "1234567890", "ABCDE1234F", "Document", "email@example.com");
          await hardhatToken.connect(owner).verifyAgency(addr2.address);
      
          // Add a new RFP
          await hardhatToken.connect(addr2).addRfp(1000, "City", "State", 10000, 12345, 54321, "IPFS Hash", "Document");
      
          // Get area of the RFP
          const area = await hardhatToken.getArea(1);
      
          // Check if the returned value matches the expected value
          expect(area).to.equal(1000);
        });
      
      });
      
      describe("getCity, getState", function () {
        it("Should return the correct city and state of an RFP", async function () {
          const { hardhatToken, owner, addr2 } = await loadFixture(deployRfp);
          expect(await hardhatToken.RfpAdmin()).to.equal(owner.address);
      
          // Register an agency and verify it
          await hardhatToken.connect(addr2).registerAgency("Agency Name", 25, "City", "1234567890", "ABCDE1234F", "Document", "email@example.com");
          await hardhatToken.connect(owner).verifyAgency(addr2.address);
      
          // Add a new RFP
          await hardhatToken.connect(addr2).addRfp(1000, "City", "State", 10000, 12345, 54321, "IPFS Hash", "Document");
      
          // Get city and state of the RFP
          const city = await hardhatToken.getCity(1);
          const state = await hardhatToken.getState(1);
      
          // Check if the returned values match the expected values
          expect(city).to.equal("City");
          expect(state).to.equal("State");
        });
      
      });
      
      describe("getPrice, getPID, getSurveyNumber, getImage, getDocument", function () {
        it("Should return the correct details of an RFP", async function () {
          const { hardhatToken, owner, addr2 } = await loadFixture(deployRfp);
          expect(await hardhatToken.RfpAdmin()).to.equal(owner.address);
      
          // Register an agency and verify it
          await hardhatToken.connect(addr2).registerAgency("Agency Name", 25, "City", "1234567890", "ABCDE1234F", "Document", "email@example.com");
          await hardhatToken.connect(owner).verifyAgency(addr2.address);
      
          // Add a new RFP
          await hardhatToken.connect(addr2).addRfp(1000, "City", "State", 10000, 12345, 54321, "IPFS Hash", "Document");
      
          // Get details of the RFP
          const price = await hardhatToken.getPrice(1);
          const pid = await hardhatToken.getPID(1);
          const surveyNumber = await hardhatToken.getSurveyNumber(1);
          const image = await hardhatToken.getImage(1);
          const document = await hardhatToken.getDocument(1);
      
          // Check if the returned values match the expected values
          expect(price).to.equal(10000);
          expect(pid).to.equal(12345);
          expect(surveyNumber).to.equal(54321);
          expect(image).to.equal("IPFS Hash");
          expect(document).to.equal("Document");
        });
      });

      describe("getRfpOwner", function () {
        it("Should return the correct owner address of an RFP", async function () {
          const { hardhatToken, owner, addr2 } = await loadFixture(deployRfp);
          expect(await hardhatToken.RfpAdmin()).to.equal(owner.address);
      
          // Register an agency and verify it
          await hardhatToken.connect(addr2).registerAgency("Agency Name", 25, "City", "1234567890", "ABCDE1234F", "Document", "email@example.com");
          await hardhatToken.connect(owner).verifyAgency(addr2.address);
      
          // Add a new RFP
          await hardhatToken.connect(addr2).addRfp(1000, "City", "State", 10000, 12345, 54321, "IPFS Hash", "Document");
      
          // Get owner address of the RFP
          const rfpOwner = await hardhatToken.getRfpOwner(1);
      
          // Check if the returned value matches the expected owner address
          expect(rfpOwner).to.equal(addr2.address);
        });
      });
      
      describe("requestBid", function () {
        it("Should add a bid request and update mappings", async function () {
          const { hardhatToken, owner, addr3, addr2 } = await loadFixture(deployRfp);
          expect(await hardhatToken.RfpAdmin()).to.equal(owner.address);
      
          // Register an SHQ and verify it
          await hardhatToken.connect(addr3).registerShq("SHQ Name", 30, "1234567890", "ABCDE1234F", "RFP Owned", "Document");
          await hardhatToken.connect(owner).verifyShq(addr3.address);
      
          // Register an agency and verify it
          await hardhatToken.connect(addr2).registerAgency("Agency Name", 25, "City", "1234567890", "ABCDE1234F", "Document", "email@example.com");
          await hardhatToken.connect(owner).verifyAgency(addr2.address);
      
          // Add a new RFP
          await hardhatToken.connect(addr2).addRfp(1000, "City", "State", 10000, 12345, 54321, "IPFS Hash", "Document");
      
          // Request a bid
          await hardhatToken.connect(addr3).requestBid(addr2.address, 1);
      
          // Check if the bid request is added and mappings are updated
          const isRequested = await hardhatToken.isRequested(1);
          const bidDetails = await hardhatToken.getBidDetails(1);
      
          expect(isRequested).to.be.true;
          expect(bidDetails[0]).to.equal(addr2.address);
          expect(bidDetails[1]).to.equal(addr3.address);
          expect(bidDetails[2]).to.equal(1);
          expect(bidDetails[3]).to.be.false;
        });
      });
      
      describe("getBidDetails", function () {
        it("Should return the bid details for a given request ID", async function () {
          const { hardhatToken, owner, addr2, addr3 } = await loadFixture(deployRfp);
          expect(await hardhatToken.RfpAdmin()).to.equal(owner.address);
      
          // Register an SHQ and verify it
          await hardhatToken.connect(addr3).registerShq("SHQ Name", 30, "1234567890", "ABCDE1234F", "RFP Owned", "Document");
          await hardhatToken.connect(owner).verifyShq(addr3.address);
      
          // Register an agency and verify it
          await hardhatToken.connect(addr2).registerAgency("Agency Name", 25, "City", "1234567890", "ABCDE1234F", "Document", "email@example.com");
          await hardhatToken.connect(owner).verifyAgency(addr2.address);
      
          // Add a new RFP
          await hardhatToken.connect(addr2).addRfp(1000, "City", "State", 10000, 12345, 54321, "IPFS Hash", "Document");
      
          // Request a bid for the RFP
          await hardhatToken.connect(addr3).requestBid(addr2.address, 1);
      
          // Retrieve the bid details
          const bidDetails = await hardhatToken.getBidDetails(1);
      
          // Check if the bid details match the expected values
          expect(bidDetails[0]).to.equal(addr2.address); // SHQ ID
          expect(bidDetails[1]).to.equal(addr3.address); // Agency ID
          expect(bidDetails[2]).to.equal(1); // RFP ID
          expect(bidDetails[3]).to.be.false; // Request status (should be false initially)
        });
      });
      
      describe("isRequested", function () {
        it("Should return true if a bid request with the given ID exists", async function () {
          const { hardhatToken, owner, addr2, addr3 } = await loadFixture(deployRfp);
          expect(await hardhatToken.RfpAdmin()).to.equal(owner.address);
      
          // Register an SHQ and verify it
          await hardhatToken.connect(addr3).registerShq("SHQ Name", 30, "1234567890", "ABCDE1234F", "RFP Owned", "Document");
          await hardhatToken.connect(owner).verifyShq(addr3.address);
      
          // Register an agency and verify it
          await hardhatToken.connect(addr2).registerAgency("Agency Name", 25, "City", "1234567890", "ABCDE1234F", "Document", "email@example.com");
          await hardhatToken.connect(owner).verifyAgency(addr2.address);
      
          // Add a new RFP
          await hardhatToken.connect(addr2).addRfp(1000, "City", "State", 10000, 12345, 54321, "IPFS Hash", "Document");
      
          // Request a bid for the RFP
          await hardhatToken.connect(addr3).requestBid(addr2.address, 1);
      
          // Check if the bid request exists
          const isRequested = await hardhatToken.isRequested(1);
      
          // Verify that the function returns true
          expect(isRequested).to.be.true;
        });
      });
      
      describe("isApproved", function () {
        it("Should return true if a bid request with the given ID is approved", async function () {
          const { hardhatToken, owner, addr2, addr3 } = await loadFixture(deployRfp);
          expect(await hardhatToken.RfpAdmin()).to.equal(owner.address);
      
          // Register an SHQ and verify it
          await hardhatToken.connect(addr3).registerShq("SHQ Name", 30, "1234567890", "ABCDE1234F", "RFP Owned", "Document");
          await hardhatToken.connect(owner).verifyShq(addr3.address);
      
          // Register an agency and verify it
          await hardhatToken.connect(addr2).registerAgency("Agency Name", 25, "City", "1234567890", "ABCDE1234F", "Document", "email@example.com");
          await hardhatToken.connect(owner).verifyAgency(addr2.address);
      
          // Add a new RFP
          await hardhatToken.connect(addr2).addRfp(1000, "City", "State", 10000, 12345, 54321, "IPFS Hash", "Document");
      
          // Request a bid for the RFP
          await hardhatToken.connect(addr3).requestBid(addr2.address, 1);
      
          // Approve the bid request
          await hardhatToken.connect(addr3).approveRequest(1);
      
          // Check if the bid request is approved
          const isApproved = await hardhatToken.isApproved(1);
      
          // Verify that the function returns true
          expect(isApproved).to.be.true;
        });
      });

      describe("approveRequest", function () {
        it("Should approve a bid request and update the status", async function () {
          const { hardhatToken, owner, addr2, addr3 } = await loadFixture(deployRfp);
          expect(await hardhatToken.RfpAdmin()).to.equal(owner.address);
      
          // Register an SHQ and verify it
          await hardhatToken.connect(addr3).registerShq("SHQ Name", 30, "1234567890", "ABCDE1234F", "RFP Owned", "Document");
          await hardhatToken.connect(owner).verifyShq(addr3.address);
      
          // Register an agency and verify it
          await hardhatToken.connect(addr2).registerAgency("Agency Name", 25, "City", "1234567890", "ABCDE1234F", "Document", "email@example.com");
          await hardhatToken.connect(owner).verifyAgency(addr2.address);
      
          // Add a new RFP
          await hardhatToken.connect(addr2).addRfp(1000, "City", "State", 10000, 12345, 54321, "IPFS Hash", "Document");
      
          // Request a bid for the RFP
          await hardhatToken.connect(addr3).requestBid(addr2.address, 1);
      
          // Approve the bid request
          await hardhatToken.connect(addr3).approveRequest(1);
      
          // Check if the request is approved
          const isApproved = await hardhatToken.isApproved(1);
      
          // Verify that the request status is updated
          const requestStatus = await hardhatToken.RequestStatus(1);
      
          // Verify that the request is approved
          expect(isApproved).to.be.true;
      
          // Verify that the request status is true (approved)
          expect(requestStatus).to.be.true;
        });
      });
      
      describe("RfpOwnershipTransfer", function () {
        it("Should transfer ownership of an RFP to a new owner", async function () {
          const { hardhatToken, owner, addr2, addr3 } = await loadFixture(deployRfp);
          expect(await hardhatToken.RfpAdmin()).to.equal(owner.address);
      
          // Register an agency and verify it
          await hardhatToken.connect(addr2).registerAgency("Agency Name", 25, "City", "1234567890", "ABCDE1234F", "Document", "email@example.com");
          await hardhatToken.connect(owner).verifyAgency(addr2.address);
      
          // Add a new RFP
          await hardhatToken.connect(addr2).addRfp(1000, "City", "State", 10000, 12345, 54321, "IPFS Hash", "Document");
      
          // Transfer ownership of the RFP to addr3
          await hardhatToken.connect(owner).RfpOwnershipTransfer(1, addr3.address);
      
          // Check if the new owner is correctly assigned
          const newOwner = await hardhatToken.getRfpOwner(1);
          expect(newOwner).to.equal(addr3.address);
        });
      
      });
      

  
  });


