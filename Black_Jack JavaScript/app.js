'use strict';
// Allow the prompt function to operate as intended
const prompt = require("prompt-sync")({ sigint: true });

function create_deck(values, suits) {
	// Create a deck of each of the desired cards
	var deck = new Array();

	// Add each card value and suit combination to the deck
	for (var i = 0; i < values.length; i++) {
		for (var j = 0; j < suits.length; j++) {
			const new_card = { "value": values[i], "suit": suits[j] };
			deck.push(new_card);
		}
	}

	return deck;
};

function draw_cards(deck, hand, number) {
	for (var i = 0; i < number; i++) {
		// Generate a random card
		var rand_card = deck[Math.floor(Math.random() * 52)];

		// Add the card to the player's hand
		hand.push(rand_card);
	}
}

function get_card_value(name) {
	// Return the corresponding value given the name of the card
	switch (name) {
		case '2':
			return 2;
		case '3':
			return 3;
		case '4':
			return 4;
		case '5':
			return 5;
		case '6':
			return 6;
		case '7':
			return 7;
		case '8':
			return 8;
		case '9':
			return 9;
		case '10':
			return 10;
		case 'J':
			return 10;
		case 'Q':
			return 10;
		case 'K':
			return 10;
	}
	return 0;
}

function get_ace_value(subtotal) {
	// Count the ace as 11 unless that would put your total above 21.
	if (subtotal + 11 <= 21) {
		return 11;
	}
	else {
		return 1;
	}
}


function get_hand_value(hand) {
	var total = 0;
	// Track the aces because they will be added at the end
	var aces = 0;

	// Traverse the list of cards and display each one and add the value to the total
	for (var i = 0; i < hand.length; i++) {
		// Add the value of the card to the total
		if (hand[i]["value"] == 'A') {
			aces++;
		}
		else {
			total += get_card_value(hand[i]["value"]);
		}
	}
	// Now add the value of the aces
	for (var i = 0; i < aces; i++) {
		total += get_ace_value(total);
	}
	// Return the total
	return total;
}

function display_hand(hand) {
	// Traverse the list of cards and display each one and add the value to the total
	var hand_string = "";
	for (var i = 0; i < hand.length; i++) {
		// Display each card
		hand_string += ` [${hand[i]["value"]}] `;
	}
	console.log(hand_string);

	// Display the total
	console.log(`Current total: ${get_hand_value(hand)}`);
}

function display_menu() {
	console.log("\nWelcome to Black Jack. Please select an option:");
	console.log("\t1. Play a game");
	console.log("\t2. Show me the rules");
	console.log("\t0. Quit");
}

function display_rules() {
	console.log("\nThe point of the game is to get your hand to a total as close to 21 as possible without going over 21.\n");
	console.log("All face cards are worth 10. Aces are worth either 11 or 1, your choice. All other cards are worth their respective values.\n");
	console.log("You play against the dealer. You win if you get closer to 21 than the dealer without going over 21 or if the dealer goes over 21 and you do not.\n");
	console.log("You start the game by getting dealt 2 cards face up in your hand. The dealer also receives 2 cards, one face up and one face down. You can see the dealer's face up card.\n");
	console.log("After the cards are dealt, it is now your turn. On your turn you can either 'hit' (be dealt another card) to attempt to bring your total closer to 21, or you can 'stand' (do not take another card and end your turn).\n");
	console.log("If you hit and the new card brings your total above 21, you 'bust' (lose immediately).\n");
	console.log("When you stand on a total less than 21, the dealer then takes his turn.\n");
	console.log("The dealer's face down card is turned up and the dealer then plays.\n");
	console.log("If the dealer's total is 16 or less, he must hit. If the total is 17 or greater, he must stand.\n");
	console.log("The dealer's turn continues until he either busts or stands according to these rules.\n");
	console.log("When the dealer's turn ends and neither player has busted, the player with the total closest to 21 wins the game.\n");
}

function display_options() {
	console.log("1. Hit me");
	console.log("0. Stand");
}

function main() {
	// Initialize the selection variable
	var menu_selection = -1;

	// Keep showing the menu until the user quits
	while (menu_selection != 0) {
		display_menu();
		// Get the user's choice
		menu_selection = prompt("Your choice: ");
		console.log();

		// Perform the chosen action
		if (menu_selection == 2) {
			display_rules();
		}
		else if (menu_selection == 1) {
			// Start the game
			// Create the deck of cards
			const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
			const suits = ["Spades", "Clubs", "Hearts", "Diamonds"];
			const deck = create_deck(values, suits);

			// Create lists to track each hand
			var player_hand = new Array();
			var dealer_hand = new Array();

			// Deal the initial 2 cards to each player
			// Add 2 cards to the player's hand
			draw_cards(deck, player_hand, 2);
			
			// Add 2 cards to the dealer's hand
			draw_cards(deck, dealer_hand, 2);

			// Start the player's turn
			var stand = 1;
			var player_bust = 0;
			while (stand == 1) {
				// Show the dealer's face up card
				console.log("Dealer's hand:");
				console.log(` [${dealer_hand[0]["value"]}] []`);
				// Show the player's hand
				console.log("Your hand:");
				display_hand(player_hand);
				console.log();

				// Show the player's options
				display_options();
				// Get the user's choice
				stand = prompt("Your choice: ");

				// Give the user another card if they hit
				if (stand == 1) {
					draw_cards(deck, player_hand, 1);
				}

				// See if the player busts
				if (get_hand_value(player_hand) > 21) {
					display_hand(player_hand);
					// End the player's turn
					stand = 0;
					console.log("Busted! You lose.");
					player_bust = 1;
				}
			}

			// Take the dealer's turn if the player didn't bust
			var dealer_bust = 0;
			if (player_bust == 0) {
				// Show the dealer's hand
				console.log("\nDealer's hand:");
				display_hand(dealer_hand);

				// Keep hitting the dealer until at least 17
				while (get_hand_value(dealer_hand) < 17) {
					// Hit the dealer
					console.log("The dealer hits (Press 'Enter' to continue): ");
					prompt();
					draw_cards(deck, dealer_hand, 1);

					// Show the dealer's hand
					console.log("Dealer's hand:");
					display_hand(dealer_hand);
				}

				// Check if the dealer busts
				if (get_hand_value(dealer_hand) > 21) {
					dealer_bust = 1;
					console.log("The dealer busts! You win!!\n");
				}
				else {
					// The dealer stands when he reaches 17 or higher
					console.log("The dealer stands (Press 'Enter' to continue): ");
					prompt();
				}
			}

			// See who wins
			if (player_bust == 0) {
				if (dealer_bust == 0) {
					// Calculate both scores
					var player_hand_value = get_hand_value(player_hand);
					var dealer_hand_value = get_hand_value(dealer_hand);

					console.log(`\nYour score: ${player_hand_value}`);
					console.log(`Dealer's score: ${dealer_hand_value} `);
					if (player_hand_value > dealer_hand_value) {
						console.log("You win! Congratulations!!\n");
					}
					else if (player_hand_value < dealer_hand_value) {
						console.log("You lose! Better luck next time.\n");
					}
					else {
						console.log("It's a draw!\n");
					}
				}
			}

			// Ask the user if they would like to play again
			console.log("Would you like to play again?");
			console.log("1. Yes");
			console.log("0. No");
			menu_selection = prompt("Your choice: ");
		}
	}
}

main();
