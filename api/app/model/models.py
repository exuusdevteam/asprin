from app import db
from marshmallow import Schema, fields, ValidationError, pre_load
from datetime import datetime



########### Model #########


class User(db.Model):
    __tablename__ = 'user'

    user_id = db.Column(db.Integer, primary_key = True)
    names = db.Column(db.String(80))
    username = db.Column(db.String(40), unique = True)
    email = db.Column(db.String(80), unique = True)
    phone = db.Column(db.String(20), unique = True)
    user_type = db.Column(db.Integer)  # 0 (Printing Business User ),  1 (Customer)
    regDate =  db.Column(db.DateTime)
    business_id = db.Column(db.Integer, db.ForeignKey('business.business_id'))

    printjob = db.relationship('PrinterJob', backref='user', lazy='dynamic')

    def __init__(self, names, username, email, phone, user_type, business_id, regDate = None):
        self.names = names
        self.username = username
        self.email = email
        self.phone = phone
        self.user_type = user_type

        if regDate is None:
            self.regDate = datetime.utcnow()
        self.business_id = business_id



class Business(db.Model):
    __tablename__ = 'business'

    business_id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(80))
    email = db.Column(db.String(80), unique = True)
    phone = db.Column(db.String, unique= True)
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

    def __init__(self, name, email, phone, lat, lon, address, web, logo, regDate = None):
        self.name = name
        self.email = email
        self.phone = phone
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
    regDate = db.Column(db.DateTime)
    business_id = db.Column(db.Integer, db.ForeignKey('business.business_id'))

    printjob = db.relationship('PrinterJob', backref='printer', lazy='dynamic')

    def __init__(self, name, business_id, regDate = None):
        self.name = name
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
    file = db.Column(db.String(50))
    size = db.Column(db.Integer)
    page_number = db.Column(db.Integer)
    cyan = db.Column(db.Float)
    magenta = db.Column(db.Float)
    yellow = db.Column(db.Float)
    black = db.Column(db.Float)
    status = db.Column(db.Integer)
    price = db.Column(db.Float)
    taxes = db.Column(db.Float)
    regDate = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    business_id = db.Column(db.Integer, db.ForeignKey('business.business_id'))
    paper_type_id = db.Column(db.Integer, db.ForeignKey('paper_type.type_id'))
    paper_size_id = db.Column(db.Integer, db.ForeignKey('paper_size.size_id'))
    tonner_id = db.Column(db.Integer, db.ForeignKey('tonner.tonner_id'))
    printer_id = db.Column(db.Integer, db.ForeignKey('printer.printer_id'))


    def __init__(self, tonner_cost, file, size, page_number, cyan, magenta, yellow, black, status, price, taxes, user_id, business_id, paper_type_id,  paper_size_id, tonner_id, printer_id, regDate = None):
        self.tonner_cost = tonner_cost
        self.file = file
        self.size = size
        self.page_number = page_number
        self.cyan = cyan
        self.magenta = magenta
        self.yellow = yellow
        self.black = black
        self.status = status
        self.price = price
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
    name = db.Column(db.String(80))
    color = db.Column(db.String(40))
    weight = db.Column(db.Integer)
    description = db.Column(db.Text)

    printjob = db.relationship('PrinterJob', backref='paper_type', lazy='dynamic')

    def __init__(self, name, color, weight, description):
        self.name = name
        self.color = color
        self.weight = weight
        self.description = description




class PaperSize(db.Model):
    __tablename__ = 'paper_size'

    size_id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(80))
    height = db.Column(db.Integer)
    width = db.Column(db.Integer)
    description = db.Column(db.Text)

    printjob = db.relationship('PrinterJob', backref='paper_size', lazy='dynamic')

    def __init__(self, name, height, width, description):
        self.name = name
        self.height = height
        self.width = width
        self.description = description





######### SCHEMA ##########


class UserSchema(Schema):
    user_id = fields.Int(dump_only = True)
    names = fields.Str()
    username = fields.Str()
    email = fields.Str()
    phone = fields.Str()
    user_type = fields.Int()
    regDate = fields.Date()
    business_id = fields.Int()


class BusinessSchema(Schema):
    business_id = fields.Int(dump_only = True)
    name = fields.Str()
    email = fields.Str()
    phone = fields.Str()
    lat = fields.Str()
    lon = fields.Str()
    address = fields.Str()
    web = fields.Str()
    logo = fields.Str()
    regDate = fields.Date()


class PrinterSchema(Schema):
    print_id = fields.Int(dump_only = True)
    name = fields.Str()
    regDate = fields.Date()
    business_id = fields.Int()

class TonnerSchema(Schema):
    tonner_id = fields.Int(dump_only = True)
    regDate = fields.Date()
    business_id = fields.Int()

class TonnerListSchema(Schema):
    tonner_list_id = fields.Int(dump_only = True)
    name = fields.Str()
    color = fields.Str()
    weight = fields.Str()
    description = fields.Str()
    tonner_id = fields.Int()

class PrinterJobSchema(Schema):
    printer_job_id = fields.Int(dump_only = True)
    tonner_cost = fields.Str()
    file = fields.Str()
    size = fields.Str()
    page_number =fields.Str()
    cyan = fields.Str()
    magenta = fields.Str()
    yellow = fields.Str()
    black = fields.Str()
    status = fields.Str()
    price = fields.Str()
    taxes = fields.Str()
    regDate = fields.Str()
    user_id = fields.Int()
    business_id = fields.Int()
    paper_type_id = fields.Int()
    paper_size_id = fields.Int()
    tonner_id =  fields.Int()
    printer_id = fields.Int()


class PaperTypeSchema(Schema):
    type_id = fields.Int(dump_only = True)
    name = fields.Str()
    color = fields.Str()
    weight = fields.Str()
    description = fields.Str()

class PaperSizeSchema(Schema):
    size_id = fields.Int(dump_only = True)
    name = fields.Str()
    height = fields.Str()
    width = fields.Str()
    description = fields.Str()







########## Initialized all SCHEMA #############

user_schema = UserSchema()
users_schema= UserSchema(many = True)

business_schema = BusinessSchema()
businesses_schema = BusinessSchema(many = True)

printer_schema = PrinterSchema()
printers_schema = PrinterSchema(many = True)

tonner_schema = TonnerSchema()
tonners_schema = TonnerSchema(many = True)

tonner_list_schema = TonnerListSchema()
tonners_list_schema = TonnerListSchema(many = True)

printer_job_schema = PrinterJobSchema()
printers_job_schema = PrinterJobSchema(many = True)

paper_type_schema = PaperTypeSchema()
papers_type_schema = PaperTypeSchema(many = True)

paper_size_schema = PaperSizeSchema()
papers_size_schema = PaperSizeSchema(many = True)










