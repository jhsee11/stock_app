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
print('Finish Delete OHLC...')
print('Collecting OHLC...')
s.collect_ohlc()
print('Finish Collect OHLC...')

print('Collecting Stats...')
dt_string = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
print("Start time =", dt_string)
s = StatsValCollector(snp500)
s.delete_stats_val()
s.collect_stats_valuation()

print('Collecting Quotes...')
dt_string = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
print("Start time =", dt_string)
s = QuoteTableCollector(snp500)
s.delete_quote_table()
s.collect_quote_table()

s = StockInfoCollector(snp500)
print('Collecting CashFlow Statements...')
dt_string = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
print("Start time =", dt_string)
s.delete_cashflow_statement()
s.collect_cashflow_statement()

print('Collecting Income Statements...')
dt_string = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
print("Start time =", dt_string)
s.delete_income_statement()
s.collect_income_statement()

print('Collecting Balance Sheets...')
dt_string = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
print("Start time =", dt_string)
s.delete_balance_sheet()
s.collect_balance_sheet()
