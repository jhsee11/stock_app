from pymongo import MongoClient
import yahoo_fin.stock_info as si
import pandas as pd

# Making a Connection with MongoClient
client = MongoClient("mongodb://localhost:27017/")

# database
db = client["stocks_database"]
# collection
company_stats_val= db["Company_StatsValuation"]

# get all the stocks ticker, and need store in DB
dow_list = si.tickers_dow()
nasdaq_list = si.tickers_nasdaq()
sp500_list = si.tickers_sp500()

 # download with multiple tickers

dow_stats = {}
for ticker in dow_list:
    temp = si.get_stats_valuation(ticker)
    temp = temp.iloc[:, :2]
    temp.columns = ["Attribute", "Recent"]
    dow_stats[ticker] = temp

combined_stats = pd.concat(dow_stats)
combined_stats = combined_stats.reset_index()

del combined_stats["level_1"]
# update column names
combined_stats.columns = ["Ticker", "Attribute", "Recent"]

data_dict = combined_stats.to_dict("records")

# insert collection
company_stats_val.insert_many(data_dict)



# extract data from mongo db
data_from_db = company_stats_val.find({"ticker":"AAPL"})
df = pd.DataFrame(data_from_db)
# new_df = pd.DataFrame(list(data_from_db))

print('haha')