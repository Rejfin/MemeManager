import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ModalProvider } from './utils/ModalProvider';
import ModalHost from './utils/ModalHost';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

//controll dark mode
if (
  localStorage.theme === 'dark' ||
  (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

root.render(
  <BrowserRouter>
    <ModalProvider>
      <ModalHost />
      <App />
    </ModalProvider>
  </BrowserRouter>,
);
