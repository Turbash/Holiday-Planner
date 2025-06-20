from fastapi import FastAPI,Body
from g4f.client import Client
from enum import Enum
from typing import Annotated

class GroupType(str,Enum):
    friends="friends"
    couple="couple"
    family="family"
    solo="solo"

app=FastAPI()
client = Client()


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



@app.post("/")
async def root(group_type:Annotated[GroupType,Body()],budget_in_rupees:Annotated[int,Body()],no_of_people:Annotated[int,Body()],location:Annotated[str,Body(max_length=30,min_length=3)],no_of_days:Annotated[int,Body()]):
    response=await get_ai_response(group_type,budget_in_rupees,no_of_people,location,no_of_days)
    return response