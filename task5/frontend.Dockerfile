# Node.js imajını temel al
FROM node:20-alpine

# Çalışma dizinini ayarla
WORKDIR /app

# package.json ve package-lock.json dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Proje dosyalarını kopyala
COPY . .

# Geliştirme sunucusu için 5173 portunu dışarıya aç
EXPOSE 5173

# Geliştirme sunucusunu başlat
CMD ["npm", "run", "dev"]
