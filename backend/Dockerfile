# use node 24 as base image
FROM node:24-alpine

# set working directory inside container
WORKDIR /app

# copy package files first (for better caching)
COPY package*.json ./

# install dependencies
RUN npm install --production

# copy rest of the app
COPY . .

# expose port
EXPOSE 3000

# start the server
CMD ["node", "src/index.js"]
