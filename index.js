'use strict';
//a version from scratch built using Actions on Google Client Library

process.env.DEBUG = 'actions-on-google:*';
const ApiAiApp = require('actions-on-google').ApiAiApp;
const https = require('https');
const http = require('http');
const queryString = require('query-string');

// API.AI actions
const UNRECOGNIZED_DEEP_LINK = 'deeplink.unknown';
const GET_INFO = 'get.info';


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

exports.SpaceXFulfillment = (request, response) => {
  const app = new ApiAiApp({ request, response });

  //let requestHeader = JSON.stringify(request.headers);
  //console.log('Request headers: ' + requestHeader);
  //let requestBody = JSON.stringify(request.body);
  //console.log('Request body: ' + requestBody);

  function unrecognised (app) {

  }

  function handler (app){
    // set one time use variables etc

    function foo (){
      //function that formats and sends request the r/SpaceX API
    }
    function bar (){
      //function that calls foo(args) then takes its response and generates a user friendly response and sends it to the bot
      var speech = "";
      //some code that fills speech
      app.ask(speech);
    }

  }

  let actionMap = new Map();
  actionMap.set(UNRECOGNIZED_DEEP_LINK, unrecognised);
  actionMap.set(GET_INFO, handler);

  app.handleRequest(actionMap);

};
