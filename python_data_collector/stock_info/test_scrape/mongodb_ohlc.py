from pymongo import MongoClient
import yahoo_fin.stock_info as si
import pandas as pd

# Making a Connection with MongoClient
client = MongoClient("mongodb://localhost:27017/")

# database
db = client["stocks_database"]
# collection
company_ohlc= db["Company_OHLC"]

# get all the stocks ticker, and need store in DB
dow_list = si.tickers_dow()
nasdaq_list = si.tickers_nasdaq()
sp500_list = si.tickers_sp500()

 # download with multiple tickers
# ticker_list = ["amzn", "aapl", "ba"]
historical_datas = {}
for ticker in dow_list:
    historical_datas[ticker] = si.get_data(ticker)
    historical_datas[ticker].reset_index(inplace=True)
    data_dict = historical_datas[ticker].to_dict("records")
    # insert collection
    company_ohlc.insert_many(data_dict)

# extract data from mongo db

data_from_db = company_ohlc.find({"ticker":"AAPL"})
df = pd.DataFrame(data_from_db)
# new_df = pd.DataFrame(list(data_from_db))

print('haha')