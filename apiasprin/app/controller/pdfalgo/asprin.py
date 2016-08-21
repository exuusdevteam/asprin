from PIL import Image
from collections import defaultdict
from price import Pdfprice

class Asprin:
    def __init__(self, img):
        self.img = img

    def tonnerPrice(self):
        im = Image.open(self.img)
        width, height = im.size
        width = int(width / 30)
        height = int(height / 30)
        toner_price = 60.00

        cmyk = [0, 0, 0, 0]

        im = im.resize((width, height))
        by_color = defaultdict(int)
        for pixel in im.getdata():
            by_color[pixel] += 1.

        sum = 0
        for data in by_color:
            try:
                if len(data) == 3:
                    r, g, b = data
                else:
                    r, g, b, a = data

            except TypeError:
                r, g, b = 0, 0, 0

            cmyk_scale = 100
            if (r == 0) and (g == 0) and (b == 0):
                # black

                continue

                # rgb [0,255] -> cmy [0,1]
            c = 1 - r / 255.
            m = 1 - g / 255.
            y = 1 - b / 255.

            # extract out k [0,1]
            min_cmy = min(c, m, y)
            c = (c - min_cmy) / (1 - min_cmy)
            m = (m - min_cmy) / (1 - min_cmy)
            y = (y - min_cmy) / (1 - min_cmy)
            k = min_cmy



            # Toner Price per Pixels

            k_toner = toner_price / (27.00 * width * height)
            c_toner = toner_price / (25.00 * width * height)
            m_toner = toner_price / (25.00 * width * height)
            y_toner = toner_price / (25.00 * width * height)

            # Calculate Tonner Value

            cmyk[0] += c * c_toner
            cmyk[1] += m * m_toner
            cmyk[2] += y * y_toner
            cmyk[3] += k * k_toner

            # CMYK is in purcentage CMYK_value * assigned_tonner / 100

            sum = sum + ((c * c_toner) + (m * m_toner) + (y * y_toner) + (k * k_toner)) * by_color[data]

        return sum, Pdfprice(sum).price(), cmyk

