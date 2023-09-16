# USE THIS to debug!
# CMD ["/bin/sh", "-c", "pwd; ls -la; pwd;"]

FROM node:18-slim
WORKDIR /app
COPY package.json index.js ./
RUN npm install
EXPOSE 3000

CMD [ "npm","start"]