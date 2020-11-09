# Leveraging stack-tracing

- defaults to last 10 lines of stacktrace on error
- to see as much as possible, set the limit HIGH!
  - more stack-trace for dev && maybe qa only...
  - causes some cpu overhead, not worth it on prod

```bash
node --stack-trace-limit=99999 app.js
```
