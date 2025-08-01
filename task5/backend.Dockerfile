# Python imajını temel al
FROM python:3.12-slim

# Çalışma dizinini ayarla
WORKDIR /app

# Bağımlılık dosyasını kopyala
COPY requirements.txt .

# Bağımlılıkları yükle
RUN pip install --no-cache-dir -r requirements.txt

# Backend kodunu kopyala
COPY ./api /app/api

# 8000 portunu dışarıya aç
EXPOSE 8000

# Uygulamayı başlat
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
