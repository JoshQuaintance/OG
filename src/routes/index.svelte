<script>
	import Card from '$lib/Card.svelte';
	import CardPile from '$lib/CardPile.svelte';
	import { LinkedList } from '$lib/utils/LinkedList';

	let deck = new LinkedList();

	$: cards = deck.toArray();

	function shuffleCards() {
		deck.shuffle(3);
		deck = deck;
	}
</script>

<main>
	<!-- <div class="cards-container">
        {#each cards as card}
            <Card cardType="minicards" {card} />
        {/each}
    </div>

    <button on:click={shuffleCards}> Shuffle Card </button> -->

	<CardPile bind:deck deckAmount="1" />
</main>

<style>
	/* .cards-container {
		/* @apply flex flex-row flex-wrap justify-around; 
		display: flex;
		justify-content: space-around;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.cards-container img {
		flex: 1 0 21%;
	}

	button {
		padding: 10px;
		border: 1px solid black;
		background-color: #333;
		color: white;
		border-radius: 15px;
	} */

	main {
		/* @apply flex justify-center items-center; */
		display: flex;
		justify-content: center;
		align-items: center;
		min-width: 100vw;
		min-height: 100vh;
	}
</style>
