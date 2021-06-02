<script>
	import { LinkedList } from '$lib/utils/LinkedList';

	// prettier-ignore
	let deckOfCards = ['AS', '2S', '3S', '4S', '5S', '6S', '7S',
  '8S', '9S', '10S', 'JS', 'QS', 'KS', 'AH',
  '2H', '3H', '4H', '5H', '6H', '7H', '8H',
  '9H', '10H', 'JH', 'QH', 'KH', 'AD', '2D',
  '3D', '4D', '5D', '6D', '7D', '8D', '9D',
  '10D', 'JD', 'QD', 'KD', 'AC', '2C', '3C',
  '4C', '5C', '6C', '7C', '8C', '9C', '10C',
  'JC', 'QC', 'KC']

	export let deckAmount = 1;
	const initDeck = new Function('deckOfCards', `return [${'...deckOfCards,'.repeat(deckAmount)}]`)(
		deckOfCards
	);

	export const deck = new LinkedList(...initDeck);

	deck.shuffle(6);

	function getFromPile() {
		if (deck.length == 1) return alert('deck is empty');
		let firstCard = document.querySelector('.card-pile .card:first-child');
		let pile = document.querySelector('.card-pile');
		let newCard = firstCard.cloneNode(true);

		let cardRetrieved = deck.popAt(0);
		console.log('card grabbed: ' + cardRetrieved, deck.length);
		firstCard.src = `assets/minicards/${cardRetrieved}.svg`;

		firstCard.classList.add('slideOff');
		pile.style.pointerEvents = 'none';

		setTimeout(() => {
			pile.removeChild(firstCard);
			if (deck.length > 3) pile.appendChild(newCard);
			pile.style.pointerEvents = 'initial';
		}, 300);
	}
</script>

<div class="card-pile-container">
	<ul class="card-pile" on:click={getFromPile}>
		<img src="assets/minicards/back.svg" alt="backs" class="card" />
		<img src="assets/minicards/back.svg" alt="back" class="card" />
		<img src="assets/minicards/back.svg" alt="back" class="card" />
	</ul>
</div>

<style>
	/* .card-pile-container {
        border: 4px solid black;
        border-radius: 15px;
        padding: 5px;
        padding-right: 15px;
    } */

	.card-pile {
		position: relative;
		width: 80px;
		height: 131px;
	}

	.card-pile img {
		display: block;
		position: absolute;
		opacity: 1;
		top: 0;
		left: 0;
		width: 80px;
		margin: 10px;
		cursor: pointer;
		transition: 0.3s filter ease-in-out;
	}

	img:hover {
		filter: brightness(80%);
		transition: 0.3s filter ease-in-out;
	}

	:global(.card-pile .slideOff) {
		opacity: 0 !important;
		transform: translate(-15px, -10px);
		transition: all 0.3s ease-in-out !important;
	}

	.card-pile .card {
		margin: 0px;
	}

	.card-pile .card:first-child {
		z-index: 3;
		transition: all 0.3s ease-in-out !important;
	}

	.card-pile .card:nth-child(2) {
		z-index: 2;
		transform: translate(4px, 4px);
		transition: all 0.3s ease-in-out !important;
	}

	.card-pile .card:nth-child(3) {
		z-index: 1;
		transform: translate(8px, 8px);
		transition: all 0.3s ease-in-out !important;
	}
</style>
