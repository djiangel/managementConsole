export default function validateAuthenticationForm(values = {}) {
  return {
    email: !values.email && 'Email is missing',
    password: !values.password && 'Password is missing'
  };
}
