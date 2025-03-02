from fastapi import FastAPI
from pydantic import BaseModel
from annotated_types import Annotated, MaxLen, MinLen
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from currencies import get_lastest, get_available_currencies

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Currencies(BaseModel):
    first_currency: Annotated[str, MinLen(1)]
    second_currency: Annotated[str, MinLen(1)]


@app.post('/currency/lastest')
async def get_latest_currency(currencies: Currencies):
    result = get_lastest(base_currency=currencies.first_currency, currencies=[currencies.second_currency])
    return result

@app.get('/currency/all')
async def get_all_currency():
    result = get_available_currencies()
    print(result)
    return {'codes': result}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)