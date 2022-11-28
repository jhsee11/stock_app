import yahoo_fin.stock_info as si

# get all the stocks ticker, and need store in DB
dow_list = si.tickers_dow()
nasdaq_list = si.tickers_nasdaq()
sp500_list = si.tickers_sp500()

# download with multiple tickers
ticker_list = ["amzn", "aapl", "ba"]
historical_datas = {}
for ticker in ticker_list:
    historical_datas[ticker] = si.get_data(ticker)

print(historical_datas["aapl"])
print("haha")
