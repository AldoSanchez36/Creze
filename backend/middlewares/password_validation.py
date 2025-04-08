import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _

class CustomPasswordValidator:
    def validate(self, password, user=None):
        if len(password) < 10:
            raise ValidationError(_("La contraseña debe tener al menos 10 caracteres."))
        if not re.search(r'[A-Z]', password):
            raise ValidationError(_("La contraseña debe contener al menos una letra mayúscula."))
        if not re.search(r'[a-z]', password):
            raise ValidationError(_("La contraseña debe contener al menos una letra minúscula."))
        if not re.search(r'\d', password):
            raise ValidationError(_("La contraseña debe contener al menos un número."))
        if not re.search(r'[^A-Za-z0-9]', password):
            raise ValidationError(_("La contraseña debe contener al menos un carácter especial."))

    def get_help_text(self):
        return _(
            "Tu contraseña debe tener al menos 10 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales."
        )