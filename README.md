# Native Land Alexa Skill

This repo will be used as a way to teach Alexa skills development by:

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

Give your skill a name.

On the next page select `Custom` and click `Create skill`

*screenshot here*

# Alexa Skills Kit developer console
Welcome to the ASK dev console, you will spend a lot of time here.
*SS*

This is where you configure the permisions your Alexa skill requires, build the app for the Alexa skills library, and configure `Intents`.

First lets configure the `invocation`. The `invocation` is what you will say to "invoke" your Alexa skill.
> "Alexa, ask `Mapster Tutorial` to say hello world"

On the left menu bar click on `Invocation` and enter the words you will say to invoke your skill.
When you have decided, remember to click save at the top of the console area.

*SS*

Intents are what Alexa uses to determine what to do after you invoke a skill.
> "Alexa, ask `Mapster Tutorial` to say hello world"
In this example, the `intent` is `say hello world`

Let's configure our first intent.
- On the left menu bar next to the word `Intents` click the blue plus ➕symbol to add a new `Intent`
- Think of some words or phrases a user may say to launch the `Hello world intent` we have created





