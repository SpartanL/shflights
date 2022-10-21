<script>
  import { Link } from "svelte-navigator";
</script>

<header>
  <div class="bg-white">
    <div class="mx-auto max-w-7xl px-4 sm:px-6">
      <div class="flex items-center justify-between border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
        <div class="flex justify-start lg:w-0 lg:flex-1">
          <Link to="/">  
            <img class="h-8 w-auto sm:h-10" src="images/logo.png" alt="">
          </Link>
        </div>
        <div class="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
          <Link to="/trips">
            <a href="#" class="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm" style="background-color: #00a698;"> Mes voyages </a>
          </Link>
        </div>
      </div>
    </div>
  </div>
</header>