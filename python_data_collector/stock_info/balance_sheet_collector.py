import yahoo_fin.stock_info as si
import pandas as pd
from stock_info_collector import StockInfoCollector

class BalanceSheetCollector(StockInfoCollector):
    def __init__(self, stock_list):
        super.__init__(stock_list)
        self.collection = self.db["Company_BalanceSheet"]

    def collect_balance_sheet(self):
        for ticker in self.stock_list:
            try:
                # get the balance sheet
                balance_sheet = si.get_balance_sheet(ticker)
                balance_sheet = balance_sheet.transpose()
                balance_sheet.reset_index(inplace=True)
                # transposed["ticker"] = ticker
                balance_sheet.insert(loc=0, column='ticker', value=[ticker for _ in range(balance_sheet.shape[0])])
                data_dict = balance_sheet.to_dict("records")
                self.collection .insert_many(data_dict)
            except Exception as e:
                print(f'failed to get balance sheet statement due to {e}')
                continue

    def retrieve_balance_sheet(self, ticker):
        # extract data from mongo db
        data_from_db = self.collection.find({"ticker": ticker})
        df = pd.DataFrame(data_from_db)
        return df
