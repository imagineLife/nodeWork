### Cli Flags

#### `-e`

cli input
`node -e (3+1)`
`node -e "require('fs'); fs.readdir('.', (err,files) => { if(err){ console.log('ERROR'); console.log(err); }else{ console.log('FILES:'); console.log(files) } })"`

#### LOOK UP

- 'real' difference between evaluate && print
  - eval looks like the code will be ran
  - print runs && prints the result
