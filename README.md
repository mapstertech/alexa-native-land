# Native Land Alexa Skill

This repo may be used as a way to onboard people on Alexa skills development by:

_Serving as a guide to creating a first Alexa skill_
 
### Major steps
  - Create dev accounts
    - AWS developer account
    - Custom Alexa skills kit project
    - AWS lambda function
    - Google maps API key
- Linking AWS developer account to an Alexa device (optional)
  - Amazon Alexa simulator is enough for this tutorial
- Sending `Hello World`
  - Handle default Alexa "intents"
  - Custom intent `HelloWorldIntent`
- Writing the Native Land custom code
  - Requesting device address
  - Async code
  - Building custom speech responses
  - `WhoseLandIntent`
- Refactoring

# Getting started

You will need to create several developer accounts:
 - [Amazon developer account](https://developer.amazon.com//)
 - [Google maps Geocoding API key](https://developers.google.com/maps/documentation/geocoding/intro)
   - The geocoding API is used to translate postal codes from the addresses to latitude and longitude coordinates for the Native Land api

# New Alexa skill

Head to the [Alexa skills kit](https://developer.amazon.com/alexa-skills-kit/) and click on `Start a Skill`

*screenshot here*

You are now in the ASK (Alexa skills kit) developer console.
Here you can view, manage, update, delete, and create your Alexa skills.

Create a new skill by clicking `Create Skill`

*screenshot here*

Give your skill a name. _This will be the name used to `invoke` your skill_. For example, "Alexa, ask `Tutorial` to say hello world"






