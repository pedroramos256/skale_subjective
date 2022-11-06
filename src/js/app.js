// This function detects most providers injected at window.ethereum


//import subjective_json from '../artifacs/contracts/Subjective.json' assert {type: 'json'};



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

var contracts = {}

App = {
    subjective: null,
    subjective_rw: null,
    provider: null,
    signer: null,
    address: "0x8763400Ae6683995da388E5c84B65ed0063D2f48",
    initiated: false,
    init: async function(){
        if (!App.initiated){
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
        App.initiated = true
    
    },
    createContract: function(){
        // A Human-Readable ABI; for interacting with the contract, we
        // must include any fragment we wish to use

        // This can be an address or an ENS name
        console.log(window.ethereum)
        App.provider = new ethers.providers.Web3Provider(window.ethereum)
        console.log(App.provider)

        App.provider.send("eth_requestAccounts", []).then(function(result){
        const provider_address = result[0]
        App.signer = App.provider.getSigner()
        console.log(App.signer)
        if (App.subjective_rw == null){
            App.subjective_rw = new ethers.Contract(App.address, abi, App.signer);
        }
        $('#content').hide();
        $('#loader').show();

        const web3 = new Web3(App.provider)

        var max_price = parseFloat($('#max_price').val());
        var min_price = parseFloat($('#min_price').val());
        var quotient = parseInt($('#quotient').val());
        var is_seller = $('.isSeller').val();
        if (is_seller == '') is_seller = 'true'
        var upfront_value;
        if(is_seller == 'true')
            upfront_value = max_price/quotient-min_price;
        else
            upfront_value = max_price+max_price/quotient;
        console.log(max_price,min_price,quotient,is_seller,upfront_value)
        console.log($('#upfront_time').val(),$('.payUpfront').val(),$('#evaluation-input').val())
        var elem = document.getElementById('owner_address');
        elem.innerHTML += "<p>"+provider_address+"</p>"
        //$('#owner_address').append("<p>"+provider_address+"</p>")
        var elem = document.getElementById('current_id');
        if (provider_address in contracts){
            elem.innerHTML += "<p>"+String(contracts[provider_address].length)+"</p>";
        }else{
            elem.innerHTML += "<p>0</p>";
        }

        return App.subjective_rw.createContract(
            $('#secondParty').val(),
            $('.thirdParty').val(),
            is_seller,
            web3.utils.toWei(String(max_price),"finney"),
            web3.utils.toWei(String(min_price),"finney"),
            quotient,
            max_price,
            $('#upfront_time').val()*86400,//days to seconds
            $('#evaluation_time').val()*86400,//days to seconds
            $('.payUpfront').val(),
            $('#evaluation-input').val(),
            {
                value: web3.utils.toWei(String(25),"finney")
            }    
        ).then(function(){
            $('#content').show();
            $('#loader').hide();
            if (provider_address in contracts){
                contracts[provider_address].append([
                    $('#secondParty').val(),
                    max_price,
                    $('.thirdParty').val(),
                    max_price,
                    min_price,
                    quotient,
                    $('#upfront_time').val()*86400,//days to seconds
                    $('#evaluation_time').val()*86400,//days to seconds 
                    $('#description').val()   
                ])
            }else{
                contracts[provider_address] = [[
                    $('#secondParty').val(),
                    max_price,
                    $('.thirdParty').val(),
                    max_price,
                    min_price,
                    quotient,
                    $('#upfront_time').val()*86400,//days to seconds
                    $('#evaluation_time').val()*86400,//days to seconds    
                    $('#description').val()   
                ]]
            }
        });});
    },
    evaluate: function(){
        const web3 = new Web3(App.provider)

        return App.subjective_rw.evaluate(
            200,
            true,
            $('#owner').val().toLowerCase(),
            {
                value: web3.utils.toWei(String(200),"finney")
            }            
        );
    }

}



$(function(){
    $(window).load(function(e){
        App.init();
        e.preventDefault();

    })
});


$('#myForm').on('submit', function(e){
    $('#myModal').modal('show');
    e.preventDefault();
});

$('#search_form').on('submit', function(e){
    const owner = $('#owner').val().toLowerCase();
    const index = $('#index').val();
    var elem = document.getElementById('value_searched');
    elem.innerHTML += "<p>"+contracts[owner][index][1]+"</p>"
    var elem = document.getElementById('description_searched');
    elem.innerHTML += "<p>"+contracts[owner][index][8]+"</p>"

});

$('#search_form').on('submit', function(e){
    const owner = $('#owner').val().toLowerCase();
    const index = $('#index').val();
    var elem = document.getElementById('value_searched');
    elem.innerHTML += "<p>"+contracts[owner][index][1]+"</p>"
    var elem = document.getElementById('description_searched');
    elem.innerHTML += "<p>"+contracts[owner][index][8]+"</p>"

});

$('#evaluation_button').on('click', function(e){

    var elem = document.getElementById('value_searched');
    elem.innerHTML = "<b>Value:</b> 200 "

});

$(".thirdParty").change(function () {
    //check if its checked. If checked move inside and check for others value
    if (this.checked && this.value === "other") {
        //add a text box next to it
        $(this).next("label").after("<input class='form-control thirdParty' name='thirdParty' id='other-text' placeholder='Address' type='text'/>")
    } else {
        //remove if unchecked
        $("#other-text").remove();
    }
});

$("#evaluation-input").hide();

$(".evaluation").change(function () {
    //check if its checked. If checked move inside and check for others value
    if (this.checked && this.value === "true") {
        //add a text box next to it
        $("#evaluation-input").show();
    } else {
        //remove if unchecked
        $("#evaluation-input").hide();
    }
});
