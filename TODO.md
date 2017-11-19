1. As [r/SpaceX API](https://github.com/r-spacex/SpaceX-API) gets a more advanced search query system, the searches need not be done within the webhook, instead, custom https get queries can be used. 

2. Vehicle info

3. Creating verbose replies for all the query parameters

4. Consider making [rich-content replies](https://api.ai/docs/rich-messages#card).
  * for actoins on google [format](https://developers.google.com/actions/dialogflow/webhook)
  * for slack [format](https://api.slack.com/docs/messages)

5. Different display and speech text where appropriate.

6. Optional ‘More info’ Buttons/Speech options

7. Allow users to ask questions about specific launches e.g “What pad did CRS-10 take-off from”

8. More help options in conversation

9. More natural conversation flow.

10. For fields that are used for search/query narrowing. e.g 'launch_success', 'rocket' and ‘@LaunchTemporal’ in "When was the first successful launch of the falcon 1?", consider making some reference to them in the reply to inspire user confidence. So instead of the reply simply saying “The launch of RatSat aboard SpaceX's Falcon 1 from Kwajalein Atoll took place at Sun, 28 Sep 2008 23:15:00 GMT.” It might say something like: "The launch of RatSat aboard SpaceX's Falcon 1 from Kwajalein Atoll took place at Sun, 28 Sep 2008 23:15:00 GMT. The launch of RatSat was a success."
