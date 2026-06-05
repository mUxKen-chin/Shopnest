import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer__grid">
        <div className="footer__brand">
          <h2 className="footer__logo">ShopNest</h2>
          <p>Premium fashion for the modern individual. Quality pieces that stand the test of time.</p>
          <div className="footer__socials">
            <a href="#!" className="footer__social"><FiInstagram size={18} /></a>
            <a href="#!" className="footer__social"><FiFacebook size={18} /></a>
            <a href="#!" className="footer__social"><FiTwitter size={18} /></a>
          </div>
        </div>

        <div className="footer__col">
          <h4>Shop</h4>
          <ul>
            <li><Link to="/shop?gender=Men">Men</Link></li>
            <li><Link to="/shop?gender=Women">Women</Link></li>
            <li><Link to="/shop?category=Outerwear">Outerwear</Link></li>
            <li><Link to="/shop?category=Footwear">Footwear</Link></li>
            <li><Link to="/shop?category=Accessories">Accessories</Link></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Account</h4>
          <ul>
            <li><Link to="/login">Sign In</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/orders">My Orders</Link></li>
            <li><Link to="/cart">Shopping Cart</Link></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Help</h4>
          <ul>
            <li><a href="#!">Shipping Policy</a></li>
            <li><a href="#!">Returns & Exchange</a></li>
            <li><a href="#!">Size Guide</a></li>
            <li><a href="#!">Contact Us</a></li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <p>&copy; {new Date().getFullYear()} ShopNest. All rights reserved.</p>
        <p>Made with ❤️ in Pakistan</p>
      </div>
    </div>
  </footer>
);

export default Footer;
