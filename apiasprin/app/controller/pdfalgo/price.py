import os
import time


class Pdfprice:
    def __init__(self, sum):
        self.sum = sum

    def price(self):
        sum = self.sum
        if sum >= 6:
            total = 190
        elif sum >= 5:
            total = sum * 190 / 6
        elif sum >= 4:
            total = sum * 190 / 6
        elif sum >= 3:
            total = sum * 190 / 6
        elif sum >= 2:
            total = sum * 190 / 6
        elif sum >= 1:
            total = sum * 190 / 6
        elif sum >= 0.1:
            total = sum * 150
        elif sum >= 0.01:
            total = sum * 100
        elif sum >= 0.001:
            total = sum * 2000
        elif sum >= 0.0001:
            total = sum * 20000
        else:
            total = 5
        return total


