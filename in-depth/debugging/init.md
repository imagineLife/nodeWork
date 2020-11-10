# Debugging

[Node's Debugging Guide, for reference](https://nodejs.org/en/docs/guides/debugging-getting-started/)  
[Google's Dev Docs, too!](https://developers.google.com/web/tools/chrome-devtools)

- **Inspection mode** is the key!
  - Inspection mode exposes a remote protocol
  - Inspection mode allows accessing the Chrome-Dev-Tools debugger
- Leverage the `Pause on Exception` tool, enabled by the hexagon with a pause-symbol inside it
- A `Scope` section of the inspector tools shows the 'variables' and content available through the application && funcitonal scope!
- **Adding Breakpoints** pauses the running code at a specific 'line' in the process
  - in the dev tools, find the vertical "column" of numbers, which represents the line numbers of the code being run
  - click a number - this adds a blue 'flag' on-top-of the number, representing a break-point
  - Now, when the code re-visits this line (_via a loop or some other re-visiting mechanisms_), the code will 'pause', && stop running at this line
