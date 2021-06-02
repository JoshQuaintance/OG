<script>
	export let card;
	export let cardType = 'cards';

	function cardClicked() {
		alert(`${card} clicked`);
	}
</script>

<div class="card">
	<img
		on:click={cardClicked}
		src="static/assets/{cardType}/{card}.svg"
		class="{cardType}-{card}"
		alt={card}
	/>
</div>

<style>
	.card {
		z-index: 1;
	}
	img {
		width: 80px;
		height: auto;
		margin: 10px;
		cursor: pointer;
		transition: 0.3s filter ease-in-out;
	}

	img:hover {
		filter: brightness(80%);
		transition: 0.3s filter ease-in-out;
	}
</style>
