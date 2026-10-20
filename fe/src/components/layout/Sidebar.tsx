import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

const navItems = [
  { to: '/dashboard', label: 'Tổng quan', icon: '📊' },
  { to: '/rental-orders', label: 'Đơn thuê', icon: '📋' },
  { to: '/products', label: 'Sản phẩm', icon: '📦' },
  { to: '/customers', label: 'Khách hàng', icon: '👤' },
  { to: '/categories', label: 'Danh mục', icon: '🗂️' },
];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandIcon}>🏪</span>
        <span className={styles.brandName}>Thuê Hàng</span>
      </div>

      <nav className={styles.nav} aria-label="Main navigation">
        <ul className={styles.navList} role="list">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  [styles.navLink, isActive ? styles.navLinkActive : ''].join(' ')
                }
              >
                <span aria-hidden="true">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
