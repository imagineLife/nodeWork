# Debugging with cli

- `--inspect`
  - triggers the v8 inspector
  - takes an optional port: `--inspect=9876`
- `--inspect-brk`
  - inspect mode
  - breaks on first line of the code

### CLI Output After Flags

After entering the inspect-brk flag, (_something like_) this should appear in the terminal

```bash
Debugger listening on ws://127.0.0.1:9229/b23039cd-cd8b-48f6-ba79-83ab9ecd5660
For help, see: https://nodejs.org/en/docs/inspector
```

### Accessing the Node Debugger

- In chrome, set the url to `chrome://inspect`
