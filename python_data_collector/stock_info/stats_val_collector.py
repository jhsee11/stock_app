import yahoo_fin.stock_info as si
import pandas as pd
from stock_info_collector import StockInfoCollector

class StatsValCollector(StockInfoCollector):
    def __init__(self, stock_list):
        super().__init__(stock_list)
        #self.collection = self.db["Company_StatsVal"]
        self.collection = self.db["company_statsvals"]

    def collect_stats_valuation(self):
        #dow_stats = {}
        for ticker in self.stock_list:
            temp = si.get_stats_valuation(ticker)
            temp = temp.iloc[:, :2]
            temp = temp.T
            #temp.columns = ["Attribute", "Recent"]
            #temp.reset_index(inplace=True)
            # transposed["ticker"] = ticker
            temp.columns = temp.iloc[0]
            temp = temp[1:]

            temp.insert(loc=0, column='ticker', value=[ticker for _ in range(temp.shape[0])])
            #print(temp.dtypes)
            # using dictionary to convert specific columns
            convert_dict = {
                            'Trailing P/E' : float,
                            'Forward P/E' : float,
                            'PEG Ratio (5 yr expected)' : float,
                            'Price/Sales (ttm)' : float,
                            'Price/Book (mrq)' : float,
                            'Enterprise Value/Revenue' : float,
                            'Enterprise Value/EBITDA': float
                            }
            try:
                temp = temp.astype(convert_dict)
            except Exception as e:
                print('failed to convert due to this err :' + e)

            data_dict = temp.to_dict("records")

            self.collection.insert_many(data_dict)

    def retrieve_stats_val(self, ticker):
        # extract data from mongo db
        data_from_db = self.collection.find({"ticker": ticker})
        df = pd.DataFrame(data_from_db)
        return df

    def delete_stats_val(self, ticker=None):
        if (ticker):
            self.collection.delete_many({{"ticker": ticker}})
        else:
            # extract data from mongo db
            self.collection.drop()

#s = StatsValCollector(['AAPL'])
#s.collect_stats_valuation()