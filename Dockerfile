# Etapa 1: Construcción del cliente Next.js
FROM node:20 AS builder
WORKDIR /client
COPY client/package*.json ./
COPY client/tailwind.config.ts client/postcss.config.mjs client/next-env.d.ts ./
RUN npm install
COPY client/src ./src
COPY client/public ./public
COPY client/next.config.mjs client/tsconfig.json ./
RUN npm run build

# Etapa 2: Configuración del servidor Python
FROM python:latest AS server
WORKDIR /server
COPY server/requirements.txt ./
RUN pip3 install -r requirements.txt
COPY server/ .

# Etapa 3: Configuración final del cliente Next.js
FROM node:20 AS final-client
WORKDIR /client
COPY --from=builder /client/.next ./.next
COPY --from=builder /client/public ./public
COPY --from=builder /client/node_modules ./node_modules
COPY --from=builder /client/package*.json ./
ENV PATH /client/node_modules/.bin:$PATH
EXPOSE 3000

# Etapa 4: Configuración final del servidor Python
FROM python:latest AS final-server
WORKDIR /server
COPY --from=server /server /server
EXPOSE 5000

# Comando por defecto para iniciar el servidor Python
CMD ["sh", "-c", "python /server/app.py"]
