from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from .models import Complaint

@receiver(post_save, sender=Complaint)
def send_complaint_update(sender, instance, created, **kwargs):
    if not created:  # Only when updating, not on creation
        subject = f"Your complaint '{instance.title}' status updated"
        message = f"Hello {instance.citizen.username},\n\nYour complaint status is now: {instance.status}."
        send_mail(
            subject,
            message,
            "no-reply@complaints-system.com",   # from email
            [instance.citizen.email],           # to citizen
            fail_silently=True,
        )

