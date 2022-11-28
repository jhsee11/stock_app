import yahoo_fin.stock_info as si
import pandas as pd

# sample : get fundamental data
quote_table = si.get_quote_table("aapl", dict_result=False)
stats_valuation = si.get_stats_valuation("aapl")
#mod_stats_valuation = stats_valuation.iloc[:, :2]

dow_list = si.tickers_dow()

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

pe_ratios = combined_stats[combined_stats["Attribute"] == "Trailing P/E"].reset_index()

print("leggo")