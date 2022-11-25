FROM node:16.3.0-alpine As development

WORKDIR /backend_nestJS

COPY package*.json ./

RUN yarn --ignore-engines
RUN yarn install --only=development

COPY . .

# BUILD: create dist folder 
RUN yarn build

# Start the server using the production build
CMD [ "yarn", "start"]