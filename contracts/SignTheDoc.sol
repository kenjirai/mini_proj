pragma solidity ^ 0.5.0;

contract SignTheDoc {

  struct Creator {
    address creatorAddress;
    uint256 creationDate;
    uint256 expiryDate;
    bytes32 docHash;
    bytes signature;
    address[] authorisedSignerList;
    address[] whoSigned;
    mapping(address => bool) authorisedToSign;
    mapping(address => Signer) signerInfo;
  }

  struct Signer {
    address signerAddress;
    uint256 signedDate;
    bytes32 docHash;
    bytes signature;
  }

  //Record of the creator hash creation for easy access
  mapping(address => bytes32[]) creatorDocHashes;

  //Hash of the data is linked to Creator Struct
  mapping(bytes32 => Creator) docData;

  //Probably unnecessary
  Signer[] signers;

  modifier isDocHashUnique(bytes32 docHash) {
    require(
      docData[docHash].docHash == bytes32(0),
      'Hash must be unique.'
    );
    _;
  }

  modifier isExpired(uint256 expiryDate) {
    require(
      expiryDate > block.timestamp,
      'Contract expiry date should be greater than current time.');
    _;
  }

  modifier verifySignature(bytes32 hash, bytes32 r, bytes32 s, uint8 v) {
    bytes memory prefix = "\x19Ethereum Signed Message:\n32";
    bytes32 prefixedHash = keccak256(abi.encodePacked(prefix, hash));
    require(ecrecover(prefixedHash, v, r, s) == msg.sender,
      'Signature verification failed');
    _;
  }

  function isAuthorised(bytes32 docHash) public view returns(bool) {
    return (docData[docHash].authorisedToSign[msg.sender]);
  }

  function multipleValidations(address creator, bytes32 signerDocHash) public view returns(bool){
    require(
      signerDocHash == docData[signerDocHash].docHash,
      'Failed to verify document hash.'
    );

    require(
      docData[signerDocHash].creatorAddress == creator,
      'Failed to verify creator address.'
    );

    if(docData[signerDocHash].authorisedSignerList.length != 0) {
      require(
        isAuthorised(signerDocHash),
        'Provided address not authorised to sign the document.'
      );
    }
    return true;
  }

  function createDocToSign(
    uint256 expiryDate,
    bytes memory signature,
    address[] memory authorisedSignerList,
    bytes32 docHash,
    bytes32 r,
    bytes32 s,
    uint8 v
  )
  public
  isDocHashUnique(docHash)
  isExpired(expiryDate)
  verifySignature(docHash, r, s, v)
  {
    recordInitialDoc(expiryDate, signature, authorisedSignerList, docHash);
  }

  function recordInitialDoc(uint256 expiryDate, bytes memory signature, address[] memory authorisedSignerList, bytes32 docHash)  public {
    Creator storage creator = docData[docHash];

    creator.creatorAddress = msg.sender;
    creator.creationDate = block.timestamp;
    creator.expiryDate = expiryDate;
    creator.docHash = docHash;
    creator.signature = signature;
    creator.authorisedSignerList = authorisedSignerList;

    if (authorisedSignerList.length == 1) {
      creator.authorisedToSign[authorisedSignerList[0]] = true;
    } else if (authorisedSignerList.length > 1) {
      for (uint i = 0; i < authorisedSignerList.length; i++) {
        creator.authorisedToSign[authorisedSignerList[i]] = true;
      }
    }
  }

  //Returns the content of the struct
  function getDocData(bytes32 regDocHash)
  public
  view
  returns(
    address creatorAddress,
    uint256 creationDate,
    uint256 expiryDate,
    bytes32 docHash,
    bytes memory signature,
    address[] memory authorisedSigners,
    address[] memory whoSigned
  ) {
    Creator memory cr = docData[regDocHash];
    return (cr.creatorAddress, cr.creationDate, cr.expiryDate, cr.docHash, cr.signature, cr.authorisedSignerList, cr.whoSigned);
  }

  function signTheDoc(address creator, bytes32 signerDocHash, bytes32 r, bytes32 s, uint8 v, bytes memory signature) public {
    require(multipleValidations(creator, signerDocHash));
    require(publishSign(signerDocHash, r, s, v, signature));
  }

  function publishSign(bytes32 signerDocHash, bytes32 r, bytes32 s, uint8 v, bytes memory signature)
  public
  verifySignature(signerDocHash, r, s, v)
  returns(bool) {
    Signer memory signer = Signer(msg.sender, block.timestamp, signerDocHash, signature);
    docData[signerDocHash].signerInfo[msg.sender] = signer;
    docData[signerDocHash].whoSigned.push(msg.sender);
    return true;
  }

  function getSignerInfo(bytes32 signerDocHash, address signer)
   public
   view
   returns(
     address signerAddress,
     uint256 signedDate,
     bytes32 docHash,
     bytes memory signature) {
    Signer memory si = docData[signerDocHash].signerInfo[signer];
    return (si.signerAddress, si.signedDate, si.docHash, si.signature);
  }
}
