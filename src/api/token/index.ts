const getTrendingToken = () => {
   const response = fetch("https://pro-api.coingecko.com/api/v3/search/trending")
   return response;
}