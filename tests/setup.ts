// Load the library through its entry point before any test imports a module directly, so the modules
// are evaluated in the order src/index.ts sets up (see the comment at its top).

import "../src";
