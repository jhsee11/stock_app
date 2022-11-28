from pymongo import MongoClient
import yahoo_fin.stock_info as si
import pandas as pd

# Making a Connection with MongoClient
client = MongoClient("mongodb://localhost:27017/")

# database
db = client["stocks_database"]
# collection
company_quote_table = db["Company_QuoteTable"]

# get all the stocks ticker, and need store in DB
dow_list = si.tickers_dow()
nasdaq_list = si.tickers_nasdaq()
sp500_list = si.tickers_sp500()

 # download with multiple tickers

dow_stats = {}
for ticker in dow_list:
    quote_table = si.get_quote_table(ticker)
    quote_table['ticker'] = ticker

    # insert data into table
    company_quote_table.insert_one(quote_table)



print('haha')