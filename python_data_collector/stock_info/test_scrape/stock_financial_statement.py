import yahoo_fin.stock_info as si
import pandas as pd

# get the income statement
income_statement = si.get_income_statement("aapl")
transposed = income_statement.transpose()

# get the balance sheet
balance_sheet = si.get_balance_sheet("aapl")

# get cashflow statement
cash_flow_statement = si.get_cash_flow("aapl", False)

print("wow")