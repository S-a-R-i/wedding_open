import random
import string
import string
from datetime import datetime
from .models import *

class CommonService():
    # トークン生成
    def createTemporaryToken(length):
        return CommonService.createRandomStr(length)
        

    # ユーザーID生成
    def createUserId():
        str = 'U' + CommonService.createRandomStr(9)
        querySet = MUser.objects.values('user_id').filter(user_id__startswith=str).first()

        while querySet:
            str = 'U' + CommonService.createRandomStr(9)
            querySet = MUser.objects.values('user_id').filter(user_id__startswith=str).first()

        return str 

    # イベントID生成
    def createEventId():
        str = 'E' + CommonService.createRandomStr(9)
        querySet = MEvent.objects.values('event_id').filter(event_id__startswith=str).first()

        while querySet:
            str = 'E' + CommonService.createRandomStr(9)
            querySet = MEvent.objects.values('event_id').filter(event_id__startswith=str).first()

        return str   

    # ランダムな文字列生成
    def createRandomStr(length):
        sr = random.SystemRandom()
        return ''.join([sr.choice(seq=string.digits + string.ascii_letters) for i in range(length)])



