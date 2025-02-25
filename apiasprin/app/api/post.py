from flask import jsonify, request
from app import *
from ..model.models import *
from ..model.schema import *
from ..controller.app.getusername import *
from sqlalchemy.exc import IntegrityError
from werkzeug import secure_filename
import os
from ..controller.app.uniqid import uniqid
from ..controller.pdfalgo.pdf import Pdfalgo


app.config['UPLOAD_FOLDER'] = '/tmp'
app.config['ALLOWED_EXTENSIONS'] = set(['pdf'])


#################### POST PRINTER ##########################################
@app.route("/api/v1/printer/", methods=["POST"])
def post_printer():
    json_data = request.get_json()
    if not json_data:
        return jsonify({'message':'No input data provided'}), 400

    data, errors = printer_schema.load(json_data)

    if errors:
        return jsonify(errors), 422

    business_id = data['business_id']

    try:
        printer = Printer(
            printer_id = None,
            name = data['name'],
            uri = data['uri'],
            uuid = data['uuid'],
            icon = data['icon'],
            location = data['location'],
            regDate = None,
            business_id = data['business_id']
        )

        db.session.add(printer)
        db.session.commit()

        printers = printer_schema.dump(Printer.query.filter_by(business_id = business_id)).data

        return jsonify({"printers":printers})

    except IntegrityError:
        return jsonify({'Message':'Already Added'})
##########################################################################

############################# POST USER ###################################

@app.route("/api/v1/user/", methods=["POST"])
def post_user():
    json_data = request.get_json()
    if not json_data:
        return jsonify({'message':'No input data provided'}), 400

    data, errors = user_schema.load(json_data)

    if errors:
        return jsonify(errors), 422


    username = get_username(data['email'])
    pw_hash = bcrypt.generate_password_hash(data['password'])

    try:
        user = User(
            names = data['names'],
            username = username,
            email = data['email'],
            phone = None,
            user_type = 1,
            user_role = None,
            regDate = None,
            password = pw_hash,
            gender = None,
            business_id = None
        )

        db.session.add(user)
        db.session.commit()

        last_user = user_schema.dump(User.query.get(user.user_id)).data
        return jsonify({'auth':1,'user':last_user})

    except IntegrityError:
        return  jsonify({'auth':0,'message':'User already exist!'})
 ##########################################################################


@app.route("/api/v1/user/business/<int:id>")
def post_businessUser(id):
    json_data = get_json()
    if not  json_data:
        return jsonify({'message':'No input data provided'}), 400

    data, errors = user_schema.load(json_data)

    if errors:
        return jsonify(errors),422
    '''username = ge'''


 ############################# POST BUSINESS ###################################
@app.route("/api/v1/business/<int:id>", methods=["POST"])
def post_business(id):
    json_data = request.get_json()
    if not json_data:
        return jsonify({'message':'No input data provided'}), 400

    data, errors = business_schema.load(json_data)

    if errors:
        return jsonify(errors), 422

    try:
        business = Business(
            name = data['name'],
            email = None,
            phone = None,
            category = None,
            lat = None,
            lon = None,
            address = None,
            web = None,
            logo = None,
            regDate = None
        )

        db.session.add(business)
        db.session.commit()

        user = User.query.filter_by(user_id = id).first()
        user.business_id = business.business_id
        user.user_type = 0

        db.session.commit()



        last_business = business_schema.dump(Business.query.get(business.business_id)).data
        return jsonify({'business':last_business})
    except IntegrityError:
        return jsonify({'Message':'Already added'})


############################# POST PAPER SIZE #####################################
@app.route("/api/post/paper/size/", methods=["POST"])
def post_paper_size():
    json_data = request.get_json()
    if not json_data:
        return jsonify({'message':'No input data prodivded'})
    data,errors = paper_size_schema.load(json_data)

    if errors:
        return jsonify(errors), 422
    try:
        paper_size = PaperSize(
            name = data['name'],
            size = data['size'],
            size_type = data['size_type'],
            description = None
        )

        db.session.add(paper_size)
        db.session.commit()

        last_paper = paper_size_schema.dump(PaperSize.query.get(paper_size.size_id)).data
        return jsonify({'paper_size':last_paper})
    except IntegrityError:
        return jsonify({'message':'Already added'})


############################ POST PAPER TYPE #######################################
@app.route("/api/post/paper/type/", methods=["POST"])
def post_paper_type():
    json_data = request.get_json()
    if not json_data:
        return jsonify({'message':'No input data provided'})
    data, errors = paper_type_schema.load(json_data)

    if errors:
        return jsonify(errors), 422
    try:
        paper_type = PaperType(
            type = data['type'],
            color = data['color'],
            weight = data['weight'],
            characteristics = data['characteristics'],
            uses = data['uses']
        )

        db.session.add(paper_type)
        db.session.commit()

        last_paper = paper_type_schema.dump(PaperType.query.get(paper_type.type_id)).data
        return jsonify({'paper_type':last_paper})
    except IntegrityError:
        return jsonify({'message':'Already added'})


######################### POST IMAGE ############################################

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in app.config['ALLOWED_EXTENSIONS']


@app.route('/api/upload/pdf/', methods=['POST','GET'])
def upload():
    file = request.files['file']
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        tmp_filename = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(tmp_filename)

        re_filename = uniqid()+".pdf"
        destination = "/Users/muhireremy/asprin/apiasprin/pdf/"+re_filename
        #destination = "/var/www/html/apiasprin/pdf/"+re_filename
        os.rename(tmp_filename, destination)

        pdf_scan = Pdfalgo(destination, filename, re_filename).loadPdf()

        return jsonify({'asprin':pdf_scan})


@app.route("/api/v1/login/", methods=['POST'])
def login():
    json_data = request.get_json()
    if not json_data:
        return jsonify({'message':'no valid input provided'}), 400
    data, errors = user_schema.load(json_data)

    if errors:
        return jsonify(errors), 422

    username, password = data['username'], data['password']

    user = User.query.filter((User.username==username) | (User.email==username)).first()
    try:
        pw_hash = bcrypt.check_password_hash(user.password, password)
        if pw_hash:
            result = user_schema.dump(User.query.get(user.user_id))
            return jsonify({'auth': 1, 'user': result.data})
        else:
            return jsonify({'auth': 0})
    except AttributeError:
        return jsonify({'auth':2})




@app.route("/api/v1/printjob/", methods=['POST'])
def printjob():
    json_data = request.get_json()
    if not json_data:
        return jsonify({'message':'no valid input provided'}), 400
    data, errors = printer_job_schema.load(json_data)

    if errors:
        return jsonify(errors), 422

    commision = round(int(data['price']) * 0.05,0)
    taxes = round((int(data['price'])+commision) * 0.18,0)

    print_job =  PrinterJob(
        tonner_cost = data['tonner_cost'],
        file = data['file'],
        filename = data['filename'],
        size = data['size'],
        exec_time = data['exec_time'],
        page = data['page'],
        cyan = data['cyan'],
        magenta = data['magenta'],
        yellow = data['yellow'],
        black = data['black'],
        status = 3,
        price = data['price'],
        paper_price = None,
        commission = commision,
        taxes = taxes,
        regDate = None,
        user_id = data['user_id'],
        business_id = data['business_id'],
        paper_type_id = None,
        paper_size_id = None,
        tonner_id = None,
        printer_id = None
    )

    db.session.add(print_job)
    db.session.commit()

    last_job =  printer_job_schema.dump(PrinterJob.query.get(print_job.printer_job_id)).data

    return jsonify({'job':last_job})
