# Generated by Django 4.1 on 2022-10-04 05:28

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='MEvent',
            fields=[
                ('event_id', models.CharField(max_length=10, primary_key=True, serialize=False)),
                ('event_name', models.CharField(max_length=100)),
                ('date_time', models.DateTimeField(null=True)),
                ('place', models.CharField(max_length=100, null=True)),
                ('address', models.CharField(max_length=100, null=True)),
                ('latitude', models.CharField(max_length=100, null=True)),
                ('longitude', models.CharField(max_length=100, null=True)),
                ('price', models.CharField(max_length=10, null=True)),
                ('dress_code', models.CharField(max_length=1, null=True)),
                ('insert_user_id', models.CharField(max_length=10, null=True)),
                ('insert_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('update_user_id', models.CharField(max_length=10, null=True)),
                ('update_date', models.DateTimeField(auto_now=True, null=True)),
            ],
            options={
                'db_table': 'm_event',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='MQuestion',
            fields=[
                ('question_no', models.IntegerField(primary_key=True, serialize=False)),
                ('question', models.CharField(max_length=1000)),
                ('answer_way', models.CharField(max_length=1, null=True)),
                ('disp_order', models.IntegerField(null=True)),
                ('insert_user_id', models.CharField(max_length=10, null=True)),
                ('insert_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('update_user_id', models.CharField(max_length=10, null=True)),
                ('update_date', models.DateTimeField(auto_now=True, null=True)),
            ],
            options={
                'db_table': 'm_question',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='MSystem',
            fields=[
                ('key', models.CharField(max_length=6, primary_key=True, serialize=False)),
                ('cls_1', models.CharField(max_length=2)),
                ('cls_2', models.CharField(max_length=2)),
                ('cls_3', models.CharField(max_length=2)),
                ('str', models.CharField(max_length=100, null=True)),
                ('insert_user_id', models.CharField(max_length=10, null=True)),
                ('insert_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('update_user_id', models.CharField(max_length=10, null=True)),
                ('update_date', models.DateTimeField(auto_now=True, null=True)),
            ],
            options={
                'db_table': 'm_system',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='MUser',
            fields=[
                ('user_id', models.CharField(max_length=10, primary_key=True, serialize=False)),
                ('event_id', models.CharField(max_length=10, null=True)),
                ('family_name', models.CharField(max_length=10)),
                ('first_name', models.CharField(max_length=10)),
                ('password', models.CharField(max_length=20)),
                ('mail_address', models.CharField(max_length=50, null=True)),
                ('role', models.CharField(max_length=6)),
                ('insert_user_id', models.CharField(max_length=10, null=True)),
                ('insert_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('update_user_id', models.CharField(max_length=10, null=True)),
                ('update_date', models.DateTimeField(auto_now=True, null=True)),
            ],
            options={
                'db_table': 'm_user',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='TAttend',
            fields=[
                ('user_id', models.CharField(max_length=10, primary_key=True, serialize=False)),
                ('attend_flag', models.BooleanField(null=True)),
                ('payment_status', models.IntegerField(null=True)),
                ('comment', models.CharField(max_length=1000, null=True)),
                ('insert_user_id', models.CharField(max_length=10, null=True)),
                ('insert_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('update_user_id', models.CharField(max_length=10, null=True)),
                ('update_date', models.DateTimeField(auto_now=True, null=True)),
            ],
            options={
                'db_table': 't_attend',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='TQuestion',
            fields=[
                ('key', models.CharField(max_length=20, primary_key=True, serialize=False)),
                ('user_id', models.CharField(max_length=10)),
                ('question_no', models.IntegerField()),
                ('answer', models.CharField(max_length=1000, null=True)),
                ('insert_user_id', models.CharField(max_length=10, null=True)),
                ('insert_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('update_user_id', models.CharField(max_length=10, null=True)),
                ('update_date', models.DateTimeField(auto_now=True, null=True)),
            ],
            options={
                'db_table': 't_question',
                'managed': False,
            },
        ),
    ]
