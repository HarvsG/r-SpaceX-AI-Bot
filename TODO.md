### Road to Beta
Before a beta release numbers ~~2~~ and 3 need to be done. As well as to do the corresponding vehicle info training on the dialogflow agent. The dialogflow agent needs to have comprehensive fallback phrases. There needs to be some robust pre-deployment tests. Ideally also a parralel development build and deployment pathway.

- [ ] As [r/SpaceX API](https://github.com/r-spacex/SpaceX-API) gets a more advanced search query system, the searches need not be done within the webhook, instead, custom https get queries can be used. 

- [x] Vehicle info [function](https://github.com/HarvsG/r-SpaceX-AI-Bot/blob/70dcf6479f757a79c22b5fd456bf958b99133bc6/index.js#L174).

- [ ] Creating verbose replies for all the query parameters

- [ ] Consider making [rich-content replies](https://api.ai/docs/rich-messages#card).
  * for actoins on google [format](https://developers.google.com/actions/dialogflow/webhook)
  * for slack [format](https://api.slack.com/docs/messages)

- [ ] Different display and speech text where appropriate.

- [ ] Optional ‘More info’ Buttons/Speech options

- [x] Allow users to ask questions about specific launches e.g “What pad did CRS-10 take-off from”

- [ ] More help options in conversation

- [ ] More natural conversation flow.

- [ ] For fields that are used for search/query narrowing. e.g 'launch_success', 'rocket' and ‘@LaunchTemporal’ in "When was the first successful launch of the falcon 1?", consider making some reference to them in the reply to inspire user confidence. So instead of the reply simply saying “The launch of RatSat aboard SpaceX's Falcon 1 from Kwajalein Atoll took place at Sun, 28 Sep 2008 23:15:00 GMT.” It might say something like: "The launch of RatSat aboard SpaceX's Falcon 1 from Kwajalein Atoll took place at Sun, 28 Sep 2008 23:15:00 GMT. The launch of RatSat was a success."
