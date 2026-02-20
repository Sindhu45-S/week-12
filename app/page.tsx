import styles from './home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>⚡</span>
          <span className={styles.logoText}>Flow Desk</span>
        </div>
        <a href="/sign-in" className={styles.navLink}>Sign In</a>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Flow Desk</h1>
          <p className={styles.subtitle}>Your elegant workspace for productivity</p>
          <p className={styles.description}>Stay organized, stay focused, stay productive with Flow Desk's modern task management.</p>
          
          <div className={styles.ctaButtons}>
            <a href="/sign-in" className={styles.primaryBtn}>Get Started</a>
            <a href="/sign-up" className={styles.secondaryBtn}>Create Account</a>
          </div>
        </div>
        
        <div className={styles.heroGraphic}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>📋</div>
            <p>Organize Tasks</p>
          </div>
          <div className={styles.card}>
            <div className={styles.cardIcon}>⏰</div>
            <p>Set Deadlines</p>
          </div>
          <div className={styles.card}>
            <div className={styles.cardIcon}>✅</div>
            <p>Track Progress</p>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <h2>Why Flow Desk?</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎨</div>
            <h3>Beautiful Design</h3>
            <p>A modern, intuitive interface that's a pleasure to use</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h3>Fast & Responsive</h3>
            <p>Seamless performance across all devices</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔒</div>
            <h3>Secure</h3>
            <p>Your tasks are safe with enterprise-level security</p>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>&copy; 2026 Flow Desk. All rights reserved.</p>
      </footer>
    </div>
  );
}
