import arrow

def usersdate(json_user):
    for user in json_user:
        user['regDate'] =  arrow.get(user['regDate']).to('Africa/Kigali').humanize()
    return json_user


def userdate(json_user):
    json_user['regDate'] = arrow.get(json_user['regDate']).to('Africa/Kigali').humanize()
    dob = arrow.get(json_user['dob'])
    day = dob.format('DD')
    month = dob.format('MMM')
    year = dob.format('YYYY')

    data = []
    data.append({'day':day,'month':month,'year':year})
    json_user['dob'] = data

    return json_user