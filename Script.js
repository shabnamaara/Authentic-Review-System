const contractAddress = " "; // contract address 
const contractABI =[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_admin",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "CandidateAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "rater",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "candidateId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "rating",
				"type": "uint256"
			}
		],
		"name": "Rated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			}
		],
		"name": "addCandidate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "candidates",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "totalRating",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "ratingCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "candidatesCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
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
				"name": "_newAdmin",
				"type": "address"
			}
		],
		"name": "changeAdmin",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_candidateId",
				"type": "uint256"
			}
		],
		"name": "getAverageRating",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTotalRatings",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
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
				"name": "",
				"type": "address"
			}
		],
		"name": "hasRated",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_candidateId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_rating",
				"type": "uint256"
			}
		],
		"name": "rate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalRatings",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];//paste your abi code; 
//end of abi code 
let web3; 
let contract; 
let account; 
 
// Initialize Web3 and contract 
async function initialize() { 
  if (window.ethereum) { 
    web3 = new Web3(window.ethereum); 
    await window.ethereum.request({ method: "eth_requestAccounts" }); 
    account = (await web3.eth.getAccounts())[0]; 
    document.getElementById("account").innerText = `Connected: ${account}`; 
 
    contract = new web3.eth.Contract(contractABI, contractAddress); 
 
    loadCandidates(); 
    listenForAccountChange(); 
  } else { 
    alert("Please install MetaMask to use this dApp!"); 
  } 
} 
 
// Listen for account change 
function listenForAccountChange() { 
  window.ethereum.on("accountsChanged", (accounts) => { 
    account = accounts[0]; 
    document.getElementById("account").innerText = `Connected: ${account}`; 
  }); 
} 
 
// Add candidate 
async function addCandidate() { 
  const candidateName = document.getElementById("candidateName").value.trim(); 
  if (!candidateName) { 
    alert("Candidate name cannot be empty!"); 
    return; 
  } 
 
  try { 
    await contract.methods 
      .addCandidate(candidateName) 
      .send({ from: account }); 
    alert(`Candidate "${candidateName}" added successfully!`); 
    document.getElementById("candidateName").value = ""; // Clear input field 
    loadCandidates(); // Refresh candidate list 
  } catch (error) { 
    console.error(error); 
    alert("You are not an admin!"); 
  } 
} 
 
// Load candidates 
async function loadCandidates() { 
  try { 
    const candidatesCount = await contract.methods.candidatesCount().call(); 
    const candidateList = document.getElementById("candidateList"); 
    candidateList.innerHTML = ""; 
 
    for (let i = 1; i <= candidatesCount; i++) { 
      const candidate = await contract.methods.candidates(i).call(); 
      const averageRating = await contract.methods.getAverageRating(i).call(); 
      const candidateItem = document.createElement("div"); 
      candidateItem.className = "result-item"; 
 
      candidateItem.innerHTML = ` 
        <p>${candidate.name} (Avg Rating: ${averageRating})</p> 
        <div> 
          <input type="number" id="rating-${candidate.id}" min="1" max="5" placeholder="Rate 1
5"> 
          <button class="btn" onclick="rateCandidate(${candidate.id})">Rate</button> 
        </div> 
      `; 
 
      candidateList.appendChild(candidateItem); 
    } 
  } catch (error) { 
    console.error(error); 
    alert("Error loading candidates!"); 
  } 
} 
 
// Rate candidate 
async function rateCandidate(candidateId) { 
  const ratingInput = document.getElementById(`rating-${candidateId}`); 
  const rating = parseInt(ratingInput.value); 
 
  if (isNaN(rating) || rating < 1 || rating > 5) { 
    alert("Please provide a valid rating between 1 and 5!"); 
    return; 
  } 
 
  try { 
    await contract.methods.rate(candidateId, rating).send({ from: account }); 
    alert(`Successfully rated candidate with ID ${candidateId}`); 
    loadCandidates(); // Refresh candidate list with updated ratings 
  } catch (error) { 
    console.error(error); 
    alert("User can rate a candidate only once"); 
  } 
} 
 
// Event listeners 
document.getElementById("connectButton").addEventListener("click", initialize); 
document.getElementById("addCandidateButton").addEventListener("click", addCandidate);