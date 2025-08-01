from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI
import pandas as pd
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse                                                                                
import io  

app = FastAPI()

import warnings
warnings.filterwarnings("ignore")

from dotenv import load_dotenv  
load_dotenv()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_llm(text, row):
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",  
        temperature=0.2,
        convert_system_message_to_human=True  
    )
    prompt_template = PromptTemplate(
            input_variables=["text", "row"],
            template_format="jinja2",
            template="""
                Examples 1:

                Subject: Create a dataset about cars
                Row: 10
                Data:
                [
                {
                    "brand": "Toyota",
                    "model": "Corolla",
                    "year": 2022,
                    "color": "Silver",
                    "price": 25000,
                    "fuel_type": "Hybrid"
                },
                {
                    "brand": "Ford",
                    "model": "Mustang",
                    "year": 2021,
                    "color": "Red",
                    "price": 42000,
                    "fuel_type": "Gasoline"
                },
                {
                    "brand": "Tesla",
                    "model": "Model 3",
                    "year": 2023,
                    "color": "White",
                    "price": 45000,
                    "fuel_type": "Electric"
                },
                {
                    "brand": "Honda",
                    "model": "Civic",
                    "year": 2020,
                    "color": "Blue",
                    "price": 22000,
                    "fuel_type": "Gasoline"
                },
                {
                    "brand": "BMW",
                    "model": "X5",
                    "year": 2022,
                    "color": "Black",
                    "price": 65000,
                    "fuel_type": "Diesel"
                },
                {
                    "brand": "Mercedes",
                    "model": "C-Class",
                    "year": 2021,
                    "color": "Gray",
                    "price": 48000,
                    "fuel_type": "Gasoline"
                },
                {
                    "brand": "Audi",
                    "model": "A4",
                    "year": 2020,
                    "color": "Green",
                    "price": 38000,
                    "fuel_type": "Diesel"
                },
                {
                    "brand": "Volkswagen",
                    "model": "Golf",
                    "year": 2019,
                    "color": "Yellow",
                    "price": 20000,
                    "fuel_type": "Gasoline"
                },
                {
                    "brand": "Hyundai",
                    "model": "Tucson",
                    "year": 2022,
                    "color": "Orange",
                    "price": 28000,
                    "fuel_type": "Hybrid"
                },
                {
                    "brand": "Kia",
                    "model": "Sportage",
                    "year": 2021,
                    "color": "Brown",
                    "price": 26000,
                    "fuel_type": "Gasoline"
                }
                ]

                Example 2:

                Subject: Generate synthetic data for worker.
                Row: 5
                Data:
                [
                {
                    "name": "John Doe",
                    "age": 32,
                    "position": "Software Engineer",
                    "salary": 75000,
                    "department": "IT"
                },
                {
                    "name": "Jane Smith",
                    "age": 28,
                    "position": "Marketing Specialist",
                    "salary": 60000,
                    "department": "Marketing"
                },
                {
                    "name": "Michael Brown",
                    "age": 45,
                    "position": "Project Manager",
                    "salary": 90000,
                    "department": "Operations"
                },
                {
                    "name": "Emily Davis",
                    "age": 35,
                    "position": "HR Manager",
                    "salary": 65000,
                    "department": "Human Resources"
                },
                {
                    "name": "David Wilson",
                    "age": 40,
                    "position": "Sales Director",
                    "salary": 85000,
                    "department": "Sales"
                }
                ]

                You are a synthetic data generation tool. Generate synthetic data related to the provided 'subject'. The output must contain exactly {{row}} items. The output must be in JSON format.
                All fields in the JSON objects must be logically relevant to the given subject.
                All values must be realistic.
                Avoid duplications across rows.
                If you cannot generate the data, provide a 'Data could not be generated' message.

                Subject: {{text}}
                Row: {{row}}
                Data:
                """
            )
    parser = JsonOutputParser()

    chain = prompt_template | llm | parser

    try:
        result = chain.invoke({"text": text, "row": row})
        print("Generated JSON Data:")
        print(result)

        dataset = pd.DataFrame(result)
        return result, dataset

    except Exception as e:
        print(f"Error: {e}")


@app.post("/")
async def create_dataset(request: Request):
    data = await request.json()
    text = data.get("text")
    row = data.get("row")
    json_data, dataset = get_llm(text, row)

    if dataset is not None and not dataset.empty:                                                                
        output = io.StringIO()                                                                               
        dataset.to_csv(output, index=False)
        csv_string = output.getvalue()     

        return JSONResponse(content={"jsonData": json_data, "csvData": csv_string})                                   
    else:                                                                                                                
         return JSONResponse(content={"error": "Data could not be generated"}, status_code=500) 


