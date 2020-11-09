# Evaluating Code

- checking code
- using a node/js file across platforms, check syntax of a program that is directly as a shell script!

## Eval to evaluate

```bash
node --eval "2 * 4"
```

(no output)

```bash
node -e "console.log(14+7)"
```

```bash
21
```

## Print to evaluate and print

```bash
node --print "4 * 5"
```

`20`

```bash
node -p "console.log(3 * 7)"
```

```bash
2
undefined
```

- prints undefined because the console.log does not return anything other than _undefined_
