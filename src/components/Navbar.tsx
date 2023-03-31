import type { Component } from 'solid-js';
import { FaBrandsGithub, FaSolidHouse } from 'solid-icons/fa';
import { useNavigate } from '@solidjs/router';
import store from '../store';

const Navbar: Component = () => {
  const navigate = useNavigate();
  const setMessages = store[1];

  const goBack = () => {
    setMessages([]);
    navigate('/');
  };

  return (
    <nav class="navbar is-transparent" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a role="button" class="navbar-item" onClick={goBack}>
          <span class="icon">
            <FaSolidHouse />
          </span>
          <span>Home</span>
        </a>
        <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div class="navbar-menu">
        <div class="navbar-end">
          <a class="navbar-item" href="https://github.com/pablouser1/wa-export-viewer" target="_blank">
            <span class="icon">
              <FaBrandsGithub />
            </span>
            <span>Source</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
