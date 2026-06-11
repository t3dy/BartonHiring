# Matthew's Voice Notes — Quote Game Spec (2026-06-11)

Transcribed from `barton-moving-voice-message.mp3` (faster-whisper base.en).

## Key requirements extracted

### 1. Location picker (THIS SPRINT)
- ~10 general area icons for "from" and "to": North Austin, South Austin, Georgetown,
  San Marcos, San Antonio, etc.
- Plus a "plug in your own location" option (example: Wimberley).
- Reduce the vector complexity — fixed areas, not freeform routing.

### 2. Property type with cute icons
- Apartment vs house as gamified pictures (already in wizard).
- House: bedrooms + multiple stories; 4+ bedrooms gets a "McMansion" icon.
- Apartment: elevator? long walk from elevator? (handicaps)

### 3. Item cart
- Click cute item icons; adds like a shopping cart / menu selection (already in wizard).

### 4. Box estimator
- Stacks of boxes as icons: small stack = 10–15, bigger = 15–30, … up to 100 boxes.

### 5. Pricing model (current company calculator)
- Square footage + handicaps = price.
- Example: 1,000 sq ft downtown apartment with freight elevator = big handicap
  (~60% more time) vs same apartment with door straight to outside.

### 6. Partner discount codes
- Apartment complexes with relationships (e.g., Windsor on the Lake) get a code
  like "ONTHELAKE5" → 5% off or $50 off the estimate.

### 7. Crew size picker ("salamanders")
- Pick number of salamanders (crew). If too few for the home size, game warns
  "this won't work, you need more guys" — educates the customer.

### 8. Style & stretch ideas
- Match site color tones. Duolingo-like game feel.
- Voice feature: speak your item list → icons appear.
- End screen: cute low-fi rendering of "your house" built from selections.

## Raw transcript

All right. So this one will be about the game. So the way I am thinking about it is that they, of course, have two options, which is one, you know, contact and the other would be build your move, get a rough estimate through this little game we've made. And the way I think the game would play best is, of course, you know, they, it starts with, you know, are you going from Austin to San Antonio, Austin to Austin, Georgetown to Austin? This might be more complicated because my thought process on this is we actually probably want to reduce the amount of, like, vectors they can choose from, like, you know, because it'll just make the game so much harder to build and be more complicated. But maybe not. Maybe we put, like, 10 general icons of areas they could be moving to, like, North Austin, South Austin, Georgetown, San Marcus, San Antonio, blah, blah, blah. And then the, of the 10 that we've decided, you know, like, we can also have a plug-in, your own location, you know, so say, like, they're going to Wimberly, right? You know, which is like a small town. And anyway, and then from there, it takes you to, like, what kind of spot you live in. And we basically, I think, it would be, you know, either apartment or house, right? And we can maybe add on to this, but right, it would just be like a picture of a cute house or a picture of an apartment kind of in this gamified, like, digital way. And they take, like, starting location, boom, boom, boom, and then ends location, boom, boom, boom, with these same icons of, like, an apartment complex or a, you know, whatever it is. And then also, if it's like an apartment complex that we have, like, a relationship with, they can maybe enter a code. And I can have the apartment complex that we work with, like, Windsor on the lake. It could be, like, on the lake, five for a, you know, 5% off discount for your move or, like, where it plugs in for the estimate that they're going to get $50 off or whatever, right? And then from there, you start building your own, like, move where it's, like, not what you already have been, but you start building, like, we, like, give a list of general items, you know, that they have. So it's like, you know, like, a little picture of a bed that's cute, a little picture of a, um, a chest of drawers, a chair, um, you know, sleeper sofa, and they just click on it and it just adds it, almost like it's adding it to the cart of, like, an order, you know, kind of like that menu selection idea. Um, and then, you know, you, you go through all that, finish that, then it can be, like, you know, estimate your range of boxes, right? And, you know, it could be, like, a couple different stacks, like, you know, a smaller stack, like, one box is, like, a stack of, like, 10 to 15, right? And then another stack would be a little bigger, you know, like, the two box stack that they show would be, like, 15 to 30, and so forth, all the way up to 100 boxes. Um, and him from there, um, we could even have, like, your handicap, which actually might be better to put right after. So, um, if you choose what kind of location they're moving out of, um, and that would probably be important because it's like, okay, yeah, like, if they choose apartment, what we do is we ask them, like, either be icons of, like, oh, is there an elevator at this apartment? Is it a long walk from the elevator and figure out how to kind of gamify that, um, and then with a house, it's like, if they pick a house, like, you know, is it a two bedroom house, a one, you know, a three bedroom house, and is it multiple stories, you know? And if it's a house that's bigger than four bedrooms, then, you know, we have, like, a McMansion sort of looking, like, you know, icon, right? Like, we're using icons and they're building their, their moves, um, and, you know, so I've just kind of gone backwards, right? But so I'm going to go back for it. So now they've completed, like, their item list, right? Um, and they've completed their box amount, um, and then finally we could be, like, any, you know, like, specialty items, um, et cetera, et cetera. And then from there, you know, maybe that's when we are like, oh, here's your quote, you know, based off of this. So currently the way our calculator works is pretty cool. You, essentially, um, are putting in the square footage, and then there's handicaps. And that square footage plus the handicap kind of gets them the price. So it's, like, a thousand square foot downtown apartment, freight elevator, is like a big handicap, right? Like, that's like a, that's a big job now. Whereas if it was a thousand square foot apartment, uh, where it's, like, not an interior unit where, like, you know, you open your front door and you go outside as opposed to a hallway to go down the elevator and then out the front door. Like, that move will be priced significantly differently because, you know, it's going to take 60% more time to deal with the freight elevator and so forth. So we'd have to figure out a way to do that. Um, but sort of like the way and the cuteness of it, like, you know, we could even have, like, pick the amount of salamanders you want. You know, as far as, like, cruise size and, like, if they say pick two salamanders and it's, like, actually for a bedroom house, then we're like, oh, you know, this won't work. You need more guys for this job. Otherwise, it could take a really, really long time, you know, to kind of help them understand a little bit. Um, but yeah, I mean, that's kind of what I'm thinking. As far as a few of the stylized aspects of it, we'll want to keep it in color tone with, obviously, the rest of the website. Um, and, uh, we'll also, um, I kind of like, I don't know if you've ever played Duolingo, but kind of like the way Duolingo works. Like, the way that game is kind of played. Um, you know, maybe we could even give it, like, a voice feature to where they just list all the items they have as a voice note, and then it translates and shows them, like, the icons of all the items that they have. And I don't know how complicated we can make it, but, like, at the end, it shows them their house or whatever, like, just the really shitty, like, you know, fun game rendering of a bigger house. It doesn't have to have all the items. Um, so that's kind of what I've been, uh, thinking about. And that's kind of where I will leave it, um, because I think that was networked well. Um, so, yeah, that's what I would say.
