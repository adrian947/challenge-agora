# Usa una imagen base con Node.js preinstalado
FROM node:14

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia el archivo de configuración de TypeScript
COPY tsconfig.json ./

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Compila TypeScript a JavaScript
RUN npm run build

# Exponer el puerto 3000 (o el puerto en el que escucha tu aplicación Node.js)
EXPOSE 5000

# Comando para ejecutar la aplicación
CMD ["npm", "run", "dev"]
