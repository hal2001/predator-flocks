interface Renderer {
	renderBoids(boids: _Boid[], isPrey: boolean): Renderer;
	renderBackground(f: FoodBackground, boidsRemovedThisStep: _Boid[]): Renderer;
}