import styles from "./HomePage.module.css";

export default function HomePage() {
  const featured = [
    {
      title: "The Grand Oasis",
      subtitle: "Luxury in the city",
      img: "https://images.unsplash.com/photo-1501117716987-c8e3b7f9b8d6"
    },
    {
      title: "Coastal Retreat",
      subtitle: "Relax by the sea",
      img: "https://images.unsplash.com/photo-1501959915551-4e8b88b6d8f9"
    },
    {
      title: "Mountain Haven",
      subtitle: "Escape to the mountains",
      img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
    }
  ];

  return (
    <div className={styles.page}>
      {/* HERO */}
      <section className={styles.hero}>
        <img
          src="https://images.unsplash.com/photo-1560347876-aeef00ee58a1"
          className={styles.heroImg}
        />

        <div className={styles.heroCenter}>
          <h1>Discover your next stay</h1>
          <p>Search for hotels, resorts, and more</p>
        </div>
      </section>

      {/* FEATURED */}
      <section className={styles.section}>
        <h2>Featured stays</h2>

        <div className={styles.featureGrid}>
          {featured.map((item) => (
            <div className={styles.featureCard} key={item.title}>
              <img src={item.img} />
              <div>
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className={styles.section}>
        <h2>Popular destinations</h2>

        <div className={styles.destGrid}>
          <div className={styles.destCard}>
            <img src="https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba" />
            <span>Paris</span>
          </div>

          <div className={styles.destCard}>
            <img src="https://images.unsplash.com/photo-1505765053606-9f1d0c65b0b9" />
            <span>Tokyo</span>
          </div>

          <div className={styles.destCard}>
            <img src="https://images.unsplash.com/photo-1549924231-f129b911e442" />
            <span>New York</span>
          </div>

          <div className={styles.destCard}>
            <img src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b" />
            <span>London</span>
          </div>
        </div>
      </section>
    </div>
  );
}
