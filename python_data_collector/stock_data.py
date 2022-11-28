from yahoo_fin.stock_info import get_data
import yahoo_fin.stock_info as si
import pandas as pd

# need to get all stocks ticker
# configure the start date and end date
# interval {"1d","1wk","1mo"}

amazon_weekly= get_data("amzn", start_date="12/04/2009", end_date="12/04/2019", index_as_date = True, interval="1wk")
print(amazon_weekly.shape)

# downlaod with multiple tickers
ticker_list = ["amzn", "aapl", "ba"]
historical_datas = {}
for ticker in ticker_list:
    historical_datas[ticker] = get_data(ticker)

dow_list=si.tickers_dow()
nasdaq_list=si.tickers_nasdaq()
sp500_list=si.tickers_sp500()

print("haha")

# get fundamental data

quote_table = si.get_quote_table("aapl",dict_result=False)
stats_valuation = si.get_stats_valuation("aapl")
mod_stats_valuation = stats_valuation.iloc[:, :2]
print("leggo")

dow_stats = {}
for ticker in dow_list:
    temp = si.get_stats_valuation(ticker)
    temp = temp.iloc[:,:2]
    temp.columns = ["Attribute", "Recent"]
    dow_stats[ticker] = temp

combined_stats = pd.concat(dow_stats)
combined_stats = combined_stats.reset_index()

del combined_stats["level_1"]
# update column names
combined_stats.columns = ["Ticker", "Attribute", "Recent"]

pe_ratios = combined_stats[combined_stats["Attribute"]=="Trailing P/E"].reset_index()

# get the income statement
income_statement = si.get_income_statement("aapl")
transposed = income_statement.transpose()

# get the balance sheet
balance_sheet = si.get_balance_sheet("aapl")

# get cashflow statement
cash_flow_statement = si.get_cash_flow("aapl",False)


print("wow")             