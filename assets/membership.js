const formLogin = document.getElementById('login-cont');
const formRecover = document.getElementById('recover-cont');
const btnRecover = document.getElementById('btn-recover');

btnRecover.addEventListener('click', () => {
  formLogin.classList.remove('form-active');
  formRecover.classList.add('form-active');
})