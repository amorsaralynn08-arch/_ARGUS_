from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings

def send_test_email(recipient_email):
    subject = "Welcome to ARGUS"
    text_content = "This is a test email from ARGUS"
    html_content = render_to_string("emails/test_email.html")
    email = EmailMultiAlternatives(subject=subject,body=text_content,from_email=settings.DEFAULT_FROM_EMAIL, to=[recipient_email],)
    email.attach_alternative(html_content, "text/html")
    email.send()
    
    
def send_password_changed_email(user):
    subject = "ARGUS Password Changed Successfully"
    html_content = render_to_string("emails/password_changed.html",{"user": user})
    email = EmailMultiAlternatives(subject,"",settings.EMAIL_HOST_USER,[user.email],)
    email.attach_alternative(html_content,"text/html")
    email.send()

def send_password_reset_success_email(user):
    subject = "ARGUS Password Reset Successful"
    html_content = render_to_string("emails/password_reset_success.html",{"user": user})
    email = EmailMultiAlternatives(subject,"",settings.EMAIL_HOST_USER,[user.email],)
    email.attach_alternative(html_content,"text/html")
    email.send()