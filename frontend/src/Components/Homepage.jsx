import React from 'react';
import './Homepage.css';
import { Link } from 'react-router-dom';

function Homepage() {
  return (
    <div className="homepage">
      <header className="header">
        <h1>VELAMMAL COLLEGE OF ENGINEERING AND TECHNOLOGY</h1>
        <p>STUDENT PERFORMANCE SYSTEM</p>
      </header>

      <nav className="navbar">
        <a href="#">Home</a>
      </nav>

      <main className="main-content">
        <aside className="sidebar">
          <h3>Menus</h3>
          <ul>
            <li>
              <Link to="/mentees" className="link">Mentee List</Link>
            </li>
            <li>
              <Link to="/new-counselling" className="link">New Counselling</Link>
            </li>
          </ul>
        </aside>

        <section className="content">
          <h2>Welcome "MENTOR of CSE Department"</h2>
          <p className="no-attendance"></p>
        </section>
      </main>
    </div>
  );
}

export default Homepage;