import cups

def get_printer_list():
    conn = cups.Connection()
    printers = conn.getPrinters()
    output = {'Printers': []}
    for printer in printers:
        data = {'printer_name': printer, 'printer_uri': printers[printer]["device-uri"]}
        output['Printers'].append(data)
    return output


