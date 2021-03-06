# Native Land Alexa Skill

This repo will be used to teach Alexa skills development by serving as a guide to creating a first Alexa skill.

### Table of contents
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

You are now in the ASK (Alexa skills kit) developer console.
Here you can view, manage, update, delete, and create your Alexa skills.

Create a new skill by clicking `Create Skill`

Give your skill a name.

On the next page select `Custom` and click `Create skill`

![create custom skill](./screenshots/create-custom-skill.png)

# Alexa Skills Kit developer console
Welcome to the ASK dev console, you will spend a lot of time here.

![create custom skill](./screenshots/ask-dev-console.png)

This is where you configure the permisions your Alexa skill requires, build the app for the Alexa skills library, and configure `Intents`.

### Invocation

First lets configure the `invocation`. The `invocation` is what you will say to "invoke" your Alexa skill.
> "Alexa, ask `Mapster Tutorial` to say hello world"

Or

> "Alexa, open `Mapster Tuorial`"

On the left menu bar click on `Invocation` and enter the words you will say to invoke your skill.
When you have decided, remember to click save at the top of the console area.

![configure invocation](./screenshots/configure-invocation.png)

### Intents & Utterances

Intents are what Alexa uses to determine what to do after you invoke a skill.
> "Alexa, ask **Mapster Tutorial** to say hello world"

Utterances are words or a phrase a user might say to launch a specific intent
- Alexa listens for `Utterances` after the `Invocation` to determine what to do (What is your intent?)

> "Alexa, ask **Mapster Tutorial** to **say hello world**"

In this example, the `intent` is `HelloWorldIntent` and the `utterance` is `say hello world`.
- In our "Alexa code" we will set up a listener for HelloWorldIntent to handle this intent i.e. send back "Hello, world."

Let's configure our first intent.
- On the left menu bar next to the word `Intents` click the blue plus ➕ symbol to add a new `Intent`
- You can name an intent whatever you like as long it complies with Amazon's intent rules
- I named mine `HelloWorldIntent`
- Think of some words or phrases a user may say to launch the `Hello world intent` we have created, or copy and paste mine. These are the `Utterances`.
```
say hello
say hi
hi
hello
say hello world
hello world
play me the song of our people
```

### Permissions
Permissions can be configured from the left menu bar.

We will need permission to:

>Device Address: Country & Postal Code Only

![configure country and postal code](./screenshots/configure-permissions-country-and-postal-code.png)


### Device Location
Device Location can be changed from the Alexa app or from the [web app](https://alexa.amazon.ca/).

#### Web app

![configure device location](./screenshots/device-location.png)


### Next steps
1. Save the model!! *VERY IMPORTANT*. You will lose your changes if you do not save.


2. Go back to the `Alexa Skills Console` and copy the ridculously small Alexa skill key.
    - This is a unique device key, and your Lambda function requires it as a config

![tiny alexa skill key](./screenshots/ask-alexa-skill-id.png)

# Lambda function
Head back to the [AWS management console](https://aws.amazon.com/console/) and create a new lamda function. You may have to search for Lambda and click on the link

![search for lambda function](./screenshots/search-for-lambda-function.png)

Click the region drop-down in the upper-right corner of the console and select one of the regions supported for Alexa skills: Asia Pacific (Tokyo), EU (Ireland), US East (N. Virginia), or US West (Oregon).

In the Lambda management console click `Create function`

1. Select **Author from scratch**
2. Name your function
3. Select Node.js 8.10 as the runtime
4. Role
    - Select **Create new role from template**
    - Enter the role name
    - From the **Policy templates** list, select **Simple Microservice Permissions**
5. Click **Create function**

On the next page you'll add the ASK trigger to your lambda function, this is a verification process that ensures only your skills communicate with your function.
1. In the **Designer** menu select the **Alexa Skills Kit** tab
2. Scroll down and paste the tiny Alexa skill key you copied into the **Skill ID** field
3. Click **Add** in the bottom right corner.
4. **Click `Save` in the top right corner of the page**

Now we need to configure our Alexa Skill with the lambda function ID.

It's really easy to find, at the top right corner of the page.

![lambda function id](./screenshots/console-lambda-function-id.png)

## Alexa console
Head back to the [Alexa skills console](https://developer.amazon.com/alexa/console/ask)

1. Select the **Endpoint** tab in the left side menu
2. Paste the lamda function ID into the default region field

![ask endpoint lambda function id](./screenshots/ask-endpoint-lambda-function-id.png)

3. **SAVE**

# Coding!

Yes, we can actually write some code now.

In a new directory:
```
touch index.js
npm init -y
npm install ask-sdk axios
```

### Default intent handlers

There are four default intents every alexa skill must be able to respond to.

1. `FallbackIntent`
2. `CancelIntent`
3. `HelpIntent`
4. `StopIntent`

We need to handle these intents before we can write our own code

```
/* index.js */

const Alexa = require('ask-sdk');
const axios = require('axios');

const messages = {
    WELCOME: 'Welcome to the Mapster alexa tutorial, ask me to say hi or to hello world.',
    WHAT_DO_YOU_WANT: 'Did you say something? I couldn\'t hear you.',
    HELP: 'You can use this skill by asking me to say hello world.',
    GOODBYE: 'Bye! Thanks for using the Mapster Tutorial Skill!',
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        let speechText = messages.WELCOME;
        let repromptText = messages.WHAT_DO_YOU_WANT;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(repromptText)
            .withSimpleCard('Mapster Tutorial', speechText)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = messages.HELP;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('Mapster Tutorial', speechText)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = messages.GOODBYE;

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Mapster Tutorial', speechText)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // any cleanup logic goes here
        const err = handlerInput.requestEnvelope.request.error

        if (err) {
            console.log('ERROR', err);
        }

        return handlerInput.responseBuilder.getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler
    ).lambda();

```

#### We're almost there!

Add this code after the last handler, `SessionEndedRequestHandler`

```
const HelloWorldHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speechText = 'Hello, World!';

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Native Land', speechText)
            .getResponse();
    }
};
```

`handlerInput.requestEnvelope.request.type` must match what you named your intent in the Alexa Skills Console.

### NOTE:

Putting `console.log()` statements in your `index.js` will output to the **AWS Cloudwatch** service.

The quickest way to access your function's logs are by going to the **Monitoring** tab and clicking on any of the **jump to logs** links.

![jump to logs](./screenshots/jump-to-logs.png)

#### Alternatively

You can access **Cloudwatch** from the AWS console by searching for it and then navigating to the **Logs** menu on the left hand side.

### Lamdba function

We need to upload our code to the lamdba function.

Zip all the files inside the directory, including `node_modules`. Do not zip the directory itself.

![compress items](./screenshots/compress-items.png)

Head back to your Lambda function to upload your zipped file.

![upload zip](./screenshots/upload-zip.png)

Leave index.handler as the Handler field.
- The module-name.export value in your function. For example, "index.handler" would call exports.handler in index.js.

**SAVE**

### Alexa skills kit console

This is it!

Go back to the ASK console, **save**, then **Build Model**. This will take a minute or two.

After it builds, you can enter the Alexa Simulator by clicking **Test**. Be sure to enable testing for this skill.

![enable testing](./screenshots/ask-enable-testing.png)

Click and hold on the mic and start speaking!!

You can experiment and explore the simulated devices logs, by checking the **Device Logs** box.

When you are testing on a device, this interface and the lambda function's log reporting are the two primary debugging interfaces.

# In progress...

Native land specific code and screenshots

