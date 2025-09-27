import modal
from pydantic import BaseModel

app = modal.App("qwen25_pipeline_demo")

image = (
    modal.Image.debian_slim()
    .pip_install(
        "transformers==4.43.3",
        "torch",
        "accelerate",
        "fastapi",
        "uvicorn"
    )
)

@app.cls(image=image, gpu=None)
class QwenService:
    def __enter__(self):
        from transformers import pipeline, AutoTokenizer
        
        model_name = "Qwen/Qwen2.5-0.5B-Instruct"
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        
        self.pipe = pipeline(
            "text-generation",
            model=model_name,
            tokenizer=self.tokenizer,
            device_map="auto"
        )
        print("✅ Model ve Tokenizer yüklendi.")

    @modal.method()
    def infer(self, messages: list):
        try:
            prompt = self.tokenizer.apply_chat_template(
                messages, 
                tokenize=False, 
                add_generation_prompt=True
            )
            
            outputs = self.pipe(prompt, max_new_tokens=256)
            generated_text = outputs[0]["generated_text"]
            response_only = generated_text[len(prompt):].strip()
            
            return response_only
        except Exception as e:
            return f"Error: {str(e)}"


class ApiRequest(BaseModel):
    messages: list


@app.function(image=image, gpu=None)
@modal.asgi_app()
def fastapi_app():
    from fastapi import FastAPI, HTTPException
    web_app = FastAPI()
    
    svc = QwenService()
    
    @web_app.post("/")
    async def root(request: ApiRequest):
        try:
            result = svc.infer.local(request.messages)
            return {"response": result}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    return web_app
    
