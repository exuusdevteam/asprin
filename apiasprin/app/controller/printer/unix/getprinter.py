import cups

def get_printer_list():
    conn = cups.Connection()
    printers = conn.getPrinters()
    #devices = conn.getDevices()
    output = {'Printers': [printers]}
    #default = conn.getDefault()

    '''for printer in printers:
        data = {'printer_name': printer, 'printer_uri': printers[printer]["device-uri"]}
        output['Printers'].append(data)'''
    return printers


