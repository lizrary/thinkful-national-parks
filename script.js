let NPS_API_KEY = 'spMifSfWTVmaIIp4WAYq5Yq6J0xlMwG2S6zaq2NZ';
let NPS_BASE_URL = 'https://cors-anywhere.herokuapp.com/https://developer.nps.gov/api/v1';

let lastState = '';

$(function onPageReady(){
  submitHandler ();
})

function submitHandler () {
  $('form').submit(function (e) {
    e.preventDefault(); 
    // sanitize user input
    let captUserInput = parseInt( $('#maxResults').val().trim(), 10 );
    // adjusts for Index
    let userMax = captUserInput - 1;
    
    const userStateReq = $('#state').val().trim();

    console.log ('User input captured for Max Results: ' + captUserInput);
    console.log ('User input captured for the State(s) requested: ' + userStateReq);
    console.log ('Submit Button was clicked');


      if ( Number.isNaN(captUserInput)) {

        console.log('IF statement triggered')
        userMax = 9;
        captUserInput = 10;
      } else {
        console.log('ELSE statement triggered')
      }

      return getParksInfo(userMax, userStateReq)
      .then(function (data) {
        displayResults(data, captUserInput);
      });
  });   
}

function getParksInfo (userMax, userStateReq) {
  // error checking for missing state?
  lastState = userStateReq;
  return getAuthedNPSRoute(`/parks?stateCode=${userStateReq.trim()}&limit=${userMax}`)
  .then (response => /* missing error handling */ response.json())
}

function getAuthedNPSRoute(path){
  return fetch (NPS_BASE_URL + path, {
    headers: {
      'X-Api-Key': NPS_API_KEY
    }
  })
}

function displayResults (parks, userMax) {

  // in a logical Park context, not just random data
  // translate JSON from parks into HTML for user
  console.log(parks);

  let parksHTML = parks.data.map(displayPark).join('\n');
  $('#results').html(`<h2>Showing ${userMax} Results for ${lastState}</h2><ol>${parksHTML}</ol><br>`); 
}

function displayPark(park){
  return `<li>Park Full Name: ${park.fullName} <br>Description: ${park.description}<br>URL: ${park.url}</li>`;
}
