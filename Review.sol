// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.14; 
 
contract ReviewSystem { 
    struct Candidate { 
        uint id; 
        string name; 
        uint totalRating; 
        uint ratingCount; 
    } 
 
    address public admin; 
    uint public candidatesCount; 
    mapping(uint => Candidate) public candidates; 
    mapping(address => bool) public hasRated; 
    uint public totalRatings; 
 
    modifier onlyAdmin() { 
        require(msg.sender == admin, "Only admin can perform this action"); 
        _; 
    } 
 
    event CandidateAdded(uint id, string name); 
    event Rated(address indexed rater, uint candidateId, uint rating); 
 
    constructor(address _admin) { 
        require(_admin != address(0), "Admin address cannot be zero"); 
        admin = _admin; // Set the initial admin to the specified address 
    } 
 
    function addCandidate(string memory _name) public onlyAdmin { 
        require(bytes(_name).length > 0, "Candidate name cannot be empty"); 
        candidatesCount++; 
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0, 0); 
        emit CandidateAdded(candidatesCount, _name); 
    } 
 
    function rate(uint _candidateId, uint _rating) public { 
        require(!hasRated[msg.sender], "You have already rated"); 
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID"); 
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5"); 
 
        hasRated[msg.sender] = true; 
        candidates[_candidateId].totalRating += _rating; 
        candidates[_candidateId].ratingCount++; 
        totalRatings++; 
 
        emit Rated(msg.sender, _candidateId, _rating); 
    } 
 
    function getAverageRating(uint _candidateId) public view returns (uint) { 
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID"); 
        Candidate memory candidate = candidates[_candidateId]; 
        if (candidate.ratingCount == 0) { 
            return 0; 
        } 
        return candidate.totalRating / candidate.ratingCount; 
    } 
 
    function getTotalRatings() public view returns (uint) { 
        return totalRatings; 
    } 
 
    function changeAdmin(address _newAdmin) public onlyAdmin { 
        require(_newAdmin != address(0), "Invalid admin address"); 
        admin = _newAdmin; 
    } 
}