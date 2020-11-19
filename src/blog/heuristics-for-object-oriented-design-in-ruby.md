---
layout: post
title: Heuristics of Object-Oriented Design in Ruby
tags: ['post']
description: A distillation of Sandi Metz's Pratical Object-Oriented Design (POODR), useful for quick refactoring and long term coding improvement. 
date: 2020-11-10
---

Any Rubyist should read and study [Practical Object Oriented Design, An Agile Primer Using Ruby (POODR)](https://www.poodr.com/), by Sandi Metz. 

Personally, I've read through the book three times. Each time I read it, I find new insights that improve my work as a Ruby programmer, and as a software engineer in general. POODR walks through fundamental object-oriented concepts and pairs them with practical examples in Ruby. Over the course of the book, Metz builds and refactors a sample program that demonstrates these principles.

Despite the book's clarity and practicality (it's a short, to-the-point read), it's hard to keep all of the lessons in your head when you sit down to apply them in your own work. To help myself accomplish that very task, I put together a checklist I call *Heuristics of Object-Oriented Design in Ruby*. Here's how I use it: 

1. I do my work and solve the challenge at hand
2. I take a break, and step away from the code I've written
3. Before making a pull request, I go over my changes and run through this checklist, evaluating my code against each item.

It's not always clean and simple, and not all of the checklist always applies, hence "heuristics". But overall, this systematic review of my Ruby code has given me a more concrete understanding of the lessons contained in POODR. I hope it will be of similar value to you.

## The Heuristics 

Starting with (what I consider) the simplest items, work you way towards the more complex and philosophical line items.

### Code smells

These items can be identified in any Ruby file. They are often the most straightforward to resolve. At the very least, these items may prompt you to consult with an item further down in the list.

1. Use named args to remove order dependencies (Metz, 2019, p. 48).
2. Hide all instance variables behind methods (Metz, 2019, p. 24).
3. Isolate new instances of objects behind methods (Metz, 2019, p. 44).
4. If an object must send messages to any object other than `self`, isolate sending that message in one single method (Metz, 2019, p. 45).
5. Obey the Law of Demeter (Metz, 2019, p. 81).

### Code organization 

These items are harder to identify in code alone, but looking for them will help you find opportunities to improve the structure of your program holistically. 

. Use the `private` keyword to create intentionally designed public interfaces (Metz, 2019, p. 64).
. Use simple dependency injection by passing collaborating objects as arguments to methods (Metz, 2019, p. 43).
. Use duck typing when you see: case statements that switch on `class`, or methods that ask `is_a?` or `kind_of?` (Metz, 2019, p. 118). 
. Use inheritance when you are conditionally sending messages to `self` based on some attribute of `self` (Metz, 2019, p. 134).
. Promote code up to superclasses rather than down to subclasses. If you're creating inheritance, build out one new abstract class and move up what you need instead of adapting an existing class to be the superclass (Metz, 2019, p. 143).

### Abstraction considerations 

These items are concerned with the way in which your code models the problem domain at hand. They are more subjective, but remain useful even in quick code reviews. 

. Every class should have a one sentence description, no conjunctions allowed (Metz, 2019, p. 22).
. If you rephrase your class methods as questions to the object, each question should make sense; it should be related to the purpose of the class (Metz, 2019, p. 22).
. Messages should ask for "what" instead of dictating "how" (Metz, 2019, p. 70).
. Enforce good dependency direction. Never depend on anything that will change more than you (Metz, 2019, p. 55).
. Depend on abstractions before depending on concrete classes (Metz, 2019, p. 57).
. If you have a problem that can be solved by composition, default to composition. Only use inheritance when the benefits of using it are clear (Metz, 2019, p. 209).
. Create shallow hierarchies (Metz, 2019, p. 183).

## Use named args to remove order dependencies

Knowing the required ordering of method arguments is a type of dependency, and it's an easy dependency to avoid. 

```rb
# Bad 
def deal_cards(cards, player) 
    player.update!(cards: cards)
end

# Good 
def deal_cards(cards:, player:)
    player.update!(cards: cards)
end
```

In the first example, if you pass the arguments in the incorrect order, bad or unexpected things might happen, and it could be unclear why. More importantly - if the argument order changes (or you add more, etc.), changing the code where you use the old version gets messy. 

In the second example, you can change the ordering of the arguments any way you like, and it will work. You get the added nicety that Ruby will tell you precisely what arguments you're missing, should you forget to pass them.

## Hide all instance variables behind methods

When a class accesses an instance variable directly, that's a dependency. If the instance variable has to change, you have to change many lines of code.

Ruby provides an excellent solution for this, [attr_accessor](https://ruby-doc.org/core-2.0.0/Module.html#method-i-attr_accessor), and its siblings: `attr_reader`, and `attr_writer`. 

```rb
# Bad 
class BettingRound
    def initialize
        @bets = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    end

    def pot 
        @bets.sum
    end

    def high_bet
        @bets.max
    end
end

# Good
class BettingRound
    attr_reader :bets

    def initialize
        @bets = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    end

    def pot 
        bets.sum
    end

    def high_bet
        bets.max
    end
end
```

It's a subtle change, but by wrapping the `@bets` instance variable in an accessor, we get the option to override the method should we wish to, like so:

```rb
def bets 
    @bets.map { |bet| bet.to_f }
end
```

The idea here is that now `bets` is a message to which `BettingRound` responds, rather than being a piece of data `BettingRound` knows about and manipulates. 

## Isolate new instances of objects behind methods

When an object knows the name of another object, that's a dependency we can avoid. When an object also knows the names of methods on a different object, that's an additional dependency. 

Still, objects need to collaborate with other objects. Sometimes you can't avoid it, like if a `Game` needs to know about a `BettingRound`. Instantiating a new instance of `BettingRound` has to happen somewhere. You may choose to do so inside the `Game` class. Regardless of the best possible decision, if you have existing code where this happens, you can provide some good abstraction by wrapping instantiation in method calls. 

```rb
# Bad
class Game
    attr_accessor :current_betting_round

    def start_new_hand
        current_betting_round = BettingRound.new
    end
end

# Good
class Game
    attr_accessor :current_betting_round

    def create_new_betting_round
        current_betting_round = BettingRound.new
    end

    def start_new_hand
        create_new_betting_round
    end
end
```

If the constructor signature changes for `BettingRound`, now `Game` only needs to make a change in one place. Or if we change out to a different object from `BettingRound` entirely, we only need to change it once. When an instance of `Game` wants a betting round, it just asks itself to `create_new_betting_round`, and we hand wave the details of precisely how that gets done. 

## If an object must send messages to any object other than `self`, isolate sending that message in one single method

As an extension of the previous point, *any time* an object sends a message to another object, other than `self`, consider wrapping that behind a method. 

```rb
# Bad
class Game
    attr_accessor :current_betting_round

    def create_new_betting_round
        current_betting_round = BettingRound.new
    end

    def start_new_hand
        create_new_betting_round
    end

    def pot_odds
        current_betting_round.pot / current_betting_round.high_bet
    end
end

# Good
class Game
    attr_accessor :current_betting_round

    def create_new_betting_round
        current_betting_round = BettingRound.new
    end

    def pot
        current_betting_round.pot
    end

    def high_bet
        current_betting_round.high_bet
    end

    def start_new_hand
        create_new_betting_round
    end

    def pot_odds
        pot / high_bet
    end
end
```

Here, we turn `pot` and `high_bet` into messages to which `Game` will respond, even though they represent messages sent to the `current_betting_round`. `Game` can still collaborate with `BettingRound`, but those collaboration points are isolated, which protects us from dependency problems. 

## Obey the Law of Demeter

The [Law of Demeter](https://en.wikipedia.org/wiki/Law_of_Demeter) instructs us that objects should really only talk to themselves, or, in limited capacity, to their direct collaborators. They should not send messages to objects that collaborate with their collaborating objects. 

```rb
# Bad 

class Game 
    attr_accessor :players

    def initialize(players:)
        @players = players
    end

    def player_ranks
        players.map { |player| player.performance_history.rank }
    end
end

class Player 
    attr_accessor :performance_history

    def initialize(performance_history:)
        @performance_history = performance_history
    end
end

class PerformanceHistory 
    def rank 
        # Maybe some database queries for determining rank
    end
end

# Good

class Game 
    attr_accessor :players

    def initialize(players:)
        @players = players
    end

    def player_ranks
        players.map { |player| player.rank }
    end
end

class Player 
    attr_accessor :performance_history

    def initialize(performance_history:)
        @performance_history = performance_history
    end

    def rank
        performance_history.rank
    end
end

class PerformanceHistory 
    def rank 
        # Maybe some database queries for determining rank
    end
end
```

Here, in the bad example, the `Game` object violates the Law of Demeter by reaching beyond its direct collaborator, an instance of `Player`, and asking the player's `PerformanceHistory` to provide some ranking. 

By allowing `Player` to respond to the request for `rank`, if we ever change the implementation of those rankings, we only have to change it in `PerformanceHistory`, and adapt to it in `Player` (notice the message to *its* collaborator is isolated in a method). `Game` never needs to know the change has happened. 

## Use the `private` keyword to create intentionally designed public interfaces

One of the easiest things you can do to improve your overall design is communicate your public interfaces clearly. Ruby provides the `private` keyword to aid you in this pursuit. Any methods defined after `private` can only be called by an instance of that class. This simple delineation in your class definition tells other developers (including yourself-from-the-future) that the following methods are internal only, and should not be used or depended upon elsewhere in the codebase. 

```rb
# Bad
class Dealer
    attr_reader :deck

    def initialize
        # Assume we set the deck to some full set of playing cards
        deck = [card1..card52]
    end

    def next_card
        deck.pop
    end

    def shuffle_deck
        # Shuffle deck with Fisher-Yates
        (0..deck.size - 1).each do |i|
            j = rand(deck.size - 1)
            tempi = deck[i]
            tempj = deck[j]
            deck[i] = tempj
            deck[j] = tempi
        end
    end
end 

# Good
class Dealer
    attr_reader :deck

    def initialize
        # Assume we set the deck to some full set of playing cards
        deck = [card1..card52]
    end

    def next_card
        deck.pop
    end

    private 

    def shuffle_deck
        # Shuffle deck with Fisher-Yates
        # https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
        (0..deck.size - 1).each do |i|
            j = rand(deck.size - 1)
            tempi = deck[i]
            tempj = deck[j]
            deck[i] = tempj
            deck[j] = tempi
        end
    end
end 
```

Here, the `Dealer` object is responsible for maintaining the deck, shuffling the deck, and providing the `next_card`. However, we don't want to allow other objects to instruct a `Dealer` to shuffle the deck. The `Dealer` should be fully in charge of when it shuffles the deck. By defining `shuffle_deck` after `private`, we make this intention clear, and we set up some language-level restrictions on which objects can send the `shuffle_deck` method to a `Dealer`. 

Moreover, we communicate to other developers not to rely on the logic in `shuffle_deck` elsewhere. Today we shuffle using Fisher-Yates. Tomorrow we may choose some new method of doing so. Regardless of those implementation details, a `Dealer`'s public interface should always respond to `next_card`. That's much less likely to change, and other developers can rest easy asking `Dealer` objects for the `next_card` long into the future. 

## Use simple dependency injection by passing collaborating objects as arguments to methods
## Use duck typing when you see: case statements that switch on `class`, or methods that ask `is_a?` or `kind_of?`
## Use inheritance when you are conditionally sending messages to `self` based on some attribute of `self`
## Any super class that uses the template method pattern must implement every message it sends, even if the implementation is just an error about not being implemented
## Promote code up to superclasses rather than down to subclasses. If you're creating inheritance, build out one new abstract class and move up what you need instead of adapting an existing class to be the superclass
## Every class should have a one sentence description, no conjunctions allowed
## If you rephrase your class methods as questions to the object, each question should make sense; it should be related to the purpose of the class
## Messages should ask for "what" instead of dictating "how"
## Enforce good dependency direction. Never depend on anything that will change more than you
## Depend on abstractions before depending on concrete classes
## If you have a problem that can be solved by composition, default to composition. Only use inheritance when the benefits of using it are clear
## Create shallow hierarchies