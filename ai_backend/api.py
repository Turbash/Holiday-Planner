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

async def get_ai_response(group_type, budget_in_rupees, no_of_people, location, no_of_days):
    prompt = f'''You are a holiday planner assistant.
    Generate a detailed holiday plan for a {group_type} trip for {no_of_people} people in {location}, lasting {no_of_days} days, with a budget of {budget_in_rupees} rupees.
    
    Respond ONLY in the following JSON format. 
    The example below is ONLY for structure. Do NOT copy the example values. 
    Fill in all fields with realistic, creative, and context-specific data based on the input.
    
    {{
      "days": [
        {{
          "day": 1,
          "title": "A creative title for the day's main activity (e.g., 'Exploring Downtown and Local Cuisine')",
          "schedule": [
            {{"time": "09:00", "activity": "A specific morning activity relevant to the location and group type"}},
            {{"time": "11:00", "activity": "A specific late morning activity"}},
            {{"time": "13:00", "activity": "A specific afternoon activity"}},
            {{"time": "19:00", "activity": "A specific evening activity"}}
          ],
          "notes": "Helpful notes or tips for this day"
        }}
        // ...repeat for each day
      ],
      "total_budget": 12345,  // integer, total estimated budget in rupees
      "suggested_hotels": ["Hotel name 1", "Hotel name 2"],  // array of strings
      "suggested_restaurants": ["Restaurant name 1", "Restaurant name 2"]  // array of strings
    }}
    
    All fields must be present. Times must be in 24-hour format ("HH:MM"). The response must be valid JSON. Do not include any text outside the JSON. Do NOT copy the example values—generate new, relevant content for each field based on the input. If you do not follow the format or copy the example values, your response will be rejected.
    '''
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