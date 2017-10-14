// Global variablees
var gameStart = false;
var chooseDefender = false;
var userDeath = false;
var computerDeath =false;
var assailant;
var victim;
var winner;
var deadGuys = [];

// Combantant objects
var Jawas = {
	hp: 100,
	attackPower: 6
}
var Jabba = {
	hp: 120,
	attackPower: 6
}
var jar_jar = {
	hp: 180,
	attackPower: 6
}
var Evazan = {
	hp: 150,
	attackPower: 6
}




// on click event for character selection
$(".character").on("click", function() {
	if (!(gameStart) && !(chooseDefender)) {
			chooseDefender = true; // flags that user needs to choose opponent next
			$(this).css("border-color", "#320B68");
			$("#choose").html("Enemy"); //changes choose Jedi prompt
			assailant = $(this).detach(); // removes user from available
			assailant.appendTo("#active"); // adds user to battle
			console.log(assailant);
			$("#battle").fadeIn("slow");
		} else if (chooseDefender) { //user is alive and needs a new opponent
			chooseDefender = false;
			gameStart = true; //flags functionality of fight and reset buttons, disables characters
			$("#alerts").html(""); // clears any alerts, if any
			$(this).css("border-color", "#B9161A"); //puts a red border around assilant
			victim = $(this).detach(); // removes opponent from available
			victim.appendTo("#under-attack"); // adds opponent to battle
			console.log(victim);
			$("#available").fadeOut("slow"); //hide available
			$("#fight").fadeIn("slow"); //show fight button
		} 
	})

function reset() {
	// gets opponent to reinsert into available if the user lost
	if (userDeath) {
		winner = victim.detach();
	}
	gameStart = false;
	chooseDefender = false;
	userDeath = false;
	computerDeath = false;
	// reattaches all deadJedi (if any), including a dead user, back to available
	for (let x = 0; x < deadGuys.length; x++) {
		deadGuys[x].appendTo("#available");
	}
	//emptys deadJedi array (perhaps there is function I could chain to above to do the same?)
	deadGuys = [];
	winner.appendTo("#available"); //winner will either be user or opponent, attaches to available
	//reset display to start screen
	$("#alerts").html("");
	$("#choose").html("Character");
	$(".character").css("border-color", "#7D9403");
	$("#reset").fadeOut("slow");
	$("#battle").fadeOut("slow");
	//resets data on all Jedi to start conditions
	$("#Jawas").data("hp", Jawas.hp).find(".data-hp").html(Jawas.hp);
	$("#Jawas").data("attack-power", Jawas.attackPower);
	$("#Jabba").data("hp", Jabba.hp).find(".data-hp").html(Jabba.hp);;
	$("#Jabba").data("attack-power", Jabba.attackPower);
	$("#jar_jar").data("hp", jar_jar.hp).find(".data-hp").html(jar_jar.hp);;
	$("#jar_jar").data("attack-power", jar_jar.attackPower);
	$("#Evazan").data("hp", Evazan.hp).find(".data-hp").html(Evazan.hp);;
	$("#Evazan").data("attack-power", Evazan.attackPower);
	//only shows Jedi once they have been reset to original conditions
	$("#available").fadeIn("slow");
}

var transition;
function checkForWin () {
	//see if all three jedi other than user have been killed (i.e. added to deadJedi array)
	if (deadGuys.length === 3) {
		function youWin() {
			$("#alerts").text(" YOU WIN!!!");
			$("#fight").fadeOut("fast"); //hide fight button
			$("#battle").fadeOut("fast"); //hide battle area
			$("#reset").fadeIn("slow"); //show start over button
			gameStart = false;
			//get winner out of attack position to be reinserted into available on reset
			winner = assailant.detach();
		}
		transition = setTimeout(youWin, 2000);
	} else { 
		$("#fight").fadeOut("slow"); // hide fight button
		$("#available").fadeIn("slow"); //show remaining available Jedi
		chooseDefender = true;
	}
}


// battle function
function battle () {
	var vhp = parseInt(victim.data("hp")); // get victim hit points
	var attack = parseInt(assailant.data("attack-power")); // get user attack power 
	vhp-= attack;  //update attack-power
	victim.data("hp",vhp); //change the victim's hit points
	$("under-attack").find(".data-hp").html(vhp); //display current hit points
	$("alerts").html("You inflected " + attack + " damage to " + victim.data("name") +". ");
	attack += attack; //update attack-power
	assailant.data("attack-power", attack);  //change user's attack power

	//check to see if victim has been killed
	if (vhp <= 0) {
		function Death() {
			deadGuys.push(victim.detach());
			console.log(deadGuys);
			$("#alerts").text(" And you killed him!");
			//checks to see if all jedi are dead
			checkForWin();
		}
		transition = setTimeout(Death, 2000);
	} else {
		//this only runs if victim still alive. This calculates counter-damage
		var uhp = parseInt(assailant.data("hp")); // get user hit points
		var counterAttack = parseInt(victim.data("counter-attack")); // get victim counter
		uhp -= counterAttack; //decrease user hit points
		assailant.data("hp", uhp); //change data on user hp
		$("#active").find(".data-HP").html(uhp); //display user hp
		$("#alerts").append(victim.data("name") + " did " + counterAttack + " damage to you.");
		//check to see if user has been killed
		if (uhp <= 0) {
			$("#alerts").text(" And he killed you!");
			function youDied() {
				userDeath = true;
				//store dead Jedi in an array
				deadGuys.push(assailant.detach());
				console.log(deadGuys);
				//go to end-game screen
				$("#fight").fadeOut("fast"); // hide fight button
				$("#battle").fadeOut("fast"); //hide battle area
				$("#reset").fadeIn("slow"); // show start over button
			}
			transition = setTimeout(youDied, 2000);
		}
	}
}




$("button").on("click", function() {
	if (userDeath || !(gameStart)) {
		reset();
	} else {
		battle();
	}
})


























