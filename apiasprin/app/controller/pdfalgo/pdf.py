from pyPdf import PdfFileReader
from wand.image import Image
from asprin import Asprin
import os
import time
import locale

locale.setlocale(locale.LC_ALL, 'en_US')

class Pdfalgo:

    def __init__(self, pdffile, filename, re_filename):
        self.pdffile = pdffile
        self.filename = filename
        self.re_filename = re_filename

    def loadPdf(self):
        start_time = time.time()
        pdf = PdfFileReader(open(self.pdffile, 'rb'))
        page_number = pdf.getNumPages()
        filesize = os.path.getsize(self.pdffile)
        filepath = os.path.abspath(self.pdffile)

        sumPdf = 0.0
        sumTonner = 0.0
        cPdf = 0
        mPdf = 0
        yPdf = 0
        kPdf = 0

        uniqtmp = "app/controller/pdfalgo/pdf/temp/"+self.re_filename+".jpg"

        tmp = os.path.abspath(uniqtmp)
        for page in range(0, page_number):
            imageFile = self.pdffile + "[" + str(page) + "]"
            with Image(filename = imageFile) as img:
                img.save(filename=tmp)

            # Asprin Class
            asprin = Asprin(tmp)

            sum_t, sum, cmyk = asprin.tonnerPrice()

            # PDF summation price
            sumPdf += sum
            sumTonner += sum_t
            c,m,y,k = cmyk

            # CMYK Summation Price
            cPdf += c
            mPdf += m
            yPdf += y
            kPdf += k

        data = {
            'page':page_number,
            'size': filesize,
            'filename':self.filename,
            'path': self.re_filename,
            'sumtonner':round(sumTonner,3),
            'sumPDF':round(sumPdf,0),
            'cyan':round(cPdf,3),
            'magenta':round(mPdf,3),
            'yellow':round(yPdf,3),
            'black':round(kPdf,3),
            'time': round(time.time() - start_time, 2)
        }

        return data



