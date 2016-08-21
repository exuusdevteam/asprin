from marshmallow import Schema, fields, ValidationError, pre_load


######### SCHEMA ##########


class UserSchema(Schema):
    user_id = fields.Int(dump_only = True)
    names = fields.Str()
    username = fields.Str()
    email = fields.Str()
    phone = fields.Str()
    user_type = fields.Int()
    regDate = fields.Date()
    password= fields.Str()
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
    printer_id = fields.Int(dump_only = True)
    name = fields.Str()
    uri = fields.Str()
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