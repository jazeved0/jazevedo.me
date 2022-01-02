---
importance: 10

type: Web App Development
shortTitle: Risk
title: "CS 2340 Scala Project: Risk"
description: Scala/Play + Vue.js web application providing online Risk, produced for CS 2340 with Professor Simpkins
lead: 'The frontend is built with Vue.js and HTML Canvases, leveraging the Javascript canvas library <a href="https://konvajs.org/" target="_blank" rel="noopener">Konva</a>, while the backend is built with Play Framework and Akka in Scala. The two sides communicate over a Websocket connection, and the backend features a <a href="https://riskgame.ga/docs#map-ingestion" target="_blank" rel="noopener">custom SVG map ingestion pipeline</a> written in Python.'
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
    - Batchfile
    - SVG
    - JSON
buttons:
  # - text: Live (Hosted)
  #   href: "https://riskgame.ga"
  #   variant: solid
  #   icon: external-link-alt
  - text: Github
    href: "https://github.com/jazeved0/cs2340-risk"
    variant: solid
    icon: github
  # - text: Documentation
  #   href: "https://riskgame.ga/docs"
  #   variant: hollow
  #   icon: book
---

import Demo from './local/demo'

<Demo
label={"The interactive gameboard screen map, showing each territory and the \
number of troops on them. Click or tap and drag to pan, zoom with pinching or \
scroll wheel. Left click on a territory to add a single army unit, and right \
click to remove."}
height={500}
scale={1.65} />

## Role

For this project, my primary role on the team was lead backend engineer, and I also ended up
configuring the containerized deployment of our application on a variety of platforms (both
within orchestration environments and standalone). While I did contribute to the frontend of
our application, especially where it concerns overall architecture and program structure, the
majority of my contributions were either to the backend or for deployment.

### <Icon name="database" style={{ marginRight: 8 }} />Backend

Over the course of the project, I was responsible for developing the structure of the application's
backend, which, according to the project's guidelines, was a
[Play Framework](https://www.playframework.com/) application written
in Scala. In addition, we made heavy use of a variety of libraries such as:

- [Akka Streams](https://doc.akka.io/docs/akka/current/stream/index.html)
  /[Actors](https://doc.akka.io/docs/akka/current/index-actors.html)
  to manage Websocket connections
- [Google Guice](https://github.com/google/guice) to
  provide runtime dependency injection
- [Caffeine](https://github.com/ben-manes/caffeine) for high
  performance caching on the JVM

> ##### Build Pipeline
>
> A variety of Python, Batchfile, and Bash scripts were made to handle the process of building from
> compilation to deployment. Altogether, they automated performing the following high-level tasks:
>
> 1.  Building the map data from SVG to JSON
> 2.  Building the frontend using Webpack/Vue CLI
> 3.  Building the backend using sbt and packaging it to a zip
> 4.  Unzipping the built archive and configuring the start script
> 5.  Adding additional files, such as data/documentation files
> 6.  Building, tagging, and pushing the Docker image

### <Icon name="docker" style={{ marginRight: 12 }} />Deployment

When it came to running our project in a production environment, I settled on using a Docker
container based on an [Alpine image](https://hub.docker.com/_/openjdk)
that came preloaded with the JRE 8. Initially, I configured deployment for
[Redhat's OpenShift Online](https://www.openshift.com/products/online/)
before switching to [Microsoft's AKS](https://docs.microsoft.com/en-us/azure/aks/),
both of which use Kubernetes for orchestration.

While these worked well, they proved to be inadequate for long-term deployment, with even
short term costs proving to be substantial. With this in mind, the final solution ended
up being a vanilla Docker environment running on a bare metal Ubuntu server. Additionally,
in order to support HTTPS in this environment, I ended up using an [Nginx container acting as
a reverse proxy](https://github.com/jwilder/nginx-proxy)
to handle SSL termination.

## Contributors

The project itself was produced for CS 2340 at Georgia Tech with Professor Christopher
Simpkins [(class website)](https://cs2340.gitlab.io/),
where our team consisted of the following members:

- Joseph Azevedo [(jazeved0)](https://github.com/jazeved0)
- Andrew Chafos [(andrewjc2000)](https://github.com/andrewjc2000)
- Julian Gu [(julian-g99)](https://github.com/julian-g99)
- Thomas Lang [(bopas2)](https://github.com/bopas2)
- Patrick Liu [(PatrickLiu2000)](https://github.com/PatrickLiu2000)
