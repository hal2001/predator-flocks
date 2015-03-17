module C {

	// Flocking and movement constants
	export var NEIGHBOR_RADIUS = 50;
	export var BASE_SPEED = 1;

	// Boid-specific movement and size
	export var PREY_RADIUS = 2;
	export var PREY_MAX_FORCE = 0.03;
	export var PREY_SPEED_FACTOR = 1;

	export var PREDATOR_RADIUS = 5;
	export var PREDATOR_MAX_FORCE = 0.03;
	export var PREDATOR_SPEED_FACTOR = 1.3;

	// Population control variables (most interesting to modify)
	export var PREY_STARTING_FOOD = 300;
	export var PREY_FOOD_PER_STEP = 0.4;
	export var PREY_ENERGY_FOR_REPRODUCTION = 500;
	export var PREY_TURNS_TO_REPRODUCE = 1000;
	export var PREY_AGE_FACTOR = 0.97;


	export var PREDATOR_STARTING_FOOD = 1000;
	export var PREDATOR_FOOD_PER_STEP = 0.5;
	export var PREDATOR_ENERGY_FOR_REPRODUCTION = 2000;
	export var PREDATOR_TURNS_TO_REPRODUCE = 1000;
	export var PREDATOR_AGE_FACTOR = 0.98;

	export var FOOD_STARTING_LEVEL = 0.3;
	export var FOOD_STEPS_TO_REGEN = 5000;

	export var MAX_BOIDS = 200;

	export var COORDINATES_3D = false;


	export var WEIGHT_MUTATION_CONSTANT = 0.2;
	export var RADIUS_MUTATION_CONSTANT = 0.5;
	export var COLOR_MUTATION_CONSTANT = 5;

	export var CONSUMPTION_TIME = 40; // time a predator needs to eat its food

}