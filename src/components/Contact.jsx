import React from "react";
import "./Contact.scss";

// Importa todas as imagens de src/assets
const assets = import.meta.glob("/src/assets/*", { eager: true, as: "url" });
const imageByName = Object.fromEntries(
  Object.entries(assets).map(([path, url]) => [path.split("/").pop(), url])
);

export default function Contact() {
  const contacts = [
    {
      label: "Email",
      value: "caiocds1@gmail.com",
      link: "mailto:caiocds1@gmail.com",
      icon: "email.png" 
    },
    {
      label: "LinkedIn",
      value: "www.linkedin.com/in/caio-cohen-de-souza/",
      link: "https://www.linkedin.com/in/caio-cohen-de-souza/",
      icon: "linkedin.png"
    },
    {
      label: "Cellphone",
      value: "+55 (21) 99597-1212",
      link: "tel:+5521995971212",
      icon: "phone.png" 
    }
  ];

  return (
    <section className="contact-section" id="contact">
      <div className="contact-content">
        <h2 className="contact-title">Let’s Work Together</h2>
        <p className="contact-subtitle">
          Interested in collaborating or just want to say hi?  
          Feel free to reach out through any of the channels below.
        </p>

        <div className="contact-buttons">
          {contacts.map((c) => (
            <a
              key={c.label}
              href={c.link}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-btn"
            >
              <span className="contact-icon">
                {imageByName[c.icon] ? (
                  <img src={imageByName[c.icon]} alt={c.label} />
                ) : (
                  c.icon
                )}
              </span>
              <span className="contact-text">
                <strong>{c.label}</strong>
                <small>{c.value}</small>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
