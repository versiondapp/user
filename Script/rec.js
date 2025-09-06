

window.history.replaceState(null, '', 'login.html');

window.addEventListener('popstate', function() {
  navigateToLoginClean();
});

document.querySelector(".reconnect").addEventListener('click', function () {
  navigateToLoginClean();
});

function navigateToLoginClean() {
  sessionStorage.setItem('fromReconnectPage', 'true');
  window.location.href = "login.html";
}

window.addEventListener('beforeunload', function() {
  sessionStorage.removeItem('modalOpen');
  sessionStorage.removeItem('processingState');
});
