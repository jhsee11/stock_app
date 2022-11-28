from pymongo import MongoClient
import yahoo_fin.stock_info as si
import pandas as pd
import datetime

# Making a Connection with MongoClient
client = MongoClient("mongodb://localhost:27017/")

# database
db = client["stocks_database"]
# collection
company_income_statement = db["Company_IncomeStatement"]

# get all the stocks ticker, and need store in DB
dow_list = si.tickers_dow()
nasdaq_list = si.tickers_nasdaq()
sp500_list = si.tickers_sp500()

 # download with multiple tickers

dow_stats = {}
for ticker in dow_list:
    # get the income statement
    income_statement = si.get_income_statement(ticker)
    transposed = income_statement.transpose()
    transposed.reset_index(inplace=True)
    #transposed["ticker"] = ticker
    transposed.insert(loc=0,column='ticker',value= [ticker for _ in range(transposed.shape[0])])
    data_dict = transposed.to_dict("records")

    #company_income_statement.insert_many(data_dict)


# extract data from mongo db
data_from_db = company_income_statement.find({"ticker":"AAPL"})
df = pd.DataFrame(data_from_db)
# new_df = pd.DataFrame(list(data_from_db))

#  need to query the last date, and use the last date + 1 to get the api data
gogo = company_income_statement.find().sort("endDate", -1).limit(1)
df = pd.DataFrame(gogo)

endDate = df['endDate'][0].to_pydatetime()
print(type(endDate))
start_date =  endDate + datetime.timedelta(days = 1)
print('haha')

# from datetime import datetime
# start = datetime(2015, 12, 20, 7, 51, 04)
# end = datetime(2015, 12, 21, 7, 52, 04)
# col.find_one({'date': {'$lt': end, '$gt': start}})