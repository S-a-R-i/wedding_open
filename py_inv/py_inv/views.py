from pyexpat import model
from django.http import HttpResponse
from rest_framework import viewsets
import logging

from .models import *
from .serializers import *
from .common import *

from rest_framework.decorators import action
from rest_framework.response import Response

logger=logging.getLogger(__name__)

class BaseViewSet(viewsets.ModelViewSet):
    def log_start(self):
        logger.info(self.action + '(): method start.')
    def log_error(self, e):
        logger.error(self.action + '(): Error occurred: ' + f'{e}')
    def getErrorResponse(self, e):
        self.log_error(e)
        raise e

class MUserViewSet(BaseViewSet):
    queryset = MUser.objects.all()
    serializer_class = MUserSerializer
    filter_fields = '__all__'

    @action(methods=['post'], detail=False)
    def login(self, request, pk=None):
        try:
            param = request.data
            _family_name = param.get('family_name')
            _first_name = param.get('first_name')
            _password = param.get('password')
            _manage = param.get('manage')

            user = MUser.objects.filter(family_name=_family_name, first_name=_first_name).first()
            res = {}
            if user:
                if _manage and user.role != '010101':
                    # 管理画面のログイン管理者権限がない場合
                    res['result'] = False
                    res['token'] = None
                    res['status'] = 3
                elif user.password != _password:
                    # パスワードが間違っている場合
                    res['result'] = False
                    res['token'] = None
                    res['status'] = 1
                else:
                    # ログイン成功
                    tempToken = 'TOKEN_' + CommonService.createTemporaryToken(50)
                    res['result'] = True
                    res['token'] = tempToken
                    res['user_id'] = user.user_id
                    res['role'] = user.role
                    res['event_id'] = user.event_id
                    res['status'] = 0
            else:
                # 未登録ユーザー
                res['result'] = False
                res['token'] = None
                res['status'] = 2
            
            return Response(res)
        except Exception as e:
            return self.getErrorResponse(e)

    @action(methods=['get'], detail=False)
    def getUserId(self, request, pk=None):
        try:
            user_id = CommonService.createUserId()
            return Response({'user_id': user_id})
        except Exception as e:
            return self.getErrorResponse(e)

    @action(methods=['get'], detail=False)
    def getpreInitData(self, request, pk=None):
        try:
            param = request.GET
            _cls_1 = param.get('cls_1')
            _cls_2 = param.get('cls_2')
            today = datetime.now()
            mSystem = MSystem.objects.filter(cls_1=_cls_1, cls_2=_cls_2).order_by('cls_3')
            mSystemSerializer = MSystemSerializer(mSystem, many=True)
            mEvent = MEvent.objects.filter(date_time__gt=today).order_by('event_id')
            mEventSerializer = MEventSerializer(mEvent, many=True)

            obj = {
                'role_list': mSystemSerializer.data,
                'event_list': mEventSerializer.data
            }
            return Response(obj)
        except Exception as e:
            return self.getErrorResponse(e)

class MEventViewSet(BaseViewSet):
    queryset = MEvent.objects.all()
    serializer_class = MEventSerializer
    filter_fields = '__all__'

    @action(methods=['get'], detail=False)
    def getEventId(self, request, pk=None):
        try:
            event_id = CommonService.createEventId()
            return Response({'event_id': event_id})
        except Exception as e:
            return self.getErrorResponse(e)

    @action(methods=['get'], detail=False)
    def getMainDatas(self, request, pk=None):
        try:
            param = request.GET
            _event_id = param.get('event_id')
            _user_id = param.get('user_id')
            if _event_id == 'null' or _event_id == '':
                mEvent = MEvent.objects.all().order_by('date_time')
            else:
                mEvent = MEvent.objects.filter(event_id=_event_id)

            mEventSerializer = MEventSerializer(mEvent, many=True)
            mQuestion = MQuestion.objects.all().order_by('disp_order')
            mQuestionSerializer = MQuestionSerializer(mQuestion, many=True)
            tAttend = TAttend.objects.filter(user_id=_user_id).first()
            tAttendSerializer = TAttendSerializer(tAttend, many=False)
            tQuestion = TQuestion.objects.filter(user_id=_user_id)
            tQuestionSerializer = TQuestionSerializer(tQuestion, many=True)
            
            # 選択式の質問がある場合、選択肢を取得
            ansWayList = []
            for ques in mQuestion:
                if int(ques.answer_way) == 2:
                    _cls_2 = str(ques.question_no).zfill(2)
                    mSystem = MSystem.objects.filter(cls_1='02', cls_2=_cls_2).order_by('cls_3')
                    mSystemSerializer = MSystemSerializer(mSystem, many=True)
                    ansWayList.append(mSystemSerializer.data)
            
            obj = {
                'event': mEventSerializer.data,
                'm_question': mQuestionSerializer.data,
                'attend': tAttendSerializer.data,
                't_question': tQuestionSerializer.data,
                'ansWay': ansWayList,
            }
            return Response(obj)
        except Exception as e:
            return self.getErrorResponse(e)

    
class MQuestionViewSet(BaseViewSet):
    queryset = MQuestion.objects.all()
    serializer_class = MQuestionSerializer
    filter_fields = '__all__'

    @action(methods=['get'], detail=False)
    def getQuestionNo(self, request, pk=None):
        try:
            mQuestion = MQuestion.objects.values('question_no').order_by('-question_no').first()
            if mQuestion:
                question_no = int(mQuestion['question_no']) + 1
            else:
                question_no = 1

            return Response({'question_no': question_no})
        except Exception as e:
            return self.getErrorResponse(e)

class MSystemViewSet(BaseViewSet):
    queryset = MSystem.objects.all()
    serializer_class = MSystemSerializer
    filter_fields = '__all__'

    @action(methods=['get'], detail=False)
    def getListItem(self, request, pk=None):
        try:
            param = request.GET
            _cls_1 = param.get('cls_1')
            _cls_2 = param.get('cls_2')
            mSystem = MSystem.objects.filter(cls_1=_cls_1, cls_2=_cls_2).order_by('cls_3')
            mSystemSerializer = MSystemSerializer(mSystem, many=True)

            return Response({ 'data': mSystemSerializer.data })
        except Exception as e:
            return self.getErrorResponse(e)

class TAttendViewSet(BaseViewSet):
    queryset = TAttend.objects.all()
    serializer_class = TAttendSerializer
    filter_fields = '__all__'

    @action(methods=['post'], detail=False)
    def sendAns(self, request, pk=None):
        try:
            param = request.data
            _user_id = param.get('user_id')
            _question_data = param.get('question_data')
            # t_attendへの登録
            tAttend = TAttend.objects.filter(user_id=_user_id).first()
            if tAttend:
                tAttend.attend_flag = param.get('attend_flag')
                tAttend.comment = param.get('comment')
                tAttend.update_user_id = _user_id
                tAttend.save()
            else:
                param = {
                    'user_id': _user_id,
                    'attend_flag': param.get('attend_flag'),
                    'comment': param.get('comment'),
                    'insert_user_id': _user_id
                }  
                serializer = TAttendSerializer(data=param)
                serializer.is_valid(raise_exception=True)
                new = serializer.create(serializer.validated_data)

            # t_questionへの登録
            for qData in _question_data:
                _key = 'Q'+ str(qData['question_no']) + '_' + _user_id
                tQuestion = TQuestion.objects.filter(key=_key).first()
                if tQuestion:
                    tQuestion.answer = qData['answer']
                    tQuestion.save()
                else:
                    param = {
                        'key': _key,
                        'user_id': _user_id,
                        'question_no': qData['question_no'],
                        'answer': qData['answer']
                    }
                    serializer = TQuestionSerializer(data=param)
                    serializer.is_valid(raise_exception=True)
                    new = serializer.create(serializer.validated_data)

            return Response('OK')
        except Exception as e:
            return self.getErrorResponse(e)

class TQuestionViewSet(BaseViewSet):
    queryset = TQuestion.objects.all()
    serializer_class = TQuestionSerializer
    filter_fields = '__all__'

    @action(methods=['get'], detail=False)
    def getAnswer(self, request, pk=None):
        try:
            # t_attendからイベント参加者取得
            mUser = MUser.objects.filter(user_id=models.OuterRef('user_id'))
            mEvent = MEvent.objects.filter(event_id=models.OuterRef('event_id'))

            tAttend = TAttend.objects.annotate(
                family_name = models.Subquery(mUser.values('family_name')),
                first_name = models.Subquery(mUser.values('first_name')),
                event_id = models.Subquery(mUser.values('event_id')),
            ).values('event_id','family_name', 'first_name', 'user_id', 'attend_flag', 'payment_status', 'comment', 'insert_date', 'update_date').annotate(
                event_name = models.Subquery(mEvent.values('event_name'))
            ).values('family_name', 'first_name', 'user_id', 'event_name', 'attend_flag', 'payment_status', 'comment', 'insert_date', 'update_date')


            # tAttend = TAttend.objects.values('user_id', 'attend_flag', 'payment_status', 'comment', 'insert_date', 'update_date')
            # tAttendSerializer = TAttendSerializer(tAttend, many=True)

            # t_questionから各質問に対する回答を取得    
            tQuestion = TQuestion.objects.values('key', 'user_id', 'question_no', 'answer', 'insert_date', 'update_date')
            tQuestionSerializer = TQuestionSerializer(tQuestion, many=True)

            obj = {
                'attend': tAttend,
                'question': tQuestionSerializer.data
            }
            return Response(obj)
        except Exception as e:
            return self.getErrorResponse(e)
