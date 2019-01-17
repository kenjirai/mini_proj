pragma solidity ^0.5.0;

import "remix_tests.sol"; // this import is automatically injected by Remix.
import "remix_accounts.sol";
import "./SignTheDoc.sol";

contract SignTheDocTest {

    SignTheDoc docTest;
    bytes signature;
    bytes32 docHash;
    address[] authorisedSignerList;
    //authorisedSigners[0] = msg.sender;
    uint256 expiryDate;

    address testAcc1;
    address testAcc2;
    address testAcc3;

    //Returned recorded docHash data

    address retCreatorAddress;
    uint256 retCreationDate;
    uint256 retExpiryDate;
    bytes32 retDocHash;
    bytes retSignature;
    address[] retAuthorisedSignerList;
    address[] retWhoSigned;

    function beforeAll() public {
      docTest = new SignTheDoc();
      signature = "0xcc09a814e20b0ff25f8bbc3b61c2c08aa5e0aad46f9272f5cd6f85a863ba16912983a1a71ff4a6ca413c97945077aae77bbcadf97a42588f7160b192464833021c";
      docHash = keccak256("Hello World!");
      //authorisedSignerList = [0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c, 0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C];
      expiryDate = block.timestamp + 500;

      testAcc1 = TestsAccounts.getAccount(0);
      testAcc2 = TestsAccounts.getAccount(1);
      testAcc3 = TestsAccounts.getAccount(2);
   }

   /*
   function beforeEach() public {
     (retCreatorAddress,
     retCreationDate,
     retExpiryDate,
     retDocHash,
     retSignature,
     retAuthorisedSignerList,
     retWhoSigned) = docTest.getDocData(docHash);
   }
*/

    function testCreateDocToSig() public {

      authorisedSignerList = [testAcc1, testAcc2];

      docTest.createDocToSign(msg.sender,
        expiryDate,
        docHash,
        signature,
        authorisedSignerList);

      (retCreatorAddress,
      retCreationDate,
      retExpiryDate,
      retDocHash,
      retSignature,
      retAuthorisedSignerList,
      retWhoSigned) = docTest.getDocData(docHash);

      Assert.equal(retCreatorAddress, msg.sender, 'Hash should be equal');
      Assert.equal(retExpiryDate, expiryDate, 'Expiry Date set at Initial should be equal');
      Assert.equal(retDocHash, docHash, 'Hash should match');
      Assert.equal(keccak256(retSignature), keccak256(signature), 'Signature should match');
      Assert.equal(keccak256(abi.encodePacked(retAuthorisedSignerList)), keccak256(abi.encodePacked(authorisedSignerList)), 'Signature should match');
    }

    function testEmptyAuthorisedSignerList() public {
      authorisedSignerList;

      docTest.createDocToSign(msg.sender,
        expiryDate,
        docHash,
        signature,
        //pasing empty array
        authorisedSignerList);

      (retCreatorAddress,
      retCreationDate,
      retExpiryDate,
      retDocHash,
      retSignature,
      retAuthorisedSignerList,
      retWhoSigned) = docTest.getDocData(docHash);

    Assert.equal(keccak256(abi.encodePacked(retAuthorisedSignerList)),
    keccak256(abi.encodePacked(authorisedSignerList)),
    'Empty initilise authoriseSignerList should be length 0');
  }

function testCorrectBooleanEntryForAuthoriseToSign() public {

  authorisedSignerList = [testAcc1, testAcc2];

  docTest.createDocToSign(msg.sender,
    expiryDate,
    docHash,
    signature,
    authorisedSignerList);

  bool authTrue = docTest.isAuthorisedToSign(docHash, msg.sender);
  Assert.equal(authTrue, true, "Must authroise to sign and should return true");

  bool authFalse = docTest.isAuthorisedToSign(docHash, testAcc3);
  Assert.equal(authFalse, false, "Must not authroise to sign and should return false");
}

}
