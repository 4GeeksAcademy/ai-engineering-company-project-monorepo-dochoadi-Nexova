import { contact } from "@/content/home";
import Button from "./Button";
import Reveal from "./Reveal";
import styles from "./ContactCta.module.css";

export default function ContactCta() {
  const { heading } = contact;
  return (
    <section id="contact" aria-labelledby="contact-h" className={styles.section}>
      <Reveal index={0} className={styles.panel}>
        <h2 id="contact-h" className={styles.title}>
          {heading.before}
          <span className={styles.accent}>{heading.accent}</span>
          {heading.after}
        </h2>
        <p className={styles.body}>{contact.body}</p>
        <div className={styles.actions}>
          <Button href={contact.primary.href} magnetic>
            {contact.primary.label}
          </Button>
          <Button href={contact.secondary.href} variant="outlineInk">
            {contact.secondary.label}
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
