// This function detects most providers injected at window.ethereum


//import subjective_json from '../artifacs/contracts/Subjective.json' assert {type: 'json'};


async function init(){
  console.log("App initialized...");

  const provider = await detectEthereumProvider()

  var loader = $('#loader');
  var content = $('#content');

  loader.show();
  content.hide();

  if (provider) {
    // From now on, this should always be true:
    // provider === window.ethereum
    loader.hide();
    content.show();
  } else {
    console.log('Please install MetaMask!');
  }
  
}

async function createContract() {


  // A Human-Readable ABI; for interacting with the contract, we
  // must include any fragment we wish to use
  
  
  const abi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_second_party",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_third_party",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_index",
          "type": "uint256"
        }
      ],
      "name": "Deal",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "_second_party",
          "type": "address"
        },
        {
          "internalType": "address payable",
          "name": "_third_party",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "_is_seller",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "_max_price",
          "type": "uint256"
        },
        {
          "internalType": "int256",
          "name": "_min_price",
          "type": "int256"
        },
        {
          "internalType": "uint256",
          "name": "_quotient",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_max_evaluation",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_upfront_time",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_evaluation_time",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_pay_upfront",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "_evaluation",
          "type": "uint256"
        }
      ],
      "name": "createContract",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "evaluation",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "pay_upfront",
          "type": "bool"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "evaluate",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "getContract",
      "outputs": [
        {
          "internalType": "bool",
          "name": "is_seller",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "max_price",
          "type": "uint256"
        },
        {
          "internalType": "int256",
          "name": "min_price",
          "type": "int256"
        },
        {
          "internalType": "uint256",
          "name": "max_evaluation",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "quotient",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "upfront",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    }
  ]


  // This can be an address or an ENS name
  const address = "0x8763400Ae6683995da388E5c84B65ed0063D2f48";
  console.log(window.ethereum)
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  console.log(provider)
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner()
  console.log(signer)
  const subjective = new ethers.Contract(address, abi, signer);
  console.log(subjective)

  $('#content').hide();
  $('#loader').show();

  const web3 = new Web3(provider)
  
  var max_price = parseFloat($('#max_price').val());
  var min_price = parseFloat($('#min_price').val());
  var quotient = parseInt($('#quotient').val());
  var is_seller = $('.isSeller').val();
  var upfront_value;
  if(is_seller == 'true')
      upfront_value = max_price/quotient-min_price;
  else
      upfront_value = max_price+max_price/quotient;
  
  return subjective.createContract(
      $('#secondParty').val(),
      $('.thirdParty').val(),
      is_seller,
      web3.utils.toWei(String(max_price),"finney"),
      web3.utils.toWei(String(min_price),"finney"),
      quotient,
      $('#max_evaluation').val(),
      $('#upfront_time').val()*86400,//days to seconds
      $('#evaluation_time').val()*86400,//days to seconds
      $('.payUpfront').val(),
      $('#evaluation-input').val(),
      {
        value: web3.utils.toWei(String(upfront_value),"finney")
      }    
  );
      
}

$(function(){
  $(window).load(function(){
      init();
  })
});