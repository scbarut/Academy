from typing import Optional
from fastapi import FastAPI
import gradio as gr
from datasets import load_dataset
from nltk.tokenize import word_tokenize
import nltk
import faiss
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
from sentence_transformers import SentenceTransformer
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv
import time
import os

# NLTK verilerini indir
nltk.download('punkt')

# Veri yükleme ve işleme
print("Veri yükleniyor...")
ds_en = load_dataset("tcltcl/small-simple-wikipedia")

def chunk_by_word_count(text, max_words=150):
    words = word_tokenize(text)
    return [' '.join(words[i:i+max_words]) for i in range(0, len(words), max_words)]

all_chunks_en = []
for sample in ds_en['train']:
    chunks = chunk_by_word_count(sample['text'])
    all_chunks_en.extend(chunks)

print(f"Toplam chunk sayısı: {len(all_chunks_en)}")

# TF-IDF + FAISS
print("TF-IDF modeli hazırlanıyor...")
vectorizer = TfidfVectorizer(max_features=5000)
tfidf_dense = vectorizer.fit_transform(all_chunks_en).toarray().astype('float32')
index_tfidf = faiss.IndexFlatL2(tfidf_dense.shape[1])
index_tfidf.add(tfidf_dense)

# SBERT + FAISS
print("SBERT modeli hazırlanıyor...")
model_sbert = SentenceTransformer('all-MiniLM-L6-v2')
embedding_sbert = model_sbert.encode(all_chunks_en, show_progress_bar=True)
index_sbert = faiss.IndexFlatL2(embedding_sbert.shape[1])
index_sbert.add(np.array(embedding_sbert))

# GoogleEmbedding + FAISS
print("Google Embedding modeli hazırlanıyor...")
load_dotenv()
model_google = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
embedding_google = model_google.embed_documents(all_chunks_en)
embedding_google_np = np.array(embedding_google, dtype="float32")
index_google = faiss.IndexFlatL2(embedding_google_np.shape[1])
index_google.add(embedding_google_np)

# FastAPI uygulaması
app = FastAPI()

def search_with_models(query: str, k: int = 5):
    if not query:
        return {"error": "Query is empty", "results": []}

    results = {"query": query, "k": k, "tfidf": [], "sbert": [], "google": []}

    # TF-IDF arama
    start_time = time.time()
    query_vec = vectorizer.transform([query]).toarray().astype('float32')
    distances, indices = index_tfidf.search(query_vec, k)
    results["tfidf"] = [
        {"rank": r+1, "index": int(idx), "distance": float(dist), "text": all_chunks_en[idx]}
        for r, (idx, dist) in enumerate(zip(indices[0], distances[0]))
    ]
    results["tfidf_time"] = time.time() - start_time

    # SBERT arama
    start_time = time.time()
    query_embedding = model_sbert.encode(query).reshape(1, -1).astype('float32')
    distances, indices = index_sbert.search(query_embedding, k)
    results["sbert"] = [
        {"rank": r+1, "index": int(idx), "distance": float(dist), "text": all_chunks_en[idx]}
        for r, (idx, dist) in enumerate(zip(indices[0], distances[0]))
    ]
    results["sbert_time"] = time.time() - start_time

    # Google Embedding arama
    start_time = time.time()
    query_vec = np.array(model_google.embed_query(query)).astype('float32').reshape(1, -1)
    distances, indices = index_google.search(query_vec, k)
    results["google"] = [
        {"rank": r+1, "index": int(idx), "distance": float(dist), "text": all_chunks_en[idx]}
        for r, (idx, dist) in enumerate(zip(indices[0], distances[0]))
    ]
    results["google_time"] = time.time() - start_time

    return results

# Root endpoint — query opsiyonel yapıldı
@app.get("/")
async def root(query: Optional[str] = None, k: int = 5):
    return search_with_models(query, k) if query else {"message": "Please provide a query parameter"}

