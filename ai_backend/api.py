from fastapi import FastAPI,Body,HTTPException,Depends,Header
from g4f.client import Client
from fastapi.concurrency import run_in_threadpool
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

def get_ai_response(group_type, budget_in_rupees, no_of_people, location, no_of_days):
    prompt = f'''You are a holiday planner assistant.
    Generate a detailed holiday plan for a {group_type} trip for {no_of_people} people in {location}, lasting {no_of_days} days, with a budget of {budget_in_rupees} rupees.

    Respond ONLY in the following JSON format. 
    The example below is ONLY for structure. Do NOT copy the example values. 
    Fill in all fields with realistic, creative, and context-specific data based on the input.

    {{
      "location": {location},
      "group_type": the group type input by the user,
      "no_of_people": {no_of_people},
      "no_of_days": {no_of_days},
      "total_budget": 12345,  // integer, total estimated budget in rupees
      "currency": "₹"//string should be actual currency of the locations country,
      "days": [
        {{
          "day": 1,
          "title": "A creative title for the day's main activity (e.g., 'Exploring Downtown and Local Cuisine')",
          "schedule": [
            {{"time": "09:00", "activity": "A specific morning activity relevant to the location and group type", "location": "Specific location name (optional)"}},
            {{"time": "11:00", "activity": "A specific late morning activity", "location": "Specific location name (optional)"}},
            {{"time": "13:00", "activity": "A specific afternoon activity", "location": "Specific location name (optional)"}},
            {{"time": "19:00", "activity": "A specific evening activity", "location": "Specific location name (optional)"}}
          ],
          "notes": "Helpful notes or tips for this day",
          "highlight": true,  // boolean, whether this day contains a highlight activity
          "image_suggestion": "beach_sunrise"  // optional, keyword suggestion for day image
        }}
        // ...repeat for each day
      ],
      "suggested_hotels": [
        {{
          "name": "Hotel name 1",
          "rating": 4.5,  // float, 1-5 star rating
          "price_range": "₹₹₹",  // string, ₹ to ₹₹₹₹₹ representing affordability
          "features": ["Free WiFi", "Swimming Pool", "etc"]  // array of key features
        }},
        {{
          "name": "Hotel name 2",
          "rating": 4.2,
          "price_range": "₹₹",
          "features": ["Free WiFi", "Breakfast included", "etc"]
        }}
      ],
      "suggested_restaurants": [
        {{
          "name": "Restaurant name 1",
          "cuisine": "Local cuisine type",
          "price_range": "₹₹",  // string, ₹ to ₹₹₹₹₹ representing affordability
          "must_try_dishes": ["Dish 1", "Dish 2"]  // array of recommended dishes
        }},
        {{
          "name": "Restaurant name 2",
          "cuisine": "Another cuisine type",
          "price_range": "₹₹₹",
          "must_try_dishes": ["Dish 3", "Dish 4"]
        }}
      ],
      "packing_suggestions": ["Item 1", "Item 2", "Item 3"],  // array of items to pack
      "travel_tips": ["Tip 1", "Tip 2", "Tip 3"],  // array of travel tips for this location
      "local_customs": ["Custom 1", "Custom 2"],  // array of local customs to be aware of
      "emergency_contacts": {{
        "police": "100",
        "ambulance": "108",
        "tourist_helpline": "+91-1234567890"
      }},
      "weather_forecast": {{
        "average_temp": "28°C",
        "conditions": "Mostly sunny with occasional showers",
        "best_time_to_visit": "October to March"
      }}
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
    response=await run_in_threadpool(get_ai_response,group_type,budget_in_rupees,no_of_people,location,no_of_days)
    return response