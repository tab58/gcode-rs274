# gcode-rs274

Typescript parser for G-code. Validates each line, parses out relevant machine commands, and transmits them via an async iterable.

## Motivation

There are many things about G-code that can be cumbersome. The expression syntax is complicated and expressions can be used for code values. For example, `G[cos[0]+#1]` with `#1=-1` evaluates to `G0` and is perfectly valid. Certain codes also depend on if certain states are active or inactive. What's valid and invalid is very tightly coupled to the state of the machine.

This project attempts to abstract as much machine state from the commands as possible.

This G-code parser follows the format listed in the [NIST RS274/NGC Version 3 specification](https://www.nist.gov/publications/nist-rs274ngc-interpreter-version-3).


## Attributions

Compilation for `src/parser/rs274.js` was made with [Canopy](https://github.com/jcoglan/canopy/).