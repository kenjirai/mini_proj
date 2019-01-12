pragma solidity ^0.5.0;

contract SignTheDoc {

    struct Creator {
        address creatorAddress;
        uint256 creationDate;
        uint256 expiryDate;
        bytes32 docHash; bytes signature; address[] authorisedSignerList;
        address[] whoSigned; mapping(address => bool) authorisedToSign;
        mapping(address => Signer) signerInfo;
    }

    struct Signer {
        address signerAddress;
        uint256 signedDate;
        bytes32 hash;
        bytes signture;
    }

    //Record of the creator hash creation for easy access
    mapping(address => bytes32[]) creatorDocHashes;

    //Hash of the data is linked to Creator Struct
    mapping(bytes32 => Creator) docData;

    Signer[] signers;


  modifier isAuthorised(bytes32 docHash) {
    if(docData[docHash].authorisedSignerList.length == 0) {
      require(true);
    } else {
      require(docData[docHash].authorisedToSign[msg.sender]);
    }
      _;
  }

  modifier isDocHashSame(bytes32 signerDocHash) {
    require(signerDocHash == docData[signerDocHash].docHash);
    _;
  }


  function createDocToSign(
    address creatorAddress,
    uint256 expiryDate,
    bytes memory signature,
    address[] memory authorisedSignerList,
    bytes32 docHash,
    bytes32 r,
    bytes32 s,
    uint8 v
  )
  public
  {
    require(verifySignature(docHash, r, s, v));
    recordInitialDoc(
      creatorAddress,
      expiryDate,
      signature,
      authorisedSignerList,
      docHash
    );
  }

  function recordInitialDoc(
    address creatorAddress,
    uint256 expiryDate,
    bytes memory signature,
    address[] memory authorisedSignerList,
    bytes32 docHash
  )
  public
  {
    Creator storage creator = docData[docHash];

    creator.creatorAddress = creatorAddress;
    creator.creationDate = block.timestamp;
    creator.expiryDate = expiryDate;
    creator.docHash = docHash;
    creator.signature = signature;
    creator.authorisedSignerList = authorisedSignerList;

    if(authorisedSignerList.length != 0) {
      creator.authorisedSignerList = authorisedSignerList;
    }

    if(authorisedSignerList.length == 1) {
        creator.authorisedToSign[authorisedSignerList[0]] = true;
    } else if (authorisedSignerList.length > 1) {
        for (uint i = 0; i < authorisedSignerList.length; i++) {
        creator.authorisedToSign[authorisedSignerList[i]] = true;
      }
  }
}

  function verifySignature(bytes32 hash, bytes32 r, bytes32 s, uint8 v) public view returns(bool) {
    bytes memory prefix = "\x19Ethereum Signed Message:\n32";
    bytes32 prefixedHash = keccak256(abi.encodePacked(prefix, hash));
    return ecrecover(prefixedHash, v, r, s) == msg.sender;
  }
    //Retrun the content of the struct
  function getDocData(bytes32 docHash)
    public
    view
    returns(
      address creatorAddress,
      uint256 creationDate,
      uint256 expiryDate,
      bytes32 dochash,
      bytes memory signature,
      address[] memory authorisedSigners,
      address[] memory whoSigned
    )
    {
      Creator memory cr = docData[docHash];
      return(
        cr.creatorAddress,
        cr.creationDate,
        cr.expiryDate,
        cr.docHash,
        cr.signature,
        cr.authorisedSignerList,
        cr.whoSigned
      );
    }

    function signTheDoc(bytes32 signerDocHash, bytes memory signature)
      public
      isAuthorised(signerDocHash)
      isDocHashSame(signerDocHash)
    {
        Signer memory signer = Signer(msg.sender, block.timestamp, signerDocHash, signature);
        docData[signerDocHash].signerInfo[msg.sender] = signer;
    }

    function isAuthorisedToSign(bytes32 docHash, address signer) public view returns(bool) {
      return docData[docHash].authorisedToSign[signer];
    }

    function getAutorisedSingingList(bytes32 docHash) public view returns(address[] memory) {
      return docData[docHash].authorisedSignerList;
    }

    function getWhoSigned(bytes32 docHash) public view returns(address[] memory) {
      return docData[docHash].whoSigned;
    }

}
