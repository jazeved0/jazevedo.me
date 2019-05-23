---
slug: risk-game
permalink: /projects/risk-game
importance: 10

type: Web App Development
shortTitle: Risk
title: "CS 2340 Scala Project: Risk"
description: Scala/Play + Vue.js web application providing online Risk, produced for CS 2340 with Professor Simpkins
lead: "The frontend is built with Vue.js and HTML Canvases, leveraging the Javascript canvas library <a href=\"https://konvajs.org/\" target=\"_blank\" rel=\"noopener\">Konva</a>, while the backend is built with Play Framework and Akka in Scala. The two sides communicate over a Websocket connection, and the backend features a <a href=\"https://riskgame.ga/docs#map-ingestion\" target=\"_blank\" rel=\"noopener\">custom SVG map ingestion pipeline</a> written in Python."
start: January 2019
end: May 2019
topics:
  main:
    - Play/Akka
    - Scala
    - Vue.js
    - Docker
  secondary:
    - Bootstrap
    - Git
    - HTML Canvas
    - Websocket
    - Python
    - Kubernetes
    - Nginx
    - Azure
    - OpenShift
    - SVG
    - Batchfile
buttons:
  - text: Live (Hosted)
    href: "https://riskgame.ga"
    external: true
    class: btn-primary
    icon: fas fa-external-link-alt
  - text: Github
    href: "https://github.com/jazevedo620/cs2340-risk"
    external: true
    class: btn-secondary
    icon: fab fa-github
  - text: Documentation
    href: "https://riskgame.ga/docs"
    external: true
    class: btn-secondary
    icon: fas fa-book

# Demo requirements
headItems:
  - "<link rel=\"preload\" as=\"image\" href=\"/assets/img/project-background.svg\">"
  - "<link rel=\"preload\" as=\"image\" href=\"/projects/risk-game/demo/castle.png\">"
  - "<link href=\"/projects/risk-game/demo/app.d6daa31d.css\" rel=\"preload\" as=\"style\">"
  - "<link href=\"/projects/risk-game/demo/app.d64af9e4.js\" rel=\"preload\" as=\"script\">"
  - "<link href=\"/projects/risk-game/demo/chunk-vendors.6c484327.js\" rel=\"preload\" as=\"script\">"
styles:
  - "/assets/css/project.css"
  - "/projects/risk-game/demo/app.d6daa31d.css"
  - "/projects/risk-game/demo/style.css"
---

{% include risk-demo.html height="500" scale="3" caption="The interactive gameboard screen map, showing each territory and the number of troops on them. Click or tap and drag to pan, zoom with pinching or scroll wheel." %}

## Contributors

The project itself was produced for CS 2340 at Georgia Tech with Professor Christopher Simpkins {% include link.html text="(class website)" href="https://cs2340.gitlab.io/" %}, where our team consisted of the following members:

- Joseph Azevedo {% include link.html text="(jazevedo620)" href="https://github.com/jazevedo620" %}
- Andrew Chafos {% include link.html text="(andrewjc2000)" href="https://github.com/andrewjc2000" %}
- Julian Gu {% include link.html text="(julian-g99)" href="https://github.com/julian-g99" %}
- Thomas Lang {% include link.html text="(bopas2)" href="https://github.com/bopas2" %}
- Patrick Liu {% include link.html text="(PatrickLiu2000)" href="https://github.com/PatrickLiu2000" %}
