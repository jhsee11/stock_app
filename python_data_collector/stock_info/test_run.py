import stock_info_collector
from stock_ohlc_collector import StockOhlcCollector
from stats_val_collector import StatsValCollector
from quote_table_collector import QuoteTableCollector
from stock_ohlc_collector import StockInfoCollector
import yahoo_fin.stock_info as si
from datetime import datetime

print(si.tickers_sp500())
snp500 = si.tickers_sp500()


# dd/mm/YY H:M:S
dt_string = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
print("Start time =", dt_string)
s = StockOhlcCollector(snp500)
s.delete_ohlc()

