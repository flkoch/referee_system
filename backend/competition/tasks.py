from celery import shared_task
from django.core import mail


@shared_task
def send_mails(messages: list[mail.EmailMessage]):
    connection = mail.get_connection()
    connection.send_messages(messages)
