import { setLocalStorage, getLocalStorage } from './util/localStorage';

function triggerLoginPop(item = { success: true }) {
  window.PASSPORT && window.PASSPORT.loginPopup && window.PASSPORT.loginPopup('code');
  window.isBuyToOpenLoginPop = true;
  window.isBuyToOpenLoginPopWaitBuyData = item;
  let closeButton = document.querySelector('.login-pop .modal-close_icon');
  closeButton.removeEventListener('click', closeLoginModalFun);
  closeButton.addEventListener('click', closeLoginModalFun);
  console.log('triggerLoginPop', item);
}
function closeLoginModalFun(params) {
  window.isBuyToOpenLoginPop = false;
  console.log('closeLoginModalFun');
}
function addBuyTarget(params) {
  let { isBuyToOpenLoginPop, isBuyToOpenLoginPopWaitBuyData } = window;
  if (isBuyToOpenLoginPop && isBuyToOpenLoginPopWaitBuyData) {
    setLocalStorage('loginPopSetBuyData', isBuyToOpenLoginPopWaitBuyData);
  }
}
function switchNeedToTriggerBuy(params) {
  let returnData = getLocalStorage('loginPopSetBuyData', true);
  if (returnData) {
    setLocalStorage('loginPopSetBuyData', null);
  }
  return returnData;
}


export {
  triggerLoginPop,
  closeLoginModalFun,
  addBuyTarget,
  switchNeedToTriggerBuy
};