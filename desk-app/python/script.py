import json
import cups
import os

conn = cups.Connection()
printers = conn.getPrinters()

print json.dumps(printers)



