from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)



###### DATATEBASE INITIALIZATION ##########

db = SQLAlchemy(app)

#app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///asprin.db'
#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:123456@localhost:5432/asprin'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://muhireremy:8@localhost/asprindb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

#import pdb; pdb.set_trace()

########### Model #########


class User(db.Model):
    __tablename__ = 'user'

    user_id = db.Column(db.Integer, primary_key = True)
    names = db.Column(db.String(80))
    username = db.Column(db.String(40), unique = True)
    email = db.Column(db.String(80), unique = True)
    phone = db.Column(db.String(25))
    dob = db.Column(db.DateTime)
    user_type = db.Column(db.Integer)  # 0 (Printing Business User ),  1 (Customer)
    user_role = db.Column(db.Integer)
    regDate =  db.Column(db.DateTime)
    password = db.Column(db.String(80))
    gender = db.Column(db.String(10))
    job_title = db.Column(db.String(80))
    business_id = db.Column(db.Integer, db.ForeignKey('business.business_id'))

    printjob = db.relationship('PrinterJob', backref='user', lazy='dynamic')

    def __init__(self, names, username, email, phone, user_type, user_role, business_id, password, gender, regDate = None):
        self.names = names
        self.username = username
        self.email = email
        self.phone = phone
        self.user_type = user_type
        self.user_role = user_role
        self.password = password
        self.gender = gender

        if regDate is None:
            self.regDate = datetime.utcnow()
        self.business_id = business_id





class Business(db.Model):
    __tablename__ = 'business'

    business_id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(80), unique = True)
    email = db.Column(db.String(80))
    phone = db.Column(db.String)
    category = db.Column(db.String)
    lat = db.Column(db.String(100))
    lon = db.Column(db.String(100))
    address = db.Column(db.String(80))
    web = db.Column(db.String(80))
    logo = db.Column(db.String(80))
    regDate = db.Column(db.DateTime)


    user = db.relationship('User', backref='business', lazy='dynamic')
    printer = db.relationship('Printer', backref = 'business', lazy = 'dynamic')
    tonner = db.relationship('Tonner', backref = 'business', lazy = 'dynamic')
    printjob = db.relationship('PrinterJob', backref='business', lazy='dynamic')

    def __init__(self, name, email, phone, category, lat, lon, address, web, logo, regDate = None):
        self.name = name
        self.email = email
        self.phone = phone
        self.category = category
        self.lat = lat
        self.lon = lon
        self.address = address
        self.web = web
        self.logo = logo

        if regDate is None:
            self.regDate = datetime.utcnow()





class Printer(db.Model):
    __tablename__ = 'printer'

    printer_id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(80))
    uri = db.Column(db.String(220))
    uuid = db.Column(db.String(150), unique = True)
    icon = db.Column(db.String(200))
    location = db.Column(db.String(200))
    regDate = db.Column(db.DateTime)
    business_id = db.Column(db.Integer, db.ForeignKey('business.business_id'))

    printjob = db.relationship('PrinterJob', backref='printer', lazy='dynamic')


    def __init__(self, printer_id, name, uri, uuid, icon, location, business_id, regDate=None):
        self.printer_id = printer_id
        self.name = name
        self.uri = uri
        self.uuid = uuid
        self.icon = icon
        self.location = location
        self.business_id = business_id
        if regDate is None:
            self.regDate = datetime.utcnow()


class Tonner(db.Model):
    __tablename__ = 'tonner'

    tonner_id = db.Column(db.Integer, primary_key = True)
    regDate = db.Column(db.DateTime)
    business_id = db.Column(db.Integer, db.ForeignKey('business.business_id'))

    tonner = db.relationship('TonnerList', backref = 'tonner', lazy = 'dynamic')


    def __init__(self, tonner_id, business_id, regDate = None):
        self.tonner_id = tonner_id

        if regDate is None:
            self.regDate = datetime.utcnow()

        self.business_id = business_id



class TonnerList(db.Model):
    __tablename__ = 'tonner_list'

    tonner_list_id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(80))
    color = db.Column(db.String(15))
    weight = db.Column(db.Integer)
    description = db.Column(db.Text)
    tonner_id = db.Column(db.Integer, db.ForeignKey('tonner.tonner_id'))



    def __init__(self, name, color, weight, description, tonner_id):
        self.name = name
        self.color = color
        self.weight = weight
        self.description = description
        self.tonner_id = tonner_id




class PrinterJob(db.Model):
    __tablename__ = 'printer_job'

    printer_job_id = db.Column(db.Integer, primary_key = True)
    tonner_cost = db.Column(db.Float)
    file = db.Column(db.String(255))
    filename = db.Column(db.String(255))
    size = db.Column(db.Integer)
    exec_time = db.Column(db.Float)
    page = db.Column(db.Integer)
    cyan = db.Column(db.Float)
    magenta = db.Column(db.Float)
    yellow = db.Column(db.Float)
    black = db.Column(db.Float)
    status = db.Column(db.Integer)
    price = db.Column(db.Float)
    paper_price = db.Column(db.Float)
    commission = db.Column(db.Float)
    taxes = db.Column(db.Float)
    regDate = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    business_id = db.Column(db.Integer, db.ForeignKey('business.business_id'))
    paper_type_id = db.Column(db.Integer, db.ForeignKey('paper_type.type_id'))
    paper_size_id = db.Column(db.Integer, db.ForeignKey('paper_size.size_id'))
    tonner_id = db.Column(db.Integer, db.ForeignKey('tonner.tonner_id'))
    printer_id = db.Column(db.Integer, db.ForeignKey('printer.printer_id'))


    def __init__(self, tonner_cost, file, filename, size, exec_time, page, cyan, magenta, yellow, black, status, price, paper_price, commission, taxes, user_id, business_id, paper_type_id,  paper_size_id, tonner_id, printer_id, regDate = None):
        self.tonner_cost = tonner_cost
        self.file = file
        self.filename = filename
        self.size = size
        self.exec_time = exec_time
        self.page = page
        self.cyan = cyan
        self.magenta = magenta
        self.yellow = yellow
        self.black = black
        self.status = status
        self.price = price
        self.paper_price = paper_price
        self.commission = commission
        self.taxes = taxes

        if regDate is None:
            self.regDate = datetime.utcnow()

        self.user_id = user_id
        self.business_id = business_id
        self.paper_type_id = paper_type_id
        self.paper_size_id = paper_size_id
        self.tonner_id = tonner_id
        self.printer_id = printer_id






class PaperType(db.Model):
    __tablename__ = 'paper_type'

    type_id = db.Column(db.Integer, primary_key = True)
    type = db.Column(db.String(80))
    color = db.Column(db.String(40))
    weight = db.Column(db.Integer)
    characteristics = db.Column(db.Text)
    uses = db.Column(db.String(120))

    printjob = db.relationship('PrinterJob', backref='paper_type', lazy='dynamic')

    def __init__(self, type, color, weight, characteristics, uses):
        self.type = type
        self.color = color
        self.weight = weight
        self.characteristics = characteristics
        self.uses= uses




class PaperSize(db.Model):
    __tablename__ = 'paper_size'

    size_id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(80))
    size = db.Column(db.String(30))
    size_type = db.Column(db.String(30))
    description = db.Column(db.Text)

    printjob = db.relationship('PrinterJob', backref='paper_size', lazy='dynamic')

    def __init__(self, name, size, size_type, description):
        self.name = name
        self.size = size
        self.size_type = size_type
        self.description = description
















