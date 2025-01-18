
export const validationRules: Record<string, (value: string) => string | null> = {
    text: (value) => {
        const textRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
        return textRegex.test(value.trim()) ? null : 'Solo se permiten letras.';
    },
    number: (value) => {
        const numberRegex = /^[0-9]*$/;
        return numberRegex.test(value.trim()) ? null : 'Solo se permiten números.';
    },
    email: (value) => {
        const trimmedEmail = value.trim();
        const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!EMAIL_FORMAT.test(trimmedEmail)) return 'Correo electrónico inválido.';
        if (trimmedEmail.length > 254) return 'Correo electrónico demasiado largo.';
        if (/[^\x00-\x7F]/.test(trimmedEmail)) return 'El correo electrónico no puede contener caracteres Unicode.';
        return null;
    },
    phone: (value) => {
        let telefono = value.replace(/[\s#().-]/g, '');
        if (!/^\+?\d+$/.test(telefono)) return 'Número de teléfono inválido. El número contiene caracteres no permitidos.';
        if (telefono.length < 7 || telefono.length > 15) return 'Número de teléfono inválido. La longitud no es correcta.';
        return null;
    },
    IDNumber: (value) => {
        const trimmedValue = value.trim();
        const idRegex = /^(?:\d{10}|\d{13}|\d{9,12})$/; 
        if (!idRegex.test(trimmedValue)) return 'Número de identificación inválido.';
        return null;
    }
};