from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import datetime

def validate_dob_not_in_future(value):
    if value is None:
        return

    if isinstance(value, datetime):
        value_date = value.date()
    else:
        value_date = value

    today = timezone.now().date()
    if value_date > today:
        raise ValidationError('Date of birth cannot be in the future.')
