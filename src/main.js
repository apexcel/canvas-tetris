import App from './App.js';

const app = document.getElementById('app');
const docElem = document.documentElement;
const loading = document.createElement('div');

let isLoading = true;
(() => {
    app.className = 'hide'
    loading.className = 'loading'
    docElem.append(loading);

    isLoading = false;
    start()
})();

function start() {
    if (!isLoading) {
        console.log(isLoading)
        app.classList.remove('hide');
        docElem.removeChild(loading);
        new App(app);
    }
}
