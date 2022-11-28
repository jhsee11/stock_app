from pymongo import MongoClient
import yahoo_fin.stock_info as si
import pandas as pd

# Making a Connection with MongoClient
client = MongoClient("mongodb://localhost:27017/")

# database
db = client["stocks_database"]
# collection
company_balance_sheet = db["Company_BalanceSheet"]

# get all the stocks ticker, and need store in DB
dow_list = si.tickers_dow()
nasdaq_list = si.tickers_nasdaq()
sp500_list = si.tickers_sp500()

 # download with multiple tickers

dow_stats = {}
for ticker in dow_list:
    # get the income statement
    balance_sheet = si.get_balance_sheet(ticker)
    balance_sheet = balance_sheet.transpose()
    balance_sheet.reset_index(inplace=True)
    #transposed["ticker"] = ticker
    balance_sheet.insert(loc=0,column='ticker',value= [ticker for _ in range(balance_sheet.shape[0])])
    data_dict = balance_sheet.to_dict("records")

    company_balance_sheet.insert_many(data_dict)

# extract data from mongo db
data_from_db = company_balance_sheet.find({"ticker":"AAPL"})
df = pd.DataFrame(data_from_db)
# new_df = pd.DataFrame(list(data_from_db))

print('haha')