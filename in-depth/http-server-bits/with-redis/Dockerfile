# USE THIS to debug!
# CMD ["/bin/sh", "-c", "pwd; ls -la; pwd; cd ../; pwd; ls -l;"]

# FROM node:alpine as nodebuild
FROM node:18-slim as nodebuild
WORKDIR /app
COPY package.json index.js .
RUN npm install

FROM nodebuild
WORKDIR /app
EXPOSE 3000

# this run time
CMD [ "npm","start"]
