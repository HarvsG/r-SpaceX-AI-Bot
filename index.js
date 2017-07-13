'use strict';
//a version from scratch built using Actions on Google Client Library

process.env.DEBUG = 'actions-on-google:*';
const ApiAiApp = require('actions-on-google').ApiAiApp;
const https = require('https');
const http = require('http');
const queryString = require('query-string');

//Links
const API_URL = 'https://api.spacexdata.com';

// API.AI actions
const UNRECOGNIZED_DEEP_LINK = 'deeplink.unknown';
const GET_COMPANY_INFO = 'get.companyInformation';
const GET_VEHICLE_INFO = 'get.vehicleInformation';
const GET_LAUNCH_INFO = 'get.launchInformation';
const GET_LAUNCHPAD_INFO = '';


// API.AI parameter names
const CATEGORY_ARGUMENT = 'category';

// API.AI Contexts/lifespans
const WELCOME = 'welcome';
const DEFAULT_LIFESPAN = 5;
const END_LIFESPAN = 0;

const parameter = {
};

const LINK_OUT_TEXT = 'Learn more';
const NEXT_INFO_DIRECTIVE = 'Would you like to know anything else?';

const NO_INPUTS = [
  'I didn\'t hear that.',
  'Say that again.',
];
const ENTITY_SEARCH_FIELD = {
  'Vehicles':'rocket',
  'LaunchPads':'launch_site',
  'LaunchOrdinal':'flight_number',
  'MissionOutcome':'launch_success'
};
const PAD_ID_NAME = {//This translation should probably happen via the API for future-proofing
  "RDF":"McGregor Rocket Development Facility",
  "kwajalein_atoll": "Kwajalein Atoll",
  "ccafs_slc_40": "Cape Canaveral Space Launch Complex 40",
  "ccafs_lc_13": "Cape Canaveral Launch Complex 13",
  "ksc_lc_39a": "Kennedy Space Center Launch Complex 39A",
  "vafb_slc_3w": "Vandenberg Air Force Base Space Launch Complex 3W",
  "vafb_slc_4e": "Vandenberg Air Force Base Space Launch Complex 4E",
  "vafb_slc_4w": "Vandenberg Air Force Base Space Launch Complex 4W",
  "stls":"SpaceX South Texas Launch Site"
};
function vehicleInfoTemplate (data, parameter) {
  const VEHICLE_INFO = {
    "id": "falcon9",
    "name": "Falcon 9",
    "active": true,
    "stages": 2,
    "cost_per_launch": 62000000,
    "success_rate_pct": 94,
    "first_flight": "2010-06-04",
    "country": "United States",
    "company": "SpaceX",
    "height": {
      "meters": 70,
      "feet": 229.6
    },
    "diameter": {
      "meters": 3.7,
      "feet": 12
    },
    "mass": {
      "kg": 549054,
      "lb": 1207920
    },
    "payload_weights": [
      {
        "id": "leo",
        "name": "low earth orbit",
        "kg": 22800,
        "lb": 50265
      },
      {
        "id": "gto",
        "name": "geosynchronous transfer orbit",
        "kg": 8300,
        "lb": 18300
      },
      {
        "id": "mars",
        "name": "mars orbit",
        "kg": 4020,
        "lb": 8860
      }
    ],
    "first_stage": {
      "reusable": true,
      "engines": 9,
      "fuel_amount_tons": 385,
      "burn_time_sec": 180,
      "thrust_sea_level": {
        "kN": 7607,
        "lbf": 1710000
      },
      "thrust_vacuum": {
        "kN": 8227,
        "lbf": 1849500
      }
    },
    "second_stage": {
      "engines": 1,
      "fuel_amount_tons": 90,
      "burn_time_sec": 397,
      "thrust": {
        "kN": 934,
        "lbf": 210000
      },
      "payloads": {
        "option_1": "dragon",
        "option_2": "composite fairing",
        "composite_fairing": {
          "height": {
            "meters": 13.1,
            "feet": 43
          },
          "diameter": {
            "meters": 5.2,
            "feet": 17.1
          }
        }
      }
    },
    "engines": {
      "number": 9,
      "type": "merlin",
      "version": "1D+",
      "layout": "octaweb",
      "engine_loss_max": 2,
      "propellant_1": "liquid oxygen",
      "propellant_2": "RP-1 kerosene",
      "thrust_sea_level": {
        "kN": 845,
        "lbf": 190000
      },
      "thrust_vacuum": {
        "kN": 914,
        "lbf": 205500
      },
      "thrust_to_weight": 180.1
    },
    "landing_legs": {
      "number": 4,
      "material": "carbon fiber"
    },
    "description": "Falcon 9 is a two-stage rocket designed and manufactured by SpaceX for the reliable and safe transport of satellites and the Dragon spacecraft into orbit."
  }
  return VEHICLE_INFO[parameter]
}
function companyInfoTemplate (data, parameter) {
  const COMPANY_INFO = {
    "name": `The company is called Space Exploration Technologies or ${data.name} for short.`,
    "founder": `${data.name}'s founder was ${data.founder} in ${data.founded}`,
    "founded": `${data.name} was founded in ${data.founded} by ${data.founder}`,
    "employees": `${data.name} currently has about ${data.employees} employees`,
    "vehicles": `${data.name} currently has ${data.vehicles} different vehicles`,
    "launch_sites": `${data.name} currently operates ${data.launch_sites} independant launch sites`,
    "test_sites": `${data.name} currently operates ${data.test_sites} test site`,
    "ceo": `The current Chief Executive Officer of ${data.name} is ${data.ceo}`,
    "cto": `The current Chief Technology Officer of ${data.name} is ${data.cto}`,
    "coo": `The current Chief Operating Officer of ${data.name} is ${data.coo}`,
    "cto_propulsion": `${data.name}'s current Chief Technology Officer of Propulsion is ${data.cto_propulsion}`,
    "valuation": `${data.name} is currently valued at ${data.valuation}USD`,
    "headquarters": `${data.name}'s headquarters is based in ${data.headquarters.city},${data.headquarters.state}, its address is ${data.headquarters.address}`,
    "summary": `${data.summary}`
  };
  return COMPANY_INFO[parameter]
}
function launchInfoTemplate (data, parameter, past) {
  let tense = past?  "took place":"is due to take place";
  let date = new Date(data.launch_date + 'T' + data.time_utc);
  let dateString0 = date.toDateString() + ", " + data.time_utc + " UTC"; //abandoned date.toUTCString(); as it displayed the seconds annoyingly
  const LAUNCH_INFO = {
    "flight_number": `${data.flight_number}.`,
    "launch_year": `${data.launch_year}.`,
    "launch_date": `The launch of ${data.payload_1} aboard SpaceX's ${data.rocket} from ${PAD_ID_NAME[data.launch_site]} ${tense} at ${dateString0}. `,
    "time_utc": `${dateString0}`,
    "time_local": `${data.time_local}`,
    "rocket": `${data.rocket}`,
    "rocket_type": `${data.type}`,
    "core_serial": `${data.core_serial}`,
    "cap_serial": `${data.cap_serial}`,
    "launch_site": `${PAD_ID_NAME[data.launch_site]}`,//could consider adding a google maps rich data reply
    "payload_1": `${data.payload_1}`,
    "payload_2": `${data.payload_2}`,
    "payload_type": `${data.payload_type}`,
    "payload_mass_kg": `${data.payload_mass_kg}`,
    "payload_mass_lbs": `${data.payload_mass_lbs}`,
    "orbit": `${data.orbit}`,
    "customer_1": `${data.customer_1}`,
    "customer_2": `${data.customer_2}`,
    "launch_success": `${data.launch_success}`,
    "reused": `${data.reused}`,
    "land_success": `${data.land_success}`,
    "landing_type": `${data.landing_type}`,
    "landing_vehicle": `${data.landing_vehicle}`,
    "mission_patch": `${data.mission_patch}`,
    "article_link": `${data.article_link}`,
    "video_link": `${data.video_link}`,
    "details": `${data.details}`
  }
  return LAUNCH_INFO[parameter]
}

exports.SpaceXFulfillment = (request, response) => {
  const app = new ApiAiApp({ request, response });

  //let requestHeader = JSON.stringify(request.headers);
  //console.log('Request headers: ' + requestHeader);
  //let requestBody = JSON.stringify(request.body);
  //console.log('Request body: ' + requestBody);

  function unrecognised (app) {
    app.ask("Sorry I didn't get that");
  }

  function getCompanyInfo (app){
    function callbackCompany (app, data){
      let companyParameter = request.body.result.parameters.CompanyParams;
      let botResponse = {
        'speech':companyInfoTemplate(data, companyParameter),
        'displayText':companyInfoTemplate(data, companyParameter),
      }
      app.ask(botResponse);
    }
    APIrequest(app, '/info', callbackCompany);
  }
  
  function getVehicleInfo (app){
  
    function callbackVehicle (app, data){}
    APIrequest(app, '/vehicles', callbackVehicle);
  }
  
  function getLaunchInfo (app){
  // this function handles GET_LAUNCH_INFO requests
    
    function callbackLaunch (app, data){
    // this function is called as the callback from within APIrequest(app, '/launches', callbackLaunch)
      
      // gives a shorthand variabel for the LaunchQueryParams (this is essentially the object of the user's question)
      let launchQueryParameter = request.body.result.parameters.LaunchQueryParams;
      
      // Creates a masterResults copy of the data, this list will be chopped and changed, preserving 'data'
      let masterResults = data;
      // the list of all the parameters, it will include things like the LaunchQueryParams and perhaps some empty parameters, we dont want these. 
      let paramsList = request.body.result.parameters;
      let cleanedParamsList = [];
      // looks through the parameters sent in the JSON request picks out the ones to be used for searching then adds them to a list
      for (var key in paramsList) {
        if (key !== 'LaunchQueryParams' && key !== 'LaunchTemporal' && key !== 'LaunchOrdinal' && paramsList[key] !== ''){
          cleanedParamsList.push(key);
        }
      }

      // goes through each of the searchable paramenters, searches for them in the list of launches and then shortens the list to the ones that satisfy the search
      for (var i = 0; i < cleanedParamsList.length; i++) {
        let element = cleanedParamsList[i];

        let results = [];
        // gets the search field from the Parameter:api_term pairing made in the header
        let searchField = ENTITY_SEARCH_FIELD[element];
        
        // this may also need a pairing dictionary as the line above does
        let searchVal = paramsList[element];

        // loops through each of the launches in the data array and sees if the seach field matches the value, is true then appends to results
        for (let x = 0; x < masterResults.length; x++) {
          //if (masterResults[x][searchField] == searchVal) { // not always working since Dragon 1 can be Dragon 1.1 or Dragon 1.0. .toString as values will sometimes be booleen
          if (masterResults[x][searchField].toString().indexOf(searchVal) != -1) {
            results.push(masterResults[x]);
          }
        }
        masterResults = results;
      }
      
      let past = true;
      
      if (request.body.result.parameters.LaunchTemporal == 'next' && masterResults.length !== 0){
        //makes master results equal to only its first element
        masterResults = [masterResults[0]];
        past = false;
        
      }else if(request.body.result.parameters.LaunchTemporal == 'last' && masterResults.length !== 0){
        //makes master results equal to only its last element
        masterResults = [masterResults[masterResults.length-1]];
      }else if (request.body.result.parameters.LaunchOrdinal.ordinal != null && request.body.result.parameters.LaunchOrdinal.ordinal !== '' && masterResults.length !== 0){
        //makes master results equal to only its nth element
        masterResults = [masterResults[request.body.result.parameters.LaunchOrdinal.ordinal-1]];
      }
      let speech = '';
      for (let n = 0; n < masterResults.length; n++) {
        let ele = masterResults[n];
        speech += launchInfoTemplate(ele, launchQueryParameter, past);
      }
      speech = (speech === '')? "Unfortunately I couldn't find any launches that met your descriptions. Is there anything else I can help with? ":speech;
      let botResponse = {
        'speech': speech,
        'displayText': speech,
      }
      app.ask(botResponse);
    }
    
    if (request.body.result.parameters.LaunchTemporal == 'next'){
      APIrequest(app, '/launches/upcoming', callbackLaunch);
    }else{
      APIrequest(app, '/launches', callbackLaunch);
    }
    
  }
  
  function APIrequest (app, path, callback) {
    // this function takes a des
    https.get(API_URL + path, (res) => {
      const { statusCode } = res;
      const contentType = res.headers['content-type'];

      let error;
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
                          `Status Code: ${statusCode}`);
      } else if (!/^application\/json/.test(contentType)) {
        error = new Error('Invalid content-type.\n' +
                          `Expected application/json but received ${contentType}`);
      }
      if (error) {
        console.error(error.message);
        // consume response data to free up memory
        res.resume();
        return;
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          console.log(parsedData);
          // some code to pick the relevant company data from the user request (request.body.result.parameters.CompanyParams)
          callback(app, parsedData)
        } catch (e) {
          console.error(e.message);
        }
      });
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
    });
    
  }

  let actionMap = new Map();
  actionMap.set(UNRECOGNIZED_DEEP_LINK, unrecognised);
  actionMap.set(GET_COMPANY_INFO, getCompanyInfo);
  actionMap.set(GET_VEHICLE_INFO, getVehicleInfo);
  actionMap.set(GET_LAUNCH_INFO, getLaunchInfo);

  app.handleRequest(actionMap);

};
