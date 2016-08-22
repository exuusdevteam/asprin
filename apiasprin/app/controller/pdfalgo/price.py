class Pdfprice:
    def __init__(self, sum):
        self.sum = sum

    def price(self):
        sum = self.sum
        if sum >= 3:
            total = 500
        elif sum >= 2:
            total = sum * 500 / 3
        elif sum >= 1:
            total = sum * 500 / 3
        elif sum >= 0.1:
            total = sum * 400
        elif sum >= 0.01:
            total = sum * 300
        elif sum >= 0.001:
            total = sum * 2000
        elif sum >= 0.0001:
            total = sum * 20000
        else:
            total = 5
        return total


