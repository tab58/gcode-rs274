# gcode-rs274

Typescript parser for G-code that attempts to remove shared state from the program.

## Motivation

G-code is primarily a "move-to" command system. It depends heavily on a state machine for many of the operations. Knowing what position the 

This G-code parser follows the format listed in the [NIST RS274/NGC Version 3 specification](https://www.nist.gov/publications/nist-rs274ngc-interpreter-version-3).


## Attributions

Compilation for `src/parser/rs274.js` was made with [Canopy](https://github.com/jcoglan/canopy/).