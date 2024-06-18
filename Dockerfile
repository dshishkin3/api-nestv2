FROM node:14-alpine
# work folder
WORKDIR /opt/app 
# cache libraries
ADD package.json package.json 
RUN npm install
ADD . .
RUN npm run build
# delete dev env
RUN npm prune --production
CMD ["node", "./dist/main.js"]