---
importance: 1

type: Probabilistic Game Simulation
shortTitle: Blackjack
title: Blackjack Simulation
description: Java Monte Carlo simulation of Blackjack, set to test a variety of static strategies in order to determine relative effectiveness
lead: 'Java Monte Carlo-style program performing repeated random sampling of Blackjack game simulations in order to determine the relative effectiveness of a variety of strategies, including a naive threshold-based strategy as well as an <a href"https://wizardofodds.com/games/blackjack/strategy/4-decks/" target="_blank" rel="noopener">optimal lookup table-powered strategy</a>.'
start: February 2017
end: April 2017
topics:
  main:
    - Java
    - Git
  secondary:
    - Google Docs
    - Probability/Statistics
    - Game Theory
icon: useLogo
buttons:
  - text: Poster
    href: "/projects/blackjack-simulation/poster.pdf"
    variant: solid
    newTab: true
    icon: map
  - text: Github
    href: "https://github.com/jazeved0/Blackjack-Simulation"
    variant: hollow
    icon: github
---

> Computational Model for Joseph Azevedo & Joshua Lagria's submission to the UTC Math Poster 2017 Competition, programmed in the programming language [Java](https://www.java.com/en/).

- [Main Testing Class](https://github.com/jazeved0/Blackjack-Simulation/blob/master/src/ehs/mat/TestHarness.java)
- [Blackjack Gamestate Controller](https://github.com/jazeved0/Blackjack-Simulation/blob/master/src/ehs/mat/game/BlackjackGame.java)
- [Blackjack Deck Object](https://github.com/jazeved0/Blackjack-Simulation/blob/master/src/ehs/mat/game/BlackjackDeck.java)
- [Optimal Strategy](https://github.com/jazeved0/Blackjack-Simulation/blob/master/src/ehs/mat/strategy/OptimalStrategy.java)
- [Threshold Strategy](https://github.com/jazeved0/Blackjack-Simulation/blob/master/src/ehs/mat/strategy/ThresholdStrategy.java)

## 🔗 External Sources

- Optimal Strategy look-up tables retrieved from [WizardOfOdds.com](https://wizardofodds.com/games/blackjack/strategy/4-decks/)

## 📚 Documentation

<Figure sharp left caption="Functional Diagram" merged>

![Functional Diagram Part 1](./local/functional_1.png)
![Functional Diagram Part 2](./local/functional_2.png)

</Figure>

<Figure sharp left caption="Class Diagram">

![Class Diagram](./local/class_diagram.png)

</Figure>
