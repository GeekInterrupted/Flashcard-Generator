// require 
var inquirer = require("inquirer");
var JsonDB = require("node-json-db");

var db = new JsonDB("basicflashcards", true, true);
var nextCard = 1;

function BasicFlashCard(front, back) {
    this.front = front;
    this.back = back;
}

BasicFlashCard.prototype.makecard = function() {
    console.log("<---- New card created ----> \n Q: " + this.front + "\n A: " + this.back);
};

module.exports = BasicFlashCard;