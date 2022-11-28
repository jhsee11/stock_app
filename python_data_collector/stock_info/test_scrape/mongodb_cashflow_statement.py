from pymongo import MongoClient
import yahoo_fin.stock_info as si
import pandas as pd

# Making a Connection with MongoClient
client = MongoClient("mongodb://localhost:27017/")

# database
db = client["stocks_database"]
# collection
company_cashflow_statement = db["Company_CashFlowStatement"]

# get all the stocks ticker, and need store in DB
dow_list = si.tickers_dow()
nasdaq_list = si.tickers_nasdaq()
sp500_list = si.tickers_sp500()

 # download with multiple tickers

dow_stats = {}
for ticker in dow_list:
    # get the income statement
    cashflow_statement = si.get_cash_flow(ticker)
    cashflow_statement = cashflow_statement.transpose()
    cashflow_statement.reset_index(inplace=True)
    #transposed["ticker"] = ticker
    cashflow_statement.insert(loc=0,column='ticker',value= [ticker for _ in range(cashflow_statement.shape[0])])
    data_dict = cashflow_statement.to_dict("records")

    # insert into mongodb
    company_cashflow_statement.insert_many(data_dict)

# extract data from mongo db
data_from_db = company_cashflow_statement.find({"ticker":"AAPL"})
df = pd.DataFrame(data_from_db)
# new_df = pd.DataFrame(list(data_from_db))

print('haha')