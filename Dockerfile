FROM node:16.18.1

WORKDIR /usr/src/app

COPY package*json ./
RUN npm install

COPY . .
RUN npx prisma generate

EXPOSE 8870
CMD ["npm", "run", "dev"]