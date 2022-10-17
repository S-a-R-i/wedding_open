from rest_framework import serializers
from .models import *

class MUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = MUser
        fields = '__all__'

class MEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = MEvent
        fields = '__all__'

class MQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MQuestion
        fields = '__all__'

class MSystemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MSystem
        fields = '__all__'

class TAttendSerializer(serializers.ModelSerializer):
    class Meta:
        model = TAttend
        fields = '__all__'

class TQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TQuestion
        fields = '__all__'