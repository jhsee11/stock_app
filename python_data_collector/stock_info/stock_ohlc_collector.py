import yahoo_fin.stock_info as si
import pandas as pd
from stock_info_collector import StockInfoCollector

class StockOhlcCollector(StockInfoCollector):
    def __init__(self, stock_list):
        super().__init__(stock_list)
        self.collection = self.db["company_ohlcs"]

    def collect_ohlc(self):
        for ticker in self.stock_list:
            target_ohlc = si.get_data(ticker)
            target_ohlc.reset_index(inplace=True)
            data_dict = target_ohlc.to_dict("records")
            # insert collection
            self.collection.insert_many(data_dict)

    def retrieve_ohlc(self, ticker):
        # extract data from mongo db
        data_from_db = self.collection.find({"ticker": ticker})
        df = pd.DataFrame(data_from_db)
        return df

    def delete_ohlc(self, ticker=None):
        if (ticker):
            self.collection.delete_many({{"ticker": ticker}})
        else:
            # extract data from mongo db
            self.collection.drop()