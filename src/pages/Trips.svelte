<script>
  import { onMount } from 'svelte';
  import { ref, onValue, remove, get } from "firebase/database";
	import { database } from '../firebase'

  let trips = []

  onMount(async () => {
    const dbref = ref(database, '/trips');
    onValue(dbref, (snapshot) => {
      if (snapshot.exists()){
        trips = Object.entries(snapshot.val());
      } else {
        trips = []
      }
    })
	});

  const deleteTrip = (id) => {
    const dbRef = ref(database, "/trips/" + id);
    remove(dbRef)
  }
</script>

<div>
  <h1 class="text-2xl font-bold text-center my-6">Mes voyages ({trips.length})</h1>
  {#each trips as trip}
    <div class="flex justify-center items-center my-4">
      <div class="flex flex-col items-center justify-center shadow-md border border-gray-200 rounded-lg p-2 md:w-1/2">
        <div class="md:flex justify-between">
          <div class="mx-12">
            <div class="flex flex-row items-center my-2">
              <div class="flex flex-col items-center">
                <p>{trip[1].dep.dep_date}</p>
                <p class="font-semibold text-2xl">{trip[1].dep.departure}</p>
              </div>
              <div class="flex flex-col items-center mx-6">
                <p class="font-normal text-gray-700">{trip[1].dep.dep_duration}</p>
                <img src="images/avion.png">
              </div>
              <div class="flex flex-col items-center">
                <p>{trip[1].dep.arr_date}</p>
                <p class="font-semibold text-2xl">{trip[1].dep.arrival}</p>
              </div>
            </div>
            <div class="flex flex-row items-center my-2">
              <div class="flex flex-col items-center">
                <p>{trip[1].arr.dep_date}</p>
                <p class="font-semibold text-2xl">{trip[1].arr.departure}</p>
              </div>
              <div class="flex flex-col items-center mx-6">
                <p class="font-normal text-gray-700">{trip[1].arr.arr_duration}</p>
                <img src="images/avion.png">
              </div>
              <div class="flex flex-col items-center">
                <p>{trip[1].arr.arr_date}</p>
                <p class="font-semibold text-2xl">{trip[1].arr.arrival}</p>
              </div>
            </div>
          </div>
          <div class="mx-12 my-4">
            <h1 class="text-center font-medium text-xl my-2">{trip[1].price}</h1>
            <div class="flex justify-center">
              <a href="#" on:click={() => deleteTrip(trip[0])} class="button-valide mx-2 text-sm text-center" style="background-color: red;">
                Supprimer
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/each}
</div>