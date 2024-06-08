FROM node:20 as builder
WORKDIR /client
# Copia los archivos de configuración y de dependencias necesarios
COPY package*.json ./
COPY tailwind.config.ts postcss.config.mjs next-env.d.ts ./
# Instala las dependencias
RUN npm install
# Copia el resto de los archivos necesarios para la construcción
COPY src ./src
COPY public ./public
COPY next.config.mjs tsconfig.json ./
# Construye la aplicación
RUN npm run build

# Crear la imagen final
FROM node:20
WORKDIR /client
# Copia los archivos construidos y las dependencias necesarias
COPY --from=builder /client/.next ./.next
COPY --from=builder /client/public ./public
COPY --from=builder /client/node_modules ./node_modules
COPY --from=builder /client/package*.json ./
# Configura el PATH para encontrar los binarios locales
ENV PATH /client/node_modules/.bin:$PATH
# Exposición del puerto 3000
EXPOSE 3000
