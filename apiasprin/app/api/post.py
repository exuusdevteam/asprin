from flask import jsonify, request
from app import *
from app.model.models import *
from app.model.schema import *
from app.controller.printer.getprinter import *
from app.controller.app.getusername import *
from sqlalchemy.exc import IntegrityError



#################### POST PRINTER ##########################################
@app.route("/api/post/printer/", methods=["POST"])
def post_printer():
    json_data = request.get_json()
    if not json_data:
        return jsonify({'message':'No input data provided'}), 400

    data, errors = printer_schema.load(json_data)

    if errors:
        return jsonify(errors), 422


    try:
        printer = Printer(
            printer_id = None,
            name = data['name'],
            regDate = None,
            business_id = data['business_id'],
            uri = data['uri']
        )

        db.session.add(printer)
        db.session.commit()

        last_printer = printer_schema.dump(Printer.query.get(printer.printer_id)).data

        return jsonify({"printer":last_printer})

    except IntegrityError:
        return jsonify({'Message':'Already Added'})
##########################################################################

############################# POST USER ###################################

@app.route("/api/post/user/", methods=["POST"])
def post_user():
    json_data = request.get_json()
    if not json_data:
        return jsonify({'message':'No input data provided'}), 400

    data, errors = user_schema.load(json_data)

    if errors:
        return jsonify(errors), 422


    username = get_username(data['email'])

    try:
        user = User(
            names = data['names'],
            username = username,
            email = data['email'],
            phone = None,
            user_type = None,
            regDate = None,
            password = data['password'],
            business_id = None
        )

        db.session.add(user)
        db.session.commit()

        last_user = user_schema.dump(User.query.get(user.user_id)).data
        return jsonify({'user':last_user})

    except IntegrityError:
        return  jsonify({'Message':'Already added'})
 ##########################################################################


