var fs = require("fs");
var inquirer = require("inquirer");
var JsonDB = require("node-json-db");

var db = new JsonDB("clozecards", true, true);
var nextCard = 1;

function ClozeCard(text, cloze) {
    this.text = text;
    this.cloze = cloze;
    this.partial = partial;
    this.fullText = fullText;
}

ClozeCard.prototype.makeCloze = function() {
    console.log("Full text: " + this.fullText + "\nPartial text: " + this.partial + "\nCloze deletion: " + this.cloze);
}

module.exports = ClozeCard;