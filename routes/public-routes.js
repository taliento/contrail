const publicRoutes = [
  //public app routes
  "/signin",
  "/signup",
  "/home/session",
  "/home/itineraries",
  //public folders
  /^\/public\/.*/,
  /^\/public\/img\/.*/,
  //public api routes
  "/api/signin",
  "/api/signup",
  "/api/skyscanner/createSession",
  /^\/api\/skyscanner\/getPlaces\/.*/,
  /^\/api\/skyscanner\/pollSessionResults\/.*/,
  /^\/api\/skyscanner\/getSuggestions\/.*/
];

module.exports = publicRoutes;
