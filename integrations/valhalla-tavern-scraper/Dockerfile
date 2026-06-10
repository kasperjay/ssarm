FROM apify/actor-node:22
COPY . ./
RUN npm install --omit=dev --legacy-peer-deps 2>/dev/null || npm install --omit=dev
CMD ["npm", "start"]
