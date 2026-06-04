FROM apify/actor-node:36
COPY . ./
RUN npm install --omit=dev --legacy-peer-deps 2>/dev/null || npm install --omit=dev
CMD ["npm", "start"]
