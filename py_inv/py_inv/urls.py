from django.urls import path, include
from django.contrib import admin
from rest_framework import routers
from .views import *

router = routers.SimpleRouter()
router.register('m_user', MUserViewSet),
router.register('m_vent', MEventViewSet),
router.register('m_question', MQuestionViewSet),
router.register('m_system', MSystemViewSet),
router.register('m_event', MEventViewSet),
router.register('t_attend', TAttendViewSet),
router.register('t_question', TQuestionViewSet),

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]