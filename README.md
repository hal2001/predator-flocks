# Predator/Prey Flocking

## What is this?
This is a simulation that combines predator/prey dynamics, the flocking algorithm, and natural selection. 

## The Boids
The creatures that move across the screen are called "Boids". Boids can see aspects of their environment, move around, eat, reproduce, and die. There are two types: herbivores and carnivores. The herbivores graze on slowly-regenerating plant matter, and the carnivores eat the herbivores.

## Flocking
The boids move around with intelligent and intentional-seeming behavior: the herbivores generally try to stick together in groups and avoid carnivores, while the carnivores try to catch them. All of this behavior is powered by a single simple algorithm, called [flocking](http://en.wikipedia.org/wiki/Flocking_%28behavior%29). 

The canonical algorithm works as follows: each boid tries to maintain a minimum *seperation distance* away from other boids, tries to *cohere* with the group of nearby boids by moving towards the center of the group, and tries to *align* with the group by moving towards its heading. The relative strengths of each of these behaviors is controlled by a weight. If you want to learn more about flocking, I recommend [Harry Brundage's interactive example](http://harry.me/blog/2011/02/17/neat-algorithms-flocking/). 

For this simulation, I generalized the traditional approach to allow for interspecies dynamics. Each boid runs the flocking algorithm three times on three different inputs. First, on nearby herbivores; second, on nearby carnivores; third, on the single closest boid. This allows for the interspecies behavior in the simulation: herbivores have a high *seperation distance* to carnivores, so they will try to stay away. Carnivores, however, have a negative *seperation weight* for herbivores, so they will try to accelerate towards prey that is close to them. I added the "closest boid" computation to allow carnivores to zero in on a single target when surrounded by a group of prey. Without this accomodation, carnivores would get confused like [Burdian's ass](http://en.wikipedia.org/wiki/Buridan%27s_ass): when between two equally tasty pieces of prey, it would be unable to choose between them, and would starve to death. 

This generalized flocking algorithm has 12 free parameters. The exact parameters are specific to each boid, encoded in their genetics. Thus, the system can potentially evolve into different behaviors over time. One thing I want to experiment with is whether a simulation that starts with non-flocking behavior will naturally evolve towards flocking as a response to predation.

## The Circle of Life 
Every boid has a certain amount of food stored it its body. If the food reaches zero, it starves and dies. If it has a high level of food, then it will reproduce. Reproduction is sexual: the boid will mate with the nearest boid of its own species. Their genetics are then mixed together.

As boids grow older, they 'age' and slow down. Older herbivores will have trouble escaping predators and grazing, while older predators will have trouble catching prey.

## Implementation Details
First things first, you can find the source code [on Github](https://github.com/danmane/predator-flocks). This program is written in Typescript, and uses a mixture of SVG and Canvas as rendering technologies. 

### Overall Architecture
It has a fairly standard OO-style architecture for the simulation. There is a [world](https://github.com/danmane/predator-flocks/blob/master/src/world.ts) object that contains all of the [boids](https://github.com/danmane/predator-flocks/blob/master/src/boid.ts) as well as information on [where the food is](https://github.com/danmane/predator-flocks/blob/master/src/foodBackground.ts) and a [spatial datastructure](https://github.com/danmane/predator-flocks/blob/master/src/gridNeighborDetector.ts) for finding nearby boids quickly. When `world.step()` is called, it:

1. Updates the spatial data structure (GridNeighborDetector)
2. Has each boid compute its own acceleration using the flocking algorithm
3. Has each boid compute its new position, based on its  acceleration
4. Has each herbivore eat the food it is currently standing on
5. Has each predator eat the herbivores it is currently touching
6. Has each boid use up a bit of its own food, then reproduce or die according to how much food it has

### Neighbor Detection
The flocking algorithm requires that each `boid` know the position of the `NUM_NEIGHBORS_TO_SHOW` nearest `boid`s of its species. If implemented naively, this is an `O(n)` computation since we need to check every other boid, and since there are `n` boids, the total runtime is `O(n^2)`.  In practice, this makes a major perf bottleneck. To solve this, I decided to use a spatial data structure that would enable faster queries to find boids in the neighborhood of a given cell. I first considered using a [quadtree](http://en.wikipedia.org/wiki/Quadtree) or [r-tree](http://en.wikipedia.org/wiki/R-tree). These both could have worked, (in particular the r-tree seems a good fit for nearest neighbor detection) but I instead decided to use a simpler solution which was much faster to implement. The solution is to partition the space into a rectangular grid, so that the width of a cell is equal to `NEIGHBOR_RADIUS`, the maximum distance at which boids can be considered neighbors. Then, if we retrieve all of the boids in adjacent cells (the [Moore neighborhood](http://en.wikipedia.org/wiki/Moore_neighborhood)) we have a strict superset of of boids that are potential nearest neighbors and we can find the nearest neighbor through the naïve approach. This is still `O(n^2)` in the worst case (if neighbor radius is very large, or the boids are clumped together) but in practice the performance was much better. This approach is explained in more details (with diagrams!) [here](https://mofanim.wordpress.com/2010/10/27/optimized-boids-i/). 


### Tracking the Food
The green plant material in the background is actually tracked at the pixel level, so right now there are >500,000 separate food values being maintained. For efficiency reasons, we never actually iterate over the netire set of food values for either the model update or rendering. The food values are stored in [foodBackground.ts](https://github.com/danmane/predator-flocks/blob/master/src/foodBackground.ts) as a map storing, for each coordinate, the last time at which a grazer ate the food there. Since food regenerates at a constant rate, to compute the current food value at a cell, we just calculate the number of timesteps that have passed since the last time it was grazed. 

### Rendering
The renderer is actually a mash-up of two different technologies: [svg](http://en.wikipedia.org/wiki/Scalable_Vector_Graphics) and [canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API). The boids are drawn as svg circles using [D3.js](http://d3js.org/); I used D3 for this because it is powerful and I know it well, so it let me prototype rendering very quickly. However, since it requires mutating the DOM it's not as efficient as canvas, so later I may switch the boid renderer over to canvas.

Rendering the food background is a bit more tricky. For obvious reasons, I didn't want to iterate over 500,000 values for rendering each frame. Instead, I render a translucent green background periodically, and then draw small white circles over areas that have just been eaten by a herbivore. The result is that herbivores leave white paths in the background, and these paths slowly fade to green. 
