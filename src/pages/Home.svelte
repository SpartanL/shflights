<script>
	import { onMount } from 'svelte';
	import { ref, set } from "firebase/database";
	import { database } from '../firebase'
	import { navigate } from "svelte-navigator";
	import { uid } from 'uid';

	let token = ''
	let departure = ''
	let arrival = ''
	let dep_date = ''
	let arr_date = ''
	let submited = false
	let flights = []
	let airport = null

	onMount(async () => {
		await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: 'grant_type=client_credentials&client_id=X3CJGa6gBgsB95LGaANIq3gqwhfEzTNm&client_secret=2NYyVCXCGqrotKvn'
		})
		.then(res => res.json())
		.then(data => token = data.access_token)
	});

	const api = () => {
		if(departure != arrival) {
			fetch('https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=' + departure + '&destinationLocationCode=' + arrival +'&departureDate=' + dep_date + '&returnDate=' + arr_date + '&adults=1&max=10&nonStop=true', {
				headers: {
					'Authorization': 'Bearer ' + token
				}})
				.then(response => response.json())
				.then(data => display(data))
		}
	}

	const display = (data) => {
		submited = true
		flights = data.data
	}

	const addTrip = (trip) => {
		set(ref(database, 'trips/' + uid()), {
			dep: {
				departure: departure,
				dep_date: new Date(trip.itineraries[0].segments[0].departure.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
				dep_duration: trip.itineraries[0].segments[0].duration.replace('PT','').replace('M',''),
				arrival: arrival,
				arr_date: new Date(trip.itineraries[0].segments[0].arrival.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
			},
			arr: {
				departure: arrival,
				dep_date: new Date(trip.itineraries[1].segments[0].departure.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
				arrival: departure,
				arr_date: new Date(trip.itineraries[1].segments[0].arrival.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
				arr_duration: trip.itineraries[1].segments[0].duration.replace('PT','').replace('M',''),
			},
			price: trip.price.total + ' €'
		});

		navigate("/trips");
	}

	// Coord
	const getCoord = (position) => {
		const lat = position.coords.latitude
		const lon = position.coords.longitude

		fetch('https://test.api.amadeus.com/v1/reference-data/locations/airports?latitude=' + lat + '&longitude=' + lon, {
			headers: {
				'Authorization': 'Bearer ' + token
			}})
			.then(response => response.json())
			.then(data => nearest(data.data))
	}

	const nearest = (data) => {
		console.log(data)
		const code = ['CDG', 'LHR', 'JFK', 'HND']
		for (const element of data) {
			if (code.includes(element.iataCode)) {
				airport = element.name
				break;
			}
		}
	}

	const onError = console.error.bind(console, 'error')
	const options = {}
	navigator.geolocation.getCurrentPosition(getCoord, onError, options)
</script>

<div>
	<div class="md:h-96" style="background-image: url('images/plage.png'); background-position: center; background-repeat: no-repeat; background-size: cover;">
		<div class="flex flex-col justify-center">
			<h2 style="text-align: center; margin: 30px; font-size: 3.75rem; font-weight: bold; color: white; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">
				Votre voyage commence maintenant
			</h2>
			{#if airport !== null}
				<p class="text-center text-white font-bold text-lg">L'aéroport le plus proche : {airport}</p>
			{/if}
		</div>
		<div class="rounded-2xl mt-6 mx-2 md:mx-auto md:w-1/2" style="background-color: #02122c;">
			<form class="flex flex-col justify-center" on:submit|preventDefault={api}>
				<div class="md:flex justify-center m-6 gap-10">
					<div class="flex flex-col m-2">
						<label for="departure"> De </label>
						<select bind:value={departure} class="destination" id="departure" required>
							<option value="" selected disabled hidden> Ville </option>
							<option value="CDG"> Paris </option>
							<option value="LHR"> Londres </option>
							<option value="JFK"> New-York </option>
							<option value="HND"> Tokyo </option>
						</select>
					</div>
					<div class="flex flex-col m-2">
						<label for="destination"> À </label>
						<select bind:value={arrival} class="destination" id="arrival" required>
							<option value="" selected disabled hidden> Ville </option>
							<option value="CDG"> Paris </option>
							<option value="LHR"> Londres </option>
							<option value="JFK"> New-York </option>
							<option value="HND"> Tokyo </option>
						</select>
					</div>
					<div class="flex flex-col m-2">
						<label for="dep_date"> Départ</label>
						<input bind:value={dep_date} id="dep_date" type="date" min="{new Date().toISOString().split('T')[0]}" required>
					</div>
					<div class="flex flex-col m-2">
						<label for="arr_date"> Retour </label>
						<input bind:value={arr_date} id="arr_date" type="date" min="{new Date().toISOString().split('T')[0]}" required>
					</div>
				</div>
				<input type="submit" value="Trouvez votre vol ➔  " class="rounded-b-2xl text-white font-bold" style="background-color: #00a698;">
			</form>
		</div>
	</div>

	{#if submited}
		<div style="background-color: #042759;">
			<div class="container mx-auto py-6">
				<div class="md:flex justify-between items-center">
					<div class="flex my-4">
						<img src="images/loupe.png" class="h-1/2" alt="loupe">
						<p class="mx-4 text-white">{departure} - {arrival} <br> 1 adulte | Économique  </p>
					</div>
					<div class="flex text-white justify-between">
						<p class="mx-6">Départ : <span class="font-bold">{dep_date}</span></p>
						<p class="mx-6">Retour : <span class="font-bold">{arr_date}</span></p>
					</div>
				</div>
			</div>
		</div>

		<div class="container mx-auto">
			{#each flights as flight}
				<div class="flex justify-center items-center my-4">
					<div class="flex flex-col items-center justify-center shadow-md border border-gray-200 rounded-lg p-2 md:w-1/2">
						<div class="md:flex justify-between">
							<div class="mx-12">
								<div class="flex flex-row items-center my-2">
									<div class="flex flex-col items-center">
										<p>{new Date(flight.itineraries[0].segments[0].departure.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
										<p class="font-semibold text-2xl">{flight.itineraries[0].segments[0].departure.iataCode}</p>
									</div>
									<div class="flex flex-col items-center mx-6">
										<p class="font-normal text-gray-700">{flight.itineraries[0].segments[0].duration.replace('PT','').replace('M','')}</p>
										<img src="images/avion.png">
									</div>
									<div class="flex flex-col items-center">
										<p>{new Date(flight.itineraries[0].segments[0].arrival.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
										<p class="font-semibold text-2xl">{flight.itineraries[0].segments[0].arrival.iataCode}</p>
									</div>
								</div>
								<div class="flex flex-row items-center my-2">
									<div class="flex flex-col items-center">
										<p>{new Date(flight.itineraries[1].segments[0].departure.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
										<p class="font-semibold text-2xl">{flight.itineraries[1].segments[0].departure.iataCode}</p>
									</div>
									<div class="flex flex-col items-center mx-6">
										<p class="font-normal text-gray-700">{flight.itineraries[1].segments[0].duration.replace('PT','').replace('M','')}</p>
										<img src="images/avion.png">
									</div>
									<div class="flex flex-col items-center">
										<p>{new Date(flight.itineraries[1].segments[0].arrival.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
										<p class="font-semibold text-2xl">{flight.itineraries[1].segments[0].arrival.iataCode}</p>
									</div>
								</div>
							</div>
							<div class="mx-12 my-4">
								<h1 class="text-center font-medium text-xl my-2">{flight.price.total} €</h1>
								<div class="flex justify-center">
									<a href="#" on:click={() => addTrip(flight)} class="button-valide mx-2 text-sm text-center">
										Réservez ➔
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>