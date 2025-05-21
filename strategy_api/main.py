from fastapi import FastAPI, HTTPException
import uvicorn
import logging
from datetime import datetime
import csv
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel
from datetime import date
from strategy.standardDeviation import standardDeviation
from strategy.coVariance import coVariance
from trader.alertTrader import alertTrader
from fastapi.middleware.cors import CORSMiddleware

dateCurrent = datetime.now().strftime("%Y_%m_%d")
logging.basicConfig(filename="./logs/"+str(dateCurrent)+"_strategyAPI.log", level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI()

class sdRequest(BaseModel):
    sector: str
    symbol: str
    openSd: float
    closeSd: float
    is_buy: bool

class cvRequest(BaseModel):
    symbol1: str
    symbol2: str
    start_date: date
    end_date: date

class arRequest(BaseModel):
    sector: str
    email: str

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_crypto_list():
    try:
        with open("./results/tokens.csv", mode="r") as file:
            reader = csv.reader(file)
            next(reader, None) 
            return {row[1]: int(row[2].replace("x", "")) for row in reader if len(row) > 2}
    except Exception as e:
        logger.error(f"Error reading crypto list: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve crypto list.")

def get_symbols_from_file(filepath: str, col_index: int):
    try:
        with open(filepath, mode="r") as file:
            lines = file.readlines()
            return {line.split()[col_index]: 1 for line in lines if len(line.split()) > col_index}
    except Exception as e:
        logger.error(f"Error reading symbols from {filepath}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve symbols from {filepath}.")
    
@app.get("/symbols/{sector}")
async def get_symbols(sector: str):
    try:
        if (sector.lower() == "crypto"):
            return await run_in_threadpool(get_crypto_list)
        elif (sector.lower() == "tsx"):
            return await run_in_threadpool(get_symbols_from_file, "./results/tsx.txt", 1)
        elif (sector.lower() == "sp500"):
            return await run_in_threadpool(get_symbols_from_file, "./results/sp500.txt", 1)
        else:
            return {"error": "Invalid sector. Choose from 'crypto', 'tsx', or 'sp500'."}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Unhandled error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve symbols.")

@app.post("/standardDeviation")
async def executeSD(request: sdRequest):
    try:
        strategy = standardDeviation(logger, request.sector, request.symbol)
        open_order_signal = await run_in_threadpool(strategy.next, request.sector, request.symbol, request.openSd)
        close_order_signal = await run_in_threadpool(strategy.closeSignal, request.sector, request.symbol, request.is_buy, request.closeSd)
        result = {"Open Order Signal": open_order_signal, "Close Open Signal": close_order_signal}
        return result
    except Exception as e:
        logger.error(f"Error executing strategy SD: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to execute strategy SD.")
    
@app.post("/coVariance")
async def executeCV(request: cvRequest):
    try:
        strategy = coVariance(logger)
        covariance = await run_in_threadpool(strategy.calculate_covariance, request.symbol1, request.symbol2, request.start_date, request.end_date)
        result = {"Symbol1": request.symbol1, "Symbol2": request.symbol2, "CoVariance": covariance}
        return result
    except Exception as e:
        logger.error(f"Error executing strategy CV: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to execute strategy CV.")

@app.post("/averageRebalance")
async def executeAR(request: arRequest):
    try:
        symbols = []
        if (request.sector.lower() == "crypto"):
            symbols = await run_in_threadpool(get_crypto_list)
            symbols = list(symbols.keys())
        elif (request.sector.lower() == "tsx"):
            symbols = await run_in_threadpool(get_symbols_from_file, "./results/tsx.txt", 1)
        elif (request.sector.lower() == "sp500"):
            symbols = await run_in_threadpool(get_symbols_from_file, "./results/sp500.txt", 1)
        else:
            return {"error": "Invalid sector. Choose from 'crypto', 'tsx', or 'sp500'."}

        alert = alertTrader(symbols)
        await run_in_threadpool(alert.runAverageRebalanceAlert, request.sector, request.email)

        result = "Email with results will be sent to: "+str(request.email)
        return result
    except Exception as e:
        logger.error(f"Error executing strategy AR: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to execute strategy AR.")
    
@app.post("/momentum")
async def executeM(request: arRequest):
    try:
        symbols = []
        if (request.sector.lower() == "crypto"):
            symbols = await run_in_threadpool(get_crypto_list)
            symbols = list(symbols.keys())
        elif (request.sector.lower() == "tsx"):
            symbols = await run_in_threadpool(get_symbols_from_file, "./results/tsx.txt", 1)
        elif (request.sector.lower() == "sp500"):
            symbols = await run_in_threadpool(get_symbols_from_file, "./results/sp500.txt", 1)
        else:
            return {"error": "Invalid sector. Choose from 'crypto', 'tsx', or 'sp500'."}

        alert = alertTrader(symbols)
        await run_in_threadpool(alert.runMomentumAlert, request.sector, request.email)

        result = "Email with results will be sent to: "+str(request.email)
        return result
    except Exception as e:
        logger.error(f"Error executing strategy M: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to execute strategy M.")

if __name__ == '__main__':
    uvicorn.run('main:app', host='0.0.0.0', port=8000)

