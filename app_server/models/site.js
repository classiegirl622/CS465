"use strict";

// Module Two's presentation model: navigation labels and per-page metadata.
// Persistent trip models will be added in later modules when MongoDB is introduced.
const pages = [
  { key: "index", label: "Home", href: "/" },
  { key: "travel", label: "Travel", href: "/travel" },
  { key: "rooms", label: "Rooms", href: "/rooms" },
  { key: "meals", label: "Meals", href: "/meals" },
  { key: "news", label: "News", href: "/news" },
  { key: "about", label: "About", href: "/about" },
  { key: "contact", label: "Contact", href: "/contact" }
];

function viewModel(activePage, extra = {}) {
  const found = pages.find((page) => page.key === activePage);
  return {
    siteName: "Travlr Getaways",
    pageTitle: found ? found.label : "Page Not Found",
    navigation: pages.map(({ key, label, href }) => ({
      label,
      href,
      isCurrent: key === activePage
    })),
    ...extra
  };
}

module.exports = { pages, viewModel };
