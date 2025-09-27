import gradio as gr
import requests

API_URL = "http://127.0.0.1:8000"  # main.py çalışırken

def query_models(text: str, k: int):
    if not text:
        return ["Lütfen bir sorgu girin"]*3

    response = requests.get(API_URL, params={"query": text, "k": k})
    data = response.json()

    def format_results(model_key, metric_name):
        results = data.get(model_key, [])
        return "\n\n".join([f"{r['rank']}. [{metric_name}: {r['distance']:.4f}] {r['text']}" for r in results])

    tfidf_results = format_results("tfidf", "L2 Distance")
    sbert_results = format_results("sbert", "L2 Distance")
    google_results = format_results("google", "L2 Distance")

    return tfidf_results, sbert_results, google_results

with gr.Blocks() as demo:
    gr.Markdown("## Multimodal Search with TF-IDF, SBERT & Google Embeddings (with metrics)")
    
    with gr.Row():
        with gr.Column():
            text_input = gr.Textbox(label="Query Text", placeholder="Search something...")
            k_input = gr.Number(label="Top K results", value=5, precision=0)
            submit_btn = gr.Button("Search")
        
        with gr.Column():
            tfidf_output = gr.Textbox(label="TF-IDF Results", interactive=False, lines=20)
            sbert_output = gr.Textbox(label="SBERT Results", interactive=False, lines=20)
            google_output = gr.Textbox(label="Google Embedding Results", interactive=False, lines=20)
    
    submit_btn.click(fn=query_models, inputs=[text_input, k_input], outputs=[tfidf_output, sbert_output, google_output])

if __name__ == "__main__":
    demo.launch()
