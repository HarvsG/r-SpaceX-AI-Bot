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
      app.ask(companyInfoTemplate(data, companyParameter));
    }
    APIrequest(app, '/info', callbackCompany)
  }
  
  function getVehicleInfo (app){
    function callbackVehicle (app, data){
      
    }
  }
  
  function getLaunchInfo (app){
    function callbackLaunch (app, data){
      
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
