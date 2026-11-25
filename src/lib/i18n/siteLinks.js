// Hardcoded links in the site shell (utility row, mega menu "Često
// traženo", footer). The main navigation itself comes from the WordPress
// menu (lib/wp/menu.js); only what the design adds around it lives here.
//
// Paths come from old-routes.txt (the editors' task list), so they resolve
// once the pages exist in WordPress. TODO: every `TODO` entry is an unknown
// target — fill it in before launch; until then it renders obviously fake.

// Confirmed from the live WordPress main menu.
export const ENROLL_URL = "https://upisi.pfst.hr/";

const LINKS = {
  hr: {
    utility: [
      { label: "Webmail", href: "https://outlook.office.com/mail/" }, // TODO: webmail URL
      { label: "Raspored", href: "/nastava/studiranje/raspored" },
      { label: "Pristupačnost", href: "/fakultet/opcenito/digitalna-pristupacnost" },
    ],
    // Section-overview help card (design/reference/opcenito.html).
    help: {
      href: "/fakultet/opcenito/opci-podaci-kontakt",
      contacts: [
        { icon: "phone", label: "+385 (0)21 619 399" }, // TODO: dean's office phone
        { icon: "mail", label: "info@pfst.hr" }, // TODO: dean's office e-mail
      ],
    },
    frequent: [
      { label: "Raspored nastave", href: "/nastava/studiranje/raspored" },
      { label: "Ispitni rokovi", href: "/nastava/studiranje/ispitni-rokovi" },
      { label: "Upisi brucoša", href: "/fakultet/studentska-sluzba/upisi-prijediplomski-studij" },
      { label: "Obrasci i molbe", href: "/fakultet/studentska-sluzba/obrasci" },
    ],
    footer: {
      address: ["Ruđera Boškovića 37", "21000 Split, Hrvatska"],
      contact: [
        { label: "Telefon", href: "tel:+38521619399" }, // TODO: phone number
        { label: "E-mail", href: "mailto:info@pfst.hr" }, // TODO: student office e-mail
        { label: "Facebook", href: "https://www.facebook.com/pfst.hr" }, // TODO: Facebook page URL
      ],
      faculty: [
        { label: "O fakultetu", href: "/fakultet/opcenito" },
        { label: "Studiji", href: "/nastava/studiji" },
        { label: "Upisi", href: "/nastava/upisi" },
        { label: "Natječaji", href: "/novosti?kategorija=natjecaji" },
      ],
      students: [
        { label: "Raspored nastave", href: "/nastava/studiranje/raspored" },
        { label: "Ispitni rokovi", href: "/nastava/studiranje/ispitni-rokovi" },
        { label: "Konzultacije", href: "/nastava/studiranje/konzultacije" },
        { label: "Webmail", href: "/TODO-webmail" }, // TODO: webmail URL
      ],
    },
  },
  en: {
    utility: [
      { label: "Webmail", href: "https://outlook.office.com/mail/" }, // TODO: webmail URL
      { label: "Timetable", href: "/nastava/studiranje/raspored" }, // TODO: no English page yet
      {
        label: "Accessibility",
        href: "/en/faculty/general-information/digital-accessibility",
      },
    ],
    help: {
      href: "/en/faculty/general-information/general-information-and-contact",
      contacts: [
        { icon: "phone", label: "TODO phone" }, // TODO
        { icon: "mail", label: "TODO e-mail" }, // TODO
      ],
    },
    frequent: [
      { label: "Student services", href: "/en/faculty/student-services" },
      { label: "Forms", href: "/en/faculty/student-services/forms" },
      { label: "Erasmus+", href: "/en/cooperation/erasmus" },
      { label: "Contact", href: "/en/faculty/general-information/general-information-and-contact" },
    ],
    footer: {
      address: ["Ruđera Boškovića 37", "21000 Split, Croatia"],
      contact: [
        { label: "TODO phone", href: null }, // TODO: phone number
        { label: "TODO student office e-mail", href: null }, // TODO
        { label: "Facebook", href: "/TODO-facebook" }, // TODO: Facebook page URL
      ],
      faculty: [
        { label: "About the faculty", href: "/en/faculty" },
        { label: "General information", href: "/en/faculty/general-information" },
        { label: "Library", href: "/en/faculty/library" },
        { label: "Cooperation", href: "/en/cooperation" },
      ],
      students: [
        { label: "Student services", href: "/en/faculty/student-services" },
        { label: "Erasmus+", href: "/en/cooperation/erasmus" },
        { label: "Alumni", href: "/en/cooperation/alumni" },
        { label: "Webmail", href: "/TODO-webmail" }, // TODO: webmail URL
      ],
    },
  },
};

export function getSiteLinks(language) {
  return LINKS[language] ?? LINKS.hr;
}
