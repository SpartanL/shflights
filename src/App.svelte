<script>
  import { Router, Route, Link } from "svelte-navigator";
  import Header from "./pages/Header.svelte";
  import Home from "./pages/Home.svelte";
  import Trips from "./pages/Trips.svelte";
</script>

<Router>
  <main>
    <Header />
    <Route path="/">
      <Home />
    </Route>

    <Route path="trips">
      <Trips />
    </Route>
  </main>
</Router>