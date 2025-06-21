from fastapi import FastAPI,Body,HTTPException,Depends,Header
from g4f.client import Client
from enum import Enum
from typing import Annotated
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

class GroupType(str,Enum):
    friends="friends"
    couple="couple"
    family="family"
    solo="solo"

app=FastAPI()
client = Client()
load_dotenv()

API_KEY=os.environ.get("API_KEY")

def verify_api_key(api_key:str=Header(...)):
    if api_key!=API_KEY:
        raise HTTPException(status_code=401,detail="Unauthorized")

async def get_ai_response(group_type,budget_in_rupees,no_of_people,location,no_of_days):
    prompt=f"Generate a holiday plan for a {group_type} trip including activities, meals, and relaxation time. The trip should last for {no_of_days} days.Their budget is rupees {budget_in_rupees}.They currently reside in {location}"
    if group_type not in ["couple","solo"]: 
        prompt+=f"The number of people in their group is {no_of_people}."
    response = client.chat.completions.create(
    model="gpt-4o",
   
    messages=[
        {
            "role": "user",
            "content": prompt
        }
    ]

    )
    return response.choices[0].message.content

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/")
async def root(group_type:Annotated[GroupType,Body()],budget_in_rupees:Annotated[int,Body()],no_of_people:Annotated[int,Body()],location:Annotated[str,Body(max_length=40,min_length=3)],no_of_days:Annotated[int,Body()],api_key:str=Depends(verify_api_key)):
    response=await get_ai_response(group_type,budget_in_rupees,no_of_people,location,no_of_days)
    return response