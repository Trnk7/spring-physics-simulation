# Spring Simulation

A small interactive spring-mass simulation built with plain HTML, CSS, and JavaScript. It renders a spring grid on a canvas, applies force-based physics, and lets you drag points to watch the system react in real time.

## Features

* Spring-mass physics with force accumulation on each point
* Draggable grid points for direct interaction
* Live controls for gravity, stiffness, and damping
* Pause and reset controls for quick experimentation
* No build step or external dependencies

## Controls

* **Gravity Y** — Adjusts the vertical gravity force applied to every point.
* **Stiffness** — Changes how strongly springs try to return to their rest length.
* **Damping Scale** — Controls how quickly oscillations settle down.
* **Pause** — Freezes the simulation while letting you inspect the current layout.
* **Reset Grid** — Rebuilds the spring grid using the current control values.

## How to Use

1. Open `index.html` in a browser.
2. Drag any non-pivot point on the canvas.
3. Use the controls in the top-left to experiment with the simulation.
4. Press **Pause** to freeze the physics.
5. Press **Reset Grid** to rebuild the spring network.

## Project Structure

```text
.
├── index.html      # Page structure and control panel
├── style.css       # Layout and visual styling
├── vector.js       # 2D vector helpers
├── point.js        # Point state, forces, and integration
├── spring.js       # Spring force and damping calculations
└── main.js         # Canvas, controls, grid, and animation loop
```

## Physics Model

Each point stores:

* Position
* Velocity
* Mass
* Accumulated force

Each spring:

1. Measures the current distance between its two endpoints.
2. Compares it with the rest length.
3. Applies equal and opposite spring forces.
4. Applies damping based on relative velocity along the spring axis.

Gravity is applied to the points before the physics update.

The spring force is based on Hooke's law:

```text
F = -kx
```

with damping added to reduce oscillations.

## Why This Project?

This project was built to understand spring physics from the ground up rather than relying on a physics engine.

It can also serve as a starting point for experimenting with:

* Cloth simulation
* Soft-body physics
* Particle systems
* Collision detection
* Constraint-based physics

## Contributing

Ideas, improvements, bug fixes, and new physics experiments are welcome.

Feel free to fork the project, experiment with the simulation, and open a pull request.

## Notes

* The project is intentionally lightweight and runs directly in the browser.
* No build tools or external dependencies are required.
* For the best results, experiment with moderate gravity, stiffness, and damping values.

## License

This project is licensed under the MIT License.
