//Flashcard Generator
//require modules
var inquirer = require("inquirer");
var JsonDB = require("node-json-db");
var BasicFlashCard = require("./basicflashcard.js");
var ClozeCard = require("./clozecard.js");
var dbFC = new JsonDB("basicflashcards", true, true);
var dbCC = new JsonDB("clozecards", true, true);
var nextCard = 1;

//capture user input
function getTheInput() {
    inquirer.prompt([{
        name: "userInput",
        message: "What would you like to do?",
        type: "list",
        choices: [{
            name: "Create Flash Card",
        }, {
            name: "Create Cloze Card"
        }]
    }]).then(function(answer) {
        if (answer.userInput === "Create Flash Card") {
            //get the questions and answers for the cards from the user
            function getUserInputFC() {
                inquirer.prompt([{
                    name: "front",
                    message: "Enter question"
                }, {
                    name: "back",
                    message: "Enter answer"
                }]).then(function(answers) {
                    var newFC = new BasicFlashCard(answers.front, answers.back);
                    newFC.makecard();
                    dbFC.push("/FC0" + nextCard, newFC, false);
                    whatNow();
                });
            };
            getUserInputFC();

            //ask the user what to do after the flash card has been created
            function whatNow() {
                inquirer.prompt([{
                    name: "choices",
                    type: "list",
                    choices: ["Read cards", "Create another card", "Exit the program"],
                    message: "What would you like to do now? "

                }]).then(function(answers) {
                    var userChoices = answers.choices;
                    switch (userChoices) {
                        //get the data from the json file that has the saved flashcards
                        case "Read cards":
                            makeCardsPretty();
                            whatNow();
                            break;
                            //ask user if he wants to create a new card
                        case "Create another card":
                            // console.log("You chose to create another card");
                            // console.log(nextCard);
                            nextCard++;
                            getUserInputFC();
                            break;
                            //done with program
                        case "Exit the program":
                            console.log("Good Bye");
                            process.exit(-1);
                    }
                })
            }

            //output Q & A for user
            function makeCardsPretty() {
                var data = dbFC.getData("/");
                var houseOfCards = "";
                for (key in data) {
                    if (data.hasOwnProperty(key)) {
                        console.log("Q: " + data[key].front + "\nA: " + data[key].back + "\n---------");
                    }
                }
            }
            //if the user decides for klutz cards
        } else if (answer.userInput === "Create Cloze Card") {

            var getUserInputCC = function() {
                inquirer.prompt([{
                    name: "fullText",
                    message: "Enter full text: "
                }, {
                    name: "clozeDeletion",
                    message: "Enter text to be removed: "

                }]).then(function(answers) {
                    if (answers.fullText.indexOf(answers.clozeDeletion) === -1) {
                        console.log("Oops! Your text is not part of the sentence, try again");
                        getUserInputCC();

                    } else {

                        partial = answers.fullText.replace(answers.clozeDeletion, "_____");
                        fullText = answers.fullText;
                        var newCC = new ClozeCard(answers.fullText, answers.clozeDeletion);
                        newCC.makeCloze();
                        dbCC.push("/CC0" + nextCard, newCC, false);
                        whatNow();
                    }
                })
            }

            getUserInputCC();

            //ask the user what to do after the flash card has been created
            function whatNow() {
                inquirer.prompt([{
                    name: "choices",
                    type: "list",
                    choices: ["Read cards", "Create another card", "Exit the program"],
                    message: "What would you like to do now? "

                }]).then(function(answers) {
                    var userChoices = answers.choices;
                    switch (userChoices) {
                        //get the data from the json file that has the saved flashcards
                        case "Read cards":
                            makeCardsPretty();
                            whatNow();
                            break;
                            //ask user if he wants to create a new card
                        case "Create another card":
                            // console.log("You chose to create another card");
                            // console.log(nextCard);
                            nextCard++;
                            getUserInputCC();
                            break;
                            //done with program
                        case "Exit the program":
                            console.log("Good Bye");
                            process.exit(-1);
                    }
                })
            }

            //output Q & A for user
            function makeCardsPretty() {
                var data = dbCC.getData("/");
                var houseOfCards = "";
                for (key in data) {
                    if (data.hasOwnProperty(key)) {
                        console.log("Full text: " + data[key].fullText + "\nCloze deletion: " + data[key].cloze + "\nPartial text: " + data[key].partial + "\n---------");
                    }
                }
            }
        }
    });

}
getTheInput();