import arrow

def usersdate(json_user):
    for user in json_user:
        user['regDate'] =  arrow.get(user['regDate']).to('Africa/Kigali').humanize()
    return json_user


def userdate(json_user):
    json_user['regDate'] = arrow.get(json_user['regDate']).to('Africa/Kigali').humanize()
    return json_user