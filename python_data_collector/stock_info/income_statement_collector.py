import yahoo_fin.stock_info as si
import pandas as pd
from stock_info_collector import StockInfoCollector

class IncomeStatementCollector(StockInfoCollector):
    def __init__(self, stock_list):
        super().__init__(stock_list)
        self.collection = self.db["Company_IncomeStatement"]

    def collect_income_statement(self):
        for ticker in self.stock_list:
            try:
                # get the income statement
                income_statement = si.get_income_statement(ticker)
                transposed = income_statement.transpose()
                transposed.reset_index(inplace=True)
                # transposed["ticker"] = ticker
                transposed.insert(loc=0, column='ticker', value=[ticker for _ in range(transposed.shape[0])])
                data_dict = transposed.to_dict("records")
                self.collection.insert_many(data_dict)
            except Exception as e:
                print(f'failed to get income statement due to  {e}')
                continue


    def retrieve_income_statement(self, ticker):
        # extract data from mongo db
        data_from_db = self.collection.find({"ticker": ticker})
        df = pd.DataFrame(data_from_db)
        return df

s = IncomeStatementCollector(['AAPL'])
s.collect_income_statement()

s.retrieve_income_statement('AAPL')