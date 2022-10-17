from django.db import models

# Create your models here.
class MUser(models.Model):
    user_id = models.CharField(max_length=10, null=False, primary_key=True)
    event_id = models.CharField(max_length=10, null=False, blank=True)
    family_name = models.CharField(max_length=10, null=False)
    first_name = models.CharField(max_length=10, null=False)
    password = models.CharField(max_length=20, null=False)
    mail_address = models.CharField(max_length=50, null=True, blank=True)
    role = models.CharField(max_length=6, null=False)
    insert_user_id = models.CharField(max_length=10, null=True)
    insert_date = models.DateTimeField(null=True, auto_now_add=True)
    update_user_id = models.CharField(max_length=10, null=True)
    update_date = models.DateTimeField(null=True, auto_now=True)

    class Meta:
        managed = False
        db_table = 'm_user'

class MEvent(models.Model):
    event_id = models.CharField(max_length=10, null=False, primary_key=True)
    event_name = models.CharField(max_length=100, null=False)
    date_time = models.DateTimeField(null=True, blank=True)
    place = models.CharField(max_length=100, null=True, blank=True)
    address = models.CharField(max_length=100, null=True, blank=True)
    latitude = models.CharField(max_length=100, null=True, blank=True)
    longitude = models.CharField(max_length=100, null=True, blank=True)
    price = models.CharField(max_length=10, null=True, blank=True)
    dress_code = models.CharField(max_length=1, null=True, blank=True)
    insert_user_id = models.CharField(max_length=10, null=True)
    insert_date = models.DateTimeField(null=True, auto_now_add=True)
    update_user_id = models.CharField(max_length=10, null=True)
    update_date = models.DateTimeField(null=True, auto_now=True)

    class Meta:
        managed = False
        db_table = 'm_event'

class MQuestion(models.Model):
    question_no = models.IntegerField(null=False, primary_key=True)
    question = models.CharField(max_length=1000, null=False)
    title = models.CharField(max_length=10, null=True, blank=True)
    answer_way = models.CharField(max_length=1, null=True, blank=True)
    disp_order = models.IntegerField(null=True, blank=True)
    insert_user_id = models.CharField(max_length=10, null=True)
    insert_date = models.DateTimeField(null=True, auto_now_add=True)
    update_user_id = models.CharField(max_length=10, null=True)
    update_date = models.DateTimeField(null=True, auto_now=True)

    class Meta:
        managed = False
        db_table = 'm_question'

class MSystem(models.Model):
    key = models.CharField(max_length=6, primary_key=True)
    cls_1 = models.CharField(max_length=2, null=False)
    cls_2 = models.CharField(max_length=2, null=False)
    cls_3 = models.CharField(max_length=2, null=False)
    name = models.CharField(max_length=100, null=True, blank=True)
    str = models.CharField(max_length=100, null=True, blank=True)
    insert_user_id = models.CharField(max_length=10, null=True)
    insert_date = models.DateTimeField(null=True, auto_now_add=True)
    update_user_id = models.CharField(max_length=10, null=True)
    update_date = models.DateTimeField(null=True, auto_now=True)

    class Meta:
        managed = False
        db_table = 'm_system'

class TAttend(models.Model):
    user_id = models.CharField(max_length=10, null=False, primary_key=True)
    attend_flag = models.BooleanField(null=True)
    payment_status = models.IntegerField(null=True, blank=True)
    comment = models.CharField(max_length=1000, null=True, blank=True)
    insert_user_id = models.CharField(max_length=10, null=True)
    insert_date = models.DateTimeField(null=True, auto_now_add=True)
    update_user_id = models.CharField(max_length=10, null=True)
    update_date = models.DateTimeField(null=True, auto_now=True)

    class Meta:
        managed = False
        db_table = 't_attend'

class TQuestion(models.Model):
    key = models.CharField(max_length=20, primary_key=True)
    user_id = models.CharField(max_length=10, null=False)
    question_no = models.IntegerField(null=False)
    answer = models.CharField(max_length=1000, null=True, blank=True)
    insert_user_id = models.CharField(max_length=10, null=True)
    insert_date = models.DateTimeField(null=True, auto_now_add=True)
    update_user_id = models.CharField(max_length=10, null=True)
    update_date = models.DateTimeField(null=True, auto_now=True)
    
    class Meta:
        managed = False
        db_table = 't_question'

